"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Phone, Navigation } from "lucide-react"

export default function SimpleHospitalsPage() {
  const hospitals = [
    {
      id: "1",
      name: "Apollo Hospital",
      address: "Delhi",
      phone: "+91 11 2692 5801",
      rating: 4.8
    },
    {
      id: "2", 
      name: "Fortis Hospital",
      address: "Gurgaon",
      phone: "+91 124 414 1414",
      rating: 4.7
    },
    {
      id: "3",
      name: "AIIMS Hospital",
      address: "New Delhi", 
      phone: "+91 11 2658 8500",
      rating: 4.9
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Hospitals</h1>
          <p className="text-gray-600">Find the best healthcare facilities near you</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  {hospital.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600">{hospital.address}</p>
                  <p className="text-sm text-gray-500">Rating: {hospital.rating}/5</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => window.location.href = `tel:${hospital.phone}`}
                      className="flex-1"
                    >
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/hospital-details/${hospital.id}`}
                      className="flex-1"
                    >
                      <Navigation className="mr-1 h-3 w-3" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button onClick={() => window.location.href = "/"}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}