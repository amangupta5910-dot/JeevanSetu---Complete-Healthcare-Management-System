import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Hospitals
  const hospitals = await Promise.all([
    prisma.hospital.create({
      data: {
        name: "Apollo Hospital",
        address: "Indraprastha Apollo Hospitals, Sarita Vihar, Delhi - 110076",
        phone: "+91 11 2692 5801",
        email: "info@apollohospitals.com",
        latitude: 28.5512,
        longitude: 77.2921,
        description: "Multi-specialty tertiary care hospital with world-class facilities",
        rating: 4.8,
        verified: true
      }
    }),
    prisma.hospital.create({
      data: {
        name: "Fortis Hospital",
        address: "Fortis Escorts Heart Institute, Okhla Road, New Delhi - 110025",
        phone: "+91 11 4289 0000",
        email: "info@fortishealthcare.com",
        latitude: 28.5612,
        longitude: 77.2721,
        description: "Leading cardiac care hospital with advanced treatment facilities",
        rating: 4.7,
        verified: true
      }
    }),
    prisma.hospital.create({
      data: {
        name: "Max Hospital",
        address: "Max Super Speciality Hospital, Saket, New Delhi - 110017",
        phone: "+91 11 4055 4055",
        email: "info@maxhealthcare.com",
        latitude: 28.5295,
        longitude: 77.2167,
        description: "Comprehensive healthcare with advanced medical technology",
        rating: 4.6,
        verified: true
      }
    })
  ])

  console.log(`✅ Created ${hospitals.length} hospitals`)

  // Create Doctors
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: "Dr. Rajesh Sharma",
        email: "rajesh.sharma@apollohospital.com",
        phone: "+91 98100 12345",
        specialization: "Cardiologist",
        experience: 15,
        fee: 1500,
        rating: 4.8,
        verified: true,
        hospitalId: hospitals[0].id
      }
    }),
    prisma.doctor.create({
      data: {
        name: "Dr. Priya Singh",
        email: "priya.singh@fortishospital.com",
        phone: "+91 98100 23456",
        specialization: "Neurologist",
        experience: 12,
        fee: 2000,
        rating: 4.9,
        verified: true,
        hospitalId: hospitals[1].id
      }
    }),
    prisma.doctor.create({
      data: {
        name: "Dr. Amit Patel",
        email: "amit.patel@maxhospital.com",
        phone: "+91 98100 34567",
        specialization: "Orthopedic",
        experience: 10,
        fee: 1200,
        rating: 4.7,
        verified: true,
        hospitalId: hospitals[2].id
      }
    })
  ])

  console.log(`✅ Created ${doctors.length} doctors`)

  // Create Ambulances
  const ambulances = await Promise.all([
    prisma.ambulance.create({
      data: {
        vehicleNumber: "DL-01-AB-1234",
        type: "BASIC",
        driverName: "Rajesh Kumar",
        driverPhone: "+91 98765 43210",
        status: "AVAILABLE",
        latitude: 28.5512,
        longitude: 77.2921,
        hospitalId: hospitals[0].id
      }
    }),
    prisma.ambulance.create({
      data: {
        vehicleNumber: "DL-01-AB-1235",
        type: "ADVANCED",
        driverName: "Suresh Singh",
        driverPhone: "+91 98765 43211",
        status: "AVAILABLE",
        latitude: 28.5612,
        longitude: 77.2721,
        hospitalId: hospitals[1].id
      }
    }),
    prisma.ambulance.create({
      data: {
        vehicleNumber: "DL-01-AB-1236",
        type: "ICU",
        driverName: "Mahesh Patel",
        driverPhone: "+91 98765 43212",
        status: "AVAILABLE",
        latitude: 28.5295,
        longitude: 77.2167,
        hospitalId: hospitals[2].id
      }
    })
  ])

  console.log(`✅ Created ${ambulances.length} ambulances`)

  // Create Medicines
  const medicines = await Promise.all([
    prisma.medicine.create({
      data: {
        name: "Paracetamol 500mg",
        description: "Fever and pain relief tablets",
        price: 45,
        stock: 100,
        requiresPrescription: false,
        category: "Pain Relief",
        discount: 10,
        hospitalId: hospitals[0].id
      }
    }),
    prisma.medicine.create({
      data: {
        name: "Amoxicillin 500mg",
        description: "Antibiotic capsules",
        price: 120,
        stock: 50,
        requiresPrescription: true,
        category: "Antibiotics",
        discount: 0,
        hospitalId: hospitals[1].id
      }
    }),
    prisma.medicine.create({
      data: {
        name: "Ibuprofen 400mg",
        description: "Anti-inflammatory tablets",
        price: 85,
        stock: 75,
        requiresPrescription: false,
        category: "Pain Relief",
        discount: 15,
        hospitalId: hospitals[2].id
      }
    })
  ])

  console.log(`✅ Created ${medicines.length} medicines`)

  // Create Sample Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "patient@example.com",
        name: "John Doe",
        phone: "+91 98765 43210",
        address: "123 Main Street, Delhi",
        role: "PATIENT"
      }
    }),
    prisma.user.create({
      data: {
        email: "doctor@example.com",
        name: "Dr. Smith",
        phone: "+91 98765 43211",
        address: "456 Doctor Lane, Delhi",
        role: "DOCTOR"
      }
    })
  ])

  console.log(`✅ Created ${users.length} users`)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })