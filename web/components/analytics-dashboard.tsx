"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, Users, AlertTriangle, Shield, Clock, MapPin, Calendar } from "lucide-react"
import { useState } from "react"

// Mock data for analytics
const touristFlowData = [
  { month: "Jan", tourists: 1200, incidents: 15, safetyScore: 94 },
  { month: "Feb", tourists: 1350, incidents: 12, safetyScore: 96 },
  { month: "Mar", tourists: 1800, incidents: 18, safetyScore: 93 },
  { month: "Apr", tourists: 2100, incidents: 22, safetyScore: 91 },
  { month: "May", tourists: 1950, incidents: 16, safetyScore: 95 },
  { month: "Jun", tourists: 2300, incidents: 25, safetyScore: 89 },
  { month: "Jul", tourists: 2450, incidents: 28, safetyScore: 87 },
  { month: "Aug", tourists: 2200, incidents: 20, safetyScore: 92 },
  { month: "Sep", tourists: 1950, incidents: 18, safetyScore: 94 },
  { month: "Oct", tourists: 2100, incidents: 22, safetyScore: 91 },
  { month: "Nov", tourists: 1850, incidents: 16, safetyScore: 95 },
  { month: "Dec", tourists: 1750, incidents: 14, safetyScore: 96 },
]

const incidentTypeData = [
  { name: "Medical Emergency", value: 35, color: "#f59e0b" },
  { name: "Theft/Crime", value: 28, color: "#ef4444" },
  { name: "Route Deviation", value: 20, color: "#8b5cf6" },
  { name: "High-Risk Entry", value: 12, color: "#dc2626" },
  { name: "Information Request", value: 5, color: "#3b82f6" },
]

const responseTimeData = [
  { day: "Mon", avgTime: 4.2, target: 5.0 },
  { day: "Tue", avgTime: 3.8, target: 5.0 },
  { day: "Wed", avgTime: 4.5, target: 5.0 },
  { day: "Thu", avgTime: 3.9, target: 5.0 },
  { day: "Fri", avgTime: 4.1, target: 5.0 },
  { day: "Sat", avgTime: 5.2, target: 5.0 },
  { day: "Sun", avgTime: 4.8, target: 5.0 },
]

const locationHotspots = [
  // Northeast India Focus
  { location: "Guwahati", tourists: 190, incidents: 8, riskLevel: "Medium" },
  { location: "Shillong", tourists: 110, incidents: 4, riskLevel: "Low" },
  { location: "Gangtok", tourists: 130, incidents: 6, riskLevel: "Medium" },
  { location: "Tawang", tourists: 85, incidents: 3, riskLevel: "Low" },
  { location: "Kaziranga", tourists: 155, incidents: 5, riskLevel: "Low" },
  { location: "Imphal", tourists: 55, incidents: 7, riskLevel: "High" },
  { location: "Kohima", tourists: 60, incidents: 2, riskLevel: "Low" },
  { location: "Aizawl", tourists: 45, incidents: 3, riskLevel: "Low" },
  { location: "Agartala", tourists: 35, incidents: 2, riskLevel: "Low" },
  { location: "Cherrapunji", tourists: 65, incidents: 4, riskLevel: "Medium" },
  { location: "Pelling", tourists: 45, incidents: 1, riskLevel: "Low" },
  { location: "Bomdila", tourists: 35, incidents: 2, riskLevel: "Low" },
  { location: "Loktak Lake", tourists: 75, incidents: 3, riskLevel: "Low" },
  { location: "Dimapur", tourists: 40, incidents: 2, riskLevel: "Low" },
  { location: "Tezpur", tourists: 35, incidents: 1, riskLevel: "Low" },
]

const dailyActivityData = [
  { hour: "00", alerts: 2, tourists: 45 },
  { hour: "02", alerts: 1, tourists: 28 },
  { hour: "04", alerts: 1, tourists: 32 },
  { hour: "06", alerts: 3, tourists: 67 },
  { hour: "08", alerts: 8, tourists: 156 },
  { hour: "10", alerts: 12, tourists: 198 },
  { hour: "12", alerts: 15, tourists: 234 },
  { hour: "14", alerts: 18, tourists: 267 },
  { hour: "16", alerts: 12, tourists: 198 },
  { hour: "18", alerts: 9, tourists: 178 },
  { hour: "20", alerts: 6, tourists: 167 },
  { hour: "22", alerts: 4, tourists: 89 },
]

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  changeLabel: string
  icon: React.ElementType
  color?: "emerald" | "red" | "blue" | "orange"
}

function MetricCard({ title, value, change, changeLabel, icon: Icon, color = "emerald" }: MetricCardProps) {
  const isPositive = change > 0
  const colorClasses = {
    emerald: "text-emerald-600 bg-emerald-50",
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                {Math.abs(change)}% {changeLabel}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tourists"
          value="12,450"
          change={8.2}
          changeLabel="vs last period"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Incidents Resolved"
          value="156"
          change={15.3}
          changeLabel="vs last period"
          icon={Shield}
          color="emerald"
        />
        <MetricCard
          title="Avg Response Time"
          value="4.2m"
          change={-12.5}
          changeLabel="improvement"
          icon={Clock}
          color="orange"
        />
        <MetricCard
          title="Safety Score"
          value="94.2%"
          change={2.1}
          changeLabel="vs last period"
          icon={Shield}
          color="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourist Flow Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tourist Flow & Safety Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={touristFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="tourists" fill="#3b82f6" opacity={0.7} />
                <Line yAxisId="right" type="monotone" dataKey="safetyScore" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incident Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incident Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidentTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {incidentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Time Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgTime" fill="#10b981" />
                <Bar dataKey="target" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Activity Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Activity Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="tourists"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area type="monotone" dataKey="alerts" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Location Hotspots Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Hotspots Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Location</th>
                  <th className="text-left py-3 px-4 font-medium">Active Tourists</th>
                  <th className="text-left py-3 px-4 font-medium">Incidents (7d)</th>
                  <th className="text-left py-3 px-4 font-medium">Risk Level</th>
                  <th className="text-left py-3 px-4 font-medium">Incident Rate</th>
                </tr>
              </thead>
              <tbody>
                {locationHotspots.map((location, index) => {
                  const incidentRate = ((location.incidents / location.tourists) * 100).toFixed(1)
                  const riskColor =
                    location.riskLevel === "High"
                      ? "bg-red-100 text-red-800"
                      : location.riskLevel === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-emerald-100 text-emerald-800"

                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{location.location}</td>
                      <td className="py-3 px-4">{location.tourists}</td>
                      <td className="py-3 px-4">{location.incidents}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={riskColor}>
                          {location.riskLevel}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{incidentRate}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Peak Risk Hours</h4>
              <p className="text-sm text-blue-800">
                Incidents spike between 12-4 PM. Consider increasing patrol presence during these hours.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">Route Anomaly</h4>
              <p className="text-sm text-orange-800">
                15% increase in route deviations near Jaipur. Recommend updating safety guidelines.
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2">Response Improvement</h4>
              <p className="text-sm text-emerald-800">
                Average response time improved by 12% this week. Current efficiency is above target.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
