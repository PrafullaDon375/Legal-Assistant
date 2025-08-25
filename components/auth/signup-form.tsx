"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Scale } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { Language } from "@/lib/translations"

interface SignupFormProps {
  language: Language
  onSwitchToLogin: () => void
}

export default function SignupForm({ language, onSwitchToLogin }: SignupFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "hi">(language)
  const [error, setError] = useState("")
  const { signup, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError(language === "hi" ? "कृपया सभी फ़ील्ड भरें" : "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError(language === "hi" ? "पासवर्ड मेल नहीं खाते" : "Passwords don't match")
      return
    }

    if (password.length < 6) {
      setError(language === "hi" ? "पासवर्ड कम से कम 6 अक्षर का होना चाहिए" : "Password must be at least 6 characters")
      return
    }

    const success = await signup(name, email, password, preferredLanguage)
    if (success) {
      // Close modal on successful signup
      window.dispatchEvent(new CustomEvent('auth-success'))
    } else {
      setError(language === "hi" ? "यह ईमेल पहले से मौजूद है" : "This email is already registered")
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
        <CardTitle className="text-2xl font-serif">{language === "hi" ? "साइन अप करें" : "Sign Up"}</CardTitle>
        <CardDescription>
          {language === "hi" ? "अपना कानूनी सहायक खाता बनाएं" : "Create your Legal Assistant account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{language === "hi" ? "नाम" : "Name"}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === "hi" ? "आपका नाम" : "Your name"}
              disabled={isLoading}
            />
          </div>

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
            <Label htmlFor="language">{language === "hi" ? "पसंदीदा भाषा" : "Preferred Language"}</Label>
            <Select value={preferredLanguage} onValueChange={(value: "en" | "hi") => setPreferredLanguage(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{language === "hi" ? "पासवर्ड" : "Password"}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === "hi" ? "पासवर्ड (कम से कम 6 अक्षर)" : "Password (min 6 characters)"}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{language === "hi" ? "पासवर्ड की पुष्टि करें" : "Confirm Password"}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={language === "hi" ? "पासवर्ड दोबारा लिखें" : "Repeat password"}
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
                {language === "hi" ? "साइन अप हो रहा है..." : "Signing up..."}
              </>
            ) : language === "hi" ? (
              "साइन अप करें"
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {language === "hi" ? "पहले से खाता है?" : "Already have an account?"}{" "}
            <Button variant="link" className="p-0 h-auto" onClick={onSwitchToLogin}>
              {language === "hi" ? "लॉग इन करें" : "Sign in"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
