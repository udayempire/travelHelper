"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapComponent } from "@/components/map-component"
import { StatsCards } from "@/components/stats-cards"
import { AlertsTable } from "@/components/alerts-table"
import { FileText, Send, History, Map, ExternalLink } from "lucide-react"
import Link from "next/link"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">India Tourist Heatmap</CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Tourist Locations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">High-Risk Zones</span>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/map">
                    <Map className="h-4 w-4 mr-2" />
                    Full Map
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MapComponent />
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2" size="lg">
                <FileText className="h-4 w-4" />
                Generate E-FIR
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2" size="lg">
                <Send className="h-4 w-4" />
                Send Notification
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="lg">
                <History className="h-4 w-4" />
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts Table */}
      <AlertsTable />
    </div>
  )
}
