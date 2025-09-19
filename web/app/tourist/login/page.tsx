"use client"

import * as React from "react"
import { useState } from "react"
import QRCode from "qrcode"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Download, QrCode, User, Calendar, Shield } from "lucide-react"


interface TouristData {
  id: string
  name: string
  phone?: string
  location?: string
  aadhaar: string
  blockchainId: string
  sessionToken: string
  startDate: string
  endDate: string
}

export default function LoginPage(): JSX.Element {
  const [aadhaar, setAadhaar] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touristData, setTouristData] = useState<TouristData | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalized = aadhaar

    try {
      setIsSubmitting(true)
      
      // Simulate API call to fetch tourist data
      await new Promise((r) => setTimeout(r, 1000))
      
      // Dummy data for now - replace with actual API call
      const dummyTouristData: TouristData = {
        id: "tourist-" + Math.random().toString(36).substr(2, 9),
        name: "John Doe",
        phone: "+91 98765 43210",
        location: "Mumbai, Maharashtra",
        aadhaar: normalized,
        blockchainId: "0x" + Math.random().toString(16).substr(2, 40),
        sessionToken: "session_" + Math.random().toString(36).substr(2, 32),
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      }

      setTouristData(dummyTouristData)

      // Generate QR code with blockchain data
      const qrData = {
        blockchainId: dummyTouristData.blockchainId,
        sessionToken: dummyTouristData.sessionToken,
        metadata: {
          startDate: dummyTouristData.startDate,
          endDate: dummyTouristData.endDate,
          touristId: dummyTouristData.id,
          aadhaar: dummyTouristData.aadhaar
        }
      }

      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      setQrCodeDataUrl(qrCodeUrl)

      toast({
        title: "Login successful",
        description: "Your tourist data has been fetched and QR code generated.",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a')
      link.download = `tourist-qr-${touristData?.id}.png`
      link.href = qrCodeDataUrl
      link.click()
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        {!touristData ? (
          <div className="max-w-sm mx-auto space-y-6">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Tourist Login</h1>
              <p className="text-sm text-muted-foreground">
                Sign in with your Aadhaar number
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="aadhaar" className="text-sm font-medium">
                  Aadhaar Number
                </label>
                <Input
                  id="aadhaar"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaar}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 12)
                    // format as 4-4-4 groups for readability
                    const formatted = onlyDigits.replace(/(\d{4})(\d{0,4})(\d{0,4}).*/, (_m, a, b, c) =>
                      [a, b, c].filter(Boolean).join(" ")
                    )
                    setAadhaar(formatted)
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your 12-digit Aadhaar. We do not store your number on this device.
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Continue"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tourist Data Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Tourist Information
                </CardTitle>
                <CardDescription>
                  Your verified tourist profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-lg font-semibold">{touristData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{touristData.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="text-sm">{touristData.location || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Aadhaar</label>
                    <p className="text-sm font-mono">{touristData.aadhaar}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Blockchain ID
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Valid until {new Date(touristData.endDate).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Digital Identity QR Code
                </CardTitle>
                <CardDescription>
                  Your blockchain-verified digital identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {qrCodeDataUrl && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <img 
                        src={qrCodeDataUrl} 
                        alt="Tourist QR Code" 
                        className="w-64 h-64"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        This QR code contains your blockchain ID, session token, and travel metadata.
                      </p>
                      <Button onClick={downloadQRCode} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


