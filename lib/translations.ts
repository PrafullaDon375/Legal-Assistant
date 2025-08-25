export const translations = {
  en: {
    // Header and Navigation
    appTitle: "Legal Assistant",
    appSubtitle: "Know Your Rights",
    chatTitle: "Legal Awareness Chat",
    chatSubtitle: "Learn about your legal rights",

    // Categories
    categories: "Legal Categories",
    constitutionalRights: "Constitutional Rights",
    consumerProtection: "Consumer Protection",
    laborLaws: "Labor Laws",
    familyLaw: "Family Law",

    // Category prompts
    constitutionalRightsPrompt: "Tell me about my fundamental rights under the Indian Constitution",
    consumerProtectionPrompt: "What are my rights as a consumer in India?",
    laborLawsPrompt: "Explain basic labor rights for employees in India",
    familyLawPrompt: "What should I know about family law in India?",

    // UI Elements
    inputPlaceholder: "Type your legal question here...",
    listening: "Listening...",
    thinking: "Thinking...",
    aiPowered: "AI Powered",
    send: "Send",

    // Welcome message
    welcomeMessage:
      "Hello! I am your Legal Awareness Assistant. I can help you understand your rights and legal information. You can ask me questions in Hindi or English.",

    // Footer
    privateConversations: "Your conversations are private",
    poweredBy: "Powered by Google Gemini AI",
    specializedFor: "Specialized for Indian Law",
    disclaimer: "This AI assistant provides general information only. Consult a lawyer for legal advice.",

    // Search and Knowledge
    searchPlaceholder: "Search legal information...",
    legalProcedures: "Legal Procedures",
    noResults: "No results found",

    // Speech-related translations
    speaking: "Speaking...",
    listen: "Listen",
    voiceRecognized: "Voice Recognized",
    speechError: "Speech Recognition Error",
    ttsError: "Text-to-Speech Error",
    notSupported: "Not Supported",
    browserNotSupported: "Your browser doesn't support this feature",
  },
  hi: {
    // Header and Navigation
    appTitle: "कानूनी सहायक",
    appSubtitle: "अपने अधिकार जानें",
    chatTitle: "कानूनी जागरूकता चैट",
    chatSubtitle: "अपने कानूनी अधिकारों के बारे में जानें",

    // Categories
    categories: "कानूनी श्रेणियां",
    constitutionalRights: "संवैधानिक अधिकार",
    consumerProtection: "उपभोक्ता संरक्षण",
    laborLaws: "श्रम कानून",
    familyLaw: "पारिवारिक कानून",

    // Category prompts
    constitutionalRightsPrompt: "भारतीय संविधान के तहत मेरे मौलिक अधिकारों के बारे में बताएं",
    consumerProtectionPrompt: "भारत में एक उपभोक्ता के रूप में मेरे क्या अधिकार हैं?",
    laborLawsPrompt: "भारत में कर्मचारियों के लिए बुनियादी श्रम अधिकारों की व्याख्या करें",
    familyLawPrompt: "भारत में पारिवारिक कानून के बारे में मुझे क्या जानना चाहिए?",

    // UI Elements
    inputPlaceholder: "अपना कानूनी सवाल यहाँ लिखें...",
    listening: "सुन रहा है...",
    thinking: "सोच रहा है...",
    aiPowered: "AI संचालित",
    send: "भेजें",

    // Welcome message
    welcomeMessage:
      "नमस्ते! मैं आपका कानूनी जागरूकता सहायक हूं। मैं आपको आपके अधिकारों और कानूनी जानकारी को समझने में मदद कर सकता हूं। आप मुझसे हिंदी या अंग्रेजी में सवाल पूछ सकते हैं।",

    // Footer
    privateConversations: "आपकी बातचीत निजी है",
    poweredBy: "Google Gemini AI द्वारा संचालित",
    specializedFor: "भारतीय कानून के लिए विशेषज्ञ",
    disclaimer: "यह AI सहायक केवल सामान्य जानकारी प्रदान करता है। कानूनी सलाह के लिए वकील से संपर्क करें।",

    // Search and Knowledge
    searchPlaceholder: "कानूनी जानकारी खोजें...",
    legalProcedures: "कानूनी प्रक्रियाएं",
    noResults: "कोई परिणाम नहीं मिला",

    // Speech-related translations
    speaking: "बोल रहा है...",
    listen: "सुनें",
    voiceRecognized: "आवाज पहचानी गई",
    speechError: "आवाज पहचानने में त्रुटि",
    ttsError: "बोलने में त्रुटि",
    notSupported: "समर्थित नहीं",
    browserNotSupported: "आपका ब्राउज़र इस सुविधा का समर्थन नहीं करता",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key] || translations.en[key]
}
