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

type Tourist = {
  id: string;
  digitalId: string;
  name: string;
  status: string;

  // Basic Indian tourist fields
  phone?: string;
  location?: string;
  aadhaar?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;

  // Extended fields
  nationality?: string;
  age?: number;
  gender?: string;
  checkInDate?: string;
  lastSeen?: string;
  currentLocation?: string;
  safetyScore?: number;
  contactNumber?: string;
  email?: string;
  emergencyContact?: string;
  plannedDeparture?: string;
  visitPurpose?: string;
  accommodationType?: string;
  groupSize?: number;
};


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
      
const dummyTourists = [
    {
        id: "tourist-47",
        digitalId: "IND901347",
        name: "Aarav Sharma",
        nationality: "India",
        phone: "+91 98765-43210",
        contactNumber: "+91 98765-43210",
        emergencyContact: "+91 98765-43211 (Priya Sharma)",
        location: "Tawang, Arunachal Pradesh",
        aadhaar: "123456789020",
        startDate: "2025-09-15",
        endDate: "2025-09-28",
        createdAt: "2025-09-15T00:00:00.000Z",
        status: 'active',
        age: 26,
        gender: "Male",
        checkInDate: "2025-09-15",
        lastSeen: "2 hours ago",
        currentLocation: "Tawang, Arunachal Pradesh",
        safetyScore: 94,
        email: "aarav.sharma@email.com",
        plannedDeparture: "2025-09-28",
        visitPurpose: "Cultural Tourism",
        accommodationType: "Hotel",
        groupSize: 2
    },
    {
        id: "tourist-48",
        digitalId: "IND901348",
        name: "Aditya Singh",
        nationality: "India",
        phone: "+91 98765-43212",
        contactNumber: "+91 98765-43212",
        emergencyContact: "+91 98765-43213 (Kavita Singh)",
        location: "Kaziranga National Park, Assam",
        aadhaar: "123456789021",
        startDate: "2025-09-20",
        endDate: "2025-10-10",
        createdAt: "2025-09-20T00:00:00.000Z",
        status: 'pending',
        age: 33,
        gender: "Male",
        checkInDate: "2025-09-20",
        lastSeen: "N/A",
        currentLocation: "Kaziranga National Park, Assam",
        safetyScore: 89,
        email: "aditya.singh@email.com",
        plannedDeparture: "2025-10-10",
        visitPurpose: "Business",
        accommodationType: "Service Apartment",
        groupSize: 1
    },
    {
        id: "tourist-49",
        digitalId: "IND901349",
        name: "Shreya Roy",
        nationality: "India",
        phone: "+91 98765-43214",
        contactNumber: "+91 98765-43214",
        emergencyContact: "+91 98765-43215 (Ankit Roy)",
        location: "Shillong, Meghalaya",
        aadhaar: "123456789022",
        startDate: "2025-09-05",
        endDate: "2025-09-25",
        createdAt: "2025-09-05T00:00:00.000Z",
        status: 'active',
        age: 22,
        gender: "Female",
        checkInDate: "2025-09-05",
        lastSeen: "45 minutes ago",
        currentLocation: "Shillong, Meghalaya",
        safetyScore: 91,
        email: "shreya.roy@email.com",
        plannedDeparture: "2025-09-25",
        visitPurpose: "Relaxation",
        accommodationType: "Resort",
        groupSize: 3
    },
    {
        id: "tourist-50",
        digitalId: "IND901350",
        name: "Manish Kumar",
        nationality: "India",
        phone: "+91 98765-43216",
        contactNumber: "+91 98765-43216",
        emergencyContact: "+91 98765-43217 (Anjali Kumar)",
        location: "Loktak Lake, Manipur",
        aadhaar: "123456789023",
        startDate: "2025-09-01",
        endDate: "2025-09-14",
        createdAt: "2025-09-01T00:00:00.000Z",
        status: 'departed',
        age: 55,
        gender: "Male",
        checkInDate: "2025-09-01",
        lastSeen: "1 week ago",
        currentLocation: "Loktak Lake, Manipur",
        safetyScore: 80,
        email: "manish.kumar@email.com",
        plannedDeparture: "2025-09-14",
        visitPurpose: "Medical Tourism",
        accommodationType: "Homestay",
        groupSize: 1
    },
    {
        id: "tourist-51",
        digitalId: "IND901351",
        name: "Prakash Patel",
        nationality: "India",
        phone: "+91 98765-43218",
        contactNumber: "+91 98765-43218",
        emergencyContact: "+91 98765-43219 (Deepa Patel)",
        location: "Aizawl, Mizoram",
        aadhaar: "123456789024",
        startDate: "2025-09-18",
        endDate: "2025-10-05",
        createdAt: "2025-09-18T00:00:00.000Z",
        status: 'active',
        age: 41,
        gender: "Male",
        checkInDate: "2025-09-18",
        lastSeen: "15 minutes ago",
        currentLocation: "Aizawl, Mizoram",
        safetyScore: 96,
        email: "prakash.patel@email.com",
        plannedDeparture: "2025-10-05",
        visitPurpose: "Historical Sites",
        accommodationType: "Guest House",
        groupSize: 2
    },
    {
        id: "tourist-52",
        digitalId: "IND901352",
        name: "Nandini Rao",
        nationality: "India",
        phone: "+91 98765-43220",
        contactNumber: "+91 98765-43220",
        emergencyContact: "+91 98765-43221 (Ramesh Rao)",
        location: "Gangtok, Sikkim",
        aadhaar: "123456789025",
        startDate: "2025-09-22",
        endDate: "2025-10-15",
        createdAt: "2025-09-22T00:00:00.000Z",
        status: 'active',
        age: 29,
        gender: "Female",
        checkInDate: "2025-09-22",
        lastSeen: "Just now",
        currentLocation: "Gangtok, Sikkim",
        safetyScore: 93,
        email: "nandini.rao@email.com",
        plannedDeparture: "2025-10-15",
        visitPurpose: "Religious Pilgrimage",
        accommodationType: "Hotel",
        groupSize: 1
    },
    {
        id: "tourist-53",
        digitalId: "IND901353",
        name: "Arjun Mehta",
        nationality: "India",
        phone: "+91 98765-43222",
        contactNumber: "+91 98765-43222",
        emergencyContact: "+91 98765-43223 (Sunita Mehta)",
        location: "Cherrapunji, Meghalaya",
        aadhaar: "123456789026",
        startDate: "2025-09-17",
        endDate: "2025-10-01",
        createdAt: "2025-09-17T00:00:00.000Z",
        status: 'alert',
        age: 31,
        gender: "Male",
        checkInDate: "2025-09-17",
        lastSeen: "2 hours ago",
        currentLocation: "Cherrapunji, Meghalaya",
        safetyScore: 78,
        email: "arjun.mehta@email.com",
        plannedDeparture: "2025-10-01",
        visitPurpose: "Photography",
        accommodationType: "Hostel",
        groupSize: 2
    },
    {
        id: "tourist-54",
        digitalId: "IND901354",
        name: "Zoya Khan",
        nationality: "India",
        phone: "+91 98765-43224",
        contactNumber: "+91 98765-43224",
        emergencyContact: "+91 98765-43225 (Imran Khan)",
        location: "Kohima, Nagaland",
        aadhaar: "123456789027",
        startDate: "2025-09-19",
        endDate: "2025-09-21",
        createdAt: "2025-09-19T00:00:00.000Z",
        status: 'active',
        age: 50,
        gender: "Female",
        checkInDate: "2025-09-19",
        lastSeen: "1 hour ago",
        currentLocation: "Kohima, Nagaland",
        safetyScore: 98,
        email: "zoya.khan@email.com",
        plannedDeparture: "2025-09-21",
        visitPurpose: "Historical Sites",
        accommodationType: "Hotel",
        groupSize: 4
    },
    {
        id: "tourist-55",
        digitalId: "IND901355",
        name: "Rohan Kumar",
        nationality: "India",
        phone: "+91 98765-43226",
        contactNumber: "+91 98765-43226",
        emergencyContact: "+91 98765-43227 (Pooja Kumar)",
        location: "Pelling, Sikkim",
        aadhaar: "123456789028",
        startDate: "2025-09-25",
        endDate: "2025-10-10",
        createdAt: "2025-09-25T00:00:00.000Z",
        status: 'pending',
        age: 44,
        gender: "Male",
        checkInDate: "2025-09-25",
        lastSeen: "N/A",
        currentLocation: "Pelling, Sikkim",
        safetyScore: 90,
        email: "rohan.kumar@email.com",
        plannedDeparture: "2025-10-10",
        visitPurpose: "Scenic Tour",
        accommodationType: "Houseboat",
        groupSize: 2
    },
    {
        id: "tourist-56",
        digitalId: "IND901356",
        name: "Ananya Patel",
        nationality: "India",
        phone: "+91 98765-43228",
        contactNumber: "+91 98765-43228",
        emergencyContact: "+91 98765-43229 (Sanjay Patel)",
        location: "Umiam Lake, Meghalaya",
        aadhaar: "123456789029",
        startDate: "2025-09-20",
        endDate: "2025-10-05",
        createdAt: "2025-09-20T00:00:00.000Z",
        status: 'active',
        age: 27,
        gender: "Female",
        checkInDate: "2025-09-20",
        lastSeen: "30 minutes ago",
        currentLocation: "Umiam Lake, Meghalaya",
        safetyScore: 97,
        email: "ananya.patel@email.com",
        plannedDeparture: "2025-10-05",
        visitPurpose: "Historical Sites",
        accommodationType: "Homestay",
        groupSize: 1
    }
];


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
                         tourist.aadhaar?.includes(searchTerm)
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
                        ID: {tourist.id} • Created {new Date(tourist.createdAt as string).toLocaleDateString()}
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
                      {/* @ts-ignore */}
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
