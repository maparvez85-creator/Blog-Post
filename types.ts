
export interface Keyword {
  term: string;
  relevance: number; // 0-100
  type: 'primary' | 'secondary' | 'lsi';
}

export interface OutlineSection {
  title: string;
  keyPoints: string[];
  suggestedKeywords: string[];
}

export interface GeneratedArticle {
  title: string;
  content: string; // Markdown
  metaDescription: string;
  seoScore: number;
  wordCount: number;
}

export interface AppState {
  topic: string;
  targetAudience: string;
  tone: string;
  keywords: Keyword[];
  outline: OutlineSection[];
  article: GeneratedArticle | null;
  currentStep: Step;
  isLoading: boolean;
  error: string | null;
  intent: string;
}

export enum Step {
  INPUT = 0,
  ANALYSIS = 1,
  OUTLINE = 2,
  RESULT = 3,
}

export interface AnalysisResult {
  keywords: Keyword[];
  intent: string;
  audience: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface OneClickArticleContent {
  focusKeyword: string;
  titleSuggestions: string[];
  metaDescription: string;
  articleContent: string; // HTML
  faqs: FAQ[];
  imagePrompts: string[];
}

export interface VsArticleContent {
  focusKeyword: string;
  titleSuggestions: string[];
  metaDescription: string;
  intro: string;
  articleBody: string; // HTML containing reviews and comparison
  faqs: FAQ[];
}

export interface ReviewArticleContent {
  focusKeyword: string;
  titleSuggestions: string[];
  metaDescription: string;
  articleContent: string; // HTML
  faqs: FAQ[];
}

export interface TroubleshootingArticleContent {
  focusKeyword: string;
  titleSuggestions: string[];
  metaDescription: string;
  articleContent: string; // HTML
  faqs: FAQ[];
}
