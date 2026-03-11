"use client"

import { useState } from "react"
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
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <Card className="w-full glass-panel mx-auto max-w-md shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" onClick={onClose}>
          <i data-lucide="x" className="w-5 h-5"></i>
        </button>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              type="text"
              value={name}
            />
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
          <Button className="w-full bg-primary text-white hover:bg-primary-hover border-none">Sign Up</Button>
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
