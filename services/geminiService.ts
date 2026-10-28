
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, OutlineSection, GeneratedArticle, Keyword, OneClickArticleContent, VsArticleContent, ReviewArticleContent, TroubleshootingArticleContent } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the topic to generate Target Audience, LSI keywords and search intent.
 */
export const analyzeTopic = async (topic: string): Promise<AnalysisResult> => {
  const prompt = `
    Act as a senior SEO Specialist. Analyze the topic "${topic}".
    1. Identify the specific Target Audience that would be most interested in this topic. Be precise.
    2. Identify the search intent.
    3. Generate a list of semantically related keywords (LSI), primary keywords, and secondary keywords.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          audience: { type: Type.STRING },
          intent: { type: Type.STRING },
          keywords: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                relevance: { type: Type.NUMBER },
                type: { type: Type.STRING, enum: ["primary", "secondary", "lsi"] }
              },
              required: ["term", "relevance", "type"]
            }
          }
        },
        required: ["audience", "intent", "keywords"]
      }
    }
  });

  return JSON.parse(response.text) as AnalysisResult;
};

/**
 * Generates a blog post outline.
 */
export const generateOutline = async (topic: string, keywords: Keyword[], tone: string): Promise<OutlineSection[]> => {
  const keywordList = keywords.map(k => k.term).join(", ");
  const prompt = `Create an SEO-optimized blog post outline for "${topic}". Tone: ${tone}. Keywords: ${keywordList}.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "keyPoints", "suggestedKeywords"]
        }
      }
    }
  });

  return JSON.parse(response.text) as OutlineSection[];
};

/**
 * Writes the full article.
 */
export const generateFullArticle = async (topic: string, outline: OutlineSection[], tone: string, keywords: Keyword[]): Promise<GeneratedArticle> => {
  const prompt = `Write a blog post based on: ${JSON.stringify(outline)}. Topic: ${topic}. Tone: ${tone}. Use Markdown. Flesch-Kincaid 80+.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          metaDescription: { type: Type.STRING },
          seoScore: { type: Type.NUMBER },
          wordCount: { type: Type.NUMBER }
        },
        required: ["title", "content", "metaDescription", "seoScore", "wordCount"]
      }
    }
  });

  return JSON.parse(response.text) as GeneratedArticle;
};

/**
 * 1-Click Article
 */
export const generateOneClickArticle = async (rawTopics: string): Promise<OneClickArticleContent> => {
  const prompt = `Act as SEO strategist. Topics: ${rawTopics}. Generate: Focus Keyword, 5-10 Titles, Meta Description (135-145 chars, no colons), Full HTML Article (first-person, conversational, Flesch-Kincaid 80+), 5 FAQs, 3 Image Prompts.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          focusKeyword: { type: Type.STRING },
          titleSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          metaDescription: { type: Type.STRING },
          articleContent: { type: Type.STRING },
          faqs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } }, required: ["question", "answer"] } },
          imagePrompts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["focusKeyword", "titleSuggestions", "metaDescription", "articleContent", "faqs", "imagePrompts"]
      }
    }
  });

  return JSON.parse(response.text) as OneClickArticleContent;
}

/**
 * VS Article
 */
export const generateVsArticle = async (comparisonTopic: string): Promise<VsArticleContent> => {
  const prompt = `Product Reviewer Comparison for: ${comparisonTopic}. Structure: Narrative Intro, Individual Reviews, Criteria Comparison, Final Verdict. Tone: First-person, Conversational, Flesch-Kincaid 80+. Generate HTML article body and Metadata.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          focusKeyword: { type: Type.STRING },
          titleSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          metaDescription: { type: Type.STRING },
          intro: { type: Type.STRING },
          articleBody: { type: Type.STRING },
          faqs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } }, required: ["question", "answer"] } }
        },
        required: ["focusKeyword", "titleSuggestions", "metaDescription", "intro", "articleBody", "faqs"]
      }
    }
  });

  return JSON.parse(response.text) as VsArticleContent;
};

/**
 * Product Review Article
 */
export const generateReviewArticle = async (productToReview: string, productAlsoUsed: string): Promise<ReviewArticleContent> => {
  const prompt = `Review for ${productToReview}, mentioning ${productAlsoUsed}. Structure: Narrative Intro, What I Like, What Could Be Better, Personal Experience, Comparison Table, Recommendation. Tone: First-person, empathetic, Flesch-Kincaid 80+. Generate HTML articleContent and Metadata.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          focusKeyword: { type: Type.STRING },
          titleSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          metaDescription: { type: Type.STRING },
          articleContent: { type: Type.STRING },
          faqs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } }, required: ["question", "answer"] } }
        },
        required: ["focusKeyword", "titleSuggestions", "metaDescription", "articleContent", "faqs"]
      }
    }
  });

  return JSON.parse(response.text) as ReviewArticleContent;
};

/**
 * LinkedIn Review
 */
export const generateLinkedinReview = async (productToReview: string, productAlsoUsed: string): Promise<ReviewArticleContent> => {
  const prompt = `LinkedIn post review for ${productToReview}. Smart AI use: bulleted observations, no tables, text-based comparison. Tone: Professional friend, conversational, Flesch-Kincaid 80+. Generate HTML and Metadata.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          focusKeyword: { type: Type.STRING },
          titleSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          metaDescription: { type: Type.STRING },
          articleContent: { type: Type.STRING },
          faqs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } }, required: ["question", "answer"] } }
        },
        required: ["focusKeyword", "titleSuggestions", "metaDescription", "articleContent", "faqs"]
      }
    }
  });

  return JSON.parse(response.text) as ReviewArticleContent;
};

/**
 * Troubleshooting / Problem Solving Article
 */
export const generateTroubleshootingArticle = async (product: string, issue: string): Promise<TroubleshootingArticleContent> => {
  const generationPrompt = `
    Act as an expert technical support specialist and helpful home blogger. Write a detailed "Problem Solving" article for the issue: "${issue}" with the product: "${product}".

    **WRITING PATTERN & TONE**:
    - **Narrative Hook**: Start with a relatable, first-person "disaster" story (e.g., "It was a random weeknight when...").
    - **Perspective**: First-person ("I"). Empathetic, honest, and conversational.
    - **Readability**: Flesch-Kincaid 80+ score. Short sentences, concise paragraphs (max 3 lines).
    - **Formatting**: Use clean HTML (H1, H2, H3, p, strong, ul, li).

    **ARTICLE STRUCTURE**:
    1. **Introduction** (Narrative): Set the scene, explain the sinking feeling of the failure.
    2. **H2: Diagnostic**: List symptoms (No fan noise, no lights, etc.).
    3. **H2: Basic Checks**: Rule out power strips, plugs, and obvious user errors.
    4. **H2: Symptom-Based Solutions**: Create sections (H3s) for specific issues (e.g., "No Power", "Display On But No Heat", "Shutting Off Mid-Cook").
    5. **H2: The "Reset" Logic**: How to perform a real reset and when it won't help.
    6. **H2: Repair vs Replace**: Honest advice based on product age and repair cost.
    7. **H2: Maintenance/Prevention**: Habits to avoid this in the future.

    **METADATA**:
    - **Titles**: 5-10 SEO-optimized titles. Include "${product}" and "Fix" or "Not Working".
    - **Meta Description**: 135-145 chars. Start with "${product}". Active voice. No colons.
    - **FAQs**: 5 questions about this specific troubleshooting case.

    OUTPUT FORMAT: Return a JSON object with focusKeyword, titleSuggestions, metaDescription, articleContent (HTML), and faqs.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: generationPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          focusKeyword: { type: Type.STRING },
          titleSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          metaDescription: { type: Type.STRING },
          articleContent: { type: Type.STRING },
          faqs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } }, required: ["question", "answer"] } }
        },
        required: ["focusKeyword", "titleSuggestions", "metaDescription", "articleContent", "faqs"]
      }
    }
  });

  return JSON.parse(response.text) as TroubleshootingArticleContent;
};
