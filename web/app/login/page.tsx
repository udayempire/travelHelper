"use client"

import * as React from "react"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

function isValidAadhaar(value: string): boolean {
  // Aadhaar is 12 digits; usually starts 2-9. Keep simple client validation.
  return /^[2-9]\d{11}$/.test(value)
}

export default function LoginPage(): JSX.Element {
  const [aadhaar, setAadhaar] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalized = aadhaar.replace(/\s+/g, "")
    if (!isValidAadhaar(normalized)) {
      toast({
        title: "Invalid Aadhaar number",
        description: "Enter a valid 12-digit Aadhaar starting from 2-9.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      // Placeholder: Wire this to your backend later
      // Keeping a small delay to mimic a request
      await new Promise((r) => setTimeout(r, 700))

      // Example: optimistic success
      toast({
        title: "Login request sent",
        description: "We will verify your Aadhaar and sign you in.",
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
          <h1 className="text-2xl font-semibold tracking-tight">Tourist Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your Aadhaar number
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="aadhaar" className="text-sm font-medium">
              Aadhaar Number
            </label>
            <Input
              id="aadhaar"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="XXXX XXXX XXXX"
              value={aadhaar}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 12)
                // format as 4-4-4 groups for readability
                const formatted = onlyDigits.replace(/(\d{4})(\d{0,4})(\d{0,4}).*/, (_m, a, b, c) =>
                  [a, b, c].filter(Boolean).join(" ")
                )
                setAadhaar(formatted)
              }}
            />
            <p className="text-xs text-muted-foreground">
              Enter your 12-digit Aadhaar. We do not store your number on this device.
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  )
}


