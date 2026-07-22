import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Music, VolumeX, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LiturgyPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("gregorian-drone");
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);

  // Audio nodes refs for Live Web Audio synthesis!
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Waves simulation for the waveform visualizer
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(24).fill(12));
  const animationFrameId = useRef<number | null>(null);

  const tracks = [
    { id: "gregorian-drone", name: "Gregorian Drone (C-G-C-E)", desc: "Quiet vocal drone chord of fifths", freqs: [130.81, 196.00, 261.63, 329.63] },
    { id: "cathedral-peace", name: "Cathedral Hum (F-C-F-A)", desc: "Deep ambient resonance in F major", freqs: [87.31, 130.81, 174.61, 220.00] },
    { id: "sacred-organ", name: "Sacred Organ (A-E-A-C#)", desc: "Warm pipe organ timbre", freqs: [110.00, 164.81, 220.00, 277.18] },
    { id: "eternal-vespers", name: "Eternal Vespers (D-A-D-F)", desc: "Solemn contemplative dark minor", freqs: [73.42, 110.00, 146.83, 174.61] }
  ];

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
      
      // Main output gain
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }
    
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Start synthesis
  const startSynthesis = () => {
    initAudio();
    if (!audioCtxRef.current || !gainNodeRef.current) return;

    // Stop existing nodes first
    stopSynthesis();

    const track = tracks.find((t) => t.id === selectedTrack) || tracks[0];

    // Set volume
    gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, audioCtxRef.current.currentTime);

    // Create a low-pass filter to make it sound warm, soft, and cathedral-like
    const lowpass = audioCtxRef.current.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(320, audioCtxRef.current.currentTime);
    lowpass.Q.setValueAtTime(1.5, audioCtxRef.current.currentTime);
    lowpass.connect(gainNodeRef.current);
    filtersRef.current.push(lowpass);

    // Create oscillators for the chord
    track.freqs.forEach((freq, idx) => {
      if (!audioCtxRef.current) return;
      
      const osc = audioCtxRef.current.createOscillator();
      const oscGain = audioCtxRef.current.createGain();

      // Sine and triangle waves create a lovely flute/organ hum
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      
      // Detune slightly for lush chorusing chorus
      osc.detune.setValueAtTime((idx - 1.5) * 4, audioCtxRef.current.currentTime);

      // Volume of individual voice (lowered to avoid clipping)
      oscGain.gain.setValueAtTime(0.25, audioCtxRef.current.currentTime);
      
      osc.connect(oscGain);
      oscGain.connect(lowpass);
      
      osc.start();
      oscillatorsRef.current.push(osc);
    });

    // Add a very slow LFO to filter frequency to simulate breathing waves
    const lfo = audioCtxRef.current.createOscillator();
    const lfoGain = audioCtxRef.current.createGain();
    lfo.frequency.setValueAtTime(0.08, audioCtxRef.current.currentTime); // very slow: 12 seconds per wave
    lfoGain.gain.setValueAtTime(120, audioCtxRef.current.currentTime); // oscillate cutoff between 200Hz and 440Hz

    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);
    lfo.start();
    lfoRef.current = lfo;
  };

  const stopSynthesis = () => {
    oscillatorsRef.current.forEach((osc) => {
      try { osc.stop(); } catch(e) {}
      osc.disconnect();
    });
    oscillatorsRef.current = [];

    filtersRef.current.forEach((filter) => {
      filter.disconnect();
    });
    filtersRef.current = [];

    if (lfoRef.current) {
      try { lfoRef.current.stop(); } catch(e) {}
      lfoRef.current.disconnect();
      lfoRef.current = null;
    }
  };

  // Synchronize play state
  useEffect(() => {
    if (isPlaying) {
      startSynthesis();
    } else {
      stopSynthesis();
    }
    return () => stopSynthesis();
  }, [isPlaying, selectedTrack]);

  // Synchronize volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(
        isMuted ? 0 : volume * 0.15,
        audioCtxRef.current.currentTime + 0.1
      );
    }
  }, [volume, isMuted]);

  // Handle track transition trigger
  const handleTrackChange = (trackId: string) => {
    setSelectedTrack(trackId);
    if (isPlaying) {
      // Re-trigger synthesis for the new frequencies
      setTimeout(() => startSynthesis(), 50);
    }
  };

  // Simulated visualizer heights
  useEffect(() => {
    const updateWave = () => {
      if (isPlaying) {
        setWaveHeights(
          Array(24)
            .fill(0)
            .map(() => Math.floor(Math.random() * 24) + 4)
        );
      } else {
        setWaveHeights(Array(24).fill(6));
      }
      animationFrameId.current = requestAnimationFrame(updateWave);
    };

    updateWave();
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPlaying]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-6 py-4 bg-canvas/80 backdrop-filter backdrop-blur-md border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Visualizer and details */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isPlaying ? "bg-gold-accent text-canvas" : "bg-white/5 border border-white/10 text-gold-accent hover:bg-white/10"
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-medium text-white tracking-wide">
              {tracks.find((t) => t.id === selectedTrack)?.name}
            </span>
            <span className="font-mono text-[9px] text-gold-accent bg-gold-accent/5 border border-gold-accent/20 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 animate-pulse" /> LIVE SYNTH
            </span>
          </div>
          <span className="text-white/40 text-[11px] font-sans block mt-0.5">
            {tracks.find((t) => t.id === selectedTrack)?.desc}
          </span>
        </div>
      </div>

      {/* Pulsing Visual Waveform in Gold */}
      <div className="flex items-center gap-[3px] h-8 px-4 py-1">
        {waveHeights.map((height, i) => (
          <motion.div
            key={i}
            animate={{ height }}
            className="w-[3px] bg-gold-accent rounded-full opacity-80"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ maxHeight: "32px" }}
          />
        ))}
      </div>

      {/* Selectors and Volume Controls */}
      <div className="flex items-center gap-6 w-full md:w-auto justify-end">
        {/* Track selector */}
        <div className="relative">
          <select
            value={selectedTrack}
            onChange={(e) => handleTrackChange(e.target.value)}
            className="bg-black/40 border border-white/10 text-white font-mono text-[11px] rounded px-3 py-1.5 focus:outline-none focus:border-gold-accent/50 cursor-pointer appearance-none pr-8 tracking-wider uppercase"
          >
            {tracks.map((track) => (
              <option key={track.id} value={track.id} className="bg-canvas text-white">
                {track.name.split(" (")[0]}
              </option>
            ))}
          </select>
          <Music className="w-3.5 h-3.5 text-gold-accent/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white/60 hover:text-gold-accent transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-16 h-[3px] bg-white/10 rounded-full appearance-none accent-gold-accent cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
