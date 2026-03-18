"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SignUp = ({ onClose, onSwitchToSignIn }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })

      if (response.ok) {
        // Switch to sign in on successful registration
        onSwitchToSignIn()
      } else {
        setError("Registration failed. Email might already be in use.")
      }
    } catch (err) {
      setError("Network error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <Card className="w-full glass-panel mx-auto max-w-md shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                onChange={e => setFirstName(e.target.value)}
                placeholder="John"
                type="text"
                value={firstName}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                onChange={e => setLastName(e.target.value)}
                placeholder="Doe"
                type="text"
                value={lastName}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onChange={e => setEmail(e.target.value)}
              placeholder="m@example.com"
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              onChange={e => setPassword(e.target.value)}
              type="password"
              value={password}
            />
          </div>
          <Button 
            className="w-full bg-primary text-white hover:bg-primary-hover border-none"
            onClick={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
          <Button className="w-full" variant="outline">
            Sign Up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center flex-col gap-4 border-t border-slate-200/50 pt-6 mt-4">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <a className="underline text-primary cursor-pointer hover:font-medium" onClick={(e) => { e.preventDefault(); onSwitchToSignIn(); }}>
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp
