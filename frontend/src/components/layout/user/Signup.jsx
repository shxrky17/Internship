import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

function Signup({ onClose, onSwitchToSignIn }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      const data = await response.text();

      if (response.ok) {
        alert("Registration successful ✅");

        // clear fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
      } else {
        setError(data || "Registration failed");
      }
    } catch (err) {
      setError("Server error");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md" onClick={onClose}>
      <Card className="w-full glass-panel mx-auto max-w-md shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details below</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>

            <div className="flex-1 space-y-2">
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button className="w-full" onClick={handleSignUp}>
            Sign Up
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center flex-col gap-4 border-t pt-6 mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <button onClick={onSwitchToSignIn} className="underline text-primary">
              Sign in
            </button>
          </p>
        </CardFooter>

      </Card>
    </div>
  );
}

export default Signup;