"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Eye, Search, Calendar, User, MapPin, Clock, Shield } from "lucide-react"

interface EFir {
  id: string
  firNumber: string
  digitalId: string
  incidentType: "theft" | "assault" | "fraud" | "harassment" | "vandalism" | "missing_person"
  status: "filed" | "under_investigation" | "closed" | "transferred"
  priority: "high" | "medium" | "low"
  filedDate: string
  incidentDate: string
  location: {
    address: string
    policeStation: string
    district: string
  }
  complainant: {
    name: string
    nationality: string
    phone: string
    digitalId: string
  }
  officer: {
    name: string
    badge: string
    station: string
  }
  description: string
  evidence: string[]
  witnesses: number
  compensation?: number
}

const mockEFirs: EFir[] = [
  {
    id: "EFIR001",
    firNumber: "FIR/2024/ASS/001234",
    digitalId: "IND789012",
    incidentType: "theft",
    status: "under_investigation",
    priority: "high",
    filedDate: "2024-12-09T10:30:00Z",
    incidentDate: "2024-12-09T09:15:00Z",
    location: {
      address: "Dispur, Guwahati",
      policeStation: "Dispur Police Station",
      district: "Assam",
    },
    complainant: {
      name: "Sarah Johnson",
      nationality: "USA",
      phone: "+1-555-0123",
      digitalId: "IND789012",
    },
    officer: {
      name: "Inspector Raj Kumar",
      badge: "ASS001234",
      station: "Dispur PS",
    },
    description: "Tourist reported theft of passport, wallet, and mobile phone from hotel room",
    evidence: ["CCTV Footage", "Hotel Records", "Witness Statements"],
    witnesses: 2,
    compensation: 15000,
  },
  {
    id: "EFIR002",
    firNumber: "FIR/2024/MEG/005678",
    digitalId: "IND234567",
    incidentType: "fraud",
    status: "closed",
    priority: "medium",
    filedDate: "2024-12-08T14:20:00Z",
    incidentDate: "2024-12-08T12:00:00Z",
    location: {
      address: "Shillong Market, Shillong",
      policeStation: "Police Bazaar Police Station",
      district: "Meghalaya",
    },
    complainant: {
      name: "Hans Mueller",
      nationality: "Germany",
      phone: "+49-123-456789",
      digitalId: "IND234567",
    },
    officer: {
      name: "Sub-Inspector Priya Sharma",
      badge: "MEG002345",
      station: "Police Bazaar PS",
    },
    description: "Tourist charged excessive amount for taxi ride, fake meter used",
    evidence: ["Receipt", "GPS Tracking", "Taxi Registration"],
    witnesses: 1,
    compensation: 2500,
  },
  {
    id: "EFIR003",
    firNumber: "FIR/2024/ARB/003456",
    digitalId: "IND345678",
    incidentType: "harassment",
    status: "filed",
    priority: "high",
    filedDate: "2024-12-07T16:45:00Z",
    incidentDate: "2024-12-07T15:30:00Z",
    location: {
      address: "Kaziranga National Park, Assam",
      policeStation: "Kaziranga PS",
      district: "Assam",
    },
    complainant: {
      name: "Emma Wilson",
      nationality: "Australia",
      phone: "+61-400-123456",
      digitalId: "IND345678",
    },
    officer: {
      name: "Inspector Vikram Singh",
      badge: "ARB003456",
      station: "Kaziranga PS",
    },
    description: "Female tourist harassed by group of local vendors, inappropriate behavior reported",
    evidence: ["Mobile Video", "Witness Statements", "CCTV Footage"],
    witnesses: 3,
  },
  {
    id: "EFIR004",
    firNumber: "FIR/2024/MLR/007890",
    digitalId: "IND456789",
    incidentType: "assault",
    status: "transferred",
    priority: "high",
    filedDate: "2024-12-06T11:15:00Z",
    incidentDate: "2024-12-06T02:30:00Z",
    location: {
      address: "Tawang Monastery, Arunachal Pradesh",
      policeStation: "Tawang PS",
      district: "Arunachal Pradesh",
    },
    complainant: {
      name: "John Smith",
      nationality: "UK",
      phone: "+44-7700-900123",
      digitalId: "IND456789",
    },
    officer: {
      name: "Inspector Maria Fernandes",
      badge: "MLR004567",
      station: "Tawang PS",
    },
    description: "Tourist assaulted during late night visit, medical treatment required",
    evidence: ["Medical Report", "CCTV Footage", "Witness Statements"],
    witnesses: 1,
    compensation: 25000,
  },
  {
    id: "EFIR005",
    firNumber: "FIR/2024/NAG/009012",
    digitalId: "IND567890",
    incidentType: "missing_person",
    status: "closed",
    priority: "high",
    filedDate: "2024-12-05T08:00:00Z",
    incidentDate: "2024-12-04T18:00:00Z",
    location: {
      address: "Dimapur Hills, Nagaland",
      policeStation: "Dimapur PS",
      district: "Nagaland",
    },
    complainant: {
      name: "Lisa Chen",
      nationality: "Singapore",
      phone: "+65-9123-4567",
      digitalId: "IND567890",
    },
    officer: {
      name: "Inspector Ravi Menon",
      badge: "NAG005678",
      station: "Dimapur PS",
    },
    description: "Tourist went missing during trekking expedition, found safe after 18 hours",
    evidence: ["GPS Tracking", "Search Records", "Rescue Team Reports"],
    witnesses: 4,
  },
  {
    id: "EFIR006",
    firNumber: "FIR/2024/SIK/002345",
    digitalId: "IND246813",
    incidentType: "vandalism",
    status: "under_investigation",
    priority: "medium",
    filedDate: "2024-12-04T13:20:00Z",
    incidentDate: "2024-12-04T11:45:00Z",
    location: {
      address: "Gangtok Market, Sikkim",
      policeStation: "Gangtok PS",
      district: "Sikkim",
    },
    complainant: {
      name: "Pierre Dubois",
      nationality: "France",
      phone: "+33-1-2345-6789",
      digitalId: "IND246813",
    },
    officer: {
      name: "Inspector Tenzin Dorjee",
      badge: "SIK003456",
      station: "Gangtok PS",
    },
    description: "Tourist's rental vehicle vandalized while parked at market",
    evidence: ["Vehicle Damage Photos", "CCTV Footage", "Witness Statements"],
    witnesses: 2,
    compensation: 8500,
  },
  {
    id: "EFIR007",
    firNumber: "FIR/2024/MIZ/004567",
    digitalId: "IND135792",
    incidentType: "theft",
    status: "closed",
    priority: "high",
    filedDate: "2024-12-03T09:15:00Z",
    incidentDate: "2024-12-03T07:30:00Z",
    location: {
      address: "Aizawl Central Market, Mizoram",
      policeStation: "Aizawl PS",
      district: "Mizoram",
    },
    complainant: {
      name: "Lisa Chen",
      nationality: "Singapore",
      phone: "+65-9123-4567",
      digitalId: "IND135792",
    },
    officer: {
      name: "Inspector Lalrinpuia",
      badge: "MIZ004567",
      station: "Aizawl PS",
    },
    description: "Tourist's camera equipment stolen from backpack in crowded market",
    evidence: ["Market CCTV", "Witness Statements", "Equipment Serial Numbers"],
    witnesses: 3,
    compensation: 45000,
  },
  {
    id: "EFIR008",
    firNumber: "FIR/2024/TRP/006789",
    digitalId: "IND975310",
    incidentType: "harassment",
    status: "filed",
    priority: "medium",
    filedDate: "2024-12-02T16:30:00Z",
    incidentDate: "2024-12-02T14:20:00Z",
    location: {
      address: "Agartala Railway Station, Tripura",
      policeStation: "Agartala PS",
      district: "Tripura",
    },
    complainant: {
      name: "Hans Mueller",
      nationality: "Germany",
      phone: "+49-30-1234-5678",
      digitalId: "IND975310",
    },
    officer: {
      name: "Inspector Subhash Roy",
      badge: "TRP005678",
      station: "Agartala PS",
    },
    description: "Tourist harassed by touts at railway station, aggressive behavior reported",
    evidence: ["Station CCTV", "Witness Statements", "Mobile Recording"],
    witnesses: 2,
  },
  {
    id: "EFIR009",
    firNumber: "FIR/2024/MNL/008901",
    digitalId: "IND864209",
    incidentType: "fraud",
    status: "under_investigation",
    priority: "high",
    filedDate: "2024-12-01T11:45:00Z",
    incidentDate: "2024-12-01T09:30:00Z",
    location: {
      address: "Imphal Airport, Manipur",
      policeStation: "Imphal PS",
      district: "Manipur",
    },
    complainant: {
      name: "Maria Rodriguez",
      nationality: "Spain",
      phone: "+34-91-123-4567",
      digitalId: "IND864209",
    },
    officer: {
      name: "Inspector Thangjam Singh",
      badge: "MNL006789",
      station: "Imphal PS",
    },
    description: "Tourist charged fake airport tax by unauthorized personnel",
    evidence: ["Airport CCTV", "Receipt Analysis", "Official Tax Records"],
    witnesses: 1,
    compensation: 3500,
  },
  {
    id: "EFIR010",
    firNumber: "FIR/2024/ARB/010123",
    digitalId: "IND642085",
    incidentType: "assault",
    status: "transferred",
    priority: "high",
    filedDate: "2024-11-30T14:20:00Z",
    incidentDate: "2024-11-30T12:15:00Z",
    location: {
      address: "Bomdila, Arunachal Pradesh",
      policeStation: "Bomdila PS",
      district: "Arunachal Pradesh",
    },
    complainant: {
      name: "David Kim",
      nationality: "South Korea",
      phone: "+82-10-1234-5678",
      digitalId: "IND642085",
    },
    officer: {
      name: "Inspector Norbu Tsering",
      badge: "ARB007890",
      station: "Bomdila PS",
    },
    description: "Tourist physically assaulted during trekking group dispute",
    evidence: ["Medical Report", "Group Statements", "Trekking Guide Report"],
    witnesses: 4,
    compensation: 30000,
  },
  {
    id: "EFIR011",
    firNumber: "FIR/2024/MEG/011234",
    digitalId: "IND357951",
    incidentType: "theft",
    status: "under_investigation",
    priority: "medium",
    filedDate: "2024-11-29T10:15:00Z",
    incidentDate: "2024-11-29T08:30:00Z",
    location: {
      address: "Nohkalikai Falls, Cherrapunji, Meghalaya",
      policeStation: "Cherrapunji PS",
      district: "Meghalaya",
    },
    complainant: {
      name: "Sofia Andersson",
      nationality: "Sweden",
      phone: "+46-8-123-4567",
      digitalId: "IND357951",
    },
    officer: {
      name: "Inspector Rina Khonglah",
      badge: "MEG003456",
      station: "Cherrapunji PS",
    },
    description: "Tourist's photography equipment stolen at waterfall viewpoint",
    evidence: ["CCTV Footage", "Witness Statements", "Equipment Serial Numbers"],
    witnesses: 2,
    compensation: 25000,
  },
  {
    id: "EFIR012",
    firNumber: "FIR/2024/SIK/012345",
    digitalId: "IND579246",
    incidentType: "harassment",
    status: "closed",
    priority: "medium",
    filedDate: "2024-11-28T15:30:00Z",
    incidentDate: "2024-11-28T13:45:00Z",
    location: {
      address: "Tsomgo Lake, Gangtok, Sikkim",
      policeStation: "Gangtok PS",
      district: "Sikkim",
    },
    complainant: {
      name: "Isabella Rodriguez",
      nationality: "Mexico",
      phone: "+52-55-1234-5678",
      digitalId: "IND579246",
    },
    officer: {
      name: "Inspector Tenzin Dorjee",
      badge: "SIK004567",
      station: "Gangtok PS",
    },
    description: "Female tourist harassed by local vendors at sacred lake",
    evidence: ["Mobile Video", "Witness Statements", "Lake CCTV"],
    witnesses: 3,
    compensation: 5000,
  },
  {
    id: "EFIR013",
    firNumber: "FIR/2024/ASS/013456",
    digitalId: "IND680357",
    incidentType: "fraud",
    status: "under_investigation",
    priority: "high",
    filedDate: "2024-11-27T11:20:00Z",
    incidentDate: "2024-11-27T09:15:00Z",
    location: {
      address: "Kaziranga National Park, Assam",
      policeStation: "Kaziranga PS",
      district: "Assam",
    },
    complainant: {
      name: "James Wilson",
      nationality: "Canada",
      phone: "+1-416-123-4567",
      digitalId: "IND680357",
    },
    officer: {
      name: "Inspector Bikram Singh",
      badge: "ASS004567",
      station: "Kaziranga PS",
    },
    description: "Tourist charged fake entry fees by unauthorized personnel",
    evidence: ["Receipt Analysis", "Park Records", "Official Fee Structure"],
    witnesses: 1,
    compensation: 8000,
  },
  {
    id: "EFIR014",
    firNumber: "FIR/2024/MLR/014567",
    digitalId: "IND791468",
    incidentType: "vandalism",
    status: "filed",
    priority: "medium",
    filedDate: "2024-11-26T16:45:00Z",
    incidentDate: "2024-11-26T14:20:00Z",
    location: {
      address: "Kangla Fort, Imphal, Manipur",
      policeStation: "Imphal PS",
      district: "Manipur",
    },
    complainant: {
      name: "Aisha Patel",
      nationality: "United Kingdom",
      phone: "+44-20-7946-1234",
      digitalId: "IND791468",
    },
    officer: {
      name: "Inspector Thangjam Singh",
      badge: "MLR005678",
      station: "Imphal PS",
    },
    description: "Historical monument vandalized during tourist visit",
    evidence: ["Damage Photos", "Fort CCTV", "Witness Statements"],
    witnesses: 2,
  },
  {
    id: "EFIR015",
    firNumber: "FIR/2024/NAG/015678",
    digitalId: "IND802579",
    incidentType: "missing_person",
    status: "closed",
    priority: "high",
    filedDate: "2024-11-25T08:00:00Z",
    incidentDate: "2024-11-24T16:30:00Z",
    location: {
      address: "Kohima Hills, Nagaland",
      policeStation: "Kohima PS",
      district: "Nagaland",
    },
    complainant: {
      name: "Lars Nielsen",
      nationality: "Denmark",
      phone: "+45-12-34-56-78",
      digitalId: "IND802579",
    },
    officer: {
      name: "Inspector Ravi Menon",
      badge: "NAG006789",
      station: "Kohima PS",
    },
    description: "Tourist went missing during hill trekking, found safe after 12 hours",
    evidence: ["GPS Tracking", "Search Records", "Rescue Team Reports"],
    witnesses: 3,
  }
]


const incidentTypeColors = {
  theft: "bg-red-100 text-red-800",
  assault: "bg-red-100 text-red-800",
  fraud: "bg-orange-100 text-orange-800",
  harassment: "bg-purple-100 text-purple-800",
  vandalism: "bg-yellow-100 text-yellow-800",
  missing_person: "bg-blue-100 text-blue-800",
}

const statusColors = {
  filed: "bg-blue-100 text-blue-800",
  under_investigation: "bg-yellow-100 text-yellow-800",
  closed: "bg-green-100 text-green-800",
  transferred: "bg-gray-100 text-gray-800",
}

const priorityColors = {
  high: "bg-red-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-green-500 text-white",
}

export default function EFirHistoryComponent() {
  const [efirs, setEfirs] = useState<EFir[]>(mockEFirs)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  const filteredEfirs = efirs.filter((efir) => {
    const matchesSearch =
      efir.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      efir.digitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      efir.complainant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      efir.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || efir.incidentType === filterType
    const matchesStatus = filterStatus === "all" || efir.status === filterStatus
    const matchesPriority = filterPriority === "all" || efir.priority === filterPriority

    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-FIR History</h1>
          <p className="text-gray-600 mt-1">Digital First Information Reports for tourist incidents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <FileText className="w-4 h-4 mr-2" />
            New E-FIR
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total E-FIRs</p>
                <p className="text-2xl font-bold text-gray-900">{efirs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Investigation</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {efirs.filter((e) => e.status === "under_investigation").length}
                </p>
              </div>
              <Search className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Closed Cases</p>
                <p className="text-2xl font-bold text-green-600">{efirs.filter((e) => e.status === "closed").length}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold text-emerald-600">2.3 days</p>
              </div>
              <Clock className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by FIR Number, Digital ID, Name, or Location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Incident Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="assault">Assault</SelectItem>
                <SelectItem value="fraud">Fraud</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="vandalism">Vandalism</SelectItem>
                <SelectItem value="missing_person">Missing Person</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="filed">Filed</SelectItem>
                <SelectItem value="under_investigation">Under Investigation</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="transferred">Transferred</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* E-FIR List */}
      <div className="space-y-4">
        {filteredEfirs.map((efir) => (
          <Card key={efir.id} className="border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* E-FIR Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={`${incidentTypeColors[efir.incidentType]} font-medium`}>
                      {efir.incidentType.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Badge className={statusColors[efir.status]}>{efir.status.replace("_", " ").toUpperCase()}</Badge>
                    <Badge className={priorityColors[efir.priority]}>{efir.priority.toUpperCase()}</Badge>
                    <span className="text-sm text-gray-500">FIR: {efir.firNumber}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{efir.complainant.name}</span>
                        <span className="text-sm text-gray-500">({efir.complainant.nationality})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Digital ID: {efir.digitalId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Officer: {efir.officer.name}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{efir.location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Filed: {new Date(efir.filedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Incident: {new Date(efir.incidentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{efir.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <span>
                      <strong>Evidence:</strong> {efir.evidence.length} items
                    </span>
                    <span>
                      <strong>Witnesses:</strong> {efir.witnesses}
                    </span>
                    {efir.compensation && (
                      <span>
                        <strong>Compensation:</strong> ₹{efir.compensation.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full E-FIR
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEfirs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No E-FIRs found</h3>
            <p className="text-gray-500">No E-FIRs match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
