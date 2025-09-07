"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building, 
  MapPin, 
  Phone, 
  Star, 
  Navigation,
  Ambulance,
  User,
  Heart,
  Clock,
  Shield,
  Stethoscope,
  AlertTriangle
} from "lucide-react"

export default function HospitalDetailsPage() {
  const params = useParams()
  const hospitalId = params.id as string

  // Mock hospital data - in real app, this would come from API based on ID
  const hospitalsData = {
    "1": {
      id: "1",
      name: "Apollo Hospital",
      address: "Indraprastha Apollo Hospitals, Sarita Vihar, Delhi - 110076",
      phone: "+91 11 2692 5801",
      emergencyPhone: "+91 11 2692 5800",
      email: "info@apollohospitals.com",
      rating: 4.8,
      totalReviews: 1234,
      verified: true,
      description: "Apollo Hospitals is a leading healthcare provider in India with state-of-the-art facilities and expert medical professionals. We offer comprehensive healthcare services across multiple specialties.",
      specialties: ["Cardiology", "Neurology", "Orthopedic", "Gynecology", "Oncology", "Nephrology"],
      facilities: ["ICU", "Emergency", "Pharmacy", "Laboratory", "Ambulance", "Cafeteria", "Parking", "WiFi"],
      beds: 950,
      doctors: 250,
      emergency: true,
      established: 1983,
      website: "www.apollohospitals.com",
      timings: "24/7 Emergency, OPD: 8:00 AM - 8:00 PM",
      insurance: ["All major insurance companies accepted"]
    },
    "2": {
      id: "2",
      name: "Fortis Hospital",
      address: "Fortis Escorts Heart Institute, Okhla Road, New Delhi - 110025",
      phone: "+91 11 4289 0000",
      emergencyPhone: "+91 11 4289 1111",
      email: "info@fortishealthcare.com",
      rating: 4.7,
      totalReviews: 987,
      verified: true,
      description: "Fortis Healthcare is a leading integrated healthcare delivery service provider in India. We are committed to providing the highest quality of medical care.",
      specialties: ["Cardiology", "Cardiac Surgery", "Neurology", "Orthopedic", "Urology"],
      facilities: ["ICU", "Emergency", "Pharmacy", "Laboratory", "Cath Lab", "Ambulance", "Parking"],
      beds: 325,
      doctors: 150,
      emergency: true,
      established: 1996,
      website: "www.fortishealthcare.com",
      timings: "24/7 Emergency, OPD: 8:00 AM - 8:00 PM",
      insurance: ["All major insurance companies accepted"]
    },
    "3": {
      id: "3",
      name: "Max Hospital",
      address: "Max Super Speciality Hospital, Saket, New Delhi - 110017",
      phone: "+91 11 4055 4055",
      emergencyPhone: "+91 11 4055 4056",
      email: "info@maxhealthcare.com",
      rating: 4.6,
      totalReviews: 856,
      verified: true,
      description: "Max Healthcare is one of India's leading providers of comprehensive, seamless and integrated world-class healthcare services.",
      specialties: ["Multi-specialty", "Oncology", "Nephrology", "Urology", "Gastroenterology"],
      facilities: ["ICU", "Emergency", "Pharmacy", "Laboratory", "Ambulance", "Cafeteria", "Parking"],
      beds: 530,
      doctors: 200,
      emergency: true,
      established: 2006,
      website: "www.maxhealthcare.com",
      timings: "24/7 Emergency, OPD: 8:00 AM - 8:00 PM",
      insurance: ["All major insurance companies accepted"]
    },
    "4": {
      id: "4",
      name: "AIIMS Hospital",
      address: "All India Institute of Medical Sciences, Ansari Nagar, New Delhi - 110029",
      phone: "+91 11 2658 8500",
      emergencyPhone: "+91 11 2658 8501",
      email: "info@aiims.edu",
      rating: 4.9,
      totalReviews: 2341,
      verified: true,
      description: "AIIMS is a premier medical college and hospital in India, providing high standards of teaching and patient care.",
      specialties: ["Multi-specialty", "Research", "Education", "Cardiology", "Neurology", "Pediatrics"],
      facilities: ["ICU", "Emergency", "Pharmacy", "Laboratory", "Research Center", "Ambulance", "Library"],
      beds: 2438,
      doctors: 800,
      emergency: true,
      established: 1956,
      website: "www.aiims.edu",
      timings: "24/7 Emergency, OPD: 8:30 AM - 4:00 PM",
      insurance: ["Government schemes accepted"]
    },
    "5": {
      id: "5",
      name: "Columbia Asia Hospital",
      address: "Columbia Asia Hospital, Palam Vihar, Gurgaon - 122017",
      phone: "+91 124 434 3030",
      emergencyPhone: "+91 124 434 3031",
      email: "info@columbiaasia.com",
      rating: 4.5,
      totalReviews: 623,
      verified: true,
      description: "Columbia Asia Hospitals are multi-specialty hospitals committed to providing quality healthcare at affordable costs.",
      specialties: ["Multi-specialty", "Maternity", "Pediatrics", "General Surgery", "Internal Medicine"],
      facilities: ["ICU", "Emergency", "Pharmacy", "Laboratory", "Ambulance", "Cafeteria", "Parking"],
      beds: 100,
      doctors: 75,
      emergency: true,
      established: 2008,
      website: "www.columbiaasia.com",
      timings: "24/7 Emergency, OPD: 9:00 AM - 6:00 PM",
      insurance: ["All major insurance companies accepted"]
    },
    "6": {
      id: "6",
      name: "Medanta Hospital",
      address: "Medanta - The Medicity, Sector 38, Gurgaon - 122001",
      phone: "+91 124 414 1414",
      emergencyPhone: "+91 124 414 1415",
      email: "info@medanta.org",
      rating: 4.8,
      totalReviews: 1567,
      verified: true,
      description: "Medanta is one of India's largest multi-super specialty institutes, founded by eminent cardiac surgeon Dr. Naresh Trehan.",
      specialties: ["Cardiology", "Neurology", "Orthopedic", "Liver Transplant", "Kidney Transplant", "Cancer Care"],
      facilities: ["ICU", "Emergency", "Pharmacy", "Laboratory", "Ambulance", "Cafeteria", "Parking", "WiFi"],
      beds: 1250,
      doctors: 350,
      emergency: true,
      established: 2009,
      website: "www.medanta.org",
      timings: "24/7 Emergency, OPD: 8:00 AM - 8:00 PM",
      insurance: ["All major insurance companies accepted"]
    }
  }

  // Get hospital data based on ID, or default to Apollo if ID not found
  const hospital = hospitalsData[hospitalId as keyof typeof hospitalsData] || hospitalsData["1"]

  // Generate doctors based on hospital
  const doctorsData = {
    "1": [
      { id: "1", name: "Dr. Rajesh Sharma", specialization: "Cardiologist", experience: 15, rating: 4.8, available: true },
      { id: "2", name: "Dr. Priya Singh", specialization: "Neurologist", experience: 12, rating: 4.9, available: true },
      { id: "3", name: "Dr. Amit Patel", specialization: "Orthopedic", experience: 10, rating: 4.7, available: false }
    ],
    "2": [
      { id: "4", name: "Dr. Sameer Mehrotra", specialization: "Cardiac Surgeon", experience: 18, rating: 4.9, available: true },
      { id: "5", name: "Dr. Anil Saxena", specialization: "Neurologist", experience: 14, rating: 4.6, available: true },
      { id: "6", name: "Dr. Preeti Malhotra", specialization: "Urologist", experience: 11, rating: 4.5, available: true }
    ],
    "3": [
      { id: "7", name: "Dr. Sandeep Garg", specialization: "Oncologist", experience: 16, rating: 4.7, available: true },
      { id: "8", name: "Dr. Neerja Bhatla", specialization: "Nephrologist", experience: 13, rating: 4.8, available: false },
      { id: "9", name: "Dr. Rajeev Sood", specialization: "Urologist", experience: 12, rating: 4.6, available: true }
    ],
    "4": [
      { id: "10", name: "Dr. Randeep Guleria", specialization: "Pulmonologist", experience: 25, rating: 4.9, available: true },
      { id: "11", name: "Dr. M Srinivas", specialization: "Cardiologist", experience: 20, rating: 4.8, available: true },
      { id: "12", name: "Dr. Ashutosh Biswas", specialization: "Neurologist", experience: 18, rating: 4.7, available: true }
    ],
    "5": [
      { id: "13", name: "Dr. Anita Sabharwal", specialization: "Gynecologist", experience: 14, rating: 4.6, available: true },
      { id: "14", name: "Dr. Rajiv Chawla", specialization: "Pediatrician", experience: 12, rating: 4.5, available: true },
      { id: "15", name: "Dr. Sanjeev Bagai", specialization: "Pediatric Surgeon", experience: 16, rating: 4.7, available: false }
    ],
    "6": [
      { id: "16", name: "Dr. Naresh Trehan", specialization: "Cardiac Surgeon", experience: 30, rating: 4.9, available: true },
      { id: "17", name: "Dr. Yatin Mehta", specialization: "Neurologist", experience: 15, rating: 4.8, available: true },
      { id: "18", name: "Dr. A S Soin", specialization: "Liver Transplant", experience: 20, rating: 4.9, available: true }
    ]
  }

  const doctors = doctorsData[hospitalId as keyof typeof doctorsData] || doctorsData["1"]

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    return "text-yellow-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative w-12 h-12">
                <img
                  src="https://z-cdn-media.chatglm.cn/files/01e063f6-6500-4e8e-bceb-5f9159f59ec1_zamb.jpg?auth_key=1788447772-5071f7a7ccc847de926eb147c0575943-0-38bebbbd0b1192f61a2c68d37366ac5e"
                  alt="MediCare Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">MediCare</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="/ambulance" className="text-gray-700 hover:text-blue-600">Ambulance</a>
              <a href="/doctor" className="text-gray-700 hover:text-blue-600">Doctors</a>
              <a href="/video-consultation" className="text-gray-700 hover:text-blue-600">Video Consult</a>
              <a href="/hospitals" className="text-gray-700 hover:text-blue-600">Hospitals</a>
              <a href="/medicine" className="text-gray-700 hover:text-blue-600">Medicines</a>
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
                <a href="/auth" className="text-blue-600 hover:text-blue-700 font-medium">Login</a>
                <a href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</a>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hospital Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <Building className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{hospital.name}</h1>
                    {hospital.verified && (
                      <Shield className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className={`text-xl font-bold ${getRatingColor(hospital.rating)}`}>
                      {hospital.rating}
                    </span>
                    <span className="text-gray-500">
                      ({hospital.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                {hospital.emergency && (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <Ambulance className="h-4 w-4" />
                    <span className="font-medium">24/7 Emergency</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{hospital.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{hospital.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{hospital.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{hospital.timings}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">Est. {hospital.established}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = `tel:${hospital.phone}`}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.open(`https://maps.google.com/?q=${hospital.address}`, '_blank')}
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Get Directions
                </Button>
                {hospital.emergency && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                    onClick={() => window.location.href = `tel:${hospital.emergencyPhone}`}
                  >
                    <Ambulance className="mr-2 h-4 w-4" />
                    Emergency
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{hospital.doctors}+</div>
              <div className="text-gray-600">Expert Doctors</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{hospital.beds}+</div>
              <div className="text-gray-600">Hospital Beds</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-2">
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{hospital.specialties.length}</div>
              <div className="text-gray-600">Specialties</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{hospital.rating}</div>
              <div className="text-gray-600">Rating</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Specialties */}
          <div className="md:col-span-2">
            <Card className="border-0 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Specialties & Treatments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hospital.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="p-3 text-center justify-center">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card className="border-0 shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Facilities & Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {hospital.facilities.map((facility) => (
                    <div key={facility} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Doctors */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Top Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{doctor.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                          <p className="text-xs text-gray-500">{doctor.experience} years experience</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                        </div>
                        <Badge 
                          variant={doctor.available ? "default" : "secondary"}
                          className={doctor.available ? "bg-green-600" : "bg-gray-500"}
                        >
                          {doctor.available ? "Available" : "Busy"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Emergency Number</p>
                    <p className="font-semibold text-lg">{hospital.emergencyPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ambulance Service</p>
                    <p className="font-semibold">24/7 Available</p>
                  </div>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => window.location.href = `tel:${hospital.emergencyPhone}`}
                  >
                    <Ambulance className="mr-2 h-4 w-4" />
                    Call Emergency
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a 
                      href={`https://${hospital.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {hospital.website}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a 
                      href={`mailto:${hospital.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {hospital.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Insurance</p>
                    <p className="text-sm">{hospital.insurance[0]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.href = "/doctor"}
                  >
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.location.href = "/ambulance"}
                  >
                    <Ambulance className="mr-2 h-4 w-4" />
                    Book Ambulance
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = "/video-consultation"}
                  >
                    Video Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}