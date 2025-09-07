"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  IndianRupee
} from "lucide-react"

interface PaymentComponentProps {
  amount: number
  orderId: string
  serviceType: 'DOCTOR_APPOINTMENT' | 'VIDEO_CONSULTATION' | 'MEDICINE_ORDER' | 'AMBULANCE_BOOKING'
  patientDetails?: any
  onPaymentSuccess: (paymentData: any) => void
  onPaymentError: (error: string) => void
}

export default function PaymentComponent({
  amount,
  orderId,
  serviceType,
  patientDetails,
  onPaymentSuccess,
  onPaymentError
}: PaymentComponentProps) {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  })
  const [upiDetails, setUpiDetails] = useState({
    upiId: ""
  })
  const [netBankingDetails, setNetBankingDetails] = useState({
    bank: "",
    accountNumber: "",
    ifsc: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  const paymentMethods = [
    {
      value: "CREDIT_CARD",
      label: "Credit Card",
      icon: CreditCard,
      description: "Pay using your credit card"
    },
    {
      value: "DEBIT_CARD",
      label: "Debit Card", 
      icon: CreditCard,
      description: "Pay using your debit card"
    },
    {
      value: "UPI",
      label: "UPI",
      icon: Smartphone,
      description: "Pay using any UPI app"
    },
    {
      value: "NET_BANKING",
      label: "Net Banking",
      icon: Building,
      description: "Pay using your bank account"
    },
    {
      value: "WALLET",
      label: "Wallet",
      icon: Wallet,
      description: "Pay using digital wallet"
    },
    {
      value: "CASH_ON_DELIVERY",
      label: "Cash on Delivery",
      icon: Truck,
      description: "Pay when you receive the service"
    }
  ]

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Axis Bank",
    "Canara Bank",
    "Union Bank of India"
  ]

  const handlePayment = async () => {
    if (!paymentMethod) {
      onPaymentError("Please select a payment method")
      return
    }

    setIsProcessing(true)
    setPaymentStatus("processing")

    try {
      let paymentData = {
        amount,
        paymentMethod,
        orderId,
        serviceType,
        patientDetails
      }

      // Validate payment details based on method
      if (paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") {
        if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
          throw new Error("Please fill all card details")
        }
        paymentData.patientDetails = {
          ...patientDetails,
          cardDetails: {
            cardNumber: cardDetails.cardNumber.slice(-4), // Only last 4 digits
            cardholderName: cardDetails.cardholderName
          }
        }
      } else if (paymentMethod === "UPI") {
        if (!upiDetails.upiId) {
          throw new Error("Please enter UPI ID")
        }
        paymentData.patientDetails = {
          ...patientDetails,
          upiId: upiDetails.upiId
        }
      } else if (paymentMethod === "NET_BANKING") {
        if (!netBankingDetails.bank || !netBankingDetails.accountNumber || !netBankingDetails.ifsc) {
          throw new Error("Please fill all net banking details")
        }
        paymentData.patientDetails = {
          ...patientDetails,
          bankDetails: {
            bank: netBankingDetails.bank,
            accountNumber: netBankingDetails.accountNumber.slice(-4) // Only last 4 digits
          }
        }
      }

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()

      if (result.success) {
        setPaymentStatus("success")
        onPaymentSuccess(result.payment)
      } else {
        throw new Error(result.error || 'Payment failed')
      }
    } catch (error) {
      setPaymentStatus("error")
      onPaymentError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "CREDIT_CARD":
      case "DEBIT_CARD":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  maxLength={3}
                  type="password"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardDetails.cardholderName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
              />
            </div>
          </div>
        )

      case "UPI":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@upi"
                value={upiDetails.upiId}
                onChange={(e) => setUpiDetails(prev => ({ ...prev, upiId: e.target.value }))}
              />
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You will receive a payment request on your UPI app. Please approve it to complete the payment.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "NET_BANKING":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank</Label>
              <Select value={netBankingDetails.bank} onValueChange={(value) => setNetBankingDetails(prev => ({ ...prev, bank: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="1234567890"
                value={netBankingDetails.accountNumber}
                onChange={(e) => setNetBankingDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifsc">IFSC Code</Label>
              <Input
                id="ifsc"
                placeholder="SBIN0001234"
                value={netBankingDetails.ifsc}
                onChange={(e) => setNetBankingDetails(prev => ({ ...prev, ifsc: e.target.value }))}
              />
            </div>
          </div>
        )

      case "WALLET":
        return (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You will be redirected to your wallet app to complete the payment.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "CASH_ON_DELIVERY":
        return (
          <div className="space-y-4">
            <Alert>
              <Truck className="h-4 w-4" />
              <AlertDescription>
                Pay in cash when you receive the service. No additional charges for COD.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  if (paymentStatus === "success") {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully.
          </p>
          <Badge className="bg-green-100 text-green-800 mb-4">
            Payment ID: {orderId}
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-6 w-6" />
          Secure Payment
        </CardTitle>
        <CardDescription className="text-blue-100">
          Complete your payment securely
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Amount Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Order ID:</span>
              <span>{orderId}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-base font-medium mb-3 block">Select Payment Method</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <div className="flex items-center gap-3">
                    <method.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod && (
            <div className="border-t pt-4">
              <Label className="text-base font-medium mb-3 block">
                Payment Details
              </Label>
              {renderPaymentForm()}
            </div>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Secured by 256-bit SSL encryption</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setPaymentMethod("")}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handlePayment}
              disabled={!paymentMethod || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${amount.toFixed(2)}`
              )}
            </Button>
          </div>

          {/* Error Message */}
          {paymentStatus === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Payment failed. Please try again or use a different payment method.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}