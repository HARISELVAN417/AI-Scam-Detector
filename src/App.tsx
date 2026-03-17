import React, { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InputSection from './components/InputSection';
import LoadingState from './components/LoadingState';
import VerdictCard from './components/VerdictCard';
import Background3D from './components/Background3D';
import RippleButton from './components/RippleButton';
import NoiseOverlay from './components/NoiseOverlay';
import MagneticWrapper from './components/MagneticWrapper';
import AmbientMusic from './components/AmbientMusic';

import { analyzeFinancialNews } from './services/geminiService';

export default function App() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'result' | 'error'
  const [inputText, setInputText] = useState('');
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const data = await analyzeFinancialNews(inputText);
      setResultData(data);
      setStatus('result');
    } catch (err) {
      console.error(err);
      setErrorMessage('AI Analysis failed. Please check your input or try again later.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setInputText('');
    setResultData(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/30 overflow-x-hidden scroll-smooth">
      <Background3D />
      <NoiseOverlay />
      <AmbientMusic />

      {/* Header */}
      <header className="relative z-10 py-12">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-4">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <MagneticWrapper>
              <div className="p-3 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-shadow duration-500">
                <ShieldCheck className="w-10 h-10 text-black" />
              </div>
            </MagneticWrapper>
            <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">FinFact</h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 font-black tracking-[0.3em] uppercase text-xs"
          >
            AI-powered financial news verification
          </motion.p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tight">Verify Financial News</h2>
                <p className="text-white/50 max-w-lg mx-auto text-lg leading-relaxed">
                  Paste any financial news snippet or article below to check its authenticity against verified market data.
                </p>
              </div>
              <InputSection 
                inputText={inputText} 
                setInputText={setInputText} 
                onAnalyze={handleAnalyze} 
                isLoading={false}
              />
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {status === 'result' && resultData && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <VerdictCard data={resultData} onReset={handleReset} />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto p-10 bg-black/80 border border-white/20 rounded-3xl shadow-2xl text-center space-y-8 backdrop-blur-xl"
            >
              <div className="flex justify-center">
                <div className="p-5 bg-white/10 rounded-full border border-white/20">
                  <AlertCircle className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white">Analysis Failed</h3>
                <p className="text-white/60 text-lg">{errorMessage}</p>
              </div>
              <MagneticWrapper strength={0.2}>
                <RippleButton
                  onClick={handleReset}
                  className="w-full py-4 px-12 bg-white text-black font-black rounded-2xl shadow-lg transition-all"
                >
                  Try Again
                </RippleButton>
              </MagneticWrapper>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-white/40 text-sm font-medium">
        <p>&copy; 2026 FinFact News Verification. All rights reserved.</p>
      </footer>
    </div>
  );
}
