import React, { useState } from 'react';
import * as GeminiService from '../services/geminiService';
import { ReviewArticleContent } from '../types';
import { Star, Tag, Clipboard, Check, ChevronRight, FileText, ClipboardCheck, ShoppingBag, LayoutTemplate } from 'lucide-react';
import LoadingState from './LoadingState';

const ReviewArticle = () => {
  const [product, setProduct] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReviewArticleContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async () => {
    if (!product.trim() || !competitor.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const content = await GeminiService.generateReviewArticle(product, competitor);
      setResult(content);
    } catch (e) {
      console.error(e);
      setError('Failed to generate the review article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleCopyAll = async () => {
    if (!result) return;
    
    const title = result.titleSuggestions[0] || result.focusKeyword;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body>
        <h1>${title}</h1>
        <p><strong>Meta Description:</strong> ${result.metaDescription}</p>
        <hr />
        ${result.articleContent}
        <hr />
        <h2>Frequently Asked Questions</h2>
        ${result.faqs.map(f => `<h3>${f.question}</h3><p>${f.answer}</p>`).join('')}
      </body>
      </html>
    `;

    try {
        const blobHtml = new Blob([fullHtml], { type: "text/html" });
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullHtml;
        const blobText = new Blob([tempDiv.innerText], { type: "text/plain" });
  
        const data = [new ClipboardItem({
          "text/html": blobHtml,
          "text/plain": blobText,
        })];
  
        await navigator.clipboard.write(data);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } catch (err) {
        console.error("Failed to copy rich text:", err);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullHtml;
        navigator.clipboard.writeText(tempDiv.innerText);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Product Review Writer</h2>
        <p className="text-slate-500 dark:text-slate-400">Generate an in-depth, experience-based review with a competitor comparison.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="product-input" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Product to Review (Focus Keyword)
                    </label>
                    <input
                        id="product-input"
                        type="text"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder="e.g., Ninja BL660"
                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
                
                <div className="space-y-2">
                     <label htmlFor="competitor-input" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Product I've Also Used (For Comparison)
                    </label>
                    <input
                        id="competitor-input"
                        type="text"
                        value={competitor}
                        onChange={(e) => setCompetitor(e.target.value)}
                        placeholder="e.g., Ninja BN751"
                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4 h-full">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Star className="w-5 h-5 text-indigo-500" />
                    Review Features
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-3"><LayoutTemplate className="w-4 h-4 mt-1 text-indigo-400 shrink-0" /><span>Structured "What I Like" & "What Could Be Better".</span></li>
                    <li className="flex items-start gap-3"><FileText className="w-4 h-4 mt-1 text-indigo-400 shrink-0" /><span>Comparison table with the second product.</span></li>
                    <li className="flex items-start gap-3"><ShoppingBag className="w-4 h-4 mt-1 text-indigo-400 shrink-0" /><span>Personal experience section ("I found that...").</span></li>
                    <li className="flex items-start gap-3"><Check className="w-4 h-4 mt-1 text-indigo-400 shrink-0" /><span>Flesch-Kincaid 80+ Readability optimized.</span></li>
                </ul>
            </div>
        </div>
        <div className="mt-8">
            {isLoading ? (
                <LoadingState 
                    message="Writing Comprehensive Review..." 
                    subMessage="Analyzing products and structuring your review article."
                />
            ) : (
                <button
                    onClick={handleGenerate}
                    disabled={!product.trim() || !competitor.trim()}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all transform active:scale-[0.98] ${
                        (product.trim() && competitor.trim())
                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50'
                        : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
                    }`}
                >
                    <Star className="w-5 h-5" />
                    Generate Review Article
                </button>
            )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-fade-in">
             {/* Copy All Button */}
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                    <Check className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Review Ready!</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Includes comparison table and SEO assets.</p>
                </div>
                </div>
                <button
                onClick={handleCopyAll}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 flex items-center justify-center gap-2 transition-all"
                >
                {copiedAll ? (
                    <>
                    <Check className="w-5 h-5" />
                    Structure Copied!
                    </>
                ) : (
                    <>
                    <ClipboardCheck className="w-5 h-5" />
                    Copy All (Structured)
                    </>
                )}
                </button>
            </div>

            {/* Title Suggestions */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Title Suggestions</h3>
                <div className="space-y-2">
                {result.titleSuggestions.map((title, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-slate-700 dark:text-slate-200">{title}</p>
                    <button onClick={() => handleCopy(title, `title-${index}`)} className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        {copiedStates[`title-${index}`] ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
                    </button>
                    </div>
                ))}
                </div>
            </div>

            {/* Meta Description */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Meta Description</h3>
                <div className="flex justify-between items-start p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-slate-700 dark:text-slate-200 italic">{result.metaDescription}</p>
                    <button onClick={() => handleCopy(result.metaDescription, 'meta')} className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex-shrink-0 ml-4">
                        {copiedStates['meta'] ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Content Preview */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="border-b border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-700/50">
                    <h2 className="font-semibold text-slate-700 dark:text-slate-200">Article Preview</h2>
                    <button onClick={() => handleCopy(result.articleContent, 'content')} className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-sm text-slate-600 dark:text-slate-200 hover:text-indigo-600 hover:border-indigo-200 dark:hover:text-indigo-400 dark:hover:border-indigo-600 transition-colors flex items-center gap-2">
                        {copiedStates['content'] ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                        {copiedStates['content'] ? 'Copied' : 'Copy HTML'}
                    </button>
                </div>
                
                <div className="p-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-indigo-600 prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-700 prose-th:bg-slate-50 dark:prose-th:bg-slate-800 prose-th:p-3 prose-td:p-3">
                    <div dangerouslySetInnerHTML={{ __html: result.articleContent }} />
                </div>
            </div>

            {/* FAQs */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Frequently Asked Questions (FAQ)</h3>
                <div className="space-y-4">
                {result.faqs.map((faq, index) => (
                    <details key={index} className="group border-b border-slate-100 dark:border-slate-700 pb-2">
                    <summary className="font-semibold text-slate-700 dark:text-slate-200 cursor-pointer list-none flex justify-between items-center py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 px-2 rounded-lg transition-colors">
                        <span className="flex-1">{faq.question}</span>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCopy(`Q: ${faq.question}\nA: ${faq.answer}`, `faq-${index}`);
                                }}
                                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                title="Copy FAQ"
                            >
                                {copiedStates[`faq-${index}`] ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
                            </button>
                            <div className="text-slate-400 dark:text-slate-500 transform transition-transform group-open:rotate-90">
                            <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </summary>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 pl-2 border-l-2 border-indigo-200 dark:border-indigo-700">{faq.answer}</p>
                    </details>
                ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReviewArticle;