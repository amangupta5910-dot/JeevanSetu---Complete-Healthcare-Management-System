"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Ambulance, 
  MapPin, 
  Phone, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Navigation,
  User,
  Hospital
} from "lucide-react"

export default function AmbulanceBooking() {
  const [bookingData, setBookingData] = useState({
    patientName: "",
    patientPhone: "",
    pickupAddress: "",
    destination: "",
    emergencyType: "",
    ambulanceType: ""
  })
  
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "confirmed" | "tracking">("idle")
  const [trackingData, setTrackingData] = useState({
    ambulanceId: "",
    driverName: "",
    driverPhone: "",
    eta: "",
    distance: "",
    status: "ON_THE_WAY"
  })

  const ambulanceTypes = [
    { value: "BASIC", label: "Basic Ambulance", description: "Basic medical support", icon: Ambulance },
    { value: "ADVANCED", label: "Advanced Ambulance", description: "Advanced life support", icon: Ambulance },
    { value: "ICU", label: "ICU Ambulance", description: "Intensive care unit", icon: Ambulance },
    { value: "MORTUARY", label: "Mortuary Van", description: "For deceased transport", icon: Ambulance }
  ]

  const emergencyTypes = [
    "Medical Emergency",
    "Accident/Trauma",
    "Cardiac Emergency",
    "Stroke",
    "Pregnancy Related",
    "Other Emergency"
  ]

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingStatus("submitting")
    
    // Simulate API call
    setTimeout(() => {
      setBookingStatus("confirmed")
      // Simulate tracking data
      setTrackingData({
        ambulanceId: "AMB-001",
        driverName: "Rajesh Kumar",
        driverPhone: "+91 98765 43210",
        eta: "15 minutes",
        distance: "5.2 km",
        status: "ON_THE_WAY"
      })
    }, 2000)
  }

  const startTracking = () => {
    setBookingStatus("tracking")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REQUESTED": return "bg-yellow-500"
      case "ACCEPTED": return "bg-blue-500"
      case "ON_THE_WAY": return "bg-orange-500"
      case "PICKED_UP": return "bg-purple-500"
      case "REACHED_HOSPITAL": return "bg-green-500"
      case "COMPLETED": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  if (bookingStatus === "tracking") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-red-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Ambulance className="h-6 w-6" />
                Ambulance Tracking
              </CardTitle>
              <CardDescription className="text-red-100">
                Real-time tracking of your ambulance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tracking Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Ambulance Details</h3>
                    <Badge className={`${getStatusColor(trackingData.status)} text-white`}>
                      {trackingData.status.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Ambulance className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Ambulance ID</p>
                        <p className="text-gray-600">{trackingData.ambulanceId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Driver</p>
                        <p className="text-gray-600">{trackingData.driverName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Driver Phone</p>
                        <p className="text-gray-600">{trackingData.driverPhone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">ETA</p>
                        <p className="text-gray-600">{trackingData.eta}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Navigation className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Distance</p>
                        <p className="text-gray-600">{trackingData.distance}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => window.location.href = `tel:${trackingData.driverPhone}`}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Driver
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button 
                      onClick={() => window.location.href = "/"}
                      variant="outline"
                      className="flex-1"
                    >
                      ← Back to Home
                    </Button>
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Live Map Tracking</p>
                    <p className="text-sm text-gray-500">Ambulance location will appear here</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Trip Progress</h3>
                <div className="flex items-center justify-between">
                  {[
                    { status: "REQUESTED", label: "Request Received", completed: true },
                    { status: "ACCEPTED", label: "Ambulance Assigned", completed: true },
                    { status: "ON_THE_WAY", label: "On The Way", completed: true },
                    { status: "PICKED_UP", label: "Patient Picked Up", completed: false },
                    { status: "REACHED_HOSPITAL", label: "Reached Hospital", completed: false },
                    { status: "COMPLETED", label: "Trip Completed", completed: false }
                  ].map((step, index) => (
                    <div key={step.status} className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <p className="text-xs mt-2 text-center max-w-16">{step.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2"
          >
            ← Back to Home
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Ambulance</h1>
            <p className="text-xl text-gray-600">Fast and reliable ambulance service at your fingertips</p>
          </div>
        </div>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-red-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Ambulance className="h-6 w-6" />
              Book Ambulance
            </CardTitle>
            <CardDescription className="text-red-100">
              Fast and reliable ambulance service at your fingertips
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {bookingStatus === "confirmed" ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6">
                  Your ambulance has been assigned and is on the way.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-green-800 mb-2">Booking Details</h4>
                  <div className="text-left space-y-2 text-sm">
                    <p><strong>Patient:</strong> {bookingData.patientName}</p>
                    <p><strong>Phone:</strong> {bookingData.patientPhone}</p>
                    <p><strong>Pickup:</strong> {bookingData.pickupAddress}</p>
                    <p><strong>Driver:</strong> {trackingData.driverName}</p>
                    <p><strong>ETA:</strong> {trackingData.eta}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = "/"}
                    className="flex-1"
                  >
                    ← Back to Home
                  </Button>
                  <Button onClick={startTracking} className="flex-1 bg-red-600 hover:bg-red-700">
                    <Navigation className="mr-2 h-4 w-4" />
                    Track Ambulance
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={bookingData.patientName}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">Patient Phone *</Label>
                    <Input
                      id="patientPhone"
                      value={bookingData.patientPhone}
                      onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">Pickup Address *</Label>
                  <Textarea
                    id="pickupAddress"
                    value={bookingData.pickupAddress}
                    onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
                    placeholder="Enter complete pickup address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination Hospital (Optional)</Label>
                  <Input
                    id="destination"
                    value={bookingData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                    placeholder="Enter hospital name or address"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyType">Emergency Type *</Label>
                    <Select value={bookingData.emergencyType} onValueChange={(value) => handleInputChange("emergencyType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select emergency type" />
                      </SelectTrigger>
                      <SelectContent>
                        {emergencyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ambulanceType">Ambulance Type *</Label>
                    <Select value={bookingData.ambulanceType} onValueChange={(value) => handleInputChange("ambulanceType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ambulance type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ambulanceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    For medical emergencies, please call 108 immediately. This booking system is for non-emergency situations.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={bookingStatus === "submitting"}
                >
                  {bookingStatus === "submitting" ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Ambulance className="mr-2 h-4 w-4" />
                      Book Ambulance
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}