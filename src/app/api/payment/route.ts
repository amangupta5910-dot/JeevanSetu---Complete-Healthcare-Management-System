import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      paymentMethod,
      orderId,
      serviceType,
      userId,
      patientDetails
    } = body

    // Validate required fields
    if (!amount || !paymentMethod || !orderId || !serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        amount,
        currency: 'INR',
        paymentMethod,
        orderId,
        serviceType,
        status: 'PENDING',
        userId,
        patientDetails: patientDetails || {}
      }
    })

    // Simulate payment processing (in real app, integrate with payment gateway)
    let paymentStatus = 'SUCCESS'
    let transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // For demo purposes, let's simulate some failures
    if (Math.random() < 0.1) { // 10% failure rate for demo
      paymentStatus = 'FAILED'
      transactionId = null
    }

    // Update payment status
    const updatedPayment = await db.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus,
        transactionId,
        processedAt: new Date()
      }
    })

    // Update the corresponding order status
    if (paymentStatus === 'SUCCESS') {
      switch (serviceType) {
        case 'DOCTOR_APPOINTMENT':
          await db.doctorAppointment.update({
            where: { id: orderId },
            data: { paymentStatus: 'SUCCESS' }
          })
          break
        case 'VIDEO_CONSULTATION':
          await db.videoConsultation.update({
            where: { id: orderId },
            data: { paymentStatus: 'SUCCESS' }
          })
          break
        case 'MEDICINE_ORDER':
          await db.medicineOrder.update({
            where: { id: orderId },
            data: { paymentStatus: 'SUCCESS' }
          })
          break
        case 'AMBULANCE_BOOKING':
          await db.ambulanceBooking.update({
            where: { id: orderId },
            data: { paymentStatus: 'SUCCESS' }
          })
          break
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: updatedPayment.id,
        amount: updatedPayment.amount,
        currency: updatedPayment.currency,
        paymentMethod: updatedPayment.paymentMethod,
        status: updatedPayment.status,
        transactionId: updatedPayment.transactionId,
        orderId: updatedPayment.orderId,
        serviceType: updatedPayment.serviceType
      }
    })

  } catch (error) {
    console.error('Error processing payment:', error)
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
    const paymentId = searchParams.get('paymentId')
    const orderId = searchParams.get('orderId')

    if (paymentId) {
      // Get specific payment
      const payment = await db.payment.findUnique({
        where: { id: paymentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      if (!payment) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ payment })
    }

    if (orderId) {
      // Get payments for a specific order
      const payments = await db.payment.findMany({
        where: { orderId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ payments })
    }

    if (userId) {
      // Get user's payment history
      const payments = await db.payment.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ payments })
    }

    // Get all payments (for admin)
    const payments = await db.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ payments })

  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, status, transactionId } = body

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update payment
    const payment = await db.payment.update({
      where: { id: paymentId },
      data: {
        status,
        transactionId: transactionId || payment.transactionId,
        processedAt: status !== 'PENDING' ? new Date() : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Update the corresponding order status
    if (status === 'SUCCESS') {
      switch (payment.serviceType) {
        case 'DOCTOR_APPOINTMENT':
          await db.doctorAppointment.update({
            where: { id: payment.orderId },
            data: { paymentStatus: 'SUCCESS' }
          })
          break
        case 'VIDEO_CONSULTATION':
          await db.videoConsultation.update({
            where: { id: payment.orderId },
            data: { paymentStatus: 'SUCCESS' }
          })
          break
        case 'MEDICINE_ORDER':
          await db.medicineOrder.update({
            where: { id: payment.orderId },
            data: { paymentStatus: 'SUCCESS' }
          })
          break
        case 'AMBULANCE_BOOKING':
          await db.ambulanceBooking.update({
            where: { id: payment.orderId },
            data: { paymentStatus: 'SUCCESS' }
          })
          break
      }
    }

    return NextResponse.json({
      success: true,
      payment
    })

  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}