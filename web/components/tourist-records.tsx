"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, MapPin, Clock, Phone, Mail, Calendar, Flag } from "lucide-react"

interface TouristRecord {
  id: string
  digitalId: string
  name: string
  nationality: string
  age: number
  gender: "Male" | "Female" | "Other"
  checkInDate: string
  lastSeen: string
  currentLocation: string
  safetyScore: number
  status: "active" | "inactive" | "alert" | "departed"
  contactNumber: string
  email: string
  emergencyContact: string
  plannedDeparture: string
  visitPurpose: string
  accommodationType: string
  groupSize: number
  avatar?: string
}

const mockTouristRecords: TouristRecord[] = [
  {
    id: "1",
    digitalId: "IND789012",
    name: "Sarah Johnson",
    nationality: "United States",
    age: 28,
    gender: "Female",
    checkInDate: "2024-01-15",
    lastSeen: "2 hours ago",
    currentLocation: "Guwahati, Assam",
    safetyScore: 85,
    status: "alert",
    contactNumber: "+1-555-0123",
    email: "sarah.j@email.com",
    emergencyContact: "+1-555-0124 (John Johnson)",
    plannedDeparture: "2024-01-25",
    visitPurpose: "Tourism",
    accommodationType: "Hotel",
    groupSize: 2,
  },
  {
    id: "2",
    digitalId: "IND123456",
    name: "Marco Silva",
    nationality: "Brazil",
    age: 35,
    gender: "Male",
    checkInDate: "2024-01-12",
    lastSeen: "30 minutes ago",
    currentLocation: "Shillong, Meghalaya",
    safetyScore: 92,
    status: "active",
    contactNumber: "+55-11-98765-4321",
    email: "marco.silva@email.com",
    emergencyContact: "+55-11-98765-4322 (Maria Silva)",
    plannedDeparture: "2024-01-28",
    visitPurpose: "Business",
    accommodationType: "Resort",
    groupSize: 1,
  },
  {
    id: "3",
    digitalId: "IND345678",
    name: "Yuki Tanaka",
    nationality: "Japan",
    age: 24,
    gender: "Female",
    checkInDate: "2024-01-18",
    lastSeen: "1 hour ago",
    currentLocation: "Imphal, Manipur",
    safetyScore: 96,
    status: "active",
    contactNumber: "+81-90-1234-5678",
    email: "yuki.tanaka@email.com",
    emergencyContact: "+81-90-1234-5679 (Hiroshi Tanaka)",
    plannedDeparture: "2024-02-02",
    visitPurpose: "Cultural Exchange",
    accommodationType: "Hostel",
    groupSize: 4,
  },
  {
    id: "4",
    digitalId: "IND901234",
    name: "Ahmed Hassan",
    nationality: "Egypt",
    age: 42,
    gender: "Male",
    checkInDate: "2024-01-10",
    lastSeen: "15 minutes ago",
    currentLocation: "Aizawl, Mizoram",
    safetyScore: 88,
    status: "active",
    contactNumber: "+20-10-1234-5678",
    email: "ahmed.hassan@email.com",
    emergencyContact: "+20-10-1234-5679 (Fatima Hassan)",
    plannedDeparture: "2024-01-30",
    visitPurpose: "Medical Tourism",
    accommodationType: "Hotel",
    groupSize: 3,
  },
  {
    id: "5",
    digitalId: "IND567890",
    name: "Emma Thompson",
    nationality: "United Kingdom",
    age: 31,
    gender: "Female",
    checkInDate: "2024-01-20",
    lastSeen: "45 minutes ago",
    currentLocation: "Gangtok, Sikkim",
    safetyScore: 94,
    status: "active",
    contactNumber: "+44-20-7946-0958",
    email: "emma.thompson@email.com",
    emergencyContact: "+44-20-7946-0959 (David Thompson)",
    plannedDeparture: "2024-02-05",
    visitPurpose: "Adventure Tourism",
    accommodationType: "Homestay",
    groupSize: 2,
  },
]


const statusConfig = {
  active: { color: "bg-emerald-100 text-emerald-800", label: "Active" },
  inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
  alert: { color: "bg-red-100 text-red-800", label: "Alert" },
  departed: { color: "bg-blue-100 text-blue-800", label: "Departed" },
}

function TouristDetailDialog({ tourist }: { tourist: TouristRecord }) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={tourist.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {tourist.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{tourist.name}</div>
            <div className="text-sm text-muted-foreground">Digital ID: {tourist.digitalId}</div>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nationality:</span>
                <div className="flex items-center gap-1">
                  <Flag className="h-3 w-3" />
                  {tourist.nationality}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age:</span>
                <span>{tourist.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <span>{tourist.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Group Size:</span>
                <span>{tourist.groupSize} person(s)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>{tourist.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span>{tourist.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-3 w-3 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Emergency Contact</div>
                  <span>{tourist.emergencyContact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Visit Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose:</span>
                <span>{tourist.visitPurpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accommodation:</span>
                <span>{tourist.accommodationType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Check-in:</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(tourist.checkInDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Planned Departure:</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(tourist.plannedDeparture).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Current Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location:</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {tourist.currentLocation}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Seen:</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {tourist.lastSeen}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Safety Score:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${tourist.safetyScore >= 90 ? "bg-emerald-500" : tourist.safetyScore >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${tourist.safetyScore}%` }}
                    />
                  </div>
                  <span className="font-medium">{tourist.safetyScore}%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary" className={statusConfig[tourist.status].color}>
                  {statusConfig[tourist.status].label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export function TouristRecords() {
  const [records, setRecords] = useState(mockTouristRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [nationalityFilter, setNationalityFilter] = useState("all")

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.digitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.currentLocation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesNationality = nationalityFilter === "all" || record.nationality === nationalityFilter

    return matchesSearch && matchesStatus && matchesNationality
  })

  const uniqueNationalities = Array.from(new Set(records.map((r) => r.nationality)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Tourist Records</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{filteredRecords.length} records</Badge>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, Digital ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
              <SelectItem value="departed">Departed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Nationality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueNationalities.map((nationality) => (
                <SelectItem key={nationality} value={nationality}>
                  {nationality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tourist</TableHead>
                <TableHead>Digital ID</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Safety Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={record.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {record.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {record.age} years, {record.gender}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{record.digitalId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Flag className="h-3 w-3" />
                      {record.nationality}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {record.currentLocation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {record.lastSeen}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${record.safetyScore >= 90 ? "bg-emerald-500" : record.safetyScore >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${record.safetyScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{record.safetyScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusConfig[record.status].color}>
                      {statusConfig[record.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <TouristDetailDialog tourist={record} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No tourist records found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
