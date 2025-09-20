"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, User, Phone, MapPin, Calendar } from "lucide-react"

interface TouristData {
  id: string
  name: string
  phone?: string
  location?: string
  aadhaar: string
  startDate: string
  endDate: string
}

export default function TouristEditPage(): JSX.Element {
  const params = useParams()
  const router = useRouter()
  const [tourist, setTourist] = useState<TouristData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const touristId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    aadhaar: "",
    startDate: "",
    endDate: ""
  })

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
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }

      setTourist(dummyData)
      setFormData({
        name: dummyData.name,
        phone: dummyData.phone || "",
        location: dummyData.location || "",
        aadhaar: dummyData.aadhaar,
        startDate: dummyData.startDate,
        endDate: dummyData.endDate
      })
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.aadhaar.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name and Aadhaar number.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      // Simulate API call - replace with actual API
      await new Promise((r) => setTimeout(r, 1000))
      
      toast({
        title: "Success",
        description: "Tourist information updated successfully.",
      })
      
      router.push(`/tourist/${touristId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tourist information.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Tourist</h1>
          <p className="text-muted-foreground">Update tourist information and details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update tourist's personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="aadhaar" className="text-sm font-medium">
                  Aadhaar Number *
                </label>
                <Input
                  id="aadhaar"
                  value={formData.aadhaar}
                  onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                  placeholder="Enter Aadhaar number"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Travel Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Travel Dates
              </CardTitle>
              <CardDescription>
                Set travel validity period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
