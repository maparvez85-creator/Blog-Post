import React from 'react';
import { Loader2, PenLine, Target } from 'lucide-react';
import LoadingState from './LoadingState';

interface StepInputProps {
  topic: string;
  setTopic: (val: string) => void;
  tone: string;
  setTone: (val: string) => void;
  onNext: () => void;
  isLoading: boolean;
}

const StepInput: React.FC<StepInputProps> = ({
  topic,
  setTopic,
  tone,
  setTone,
  onNext,
  isLoading
}) => {
  const isReady = topic.length > 5;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">What are we writing about?</h2>
        <p className="text-slate-500 dark:text-slate-400">Enter your main topic and we'll automatically identify the perfect audience and keywords.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
        
        {/* Topic Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <PenLine className="w-4 h-4" />
            Main Topic / Focus Keyword
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'Best vegan protein sources for athletes'"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Target className="w-4 h-4" />
            Content Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all outline-none text-slate-800 dark:text-slate-100 appearance-none"
          >
            <option value="Professional & Authoritative">Professional & Authoritative</option>
            <option value="Conversational & Friendly">Conversational & Friendly</option>
            <option value="Informative & Educational">Informative & Educational</option>
            <option value="Persuasive & Sales-oriented">Persuasive & Sales-oriented</option>
            <option value="Witty & Humorous">Witty & Humorous</option>
          </select>
        </div>

        {isLoading ? (
          <LoadingState 
            message="Analyzing Topic..." 
            subMessage="Identifying target audience and search intent" 
          />
        ) : (
          <button
            onClick={onNext}
            disabled={!isReady}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all transform active:scale-[0.98] ${
              isReady
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50'
                : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
            }`}
          >
            Analyze Topic
          </button>
        )}
      </div>
    </div>
  );
};

export default StepInput;