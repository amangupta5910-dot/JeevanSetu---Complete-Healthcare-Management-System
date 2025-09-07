import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      patientName,
      patientPhone,
      deliveryAddress,
      orderItems,
      prescription,
      notes,
      userId
    } = body

    // Validate required fields
    if (!patientName || !patientPhone || !deliveryAddress || !orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate total amount and validate stock
    let totalAmount = 0
    const deliveryFee = totalAmount > 500 ? 0 : 50
    
    for (const item of orderItems) {
      // Check if medicine exists and has sufficient stock
      const medicine = await db.medicine.findUnique({
        where: { id: item.medicineId }
      })

      if (!medicine) {
        return NextResponse.json(
          { error: `Medicine with ID ${item.medicineId} not found` },
          { status: 404 }
        )
      }

      if (medicine.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}` },
          { status: 400 }
        )
      }

      // Check if prescription is required
      if (medicine.requiresPrescription && !prescription) {
        return NextResponse.json(
          { error: `Prescription required for ${medicine.name}` },
          { status: 400 }
        )
      }

      const discountedPrice = medicine.price * (1 - (medicine.discount || 0) / 100)
      totalAmount += discountedPrice * item.quantity
    }

    totalAmount += deliveryFee

    // Create order
    const order = await db.medicineOrder.create({
      data: {
        patientName,
        patientPhone,
        deliveryAddress,
        status: 'REQUESTED',
        totalAmount,
        deliveryFee,
        userId
      }
    })

    // Create order items and update stock
    for (const item of orderItems) {
      const medicine = await db.medicine.findUnique({
        where: { id: item.medicineId }
      })

      if (medicine) {
        const discountedPrice = medicine.price * (1 - (medicine.discount || 0) / 100)
        
        await db.medicineOrderItem.create({
          data: {
            quantity: item.quantity,
            price: discountedPrice,
            medicineId: item.medicineId,
            orderId: order.id
          }
        })

        // Update medicine stock
        await db.medicine.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }
    }

    // Get the complete order with items
    const completeOrder = await db.medicineOrder.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            medicine: true
          }
        },
        user: true
      }
    })

    return NextResponse.json({
      success: true,
      order: completeOrder
    })

  } catch (error) {
    console.error('Error creating medicine order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const orderId = searchParams.get('orderId')
    const status = searchParams.get('status')

    if (orderId) {
      // Get specific order
      const order = await db.medicineOrder.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              medicine: true
            }
          },
          user: true
        }
      })

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ order })
    }

    if (userId) {
      // Get user's orders
      const whereClause: any = { userId }
      if (status) {
        whereClause.status = status
      }

      const orders = await db.medicineOrder.findMany({
        where: whereClause,
        include: {
          orderItems: {
            include: {
              medicine: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ orders })
    }

    // Get all orders (for admin/pharmacy staff)
    const whereClause: any = {}
    if (status) {
      whereClause.status = status
    }

    const orders = await db.medicineOrder.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            medicine: true
          }
        },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('Error fetching medicine orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update order status
    const order = await db.medicineOrder.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: {
          include: {
            medicine: true
          }
        },
        user: true
      }
    })

    // If order is cancelled, restore stock
    if (status === 'CANCELLED') {
      for (const item of order.orderItems) {
        await db.medicine.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      order
    })

  } catch (error) {
    console.error('Error updating medicine order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      )
    }

    // Get order items to restore stock
    const order = await db.medicineOrder.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true
      }
    })

    if (order) {
      // Restore stock for each item
      for (const item of order.orderItems) {
        await db.medicine.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }

      // Delete order items
      await db.medicineOrderItem.deleteMany({
        where: { orderId: orderId }
      })

      // Delete order
      await db.medicineOrder.delete({
        where: { id: orderId }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully'
    })

  } catch (error) {
    console.error('Error cancelling medicine order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}