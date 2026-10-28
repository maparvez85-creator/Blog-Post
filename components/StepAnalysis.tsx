import React from 'react';
import { Keyword } from '../types';
import { ArrowRight, CheckCircle2, Sparkles, Tags, Users, Target } from 'lucide-react';
import LoadingState from './LoadingState';

interface StepAnalysisProps {
  keywords: Keyword[];
  audience: string;
  intent: string;
  onGenerateOutline: () => void;
  isLoading: boolean;
  onBack: () => void;
}

const StepAnalysis: React.FC<StepAnalysisProps> = ({ keywords, audience, intent, onGenerateOutline, isLoading, onBack }) => {
  const primaryKeywords = keywords.filter(k => k.type === 'primary');
  const secondaryKeywords = keywords.filter(k => k.type === 'secondary');
  const lsiKeywords = keywords.filter(k => k.type === 'lsi');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Semantic Analysis Results</h2>
          <p className="text-slate-500 dark:text-slate-400">We analyzed your topic and identified the best targeting strategy.</p>
        </div>
        <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">Back to Topic</button>
      </div>

      {/* Audience and Intent Insight Bar */}
      <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 dark:bg-indigo-900/30 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
         
         <div className="flex items-start gap-3 flex-1 relative z-10">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 shadow-sm mt-1">
                <Users className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wide mb-1">Target Audience</p>
                <p className="font-medium text-slate-800 dark:text-slate-100 leading-relaxed">{audience}</p>
            </div>
         </div>
         
         <div className="hidden md:block w-px bg-indigo-200 dark:bg-indigo-800"></div>
         
         <div className="flex items-start gap-3 flex-1 relative z-10">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-purple-600 dark:text-purple-400 shadow-sm mt-1">
                <Target className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wide mb-1">Search Intent</p>
                <p className="font-medium text-slate-800 dark:text-slate-100 leading-relaxed">{intent}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Primary Keywords */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Primary Keywords</h3>
          </div>
          <div className="space-y-2">
            {primaryKeywords.map((k, i) => (
              <div key={i} className="flex justify-between items-center text-sm p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-100 dark:border-emerald-900">
                <span className="font-medium text-slate-700 dark:text-slate-200">{k.term}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{k.relevance}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Keywords */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
            <Tags className="w-5 h-5" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Secondary Keywords</h3>
          </div>
          <div className="space-y-2">
            {secondaryKeywords.map((k, i) => (
              <div key={i} className="flex justify-between items-center text-sm p-2 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-100 dark:border-blue-900">
                <span className="font-medium text-slate-700 dark:text-slate-200">{k.term}</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{k.relevance}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* LSI Keywords */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Semantic / LSI</h3>
          </div>
          <div className="space-y-2">
            {lsiKeywords.slice(0, 6).map((k, i) => (
              <div key={i} className="flex justify-between items-center text-sm p-2 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-100 dark:border-purple-900">
                <span className="font-medium text-slate-700 dark:text-slate-200">{k.term}</span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{k.relevance}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="flex justify-end">
        {isLoading ? (
          <LoadingState 
            message="Structuring Content..." 
            subMessage="Generating a detailed, SEO-optimized outline"
            className="w-full md:w-auto md:min-w-[300px]"
          />
        ) : (
          <button
            onClick={onGenerateOutline}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 flex items-center gap-2 transition-all"
          >
            Generate Outline
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StepAnalysis;