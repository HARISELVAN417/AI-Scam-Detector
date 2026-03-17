import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, RefreshCw } from 'lucide-react';
import ClaimCard from './ClaimCard';
import RippleButton from './RippleButton';
import MagneticWrapper from './MagneticWrapper';

const VerdictCard = ({ data, onReset }) => {
  const { verdict, confidence, summary, claim_results } = data;

  const getVerdictConfig = () => {
    switch (verdict) {
      case 'REAL':
        return {
          color: 'text-white',
          bg: 'bg-white/5',
          border: 'border-white/20',
          icon: <CheckCircle2 className="w-10 h-10 text-white" />,
          label: 'REAL',
          accent: 'bg-white'
        };
      case 'FAKE':
        return {
          color: 'text-white/60',
          bg: 'bg-white/5',
          border: 'border-white/10',
          icon: <XCircle className="w-10 h-10 text-white/60" />,
          label: 'FAKE',
          accent: 'bg-white/40'
        };
      default:
        return {
          color: 'text-white/80',
          bg: 'bg-white/5',
          border: 'border-white/15',
          icon: <HelpCircle className="w-10 h-10 text-white/80" />,
          label: 'UNVERIFIED',
          accent: 'bg-white/60'
        };
    }
  };

  const config = getVerdictConfig();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 pb-20">
      {/* Main Verdict Card */}
      <div className={`relative p-10 rounded-3xl border ${config.bg} ${config.border} backdrop-blur-md shadow-2xl overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-black/50 rounded-2xl border border-white/10 shadow-inner">
            {config.icon}
          </div>
          <div>
            <h2 className={`text-5xl font-black tracking-tighter ${config.color}`}>
              {config.label}
            </h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs mt-2">Final Verdict</p>
          </div>
        </div>

        <div className="relative z-10 mt-10 space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-white/60">Analysis Confidence</span>
            <span className={`text-3xl font-black ${config.color}`}>{confidence}%</span>
          </div>
          <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden border border-white/5 p-1">
            <div 
              className={`h-full rounded-full transition-all duration-1500 ease-out shadow-[0_0_15px_rgba(255,255,255,0.2)] ${config.accent}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        <div className="relative z-10 mt-8 p-6 bg-black/40 rounded-2xl border border-white/5">
          <p className="text-white/90 leading-relaxed text-lg font-medium italic text-center">
            "{summary}"
          </p>
        </div>
      </div>

      {/* Claim Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <h3 className="text-2xl font-black text-white tracking-tight">Claim Breakdown</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
        </div>
        <div className="grid gap-6">
          {claim_results.map((claim, idx) => (
            <ClaimCard key={idx} {...claim} />
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="pt-8 flex justify-center">
        <MagneticWrapper strength={0.2}>
          <RippleButton
            onClick={onReset}
            className="flex items-center gap-3 px-10 py-4 bg-white text-slate-950 font-black rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            <RefreshCw size={20} />
            Analyze Another Article
          </RippleButton>
        </MagneticWrapper>
      </div>
    </div>
  );
};

export default VerdictCard;
