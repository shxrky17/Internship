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

function Signin({ onClose, onSwitchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.text();

      if (response.ok) {
        alert('Login successful ✅');
        setEmail('');
        setPassword('');
        onClose();
      } else {
        setError(data || 'Login failed');
      }
      localStorage.setItem("authToken", data.token);
      window.location.reload();
    } catch (err) {
      setError('Server error. Please try again.');
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md"
      onClick={onClose}
    >
      <Card
        className="w-full glass-panel mx-auto max-w-md shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <Input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-black text-white hover:bg-black/80"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center flex-col gap-4 border-t border-slate-200/50 pt-6 mt-4">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="underline text-primary cursor-pointer hover:font-medium bg-transparent border-none p-0"
              onClick={onSwitchToSignUp}
            >
              Sign up
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signin;