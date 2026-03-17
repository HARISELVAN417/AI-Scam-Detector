import React from 'react';
import RippleButton from './RippleButton';

const InputSection = ({ inputText, setInputText, onAnalyze, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-white rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
        <textarea
          id="news-input"
          className="relative w-full min-h-[200px] p-4 bg-black/80 border border-white/10 rounded-xl shadow-sm focus:border-white/40 focus:ring-1 focus:ring-white/40 outline-none transition-all resize-none text-white placeholder:text-white/30 backdrop-blur-sm"
          placeholder="Paste a financial news article or headline here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <RippleButton
        id="analyze-button"
        onClick={onAnalyze}
        disabled={isLoading || !inputText.trim()}
        className={`w-full py-4 px-6 rounded-xl font-bold text-black shadow-lg transition-all transform active:scale-[0.98] ${
          isLoading || !inputText.trim()
            ? 'bg-white/20 text-white/40 cursor-not-allowed'
            : 'bg-white hover:bg-white/90 shadow-white/10'
        }`}
      >
        {isLoading ? 'Processing...' : 'Analyze Article'}
      </RippleButton>
    </div>
  );
};

export default InputSection;
