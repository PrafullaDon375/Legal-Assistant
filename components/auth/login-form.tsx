"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Scale } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { Language } from "@/lib/translations"

interface LoginFormProps {
  language: Language
  onSwitchToSignup: () => void
}

export default function LoginForm({ language, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError(language === "hi" ? "कृपया सभी फ़ील्ड भरें" : "Please fill in all fields")
      return
    }

    const success = await login(email, password)
    if (success) {
      // Close modal on successful login
      window.dispatchEvent(new CustomEvent('auth-success'))
    } else {
      setError(language === "hi" ? "गलत ईमेल या पासवर्ड" : "Invalid email or password")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary rounded-lg">
            <Scale className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-serif">{language === "hi" ? "लॉग इन करें" : "Sign In"}</CardTitle>
        <CardDescription>
          {language === "hi" ? "अपने कानूनी सहायक खाते में प्रवेश करें" : "Access your Legal Assistant account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{language === "hi" ? "ईमेल" : "Email"}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === "hi" ? "आपका ईमेल" : "Your email"}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{language === "hi" ? "पासवर्ड" : "Password"}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === "hi" ? "आपका पासवर्ड" : "Your password"}
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "hi" ? "लॉग इन हो रहा है..." : "Signing in..."}
              </>
            ) : language === "hi" ? (
              "लॉग इन करें"
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="font-medium mb-2">{language === "hi" ? "डेमो अकाउंट:" : "Demo Account:"}</p>
              <p className="text-xs text-muted-foreground">
                <strong>Email:</strong> demo@legal.com<br/>
                <strong>Password:</strong> 123456
              </p>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              {language === "hi" ? "खाता नहीं है?" : "Don't have an account?"}{" "}
              <Button variant="link" className="p-0 h-auto" onClick={onSwitchToSignup}>
                {language === "hi" ? "साइन अप करें" : "Sign up"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
