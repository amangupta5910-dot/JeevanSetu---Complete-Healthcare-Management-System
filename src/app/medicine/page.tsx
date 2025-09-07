"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus,
  Truck,
  Clock,
  Shield,
  Star,
  FileText,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  Heart,
  User
} from "lucide-react"

export default function MedicinePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [cart, setCart] = useState<any[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderStatus, setOrderStatus] = useState<"idle" | "submitting" | "confirmed">("idle")
  
  const [orderData, setOrderData] = useState({
    patientName: "",
    patientPhone: "",
    deliveryAddress: "",
    prescription: "",
    notes: ""
  })

  const medicines = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      description: "Fever and pain relief tablets",
      price: 45,
      stock: 100,
      category: "Pain Relief",
      requiresPrescription: false,
      image: "/api/placeholder/100/100",
      hospital: "Apollo Hospital",
      rating: 4.5,
      discount: 10
    },
    {
      id: "2",
      name: "Amoxicillin 500mg",
      description: "Antibiotic capsules",
      price: 120,
      stock: 50,
      category: "Antibiotics",
      requiresPrescription: true,
      image: "/api/placeholder/100/100",
      hospital: "Fortis Hospital",
      rating: 4.7,
      discount: 0
    },
    {
      id: "3",
      name: "Ibuprofen 400mg",
      description: "Anti-inflammatory tablets",
      price: 85,
      stock: 75,
      category: "Pain Relief",
      requiresPrescription: false,
      image: "/api/placeholder/100/100",
      hospital: "Max Hospital",
      rating: 4.3,
      discount: 15
    },
    {
      id: "4",
      name: "Omeprazole 20mg",
      description: "Acid reflux treatment",
      price: 95,
      stock: 60,
      category: "Digestive Health",
      requiresPrescription: true,
      image: "/api/placeholder/100/100",
      hospital: "AIIMS Hospital",
      rating: 4.6,
      discount: 5
    },
    {
      id: "5",
      name: "Cetirizine 10mg",
      description: "Allergy relief tablets",
      price: 65,
      stock: 80,
      category: "Allergy",
      requiresPrescription: false,
      image: "/api/placeholder/100/100",
      hospital: "Columbia Asia",
      rating: 4.4,
      discount: 0
    },
    {
      id: "6",
      name: "Metformin 500mg",
      description: "Diabetes medication",
      price: 75,
      stock: 40,
      category: "Diabetes",
      requiresPrescription: true,
      image: "/api/placeholder/100/100",
      hospital: "Medanta Hospital",
      rating: 4.8,
      discount: 20
    },
    {
      id: "7",
      name: "Vitamin D3 1000 IU",
      description: "Vitamin D supplement",
      price: 150,
      stock: 90,
      category: "Vitamins",
      requiresPrescription: false,
      image: "/api/placeholder/100/100",
      hospital: "Apollo Hospital",
      rating: 4.6,
      discount: 10
    },
    {
      id: "8",
      name: "Aspirin 75mg",
      description: "Blood thinner tablets",
      price: 55,
      stock: 70,
      category: "Cardiovascular",
      requiresPrescription: true,
      image: "/api/placeholder/100/100",
      hospital: "Fortis Hospital",
      rating: 4.5,
      discount: 0
    }
  ]

  const categories = [
    "All", "Pain Relief", "Antibiotics", "Digestive Health", 
    "Allergy", "Diabetes", "Vitamins", "Cardiovascular"
  ]

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "discount", label: "Best Discount" }
  ]

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || selectedCategory === "All" || medicine.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "discount":
        return b.discount - a.discount
      default:
        return 0
    }
  })

  const addToCart = (medicine: any) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === medicine.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...medicine, quantity: 1 }]
    })
  }

  const removeFromCart = (medicineId: string) => {
    setCart(prev => prev.filter(item => item.id !== medicineId))
  }

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(medicineId)
      return
    }
    setCart(prev => prev.map(item =>
      item.id === medicineId ? { ...item, quantity } : item
    ))
  }

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => {
      const discountedPrice = item.price * (1 - item.discount / 100)
      return sum + (discountedPrice * item.quantity)
    }, 0)
    
    const deliveryFee = subtotal > 500 ? 0 : 50
    const total = subtotal + deliveryFee
    
    return { subtotal, deliveryFee, total }
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderStatus("submitting")
    
    // Simulate API call
    setTimeout(() => {
      setOrderStatus("confirmed")
      setCart([])
      setShowCheckout(false)
    }, 2000)
  }

  const getStockStatus = (stock: number) => {
    if (stock > 50) return { color: "text-green-600", text: "In Stock" }
    if (stock > 20) return { color: "text-yellow-600", text: "Low Stock" }
    return { color: "text-red-600", text: "Very Low Stock" }
  }

  if (orderStatus === "confirmed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-green-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Order Confirmed
              </CardTitle>
              <CardDescription className="text-green-100">
                Your medicine order has been successfully placed
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600 mb-6">
                  Your medicines will be delivered to your doorstep soon.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left">
                  <h4 className="font-semibold text-green-800 mb-4">Order Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Patient</p>
                        <p className="text-gray-600">{orderData.patientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{orderData.patientPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Delivery Address</p>
                        <p className="text-gray-600">{orderData.deliveryAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Estimated Delivery</p>
                        <p className="text-gray-600">Within 2-4 hours</p>
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
                    className="flex-1 bg-green-600 hover:bg-green-700"
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

  if (showCheckout) {
    const { subtotal, deliveryFee, total } = getCartTotal()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-orange-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Checkout
              </CardTitle>
              <CardDescription className="text-orange-100">
                Review your order and provide delivery details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const discountedPrice = item.price * (1 - item.discount / 100)
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            {item.discount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {item.discount}% off
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{(discountedPrice * item.quantity).toFixed(2)}</p>
                            {item.discount > 0 && (
                              <p className="text-sm text-gray-500 line-through">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Delivery Form */}
                <div>
                  <h3 className="font-semibold mb-4">Delivery Information</h3>
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name *</Label>
                      <Input
                        id="patientName"
                        value={orderData.patientName}
                        onChange={(e) => setOrderData(prev => ({ ...prev, patientName: e.target.value }))}
                        placeholder="Enter patient name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="patientPhone">Patient Phone *</Label>
                      <Input
                        id="patientPhone"
                        value={orderData.patientPhone}
                        onChange={(e) => setOrderData(prev => ({ ...prev, patientPhone: e.target.value }))}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                      <Textarea
                        id="deliveryAddress"
                        value={orderData.deliveryAddress}
                        onChange={(e) => setOrderData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                        placeholder="Enter complete delivery address"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="prescription">Prescription (if required)</Label>
                      <Textarea
                        id="prescription"
                        value={orderData.prescription}
                        onChange={(e) => setOrderData(prev => ({ ...prev, prescription: e.target.value }))}
                        placeholder="Upload prescription details or doctor's note"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={orderData.notes}
                        onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any special instructions for delivery"
                        rows={2}
                      />
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Important Information</p>
                          <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                            <li>Delivery within 2-4 hours</li>
                            <li>Free delivery for orders above ₹500</li>
                            <li>Prescription medicines require valid prescription</li>
                            <li>Cash on delivery available</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowCheckout(false)}
                        className="flex-1"
                      >
                        Back to Cart
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        disabled={orderStatus === "submitting"}
                      >
                        {orderStatus === "submitting" ? "Processing..." : "Place Order"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Medicines</h1>
          <p className="text-xl text-gray-600">Get genuine medicines delivered to your doorstep</p>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
              
              <Button 
                onClick={() => setShowCheckout(true)}
                className="bg-orange-600 hover:bg-orange-700"
                disabled={cart.length === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart ({cart.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Found {filteredMedicines.length} medicines
          </p>
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Genuine medicines guaranteed</span>
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedMedicines.map((medicine) => {
            const stockStatus = getStockStatus(medicine.stock)
            const discountedPrice = medicine.price * (1 - medicine.discount / 100)
            const cartItem = cart.find(item => item.id === medicine.id)
            
            return (
              <Card key={medicine.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{medicine.name}</CardTitle>
                      <p className="text-sm text-gray-600 mb-2">{medicine.description}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{medicine.rating}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Pill className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Price and Discount */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">₹{discountedPrice.toFixed(2)}</span>
                          {medicine.discount > 0 && (
                            <>
                              <span className="text-sm text-gray-500 line-through">₹{medicine.price}</span>
                              <Badge variant="destructive" className="text-xs">
                                {medicine.discount}% off
                              </Badge>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">from {medicine.hospital}</p>
                      </div>
                    </div>
                    
                    {/* Stock Status */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                      <span className="text-sm text-gray-500">
                        {medicine.stock} left
                      </span>
                    </div>
                    
                    {/* Category */}
                    <Badge variant="secondary" className="text-xs">
                      {medicine.category}
                    </Badge>
                    
                    {/* Prescription Required */}
                    {medicine.requiresPrescription && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs">Prescription required</span>
                      </div>
                    )}
                    
                    {/* Add to Cart */}
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(medicine.id, cartItem.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {cartItem.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(medicine.id, cartItem.quantity + 1)}
                          disabled={cartItem.quantity >= medicine.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(medicine.id)}
                          className="text-red-600"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={() => addToCart(medicine)}
                        disabled={medicine.stock === 0}
                      >
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredMedicines.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No medicines found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">100% Genuine</h3>
              <p className="text-sm text-gray-600">All medicines are sourced from verified hospitals</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-6">
              <Truck className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Get your medicines within 2-4 hours</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-6">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Round the clock customer support</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">Simple return and refund policy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}