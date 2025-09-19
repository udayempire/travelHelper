"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Shield, User, ArrowLeft } from "lucide-react"

export default function AdminLoginPage(): JSX.Element {
  const [adminId, setAdminId] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!adminId.trim() || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both Admin ID and password.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      // Simulate admin login - replace with actual API call
      await new Promise((r) => setTimeout(r, 1000))
      
      toast({
        title: "Login successful",
        description: "Redirecting to admin dashboard...",
      })
      
      // Redirect to main page after successful login
      router.push('/')
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Administration Login</CardTitle>
            <CardDescription>
              Authority access to tourist management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="adminId" className="text-sm font-medium">
                  Admin ID
                </label>
                <Input
                  id="adminId"
                  autoComplete="username"
                  placeholder="Enter your Admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


