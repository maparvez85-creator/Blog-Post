import React, { useState } from 'react';
import { GeneratedArticle } from '../types';
import { Check, Copy, Download, RefreshCw, Star, Trophy } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StepResultProps {
  article: GeneratedArticle;
  onReset: () => void;
  theme: 'light' | 'dark';
}

const StepResult: React.FC<StepResultProps> = ({ article, onReset, theme }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(article.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const data = [
    { name: 'Score', value: article.seoScore },
    { name: 'Remaining', value: 100 - article.seoScore },
  ];
  const COLORS = ['#4f46e5', theme === 'dark' ? '#334155' : '#e2e8f0'];

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in pb-12">
      
      {/* Sidebar / Stats */}
      <div className="w-full md:w-80 space-y-6 md:sticky md:top-6 h-fit order-2 md:order-1">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-2">Semantic SEO Score</h3>
            <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={180}
                        endAngle={0}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                    <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{article.seoScore}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">/ 100</span>
                </div>
            </div>
            
            <div className="w-full space-y-4 mt-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Word Count</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{article.wordCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Readability</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Good</span>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
             <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> SEO Wins
             </h3>
             <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> Keyword optimized title
                </li>
                <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> Semantic density ok
                </li>
                <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> Meta description ready
                </li>
             </ul>
        </div>

        <button 
            onClick={onReset}
            className="w-full py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
            <RefreshCw className="w-4 h-4" />
            Start New Article
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 order-1 md:order-2">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="border-b border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-700/50">
                <h2 className="font-semibold text-slate-700 dark:text-slate-200">Article Preview</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={handleCopy}
                        className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-sm text-slate-600 dark:text-slate-200 hover:text-indigo-600 hover:border-indigo-200 dark:hover:text-indigo-400 dark:hover:border-indigo-600 transition-colors flex items-center gap-2"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    {/* Placeholder for download functionality */}
                    <button className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-sm text-slate-600 dark:text-slate-200 hover:text-indigo-600 hover:border-indigo-200 dark:hover:text-indigo-400 dark:hover:border-indigo-600 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>
            
            <div className="p-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-indigo-600">
                <h1 className="text-3xl font-extrabold mb-6 text-slate-900">{article.title}</h1>
                <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
                  {article.content}
                </div>
                
                <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Meta Description</h4>
                    <p className="text-slate-700 dark:text-slate-200 italic">{article.metaDescription}</p>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default StepResult;