"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { User, Phone, MapPin, Shield, Calendar, QrCode, Download, ArrowLeft, Edit, Trash2 } from "lucide-react"

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
  createdAt: string
  updatedAt: string
}

export default function TouristDetailPage(): JSX.Element {
  const params = useParams()
  const router = useRouter()
  const [tourist, setTourist] = useState<TouristData | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  const { toast } = useToast()

  const touristId = params.id as string

  useEffect(() => {
    if (touristId) {
      fetchTouristData()
    }
  }, [touristId])

  const fetchTouristData = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API
      await new Promise((r) => setTimeout(r, 1000))
      
      // Dummy data for now
      const dummyData: TouristData = {
        id: touristId,
        name: "John Doe",
        phone: "+91 98765 43210",
        location: "Mumbai, Maharashtra",
        aadhaar: "123456789012",
        blockchainId: "0x" + Math.random().toString(16).substr(2, 40),
        sessionToken: "session_" + Math.random().toString(36).substr(2, 32),
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setTourist(dummyData)
      generateQRCode(dummyData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tourist data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async (touristData: TouristData) => {
    try {
      const QRCode = (await import("qrcode")).default
      
      const qrData = {
        blockchainId: touristData.blockchainId,
        sessionToken: touristData.sessionToken,
        metadata: {
          startDate: touristData.startDate,
          endDate: touristData.endDate,
          touristId: touristData.id,
          aadhaar: touristData.aadhaar
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
    } catch (error) {
      console.error("Failed to generate QR code:", error)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeDataUrl && tourist) {
      const link = document.createElement('a')
      link.download = `tourist-qr-${tourist.id}.png`
      link.href = qrCodeDataUrl
      link.click()
    }
  }

  const handleEdit = () => {
    // Navigate to edit page
    router.push(`/tourist/${touristId}/edit`)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this tourist record?")) {
      try {
        // API call to delete tourist
        toast({
          title: "Success",
          description: "Tourist record deleted successfully",
        })
        router.push('/tourist')
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete tourist record",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading tourist data...</div>
      </div>
    )
  }

  if (!tourist) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Tourist Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested tourist record could not be found.</p>
          <Button onClick={() => router.push('/tourist')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tourist List
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Tourist Details</h1>
            <p className="text-muted-foreground">View and manage tourist information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tourist Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Tourist profile and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-lg font-semibold">{tourist.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {tourist.phone || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {tourist.location || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Aadhaar Number</label>
                <p className="text-sm font-mono">{tourist.aadhaar}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Digital Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Digital Identity
            </CardTitle>
            <CardDescription>
              Blockchain-verified identity information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Blockchain ID</label>
                <p className="text-sm font-mono break-all">{tourist.blockchainId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Session Token</label>
                <p className="text-sm font-mono break-all">{tourist.sessionToken}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Valid until {new Date(tourist.endDate).toLocaleDateString()}
                </Badge>
                <Badge variant="secondary">
                  ID: {tourist.id}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Digital QR Code
            </CardTitle>
            <CardDescription>
              Blockchain-verified digital identity QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    This QR code contains blockchain ID, session token, and travel metadata.
                  </p>
                  <Button onClick={downloadQRCode}>
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
