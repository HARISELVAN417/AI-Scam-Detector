import React from 'react';
import { ExternalLink } from 'lucide-react';

const ClaimCard = ({ claim, result, source, explanation }) => {
  const getBadgeStyles = () => {
    switch (result) {
      case 'SUPPORTED':
        return 'bg-white/10 text-white border-white/20';
      case 'REFUTED':
        return 'bg-white/5 text-white/60 border-white/10';
      default:
        return 'bg-white/5 text-white/80 border-white/15';
    }
  };

  return (
    <div className="p-6 bg-black/60 border border-white/5 rounded-2xl shadow-lg backdrop-blur-sm hover:border-white/30 transition-all space-y-4 group">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h4 className="flex-1 font-bold text-white/90 text-lg leading-tight group-hover:text-white transition-colors">
          {claim}
        </h4>
        <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider border ${getBadgeStyles()}`}>
          {result}
        </span>
      </div>
      
      <p className="text-white/50 leading-relaxed">
        {explanation}
      </p>

      {source && (
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors underline underline-offset-4"
        >
          View Verified Source <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
};

export default ClaimCard;
