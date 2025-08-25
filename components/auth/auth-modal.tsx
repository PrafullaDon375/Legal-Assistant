"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"
import type { Language } from "@/lib/translations"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  language: Language
}

export default function AuthModal({ isOpen, onClose, language }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 border-0">
        {isLogin ? (
          <LoginForm language={language} onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm language={language} onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
