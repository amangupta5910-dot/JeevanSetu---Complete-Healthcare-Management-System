"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Ambulance, 
  User, 
  Video, 
  Pill, 
  Building,
  Phone,
  MapPin,
  Clock,
  Star,
  Shield
} from "lucide-react"

export default function Home() {
  const [activeService, setActiveService] = useState("ambulance")

  const services = [
    {
      id: "ambulance",
      title: "Ambulance Booking",
      icon: Ambulance,
      description: "Book ambulance services with real-time tracking",
      features: ["24/7 Availability", "Real-time Tracking", "Multiple Ambulance Types", "Emergency Support"],
      color: "bg-red-500"
    },
    {
      id: "hospitals",
      title: "Find Hospitals",
      icon: Building,
      description: "Discover and connect with nearby hospitals",
      features: ["Hospital Directory", "Bed Availability", "Emergency Services", "Patient Reviews"],
      color: "bg-purple-500"
    },
    {
      id: "doctor",
      title: "Doctor Appointment",
      icon: User,
      description: "Book appointments with specialist doctors",
      features: ["Specialist Doctors", "Online Booking", "Appointment Reminders", "Medical History"],
      color: "bg-blue-500"
    },
    {
      id: "video",
      title: "Video Consultation",
      icon: Video,
      description: "Consult doctors remotely via video calls",
      features: ["HD Video Quality", "Prescription Generation", "Follow-up Support", "Secure Platform"],
      color: "bg-green-500"
    },
    {
      id: "medicine",
      title: "Medicine Delivery",
      icon: Pill,
      description: "Order medicines with home delivery",
      features: ["Wide Medicine Range", "Quick Delivery", "Prescription Upload", "Discount Offers"],
      color: "bg-orange-500"
    }
  ]

  const stats = [
    { label: "Doctors", value: "2000+", icon: User },
    { label: "Ambulances", value: "1000+", icon: Ambulance },
    { label: "Medicines", value: "50K+", icon: Pill },
    { label: "Happy Patients", value: "1L+", icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative w-16 h-16">
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
              <a href="/history" className="text-gray-700 hover:text-blue-600">My Bookings</a>
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
                <a href="/auth" className="text-blue-600 hover:text-blue-700 font-medium">Login</a>
                <a href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-700/70"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Health, Our Priority
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto text-lg">
            Comprehensive healthcare services at your fingertips. Book ambulances, consult doctors, 
            and order medicines - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
              <a href="/ambulance">
                <Ambulance className="mr-2 h-5 w-5" />
                Emergency Ambulance
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 border-white" asChild>
              <a href="/hospitals">
                <Building className="mr-2 h-5 w-5" />
                Find Hospitals
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 border-white" asChild>
              <a href="/doctor">
                <User className="mr-2 h-5 w-5" />
                Book Doctor
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive healthcare solutions designed for your convenience
            </p>
          </div>

          <Tabs value={activeService} onValueChange={setActiveService} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              {services.map((service) => (
                <TabsTrigger key={service.id} value={service.id} className="flex flex-col gap-2 p-3">
                  <service.icon className="h-6 w-6" />
                  <span className="text-xs">{service.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {services.map((service) => (
              <TabsContent key={service.id} value={service.id}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${service.color} text-white`}>
                        <service.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{service.title}</CardTitle>
                        <CardDescription className="text-lg">{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold mb-4">Key Features:</h4>
                        <div className="space-y-3">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="bg-gray-100 rounded-lg p-8 w-full">
                          <div className="text-center">
                            <h4 className="font-semibold mb-4">Quick Action</h4>
                            <Button className="w-full" size="lg" onClick={() => {
                              if (service.id === 'ambulance') window.location.href = '/ambulance'
                              else if (service.id === 'doctor') window.location.href = '/doctor'
                              else if (service.id === 'video') window.location.href = '/video-consultation'
                              else if (service.id === 'hospital') window.location.href = '/hospitals'
                              else if (service.id === 'medicine') window.location.href = '/medicine'
                            }}>
                              Get Started with {service.title}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Emergency? We're Here 24/7
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            In case of medical emergency, don't hesitate. Our ambulance service is available round the clock.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
              <Phone className="mr-2 h-5 w-5" />
              Call: 108
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Ambulance className="mr-2 h-5 w-5" />
              Book Ambulance Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12">
                  <img
                    src="https://z-cdn-media.chatglm.cn/files/01e063f6-6500-4e8e-bceb-5f9159f59ec1_zamb.jpg?auth_key=1788447772-5071f7a7ccc847de926eb147c0575943-0-38bebbbd0b1192f61a2c68d37366ac5e"
                    alt="MediCare Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <span className="ml-2 text-lg font-bold">MediCare</span>
              </div>
              <p className="text-gray-400">
                Your trusted healthcare partner providing comprehensive medical services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/hospitals" className="hover:text-white">Find Hospitals</a></li>
                <li><a href="/ambulance" className="hover:text-white">Ambulance Booking</a></li>
                <li><a href="/doctor" className="hover:text-white">Doctor Appointments</a></li>
                <li><a href="/video-consultation" className="hover:text-white">Video Consultation</a></li>
                <li><a href="/medicine" className="hover:text-white">Medicine Delivery</a></li>
                <li><a href="/history" className="hover:text-white">My Bookings</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  108 (Emergency)
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  1800-123-4567
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Available 24/7
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>Emergency ambulance service. All rights reserved</p>
            <p>© 2025 MediCare Private Limited</p>
            <p>Create By Aman Gupta</p>
            <p>🙌 TEAMWORK 🙌</p>
          </div>
        </div>
      </footer>
    </div>
  )
}