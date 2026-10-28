
import React, { useState, useEffect } from 'react';
import { AppState, Step } from './types';
import * as GeminiService from './services/geminiService';
import StepInput from './components/StepInput';
import StepAnalysis from './components/StepAnalysis';
import StepOutline from './components/StepOutline';
import StepResult from './components/StepResult';
import { BookOpen, ChevronRight, Layers, Layout, Moon, Search, Sparkles, Sun, Swords, Star, Linkedin, Wrench } from 'lucide-react';
import OneClickArticle from './components/OneClickArticle';
import VsArticle from './components/VsArticle';
import ReviewArticle from './components/ReviewArticle';
import LinkedinReview from './components/LinkedinReview';
import TroubleshootArticle from './components/TroubleshootArticle';

const initialState: AppState = {
  topic: '',
  targetAudience: '',
  tone: 'Professional & Authoritative',
  keywords: [],
  outline: [],
  article: null,
  currentStep: Step.INPUT,
  isLoading: false,
  error: null,
  intent: '',
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [activeTab, setActiveTab] = useState<'semantic' | 'oneClick' | 'vs' | 'review' | 'linkedin' | 'troubleshoot'>('oneClick');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleError = (error: any) => {
    console.error(error);
    setState(prev => ({ ...prev, isLoading: false, error: 'An error occurred. Please try again.' }));
  };

  // Step 1 -> 2
  const handleAnalyze = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await GeminiService.analyzeTopic(state.topic);
      setState(prev => ({
        ...prev,
        isLoading: false,
        keywords: result.keywords,
        targetAudience: result.audience,
        intent: result.intent,
        currentStep: Step.ANALYSIS
      }));
    } catch (err) {
      handleError(err);
    }
  };

  // Step 2 -> 3
  const handleGenerateOutline = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const outline = await GeminiService.generateOutline(state.topic, state.keywords, state.tone);
      setState(prev => ({
        ...prev,
        isLoading: false,
        outline,
        currentStep: Step.OUTLINE
      }));
    } catch (err) {
      handleError(err);
    }
  };

  // Step 3 -> 4
  const handleWriteArticle = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const article = await GeminiService.generateFullArticle(state.topic, state.outline, state.tone, state.keywords);
      setState(prev => ({
        ...prev,
        isLoading: false,
        article,
        currentStep: Step.RESULT
      }));
    } catch (err) {
      handleError(err);
    }
  };

  const handleReset = () => {
    setState(initialState);
  };

  const goBack = () => {
    setState(prev => {
        const newStep = Math.max(0, prev.currentStep - 1);
        return { ...prev, currentStep: newStep };
    });
  };

  // --- Render ---
  const TabButton = ({ tabName, label, icon, currentTab, setTab }) => {
    const isActive = tabName === currentTab;
    const Icon = icon;
    return (
        <button
            onClick={() => setTab(tabName)}
            className={`flex items-center justify-center w-full gap-2 px-2 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
        >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight">Semantix</span>
          </div>
          
          {activeTab === 'semantic' && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-400 dark:text-slate-500">
              <span className={`flex items-center gap-1 ${state.currentStep >= Step.INPUT ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                 <Search className="w-4 h-4" /> Topic
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className={`flex items-center gap-1 ${state.currentStep >= Step.ANALYSIS ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                 <Layers className="w-4 h-4" /> Analysis
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className={`flex items-center gap-1 ${state.currentStep >= Step.OUTLINE ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                 <Layout className="w-4 h-4" /> Outline
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className={`flex items-center gap-1 ${state.currentStep >= Step.RESULT ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                 <BookOpen className="w-4 h-4" /> Article
              </span>
            </nav>
          )}

          <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
         {/* Tab Navigation */}
         <div className="max-w-4xl mx-auto mb-8 grid grid-cols-3 md:grid-cols-6 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            <TabButton 
                tabName="semantic" 
                label="Semantic" 
                icon={Layers} 
                currentTab={activeTab} 
                setTab={setActiveTab} 
            />
             <TabButton 
                tabName="oneClick" 
                label="1-Click" 
                icon={Sparkles} 
                currentTab={activeTab} 
                setTab={setActiveTab} 
            />
             <TabButton 
                tabName="vs" 
                label="VS Writer" 
                icon={Swords} 
                currentTab={activeTab} 
                setTab={setActiveTab} 
            />
             <TabButton 
                tabName="review" 
                label="Review" 
                icon={Star} 
                currentTab={activeTab} 
                setTab={setActiveTab} 
            />
             <TabButton 
                tabName="linkedin" 
                label="LinkedIn" 
                icon={Linkedin} 
                currentTab={activeTab} 
                setTab={setActiveTab} 
            />
             <TabButton 
                tabName="troubleshoot" 
                label="Troubleshoot" 
                icon={Wrench} 
                currentTab={activeTab} 
                setTab={setActiveTab} 
            />
        </div>

        {state.error && activeTab === 'semantic' && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-800 flex items-center justify-between">
                <span>{state.error}</span>
                <button onClick={() => setState(s => ({...s, error: null}))} className="text-sm underline">Dismiss</button>
            </div>
        )}

        {activeTab === 'semantic' && (
            <>
                {state.currentStep === Step.INPUT && (
                <StepInput
                    topic={state.topic}
                    setTopic={(t) => setState(s => ({ ...s, topic: t }))}
                    tone={state.tone}
                    setTone={(t) => setState(s => ({ ...s, tone: t }))}
                    onNext={handleAnalyze}
                    isLoading={state.isLoading}
                />
                )}

                {state.currentStep === Step.ANALYSIS && (
                <StepAnalysis
                    keywords={state.keywords}
                    audience={state.targetAudience}
                    intent={state.intent}
                    onGenerateOutline={handleGenerateOutline}
                    isLoading={state.isLoading}
                    onBack={goBack}
                />
                )}

                {state.currentStep === Step.OUTLINE && (
                    <StepOutline
                        outline={state.outline}
                        onGenerateArticle={handleWriteArticle}
                        isLoading={state.isLoading}
                        onBack={goBack}
                    />
                )}

                {state.currentStep === Step.RESULT && state.article && (
                    <StepResult
                        article={state.article}
                        onReset={handleReset}
                        theme={theme}
                    />
                )}
            </>
        )}

        {activeTab === 'oneClick' && <OneClickArticle />}
        {activeTab === 'vs' && <VsArticle />}
        {activeTab === 'review' && <ReviewArticle />}
        {activeTab === 'linkedin' && <LinkedinReview />}
        {activeTab === 'troubleshoot' && <TroubleshootArticle />}
      </main>

    </div>
  );
}
