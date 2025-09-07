import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'all', 'ambulance', 'doctor', 'video', 'medicine'
    const status = searchParams.get('status') // 'completed', 'upcoming', 'cancelled'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch all types of bookings for the user
    const [ambulanceBookings, doctorAppointments, videoConsultations, medicineOrders] = await Promise.all([
      db.ambulanceBooking.findMany({
        where: { userId },
        include: {
          ambulance: true,
          hospital: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.doctorAppointment.findMany({
        where: { userId },
        include: {
          doctor: {
            include: {
              hospital: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.videoConsultation.findMany({
        where: { userId },
        include: {
          doctor: {
            include: {
              hospital: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.medicineOrder.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              medicine: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    // Transform data into consistent format
    const transformAmbulanceBooking = (booking: any) => ({
      id: booking.id,
      type: 'ambulance',
      patientName: booking.patientName,
      pickupAddress: booking.pickupAddress,
      destination: booking.destination,
      emergencyType: booking.emergencyType,
      status: booking.status,
      bookingDate: booking.createdAt,
      estimatedCost: booking.estimatedCost,
      actualCost: booking.actualCost,
      driverName: booking.ambulance?.driverName,
      driverPhone: booking.ambulance?.driverPhone,
      ambulanceType: booking.ambulance?.type,
      hospital: booking.hospital
    })

    const transformDoctorAppointment = (appointment: any) => ({
      id: appointment.id,
      type: 'doctor',
      patientName: appointment.patientName,
      doctorName: appointment.doctor.name,
      specialization: appointment.doctor.specialization,
      hospital: appointment.doctor.hospital.name,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      status: appointment.status,
      fee: appointment.fee,
      symptoms: appointment.symptoms,
      notes: appointment.notes
    })

    const transformVideoConsultation = (consultation: any) => ({
      id: consultation.id,
      type: 'video',
      patientName: consultation.patientName,
      doctorName: consultation.doctor.name,
      specialization: consultation.doctor.specialization,
      hospital: consultation.doctor.hospital.name,
      scheduledAt: consultation.scheduledAt,
      duration: consultation.duration,
      status: consultation.status,
      fee: consultation.fee,
      symptoms: consultation.symptoms,
      meetingLink: consultation.meetingLink,
      notes: consultation.notes
    })

    const transformMedicineOrder = (order: any) => ({
      id: order.id,
      type: 'medicine',
      patientName: order.patientName,
      deliveryAddress: order.deliveryAddress,
      status: order.status,
      orderDate: order.createdAt,
      totalAmount: order.totalAmount,
      deliveryFee: order.deliveryFee,
      medicines: order.orderItems.map((item: any) => ({
        name: item.medicine.name,
        quantity: item.quantity,
        price: item.price
      })),
      notes: order.notes
    })

    // Combine all bookings
    let allBookings = [
      ...ambulanceBookings.map(transformAmbulanceBooking),
      ...doctorAppointments.map(transformDoctorAppointment),
      ...videoConsultations.map(transformVideoConsultation),
      ...medicineOrders.map(transformMedicineOrder)
    ]

    // Filter by type if specified
    if (type && type !== 'all') {
      allBookings = allBookings.filter(booking => booking.type === type)
    }

    // Filter by status if specified
    if (status) {
      const statusMap: Record<string, string[]> = {
        'completed': ['COMPLETED', 'DELIVERED'],
        'upcoming': ['REQUESTED', 'CONFIRMED', 'ACCEPTED', 'ON_THE_WAY', 'OUT_FOR_DELIVERY', 'PREPARING'],
        'cancelled': ['CANCELLED']
      }

      const relevantStatuses = statusMap[status] || [status.toUpperCase()]
      allBookings = allBookings.filter(booking => 
        relevantStatuses.includes(booking.status)
      )
    }

    // Sort by date (newest first)
    allBookings.sort((a, b) => {
      const dateA = a.bookingDate || a.orderDate || a.scheduledAt || a.date
      const dateB = b.bookingDate || b.orderDate || b.scheduledAt || b.date
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })

    // Calculate statistics
    const stats = {
      total: allBookings.length,
      completed: allBookings.filter(b => 
        ['COMPLETED', 'DELIVERED'].includes(b.status)
      ).length,
      upcoming: allBookings.filter(b => 
        ['REQUESTED', 'CONFIRMED', 'ACCEPTED', 'ON_THE_WAY', 'OUT_FOR_DELIVERY', 'PREPARING'].includes(b.status)
      ).length,
      cancelled: allBookings.filter(b => 
        ['CANCELLED'].includes(b.status)
      ).length,
      byType: {
        ambulance: ambulanceBookings.length,
        doctor: doctorAppointments.length,
        video: videoConsultations.length,
        medicine: medicineOrders.length
      }
    }

    return NextResponse.json({
      success: true,
      bookings: allBookings,
      stats
    })

  } catch (error) {
    console.error('Error fetching booking history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}