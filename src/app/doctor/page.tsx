"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { 
  User, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon,
  Clock,
  Star,
  MapPin,
  Stethoscope,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"

export default function DoctorAppointment() {
  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    doctorId: "",
    date: null as Date | null,
    timeSlot: "",
    symptoms: "",
    notes: ""
  })
  
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "confirmed" | "searching">("searching")
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  const doctors = [
    {
      id: "1",
      name: "Dr. Rajesh Sharma",
      specialization: "Cardiologist",
      experience: 15,
      fee: 1500,
      rating: 4.8,
      hospital: "Apollo Hospital",
      hospitalAddress: "Delhi",
      image: "/api/placeholder/100/100",
      available: true
    },
    {
      id: "2",
      name: "Dr. Priya Singh",
      specialization: "Neurologist",
      experience: 12,
      fee: 2000,
      rating: 4.9,
      hospital: "Fortis Hospital",
      hospitalAddress: "Mumbai",
      image: "/api/placeholder/100/100",
      available: true
    },
    {
      id: "3",
      name: "Dr. Amit Patel",
      specialization: "Orthopedic",
      experience: 10,
      fee: 1200,
      rating: 4.7,
      hospital: "Max Hospital",
      hospitalAddress: "Bangalore",
      image: "/api/placeholder/100/100",
      available: false
    },
    {
      id: "4",
      name: "Dr. Sunita Reddy",
      specialization: "Gynecologist",
      experience: 18,
      fee: 1800,
      rating: 4.9,
      hospital: "Columbia Asia",
      hospitalAddress: "Chennai",
      image: "/api/placeholder/100/100",
      available: true
    }
  ]

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ]

  const specializations = [
    "Cardiologist", "Neurologist", "Orthopedic", "Gynecologist",
    "Pediatrician", "Dermatologist", "ENT Specialist", "General Physician"
  ]

  const handleInputChange = (field: string, value: any) => {
    setAppointmentData(prev => ({ ...prev, [field]: value }))
  }

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor)
    handleInputChange("doctorId", doctor.id)
    // Simulate available time slots
    setAvailableSlots(timeSlots.slice(0, 8))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingStatus("submitting")
    
    // Simulate API call
    setTimeout(() => {
      setBookingStatus("confirmed")
    }, 2000)
  }

  const getSpecializationColor = (spec: string) => {
    const colors = {
      "Cardiologist": "bg-red-100 text-red-800",
      "Neurologist": "bg-blue-100 text-blue-800",
      "Orthopedic": "bg-green-100 text-green-800",
      "Gynecologist": "bg-purple-100 text-purple-800",
      "Pediatrician": "bg-yellow-100 text-yellow-800",
      "Dermatologist": "bg-pink-100 text-pink-800",
      "ENT Specialist": "bg-indigo-100 text-indigo-800",
      "General Physician": "bg-gray-100 text-gray-800"
    }
    return colors[spec as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (bookingStatus === "confirmed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Appointment Confirmed
              </CardTitle>
              <CardDescription className="text-blue-100">
                Your doctor appointment has been successfully booked
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6">
                  Your appointment has been confirmed with {selectedDoctor?.name}
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                  <h4 className="font-semibold text-blue-800 mb-4">Appointment Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Patient</p>
                        <p className="text-gray-600">{appointmentData.patientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Doctor</p>
                        <p className="text-gray-600">{selectedDoctor?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-gray-600">
                          {appointmentData.date ? format(appointmentData.date, "PPP") : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-gray-600">{appointmentData.timeSlot}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Hospital</p>
                        <p className="text-gray-600">{selectedDoctor?.hospital}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Consultation Fee</p>
                        <p className="text-gray-600">₹{selectedDoctor?.fee}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => window.print()}
                    variant="outline"
                    className="flex-1"
                  >
                    Print Receipt
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "/"}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button 
            onClick={() => window.location.href = "/"}
            variant="outline"
            className="mb-4"
          >
            ← Back to Home
          </Button>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Book Doctor Appointment
            </CardTitle>
            <CardDescription className="text-blue-100">
              Consult with specialist doctors at your convenience
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {bookingStatus === "searching" ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Doctor</h2>
                  <p className="text-gray-600">Select from our panel of experienced specialists</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {doctors.map((doctor) => (
                    <Card 
                      key={doctor.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedDoctor?.id === doctor.id ? 'ring-2 ring-blue-500' : ''
                      } ${!doctor.available ? 'opacity-50' : ''}`}
                      onClick={() => doctor.available && handleDoctorSelect(doctor)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                                <Badge className={`text-xs ${getSpecializationColor(doctor.specialization)}`}>
                                  {doctor.specialization}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{doctor.rating}</span>
                              </div>
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4" />
                                <span>{doctor.experience} years experience</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{doctor.hospital}, {doctor.hospitalAddress}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">₹{doctor.fee}</span>
                                <span className="text-gray-500">consultation fee</span>
                              </div>
                            </div>
                            <div className="mt-3">
                              {doctor.available ? (
                                <Button 
                                  size="sm" 
                                  className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                  Select Doctor
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" disabled>
                                  Not Available
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {selectedDoctor && (
                  <div className="text-center">
                    <Button 
                      onClick={() => setBookingStatus("idle")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue with {selectedDoctor.name}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Selected Doctor</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedDoctor?.name}</p>
                      <p className="text-sm text-gray-600">{selectedDoctor?.specialization} • {selectedDoctor?.hospital}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={appointmentData.patientName}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">Patient Phone *</Label>
                    <Input
                      id="patientPhone"
                      value={appointmentData.patientPhone}
                      onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patientEmail">Patient Email</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    value={appointmentData.patientEmail}
                    onChange={(e) => handleInputChange("patientEmail", e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Select Date *</Label>
                    <Calendar
                      mode="single"
                      selected={appointmentData.date}
                      onSelect={(date) => handleInputChange("date", date)}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select Time Slot *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={appointmentData.timeSlot === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleInputChange("timeSlot", slot)}
                          className="text-sm"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms (Optional)</Label>
                  <Textarea
                    id="symptoms"
                    value={appointmentData.symptoms}
                    onChange={(e) => handleInputChange("symptoms", e.target.value)}
                    placeholder="Describe your symptoms briefly"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={appointmentData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any additional information for the doctor"
                    rows={2}
                  />
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Important Information</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please arrive 15 minutes before your appointment time. 
                        Bring your ID and any previous medical records.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setBookingStatus("searching")}
                    className="flex-1"
                  >
                    Back to Doctors
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={bookingStatus === "submitting"}
                  >
                    {bookingStatus === "submitting" ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Book Appointment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}