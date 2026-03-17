import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AmbientMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Using a tech-ambient royalty free track
  const musicUrl = "https://cdn.pixabay.com/download/audio/2022/02/10/audio_7d3c3a0b0b.mp3?filename=ambient-tech-14736.mp3";

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Playback blocked:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <audio ref={audioRef} src={musicUrl} loop />
      <button
        onClick={toggleMusic}
        className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-2xl hover:bg-white/10 transition-all group"
        title={isPlaying ? "Mute Ambient Music" : "Play Ambient Music"}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 animate-pulse" />
        ) : (
          <VolumeX className="w-6 h-6 opacity-30" />
        )}
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black border border-white/10 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isPlaying ? "Mute Ambient" : "Play Ambient"}
        </span>
      </button>
    </div>
  );
};

export default AmbientMusic;
