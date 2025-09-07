import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      patientName,
      patientPhone,
      patientEmail,
      doctorId,
      date,
      timeSlot,
      symptoms,
      notes,
      userId
    } = body

    // Validate required fields
    if (!patientName || !patientPhone || !doctorId || !date || !timeSlot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if doctor exists
    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: { hospital: true }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Check if the time slot is available
    const existingAppointment = await db.doctorAppointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        timeSlot,
        status: {
          in: ['REQUESTED', 'CONFIRMED']
        }
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Time slot not available' },
        { status: 409 }
      )
    }

    // Create appointment
    const appointment = await db.doctorAppointment.create({
      data: {
        patientName,
        patientPhone,
        patientEmail,
        date: new Date(date),
        timeSlot,
        symptoms,
        notes,
        fee: doctor.fee,
        status: 'REQUESTED',
        userId,
        doctorId
      },
      include: {
        doctor: {
          include: {
            hospital: true
          }
        },
        user: true
      }
    })

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        patientName: appointment.patientName,
        patientPhone: appointment.patientPhone,
        patientEmail: appointment.patientEmail,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        symptoms: appointment.symptoms,
        notes: appointment.notes,
        status: appointment.status,
        fee: appointment.fee,
        doctor: {
          id: appointment.doctor.id,
          name: appointment.doctor.name,
          specialization: appointment.doctor.specialization,
          experience: appointment.doctor.experience,
          fee: appointment.doctor.fee,
          rating: appointment.doctor.rating
        },
        hospital: {
          id: appointment.doctor.hospital.id,
          name: appointment.doctor.hospital.name,
          address: appointment.doctor.hospital.address,
          phone: appointment.doctor.hospital.phone
        }
      }
    })

  } catch (error) {
    console.error('Error booking doctor appointment:', error)
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
    const doctorId = searchParams.get('doctorId')
    const appointmentId = searchParams.get('appointmentId')
    const date = searchParams.get('date')

    if (appointmentId) {
      // Get specific appointment
      const appointment = await db.doctorAppointment.findUnique({
        where: { id: appointmentId },
        include: {
          doctor: {
            include: {
              hospital: true
            }
          },
          user: true
        }
      })

      if (!appointment) {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ appointment })
    }

    if (doctorId && date) {
      // Get available time slots for a doctor on a specific date
      const appointments = await db.doctorAppointment.findMany({
        where: {
          doctorId,
          date: new Date(date),
          status: {
            in: ['REQUESTED', 'CONFIRMED']
          }
        },
        select: {
          timeSlot: true
        }
      })

      const bookedSlots = appointments.map(app => app.timeSlot)
      const allSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
      ]

      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot))

      return NextResponse.json({ availableSlots })
    }

    if (userId) {
      // Get user's appointments
      const appointments = await db.doctorAppointment.findMany({
        where: { userId },
        include: {
          doctor: {
            include: {
              hospital: true
            }
          }
        },
        orderBy: { date: 'desc' }
      })

      return NextResponse.json({ appointments })
    }

    if (doctorId) {
      // Get doctor's appointments
      const appointments = await db.doctorAppointment.findMany({
        where: { doctorId },
        include: {
          user: true
        },
        orderBy: { date: 'desc' }
      })

      return NextResponse.json({ appointments })
    }

    // Get all appointments (for admin)
    const appointments = await db.doctorAppointment.findMany({
      include: {
        doctor: {
          include: {
            hospital: true
          }
        },
        user: true
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ appointments })

  } catch (error) {
    console.error('Error fetching doctor appointments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, status, notes, fee } = body

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update appointment
    const appointment = await db.doctorAppointment.update({
      where: { id: appointmentId },
      data: {
        status,
        notes,
        fee
      },
      include: {
        doctor: {
          include: {
            hospital: true
          }
        },
        user: true
      }
    })

    return NextResponse.json({
      success: true,
      appointment
    })

  } catch (error) {
    console.error('Error updating doctor appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('appointmentId')

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Missing appointment ID' },
        { status: 400 }
      )
    }

    await db.doctorAppointment.delete({
      where: { id: appointmentId }
    })

    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully'
    })

  } catch (error) {
    console.error('Error cancelling doctor appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}