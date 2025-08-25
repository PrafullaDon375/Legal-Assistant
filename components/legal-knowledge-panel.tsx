"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Scale } from "lucide-react"

interface LegalArticle {
  id: string
  title: string
  titleHindi?: string
  summary: string
  summaryHindi?: string
  keyPoints: string[]
  keyPointsHindi?: string[]
}

interface LegalCategory {
  id: string
  name: string
  nameHindi: string
  description: string
  articles: LegalArticle[]
}

interface LegalProcedure {
  id: string
  title: string
  titleHindi: string
  steps: string[]
  stepsHindi: string[]
}

interface LegalKnowledgeData {
  categories: LegalCategory[]
  procedures: LegalProcedure[]
}

interface LegalKnowledgePanelProps {
  language: "en" | "hi"
  onSelectTopic: (topic: string) => void
}

export default function LegalKnowledgePanel({ language, onSelectTopic }: LegalKnowledgePanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [legalData, setLegalData] = useState<LegalKnowledgeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLegalKnowledge()
  }, [searchQuery, language])

  const fetchLegalKnowledge = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append("q", searchQuery)
      params.append("lang", language)

      const response = await fetch(`/api/legal-knowledge?${params}`)
      const data = await response.json()
      setLegalData(data)
    } catch (error) {
      console.error("Error fetching legal knowledge:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTopicClick = (title: string, titleHindi?: string) => {
    const topicText = language === "hi" && titleHindi ? titleHindi : title
    onSelectTopic(`Tell me about ${topicText}`)
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={language === "hi" ? "कानूनी जानकारी खोजें..." : "Search legal information..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {legalData?.categories.map((category) => (
        <Card key={category.id} className="border-l-4 border-l-legal-primary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Scale className="h-4 w-4 text-legal-primary" />
              {language === "hi" ? category.nameHindi : category.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{category.description}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {category.articles.map((article) => (
              <div key={article.id} className="space-y-2">
                <Button
                  variant="ghost"
                  className="h-auto p-2 justify-start text-left w-full"
                  onClick={() => handleTopicClick(article.title, article.titleHindi)}
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {language === "hi" && article.titleHindi ? article.titleHindi : article.title}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {language === "hi" && article.summaryHindi ? article.summaryHindi : article.summary}
                    </div>
                  </div>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {legalData?.procedures && legalData.procedures.length > 0 && (
        <Card className="border-l-4 border-l-legal-accent">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-legal-accent" />
              {language === "hi" ? "कानूनी प्रक्रियाएं" : "Legal Procedures"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {legalData.procedures.map((procedure) => (
              <Button
                key={procedure.id}
                variant="ghost"
                className="h-auto p-2 justify-start text-left w-full"
                onClick={() => handleTopicClick(procedure.title, procedure.titleHindi)}
              >
                <div className="font-medium text-sm">{language === "hi" ? procedure.titleHindi : procedure.title}</div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
