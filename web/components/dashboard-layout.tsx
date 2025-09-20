"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  FileText,
  BarChart3,
  Search,
  Bell,
  Settings,
  Shield,
  Menu,
  X,
  UserPlus,
  LogOut,
  Map,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { id: 1, name: "Dashboard", href: "/", icon: LayoutDashboard },
  { id: 2, name: "Tourist Records", href: "/tourist", icon: Users },
  { id: 3, name: "Map View", href: "/map", icon: Map },
  { id: 4, name: "Active Alerts", href: "/active-alerts", icon: AlertTriangle },
  { id: 5, name: "E-FIR History", href: "/efir-history", icon: FileText },
  { id: 6, name: "Analytics", href: "/analytics", icon: BarChart3 },
]

const adminNavigation = [
  { id: 7, name: "User Management", href: "/admin/users", icon: Users },
  { id: 8, name: "Alerts Management", href: "/admin/alerts", icon: AlertTriangle },
  { id: 9, name: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3 },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname() // Get the current URL pathname

  const getSelectedId = () => {
    const allNavigation = [...navigation, ...adminNavigation]
    const currentItem = allNavigation.find((item) => item.href === pathname)
    return currentItem ? currentItem.id : 1 // Default to Dashboard if not found
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex flex-col items-center gap-2">
              <Image src={"logo.png"} width={60} height={60} alt="logo" />
              <span className="text-lg font-semibold text-sidebar-foreground">Kavach</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after click
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      getSelectedId() === item.id
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </a>
                </li>
              ))}
              
              {/* Admin Section */}
              <div className="pt-4 mt-4 border-t border-sidebar-border">
                <p className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">Admin</p>
                {adminNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        getSelectedId() === item.id
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </div>
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-2 mt-3">
             <Image className="rounded-2xl shadow-2xl border-[2px] border-gray-500" src={"logo.png"} width={100} height={100} alt="logo" />
            <span className="text-xl font-semibold text-sidebar-foreground">Kavach</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium leading-6 transition-colors",
                          getSelectedId() === item.id
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* Admin Section */}
              <li>
                <div className="text-xs font-semibold leading-6 text-sidebar-foreground/70 uppercase tracking-wider">
                  Admin
                </div>
                <ul className="mt-2 space-y-1">
                  {adminNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium leading-6 transition-colors",
                          getSelectedId() === item.id
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-foreground">Authority Dashboard</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search Digital ID Record..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/tourist/login">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Login Tourist
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout