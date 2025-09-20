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
      
      const dummyTourists: Tourist[] = [
        {
          id: "tourist-1",
          digitalId: "123456789012",
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
          digitalId: "123456789013",
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
          digitalId: "123456789014",
          name: "Bob Johnson",
          phone: "+91 98765 43212",
          location: "Bangalore, Karnataka",
          aadhaar: "123456789014",
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          status: 'pending'
        },
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
  {
    id: "6",
    digitalId: "IND246813",
    name: "Pierre Dubois",
    nationality: "France",
    age: 29,
    gender: "Male",
    checkInDate: "2024-01-22",
    lastSeen: "3 hours ago",
    currentLocation: "Tawang, Arunachal Pradesh",
    safetyScore: 91,
    status: "active",
    contactNumber: "+33-1-2345-6789",
    email: "pierre.dubois@email.com",
    emergencyContact: "+33-1-2345-6790 (Marie Dubois)",
    plannedDeparture: "2024-02-10",
    visitPurpose: "Photography",
    accommodationType: "Guest House",
    groupSize: 1,
  },
  {
    id: "7",
    digitalId: "IND135792",
    name: "Lisa Chen",
    nationality: "Singapore",
    age: 26,
    gender: "Female",
    checkInDate: "2024-01-19",
    lastSeen: "1 hour ago",
    currentLocation: "Kohima, Nagaland",
    safetyScore: 89,
    status: "active",
    contactNumber: "+65-9123-4567",
    email: "lisa.chen@email.com",
    emergencyContact: "+65-9123-4568 (James Chen)",
    plannedDeparture: "2024-02-01",
    visitPurpose: "Cultural Research",
    accommodationType: "Hostel",
    groupSize: 3,
  },
  {
    id: "8",
    digitalId: "IND975310",
    name: "Hans Mueller",
    nationality: "Germany",
    age: 38,
    gender: "Male",
    checkInDate: "2024-01-14",
    lastSeen: "4 hours ago",
    currentLocation: "Dimapur, Nagaland",
    safetyScore: 95,
    status: "active",
    contactNumber: "+49-30-1234-5678",
    email: "hans.mueller@email.com",
    emergencyContact: "+49-30-1234-5679 (Anna Mueller)",
    plannedDeparture: "2024-01-29",
    visitPurpose: "Adventure Sports",
    accommodationType: "Resort",
    groupSize: 2,
  },
  {
    id: "9",
    digitalId: "IND864209",
    name: "Maria Rodriguez",
    nationality: "Spain",
    age: 33,
    gender: "Female",
    checkInDate: "2024-01-16",
    lastSeen: "2 hours ago",
    currentLocation: "Kaziranga, Assam",
    safetyScore: 87,
    status: "inactive",
    contactNumber: "+34-91-123-4567",
    email: "maria.rodriguez@email.com",
    emergencyContact: "+34-91-123-4568 (Carlos Rodriguez)",
    plannedDeparture: "2024-01-26",
    visitPurpose: "Wildlife Photography",
    accommodationType: "Lodge",
    groupSize: 1,
  },
  {
    id: "10",
    digitalId: "IND642085",
    name: "David Kim",
    nationality: "South Korea",
    age: 27,
    gender: "Male",
    checkInDate: "2024-01-21",
    lastSeen: "30 minutes ago",
    currentLocation: "Loktak Lake, Manipur",
    safetyScore: 93,
    status: "active",
    contactNumber: "+82-10-1234-5678",
    email: "david.kim@email.com",
    emergencyContact: "+82-10-1234-5679 (Min Kim)",
    plannedDeparture: "2024-02-08",
    visitPurpose: "Nature Conservation",
    accommodationType: "Eco Lodge",
    groupSize: 4,
  },
  {
    id: "11",
    digitalId: "IND753190",
    name: "Anna Kowalski",
    nationality: "Poland",
    age: 30,
    gender: "Female",
    checkInDate: "2024-01-17",
    lastSeen: "1 hour ago",
    currentLocation: "Gangtok, Sikkim",
    safetyScore: 90,
    status: "active",
    contactNumber: "+48-22-123-4567",
    email: "anna.kowalski@email.com",
    emergencyContact: "+48-22-123-4568 (Piotr Kowalski)",
    plannedDeparture: "2024-02-03",
    visitPurpose: "Spiritual Tourism",
    accommodationType: "Monastery Guest House",
    groupSize: 1,
  },
  {
    id: "12",
    digitalId: "IND951753",
    name: "Michael O'Connor",
    nationality: "Ireland",
    age: 34,
    gender: "Male",
    checkInDate: "2024-01-13",
    lastSeen: "5 hours ago",
    currentLocation: "Shillong, Meghalaya",
    safetyScore: 88,
    status: "departed",
    contactNumber: "+353-1-234-5678",
    email: "michael.oconnor@email.com",
    emergencyContact: "+353-1-234-5679 (Sarah O'Connor)",
    plannedDeparture: "2024-01-27",
    visitPurpose: "Music Festival",
    accommodationType: "Hostel",
    groupSize: 3,
  },
  {
    id: "13",
    digitalId: "IND357951",
    name: "Sofia Andersson",
    nationality: "Sweden",
    age: 29,
    gender: "Female",
    checkInDate: "2024-01-23",
    lastSeen: "2 hours ago",
    currentLocation: "Cherrapunji, Meghalaya",
    safetyScore: 92,
    status: "active",
    contactNumber: "+46-8-123-4567",
    email: "sofia.andersson@email.com",
    emergencyContact: "+46-8-123-4568 (Erik Andersson)",
    plannedDeparture: "2024-02-15",
    visitPurpose: "Photography",
    accommodationType: "Eco Lodge",
    groupSize: 1,
  },
  {
    id: "14",
    digitalId: "IND468135",
    name: "Rajesh Kumar",
    nationality: "India",
    age: 45,
    gender: "Male",
    checkInDate: "2024-01-21",
    lastSeen: "1 hour ago",
    currentLocation: "Tawang, Arunachal Pradesh",
    safetyScore: 95,
    status: "active",
    contactNumber: "+91-98765-43210",
    email: "rajesh.kumar@email.com",
    emergencyContact: "+91-98765-43211 (Priya Kumar)",
    plannedDeparture: "2024-02-10",
    visitPurpose: "Spiritual Tourism",
    accommodationType: "Monastery Guest House",
    groupSize: 2,
  },
  {
    id: "15",
    digitalId: "IND579246",
    name: "Isabella Rodriguez",
    nationality: "Mexico",
    age: 26,
    gender: "Female",
    checkInDate: "2024-01-24",
    lastSeen: "30 minutes ago",
    currentLocation: "Gangtok, Sikkim",
    safetyScore: 89,
    status: "active",
    contactNumber: "+52-55-1234-5678",
    email: "isabella.rodriguez@email.com",
    emergencyContact: "+52-55-1234-5679 (Carlos Rodriguez)",
    plannedDeparture: "2024-02-20",
    visitPurpose: "Adventure Sports",
    accommodationType: "Mountain Lodge",
    groupSize: 4,
  },
  {
    id: "16",
    digitalId: "IND680357",
    name: "James Wilson",
    nationality: "Canada",
    age: 38,
    gender: "Male",
    checkInDate: "2024-01-19",
    lastSeen: "3 hours ago",
    currentLocation: "Kaziranga, Assam",
    safetyScore: 94,
    status: "active",
    contactNumber: "+1-416-123-4567",
    email: "james.wilson@email.com",
    emergencyContact: "+1-416-123-4568 (Sarah Wilson)",
    plannedDeparture: "2024-02-05",
    visitPurpose: "Wildlife Photography",
    accommodationType: "Forest Lodge",
    groupSize: 1,
  },
  {
    id: "17",
    digitalId: "IND791468",
    name: "Aisha Patel",
    nationality: "United Kingdom",
    age: 31,
    gender: "Female",
    checkInDate: "2024-01-25",
    lastSeen: "45 minutes ago",
    currentLocation: "Imphal, Manipur",
    safetyScore: 87,
    status: "active",
    contactNumber: "+44-20-7946-1234",
    email: "aisha.patel@email.com",
    emergencyContact: "+44-20-7946-1235 (Ravi Patel)",
    plannedDeparture: "2024-02-12",
    visitPurpose: "Cultural Research",
    accommodationType: "Homestay",
    groupSize: 2,
  },
  {
    id: "18",
    digitalId: "IND802579",
    name: "Lars Nielsen",
    nationality: "Denmark",
    age: 33,
    gender: "Male",
    checkInDate: "2024-01-22",
    lastSeen: "1 hour ago",
    currentLocation: "Pelling, Sikkim",
    safetyScore: 91,
    status: "active",
    contactNumber: "+45-12-34-56-78",
    email: "lars.nielsen@email.com",
    emergencyContact: "+45-12-34-56-79 (Anna Nielsen)",
    plannedDeparture: "2024-02-08",
    visitPurpose: "Trekking",
    accommodationType: "Mountain Hut",
    groupSize: 3,
  },
  {
    id: "19",
    digitalId: "IND913680",
    name: "Priya Sharma",
    nationality: "India",
    age: 28,
    gender: "Female",
    checkInDate: "2024-01-26",
    lastSeen: "2 hours ago",
    currentLocation: "Aizawl, Mizoram",
    safetyScore: 93,
    status: "active",
    contactNumber: "+91-98765-54321",
    email: "priya.sharma@email.com",
    emergencyContact: "+91-98765-54322 (Vikram Sharma)",
    plannedDeparture: "2024-02-18",
    visitPurpose: "Cultural Exchange",
    accommodationType: "Local Guest House",
    groupSize: 1,
  },
  {
    id: "20",
    digitalId: "IND024691",
    name: "Thomas Mueller",
    nationality: "Austria",
    age: 42,
    gender: "Male",
    checkInDate: "2024-01-20",
    lastSeen: "4 hours ago",
    currentLocation: "Kohima, Nagaland",
    safetyScore: 90,
    status: "active",
    contactNumber: "+43-1-234-5678",
    email: "thomas.mueller@email.com",
    emergencyContact: "+43-1-234-5679 (Maria Mueller)",
    plannedDeparture: "2024-02-03",
    visitPurpose: "Anthropological Study",
    accommodationType: "Research Center",
    groupSize: 2,
  },
  // Additional Indian tourists
  {
    id: "21",
    digitalId: "IND456789",
    name: "Priya Sharma",
    nationality: "India",
    age: 32,
    gender: "Female",
    checkInDate: "2024-01-18",
    lastSeen: "30 minutes ago",
    currentLocation: "Gangtok, Sikkim",
    safetyScore: 95,
    status: "active",
    contactNumber: "+91-98765-12345",
    email: "priya.sharma@gmail.com",
    emergencyContact: "+91-98765-12346 (Vikram Sharma)",
    plannedDeparture: "2024-02-05",
    visitPurpose: "Adventure Tourism",
    accommodationType: "Mountain Resort",
    groupSize: 1,
  },
  {
    id: "22",
    digitalId: "IND567890",
    name: "Arjun Singh",
    nationality: "India",
    age: 35,
    gender: "Male",
    checkInDate: "2024-01-15",
    lastSeen: "2 hours ago",
    currentLocation: "Kaziranga, Assam",
    safetyScore: 92,
    status: "active",
    contactNumber: "+91-98765-23456",
    email: "arjun.singh@yahoo.com",
    emergencyContact: "+91-98765-23457 (Kavita Singh)",
    plannedDeparture: "2024-02-12",
    visitPurpose: "Wildlife Photography",
    accommodationType: "Jungle Lodge",
    groupSize: 3,
  },
  {
    id: "23",
    digitalId: "IND678901",
    name: "Deepika Reddy",
    nationality: "India",
    age: 29,
    gender: "Female",
    checkInDate: "2024-01-22",
    lastSeen: "45 minutes ago",
    currentLocation: "Shillong, Meghalaya",
    safetyScore: 89,
    status: "active",
    contactNumber: "+91-98765-34567",
    email: "deepika.reddy@outlook.com",
    emergencyContact: "+91-98765-34568 (Ravi Reddy)",
    plannedDeparture: "2024-02-08",
    visitPurpose: "Nature Photography",
    accommodationType: "Eco Resort",
    groupSize: 2,
  },
  {
    id: "24",
    digitalId: "IND789123",
    name: "Rahul Kumar",
    nationality: "India",
    age: 26,
    gender: "Male",
    checkInDate: "2024-01-19",
    lastSeen: "1 hour ago",
    currentLocation: "Tawang, Arunachal Pradesh",
    safetyScore: 87,
    status: "active",
    contactNumber: "+91-98765-45678",
    email: "rahul.kumar@hotmail.com",
    emergencyContact: "+91-98765-45679 (Sunita Kumar)",
    plannedDeparture: "2024-02-15",
    visitPurpose: "Spiritual Journey",
    accommodationType: "Monastery Guest House",
    groupSize: 1,
  },
  {
    id: "25",
    digitalId: "IND890234",
    name: "Kavya Iyer",
    nationality: "India",
    age: 31,
    gender: "Female",
    checkInDate: "2024-01-21",
    lastSeen: "20 minutes ago",
    currentLocation: "Kohima, Nagaland",
    safetyScore: 91,
    status: "active",
    contactNumber: "+91-98765-56789",
    email: "kavya.iyer@gmail.com",
    emergencyContact: "+91-98765-56790 (Suresh Iyer)",
    plannedDeparture: "2024-02-06",
    visitPurpose: "Cultural Exchange",
    accommodationType: "Homestay",
    groupSize: 2,
  },
  {
    id: "26",
    digitalId: "IND901345",
    name: "Vikram Joshi",
    nationality: "India",
    age: 38,
    gender: "Male",
    checkInDate: "2024-01-17",
    lastSeen: "3 hours ago",
    currentLocation: "Imphal, Manipur",
    safetyScore: 86,
    status: "active",
    contactNumber: "+91-98765-67890",
    email: "vikram.joshi@email.com",
    emergencyContact: "+91-98765-67891 (Meera Joshi)",
    plannedDeparture: "2024-02-14",
    visitPurpose: "Historical Research",
    accommodationType: "Heritage Bungalow",
    groupSize: 1,
  },
  {
    id: "27",
    digitalId: "IND012456",
    name: "Ananya Gupta",
    nationality: "India",
    age: 27,
    gender: "Female",
    checkInDate: "2024-01-23",
    lastSeen: "15 minutes ago",
    currentLocation: "Aizawl, Mizoram",
    safetyScore: 93,
    status: "active",
    contactNumber: "+91-98765-78901",
    email: "ananya.gupta@yahoo.com",
    emergencyContact: "+91-98765-78902 (Amit Gupta)",
    plannedDeparture: "2024-02-09",
    visitPurpose: "Adventure Sports",
    accommodationType: "Adventure Camp",
    groupSize: 4,
  },
  {
    id: "28",
    digitalId: "IND123567",
    name: "Rohit Agarwal",
    nationality: "India",
    age: 33,
    gender: "Male",
    checkInDate: "2024-01-16",
    lastSeen: "1.5 hours ago",
    currentLocation: "Cherrapunji, Meghalaya",
    safetyScore: 88,
    status: "active",
    contactNumber: "+91-98765-89012",
    email: "rohit.agarwal@gmail.com",
    emergencyContact: "+91-98765-89013 (Pooja Agarwal)",
    plannedDeparture: "2024-02-11",
    visitPurpose: "Rainforest Exploration",
    accommodationType: "Tree House",
    groupSize: 2,
  },
  {
    id: "29",
    digitalId: "IND234678",
    name: "Sneha Nair",
    nationality: "India",
    age: 30,
    gender: "Female",
    checkInDate: "2024-01-24",
    lastSeen: "25 minutes ago",
    currentLocation: "Pelling, Sikkim",
    safetyScore: 94,
    status: "active",
    contactNumber: "+91-98765-90123",
    email: "sneha.nair@outlook.com",
    emergencyContact: "+91-98765-90124 (Krishna Nair)",
    plannedDeparture: "2024-02-07",
    visitPurpose: "Mountain Trekking",
    accommodationType: "Hill Station Hotel",
    groupSize: 3,
  },
  {
    id: "30",
    digitalId: "IND345789",
    name: "Amit Desai",
    nationality: "India",
    age: 36,
    gender: "Male",
    checkInDate: "2024-01-14",
    lastSeen: "4 hours ago",
    currentLocation: "Bomdila, Arunachal Pradesh",
    safetyScore: 85,
    status: "active",
    contactNumber: "+91-98765-01234",
    email: "amit.desai@hotmail.com",
    emergencyContact: "+91-98765-01235 (Rekha Desai)",
    plannedDeparture: "2024-02-16",
    visitPurpose: "Buddhist Pilgrimage",
    accommodationType: "Monastery Stay",
    groupSize: 1,
  },
  {
    id: "31",
    digitalId: "IND456890",
    name: "Pooja Mehta",
    nationality: "India",
    age: 28,
    gender: "Female",
    checkInDate: "2024-01-25",
    lastSeen: "10 minutes ago",
    currentLocation: "Dimapur, Nagaland",
    safetyScore: 90,
    status: "active",
    contactNumber: "+91-98765-12345",
    email: "pooja.mehta@gmail.com",
    emergencyContact: "+91-98765-12346 (Rajesh Mehta)",
    plannedDeparture: "2024-02-13",
    visitPurpose: "Tribal Culture Study",
    accommodationType: "Tribal Village",
    groupSize: 2,
  },
  {
    id: "32",
    digitalId: "IND567901",
    name: "Suresh Tiwari",
    nationality: "India",
    age: 42,
    gender: "Male",
    checkInDate: "2024-01-13",
    lastSeen: "5 hours ago",
    currentLocation: "Loktak Lake, Manipur",
    safetyScore: 87,
    status: "active",
    contactNumber: "+91-98765-23456",
    email: "suresh.tiwari@email.com",
    emergencyContact: "+91-98765-23457 (Geeta Tiwari)",
    plannedDeparture: "2024-02-17",
    visitPurpose: "Eco Tourism",
    accommodationType: "Floating Hut",
    groupSize: 1,
  },
  {
    id: "33",
    digitalId: "IND678012",
    name: "Ritu Verma",
    nationality: "India",
    age: 29,
    gender: "Female",
    checkInDate: "2024-01-26",
    lastSeen: "35 minutes ago",
    currentLocation: "Lunglei, Mizoram",
    safetyScore: 92,
    status: "active",
    contactNumber: "+91-98765-34567",
    email: "ritu.verma@yahoo.com",
    emergencyContact: "+91-98765-34568 (Manoj Verma)",
    plannedDeparture: "2024-02-04",
    visitPurpose: "Adventure Trekking",
    accommodationType: "Mountain Lodge",
    groupSize: 3,
  },
  {
    id: "34",
    digitalId: "IND789123",
    name: "Rajesh Pandey",
    nationality: "India",
    age: 34,
    gender: "Male",
    checkInDate: "2024-01-12",
    lastSeen: "6 hours ago",
    currentLocation: "Udaipur, Tripura",
    safetyScore: 89,
    status: "active",
    contactNumber: "+91-98765-45678",
    email: "rajesh.pandey@gmail.com",
    emergencyContact: "+91-98765-45679 (Sunita Pandey)",
    plannedDeparture: "2024-02-18",
    visitPurpose: "Temple Tourism",
    accommodationType: "Temple Guest House",
    groupSize: 2,
  },
  {
    id: "35",
    digitalId: "IND890234",
    name: "Meera Chaturvedi",
    nationality: "India",
    age: 31,
    gender: "Female",
    checkInDate: "2024-01-27",
    lastSeen: "12 minutes ago",
    currentLocation: "Lachung, Sikkim",
    safetyScore: 96,
    status: "active",
    contactNumber: "+91-98765-56789",
    email: "meera.chaturvedi@outlook.com",
    emergencyContact: "+91-98765-56790 (Vikram Chaturvedi)",
    plannedDeparture: "2024-02-03",
    visitPurpose: "Snow Tourism",
    accommodationType: "Snow Resort",
    groupSize: 1,
  },
  {
    id: "36",
    digitalId: "IND901345",
    name: "Rahul Lodhi",
    nationality: "India",
    age: 26,
    gender: "Male",
    checkInDate: "2024-01-28",
    lastSeen: "1 hour ago",
    currentLocation: "Gangtok, Sikkim",
    safetyScore: 92,
    status: "active",
    contactNumber: "+91-98765-67890",
    email: "rahul.lodhi@gmail.com",
    emergencyContact: "+91-98765-67891 (Rekha Lodhi)",
    plannedDeparture: "2024-02-05",
    visitPurpose: "Adventure Tourism",
    accommodationType: "Hostel",
    groupSize: 1,
  },
  {
    id: "37",
    digitalId: "IND012456",
    name: "Priyanshu Lohani",
    nationality: "India",
    age: 24,
    gender: "Male",
    checkInDate: "2024-01-29",
    lastSeen: "30 minutes ago",
    currentLocation: "Shillong, Meghalaya",
    safetyScore: 88,
    status: "active",
    contactNumber: "+91-98765-78901",
    email: "priyanshu.lohani@yahoo.com",
    emergencyContact: "+91-98765-78902 (Anita Lohani)",
    plannedDeparture: "2024-02-06",
    visitPurpose: "Nature Photography",
    accommodationType: "Guest House",
    groupSize: 2,
  },
  {
    id: "38",
    digitalId: "IND123567",
    name: "Parshvi Jain",
    nationality: "India",
    age: 22,
    gender: "Female",
    checkInDate: "2024-01-30",
    lastSeen: "2 hours ago",
    currentLocation: "Kaziranga, Assam",
    safetyScore: 94,
    status: "active",
    contactNumber: "+91-98765-89012",
    email: "parshvi.jain@outlook.com",
    emergencyContact: "+91-98765-89013 (Rajesh Jain)",
    plannedDeparture: "2024-02-07",
    visitPurpose: "Wildlife Tourism",
    accommodationType: "Resort",
    groupSize: 3,
  },
  {
    id: "39",
    digitalId: "IND234678",
    name: "Shashwat Jain",
    nationality: "India",
    age: 25,
    gender: "Male",
    checkInDate: "2024-01-31",
    lastSeen: "45 minutes ago",
    currentLocation: "Tawang, Arunachal Pradesh",
    safetyScore: 90,
    status: "active",
    contactNumber: "+91-98765-90123",
    email: "shashwat.jain@gmail.com",
    emergencyContact: "+91-98765-90124 (Neha Jain)",
    plannedDeparture: "2024-02-08",
    visitPurpose: "Spiritual Tourism",
    accommodationType: "Monastery Guest House",
    groupSize: 1,
  },
  {
    id: "40",
    digitalId: "IND345789",
    name: "Ayush Kumar",
    nationality: "India",
    age: 27,
    gender: "Male",
    checkInDate: "2024-02-01",
    lastSeen: "15 minutes ago",
    currentLocation: "Imphal, Manipur",
    safetyScore: 87,
    status: "active",
    contactNumber: "+91-98765-01234",
    email: "ayush.kumar@yahoo.com",
    emergencyContact: "+91-98765-01235 (Sunita Kumar)",
    plannedDeparture: "2024-02-09",
    visitPurpose: "Cultural Tourism",
    accommodationType: "Hotel",
    groupSize: 2,
  },
  {
    id: "41",
    digitalId: "IND456890",
    name: "Uday Kumar",
    nationality: "India",
    age: 29,
    gender: "Male",
    checkInDate: "2024-02-02",
    lastSeen: "3 hours ago",
    currentLocation: "Kohima, Nagaland",
    safetyScore: 93,
    status: "active",
    contactNumber: "+91-98765-12345",
    email: "uday.kumar@gmail.com",
    emergencyContact: "+91-98765-12346 (Priya Kumar)",
    plannedDeparture: "2024-02-10",
    visitPurpose: "Tribal Tourism",
    accommodationType: "Homestay",
    groupSize: 1,
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
                      Valid until {new Date(tourist.endDate as string).toLocaleDateString()}
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
