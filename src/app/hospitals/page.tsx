"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building, 
  MapPin, 
  Phone, 
  Star, 
  Search,
  Ambulance,
  User,
  Heart,
  Navigation
} from "lucide-react"

export default function HospitalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [sortBy, setSortBy] = useState("rating")

  const hospitals = [
    {
      id: "1",
      name: "Apollo Hospital",
      address: "Delhi",
      phone: "+91 11 2692 5801",
      rating: 4.8,
      verified: true,
      specialties: ["Cardiology", "Neurology", "Orthopedic"],
      beds: 950,
      doctors: 250,
      emergency: true
    },
    {
      id: "2",
      name: "Fortis Hospital",
      address: "Delhi", 
      phone: "+91 11 4289 0000",
      rating: 4.7,
      verified: true,
      specialties: ["Cardiology", "Cardiac Surgery"],
      beds: 325,
      doctors: 150,
      emergency: true
    },
    {
      id: "3",
      name: "Max Hospital",
      address: "Delhi",
      phone: "+91 11 4055 4055", 
      rating: 4.6,
      verified: true,
      specialties: ["Multi-specialty", "Oncology"],
      beds: 530,
      doctors: 200,
      emergency: true
    },
    {
      id: "4",
      name: "AIIMS Hospital",
      address: "Delhi",
      phone: "+91 11 2658 8500",
      rating: 4.9,
      verified: true,
      specialties: ["Multi-specialty"],
      beds: 2438,
      doctors: 800,
      emergency: true
    },
    {
      id: "5",
      name: "Columbia Asia Hospital",
      address: "Gurgaon",
      phone: "+91 124 434 3030",
      rating: 4.5,
      verified: true,
      specialties: ["Multi-specialty", "Maternity"],
      beds: 100,
      doctors: 75,
      emergency: true
    },
    {
      id: "6",
      name: "Medanta Hospital",
      address: "Gurgaon",
      phone: "+91 124 414 1414",
      rating: 4.8,
      verified: true,
      specialties: ["Cardiology", "Neurology"],
      beds: 1250,
      doctors: 350,
      emergency: true
    }
  ]

  const locations = ["All", "Delhi", "Gurgaon", "Noida"]

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "beds", label: "Most Beds" },
    { value: "doctors", label: "Most Doctors" }
  ]

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !selectedLocation || selectedLocation === "All" || hospital.address === selectedLocation
    
    return matchesSearch && matchesLocation
  })

  const sortedHospitals = [...filteredHospitals].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "beds":
        return b.beds - a.beds
      case "doctors":
        return b.doctors - a.doctors
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4">
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
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Hospitals</h1>
          <p className="text-lg text-gray-600">Discover the best healthcare facilities near you</p>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search hospitals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredHospitals.length} hospitals
          </p>
        </div>

        {/* Hospitals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHospitals.map((hospital) => (
            <Card key={hospital.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{hospital.name}</CardTitle>
                      {hospital.verified && (
                        <Star className="h-4 w-4 text-blue-600 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-green-600">
                        {hospital.rating}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Address */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-600">{hospital.address}</p>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-600">{hospital.phone}</p>
                  </div>
                  
                  {/* Specialties */}
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {hospital.specialties.slice(0, 2).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {hospital.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{hospital.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <User className="h-3 w-3 text-blue-600" />
                        <span className="text-sm font-medium">{hospital.doctors}</span>
                      </div>
                      <p className="text-xs text-gray-500">Doctors</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-3 w-3 text-red-600" />
                        <span className="text-sm font-medium">{hospital.beds}</span>
                      </div>
                      <p className="text-xs text-gray-500">Beds</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => window.location.href = `/hospital-details/${hospital.id}`}
                      size="sm" 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Navigation className="mr-1 h-3 w-3" />
                      View Details
                    </Button>
                    <Button 
                      onClick={() => window.location.href = `tel:${hospital.phone}`}
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                    >
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </Button>
                    {hospital.emergency && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Ambulance className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredHospitals.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hospitals found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedLocation("")
                }}
                variant="outline"
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}