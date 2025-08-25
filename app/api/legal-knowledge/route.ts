import { type NextRequest, NextResponse } from "next/server"
import legalData from "@/data/legal-knowledge.json"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const category = searchParams.get("category")
  const lang = searchParams.get("lang") || "en"

  try {
    let results = legalData

    // Filter by category if specified
    if (category) {
      results = {
        ...results,
        categories: results.categories.filter((cat) => cat.id === category),
      }
    }

    // Search functionality
    if (query) {
      const searchTerm = query.toLowerCase()
      const filteredCategories = results.categories
        .map((category) => ({
          ...category,
          articles: category.articles.filter((article) => {
            const titleMatch =
              lang === "hi"
                ? article.titleHindi?.toLowerCase().includes(searchTerm)
                : article.title.toLowerCase().includes(searchTerm)

            const summaryMatch =
              lang === "hi"
                ? article.summaryHindi?.toLowerCase().includes(searchTerm)
                : article.summary.toLowerCase().includes(searchTerm)

            const keyPointsMatch =
              lang === "hi"
                ? article.keyPointsHindi?.some((point) => point.toLowerCase().includes(searchTerm))
                : article.keyPoints.some((point) => point.toLowerCase().includes(searchTerm))

            return titleMatch || summaryMatch || keyPointsMatch
          }),
        }))
        .filter((category) => category.articles.length > 0)

      const filteredProcedures = results.procedures.filter((procedure) => {
        const titleMatch =
          lang === "hi"
            ? procedure.titleHindi?.toLowerCase().includes(searchTerm)
            : procedure.title.toLowerCase().includes(searchTerm)

        const stepsMatch =
          lang === "hi"
            ? procedure.stepsHindi?.some((step) => step.toLowerCase().includes(searchTerm))
            : procedure.steps.some((step) => step.toLowerCase().includes(searchTerm))

        return titleMatch || stepsMatch
      })

      results = {
        categories: filteredCategories,
        procedures: filteredProcedures,
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching legal knowledge:", error)
    return NextResponse.json({ error: "Failed to fetch legal knowledge" }, { status: 500 })
  }
}
