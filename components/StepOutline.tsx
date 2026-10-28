import React from 'react';
import { OutlineSection } from '../types';
import { GripVertical, Sparkles, Wand2, Loader2 } from 'lucide-react';

interface StepOutlineProps {
  outline: OutlineSection[];
  onGenerateArticle: () => void;
  isLoading: boolean;
  onBack: () => void;
}

const StepOutline: React.FC<StepOutlineProps> = ({ outline, onGenerateArticle, isLoading, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Content Blueprint</h2>
          <p className="text-slate-500 dark:text-slate-400">Review the AI-generated structure before we write.</p>
        </div>
        <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">Back to Analysis</button>
      </div>

      <div className="space-y-4">
        {outline.map((section, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group hover:border-indigo-200 dark:hover:border-indigo-600 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-slate-300 dark:text-slate-600 cursor-move">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-md">H{idx === 0 ? '1' : '2'}</span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{section.title}</h3>
                </div>
                
                <ul className="pl-4 space-y-1">
                  {section.keyPoints.map((point, pIdx) => (
                    <li key={pIdx} className="text-slate-600 dark:text-slate-300 text-sm list-disc marker:text-indigo-300 dark:marker:text-indigo-600">
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-50 dark:border-slate-700">
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Targeted Keywords:
                  </span>
                  {section.suggestedKeywords.map((k, kIdx) => (
                    <span key={kIdx} className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 p-4 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center min-h-[52px]">
            {isLoading ? (
                <div className="w-full flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-400 animate-pulse">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-bold text-lg">Writing Your Masterpiece... This may take a minute.</span>
                </div>
            ) : (
                <>
                    <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:inline-block">
                        {outline.length} sections ready for expansion
                    </span>
                    <button
                        onClick={onGenerateArticle}
                        className="ml-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 flex items-center gap-2 transition-all"
                    >
                        <Wand2 className="w-5 h-5" />
                        Write Full Article
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default StepOutline;