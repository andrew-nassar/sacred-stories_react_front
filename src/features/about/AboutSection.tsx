import React from "react";
import { Compass, ShieldCheck, Heart, Quote } from "lucide-react";
import { motion } from "motion/react";

export default function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-16">
        <span className="font-mono text-xs text-gold-accent tracking-[0.25em] uppercase block mb-3">
          The Scriptorium Codex
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-4">
          The Editorial Mission
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto mt-4" />
      </div>

      {/* Editorial Body */}
      <div className="space-y-12">
        {/* Intro */}
        <div className="glass-panel rounded-xl p-5 sm:p-8 md:p-12 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="font-serif text-xl md:text-2xl text-white font-medium mb-4 italic">
            Preserving the Echoes of Sacrifice in the Digital Era
          </h3>
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 font-sans">
            In our contemporary culture of immediate gratification and fading memory, the deep records of sacrificial love are often swept aside. 
            <strong> Sacred Stories</strong> stands as a quiet digital monastery, a sanctuary engineered to store the profound lives of modern martyrs and saints.
          </p>
          <p className="text-white/70 text-sm md:text-base leading-relaxed font-sans">
            We pull inspiration from the timeless solemnity of monastic stone vaults, translated into the sleek, high-fidelity precision of modern digital interfaces. 
            By blending traditional editorial typography with the power of artificial intelligence, we offer a living register of hagiography that remains forever accessible.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <Compass className="w-8 h-8 text-gold-accent mb-4" />
            <h4 className="font-serif text-white text-lg font-medium mb-2">Historical Accuracy</h4>
            <p className="text-white/50 text-xs leading-relaxed font-sans">
              Our theological search filters and dynamic saint synthesis ensure historical records are respected and presented with scientific and hagiographical truth.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <ShieldCheck className="w-8 h-8 text-gold-accent mb-4" />
            <h4 className="font-serif text-white text-lg font-medium mb-2">Aesthetic Reverence</h4>
            <p className="text-white/50 text-xs leading-relaxed font-sans">
              We omit high-vibrancy distractions or playful visual elements, adhering to a curated, high-contrast palette symbolizing divine grace and quiet.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <Heart className="w-8 h-8 text-gold-accent mb-4" />
            <h4 className="font-serif text-white text-lg font-medium mb-2">Spiritual Guidance</h4>
            <p className="text-white/50 text-xs leading-relaxed font-sans">
              Our bespoke prayer models bridge the stories of historic saints to modern challenges, bringing active, tranquil contemplation to daily tasks.
            </p>
          </div>
        </div>

        {/* Closing Quote */}
        <div className="text-center py-8">
          <div className="inline-block max-w-lg">
            <Quote className="w-8 h-8 text-gold-accent/40 mx-auto mb-4" />
            <p className="font-serif text-xl md:text-2xl text-gold-accent italic mb-3">
              &ldquo;The blood of the martyrs is the seed of the Church.&rdquo;
            </p>
            <span className="font-mono text-[10px] uppercase text-white/40 tracking-widest block">
              — Tertullian, Apologeticus (197 AD)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
