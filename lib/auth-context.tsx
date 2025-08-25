"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  language: "en" | "hi"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, language: "en" | "hi") => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session on mount
    const savedUser = localStorage.getItem("legal-assistant-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("legal-assistant-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Demo credentials
    const demoUsers = [
      { id: "demo1", name: "राज कुमार", email: "demo@legal.com", password: "123456", language: "hi", createdAt: new Date().toISOString() },
      { id: "demo2", name: "John Doe", email: "john@legal.com", password: "123456", language: "en", createdAt: new Date().toISOString() }
    ]

    // Check demo users first
    const demoUser = demoUsers.find(u => u.email === email && u.password === password)
    if (demoUser) {
      const { password: _, ...userWithoutPassword } = demoUser
      setUser(userWithoutPassword)
      localStorage.setItem("legal-assistant-user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    // Check saved users
    const savedUsers = localStorage.getItem("legal-assistant-users")
    const users = savedUsers ? JSON.parse(savedUsers) : []
    const existingUser = users.find((u: any) => u.email === email && u.password === password)

    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser
      setUser(userWithoutPassword)
      localStorage.setItem("legal-assistant-user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signup = async (name: string, email: string, password: string, language: "en" | "hi"): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const savedUsers = localStorage.getItem("legal-assistant-users")
    const users = savedUsers ? JSON.parse(savedUsers) : []

    if (users.find((u: any) => u.email === email)) {
      setIsLoading(false)
      return false // User already exists
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In real app, this would be hashed
      language,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("legal-assistant-users", JSON.stringify(users))

    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("legal-assistant-user", JSON.stringify(userWithoutPassword))

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("legal-assistant-user")
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("legal-assistant-user", JSON.stringify(updatedUser))

    // Update in users list as well
    const savedUsers = localStorage.getItem("legal-assistant-users")
    const users = savedUsers ? JSON.parse(savedUsers) : []
    const userIndex = users.findIndex((u: any) => u.id === user.id)

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem("legal-assistant-users", JSON.stringify(users))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
