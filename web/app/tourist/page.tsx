"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { User, Search, Plus, Eye, Edit, Trash2, Phone, MapPin, Calendar } from "lucide-react"

interface Tourist {
  id: string
  name: string
  phone?: string
  location?: string
  aadhaar: string
  startDate: string
  endDate: string
  createdAt: string
  status: 'active' | 'expired' | 'pending'
}

export default function TouristListPage(): JSX.Element {
  const [tourists, setTourists] = useState<Tourist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchTourists()
  }, [])

  const fetchTourists = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual API
      await new Promise((r) => setTimeout(r, 1000))
      
      // Dummy data for now
      const dummyTourists: Tourist[] = [
        {
          id: "tourist-1",
          name: "John Doe",
          phone: "+91 98765 43210",
          location: "Mumbai, Maharashtra",
          aadhaar: "123456789012",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: "tourist-2",
          name: "Jane Smith",
          phone: "+91 98765 43211",
          location: "Delhi, Delhi",
          aadhaar: "123456789013",
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'expired'
        },
        {
          id: "tourist-3",
          name: "Bob Johnson",
          phone: "+91 98765 43212",
          location: "Bangalore, Karnataka",
          aadhaar: "123456789014",
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
      ]

      setTourists(dummyTourists)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tourists",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'expired': return 'destructive'
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  const filteredTourists = tourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.phone?.includes(searchTerm) ||
                         tourist.aadhaar.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || tourist.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleView = (id: string) => {
    router.push(`/tourist/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/tourist/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this tourist record?")) {
      try {
        // API call to delete tourist
        setTourists(tourists.filter(t => t.id !== id))
        toast({
          title: "Success",
          description: "Tourist record deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete tourist record",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tourist Management</h1>
          <p className="text-muted-foreground">Manage tourist records and digital identities</p>
        </div>
        <Button onClick={() => router.push('/tourist/login')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tourist
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tourists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading tourists...</div>
      ) : (
        <div className="grid gap-4">
          {filteredTourists.map((tourist) => (
            <Card key={tourist.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tourist.name}</CardTitle>
                      <CardDescription>
                        ID: {tourist.id} • Created {new Date(tourist.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(tourist.status) as any}>
                      {tourist.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tourist.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tourist.location || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Valid until {new Date(tourist.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(tourist.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(tourist.id)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(tourist.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTourists.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tourists found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
