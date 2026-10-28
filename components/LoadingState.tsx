import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message: string;
  subMessage?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message, subMessage, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center animate-fade-in space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin relative z-10" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{message}</h3>
        {subMessage && <p className="text-sm text-slate-500 dark:text-slate-400">{subMessage}</p>}
      </div>
    </div>
  );
};

export default LoadingState;