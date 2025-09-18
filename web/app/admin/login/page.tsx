"use client"

import * as React from "react"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage(): JSX.Element {
  const [adminId, setAdminId] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      // Placeholder: integrate with backend later
      await new Promise((r) => setTimeout(r, 700))

      toast({
        title: "Login request sent",
        description: "Verifying your credentials...",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your admin credentials
          </p>
        </div>

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
      </div>
    </div>
  )
}


