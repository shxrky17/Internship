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
import { useAuth } from "../context/AuthContext"

const SignIn = ({ onClose, onSwitchToSignUp, onLoginSuccess, onLoginError }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth();

  const handleSignIn = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        // Backend field is named "success" in LoginResponseDTO
        if (data.success) {
          await login(email);
          if (onLoginSuccess) onLoginSuccess(email)
          else onClose()
        } else {
          const errMsg = data.message || "Invalid credentials"
          setError(errMsg)
          if (onLoginError) onLoginError(errMsg)
        }
      } else {
        const errMsg = "Login failed. Please check your credentials."
        setError(errMsg)
        if (onLoginError) onLoginError(errMsg)
      }
    } catch (err) {
      const errMsg = "Cannot connect to server. Please ensure backend is running."
      setError(errMsg)
      if (onLoginError) onLoginError(errMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickTest = async () => {
    const testEmail = email.trim() || "test@example.com"
    await login(testEmail);
    if (onLoginSuccess) onLoginSuccess(testEmail)
    else onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <Card className="w-full glass-panel mx-auto max-w-md shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a className="text-sm hover:underline" href="#">
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              onChange={e => setPassword(e.target.value)}
              type="password"
              value={password}
            />
          </div>
          <Button
            className="w-full bg-black text-white hover:bg-black/80"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          <Button className="w-full" variant="outline">
            Sign In with Google
          </Button>
          <button
            type="button"
            onClick={handleQuickTest}
            className="w-full text-xs text-slate-400 hover:text-primary underline cursor-pointer bg-transparent border-none pt-1"
          >
            ⚡ Quick Test Login (No Backend)
          </button>
        </CardContent>
        <CardFooter className="flex justify-center flex-col gap-4 border-t border-slate-200/50 pt-6 mt-4">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <a className="underline text-primary cursor-pointer hover:font-medium" onClick={(e) => { e.preventDefault(); onSwitchToSignUp(); }}>
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn
