"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Scale,
  Users,
  FileText,
  Shield,
  Loader2,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { getTranslation, type Language } from "@/lib/translations"
import LegalKnowledgePanel from "@/components/legal-knowledge-panel"
import { useSpeechRecognition, useTextToSpeech } from "@/hooks/use-speech"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import AuthModal from "@/components/auth/auth-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: number
}

export default function LegalAssistant() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("hi")
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { user, logout, updateProfile } = useAuth()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user?.language) {
      setSelectedLanguage(user.language)
    }
  }, [user])

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: user
        ? selectedLanguage === "hi"
          ? `नमस्ते ${user.name}! मैं आपका कानूनी जागरूकता सहायक हूं।`
          : `Hello ${user.name}! I am your Legal Awareness Assistant.`
        : getTranslation(selectedLanguage, "welcomeMessage"),
      createdAt: Date.now(),
    }
    setMessages([welcomeMessage])
  }, [user, selectedLanguage])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      console.log("[v0] Starting chat request")
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language: selectedLanguage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "Sorry, no response received.",
        createdAt: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      
      // Immediate scroll to bottom
      setTimeout(() => scrollToBottom(), 50)
      console.log("[v0] Chat request completed successfully")
    } catch (error) {
      console.error("[v0] Chat error:", error)
      toast({
        title: selectedLanguage === "hi" ? "त्रुटि" : "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      })

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          selectedLanguage === "hi"
            ? "क्षमा करें, कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"
            : "Sorry, something went wrong. Please try again.",
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const speechRecognition = useSpeechRecognition({
    language: selectedLanguage,
    onResult: (transcript) => {
      console.log("[v0] Speech recognition result:", transcript)
      setInput(transcript)
      toast({
        title: selectedLanguage === "hi" ? "आवाज पहचानी गई" : "Voice Recognized",
        description: transcript,
      })
    },
    onError: (error) => {
      console.log("[v0] Speech recognition error:", error)
      toast({
        title: selectedLanguage === "hi" ? "आवाज पहचानने में त्रुटि" : "Speech Recognition Error",
        description: error,
        variant: "destructive",
      })
    },
  })

  const textToSpeech = useTextToSpeech({
    language: selectedLanguage,
    onStart: () => {
      toast({
        title: selectedLanguage === "hi" ? "बोल रहा है" : "Speaking",
        description: selectedLanguage === "hi" ? "AI जवाब पढ़ रहा है" : "AI is reading the response",
      })
    },
    onError: (error) => {
      toast({
        title: selectedLanguage === "hi" ? "बोलने में त्रुटि" : "Text-to-Speech Error",
        description: error,
        variant: "destructive",
      })
    },
  })

  const legalCategories = [
    {
      name: getTranslation(selectedLanguage, "constitutionalRights"),
      icon: Shield,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      prompt: getTranslation(selectedLanguage, "constitutionalRightsPrompt"),
    },
    {
      name: getTranslation(selectedLanguage, "consumerProtection"),
      icon: Users,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      prompt: getTranslation(selectedLanguage, "consumerProtectionPrompt"),
    },
    {
      name: getTranslation(selectedLanguage, "laborLaws"),
      icon: FileText,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      prompt: getTranslation(selectedLanguage, "laborLawsPrompt"),
    },
    {
      name: getTranslation(selectedLanguage, "familyLaw"),
      icon: Users,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      prompt: getTranslation(selectedLanguage, "familyLawPrompt"),
    },
  ]

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end",
        inline: "nearest" 
      })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  useEffect(() => {
    const handleAuthSuccess = () => {
      setShowAuthModal(false)
    }
    window.addEventListener('auth-success', handleAuthSuccess)
    return () => window.removeEventListener('auth-success', handleAuthSuccess)
  }, [])

  const toggleListening = () => {
    if (!speechRecognition.isSupported) {
      toast({
        title: selectedLanguage === "hi" ? "समर्थित नहीं" : "Not Supported",
        description:
          selectedLanguage === "hi"
            ? "आपका ब्राउज़र आवाज पहचान का समर्थन नहीं करता। कृपया Chrome या Safari का उपयोग करें।"
            : "Your browser doesn't support speech recognition. Please use Chrome or Safari.",
        variant: "destructive",
      })
      return
    }

    if (speechRecognition.isListening) {
      console.log("[v0] Stopping speech recognition")
      speechRecognition.stopListening()
    } else {
      console.log("[v0] Starting speech recognition")
      speechRecognition.startListening()
    }
  }

  const toggleSpeaking = () => {
    if (!textToSpeech.isSupported) {
      toast({
        title: selectedLanguage === "hi" ? "समर्थित नहीं" : "Not Supported",
        description:
          selectedLanguage === "hi"
            ? "आपका ब्राउज़र टेक्स्ट-टू-स्पीच का समर्थन नहीं करता"
            : "Your browser doesn't support text-to-speech",
        variant: "destructive",
      })
      return
    }

    if (textToSpeech.isSpeaking) {
      textToSpeech.stop()
    } else {
      const lastAssistantMessage = messages
        .slice()
        .reverse()
        .find((msg) => msg.role === "assistant")
      if (lastAssistantMessage) {
        textToSpeech.speak(lastAssistantMessage.content)
      }
    }
  }

  const toggleLanguage = () => {
    const newLanguage = selectedLanguage === "hi" ? "en" : "hi"
    setSelectedLanguage(newLanguage)

    if (user) {
      updateProfile({ language: newLanguage })
    }

    if (speechRecognition.isListening) {
      speechRecognition.stopListening()
    }
    if (textToSpeech.isSpeaking) {
      textToSpeech.stop()
    }

    if (messages.length === 1 && messages[0].id === "welcome") {
      window.location.reload()
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const handleCategoryClick = (prompt: string) => {
    setInput(prompt)
    setIsMobileSidebarOpen(false)
  }

  const handleKnowledgeTopicSelect = (topic: string) => {
    setInput(topic)
    setShowKnowledgePanel(false)
    setIsMobileSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
    toast({
      title: selectedLanguage === "hi" ? "लॉग आउट हो गए" : "Logged Out",
      description:
        selectedLanguage === "hi" ? "आपको सफलतापूर्वक लॉग आउट कर दिया गया है" : "You have been successfully logged out",
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 fixed lg:relative z-50 lg:z-auto
        w-80 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 border-r border-sidebar-border/50 flex flex-col
        transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
        h-full lg:h-screen backdrop-blur-xl
      `}
      >
        <div className="p-4 lg:p-6 border-b border-sidebar-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between mb-4 lg:mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <Scale className="h-5 w-5 lg:h-6 lg:w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-serif font-bold text-base lg:text-lg text-sidebar-foreground truncate">
                  {getTranslation(selectedLanguage, "appTitle")}
                </h1>
                <p className="text-xs lg:text-sm text-sidebar-foreground/70 truncate">
                  {getTranslation(selectedLanguage, "appSubtitle")}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 p-0 hover:bg-sidebar-accent/50 transition-colors"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="px-3 py-2 text-xs font-medium border-2 bg-gradient-to-r from-transparent to-sidebar-accent/20 hover:from-sidebar-accent/30 hover:to-sidebar-accent/40 transition-all duration-200 hover:scale-105"
            >
              {selectedLanguage === "hi" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="px-3 py-2 border-2 bg-gradient-to-r from-transparent to-sidebar-accent/20 hover:from-sidebar-accent/30 hover:to-sidebar-accent/40 transition-all duration-200 hover:scale-105"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-3 w-3 mr-1" />
                  <span className="text-xs">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-3 w-3 mr-1" />
                  <span className="text-xs">Dark</span>
                </>
              )}
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 border-2 hover:bg-sidebar-accent bg-gradient-to-r from-transparent to-sidebar-accent/20 hover:scale-105 transition-all duration-200"
                  >
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium truncate max-w-16">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-sm">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    {selectedLanguage === "hi" ? "लॉग आउट" : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-2 border-2 hover:bg-sidebar-accent transition-all duration-200 hover:scale-105"
              >
                <User className="h-3 w-3 mr-1" />
                <span className="text-xs">{selectedLanguage === "hi" ? "लॉगिन" : "Login"}</span>
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={!showKnowledgePanel ? "default" : "outline"}
              size="sm"
              onClick={() => setShowKnowledgePanel(false)}
              className="flex-1 transition-all duration-200 hover:scale-105 bg-gradient-to-r from-primary to-primary/90"
            >
              <FileText className="h-3 w-3 mr-1" />
              {getTranslation(selectedLanguage, "categories")}
            </Button>
            <Button
              variant={showKnowledgePanel ? "default" : "outline"}
              size="sm"
              onClick={() => setShowKnowledgePanel(true)}
              className="flex-1 transition-all duration-200 hover:scale-105 bg-gradient-to-r from-accent to-accent/90"
            >
              📚 <span className="ml-1 text-xs">Knowledge</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4" style={{scrollbarWidth: 'thin'}}>
          {!showKnowledgePanel ? (
            <div className="space-y-3">
              {legalCategories.map((category, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left hover:bg-sidebar-accent/50 transition-all duration-200 hover:scale-[1.02] group border border-transparent hover:border-sidebar-border/30 rounded-xl"
                  onClick={() => {
                    handleCategoryClick(category.prompt)
                    setIsMobileSidebarOpen(false)
                  }}
                >
                  <div
                    className={`p-2 rounded-lg ${category.color} mr-3 group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <category.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Button>
              ))}
            </div>
          ) : (
            <LegalKnowledgePanel
              language={selectedLanguage}
              onSelectTopic={(topic) => {
                handleKnowledgeTopicSelect(topic)
                setIsMobileSidebarOpen(false)
              }}
            />
          )}
        </div>

        <div className="mt-auto p-4 border-t border-sidebar-border/30 bg-gradient-to-r from-sidebar/50 to-sidebar/80 backdrop-blur-sm">
          <div className="text-xs text-sidebar-foreground/60 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
              <p>🔒 {getTranslation(selectedLanguage, "privateConversations")}</p>
            </div>
            <p>⚖️ {getTranslation(selectedLanguage, "poweredBy")}</p>
            <p>🇮🇳 {getTranslation(selectedLanguage, "specializedFor")}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-3 lg:p-4 border-b border-border/50 bg-gradient-to-r from-card/80 via-card/90 to-card/80 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 p-0 hover:bg-accent/50 transition-colors"
              onClick={toggleMobileSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif font-semibold text-base lg:text-lg text-card-foreground truncate">
                {getTranslation(selectedLanguage, "chatTitle")}
              </h2>
              <p className="text-xs lg:text-sm text-muted-foreground truncate">
                {getTranslation(selectedLanguage, "chatSubtitle")}
              </p>
            </div>
            <div className="flex gap-1 lg:gap-2 flex-wrap">
              <Badge variant="outline" className="bg-background/80 text-xs hidden sm:flex backdrop-blur-sm">
                {selectedLanguage === "hi" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary text-xs border-primary/20"
              >
                {getTranslation(selectedLanguage, "aiPowered")}
              </Badge>
              {isLoading && (
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-accent/10 to-accent/20 text-accent text-xs animate-pulse border-accent/20"
                >
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  {getTranslation(selectedLanguage, "thinking")}
                </Badge>
              )}
              {speechRecognition.isListening && (
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-destructive/10 to-destructive/20 text-destructive text-xs animate-pulse border-destructive/20"
                >
                  <Mic className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{getTranslation(selectedLanguage, "listening")}</span>
                </Badge>
              )}
              {textToSpeech.isSpeaking && (
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-accent/10 to-accent/20 text-accent text-xs animate-pulse border-accent/20"
                >
                  <Volume2 className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Speaking</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 lg:p-4 bg-gradient-to-b from-background/50 to-muted/10" ref={scrollAreaRef} style={{scrollbarWidth: 'thin'}}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 lg:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-7 w-7 lg:h-8 lg:w-8 bg-gradient-to-br from-primary to-primary/80 flex-shrink-0 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                      LA
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[85%] lg:max-w-[70%] ${message.role === "user" ? "order-first" : ""}`}>
                  <Card
                    className={`p-3 lg:p-4 transition-all duration-200 hover:shadow-lg border-0 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto shadow-md hover:shadow-xl"
                        : "bg-gradient-to-br from-card to-card/80 shadow-md hover:shadow-xl backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.role === "assistant" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6 px-2 text-xs hover:bg-background/20 transition-all duration-200 hover:scale-105"
                        onClick={() => textToSpeech.speak(message.content)}
                        disabled={!textToSpeech.isSupported}
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        {selectedLanguage === "hi" ? "सुनें" : "Listen"}
                      </Button>
                    )}
                  </Card>
                  <p className="text-xs text-muted-foreground mt-1 px-2">
                    {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-7 w-7 lg:h-8 lg:w-8 bg-gradient-to-br from-secondary to-secondary/80 flex-shrink-0 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground text-xs">
                      {user ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-3 lg:p-4 border-t border-border/50 bg-gradient-to-r from-card/80 via-card/90 to-card/80 backdrop-blur-xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={onSubmit} className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={getTranslation(selectedLanguage, "inputPlaceholder")}
                  className="min-h-[44px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/30 border-border/50 bg-background/80 backdrop-blur-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-1 lg:gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleListening}
                  className={`transition-all duration-200 hover:scale-105 border-border/50 ${
                    speechRecognition.isListening
                      ? "bg-gradient-to-br from-destructive to-destructive/90 text-destructive-foreground animate-pulse shadow-md"
                      : "hover:bg-accent/50 bg-background/80 backdrop-blur-sm"
                  }`}
                  type="button"
                  disabled={!speechRecognition.isSupported}
                >
                  {speechRecognition.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSpeaking}
                  className={`transition-all duration-200 hover:scale-105 border-border/50 ${
                    textToSpeech.isSpeaking
                      ? "bg-gradient-to-br from-accent to-accent/90 text-accent-foreground animate-pulse shadow-md"
                      : "hover:bg-accent/50 bg-background/80 backdrop-blur-sm"
                  }`}
                  type="button"
                  disabled={!textToSpeech.isSupported}
                >
                  {textToSpeech.isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button
                  type="submit"
                  disabled={!input?.trim() || isLoading}
                  className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100 bg-gradient-to-br from-primary to-primary/90 shadow-md hover:shadow-lg"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center px-2">
              {getTranslation(selectedLanguage, "disclaimer")}
            </p>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} language={selectedLanguage} />
    </div>
  )
}
