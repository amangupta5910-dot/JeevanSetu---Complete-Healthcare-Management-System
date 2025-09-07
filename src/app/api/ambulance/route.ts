import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      patientName,
      patientPhone,
      pickupAddress,
      pickupLat,
      pickupLng,
      destination,
      destinationLat,
      destinationLng,
      emergencyType,
      ambulanceType,
      userId
    } = body

    // Validate required fields
    if (!patientName || !patientPhone || !pickupAddress || !emergencyType || !ambulanceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find available ambulance of the requested type
    const ambulance = await db.ambulance.findFirst({
      where: {
        type: ambulanceType,
        status: 'AVAILABLE'
      },
      include: {
        hospital: true
      }
    })

    if (!ambulance) {
      return NextResponse.json(
        { error: 'No available ambulance of the requested type' },
        { status: 404 }
      )
    }

    // Calculate estimated cost (simplified calculation)
    const baseCost = ambulanceType === 'BASIC' ? 500 : 
                    ambulanceType === 'ADVANCED' ? 1000 :
                    ambulanceType === 'ICU' ? 2000 : 800
    
    const distanceCost = pickupLat && pickupLng ? 10 : 0 // Simplified distance calculation
    const estimatedCost = baseCost + distanceCost

    // Create booking
    const booking = await db.ambulanceBooking.create({
      data: {
        patientName,
        patientPhone,
        pickupAddress,
        pickupLat,
        pickupLng,
        destination,
        destinationLat,
        destinationLng,
        emergencyType,
        status: 'REQUESTED',
        estimatedCost,
        userId,
        hospitalId: ambulance.hospitalId,
        ambulanceId: ambulance.id
      },
      include: {
        ambulance: {
          include: {
            hospital: true
          }
        },
        hospital: true
      }
    })

    // Update ambulance status
    await db.ambulance.update({
      where: { id: ambulance.id },
      data: { status: 'ON_DUTY' }
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        patientName: booking.patientName,
        patientPhone: booking.patientPhone,
        pickupAddress: booking.pickupAddress,
        destination: booking.destination,
        emergencyType: booking.emergencyType,
        status: booking.status,
        estimatedCost: booking.estimatedCost,
        ambulance: {
          id: booking.ambulance.id,
          vehicleNumber: booking.ambulance.vehicleNumber,
          driverName: booking.ambulance.driverName,
          driverPhone: booking.ambulance.driverPhone,
          type: booking.ambulance.type
        },
        hospital: {
          id: booking.hospital.id,
          name: booking.hospital.name,
          address: booking.hospital.address,
          phone: booking.hospital.phone
        }
      }
    })

  } catch (error) {
    console.error('Error booking ambulance:', error)
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
    const bookingId = searchParams.get('bookingId')

    if (bookingId) {
      // Get specific booking
      const booking = await db.ambulanceBooking.findUnique({
        where: { id: bookingId },
        include: {
          ambulance: true,
          hospital: true,
          user: true
        }
      })

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ booking })
    }

    if (userId) {
      // Get user's bookings
      const bookings = await db.ambulanceBooking.findMany({
        where: { userId },
        include: {
          ambulance: true,
          hospital: true
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ bookings })
    }

    // Get all bookings (for admin/staff)
    const bookings = await db.ambulanceBooking.findMany({
      include: {
        ambulance: true,
        hospital: true,
        user: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ bookings })

  } catch (error) {
    console.error('Error fetching ambulance bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, status, ambulanceId, estimatedTime, actualCost } = body

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update booking
    const booking = await db.ambulanceBooking.update({
      where: { id: bookingId },
      data: {
        status,
        ambulanceId,
        estimatedTime,
        actualCost
      },
      include: {
        ambulance: true,
        hospital: true,
        user: true
      }
    })

    // Update ambulance status based on booking status
    if (ambulanceId) {
      let ambulanceStatus = 'AVAILABLE'
      switch (status) {
        case 'ACCEPTED':
        case 'ON_THE_WAY':
        case 'PICKED_UP':
          ambulanceStatus = 'ON_DUTY'
          break
        case 'REACHED_HOSPITAL':
        case 'COMPLETED':
          ambulanceStatus = 'AVAILABLE'
          break
        case 'CANCELLED':
          ambulanceStatus = 'AVAILABLE'
          break
      }

      await db.ambulance.update({
        where: { id: ambulanceId },
        data: { status: ambulanceStatus }
      })
    }

    return NextResponse.json({
      success: true,
      booking
    })

  } catch (error) {
    console.error('Error updating ambulance booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}