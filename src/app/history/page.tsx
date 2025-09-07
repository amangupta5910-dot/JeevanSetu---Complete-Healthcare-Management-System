"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Ambulance, 
  User, 
  Video, 
  Pill, 
  Building,
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  Truck,
  Stethoscope,
  Eye,
  Download
} from "lucide-react"
import { format } from "date-fns"

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration - in real app this would come from API
  const [bookings, setBookings] = useState({
    ambulance: [
      {
        id: "AMB001",
        patientName: "Rahul Sharma",
        pickupAddress: "123 Main Street, Delhi",
        destination: "Apollo Hospital",
        emergencyType: "Medical Emergency",
        status: "COMPLETED",
        bookingDate: new Date("2024-01-15T10:30:00"),
        estimatedCost: 1500,
        actualCost: 1450,
        driverName: "Rajesh Kumar",
        driverPhone: "+91 98765 43210",
        ambulanceType: "ADVANCED"
      },
      {
        id: "AMB002", 
        patientName: "Priya Singh",
        pickupAddress: "456 Park Avenue, Mumbai",
        destination: "Fortis Hospital",
        emergencyType: "Accident/Trauma",
        status: "CANCELLED",
        bookingDate: new Date("2024-01-20T14:15:00"),
        estimatedCost: 2000,
        driverName: "Amit Patel",
        driverPhone: "+91 87654 32109",
        ambulanceType: "ICU"
      }
    ],
    doctor: [
      {
        id: "DOC001",
        patientName: "Amit Kumar",
        doctorName: "Dr. Priya Singh",
        specialization: "Cardiologist",
        hospital: "Apollo Hospital",
        date: new Date("2024-01-18T11:00:00"),
        timeSlot: "11:00 AM",
        status: "COMPLETED",
        fee: 1500,
        symptoms: "Chest pain and breathing difficulty",
        notes: "Prescribed medicines and advised follow-up after 2 weeks"
      },
      {
        id: "DOC002",
        patientName: "Sunita Reddy",
        doctorName: "Dr. Amit Patel", 
        specialization: "Orthopedic",
        hospital: "Max Hospital",
        date: new Date("2024-01-25T15:30:00"),
        timeSlot: "03:30 PM",
        status: "CONFIRMED",
        fee: 1200,
        symptoms: "Knee pain and swelling",
        notes: "Upcoming appointment"
      }
    ],
    video: [
      {
        id: "VID001",
        patientName: "Vikram Mehta",
        doctorName: "Dr. Sunita Reddy",
        specialization: "Neurologist",
        hospital: "Fortis Hospital",
        scheduledAt: new Date("2024-01-22T16:00:00"),
        duration: 30,
        status: "COMPLETED",
        fee: 2000,
        symptoms: "Headache and dizziness",
        meetingLink: "https://meet.medicare.com/abc123",
        notes: "Diagnosed with migraine, prescribed treatment"
      },
      {
        id: "VID002",
        patientName: "Anita Sharma",
        doctorName: "Dr. Rajesh Sharma",
        specialization: "Dermatologist", 
        hospital: "Columbia Asia",
        scheduledAt: new Date("2024-01-28T10:00:00"),
        duration: 45,
        status: "CONFIRMED",
        fee: 1800,
        symptoms: "Skin rash and itching",
        meetingLink: "https://meet.medicare.com/def456",
        notes: "Upcoming video consultation"
      }
    ],
    medicine: [
      {
        id: "MED001",
        patientName: "Mohammed Ali",
        deliveryAddress: "786 Colony, Delhi",
        status: "DELIVERED",
        orderDate: new Date("2024-01-16T09:00:00"),
        totalAmount: 850,
        deliveryFee: 50,
        medicines: [
          { name: "Paracetamol 500mg", quantity: 2, price: 90 },
          { name: "Amoxicillin 500mg", quantity: 1, price: 240 },
          { name: "Ibuprofen 400mg", quantity: 1, price: 170 }
        ],
        notes: "Delivered on time"
      },
      {
        id: "MED002",
        patientName: "Fatima Begum",
        deliveryAddress: "456 Street, Mumbai", 
        status: "OUT_FOR_DELIVERY",
        orderDate: new Date("2024-01-26T14:00:00"),
        totalAmount: 1200,
        deliveryFee: 0,
        medicines: [
          { name: "Vitamin D3 1000 IU", quantity: 2, price: 300 },
          { name: "Calcium Carbonate", quantity: 1, price: 150 },
          { name: "Multivitamin", quantity: 1, price: 450 }
        ],
        notes: "Expected delivery within 2 hours"
      }
    ]
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "OUT_FOR_DELIVERY":
      case "ON_THE_WAY":
        return "bg-blue-100 text-blue-800"
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getAllBookings = () => {
    return [
      ...bookings.ambulance.map(b => ({ ...b, type: 'ambulance' })),
      ...bookings.doctor.map(b => ({ ...b, type: 'doctor' })),
      ...bookings.video.map(b => ({ ...b, type: 'video' })),
      ...bookings.medicine.map(b => ({ ...b, type: 'medicine' }))
    ].sort((a, b) => {
      const dateA = a.bookingDate || a.orderDate || a.scheduledAt || a.date
      const dateB = b.bookingDate || b.orderDate || b.scheduledAt || b.date
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
  }

  const getBookingsByType = (type: string) => {
    switch (type) {
      case 'ambulance':
        return bookings.ambulance
      case 'doctor':
        return bookings.doctor
      case 'video':
        return bookings.video
      case 'medicine':
        return bookings.medicine
      default:
        return getAllBookings()
    }
  }

  const renderAmbulanceBooking = (booking: any) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Ambulance className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Ambulance Booking</h3>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.replace("_", " ")}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-medium">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Patient:</span>
            <span className="font-medium">{booking.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pickup:</span>
            <span className="font-medium">{booking.pickupAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Destination:</span>
            <span className="font-medium">{booking.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Emergency Type:</span>
            <span className="font-medium">{booking.emergencyType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ambulance Type:</span>
            <span className="font-medium">{booking.ambulanceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Driver:</span>
            <span className="font-medium">{booking.driverName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {format(new Date(booking.bookingDate), "PPP p")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cost:</span>
            <span className="font-medium">₹{booking.actualCost || booking.estimatedCost}</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="mr-1 h-3 w-3" />
            View Details
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Download className="mr-1 h-3 w-3" />
            Download Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderDoctorBooking = (booking: any) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Doctor Appointment</h3>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.replace("_", " ")}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-medium">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Patient:</span>
            <span className="font-medium">{booking.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-medium">{booking.doctorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Specialization:</span>
            <span className="font-medium">{booking.specialization}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hospital:</span>
            <span className="font-medium">{booking.hospital}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {format(new Date(booking.date), "PPP")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{booking.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fee:</span>
            <span className="font-medium">₹{booking.fee}</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="mr-1 h-3 w-3" />
            View Details
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Download className="mr-1 h-3 w-3" />
            Download Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderVideoBooking = (booking: any) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Video Consultation</h3>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.replace("_", " ")}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-medium">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Patient:</span>
            <span className="font-medium">{booking.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-medium">{booking.doctorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Specialization:</span>
            <span className="font-medium">{booking.specialization}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hospital:</span>
            <span className="font-medium">{booking.hospital}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {format(new Date(booking.scheduledAt), "PPP p")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{booking.duration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fee:</span>
            <span className="font-medium">₹{booking.fee}</span>
          </div>
        </div>
        
        {booking.status === "CONFIRMED" && (
          <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
            <Video className="mr-1 h-3 w-3" />
            Join Consultation
          </Button>
        )}
        
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="mr-1 h-3 w-3" />
            View Details
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Download className="mr-1 h-3 w-3" />
            Download Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderMedicineBooking = (booking: any) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold">Medicine Order</h3>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.replace("_", " ")}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Patient:</span>
            <span className="font-medium">{booking.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Address:</span>
            <span className="font-medium">{booking.deliveryAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">
              {format(new Date(booking.orderDate), "PPP p")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium">₹{booking.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee:</span>
            <span className="font-medium">₹{booking.deliveryFee}</span>
          </div>
          <div className="mt-2">
            <span className="text-gray-600">Medicines:</span>
            <div className="mt-1 space-y-1">
              {booking.medicines.map((med: any, index: number) => (
                <div key={index} className="flex justify-between text-xs">
                  <span>{med.name} x{med.quantity}</span>
                  <span>₹{med.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="mr-1 h-3 w-3" />
            View Details
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Download className="mr-1 h-3 w-3" />
            Download Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderBooking = (booking: any) => {
    switch (booking.type) {
      case 'ambulance':
        return renderAmbulanceBooking(booking)
      case 'doctor':
        return renderDoctorBooking(booking)
      case 'video':
        return renderVideoBooking(booking)
      case 'medicine':
        return renderMedicineBooking(booking)
      default:
        return null
    }
  }

  const getStats = () => {
    const all = getAllBookings()
    return {
      total: all.length,
      completed: all.filter(b => 
        ['COMPLETED', 'DELIVERED'].includes(b.status)
      ).length,
      upcoming: all.filter(b => 
        ['CONFIRMED', 'REQUESTED', 'OUT_FOR_DELIVERY'].includes(b.status)
      ).length,
      cancelled: all.filter(b => 
        ['CANCELLED'].includes(b.status)
      ).length
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View all your healthcare service bookings and history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.upcoming}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="ambulance">Ambulance ({bookings.ambulance.length})</TabsTrigger>
            <TabsTrigger value="doctor">Doctor ({bookings.doctor.length})</TabsTrigger>
            <TabsTrigger value="video">Video ({bookings.video.length})</TabsTrigger>
            <TabsTrigger value="medicine">Medicine ({bookings.medicine.length})</TabsTrigger>
            <TabsTrigger value="current">Current ({stats.upcoming})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAllBookings().map((booking) => (
                <div key={`${booking.type}-${booking.id}`}>
                  {renderBooking(booking)}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ambulance">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.ambulance.map((booking) => (
                <div key={booking.id}>
                  {renderAmbulanceBooking(booking)}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="doctor">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.doctor.map((booking) => (
                <div key={booking.id}>
                  {renderDoctorBooking(booking)}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="video">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.video.map((booking) => (
                <div key={booking.id}>
                  {renderVideoBooking(booking)}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="medicine">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.medicine.map((booking) => (
                <div key={booking.id}>
                  {renderMedicineBooking(booking)}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="current">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAllBookings()
                .filter(booking => ['CONFIRMED', 'REQUESTED', 'OUT_FOR_DELIVERY'].includes(booking.status))
                .map((booking) => (
                  <div key={`${booking.type}-${booking.id}`}>
                    {renderBooking(booking)}
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* No Bookings */}
        {getBookingsByType(activeTab).length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">
                {activeTab === "current" 
                  ? "You don't have any upcoming bookings."
                  : "You haven't made any bookings yet."
                }
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Book a Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}