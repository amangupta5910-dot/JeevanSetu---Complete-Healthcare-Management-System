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
      scheduledAt,
      duration,
      symptoms,
      notes,
      userId
    } = body

    // Validate required fields
    if (!patientName || !patientPhone || !patientEmail || !doctorId || !scheduledAt || !duration || !symptoms) {
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

    // Check for scheduling conflicts
    const consultationDate = new Date(scheduledAt)
    const endTime = new Date(consultationDate.getTime() + parseInt(duration) * 60000)

    const conflictingConsultation = await db.videoConsultation.findFirst({
      where: {
        doctorId,
        scheduledAt: {
          lt: endTime
        },
        AND: {
          scheduledAt: {
            gte: new Date(consultationDate.getTime() - parseInt(duration) * 60000)
          }
        },
        status: {
          in: ['REQUESTED', 'CONFIRMED']
        }
      }
    })

    if (conflictingConsultation) {
      return NextResponse.json(
        { error: 'Time slot not available' },
        { status: 409 }
      )
    }

    // Calculate consultation fee based on duration
    const baseFee = doctor.fee
    const durationMultiplier = duration === '15' ? 0.8 :
                             duration === '30' ? 1.0 :
                             duration === '45' ? 1.2 : 1.5
    const fee = Math.round(baseFee * durationMultiplier)

    // Generate meeting link (in a real app, this would use a video service API)
    const meetingLink = `https://meet.medicare.com/${Math.random().toString(36).substr(2, 9)}`

    // Create video consultation
    const consultation = await db.videoConsultation.create({
      data: {
        patientName,
        patientPhone,
        patientEmail,
        scheduledAt: consultationDate,
        duration: parseInt(duration),
        symptoms,
        notes,
        fee,
        meetingLink,
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
      consultation: {
        id: consultation.id,
        patientName: consultation.patientName,
        patientPhone: consultation.patientPhone,
        patientEmail: consultation.patientEmail,
        scheduledAt: consultation.scheduledAt,
        duration: consultation.duration,
        symptoms: consultation.symptoms,
        notes: consultation.notes,
        status: consultation.status,
        fee: consultation.fee,
        meetingLink: consultation.meetingLink,
        doctor: {
          id: consultation.doctor.id,
          name: consultation.doctor.name,
          specialization: consultation.doctor.specialization,
          experience: consultation.doctor.experience,
          fee: consultation.doctor.fee,
          rating: consultation.doctor.rating
        },
        hospital: {
          id: consultation.doctor.hospital.id,
          name: consultation.doctor.hospital.name,
          address: consultation.doctor.hospital.address,
          phone: consultation.doctor.hospital.phone
        }
      }
    })

  } catch (error) {
    console.error('Error booking video consultation:', error)
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
    const consultationId = searchParams.get('consultationId')
    const date = searchParams.get('date')

    if (consultationId) {
      // Get specific consultation
      const consultation = await db.videoConsultation.findUnique({
        where: { id: consultationId },
        include: {
          doctor: {
            include: {
              hospital: true
            }
          },
          user: true
        }
      })

      if (!consultation) {
        return NextResponse.json(
          { error: 'Consultation not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ consultation })
    }

    if (doctorId && date) {
      // Get available time slots for a doctor on a specific date
      const selectedDate = new Date(date)
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999))

      const consultations = await db.videoConsultation.findMany({
        where: {
          doctorId,
          scheduledAt: {
            gte: startOfDay,
            lte: endOfDay
          },
          status: {
            in: ['REQUESTED', 'CONFIRMED']
          }
        },
        select: {
          scheduledAt: true,
          duration: true
        }
      })

      // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
      const allSlots = []
      for (let hour = 9; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotTime = new Date(selectedDate)
          slotTime.setHours(hour, minute, 0, 0)
          allSlots.push(slotTime)
        }
      }

      // Filter out booked slots
      const availableSlots = allSlots.filter(slotTime => {
        return !consultations.some(consultation => {
          const consultationStart = new Date(consultation.scheduledAt)
          const consultationEnd = new Date(consultationStart.getTime() + consultation.duration * 60000)
          
          return slotTime >= consultationStart && slotTime < consultationEnd
        })
      })

      return NextResponse.json({ 
        availableSlots: availableSlots.map(slot => slot.toISOString())
      })
    }

    if (userId) {
      // Get user's consultations
      const consultations = await db.videoConsultation.findMany({
        where: { userId },
        include: {
          doctor: {
            include: {
              hospital: true
            }
          }
        },
        orderBy: { scheduledAt: 'desc' }
      })

      return NextResponse.json({ consultations })
    }

    if (doctorId) {
      // Get doctor's consultations
      const consultations = await db.videoConsultation.findMany({
        where: { doctorId },
        include: {
          user: true
        },
        orderBy: { scheduledAt: 'desc' }
      })

      return NextResponse.json({ consultations })
    }

    // Get all consultations (for admin)
    const consultations = await db.videoConsultation.findMany({
      include: {
        doctor: {
          include: {
            hospital: true
          }
        },
        user: true
      },
      orderBy: { scheduledAt: 'desc' }
    })

    return NextResponse.json({ consultations })

  } catch (error) {
    console.error('Error fetching video consultations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { consultationId, status, meetingLink, notes } = body

    if (!consultationId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update consultation
    const consultation = await db.videoConsultation.update({
      where: { id: consultationId },
      data: {
        status,
        meetingLink,
        notes
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
      consultation
    })

  } catch (error) {
    console.error('Error updating video consultation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const consultationId = searchParams.get('consultationId')

    if (!consultationId) {
      return NextResponse.json(
        { error: 'Missing consultation ID' },
        { status: 400 }
      )
    }

    await db.videoConsultation.delete({
      where: { id: consultationId }
    })

    return NextResponse.json({
      success: true,
      message: 'Consultation cancelled successfully'
    })

  } catch (error) {
    console.error('Error cancelling video consultation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}