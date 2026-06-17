import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, RotateCcw, Volume2, VolumeX, Trophy, Shield, Zap, Flame, Award, Heart, CheckCircle2, RefreshCw } from 'lucide-react';
import { useKingDavidStore } from '../store/useKingDavidStore';

import davidShepherdImg from '../assets/images/david_shepherd_1781357759499.jpg';
import davidKingImg from '../assets/images/david_king_1781357773803.jpg';

// Web Audio API Sound Synthesizer for full local robustness with zero static dependency crashes
class SoundSynth {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private bgmIntervalId: any = null;
  private bgmStep = 0;

  constructor() {
    // Lazy initialized on first user interaction to satisfy browser policies
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Plays a beautiful, heavenly continuous shepherd harp sequence representing young David's praise
  startBGM() {
    this.init();
    if (this.bgmIntervalId) return;

    // A gorgeous modal progression in C/Am-pentatonic that feels peaceful and holy
    const sequence = [
      // Phrase 1 (Peaceful pastoral)
      220.00, 329.63, 440.00, 523.25, 329.63, 440.00,
      196.00, 293.66, 392.00, 493.88, 293.66, 392.00,
      174.61, 261.63, 349.23, 440.00, 261.63, 349.23,
      130.81, 261.63, 329.63, 392.00, 261.63, 329.63
    ];

    this.bgmIntervalId = setInterval(() => {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freq = sequence[this.bgmStep % sequence.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Warm sine/triangle mixture for soft pluck acoustic property
      osc.type = this.bgmStep % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Emulate acoustic chamber resonance
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 1.8);

      // Soft pluck volume profile (soft attack, long organic ring decay)
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

      osc.start(now);
      osc.stop(now + 2.0);

      // Celestial high melody note on alternating cycles
      if (this.bgmStep % 4 === 0) {
        const companionOsc = this.ctx.createOscillator();
        const companionGain = this.ctx.createGain();
        companionOsc.connect(companionGain);
        companionGain.connect(this.ctx.destination);

        companionOsc.type = 'sine';
        // perfect fifth or octave companion note
        const companionFreq = freq * 2.0; 
        companionOsc.frequency.setValueAtTime(companionFreq, now + 0.1);

        companionGain.gain.setValueAtTime(0, now + 0.1);
        companionGain.gain.linearRampToValueAtTime(0.015, now + 0.15);
        companionGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        companionOsc.start(now + 0.1);
        companionOsc.stop(now + 1.5);
      }

      this.bgmStep++;
    }, 550); // running arpeggios
  }

  stopBGM() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  playJump() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playShoot() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    // Exploding low frequency bump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playCoin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    // Chime
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.25);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playDivine() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major notes arpeggio
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  }

  playHurt() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

const sfx = new SoundSynth();

// Scripture verses unlocked at every 500m in the 3D game
const BONUS_VERSES = [
  { distance: 500, title: "Salmo 23:3", text: "Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome." },
  { distance: 1000, title: "Salmo 27:1", text: "O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?" },
  { distance: 1500, title: "1 Samuel 16:7", text: "O homem vê o exterior, porém o Senhor olha para o coração." },
  { distance: 2000, title: "Salmo 18:32", text: "Deus é o que me cinge de força e aperfeiçoa o meu caminho." },
  { distance: 2500, title: "Salmo 121:2", text: "O meu socorro vem do Senhor que fez o céu e a terra." },
  { distance: 3000, title: "1 Samuel 16:13", text: "Samuel tomou o vaso de azeite, e ungiu-o no meio de seus irmãos; e desde aquele dia em diante o Espírito do Senhor se apoderou de Davi." }
];

export function WelcomePastureAnimated() {
  const stateRef = useRef({
    david: { x: 75, dir: -1 as 1 | -1, walkCycle: 0 },
    sheep: [
      { id: 1, x: 18, dir: 1 as 1 | -1, state: 'grazing' as 'walking'|'grazing'|'idle', timer: 120, walkCycle: 0, scale: 0.95, isLamb: false },
      { id: 2, x: 48, dir: -1 as 1 | -1, state: 'walking' as 'walking'|'grazing'|'idle', timer: 80, walkCycle: 1, scale: 1.05, isLamb: false },
      { id: 3, x: 62, dir: 1 as 1 | -1, state: 'idle' as 'walking'|'grazing'|'idle', timer: 150, walkCycle: 2, scale: 0.9, isLamb: false },
      { id: 4, x: 38, dir: -1 as 1 | -1, state: 'walking' as 'walking'|'grazing'|'idle', timer: 95, walkCycle: 3, scale: 0.65, isLamb: true } // baby lamb
    ]
  });

  const [renderState, setRenderState] = useState({
    david: { x: 75, dir: -1 as 1 | -1, walkCycle: 0 },
    sheep: [
      { id: 1, x: 18, dir: 1 as 1 | -1, state: 'grazing' as 'walking'|'grazing'|'idle', walkCycle: 0, scale: 0.95, isLamb: false },
      { id: 2, x: 48, dir: -1 as 1 | -1, state: 'walking' as 'walking'|'grazing'|'idle', walkCycle: 1, scale: 1.05, isLamb: false },
      { id: 3, x: 62, dir: 1 as 1 | -1, state: 'idle' as 'walking'|'grazing'|'idle', walkCycle: 2, scale: 0.9, isLamb: false },
      { id: 4, x: 38, dir: -1 as 1 | -1, state: 'walking' as 'walking'|'grazing'|'idle', walkCycle: 3, scale: 0.65, isLamb: true }
    ]
  });

  useEffect(() => {
    let animId: number;
    let lastTime = Date.now();
    const update = () => {
      const s = stateRef.current;
      const now = Date.now();
      const dt = Math.min(50, now - lastTime) / 16.666; // scale changes with frames smoothly
      lastTime = now;

      // Update David: walks back and forth at speed 0.14% per frame
      s.david.x += s.david.dir * 0.11 * dt;
      s.david.walkCycle += 0.075 * dt;
      if (s.david.x > 84) {
        s.david.x = 84;
        s.david.dir = -1;
      } else if (s.david.x < 14) {
        s.david.x = 14;
        s.david.dir = 1;
      }

      // Update Sheep
      s.sheep.forEach(sh => {
        sh.timer -= dt;
        if (sh.timer <= 0) {
          const r = Math.random();
          if (r < 0.45) {
            sh.state = 'walking';
            sh.dir = Math.random() > 0.5 ? 1 : -1;
            sh.timer = 90 + Math.floor(Math.random() * 120);
          } else if (r < 0.8) {
            sh.state = 'grazing';
            sh.timer = 60 + Math.floor(Math.random() * 90);
          } else {
            sh.state = 'idle';
            sh.timer = 50 + Math.floor(Math.random() * 60);
          }
        }

        if (sh.state === 'walking') {
          const speed = sh.isLamb ? 0.08 : 0.05;
          sh.x += sh.dir * speed * dt;
          sh.walkCycle += sh.isLamb ? 0.14 : 0.065;
        } else if (sh.state === 'grazing') {
          sh.walkCycle += 0.025 * dt;
        } else {
          sh.walkCycle += 0.008 * dt;
        }

        // Lamb follow behavior mapping
        if (sh.isLamb) {
          const mother = s.sheep.find(m => m.id === 2);
          if (mother) {
            const dist = sh.x - mother.x;
            if (Math.abs(dist) > 12) {
              sh.state = 'walking';
              sh.dir = dist > 0 ? -1 : 1;
              sh.x += sh.dir * 0.12 * dt;
              sh.walkCycle += 0.11 * dt;
            }
          }
        }

        if (sh.x < 4) {
          sh.x = 4;
          sh.dir = 1;
        } else if (sh.x > 94) {
          sh.x = 94;
          sh.dir = -1;
        }
      });

      setRenderState({
        david: { ...s.david },
        sheep: s.sheep.map(sh => ({ ...sh }))
      });

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-[1.5%] h-24 z-20 pointer-events-none select-none">
      {/* 1. David */}
      <div 
        className="absolute bottom-0 select-none flex flex-col items-center origin-bottom transition-all duration-300"
        style={{
          left: `${renderState.david.x}%`,
          transform: `translateX(-50%) scaleX(${renderState.david.dir})`,
          height: '68px',
        }}
      >
        {/* Crook staff behind or beside hand */}
        <div 
          className="absolute bottom-0 w-[2.5px] bg-gradient-to-b from-[#8B5A2B] to-[#5C3A21] rounded shadow-xs"
          style={{
            height: '64px',
            left: '12px',
            transform: `rotate(${Math.sin(renderState.david.walkCycle) * 6}deg)`,
            transformOrigin: 'bottom center',
          }}
        >
          {/* Crook Curved Hook Head */}
          <div className="absolute -top-1 -left-2 w-4 h-4 border-t-2 border-l-2 border-r border-r-transparent border-b-transparent border-[#8B5A2B] rounded-full" />
        </div>

        {/* David body container with walk bobbing */}
        <div 
          className="flex flex-col items-center"
          style={{
            transform: `translateY(${Math.sin(renderState.david.walkCycle * 2) * 1.5}px)`
          }}
        >
          {/* Head */}
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 bg-[#FED7AA] rounded-full border border-stone-800 shadow-md">
            {/* Wavy lush Red-brown (Chestnut) Hair Curls */}
            <div className="absolute -top-1.5 -left-1 -right-1 h-3.5 bg-[#8F2604] rounded-t-full shadow-inner">
              {/* Overlapping hair curls */}
              <div className="absolute -top-0.5 left-1 w-2 h-2 bg-[#B44212] rounded-full" />
              <div className="absolute -top-0.5 right-1 w-2 h-2 bg-[#B44212] rounded-full" />
              <div className="absolute top-1 -left-1 w-2.5 h-2 bg-[#8F2604] rounded-full" />
              <div className="absolute top-1 -right-1 w-2.5 h-2 bg-[#8F2604] rounded-full" />
              <div className="absolute top-0.5 left-2 w-1.5 h-1.5 bg-[#B44212] rounded-full" />
            </div>

            {/* Leather headband around forehead */}
            <div className="absolute top-[5px] left-0 right-0 h-[2.5px] bg-[#451A03] z-10" />

            {/* Eyes */}
            <div className="absolute top-2.5 left-1.5 w-1 h-1 bg-slate-950 rounded-full" />
            <div className="absolute top-2.5 right-1.5 w-1 h-1 bg-slate-950 rounded-full" />

            {/* Redhead Eyebrows */}
            <div className="absolute top-1.5 left-1 w-1.5 h-[1px] bg-[#C2410C]" />
            <div className="absolute top-1.5 right-1 w-1.5 h-[1px] bg-[#C2410C]" />

            {/* Cheeks ginger freckles (Sardas Ruivas) */}
            <div className="absolute top-[14px] left-1 w-[0.8px] h-[0.8px] bg-[#C2410C] rounded-full opacity-80" />
            <div className="absolute top-[15px] left-1.5 w-[0.8px] h-[0.8px] bg-[#C2410C] rounded-full opacity-60" />
            <div className="absolute top-[14px] right-1 w-[0.8px] h-[0.8px] bg-[#C2410C] rounded-full opacity-80" />
            <div className="absolute top-[15px] right-1.5 w-[0.8px] h-[0.8px] bg-[#C2410C] rounded-full opacity-60" />

            {/* Smile */}
            <div className="absolute bottom-1.5 left-2 right-2 h-1 border-b border-[#B91C1C] rounded-b-full bg-transparent" />

            {/* Cute flushed blush */}
            <div className="absolute top-3 left-1 w-1.5 h-1 bg-pink-400/30 rounded-full" />
            <div className="absolute top-3 right-1 w-1.5 h-1 bg-pink-400/30 rounded-full" />
          </div>

          {/* Neck */}
          <div className="w-[5px] h-1 bg-[#D2946A] -mt-[1px]" />

          {/* Torso: Light Grey/Off-white Tunic (Shirt) */}
          <div className="relative w-6 h-[22px] bg-gradient-to-b from-stone-50 via-stone-100 to-stone-200 border-stone-300 rounded-b-md border flex flex-col items-center">
            {/* NO shoulder/back cape overlay for shepherd as requested */}

            {/* Belt (Dark Brown leather) */}
            <div className="absolute bottom-1 w-full h-[5px] bg-[#3F1A03] flex items-center justify-center">
              {/* Gold buckle */}
              <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-xs" />
            </div>

            {/* Crossbody sash and pouch (Alforje) */}
            <div className="absolute top-1 left-1 right-1 h-[1.2px] bg-[#5C2200] rotate-12" />
            <div className="absolute bottom-1.5 left-0.5 w-2.5 h-2.5 bg-[#5C3A21] rounded-xs border border-amber-950 shadow-xs" />
          </div>

          {/* Bare legs swinging */}
          <div className="flex justify-between w-4 px-0.5 mt-[-1px]">
            {/* Left foot */}
            <div 
              className="w-1.5 h-2.5 flex flex-col items-center"
              style={{
                transform: `rotate(${Math.sin(renderState.david.walkCycle) * 22}deg)`,
                transformOrigin: 'top center',
              }}
            >
              <div className="w-[3.5px] h-2 bg-[#FED7AA]" />
              <div className="w-1.5 h-[1px] bg-[#3F1A03]" />
            </div>
            {/* Right foot */}
            <div 
              className="w-1.5 h-2.5 flex flex-col items-center"
              style={{
                transform: `rotate(${Math.sin(renderState.david.walkCycle + Math.PI) * 22}deg)`,
                transformOrigin: 'top center',
              }}
            >
              <div className="w-[3.5px] h-2 bg-[#FED7AA]" />
              <div className="w-1.5 h-[1px] bg-[#3F1A03]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sheep Flock */}
      {renderState.sheep.map(sh => {
        const isEating = sh.state === 'grazing';
        const isWalking = sh.state === 'walking';
        const bobY = isWalking ? Math.abs(Math.sin(sh.walkCycle)) * -2 : 0;
        const legAngleLeft = isWalking ? Math.sin(sh.walkCycle) * 25 : 0;
        const legAngleRight = isWalking ? -Math.sin(sh.walkCycle) * 25 : 0;
        const tailAngle = Math.sin(Date.now() / 95 + sh.id) * 20;

        return (
          <div
            key={sh.id}
            className="absolute bottom-0 select-none flex flex-col items-center transition-all duration-305"
            style={{
              left: `${sh.x}%`,
              transform: `translateX(-50%) scale(${sh.scale}) scaleX(${sh.dir})`,
              height: '38px',
              zIndex: sh.isLamb ? 22 : 21,
            }}
          >
            <div 
              className="flex flex-col items-center"
              style={{ transform: `translateY(${bobY}px)` }}
            >
              {/* Fluffy wool body */}
              <div className="relative w-[34px] h-[22px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center">
                <div className="absolute -top-0.5 w-[18px] h-[18px] bg-white rounded-full" />
                <div className="absolute -left-1.5 w-[16px] h-[16px] bg-white rounded-full" />
                <div className="absolute -right-1.5 w-[16px] h-[16px] bg-white rounded-full" />
                <div className="absolute -bottom-0.5 w-[22px] h-[12px] bg-white rounded-full" />

                {/* Wagging tail */}
                <div 
                  className="absolute top-1.5 w-[4px] h-[8px] bg-white rounded-full"
                  style={{
                    left: '-3px',
                    transform: `rotate(${tailAngle}deg)`,
                    transformOrigin: 'top center',
                  }}
                />

                {/* Face */}
                <div 
                  className={`absolute rounded-full shadow-inner flex flex-col items-center ${
                    sh.isLamb ? 'w-3.5 h-3.5 bg-[#FFEAE2] right-[-4px] top-[1px]' : 'w-4.5 h-4.5 bg-[#F4F4F5] right-[-5px] top-[-1px]'
                  }`}
                  style={{
                    transform: isEating ? 'translateY(2px)' : 'none',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                >
                  <div className="absolute top-[2.5px] right-[2px] w-[2px] h-[2px] bg-[#111827] rounded-full" />
                  <div className="absolute top-[4.5px] right-[0.5px] w-1 h-[0.5px] bg-pink-400/30 rounded-full" />
                  <div className="absolute -top-0.5 w-2.5 h-1.5 bg-white rounded-full" />
                  {/* Flapping ear */}
                  <div 
                    className={`absolute top-0.5 w-[1.5px] h-[3.5px] rounded-full ${sh.isLamb ? 'bg-[#FFDFD3] left-[1px]' : 'bg-[#E4E4E7] left-[1.5px]'}`}
                    style={{
                      transform: `rotate(${Math.sin(Date.now() / 240 + sh.id) * 12}deg)`,
                      transformOrigin: 'top center'
                    }}
                  />
                </div>
              </div>

              {/* Legs */}
              <div className="flex gap-1.5 px-2 mt-[-1px]">
                <div 
                  className="w-[1.2px] h-2 bg-slate-900 rounded-b-sm"
                  style={{ transform: `rotate(${legAngleLeft}deg)`, transformOrigin: 'top center' }}
                />
                <div 
                  className="w-[1.2px] h-2 bg-slate-900 rounded-b-sm"
                  style={{ transform: `rotate(${legAngleRight}deg)`, transformOrigin: 'top center' }}
                />
                <div 
                  className="w-[1.2px] h-2 bg-slate-900 rounded-b-sm"
                  style={{ transform: `rotate(${legAngleRight}deg)`, transformOrigin: 'top center' }}
                />
                <div 
                  className="w-[1.2px] h-2 bg-slate-900 rounded-b-sm"
                  style={{ transform: `rotate(${legAngleLeft}deg)`, transformOrigin: 'top center' }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ShepherdLobbyCanvasProps {
  activeCharacter: 'david_jovem' | 'rei_david';
}

export function ShepherdLobbyCanvas({ activeCharacter }: ShepherdLobbyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Maintain interactive parameters across ticking loop
  const stateRef = useRef({
    david: {
      x: 100,
      y: 165,
      vx: 1.05,
      direction: 'right' as 'left' | 'right',
      walkCycle: 0,
      idleCycle: 0,
      attackAnimTimer: 0,
      waveTimer: 0,
      speakText: 'Olá, ovelhinhas! 🐑 Querem um pouco de capim fresco? 🌱',
      speakOpacity: 130, // remaining speak frames
    },
    sheepList: [
      { id: 1, x: 60, y: 180, vx: 0.42, direction: 'right' as 'left' | 'right', walkCycle: 0, state: 'walking' as 'walking'|'grazing'|'eating'|'idle', stateTimer: 110, baahTimer: 0, label: '', scale: 0.95, color: '#FFFFFF', tailAngle: 0 },
      { id: 2, x: 260, y: 190, vx: -0.32, direction: 'left' as 'left' | 'right', walkCycle: 1.5, state: 'grazing' as 'walking'|'grazing'|'eating'|'idle', stateTimer: 140, baahTimer: 0, label: '', scale: 1.05, color: '#F8FAFC', tailAngle: 0 },
      { id: 3, x: 180, y: 198, vx: 0.28, direction: 'right' as 'left' | 'right', walkCycle: 3.0, state: 'eating' as 'walking'|'grazing'|'eating'|'idle', stateTimer: 70, baahTimer: 0, label: '', scale: 0.9, color: '#FFFBEB', tailAngle: 0 },
      { id: 4, x: 380, y: 185, vx: -0.38, direction: 'left' as 'left' | 'right', walkCycle: 0.5, state: 'walking' as 'walking'|'grazing'|'eating'|'idle', stateTimer: 130, baahTimer: 0, label: '', scale: 1.0, color: '#F1F5F9', tailAngle: 0 },
      // Tiny cute baby lamb following mother sheep 2!
      { id: 5, x: 290, y: 196, vx: -0.48, direction: 'left' as 'left' | 'right', walkCycle: 4.5, state: 'walking' as 'walking'|'grazing'|'eating'|'idle', stateTimer: 90, baahTimer: 0, label: '', scale: 0.62, color: '#FFF9E6', tailAngle: 0, isLamb: true, followTargetId: 2 }
    ],
    clouds: [
      { x: 30, y: 22, speed: 0.12, scale: 1.15 },
      { x: 240, y: 16, speed: 0.07, scale: 0.85 },
      { x: 410, y: 28, speed: 0.10, scale: 1.05 }
    ],
    flowers: [
      { x: 25, y: 195, color: '#F472B6' },
      { x: 70, y: 218, color: '#FCD34D' },
      { x: 130, y: 206, color: '#60A5FA' },
      { x: 205, y: 214, color: '#F472B6' },
      { x: 285, y: 225, color: '#FCD34D' },
      { x: 335, y: 202, color: '#38BDF8' },
      { x: 405, y: 220, color: '#F472B6' },
      { x: 445, y: 208, color: '#FCD34D' }
    ],
    fireflies: [] as { x: number; y: number; speedY: number; angle: number; angleSpeed: number; size: number; alpha: number }[],
    windLeaves: [] as { x: number; y: number; vx: number; vy: number; r: number; color: string }[],
    clickWaves: [] as { x: number; y: number; r: number; maxR: number; opacity: number }[],
    starParticles: [] as { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[]
  });

  // Seed fireflies & wind leaves initial list so it is immediately beautiful
  useEffect(() => {
    const state = stateRef.current;
    if (state.fireflies.length === 0) {
      for (let i = 0; i < 15; i++) {
        state.fireflies.push({
          x: Math.random() * 480,
          y: Math.random() * 100 + 100,
          speedY: -0.2 - Math.random() * 0.35,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: 0.01 + Math.random() * 0.03,
          size: 1.2 + Math.random() * 1.5,
          alpha: 0.3 + Math.random() * 0.7
        });
      }
    }
    if (state.windLeaves.length === 0) {
      for (let i = 0; i < 6; i++) {
        state.windLeaves.push({
          x: Math.random() * 480,
          y: Math.random() * 120,
          vx: 0.6 + Math.random() * 0.8,
          vy: 0.2 + Math.random() * 0.4,
          r: 2 + Math.random() * 3,
          color: Math.random() > 0.5 ? '#10B981' : '#34D399'
        });
      }
    }
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 480;
    const clickY = ((e.clientY - rect.top) / rect.height) * 240;

    const state = stateRef.current;

    // Add visual touch wave
    state.clickWaves.push({ x: clickX, y: clickY, r: 2.5, maxR: 24, opacity: 1.0 });

    // Check interaction with David
    const davidDist = Math.hypot(clickX - state.david.x, clickY - state.david.y);
    if (davidDist < 30) {
      state.david.waveTimer = 65; 
      state.david.attackAnimTimer = 55; // launch high speed spin animated loops
      sfx.playJump();

      const quotes = [
        "O Senhor é meu Pastor e nada me faltará! 🐑✨",
        "Pela fé e com este cajado defenderei nosso rebanho! 🛡️🍀",
        "Vem comigo, ovelhinha meiga! ♥",
        "A funda da verdade derrubará qualquer fera! 🛡️✨",
        "Deus não olha a aparência, olha o coração! ♥👑",
        "Nenhum leão ou urso tocará nas minhas ovelhas! 🛡️🐾",
        "Cantarei louvores na harpa sob as estrelas de Belém! 🌟🎵"
      ];
      state.david.speakText = quotes[Math.floor(Math.random() * quotes.length)];
      state.david.speakOpacity = 180;

      for (let i = 0; i < 12; i++) {
        state.starParticles.push({
          x: state.david.x,
          y: state.david.y - 18,
          vx: (Math.random() - 0.5) * 4.0,
          vy: -Math.random() * 3.5 - 1.5,
          r: Math.random() * 2.5 + 1.2,
          alpha: 1.0,
          color: activeCharacter === 'rei_david' ? '#FBBF24' : '#F97316'
        });
      }
      return;
    }

    // Check interaction with sheep
    let clickedCount = 0;
    state.sheepList.forEach(s => {
      const sheepDist = Math.hypot(clickX - s.x, clickY - (s.y - 12));
      if (sheepDist < 26) {
        clickedCount++;
        s.state = 'grazing';
        s.stateTimer = 55;
        s.baahTimer = 95;
        s.walkCycle = 0;
        
        const sheepSounds = ["Meeeh! 🐑", "Baah!! ♥", "Béeeh! ✨", "Nhon nhon 🍀", "Baaah de Belém! 🌟", "Muinch muinch 🌱"];
        s.label = sheepSounds[Math.floor(Math.random() * sheepSounds.length)];
        
        // short hopping jump
        s.x += s.direction === 'right' ? 10 : -10;
        sfx.playJump();

        for (let i = 0; i < 8; i++) {
          state.starParticles.push({
            x: s.x,
            y: s.y - 18,
            vx: (Math.random() - 0.5) * 2.6,
            vy: -Math.random() * 2.8 - 0.8,
            r: Math.random() * 2.5 + 1.2,
            alpha: 1.0,
            color: s.isLamb ? '#F472B6' : '#EC4899'
          });
        }
      }
    });

    if (clickedCount === 0) {
      // Small dust on grass click
      for (let i = 0; i < 5; i++) {
        state.starParticles.push({
          x: clickX,
          y: clickY,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -Math.random() * 1.8,
          r: Math.random() * 1.5 + 0.8,
          alpha: 0.8,
          color: '#34D399'
        });
      }
    }
  };

  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tick = () => {
      const state = stateRef.current;

      // Clear Canvas viewport
      ctx.clearRect(0, 0, 480, 240);

      // --- 1. DEEP TWILIGHT SKY WITH AMBIENT GRADIENTS ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 160);
      skyGrad.addColorStop(0, '#090D1A'); // ultra deep stellar navy
      skyGrad.addColorStop(0.4, '#13113C'); // celestial purple indigo
      skyGrad.addColorStop(0.8, '#1E2445'); // evening twilight sky
      skyGrad.addColorStop(1, '#2E385E');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 480, 240);

      // Render many remote shining background stars
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 22; i++) {
        const starX = (i * 47 + 13) % 480;
        const starY = (i * 19 + 7) % 110;
        const blink = 0.45 + Math.sin(Date.now() / 350 + i) * 0.45;
        ctx.fillStyle = `rgba(255, 255, 255, ${blink})`;
        ctx.fillRect(starX, starY, 1.2, 1.2);
        if (i % 7 === 0) {
          ctx.fillRect(starX - 1, starY, 3, 1.2);
          ctx.fillRect(starX, starY - 1, 1.2, 3);
        }
      }

      // Soft beautiful Moon disk glow
      ctx.save();
      const moonX = 395;
      const moonY = 48;
      const sunGrad = ctx.createRadialGradient(moonX, moonY, 1, moonX, moonY, 52);
      sunGrad.addColorStop(0, '#FFFBEB');
      sunGrad.addColorStop(0.2, 'rgba(254, 243, 199, 0.38)');
      sunGrad.addColorStop(0.6, 'rgba(251, 191, 36, 0.08)');
      sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 52, 0, Math.PI * 2);
      ctx.fill();

      // Sharp golden Crescent Moon
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 15, Math.PI * 0.15, Math.PI * 1.5);
      ctx.arc(moonX + 6, moonY - 2, 14, Math.PI * 0.35, Math.PI * 1.6, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // --- 2. FLOAT CLOUDS ---
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      state.clouds.forEach(c => {
        c.x += c.speed;
        if (c.x > 500) c.x = -60;

        ctx.beginPath();
        ctx.arc(c.x, c.y, 11 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 13, c.y - 4, 13 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 26, c.y, 9.5 * c.scale, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      });

      // --- 3. WIND BLOWN LEAVES ---
      state.windLeaves.forEach(l => {
        l.x += l.vx;
        l.y += l.vy;
        if (l.x > 500) {
          l.x = -20;
          l.y = Math.random() * 120;
        }
        ctx.save();
        ctx.fillStyle = l.color;
        ctx.translate(l.x, l.y);
        ctx.rotate(Date.now() * 0.005 + l.r);
        ctx.beginPath();
        ctx.ellipse(0, 0, l.r * 1.4, l.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- 4. SCENERY ROLLING VALLEYS & GRASS LANDSCAPES ---
      // Distant Hills layer for visual perspective depth
      ctx.fillStyle = '#10162B';
      ctx.beginPath();
      ctx.moveTo(0, 158);
      ctx.quadraticCurveTo(110, 122, 240, 152);
      ctx.quadraticCurveTo(360, 126, 480, 166);
      ctx.lineTo(480, 240);
      ctx.lineTo(0, 240);
      ctx.closePath();
      ctx.fill();

      // Middle hills (Pasture level 2)
      const valleyGrad = ctx.createLinearGradient(0, 150, 0, 240);
      valleyGrad.addColorStop(0, '#044F3D'); // emerald forest base
      valleyGrad.addColorStop(1, '#053E31');
      ctx.fillStyle = valleyGrad;
      ctx.beginPath();
      ctx.moveTo(0, 174);
      ctx.quadraticCurveTo(140, 149, 310, 169);
      ctx.quadraticCurveTo(390, 156, 480, 174);
      ctx.lineTo(480, 240);
      ctx.lineTo(0, 240);
      ctx.closePath();
      ctx.fill();

      // Foreground lush green pasture
      const foreGrassGrad = ctx.createLinearGradient(0, 170, 0, 240);
      foreGrassGrad.addColorStop(0, '#057A59'); // vibrant fresh green grass
      foreGrassGrad.addColorStop(1, '#023024');
      ctx.fillStyle = foreGrassGrad;
      ctx.beginPath();
      ctx.moveTo(0, 184);
      ctx.quadraticCurveTo(90, 169, 230, 190);
      ctx.quadraticCurveTo(370, 164, 480, 191);
      ctx.lineTo(480, 240);
      ctx.lineTo(0, 240);
      ctx.closePath();
      ctx.fill();

      // Render colorful flowers
      state.flowers.forEach(f => {
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#10B981';
        ctx.fillRect(f.x - 0.7, f.y, 1.4, 4.2);
      });

      // --- 5. FIREFLIES SPARKLES (Beautiful floating night light indicators) ---
      state.fireflies.forEach(f => {
        f.y += f.speedY;
        f.angle += f.angleSpeed;
        f.x += Math.sin(f.angle) * 0.22;

        if (f.y < 90) {
          f.y = 210;
          f.x = Math.random() * 480;
        }

        const pulseAlpha = f.alpha * (0.45 + Math.sin(Date.now() / 250 + f.y) * 0.45);
        ctx.save();
        const glowGrad = ctx.createRadialGradient(f.x, f.y, 0.5, f.x, f.y, f.size * 3.2);
        glowGrad.addColorStop(0, `rgba(234, 179, 8, ${pulseAlpha})`);
        glowGrad.addColorStop(0.3, `rgba(234, 150, 6, ${pulseAlpha * 0.45})`);
        glowGrad.addColorStop(1, 'rgba(234, 150, 6, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 3.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 0.52, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- 6. RENDER CUTE FLUFFY SHEEP FLOCK (CONTINUOUS NATURAL WALKING ANIMATION) ---
      state.sheepList.forEach(s => {
        // Find leader position if this is the baby lamb
        let followTarget = null;
        if (s.isLamb) {
          followTarget = state.sheepList.find(mother => mother.id === s.followTargetId);
        }

        // AI State decision timer ticker
        s.stateTimer--;
        if (s.stateTimer <= 0) {
          if (s.isLamb && followTarget) {
            // Lamb state mimics or gets close to mother sheep
            const dist = Math.abs(s.x - followTarget.x);
            if (dist > 30) {
              s.state = 'walking';
              s.vx = (followTarget.x > s.x ? 0.45 : -0.45);
              s.direction = s.vx > 0 ? 'right' : 'left';
              s.stateTimer = 40 + Math.floor(Math.random() * 50);
            } else {
              s.state = Math.random() > 0.4 ? 'grazing' : 'idle';
              s.vx = 0;
              s.stateTimer = 35 + Math.floor(Math.random() * 40);
            }
          } else {
            const r = Math.random();
            if (r < 0.55) {
              // Initiate walking gait
              s.state = 'walking';
              s.vx = (Math.random() > 0.5 ? 0.38 : -0.38) * (Math.random() * 0.3 + 0.85);
              s.direction = s.vx > 0 ? 'right' : 'left';
              s.stateTimer = Math.floor(Math.random() * 110 + 90);
            } else if (r < 0.85) {
              // Eating munch munch grass
              s.state = 'eating';
              s.vx = 0;
              s.stateTimer = Math.floor(Math.random() * 80 + 60);
            } else {
              // Idle standing around
              s.state = 'idle';
              s.vx = 0;
              s.stateTimer = Math.floor(Math.random() * 65 + 45);
            }
          }
        }

        // Apply wandering speeds, keep lamb closely tethered helper
        if (s.isLamb && followTarget) {
          const dist = Math.abs(s.x - followTarget.x);
          if (dist > 55) {
            s.state = 'walking';
            s.vx = (followTarget.x > s.x ? 0.58 : -0.58);
            s.direction = s.vx > 0 ? 'right' : 'left';
          }
        }

        s.x += s.vx;

        // Keep sheep inside the beautiful green boundaries
        if (s.x < 15) {
          s.x = 15;
          s.vx = -s.vx;
          s.direction = 'right';
        }
        if (s.x > 465) {
          s.x = 465;
          s.vx = -s.vx;
          s.direction = 'left';
        }

        // Walk cycle leg ticking animation (always continuous)
        if (s.state === 'walking') {
          s.walkCycle += s.isLamb ? 0.14 : 0.085; // Lamb walks with exciting quick legs!
        } else {
          s.walkCycle += 0.01; // subtle idle breathing
        }

        // Dynamic tail wagging rhythm
        s.tailAngle = Math.sin(Date.now() / 95 + s.id) * 0.42;

        ctx.save();
        // Custom bounce offset for walking sheep
        const sheepWalkYBob = s.state === 'walking' ? Math.abs(Math.sin(s.walkCycle)) * -2 : 0;
        ctx.translate(s.x, s.y + sheepWalkYBob);
        ctx.scale(s.scale, s.scale);

        // Legs animated swinging
        let legOffsetLeft = Math.sin(s.walkCycle) * 3.5;
        let legOffsetRight = -Math.sin(s.walkCycle) * 3.5;
        if (s.state === 'eating' || s.state === 'idle') {
          legOffsetLeft = Math.sin(Date.now() / 300) * 0.3;
          legOffsetRight = -Math.sin(Date.now() / 300) * 0.3;
        }

        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';

        // Draw 4 cute black little legs
        ctx.beginPath();
        // Rear set
        ctx.moveTo(-5.5, -2.5);
        ctx.lineTo(-5.5 + legOffsetLeft, 4.5);
        ctx.moveTo(5.5, -2.5);
        ctx.lineTo(5.5 + legOffsetRight, 4.5);
        // Front set
        ctx.moveTo(-1.8, -2.5);
        ctx.lineTo(-1.8 + legOffsetRight, 4.5);
        ctx.moveTo(1.8, -2.5);
        ctx.lineTo(1.8 + legOffsetLeft, 4.5);
        ctx.stroke();

        // Little shiny black hooves at leg bases
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.fillRect(-5.5 + legOffsetLeft - 1.2, 4.0, 2.4, 1.4);
        ctx.fillRect(5.5 + legOffsetRight - 1.2, 4.0, 2.4, 1.4);
        ctx.fillRect(-1.8 + legOffsetRight - 1.2, 4.0, 2.4, 1.4);
        ctx.fillRect(1.8 + legOffsetLeft - 1.2, 4.0, 2.4, 1.4);

        // Fluffy layered 3D wool coat (Fluffy White clouds with radial shading)
        const woolGradient = ctx.createRadialGradient(0, -9.0, 2.2, 0, -6.0, 14.8);
        woolGradient.addColorStop(0, '#FFFFFF'); // Glowing snow white top
        woolGradient.addColorStop(0.65, '#F9FAFB'); // Crisp white wool
        woolGradient.addColorStop(1.0, '#D4D4D8'); // Soft ambient twilight shadow under belly
        ctx.fillStyle = woolGradient;
        
        ctx.beginPath();
        // Central fluff
        ctx.arc(0, -6, 9.8, 0, Math.PI * 2);
        // Surrounding puff layers
        ctx.arc(-5.6, -8.6, 8.5, 0, Math.PI * 2);
        ctx.arc(5.6, -8.6, 8.5, 0, Math.PI * 2);
        ctx.arc(-7.4, -4.2, 7.5, 0, Math.PI * 2);
        ctx.arc(7.4, -4.2, 7.5, 0, Math.PI * 2);
        ctx.arc(0, -11.5, 7.8, 0, Math.PI * 2);
        ctx.fill();

        // Decorative curly swirl circles for premium texturing
        ctx.strokeStyle = 'rgba(161, 161, 170, 0.42)'; // very light gray strokes
        ctx.lineWidth = 0.85;
        // left lock
        ctx.beginPath();
        ctx.arc(-3.5, -6.5, 2.2, 0.2 * Math.PI, 1.5 * Math.PI);
        ctx.stroke();
        // right lock
        ctx.beginPath();
        ctx.arc(3.5, -5.2, 2.0, -0.4 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
        // upper lock
        ctx.beginPath();
        ctx.arc(0, -9.8, 2.4, 0.4 * Math.PI, 1.8 * Math.PI);
        ctx.stroke();

        // Tiny cute tail wagging with gradient wool matching
        ctx.fillStyle = woolGradient;
        ctx.save();
        const tailOriginX = s.direction === 'right' ? -9.2 : 9.2;
        ctx.translate(tailOriginX, -7.5);
        ctx.rotate(s.tailAngle + (s.direction === 'right' ? -0.4 : 0.4));
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Head setup
        const isEating = s.state === 'eating';
        const headX = s.direction === 'right' ? 8.2 : -8.2;
        const headY = isEating ? -1.8 : -9.8;

        // Draw cute soft-shaded rosy face skin
        const faceSkinGrad = ctx.createRadialGradient(headX, headY, 0.5, headX, headY, 5.5);
        faceSkinGrad.addColorStop(0, '#FFFFFF'); // sheen
        faceSkinGrad.addColorStop(0.74, s.isLamb ? '#FFEAE2' : '#F4F4F5'); // baby cream lamb or soft white face
        faceSkinGrad.addColorStop(1.0, s.isLamb ? '#FCA5A5' : '#D1D5DB');
        ctx.fillStyle = faceSkinGrad;
        ctx.beginPath();
        ctx.arc(headX, headY, 5.2, 0, Math.PI * 2);
        ctx.fill();

        // Wooly tuft cap on top of head with matching wool gradient
        ctx.fillStyle = woolGradient;
        ctx.beginPath();
        ctx.arc(headX, headY - 4.5, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Cute floppy composite ears (Outer fluffy skin + soft pink inner ear)
        const earRotation = Math.sin(Date.now() / 240 + s.id) * 0.15;
        const shEarX = s.direction === 'right' ? headX - 1.6 : headX + 1.6;
        const shEarAngle = s.direction === 'right' ? Math.PI / 4 + earRotation : -Math.PI / 4 + earRotation;
        
        ctx.save();
        ctx.translate(shEarX, headY - 1.2);
        ctx.rotate(shEarAngle);
        
        // Outer ear base
        ctx.fillStyle = s.isLamb ? '#FFDFD3' : '#E4E4E7';
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.8, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner ear pink panel
        ctx.fillStyle = '#FFAEC9';
        ctx.beginPath();
        ctx.ellipse(0, 0.4, 0.9, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Expressive glossy black eyes with white sparkling specular reflection
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        const eyeX = s.direction === 'right' ? headX + 1.8 : headX - 3.2;
        ctx.arc(eyeX, headY - 1, 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(eyeX - 0.35, headY - 1.35, 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Rosy high-contrast cheeks blush
        ctx.fillStyle = 'rgba(244, 114, 182, 0.72)';
        ctx.beginPath();
        const cheekX = s.direction === 'right' ? headX + 2.5 : headX - 3.8;
        ctx.arc(cheekX, headY + 1.2, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Beautiful red ribbon collar with detailed golden glass bell for adult sheep
        if (!s.isLamb) {
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          const collarStartX = s.direction === 'right' ? 3.5 : -3.5;
          const collarEndX = s.direction === 'right' ? 6.8 : -6.8;
          ctx.moveTo(collarStartX, -5.2);
          ctx.lineTo(collarEndX, -6.8);
          ctx.stroke();

          // Golden bell hanging with sparkling gloss reflection
          const bellX = s.direction === 'right' ? 4.9 : -4.9;
          const bellY = -5.0;
          const bellGrad = ctx.createRadialGradient(bellX - 0.4, bellY - 0.4, 0.2, bellX, bellY, 1.4);
          bellGrad.addColorStop(0, '#FCD34D'); // bright golden glow
          bellGrad.addColorStop(0.7, '#F59E0B'); // gold
          bellGrad.addColorStop(1.0, '#9A3412'); // deep coppery shadows
          ctx.fillStyle = bellGrad;
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(bellX, bellY, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          // Tiny shiny white star sparkle on bell
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(bellX - 0.4, bellY - 0.6, 0.4, 0.4);
        }

        // Grazing chew animation with beautiful clover flower sprig
        if (isEating && Math.sin(Date.now() / 120 + s.id) > 0) {
          // Green stem
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          const mouthX = headX + (s.direction === 'right' ? 3.5 : -3.5);
          const mouthY = headY + 3.0;
          ctx.moveTo(mouthX, mouthY);
          ctx.lineTo(mouthX + (s.direction === 'right' ? 4.5 : -4.5), mouthY + 2.0);
          ctx.stroke();

          // Tiny sweet pink clover blossom
          ctx.fillStyle = '#F472B6';
          const leafX = mouthX + (s.direction === 'right' ? 4.5 : -4.5);
          const leafY = mouthY + 2.0;
          ctx.beginPath();
          ctx.arc(leafX - 1.0, leafY, 1.0, 0, Math.PI * 2);
          ctx.arc(leafX + 1.0, leafY, 1.0, 0, Math.PI * 2);
          ctx.arc(leafX, leafY - 1.2, 1.0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Render sheep custom callout text bubbles
        if (s.baahTimer > 0) {
          s.baahTimer--;
          ctx.save();
          ctx.font = 'bold 9px monospace';
          const txtWidth = ctx.measureText(s.label).width;
          
          ctx.fillStyle = 'rgba(9, 13, 26, 0.92)';
          ctx.strokeStyle = s.isLamb ? '#F472B6' : '#EC4899'; // baby pink or hot pink borders
          ctx.lineWidth = 1.2;
          const bubbleX = s.x - txtWidth / 2 - 5;
          const bubbleY = s.y - 34;
          ctx.beginPath();
          ctx.roundRect(bubbleX, bubbleY, txtWidth + 10, 13, 4);
          ctx.fill();
          ctx.stroke();
          
          ctx.fillStyle = s.isLamb ? '#FBCFE8' : '#FF97C9';
          ctx.textAlign = 'center';
          ctx.fillText(s.label, s.x, s.y - 25);
          ctx.restore();
        }
      });

      // --- 7. RENDER ULTRA-DETAILED REDHEADED SHEPHERD DAVID (SOPHISTICATED BIOLOGICAL RENDERING) ---
      const d = state.david;

      // Handle natural walking triggers of David
      if (d.attackAnimTimer > 0) {
        d.attackAnimTimer--;
        d.vx = 0;
      } else if (d.waveTimer > 0) {
        d.waveTimer--;
        d.vx = 0;
      } else {
        // Continuous, smooth walking loop with gentle ease turns
        d.x += d.vx;
        d.walkCycle += 0.105;
        d.idleCycle += 0.052;

        // Turn back smoothly near the pasture boundaries
        if (d.x < 55) {
          d.x = 55;
          d.vx = 1.05;
          d.direction = 'right';
        }
        if (d.x > 425) {
          d.x = 425;
          d.vx = -1.05;
          d.direction = 'left';
        }

        // Automated fun throw/sling slingshot or quote trigger
        if (Math.random() < 0.0025) {
          d.attackAnimTimer = 88;
        }
      }

      const isGolden = activeCharacter === 'rei_david';
      
      // Dynamic vertical bobbing that matches walk speed
      const bodyBob = Math.sin(d.walkCycle * 0.85) * 1.6;
      const headX = d.x;
      const headY = d.y - 12 + bodyBob;

      // Draw flat shadow under David feet matching bobs
      ctx.save();
      const shadowW = 13.5;
      const shadowGrad = ctx.createRadialGradient(d.x, d.y + 12, 1, d.x, d.y + 12, shadowW);
      shadowGrad.addColorStop(0, 'rgba(11, 15, 30, 0.62)');
      shadowGrad.addColorStop(1, 'rgba(11, 15, 30, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(d.x, d.y + 12, shadowW, 3.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Leg coordinate jointing
      const hipLeftX = d.x - 3.8;
      const hipRightX = d.x + 3.8;
      const hipY = d.y + 2;

      let fLeftXOffset = Math.sin(d.walkCycle) * 4.8;
      let fLeftYOffset = -Math.max(0, Math.cos(d.walkCycle)) * 3.0;
      let fRightXOffset = Math.sin(d.walkCycle + Math.PI) * 4.8;
      let fRightYOffset = -Math.max(0, Math.cos(d.walkCycle + Math.PI)) * 3.0;

      if (d.vx === 0) {
        fLeftXOffset = 0; fLeftYOffset = 0;
        fRightXOffset = 0; fRightYOffset = 0;
      }

      const footLeftX = hipLeftX + fLeftXOffset;
      const footLeftY = d.y + 11 + fLeftYOffset;
      const footRightX = hipRightX + fRightXOffset;
      const footRightY = d.y + 11 + fRightYOffset;

      // Thigh 1 (Rear)
      ctx.strokeStyle = isGolden ? '#78350F' : '#5C3A21';
      ctx.lineWidth = 4.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(hipLeftX, hipY);
      ctx.lineTo((hipLeftX + footLeftX)/2, (hipY + footLeftY)/2);
      ctx.stroke();

      // Bare Calf Skin
      ctx.strokeStyle = '#FDBA74'; // organic skin highlights
      ctx.lineWidth = 3.4;
      ctx.beginPath();
      ctx.moveTo((hipLeftX + footLeftX)/2, (hipY + footLeftY)/2);
      ctx.lineTo(footLeftX, footLeftY - 2);
      ctx.stroke();

      // Sandals laces
      ctx.strokeStyle = '#451A03';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(footLeftX - 1.2, footLeftY - 3);
      ctx.lineTo(footLeftX + 1.2, footLeftY - 1);
      ctx.stroke();

      // Sandal sole
      ctx.fillStyle = '#3F1A03';
      ctx.fillRect(footLeftX - 3.6, footLeftY - 1.2, 7.2, 2);

      // Thigh 2 (Front)
      ctx.strokeStyle = isGolden ? '#92400E' : '#7D4F27';
      ctx.lineWidth = 4.4;
      ctx.beginPath();
      ctx.moveTo(hipRightX, hipY);
      ctx.lineTo((hipRightX + footRightX)/2, (hipY + footRightY)/2);
      ctx.stroke();

      // Bare skin calf
      ctx.strokeStyle = '#FED7AA';
      ctx.lineWidth = 3.4;
      ctx.beginPath();
      ctx.moveTo((hipRightX + footRightX)/2, (hipY + footRightY)/2);
      ctx.lineTo(footRightX, footRightY - 2);
      ctx.stroke();

      ctx.strokeStyle = '#451A03';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(footRightX - 1.2, footRightY - 3);
      ctx.lineTo(footRightX + 1.2, footRightY - 1);
      ctx.stroke();

      ctx.fillStyle = '#3F1A03';
      ctx.fillRect(footRightX - 3.6, footRightY - 1.2, 7.2, 2);

      // TUNIC COATED BODY
      const tunicTopY = headY + 4;
      const tunicBottomY = d.y + 4;

      // Draw Tunic body
      const tunicGrad = ctx.createLinearGradient(d.x - 7, tunicTopY, d.x + 7, tunicBottomY);
      if (isGolden) {
        tunicGrad.addColorStop(0, '#D97706'); // elite yellow king tunic
        tunicGrad.addColorStop(0.5, '#B45309');
        tunicGrad.addColorStop(1, '#78350F');
      } else {
        // Humble rustic peasant/shepherd clothes (Roupa de Camponês) in rustic sage/olive green and field burlap tones
        tunicGrad.addColorStop(0, '#84CC16'); // Sage green top
        tunicGrad.addColorStop(0.5, '#65A30D'); // Warm olive middle
        tunicGrad.addColorStop(1, '#3F6212'); // Dark mossy hem
      }
      ctx.fillStyle = tunicGrad;
      ctx.beginPath();
      ctx.moveTo(d.x - 7.5, tunicTopY);
      ctx.lineTo(d.x + 7.5, tunicTopY);
      ctx.lineTo(d.x + 8.5, tunicBottomY);
      ctx.lineTo(d.x - 8.5, tunicBottomY);
      ctx.closePath();
      ctx.fill();

      // Removed wool shoulder cape overlay to match reference cartoon (no cape)

      // Drapery fold stitches
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(d.x - 5, tunicTopY + 4);
      ctx.lineTo(d.x - 2, tunicBottomY - 1);
      ctx.moveTo(d.x + 2, tunicTopY + 3);
      ctx.lineTo(d.x + 5, tunicBottomY - 1);
      ctx.stroke();

      // Crossbody leather sash & pouch (Alforje)
      ctx.strokeStyle = '#5C2200';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      if (d.direction === 'right') {
        ctx.moveTo(d.x - 5.5, tunicTopY + 1);
        ctx.lineTo(d.x + 5.5, tunicBottomY - 1);
        ctx.stroke();
        
        if (isGolden) {
          ctx.fillStyle = '#78350F';
          ctx.fillRect(d.x + 3.4, tunicBottomY - 4.5, 4.5, 5.5);
        } else {
          // Rounded brown leather purse saddle bag matching reference!
          ctx.fillStyle = '#78350F';
          ctx.beginPath();
          ctx.arc(d.x + 5.5, tunicBottomY - 1.8, 4.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#451A03'; // flap
          ctx.fillRect(d.x + 2.2, tunicBottomY - 5.0, 6.6, 2.2);
        }
      } else {
        ctx.moveTo(d.x + 5.5, tunicTopY + 1);
        ctx.lineTo(d.x - 5.5, tunicBottomY - 1);
        ctx.stroke();
        
        if (isGolden) {
          ctx.fillStyle = '#78350F';
          ctx.fillRect(d.x - 7.5, tunicBottomY - 4.5, 4.5, 5.5);
        } else {
          // Rounded brown leather purse saddle bag matching reference!
          ctx.fillStyle = '#78350F';
          ctx.beginPath();
          ctx.arc(d.x - 5.5, tunicBottomY - 1.8, 4.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#451A03'; // flap
          ctx.fillRect(d.x - 8.8, tunicBottomY - 5.0, 6.6, 2.2);
        }
      }

      // Belt or blue sash
      const beltY = tunicTopY + 8.5;
      if (isGolden) {
        ctx.fillStyle = '#3F1A03';
        ctx.fillRect(d.x - 7.2, beltY, 14.4, 3.0);
        ctx.fillStyle = '#F59E0B'; // golden buckle
        ctx.fillRect(d.x - 2.0, beltY - 0.4, 4.0, 3.8);
      } else {
        // Beautiful blue sash for young David in lobby!
        ctx.fillStyle = '#2563EB'; // Vibrant Blue primary
        ctx.fillRect(d.x - 7.2, beltY, 14.4, 3.5);
        ctx.fillStyle = '#60A5FA'; // Highlight
        ctx.fillRect(d.x - 7.2, beltY + 0.6, 14.4, 0.9);
        
        // Hanging blue sash tail
        const sashOffset = d.direction === 'right' ? -4.2 : 2.0;
        ctx.fillStyle = '#1D4ED8';
        ctx.fillRect(d.x + sashOffset, beltY + 3.0, 2.5, 6.8);
        ctx.fillStyle = '#60A5FA';
        ctx.fillRect(d.x + sashOffset + 0.6, beltY + 3.0, 1.0, 6.8);
      }

      // --- 8. REAR ARM SHEPHERD WALKING CYCLE ---
      ctx.save();
      const armAngle = Math.sin(d.walkCycle) * 0.45;
      const shX = d.direction === 'right' ? d.x - 6.5 : d.x + 6.5;
      ctx.fillStyle = '#FDBA74';
      ctx.translate(shX, tunicTopY + 3.5);
      if (d.attackAnimTimer > 0) {
        ctx.rotate(0.85);
      } else {
        ctx.rotate(-armAngle * 0.8);
      }
      ctx.fillRect(-1.8, 0, 3.4, 9.0);
      if (!isGolden) {
        ctx.fillStyle = '#78350F'; // leather wrist cuff
        ctx.fillRect(-2.0, 5.5, 3.8, 2.2);
      }
      ctx.restore();

      // --- 9. FRONT ARM (HOLDS WOODEN STAFF FOR YOUNG PASSTORS OR SLINGSHOT FOR ACTION) ---
      ctx.save();
      const frontShX = d.direction === 'right' ? d.x + 5.5 : d.x - 5.5;
      ctx.fillStyle = '#FED7AA';
      ctx.translate(frontShX, tunicTopY + 3.5);

      if (d.attackAnimTimer > 0) {
        // throwing sling action
        const spinPrg = (88 - d.attackAnimTimer) / 88;
        if (spinPrg < 0.6) {
          const readyAngle = d.direction === 'right' ? -Math.PI / 3 : Math.PI / 3;
          ctx.rotate(readyAngle);
          ctx.fillRect(-1.8, 0, 4.2, 9.8);
          if (!isGolden) {
            ctx.fillStyle = '#78350F'; // leather wrist cuff
            ctx.fillRect(-2.0, 6.2, 4.6, 2.2);
          }
        } else {
          const shootAngle = d.direction === 'right' ? Math.PI / 4.4 : -Math.PI / 4.4;
          ctx.rotate(shootAngle);
          ctx.fillRect(-1.8, 0, 10.5, 4.2);
          if (!isGolden) {
            ctx.fillStyle = '#78350F'; // leather wrist cuff
            ctx.fillRect(6.0, -0.2, 2.2, 4.6);
          }
        }
      } else if (d.waveTimer > 0) {
        // happy welcome wave to sheep
        const waveAngle = Math.sin(d.waveTimer * 0.35) * 0.5 - 1.3;
        ctx.rotate(waveAngle);
        ctx.fillRect(-1.8, 0, 3.6, 11);
        if (!isGolden) {
          ctx.fillStyle = '#78350F'; // leather wrist cuff
          ctx.fillRect(-2.0, 7.5, 4.0, 2.2);
        }
        ctx.fillStyle = '#FED7AA';
        ctx.beginPath();
        ctx.arc(0, 11, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Natural walking hand swing holding the wooden shepherd crook/staff (Cajado)!
        ctx.rotate(armAngle);
        ctx.fillRect(-1.8, 0, 3.6, 8.5);
        if (!isGolden) {
          ctx.fillStyle = '#78350F'; // leather wrist cuff
          ctx.fillRect(-2.0, 5.0, 4.0, 2.2);
        }

        // Render gorgeous curved wooden crook staff in shepherd's hand
        if (!isGolden) {
          ctx.save();
          ctx.translate(0, 6.5); // align with palm
          ctx.strokeStyle = '#854D0E'; // golden oak wood
          ctx.lineWidth = 1.8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          // vertical wooden stick
          ctx.moveTo(0, -22);
          ctx.lineTo(0, 14);
          // curved crook head
          ctx.arc(2.5, -22, 2.5, Math.PI, Math.PI * 2.2, false);
          ctx.stroke();

          // wood wood grain dots
          ctx.fillStyle = '#451A03';
          ctx.fillRect(-0.5, -5, 1, 1);
          ctx.fillRect(-0.5, 6, 1, 1);
          ctx.restore();
        }
      }
      ctx.restore();

      // --- 9.5 BACK HAIR LAYER (Behind face) ---
      const baseHair = isGolden ? '#F97316' : '#EA580C'; // Vibrant ginger hair description
      const shadowHair = isGolden ? '#9A3412' : '#7C2D12'; // Deep warm ginger shadow
      const highlightHair = isGolden ? '#F97316' : '#FB923C'; // Sunny copper highlight

      const dirFactor = d.direction === 'right' ? 1 : -1;
      const hairWindX = d.vx * -0.35;
      const hairWindY = bodyBob * -0.15;

      ctx.fillStyle = shadowHair;
      ctx.beginPath();
      // Curved lock behind head
      ctx.arc(d.x + hairWindX - dirFactor * 3.5, headY - 4.5 + hairWindY, 8.5, 0, Math.PI * 2);
      ctx.arc(d.x + hairWindX - dirFactor * 6.8, headY - 1.2 + hairWindY, 4.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = baseHair;
      ctx.beginPath();
      ctx.arc(d.x + hairWindX - dirFactor * 2.8, headY - 5.0 + hairWindY, 7.8, 0, Math.PI * 2);
      ctx.arc(d.x + hairWindX - dirFactor * 6.0, headY - 1.5 + hairWindY, 4.0, 0, Math.PI * 2);
      ctx.fill();

      // --- 10. HUMBLE REDHEAD GLOWING FACE & PRECIOUS DETAILS (COOPERY RUDDY RUIVO SKIN) ---
      ctx.fillStyle = '#FED7AA';
      ctx.fillRect(d.x - 2.6, headY + 5.2, 5.2, 4.2); // organic neck

      const faceGrad = ctx.createRadialGradient(d.x, headY, 1, d.x, headY, 8.2);
      faceGrad.addColorStop(0, '#FFE4E6'); // rose biblic outline check
      faceGrad.addColorStop(0.75, '#FED7AA');
      faceGrad.addColorStop(1, '#FDBA74');
      ctx.fillStyle = faceGrad;
      ctx.beginPath();
      ctx.arc(d.x, headY, 8.2, 0, Math.PI * 2);
      ctx.fill();

      // Side-face cute nose tip matching direction
      ctx.fillStyle = '#FED7AA';
      ctx.beginPath();
      const noseTipOffset = d.direction === 'right' ? 7.8 : -7.8;
      ctx.moveTo(d.x, headY - 2.5);
      ctx.lineTo(d.x + noseTipOffset, headY + 0.8);
      ctx.lineTo(d.x, headY + 2.5);
      ctx.closePath();
      ctx.fill();

      // Redhead beautiful Freckles on cheeks! (Sardas Ruivas - Very characterful!)
      ctx.fillStyle = '#C2410C'; // cinnamon ginger freckle dots
      if (d.direction === 'right') {
        ctx.fillRect(d.x + 2.5, headY + 1.2, 0.7, 0.7);
        ctx.fillRect(d.x + 3.8, headY + 1.8, 0.7, 0.7);
        ctx.fillRect(d.x + 1.8, headY + 2.2, 0.7, 0.7);
      } else {
        ctx.fillRect(d.x - 3.2, headY + 1.2, 0.7, 0.7);
        ctx.fillRect(d.x - 4.5, headY + 1.8, 0.7, 0.7);
        ctx.fillRect(d.x - 2.5, headY + 2.2, 0.7, 0.7);
      }

      // Beautiful expressive circular glass eye (Faithful sparkle!)
      const exactEyeX = d.direction === 'right' ? 2.5 : -5.0;
      ctx.fillStyle = '#0F172A'; // deep dark pupil
      ctx.beginPath();
      ctx.arc(d.x + exactEyeX + 1.0, headY - 0.8, 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Shining white reflection highlight dot
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(d.x + exactEyeX + 0.6, headY - 1.2, 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrow matching the bright chestnut brown hair
      ctx.strokeStyle = '#35210B';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(d.x + exactEyeX - 0.5, headY - 3.4);
      ctx.lineTo(d.x + exactEyeX + 2.5, headY - 3.4);
      ctx.stroke();

      // Friendly smiling mouth
      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      if (d.direction === 'right') {
        ctx.arc(d.x + 1.6, headY + 2.4, 1.8, 0, Math.PI * 0.95);
      } else {
        ctx.arc(d.x - 1.6, headY + 2.4, 1.8, 0.05, Math.PI);
      }
      ctx.stroke();

      // Rosy blush for healthy robust cheeks
      ctx.fillStyle = 'rgba(244, 114, 182, 0.55)';
      ctx.beginPath();
      ctx.arc(d.x + (d.direction === 'right' ? 4.5 : -4.5), headY + 1.0, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // BEARD ONLY FOR KING DAVID STATE (isGolden)
      if (isGolden) {
        ctx.fillStyle = baseHair;
        ctx.beginPath();
        if (d.direction === 'right') {
          ctx.moveTo(d.x - 4, headY + 2);
          ctx.quadraticCurveTo(d.x - 2, headY + 8, d.x + 2, headY + 8.5);
          ctx.quadraticCurveTo(d.x + 7, headY + 7.5, d.x + 6.5, headY + 3);
          ctx.quadraticCurveTo(d.x + 4, headY + 4, d.x + 2, headY + 5.5);
        } else {
          ctx.moveTo(d.x + 4, headY + 2);
          ctx.quadraticCurveTo(d.x + 2, headY + 8, d.x - 2, headY + 8.5);
          ctx.quadraticCurveTo(d.x - 7, headY + 7.5, d.x - 6.5, headY + 3);
          ctx.quadraticCurveTo(d.x - 4, headY + 4, d.x - 2, headY + 5.5);
        }
        ctx.closePath();
        ctx.fill();
      }

      // --- 11. FRONT HAIR / BANGS & DETAILS (Draped on forehead over eyes safely) ---
      ctx.fillStyle = baseHair;
      ctx.beginPath();
      // Center and front top curls
      ctx.arc(d.x + hairWindX, headY - 7.5 + hairWindY, 4.8, 0, Math.PI * 2);
      ctx.arc(d.x + hairWindX + dirFactor * 2.5, headY - 7.0 + hairWindY, 3.6, 0, Math.PI * 2);
      // Small sideburn
      ctx.arc(d.x + hairWindX - dirFactor * 2.5, headY + 1.0 + hairWindY, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Front hair coppery highlights
      ctx.fillStyle = highlightHair;
      ctx.beginPath();
      ctx.arc(d.x + hairWindX - dirFactor * 1.5, headY - 8.2 + hairWindY, 2.5, 0, Math.PI * 2);
      ctx.arc(d.x + hairWindX + dirFactor * 2.2, headY - 7.8 + hairWindY, 2.0, 0, Math.PI * 2);
      ctx.fill();

      // Crown over redhead hair for Golden David character selected
      if (!isGolden) {
        // Draw dark brown leather headband from the reference cartoon image
        ctx.strokeStyle = '#5C2200'; // richer leather brown
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (d.direction === 'right') {
          ctx.arc(d.x, headY, 8.4, -Math.PI * 0.22, Math.PI * 0.55);
        } else {
          ctx.arc(d.x, headY, 8.4, Math.PI * 0.45, Math.PI * 1.22);
        }
        ctx.stroke();

        // Fluttering ribbon / strap ties blowing in the mountain pass winds
        ctx.fillStyle = '#5C2200';
        ctx.beginPath();
        const tieOsc = Math.sin(Date.now() * 0.015) * 3.5;
        const tieStartX = d.x - dirFactor * 8.2;
        const tieStartY = headY;
        ctx.moveTo(tieStartX, tieStartY);
        ctx.quadraticCurveTo(tieStartX - dirFactor * 6.0, tieStartY + 3.0 + tieOsc, tieStartX - dirFactor * 8.5, tieStartY + 8.0 + tieOsc);
        ctx.lineTo(tieStartX - dirFactor * 7.0, tieStartY + 8.5 + tieOsc);
        ctx.quadraticCurveTo(tieStartX - dirFactor * 4.5, tieStartY + 4.5 + tieOsc, tieStartX, tieStartY + 1.5);
        ctx.closePath();
        ctx.fill();
      }

      if (isGolden) {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(d.x - 6, headY - 6.2);
        ctx.lineTo(d.x - 4, headY - 12.0);
        ctx.lineTo(d.x - 1.5, headY - 9.0);
        ctx.lineTo(d.x, headY - 13.0);
        ctx.lineTo(d.x + 1.5, headY - 9.0);
        ctx.lineTo(d.x + 4, headY - 12.0);
        ctx.lineTo(d.x + 6, headY - 6.2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#10B981'; // emerald center jewel
        ctx.beginPath();
        ctx.arc(d.x, headY - 7.8, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle flares
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(d.x - 0.5, headY - 14.5);
        ctx.lineTo(d.x + 0.5, headY - 14.5);
        ctx.moveTo(d.x, headY - 15.0);
        ctx.lineTo(d.x, headY - 14.0);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(d.x, headY, 11.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // --- 12. ACTIVE SLINGSHOT FUNDA ---
      ctx.strokeStyle = '#854D0E';
      ctx.lineWidth = 1.8;

      if (d.attackAnimTimer > 0) {
        const spinPrg = (88 - d.attackAnimTimer) / 88;
        const shoulderX = headX + (d.direction === 'right' ? 5.5 : -5.5);
        const shoulderY = headY + 5.5;

        if (spinPrg < 0.6) {
          ctx.beginPath();
          const frameCycle = (Date.now() / 20) % (Math.PI * 2);
          const spinX = shoulderX + Math.cos(frameCycle) * 16;
          const spinY = shoulderY - 8 + Math.sin(frameCycle) * 5.5;

          ctx.moveTo(shoulderX, shoulderY);
          ctx.quadraticCurveTo((shoulderX + spinX) / 2, (shoulderY + spinY) / 2 - 2, spinX, spinY);
          ctx.stroke();

          ctx.fillStyle = '#78350F';
          ctx.beginPath();
          ctx.arc(spinX, spinY, 3.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#CBD5E1';
          ctx.beginPath();
          ctx.arc(spinX, spinY, 2.0, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.beginPath();
          ctx.ellipse(shoulderX, shoulderY - 8, 16, 5.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          const shootLength = 18;
          const shootX = shoulderX + (d.direction === 'right' ? shootLength : -shootLength);
          const shootY = shoulderY + 3.2;

          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(shootX, shootY);
          ctx.stroke();

          ctx.fillStyle = '#78350F';
          ctx.beginPath();
          ctx.arc(shootX, shootY, 2.0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
          ctx.beginPath();
          ctx.arc(shootX, shootY, 7, 0, Math.PI * 2);
          ctx.fill();

          if (d.attackAnimTimer === 35) {
            state.starParticles.push({
              x: shootX,
              y: shootY,
              vx: d.direction === 'right' ? 4 : -4,
              vy: -1.8,
              r: 2.2,
              alpha: 1.0,
              color: '#94A3B8'
            });
          }
        }
      } else {
        ctx.beginPath();
        if (d.direction === 'right') {
          ctx.moveTo(d.x - 3, beltY + 1.5);
          ctx.quadraticCurveTo(d.x - 11, beltY + 8, d.x - 4, d.y + 7);
        } else {
          ctx.moveTo(d.x + 3, beltY + 1.5);
          ctx.quadraticCurveTo(d.x + 11, beltY + 8, d.x + 4, d.y + 7);
        }
        ctx.stroke();
      }

      // --- 13. SPEAKING CALLOUT SPEECH BUBBLE FOR DAVID ---
      if (d.speakOpacity > 0) {
        d.speakOpacity--;

        ctx.save();
        ctx.font = '800 10px monospace';
        const txtWidth = ctx.measureText(d.speakText).width;

        const balloonW = txtWidth + 14;
        const balloonX = d.x - balloonW / 2;
        const balloonY = headY - 28;

        ctx.fillStyle = 'rgba(9, 13, 26, 0.94)';
        ctx.strokeStyle = activeCharacter === 'rei_david' ? '#FBBF24' : '#60A5FA';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.roundRect(balloonX, balloonY, balloonW, 16, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = activeCharacter === 'rei_david' ? '#FDE047' : '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.speakText, d.x, balloonY + 9.0);
        ctx.restore();
      }

      // --- 14. PARTICLES LOOP ---
      state.starParticles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= 0.015;

        if (p.alpha <= 0) {
          state.starParticles.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- 15. INTERACTIVE RIPPLES ON CLICK ---
      state.clickWaves.forEach((w, idx) => {
        w.r += 0.95;
        w.opacity -= 0.045;

        if (w.opacity <= 0) {
          state.clickWaves.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${w.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activeCharacter]);

  return (
    <div className="w-full relative h-48 md:h-52 bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col group">
      <div className="absolute top-2 left-2 z-10 flex flex-col pointer-events-none select-none">
        <span className="text-[7.5px] font-mono tracking-widest text-[#FDE047] uppercase font-black bg-[#78350F]/70 border border-[#FDE047]/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm self-start">
          Lobby Interativo 🎮
        </span>
      </div>

      <div className="absolute bottom-2 right-2 z-10 flex flex-col pointer-events-none text-right select-none">
        <span className="text-[7px] text-slate-400 font-mono italic">
          Toque em David ou nas Ovelhas para interagir!
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={480}
        height={240}
        onClick={handleCanvasClick}
        className="w-full h-full object-cover cursor-pointer active:brightness-95 transition-all duration-150"
        title="Toque para ver Davi girar a funda e ouvir as ovelhinhas!"
      />
    </div>
  );
}

export function KingDavidGame() {
  const navigate = useNavigate();
  const store = useKingDavidStore();
  const bypassLocksForTest = false; // Set to true to unlock all phases for testing. Set to false to enforce game progression.

  const [gameState, setGameState] = useState<'welcome' | 'menu' | 'intro' | 'playing_2d' | 'playing_3d' | 'cutscene' | 'unlocked_reel' | 'cinematic_ending'>('welcome');
  const [currentIntroStep, setCurrentIntroStep] = useState(0);
  const [currentIntroPhase, setCurrentIntroPhase] = useState<1 | 2 | 3>(1);
  const [isRotatingScreen, setIsRotatingScreen] = useState(false);
  const [characterSelected, setCharacterSelected] = useState<'david_jovem' | 'rei_david'>('david_jovem');
  const [score, setScore] = useState(0);
  const [phaseCoins, setPhaseCoins] = useState(0);

  // 2D Phase configurations mapping
  const [activeFase, setActiveFase] = useState<1 | 2 | 3>(1);
  const [gameSessionId, setGameSessionId] = useState(0);

  // sound state
  const [muted, setMuted] = useState(false);

  // Help modal state or active tab for showing "todos informação do do jogo e fase"
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsMobileDevice(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0)
      );
    };
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  useEffect(() => {
    store.hydrate();
    // Start background music loop on load
    sfx.startBGM();
    return () => {
      sfx.stopBGM();
    };
  }, []);

  useEffect(() => {
    setCharacterSelected(store.selectedCharacter);
  }, [store.selectedCharacter]);

  // Audio mute sync
  const toggleMute = () => {
    const nextMuted = !muted;
    sfx.isMuted = nextMuted;
    setMuted(nextMuted);
    if (nextMuted) {
      sfx.stopBGM();
    } else {
      sfx.startBGM();
    }
  };

  // --- NARRATIVE INTROS CONFIGURATION ---
  const intros = {
    general: [
      {
        title: "O Jovem Pastor",
        text: "David era o filho mais novo de Jessé.\nEnquanto seus irmãos treinavam para a guerra, ele cuidava das ovelhas nos campos de Belém.",
        illustration: davidShepherdImg
      },
      {
        title: "A Primeira Ameaça",
        text: "Naquele dia, um lobo feroz aproximou-se do rebanho.\nAs ovelhas estavam em perigo.",
        illustration: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Protegendo o Rebanho",
        text: "David pegou sua funda e preparou-se para defender suas ovelhas.",
        illustration: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800"
      }
    ],
    fase2: [
      {
        title: "As Montanhas de Judá",
        text: "Dias depois, uma nova ameaça surgiu.",
        illustration: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "O Urso Gigante",
        text: "Um enorme urso começou a atacar os rebanhos da região.",
        illustration: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Coragem Maior",
        text: "David decidiu enfrentá-lo.",
        illustration: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800"
      }
    ],
    fase3: [
      {
        title: "O Maior Predador",
        text: "As histórias da coragem de David espalharam-se por toda a região.",
        illustration: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "O Rei dos Animais",
        text: "Um poderoso leão aterrorizava os campos.",
        illustration: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Fé e Coragem",
        text: "David sabia que Deus estava com ele.",
        illustration: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800"
      }
    ]
  };

  const getIntroSteps = () => {
    if (currentIntroPhase === 1) return intros.general;
    if (currentIntroPhase === 2) return intros.fase2;
    return intros.fase3;
  };

  const startNarrative = (phaseNum: 1 | 2 | 3) => {
    sfx.playJump();
    setCurrentIntroPhase(phaseNum);
    setCurrentIntroStep(0);
    setGameState('intro');
  };

  const start2DPhase = (phaseNum: 1 | 2 | 3) => {
    sfx.playJump();
    setActiveFase(phaseNum);
    setScore(0);
    setPhaseCoins(0);
    setIsPaused(false);
    isPausedRef.current = false;
    setGameResult('playing');
    setGameSessionId(prev => prev + 1);
    setGameState('playing_2d');
  };

  const start3DPhase = () => {
    sfx.playDivine();
    setScore(0);
    setPhaseCoins(0);
    setIsPaused(false);
    isPausedRef.current = false;
    setGameResult('playing');
    setGameSessionId(prev => prev + 1);
    setGameState('playing_3d');
    set3DGameOverVal(false);

    // Reset 3D progress trackers so a new game starts at 0
    progressDist3DRef.current = 0;
    localCoins3DRef.current = 0;
    targetLane3DRef.current = 1;
    currentLaneX3DRef.current = 1.0;
    activePauseVerseDistRef.current = 0;
    entities3DRef.current = [];
    sideObjects3DRef.current = [];
    floatingTexts3DRef.current = [];
  };

  const selectChar = (char: 'david_jovem' | 'rei_david') => {
    sfx.playCoin();
    store.setSelectedCharacter(char);
    setCharacterSelected(char);
  };

  // --- CANVAS-BASED 2D PLATFORMER ENGINE ---
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const [gameResult, setGameResult] = useState<'playing' | 'won' | 'lost'>('playing');
  const [waveIndicator, setWaveIndicator] = useState<string>('Onda 1/3');
  const [bossHp, setBossHp] = useState<number | null>(null);
  const [playerHp2D, setPlayerHp2D] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // References and variables to prevent React state closure lag in requestAnimationFrame
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const touchInputs = useRef<{ left: boolean; right: boolean; jump: boolean; jumpPressed: boolean; down: boolean; shootFunda: boolean; shootPunhal: boolean }>({
    left: false, right: false, jump: false, jumpPressed: false, down: false, shootFunda: false, shootPunhal: false
  });

  useEffect(() => {
    if (gameState !== 'playing_2d' || !canvasElement) return;

    const canvas = canvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let localGameResult = 'playing';
    setIsPaused(false);
    isPausedRef.current = false;
    setGameResult('playing');
    setPlayerHp2D(3);
    setBossHp(null);
    setWaveIndicator('Caminho de Belém 🐑');
    keysPressed.current = {};
    touchInputs.current = {
      left: false, right: false, jump: false, jumpPressed: false, down: false, shootFunda: false, shootPunhal: false
    };

    // Setup responsive dimensions inside viewport scale with high-DPI scaling for HD crispness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 800 * dpr;
    canvas.height = 400 * dpr;

    // Camera scrolling parameters
    let cameraX = 0;
    const levelWidth = 3200;
    let cameraShakeTimer = 0;
    let cameraShakeIntensity = 0;

    // Platformer environment assets & structures
    const gravity = 0.55;
    let jumpKeyPressedLastFrame = false;
    
    // Player object
    const player = {
      x: 100,
      y: 300,
      width: 44,
      height: 54,
      vx: 0,
      vy: 0,
      speed: 6.6,
      jumpForce: -16.0,
      grounded: false,
      jumpCount: 0,
      direction: 'right' as 'left' | 'right',
      invincibilityFrames: 0,
      lastShootTime: 0,
      walkCycle: 0,
      attackAnimTimer: 0,
      isDucking: false,
      landingSquash: 0,
      idleCycle: 0,
      stunTimer: 0,
      coyoteTimer: 0,       // Coyote Time counter for jumping slightly after leaving platforms
      jumpBufferTimer: 0    // Jump Buffer counter for queuing jump requests before landing
    };

    // Platforms with scrolling coordination, moving types, and special blocks
    const platforms = [
      // Safe Starting Zone
      { x: 0, y: 360, width: 1000, height: 40, type: 'ground' },
      
      // Beautiful warning barriers at margins of PIT 1 to prevent beasts from falling
      { x: 960, y: 200, width: 40, height: 160, type: 'barrier' },
      
      // Floating rocks and blocks in Segment 1 with added vertical blockades & reward platform
      { x: 280, y: 260, width: 120, height: 18, type: 'rock' },
      { x: 340, y: 170, width: 28, height: 24, type: 'block', blockType: 'coin', hasItem: true, bounceTimer: 0 },
      { x: 380, y: 170, width: 28, height: 24, type: 'block', blockType: 'star', hasItem: true, bounceTimer: 0 },
      { x: 420, y: 170, width: 28, height: 24, type: 'block', blockType: 'heart', hasItem: true, bounceTimer: 0 },
      
      { x: 500, y: 300, width: 50, height: 60, type: 'rock' }, // NEW: Large boulder obstacle on the ground
      { x: 550, y: 200, width: 160, height: 18, type: 'rock' },
      { x: 680, y: 120, width: 80, height: 18, type: 'rock' }, // NEW: High-level rock ledge
      { x: 740, y: 160, width: 140, height: 18, type: 'rock' },
      { x: 780, y: 80, width: 28, height: 24, type: 'block', blockType: 'shield', hasItem: true, bounceTimer: 0 },
      { x: 860, y: 240, width: 100, height: 18, type: 'rock' }, // NEW: Pre-gap buffer rock ledge
      
      // Pit 1 Gap at 1000 to 1180 with a vertical moving platform in the center!
      { x: 1030, y: 280, width: 90, height: 16, type: 'moving_v', startY: 180, range: 140, speed: 1.3, direction: 1 },
      
      // Right of PIT 1 warning barrier
      { x: 1180, y: 200, width: 40, height: 160, type: 'barrier' },
 
      // Segment 2
      { x: 1180, y: 360, width: 1000, height: 40, type: 'ground' },
      
      // Left of PIT 2 warning barrier
      { x: 2140, y: 200, width: 40, height: 160, type: 'barrier' },
 
      { x: 1300, y: 260, width: 140, height: 18, type: 'rock' },
      { x: 1350, y: 170, width: 28, height: 24, type: 'block', blockType: 'coin', hasItem: true, bounceTimer: 0 },
      { x: 1480, y: 300, width: 60, height: 60, type: 'rock' }, // NEW: Tall rock blockade in Segment 2
      
      { x: 1540, y: 210, width: 180, height: 18, type: 'rock' },
      { x: 1590, y: 120, width: 28, height: 24, type: 'block', blockType: 'star', hasItem: true, bounceTimer: 0 },
      
      { x: 1680, y: 150, width: 80, height: 16, type: 'moving_h', startX: 1680, range: 110, speed: 1.4, direction: 1 }, // NEW: Side-to-side moving ledge
      { x: 1720, y: 70, width: 28, height: 24, type: 'block', blockType: 'star', hasItem: true, bounceTimer: 0 }, // NEW: Floating reward block
      
      { x: 1820, y: 260, width: 120, height: 18, type: 'rock' },
      { x: 1860, y: 170, width: 28, height: 24, type: 'block', blockType: 'shield', hasItem: true, bounceTimer: 0 },
      { x: 1980, y: 300, width: 60, height: 60, type: 'rock' }, // NEW: Another ground blockade block
      { x: 2040, y: 210, width: 110, height: 18, type: 'rock' }, // NEW: High security escape platform before Pit 2
      
      // Pit 2 Gap at 2180 to 2340 with a horizontal moving platform!
      { x: 2190, y: 240, width: 90, height: 16, type: 'moving_h', startX: 2190, range: 120, speed: 1.6, direction: 1 },
      
      // Right of PIT 2 warning barrier
      { x: 2340, y: 200, width: 40, height: 160, type: 'barrier' },

      // Boss Arena Segment (2340 to 3200) with added helper ledges to survive stampedes
      { x: 2340, y: 360, width: 900, height: 40, type: 'ground' },
      { x: 2460, y: 250, width: 140, height: 18, type: 'rock' },
      { x: 2780, y: 250, width: 140, height: 18, type: 'rock' },
      { x: 2620, y: 170, width: 160, height: 18, type: 'rock' },
      { x: 2650, y: 90, width: 28, height: 24, type: 'block', blockType: 'heart', hasItem: true, bounceTimer: 0 },
      { x: 2700, y: 90, width: 28, height: 24, type: 'block', blockType: 'coin', hasItem: true, bounceTimer: 0 },
      { x: 2980, y: 200, width: 140, height: 18, type: 'rock' } // NEW: High battle perch above boss spawning region
    ];

    // Ovelhas (graze on left grass)
    const sheepList = [
      { x: 60, y: 332, width: 26, height: 20 },
      { x: 140, y: 334, width: 28, height: 22 },
      { x: 200, y: 331, width: 25, height: 18 }
    ];

    // Scattered collectable items
    interface Collectible {
      id: number;
      x: number;
      y: number;
      width: number;
      height: number;
      type: 'coin' | 'star' | 'crystal' | 'scroll' | 'heart' | 'shield';
      collected: boolean;
      bounceOffset: number;
      vy?: number;
      vx?: number;
      isFromBlock?: boolean;
    }

    let items: Collectible[] = [
      // Coins
      { id: 1, x: 300, y: 220, width: 20, height: 20, type: 'coin', collected: false, bounceOffset: 0 },
      { id: 2, x: 340, y: 220, width: 20, height: 20, type: 'coin', collected: false, bounceOffset: 0 },
      { id: 3, x: 570, y: 160, width: 20, height: 20, type: 'coin', collected: false, bounceOffset: 0 },
      { id: 4, x: 610, y: 160, width: 20, height: 20, type: 'coin', collected: false, bounceOffset: 0 },
      { id: 5, x: 1320, y: 220, width: 20, height: 20, type: 'coin', collected: false, bounceOffset: 0 },
      { id: 6, x: 1560, y: 170, width: 20, height: 20, type: 'coin', collected: false, bounceOffset: 0 },
      { id: 7, x: 1640, y: 170, width: 20, height: 20, type: 'coin', collected: false, bounceOffset: 0 },
      { id: 8, x: 1840, y: 220, width: 20, height: 20, type: 'coin', collected: false, bounceOffset: 0 },
      // Crystals
      { id: 9, x: 790, y: 120, width: 22, height: 22, type: 'crystal', collected: false, bounceOffset: 0 },
      { id: 10, x: 1700, y: 170, width: 22, height: 22, type: 'crystal', collected: false, bounceOffset: 0 },
      // Stars
      { id: 11, x: 140, y: 280, width: 22, height: 22, type: 'star', collected: false, bounceOffset: 0 },
      { id: 12, x: 1240, y: 310, width: 22, height: 22, type: 'star', collected: false, bounceOffset: 0 },
      // Holy Biblical Scroll
      { id: 13, x: 1620, y: 80, width: 24, height: 20, type: 'scroll', collected: false, bounceOffset: 0 },
      // Extra Hearts
      { id: 14, x: 800, y: 220, width: 20, height: 20, type: 'heart', collected: false, bounceOffset: 0 }
    ];

    // Projectiles thrown by player
    interface SlungStone {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      damage: number;
      active: boolean;
      golden: boolean;
      rotation?: number;
      weaponType?: 'funda' | 'punhal';
    }
    let stones: SlungStone[] = [];

    // Damage floating text numbers mapping (-10, -15, -20)
    interface FloatingDamage {
      x: number;
      y: number;
      text: string;
      color: string;
      life: number;
    }
    let floatingTexts: FloatingDamage[] = [];

    // Enemies
    interface Enemy {
      id: number;
      x: number;
      y: number;
      width: number;
      height: number;
      vx: number;
      vy: number;
      hp: number;
      maxHp: number;
      isBoss: boolean;
      type: 'wolf' | 'bear' | 'lion';
      jumpTimer: number;
      dashTimer: number;
      projectileTimer: number;
      bearState?: 'walk' | 'charge_roar' | 'charge_dash' | 'swipe_prep' | 'swipe_slam' | 'roar_sonic';
      bearTimer?: number;
      lionState?: 'walk' | 'charge_roar' | 'charge_dash' | 'jump_prep' | 'jump_air' | 'fury_enter';
      lionTimer?: number;
      walkPhase?: number;
      patrolaDirection?: number;
    }
    let enemies: Enemy[] = [];
    let enemyCounter = 0;

    // Phase attributes
    const phaseType = activeFase === 1 ? 'wolf' : activeFase === 2 ? 'bear' : 'lion';
    let currentWave = 1;
    let waveSpawnsLeft = 4;
    let bossSpawned = false;
    let localScore = 0;
    let localCoins = 0;

    // Spawn an enemy
    const spawnEnemy = (isBoss = false) => {
      enemyCounter++;
      if (isBoss) {
        let bW = 78;
        let bH = 50;
        if (activeFase === 2) {
          bW = 165; // At least 2.5x larger than David 
          bH = 140; 
        } else if (activeFase === 3) {
          bW = 178; // Slightly reduced from 210 for a more balanced and agile boss scale
          bH = 134; // Slightly reduced from 158 to maintain the exact 1.33 aspect ratio
        }
        bossSpawned = true;
        const hpVal = activeFase === 1 ? 15 : activeFase === 2 ? 35 : 60;
        setBossHp(hpVal);
        enemies.push({
          id: enemyCounter,
          x: 2900,
          y: 200,
          width: bW,
          height: bH,
          vx: activeFase === 3 ? -2.2 : -1.5,
          vy: 0,
          hp: hpVal,
          maxHp: hpVal,
          isBoss: true,
          type: phaseType,
          jumpTimer: 0,
          dashTimer: 0,
          projectileTimer: 0
        });
      } else {
        const widthVal = phaseType === 'wolf' ? 46 : phaseType === 'bear' ? 68 : 58;
        const heightVal = phaseType === 'wolf' ? 28 : phaseType === 'bear' ? 54 : 44;
        enemies.push({
          id: enemyCounter,
          x: player.x + 450,
          y: 300,
          width: widthVal,
          height: heightVal,
          vx: activeFase === 1 ? -2.0 : activeFase === 2 ? -1.5 : -2.6,
          vy: 0,
          hp: activeFase === 1 ? 1 : activeFase === 2 ? 2 : 3,
          maxHp: activeFase === 1 ? 1 : activeFase === 2 ? 2 : 3,
          isBoss: false,
          type: phaseType,
          jumpTimer: 0,
          dashTimer: 0,
          projectileTimer: 0
        });
      }
    };

    // Progressive wave spawn thresholds
    const initialMinionPoints = [
      { x: 500, label: 'Lobo Selvagem 🐺', spawned: false },
      { x: 780, label: 'Lobo Selvagem 🐺', spawned: false },
      { x: 1250, label: activeFase === 2 ? 'Urso Pardo 🐻' : 'Lobo 🐺', spawned: false },
      { x: 1480, label: 'Ataque de Urso 🐻', spawned: false },
      { x: 1720, label: 'Matilha Faminta 🐺', spawned: false },
      { x: 1980, label: 'Leão Rugindo 🦁', spawned: false },
      { x: 2360, label: 'Guarda do Leão 🦁', spawned: false },
      { x: 2580, label: 'Último Defensor 🦁', spawned: false }
    ];

    // Particles system
    interface GameParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      life: number;
    }
    let particles: GameParticle[] = [];

    const createExplosion = (x: number, y: number, color: string, count = 8) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6 - 2,
          radius: Math.random() * 3 + 1.5,
          color,
          life: 30 + Math.random() * 20
        });
      }
    };

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setIsPaused(prev => !prev);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Main Game Loop for Canvas 2D
    const update = () => {
      if (!isPausedRef.current) {
        // 1. Process controller inputs (Keyboard + transparent Screen Buttons/Joystick)
      let moveLeft = keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['A'] || touchInputs.current.left;
      let moveRight = keysPressed.current['ArrowRight'] || keysPressed.current['d'] || keysPressed.current['D'] || touchInputs.current.right;
      
      let isJumpPressed = keysPressed.current['ArrowUp'] || keysPressed.current['w'] || keysPressed.current['W'] || keysPressed.current[' '] || touchInputs.current.jump;
      let triggersJump = (isJumpPressed && !jumpKeyPressedLastFrame) || touchInputs.current.jumpPressed;
      jumpKeyPressedLastFrame = isJumpPressed;
      touchInputs.current.jumpPressed = false; // Reset the instantaneous tap trigger after reading

      let moveDown = keysPressed.current['ArrowDown'] || keysPressed.current['s'] || keysPressed.current['S'] || touchInputs.current.down;
      
      let triggersFunda = keysPressed.current['f'] || keysPressed.current['F'] || keysPressed.current['Enter'] || touchInputs.current.shootFunda;
      let triggersPunhal = keysPressed.current['g'] || keysPressed.current['G'] || keysPressed.current['c'] || keysPressed.current['C'] || touchInputs.current.shootPunhal;

      // Handle ducking / crouching
      if (moveDown && player.grounded && (!player.stunTimer || player.stunTimer <= 0)) {
         player.isDucking = true;
      } else {
         player.isDucking = false;
      }

      // Handle Direction and horizontal velocity
      if (player.stunTimer && player.stunTimer > 0) {
        player.stunTimer--;
        triggersJump = false;
        triggersFunda = false;
        triggersPunhal = false;
        // Decay horizontal knockback friction smoothly during stun
        player.vx *= 0.94;
      } else {
        const currentSpeed = player.isDucking ? 2.16 : player.speed;
        if (player.grounded) {
          // Responsive instant ground movement
          if (moveLeft) {
            player.vx = -currentSpeed;
            player.direction = 'left';
            player.walkCycle += 0.25;
          } else if (moveRight) {
            player.vx = currentSpeed;
            player.direction = 'right';
            player.walkCycle += 0.25;
          } else {
            player.vx = 0;
            player.walkCycle = 0;
          }
        } else {
          // Smooth fluid air maneuverability
          if (moveLeft) {
            player.vx = Math.max(-currentSpeed, player.vx - 0.75);
            player.direction = 'left';
            player.walkCycle += 0.15;
          } else if (moveRight) {
            player.vx = Math.min(currentSpeed, player.vx + 0.75);
            player.direction = 'right';
            player.walkCycle += 0.15;
          } else {
            player.vx *= 0.91; // Natural air resistance glide
          }
        }
      }

      if (player.attackAnimTimer > 0) {
        player.attackAnimTimer--;
      }

      // Decrement coyote time and jump buffer counters
      if (player.grounded) {
        player.coyoteTimer = 10; // 10 frames of coyote time reset
      } else if (player.coyoteTimer > 0) {
        player.coyoteTimer--;
      }

      if (player.jumpBufferTimer > 0) {
        player.jumpBufferTimer--;
      }

      // If jump was pressed this frame, buffer it!
      if (triggersJump) {
        player.jumpBufferTimer = 7;
      }

      const performJump = () => {
        // First jump gets deep bounciness; second jump gets a fresh, crisp, powerful vertical boost!
        const force = player.jumpCount === 0 ? player.jumpForce : player.jumpForce * 1.32;
        player.vy = force;
        player.grounded = false;
        player.coyoteTimer = 0;      // consumed
        player.jumpBufferTimer = 0;  // consumed
        player.jumpCount++;
        sfx.playJump();
        
        // Spawn neat launch smoke/dust particles at player's feet
        if (player.jumpCount === 1) {
          createExplosion(player.x + player.width / 2, player.y + player.height - 4, 'rgba(255, 255, 255, 0.55)', 7);
          createExplosion(player.x + player.width / 2, player.y + player.height - 4, '#FDBA74', 4);
        }
        
        // Air steam blowout effect on double-jumping
        if (player.jumpCount === 2) {
          createExplosion(player.x + player.width / 2, player.y + player.height - 4, '#FBBF24', 16);
          createExplosion(player.x + player.width / 2, player.y + player.height - 4, '#FFFFFF', 10);
          floatingTexts.push({
            x: player.x + player.width / 2,
            y: player.y - 12,
            text: "⭐ DUPLO PULO!",
            color: '#FBBF24',
            life: 50
          });
        }
        touchInputs.current.jump = false; // reset flag
      };

      // Check if a jump should be executed
      if (player.jumpBufferTimer > 0) {
        const canNormalJump = player.grounded;
        const canCoyoteJump = player.coyoteTimer > 0 && player.jumpCount === 0;
        const canDoubleJump = !player.grounded && player.jumpCount < 2;

        if (canNormalJump || canCoyoteJump || canDoubleJump) {
          if (canNormalJump || canCoyoteJump) {
            player.jumpCount = 0; // ensure first jump is used
          }
          performJump();
        }
      }

      // Shoot with rate limits
      const nowMs = Date.now();

      // A. Funda (Sling/Pedra) attack with 300ms cooldown
      if (triggersFunda && nowMs - player.lastShootTime > 300) {
        player.lastShootTime = nowMs;
        player.attackAnimTimer = 14; // trigger attack animation
        sfx.playShoot();
        // Do not reset touch flag instantly to allow continuous automatic firing while holding the button

        const isGolden = characterSelected === 'rei_david';
        const angle = player.direction === 'right' ? 0 : Math.PI;
        // Bullet positions: offsets from player head height
        stones.push({
          x: player.x + (player.direction === 'right' ? player.width : 0),
          y: player.y + player.height / 2 - 8,
          vx: Math.cos(angle) * 11,
          vy: 0, // completely straight horizontal trajectory
          radius: isGolden ? 6 : 4.5,
          damage: isGolden ? 2 : 1,
          active: true,
          golden: isGolden,
          rotation: 0,
          weaponType: 'funda'
        });

        // King David shoots multiple stones or creates nice light trail particles!
        if (isGolden) {
          createExplosion(player.x + (player.direction === 'right' ? player.width : 0), player.y + player.height / 2 - 8, '#F59E0B', 4);
        }
      }

      // B. Punhal (Dagger) attack with 180ms cooldown
      if (triggersPunhal && nowMs - player.lastShootTime > 180) {
        player.lastShootTime = nowMs;
        player.attackAnimTimer = 8; // trigger attack animation
        sfx.playShoot();
        // Do not reset touch flag instantly to allow continuous automatic firing while holding the button

        const isGolden = characterSelected === 'rei_david';
        const angle = player.direction === 'right' ? 0 : Math.PI;
        // Dagger travels fast, horizontal flat traj, smaller higher dmg hitbox
        stones.push({
          x: player.x + (player.direction === 'right' ? player.width : 0),
          y: player.y + player.height / 2 - 4,
          vx: Math.cos(angle) * 14.5, // fast!
          vy: 0, // completely straight horizontal trajectory
          radius: isGolden ? 7 : 5,
          damage: isGolden ? 3 : 1.5, // stronger but direct
          active: true,
          golden: isGolden,
          rotation: 0,
          weaponType: 'punhal'
        });

        createExplosion(player.x + (player.direction === 'right' ? player.width : 0), player.y + player.height / 2 - 4, '#94A3B8', 3);
      }

      // Variable jump height: if the player is moving upward and has released the jump button, cushion/damp the jump
      if (!isJumpPressed && player.vy < -3.0) {
        player.vy *= 0.82; // smoothly and dynamically reduce upward velocity for a softer, more controllable landing!
      }

      // Apply primary physics & gravity (heavier fall for professional athletic game feel)
      const currentGravity = player.vy > 0 ? gravity * 1.26 : gravity;
      player.vy += currentGravity;
      player.x += player.vx;
      player.y += player.vy;

      // If stunned, spawn tiny spinning dizzy stars around player head
      if (player.stunTimer && player.stunTimer > 0 && Math.random() < 0.28) {
        const angle = Date.now() * 0.008;
        const orbitRadius = 14;
        const headX = player.x + player.width / 2;
        const headY = player.y - 4;
        particles.push({
          x: headX + Math.sin(angle) * orbitRadius,
          y: headY + Math.cos(angle * 0.6) * 4,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 0.6 - 0.2, // slowly drift up like cartoon dizzy star
          radius: Math.random() * 1.5 + 1.2,
          color: '#FEF08A', // soft golden cream
          life: 25
        });
      }

      // Camera following player with smooth damp
      let targetCamX = player.x - 300;
      if (targetCamX < 0) targetCamX = 0;
      if (targetCamX > levelWidth - 800) targetCamX = levelWidth - 800;
      cameraX += (targetCamX - cameraX) * 0.1;

      // Decrement camera shake timer
      if (cameraShakeTimer > 0) {
        cameraShakeTimer--;
      }

      // Update moving platforms coordinates & special blocks timing ticks
      platforms.forEach(plat => {
        if (plat.type === 'moving_h' && plat.startX !== undefined && plat.range !== undefined && plat.speed !== undefined && plat.direction !== undefined) {
          plat.x += plat.speed * plat.direction;
          if (plat.x < plat.startX || plat.x > plat.startX + plat.range) {
            plat.direction *= -1;
          }
        } else if (plat.type === 'moving_v' && plat.startY !== undefined && plat.range !== undefined && plat.speed !== undefined && plat.direction !== undefined) {
          plat.y += plat.speed * plat.direction;
          if (plat.y < plat.startY || plat.y > plat.startY + plat.range) {
            plat.direction *= -1;
          }
        }
        if (plat.bounceTimer !== undefined && plat.bounceTimer > 0) {
          plat.bounceTimer--;
        }
      });

      // Update active map items (coins, stars, etc)
      items.forEach(item => {
        if (item.collected) return;
        if (item.isFromBlock) {
          item.vy = (item.vy || 0) + 0.3; // items gravity
          item.x += item.vx || 0;
          item.y += item.vy;
          // Land flat on floor bottom
          if (item.y >= 336) {
            item.y = 336;
            item.vy = 0;
            item.vx = 0;
          }
        } else {
          item.bounceOffset = Math.sin(Date.now() / 220 + item.x) * 4.2;
        }

        // Collision Check with David
        const actualY = item.y + (item.isFromBlock ? 0 : item.bounceOffset);
        if (
          player.x < item.x + item.width && player.x + player.width > item.x &&
          player.y < actualY + item.height && player.y + player.height > actualY
        ) {
          item.collected = true;
          sfx.playCoin();
          createExplosion(item.x + item.width/2, actualY + item.height/2, '#FBBF24', 12);

          if (item.type === 'coin') {
            localCoins += 1;
            localScore += 50;
            setPhaseCoins(localCoins);
            setScore(localScore);
            floatingTexts.push({
              x: item.x,
              y: actualY,
              text: "🪙 +50 Pontos",
              color: '#FCD34D',
              life: 40
            });
          } else if (item.type === 'star') {
            localScore += 250;
            setScore(localScore);
            floatingTexts.push({
              x: item.x,
              y: actualY,
              text: "⭐ +250!",
              color: '#34D399',
              life: 45
            });
          } else if (item.type === 'heart') {
            setPlayerHp2D(prev => Math.min(3, prev + 1));
            floatingTexts.push({
              x: item.x,
              y: actualY,
              text: "❤️ +1 Vida",
              color: '#F87171',
              life: 45
            });
          } else if (item.type === 'crystal') {
            localScore += 180;
            setScore(localScore);
            floatingTexts.push({
              x: item.x,
              y: actualY,
              text: "💎 +180!",
              color: '#22D3EE',
              life: 45
            });
          } else if (item.type === 'scroll') {
            localScore += 400;
            setScore(localScore);
            floatingTexts.push({
              x: item.x,
              y: actualY,
              text: "📜 Pergaminho Sagrado!",
              color: '#F59E0B',
              life: 60
            });
          } else if (item.type === 'shield') {
            player.invincibilityFrames = 150; // temporary shield invulnerability
            floatingTexts.push({
              x: item.x,
              y: actualY,
              text: "🛡️ ESCUDO MILAGROSO!",
              color: '#3B82F6',
              life: 55
            });
          }
        }
      });
      items = items.filter(itm => !itm.collected);

      // Map Limits boundaries
      if (player.x < 0) player.x = 0;
      if (player.x > levelWidth - player.width) player.x = levelWidth - player.width;

      // Pit Death fall check
      if (player.y > 410) {
        sfx.playHurt();
        setPlayerHp2D(prev => {
          const newVal = prev - 1;
          if (newVal <= 0) {
            localGameResult = 'lost';
            setGameResult('lost');
          } else {
            // Respawn back at safe platforms
            player.x = player.x > 1800 ? 1200 : 100;
            player.y = 200;
            player.vx = 0;
            player.vy = 0;
            player.invincibilityFrames = 50;
            createExplosion(player.x, player.y, '#EF4444', 12);
          }
          return newVal;
        });
      }

      const wasGrounded = player.grounded;
      player.grounded = false;

      // Platform collisions (AABB with scrolling coords offsets)
      platforms.forEach(plat => {
        let blockYOffset = 0;
        if (plat.type === 'block' && plat.bounceTimer !== undefined && plat.bounceTimer > 0) {
          blockYOffset = -7 * Math.sin((plat.bounceTimer / 10) * Math.PI);
        }
        const finalPledgeY = plat.y + blockYOffset;

        // X collision overlap check
        if (player.x + player.width > plat.x && player.x < plat.x + plat.width) {
          // Landing flat on top of platform/block
          if (player.vy >= 0 && player.y + player.height - player.vy <= finalPledgeY + 5 && player.y + player.height >= finalPledgeY) {
            if (!wasGrounded && player.vy > 1.2) {
              player.landingSquash = Math.min(0.28, player.vy * 0.024);
              const count = Math.min(6, Math.floor(player.vy * 0.75) + 2);
              for (let i = 0; i < count; i++) {
                particles.push({
                  x: player.x + player.width / 2 + (Math.random() - 0.5) * 20,
                  y: finalPledgeY,
                  vx: (Math.random() - 0.5) * 2.2 + (player.vx * 0.15),
                  vy: -Math.random() * 1.5 - 0.5,
                  radius: Math.random() * 2.2 + 1,
                  color: 'rgba(226, 232, 240, 0.7)',
                  life: 14 + Math.random() * 10
                });
              }
            }
            player.y = finalPledgeY - player.height;
            player.vy = 0;
            player.grounded = true;

            // Follow horizontally moving platforms
            if (plat.type === 'moving_h' && plat.speed !== undefined && plat.direction !== undefined) {
              player.x += plat.speed * plat.direction;
            }
          }

          // Hitting blocks from below (Bouncy blocks)
          if (player.vy < 0 && player.y + player.vy <= finalPledgeY + plat.height && player.y >= finalPledgeY + plat.height - 8) {
            if (plat.type === 'block') {
              player.vy = 0.5; // push player back down
              if (plat.hasItem) {
                plat.hasItem = false;
                plat.bounceTimer = 10;
                sfx.playCoin();

                const insideType = plat.blockType || 'coin';
                items.push({
                  id: Date.now() + Math.random(),
                  x: plat.x + plat.width/2 - 10,
                  y: plat.y - 18,
                  width: 20,
                  height: 20,
                  type: insideType as any,
                  collected: false,
                  bounceOffset: 0,
                  vy: -5.2,
                  vx: (Math.random() - 0.5) * 2.5,
                  isFromBlock: true
                });

                createExplosion(plat.x + plat.width/2, plat.y, '#FBBF24', 8);

                let text = "🪙 +50 MOEDA";
                let color = '#FBBF24';
                if (insideType === 'star') { text = "⭐ ESTRELA"; color = '#34D399'; }
                else if (insideType === 'heart') { text = "❤️ CORAÇÃO"; color = '#EF4444'; }
                else if (insideType === 'shield') { text = "✨ ESCUDO"; color = '#60A5FA'; }

                floatingTexts.push({
                  x: plat.x + plat.width/2,
                  y: plat.y - 10,
                  text: text,
                  color: color,
                  life: 45
                });
              }
            } else {
              player.vy = 0.5;
            }
          }
        }
      });

      if (player.grounded) {
        player.jumpCount = 0;
        player.coyoteTimer = 10;
        if (player.jumpBufferTimer > 0) {
          performJump();
        }
      }

      // Update idle breath cycles & landing squash factors
      player.idleCycle = (player.idleCycle || 0) + 0.051;
      if (player.landingSquash > 0) {
        player.landingSquash *= 0.83;
        if (player.landingSquash < 0.01) player.landingSquash = 0;
      }

      // Invincibility management
      if (player.invincibilityFrames > 0) {
        player.invincibilityFrames--;
      }

      // Progressive minion spawning as player moves forward
      initialMinionPoints.forEach(pt => {
        if (!pt.spawned && player.x + 450 > pt.x && player.x < pt.x) {
          pt.spawned = true;
          enemyCounter++;
          const nameLabel = pt.label;
          const widthVal = phaseType === 'wolf' ? 46 : phaseType === 'bear' ? 68 : 58;
          const heightVal = phaseType === 'wolf' ? 28 : phaseType === 'bear' ? 54 : 44;

          enemies.push({
            id: enemyCounter,
            x: pt.x,
            y: 300,
            width: widthVal,
            height: heightVal,
            vx: activeFase === 1 ? -1.8 : activeFase === 2 ? -1.3 : -2.3,
            vy: 0,
            hp: activeFase === 1 ? 1 : activeFase === 2 ? 2 : 3,
            maxHp: activeFase === 1 ? 1 : activeFase === 2 ? 2 : 3,
            isBoss: false,
            type: phaseType,
            jumpTimer: 0,
            dashTimer: 0,
            projectileTimer: 0
          });

          // Floating spawn notice tag
          floatingTexts.push({
            x: pt.x,
            y: 260,
            text: `⚠️ ${nameLabel}!`,
            color: '#EF4444',
            life: 50
          });
        }
      });

      // Boss trigger at end of phase line (arena zone limit)
      if (!bossSpawned && player.x > 2650) {
        bossSpawned = true;
        setWaveIndicator(`CHEFE DO MUNDO! 👑`);
        spawnEnemy(true);
      }

      // Screen scrolling coordinate bounds locks inside boss arena
      if (bossSpawned) {
        if (player.x < 2400) player.x = 2400;
      }

      // 2. Update player stones & check bounds
      stones.forEach(stone => {
        if (!stone.active) return;
        stone.x += stone.vx;
        stone.y += stone.vy;
        stone.rotation = (stone.rotation || 0) + (stone.vx > 0 ? 0.35 : -0.35); // physical rotation
        // visual particle trace
        if (Math.random() < 0.4) {
          particles.push({
            x: stone.x,
            y: stone.y,
            vx: -stone.vx * 0.1,
            vy: (Math.random() - 0.5) * 1,
            radius: Math.random() * 2 + 1,
            color: stone.golden ? '#F59E0B' : '#E2E8F0',
            life: 15
          });
        }
        // Fix bounds-checking to use camera offset instead of static canvas bounds, 
        // ensuring stones are not instantly destroyed when player scrolls past 800px.
        if (stone.x < cameraX - 200 || stone.x > cameraX + 800 + 200 || stone.y > 400) {
          stone.active = false;
        }
      });
      stones = stones.filter(s => s.active);

      // Update floating texts for damage display (-10, -15, -20)
      floatingTexts.forEach(ft => {
        ft.y -= 0.8; // float upwards
        ft.life--;
      });
      floatingTexts = floatingTexts.filter(ft => ft.life > 0);

      // 3. Update active enemies
      enemies.forEach(enemy => {
        // Dynamically increase the Giant Wolf speed proportional to player's current score
        let velocityX = enemy.vx;
        if (enemy.isBoss && enemy.type === 'wolf') {
          const speedBoost = localScore * 0.00065; // speed increases as score goes up
          const directionSign = enemy.vx >= 0 ? 1 : -1;
          velocityX = enemy.vx + (directionSign * speedBoost);
        }
        
        enemy.x += velocityX;
        enemy.y += enemy.vy;

        // Initialize walkPhase accumulator for natural locomotor speed and frame-sync
        if (enemy.walkPhase === undefined) {
          enemy.walkPhase = 0;
        }
        if (enemy.type === 'lion') {
          // Sync animation with exact forward progression velocityX
          if (Math.abs(velocityX) === 0) {
            enemy.walkPhase += 0.045; // subtle breathing motion when idle
          } else {
            enemy.walkPhase += Math.abs(velocityX) * 0.048; // highly-responsive real-time walking speed!
          }
        } else if (enemy.type === 'bear') {
          // Smooth heavy lumbering gait sync
          if (Math.abs(velocityX) === 0) {
            enemy.walkPhase += 0.025;
          } else {
            enemy.walkPhase += Math.abs(velocityX) * 0.042;
          }
        } else if (enemy.type === 'wolf') {
          // Energetic elegant canine trot gait sync
          if (Math.abs(velocityX) === 0) {
            enemy.walkPhase += 0.055; // subtle breathing/alert motion when idle
          } else {
            // Canines walk/run with a high-frequency, elastic trot
            // Multiply by a factor that matches its size and speed beautifully
            enemy.walkPhase += Math.abs(velocityX) * (enemy.isBoss ? 0.095 : 0.125);
          }
        }

        // Airtight platform boundary fences and void fall protection for Bosses
        if (enemy.isBoss) {
          if (enemy.type === 'bear') {
            // Keep the bear strictly on the Phase 2 ground [1180 to 2180]
            if (enemy.x < 1190) {
              enemy.x = 1190;
              if (enemy.vx < 0) enemy.vx = Math.abs(enemy.vx);
            }
            if (enemy.x + enemy.width > 2170) {
              enemy.x = 2170 - enemy.width;
              if (enemy.vx > 0) enemy.vx = -Math.abs(enemy.vx);
            }
            // Falling prevention clamp: if bear somehow slips or is knocked below the ground platform y=360
            if (enemy.y + enemy.height > 360) {
              enemy.y = 360 - enemy.height;
              enemy.vy = 0;
            }
          } else if (enemy.type === 'lion') {
            // Keep the lion strictly inside Phase 3 arena [2340 to 3240]
            if (enemy.x < 2355) {
              enemy.x = 2355;
              if (enemy.vx < 0) enemy.vx = Math.abs(enemy.vx);
            }
            if (enemy.x + enemy.width > 3230) {
              enemy.x = 3230 - enemy.width;
              if (enemy.vx > 0) enemy.vx = -Math.abs(enemy.vx);
            }
            // Falling prevention clamp: if lion is descending and dips past the ground platform y=360
            if (enemy.vy >= 0 && enemy.y + enemy.height > 360) {
              enemy.y = 360 - enemy.height;
              enemy.vy = 0;
            }
          } else if (enemy.type === 'wolf') {
            // Keep the giant wolf strictly inside Phase 1 Boss Arena [2340 to 3240]
            if (enemy.x < 2355) {
              enemy.x = 2355;
              if (enemy.vx < 0) enemy.vx = Math.abs(enemy.vx);
            }
            if (enemy.x + enemy.width > 3230) {
              enemy.x = 3230 - enemy.width;
              if (enemy.vx > 0) enemy.vx = -Math.abs(enemy.vx);
            }
            // Falling prevention clamp: if wolf is descending and dips past the ground platform y=360
            if (enemy.vy >= 0 && enemy.y + enemy.height > 360) {
              enemy.y = 360 - enemy.height;
              enemy.vy = 0;
            }
          }
        }

        // Apply visual logic for animation / jumps
        enemy.jumpTimer++;
        if (enemy.jumpTimer > 110 && Math.random() < 0.04) {
          enemy.vy = -7.5; // jump over platforms
          enemy.jumpTimer = 0;
        }
        enemy.vy += gravity;

        // Platform collisions for enemies
        let standingPlatform: any = null;
        platforms.forEach(plat => {
          if (enemy.x + enemy.width > plat.x && enemy.x < plat.x + plat.width) {
            if (enemy.vy >= 0 && enemy.y + enemy.height - enemy.vy <= plat.y && enemy.y + enemy.height >= plat.y) {
              enemy.y = plat.y - enemy.height;
              enemy.vy = 0;
              standingPlatform = plat;
            }
          }
        });

        // 🛡️ Keep beasts on their platforms: turn minions back at platform edges
        if (!enemy.isBoss && standingPlatform) {
          if (enemy.vx > 0) {
            const rightLimit = standingPlatform.x + standingPlatform.width;
            if (enemy.x + enemy.width >= rightLimit - 8) {
              enemy.vx = -Math.abs(enemy.vx);
            }
          } else if (enemy.vx < 0) {
            const leftLimit = standingPlatform.x;
            if (enemy.x <= leftLimit + 8) {
              enemy.vx = Math.abs(enemy.vx);
            }
          }
        }

        // 🛡️ Physical collision with warning barriers to block beasts completely (and prevent falling into the gaps)
        if (!enemy.isBoss) {
          platforms.forEach(plat => {
            if (plat.type === 'barrier') {
              if (enemy.x + enemy.width >= plat.x && enemy.x <= plat.x + plat.width) {
                // Absolute airtight block: regardless of jump height, normal beasts can never cross warning barriers
                if (enemy.vx > 0) {
                  enemy.vx = -Math.abs(enemy.vx);
                  enemy.x = plat.x - enemy.width - 1; // Snap back to avoid getting stuck
                } else if (enemy.vx < 0) {
                  enemy.vx = Math.abs(enemy.vx);
                  enemy.x = plat.x + plat.width + 1; // Snap back to avoid getting stuck
                }
              }
            }
          });
        }

        // Boss Special Abilities
        if (enemy.isBoss) {
          if (enemy.type === 'wolf') {
            enemy.dashTimer++;
            if (enemy.dashTimer > 180) {
              // High speed lunge dash!
              enemy.vx = -4.8;
              setTimeout(() => {
                enemy.vx = -1.5;
              }, 600);
              enemy.dashTimer = 0;
            }
          } else if (enemy.type === 'bear') {
            // Setup base state
            if (!enemy.bearState) {
              enemy.bearState = 'walk';
              enemy.bearTimer = 0;
            }

            enemy.bearTimer = (enemy.bearTimer || 0) + 1;

            if (enemy.bearState === 'walk') {
              // Lumber towards David
              const targetDir = player.x < enemy.x ? -1 : 1;
              enemy.vx = targetDir * 1.35; // slow, heavy grizzly pace

              // Switch to an attack after 150 walk ticks
              if (enemy.bearTimer > 150) {
                enemy.bearTimer = 0;
                const rng = Math.random();
                if (rng < 0.35) {
                  enemy.bearState = 'charge_roar'; // Start Attack 1: Investida / Charge prep
                  enemy.vx = 0;
                } else if (rng < 0.70) {
                  enemy.bearState = 'swipe_prep'; // Start Attack 2: Claw Slam prep
                  enemy.vx = 0;
                } else {
                  enemy.bearState = 'roar_sonic'; // Start Attack 3: Sonic Roar pushing David
                  enemy.vx = 0;
                }
              }
            } else if (enemy.bearState === 'charge_roar') {
              // Shake and charge up roar with visual indicators
              enemy.vx = 0;
              if (Math.random() < 0.4) {
                // Ground dust puff particles
                particles.push({
                  x: enemy.x + Math.random() * enemy.width,
                  y: enemy.y + enemy.height,
                  vx: (Math.random() - 0.5) * 4,
                  vy: -Math.random() * 2.5,
                  radius: Math.random() * 3 + 1.5,
                  color: '#78716C',
                  life: 22
                });
              }

              // Sound + Roar notification
              if (enemy.bearTimer === 12) {
                sfx.playShoot();
                floatingTexts.push({
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y - 18,
                  text: "GRRRRROOOOOOOOAAAAAAARRR!! 🐻",
                  color: '#EF4444',
                  life: 60
                });
              }

              if (enemy.bearTimer > 45) {
                enemy.bearState = 'charge_dash';
                enemy.bearTimer = 0;
                // Dash aggressively towards David
                const targetDir = player.x < enemy.x ? -1 : 1;
                enemy.vx = targetDir * 8.5; // High speed charge!
              }
            } else if (enemy.bearState === 'charge_dash') {
              // Emitting velocity speed lines
              if (Math.random() < 0.45) {
                particles.push({
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y + enemy.height / 2 + (Math.random() * 30 - 15),
                  vx: -enemy.vx * 0.35,
                  vy: (Math.random() - 0.5) * 1.5,
                  radius: Math.random() * 2.5 + 1.2,
                  color: 'rgba(255, 255, 255, 0.45)',
                  life: 18
                });
              }

              // Revert to walk on hit boundaries or time elapsed
              if (enemy.bearTimer > 65 || (enemy.vx < 0 && enemy.x < 1205) || (enemy.vx > 0 && enemy.x + enemy.width > 2155)) {
                enemy.bearState = 'walk';
                enemy.bearTimer = 0;
                enemy.vx = player.x < enemy.x ? -1.35 : 1.35;

                // Shake ground landing notification
                sfx.playHit();
                floatingTexts.push({
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y - 15,
                  text: "*STOMP*",
                  color: '#F97316',
                  life: 30
                });
              }
            } else if (enemy.bearState === 'swipe_prep') {
              // Stand high on hind legs
              enemy.vx = 0;
              if (enemy.bearTimer > 40) {
                enemy.bearState = 'swipe_slam';
                enemy.bearTimer = 0;
              }
            } else if (enemy.bearState === 'swipe_slam') {
              // Slam claws down to create massive ground shockwave
              if (enemy.bearTimer === 1) {
                sfx.playHit();
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height, '#F59E0B', 32);

                // Ground dust expansion
                for (let i = 0; i < 15; i++) {
                  particles.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height,
                    vx: (Math.random() - 0.5) * 12.0,
                    vy: -Math.random() * 3.8,
                    radius: Math.random() * 4 + 2,
                    color: '#64748B',
                    life: 25
                  });
                }

                // Area ground shockwave damage: within 220px on the ground
                const distToPlayer = Math.abs((enemy.x + enemy.width / 2) - (player.x + player.width / 2));
                const playerOnGround = player.y + player.height >= 340; // Ground line approx
                if (distToPlayer < 220 && playerOnGround && player.invincibilityFrames === 0) {
                  player.vy = -8.5; // launch David!
                  player.vx = player.x < enemy.x ? -7 : 7; // knockback!
                  player.invincibilityFrames = 45;

                  floatingTexts.push({
                    x: player.x,
                    y: player.y - 15,
                    text: "GOLPE DE PATAS! 🐾",
                    color: '#EF4444',
                    life: 45
                  });
                }
              }

              if (enemy.bearTimer > 25) {
                enemy.bearState = 'walk';
                enemy.bearTimer = 0;
              }
            } else if (enemy.bearState === 'roar_sonic') {
              // Roaring sonic rings!
              enemy.vx = 0;

              // Periodic sonic ring emit waves during the roar
              if (enemy.bearTimer % 12 === 1 && enemy.bearTimer < 60) {
                sfx.playShoot();
                
                // Shake the general scene for the sonic wave emission
                cameraShakeTimer = 18;
                cameraShakeIntensity = 8;

                const facingLeftDir = player.x < enemy.x ? -1 : 1;
                const emitterX = enemy.x + (facingLeftDir === -1 ? 0 : enemy.width);
                const emitterY = enemy.y + enemy.height * 0.35; // Throat coordinate height approx

                // Sonic Rings Visual Particles
                for (let i = 0; i < 4; i++) {
                  particles.push({
                    x: emitterX,
                    y: emitterY,
                    vx: facingLeftDir * (5.5 + i * 0.8),
                    vy: (Math.random() - 0.5) * 1.5,
                    radius: 7 + i * 4.5,
                    color: 'rgba(56, 189, 248, 0.3)',
                    life: 30
                  });
                }

                // Check direct hit pushback within 320px
                const distToPlayerX = Math.abs((player.x + player.width / 2) - emitterX);
                const matchingHeight = Math.abs(player.y - emitterY) < 140;
                if (distToPlayerX < 320 && matchingHeight && player.invincibilityFrames === 0) {
                  player.vx = facingLeftDir * 12.5; // Heavy cinematic pushback!
                  player.vy = -4.0;                  // Slight lift
                  player.stunTimer = 45;             // Apply brief stun control lock
                  player.invincibilityFrames = 40;

                  // Trigger intense camera shake upon getting blasted by the roar
                  cameraShakeTimer = 25;
                  cameraShakeIntensity = 18;

                  floatingTexts.push({
                    x: player.x,
                    y: player.y - 15,
                    text: "TONTEADO! 💫 STUNNED!",
                    color: '#FBBF24',
                    life: 45
                  });

                  // Spawn sparkly yellow head particles
                  for (let j = 0; j < 8; j++) {
                    particles.push({
                      x: player.x + player.width / 2,
                      y: player.y,
                      vx: (Math.random() - 0.5) * 5,
                      vy: -Math.random() * 3 - 1,
                      radius: Math.random() * 2 + 1.5,
                      color: '#FBBF24',
                      life: 40
                    });
                  }
                }
              }

              if (enemy.bearTimer > 70) {
                enemy.bearState = 'walk';
                enemy.bearTimer = 0;
              }
            }
          } else if (enemy.type === 'lion') {
            // Setup base state
            if (!enemy.lionState) {
              enemy.lionState = 'walk';
              enemy.lionTimer = 0;
            }

            enemy.lionTimer = (enemy.lionTimer || 0) + 1;

            // Fury Mode check: When health is <= 35% of max HP
            const isFury = enemy.hp <= enemy.maxHp * 0.35;
            
            // Fury visual feedback particles
            if (isFury && Math.random() < 0.35) {
              // Glowing red/gold sparks rise from his majestic mane
              particles.push({
                x: enemy.x + Math.random() * enemy.width,
                y: enemy.y + enemy.height * 0.2 + Math.random() * (enemy.height * 0.6),
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 4 - 1.5,
                radius: Math.random() * 3 + 2,
                color: Math.random() < 0.6 ? '#EF4444' : '#FBBF24', // Red-orange fury fire
                life: 25
              });
            }

            // Speed multiplier in Fury Mode
            const speedMultiplier = isFury ? 1.6 : 1.0;

            // Keep the lion within the Phase 3 arena securely to prevent him from ever falling into Pit 2 (x < 2340) or getting stuck
            if (enemy.x < 2360) {
              enemy.x = 2360;
              if (enemy.vx < 0) enemy.vx = Math.abs(enemy.vx);
            }
            if (enemy.x + enemy.width > 3180) {
              enemy.x = 3180 - enemy.width;
              if (enemy.vx > 0) enemy.vx = -Math.abs(enemy.vx);
            }

            // State Machine
            if (enemy.lionState === 'walk') {
              // Majestic patrol pacing when player is far, otherwise chase player
              const dxToPlayer = player.x - enemy.x;
              const chaseRange = 550; // if player is within 550px, chase David!
              if (Math.abs(dxToPlayer) > chaseRange) {
                // Patrol mode: pace between left and right platform limits
                if (!enemy.patrolaDirection) {
                  enemy.patrolaDirection = -1; // walk left first
                }
                if (enemy.x <= 2390) {
                  enemy.patrolaDirection = 1; // turn right
                } else if (enemy.x + enemy.width >= 3200) {
                  enemy.patrolaDirection = -1; // turn left
                }
                enemy.vx = enemy.patrolaDirection * 1.35 * speedMultiplier;
              } else {
                // Chase David mode!
                const targetDir = player.x < enemy.x ? -1 : 1;
                enemy.vx = targetDir * 1.95 * speedMultiplier;
                // Sync patrol direction to facing direction
                enemy.patrolaDirection = targetDir;
              }

              // Randomly jump over small rocks/obstacles if close to them or to chase David
              if (enemy.lionTimer % 50 === 0 && Math.random() < 0.45 && enemy.vy === 0) {
                // If David is high up or if there's an obstacle ahead, let's jump
                const distToPlayerY = player.y - enemy.y;
                if (distToPlayerY < -50 || Math.random() < 0.3) {
                  enemy.vy = -6.5; // hopping platform jump
                }
              }

              // After 130 walk ticks, execute a powerful final campaign boss attack!
              if (enemy.lionTimer > 130) {
                enemy.lionTimer = 0;
                const rng = Math.random();
                if (rng < 0.35) {
                  enemy.lionState = 'charge_roar'; // Attack 1: Majestic Sonor/Flame Roar prep
                  enemy.vx = 0;
                } else if (rng < 0.70) {
                  enemy.lionState = 'charge_dash'; // Attack 2: High velocity pounce/charge sweep
                  enemy.vx = 0;
                } else {
                  enemy.lionState = 'jump_prep'; // Attack 3: Gigantic leap target landing slam
                  enemy.vx = 0;
                }
              }
            } else if (enemy.lionState === 'charge_roar') {
              // Growl/shaking build up, gathering intense energy
              enemy.vx = 0;
              
              // Spawn fiery embers gathering into his mane representing ultimate fire roar prep
              if (Math.random() < 0.65) {
                particles.push({
                  x: enemy.x + (player.x < enemy.x ? 15 : enemy.width - 15),
                  y: enemy.y + enemy.height * 0.35 + (Math.random() * 30 - 15),
                  vx: (player.x < enemy.x ? -1 : 1) * (Math.random() * 3 + 2),
                  vy: (Math.random() - 0.5) * 4,
                  radius: Math.random() * 4 + 2,
                  color: Math.random() < 0.6 ? '#F59E0B' : '#EF4444',
                  life: 20
                });
              }

              if (enemy.lionTimer === 15) {
                sfx.playShoot();
                floatingTexts.push({
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y - 25,
                  text: "ROOOOOAAAAAAARRRRR!!! 🦁🔥",
                  color: '#EF4444',
                  life: 60
                });
              }

              // Periodic fire shockwaves and sonic rings!
              if (enemy.lionTimer > 40) {
                sfx.playShoot();
                
                // Maximum Screen Shake on Roar!
                cameraShakeTimer = 35;
                cameraShakeIntensity = isFury ? 22 : 15;

                const facingLeftDir = player.x < enemy.x ? -1 : 1;
                const emitterX = enemy.x + (facingLeftDir === -1 ? 0 : enemy.width);
                const emitterY = enemy.y + enemy.height * 0.35; // Throat level

                // Play custom explosion animation on the mouth 
                createExplosion(emitterX, emitterY, '#EF4444', 35);

                // Sonic and Fire wave particles
                for (let i = 0; i < 6; i++) {
                  particles.push({
                    x: emitterX,
                    y: emitterY,
                    vx: facingLeftDir * (7.5 + i * 1.5) * speedMultiplier,
                    vy: (Math.random() - 0.5) * 3.5,
                    radius: 8 + i * 6.5,
                    color: Math.random() < 0.55 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(251, 191, 36, 0.4)',
                    life: 30
                  });
                }

                // Check direct hit pushback and STUN within 420px range of sonic waves
                const distToPlayerX = Math.abs((player.x + player.width / 2) - emitterX);
                const matchingHeight = Math.abs(player.y - emitterY) < 180;
                
                if (distToPlayerX < 420 && matchingHeight && player.invincibilityFrames === 0) {
                  // Massive kinematic pushback
                  player.vx = facingLeftDir * (isFury ? 15.5 : 12.0);
                  player.vy = -5.5; // lifted up slightly
                  player.stunTimer = isFury ? 65 : 45; // Stun control lock
                  player.invincibilityFrames = 42;

                  floatingTexts.push({
                    x: player.x,
                    y: player.y - 15,
                    text: "ATORDOADO! 😵 UNABLE TO MOVE!",
                    color: '#FEF08A',
                    life: 50
                  });

                  // Spawn gold dizzy stars around David's head
                  for (let j = 0; j < 12; j++) {
                    particles.push({
                      x: player.x + player.width / 2,
                      y: player.y,
                      vx: (Math.random() - 0.5) * 6,
                      vy: -Math.random() * 4 - 1,
                      radius: Math.random() * 2.5 + 1.5,
                      color: '#FBBF24',
                      life: 45
                    });
                  }
                }

                enemy.lionState = 'walk';
                enemy.lionTimer = 0;
              }
            } else if (enemy.lionState === 'charge_dash') {
              // High speed running charge visual indicators
              const targetDir = player.x < enemy.x ? -1 : 1;
              enemy.vx = targetDir * 9.5 * speedMultiplier;

              // Emit blazing fire footprints and dash lines
              if (Math.random() < 0.7) {
                particles.push({
                  x: enemy.x + Math.random() * enemy.width,
                  y: enemy.y + enemy.height - Math.random() * 15,
                  vx: -enemy.vx * 0.25,
                  vy: -Math.random() * 2,
                  radius: Math.random() * 3 + 1,
                  color: Math.random() < 0.5 ? '#F97316' : '#EF4444',
                  life: 20
                });
              }

              // Subdued roar warning text on dash start
              if (enemy.lionTimer === 1) {
                sfx.playShoot();
                floatingTexts.push({
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y - 20,
                  text: "INVESTIDA! 🦁💫",
                  color: '#F97316',
                  life: 30
                });
              }

              // Return to walk after 55 ticks or if hit boundaries
              if (enemy.lionTimer > 55 || enemy.x <= 2360 || enemy.x + enemy.width >= 3175) {
                enemy.lionState = 'walk';
                enemy.lionTimer = 0;
                enemy.vx = player.x < enemy.x ? -1.85 : 1.85;
                sfx.playHit();
              }
            } else if (enemy.lionState === 'jump_prep') {
              // Crouching low preparing for a massive sky jump
              enemy.vx = 0;
              if (Math.random() < 0.4) {
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height, '#F59E0B', 4);
              }

              if (enemy.lionTimer > 25) {
                enemy.lionState = 'jump_air';
                enemy.lionTimer = 0;
                // Target a ground coordinate clamped strictly within the safe platform range to avoid leaps falling into holes
                const safeTargetX = Math.max(2430, Math.min(3130, player.x));
                const dx = safeTargetX - enemy.x;
                const facingDir = dx < 0 ? -1 : 1;
                enemy.vy = -12.5; // High vertical launch
                enemy.vx = facingDir * (4.2 + Math.abs(dx) * 0.0032) * speedMultiplier; // proportional target speed

                sfx.playShoot();
                floatingTexts.push({
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y - 20,
                  text: "SALTO MAJESTOSO! 🌪️",
                  color: '#EF4444',
                  life: 40
                });
              }
            } else if (enemy.lionState === 'jump_air') {
              // Emitting wind currents trailing down in the air
              if (Math.random() < 0.5) {
                particles.push({
                  x: enemy.x + enemy.width / 2,
                  y: enemy.y + enemy.height / 2,
                  vx: (Math.random() - 0.5) * 2,
                  vy: -enemy.vy * 0.25,
                  radius: Math.random() * 3 + 1.5,
                  color: 'rgba(251, 146, 60, 0.5)',
                  life: 15
                });
              }

              // Check if landed on ground platform
              const onGround = enemy.vy === 0; // standing platform collision handler did this
              if (onGround && enemy.lionTimer > 10) {
                enemy.lionState = 'walk';
                enemy.lionTimer = 0;
                enemy.vx = player.x < enemy.x ? -1.85 : 1.85;

                // Massive Ground slam shockwave!
                sfx.playHit();
                
                cameraShakeTimer = 30;
                cameraShakeIntensity = isFury ? 25 : 16;

                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height, '#EF4444', 45);

                // Ground dust expansion on landing
                for (let k = 0; k < 25; k++) {
                  particles.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height,
                    vx: (Math.random() - 0.5) * 16.0,
                    vy: -Math.random() * 5.0,
                    radius: Math.random() * 5 + 2,
                    color: Math.random() < 0.5 ? '#78716C' : '#9A3412',
                    life: 30
                  });
                }

                // Ground smash shockwave damage and launch for David
                const distToPlayer = Math.abs((enemy.x + enemy.width / 2) - (player.x + player.width / 2));
                const playerOnGround = player.y + player.height >= 340;
                if (distToPlayer < 260 && playerOnGround && player.invincibilityFrames === 0) {
                  player.vy = -10.5; // High vertical launch
                  player.vx = player.x < enemy.x ? -7.5 : 7.5; // Knockback
                  player.stunTimer = isFury ? 55 : 35; // Stun
                  player.invincibilityFrames = 45;

                  floatingTexts.push({
                    x: player.x,
                    y: player.y - 15,
                    text: "TREMOR DE TERRA! 💥🐾",
                    color: '#EF4444',
                    life: 45
                  });
                }
              }
            }
          }
        }

        // Check weapon collisions (Stones vs Enemies)
        stones.forEach(stone => {
          if (!stone.active) return;
          if (
            stone.x > enemy.x && stone.x < enemy.x + enemy.width &&
            stone.y > enemy.y && stone.y < enemy.y + enemy.height
          ) {
            stone.active = false;
            enemy.hp -= stone.damage;
            sfx.playHit();
            createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.isBoss ? '#EF4444' : '#E2E8F0', 12);
            
            // Add custom particle feedback specifically when hitting the giant wolf boss
            if (enemy.isBoss && enemy.type === 'wolf') {
              for (let i = 0; i < 22; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.8 + Math.random() * 4.5;
                particles.push({
                  x: stone.x,
                  y: stone.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed - 1.2,
                  radius: Math.random() * 3 + 2,
                  color: Math.random() < 0.4 ? '#475569' : Math.random() < 0.75 ? '#EF4444' : '#FBBF24',
                  life: 25 + Math.floor(Math.random() * 20)
                });
              }
            }
            
            // Random damage labels
            const dmgTextChoices = ["-10", "-15", "-20"];
            const dmgText = dmgTextChoices[Math.floor(Math.random() * dmgTextChoices.length)];
            floatingTexts.push({
              x: enemy.x + enemy.width/2,
              y: enemy.y - 6,
              text: dmgText,
              color: enemy.isBoss ? '#EF4444' : '#F59E0B',
              life: 45
            });

            // Score feedback
            localScore += 20;
            setScore(localScore);

            if (enemy.hp <= 0) {
              createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#F59E0B', 25);
              
              if (enemy.isBoss) {
                // Complete game phase!
                setBossHp(0);
                setTimeout(() => {
                  localGameResult = 'won';
                  setGameResult('won');
                  onFaseCompleted();
                }, 1000);
              } else {
                localCoins += Math.random() < 0.4 ? 2 : 1;
                setPhaseCoins(localCoins);
              }
            } else if (enemy.isBoss) {
              setBossHp(enemy.hp);
            }
          }
        });

        // 🌟 RETRO MARIO JUMPING HIT-STOMP ATTACK DEFEAT MECHANICAL ENGINE 🌟
        const isStomping = player.vy > 0 &&
          player.y + player.height - player.vy <= enemy.y + 12 &&
          player.y + player.height >= enemy.y &&
          player.x + player.width > enemy.x &&
          player.x < enemy.x + enemy.width;

        if (isStomping && !enemy.isBoss && player.invincibilityFrames === 0) {
          player.vy = -7.5; // high bounce leap
          sfx.playJump();
          enemy.hp -= 1;
          createExplosion(enemy.x + enemy.width/2, enemy.y, '#3B82F6', 15);

          floatingTexts.push({
            x: enemy.x + enemy.width/2,
            y: enemy.y - 12,
            text: "💥 PULO STOMP! +100",
            color: '#60A5FA',
            life: 40
          });

          localScore += 100;
          setScore(localScore);

          if (enemy.hp <= 0) {
            createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#F59E0B', 20);
            localCoins += Math.random() < 0.5 ? 2 : 1;
            setPhaseCoins(localCoins);
          }
        }

        // Enemy physically attacking David
        const collidesWithPlayer = player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height && player.y + player.height > enemy.y;

        if (collidesWithPlayer && !isStomping) {
          if (player.invincibilityFrames === 0) {
            player.invincibilityFrames = 45; // 0.75 seconds invulnerable
            sfx.playHurt();
            setPlayerHp2D(prev => {
              const newVal = prev - 1;
              if (newVal <= 0) {
                // David lost raw lives
                localGameResult = 'lost';
                setGameResult('lost');
              }
              return newVal;
            });
            createExplosion(player.x + player.width/2, player.y + player.height/2, '#EF4444', 15);
          }
        }

        // Turning minion enemies around on edges of platforms or walls
        if (!enemy.isBoss) {
          if (enemy.x < 15) {
            enemy.vx = Math.abs(enemy.vx);
          }
          if (enemy.x > levelWidth - enemy.width - 15) {
            enemy.vx = -Math.abs(enemy.vx);
          }
        }

        // Enemy reaching sheep boundaries on far left pasture
        if (enemy.x < 20) {
          enemy.vx = 3.0; // returns back cozier
          createExplosion(enemy.x, enemy.y, '#FFFFFF', 5);
          if (Math.random() < 0.15) {
            sfx.playHurt();
          }
        }
      });

      // Filter out dead enemies
      enemies = enemies.filter(enemy => enemy.hp > 0 && enemy.x > -100 && enemy.x < levelWidth + 200);

      // Update particle lifespans
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
      });
      particles = particles.filter(p => p.life > 0);
      } // End of conditional pause block

      // --- RENDERING CANVAS DRAWINGS ---
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, 800, 400);

      // 1. SKY GRADIENT BACKGROUND MAPPING (High-End Triple Gradient / Atmosphere)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 400);
      if (activeFase === 1) {
        bgGrad.addColorStop(0, '#0369A1'); // Rich Morning Blue
        bgGrad.addColorStop(0.5, '#38BDF8'); // Bright Sky Highlight
        bgGrad.addColorStop(1, '#BAE6FD'); // Warm horizon
      } else if (activeFase === 2) {
        bgGrad.addColorStop(0, '#050B14'); // Pitch Dark Midnight Blue
        bgGrad.addColorStop(0.6, '#0B132B'); // Mysterious Teal-Indigo Depth
        bgGrad.addColorStop(1, '#1C2541'); // Misty Horizon Accent
      } else {
        bgGrad.addColorStop(0, '#4C0519'); // Deep Savage Maroon
        bgGrad.addColorStop(0.4, '#B91C1C'); // Roaring Crimson Sunset
        bgGrad.addColorStop(1, '#FBBF24'); // Golden Horizon Flame
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 400);

      // Calculate dynamic camera shake offsets
      let shakeX = 0;
      let shakeY = 0;
      if (cameraShakeTimer > 0) {
        shakeX = (Math.random() - 0.5) * cameraShakeIntensity;
        shakeY = (Math.random() - 0.5) * cameraShakeIntensity;
      }

      // --- HIGH RESOLUTION SCENIC PARALLAX LAYERS ---
      
      // LAYER 1: CELESTIAL ELEMENTS (Sun / Moon / Twinkling Stars in deep parallax)
      ctx.save();
      ctx.translate(-cameraX * 0.03 + shakeX * 0.15, shakeY * 0.15);
      
      if (activeFase === 1) {
        // --- Day Sun with Radiating Solar Flares ---
        ctx.save();
        const sunX = 580;
        const sunY = 75;
        // Radial atmospheric lens glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 70);
        sunGlow.addColorStop(0, '#FFFFFF');
        sunGlow.addColorStop(0.2, '#FEF08A');
        sunGlow.addColorStop(0.5, 'rgba(253, 224, 71, 0.25)');
        sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
        ctx.fill();
        
        // Crisp sun body
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
      } else if (activeFase === 2) {
        // --- Cosmic Celestial Aurora Borealis (Ethereal Night Atmosphere) ---
        ctx.save();
        const auroraTime = Date.now() * 0.0006;
        for (let j = 0; j < 2.3; j++) {
          const color = j === 0 ? 'rgba(16, 185, 129, 0.06)' : 'rgba(6, 182, 212, 0.04)';
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(-100, 0);
          for (let x = -100; x <= 950; x += 50) {
            const wave1 = Math.sin(x * 0.003 + auroraTime + j * 1.5) * 28;
            const wave2 = Math.cos(x * 0.0075 - auroraTime * 0.7) * 14;
            ctx.lineTo(x, 110 + wave1 + wave2 + j * 15);
          }
          ctx.lineTo(950, 0);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // --- Deep Space Nebula Glow Cluster (Pink/Indigo atmospheric mist) ---
        ctx.save();
        const nebulaGrad = ctx.createRadialGradient(280, 80, 20, 280, 80, 160);
        nebulaGrad.addColorStop(0, 'rgba(139, 92, 246, 0.12)'); // soft violet
        nebulaGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.04)'); // soft pink
        nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebulaGrad;
        ctx.beginPath();
        ctx.arc(280, 80, 160, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // --- Feral Forest Twinkling Stars Map ---
        const starSeed = [
          { x: 50, y: 30, r: 1.5 }, { x: 120, y: 65, r: 1.0 }, { x: 260, y: 25, r: 1.8 },
          { x: 380, y: 75, r: 1.2 }, { x: 490, y: 40, r: 2.0 }, { x: 670, y: 55, r: 1.1 },
          { x: 740, y: 20, r: 1.6 }, { x: 880, y: 80, r: 1.3 }, { x: 920, y: 35, r: 1.9 },
          { x: 1100, y: 60, r: 1.5 }, { x: 1250, y: 25, r: 1.2 }, { x: 1400, y: 70, r: 1.7 }
        ];
        starSeed.forEach((star, index) => {
          const twinkle = Math.sin((Date.now() / 240) + index * 4.5) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(254, 240, 138, ${twinkle})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // --- Luminous Majestic Full Moon with Layered Halo Atmospheric Glow ---
        ctx.save();
        const moonX = 540;
        const moonY = 80;
        
        // Large outer glowing mist halo
        const outerHalo = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 110);
        outerHalo.addColorStop(0, 'rgba(254, 240, 138, 0.50)');
        outerHalo.addColorStop(0.3, 'rgba(254, 240, 138, 0.25)');
        outerHalo.addColorStop(0.6, 'rgba(147, 197, 253, 0.12)');
        outerHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = outerHalo;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 110, 0, Math.PI * 2);
        ctx.fill();

        // Secondary tight glow corona
        ctx.shadowBlur = 55;
        ctx.shadowColor = 'rgba(254, 240, 138, 0.85)';
        ctx.fillStyle = '#FFFDE3'; // Soft golden moon butter glow
        ctx.beginPath();
        ctx.arc(moonX, moonY, 44, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadows

        // Beautiful lunar texture crater overlays
        ctx.fillStyle = 'rgba(217, 119, 6, 0.18)';
        // Crater Tycho-style rays radiating
        ctx.beginPath();
        ctx.arc(moonX - 12, moonY - 14, 8, 0, Math.PI * 2);
        ctx.arc(moonX + 16, moonY + 12, 6.5, 0, Math.PI * 2);
        ctx.arc(moonX - 15, moonY + 14, 4.5, 0, Math.PI * 2);
        ctx.arc(moonX + 2, moonY - 24, 5, 0, Math.PI * 2);
        ctx.fill();

        // Moonlight subtle cloud passing right in front
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.ellipse(moonX - 10, moonY + 15, 60, 12, 0, 0, Math.PI * 2);
        ctx.ellipse(moonX + 30, moonY - 5, 45, 8, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Draw elegant Spooky Pine branch silhouettes crossing near the Moon for deep forest atmosphere
        ctx.fillStyle = 'rgba(4, 7, 16, 0.85)';
        ctx.beginPath();
        ctx.moveTo(moonX - 60, moonY + 40);
        ctx.quadraticCurveTo(moonX - 10, moonY + 20, moonX + 30, moonY + 35);
        ctx.lineTo(moonX + 25, moonY + 38);
        ctx.quadraticCurveTo(moonX - 10, moonY + 25, moonX - 60, moonY + 48);
        ctx.closePath();
        ctx.fill();

        // Pine needles on the branch structure
        ctx.strokeStyle = 'rgba(4, 7, 16, 0.9)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let k = -50; k <= 25; k += 6) {
          const bx = moonX + k;
          const by = moonY + 30 + Math.sin(k * 0.05) * 5;
          ctx.moveTo(bx, by);
          ctx.lineTo(bx - 4, by + 12);
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + 3, by + 14);
        }
        ctx.stroke();

        ctx.restore();

      } else {
        // --- Savage Crimson Setting Sun ---
        ctx.save();
        const sunsetX = 480;
        const sunsetY = 120;
        // Deep lens compression
        const sunsetGlow = ctx.createRadialGradient(sunsetX, sunsetY, 15, sunsetX, sunsetY, 100);
        sunsetGlow.addColorStop(0, '#FFFFFF');
        sunsetGlow.addColorStop(0.3, '#F59E0B');
        sunsetGlow.addColorStop(0.7, 'rgba(239, 68, 68, 0.35)');
        sunsetGlow.addColorStop(1, 'rgba(124, 45, 18, 0)');
        ctx.fillStyle = sunsetGlow;
        ctx.beginPath();
        ctx.arc(sunsetX, sunsetY, 100, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // LAYER 2: MOUNTAIN / CANYON SILHOUETTES & HIGH RESOLUTION CLOUDS (Parallax: 0.10)
      ctx.save();
      ctx.translate(-cameraX * 0.10 + shakeX * 0.35, shakeY * 0.35);

      if (activeFase === 1) {
        // --- Daytime Puffy 3D Volumetric Clouds ---
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        const cloudSpawns = [
          { x: 120, y: 70, size: 30 }, { x: 160, y: 55, size: 45 }, { x: 210, y: 65, size: 35 },
          { x: 900, y: 80, size: 40 }, { x: 955, y: 65, size: 55 }, { x: 1010, y: 75, size: 38 },
          { x: 1700, y: 60, size: 42 }, { x: 1750, y: 45, size: 60 }, { x: 1810, y: 55, size: 40 }
        ];
        // Render stacked 3D clouds
        cloudSpawns.forEach(c => {
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
          ctx.fill();
          // Draw a small darker soft shadow underneath each cloud segment
          ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
          ctx.beginPath();
          ctx.arc(c.x, c.y + 3, c.size * 0.96, 0.2, Math.PI - 0.2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        });
        
        // --- Remote silhouetted green-blue mountains ---
        ctx.fillStyle = '#0F766E'; // Deep turquoise mountains
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.moveTo(0, 310);
        ctx.quadraticCurveTo(150, 180, 420, 310);
        ctx.quadraticCurveTo(600, 140, 950, 310);
        ctx.quadraticCurveTo(1250, 200, 1550, 310);
        ctx.quadraticCurveTo(1850, 160, 2200, 310);
        ctx.lineTo(2400, 310);
        ctx.lineTo(2400, 400);
        ctx.lineTo(0, 400);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;

      } else if (activeFase === 2) {
        // --- Layered Misty Night Mountain Ranges ---
        
        // Pass 1: Far range (lighter silhouette)
        ctx.fillStyle = '#111625';
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(-50, 310);
        ctx.lineTo(80, 160);
        ctx.lineTo(250, 220);
        ctx.lineTo(460, 110); // Massive giant peak
        ctx.lineTo(680, 215);
        ctx.lineTo(900, 140);
        ctx.lineTo(1100, 200);
        ctx.lineTo(1350, 100);
        ctx.lineTo(1600, 220);
        ctx.lineTo(1850, 135);
        ctx.lineTo(2100, 190);
        ctx.lineTo(2300, 150);
        ctx.lineTo(2500, 310);
        ctx.lineTo(2500, 400);
        ctx.lineTo(-50, 400);
        ctx.closePath();
        ctx.fill();

        // Pass 2: Closer, sharper peaks (darker navy silhouette)
        ctx.fillStyle = '#090D1A';
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.moveTo(-50, 310);
        ctx.lineTo(130, 220);
        ctx.lineTo(310, 260);
        ctx.lineTo(540, 175); // majestic center peak
        ctx.lineTo(760, 255);
        ctx.lineTo(1000, 200);
        ctx.lineTo(1220, 250);
        ctx.lineTo(1470, 165);
        ctx.lineTo(1720, 270);
        ctx.lineTo(1980, 195);
        ctx.lineTo(2250, 245);
        ctx.lineTo(2410, 210);
        ctx.lineTo(2500, 310);
        ctx.lineTo(2500, 400);
        ctx.lineTo(-50, 400);
        ctx.closePath();
        ctx.fill();

        // Highly-polished majestic moonlight rim light highlighting the cold mountain ridges
        ctx.strokeStyle = '#93C5FD'; // Silver-blue moonlight rim
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Extra glowing golden peak tips
        ctx.save();
        ctx.fillStyle = '#FEF08A';
        ctx.globalAlpha = 0.5;
        const peaks = [
          { x: 130, y: 220 }, { x: 540, y: 175 }, { x: 1000, y: 200 },
          { x: 1470, y: 165 }, { x: 1980, y: 195 }, { x: 2410, y: 210 }
        ];
        peaks.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
        ctx.globalAlpha = 1.0;

      } else {
        // --- Savage Sunset Desert Canyon Cliffs (Mesas) ---
        ctx.fillStyle = '#1A0503';
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.moveTo(-50, 320);
        // Mesa flat towers
        ctx.lineTo(80, 320);
        ctx.lineTo(85, 200);   // tower 1
        ctx.lineTo(190, 200);
        ctx.lineTo(195, 320);
        ctx.lineTo(380, 320);
        ctx.lineTo(410, 160);  // volcano crest style
        ctx.lineTo(480, 160);
        ctx.lineTo(510, 320);
        ctx.lineTo(750, 320);
        ctx.lineTo(760, 185);  // tower 2
        ctx.lineTo(880, 185);
        ctx.lineTo(895, 320);
        ctx.lineTo(1300, 320);
        ctx.lineTo(1320, 150); // huge peak
        ctx.lineTo(1420, 150);
        ctx.lineTo(1440, 320);
        ctx.lineTo(2500, 320);
        ctx.lineTo(2500, 400);
        ctx.lineTo(-50, 400);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // --- Gliding Silhouetted Canyon Eagles ---
        ctx.save();
        ctx.fillStyle = '#1A0503';
        const birdTime = Date.now() * 0.0016;
        const birds = [
          { x: 180 + (birdTime * 22) % 650, y: 70 + Math.sin(birdTime) * 12 },
          { x: 920 - (birdTime * 18) % 550, y: 55 + Math.cos(birdTime * 0.8) * 8 }
        ];
        birds.forEach(b => {
          const flap = Math.sin(birdTime * 6) * 4.5;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.quadraticCurveTo(b.x - 7, b.y - flap - 3, b.x - 18, b.y - flap);
          ctx.quadraticCurveTo(b.x - 3, b.y + 1, b.x, b.y + 3);
          ctx.quadraticCurveTo(b.x + 3, b.y + 1, b.x + 18, b.y - flap);
          ctx.quadraticCurveTo(b.x + 7, b.y - flap - 3, b.x, b.y);
          ctx.closePath();
          ctx.fill();
        });
        ctx.restore();
      }
      ctx.restore();

      // LAYER 3: MIDGROUND SCENE DECOR (Pine Forests / Foothills, Parallax: 0.22)
      ctx.save();
      ctx.translate(-cameraX * 0.22 + shakeX * 0.55, shakeY * 0.55);

      if (activeFase === 1) {
        // --- Rolling Foothills Pasture Layer ---
        ctx.fillStyle = '#0D9488'; // soft teal-green foothill pasture
        ctx.beginPath();
        ctx.moveTo(0, 320);
        ctx.bezierCurveTo(400, 240, 800, 360, 1200, 300);
        ctx.bezierCurveTo(1600, 240, 2000, 360, 2400, 320);
        ctx.lineTo(2400, 400);
        ctx.lineTo(0, 400);
        ctx.closePath();
        ctx.fill();

        // Distant Pastoral Trees group
        ctx.fillStyle = '#065F46'; // forest green
        const treeLocs = [220, 580, 850, 1120, 1500, 1880];
        treeLocs.forEach(tx => {
          ctx.beginPath();
          ctx.arc(tx, 290, 12, 0, Math.PI * 2);
          ctx.arc(tx - 6, 295, 10, 0, Math.PI * 2);
          ctx.arc(tx + 6, 295, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(tx - 2, 295, 4, 18); // trunk
        });

      } else if (activeFase === 2) {
        // --- High-Fidelity Layered Parallax Pine Forest ---
        const renderPine = (px: number, h: number, w: number, color: string) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(px, 325 - h);
          ctx.lineTo(px - w * 0.4, 325 - h * 0.65);
          ctx.lineTo(px - w * 0.2, 325 - h * 0.67);
          ctx.lineTo(px - w * 0.7, 325 - h * 0.35);
          ctx.lineTo(px - w * 0.3, 315 - h * 0.38);
          ctx.lineTo(px - w, 325);
          ctx.lineTo(px + w, 325);
          ctx.lineTo(px + w * 0.3, 315 - h * 0.38);
          ctx.lineTo(px + w * 0.7, 325 - h * 0.35);
          ctx.lineTo(px + w * 0.2, 325 - h * 0.67);
          ctx.lineTo(px + w * 0.4, 325 - h * 0.65);
          ctx.closePath();
          ctx.fill();

          // Quick draw for the tree trunks
          ctx.fillStyle = '#010307';
          ctx.fillRect(px - 2.5, 325, 5, h * 0.12);
        };

        // Far background pine layer (lighter atmospheric blue-teal)
        const farPines = [
          { x: 10, h: 90, w: 22 }, { x: 50, h: 70, w: 18 }, { x: 100, h: 100, w: 24 },
          { x: 200, h: 80, w: 20 }, { x: 260, h: 105, w: 25 }, { x: 380, h: 85, w: 21 },
          { x: 490, h: 95, w: 23 }, { x: 570, h: 110, w: 26 }, { x: 740, h: 80, w: 19 },
          { x: 920, h: 100, w: 24 }, { x: 1120, h: 90, w: 22 }, { x: 1300, h: 105, w: 25 },
          { x: 1510, h: 115, w: 27 }, { x: 1720, h: 85, w: 20 }, { x: 2020, h: 100, w: 24 }
        ];
        farPines.forEach(pt => {
          renderPine(pt.x, pt.h, pt.w, '#0A1224');
        });

        // Near background pine layer (dense, deep velvet-black silhouette)
        const nearPines = [
          { x: 30, h: 125, w: 29 }, { x: 75, h: 90, w: 23 }, { x: 120, h: 145, w: 34 },
          { x: 280, h: 105, w: 26 }, { x: 320, h: 135, w: 31 }, { x: 450, h: 120, w: 28 },
          { x: 620, h: 140, w: 32 }, { x: 680, h: 95, w: 23 }, { x: 810, h: 110, w: 26 },
          { x: 860, h: 130, w: 30 }, { x: 990, h: 160, w: 36 }, { x: 1050, h: 110, w: 27 },
          { x: 1200, h: 135, w: 31 }, { x: 1450, h: 125, w: 29 }, { x: 1610, h: 155, w: 35 },
          { x: 1850, h: 105, w: 25 }, { x: 1910, h: 135, w: 31 }, { x: 2150, h: 155, w: 36 }
        ];
        nearPines.forEach(pt => {
          renderPine(pt.x, pt.h, pt.w, '#040710');
        });

      } else {
        // --- Midground Arid Red Ridges of the Canyon ---
        ctx.fillStyle = '#3F1001'; // Warm burnt umber
        ctx.beginPath();
        ctx.moveTo(0, 325);
        ctx.lineTo(120, 240);
        ctx.lineTo(290, 280);
        ctx.lineTo(440, 195);
        ctx.lineTo(600, 260);
        ctx.lineTo(850, 180);
        ctx.lineTo(1050, 275);
        ctx.lineTo(1280, 200);
        ctx.lineTo(1550, 280);
        ctx.lineTo(1850, 210);
        ctx.lineTo(2150, 290);
        ctx.lineTo(2400, 215);
        ctx.lineTo(2500, 325);
        ctx.lineTo(2500, 420);
        ctx.lineTo(0, 420);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // LAYER 4: LOW-LYING EFFECTS (Swirling Mist & Magical Fireflies, Parallax: 0.35)
      ctx.save();
      ctx.translate(-cameraX * 0.35 + shakeX * 0.75, shakeY * 0.75);

      if (activeFase === 2) {
        // --- Swirling Low-Hanging Eerie Forest Mist Wisp (Dupla Neblina) ---
        ctx.save();
        const twistTime = Date.now() * 0.0014;
        
        // Fog band 1: soft seafoam cyan
        ctx.strokeStyle = 'rgba(110, 231, 223, 0.08)';
        ctx.lineWidth = 26;
        ctx.beginPath();
        for (let i = -100; i < 2500; i += 50) {
          const yPos = 300 + Math.sin(i * 0.005 + twistTime) * 12 + Math.cos(i * 0.012 - twistTime * 0.4) * 6;
          if (i === -100) ctx.moveTo(i, yPos);
          else ctx.lineTo(i, yPos);
        }
        ctx.stroke();

        // Fog band 2: soft atmospheric white mist
        ctx.strokeStyle = 'rgba(239, 246, 255, 0.06)';
        ctx.lineWidth = 36;
        ctx.beginPath();
        for (let i = -100; i < 2500; i += 50) {
          const yPos = 310 + Math.cos(i * 0.004 - twistTime * 0.8) * 14 + Math.sin(i * 0.01 + twistTime * 0.5) * 8;
          if (i === -100) ctx.moveTo(i, yPos);
          else ctx.lineTo(i, yPos);
        }
        ctx.stroke();
        ctx.restore();

        // --- Magical Twinkling Bio-luminescent Forest Fireflies ---
        ctx.save();
        const flyTime = Date.now() * 0.0008;
        const fireflySeed = [
          { x: 80, y: 250 }, { x: 210, y: 200 }, { x: 350, y: 280 }, { x: 520, y: 190 },
          { x: 670, y: 260 }, { x: 790, y: 220 }, { x: 910, y: 270 }, { x: 1120, y: 210 },
          { x: 1280, y: 180 }, { x: 1450, y: 290 }, { x: 1680, y: 200 }, { x: 1890, y: 240 },
          { x: 2020, y: 170 }, { x: 2250, y: 280 }, { x: 2380, y: 220 }
        ];
        fireflySeed.forEach((fly, index) => {
          const oscY = Math.sin(flyTime * 3 + index * 2) * 15;
          const oscX = Math.cos(flyTime * 1.5 + index * 4) * 10;
          const alphaOsc = Math.sin(flyTime * 5 + index) * 0.45 + 0.55;
          
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#D9F99D';
          ctx.fillStyle = `rgba(217, 249, 157, ${alphaOsc})`;
          ctx.beginPath();
          ctx.arc(fly.x + oscX, fly.y + oscY, 2.0, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0; // restore
        ctx.restore();
      } else if (activeFase === 3) {
        // --- Heat Haze Distortions & Sparks for Canyon ---
        ctx.save();
        const thermalTime = Date.now() * 0.0022;
        const sparksSeed = [
          { x: 120, y: 280, s: 2.2 }, { x: 320, y: 290, s: 1.5 }, { x: 550, y: 270, s: 1.8 },
          { x: 810, y: 300, s: 2.0 }, { x: 1180, y: 285, s: 1.3 }, { x: 1510, y: 295, s: 2.4 },
          { x: 1880, y: 275, s: 1.7 }, { x: 2120, y: 290, s: 2.1 }, { x: 2350, y: 280, s: 1.6 }
        ];
        sparksSeed.forEach((spark, idx) => {
          const riseY = (thermalTime * 18 + idx * 30) % 110;
          const driftX = Math.sin(thermalTime + idx) * 8;
          ctx.fillStyle = 'rgba(251, 146, 60, 0.45)';
          ctx.beginPath();
          ctx.arc(spark.x + driftX, spark.y - riseY, spark.s, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
      ctx.restore();

      // Begin scrolling translation viewport
      ctx.save();
      ctx.translate(-cameraX + shakeX, shakeY);

      // Draw all items (coins, stars, hearts, scrolls, crystals, shields)
      items.forEach(item => {
        if (item.collected) return;
        ctx.save();
        
        const floatY = item.y + (item.isFromBlock ? 0 : item.bounceOffset);
        ctx.translate(item.x + item.width / 2, floatY + item.height / 2);

        if (item.type === 'coin') {
          const angle = (Date.now() / 150) % (Math.PI * 2);
          ctx.scale(Math.abs(Math.sin(angle)), 1);
          ctx.beginPath();
          ctx.arc(0, 0, item.width / 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FBBF24';
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 1.5;
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#92400E';
          ctx.font = '900 11px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', 0, 0);
        } else if (item.type === 'star') {
          const rot = (Date.now() / 400) % (Math.PI * 2);
          ctx.rotate(rot);
          ctx.fillStyle = '#FCD34D';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * (item.width / 2), -Math.sin((18 + i * 72) * Math.PI / 180) * (item.width / 2));
            ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (item.width / 4), -Math.sin((54 + i * 72) * Math.PI / 180) * (item.width / 4));
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (item.type === 'heart') {
          const beat = 1 + Math.sin(Date.now() / 100) * 0.1;
          ctx.scale(beat, beat);
          ctx.fillStyle = '#EF4444';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, item.height / 4);
          ctx.bezierCurveTo(item.width / 4, -item.height / 4, item.width / 2, 0, 0, item.height / 2);
          ctx.bezierCurveTo(-item.width / 2, 0, -item.width / 4, -item.height / 4, 0, item.height / 4);
          ctx.fill();
          ctx.stroke();
        } else if (item.type === 'crystal') {
          ctx.fillStyle = '#22D3EE';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -item.height / 2);
          ctx.lineTo(item.width / 2, 0);
          ctx.lineTo(0, item.height / 2);
          ctx.lineTo(-item.width / 2, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (item.type === 'scroll') {
          ctx.fillStyle = '#F3F4F6';
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 2;
          ctx.fillRect(-8, -10, 16, 20);
          ctx.fillStyle = '#D97706';
          ctx.fillRect(-11, -12, 3, 24);
          ctx.fillRect(8, -12, 3, 24);
          ctx.fillStyle = '#EF4444';
          ctx.fillRect(-8, -2, 16, 4);
        } else if (item.type === 'shield') {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.35)';
          ctx.strokeStyle = '#3BB8FE';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, item.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        
        ctx.restore();
      });

      // Platforms drawing with distinctive tiles & bouncy special bricks
      platforms.forEach(plat => {
        let bounceY = 0;
        if (plat.type === 'block' && plat.bounceTimer !== undefined && plat.bounceTimer > 0) {
          bounceY = -6 * Math.sin((plat.bounceTimer / 10) * Math.PI);
        }

        if (plat.type === 'block') {
          ctx.save();
          ctx.translate(plat.x, plat.y + bounceY);
          if (plat.hasItem) {
            const glow = Math.sin(Date.now() / 150) * 12;
            ctx.fillStyle = `rgb(${245 + glow}, ${158 + glow}, 11)`;
            ctx.strokeStyle = '#D97706';
            ctx.lineWidth = 2;
            ctx.fillRect(0, 0, plat.width, plat.height);
            ctx.strokeRect(0, 0, plat.width, plat.height);

            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 15px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', plat.width / 2, plat.height / 2);
          } else {
            ctx.fillStyle = '#78716C';
            ctx.strokeStyle = '#44403C';
            ctx.lineWidth = 2;
            ctx.fillRect(0, 0, plat.width, plat.height);
            ctx.strokeRect(0, 0, plat.width, plat.height);
            ctx.fillStyle = '#292524';
            ctx.fillRect(3, 3, 2, 2);
            ctx.fillRect(plat.width - 5, 3, 2, 2);
            ctx.fillRect(3, plat.height - 5, 2, 2);
            ctx.fillRect(plat.width - 5, plat.height - 5, 2, 2);
          }
          ctx.restore();
        } else if (plat.type === 'barrier') {
          // Drawing an ancient floating stone block with a rustic torch on top
          ctx.save();
          
          const blockX = plat.x;
          const blockY = plat.y;
          const blockW = plat.width;
          const blockH = plat.height;

          // Main stone body colors based on Active Fase
          let stoneColor = '#57534E'; // Deeper dark grey
          let shadowColor = '#292524';
          let highlightColor = '#78716C';
          let detailColor = '#1C1917';
          let hazardColor = '#EAB308'; // Glowing Warning Amber

          if (activeFase === 2) {
            stoneColor = '#1E293B'; // Ultra Slate Steel
            shadowColor = '#0F172A';
            highlightColor = '#475569';
            detailColor = '#020617';
            hazardColor = '#38BDF8';
          } else if (activeFase === 3) {
            stoneColor = '#5C1D06'; // Midnight obsidian terracotta
            shadowColor = '#1F0400';
            highlightColor = '#7C2D12';
            detailColor = '#0C0200';
            hazardColor = '#EF4444';
          }

          // 1. Draw block base shadow
          ctx.fillStyle = shadowColor;
          ctx.fillRect(blockX, blockY, blockW, blockH);

          // 2. Draw main block face with 3D bevel inside
          ctx.fillStyle = stoneColor;
          ctx.fillRect(blockX + 2, blockY + 2, blockW - 4, blockH - 4);

          // 3. Draw light bevel highlight
          ctx.strokeStyle = highlightColor;
          ctx.lineWidth = 2.0;
          ctx.strokeRect(blockX + 2, blockY + 2, blockW - 4, blockH - 4);

          // 4. Draw high-end vertical structural steel reinforcements (safety bars embedded in stone)
          ctx.fillStyle = '#44403C';
          ctx.fillRect(blockX + 6, blockY + 4, 4, blockH - 8);
          ctx.fillRect(blockX + blockW - 10, blockY + 4, 4, blockH - 8);

          // 5. Ornate physical side-stretching warning spikes or hazard warning stripes
          ctx.strokeStyle = detailColor;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(blockX + 4, blockY + 4, blockW - 8, blockH - 8);

          // Glowing hazard warning stripes on the stone columns
          ctx.strokeStyle = hazardColor;
          ctx.lineWidth = 3;
          for (let sy = blockY + 15; sy < blockY + blockH - 10; sy += 18) {
            ctx.beginPath();
            ctx.moveTo(blockX + 6, sy);
            ctx.lineTo(blockX + blockW - 6, sy - 8);
            ctx.stroke();
          }

          // Ancient mystic protective runes glowing in center
          if (activeFase === 1) {
            // Mossy overlay
            ctx.fillStyle = '#14532D';
            ctx.fillRect(blockX + 1, blockY + 1, blockW - 2, 5); // rich moss on top
            ctx.fillStyle = '#16A34A';
            ctx.fillRect(blockX + 8, blockY + 1, 6, 4);
            ctx.fillRect(blockX + blockW - 14, blockY + 1, 4, 4);
          } else if (activeFase === 2) {
            // Glowing energy core rune
            ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
            ctx.fillRect(blockX + 6, blockY + 30, blockW - 12, 40);
            
            const pulsate = Math.sin(Date.now() / 150) * 0.4 + 0.6;
            ctx.strokeStyle = `rgba(56, 189, 248, ${pulsate})`;
            ctx.shadowColor = '#0EA5E9';
            ctx.shadowBlur = 8 * pulsate;
            ctx.beginPath();
            ctx.moveTo(blockX + blockW/2, blockY + 35);
            ctx.lineTo(blockX + blockW/2 - 6, blockY + 50);
            ctx.lineTo(blockX + blockW/2 + 6, blockY + 50);
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0; // reset
          } else if (activeFase === 3) {
            // Glowing volcano Core
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
            ctx.fillRect(blockX + 6, blockY + 30, blockW - 12, 40);
            
            const pulsate = Math.sin(Date.now() / 120) * 0.4 + 0.6;
            ctx.strokeStyle = `rgba(248, 113, 113, ${pulsate})`;
            ctx.shadowColor = '#EF4444';
            ctx.shadowBlur = 8 * pulsate;
            ctx.beginPath();
            ctx.moveTo(blockX + blockW/2 - 6, blockY + 35);
            ctx.lineTo(blockX + blockW/2 + 6, blockY + 45);
            ctx.lineTo(blockX + blockW/2 - 6, blockY + 55);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }

          // 6. DRAW MASSIVE IRON DEFENSE GATE SPIKES (pointing over edge)
          ctx.strokeStyle = '#1C1917';
          ctx.fillStyle = '#44403C';
          ctx.lineWidth = 2;
          // Side guard brackets facing the pit
          const isLeftOfPit = blockX < 1100 || (blockX > 1900 && blockX < 2200);
          
          for (let sy = blockY + 20; sy < blockY + blockH - 20; sy += 25) {
            ctx.beginPath();
            ctx.moveTo(blockX + (isLeftOfPit ? blockW : 0), sy);
            ctx.lineTo(blockX + (isLeftOfPit ? blockW + 12 : -12), sy + 4);
            ctx.lineTo(blockX + (isLeftOfPit ? blockW : 0), sy + 8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // 7. Draw torch / flame on top of the block (ancient warning beacon)
          const torchX = blockX + blockW / 2;
          const torchY = blockY;

          // Torch base support
          ctx.fillStyle = '#292524'; // dark cast iron metal
          ctx.fillRect(torchX - 3.5, torchY - 10, 7, 10); // vertical pole
          
          ctx.fillStyle = '#1C1917'; // torch cup
          ctx.beginPath();
          ctx.moveTo(torchX - 8, torchY - 10);
          ctx.lineTo(torchX + 8, torchY - 10);
          ctx.lineTo(torchX + 5, torchY - 4);
          ctx.lineTo(torchX - 5, torchY - 4);
          ctx.closePath();
          ctx.fill();

          // Animated Fire Flame
          const time = Date.now() / 80;
          const flameSize = 5 + Math.sin(time) * 2;
          const flickerX = Math.sin(time * 0.7) * 2;

          // Flame outer aura glow
          const glowGrad = ctx.createRadialGradient(
            torchX + flickerX, torchY - 16, 2,
            torchX + flickerX, torchY - 16, 22
          );
          glowGrad.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
          glowGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          
          ctx.save();
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(torchX + flickerX, torchY - 16, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Flame colors
          ctx.fillStyle = '#EF4444'; // Red
          ctx.beginPath();
          ctx.moveTo(torchX - 6, torchY - 10);
          ctx.quadraticCurveTo(torchX - 7.5, torchY - 16 - flameSize, torchX + flickerX, torchY - 20 - flameSize * 1.25);
          ctx.quadraticCurveTo(torchX + 7.5, torchY - 16 - flameSize, torchX + 6, torchY - 10);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#EA580C'; // Bright Orange
          ctx.beginPath();
          ctx.moveTo(torchX - 4, torchY - 10);
          ctx.quadraticCurveTo(torchX - 5, torchY - 14 - flameSize, torchX + flickerX, torchY - 18 - flameSize);
          ctx.quadraticCurveTo(torchX + 5, torchY - 14 - flameSize, torchX + 4, torchY - 10);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#FEF08A'; // Soft Yellow
          ctx.beginPath();
          ctx.moveTo(torchX - 2.5, torchY - 10);
          ctx.quadraticCurveTo(torchX - 3, torchY - 12 - flameSize * 0.7, torchX + flickerX, torchY - 14 - flameSize * 0.84);
          ctx.quadraticCurveTo(torchX + 3, torchY - 12 - flameSize * 0.7, torchX + 2.5, torchY - 10);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        } else {
          ctx.fillStyle = activeFase === 1 ? '#15803D' : activeFase === 2 ? '#1E3A8A' : '#451A03';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = activeFase === 1 ? '#22C55E' : activeFase === 2 ? '#3B82F6' : '#EF4444';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
          
          ctx.fillStyle = activeFase === 1 ? '#86EFAC' : activeFase === 2 ? '#1E293B' : '#78350F';
          for (let i = 0; i < plat.width; i += 20) {
            ctx.fillRect(plat.x + i + 2, plat.y + 2, 6, 4);
          }
        }
      });

      // Sheep drawing
      sheepList.forEach(sheep => {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(sheep.x + 12, sheep.y + 8, 10, 0, Math.PI * 2);
        ctx.arc(sheep.x + 18, sheep.y + 11, 8, 0, Math.PI * 2);
        ctx.arc(sheep.x + 8, sheep.y + 12, 7, 0, Math.PI * 2);
        ctx.fill();

        // Sheep head (black sphere)
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(sheep.x + 22, sheep.y + 7, 4, 0, Math.PI * 2);
        ctx.fill();

        // Sheep feet
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(sheep.x + 8, sheep.y + 16, 2, 4);
        ctx.fillRect(sheep.x + 14, sheep.y + 16, 2, 4);
      });

      // Player sling stones drawing
      stones.forEach(stone => {
        ctx.save();
        ctx.translate(stone.x, stone.y);
        ctx.rotate(stone.rotation || 0);

        if (stone.weaponType === 'punhal') {
          // Draw a sleek, high-end metallic dagger
          ctx.fillStyle = '#854D0E'; // Dark leather/bronze hilt handle
          ctx.fillRect(-7, -1.2, 4.5, 2.4);
          
          ctx.fillStyle = '#A16207'; // Golden/Bronze guard crossguard
          ctx.fillRect(-2.5, -4, 1.8, 8);
          
          ctx.fillStyle = stone.golden ? '#FCD34D' : '#F1F5F9'; // Steel metallic blade
          ctx.strokeStyle = stone.golden ? '#F59E0B' : '#64748B';
          ctx.lineWidth = 1;
          
          ctx.beginPath();
          ctx.moveTo(-0.7, -1.8);
          ctx.lineTo(stone.radius * 2, -1.5);
          ctx.lineTo(stone.radius * 2.6, 0); // sharp tip
          ctx.lineTo(stone.radius * 2, 1.5);
          ctx.lineTo(-0.7, 1.8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Small ruby gemstone decoration on the pommel
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(-6, 0, 1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Rotating textured stone geometry
          ctx.fillStyle = stone.golden ? '#F59E0B' : '#78716C';
          ctx.strokeStyle = stone.golden ? '#FFF' : '#44403C';
          ctx.lineWidth = 1.25;

          // Draw a multi-angle rock shape rather than a plain sphere
          ctx.beginPath();
          ctx.moveTo(-stone.radius, 0);
          ctx.lineTo(-stone.radius / 1.5, -stone.radius);
          ctx.lineTo(stone.radius / 1.5, -stone.radius);
          ctx.lineTo(stone.radius, 0);
          ctx.lineTo(stone.radius / 1.5, stone.radius);
          ctx.lineTo(-stone.radius / 1.5, stone.radius);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        if (stone.golden) {
          ctx.shadowColor = '#FBBF24';
          ctx.shadowBlur = 12;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        }
        ctx.restore();
      });

      // Enemies rendering
      enemies.forEach(enemy => {
        ctx.save();
        
        // Direction the enemy is facing. Since enemies move left (vx < 0), they face left by default.
        const facingLeft = enemy.vx <= 0;
        
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        if (facingLeft) {
          ctx.scale(-1, 1); // Flip horizontally because the custom drawings naturally face right
        }
        
        const w = enemy.width;
        const h = enemy.height;
        const halfW = w / 2;
        const halfH = h / 2;
        
        // Animation swing for running legs, tail, head bobbing
        const timeFactor = enemy.isBoss ? 0.025 : 0.015;
        const swing = Math.sin((enemy.x + Date.now() * timeFactor)) * 6;
        
        if (enemy.type === 'wolf') {
          // --- HIGH-DEFINITION VECTOR CANINE WOLF (LOBO) ---
          {
            const bodyColor = '#4B5563';      // Slate Grey coat
            const undercoatColor = '#94A3B8'; // Light Grey belly/chest
            const snoutColor = '#334155';     // Darker muzzle
            const glowEyeColor = '#FBBF24';   // Feral yellow-gold eyes
            const mouthInner = '#991B1B';      // Crimson red mouth interior

            // Sync swing phase with real-time walkPhase
            const phase = enemy.walkPhase ?? ((enemy.x * 0.12) + (Date.now() * 0.002));

            // Helper to draw a detailed jointed canine leg
            const drawCanineLeg = (
              anchorX: number, 
              anchorY: number, 
              theta: number, 
              isFrontLeg: boolean, 
              isFarSide: boolean
            ) => {
              ctx.save();
              
              // Outer/Inner depth colors
              const primaryColor = isFarSide ? '#2D3540' : bodyColor;
              const limbUndercoat = isFarSide ? '#475569' : undercoatColor;
              const pawColor = isFarSide ? '#1E293B' : snoutColor;
              
              // Length parameters proportioned for height
              const length = halfH * 0.95;
              
              // Trot Gait: foot traces an egg-shaped path
              // Horizontal swing
              const footX = Math.sin(theta) * (halfW * 0.35);
              // Vertical lift: lifts of ground only when swinging forward
              const isLifting = Math.cos(theta) > 0;
              const footY = halfH + (isLifting ? -Math.cos(theta) * (halfH * 0.34) : 0);
              
              // Knees/Elbow joints bending realistically
              const jointDir = isFrontLeg ? 1 : -1;
              const targetX = anchorX + footX;
              const targetY = anchorY + (footY * 0.92);
              
              // Midpoint joint position (knee / hock)
              let jointX = (anchorX + targetX) / 2 + jointDir * (halfW * 0.11);
              let jointY = (anchorY + targetY) / 2 - (halfH * 0.04);
              
              if (isLifting) {
                jointX += jointDir * (halfW * 0.05) * Math.cos(theta);
                jointY -= (halfH * 0.06) * Math.cos(theta);
              }
              
              // 1. Draw Leg silhouette
              ctx.strokeStyle = primaryColor;
              ctx.lineWidth = enemy.isBoss ? 7.5 : 4.4;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              
              ctx.beginPath();
              ctx.moveTo(anchorX, anchorY);
              ctx.lineTo(jointX, jointY);
              ctx.lineTo(targetX, targetY);
              ctx.stroke();
              
              // 2. Draw muscular thigh/shoulder contour on top
              if (!isFarSide) {
                ctx.fillStyle = primaryColor;
                ctx.beginPath();
                ctx.moveTo(anchorX - 7, anchorY);
                ctx.lineTo(anchorX + 7, anchorY);
                ctx.lineTo(jointX + 3, jointY);
                ctx.lineTo(jointX - 3, jointY);
                ctx.closePath();
                ctx.fill();
              }
              
              // 3. Draw detailed rounded paw with claws
              ctx.fillStyle = pawColor;
              ctx.beginPath();
              ctx.arc(targetX, targetY, enemy.isBoss ? 5.2 : 3.0, 0, Math.PI, true);
              ctx.closePath();
              ctx.fill();
              
              // Small white claws
              ctx.fillStyle = '#E2E8F0';
              ctx.fillRect(targetX + (isFrontLeg ? 1 : -1), targetY - 1, 1.2, 1.2);
              
              ctx.restore();
            };

            // --- LAYER 1: FAR SIDE LEGS (DRAPED IN DARK SHADOW) ---
            // Diagonal trot pair A: Back-Left in phase, Front-Right in phase.
            // Diagonal trot pair B: Front-Left out of phase, Back-Right out of phase.
            drawCanineLeg(-halfW + 8, halfH * 0.15, phase, false, true); // Back-Left
            drawCanineLeg(halfW - 12, halfH * 0.15, phase + Math.PI, true, true);  // Front-Left

            // --- LAYER 2: MAJESTIC SWAYING TAIL (ATTACHED TO BODY REAR) ---
            ctx.save();
            ctx.translate(-halfW + 4, -halfH + 11);
            const tailWag = Math.sin(phase) * 0.24;
            ctx.rotate(0.32 + tailWag); // base tail angle + kinetic wagging
            
            // Triple-tone wolf tail gradient
            const tailGrad = ctx.createLinearGradient(-32, 0, 0, 0);
            tailGrad.addColorStop(0, '#F1F5F9');     // pristine white tip
            tailGrad.addColorStop(0.52, bodyColor);  // slate coat body
            tailGrad.addColorStop(1, '#1E293B');     // dark shadow root
            
            ctx.fillStyle = tailGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-halfW * 0.6, -halfH * 0.45, -halfW * 1.15, halfH * 0.18);
            ctx.quadraticCurveTo(-halfW * 0.55, halfH * 0.8, -2, halfH * 0.3);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // --- LAYER 3: ATHLETIC CANINE TORSO (DEEP CHEST, REVOLUTE BACK, EXTREME TUCKED WAIST) ---
            const bodyGrad = ctx.createLinearGradient(-halfW, -halfH, halfW, halfH);
            bodyGrad.addColorStop(0, '#1E293B');  // spinal dark shadow
            bodyGrad.addColorStop(0.45, bodyColor); 
            bodyGrad.addColorStop(0.9, undercoatColor); // lighter undertone belly

            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            // Start at hip upper rear
            ctx.moveTo(-halfW + 7, -halfH + 8);
            // Muscular arching back/spine
            ctx.quadraticCurveTo(0, -halfH + 1.5, halfW - 12, -halfH + 3.5);
            // Strong thick neck rise
            ctx.lineTo(halfW - 2, -halfH - 9);
            // Mighty deep chest cavity
            ctx.quadraticCurveTo(halfW + 5, -halfH * 0.1, halfW - 7, halfH * 0.52);
            // Sleek, extreme skin-tight abdominal tuck upwards towards center
            ctx.quadraticCurveTo(halfW * 0.1, -halfH * 0.08, -halfW + 11, halfH * 0.42);
            // Strong back thigh/hip pelvis curve
            ctx.quadraticCurveTo(-halfW + 1.5, halfH * 0.1, -halfW + 7, -halfH + 8);
            ctx.closePath();
            ctx.fill();

            // Wild guard hairs & jagged spine spikes
            ctx.fillStyle = '#0F172A';
            ctx.beginPath();
            ctx.moveTo(-halfW + 9, -halfH + 7.5);
            ctx.lineTo(-halfW + 7, -halfH + 0.5);
            ctx.lineTo(-halfW + 14, -halfH + 5);
            ctx.lineTo(-halfW + 13, -halfH - 1.5);
            ctx.lineTo(-halfW + 21, -halfH + 4);
            ctx.lineTo(-halfW + 20, -halfH - 2.5);
            ctx.lineTo(-halfW + 28, -halfH + 4);
            ctx.lineTo(-halfW + 27, -halfH - 1.5);
            ctx.lineTo(-halfW + 35, -halfH + 5);
            ctx.closePath();
            ctx.fill();

            // --- LAYER 4: DETAILED NECK RUFF AND LIGHT FLOATING COLLAR COAT ---
            ctx.fillStyle = '#E2E8F0';
            ctx.beginPath();
            ctx.moveTo(halfW - 11, -halfH);
            ctx.lineTo(halfW - 3, -halfH - 8);
            ctx.quadraticCurveTo(halfW + 5, -halfH + 4, halfW - 4, halfH - 13);
            ctx.lineTo(halfW - 14, halfH - 11);
            ctx.quadraticCurveTo(halfW - 8, -halfH + 3, halfW - 11, -halfH);
            ctx.closePath();
            ctx.fill();

            // --- LAYER 5: NEAR SIDE LEGS (FRONT-LAYER MUSCLE) ---
            drawCanineLeg(-halfW + 10, halfH * 0.15, phase + Math.PI, false, false); // Back-Right
            drawCanineLeg(halfW - 8, halfH * 0.15, phase, true, false);  // Front-Right

            // --- LAYER 6: AGGRESSIVE GROWLING WOLF HEAD ---
            ctx.save();
            ctx.translate(halfW - 1, -halfH - 5);

            // Pointed Ears
            // Back Ear (darker)
            ctx.fillStyle = '#111827';
            ctx.beginPath();
            ctx.moveTo(-5, -3);
            ctx.lineTo(-12, -16);
            ctx.lineTo(-1, -6);
            ctx.closePath();
            ctx.fill();
            
            // Front Ear (primary)
            ctx.fillStyle = bodyColor;
            ctx.beginPath();
            ctx.moveTo(-1, -3);
            ctx.lineTo(-5, -19);
            ctx.lineTo(3, -5);
            ctx.closePath();
            ctx.fill();
            
            // Ear inner pink tissue
            ctx.fillStyle = '#F87171';
            ctx.beginPath();
            ctx.moveTo(-1, -5);
            ctx.lineTo(-3.5, -14);
            ctx.lineTo(1.5, -6);
            ctx.closePath();
            ctx.fill();
            
            // Head skull base
            ctx.fillStyle = bodyColor;
            ctx.beginPath();
            ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Upper Growling Snout/Muzzle
            ctx.fillStyle = '#1E293B';
            ctx.beginPath();
            ctx.moveTo(-3, 0);
            ctx.lineTo(11, 1.2);
            ctx.lineTo(10, -2.6);
            ctx.lineTo(0, -4.5);
            ctx.closePath();
            ctx.fill();
            
            // Feral black nose
            ctx.fillStyle = '#0F172A';
            ctx.beginPath();
            ctx.arc(11, -0.2, 1.8, 0, Math.PI * 2);
            ctx.fill();
            
            // Open growling inner mouth cavity (red)
            ctx.fillStyle = mouthInner;
            ctx.beginPath();
            ctx.moveTo(1, 0);
            ctx.lineTo(9.5, 2.0);
            ctx.lineTo(6.5, 6.2);
            ctx.lineTo(0, 3.0);
            ctx.closePath();
            ctx.fill();
            
            // Lower growling jaw bone
            ctx.fillStyle = bodyColor;
            ctx.beginPath();
            ctx.moveTo(-2, 2.2);
            ctx.lineTo(7.5, 5.8);
            ctx.lineTo(5, 7.8);
            ctx.lineTo(-1, 5.0);
            ctx.closePath();
            ctx.fill();
            
            // Sharp deadly white fangs
            ctx.fillStyle = '#FFFFFF';
            // Upper mighty fang
            ctx.beginPath();
            ctx.moveTo(6.2, 1.1);
            ctx.lineTo(7.2, 4.4);
            ctx.lineTo(8.2, 1.3);
            ctx.closePath();
            ctx.fill();
            
            // Upper minor back teeth
            ctx.fillRect(4.2, 0.8, 1.1, 1.2);
            
            // Lower piercing fang
            ctx.beginPath();
            ctx.moveTo(5.2, 5.0);
            ctx.lineTo(6.0, 2.3);
            ctx.lineTo(6.8, 4.8);
            ctx.closePath();
            ctx.fill();
            
            // Angry golden slit eye
            ctx.fillStyle = glowEyeColor;
            ctx.beginPath();
            ctx.moveTo(0, -3.2);
            ctx.lineTo(4.4, -2.4);
            ctx.lineTo(2.2, -0.6);
            ctx.closePath();
            ctx.fill();
            
            // Dark menacing pupil
            ctx.fillStyle = '#000000';
            ctx.fillRect(2.1, -2.4, 0.8, 1.4);
            
            // Fierce eyebrow line
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(-1, -4.6);
            ctx.lineTo(5.2, -3.3);
            ctx.stroke();

            ctx.restore();
          }
          ctx.restore(); // balanced restore for translation/horizontal scale Flip
          return;
          
          // Legacy code block follows below (ignored by return)
          const bodyColor = '#4B5563';      // Slate Grey coat
          const undercoatColor = '#94A3B8'; // Light Grey belly/chest
          const snoutColor = '#334155';     // Darker muzzle
          const glowEyeColor = '#FBBF24';   // Feral yellow-gold eyes from image
          
          // 1. Four legs with paw joints
          ctx.fillStyle = '#334155'; // Back legs (darker shade for depth)
          // Back-Left Leg
          ctx.beginPath();
          ctx.moveTo(-halfW + 6, 2);
          ctx.lineTo(-halfW + 4 + swing, halfH);
          ctx.lineTo(-halfW + 10 + swing, halfH);
          ctx.lineTo(-halfW + 12, 2);
          ctx.closePath();
          ctx.fill();
          
          // Front-Left Leg
          ctx.beginPath();
          ctx.moveTo(halfW - 14, 2);
          ctx.lineTo(halfW - 16 - swing, halfH);
          ctx.lineTo(halfW - 10 - swing, halfH);
          ctx.lineTo(halfW - 8, 2);
          ctx.closePath();
          ctx.fill();
          
          ctx.fillStyle = bodyColor; // Front legs (primary body color)
          // Back-Right Leg
          ctx.beginPath();
          ctx.moveTo(-halfW + 10, 2);
          ctx.lineTo(-halfW + 8 - swing, halfH);
          ctx.lineTo(-halfW + 14 - swing, halfH);
          ctx.lineTo(-halfW + 16, 2);
          ctx.closePath();
          ctx.fill();
          
          // Front-Right Leg
          ctx.beginPath();
          ctx.moveTo(halfW - 10, 2);
          ctx.lineTo(halfW - 12 + swing, halfH);
          ctx.lineTo(halfW - 6 + swing, halfH);
          ctx.lineTo(halfW - 4, 2);
          ctx.closePath();
          ctx.fill();
          
          // 2. Fluffy swaying Tail (reaches out from back rear)
          ctx.save();
          ctx.translate(-halfW + 5, -4);
          ctx.rotate(swing * 0.05 + 0.2); // dynamic wag / angle
          ctx.fillStyle = bodyColor;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-halfW * 0.8, -halfH * 0.4, -halfW * 1.2, halfH * 0.3);
          ctx.quadraticCurveTo(-halfW * 0.6, halfH * 0.9, -4, halfH * 0.4);
          ctx.closePath();
          ctx.fill();
          
          // Tail tip highlights
          ctx.fillStyle = undercoatColor;
          ctx.beginPath();
          ctx.moveTo(-halfW * 0.9, halfH * 0.1);
          ctx.quadraticCurveTo(-halfW * 1.1, halfH * 0.3, -halfW * 1.25, halfH * 0.3);
          ctx.quadraticCurveTo(-halfW * 1.05, halfH * 0.6, -halfW * 0.8, halfH * 0.4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          
          // 3. Thick athletic mid-body
          ctx.fillStyle = bodyColor;
          ctx.beginPath();
          ctx.moveTo(-halfW + 6, -halfH + 6);
          ctx.lineTo(halfW - 10, -halfH + 4);
          ctx.lineTo(halfW - 8, halfH - 8);
          ctx.lineTo(-halfW + 8, halfH - 6);
          ctx.closePath();
          ctx.fill();

          // Wild fur spine spikes along back
          ctx.fillStyle = snoutColor;
          ctx.beginPath();
          ctx.moveTo(-halfW + 10, -halfH + 6);
          ctx.lineTo(-halfW + 8, -halfH + 1);
          ctx.lineTo(-halfW + 14, -halfH + 5);
          ctx.lineTo(-halfW + 13, -halfH + 0);
          ctx.lineTo(-halfW + 18, -halfH + 5);
          ctx.lineTo(-halfW + 19, -halfH + 2);
          ctx.lineTo(-halfW + 24, -halfH + 5);
          ctx.closePath();
          ctx.fill();
          
          // Light grey belly undercoat
          ctx.fillStyle = undercoatColor;
          ctx.beginPath();
          ctx.moveTo(-halfW + 12, 1);
          ctx.lineTo(halfW - 12, 0);
          ctx.lineTo(halfW - 14, halfH - 8);
          ctx.lineTo(-halfW + 14, halfH - 7);
          ctx.closePath();
          ctx.fill();
          
          // 4. Furry mane ruff & shoulders
          ctx.fillStyle = bodyColor;
          ctx.beginPath();
          ctx.moveTo(halfW - 14, -halfH + 4);
          ctx.lineTo(halfW - 4, -halfH - 2); // raised neck
          ctx.lineTo(halfW - 2, halfH - 12);
          ctx.lineTo(halfW - 16, halfH - 8);
          ctx.closePath();
          ctx.fill();
          
          // Light furry chest fluff
          ctx.fillStyle = undercoatColor;
          ctx.beginPath();
          ctx.moveTo(halfW - 13, -halfH * 0.3);
          ctx.lineTo(halfW - 1, -halfH * 0.1);
          ctx.lineTo(halfW - 6, halfH - 10);
          ctx.closePath();
          ctx.fill();

          // 5. Head with pointed snout and alert triangular ears
          ctx.save();
          ctx.translate(halfW - 4, -halfH + 1);
          
          // Ears
          ctx.fillStyle = snoutColor; // back ear
          ctx.beginPath();
          ctx.moveTo(-6, -2);
          ctx.lineTo(-12, -14);
          ctx.lineTo(-2, -6);
          ctx.closePath();
          ctx.fill();
          
          ctx.fillStyle = bodyColor; // front ear
          ctx.beginPath();
          ctx.moveTo(-2, -2);
          ctx.lineTo(-6, -16);
          ctx.lineTo(1, -5);
          ctx.closePath();
          ctx.fill();
          
          ctx.fillStyle = '#EF4444'; // ear inner pink glow
          ctx.beginPath();
          ctx.moveTo(-3, -4);
          ctx.lineTo(-5, -12);
          ctx.lineTo(-1, -5);
          ctx.closePath();
          ctx.fill();
          
          // Head base
          ctx.fillStyle = bodyColor;
          ctx.beginPath();
          ctx.arc(0, 0, 7, 0, Math.PI * 2);
          ctx.fill();
          
          // Extended wolf snout (pointing forward)
          ctx.fillStyle = snoutColor;
          ctx.beginPath();
          ctx.moveTo(-2, 2);
          ctx.lineTo(10, 3); // tip of muzzle
          ctx.lineTo(8, -1);
          ctx.lineTo(1, -3);
          ctx.closePath();
          ctx.fill();
          
          // Black nose tip
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(10, 1.5, 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Yellow Glowing Eye
          ctx.fillStyle = glowEyeColor;
          ctx.beginPath();
          ctx.moveTo(1, -2);
          ctx.lineTo(4, -1);
          ctx.lineTo(2, 1);
          ctx.closePath();
          ctx.fill();
          
          // Pupil inside eye
          ctx.fillStyle = '#000000';
          ctx.fillRect(2.2, -1.2, 1, 1.5);
          
          // Sharp white fangs peeking out
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(4, 3);
          ctx.lineTo(5.5, 6.2);
          ctx.lineTo(6.5, 3);
          ctx.closePath();
          ctx.fill();

          ctx.restore(); // restore translated head coordinates for wolf
        } else if (enemy.type === 'bear') {
          // --- DETAILED HIGH-DEFINITION VECTOR GRIZZLY BEAR WITH JOINTED QUADRUPED CANINE-STYLE STRIDE ---
          // Define realistic, premium gradients for 3D depth, volume rendering, and grizzled fur highlights
          const torsoGrad = ctx.createLinearGradient(-halfW, -halfH, halfW, halfH);
          const headGrad = ctx.createRadialGradient(halfW - 8, -halfH + 10, 2, halfW - 10, -halfH + 13, 18);

          // Define rich, organic, high-contrast wildlife colors matching professional artwork and reference photo
          const furDark = '#1A0B09';   // Richer deep charcoal shadow brown
          const furMain = '#45261C';   // Solid chocolate/chestnut body base
          const furWarm = '#703D2E';   // Glowing warm reddish brown highlight fur
          const furLight = '#9D6A5A';  // Extra warm back/chest highlights
          const snoutColor = '#D4B295'; // Brighter, clearer sand-tan mask for muzzle
          const snoutUnder = '#A38166'; // Sandy shadow for the lower jaw undercoat
          const gumColor = '#DB6B6B';  // Inside mouth wet-gum flesh

          torsoGrad.addColorStop(0, '#EAB308');  // Golden forest light highlight on the spine and shoulders
          torsoGrad.addColorStop(0.25, furLight);
          torsoGrad.addColorStop(0.6, furMain);  // True rich middle pardo
          torsoGrad.addColorStop(1, furDark);    // Heavy shadow undercoat

          headGrad.addColorStop(0, furLight);
          headGrad.addColorStop(0.5, furMain);
          headGrad.addColorStop(1, furDark);

          // Kinetic dynamic motion physics variables
          // Crucial fix: Scale physical position to achieve a realistic quadruped canine-like gait stride!
          const phase = enemy.walkPhase ?? ((enemy.x * 0.12) + (Date.now() * 0.002));
          const sinPhase = Math.sin(phase);
          const cosPhase = Math.cos(phase);
          
          // Heavy lumbering quadruped swagger gait:
          // Bears walk with a rolling canine-style motion. Their shoulder mass rises and falls,
          // creating an asymmetrical heavy step-impact feel.
          const bounceY = Math.abs(cosPhase) * -3.2 + 1.2 + Math.sin(phase * 2) * 1.0;
          // Side-to-side/forward-to-back body drift as weight shifts between paws
          const lurchX = sinPhase * 2.2;
          // Pronounced heavy head/body rotational swaying (swagger)
          const bodyTilt = sinPhase * 0.054; 

          // Apply creature-level movement bob, lurch, and tilt first
          ctx.translate(lurchX, bounceY);
          ctx.rotate(bodyTilt);

          // Dynamic state-based pose transitions for visual impact
          if (enemy.bearState === 'charge_roar' || enemy.bearState === 'roar_sonic') {
            // Intense shaking vibration representing tremendous vocal growl power
            const shakeAmt = 3.5;
            ctx.translate((Math.random() - 0.5) * shakeAmt, (Math.random() - 0.5) * shakeAmt);
          } else if (enemy.bearState === 'swipe_prep') {
            // Rearing up high on hind legs! Rotates the entire spine upwards
            ctx.rotate(-0.48);
            ctx.translate(-halfW * 0.08, -halfH * 0.22);
          } else if (enemy.bearState === 'swipe_slam') {
            // Slams forward aggressively, plunging massive weight down
            ctx.rotate(0.26);
            ctx.translate(halfW * 0.12, halfH * 0.16);
          }
          
          // Sky color rim glow highlight based on current stage
          let rimColor = 'rgba(254, 240, 138, 0.4)'; // Stage 1 yellow highlight
          if (activeFase === 2) {
            rimColor = 'rgba(147, 197, 253, 0.35)'; // Stage 2 soft moon/blue glow
          } else if (activeFase === 3) {
            rimColor = 'rgba(249, 115, 22, 0.5)'; // Stage 3 warm orange sunset glow
          }

          // --- LEGS AND PAWS (Detailed articulated canine-like quadruped limbs) ---
          // Helper to draw a detailed jointed, heavy bear leg with realistic flex segments
          const drawJointedBearLeg = (
            anchorX: number,
            anchorY: number,
            theta: number,
            isFrontLeg: boolean,
            isBackSide: boolean
          ) => {
            ctx.save();

            // Outer/Inner depth colors
            const primaryColor = isBackSide ? furDark : furMain;
            const highlightColor = isBackSide ? furMain : furWarm;
            const pawColor = isBackSide ? '#0F0806' : '#2D1812';

            // Trot Gait: foot traces an elliptical path
            const footX = Math.sin(theta) * (halfW * 0.32);
            const isLifting = Math.cos(theta) > 0;
            const footY = halfH + (isLifting ? -Math.cos(theta) * (halfH * 0.32) : 0);

            // Knees/Elbow joints bending realistically like a quadruped canine
            const jointDir = isFrontLeg ? 1 : -1;
            const targetX = anchorX + footX;
            const targetY = anchorY + (footY * 0.95);

            // Midpoint joint position (knee / hock joint)
            let jointX = (anchorX + targetX) / 2 + jointDir * (halfW * 0.09);
            let jointY = (anchorY + targetY) / 2 - (halfH * 0.05);

            if (isLifting) {
              jointX += jointDir * (halfW * 0.04) * Math.cos(theta);
              jointY -= (halfH * 0.05) * Math.cos(theta);
            }

            // Draw thick, muscular upper leg (thigh / shoulder)
            ctx.fillStyle = primaryColor;
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = enemy.isBoss ? 16 : 11;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Draw jointed segment skeleton
            ctx.beginPath();
            ctx.moveTo(anchorX, anchorY);
            ctx.lineTo(jointX, jointY);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();

            // Overlay thick muscular outline for volume
            ctx.beginPath();
            ctx.moveTo(anchorX - (isFrontLeg ? 10 : 12), anchorY);
            ctx.lineTo(anchorX + (isFrontLeg ? 10 : 8), anchorY);
            ctx.lineTo(jointX + 6, jointY);
            ctx.lineTo(jointX - 6, jointY);
            ctx.closePath();
            ctx.fill();

            // Muscle sheen/highlight on active legs
            if (!isBackSide) {
              ctx.strokeStyle = highlightColor;
              ctx.lineWidth = enemy.isBoss ? 5 : 3.5;
              ctx.beginPath();
              ctx.moveTo(anchorX - 2, anchorY + 4);
              ctx.quadraticCurveTo(jointX, jointY, targetX, targetY - 4);
              ctx.stroke();
            }

            // Draw a massive, broad plantigrade paw with curving claws
            ctx.save();
            ctx.translate(targetX, targetY);
            const pawTilt = isLifting ? Math.sin(theta) * -0.15 : 0;
            ctx.rotate(pawTilt);

            // Broad paw base
            ctx.fillStyle = pawColor;
            ctx.beginPath();
            ctx.ellipse(0, 0, enemy.isBoss ? 13 : 9, enemy.isBoss ? 5 : 3.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Broad toes
            ctx.fillStyle = isBackSide ? furDark : furMain;
            const toeRadius = enemy.isBoss ? 4.5 : 3.2;
            ctx.beginPath();
            ctx.arc(-toeRadius * 0.9, -0.5, toeRadius, 0, Math.PI * 2);
            ctx.arc(0, -0.2, toeRadius, 0, Math.PI * 2);
            ctx.arc(toeRadius * 0.9, 0.2, toeRadius * 0.9, 0, Math.PI * 2);
            ctx.fill();

            // Five heavy, prominent curved ivory grizzly claws
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = enemy.isBoss ? 1.8 : 1.3;
            const clawCount = 3;
            for (let i = 0; i < clawCount; i++) {
              const cx = (i - 1) * (enemy.isBoss ? 4.2 : 3.0);
              const cy = -0.5 + i * 0.3;
              const clen = enemy.isBoss ? 7.5 : 5.2;

              // Outer dark shadow boundary for claw
              ctx.strokeStyle = '#1D0F0C';
              ctx.lineWidth = enemy.isBoss ? 2.5 : 1.8;
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.quadraticCurveTo(cx + clen, cy + 1, cx + clen - 1.5, cy + clen);
              ctx.stroke();

              // White ivory inner core
              ctx.strokeStyle = '#F8FAFC';
              ctx.lineWidth = enemy.isBoss ? 1.4 : 1.0;
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.quadraticCurveTo(cx + clen - 0.5, cy + 0.5, cx + clen - 1.5, cy + clen - 0.5);
              ctx.stroke();
            }

            ctx.restore(); // restore paw local transformations

            // Step impact dust puffs on the ground
            if (!isBackSide && !isLifting && Math.sin(theta) < -0.85) {
              ctx.save();
              ctx.translate(targetX, targetY);
              ctx.fillStyle = 'rgba(120, 113, 108, 0.22)';
              ctx.beginPath();
              ctx.arc(-8, 0, 3, 0, Math.PI, true);
              ctx.arc(8, 0, 3, 0, Math.PI, true);
              ctx.fill();
              ctx.restore();
            }

            ctx.restore();
          };

          // Draw all four legs clustered into rear hips and front shoulders:
          // 1. Back-Left Leg (Background layer - shadow) Attached high up for visual realism
          drawJointedBearLeg(-halfW + 12, -7, phase, false, true);

          // 2. Front-Left Leg (Background layer - shadow)
          drawJointedBearLeg(halfW - 16, -2, phase + Math.PI, true, true);

          // 3. Back-Right Leg (Foreground layer - highlighted)
          drawJointedBearLeg(-halfW + 16, -7, phase + Math.PI, false, false);

          // 4. Front-Right Leg (Foreground layer - highlighted)
          drawJointedBearLeg(halfW - 12, -2, phase, true, false);

          // --- BODY & MUSCULATURE (with dynamic breathing and quadruped stretch factors) ---
          const breathScaleX = 1 + Math.sin(Date.now() * 0.0035) * 0.012;
          const breathScaleY = 1 + Math.cos(Date.now() * 0.0035) * 0.010;
          const stretchX = (1 + Math.cos(phase * 2) * 0.05) * breathScaleX;
          const stretchY = (1 - Math.cos(phase * 2) * 0.04) * breathScaleY;

          ctx.save();
          ctx.scale(stretchX, stretchY);

          // Tail: Fluffy stubby bear tail with heavy swaying
          ctx.save();
          const tailAngle = Math.sin(phase + 0.3) * 0.22;
          ctx.translate(-halfW + 4, -halfH + 13);
          ctx.rotate(tailAngle);
          
          ctx.fillStyle = furDark;
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = furMain;
          ctx.beginPath();
          ctx.arc(-2, 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Massive Bear Hump & Volumetric Torso (Deep muscular chest & tucked waist)
          ctx.save();
          ctx.fillStyle = torsoGrad;
          
          // Ripple the shoulder hump muscle sliding back/forth and up/down
          const humpBobY = Math.sin(phase - 0.5) * 3.5; 
          const humpSlideX = Math.cos(phase - 0.5) * 2.8;

          ctx.beginPath();
          // We start at bottom-left rear (belly line is lifted up away from ground for 24px of pure leg clearance!)
          ctx.moveTo(-halfW, 3);
          // Curve up the thick rear hip
          ctx.quadraticCurveTo(-halfW - 3, -halfH + 12, -halfW + 4, -halfH + 8);
          // Flat horizontal sloping lower back, then climbing steeply up to the humongous shoulder hump:
          ctx.quadraticCurveTo(-halfW * 0.3, -halfH + 6, halfW * 0.05 + humpSlideX, -halfH - 12 + humpBobY);
          // Round top of shoulder hump, curving down into thick, short neck
          ctx.quadraticCurveTo(halfW * 0.4 + humpSlideX, -halfH - 8 + humpBobY, halfW - 10, -halfH + 8);
          // Front chest line hanging down:
          ctx.quadraticCurveTo(halfW + 1, -halfH + 20, halfW - 4, 8);
          // Very shaggy underbelly with drop-down fur tufts:
          ctx.quadraticCurveTo(halfW * 0.3, 5, 0, 4);
          ctx.quadraticCurveTo(-halfW * 0.4, 4, -halfW, 3);
          ctx.closePath();
          ctx.fill();

          // Add volumetric muscle shading line
          ctx.strokeStyle = 'rgba(20, 10, 7, 0.45)';
          ctx.lineWidth = 4.0;
          ctx.beginPath();
          ctx.moveTo(halfW * 0.0 + humpSlideX, -halfH + 3 + humpBobY);
          ctx.quadraticCurveTo(halfW * 0.2, halfH * 0.1, halfW * 0.1, halfH - 8);
          ctx.stroke();

          // Back rim-light overlay to blend the bear into the environment
          ctx.strokeStyle = rimColor;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(-halfW + 4, -halfH + 8);
          ctx.quadraticCurveTo(halfW * 0.05 + humpSlideX, -halfH - 12 + humpBobY, halfW - 10, -halfH + 4);
          ctx.stroke();

          // High-fidelity fur spikes along the spinal line & hump to break vector flatness
          ctx.fillStyle = furWarm;
          ctx.beginPath();
          // Hump fur spikes
          const spikes = [
            { x: -halfW * 0.7, y: -halfH * 0.8, w: 4, h: 9 },
            { x: -halfW * 0.4, y: -halfH * 1.0, w: 5, h: 10 },
            { x: -halfW * 0.1, y: -halfH * 1.25, w: 6, h: 12 },
            { x: halfW * 0.12, y: -halfH * 1.25, w: 6, h: 12 },
            { x: halfW * 0.28, y: -halfH * 1.0, w: 5, h: 9 }
          ];
          spikes.forEach(sp => {
            ctx.moveTo(sp.x, sp.y);
            ctx.lineTo(sp.x - sp.w, sp.y - sp.h);
            ctx.lineTo(sp.x + sp.w * 0.6, sp.y - sp.h * 0.7);
          });
          ctx.closePath();
          ctx.fill();

          // Light chest fur patches for realistic, rich depth
          ctx.fillStyle = furLight;
          ctx.beginPath();
          ctx.moveTo(-halfW * 0.1, -halfH + 16);
          ctx.bezierCurveTo(halfW * 0.3, -halfH + 6, halfW * 0.6, -halfH + 10, halfW - 10, -halfH + 18);
          ctx.bezierCurveTo(halfW - 16, 2, -halfW * 0.1, 0, -halfW * 0.3, -2);
          ctx.closePath();
          ctx.fill();

          // Dynamic shaggy fur locks along the underbelly for extra realism
          ctx.fillStyle = furDark;
          ctx.beginPath();
          for (let fX = -halfW + 10; fX < halfW - 15; fX += 11) {
            ctx.moveTo(fX, 3);
            ctx.lineTo(fX - 4, 8);
            ctx.lineTo(fX + 4, 4);
          }
          ctx.closePath();
          ctx.fill();

          // Draw fine organic fur stroke textures on the body
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          for (let fIdx = 0; fIdx < 6; fIdx++) {
            const fx = -halfW + 28 + fIdx * 8;
            const fy = -halfH + 20 + fIdx * 4;
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.quadraticCurveTo(fx + 3, fy + 4, fx + 5, fy + 12);
            ctx.stroke();
          }

           // Spinal/Hump grizzled highlights (silver/blonde fur tips)
          ctx.strokeStyle = '#9D786E';
          ctx.lineWidth = 1.4;
          for (let sIdx = 0; sIdx < 6; sIdx++) {
            const hx = -halfW * 0.6 + sIdx * 8 + humpSlideX;
            const hy = -halfH - 2 - (sIdx === 2 || sIdx === 3 ? 5 : 0) + humpBobY;
            ctx.beginPath();
            ctx.moveTo(hx, hy);
            ctx.quadraticCurveTo(hx - 2, hy - 6, hx - 5, hy - 4);
            ctx.stroke();
          }

          // Savage reddish-hot glowing battle scars across shoulder plates
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2.4;
          ctx.lineCap = 'round';
          for (let scar = 0; scar < 3; scar++) {
            ctx.beginPath();
            ctx.moveTo(-halfW * 0.25 + scar * 5, -halfH * 0.4);
            ctx.quadraticCurveTo(-halfW * 0.15 + scar * 5, -halfH * 0.1, -halfW * 0.12 + scar * 5, halfH * 0.1);
            ctx.stroke();
          }

          ctx.restore();

          ctx.restore(); // restores body scaling

          // --- EXQUISITE BEAR HEAD (Independent bobbing and rotation) ---
          ctx.save();
          // Head lags body with organic neck lurch and heavy shoulder gait swagger
          const headBobY = Math.sin(phase - 0.55) * 2.2; 
          const headPushX = Math.cos(phase - 0.55) * 1.2;
          const headRot = Math.cos(phase - 0.55) * 0.08; 
          
          // Head set lower on the massive chest to make the shoulder hump stand out visually!
          ctx.translate(halfW - 10 + headPushX, -halfH + 11 + headBobY);
          ctx.rotate(headRot);

          // Ears: Realistic, thick rounded woolly ears set high on skull
          // Back Ear
          ctx.fillStyle = furDark;
          ctx.beginPath();
          ctx.arc(-6, -11, 7.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0F0806';
          ctx.beginPath();
          ctx.arc(-6, -11, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Front Ear
          ctx.fillStyle = furMain;
          ctx.beginPath();
          ctx.arc(1, -12, 8.0, 0, Math.PI * 2);
          ctx.fill();
          
          // Inner Ear pinkish/beige fur lining
          ctx.fillStyle = '#C59F83'; // sandy-tan inner lining
          ctx.beginPath();
          ctx.arc(1, -12, 5.0, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#261410'; 
          ctx.beginPath();
          ctx.arc(1.5, -11.5, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Head Core Base
          ctx.fillStyle = headGrad;
          ctx.beginPath();
          ctx.arc(1, -4, 13.0, 0, Math.PI * 2);
          ctx.fill();

          // Forehead slopes down to the massive sandy-tan muzzle
          ctx.fillStyle = snoutColor;
          ctx.beginPath();
          ctx.moveTo(1, -7);
          ctx.quadraticCurveTo(7, -8, 14, -6); // Nose bridge
          ctx.lineTo(15, -1);                  // Front nose pad tip
          ctx.lineTo(13, 3);                   // Lower lip corner
          ctx.lineTo(3, 4.5);                  // Point of jaw
          ctx.quadraticCurveTo(-1, 0, 1, -7);
          ctx.closePath();
          ctx.fill();

          // Shading on lower snout/jaw
          ctx.fillStyle = snoutUnder;
          ctx.beginPath();
          ctx.moveTo(3, 4.5);
          ctx.lineTo(13, 3);
          ctx.lineTo(8, -1);
          ctx.lineTo(1, 1);
          ctx.closePath();
          ctx.fill();

          // Nose Pad: Wet black leather nose
          ctx.fillStyle = '#0E0C0C';
          ctx.beginPath();
          ctx.arc(14.2, -5.5, 3.8, 0, Math.PI * 2);
          ctx.fill();

          // Nostril curve
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(14.5, -5.0, 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Specular highlight on nose
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(13.2, -6.5, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // --- REALISTIC IRIS EYE ---
          // Eye socket shadow
          ctx.fillStyle = '#1D0E0A';
          ctx.beginPath();
          ctx.ellipse(3, -6.5, 5.0, 3.8, -Math.PI / 8, 0, Math.PI * 2);
          ctx.fill();

          // Intense glowing crimson iris
          const pulse = Math.sin(Date.now() / 80) * 1.5;
          ctx.save();
          ctx.shadowBlur = 10 + pulse;
          ctx.shadowColor = '#EF4444';
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.ellipse(3.2, -6.5, 3.5, 2.5, -Math.PI / 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Feral Orange/Amber slit center pupil
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.ellipse(4.0, -6.5, 1.5, 2.2, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Realistic black pupil center core
          ctx.fillStyle = '#000000';
          ctx.fillRect(3.7, -7.3, 0.9, 1.4);

          // Tiny Specular white shine
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(2.6, -7.5, 0.7, 0, Math.PI * 2);
          ctx.fill();

          // Aggressive scowling heavy eyebrow ridge
          ctx.strokeStyle = '#1A0B09';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-1.2, -11.0);
          ctx.quadraticCurveTo(3.2, -11.8, 8.5, -9.2);
          ctx.stroke();

          // Menacing battle scar running vertically through the eye
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(3.2, -14.2);
          ctx.lineTo(3.4, -0.5);
          ctx.stroke();

          // --- ROARING MAW ---
          // Under snout opening
          ctx.fillStyle = '#0F0908';
          ctx.beginPath();
          ctx.moveTo(3.5, 1.5);
          ctx.lineTo(14.5, 1.0);
          ctx.lineTo(12.0, 7.5);
          ctx.lineTo(3.0, 5.5);
          ctx.closePath();
          ctx.fill();

          // Gums & tongue
          ctx.fillStyle = '#CA5C5C';
          ctx.beginPath();
          ctx.ellipse(8, 4.0, 4.2, 2.0, Math.PI / 10, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#891313'; // Throat shadow
          ctx.beginPath();
          ctx.arc(6.0, 3.2, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // 3D realistic fangs
          ctx.fillStyle = '#F8FAFC';
          // Upper canine
          ctx.beginPath();
          ctx.moveTo(7.5, 1.2);
          ctx.bezierCurveTo(8.5, 1.5, 10.2, 4.0, 10.5, 4.6);
          ctx.bezierCurveTo(9.5, 3.8, 8.8, 2.4, 8.5, 1.2);
          ctx.closePath();
          ctx.fill();
          
          // Lower canine
          ctx.beginPath();
          ctx.moveTo(10.5, 5.4);
          ctx.bezierCurveTo(10.7, 4.3, 11.2, 1.8, 11.6, 1.4);
          ctx.bezierCurveTo(12.2, 2.5, 11.6, 4.6, 11.0, 5.4);
          ctx.closePath();
          ctx.fill();

          // Small regular teeth
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(5.5, 1.4, 1.0, 1.0);
          ctx.fillRect(6.6, 1.4, 1.0, 1.0);

          // --- DROOL / SALIVA DRIPS (Epic battle effects) ---
          ctx.strokeStyle = 'rgba(248, 250, 252, 0.7)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(11.5, 4.5);
          ctx.lineTo(13.5, 11 + Math.sin(Date.now() / 90) * 3);
          ctx.stroke();

          ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
          ctx.beginPath();
          ctx.arc(13.5, 11 + Math.sin(Date.now() / 90) * 3, 1.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore(); // restore translated coordinates for bear head

          // Breathing frosty mist particles
          if (Math.random() < 0.12) {
            const driftDirection = facingLeft ? -1 : 1;
            const muzzleX = enemy.x + (facingLeft ? enemy.width - 15 : 15);
            const muzzleY = enemy.y + 16;
            particles.push({
              x: muzzleX,
              y: muzzleY,
              vx: driftDirection * (0.8 + Math.random() * 0.7),
              vy: -0.3 - Math.random() * 0.4,
              color: 'rgba(241, 245, 249, 0.45)',
              radius: 1.1 + Math.random() * 1.5,
              life: 30 + Math.floor(Math.random() * 25)
            });
          }
          
        } else {
          // --- DETAILED GOLDEN SAVANNAH LION (LEÃO) WITH JOINTED QUADRUPED CANINE-STYLE STRIDE ---
          // Define realistic, premium gradients for 3D depth and lion volume
          const lionTorsoGrad = ctx.createLinearGradient(-halfW, -halfH, halfW, halfH);
          const lionManeGrad = ctx.createRadialGradient(halfW - 8, -halfH, 4, halfW - 10, -halfH, 35);
          
          // High-contrast magnificent savannah feline/canine colors
          const maneDark = '#251006';    // Deep dark brown shadow for mane core
          const maneMain = '#6B1E06';    // Rich dark crimson/orange 
          const maneGolden = '#C25E00';  // Warm sunburst orange
          const coatDark = '#854D0E';    // Deep gold shadow
          const coatMain = '#D97706';    // True savanna gold
          const coatLight = '#FBBF24';   // Warm desert highlighting gold
          const coatCream = '#FEF3C7';   // Luxurious underbelly cream/white
          const detailColor = '#1F0600';  // Dark outline color
          const goldGlow = '#FCD34D';    // Golden highlights
          const clawColor = '#FAFAF9';   // Ivory claws
          const gumColor = '#CA5C5C';    // Mouth interior pinkish gums

          lionTorsoGrad.addColorStop(0, coatLight);
          lionTorsoGrad.addColorStop(0.5, coatMain);
          lionTorsoGrad.addColorStop(1, coatDark);

          lionManeGrad.addColorStop(0, goldGlow);
          lionManeGrad.addColorStop(0.3, maneGolden);
          lionManeGrad.addColorStop(0.7, maneMain);
          lionManeGrad.addColorStop(1, maneDark);

          // Kinetic dynamic motion physics variables
          // Crucial fix: Sync walking frequency with actual entity movement speed!
          const phase = enemy.walkPhase ?? ((enemy.x * 0.12) + (Date.now() * 0.002));
          const sinPhase = Math.sin(phase);
          const cosPhase = Math.cos(phase);
          
          // Math-proportionate scaling multiplier to enlarge boss elements nicely without stretching head!
          const sF = w / 58; // For normal lion (w: 58) => sF: 1.0. For boss (w: 210) => sF: 3.62!

          // Dynamic dog/canine-style rolling trot (shoulder height rises and falls)
          const bounceY = Math.abs(cosPhase) * -3.5 + 1.2; 
          const bodyTilt = sinPhase * 0.045; 

          // Apply creature-level movement bob and tilt to context first
          ctx.translate(0, bounceY);
          ctx.rotate(bodyTilt);

          // Dynamic state-based pose transitions for visual impact on Lion
          if (enemy.lionState === 'charge_roar') {
            // Intense shaking vibration representing tremendous growl power
            const shakeAmt = 3.6;
            ctx.translate((Math.random() - 0.5) * shakeAmt, (Math.random() - 0.5) * shakeAmt);
          } else if (enemy.lionState === 'jump_prep') {
            // Crouches down to prepare for a leap: squash height, pull body down and back
            ctx.scale(1.15, 0.72);
            ctx.translate(-halfW * 0.1, halfH * 0.2);
          } else if (enemy.lionState === 'jump_air') {
            // High altitude leap: body stretched out, tilted up/down with atmospheric wind
            ctx.rotate(enemy.vy * 0.05); // dynamic tilt based on vertical speed
            ctx.scale(1.12, 0.9);
          } else if (enemy.lionState === 'charge_dash') {
            // Running forward at maximum speed: lean forward heavily
            ctx.rotate(-0.08);
            ctx.translate(halfW * 0.08, halfH * 0.1);
          }

          // --- LEGS AND PAWS (Detailed jointed dog-like quadruped limbs) ---
          // Helper to draw a detailed jointed, highly athletic canine-style lion leg
          const drawJointedLionLeg = (
            anchorX: number,
            anchorY: number,
            theta: number,
            isFrontLeg: boolean,
            isBackSide: boolean
          ) => {
            ctx.save();
            
            // Outer/Inner depth colors
            const primaryColor = isBackSide ? coatDark : coatMain;
            const highlightColor = isBackSide ? coatMain : coatLight;
            const pawColor = isBackSide ? '#452205' : coatDark;
            
            // Trot/Run Gait: elliptical foot path tracing smooth quadruped movement
            // Horizontal swing
            const footX = Math.sin(theta) * (halfW * 0.38);
            // Vertical lift: lifts higher mid-swing
            const isLifting = Math.cos(theta) > 0;
            const footY = halfH + (isLifting ? -Math.cos(theta) * (halfH * 0.35) : 0);
            
            // Flexed knee joints bending realistically like an athletic canine/dog
            const jointDir = isFrontLeg ? 1 : -1;
            const targetX = anchorX + footX;
            const targetY = anchorY + (footY * 0.95);
            
            // Midpoint joint position (knee / elbow)
            let jointX = (anchorX + targetX) / 2 + jointDir * (halfW * 0.11);
            let jointY = (anchorY + targetY) / 2 - (halfH * 0.05);
            
            if (isLifting) {
              jointX += jointDir * (halfW * 0.05) * Math.cos(theta);
              jointY -= (halfH * 0.06) * Math.cos(theta);
            }
            
            // Draw muscular feline/canine leg structure
            ctx.fillStyle = primaryColor;
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = enemy.isBoss ? 14.5 * sF : 8 * sF; // robust powerful legs
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Draw skeletal connection (Main limb bone)
            ctx.beginPath();
            ctx.moveTo(anchorX, anchorY);
            ctx.lineTo(jointX, jointY);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
            
            // Draw muscular volume overlays for powerful thighs and forearms
            ctx.beginPath();
            ctx.moveTo(anchorX - (isFrontLeg ? 8.5 * sF : 11 * sF), anchorY);
            ctx.lineTo(anchorX + (isFrontLeg ? 8.5 * sF : 8.5 * sF), anchorY);
            ctx.lineTo(jointX + 5 * sF, jointY);
            ctx.lineTo(jointX - 5 * sF, jointY);
            ctx.closePath();
            ctx.fill();

            // Distinct Joint Elbow/Knee bulge indicator (adds high anatomy polish!)
            ctx.fillStyle = isBackSide ? coatDark : coatMain;
            ctx.beginPath();
            ctx.arc(jointX, jointY, (enemy.isBoss ? 8 : 4.5) * sF, 0, Math.PI * 2);
            ctx.fill();
            
            // Muscle sheen/highlight on active legs
            if (!isBackSide) {
              // Primary highlights
              ctx.strokeStyle = highlightColor;
              ctx.lineWidth = enemy.isBoss ? 5.0 * sF : 2.8 * sF;
              ctx.beginPath();
              ctx.moveTo(anchorX - 1.5 * sF, anchorY + 2 * sF);
              ctx.quadraticCurveTo(jointX, jointY, targetX, targetY - 3 * sF);
              ctx.stroke();
              
              // Soft white/cream light reflection at the calf/forearm edge
              ctx.strokeStyle = coatCream;
              ctx.lineWidth = enemy.isBoss ? 2.0 * sF : 1.1 * sF;
              ctx.beginPath();
              ctx.moveTo(jointX - 1 * sF, jointY + 3 * sF);
              ctx.lineTo(targetX - 1 * sF, targetY - 2 * sF);
              ctx.stroke();
            }
            
            // Draw delicate velvet paws with high detailed toe beans:
            ctx.save();
            ctx.translate(targetX, targetY);
            const pawTilt = isLifting ? Math.sin(theta) * -0.15 : 0;
            ctx.rotate(pawTilt);
            
            // Broad feline/canine paw central pad cushion:
            ctx.fillStyle = pawColor;
            ctx.beginPath();
            ctx.ellipse(0, -1 * sF, 7.5 * sF, 3.2 * sF, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw 4 distinct circular digital pads ("toe beans"):
            ctx.fillStyle = isBackSide ? '#2D1603' : coatDark;
            for (let i = 0; i < 4; i++) {
              const toeOffset = (-5.2 + i * 3.4) * sF;
              ctx.beginPath();
              ctx.arc(toeOffset, 0.5 * sF, 1.8 * sF, 0, Math.PI * 2);
              ctx.fill();
            }
            
            // 4 Retractable sharp white claws peeking out from the velvet paws:
            // High detail: each claw starts with a dark keratin root and arcs to a crystal white point!
            const clawCount = 4;
            for (let i = 0; i < clawCount; i++) {
              const clawX = (-5.2 + i * 3.4) * sF;
              
              // Keratin claw root (grayish slate brown)
              ctx.fillStyle = '#64748B'; 
              ctx.beginPath();
              ctx.moveTo(clawX - 0.6 * sF, 0.5 * sF);
              ctx.lineTo(clawX + 0.6 * sF, 0.5 * sF);
              ctx.lineTo(clawX + 0.3 * sF, 2.0 * sF);
              ctx.closePath();
              ctx.fill();
              
              // Razor sharp ivory claw tip (curved downwards)
              ctx.fillStyle = clawColor;
              ctx.beginPath();
              ctx.moveTo(clawX - 0.5 * sF, 1.5 * sF);
              ctx.quadraticCurveTo(clawX - 1.2 * sF, 3.8 * sF, clawX + 1.2 * sF, 5.2 * sF);
              ctx.quadraticCurveTo(clawX + 0.5 * sF, 3.0 * sF, clawX + 0.5 * sF, 1.5 * sF);
              ctx.closePath();
              ctx.fill();
            }
            
            ctx.restore(); // restore paw local transformations
            
            // Dust puff effects when footprint strikes the savanna ground
            if (!isBackSide && !isLifting && Math.sin(theta) < -0.85) {
              ctx.save();
              ctx.translate(targetX, targetY);
              ctx.fillStyle = 'rgba(230, 150, 60, 0.25)';
              ctx.beginPath();
              ctx.arc(-6, 0, 2.8, 0, Math.PI, true);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }
            
            ctx.restore();
          };

          // Draw all four legs phased correctly like a running canine (diagonal sync)
          // 1. Rear-Left Leg (Background layer - shadow)
          drawJointedLionLeg(-halfW + 11 * sF, -halfH * 0.08, phase, false, true);

          // 2. Front-Left Leg (Background layer - shadow)
          drawJointedLionLeg(halfW - 20 * sF, -halfH * 0.08, phase + Math.PI, true, true);

          // 3. Rear-Right Leg (Foreground layer - highlighted)
          drawJointedLionLeg(-halfW + 20 * sF, -halfH * 0.08, phase + Math.PI, false, false);

          // 4. Front-Right Leg (Foreground layer - highlighted)
          drawJointedLionLeg(halfW - 11 * sF, -halfH * 0.08, phase, true, false);

          // --- BODY & UNDERBELLY (Sleek feline/canine muscular torso with SQUASH & STRETCH) ---
          const breathScaleX = 1 + Math.sin(Date.now() * 0.0035) * 0.012;
          const breathScaleY = 1 + Math.cos(Date.now() * 0.0035) * 0.010;
          const stretchX = (1 + Math.cos(phase * 2) * 0.05) * breathScaleX;
          const stretchY = (1 - Math.cos(phase * 2) * 0.04) * breathScaleY;

          ctx.save();
          ctx.scale(stretchX, stretchY);

          // Sleek, powerful, low-slung athletic predator torso (Tucked waist, big chest)
          ctx.save();
          ctx.fillStyle = lionTorsoGrad;
          ctx.beginPath();
          // Starting at neck/chest base
          ctx.moveTo(halfW - 10 * sF, -halfH * 0.2);
          // Spine / saddle line
          ctx.bezierCurveTo(
            halfW * 0.3 * sF, -halfH * 0.48, 
            -halfW * 0.2 * sF, -halfH * 0.45, 
            -halfW + 10 * sF, -halfH * 0.45
          );
          // Round muscular rump
          ctx.quadraticCurveTo(-halfW, -halfH * 0.2, -halfW, halfH - 10 * sF);
          // Tucked waist / flank (curves deeply up for athletic feline tuck!)
          ctx.quadraticCurveTo(-halfW * 0.45, halfH - 25 * sF, -halfW * 0.1, halfH - 4 * sF);
          // Deep powerful ribcage/chest
          ctx.quadraticCurveTo(halfW * 0.35, halfH + 1 * sF, halfW - 8 * sF, halfH - 8 * sF);
          // Shoulder line climbing back to the neck
          ctx.quadraticCurveTo(halfW - 2 * sF, halfH * 0.1, halfW - 10 * sF, -halfH * 0.2);
          ctx.closePath();
          ctx.fill();

          // Cream-colored luxury underbelly chest/abdominal fur overlay
          ctx.fillStyle = coatCream;
          ctx.beginPath();
          ctx.moveTo(-halfW * 0.6, halfH - 16 * sF);
          // Match the tucked tummy curve
          ctx.quadraticCurveTo(-halfW * 0.2, halfH - 24 * sF, halfW * 0.25, halfH - 14 * sF);
          // Down through the thick chest fur
          ctx.quadraticCurveTo(halfW * 0.5, halfH - 1 * sF, halfW - 16 * sF, halfH - 10 * sF);
          ctx.quadraticCurveTo(halfW * 0.1, halfH - 8 * sF, -halfW * 0.6, halfH - 16 * sF);
          ctx.closePath();
          ctx.fill();

          // Underbelly hanging fur tufts (pêlos da barriga) that sway in real-time!
          ctx.fillStyle = coatCream;
          const tuftCount = 6;
          for (let i = 0; i < tuftCount; i++) {
            const ratio = i / (tuftCount - 1);
            const tuftX = (-halfW * 0.4 + ratio * (halfW * 1.0)) * sF;
            const tuftY = (halfH - 10 + Math.sin(phase * 1.8 + i) * 2.5) * sF;
            
            ctx.beginPath();
            ctx.moveTo(tuftX, tuftY - 4 * sF);
            ctx.lineTo(tuftX - 4 * sF, tuftY + 5 * sF + Math.sin(phase * 1.5 + i) * 3 * sF); // swings back and forth!
            ctx.lineTo(tuftX + 4 * sF, tuftY - 4 * sF);
            ctx.closePath();
            ctx.fill();
          }

          // Massive Rear Thigh Muscle Plate (Gives incredible strength and bulk)
          const rearThighGrad = ctx.createRadialGradient(-halfW * 0.6, 0, 5 * sF, -halfW * 0.5, 0, 18 * sF);
          rearThighGrad.addColorStop(0, coatLight);
          rearThighGrad.addColorStop(0.7, coatMain);
          rearThighGrad.addColorStop(1, coatDark);
          ctx.fillStyle = rearThighGrad;
          ctx.beginPath();
          ctx.ellipse(-halfW * 0.6, -halfH * 0.1, 14 * sF, 18 * sF, 0.15, 0, Math.PI * 2);
          ctx.fill();
          
          // Thigh high-contrast highlight arc
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)'; // pale light gold highlighting light source above
          ctx.lineWidth = 2.2 * sF;
          ctx.beginPath();
          ctx.arc(-halfW * 0.6, -halfH * 0.1, 14 * sF, Math.PI * 1.1, Math.PI * 1.8);
          ctx.stroke();

          // Powerful Front Shoulder Muscle Plate
          const frontShoulderGrad = ctx.createRadialGradient(halfW * 0.4, -halfH * 0.1, 5 * sF, halfW * 0.35, -halfH * 0.1, 20 * sF);
          frontShoulderGrad.addColorStop(0, coatLight);
          frontShoulderGrad.addColorStop(0.7, coatMain);
          frontShoulderGrad.addColorStop(1, coatDark);
          ctx.fillStyle = frontShoulderGrad;
          ctx.beginPath();
          ctx.ellipse(halfW * 0.4, -halfH * 0.08, 15 * sF, 21 * sF, -0.1, 0, Math.PI * 2);
          ctx.fill();

          // Shoulder blade highlight stroke
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
          ctx.beginPath();
          ctx.arc(halfW * 0.4, -halfH * 0.08, 15 * sF, Math.PI * 1.2, Math.PI * 1.9);
          ctx.stroke();
          
          // Abdominal muscle lines/shading (adds muscular rib cage pattern!)
          ctx.strokeStyle = 'rgba(31, 6, 0, 0.2)'; // faint dark lines
          ctx.lineWidth = 2.0 * sF;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo((-halfW * 0.1 - i * 6) * sF, (halfH - 20) * sF);
            ctx.quadraticCurveTo((-halfW * 0.15 - i * 6) * sF, (halfH - 12) * sF, (-halfW * 0.08 - i * 6) * sF, (halfH - 5) * sF);
            ctx.stroke();
          }

          // Back Rim Light Glow (Magical Sunset outline!)
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.65)'; // Bright yellow/gold sunset halo
          ctx.lineWidth = 2.5 * sF;
          ctx.beginPath();
          ctx.moveTo(halfW - 14 * sF, -halfH * 0.2);
          ctx.bezierCurveTo(
            halfW * 0.3 * sF, -halfH * 0.49, 
            -halfW * 0.2 * sF, -halfH * 0.47, 
            -halfW + 8 * sF, -halfH * 0.46
          );
          ctx.stroke();
          ctx.restore();

          // Tail: long, whip-like feline tail with dynamic waving curves
          ctx.save();
          ctx.translate(-halfW + 2 * sF, -halfH * 0.2);
          // Enhanced physics: Tail swings beautifully with secondary lag behind the main walk phase!
          const tailSwing = Math.sin(phase * 1.5 - 0.5) * 0.28;
          ctx.rotate(-0.45 + tailSwing); 
          
          // Tail base line: thick muscular tail tapering slightly
          ctx.strokeStyle = coatDark;
          ctx.lineWidth = 4.2 * sF;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-12 * sF, -10 * sF, -18 * sF, -2 * sF, -28 * sF, 12 * sF);
          ctx.stroke();
          
          ctx.strokeStyle = coatMain;
          ctx.lineWidth = 2.4 * sF;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-12 * sF, -10 * sF, -18 * sF, -2 * sF, -28 * sF, 12 * sF);
          ctx.stroke();

          // Rich dark bushy tail end tuft drawing waving layered locks index:
          ctx.save();
          ctx.translate(-28 * sF, 12 * sF);
          // Tuft rotates based on whip physics speed!
          ctx.rotate(tailSwing * 2.2);
          
          // Draw a magnificent multi-colored flame-like tuft
          const drawTailTuftLock = (cx: number, cy: number, r: number, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy, r * sF, 0, Math.PI * 2);
            ctx.fill();
            
            // Swinger tip
            ctx.beginPath();
            ctx.moveTo(cx - r * sF, cy);
            ctx.quadraticCurveTo(cx - (r + 7) * sF, cy + r * 1.5 * sF, cx - (r + 12) * sF, cy + r * 2.2 * sF);
            ctx.quadraticCurveTo(cx + r * 0.5 * sF, cy + r * 1.1 * sF, cx + r * sF, cy);
            ctx.closePath();
            ctx.fill();
          };

          drawTailTuftLock(0, 0, 6.8, maneDark);
          drawTailTuftLock(1 * sF, -1 * sF, 4.8, maneMain);
          drawTailTuftLock(2 * sF, -2 * sF, 3.2, maneGolden);
          drawTailTuftLock(2.8 * sF, -2.8 * sF, 1.8, goldGlow);
          ctx.restore();
          
          ctx.restore();

          // --- MAGNIFICENT LAYERED 3D WAVE LION MANE (JUBA) ---
          ctx.save();
          const mX = halfW - 12 * sF;
          const mY = -halfH * 0.45;
          const isFury = enemy.isBoss && enemy.hp <= enemy.maxHp * 0.35;
          
          // Helper to draw realistic wavy strands/locks of hair with dynamic wind/motion swaying!
          // Custom engineered to flip/lift the hair locks UPWARD and BACKWARD (negative Y),
          // keeping the lower shoulder line entirely clean to display the majestic claws and paws.
          const drawManeLock = (
            cx: number, 
            cy: number, 
            r: number, 
            ctrlOffset: number, 
            color: string,
            phaseOffset: number = 0,
            swayMulti: number = 1.0
          ) => {
            // Calculate organic wavy distortion based on walking phase and high-speed time oscillations
            const waveTime = Date.now() * 0.0055;
            // Combine walker gait phase and ambient time so the hair flows beautifully even when standing idle!
            const combinedPhase = phase * 1.5 + waveTime + phaseOffset;
            
            // Gentle sways back and forth
            const swayAngle = Math.sin(combinedPhase) * 0.14 * swayMulti;
            // Dynamic stretch/compress of the locks to simulate volumes of hair colliding and compressing
            const lockStretch = 1.0 + Math.cos(combinedPhase * 0.8) * 0.07 * swayMulti;
            
            ctx.save();
            // Translate to the lock's center to rotate and scale it dynamically
            ctx.translate(cx, cy);
            ctx.rotate(swayAngle);
            ctx.scale(lockStretch, 1 / lockStretch);
            
            ctx.fillStyle = color;
            ctx.beginPath();
            // Draw core bulk circle
            ctx.arc(0, 0, r * sF, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw flowing, animated hair spike ends that whip and surge upwards/backwards!
            const motionLagX = Math.sin(combinedPhase) * 3.5 * sF * swayMulti;
            const motionLagY = Math.cos(combinedPhase) * 2.5 * sF * swayMulti;
            // High-frequency ripple flutter for wind-blown effect
            const flutter = Math.sin(combinedPhase * 2.2) * 3.5 * sF * swayMulti;
            
            ctx.beginPath();
            ctx.moveTo(-r * sF, 0);
            
            // Curved control points modified to arc UPWARD and BACKWARD (negative Y & negative X)
            // This exposes the paws and chest muscle overlay perfectly!
            const tipX = -(r + ctrlOffset * 1.7) * sF + motionLagX + flutter * 0.6;
            const tipY = -(r * 1.9) * sF + motionLagY - Math.abs(flutter) * 1.1; // -Y lifts the hair tip skyward!
            
            const ctrl1X = -(r + ctrlOffset * 1.1) * sF + motionLagX * 0.5;
            const ctrl1Y = -(r * 1.0) * sF + motionLagY * 0.3; // Raised upward
            
            const ctrl2X = -ctrlOffset * 0.45 * sF;
            const ctrl2Y = -(r * 1.4) * sF + motionLagY * 0.4; // Raised upward
            
            ctx.quadraticCurveTo(ctrl1X, ctrl1Y, tipX, tipY);
            ctx.quadraticCurveTo(ctrl2X, ctrl2Y, r * sF, 0);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
          };

          // Back Layer Mane: Grounding dark colors (slower, deep undulating rhythm)
          drawManeLock(mX - 10 * sF, mY - 10 * sF, 24, 10, maneDark, 0.0, 0.7);
          drawManeLock(mX - 4 * sF, mY + 12 * sF, 25, 12, '#1A0B04', 1.5, 0.8);
          drawManeLock(mX + 10 * sF, mY - 6 * sF, 22, 8, maneDark, 3.0, 0.6);

          // Middle Layer Mane: Rich Deep Crimson-Oranges (flowing in counter-phase)
          drawManeLock(mX - 5 * sF, mY - 4 * sF, 21, 10, maneMain, 0.5, 1.1);
          drawManeLock(mX + 2 * sF, mY + 6 * sF, 20, 9, maneGolden, 2.0, 1.2);
          drawManeLock(mX + 6 * sF, mY - 8 * sF, 19, 8, maneMain, 3.5, 1.0);

          // Foreground Highlights: Shimmering honey golds framing face (whipping actively)
          drawManeLock(mX, mY, 16, 6, goldGlow, 1.0, 1.4);
          drawManeLock(mX + 4 * sF, mY + 4 * sF, 15, 5, coatLight, 2.5, 1.5);
          drawManeLock(mX - 2 * sF, mY + 8 * sF, 14, 4, goldGlow, 4.0, 1.3);

          // Extra Flare locks if in FURY mode to create a massive ignited fiery mane!
          if (isFury) {
            const fPulse = Math.sin(Date.now() * 0.015) * 4.5;
            drawManeLock(mX - 18 * sF, mY - 18 * sF, 22 + fPulse, 12, '#EF4444', 0.0, 1.8); // Burning red locks
            drawManeLock(mX + 18 * sF, mY - 12 * sF, 18 + fPulse, 10, '#F59E0B', 1.0, 2.0); // Ignited gold locks
            drawManeLock(mX + 2 * sF, mY - 24 * sF, 20 + fPulse, 11, '#EF4444', 2.0, 1.9); 
            drawManeLock(mX - 8 * sF, mY + 24 * sF, 22 + fPulse, 13, '#F59E0B', 3.0, 2.1); 
          }

          ctx.restore();
          ctx.restore(); // restores body scaling scale(stretchX, stretchY)

          // --- EXQUISITE FELINE/CANINE HEAD (Stable independent foveal charging bob) ---
          ctx.save();
          // Agile felines/canines keep their heads remarkably level when chasing down prey
          const lionHeadBobY = Math.sin(phase - 0.3) * 1.4 * sF;
          const lionHeadBobX = Math.cos(phase) * 0.8 * sF;
          const lionHeadRot = Math.cos(phase - 0.3) * 0.04; 
          ctx.translate(halfW - 5 * sF + lionHeadBobX, -halfH * 0.35 + lionHeadBobY);
          ctx.rotate(lionHeadRot);

          // If boss, draw a floating majestic Golden Crown of the Savannah King!
          if (enemy.isBoss) {
            ctx.save();
            ctx.translate(1 * sF, -22 * sF); // position just above the ears centered on head
            
            // Draw radial halo backing glow
            const haloGrad = ctx.createRadialGradient(0, 0, 1 * sF, 0, 0, 14 * sF);
            haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
            haloGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(0, 0, 14 * sF, 0, Math.PI * 2);
            ctx.fill();

            // Spires and jewels
            ctx.fillStyle = '#F59E0B'; // pure crown gold
            ctx.beginPath();
            ctx.moveTo(-11 * sF, 3 * sF);
            ctx.lineTo(-13 * sF, -4 * sF); // left crest
            ctx.lineTo(-7 * sF, 0 * sF);
            ctx.lineTo(0 * sF, -11 * sF);  // massive middle crest representing final boss authority
            ctx.lineTo(7 * sF, 0 * sF);
            ctx.lineTo(13 * sF, -4 * sF); // right crest
            ctx.lineTo(11 * sF, 3 * sF);
            ctx.closePath();
            ctx.fill();

            // Highlight border
            ctx.strokeStyle = '#FEF08A';
            ctx.lineWidth = 1.2 * sF;
            ctx.stroke();

            // Ruby jewels sparkling
            ctx.fillStyle = '#EF4444'; // royal rubies
            ctx.beginPath();
            ctx.arc(-13 * sF, -4 * sF, 1.5 * sF, 0, Math.PI * 2);
            ctx.arc(0 * sF, -11 * sF, 2.0 * sF, 0, Math.PI * 2);
            ctx.arc(13 * sF, -4 * sF, 1.5 * sF, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Feline Ears peeking neatly out of the mane
          ctx.fillStyle = coatDark;
          ctx.beginPath();
          ctx.arc(-6 * sF, -12 * sF, 6.5 * sF, 0, Math.PI * 2);
          ctx.fill();
          // Inner cream/tan woolly fur
          ctx.fillStyle = coatCream;
          ctx.beginPath();
          ctx.arc(-6.5 * sF, -12 * sF, 4.2 * sF, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#452205'; // inner depth shadow
          ctx.beginPath();
          ctx.arc(-6 * sF, -12 * sF, 2.2 * sF, 0, Math.PI * 2);
          ctx.fill();

          // Face Core Base
          ctx.fillStyle = coatMain;
          ctx.beginPath();
          ctx.arc(1 * sF, -2 * sF, 11.5 * sF, 0, Math.PI * 2);
          ctx.fill();

          // Face shading / jaw line definer
          ctx.strokeStyle = detailColor;
          ctx.lineWidth = 1.35 * sF;
          ctx.beginPath();
          ctx.arc(1 * sF, -2 * sF, 11.5 * sF, 0, Math.PI);
          ctx.stroke();

          // Angry feline eyebrow / snarl wrinkles
          ctx.strokeStyle = detailColor;
          ctx.lineWidth = 1.5 * sF;
          ctx.beginPath();
          ctx.moveTo(1.5 * sF, -7 * sF);
          ctx.quadraticCurveTo(4 * sF, -10 * sF, 7.0 * sF, -6.5 * sF);
          ctx.moveTo(0, -5 * sF);
          ctx.quadraticCurveTo(2.5 * sF, -7.5 * sF, 5.5 * sF, -4.5 * sF);
          ctx.stroke();

          // Strong feline snout
          ctx.fillStyle = coatDark;
          ctx.beginPath();
          ctx.moveTo(3 * sF, -5 * sF);
          ctx.lineTo(14.5 * sF, -5.5 * sF);
          ctx.lineTo(13.5 * sF, 1.5 * sF);
          ctx.lineTo(3 * sF, 1.5 * sF);
          ctx.closePath();
          ctx.fill();

          // Velvet white/cream snout whisker pads (highly details)
          ctx.fillStyle = '#FAFAF9';
          ctx.beginPath();
          ctx.arc(7.5 * sF, -1 * sF, 4.0 * sF, 0, Math.PI * 2);
          ctx.arc(11.0 * sF, -1 * sF, 4.0 * sF, 0, Math.PI * 2);
          ctx.fill();

          // Heart-shaped Dark Nose cushion
          ctx.fillStyle = '#110906';
          ctx.beginPath();
          ctx.moveTo(9 * sF, -5.5 * sF);
          ctx.lineTo(15.5 * sF, -5.5 * sF);
          ctx.quadraticCurveTo(16 * sF, -4 * sF, 12.0 * sF, -2 * sF);
          ctx.lineTo(12.0 * sF, -1.8 * sF);
          ctx.closePath();
          ctx.fill();

          // Nostril cavities
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(10.5 * sF, -4.5 * sF, 1.1 * sF, 0, Math.PI * 2);
          ctx.arc(13.5 * sF, -4.5 * sF, 1.1 * sF, 0, Math.PI * 2);
          ctx.fill();

          // Black whisker roots / dots
          ctx.fillStyle = '#57534E';
          ctx.fillRect(6.2 * sF, -1.5 * sF, 0.9 * sF, 0.9 * sF);
          ctx.fillRect(8.2 * sF, -1.5 * sF, 0.9 * sF, 0.9 * sF);
          ctx.fillRect(7.2 * sF, 0.2 * sF, 0.9 * sF, 0.9 * sF);
          ctx.fillRect(10.2 * sF, -1.5 * sF, 0.9 * sF, 0.9 * sF);
          ctx.fillRect(12.0 * sF, -1.5 * sF, 0.9 * sF, 0.9 * sF);
          ctx.fillRect(11.2 * sF, 0.2 * sF, 0.9 * sF, 0.9 * sF);

          // Glass-like translucent curved whiskers radiating beautifully
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 0.85 * sF;
          // Whisker 1 (curving down)
          ctx.beginPath();
          ctx.moveTo(11.5 * sF, -0.5 * sF);
          ctx.quadraticCurveTo(20.0 * sF, 1.5 * sF, 25.5 * sF, 4.0 * sF);
          ctx.stroke();
          // Whisker 2 (horizontal)
          ctx.beginPath();
          ctx.moveTo(12.0 * sF, -1.2 * sF);
          ctx.quadraticCurveTo(21.0 * sF, -1 * sF, 27.5 * sF, -0.5 * sF);
          ctx.stroke();
          // Whisker 3 (curving up)
          ctx.beginPath();
          ctx.moveTo(10.5 * sF, -2 * sF);
          ctx.quadraticCurveTo(19.0 * sF, -4 * sF, 24.5 * sF, -5.5 * sF);
          ctx.stroke();

          // --- REALISTIC FELINE EYE (Glowing Amber Iris, or burning crimson fury RED) ---
          ctx.save();
          // Eyeliner / socket stroke (gives feline look)
          ctx.fillStyle = '#0F0906';
          ctx.beginPath();
          ctx.ellipse(2 * sF, -6 * sF, 5.0 * sF, 3.4 * sF, -Math.PI / 12, 0, Math.PI * 2);
          ctx.fill();

          // Glowing feline eye
          const fePulse = Math.sin(Date.now() / 90) * (isFury ? 2.5 : 1);
          ctx.shadowBlur = (isFury ? 15 : 9) + fePulse;
          ctx.shadowColor = isFury ? '#FF2222' : '#F59E0B';
          ctx.fillStyle = isFury ? '#FF1111' : '#FBBF24'; 
          ctx.beginPath();
          ctx.ellipse(2 * sF, -6 * sF, (3.6 + fePulse * 0.15) * sF, (2.4 + fePulse * 0.1) * sF, -Math.PI / 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow for pupils

          // Fierce crimson/white vertical slit pupil
          ctx.fillStyle = isFury ? '#FFFFFF' : '#E11D48'; // White core if in fury for maximum intensity!
          ctx.fillRect(2.1 * sF, -7 * sF, 1.1 * sF, 2.2 * sF);
          ctx.fillStyle = '#000000'; // black core slit
          ctx.fillRect(2.3 * sF, -6.6 * sF, 0.7 * sF, 1.4 * sF);

          // Tiny specular reflective shine
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(1.1 * sF, -6.8 * sF, 0.75 * sF, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // --- ROARING FELINE MOUTH & SHARP CANINE INCISORS ---
          ctx.fillStyle = '#1C1917'; // deep throat darkness
          ctx.beginPath();
          ctx.moveTo(4 * sF, 2 * sF);
          ctx.lineTo(13 * sF, 2.5 * sF);
          ctx.lineTo(10.5 * sF, 8.0 * sF);
          ctx.lineTo(4 * sF, 6.5 * sF);
          ctx.closePath();
          ctx.fill();

          // Fierce pink tongue
          ctx.fillStyle = '#F43F5E';
          ctx.beginPath();
          ctx.ellipse(8.0 * sF, 5.2 * sF, 3.7 * sF, 2.0 * sF, Math.PI / 12, 0, Math.PI * 2);
          ctx.fill();

          // Upper Majestic Feline Fang (Canine)
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(5.2 * sF, 1.8 * sF);
          ctx.quadraticCurveTo(7.0 * sF, 2 * sF, 7.3 * sF, 5.5 * sF);
          ctx.quadraticCurveTo(6.4 * sF, 4 * sF, 6.0 * sF, 1.8 * sF);
          ctx.closePath();
          ctx.fill();

          // Lower Feline Fang (Canine reaching up)
          ctx.beginPath();
          ctx.moveTo(9.0 * sF, 6.8 * sF);
          ctx.quadraticCurveTo(9.5 * sF, 5.5 * sF, 10.3 * sF, 4.3 * sF);
          ctx.quadraticCurveTo(10.7 * sF, 6.0 * sF, 10.0 * sF, 6.8 * sF);
          ctx.closePath();
          ctx.fill();

          // Feline incisors in middle
          ctx.fillStyle = '#E2E8F0';
          ctx.fillRect(4.2 * sF, 1.9 * sF, 0.8 * sF, 1 * sF);
          ctx.fillRect(5.0 * sF, 1.9 * sF, 0.8 * sF, 1 * sF);

          ctx.restore(); // restore translated coordinates for lion head

          // Sparking Fire/Dust Embers from Lion's pure fury
          if (Math.random() < 0.15) {
            const driftRight = facingLeft ? -1 : 1;
            const noseX = enemy.x + (facingLeft ? enemy.width - 12 * sF : 12 * sF);
            const noseY = enemy.y + 14 * sF;
            particles.push({
              x: noseX,
              y: noseY,
              vx: driftRight * (1.1 + Math.random() * 0.9),
              vy: -0.2 - Math.random() * 0.5,
              color: Math.random() < 0.5 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(245, 158, 11, 0.65)',
              radius: 1 + Math.random() * 2,
              life: 25 + Math.floor(Math.random() * 25)
            });
          }
        }
        
        ctx.restore(); // restore translated coordinates
        
        // Render HP bar for minions or bosses
        if (!enemy.isBoss && enemy.maxHp > 1) {
          ctx.fillStyle = '#374151';
          ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 3.5);
          ctx.fillStyle = '#22C55E';
          ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * (enemy.hp / enemy.maxHp), 3.5);
        }
      });

      // Player young Davi (or legendary Golden King David)
      const isGolden = characterSelected === 'rei_david';
      
      // Dynamic trail particles behind David
      if (Math.abs(player.vx) > 0.1) {
        if (player.grounded && Math.random() < 0.38) {
          particles.push({
            x: player.x + player.width / 2 + (player.direction === 'right' ? -player.width / 3 : player.width / 3),
            y: player.y + player.height,
            vx: -player.vx * 0.15 + (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 1) * 1.5,
            radius: Math.random() * 2.5 + 1,
            color: isGolden ? 'rgba(245, 158, 11, 0.4)' : 'rgba(226, 232, 240, 0.45)',
            life: 16
          });
        }
      }
      if (isGolden && Math.random() < 0.3) {
        particles.push({
          x: player.x + Math.random() * player.width,
          y: player.y + Math.random() * player.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -Math.random() * 1.2 - 0.3,
          radius: Math.random() * 2 + 1,
          color: '#FDE047',
          life: 20
        });
      }

      const duckOffset = player.isDucking ? 12 : 0;
      const headX = player.x + player.width / 2;
        
        // --- 2D GROUND SHADOW (Drawn flat under feet base for realistic grounding) ---
        if (player.grounded) {
          ctx.save();
          const shadowX = player.x + player.width / 2;
          const shadowY = player.y + player.height;
          // Shorter, wider shadow if ducking
          const shadowW = player.isDucking ? player.width * 1.25 : player.width * 1.05;
          const shadowH = player.isDucking ? 5 : 4;
          const shadowGrad = ctx.createRadialGradient(shadowX, shadowY, 1, shadowX, shadowY, shadowW);
          shadowGrad.addColorStop(0, 'rgba(15, 23, 42, 0.55)');
          shadowGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.22)');
          shadowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
          ctx.fillStyle = shadowGrad;
          ctx.beginPath();
          ctx.ellipse(shadowX, shadowY, shadowW, shadowH, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Light faint shadow under airborne jump heights to give high-res spatial depth
          ctx.save();
          const shadowX = player.x + player.width / 2;
          const shadowY = player.y + player.height + Math.max(0, -player.vy * 1.5); // ground reference approx
          // Scale size and opacity down with altitude height
          const altFactor = Math.min(1.5, Math.abs(player.vy) / 8); 
          const shadowW = player.width * (0.9 - altFactor * 0.21);
          const shadowGrad = ctx.createRadialGradient(shadowX, shadowY, 0.5, shadowX, shadowY, Math.max(5, shadowW));
          shadowGrad.addColorStop(0, `rgba(15, 23, 42, ${Math.max(0.05, 0.28 - altFactor * 0.12)})`);
          shadowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
          ctx.fillStyle = shadowGrad;
          ctx.beginPath();
          ctx.ellipse(shadowX, shadowY, Math.max(5, shadowW), 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

         // --- 2D BODY MOVEMENTS & SQUASH/STRETCH ENHANCEMENTS ---
        ctx.save();

        // If the player has invincibility frames, pulse the alpha smoothly to show warning but KEEP visible and polished!
        if (player.invincibilityFrames > 0) {
          ctx.globalAlpha = (Math.floor(Date.now() / 70) % 2 === 0) ? 0.38 : 0.85;
        }
        
        // Pivot around center bottom of player (feet base)
        ctx.translate(player.x + player.width / 2, player.y + player.height);
        
        // Dynamic athletic torso lean forward/backward with movement velocity & throw mechanics
        const baseTilt = player.vx * 0.038;
        
        // Throw lean mechanics: wind-up leans backwards, release snaps forward violently!
        let throwTilt = 0;
        const isAttacking = player.attackAnimTimer > 0;
        if (isAttacking) {
          const progress = (14 - player.attackAnimTimer) / 14; // 0 to 1
          if (progress < 0.42) {
            // Wind-up: pull torso back from direct throw target
            throwTilt = -0.19;
          } else {
            // Release snap: fling torso forward towards target
            throwTilt = 0.24;
          }
        }
        
        // Jump body rotation: lean relative to facing direction & vertical speed for natural athletic look
        let jumpTilt = 0;
        if (!player.grounded) {
          const dirSign = player.direction === 'right' ? 1 : -1;
          // Leans forward on ascent, leans slightly back on descent
          jumpTilt = -player.vy * 0.016 * dirSign;
        }
        
        const tiltAngle = baseTilt + throwTilt + jumpTilt;
        ctx.rotate(tiltAngle);
        
        // Dynamic Squash & stretch based on precise physical state (airborne velocity, crouching, or landing impact)
        let scaleX = 1;
        let scaleY = 1;
        const landingSquash = player.landingSquash || 0;
        
        if (!player.grounded) {
          if (player.jumpCount >= 2) {
            // "Encolhe quando for o pulo duplo" - compact curled shape
            scaleY = 0.82; 
            scaleX = 0.82;
          } else if (player.vy < 0) {
            // Highly elastic vertical stretch when ascending/jumping - proportional to speed!
            const stretchVal = Math.min(0.24, Math.abs(player.vy) * 0.015);
            scaleY = 1.0 + stretchVal; 
            scaleX = 0.98 - stretchVal * 0.8;
          } else {
            // Organic compression/crouching prep when falling rapidly
            const squashVal = Math.min(0.15, player.vy * 0.012);
            scaleY = 1.0 - squashVal; 
            scaleX = 1.02 + squashVal * 0.8;
          }
        } else if (player.isDucking) {
          scaleY = 0.65; // deep crouch squash
          scaleX = 1.35;
        } else if (landingSquash > 0.01) {
          scaleY = 1 - landingSquash;
          scaleX = 1 + landingSquash;
        }
        ctx.scale(scaleX, scaleY);

        // --- HORIZONTAL MIRRORING FOR DIRECTION ---
        // If the player is facing left, we mirror him horizontally so he is always
        // perfectly side-profile ('de lado para a tela') and walks in the correct direction!
        if (player.direction === 'left') {
          ctx.scale(-1, 1);
        }
 
        // Sub-pixel natural joint bobs
        // Gentle rise and fall when breathing idle
        const idleBob = player.vx === 0 && player.grounded ? Math.sin(player.idleCycle || 0) * 0.75 : 0;
        // Heavy stepping drop and rise during run cycle
        const runBob = player.vx !== 0 && player.grounded ? Math.abs(Math.sin(player.walkCycle * 0.85)) * 2.5 : 0;
        const bodyBob = idleBob + runBob;
 
        // Dynamic head coordinates
        const headY = -42 + duckOffset + bodyBob;
        
        // --- 1. JOINTED HUMAN LEG KINEMATICS & GAIT (Elliptical Run Paths) ---
        let fLeftXOffset = 0, fLeftYOffset = 0;
        let fRightXOffset = 0, fRightYOffset = 0;
 
        if (!player.grounded) {
          if (player.jumpCount >= 2) {
            // PULO DUPLO: ENCOLHER AS PERNAS (Tucked/retracted tightly under body)
            fLeftYOffset = -16.0;   fRightYOffset = -15.0;
            fLeftXOffset = -1.2;    fRightXOffset = 1.2;
          } else {
            // PRIMEIRO PULO: ABRIR AS PERNAS (Dramatic wide jumping leg split!)
            if (player.vy < 0) {
               fLeftYOffset = -8.5;   fRightYOffset = -8.5;
               fLeftXOffset = -19.0;  fRightXOffset = 19.0;
            } else {
               // Falling part of first jump: still split wide, but readying for land
               fLeftYOffset = -4.0;   fRightYOffset = -4.0;
               fLeftXOffset = -15.0;  fRightXOffset = 15.0;
            }
          }
        } else if (player.isDucking) {
          fLeftYOffset = -6;    fRightYOffset = -6;
          fLeftXOffset = -4.5;  fRightXOffset = 4.5;
        } else if (player.walkCycle) {
          // Circular human tracking walk cycle
          fLeftXOffset = Math.sin(player.walkCycle) * 7.8;
          fLeftYOffset = -Math.max(0, Math.cos(player.walkCycle)) * 4.8;
          
          fRightXOffset = Math.sin(player.walkCycle + Math.PI) * 7.8;
          fRightYOffset = -Math.max(0, Math.cos(player.walkCycle + Math.PI)) * 4.8;
        }
 
        // Hips pivot coordinates relative to feet bottom (center X = 0)
        const hipLeftX = -3.8;
        const hipLeftY = -13 + duckOffset;
        const hipRightX = 3.8;
        const hipRightY = -13 + duckOffset;
 
        // Feet Target Endpoints (ground touching coordinates)
        const footLeftX = -3.8 + fLeftXOffset;
        const footLeftY = fLeftYOffset;
        const footRightX = 3.8 + fRightXOffset;
        const footRightY = fRightYOffset;
 
        // Knees Positions for jointed bend structure!
        const kneeLeftX = (hipLeftX + footLeftX) / 2 + 1.2;
        const kneeLeftY = (hipLeftY + footLeftY) / 2;
        const kneeRightX = (hipRightX + footRightX) / 2 + 1.2;
        const kneeRightY = (hipRightY + footRightY) / 2;

        // --- RENDER DYNAMIC BILLOWING CAPE / CLOAK (Capa Real) ---
        // Only draw cape for King David (isGolden). Young David has no cape to match cartoon reference!
        if (isGolden) {
          ctx.save();
          const capeWiggle = Math.sin((Date.now() / 140) + player.x * 0.04) * 4;
          const capeSwingX = (player.vx * -2.4) - 8 + (player.vy * 0.4) + capeWiggle;
          const capeSwingY = Math.max(-10, player.vy * -0.5);
          
          const capeGrad = ctx.createLinearGradient(-12, headY + 8, capeSwingX - 16, -10 + capeSwingY);
          // Royal Kingly Purple
          capeGrad.addColorStop(0, '#8B5CF6'); // Rich Violet
          capeGrad.addColorStop(0.5, '#6D28D9'); // Royal Purple
          capeGrad.addColorStop(1, '#4C1D95'); // Deep Imperial Purple
          
          ctx.fillStyle = capeGrad;
          ctx.beginPath();
          ctx.moveTo(-4, headY + 7); // cape collar base
          ctx.quadraticCurveTo(-15, headY + 8, capeSwingX - 22, headY + 22 + capeSwingY); // billowing upper line
          ctx.lineTo(capeSwingX - 15, -4 + capeSwingY); // trailing lower edge
          ctx.quadraticCurveTo(-12, -7, -9, -13 + duckOffset); // back tuck-in
          ctx.closePath();
          ctx.fill();

          // Elegant Gold border embroideries on the cape edges
          ctx.strokeStyle = '#FBBF24';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(-4, headY + 7);
          ctx.quadraticCurveTo(-15, headY + 8, capeSwingX - 22, headY + 22 + capeSwingY);
          ctx.lineTo(capeSwingX - 15, -4 + capeSwingY);
          ctx.stroke();
          ctx.restore();
        }

        // Render Jointed Left Leg (Rear leg layer)
        // Thigh
        ctx.strokeStyle = isGolden ? '#78350F' : '#5C3A21';
        ctx.lineWidth = 6.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hipLeftX, hipLeftY);
        ctx.lineTo(kneeLeftX, kneeLeftY);
        ctx.stroke();
        // Calf Bare Skin with organic muscle tone curves
        ctx.strokeStyle = '#FDBA74'; // Slightly shaded flesh
        ctx.lineWidth = 4.8;
        ctx.beginPath();
        ctx.moveTo(kneeLeftX, kneeLeftY);
        ctx.lineTo(footLeftX, footLeftY - 3.5);
        ctx.stroke();
        
        // High-Resolution Gladiator Sandal ankle laces wrapping details (criss-cross lines)
        ctx.strokeStyle = '#5c2200'; // dark brown leather lacing
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(kneeLeftX - 1.5, (kneeLeftY + footLeftY) / 2 - 2);
        ctx.lineTo(footLeftX + 1.5, footLeftY - 4);
        ctx.moveTo(kneeLeftX + 1.5, (kneeLeftY + footLeftY) / 2 - 2);
        ctx.lineTo(footLeftX - 1.5, footLeftY - 4);
        ctx.stroke();
 
        // Sandals Sole Highlight
        ctx.fillStyle = '#78350F'; // Dark leather straps
        ctx.fillRect(footLeftX - 4, footLeftY - 5.5, 8, 3);
        ctx.fillStyle = '#451A03'; // Thick sole
        ctx.fillRect(footLeftX - 6, footLeftY - 2.5, 12, 2.7);
 
        // Render Jointed Right Leg (Front leg layer)
        // Thigh
        ctx.strokeStyle = isGolden ? '#92400E' : '#7D4F27';
        ctx.lineWidth = 6.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hipRightX, hipRightY);
        ctx.lineTo(kneeRightX, kneeRightY);
        ctx.stroke();
        // Calf Bare Skin
        ctx.strokeStyle = '#FED7AA'; // Sunlight-side bright flesh
        ctx.lineWidth = 4.8;
        ctx.beginPath();
        ctx.moveTo(kneeRightX, kneeRightY);
        ctx.lineTo(footRightX, footRightY - 3.5);
        ctx.stroke();
        
        // Gladiator ankle laces context
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(kneeRightX - 1.5, (kneeRightY + footRightY) / 2 - 2);
        ctx.lineTo(footRightX + 1.5, footRightY - 4);
        ctx.moveTo(kneeRightX + 1.5, (kneeRightY + footRightY) / 2 - 2);
        ctx.lineTo(footRightX - 1.5, footRightY - 4);
        ctx.stroke();
 
        // Sandals Sole Highlight
        ctx.fillStyle = '#78350F';
        ctx.fillRect(footRightX - 4, footRightY - 5.5, 8, 3);
        ctx.fillStyle = '#451A03';
        ctx.fillRect(footRightX - 6, footRightY - 2.5, 12, 2.7);
 
        // --- 2. TUNIC BODY (Side-profile torso curve with bouncing chest & fabric folds) ---
        const tunicTopY = headY + 5;
        const tunicBottomY = -11;

        ctx.fillStyle = isGolden ? '#FBBF24' : '#E5E7EB';
        
        const tunicGrad = ctx.createLinearGradient(0, tunicTopY, 0, tunicBottomY);
        if (isGolden) {
          tunicGrad.addColorStop(0, '#FFE082'); // Glistering golden mesh
          tunicGrad.addColorStop(0.5, '#F59E0B'); // Anointed Gold
          tunicGrad.addColorStop(1, '#B45309'); // Rich bronze fold
        } else {
          // Humble rustic peasant/shepherd clothes (Roupa de Camponês) in rustic sage/olive green and field burlap tones
          tunicGrad.addColorStop(0, '#84CC16'); // Sage green top
          tunicGrad.addColorStop(0.5, '#65A30D'); // Warm olive middle
          tunicGrad.addColorStop(1, '#3F6212'); // Dark mossy hem
        }
        ctx.fillStyle = tunicGrad;
        
        // Beautiful side-profile tunic shape curve
        ctx.beginPath();
        ctx.moveTo(-5.5, tunicTopY);
        ctx.quadraticCurveTo(-7.5, (tunicTopY + tunicBottomY) / 2, -5.5, tunicBottomY); // Back spine curve
        ctx.lineTo(5.5, tunicBottomY); // Hemline
        ctx.quadraticCurveTo(8.5, (tunicTopY + tunicBottomY) / 2, 6.0, tunicTopY); // Chest puff forward
        ctx.closePath();
        ctx.fill();

        // Gold border embroidery along the tunic hemline
        ctx.strokeStyle = isGolden ? '#FFF' : '#E2E8F0';
        ctx.lineWidth = 1.3;
        ctx.strokeRect(-5.8, tunicBottomY - 1, 11.6, 1.3);
 
        // Organic fabric draping fold highlights
        ctx.strokeStyle = isGolden ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-4, tunicTopY + 4);
        ctx.lineTo(-2, tunicBottomY - 4);
        ctx.moveTo(-1, tunicTopY + 2);
        ctx.lineTo(1.5, tunicBottomY - 2);
        ctx.moveTo(2, tunicTopY + 5);
        ctx.lineTo(0.5, tunicBottomY - 3);
        ctx.stroke();
 
        // Shepherd's Leather Satchel / Pouch (Alforje) crossing from chest back
        ctx.strokeStyle = '#5c2200'; // leather strap
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-3, tunicTopY + 2);
        ctx.lineTo(5, tunicBottomY - 3);
        ctx.stroke();

        // Pouch box hanging on hip:
        if (isGolden) {
          ctx.fillStyle = '#78350F';
          ctx.fillRect(4, tunicBottomY - 8, 4.5, 8);
          ctx.fillStyle = '#451A03';
          ctx.fillRect(3.5, tunicBottomY - 6, 6, 1.8);
        } else {
          // Rounded brown leather purse saddle bag matching reference!
          ctx.fillStyle = '#78350F';
          ctx.beginPath();
          ctx.arc(5.8, tunicBottomY - 3.8, 4.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#451A03'; // flap
          ctx.fillRect(2.2, tunicBottomY - 7.5, 6.8, 2.4);
        }
        
        // Waist belt tied tightly - for young David it's a beautiful dynamic Blue Sash (Faixa azul)!
        const beltY = tunicTopY + 13;
        if (isGolden) {
          ctx.fillStyle = '#451A03'; // leather belt
          ctx.fillRect(-6.5, beltY, 13.0, 4.5);
          
          ctx.fillStyle = '#F59E0B'; // bronze-golden buckle
          ctx.fillRect(0, beltY - 1, 5, 6.5);
          ctx.fillStyle = '#FFFFFF'; // buckle highlight glint
          ctx.fillRect(3, beltY, 1.8, 1.8);
        } else {
          // Dynamic flowing blue sash
          ctx.fillStyle = '#2563EB'; // Vibrant Blue primary
          ctx.fillRect(-6.5, beltY, 13.0, 4.8);
          // Highlight crease
          ctx.fillStyle = '#60A5FA';
          ctx.fillRect(-6.5, beltY + 1, 13.0, 1.3);
          
          // Hanging sash tail tassel!
          ctx.fillStyle = '#1D4ED8'; // Darker blue base
          ctx.fillRect(-5.5, beltY + 4, 3.2, 9.5);
          ctx.fillStyle = '#60A5FA'; // Highlight
          ctx.fillRect(-4.5, beltY + 4, 1.2, 9.5);
        }
 
        // --- 3. DUAL-ARM DESIGN (In relative coordinates, assumes facing RIGHT) ---
        const rearArmColor = '#FDBA74'; // Shaded behind torso
        const frontArmColor = '#FED7AA'; // Direct bright lighting
        const armWalkAngle = player.walkCycle ? Math.sin(player.walkCycle) : 0;
        
        // BACK REAR ARM (Drawn in background depth layer)
        ctx.save();
        ctx.fillStyle = rearArmColor;
        ctx.translate(-4, tunicTopY + 6);
        if (isAttacking) {
          ctx.rotate(0.8);
        } else {
          ctx.rotate(-armWalkAngle * 0.45);
        }
        ctx.fillRect(-2, 0, 4.5, 12);
        if (!isGolden) {
          ctx.fillStyle = '#78350F'; // leather wrist cuff
          ctx.fillRect(-2.2, 7.5, 4.9, 2.8);
        }
        ctx.restore();
 
        // FRONT ARM (Drawn over Tunic layer)
        ctx.save();
        ctx.fillStyle = frontArmColor;
        const fShoulderX = 4;
        const fShoulderY = tunicTopY + 6;
        ctx.translate(fShoulderX, fShoulderY);
        
        if (isAttacking) {
          const progress = (14 - player.attackAnimTimer) / 14; 
          if (progress < 0.42) {
            // Wind-up: Arm cocked back
            ctx.rotate(-Math.PI / 3.5);
            ctx.fillRect(-3, 0, 6, 12.5);
            if (!isGolden) {
              ctx.fillStyle = '#78350F'; // leather wrist cuff
              ctx.fillRect(-3.2, 8.0, 6.4, 2.8);
            }
          } else {
            // Snap Release: points right at target
            ctx.rotate(Math.PI / 4.5);
            ctx.fillRect(-3, 0, 14, 5.5);
            if (!isGolden) {
              ctx.fillStyle = '#78350F'; // leather wrist cuff
              ctx.fillRect(8.0, -0.2, 2.8, 5.9);
            }
            ctx.fillStyle = frontArmColor;
            ctx.beginPath();
            ctx.arc(13, 2.7, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Walking swing
          ctx.rotate(armWalkAngle * 0.45);
          ctx.fillRect(-2.2, 0, 5.2, 11);
          if (!isGolden) {
            ctx.fillStyle = '#78350F'; // leather wrist cuff
            ctx.fillRect(-2.4, 6.8, 5.6, 2.8);
          }
        }
        ctx.restore();
 
        // --- 4. BACK HAIR (Shadow & base coppery curls behind head) ---
        const baseHair = isGolden ? '#F97316' : '#EA580C'; // Vibrant ginger hair description
        const shadowHair = isGolden ? '#9A3412' : '#7C2D12'; // Deep warm ginger shadow
        const highlightHair = isGolden ? '#FB923C' : '#FB923C'; // Sunny copper highlight
        
        const hairWindX = player.vx * -0.52;
        const hairWindY = player.vy * -0.16;
        
        // Draw back shadow hair curls first
        ctx.fillStyle = shadowHair;
        ctx.beginPath();
        ctx.arc(hairWindX - 4, headY - 3 + hairWindY, 9.8, 0, Math.PI * 2);
        ctx.arc(hairWindX - 8, headY + 1 + hairWindY, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw back base hair curls (the coppery brown mane)
        ctx.fillStyle = baseHair;
        ctx.beginPath();
        ctx.arc(hairWindX - 3.5, headY - 4 + hairWindY, 9.2, 0, Math.PI * 2);
        ctx.arc(hairWindX - 7.5, headY + 0.5 + hairWindY, 5.0, 0, Math.PI * 2);
        ctx.arc(hairWindX - 5.5, headY - 7.0 + hairWindY, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // --- 5. HIGH-RESOLUTION NECK & SIDESTANCE HEAD (Biblical Skin Glow on top of Back Hair) ---
        // Neck
        const neckY = headY + 7;
        ctx.fillStyle = '#FED7AA';
        ctx.fillRect(-3.8, neckY, 7.6, 5.5);
        ctx.fillStyle = '#FDBA74'; // Neck shade
        ctx.fillRect(-3.8, neckY, 2.6, 5.5);
 
        // Radial Flesh Head
        const skinGrad = ctx.createRadialGradient(0, headY, 1, 0, headY, 9.5);
        skinGrad.addColorStop(0, '#FFE4E6'); // Rose cheeks
        skinGrad.addColorStop(0.8, '#FED7AA'); // Flesh primary
        skinGrad.addColorStop(1, '#FDBA74'); // Warm shade
        ctx.fillStyle = skinGrad;
        ctx.beginPath();
        ctx.arc(0, headY, 9.5, 0, Math.PI * 2);
        ctx.fill();
 
        // HIGH-FIDELITY SIDE-PROFILE NOSE pointing forward (right)
        ctx.fillStyle = '#FED7AA';
        ctx.beginPath();
        ctx.moveTo(8.0, headY - 3.5);  // forehead nose bridge
        ctx.lineTo(13.2, headY - 1.0);  // sharp nose tip pointing right!
        ctx.lineTo(8.5, headY + 1.0);  // nose base
        ctx.closePath();
        ctx.fill();
 
        // Determined, expressive individual eye (only one visible in profile!)
        const eyeOffset = 3.5;
        ctx.fillStyle = '#0F172A'; // Obsidian iris
        ctx.fillRect(eyeOffset, headY - 3, 2.5, 2.5);
        ctx.fillStyle = '#FFFFFF'; // spark glint
        ctx.fillRect(eyeOffset + 1.2, headY - 3.2, 1.0, 1.0);
        
        ctx.strokeStyle = '#35210B'; // Eye eyebrow matching chestnut hair
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(eyeOffset - 1.5, headY - 4.6);
        ctx.lineTo(eyeOffset + 2.5, headY - 4.6);
        ctx.stroke();
 
        // Heroic Smile
        ctx.strokeStyle = '#B91C1C';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(5.5, headY + 2.5, 1.8, 0, Math.PI * 0.85);
        ctx.stroke();
 
        // Rosy high-contrast healthy cheek glow
        ctx.fillStyle = 'rgba(239, 68, 68, 0.28)';
        ctx.beginPath();
        ctx.arc(2.0, headY + 0.5, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // MAJESTIC HANDSOME GINGER BEARD (Barba do pastor ruivo) - Only for King David (isGolden)
        if (isGolden) {
          ctx.fillStyle = baseHair;
          ctx.beginPath();
          ctx.moveTo(-5, headY + 2); // Ear-line
          ctx.quadraticCurveTo(-3, headY + 9, 2, headY + 9.5); // Jaw/chin shape
          ctx.quadraticCurveTo(8, headY + 8.5, 7.5, headY + 3);  // Upper beard line
          ctx.quadraticCurveTo(5, headY + 4, 3, headY + 6);
          ctx.closePath();
          ctx.fill();
          
          // Curly tufts of beard highlights for 3D realism
          ctx.fillStyle = highlightHair;
          ctx.beginPath();
          ctx.arc(3.5, headY + 9, 3.2, 0, Math.PI * 2);
          ctx.arc(7.5, headY + 7.5, 2.5, 0, Math.PI * 2);
          ctx.arc(-1.0, headY + 9.5, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // --- 6. FRONT HAIR / BANGS & DETAILS (Draped over crown and forehead) ---
        ctx.fillStyle = baseHair;
        ctx.beginPath();
        // Top-center hair volume (bangs) centered high up to clear eyes
        ctx.arc(hairWindX - 1.5, headY - 8.5 + hairWindY, 5.5, 0, Math.PI * 2);
        ctx.arc(hairWindX + 3.0, headY - 8.0 + hairWindY, 4.2, 0, Math.PI * 2); // front top curl
        // Sideburn (near ear/back of jaw)
        ctx.arc(hairWindX - 3.2, headY + 1.2 + hairWindY, 3.8, 0, Math.PI * 2);
        ctx.fill();

        // Topfrontal highlights strands
        ctx.fillStyle = highlightHair;
        ctx.beginPath();
        ctx.arc(hairWindX - 1.8, headY - 9.5 + hairWindY, 2.8, 0, Math.PI * 2);
        ctx.arc(hairWindX + 2.8, headY - 9.0 + hairWindY, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Leather headband around forehead from reference cartoon
        if (!isGolden) {
          ctx.strokeStyle = '#451A03'; // Dark leather brown
          ctx.lineWidth = 1.8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          // Profile curve wrapping around his forehead perfectly
          ctx.arc(0, headY, 9.6, -Math.PI * 0.35, Math.PI * 0.18);
          ctx.stroke();
        }
        
        // Golden Crown over King David golden state
        if (isGolden) {
          ctx.save();
          ctx.translate(1, headY - 13);
          
          // Corona base
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.moveTo(-7, 3);
          ctx.lineTo(-9, -2);
          ctx.lineTo(-4, 1);
          ctx.lineTo(0, -6);
          ctx.lineTo(4, 1);
          ctx.lineTo(9, -2);
          ctx.lineTo(7, 3);
          ctx.closePath();
          ctx.fill();
          
          // Bright crown overlay
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Tiny rubies and emerald elements on crown spikes
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(-9, -2, 1.2, 0, Math.PI * 2);
          ctx.arc(9, -2, 1.2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#10B981';
          ctx.beginPath();
          ctx.arc(0, -6, 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
 
        // --- 6. FUNDA ACTION LOGIC (Sling Throw) ---
        ctx.strokeStyle = '#854D0E'; // leather/flax cord
        ctx.lineWidth = 2.1;
        
        if (isAttacking) {
          const progress = (14 - player.attackAnimTimer) / 14; 
          if (progress < 0.42) {
            // Wind-up: Overhead rotation
            ctx.beginPath();
            const frameCycle = (Date.now() / 25) % (Math.PI * 2);
            const rotRadiusX = 18;
            const rotRadiusY = 6;
            const spinX = 4 + Math.cos(frameCycle) * rotRadiusX;
            const spinY = (tunicTopY + 6) - 12 + Math.sin(frameCycle) * rotRadiusY;
            
            ctx.moveTo(4, tunicTopY + 6);
            ctx.quadraticCurveTo((4 + spinX) / 2 - 3, ((tunicTopY + 6) + spinY) / 2 - 4, spinX, spinY);
            ctx.stroke();
            
            // Stone loading
            ctx.fillStyle = '#78350F';
            ctx.beginPath();
            ctx.arc(spinX, spinY, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#94A3B8';
            ctx.beginPath();
            ctx.arc(spinX, spinY, 2.5, 0, Math.PI * 2);
            ctx.fill();
 
            // Wind vortex
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(4, (tunicTopY + 6) - 12, rotRadiusX + 2, rotRadiusY + 1, 0, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            // Snap Release: points forward (right)
            ctx.beginPath();
            const shootLength = 22;
            const shootX = 4 + shootLength;
            const shootY = (tunicTopY + 6) + 4;
            
            ctx.moveTo(4, tunicTopY + 6);
            ctx.lineTo(shootX, shootY);
            ctx.stroke();
            
            ctx.fillStyle = '#78350F';
            ctx.beginPath();
            ctx.arc(shootX, shootY, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Velocity shock puff
            const flashGrad = ctx.createRadialGradient(shootX, shootY, 1, shootX, shootY, 9);
            flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
            flashGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.35)');
            flashGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
            ctx.fillStyle = flashGrad;
            ctx.beginPath();
            ctx.arc(shootX, shootY, 9, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Hanging strap relaxed
          ctx.beginPath();
          ctx.moveTo(-5, beltY + 2);
          ctx.quadraticCurveTo(-15, beltY + 11, -8, -18);
          ctx.stroke();
        }
 
        // Golden aura trail
        if (isGolden) {
          ctx.shadowColor = '#FBBF24';
          ctx.shadowBlur = 12;
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
          ctx.strokeRect(-22, -54, 44, 54);
          ctx.shadowBlur = 0;
        }
        
        ctx.restore();

      // Render Floating damage indicator texts (-10, -15, -20)
      floatingTexts.forEach(ft => {
        ctx.save();
        ctx.fillStyle = ft.color;
        ctx.font = 'black 14px "Inter"';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 5;
        const wiggle = Math.sin(ft.life / 6) * 3;
        ctx.fillText(ft.text, ft.x + wiggle, ft.y);
        ctx.restore();
      });

      // Render Active Game Particles
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Close the camera scrolling transform translation
      ctx.restore();

      // Pause Screen overlay (rendered on top of the frozen game scene)
      if (isPausedRef.current) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(0, 0, 800, 400);
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 24px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ JOGO PAUSADO ⚡', 800 / 2, 400 / 2 - 10);
        
        ctx.fillStyle = '#94A3B8';
        ctx.font = '500 13px "Inter"';
        ctx.fillText('Clique no botão ⏸️ para continuar defendendo o rebanho', 800 / 2, 400 / 2 + 25);
        ctx.textAlign = 'left'; // restore alignment
      }

      // Continue game loop if still playing
      if (gameState === 'playing_2d' && localGameResult === 'playing') {
        animFrameId = requestAnimationFrame(update);
      }
    };

    // Trigger frame animations
    animFrameId = requestAnimationFrame(update);

    // cleanup
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, activeFase, characterSelected, gameSessionId, canvasElement]);

  // Handle phase completion hooks & achievements
  const onFaseCompleted = () => {
    sfx.playDivine();
    const phaseId = `fase${activeFase}`;
    store.setCompletedPhase(phaseId);
    
    // Distribute rewards specifically calculated
    const pts = activeFase === 1 ? 100 : activeFase === 2 ? 250 : 500;
    const coinsReward = activeFase === 1 ? 50 : activeFase === 2 ? 100 : 180;
    
    store.addVictoryPoints(pts);
    store.addCoins(coinsReward);

    // Unlocking distinct badges & achievements
    if (activeFase === 1) store.unlockMedal("Matador de Lobos");
    if (activeFase === 2) store.unlockMedal("Derrubador de Ursos");
    if (activeFase === 3) {
      store.unlockMedal("Vencedor de Leões");
      // Ready to trigger final cutscene and access 3D Bonus stage!
    }
  };

  // --- FAUX-3D / RUNNER 3D BONUS GAME ENGINE ---
  const [canvas3DElement, setCanvas3DElement] = useState<HTMLCanvasElement | null>(null);
  const [distance3D, setDistance3D] = useState(0);
  const [is3DGameOver, setIs3DGameOver] = useState(false);
  const is3DGameOverRef = useRef(false);
  const [activeVersePrompt, setActiveVersePrompt] = useState<{ title: string; text: string } | null>(null);
  const activeVersePromptRef = useRef<{ title: string; text: string } | null>(null);

  // Persistent 3D session refs to survive mid-game state/Zustand re-renders
  const progressDist3DRef = useRef(0);
  const localCoins3DRef = useRef(0);
  const targetLane3DRef = useRef(1);
  const currentLaneX3DRef = useRef(1.0);
  const activePauseVerseDistRef = useRef(0);
  const entities3DRef = useRef<any[]>([]);
  const sideObjects3DRef = useRef<any[]>([]);
  const floatingTexts3DRef = useRef<any[]>([]);

  const set3DGameOverVal = (val: boolean) => {
    setIs3DGameOver(val);
    is3DGameOverRef.current = val;
  };

  const setActiveVersePromptVal = (val: { title: string; text: string } | null) => {
    setActiveVersePrompt(val);
    activeVersePromptRef.current = val;
  };

  useEffect(() => {
    if (gameState !== 'playing_3d' || !canvas3DElement) return;

    const canvas = canvas3DElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame3D: number;
    set3DGameOverVal(false);
    setDistance3D(Math.round(progressDist3DRef.current));
    setActiveVersePromptVal(null);

    canvas.width = 800;
    canvas.height = 400;

    const vanishingX = 400;
    const vanishingY = 160;

    let progressDist = progressDist3DRef.current;
    let localCoins3D = localCoins3DRef.current;
    let targetLane = targetLane3DRef.current; // 0: Left, 1: Middle, 2: Right
    let currentLaneX = currentLaneX3DRef.current; // interpolation matching lanes
    const lanePositions = [200, 400, 600]; // matching horizon lanes projection

    // Player runner state
    const runner = {
      y: 366,
      radius: 18,
      facing: 'forward',
      jumpHeight: 0,
      jumpVelocity: 0,
      isGrounded: true,
      landSquish: 0,
      state: 'correndo' // 'correndo' represents active running animation, 'saltando' is jumping
    };

    // Runner Lane controls
    const moveLeftLane = () => {
      if (targetLane > 0) {
        targetLane--;
        sfx.playJump();
      }
    };
    const moveRightLane = () => {
      if (targetLane < 2) {
        targetLane++;
        sfx.playJump();
      }
    };
    const trigger3DJump = () => {
      if (runner.isGrounded) {
        runner.jumpVelocity = 15.2;
        runner.isGrounded = false;
        runner.state = 'saltando';
        sfx.playJump();
      }
    };

    // Key mapping for 3D game
    const handleKD3D = (e: KeyboardEvent) => {
      if (activeVersePromptRef.current) return; // frozen on scriptures
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeftLane();
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRightLane();
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') trigger3DJump();
    };

    window.addEventListener('keydown', handleKD3D);

    // Obstacles, Animals & Collectibles
    interface RunnerEntity {
      z: number; // depth value 0 (horizon) to 300 (viewport front)
      lane: number;
      type: 'fence' | 'rock' | 'cart' | 'coin' | 'scroll' | 'faith' | 'lion' | 'log' | 'tree' | 'mud' | 'rabbit' | 'fox' | 'goat' | 'sheep' | 'bird';
      collected: boolean;
      altitude?: number; // visual height offset from path surface (for vertical paths)
      animFrame?: number; // animation frame counter
      offsetX?: number; // horizontal lane offset
      speedX?: number; // horizontal speed
      speedZ?: number; // speed adjustment
      bounceY?: number; // visual hop/bounce offset for running animals
    }
    let entities: RunnerEntity[] = entities3DRef.current;
    let spawnTimer = 0;
    let speedCoef = 3.6;

    let activePauseVerseDist = activePauseVerseDistRef.current;

    // Continuous side vegetation and environment wrapping system
    interface SideObject {
      z: number;
      side: 'left' | 'right';
      type: 'tree' | 'shrub';
      scale: number;
    }
    const sideObjects: SideObject[] = sideObjects3DRef.current.length > 0
      ? sideObjects3DRef.current
      : [];
    if (sideObjects.length === 0) {
      for (let i = 0; i < 9; i++) {
        sideObjects.push({
          z: i * 33,
          side: i % 2 === 0 ? 'left' : 'right',
          type: Math.random() < 0.7 ? 'tree' : 'shrub',
          scale: 0.85 + Math.random() * 0.3
        });
      }
      sideObjects3DRef.current = sideObjects;
    }

    // Floating text feedback pill indicators (+10, +2)
    interface FloatingText3D {
      x: number;
      y: number;
      text: string;
      color: string;
      life: number;
      maxLife: number;
    }
    const floatingTexts3D: FloatingText3D[] = floatingTexts3DRef.current;

    // local 3D particles system
    interface Particle3D {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      life: number;
    }
    let particles3D: Particle3D[] = [];

    const createExplosion3D = (x: number, y: number, color: string, count = 8) => {
      for (let i = 0; i < count; i++) {
        particles3D.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          radius: Math.random() * 3 + 1.5,
          color,
          life: 20 + Math.random() * 15
        });
      }
    };

    const gameLoop3D = () => {
      // Check if paused for holy verse scripture overlay or manual screen pause
      if (activeVersePromptRef.current || isPausedRef.current) {
        animFrame3D = requestAnimationFrame(gameLoop3D);
        return;
      }

      // Speed up significantly as runs further (Increased base speed for premium velocity and highly kinetic feedback)
      speedCoef = 14.5 + (progressDist / 300);

      // Increment progress metric distance with swift scroll velocity
      progressDist += speedCoef * 0.245;
      progressDist3DRef.current = progressDist;
      setDistance3D(Math.round(progressDist));
      store.updateMaxDistance(progressDist);

      // Trigger Scripture Milestones every 500m
      const milestone = BONUS_VERSES.find(v => progressDist >= v.distance && activePauseVerseDist < v.distance);
      if (milestone) {
        activePauseVerseDist = milestone.distance;
        activePauseVerseDistRef.current = activePauseVerseDist;
        sfx.playDivine();
        setActiveVersePromptVal(milestone);
        store.unlockVerse(milestone.title);
        // Continue loop frozen
        animFrame3D = requestAnimationFrame(gameLoop3D);
        return;
      }

      // Check final target distance
      if (progressDist >= 3000) {
        setGameState('cutscene');
        store.setCompletedPhase('bonus');
        store.addCoins(500);
        store.addVictoryPoints(1000);
        store.unlockReiDavidChar();
        store.unlockMedal("Guerreiro Ungido");
        return;
      }

      // Explicit Linear Interpolation (lerp) for smooth, fluid horizontal maneuvering
      const lerp = (start: number, end: number, alpha: number) => start + (end - start) * alpha;
      currentLaneX = lerp(currentLaneX, targetLane, 0.44);
      currentLaneX3DRef.current = currentLaneX;
      targetLane3DRef.current = targetLane;

      // Update runner jump physics with snappy gravity response to match high-speed running
      if (!runner.isGrounded) {
        runner.jumpHeight += runner.jumpVelocity;
        runner.jumpVelocity -= 0.82; // Snappy heavy gravity match
        if (runner.jumpHeight <= 0) {
          runner.jumpHeight = 0;
          runner.jumpVelocity = 0;
          runner.isGrounded = true;
          runner.state = 'correndo'; // Reset to running animation state on landing
          runner.landSquish = 10; // Trigger high-resolution compression squeeze on impact!
        }
      } else if (runner.landSquish > 0) {
        runner.landSquish--;
      }

      // Update continuous side environmental objects wraps
      sideObjects.forEach(obj => {
        obj.z += speedCoef;
        if (obj.z > 300) {
          obj.z = 0; // wrap back to horizon!
          obj.side = Math.random() < 0.5 ? 'left' : 'right';
          obj.type = Math.random() < 0.7 ? 'tree' : 'shrub';
          obj.scale = 0.85 + Math.random() * 0.35;
        }
      });

      // Update floating score texts
      floatingTexts3D.forEach(ft => {
        ft.y -= 1.25; // rise upwards
        ft.life--;
      });
      // filter dead floating lines
      const activeFloatingTexts = floatingTexts3D.filter(ft => ft.life > 0);
      floatingTexts3D.length = 0;
      floatingTexts3D.push(...activeFloatingTexts);

      // Spawn elements (fences, coins, logs, animals, trees in patterns)
      spawnTimer++;
      if (spawnTimer > 35) {
        spawnTimer = 0;
        const randLane = Math.floor(Math.random() * 3);
        const randTypeVal = Math.random();
        
        // Pattern-based spawning for coins and collectibles
        if (randTypeVal < 0.35) {
          // 1. Spawning a Golden Coin Arc (Parabolic Jump Pattern)
          const useLane = randLane;
          const heightArc = [10, 24, 28, 24, 10];
          for (let k = 0; k < 5; k++) {
            entities.push({
              z: -k * 22, // staggered depth
              lane: useLane,
              type: 'coin',
              collected: false,
              altitude: heightArc[k],
              animFrame: k * 3
            });
          }
          // Optionally place a log obstacle at the peak landing of the arc!
          if (Math.random() < 0.6) {
            entities.push({
              z: -2 * 22,
              lane: useLane,
              type: 'log',
              collected: false
            });
          }
        } 
        else if (randTypeVal < 0.44) {
          // 2. Spawning a Diagonal Coin Sweep (lane switching)
          const startLane = Math.floor(Math.random() * 2); // 0 or 1
          entities.push({ z: 0, lane: startLane, type: 'coin', collected: false, altitude: 0 });
          entities.push({ z: -20, lane: startLane, type: 'coin', collected: false, altitude: 8 });
          entities.push({ z: -40, lane: startLane + 1, type: 'coin', collected: false, altitude: 15 });
          entities.push({ z: -60, lane: startLane + 1, type: 'coin', collected: false, altitude: 8 });
        } 
        else if (randTypeVal < 0.50) {
          // 3. Spawning Scroll or Faith Drop with visual highlights
          const useLane = randLane;
          const collectType = Math.random() < 0.55 ? 'scroll' : 'faith';
          entities.push({
            z: 0,
            lane: useLane,
            type: collectType,
            collected: false,
            altitude: 18 + Math.random() * 10
          });
          // Put a mud puddle under it
          entities.push({
            z: 0,
            lane: useLane,
            type: 'mud',
            collected: false
          });
        } 
        else {
          // 4. Spawning standard Obstacles and Animals
          const useLane = randLane;
          const hazardRoll = Math.random();
          if (hazardRoll < 0.13) {
            entities.push({ z: 0, lane: useLane, type: 'mud', collected: false });
          } else if (hazardRoll < 0.25) {
            entities.push({ z: 0, lane: useLane, type: 'log', collected: false });
          } else if (hazardRoll < 0.37) {
            entities.push({ z: 0, lane: useLane, type: 'fence', collected: false });
          } else if (hazardRoll < 0.47) {
            entities.push({ z: 0, lane: useLane, type: 'rock', collected: false });
          } else if (hazardRoll < 0.56) {
            entities.push({ z: 0, lane: useLane, type: 'cart', collected: false });
          } else if (hazardRoll < 0.66) {
            entities.push({ z: 0, lane: useLane, type: 'tree', collected: false }); // Redesigned Tree obstacles!
          } else if (hazardRoll < 0.75) {
            entities.push({ z: 0, lane: useLane, type: 'lion', collected: false });
          } else if (hazardRoll < 0.84) {
            // Rabbit jumping across! Starts on side, moves horizontally
            const startSide = Math.random() < 0.5 ? -140 : 140;
            entities.push({ 
              z: 0, 
              lane: useLane, 
              type: 'rabbit', 
              collected: false, 
              offsetX: startSide,
              speedX: startSide < 0 ? 3.5 : -3.5,
              animFrame: 0
            });
          } else if (hazardRoll < 0.91) {
            // Fox running fast
            const startSide = Math.random() < 0.5 ? -150 : 150;
            entities.push({ 
              z: 0, 
              lane: useLane, 
              type: 'fox', 
              collected: false, 
              offsetX: startSide,
              speedX: startSide < 0 ? 4.5 : -4.5,
              animFrame: 0
            });
          } else {
            // Interactive Sheep or Goat on margins
            const sheepSide = Math.random() < 0.5 ? 'sheep' : 'goat';
            entities.push({ 
              z: 0, 
              lane: Math.random() < 0.5 ? 0 : 2, 
              type: sheepSide, 
              collected: false,
              offsetX: Math.random() < 0.5 ? -75 : 75,
              animFrame: Math.floor(Math.random() * 50)
            });
          }
        }
      }

      // Track dynamic entities depth movement and update horizontal AI for animals
      entities.forEach(ent => {
        ent.z += speedCoef;
        ent.animFrame = (ent.animFrame || 0) + 1;

        // Custom update engines for animals
        if (ent.type === 'rabbit') {
          // Bunny hops: periodic bouncing
          ent.bounceY = Math.abs(Math.sin(ent.animFrame * 0.18)) * 13;
          // Slowly cross lanes
          if (ent.offsetX !== undefined && ent.speedX !== undefined) {
            ent.offsetX += ent.speedX * (speedCoef * 0.22);
            // shift lane mapping if offset exceeds column distance
            if (Math.abs(ent.offsetX) > 65) {
              const laneDelta = ent.speedX > 0 ? 1 : -1;
              const nextLane = ent.lane + laneDelta;
              if (nextLane >= 0 && nextLane <= 2) {
                ent.lane = nextLane;
                ent.offsetX -= laneDelta * 70;
              }
            }
          }
        } else if (ent.type === 'fox') {
          // Fast sleek fox sprint
          ent.bounceY = Math.abs(Math.sin(ent.animFrame * 0.32)) * 4.5;
          if (ent.offsetX !== undefined && ent.speedX !== undefined) {
            ent.offsetX += ent.speedX * (speedCoef * 0.25);
            if (Math.abs(ent.offsetX) > 65) {
              const laneDelta = ent.speedX > 0 ? 1 : -1;
              const nextLane = ent.lane + laneDelta;
              if (nextLane >= 0 && nextLane <= 2) {
                ent.lane = nextLane;
                ent.offsetX -= laneDelta * 70;
              }
            }
          }
        } else if (ent.type === 'goat' || ent.type === 'sheep') {
          // Slow passive grazing movement
          ent.bounceY = Math.abs(Math.sin(ent.animFrame * 0.08)) * 2;
        }

        const playerLaneX = vanishingX + (runner.y - vanishingY) * 0.8 * (currentLaneX - 1);
        const playerVisualY = runner.y - runner.jumpHeight;

        // Collision thresholds when item reaches David's front viewport depth (z ~ 245 to 290)
        if (ent.z >= 245 && ent.z <= 290 && Math.abs(ent.lane - currentLaneX) < 0.45) {
          if (ent.type === 'coin' && !ent.collected) {
            ent.collected = true;
            localCoins3D += 2;
            localCoins3DRef.current = localCoins3D;
            setPhaseCoins(localCoins3D);
            store.addCoins(2);
            sfx.playCoin();
            createExplosion3D(playerLaneX, playerVisualY - 10, '#FBBF24', 4);
            floatingTexts3D.push({
              x: playerLaneX,
              y: playerVisualY - 20,
              text: '+2',
              color: '#FBBF24',
              life: 32,
              maxLife: 32
            });
          } else if (ent.type === 'scroll' && !ent.collected) {
            ent.collected = true;
            localCoins3D += 10;
            localCoins3DRef.current = localCoins3D;
            setPhaseCoins(localCoins3D);
            store.addCoins(10);
            sfx.playDivine();
            createExplosion3D(playerLaneX, playerVisualY - 10, '#F97316', 12);
            floatingTexts3D.push({
              x: playerLaneX,
              y: playerVisualY - 20,
              text: '+10',
              color: '#F97316',
              life: 38,
              maxLife: 38
            });
          } else if (ent.type === 'faith' && !ent.collected) {
            ent.collected = true;
            localCoins3D += 5;
            localCoins3DRef.current = localCoins3D;
            setPhaseCoins(localCoins3D);
            store.addCoins(5);
            sfx.playDivine();
            createExplosion3D(playerLaneX, playerVisualY - 10, '#10B981', 8);
            floatingTexts3D.push({
              x: playerLaneX,
              y: playerVisualY - 20,
              text: '+5',
              color: '#34D399',
              life: 32,
              maxLife: 32
            });
          } else if (!ent.collected) {
            // Obstacles: fence, rock, cart, log, tree, lion, mud, or running animals
            // Fences/Logs/Rocks/Mud can be jumped, carts/trees must be dodged, animals can be jumped!
            let canDodge = false;
            if (ent.type === 'fence' && runner.jumpHeight > 25) {
              canDodge = true;
            } else if (ent.type === 'log' && runner.jumpHeight > 22) {
              canDodge = true;
            } else if (ent.type === 'lion' && runner.jumpHeight > 30) {
              canDodge = true;
            } else if (ent.type === 'rock' && runner.jumpHeight > 24) {
              canDodge = true;
            } else if (ent.type === 'mud' && runner.jumpHeight > 15) {
              canDodge = true;
            } else if ((ent.type === 'rabbit' || ent.type === 'fox' || ent.type === 'goat' || ent.type === 'sheep') && runner.jumpHeight > 18) {
              canDodge = true;
            }

            if (!canDodge) {
              ent.collected = true;
              sfx.playHurt();
              createExplosion3D(playerLaneX, playerVisualY - 10, '#EF4444', 15);
              set3DGameOverVal(true);
            }
          }
        }
      });

      // Filter distant entities out
      entities = entities.filter(ent => ent.z < 310 && !ent.collected);

      // Update active 3D game particles
      particles3D.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
      });
      particles3D = particles3D.filter(p => p.life > 0);

      // --- RENDER pseudo-3D perspective on Canvas ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Immersive golden-to-warm sunset gradient sky
      const sky3DG = ctx.createLinearGradient(0, 0, 0, 160);
      sky3DG.addColorStop(0, '#210B00'); // extreme deep stellar twilight
      sky3DG.addColorStop(0.25, '#401200'); // warm auburn deep
      sky3DG.addColorStop(0.5, '#8D24AA'); // rich royal purple twilight transition
      sky3DG.addColorStop(0.75, '#EC407A'); // sunset pink gradient
      sky3DG.addColorStop(0.9, '#F97316'); // bright scenic orange
      sky3DG.addColorStop(1, '#FCD34D'); // glowing horizontal gold
      ctx.fillStyle = sky3DG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw beautiful ambient twilight clouds floating in the upper sky
      ctx.save();
      const cloudSeed = progressDist * 0.05;
      for (let c = 0; c < 4; c++) {
        const cx = ((cloudSeed + c * 240) % (canvas.width + 160)) - 80;
        const cy = 20 + c * 18;
        const cr = 28 + (c % 2) * 12;
        const cloudGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, cr);
        cloudGrad.addColorStop(0, 'rgba(236, 72, 153, 0.4)'); // translucent sunset cotton candy pink
        cloudGrad.addColorStop(0.6, 'rgba(109, 40, 217, 0.2)'); // ambient purple outline
        cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - cr * 0.6, cy + 5, cr * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + cr * 0.6, cy + 5, cr * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Draw magnificent golden glowing sunset sun
      ctx.save();
      const sunGrad = ctx.createRadialGradient(400, 145, 1, 400, 145, 75);
      sunGrad.addColorStop(0, '#FFFFFF');
      sunGrad.addColorStop(0.12, '#FFF9C4'); // golden-cream core
      sunGrad.addColorStop(0.3, '#FBBF24'); // intense warm yellow glow
      sunGrad.addColorStop(0.55, '#F97316'); // majestic sunset orange
      sunGrad.addColorStop(1, 'rgba(239, 68, 68, 0)'); // fade into twilight sky
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(400, 145, 75, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Atmospheric Golden God Rays originating from the sunset sun
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let r = 0; r < 6; r++) {
        const rayAngle = Math.PI * 0.12 + (r * Math.PI * 0.15) + Math.sin(progressDist * 0.002 + r) * 0.02;
        const length = 280;
        const rayEndX = 400 + Math.cos(rayAngle) * length;
        const rayEndY = 145 + Math.sin(rayAngle) * length;

        const rayGrad = ctx.createLinearGradient(400, 145, rayEndX, rayEndY);
        rayGrad.addColorStop(0, 'rgba(251, 191, 36, 0.22)'); // luminous warm gold
        rayGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.08)'); // soft orange glow
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // fade out

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(400, 145);
        // Draw a soft translucent light cone wedge
        const spreadOffset = 0.08;
        ctx.lineTo(400 + Math.cos(rayAngle - spreadOffset) * length, 145 + Math.sin(rayAngle - spreadOffset) * length);
        ctx.lineTo(400 + Math.cos(rayAngle + spreadOffset) * length, 145 + Math.sin(rayAngle + spreadOffset) * length);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

       // Star twinkles / gold sparkles pulsing gently near the sunset horizon
      ctx.fillStyle = '#FFE082';
      for (let i = 0; i < 9; i++) {
        const sx = ((progressDist * 0.04 + i * 90) % (canvas.width + 40)) - 20;
        const sy = 110 + Math.sin(progressDist * 0.06 + i) * 15;
        const pulseR = 1.2 + Math.abs(Math.sin(progressDist * 0.05 + i)) * 1.6;
        ctx.beginPath();
        ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gentle majestic shooting star streak across the twilight vault of Judea
      ctx.save();
      const sStarX = ((Date.now() * 0.075) % (canvas.width * 2.5)) - 200;
      const sStarY = 22 + (sStarX * 0.3); // angled downward flight path
      if (sStarX > 0 && sStarX < canvas.width + 150) {
        // glowing head
        ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
        ctx.beginPath();
        ctx.arc(sStarX, sStarY, 2.0, 0, Math.PI * 2);
        ctx.fill();
        // gradient tail streak
        const starGrad = ctx.createLinearGradient(sStarX, sStarY, sStarX - 45, sStarY - 13.5);
        starGrad.addColorStop(0, 'rgba(255, 243, 199, 0.6)');
        starGrad.addColorStop(0.3, 'rgba(253, 186, 116, 0.3)');
        starGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sStarX, sStarY);
        ctx.lineTo(sStarX - 45, sStarY - 13.5);
        ctx.stroke();
      }
      ctx.restore();

      // Draw cozy shepherd bonfires lit on the distant background slopes (Bethlehem pastures)
      ctx.save();
      // left fire 1 on cliff side
      const firePhase1 = Math.abs(Math.sin(Date.now() * 0.016)) * 1.4;
      ctx.fillStyle = '#EF4444'; // glowing red base
      ctx.beginPath();
      ctx.arc(68, 102, 2.5 + firePhase1 * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F59E0B'; // intense yellow-orange flame tip
      ctx.beginPath();
      ctx.arc(68, 101, 1.4 + firePhase1 * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(68, 101, 0.6, 0, Math.PI * 2);
      ctx.fill();

      // right fire 2 on cliff side
      const firePhase2 = Math.abs(Math.cos(Date.now() * 0.012 + 1.5)) * 1.3;
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(722, 92, 2.3 + firePhase2 * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(722, 91, 1.3 + firePhase2 * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(722, 91, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw majestic flying Eagle soaring front and center in the sun's warm glow!
      ctx.save();
      const eagleX = 400 + Math.sin(progressDist * 0.04) * 45;
      const eagleY = 78 + Math.cos(progressDist * 0.02) * 12;
      const wingFlap = Math.sin(progressDist * 0.15) * 85; 

      // Draw dark eagle silhouette
      ctx.fillStyle = '#271003';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Torso & head
      ctx.moveTo(eagleX, eagleY);
      // Left Wing
      ctx.bezierCurveTo(eagleX - 12, eagleY - 8, eagleX - 25, eagleY - 14 - (wingFlap * 0.12), eagleX - 44, eagleY - 3 + (wingFlap * 0.15));
      ctx.bezierCurveTo(eagleX - 32, eagleY + 1, eagleX - 18, eagleY + 4, eagleX - 8, eagleY + 2);
      // Tail feathers
      ctx.lineTo(eagleX - 4, eagleY + 11);
      ctx.lineTo(eagleX + 4, eagleY + 11);
      // Right Wing
      ctx.lineTo(eagleX + 8, eagleY + 2);
      ctx.bezierCurveTo(eagleX + 18, eagleY + 4, eagleX + 32, eagleY + 1, eagleX + 44, eagleY - 3 + (wingFlap * 0.15));
      ctx.bezierCurveTo(eagleX + 25, eagleY - 14 - (wingFlap * 0.12), eagleX + 12, eagleY - 8, eagleX, eagleY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Little tiny soaring distant birds
      ctx.strokeStyle = '#1E0B00';
      ctx.lineWidth = 1.2;
      for (let b = 0; b < 3; b++) {
        const bx = ((progressDist * 0.12 + b * 220) % (canvas.width + 100)) - 50;
        const by = 35 + Math.sin(progressDist * 0.03 + b) * 10 + b * 15;
        const bWing = 5 + Math.abs(Math.sin(progressDist * 0.03 + b)) * 3.5;
        ctx.beginPath();
        ctx.moveTo(bx - bWing, by + 1.5);
        ctx.quadraticCurveTo(bx - bWing / 2, by - 3, bx, by);
        ctx.quadraticCurveTo(bx + bWing / 2, by - 3, bx + bWing, by + 1.5);
        ctx.stroke();
      }
      ctx.restore();

      // --- Distant rolling green & rocky hills & mountains (Enhanced organic curves) ---
      // Left Mountainous Cliffs (catching sunset copper lighting)
      ctx.fillStyle = '#48341A'; // deep bronze shadow base
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.bezierCurveTo(35, 115, 65, 70, 125, 52); // soft curve crest
      ctx.bezierCurveTo(175, 45, 215, 95, 275, 130);
      ctx.lineTo(345, 160);
      ctx.lineTo(0, 160);
      ctx.closePath();
      ctx.fill();

      // Premium sunset peak coppery-orange rim glow highlight
      ctx.save();
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.bezierCurveTo(35, 115, 65, 70, 125, 52);
      ctx.bezierCurveTo(175, 45, 215, 95, 275, 130);
      ctx.lineTo(345, 160);
      ctx.stroke();
      ctx.restore();
      
      // Warm facets overlays to give a 3D blocky rocky volume
      ctx.fillStyle = '#82582E'; // rich copper-gold highlights from the setting sun
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.lineTo(55, 102);
      ctx.quadraticCurveTo(85, 80, 125, 52);
      ctx.lineTo(105, 160);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#6E4521'; // middle facet
      ctx.beginPath();
      ctx.moveTo(125, 52);
      ctx.bezierCurveTo(170, 48, 205, 90, 245, 118);
      ctx.lineTo(185, 160);
      ctx.closePath();
      ctx.fill();

      // Right Mountainous Cliffs
      ctx.fillStyle = '#3F2F16'; 
      ctx.beginPath();
      ctx.moveTo(800, 160);
      ctx.bezierCurveTo(765, 105, 735, 60, 675, 42); // curve down
      ctx.bezierCurveTo(625, 38, 585, 85, 525, 122);
      ctx.lineTo(455, 160);
      ctx.lineTo(800, 160);
      ctx.closePath();
      ctx.fill();

      // Premium sunset peak coppery-orange rim glow highlight (Right side)
      ctx.save();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#EA580C';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(800, 160);
      ctx.bezierCurveTo(765, 105, 735, 60, 675, 42);
      ctx.bezierCurveTo(625, 38, 585, 85, 525, 122);
      ctx.lineTo(455, 160);
      ctx.stroke();
      ctx.restore();
      
      ctx.fillStyle = '#66451B'; // warm sunset coppery right cliff facet
      ctx.beginPath();
      ctx.moveTo(800, 160);
      ctx.lineTo(745, 90);
      ctx.quadraticCurveTo(715, 70, 675, 42);
      ctx.lineTo(695, 160);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#513714'; // shaded facet Right
      ctx.beginPath();
      ctx.moveTo(675, 42);
      ctx.bezierCurveTo(630, 38, 595, 80, 555, 112);
      ctx.lineTo(610, 160);
      ctx.closePath();
      ctx.fill();

      // Soft scenic sunset horizon fog/mist to blend background beautifully
      ctx.save();
      const horizonMist = ctx.createLinearGradient(0, 138, 0, 162);
      horizonMist.addColorStop(0, 'rgba(236, 72, 153, 0)'); // fade out upwards
      horizonMist.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)'); // golden orange haze overlay
      horizonMist.addColorStop(1, 'rgba(252, 211, 77, 0.08)'); // dusty gold
      ctx.fillStyle = horizonMist;
      ctx.fillRect(0, 138, canvas.width, 24);
      ctx.restore();

      // --- DRAWS DAVID'S HUMBLE SHEPHERD COTTAGE & ANIMAL CORRAL (Horizon Vanishing Point) ---
      // Replacing the heavy fortress city with a humble shepherd home matching the user's intent.
      ctx.save();
      const homeX = 370; 
      const homeY = 160; 
      
      // Warm, humble bible-era stone and clay tones
      const wallColor = '#D7B48B'; // rustic weathered plaster/clay
      const wallShadow = '#AB855F'; // side shadow of cottage
      const strawRoofColor = '#9A6B38'; // weathered straw/wood thatch roof
      const highlightRoof = '#F5B041'; // sun-drenched warm gold tips
      
      // 1. Neighboring rustic storage lean-to / clay shed (right side)
      ctx.fillStyle = '#8E6743';
      ctx.fillRect(homeX + 25, homeY - 11, 10, 11);
      ctx.fillStyle = '#5C3E21';
      ctx.beginPath();
      ctx.moveTo(homeX + 24, homeY - 11);
      ctx.lineTo(homeX + 36, homeY - 14);
      ctx.lineTo(homeX + 36, homeY - 11);
      ctx.closePath();
      ctx.fill();

      // 2. Main Humble Shepherd Cottage (A Casa de Davi)
      // Left/Front perspective wall box
      ctx.fillStyle = wallShadow;
      ctx.fillRect(homeX, homeY - 19, 22, 19);
      ctx.fillStyle = wallColor;
      ctx.fillRect(homeX + 3, homeY - 19, 19, 19);
      
      // Slanted thatched straw roof (triangle shape overlay)
      ctx.fillStyle = strawRoofColor;
      ctx.beginPath();
      ctx.moveTo(homeX - 2, homeY - 19);
      ctx.lineTo(homeX + 11, homeY - 26);
      ctx.lineTo(homeX + 24, homeY - 19);
      ctx.closePath();
      ctx.fill();

      // Warm sun-drenched highlight on roof ridge
      ctx.strokeStyle = highlightRoof;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(homeX - 1, homeY - 19);
      ctx.lineTo(homeX + 11, homeY - 25.5);
      ctx.lineTo(homeX + 23, homeY - 19);
      ctx.stroke();

      // Tiny wooden door with warm candle light glowing from inside
      ctx.fillStyle = '#F59E0B'; // warm glowing candle light
      ctx.fillRect(homeX + 8, homeY - 10, 5, 10);
      ctx.fillStyle = '#451A03'; // door frame
      ctx.lineWidth = 0.8;
      ctx.strokeRect(homeX + 8, homeY - 10, 5, 10);
      
      // Tiny window with warm light
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(homeX + 16, homeY - 12, 3, 3);
      ctx.fillStyle = '#451A03';
      ctx.strokeRect(homeX + 16, homeY - 12, 3, 3);

      // Chimney stone and charming tiny curling smoke circles!
      ctx.fillStyle = '#78350F';
      ctx.fillRect(homeX + 3, homeY - 25, 2.5, 6);
      
      ctx.save();
      const smokeSeed = progressDist * 0.04;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      for (let s = 0; s < 3; s++) {
        const sy = homeY - 28 - (s * 4) - ((smokeSeed) % 5);
        const sx = homeX + 4.2 + Math.sin(smokeSeed * 1.5 + s) * 2;
        const sr = 1 + s * 0.6;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Humble Wood Sheep Pen Corral (Davi's livestock folding)
      // Low wooden fence surrounding the corral on the left
      ctx.strokeStyle = '#5c2200';
      ctx.lineWidth = 1;
      
      // Horizontal rails
      ctx.beginPath();
      ctx.moveTo(homeX - 18, homeY - 3);
      ctx.lineTo(homeX - 2, homeY - 3);
      ctx.moveTo(homeX - 18, homeY - 6);
      ctx.lineTo(homeX - 2, homeY - 6);
      ctx.stroke();

      // Vertical fence posts
      const postsX = [homeX - 17, homeX - 10, homeX - 3];
      ctx.fillStyle = '#451A03';
      postsX.forEach(px => {
        ctx.fillRect(px - 0.6, homeY - 8, 1.2, 8);
      });

      // 4. Cozy little cotton sheep grazing inside the pen!
      // Painted as tiny white circles with a black face dot
      ctx.fillStyle = '#FFFFFF';
      
      // Sheep 1
      ctx.beginPath();
      ctx.arc(homeX - 13, homeY - 3, 1.8, 0, Math.PI * 2);
      ctx.arc(homeX - 11, homeY - 2.5, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e1b18'; // face dot
      ctx.fillRect(homeX - 14.5, homeY - 4, 1, 1);

      // Sheep 2
      ctx.fillStyle = '#F1F5F9';
      ctx.beginPath();
      ctx.arc(homeX - 6, homeY - 2.5, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e1b18';
      ctx.fillRect(homeX - 7.2, homeY - 3.5, 0.8, 0.8);

      // 5. Humble companion Olive Tree standing peacefully next to the house
      ctx.save();
      const treeX = homeX - 25;
      const treeY = homeY;
      
      // Knobby trunk
      ctx.strokeStyle = '#5C3E21';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(treeX, treeY);
      ctx.quadraticCurveTo(treeX + 1.2, treeY - 6, treeX - 1, treeY - 14);
      ctx.stroke();
      
      // Gnarled olive branches
      ctx.strokeStyle = '#3E250C';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(treeX - 0.5, treeY - 10);
      ctx.lineTo(treeX - 4, treeY - 13);
      ctx.moveTo(treeX + 0.5, treeY - 8);
      ctx.lineTo(treeX + 3, treeY - 11);
      ctx.stroke();

      // Dense greyish-green olive leaf crown (Split into independent arcs to prevent tracing artifacts)
      ctx.fillStyle = 'rgba(74, 99, 58, 0.85)';
      ctx.beginPath();
      ctx.arc(treeX - 2, treeY - 15, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(treeX + 2, treeY - 14, 4.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(treeX, treeY - 18, 4.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore(); // Restores Companion Olive Tree ctx.save() at 7811

      ctx.restore(); // Restores David's home ctx.save() at 7694

      // --- Multi-layered detailed rolling green forest hills of Bethlehem (Bosque) ---
      ctx.save();
      
      // Wave 1: Distant dark rolling forest skyline (Parallax Layer 1: slowest)
      const hillZ1 = (progressDist * 0.04) % 400;
      ctx.fillStyle = '#112204'; // deep dark forest green
      ctx.beginPath();
      ctx.moveTo(0, 160);
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = 160 - 5 - Math.sin((x + hillZ1) * 0.015) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Parallax Layer 1 trees: Distant high-fidelity small evergreens along Wave 1 crest
      for (let x = 0; x <= canvas.width; x += 24) {
        const hY = 160 - 5 - Math.sin((x + hillZ1) * 0.015) * 8;
        const pSize = 7 + Math.abs(Math.sin(x * 1.5)) * 8;
        
        // Draw tiny layered evergreen pine tree
        // Trunks
        ctx.strokeStyle = '#2d1405';
        ctx.lineWidth = Math.max(0.65, pSize * 0.16);
        ctx.beginPath();
        ctx.moveTo(x, hY);
        ctx.lineTo(x, hY - pSize * 0.35);
        ctx.stroke();

        // 3 layers of triangular pine branches
        ctx.fillStyle = '#0f2603'; // lowest dark tier
        ctx.beginPath();
        ctx.moveTo(x - pSize * 0.45, hY - pSize * 0.3);
        ctx.lineTo(x + pSize * 0.45, hY - pSize * 0.3);
        ctx.lineTo(x, hY - pSize * 0.7);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#163b05'; // mid tier
        ctx.beginPath();
        ctx.moveTo(x - pSize * 0.36, hY - pSize * 0.58);
        ctx.lineTo(x + pSize * 0.36, hY - pSize * 0.58);
        ctx.lineTo(x, hY - pSize * 0.95);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#225907'; // top tier with light glint
        ctx.beginPath();
        ctx.moveTo(x - pSize * 0.25, hY - pSize * 0.85);
        ctx.lineTo(x + pSize * 0.25, hY - pSize * 0.85);
        ctx.lineTo(x, hY - pSize * 1.25);
        ctx.closePath();
        ctx.fill();

        // Little gold sun top shimmer
        ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
        ctx.beginPath();
        ctx.arc(x, hY - pSize * 1.25, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wave 2: Middle rolling forest layers (Parallax Layer 2: medium)
      const hillZ2 = (progressDist * 0.08) % 400;
      ctx.fillStyle = '#1D3609'; // mid forest green
      ctx.beginPath();
      ctx.moveTo(0, 160);
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = 160 - 2 - Math.cos((x - hillZ2) * 0.018) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Parallax Layer 2 trees: Middle detailed oak & woodland pines
      for (let x = 0; x <= canvas.width; x += 36) {
        const hY = 160 - 2 - Math.cos((x - hillZ2) * 0.018) * 6;
        const pSize = 14 + Math.abs(Math.cos(x * 1.1)) * 12;

        ctx.save();
        ctx.translate(x, hY);
        
        // Trunk
        ctx.strokeStyle = '#42240c';
        ctx.lineWidth = Math.max(0.8, pSize * 0.18);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-pSize * 0.04, -pSize * 0.25, -pSize * 0.08, -pSize * 0.45);
        ctx.stroke();

        // Branching splits
        ctx.lineWidth = Math.max(0.5, pSize * 0.1);
        ctx.beginPath();
        ctx.moveTo(-pSize * 0.08, -pSize * 0.35);
        ctx.lineTo(-pSize * 0.22, -pSize * 0.55);
        ctx.moveTo(-pSize * 0.08, -pSize * 0.35);
        ctx.lineTo(pSize * 0.14, -pSize * 0.52);
        ctx.stroke();

        // Soft overlapping foliage clumps
        const fy = -pSize * 0.72;
        const leafClusters = [
          { cx: 0, cy: fy, r: pSize * 0.36, col: '#113a04' },
          { cx: -pSize * 0.18, cy: fy + pSize * 0.14, r: pSize * 0.26, col: '#0a2a02' },
          { cx: pSize * 0.18, cy: fy + pSize * 0.14, r: pSize * 0.28, col: '#1b4a07' },
          { cx: -pSize * 0.1, cy: fy - pSize * 0.14, r: pSize * 0.3, col: '#265e0c' },
          { cx: pSize * 0.1, cy: fy - pSize * 0.14, r: pSize * 0.3, col: '#3a7f14' }
        ];

        leafClusters.forEach((cl) => {
          ctx.beginPath();
          ctx.fillStyle = cl.col;
          ctx.arc(cl.cx, cl.cy, cl.r, 0, Math.PI * 2);
          ctx.fill();
          
          // Little sunlit crescent on each puff
          ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
          ctx.beginPath();
          ctx.arc(cl.cx - cl.r * 0.18, cl.cy - cl.r * 0.18, cl.r * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      // Wave 3: Foreground deep mossy forest hills (Parallax Layer 3: faster background)
      const hillZ3 = (progressDist * 0.12) % 400;
      ctx.fillStyle = '#26470C'; // vibrant foreground mossy/woodland green
      ctx.beginPath();
      ctx.moveTo(0, 160);
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = 160 + Math.sin((x + hillZ3) * 0.02) * 4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Parallax Layer 3 trees: Massive high-fidelity near woodland trees snaking upwards
      for (let x = 0; x <= canvas.width; x += 52) {
        const hY = 160 + Math.sin((x + hillZ3) * 0.02) * 4;
        const pSize = 24 + Math.abs(Math.sin(x * 0.82)) * 14;

        ctx.save();
        ctx.translate(x, hY);

        // Heavy gnarled woodland trunk
        const trunkGrad = ctx.createLinearGradient(-pSize * 0.12, -pSize * 0.3, pSize * 0.12, -pSize * 0.3);
        trunkGrad.addColorStop(0, '#2d1607');
        trunkGrad.addColorStop(0.6, '#4f2a10');
        trunkGrad.addColorStop(1, '#6b4120');
        
        ctx.fillStyle = trunkGrad;
        ctx.strokeStyle = '#1b1007';
        ctx.lineWidth = Math.max(0.7, pSize * 0.05);

        ctx.beginPath();
        ctx.moveTo(-pSize * 0.14, 0);
        ctx.quadraticCurveTo(-pSize * 0.1, -pSize * 0.35, -pSize * 0.08, -pSize * 0.6);
        ctx.lineTo(pSize * 0.08, -pSize * 0.6);
        ctx.quadraticCurveTo(pSize * 0.1, -pSize * 0.35, pSize * 0.14, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Gnarled side roots snaking down
        ctx.strokeStyle = '#1b1007';
        ctx.lineWidth = Math.max(0.8, pSize * 0.08);
        ctx.beginPath();
        ctx.moveTo(-pSize * 0.12, 0);
        ctx.quadraticCurveTo(-pSize * 0.22, 0, -pSize * 0.28, pSize * 0.05);
        ctx.moveTo(pSize * 0.12, 0);
        ctx.quadraticCurveTo(pSize * 0.22, 0, pSize * 0.28, pSize * 0.05);
        ctx.stroke();

        // Outward stretching main branches
        ctx.strokeStyle = '#2d1607';
        ctx.lineWidth = Math.max(0.6, pSize * 0.06);
        ctx.beginPath();
        ctx.moveTo(-pSize * 0.08, -pSize * 0.5);
        ctx.quadraticCurveTo(-pSize * 0.2, -pSize * 0.65, -pSize * 0.28, -pSize * 0.72);
        ctx.moveTo(pSize * 0.08, -pSize * 0.5);
        ctx.quadraticCurveTo(pSize * 0.2, -pSize * 0.65, pSize * 0.28, -pSize * 0.72);
        ctx.stroke();

        // Foliage clumps with dynamic volume mapping
        const fy3 = -pSize * 0.78;
        const foliage3 = [
          { cx: 0, cy: fy3, r: pSize * 0.38, col1: '#0d2a02', col2: '#1b5c03' },
          { cx: -pSize * 0.2, cy: fy3 + pSize * 0.12, r: pSize * 0.3, col1: '#071e01', col2: '#124103' },
          { cx: pSize * 0.2, cy: fy3 + pSize * 0.12, r: pSize * 0.32, col1: '#123e03', col2: '#287905' },
          { cx: -pSize * 0.12, cy: fy3 - pSize * 0.16, r: pSize * 0.34, col1: '#1b5004', col2: '#3ba307' },
          { cx: pSize * 0.12, cy: fy3 - pSize * 0.16, r: pSize * 0.34, col1: '#267005', col2: '#4dbf0d' }
        ];

        foliage3.forEach((fl) => {
          // Inner radial gradient to give volume
          const fGrad = ctx.createRadialGradient(
            fl.cx - fl.r * 0.2, fl.cy - fl.r * 0.2, fl.r * 0.05,
            fl.cx - fl.r * 0.2, fl.cy - fl.r * 0.2, fl.r * 1.05
          );
          fGrad.addColorStop(0, '#fef08a'); // yellow center sunset glint
          fGrad.addColorStop(0.2, fl.col2); // vibrant main color
          fGrad.addColorStop(0.75, fl.col1); // shadowed dark green
          fGrad.addColorStop(1.0, '#020b00'); // deep shadow edge

          ctx.fillStyle = fGrad;
          ctx.beginPath();
          ctx.arc(fl.cx, fl.cy, fl.r, 0, Math.PI * 2);
          ctx.fill();

          // Sparkle glints
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          ctx.arc(fl.cx - fl.r * 0.22, fl.cy - fl.r * 0.22, fl.r * 0.08, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }
      ctx.restore();

      // Draw decorative scrolling woodland floor details (daisies, violets, and red forest mushrooms!)
      ctx.save();
      const flowers = [
        { rx: -110, ry: 40, col: '#FFFFFF', type: 'daisy' },
        { rx: -150, ry: 120, col: '#EF4444', type: 'mushroom' }, // red forest mushroom
        { rx: -220, ry: 200, col: '#C084FC', type: 'violet' },
        { rx: 120, ry: 50, col: '#EF4444', type: 'mushroom' }, // red forest mushroom
        { rx: 170, ry: 140, col: '#FFFFFF', type: 'daisy' },
        { rx: 250, ry: 220, col: '#FBBF24', type: 'marigold' }
      ];
      flowers.forEach((fl, idx) => {
        // scroll/perspective projection for margins wildflowers
        const flOffsetZ = ((progressDist * 0.45 + idx * 45) % 240);
        const flDepth = flOffsetZ / 240;
        const flDepthProj = Math.pow(flDepth, 2.0); // quadratic projection
        const fy = 160 + flDepthProj * (canvas.height - 160);
        if (fy < 160) return;
        const sideFactor = fl.rx < 0 ? -1 : 1;
        const fx = vanishingX + sideFactor * (20 + flDepthProj * 310 + Math.abs(fl.rx) * flDepthProj);
        const fSize = 1.3 + flDepthProj * 4.5;
        
        if (fl.type === 'mushroom') {
          // Draw a lovely forest mushroom cap
          ctx.fillStyle = '#EF4444'; // Red cap
          ctx.beginPath();
          ctx.arc(fx, fy - fSize * 0.35, fSize * 1.3, Math.PI, 0, false);
          ctx.fill();
          // Stem
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(fx - fSize * 0.28, fy - fSize * 0.35, fSize * 0.56, fSize * 0.9);
          // White dots
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(fx - fSize * 0.45, fy - fSize * 0.65, fSize * 0.28, 0, Math.PI * 2);
          ctx.arc(fx + fSize * 0.45, fy - fSize * 0.65, fSize * 0.28, 0, Math.PI * 2);
          ctx.arc(fx, fy - fSize * 0.92, fSize * 0.32, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = fl.col;
          ctx.beginPath();
          ctx.arc(fx, fy, fSize, 0, Math.PI*2);
          ctx.arc(fx - fSize, fy + fSize, fSize * 0.8, 0, Math.PI*2);
          ctx.arc(fx + fSize, fy + fSize * 0.4, fSize * 0.8, 0, Math.PI*2);
          ctx.fill();
        }
      });
      ctx.restore();

      // Faux-3D Road perspective layout metrics

      // 1. Draw mossy/grassy/stony shoulders on left/right road edges based on current 1000m cycle
      const roadCycle = Math.floor(progressDist / 1000) % 3;

      let shoulderColor1 = '#1F3F0D'; // deep mossy forest green
      let shoulderColor2 = '#654321'; // rich dirt transition
      if (roadCycle === 1) {
        shoulderColor1 = '#1E293B'; // dark slate/stone shoulder
        shoulderColor2 = '#475569'; // light stone border
      } else if (roadCycle === 2) {
        shoulderColor1 = '#3C1605'; // arid deep mahogany dirt
        shoulderColor2 = '#5E2B0C'; // dry orange sienna soil border
      }

      ctx.fillStyle = shoulderColor1;
      ctx.beginPath();
      ctx.moveTo(vanishingX - 40, vanishingY);
      ctx.lineTo(vanishingX + 40, vanishingY);
      ctx.lineTo(775, 400);
      ctx.lineTo(25, 400);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = shoulderColor2;
      ctx.beginPath();
      ctx.moveTo(vanishingX - 32, vanishingY);
      ctx.lineTo(vanishingX + 32, vanishingY);
      ctx.lineTo(745, 400);
      ctx.lineTo(55, 400);
      ctx.closePath();
      ctx.fill();

      // 2. Draw the main unpaved muddy or cobblestone-paved surface depending on cycle
      const roadGrad = ctx.createLinearGradient(vanishingX, vanishingY, vanishingX, canvas.height);
      if (roadCycle === 1) { // Calçado (granite stone pavement)
        roadGrad.addColorStop(0, '#5A6982'); // polished slate stone background
        roadGrad.addColorStop(0.5, '#384457'); 
        roadGrad.addColorStop(1, '#1A2333'); // foreground solid slate flagstones
      } else if (roadCycle === 2) { // Território de Argila Vermelha (different volcanic/arid desert dirt)
        roadGrad.addColorStop(0, '#B24515'); // vibrant dry reddish-orange clay
        roadGrad.addColorStop(0.5, '#7F1D1D'); // blood sienna midsoil
        roadGrad.addColorStop(1, '#45050A'); // foreground absolute dry cinnabar-burnt earth
      } else { // Classic unpaved muddy/clay-dirt road
        roadGrad.addColorStop(0, '#A37246'); // mid-tone warm forest dirt
        roadGrad.addColorStop(0.5, '#784C23'); // rich moist clay
        roadGrad.addColorStop(1, '#563111'); // foreground dark gravel-soil sienna
      }
      ctx.fillStyle = roadGrad;
      ctx.beginPath();
      ctx.moveTo(vanishingX - 22, vanishingY);
      ctx.lineTo(vanishingX + 22, vanishingY);
      ctx.lineTo(715, 400);
      ctx.lineTo(85, 400); 
      ctx.closePath();
      ctx.fill();

      // --- THREE TRACKS DIVIDERS (Clearly visible runners lane lines separating 3 paths) ---
      ctx.save();
      ctx.setLineDash([15, 20]);
      if (roadCycle === 1) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)'; // elegant gold dashed lane borders for stone road
        ctx.lineWidth = 3.0;
      } else if (roadCycle === 2) {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)'; // high contrast crimson dashed lane borders for red volcanic clay
        ctx.lineWidth = 2.5;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'; // clean high-contrast white dashed lane borders for dirt road
        ctx.lineWidth = 2.5;
      }

      // Divider 1 (Left lane separating boundary)
      ctx.beginPath();
      for (let y = vanishingY; y <= canvas.height; y += 10) {
        const d = (y - vanishingY) / (canvas.height - vanishingY);
        const roadW = 44 + d * 586;
        const x = vanishingX - (roadW / 5.4);
        if (y === vanishingY) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Divider 2 (Right lane separating boundary)
      ctx.beginPath();
      for (let y = vanishingY; y <= canvas.height; y += 10) {
        const d = (y - vanishingY) / (canvas.height - vanishingY);
        const roadW = 44 + d * 586;
        const x = vanishingX + (roadW / 5.4);
        if (y === vanishingY) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // 3. Speed scrolling pavement patterns and natural soil cracks
      ctx.save();
      for (let i = 0; i < 9; i++) {
        const lineOffset = ((progressDist * 0.45 + i * 27) % 240);
        const lY = vanishingY + lineOffset;
        const lR = lineOffset / 240; // 0 to 1 ratio
        const lW = 50 + lR * 590;

        if (roadCycle === 1) {
          // --- CALÇADO DE PEDRAS (Premium Roman Cobblestone Grid) ---
          ctx.strokeStyle = '#0F172A'; // deep slate grout
          ctx.lineWidth = Math.max(1, lR * 2.5);
          ctx.beginPath();
          ctx.moveTo(vanishingX - lW * 0.45, lY);
          ctx.lineTo(vanishingX + lW * 0.45, lY);
          ctx.stroke();

          // Render staggered vertical cobble borders dividing each row into neat plates!
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.72)';
          ctx.lineWidth = Math.max(0.8, lR * 2.0);
          const colsCount = 6;
          const staggerOffset = (i % 2 === 0) ? 0.08 : 0; // Staggered overlap
          for (let col = 1; col < colsCount; col++) {
            const colRatio = -0.45 + (col / colsCount) * 0.9 + staggerOffset;
            const xVal = vanishingX + lW * colRatio;
            // Draw a vertical seam connecting current row lY to bottom height
            const nextLY = lY + 27; // spacing distance
            ctx.beginPath();
            ctx.moveTo(xVal, lY);
            // Angle outwards a bit to follow vanishing lines
            const bottomW = 50 + ((lineOffset + 27) / 240) * 590;
            const bottomX = vanishingX + bottomW * colRatio;
            ctx.lineTo(bottomX, Math.min(canvas.height, lY + 27));
            ctx.stroke();
          }

          // Render beveled granite 3D highlight contours inside each block
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(vanishingX - lW * 0.45, lY + 2.5);
          ctx.lineTo(vanishingX + lW * 0.45, lY + 2.5);
          ctx.stroke();

          // Beautiful polished flat stone tiles highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.beginPath();
          ctx.rect(vanishingX - lW * 0.45, lY + 1.2, lW * 0.9, 10 + lR * 8);
          ctx.fill();

        } else if (roadCycle === 2) {
          // --- CHÃO VERMELHO (Sun-Baked Heat Fractures and Dry Silt) ---
          ctx.strokeStyle = '#270802'; // rich burnt maroon fractures
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          // Draw a scorched jagged fracture line across the red road
          for (let px = 0; px <= 14; px++) {
            const fRatio = -0.45 + (px / 14) * 0.9;
            const rx = vanishingX + lW * fRatio;
            // Add a lovely sun-baked jagged distortion
            const ry = lY + Math.sin(px * 1.6 + i * 5) * 3.5 * lR;
            if (px === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.stroke();

          // Left/right volcanic hot veins/fissures
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.5)'; // Orange lava-glow cracks
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(vanishingX - lW * 0.18, lY);
          ctx.lineTo(vanishingX - lW * 0.22 + Math.cos(i * 14) * 7 * lR, lY + 12);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(vanishingX + lW * 0.15, lY);
          ctx.lineTo(vanishingX + lW * 0.20 + Math.sin(i * 8) * 7 * lR, lY + 12);
          ctx.stroke();

          // Small volcanic dust clusters on the border
          ctx.fillStyle = 'rgba(15, 23, 42, 0.09)'; // soot grey
          ctx.beginPath();
          ctx.ellipse(vanishingX - lW * 0.36, lY + 5, 2 + lR * 12, 1 + lR * 3, -0.15, 0, Math.PI * 2);
          ctx.ellipse(vanishingX + lW * 0.36, lY + 3, 2 + lR * 12, 1 + lR * 3, 0.15, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // --- ESTRADA DE CHÃO REGULAR (Damp Forest Mud creases/grooves) ---
          ctx.strokeStyle = '#43230A'; // darker earthy cracks/crusted tracks
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(vanishingX - lW * 0.45, lY);
          ctx.lineTo(vanishingX + lW * 0.45, lY);
          ctx.stroke();

          // Beautiful cobblestone cracks and pavement plates
          ctx.strokeStyle = 'rgba(67, 35, 10, 0.45)';
          ctx.lineWidth = 1.2;
          // Left side crack
          ctx.beginPath();
          ctx.moveTo(vanishingX - lW * 0.22, lY);
          ctx.lineTo(vanishingX - lW * 0.26 + Math.sin(i * 12) * 8 * lR, lY + 12);
          ctx.stroke();

          // Right side crack
          ctx.beginPath();
          ctx.moveTo(vanishingX + lW * 0.18, lY);
          ctx.lineTo(vanishingX + lW * 0.24 + Math.sin(i * 15) * 8 * lR, lY + 12);
          ctx.stroke();

          // Beautiful ancient stone pavers on the borders
          ctx.fillStyle = 'rgba(230, 180, 120, 0.08)';
          ctx.beginPath();
          ctx.ellipse(vanishingX - lW * 0.38, lY + 6, 4 + lR * 18, 1 + lR * 5, -0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.ellipse(vanishingX + lW * 0.38, lY + 4, 4 + lR * 18, 1 + lR * 5, 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 4. Draw 3D perspective wheel ruts / road division markings
      ctx.save();
      if (roadCycle === 1) {
        // --- CALÇADO: Central Roman road divide markers ---
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = 'rgba(239, 178, 41, 0.18)'; // refined imperial bronze center markers
        ctx.setLineDash([12, 28]);
        ctx.beginPath();
        for (let y = vanishingY; y <= canvas.height; y += 12) {
          if (y === vanishingY) ctx.moveTo(vanishingX, y);
          else ctx.lineTo(vanishingX, y);
        }
        ctx.stroke();

        // Beautiful curb stone lines separating side shoulder from flagstones
        ctx.setLineDash([]);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.8;
        const drawCurbLine = (side: number) => {
          ctx.beginPath();
          for (let y = vanishingY; y <= canvas.height; y += 10) {
            const d = (y - vanishingY) / (canvas.height - vanishingY);
            const roadW = 50 + d * 590;
            const cx = vanishingX + side * (roadW * 0.45);
            if (y === vanishingY) ctx.moveTo(cx, y);
            else ctx.lineTo(cx, y);
          }
          ctx.stroke();
        };
        drawCurbLine(-1);
        drawCurbLine(1);

      } else {
        // --- CHÃO / CHÃO DIFERENTE: Dark Moist or Ashy Tyre Ruts ---
        ctx.lineWidth = 2.4;
        const rutColor = (roadCycle === 2) ? '#1E0200' : '#381C06';
        const rutHighlightColor = (roadCycle === 2) ? '#A83B28' : '#C29362';

        const drawWheelRut = (offsetFactor: number) => {
          // Dark inner groove
          ctx.strokeStyle = rutColor;
          ctx.setLineDash([8, 12]);
          ctx.beginPath();
          for (let y = vanishingY; y <= canvas.height; y += 10) {
            const d = (y - vanishingY) / (canvas.height - vanishingY);
            const tW = 50 + d * 590;
            const tx = vanishingX + offsetFactor * (tW * 0.18);
            if (y === vanishingY) ctx.moveTo(tx, y);
            else ctx.lineTo(tx, y);
          }
          ctx.stroke();
          
          // Slightly damp/dusty specular highlight
          ctx.strokeStyle = rutHighlightColor;
          ctx.setLineDash([4, 16]);
          ctx.beginPath();
          for (let y = vanishingY; y <= canvas.height; y += 10) {
            const d = (y - vanishingY) / (canvas.height - vanishingY);
            const tW = 50 + d * 590;
            const tx = vanishingX + offsetFactor * (tW * 0.18) + (1.0 + d * 2.8);
            if (y === vanishingY) ctx.moveTo(tx, y);
            else ctx.lineTo(tx, y);
          }
          ctx.stroke();
        };
        
        drawWheelRut(-1); // left rut
        drawWheelRut(1);  // right rut
      }
      ctx.restore();

      // 5. Draw dynamic pebbles, weeds, studs and grass tufts scrolling inside the trail
      ctx.save();
      for (let g = 0; g < 14; g++) {
        const itemScroll = ((progressDist * 0.45 + g * 32) % 300);
        const depth = itemScroll / 300;
        const gy = vanishingY + depth * (canvas.height - vanishingY);
        const roadW = 50 + depth * 590;
        const gx = vanishingX + Math.sin(g * 19) * (roadW * 0.28);
        const sizeItem = 1.5 + depth * 14;
        
        if (roadCycle === 1) {
          // --- CALÇADO: Polished masonry stones / rare grout weed ---
          if (g % 3 === 0) {
            ctx.fillStyle = 'rgba(21, 128, 61, 0.38)'; // deep dark green moss grout
            ctx.beginPath();
            ctx.ellipse(gx, gy, sizeItem * 1.3, sizeItem * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          const polishedStud = (g % 5 === 0);
          ctx.fillStyle = polishedStud ? '#EAB308' : '#64748B'; // Gold stud vs Slate stone
          ctx.beginPath();
          ctx.arc(gx + sizeItem * 0.5, gy, Math.max(0.6, sizeItem * 0.28), 0, Math.PI * 2);
          ctx.fill();

          if (polishedStud) {
            ctx.fillStyle = '#FEF08A'; // specular shine
            ctx.beginPath();
            ctx.arc(gx + sizeItem * 0.5 - sizeItem * 0.08, gy - sizeItem * 0.08, Math.max(0.3, sizeItem * 0.1), 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#94A3B8';
            ctx.beginPath();
            ctx.arc(gx + sizeItem * 0.5 - sizeItem * 0.08, gy - sizeItem * 0.08, Math.max(0.3, sizeItem * 0.1), 0, Math.PI * 2);
            ctx.fill();
          }

        } else if (roadCycle === 2) {
          // --- CHÃO VERMELHO: Volcanic basalt slate and desert weeds ---
          ctx.fillStyle = 'rgba(120, 53, 4, 0.45)'; // dry weed shadow
          ctx.beginPath();
          ctx.ellipse(gx, gy, sizeItem * 1.4, sizeItem * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();

          if (depth > 0.42 && g % 2 === 0) {
            ctx.strokeStyle = '#92400E'; // dry stick
            ctx.lineWidth = Math.max(0.8, depth * 2.0);
            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx - sizeItem * 0.15, gy - sizeItem * 0.8);
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx + sizeItem * 0.25, gy - sizeItem * 0.9);
            ctx.stroke();
          }

          const darkRockCol = g % 2 === 0 ? '#111827' : '#1F2937';
          ctx.fillStyle = darkRockCol;
          ctx.beginPath();
          ctx.moveTo(gx + sizeItem * 0.7, gy + 1);
          ctx.lineTo(gx + sizeItem * 1.0, gy - sizeItem * 0.18);
          ctx.lineTo(gx + sizeItem * 1.25, gy + sizeItem * 0.12);
          ctx.lineTo(gx + sizeItem * 0.95, gy + sizeItem * 0.38);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#6B7280'; // dull volcanic speck specular
          ctx.beginPath();
          ctx.arc(gx + sizeItem * 0.9 - sizeItem * 0.05, gy + 1 - sizeItem * 0.05, Math.max(0.3, sizeItem * 0.12), 0, Math.PI * 2);
          ctx.fill();

        } else {
          // --- CHÃO ORIGINAL: Green forest weeds & slate pebbles ---
          ctx.fillStyle = 'rgba(47, 85, 14, 0.52)'; 
          ctx.beginPath();
          ctx.ellipse(gx, gy, sizeItem * 1.5, sizeItem * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();

          if (depth > 0.42) {
            ctx.strokeStyle = '#3F6212';
            ctx.lineWidth = Math.max(0.8, depth * 2.4);
            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx - sizeItem * 0.25, gy - sizeItem * 1.0);
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx + sizeItem * 0.35, gy - sizeItem * 1.15);
            ctx.stroke();
          }

          // Beautiful wild field flowers scattered among weeds for a premium graphic upgrade!
          if (g % 3 === 0 && depth > 0.3) {
            ctx.save();
            // Stagger position slightly for natural organic blooming offsets
            const flowerX = gx - sizeItem * 0.45;
            const flowerY = gy - sizeItem * 0.45;
            const flowerR = sizeItem * 0.25;
            
            // Flower stem
            ctx.strokeStyle = '#15803D';
            ctx.lineWidth = Math.max(0.6, depth * 1.5);
            ctx.beginPath();
            ctx.moveTo(flowerX, gy);
            ctx.lineTo(flowerX, flowerY);
            ctx.stroke();

            // Flower petals (violet, golden-yellow or amber rose petals)
            const petalColor = g % 6 === 0 ? '#C084FC' : (g % 6 === 3 ? '#FBBF24' : '#F87171');
            ctx.fillStyle = petalColor;
            for (let p = 0; p < 5; p++) {
              const pAngle = (p / 5) * Math.PI * 2 + (progressDist * 0.05);
              const px = flowerX + Math.cos(pAngle) * flowerR;
              const py = flowerY + Math.sin(pAngle) * flowerR;
              ctx.beginPath();
              ctx.arc(px, py, flowerR * 0.5, 0, Math.PI * 2);
              ctx.fill();
            }
            // Flower core
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(flowerX, flowerY, flowerR * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
          }

          const stoneColor = g % 2 === 0 ? '#4B5563' : '#374151'; // Slate colors
          ctx.fillStyle = stoneColor;
          ctx.beginPath();
          ctx.arc(gx + sizeItem * 0.8, gy + 1, Math.max(0.6, sizeItem * 0.32), 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#9CA3AF'; // light edge reflection
          ctx.beginPath();
          ctx.arc(gx + sizeItem * 0.8 - sizeItem * 0.08, gy + 1 - sizeItem * 0.08, Math.max(0.3, sizeItem * 0.14), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 6. Immersive forest details: Scrolling shadows of overhead branches cast onto the road
      ctx.save();
      ctx.fillStyle = 'rgba(15, 28, 9, 0.22)'; // translucent leafy forest shadow
      for (let s = 0; s < 5; s++) {
        const shadowScroll = ((progressDist * 0.45 + s * 95) % 270);
        const sDepth = shadowScroll / 270;
        const sY = vanishingY + sDepth * (canvas.height - vanishingY);
        const sW = 40 + sDepth * 280;
        ctx.beginPath();
        // custom diagonal leafy shadow bands stretching over the road
        ctx.ellipse(vanishingX + Math.sin(s * 1.5) * 40, sY, sW, 14 + sDepth * 40, Math.PI / 8 + Math.cos(s), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 7. Immersive forest details: flying and scrolling autumn leaves drifting along the floor (with exponential 3D speed!)
      ctx.save();
      for (let l = 0; l < 10; l++) {
        const leafScroll = ((progressDist * 0.45 + l * 45) % 280);
        const lDepth = leafScroll / 280;
        const lDepthProj = Math.pow(lDepth, 2.0); // quadratic projection
        const lY = vanishingY + lDepthProj * (canvas.height - vanishingY);
        const roadW = 50 + lDepthProj * 590;
        
        // Add a gorgeous organic lateral wind drift wobble!
        const lateralWobble = Math.sin(progressDist * 0.04 + l) * 20 * lDepthProj;
        const lX = vanishingX + Math.sin(l * 12) * (roadW * 0.42) + lateralWobble;
        
        const leafSize = 1.0 + lDepthProj * 10.5;
        const leafRotation = (progressDist * 0.03 + l * 1.7);
        
        ctx.save();
        ctx.translate(lX, lY);
        ctx.rotate(leafRotation);
        // autumnal colors: sienna brown, forest deep orange, gold-yellow, and moss green
        ctx.fillStyle = l % 4 === 0 ? '#B45309' : (l % 4 === 1 ? '#854D0E' : (l % 4 === 2 ? '#1B4D13' : '#9A3412'));
        ctx.beginPath();
        ctx.ellipse(0, 0, leafSize * 1.4, leafSize * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // 7b. Dynamic perspective wind-stream lines rushing towards the player to enhance physical velocity sensation!
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 4;
      for (let w = 0; w < 6; w++) {
        // Speed lines that move down and out in 3D perspective
        const lineScroll = ((progressDist * 1.5 + w * 60) % 300);
        const wDepth = lineScroll / 300;
        const wY = vanishingY + wDepth * (canvas.height - vanishingY);
        // spread outward as depth increases
        const spreadX = 20 + wDepth * 380;
        const lineLen = 15 + wDepth * 85;
        // left side line
        const wX1 = vanishingX - spreadX;
        ctx.beginPath();
        ctx.lineWidth = 0.5 + wDepth * 2.2;
        ctx.moveTo(wX1 - lineLen, wY);
        ctx.lineTo(wX1, wY);
        ctx.stroke();
        
        // right side line
        const wX2 = vanishingX + spreadX;
        ctx.beginPath();
        ctx.moveTo(wX2, wY);
        ctx.lineTo(wX2 + lineLen, wY);
        ctx.stroke();
      }
      ctx.restore();

      // --- DRAW PERSPECTIVE ROADSIDE TREES & SIDE FENCES ON BOTH MARGINS (Scenic dense forest corridor) ---
      // Placing gnarled forest oak/pine trees & rustic wooden guard fences bordering the mud path
      ctx.save();
      const treeSpacing3D = 120; // Beautifully spaced majestic corridor trees
      const startTreeIdx3D = Math.floor(progressDist / treeSpacing3D);
      // Loop from farthest to closest (back-to-front Painter's Algorithm depth order drawing)
      for (let i = startTreeIdx3D + 7; i >= startTreeIdx3D; i--) {
        const dDist = (i * treeSpacing3D) - progressDist;
        const zOffset = 300 - dDist; // z depth towards screen
        if (zOffset < 0 || zOffset > 300) continue;
        
        // Use a power curves perspective projection for a true professional 3D runner depth!
        const depthFactor = Math.pow(zOffset / 300, 2.0);
        const roadWHorizon = 44;
        const roadWFront = 580;
        const currentRoadW = roadWHorizon + depthFactor * (roadWFront - roadWHorizon);
        const tY = vanishingY + depthFactor * (canvas.height - vanishingY);
        
        // --- 1. RUSTIC WOODEN COUPLING FENCES (Left/Right side) ---
        // Dynamically compute and connect with the next post node to create continuous 3D rails!
        const dDistNext = ((i + 1) * treeSpacing3D) - progressDist;
        const zOffsetNext = 300 - dDistNext;
        
        let drawRails = false;
        let postXLeftNext = 0;
        let postXRightNext = 0;
        let yNext = 0;
        let postHeightNext = 0;
        
        if (zOffsetNext >= -20 && zOffsetNext <= 340) {
          const depthFactorNext = Math.pow(Math.max(0, Math.min(1.1, zOffsetNext / 300)), 2.0);
          const currentRoadWNext = roadWHorizon + depthFactorNext * (roadWFront - roadWHorizon);
          yNext = vanishingY + depthFactorNext * (canvas.height - vanishingY);
          
          const sideOffsetNext = -2 + depthFactorNext * 4; // positioned perfectly on road margins!
          postXLeftNext = vanishingX - currentRoadWNext / 2 - sideOffsetNext;
          postXRightNext = vanishingX + currentRoadWNext / 2 + sideOffsetNext;
          postHeightNext = 2 + depthFactorNext * 20;
          drawRails = true;
        }

        const sideOffsetPost = -2 + depthFactor * 4;
        const postXLeft = vanishingX - currentRoadW / 2 - sideOffsetPost;
        const postXRight = vanishingX + currentRoadW / 2 + sideOffsetPost;
        const postHeight = 2 + depthFactor * 20;
        const postThick = 1.0 + depthFactor * 4.8;

        // Draw Left & Right Horizontal rails connecting to the next post
        if (drawRails) {
          ctx.save();
          // Weathered aged bronze wood texture
          ctx.strokeStyle = '#4A2A0F';
          ctx.lineWidth = Math.max(0.65, depthFactor * 3.2);
          ctx.lineCap = 'round';
          
          // Left side Rails
          ctx.beginPath();
          ctx.moveTo(postXLeft, tY - postHeight * 0.38);
          ctx.lineTo(postXLeftNext, yNext - postHeightNext * 0.38);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(postXLeft, tY - postHeight * 0.76);
          ctx.lineTo(postXLeftNext, yNext - postHeightNext * 0.76);
          ctx.stroke();
          
          // Right side Rails
          ctx.beginPath();
          ctx.moveTo(postXRight, tY - postHeight * 0.38);
          ctx.lineTo(postXRightNext, yNext - postHeightNext * 0.38);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(postXRight, tY - postHeight * 0.76);
          ctx.lineTo(postXRightNext, yNext - postHeightNext * 0.76);
          ctx.stroke();
          ctx.restore();
        }

        // Draw Left & Right vertical fence support posts
        ctx.save();
        ctx.fillStyle = '#5C3E21';
        ctx.strokeStyle = '#270E00';
        ctx.lineWidth = Math.max(0.5, depthFactor * 1.2);
        
        ctx.beginPath();
        ctx.roundRect(postXLeft - postThick / 2, tY - postHeight, postThick, postHeight, 0.8);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.roundRect(postXRight - postThick / 2, tY - postHeight, postThick, postHeight, 0.8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // --- 2. THE HIGH-FIDELITY CORRIDOR TREES ---
        // Place trees directly bordering the dirt road shoulders (no separation of pastures)
        const sideOffset = 8 + depthFactor * 14; 
        const leftTreeX = vanishingX - currentRoadW / 2 - sideOffset;
        const rightTreeX = vanishingX + currentRoadW / 2 + sideOffset;
        
        const scale = 4.2 + depthFactor * 115; // realistic high-fidelity tree scale (Increased for taller, more prominent corridor border trees)
        
        const drawScenicTree = (tx: number, ty: number, sideSign: number) => {
          ctx.save();
          ctx.translate(tx, ty);
          
          // Tree shadow cast inwards with soft feathering
          ctx.fillStyle = 'rgba(10, 22, 6, 0.32)';
          ctx.beginPath();
          ctx.ellipse(0, 0, scale * 0.45, scale * 0.09, sideSign * 0.2, 0, Math.PI * 2);
          ctx.fill();
          
          // Create the main trunk clipping path so all bark details stay perfectly bounded!
          const buildTrunkPath = () => {
            ctx.beginPath();
            ctx.moveTo(-scale * 0.08, 0);
            ctx.quadraticCurveTo(-scale * 0.05, -scale * 0.35, -scale * 0.04, -scale * 0.61);
            ctx.lineTo(scale * 0.04, -scale * 0.61);
            ctx.quadraticCurveTo(scale * 0.05, -scale * 0.35, scale * 0.08, 0);
            ctx.closePath();
          };

          // Draw the base gradient
          const trunkGrad = ctx.createLinearGradient(-scale * 0.08, -scale * 0.3, scale * 0.08, -scale * 0.3);
          
          let colShadow, colMid1, colMid2, colMid3, colHighlight;
          if (roadCycle === 1) { // Autumn silver/grey stone
            colShadow = '#111827'; 
            colMid1 = '#1F2937'; 
            colMid2 = '#4B5563'; 
            colMid3 = '#9CA3AF'; 
            colHighlight = '#E5E7EB';
          } else if (roadCycle === 2) { // Dark desert/charcoal tree
            colShadow = '#0c0201'; 
            colMid1 = '#270e0a'; 
            colMid2 = '#5c2217'; 
            colMid3 = '#a13b28'; 
            colHighlight = '#cca054';
          } else { // Classic moist forest
            colShadow = '#1c0c03'; 
            colMid1 = '#3b200b'; 
            colMid2 = '#75430f'; 
            colMid3 = '#a86a24'; 
            colHighlight = '#cca054';
          }

          if (sideSign < 0) {
            // Left tree: lit on the right side facing the road
            trunkGrad.addColorStop(0, colShadow); // deep shadowed side
            trunkGrad.addColorStop(0.35, colMid1); 
            trunkGrad.addColorStop(0.7, colMid2); 
            trunkGrad.addColorStop(0.9, colMid3); 
            trunkGrad.addColorStop(1, colHighlight); // bright golden sunrise edge
          } else {
            // Right tree: lit on the left side facing the road
            trunkGrad.addColorStop(0, colHighlight); // bright golden sunrise edge
            trunkGrad.addColorStop(0.1, colMid3);
            trunkGrad.addColorStop(0.3, colMid2);
            trunkGrad.addColorStop(0.65, colMid1);
            trunkGrad.addColorStop(1, colShadow); // deep shadowed side
          }

          ctx.fillStyle = trunkGrad;
          ctx.strokeStyle = '#1a0d04';
          ctx.lineWidth = Math.max(0.8, depthFactor * 2.2);

          // Draw filled trunk
          buildTrunkPath();
          ctx.fill();

          // Clip to the trunk for inside details (bark, knots, textures)
          ctx.save();
          buildTrunkPath();
          ctx.clip();

          // 1. Draw vertical, undulating bark fibers/cracks for rich texture details
          const numFibers = 11;
          for (let f = 0; f < numFibers; f++) {
            const ratio = f / (numFibers - 1);
            const startX = -scale * 0.075 + ratio * (scale * 0.15);
            ctx.beginPath();
            ctx.strokeStyle = f % 2 === 0 ? 'rgba(20, 8, 2, 0.55)' : 'rgba(255, 255, 255, 0.08)';
            ctx.lineWidth = Math.max(0.5, scale * 0.01);
            ctx.moveTo(startX, 0);
            ctx.quadraticCurveTo(
              startX - scale * 0.015 + Math.sin(f + 1.2) * (scale * 0.008), -scale * 0.3,
              startX * 0.5 - scale * 0.005 + Math.cos(f * 2) * (scale * 0.006), -scale * 0.61
            );
            ctx.stroke();
          }

          // 2. Beautiful circular wood knothole (Nó de madeira gnarled)
          const knotX = sideSign * scale * 0.015;
          const knotY = -scale * 0.28;
          ctx.strokeStyle = 'rgba(20, 8, 2, 0.72)';
          ctx.lineWidth = Math.max(0.8, scale * 0.012);
          ctx.beginPath();
          ctx.arc(knotX, knotY, scale * 0.018, 0, Math.PI * 2);
          ctx.stroke();
          // Inner swirls
          ctx.beginPath();
          ctx.arc(knotX, knotY, scale * 0.009, 0, Math.PI * 1.5);
          ctx.stroke();

          ctx.restore(); // end trunk clip

          // Reinforce trunk contour line
          buildTrunkPath();
          ctx.stroke();

          // 3. Draw advanced spreading roots that snake into the earth beautifully
          ctx.strokeStyle = '#1a0d04';
          ctx.lineWidth = Math.max(0.7, scale * 0.02);
          const drawRoot = (rx1: number, ry1: number, rx2: number, ry2: number, rx3: number, ry3: number) => {
            ctx.beginPath();
            ctx.moveTo(rx1, ry1);
            ctx.bezierCurveTo(rx2, ry2, (rx2 + rx3) / 2, ry2 + 2, rx3, ry3);
            ctx.stroke();
          };
          // Left Root
          drawRoot(-scale * 0.06, 0, -scale * 0.16, scale * 0.01, -scale * 0.22, scale * 0.04);
          // Right Root
          drawRoot(scale * 0.06, 0, scale * 0.16, scale * 0.01, scale * 0.22, scale * 0.04);
          // Center frontal Root
          drawRoot(-scale * 0.01, -scale * 0.04, -scale * 0.02, scale * 0.02, -scale * 0.04, scale * 0.05);

          // 4. Multi-stage organic gnarled golden-lit branches
          const drawBranch = (bx1: number, by1: number, bx2: number, by2: number, bx3: number, by3: number, thickness: number) => {
            ctx.save();
            ctx.strokeStyle = '#2d1607';
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(bx1, by1);
            ctx.quadraticCurveTo(bx2, by2, bx3, by3);
            ctx.stroke();
            
            // Sub-branch split
            ctx.lineWidth = thickness * 0.6;
            ctx.beginPath();
            ctx.moveTo(bx2, by2);
            ctx.quadraticCurveTo((bx2 + bx3) / 2 + scale * 0.03, (by2 + by3) / 2 - scale * 0.03, bx3 + scale * 0.05, by3 - scale * 0.04);
            ctx.stroke();
            ctx.restore();
          };

          // Left primary branch
          drawBranch(-scale * 0.04, -scale * 0.48, -scale * 0.13, -scale * 0.64, -scale * 0.19, -scale * 0.72, Math.max(0.8, scale * 0.025));
          // Right primary branch
          drawBranch(scale * 0.04, -scale * 0.48, scale * 0.13, -scale * 0.64, scale * 0.19, -scale * 0.72, Math.max(0.8, scale * 0.025));
          // Top core splits
          drawBranch(0, -scale * 0.58, scale * 0.02, -scale * 0.7, scale * 0.04, -scale * 0.81, Math.max(0.6, scale * 0.02));
          drawBranch(-scale * 0.02, -scale * 0.58, -scale * 0.05, -scale * 0.72, -scale * 0.09, -scale * 0.82, Math.max(0.6, scale * 0.02));

          // 5. Beautiful multi-layered foliage clumps (Layer A: Back shadow, Layer B: Dynamic gradient, Layer C: Sunlight cap, Layer D: Ribbed leaves)
          const foliageY = -scale * 0.82;
          const puffs = [
            { px: 0, py: foliageY, pr: scale * 0.29 },
            { px: -scale * 0.15, py: foliageY + scale * 0.1, pr: scale * 0.23 },
            { px: scale * 0.15, py: foliageY + scale * 0.1, pr: scale * 0.24 },
            { px: -scale * 0.1, py: foliageY - scale * 0.13, pr: scale * 0.25 },
            { px: scale * 0.1, py: foliageY - scale * 0.13, pr: scale * 0.25 }
          ];

          puffs.forEach(puff => {
            ctx.save();
            ctx.translate(puff.px, puff.py);
            
            // --- 5.1 Layer A: Deep Shadow Base ---
            let leafShadow = '#061302';
            let leafOverlay = 'rgba(253, 224, 71, 0.45)';
            let c0 = '#f2fca7', c1 = '#8ade21', c2 = '#1e660e', c3 = '#0c3004', c4 = '#041201';

            if (roadCycle === 1) { // Autumn/Cobble Theme (yellow / orange / gold)
              leafShadow = '#1c0a02';
              leafOverlay = 'rgba(254, 240, 138, 0.5)';
              c0 = '#fef08a'; // pale yellow-gold
              c1 = '#f59e0b'; // amber orange
              c2 = '#b45309'; // autumn rust
              c3 = '#78350f'; // mahogany dark
              c4 = '#1c0d02'; // occlusion
            } else if (roadCycle === 2) { // Volcanic/Arid Theme (magenta / rose / crimson)
              leafShadow = '#1c0205';
              leafOverlay = 'rgba(244, 63, 94, 0.35)';
              c0 = '#ffe4e6'; // pale pinkish clay
              c1 = '#f43f5e'; // vibrant desert rose
              c2 = '#9f1239'; // rich burgundy
              c3 = '#4c0519'; // crimson shadow
              c4 = '#120002'; // occlusion
            }

            ctx.fillStyle = leafShadow; 
            ctx.beginPath();
            ctx.arc(2, 4, puff.pr, 0, Math.PI * 2);
            ctx.fill();

            // --- 5.2 Layer B: Volumetric Forest Mid-Tone Grad ---
            const lightCenterX = -sideSign * puff.pr * 0.4;
            const lightCenterY = -puff.pr * 0.4;
            
            const leafyRadGrad = ctx.createRadialGradient(
              lightCenterX, lightCenterY, puff.pr * 0.05,
              lightCenterX, lightCenterY, puff.pr * 1.1
            );
            
            leafyRadGrad.addColorStop(0, c0);
            leafyRadGrad.addColorStop(0.18, c1);
            leafyRadGrad.addColorStop(0.55, c2);
            leafyRadGrad.addColorStop(0.85, c3);
            leafyRadGrad.addColorStop(1.0, c4);
            
            ctx.fillStyle = leafyRadGrad;
            ctx.beginPath();
            ctx.arc(0, 0, puff.pr * 0.98, 0, Math.PI * 2);
            ctx.fill();

            // --- 5.3 Layer C: Sun-kissed overlay caps (Sunset shine glow) ---
            ctx.fillStyle = leafOverlay; 
            ctx.beginPath();
            ctx.arc(lightCenterX, lightCenterY, puff.pr * 0.55, 0, Math.PI * 2);
            ctx.fill();

            // --- 5.4 Layer D: High Definition Ribbed Micro-leaves Outlines ---
            const leafCount = 14; 
            ctx.fillStyle = leafyRadGrad;
            ctx.strokeStyle = roadCycle === 1 ? '#451a03' : (roadCycle === 2 ? '#2d0611' : '#0a1d04');
            ctx.lineWidth = Math.max(0.4, scale * 0.006);
            
            for (let l = 0; l < leafCount; l++) {
              const angle = (l / leafCount) * Math.PI * 2 + (puff.px * 0.12);
              const leafDistance = puff.pr * (0.92 + Math.sin(l * 1.7) * 0.04); 
              const lx = Math.cos(angle) * leafDistance;
              const ly = Math.sin(angle) * leafDistance;
              const lr = puff.pr * (0.17 + Math.sin(angle * 4.2) * 0.03);
              
              ctx.save();
              ctx.translate(lx, ly);
              ctx.rotate(angle);
              
              // Draw leaf ellipse droplet
              ctx.beginPath();
              ctx.ellipse(0, 0, lr * 1.38, lr * 0.85, 0.25, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // Draw fine leaf rib line (Woodland detail!)
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'; 
              ctx.beginPath();
              ctx.moveTo(-lr * 0.6, 0);
              ctx.lineTo(lr * 0.7, 0);
              ctx.stroke();
              
              ctx.restore();
            }

            // --- 5.5 Layer E: Sparkle glints on highlight nodes ---
            ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
            for (let k = 0; k < 4; k++) {
              const fx = lightCenterX + Math.sin(k * 2.1) * (puff.pr * 0.25);
              const fy = lightCenterY + Math.cos(k * 1.4) * (puff.pr * 0.25);
              ctx.beginPath();
              ctx.arc(fx, fy, puff.pr * 0.055, 0, Math.PI * 2);
              ctx.fill();
            }
            
            ctx.restore();
          });
          
          ctx.restore();
        };

        // Draw left tree (facing sun at vanishing point, sun-kissed on right hemisphere)
        drawScenicTree(leftTreeX, tY, -1);
        // Draw right tree (sun-kissed on left hemisphere)
        drawScenicTree(rightTreeX, tY, 1);
      }
      ctx.restore();

      // --- PREPARE COMBINED DEPTH-SORTED RENDER LIST (Painters Algorithm) ---
      const renderList: { z: number; draw: () => void }[] = [];

      // A. Populate environmental elements (Continuous wrapping trees and side bushes)
      sideObjects.forEach(obj => {
        renderList.push({
          z: obj.z,
          draw: () => {
            const depthFactor = Math.pow(obj.z / 300, 2.0);
            const currentRoadWidth = 40 + depthFactor * 320;
            
            const entY = vanishingY + depthFactor * (canvas.height - vanishingY);
            if (entY < vanishingY) return;
            
            const sideCoef = obj.side === 'left' ? -1 : 1;
            const treeX = vanishingX + sideCoef * (currentRoadWidth + 45 + depthFactor * 140);
            const treeSize = (5 + depthFactor * 115) * obj.scale; // slightly larger for majestic framing

            if (obj.type === 'tree') {
              const trunkH = treeSize * 0.72;
              const trunkW = treeSize * 0.18;
              
              // Draw tree trunk roots/base flare
              ctx.save();
              ctx.fillStyle = '#3E1C07'; // deeply shaded grass-level roots
              ctx.beginPath();
              ctx.moveTo(treeX - trunkW * 1.8, entY);
              ctx.quadraticCurveTo(treeX, entY - trunkH * 0.2, treeX + trunkW * 1.8, entY);
              ctx.lineTo(treeX + trunkW, entY - trunkH * 0.5);
              ctx.lineTo(treeX - trunkW, entY - trunkH * 0.5);
              ctx.closePath();
              ctx.fill();

              // Sophisticated shaded cylindrical wooden trunk with bark texture creases
              const tGrad = ctx.createLinearGradient(treeX - trunkW, entY - trunkH, treeX + trunkW, entY);
              tGrad.addColorStop(0, '#8C5228'); // lighter gold-brown bark on sun-facing side
              tGrad.addColorStop(0.4, '#5F3012'); // main wood tone
              tGrad.addColorStop(1, '#331500'); // dark shadow
              ctx.fillStyle = tGrad;
              ctx.beginPath();
              ctx.moveTo(treeX - trunkW, entY - trunkH);
              ctx.lineTo(treeX + trunkW, entY - trunkH);
              ctx.quadraticCurveTo(treeX + trunkW * 1.3, entY, treeX + trunkW * 1.5, entY);
              ctx.lineTo(treeX - trunkW * 1.5, entY);
              ctx.quadraticCurveTo(treeX - trunkW * 1.3, entY, treeX - trunkW, entY - trunkH);
              ctx.closePath();
              ctx.fill();

              // Draw vertical bark grain texture lines
              ctx.strokeStyle = 'rgba(40, 15, 0, 0.45)';
              ctx.lineWidth = Math.max(0.6, depthFactor * 2);
              ctx.beginPath();
              ctx.moveTo(treeX - trunkW * 0.4, entY - trunkH * 0.9);
              ctx.lineTo(treeX - trunkW * 0.2, entY);
              ctx.moveTo(treeX + trunkW * 0.3, entY - trunkH * 0.85);
              ctx.lineTo(treeX + trunkW * 0.5, entY);
              ctx.stroke();
              ctx.restore();
              
              const cy = entY - trunkH;
              
              // Layered organic foliage clumps (No more robotic half-circles!)
              const drawFoliageClump = (fx: number, fy: number, r: number, sunSideCoef: number) => {
                ctx.save();
                
                // Draw drop shadow under clump
                ctx.fillStyle = 'rgba(23, 37, 8, 0.25)';
                ctx.beginPath();
                ctx.arc(fx + 2, fy + 4, r, 0, Math.PI * 2);
                ctx.fill();

                // Leafy base (dark rich forest green)
                ctx.fillStyle = '#4D7C0F';
                ctx.beginPath();
                ctx.arc(fx, fy, r, 0, Math.PI * 2);
                ctx.fill();

                // Golden green lit side
                ctx.fillStyle = '#65A30D';
                ctx.beginPath();
                ctx.arc(fx, fy, r, Math.PI * 0.5, Math.PI * 1.5, sunSideCoef < 0);
                ctx.fill();

                // Warm sunlit golden peak highlight crown
                const sunGrad = ctx.createRadialGradient(fx - r * 0.18 * sunSideCoef, fy - r * 0.28, 1, fx - r * 0.18 * sunSideCoef, fy - r * 0.28, r * 0.85);
                sunGrad.addColorStop(0, '#D9F99D'); // super sun lit yellow green
                sunGrad.addColorStop(0.35, '#84CC16'); // nice bright lime green
                sunGrad.addColorStop(1, 'rgba(132,204,22,0)');
                ctx.fillStyle = sunGrad;
                ctx.beginPath();
                ctx.arc(fx, fy, r, 0, Math.PI * 2);
                ctx.fill();

                // Tiny decorative floating leaf outlines on edges for high detail feel
                ctx.strokeStyle = '#272E0F';
                ctx.lineWidth = Math.max(0.5, r * 0.04);
                ctx.beginPath();
                ctx.arc(fx, fy, r, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.restore();
              };
              
              // Draw multiple organic overlapping clumps to make the tree look grand and lush
              const sunFactor = sideCoef < 0 ? 1 : -1; // sun lights inside of the road
              drawFoliageClump(treeX, cy - treeSize * 0.38, treeSize * 0.52, sunFactor);
              drawFoliageClump(treeX - treeSize * 0.35, cy - treeSize * 0.08, treeSize * 0.42, sunFactor);
              drawFoliageClump(treeX + treeSize * 0.35, cy - treeSize * 0.08, treeSize * 0.42, sunFactor);
              drawFoliageClump(treeX, cy + treeSize * 0.1, treeSize * 0.35, sunFactor);
            } else {
              // Shrub Bush (Fluffy organic round shapes)
              const bushSize = treeSize * 0.72;
              const drawOrganicBush = (bx: number, by: number, r: number) => {
                ctx.save();
                
                // Shadow
                ctx.fillStyle = 'rgba(23, 37, 8, 0.2)';
                ctx.beginPath();
                ctx.arc(bx + 1, by + 2, r, 0, Math.PI * 2);
                ctx.fill();

                // Dark base green
                ctx.fillStyle = '#3F6212';
                ctx.beginPath();
                ctx.arc(bx, by, r, 0, Math.PI * 2);
                ctx.fill();

                // Light grass green dome
                ctx.fillStyle = '#4D7C0F';
                ctx.beginPath();
                ctx.arc(bx, by, r, Math.PI * 0.5, Math.PI * 1.5, sideCoef < 0);
                ctx.fill();

                // Bright highlight cap
                const capGrad = ctx.createRadialGradient(bx, by - r * 0.25, 1, bx, by - r * 0.25, r * 0.8);
                capGrad.addColorStop(0, '#A3E635');
                capGrad.addColorStop(1, 'rgba(77,124,15,0)');
                ctx.fillStyle = capGrad;
                ctx.beginPath();
                ctx.arc(bx, by, r, 0, Math.PI * 2);
                ctx.fill();
                
                // Edge stroke
                ctx.strokeStyle = '#1E3A1A';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.arc(bx, by, r, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
              };
              
              drawOrganicBush(treeX, entY - bushSize * 0.45, bushSize * 0.55);
              drawOrganicBush(treeX - bushSize * 0.34, entY - bushSize * 0.28, bushSize * 0.42);
              drawOrganicBush(treeX + bushSize * 0.34, entY - bushSize * 0.28, bushSize * 0.42);
            }
          }
        });
      });

      // B. Populate active road obstacles and target coins
      entities.forEach(ent => {
        renderList.push({
          z: ent.z,
          draw: () => {
            const depthFactor = Math.pow(ent.z / 300, 2.0);
            
            const roadWidthHorizon = 44;
            const roadWidthFront = 580;
            const currentRoadWidth = roadWidthHorizon + depthFactor * (roadWidthFront - roadWidthHorizon);
            
            const positionMultiplier = ent.lane === 0 ? -1 : ent.lane === 1 ? 0 : 1;
            // Include horizontal offsets for moving animals/objects!
            const entX = vanishingX + (currentRoadWidth / 2.7) * positionMultiplier + (ent.offsetX || 0) * depthFactor;
            // Draw height offset based on altitude and bounceY!
            const entBaseY = vanishingY + depthFactor * (canvas.height - vanishingY);
            const altitudeOffset = ((ent.altitude || 0) + (ent.bounceY || 0)) * depthFactor * 1.5;
            const entY = entBaseY - altitudeOffset;
            const entSize = 12.5 + depthFactor * 62; // majestic and clear list objects (Increased size for more prominent and challenging obstacles)

            if (entBaseY < vanishingY) return;

            if (ent.type === 'coin') {
              ctx.save();
              ctx.translate(entX, entY - entSize);
              
              const coinW = entSize * 0.95;
              ctx.scale(Math.sin(progressDist * 0.15), 1.0);
              
              // Bright golden rim glow with radial golden shine
              ctx.fillStyle = '#FBBF24';
              ctx.beginPath();
              ctx.arc(0, 0, coinW, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.fillStyle = '#F59E0B';
              ctx.beginPath();
              ctx.arc(0, 0, coinW * 0.75, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.strokeStyle = '#FEF08A';
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.arc(0, 0, coinW * 0.75, 0, Math.PI * 2);
              ctx.stroke();
              
              ctx.fillStyle = '#D97706';
              ctx.font = `bold ${Math.max(7, entSize * 0.7)}px monospace`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('$', 0, 0);
              
              ctx.restore();
            } else if (ent.type === 'scroll') {
              ctx.save();
              ctx.translate(entX, entY - entSize * 1.1);
              
              // Left/Right handles
              ctx.fillStyle = '#B45309';
              ctx.fillRect(-entSize * 0.8, -entSize * 0.5, entSize * 0.15, entSize * 1.0);
              ctx.fillRect(entSize * 0.65, -entSize * 0.5, entSize * 0.15, entSize * 1.0);
              const wheelSz = entSize * 0.22;
              ctx.beginPath();
              ctx.arc(-entSize * 0.72, -entSize * 0.5, wheelSz, 0, Math.PI*2);
              ctx.arc(-entSize * 0.72, entSize * 0.5, wheelSz, 0, Math.PI*2);
              ctx.arc(entSize * 0.72, -entSize * 0.5, wheelSz, 0, Math.PI*2);
              ctx.arc(entSize * 0.72, entSize * 0.5, wheelSz, 0, Math.PI*2);
              ctx.fill();
              
              // Scroll body yellow/parchment with detailed stroke
              ctx.fillStyle = '#FEF08A';
              ctx.strokeStyle = '#D97706';
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.roundRect(-entSize * 0.6, -entSize * 0.4, entSize * 1.2, entSize * 0.8, 3.5);
              ctx.fill();
              ctx.stroke();
              
              // Red center ribbon tie
              ctx.fillStyle = '#EF4444';
              ctx.fillRect(-entSize * 0.12, -entSize * 0.4, entSize * 0.24, entSize * 0.8);
              ctx.restore();
            } else if (ent.type === 'faith') {
              ctx.save();
              ctx.translate(entX, entY - entSize);
              ctx.shadowColor = '#34D399';
              ctx.shadowBlur = 10 + Math.sin(progressDist * 0.1) * 3;
              
              const path = new Path2D();
              path.moveTo(0, -entSize * 0.7);
              path.lineTo(entSize * 0.38, 0);
              path.lineTo(0, entSize * 0.65);
              path.lineTo(-entSize * 0.38, 0);
              path.closePath();
              
              const dropG = ctx.createLinearGradient(0, -entSize * 0.7, 0, entSize * 0.65);
              dropG.addColorStop(0, '#A7F3D0');
              dropG.addColorStop(0.5, '#34D399');
              dropG.addColorStop(1, '#059669');
              ctx.fillStyle = dropG;
              ctx.fill(path);
              
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 1.0;
              ctx.stroke(path);
              ctx.restore();
            } else if (ent.type === 'fence') {
              // A gorgeous Bible-era rustic split-rail wooden gate/fence barrier
              const visualFenceH = entSize * 0.72;
              const postW = entSize * 0.16;
              const postH = visualFenceH;
              
              ctx.save();
              // Wood texture/gradient for fence timbers
              const timberGrad = ctx.createLinearGradient(0, entBaseY - postH, 0, entBaseY);
              timberGrad.addColorStop(0, '#A76D38'); // weathered warm amber brown
              timberGrad.addColorStop(0.45, '#73431A'); // rich heartwood
              timberGrad.addColorStop(1, '#3A1E08'); // dark shadow ground
              ctx.fillStyle = timberGrad;
              ctx.strokeStyle = '#251003';
              ctx.lineWidth = 1.35;

              // Draw 2 main vertical fence posts
              const leftPostX = entX - entSize * 0.85;
              const rightPostX = entX + entSize * 0.85 - postW;
              ctx.beginPath();
              ctx.roundRect(leftPostX, entBaseY - postH, postW, postH, 2.5);
              ctx.roundRect(rightPostX, entBaseY - postH, postW, postH, 2.5);
              ctx.fill();
              ctx.stroke();

              // Draw wood fiber grains on vertical posts
              ctx.strokeStyle = '#3A1E08';
              ctx.lineWidth = 0.85;
              ctx.beginPath();
              ctx.moveTo(leftPostX + postW * 0.35, entBaseY - postH * 0.88);
              ctx.lineTo(leftPostX + postW * 0.35, entBaseY - postH * 0.1);
              ctx.moveTo(leftPostX + postW * 0.7, entBaseY - postH * 0.95);
              ctx.lineTo(leftPostX + postW * 0.7, entBaseY - postH * 0.25);
              ctx.moveTo(rightPostX + postW * 0.4, entBaseY - postH * 0.88);
              ctx.lineTo(rightPostX + postW * 0.4, entBaseY - postH * 0.15);
              ctx.stroke();

              // Draw horizontal cross beams (split timber planks)
              const beamH = entSize * 0.16;
              const beamW = entSize * 1.7;
              const beamY1 = entBaseY - postH * 0.8;
              const beamY2 = entBaseY - postH * 0.45;
              const beamX = leftPostX + postW / 2;
              
              ctx.fillStyle = timberGrad;
              // Upper horizontal wooden plank
              ctx.beginPath();
              ctx.roundRect(beamX - postW / 2, beamY1, beamW, beamH, 1.5);
              // Lower horizontal wooden plank
              ctx.roundRect(beamX - postW / 2, beamY2, beamW, beamH, 1.5);
              ctx.fill();
              ctx.stroke();

              // Horizontal wood grain textures
              ctx.beginPath();
              ctx.moveTo(beamX - postW / 2 + 5, beamY1 + beamH * 0.4);
              ctx.lineTo(beamX - postW / 2 + beamW - 5, beamY1 + beamH * 0.4);
              ctx.moveTo(beamX - postW / 2 + 10, beamY2 + beamH * 0.5);
              ctx.lineTo(beamX - postW / 2 + beamW - 10, beamY2 + beamH * 0.5);
              ctx.stroke();

              // Draw a diagonal wooden brace plank to lock it together
              ctx.beginPath();
              ctx.moveTo(leftPostX + postW, entBaseY - postH * 0.8);
              ctx.lineTo(rightPostX, entBaseY - postH * 0.25);
              ctx.lineTo(rightPostX, entBaseY - postH * 0.4);
              ctx.lineTo(leftPostX + postW, entBaseY - postH * 0.95);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Draw premium brass / bronze wrapping straps with steel rivets holding joint ends
              ctx.fillStyle = '#C2933C'; // antique gold brass strap
              ctx.strokeStyle = '#5E4110';
              ctx.lineWidth = 0.85;

              // Top left joint strap
              ctx.beginPath();
              ctx.fillRect(leftPostX - 1.2, beamY1 + 1, postW + 2.4, beamH - 2);
              ctx.strokeRect(leftPostX - 1.2, beamY1 + 1, postW + 2.4, beamH - 2);
              
              // Top right joint strap
              ctx.beginPath();
              ctx.fillRect(rightPostX - 1.2, beamY1 + 1, postW + 2.4, beamH - 2);
              ctx.strokeRect(rightPostX - 1.2, beamY1 + 1, postW + 2.4, beamH - 2);

              // Little silver bolt rivet dots
              ctx.fillStyle = '#E2E8F0';
              ctx.beginPath();
              ctx.arc(leftPostX + postW * 0.25, beamY1 + beamH * 0.5, 1.0, 0, Math.PI * 2);
              ctx.arc(leftPostX + postW * 0.75, beamY1 + beamH * 0.5, 1.0, 0, Math.PI * 2);
              ctx.arc(rightPostX + postW * 0.25, beamY1 + beamH * 0.5, 1.0, 0, Math.PI * 2);
              ctx.arc(rightPostX + postW * 0.75, beamY1 + beamH * 0.5, 1.0, 0, Math.PI * 2);
              ctx.fill();

              // Beautiful natural leafy vines twisting around the rails
              ctx.save();
              ctx.strokeStyle = '#047857'; // emerald greenvine line
              ctx.lineWidth = 1.3;
              ctx.beginPath();
              // Vine 1
              ctx.moveTo(leftPostX + postW * 0.5, entBaseY);
              ctx.quadraticCurveTo(leftPostX - 10, entBaseY - postH * 0.4, leftPostX + postW * 0.5, beamY2);
              ctx.quadraticCurveTo(leftPostX + postW * 1.5, beamY2 - 10, leftPostX + postW * 3.5, beamY2);
              ctx.stroke();

              // Vine little emerald green leaves
              ctx.fillStyle = '#10B981';
              ctx.beginPath();
              ctx.ellipse(leftPostX - 4, entBaseY - postH * 0.35, 4.5, 2.5, -0.4, 0, Math.PI * 2);
              ctx.ellipse(leftPostX + postW + 5, beamY2 - 4, 4.0, 2.0, 0.5, 0, Math.PI * 2);
              ctx.ellipse(leftPostX + postW * 2.5, beamY2 + 3, 4.5, 2.2, -0.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();

              // Mossy green stains at bottom of fence posts
              ctx.fillStyle = '#15803D';
              ctx.beginPath();
              ctx.ellipse(leftPostX + postW / 2, entBaseY, postW * 0.8, beamH * 0.4, 0, 0, Math.PI * 2);
              ctx.ellipse(rightPostX + postW / 2, entBaseY, postW * 0.8, beamH * 0.4, 0, 0, Math.PI * 2);
              ctx.fill();

              ctx.restore();
            } else if (ent.type === 'log') {
              // Giant high-fidelity fallen tree trunk logs with circular concentric growth rings
              const logW = entSize * 1.48;
              const logH = entSize * 0.48;
              const logX = entX - logW / 2;
              const logY = entY - logH;
              
              // Log body gradient with dark bark crevices
              const logGrad = ctx.createLinearGradient(logX, logY, logX, logY + logH);
              logGrad.addColorStop(0, '#A75D3B'); // Rich bark wood top
              logGrad.addColorStop(0.35, '#7C2D12');
              logGrad.addColorStop(0.8, '#431407'); // deep shadow bottom
              logGrad.addColorStop(1, '#1A0400');
              ctx.fillStyle = logGrad;
              ctx.beginPath();
              ctx.roundRect(logX, logY, logW, logH, logH * 0.35);
              ctx.fill();
              
              // Bark grooves (horizontal lines)
              ctx.strokeStyle = 'rgba(26, 4, 0, 0.55)';
              ctx.lineWidth = Math.max(1, depthFactor * 2.2);
              ctx.beginPath();
              ctx.moveTo(logX + logW * 0.2, logY + logH * 0.3);
              ctx.lineTo(logX + logW * 0.8, logY + logH * 0.3);
              ctx.moveTo(logX + logW * 0.15, logY + logH * 0.65);
              ctx.lineTo(logX + logW * 0.75, logY + logH * 0.65);
              ctx.moveTo(logX + logW * 0.35, logY + logH * 0.45);
              ctx.lineTo(logX + logW * 0.6, logY + logH * 0.45);
              ctx.stroke();

              // Draw beautiful green lichen moss patches over the log bark
              ctx.save();
              const mossGrad = ctx.createRadialGradient(logX + logW * 0.45, logY + 2, 1, logX + logW * 0.45, logY + 2, logW * 0.16);
              mossGrad.addColorStop(0, '#22C55E'); // bright green
              mossGrad.addColorStop(0.6, '#15803D'); // forest green
              mossGrad.addColorStop(1, 'rgba(21, 128, 61, 0)');
              ctx.fillStyle = mossGrad;
              ctx.beginPath();
              ctx.ellipse(logX + logW * 0.45, logY + 2, logW * 0.18, logH * 0.3, 0, 0, Math.PI * 2);
              ctx.fill();

              const mossGrad2 = ctx.createRadialGradient(logX + logW * 0.7, logY + 4, 0, logX + logW * 0.7, logY + 4, logW * 0.12);
              mossGrad2.addColorStop(0, '#4ADE80');
              mossGrad2.addColorStop(0.7, '#166534');
              mossGrad2.addColorStop(1, 'rgba(22, 101, 52, 0)');
              ctx.fillStyle = mossGrad2;
              ctx.beginPath();
              ctx.ellipse(logX + logW * 0.7, logY + 3, logW * 0.15, logH * 0.25, 0.1, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();

              // Draw cute micro forest mushrooms (Red caps with tiny white dots) sprouting from log moss!
              ctx.save();
              const drawMushroom = (mx: number, my: number, mScale: number) => {
                // White stem
                ctx.fillStyle = '#F1F5F9';
                ctx.beginPath();
                ctx.fillRect(mx - 1.2 * mScale, my - 6 * mScale, 2.4 * mScale, 6 * mScale);
                
                // Red capped dome
                ctx.fillStyle = '#EF4444';
                ctx.beginPath();
                ctx.arc(mx, my - 5 * mScale, 4.2 * mScale, Math.PI, 0);
                ctx.fill();

                // Tiny white decorative spores
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(mx - 1.5 * mScale, my - 6.5 * mScale, 0.6 * mScale, 0, Math.PI * 2);
                ctx.arc(mx, my - 8.2 * mScale, 0.6 * mScale, 0, Math.PI * 2);
                ctx.arc(mx + 1.8 * mScale, my - 6 * mScale, 0.6 * mScale, 0, Math.PI * 2);
                ctx.fill();
              };
              drawMushroom(logX + logW * 0.38, logY + 1.5, 1.2);
              drawMushroom(logX + logW * 0.43, logY + 1.0, 0.95);
              drawMushroom(logX + logW * 0.64, logY + 1.2, 1.15);
              ctx.restore();

              // Draw circular concentric growth age rings on both cut faces
              const drawAgeRings = (cx: number) => {
                ctx.save();
                ctx.fillStyle = '#FED7AA'; // Fresh cut yellowish wood
                ctx.beginPath();
                ctx.ellipse(cx, logY + logH * 0.5, logH * 0.16, logH * 0.45, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Ring concentric lines
                ctx.strokeStyle = '#C2410C';
                ctx.lineWidth = 0.8;
                for (let rScale = 0.35; rScale <= 0.85; rScale += 0.25) {
                  ctx.beginPath();
                  ctx.ellipse(cx, logY + logH * 0.5, logH * 0.16 * rScale, logH * 0.45 * rScale, 0, 0, Math.PI * 2);
                  ctx.stroke();
                }
                
                // Dark face border
                ctx.strokeStyle = '#431407';
                ctx.lineWidth = 1.25;
                ctx.beginPath();
                ctx.ellipse(cx, logY + logH * 0.5, logH * 0.16, logH * 0.45, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
              };

              drawAgeRings(logX + logH * 0.22);
              drawAgeRings(logX + logW - logH * 0.22);
              
              // Sprouting twig with leaves (high visual flavor value!)
              ctx.save();
              ctx.strokeStyle = '#3F250B';
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.moveTo(logX + logW * 0.5, logY);
              ctx.quadraticCurveTo(logX + logW * 0.52, logY - 8, logX + logW * 0.48, logY - 14); // twig stem
              ctx.stroke();
              
              // Leaves on twig
              ctx.fillStyle = '#22C55E';
              ctx.beginPath();
              ctx.ellipse(logX + logW * 0.48, logY - 14, 5, 2.2, -0.4, 0, Math.PI * 2);
              ctx.ellipse(logX + logW * 0.52, logY - 9, 4, 1.8, 0.4, 0, Math.PI * 2);
              ctx.fill();

              // Side sprout (left)
              ctx.strokeStyle = '#3F250B';
              ctx.beginPath();
              ctx.moveTo(logX + logW * 0.25, logY);
              ctx.quadraticCurveTo(logX + logW * 0.23, logY - 6, logX + logW * 0.19, logY - 9);
              ctx.stroke();

              ctx.fillStyle = '#4ADE80';
              ctx.beginPath();
              ctx.ellipse(logX + logW * 0.19, logY - 9, 4.5, 2.0, -0.6, 0, Math.PI * 2);
              ctx.fill();

              // Side sprout (right)
              ctx.strokeStyle = '#3F250B';
              ctx.beginPath();
              ctx.moveTo(logX + logW * 0.75, logY);
              ctx.quadraticCurveTo(logX + logW * 0.77, logY - 5, logX + logW * 0.81, logY - 8);
              ctx.stroke();

              ctx.fillStyle = '#22C55E';
              ctx.beginPath();
              ctx.ellipse(logX + logW * 0.81, logY - 8, 4.5, 2.0, 0.5, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.restore();
            } else if (ent.type === 'mud') {
              // Glossy realistic mud puddle with ripple lines and specular highlights
              ctx.save();
              ctx.translate(entX, entBaseY);
              const puddleX = entSize * 1.34;
              const puddleY = entSize * 0.46;
              
              // Mud shape organic outer boundary
              const mudG = ctx.createRadialGradient(0, 0, 1, 0, 0, puddleX);
              mudG.addColorStop(0, '#361D0F'); // extremely rich dark mud
              mudG.addColorStop(0.7, '#24130A');
              mudG.addColorStop(1, 'rgba(36,20,10,0)');
              ctx.fillStyle = mudG;
              ctx.beginPath();
              ctx.ellipse(0, 0, puddleX, puddleY, 0, 0, Math.PI*2);
              ctx.fill();
              
              // Concentric ripple ridges
              ctx.strokeStyle = 'rgba(74, 42, 21, 0.72)';
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.ellipse(0, 0, puddleX * 0.6, puddleY * 0.6, 0.02, 0, Math.PI * 2);
              ctx.ellipse(0, 0, puddleX * 0.35, puddleY * 0.35, -0.01, 0, Math.PI * 2);
              ctx.stroke();

              // Specks of muddy bubbles with shiny white specular dots
              const drawMudBubble = (bx: number, by: number, br: number) => {
                ctx.fillStyle = '#201007';
                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = '#4A2A14';
                ctx.lineWidth = 0.75;
                ctx.stroke();

                ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
                ctx.beginPath();
                ctx.arc(bx - br * 0.3, by - br * 0.3, br * 0.22, 0, Math.PI * 2);
                ctx.fill();
              };
              drawMudBubble(-puddleX * 0.25, -puddleY * 0.15, 3.2);
              drawMudBubble(puddleX * 0.3, puddleY * 0.12, 4.0);
              drawMudBubble(puddleX * 0.05, -puddleY * 0.22, 2.5);
 
              // Mud specular reflection highlight lines
              ctx.strokeStyle = 'rgba(255,255,255,0.36)';
              ctx.lineWidth = 1.95;
              ctx.beginPath();
              ctx.ellipse(0, -puddleY * 0.18, puddleX * 0.72, puddleY * 0.32, -0.06, Math.PI * 0.9, Math.PI * 1.55);
              ctx.stroke();
              ctx.restore();
            } else if (ent.type === 'cart') {
              // Carriage/cultivation cart full of organic straw strands, clay pottery, and iron rimmed wheels
              ctx.save();
              ctx.translate(entX, entBaseY);
              
              const cartW = entSize * 1.35;
              const cartH = entSize * 0.85;
              
              // 1. Two giant wood carriage wheels with iron rims & bolts
              ctx.fillStyle = '#3E1D07'; // wood center
              ctx.strokeStyle = '#270E00'; // rim dark
              ctx.lineWidth = 2.2;
              
              const drawWheel = (wx: number) => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(wx, -entSize * 0.28, entSize * 0.28, 0, Math.PI*2);
                ctx.fill();
                ctx.stroke();
                
                // Metallic wheel rim (iron gray outline)
                ctx.strokeStyle = '#4B5563';
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.arc(wx, -entSize * 0.28, entSize * 0.28 - 1, 0, Math.PI*2);
                ctx.stroke();
 
                // Golden spokes
                ctx.strokeStyle = '#D97706';
                ctx.lineWidth = 1.15;
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
                  ctx.beginPath();
                  ctx.moveTo(wx, -entSize * 0.28);
                  ctx.lineTo(wx + Math.cos(a) * entSize * 0.28, -entSize * 0.28 + Math.sin(a) * entSize * 0.28);
                  ctx.stroke();
                }
 
                // Center axle pin
                ctx.fillStyle = '#6B7280';
                ctx.beginPath();
                ctx.arc(wx, -entSize * 0.28, entSize * 0.06, 0, Math.PI*2);
                ctx.fill();
                ctx.restore();
              };
              drawWheel(-cartW * 0.58);
              drawWheel(cartW * 0.58);
              
              // 2. Carriage wooden panels showing grooves
              const boxGrad = ctx.createLinearGradient(-cartW / 2, -cartH, cartW / 2, -entSize * 0.25);
              boxGrad.addColorStop(0, '#A76D38'); // Warm rich orange-brown timber
              boxGrad.addColorStop(1, '#4A250B');
              ctx.fillStyle = boxGrad;
              ctx.beginPath();
              ctx.roundRect(-cartW * 0.5, -cartH - entSize * 0.12, cartW, cartH, 4.5);
              ctx.fill();
              
              // Panel dividing grooves (vertical lines)
              ctx.strokeStyle = '#270E00';
              ctx.lineWidth = 1.35;
              ctx.beginPath();
              ctx.moveTo(-cartW * 0.22, -cartH - entSize * 0.12);
              ctx.lineTo(-cartW * 0.22, -entSize * 0.25);
              ctx.moveTo(cartW * 0.22, -cartH - entSize * 0.12);
              ctx.lineTo(cartW * 0.22, -entSize * 0.25);
              ctx.stroke();
 
              ctx.strokeRect(-cartW * 0.5, -cartH - entSize * 0.12, cartW, cartH);

              // Shiny decorative metal reinforcement corners (L-bracket straps)
              ctx.fillStyle = '#4B5563'; // metal grey
              ctx.fillRect(-cartW * 0.5, -cartH - entSize * 0.12, 8, 22);
              ctx.fillRect(-cartW * 0.5, -cartH - entSize * 0.12, 22, 8);
              ctx.fillRect(cartW * 0.5 - 8, -cartH - entSize * 0.12, 8, 22);
              ctx.fillRect(cartW * 0.5 - 22, -cartH - entSize * 0.12, 22, 8);
              
              // 3. Overflowing yellow straw bales
              ctx.fillStyle = '#F59E0B'; // Straw yellow golden
              ctx.beginPath();
              ctx.ellipse(-cartW * 0.21, -cartH - entSize * 0.15, cartW * 0.36, entSize * 0.28, 0.08, 0, Math.PI*2);
              ctx.ellipse(cartW * 0.18, -cartH - entSize * 0.18, cartW * 0.38, entSize * 0.26, -0.05, 0, Math.PI*2);
              ctx.fill();

              // Draw beautiful terracotta/clay Greek/Biblical pottery jars lying in the straw
              const drawClayJar = (jx: number, jy: number, jSize: number) => {
                ctx.save();
                ctx.translate(jx, jy);
                
                // Shadows for the jars
                ctx.fillStyle = 'rgba(0,0,0,0.22)';
                ctx.beginPath();
                ctx.ellipse(0, jSize * 0.5, jSize * 0.7, jSize * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();

                // Jar body (rich warm orange terracotta clay gradient)
                const clayGrad = ctx.createRadialGradient(-jSize * 0.1, -jSize * 0.1, 1, 0, 0, jSize);
                clayGrad.addColorStop(0, '#FB923C'); // light orange
                clayGrad.addColorStop(0.65, '#EA580C'); // terracotta orange
                clayGrad.addColorStop(1, '#9A3412'); // shadow burnt orange/brown
                ctx.fillStyle = clayGrad;
                ctx.strokeStyle = '#7C2D12';
                ctx.lineWidth = 1.0;

                ctx.beginPath();
                // Rounded pot body
                ctx.arc(0, 0, jSize * 0.65, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Pot neck and rim
                ctx.fillStyle = clayGrad;
                ctx.beginPath();
                ctx.roundRect(-jSize * 0.32, -jSize * 0.95, jSize * 0.64, jSize * 0.32, 1.5);
                ctx.fill();
                ctx.stroke();

                // Loop Handles
                ctx.strokeStyle = '#EA580C';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                // Left handle
                ctx.arc(-jSize * 0.5, -jSize * 0.4, jSize * 0.25, Math.PI * 0.7, Math.PI * 1.7);
                ctx.stroke();
                // Right handle
                ctx.arc(jSize * 0.5, -jSize * 0.4, jSize * 0.25, Math.PI * 1.3, Math.PI * 0.3);
                ctx.stroke();

                ctx.restore();
              };
              drawClayJar(cartW * 0.12, -cartH - entSize * 0.26, entSize * 0.18);
              drawClayJar(-cartW * 0.08, -cartH - entSize * 0.18, entSize * 0.22);
              
              // Render 22+ discrete straw strands/threads sticking out in organic angles
              ctx.strokeStyle = '#FEF08A';
              ctx.lineWidth = 1.15;
              for (let s = 0; s < 25; s++) {
                const angle = (s * 13) % (Math.PI * 2);
                const rx = Math.sin(s * 8) * (cartW * 0.3);
                const ry = -cartH - entSize * 0.15 + Math.cos(s * 9) * (entSize * 0.1);
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx + Math.cos(angle) * 7.5, ry + Math.sin(angle) * 7.5);
                ctx.stroke();
              }
              
              ctx.restore();
            } else if (ent.type === 'rock') {
              // Irregular multi-faceted giant stone boulder with shadows and green moss details on top
              ctx.save();
              ctx.translate(entX, entBaseY);
              
              const rRadius = entSize * 0.94;
              
              // Outlined stone polygon
              const drawRockBase = () => {
                ctx.beginPath();
                ctx.moveTo(-rRadius * 0.9, 0);
                ctx.lineTo(-rRadius, -rRadius * 0.44);
                ctx.lineTo(-rRadius * 0.6, -rRadius * 0.98);
                ctx.lineTo(rRadius * 0.35, -rRadius * 1.08);
                ctx.lineTo(rRadius * 0.96, -rRadius * 0.52);
                ctx.lineTo(rRadius * 0.84, 0);
                ctx.closePath();
              };

              drawRockBase();
              ctx.clip();
              
              // Rock base textured gradient
              const rockG = ctx.createLinearGradient(-rRadius, -rRadius * 1.1, rRadius, 0);
              rockG.addColorStop(0, '#9CA3AF'); // Light grey slate
              rockG.addColorStop(0.5, '#4B5563'); // Medium slate grey
              rockG.addColorStop(1, '#1F2937'); // Shaded dark charcoal
              ctx.fillStyle = rockG;
              ctx.fillRect(-rRadius * 1.2, -rRadius * 1.2, rRadius * 2.4, rRadius * 2.4);
              
              // Sunlit facet overlay highlight (catching golden hour side)
              ctx.fillStyle = 'rgba(255, 235, 200, 0.22)';
              ctx.beginPath();
              ctx.moveTo(-rRadius * 0.6, -rRadius * 0.98);
              ctx.lineTo(rRadius * 0.35, -rRadius * 1.08);
              ctx.lineTo(0, -rRadius * 0.45);
              ctx.closePath();
              ctx.fill();

              // Dark shaded crevices (vector fractures)
              ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.moveTo(-rRadius * 0.6, -rRadius * 0.98);
              ctx.lineTo(0, -rRadius * 0.45);
              ctx.lineTo(rRadius * 0.96, -rRadius * 0.52);
              ctx.moveTo(rRadius * 0.35, -rRadius * 1.08);
              ctx.lineTo(0, -rRadius * 0.45);
              ctx.lineTo(-rRadius, -rRadius * 0.44);
              ctx.stroke();

              // Glistening gold/bronze mineral veins in the rock cracks (Ethereal smooth Elah Stones)
              ctx.save();
              ctx.strokeStyle = '#FBBF24'; // Radiant golden copper vein
              ctx.shadowColor = '#F59E0B';
              ctx.shadowBlur = 4;
              ctx.lineWidth = 1.15;
              ctx.beginPath();
              ctx.moveTo(-rRadius * 0.42, -rRadius * 0.81);
              ctx.lineTo(0, -rRadius * 0.45);
              ctx.lineTo(rRadius * 0.45, -rRadius * 0.48);
              ctx.stroke();
              ctx.restore();

              // Emerald green moss growing on top ridges (Reference level visual refinement!)
              ctx.fillStyle = '#15803D'; // deep lush moss green
              ctx.beginPath();
              ctx.ellipse(-rRadius * 0.4, -rRadius * 0.9, rRadius * 0.26, rRadius * 0.08, 0.15, 0, Math.PI*2);
              ctx.ellipse(rRadius * 0.1, -rRadius * 1.0, rRadius * 0.24, rRadius * 0.08, -0.05, 0, Math.PI*2);
              ctx.fill();
              ctx.fillStyle = '#22C55E'; // bright highlight moss spots
              ctx.beginPath();
              ctx.ellipse(-rRadius * 0.38, -rRadius * 0.92, rRadius * 0.15, rRadius * 0.05, 0.15, 0, Math.PI*2);
              ctx.ellipse(rRadius * 0.12, -rRadius * 1.01, rRadius * 0.13, rRadius * 0.05, -0.05, 0, Math.PI*2);
              ctx.fill();
              
              ctx.restore();
              
              // Clean dark outline around the full rock
              ctx.strokeStyle = '#111827';
              ctx.lineWidth = Math.max(1.5, depthFactor * 2.2);
              ctx.beginPath();
              ctx.moveTo(entX - rRadius * 0.9, entBaseY);
              ctx.lineTo(entX - rRadius, entBaseY - rRadius * 0.44);
              ctx.lineTo(entX - rRadius * 0.6, entBaseY - rRadius * 0.98);
              ctx.lineTo(entX + rRadius * 0.35, entBaseY - rRadius * 1.08);
              ctx.lineTo(entX + rRadius * 0.96, entBaseY - rRadius * 0.52);
              ctx.lineTo(entX + rRadius * 0.84, entBaseY);
              ctx.closePath();
              ctx.stroke();
            } else if (ent.type === 'rabbit') {
              // Cute brown fluffy hopping rabbit
              ctx.save();
              ctx.translate(entX, entY);
              
              // Face direction based on movement speed
              const isMovingRight = (ent.speedX || 0) > 0;
              if (!isMovingRight) ctx.scale(-1, 1);
              
              // 1. Shadow under hopping rabbit
              ctx.fillStyle = 'rgba(0,0,0,0.2)';
              ctx.beginPath();
              ctx.ellipse(0, 0, entSize * 0.35, entSize * 0.08, 0, 0, Math.PI*2);
              ctx.fill();
              
              // 2. Fluffy round body
              ctx.fillStyle = '#D97706'; // Golden Rabbit Brown
              ctx.beginPath();
              ctx.ellipse(-entSize * 0.08, -entSize * 0.18, entSize * 0.28, entSize * 0.22, 0.08, 0, Math.PI*2);
              ctx.fill();
              
              // 3. Cute head
              ctx.beginPath();
              ctx.arc(entSize * 0.16, -entSize * 0.32, entSize * 0.15, 0, Math.PI*2);
              ctx.fill();
              
              // 4. Tall pink upright ears
              ctx.fillStyle = '#B45309';
              ctx.beginPath();
              ctx.ellipse(entSize * 0.16, -entSize * 0.54, entSize * 0.05, entSize * 0.14, 0.05, 0, Math.PI*2);
              ctx.ellipse(entSize * 0.08, -entSize * 0.52, entSize * 0.05, entSize * 0.14, -0.05, 0, Math.PI*2);
              ctx.fill();
              
              ctx.fillStyle = '#F472B6'; // Pink inner ear lines
              ctx.beginPath();
              ctx.ellipse(entSize * 0.16, -entSize * 0.54, entSize * 0.022, entSize * 0.1, 0.05, 0, Math.PI*2);
              ctx.ellipse(entSize * 0.08, -entSize * 0.52, entSize * 0.022, entSize * 0.1, -0.05, 0, Math.PI*2);
              ctx.fill();
              
              // 5. White tail puff & black eye
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.arc(-entSize * 0.36, -entSize * 0.2, entSize * 0.06, 0, Math.PI*2);
              ctx.fill();
              
              ctx.fillStyle = '#000000';
              ctx.beginPath();
              ctx.arc(entSize * 0.22, -entSize * 0.34, entSize * 0.035, 0, Math.PI*2);
              ctx.fill();
              
              ctx.restore();
            } else if (ent.type === 'fox') {
              // Cute swift red-orange fox
              ctx.save();
              ctx.translate(entX, entY);
              
              const isMovingRight = (ent.speedX || 0) > 0;
              if (!isMovingRight) ctx.scale(-1, 1);
              
              // 1. Low body shadow
              ctx.fillStyle = 'rgba(0,0,0,0.2)';
              ctx.beginPath();
              ctx.ellipse(0, 0, entSize * 0.44, entSize * 0.08, 0, 0, Math.PI*2);
              ctx.fill();
              
              // 2. Fox streamlined athletic orange body
              ctx.fillStyle = '#EA580C'; // Bright Fox Orange
              ctx.beginPath();
              ctx.ellipse(-entSize * 0.08, -entSize * 0.18, entSize * 0.38, entSize * 0.16, 0.03, 0, Math.PI*2);
              ctx.fill();
              
              // 3. Fluffy white chest/belly underlayer
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.ellipse(entSize * 0.08, -entSize * 0.14, entSize * 0.2, entSize * 0.1, 0.02, 0, Math.PI*2);
              ctx.fill();
              
              // 4. Fox head with white snout panels
              ctx.fillStyle = '#EA580C';
              ctx.beginPath();
              ctx.ellipse(entSize * 0.26, -entSize * 0.28, entSize * 0.16, entSize * 0.14, 0.05, 0, Math.PI*2);
              ctx.fill();
              
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.ellipse(entSize * 0.33, -entSize * 0.25, entSize * 0.08, entSize * 0.05, 0.25, 0, Math.PI*2);
              ctx.fill();
              
              // Pointer nose black dot & glossy black eyes
              ctx.fillStyle = '#000000';
              ctx.beginPath();
              ctx.arc(entSize * 0.39, -entSize * 0.26, entSize * 0.03, 0, Math.PI*2); // nose tip
              ctx.arc(entSize * 0.25, -entSize * 0.31, entSize * 0.03, 0, Math.PI*2); // eye
              ctx.fill();
              
              // 5. Pointy triangular ears with black tips
              ctx.fillStyle = '#000000';
              ctx.beginPath();
              ctx.moveTo(entSize * 0.18, -entSize * 0.36);
              ctx.lineTo(entSize * 0.22, -entSize * 0.52);
              ctx.lineTo(entSize * 0.3, -entSize * 0.38);
              ctx.closePath();
              ctx.fill();
              ctx.fillStyle = '#EA580C';
              ctx.beginPath();
              ctx.moveTo(entSize * 0.2, -entSize * 0.36);
              ctx.lineTo(entSize * 0.23, -entSize * 0.47);
              ctx.lineTo(entSize * 0.28, -entSize * 0.38);
              ctx.closePath();
              ctx.fill();
              
              // 6. Huge orange bushy tail with a clean white tip
              ctx.fillStyle = '#EA580C';
              ctx.beginPath();
              ctx.ellipse(-entSize * 0.44, -entSize * 0.22, entSize * 0.22, entSize * 0.11, -0.28, 0, Math.PI*2);
              ctx.fill();
              
              ctx.restore();
            } else if (ent.type === 'sheep') {
              // Fluffier woolly sheep with textured curls circles overlapping
              ctx.save();
              ctx.translate(entX, entY);
              
              // 1. Shadow
              ctx.fillStyle = 'rgba(0,0,0,0.18)';
              ctx.beginPath();
              ctx.ellipse(0, 0, entSize * 0.46, entSize * 0.09, 0, 0, Math.PI*2);
              ctx.fill();
              
              // 2. Four little dark legs with shiny black hooves
              ctx.fillStyle = '#1F2937';
              ctx.fillRect(-entSize * 0.18, -entSize * 0.1, entSize * 0.05, entSize * 0.16);
              ctx.fillRect(-entSize * 0.05, -entSize * 0.1, entSize * 0.05, entSize * 0.14);
              ctx.fillRect(entSize * 0.08, -entSize * 0.1, entSize * 0.05, entSize * 0.16);
              ctx.fillRect(entSize * 0.2, -entSize * 0.1, entSize * 0.05, entSize * 0.14);
              
              // 3. Main puffy cloud body (overlapping circles of warm off-white wool with 3D radial shading)
              const gameplayWoolGrad = ctx.createRadialGradient(0, -entSize * 0.28, entSize * 0.05, 0, -entSize * 0.22, entSize * 0.28);
              gameplayWoolGrad.addColorStop(0, '#FFFFFF'); // Clean bright white light source
              gameplayWoolGrad.addColorStop(0.6, '#F8FAFC'); // soft light grey
              gameplayWoolGrad.addColorStop(1.0, '#CBD5E1'); // ambient grey shadow under body
              ctx.fillStyle = gameplayWoolGrad;
              ctx.beginPath();
              ctx.arc(0, -entSize * 0.22, entSize * 0.19, 0, Math.PI*2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(-entSize * 0.18, -entSize * 0.2, entSize * 0.16, 0, Math.PI*2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(entSize * 0.18, -entSize * 0.2, entSize * 0.16, 0, Math.PI*2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(-entSize * 0.08, -entSize * 0.32, entSize * 0.17, 0, Math.PI*2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(entSize * 0.08, -entSize * 0.32, entSize * 0.17, 0, Math.PI*2);
              ctx.fill();

              // Draw decorative concentric curls to give high-poly detail!
              ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
              ctx.lineWidth = 0.9;
              ctx.beginPath();
              ctx.arc(0, -entSize * 0.22, entSize * 0.11, 0, Math.PI*2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(-entSize * 0.14, -entSize * 0.2, entSize * 0.08, 0, Math.PI*2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(entSize * 0.14, -entSize * 0.2, entSize * 0.08, 0, Math.PI*2);
              ctx.stroke();
              
              // 4. Detailed head protruding with glossy black eyes & highlight
              ctx.fillStyle = '#1E293B'; // deep slate face skin
              ctx.beginPath();
              ctx.ellipse(entSize * 0.25, -entSize * 0.24, entSize * 0.12, entSize * 0.12, 0.05, 0, Math.PI*2);
              ctx.fill();

              // Cute ears
              ctx.fillStyle = '#1E293B';
              ctx.beginPath();
              ctx.ellipse(entSize * 0.2, -entSize * 0.28, entSize * 0.04, entSize * 0.08, -0.4, 0, Math.PI*2);
              ctx.fill();
              
              // Pink inner ear
              ctx.fillStyle = '#FFB7CD';
              ctx.beginPath();
              ctx.ellipse(entSize * 0.2, -entSize * 0.28, entSize * 0.02, entSize * 0.05, -0.4, 0, Math.PI*2);
              ctx.fill();
              
              // Little cute white woolly wig on head
              ctx.fillStyle = gameplayWoolGrad;
              ctx.beginPath();
              ctx.arc(entSize * 0.24, -entSize * 0.34, entSize * 0.05, 0, Math.PI*2);
              ctx.fill();

              // Cute red collar around neck
              ctx.strokeStyle = '#EF4444';
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.moveTo(entSize * 0.12, -entSize * 0.16);
              ctx.lineTo(entSize * 0.24, -entSize * 0.14);
              ctx.stroke();

              // Shiny glass golden bell hanging
              const bellX = entSize * 0.18;
              const bellY = -entSize * 0.12;
              const bellRadius = entSize * 0.038;
              const gameplayBellGrad = ctx.createRadialGradient(bellX - bellRadius * 0.3, bellY - bellRadius * 0.3, bellRadius * 0.15, bellX, bellY, bellRadius);
              gameplayBellGrad.addColorStop(0, '#FEF08A');
              gameplayBellGrad.addColorStop(0.7, '#FBBF24');
              gameplayBellGrad.addColorStop(1.0, '#B45309');
              ctx.fillStyle = gameplayBellGrad;
              ctx.strokeStyle = '#78350F';
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.arc(bellX, bellY, bellRadius, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // Glowing soft pink cheek blush
              ctx.fillStyle = 'rgba(244, 114, 182, 0.72)';
              ctx.beginPath();
              ctx.arc(entSize * 0.28, -entSize * 0.22, entSize * 0.024, 0, Math.PI * 2);
              ctx.fill();

              // Cute happy closed eye
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 1.15;
              ctx.beginPath();
              ctx.arc(entSize * 0.28, -entSize * 0.25, entSize * 0.02, Math.PI, 0, true);
              ctx.stroke();
              
              ctx.restore();
            } else if (ent.type === 'goat') {
              // Cute mountain goat with curly horns and short chin beard
              ctx.save();
              ctx.translate(entX, entY);
              
              // 1. Shadow
              ctx.fillStyle = 'rgba(0,0,0,0.18)';
              ctx.beginPath();
              ctx.ellipse(0, 0, entSize * 0.42, entSize * 0.08, 0, 0, Math.PI*2);
              ctx.fill();
              
              // 2. Thin athletic legs
              ctx.fillStyle = '#451A03';
              ctx.fillRect(-entSize * 0.16, -entSize * 0.1, entSize * 0.04, entSize * 0.18);
              ctx.fillRect(-entSize * 0.04, -entSize * 0.1, entSize * 0.04, entSize * 0.16);
              ctx.fillRect(entSize * 0.08, -entSize * 0.1, entSize * 0.04, entSize * 0.18);
              ctx.fillRect(entSize * 0.18, -entSize * 0.1, entSize * 0.04, entSize * 0.16);
              
              // 3. Goat body
              ctx.fillStyle = '#E5E7EB'; // light mountain grey
              ctx.beginPath();
              ctx.ellipse(0, -entSize * 0.24, entSize * 0.3, entSize * 0.18, 0.04, 0, Math.PI*2);
              ctx.fill();
              
              // Peculiar brown spot on back
              ctx.fillStyle = '#B45309';
              ctx.beginPath();
              ctx.ellipse(-entSize * 0.1, -entSize * 0.26, entSize * 0.13, entSize * 0.08, -0.2, 0, Math.PI*2);
              ctx.fill();
              
              // 4. Head with white beard under chin (Authentic character detail!)
              ctx.fillStyle = '#E5E7EB';
              ctx.beginPath();
              ctx.ellipse(entSize * 0.26, -entSize * 0.34, entSize * 0.11, entSize * 0.14, 0.14, 0, Math.PI*2);
              ctx.fill();
              
              // Goat beard
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.moveTo(entSize * 0.25, -entSize * 0.22);
              ctx.lineTo(entSize * 0.29, -entSize * 0.15); // fuzzy pointy chin tip
              ctx.lineTo(entSize * 0.32, -entSize * 0.24);
              ctx.closePath();
              ctx.fill();

              // Curving amber horns
              ctx.strokeStyle = '#D97706';
              ctx.lineWidth = entSize * 0.052;
              ctx.beginPath();
              ctx.arc(entSize * 0.2, -entSize * 0.44, entSize * 0.11, Math.PI * 1.0, Math.PI * 1.6);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(entSize * 0.25, -entSize * 0.44, entSize * 0.11, Math.PI * 1.0, Math.PI * 1.6);
              ctx.stroke();
              
              ctx.restore();
            } else if (ent.type === 'lion') {
              // Majestic running leão (sprinting beast!)
              ctx.save();
              ctx.translate(entX, entY);
              
              const runCycle = Math.sin(progressDist * 0.45 + ent.z * 0.14);
              const bounceY = runCycle * entSize * 0.14;
              ctx.translate(0, bounceY);
              
              // Tail
              ctx.strokeStyle = '#B45309';
              ctx.lineWidth = entSize * 0.08;
              ctx.beginPath();
              ctx.moveTo(-entSize * 0.2, -entSize * 0.15);
              ctx.quadraticCurveTo(-entSize * 0.6, -entSize * 0.5 + runCycle * 5, -entSize * 0.7, -entSize * 0.25);
              ctx.stroke();
              ctx.fillStyle = '#1A0B04';
              ctx.beginPath();
              ctx.arc(-entSize * 0.7, -entSize * 0.25, entSize * 0.11, 0, Math.PI*2);
              ctx.fill();
              
              // Moving limbs
              ctx.fillStyle = '#D97706';
              const legW = entSize * 0.14;
              const legH = entSize * 0.45;
              ctx.fillRect(-entSize * 0.35 + Math.sin(progressDist * 0.4) * 6, -entSize * 0.1, legW, legH);
              ctx.fillRect(entSize * 0.25 - Math.sin(progressDist * 0.4) * 6, -entSize * 0.1, legW, legH);
              
              // Golden athletic body
              const bodyGrad = ctx.createLinearGradient(-entSize * 0.4, -entSize * 0.5, entSize * 0.4, 0);
              bodyGrad.addColorStop(0, '#B45309');
              bodyGrad.addColorStop(0.5, '#D97706');
              bodyGrad.addColorStop(1, '#F59E0B');
              ctx.fillStyle = bodyGrad;
              ctx.beginPath();
              ctx.ellipse(0, -entSize * 0.22, entSize * 0.45, entSize * 0.28, 0.04, 0, Math.PI * 2);
              ctx.fill();
              
              // Front limbs closer
              ctx.fillStyle = '#F59E0B';
              ctx.fillRect(-entSize * 0.25 - Math.sin(progressDist * 0.4) * 6, -entSize * 0.1, legW, legH);
              ctx.fillRect(entSize * 0.35 + Math.sin(progressDist * 0.4) * 6, -entSize * 0.1, legW, legH);
              
              // HUGE MANE
              const maneRadius = entSize * 0.35;
              const maneGrad = ctx.createRadialGradient(0, -entSize * 0.55, 2, 0, -entSize * 0.55, maneRadius);
              maneGrad.addColorStop(0, '#78350F');
              maneGrad.addColorStop(0.8, '#451A03');
              maneGrad.addColorStop(1, '#1A0B04');
              ctx.fillStyle = maneGrad;
              ctx.beginPath();
              ctx.arc(0, -entSize * 0.55, maneRadius, 0, Math.PI*2);
              ctx.fill();
              
              // Face
              ctx.fillStyle = '#F59E0B';
              ctx.beginPath();
              ctx.ellipse(0, -entSize * 0.55, entSize * 0.24, entSize * 0.24, 0, 0, Math.PI*2);
              ctx.fill();
              
              // Snout
              ctx.fillStyle = '#FFFBEB';
              ctx.beginPath();
              ctx.ellipse(-entSize * 0.05, -entSize * 0.48, entSize * 0.08, entSize * 0.06, 0, 0, Math.PI * 2);
              ctx.ellipse(entSize * 0.05, -entSize * 0.48, entSize * 0.08, entSize * 0.06, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#000000';
              ctx.beginPath();
              ctx.moveTo(-entSize * 0.04, -entSize * 0.52);
              ctx.lineTo(entSize * 0.04, -entSize * 0.52);
              ctx.lineTo(0, -entSize * 0.47);
              ctx.closePath();
              ctx.fill();
              
              // Glowing gold eyes with pupils
              ctx.fillStyle = '#FBBF24';
              ctx.beginPath();
              ctx.arc(-entSize * 0.08, -entSize * 0.62, entSize * 0.045, 0, Math.PI*2);
              ctx.arc(entSize * 0.08, -entSize * 0.62, entSize * 0.045, 0, Math.PI*2);
              ctx.fill();
              ctx.fillStyle = '#000000';
              ctx.beginPath();
              ctx.arc(-entSize * 0.08, -entSize * 0.62, entSize * 0.02, 0, Math.PI*2);
              ctx.arc(entSize * 0.08, -entSize * 0.62, entSize * 0.02, 0, Math.PI*2);
              ctx.fill();
              
              // Savage sharp white fangs protruding from its snout to look spectacular
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              // Left fang
              ctx.moveTo(-entSize * 0.05, -entSize * 0.44);
              ctx.lineTo(-entSize * 0.035, -entSize * 0.37);
              ctx.lineTo(-entSize * 0.01, -entSize * 0.44);
              // Right fang
              ctx.moveTo(entSize * 0.01, -entSize * 0.44);
              ctx.lineTo(entSize * 0.035, -entSize * 0.37);
              ctx.lineTo(entSize * 0.05, -entSize * 0.44);
              ctx.closePath();
              ctx.fill();
              
              ctx.restore();
            } else if (ent.type === 'tree') {
              // Majestic organic gnarled tree standing on the lane! Must be dodged.
              ctx.save();
              ctx.translate(entX, entBaseY);
              
              const hScale = entSize * 1.5;
              
              // 1. Shadow cast under the tree
              ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
              ctx.beginPath();
              ctx.ellipse(0, 0, hScale * 0.58, hScale * 0.12, 0, 0, Math.PI * 2);
              ctx.fill();
              
              // 2. Thick organic gnarled trunk with roots spanning out
              ctx.fillStyle = '#451A03'; // deep bark
              ctx.strokeStyle = '#270E00';
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              // Left side
              ctx.moveTo(-hScale * 0.16, 0);
              ctx.quadraticCurveTo(-hScale * 0.12, -hScale * 0.35, -hScale * 0.08, -hScale * 0.55);
              ctx.lineTo(-hScale * 0.06, -hScale * 0.85); // Splitting branch left
              ctx.lineTo(-hScale * 0.16, -hScale * 1.05);
              ctx.lineTo(-hScale * 0.09, -hScale * 1.15);
              ctx.lineTo(-hScale * 0.01, -hScale * 0.92);
              // Center / Right side
              ctx.lineTo(hScale * 0.01, -hScale * 0.92);
              ctx.lineTo(hScale * 0.09, -hScale * 1.15);
              ctx.lineTo(hScale * 0.16, -hScale * 1.05);
              ctx.lineTo(hScale * 0.06, -hScale * 0.85); // Splitting branch right
              ctx.lineTo(hScale * 0.08, -hScale * 0.55);
              ctx.quadraticCurveTo(hScale * 0.12, -hScale * 0.35, hScale * 0.16, 0);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              
              // 3. Bark wood lines / contours for premium organic look
              ctx.strokeStyle = '#78350F';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(-hScale * 0.05, -hScale * 0.2);
              ctx.quadraticCurveTo(-hScale * 0.06, -hScale * 0.5, -hScale * 0.04, -hScale * 0.8);
              ctx.moveTo(hScale * 0.05, -hScale * 0.15);
              ctx.quadraticCurveTo(hScale * 0.06, -hScale * 0.55, hScale * 0.03, -hScale * 0.78);
              ctx.moveTo(0, -hScale * 0.05);
              ctx.lineTo(0, -hScale * 0.88);
              ctx.stroke();
              
              // Roots flare at base
              ctx.strokeStyle = '#270E00';
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.moveTo(-hScale * 0.12, 0);
              ctx.quadraticCurveTo(-hScale * 0.22, hScale * 0.01, -hScale * 0.28, hScale * 0.04);
              ctx.moveTo(hScale * 0.12, 0);
              ctx.quadraticCurveTo(hScale * 0.22, hScale * 0.01, hScale * 0.28, hScale * 0.04);
              ctx.stroke();

              // 4. Multi-layered lush green canopy (folha verde viva)
              const leafColors = ['#14532D', '#166534', '#15803D', '#22C55E', '#4ADE80'];
              const fY = -hScale * 1.15;
              
              const drawCanopyPuff = (cx: number, cy: number, r: number) => {
                // Layer A: Dark base
                ctx.fillStyle = leafColors[0];
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
                
                // Layer B: Mid shade
                ctx.fillStyle = leafColors[1];
                ctx.beginPath();
                ctx.arc(cx + r * 0.1, cy + r * 0.08, r * 0.88, 0, Math.PI * 2);
                ctx.fill();
                
                // Layer C: Bright green highlight
                ctx.fillStyle = leafColors[2];
                ctx.beginPath();
                ctx.arc(cx - r * 0.12, cy - r * 0.1, r * 0.76, 0, Math.PI * 2);
                ctx.fill();
                
                // Layer D: Sun kissed crest
                ctx.fillStyle = leafColors[3];
                ctx.beginPath();
                ctx.arc(cx - r * 0.18, cy - r * 0.2, r * 0.52, 0, Math.PI * 2);
                ctx.fill();

                // Distinctive speck line edge
                ctx.strokeStyle = '#14532D';
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();
              };
              
              // Render multiple grouped puffs mapping a realistic full foliage
              drawCanopyPuff(0, fY, hScale * 0.52);
              drawCanopyPuff(-hScale * 0.28, fY + hScale * 0.12, hScale * 0.38);
              drawCanopyPuff(hScale * 0.28, fY + hScale * 0.12, hScale * 0.38);
              drawCanopyPuff(-hScale * 0.18, fY - hScale * 0.2, hScale * 0.42);
              drawCanopyPuff(hScale * 0.18, fY - hScale * 0.2, hScale * 0.42);
              
              ctx.stroke();
              ctx.restore();
            } else {
              // fallback: rock/box
              ctx.fillStyle = '#4B5563';
              ctx.beginPath();
              ctx.arc(entX, entY, entSize * 0.7, Math.PI, 0);
              ctx.closePath();
              ctx.fill();
              ctx.strokeStyle = '#1F2937';
              ctx.stroke();
            }
          }
        });
      });

      // --- Sort Render List by depth (Painters Algorithm) and Render everything! ---
      renderList.sort((a, b) => a.z - b.z).forEach(item => item.draw());

      // --- RENDER RUNNER DAVID IN PSEUDO-3D ---
      const isReiDavid = characterSelected === 'rei_david';
      const playerLaneX = vanishingX + (runner.y - vanishingY) * 0.8 * (currentLaneX - 1);
      const visualSize = 115; // Raised to 115 to represent ~25% of the screen height, making David feel closer and prominent!

      // WALK / RUN LIFELIKE LEG CYCLE CALCULATION
      const legWalkCycle = progressDist * 0.16; // Perfectly coordinated leg speed matching swift scenery glide

      // Organic vertical bobbing of the torso, head and arms while running!
      // When both feet impact the ground it creates a contact dip. At the peak of flight, the runner rises.
      // We use Math.abs(Math.sin) to make it bob twice per full stride cycle (contact phase of both legs).
      const bodyBob = runner.jumpHeight > 0 
        ? 0 
        : Math.abs(Math.sin(legWalkCycle)) * (visualSize * 0.08) - (visualSize * 0.04);

      const playerVisualY = runner.y - runner.jumpHeight;

      // Draw shadow on the ground
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(playerLaneX, runner.y, visualSize * 0.65, visualSize * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic physical dust clouds kicked up by David's running feet (proportional to visualSize)
      if (!is3DGameOverRef.current && runner.jumpHeight === 0) {
        ctx.save();
        const dustSeed = (progressDist * 0.15) % 100;
        ctx.fillStyle = 'rgba(215, 195, 160, 0.45)'; // warm dusty beige puffs
        for (let d = 0; d < 8; d++) {
          const sideFactor = d % 2 === 0 ? -1 : 1;
          const footX = playerLaneX + sideFactor * (visualSize * 0.16) + Math.sin(dustSeed + d) * (visualSize * 0.08);
          const shiftX = - (speedCoef * 0.4) - (d * 1.8);
          const shiftY = Math.cos(dustSeed + d) * 3 + (visualSize * 0.02);
          const radiusDust = (1.5 + (d % 3) * 2) * (visualSize / 75);
          ctx.beginPath();
          ctx.arc(footX + shiftX, runner.y + shiftY, radiusDust, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw spectacular glowing protective indicator ring matching the reference image!
      ctx.save();
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(playerLaneX, runner.y, visualSize * 0.9, visualSize * 0.23, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // --- UNIFIED HIGH-QUALITY PLAYER RUNNER WRAPPER (Tilt, Leans, Squash/Stretch) ---
      ctx.save();
      // Translate to Character current position
      ctx.translate(playerLaneX, playerVisualY + bodyBob);

      // SQUASH & STRETCH Dynamics (Classic squishing upon ground-landing impact, stretching when scaling jumps)
      let squishX = 1.0;
      let squishY = 1.0;
      if (!runner.isGrounded) {
        squishX = 0.94;
        squishY = 1.06;
      } else if (runner.landSquish > 0) {
        const squishRatio = runner.landSquish / 10;
        squishY = 1.0 - 0.15 * Math.sin(squishRatio * Math.PI);
        squishX = 1.0 + 0.15 * Math.sin(squishRatio * Math.PI);
      }
      ctx.scale(squishX, squishY);

      // DYNAMIC COHESIVE SYSTEM ROTATION: Combines lane movement lean & active fast forward sprint slant
      const laneDifference = targetLane - currentLaneX;
      const turnTilt = laneDifference * -0.15; // Leaning organically into left/right side moves
      const athleticSprintLean = 0.06; // Lean forward to represent wind drag and sprint momentum!
      ctx.rotate(turnTilt + athleticSprintLean);

      const draw3DLeg = (isLeft: boolean, phase: number) => {
        ctx.save();
        const fSns = isLeft ? -1 : 1;
        
        // Hip placement relative to character base origin
        let hipX = fSns * (visualSize * 0.135) + (runner.state === 'correndo' ? Math.cos(phase) * (visualSize * 0.012) : 0);
        const hipY = -visualSize * 0.22;
        
        // Striding leg ankle calculations with high impact bending and smooth floor alignment
        let ankleX = 0;
        let ankleY = 0; // relative to base ground line
        let kneeX = 0;
        let kneeY = 0;

        if (runner.state === 'saltando') {
          // Heroic leaping pose: freezes air pedaling to eliminate hovering/floating feel
          if (isLeft) {
            // Left leg trailing backwards
            ankleX = -visualSize * 0.18;
            ankleY = -visualSize * 0.11;
            kneeX = -visualSize * 0.07;
            kneeY = -visualSize * 0.19;
          } else {
            // Right leg bent high and forward
            ankleX = visualSize * 0.15;
            ankleY = -visualSize * 0.26;
            kneeX = visualSize * 0.17;
            kneeY = -visualSize * 0.12;
          }
        } else {
          // PERFECT ATHLETIC STRIDE ENGINE - 3D BACK VIEW RUNNING
          const swing = Math.sin(phase);
          const push = Math.cos(phase);
          
          ankleX = fSns * (visualSize * 0.12) + swing * (visualSize * 0.17);
          
          if (push < 0) {
            // Ground drive/contact phase: flat on the road, moving backward relative to torso
            ankleY = 0;
            kneeX = fSns * (visualSize * 0.12) + swing * (visualSize * 0.08);
            kneeY = -visualSize * 0.11 + (visualSize * 0.03); // slightly flexed loaded knee
          } else {
            // Recovery/flight phase: knee swings forward, foot lifts way back!
            ankleY = -push * (visualSize * 0.28); // kick heels up!
            ankleX -= fSns * (visualSize * 0.05) * push; // pull inward
            kneeX = fSns * (visualSize * 0.12) + swing * (visualSize * 0.08) - fSns * (visualSize * 0.04) * push;
            kneeY = -visualSize * 0.14 - push * (visualSize * 0.05); // lift knee up
          }
        }
        
        // 1. Smooth fleshy skin legs cylinders with tapered muscle widths
        const legGrad = ctx.createLinearGradient(hipX, hipY, ankleX, ankleY);
        legGrad.addColorStop(0, '#FED7AA');
        legGrad.addColorStop(1, '#FDBA74');
        
        // Thigh segment - thicker
        ctx.strokeStyle = legGrad;
        ctx.lineWidth = visualSize * 0.165;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.stroke();

        // Knee blend joint
        ctx.fillStyle = '#FED7AA';
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, visualSize * 0.075, 0, Math.PI * 2);
        ctx.fill();

        // Calf segment - tapered slightly narrower
        ctx.strokeStyle = legGrad;
        ctx.lineWidth = visualSize * 0.115;
        ctx.beginPath();
        ctx.moveTo(kneeX, kneeY);
        ctx.lineTo(ankleX, ankleY);
        ctx.stroke();

        // 1b. Muscle Highlights (gives muscular, athletic definition in 3D)
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = visualSize * 0.035;
        ctx.beginPath();
        ctx.moveTo(hipX + fSns * 2, hipY + 4);
        ctx.lineTo(kneeX, kneeY - 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
        ctx.lineWidth = visualSize * 0.035;
        ctx.beginPath();
        ctx.moveTo(kneeX, kneeY + 2);
        ctx.lineTo(ankleX, ankleY - 2);
        ctx.stroke();
        ctx.restore();
        
        // 2. Leather sandals crossed laces wrapped securely around calves (Premium rendering details)
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 2.0;
        const diffX = ankleX - kneeX;
        const diffY = ankleY - kneeY;
        const numStraps = 3;
        for (let s = 1; s <= numStraps; s++) {
          const ratio = s / (numStraps + 1);
          const px = kneeX + diffX * ratio;
          const py = kneeY + diffY * ratio;
          const normX = -diffY * 0.11;
          const normY = diffX * 0.11;
          ctx.beginPath();
          ctx.moveTo(px - normX, py - normY);
          ctx.lineTo(px + normX, py + normY);
          ctx.stroke();
        }
        
        // 3. Sandal Sole (Bottom brown protector - Rotated naturally depending on leg swing angle!)
        ctx.save();
        ctx.translate(ankleX, ankleY);
        const legAngle = Math.atan2(ankleY - kneeY, ankleX - kneeX);
        ctx.rotate(legAngle - Math.PI / 2);
        
        ctx.fillStyle = '#270E00';
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(-visualSize * 0.095, -visualSize * 0.02, visualSize * 0.19, visualSize * 0.05, 2);
        ctx.fill();
        ctx.stroke();
        
        // Flesh heel bubble
        ctx.fillStyle = '#FED7AA';
        ctx.beginPath();
        ctx.arc(0, -visualSize * 0.035, visualSize * 0.055, 0, Math.PI * 2);
        ctx.fill();

        // Heel strap cords
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-visualSize * 0.06, -visualSize * 0.03);
        ctx.lineTo(0, -visualSize * 0.065);
        ctx.lineTo(visualSize * 0.06, -visualSize * 0.03);
        ctx.stroke();
        
        ctx.restore();
        ctx.restore();
      };

      // Draw running legs in fluid alternating strides
      draw3DLeg(true, legWalkCycle);
      draw3DLeg(false, legWalkCycle + Math.PI);

      // --- APPLY UPPER BODY SKELETON ROTATION & SWAY (High-fidelity skeletal spine swing!) ---
      ctx.save();
      const swayAngle = Math.sin(legWalkCycle) * 0.07 * (runner.state === 'correndo' ? 1 : 0);
      ctx.translate(0, -visualSize * 0.3); // Rotate around tailbone lumbar
      ctx.rotate(swayAngle);
      ctx.translate(0, visualSize * 0.3);

      // --- 3D CAPE / CLOAK (ONLY for King David if selected, otherwise no cape for shepherd!) ---
      if (isReiDavid) {
        ctx.save();
        const capeWidth = visualSize * 0.54;
        const capeGrad = ctx.createLinearGradient(-capeWidth, 0, capeWidth, 0);
        capeGrad.addColorStop(0, '#5B21B6'); // Deep Royal Violet
        capeGrad.addColorStop(0.5, '#7C3AED'); // Luminous Violet highlight
        capeGrad.addColorStop(1, '#3B0764'); // Rich dark occlusion shadow
        ctx.fillStyle = capeGrad;
        
        // Fluttering cape waves driven dynamically by wind & momentum
        const capeWind = Math.sin(Date.now() * 0.015) * 9;
        const capeWind2 = Math.cos(Date.now() * 0.011) * 4.5;

        ctx.beginPath();
        ctx.moveTo(-visualSize * 0.35, -visualSize * 0.72);
        ctx.lineTo(visualSize * 0.35, -visualSize * 0.72);
        ctx.bezierCurveTo(
          visualSize * 0.55 + capeWind2, -visualSize * 0.2, 
          visualSize * 0.48 + capeWind, 10, 
          visualSize * 0.44 + capeWind, 18
        );
        ctx.lineTo(-visualSize * 0.44 + capeWind, 18);
        ctx.bezierCurveTo(
          -visualSize * 0.48 + capeWind, 10, 
          -visualSize * 0.55 + capeWind2, -visualSize * 0.2, 
          -visualSize * 0.35, -visualSize * 0.72
        );
        ctx.closePath();
        ctx.fill();

        // Elegant embroidered gold margin borders
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 2.0;
        ctx.stroke();
        ctx.restore();
      }

      // --- 3D TUNIC BODY (Curved, folds, organic cream cotton for Shepherd, noble gold for King) ---
      ctx.save();
      const tunicGrad3D = ctx.createLinearGradient(0, -visualSize * 0.8, 0, -visualSize * 0.15);
      if (isReiDavid) {
        tunicGrad3D.addColorStop(0, '#FFE082');
        tunicGrad3D.addColorStop(0.4, '#FBBF24');
        tunicGrad3D.addColorStop(0.8, '#D97706');
        tunicGrad3D.addColorStop(1, '#78350F');
      } else {
        tunicGrad3D.addColorStop(0, '#FDFBF7'); // Pristine bright cream linen
        tunicGrad3D.addColorStop(0.5, '#F5ECE1'); // Soft warm shadow
        tunicGrad3D.addColorStop(1, '#CBBBA2'); // Rich shadowed fold texture at base
      }
      ctx.fillStyle = tunicGrad3D;
      
      ctx.beginPath();
      // Draw athletic, broad-shouldered V-tapered tunic silhouette
      ctx.moveTo(-visualSize * 0.35, -visualSize * 0.75); // Masculine athletic shoulders
      ctx.lineTo(visualSize * 0.35, -visualSize * 0.75);
      ctx.lineTo(visualSize * 0.24, -visualSize * 0.45); // Cinched waist under belt
      ctx.lineTo(visualSize * 0.27, -visualSize * 0.15); // Hem flare
      // Wavy ragged bottom edge folds
      ctx.quadraticCurveTo(visualSize * 0.12, -visualSize * 0.10, 0, -visualSize * 0.14);
      ctx.quadraticCurveTo(-visualSize * 0.12, -visualSize * 0.10, -visualSize * 0.27, -visualSize * 0.15);
      ctx.lineTo(-visualSize * 0.24, -visualSize * 0.45);
      ctx.closePath();
      ctx.fill();

      // Golden collar embroidery for both shepherd/king to look premium
      ctx.strokeStyle = isReiDavid ? '#B45309' : '#D97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -visualSize * 0.75, visualSize * 0.11, 0, Math.PI);
      ctx.stroke();

      // Shadow overlay crease lines to represent physical textile folds
      ctx.strokeStyle = isReiDavid ? 'rgba(146, 64, 14, 0.45)' : 'rgba(139, 115, 85, 0.3)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -visualSize * 0.7);
      ctx.lineTo(-2, -visualSize * 0.22);
      ctx.moveTo(-visualSize * 0.12, -visualSize * 0.55);
      ctx.lineTo(-visualSize * 0.17, -visualSize * 0.18);
      ctx.moveTo(visualSize * 0.12, -visualSize * 0.6);
      ctx.lineTo(visualSize * 0.09, -visualSize * 0.18);
      ctx.stroke();
      ctx.restore();

      // --- LIFE-LIKE RUNNING ARM SEGMENT ANIMATIONS (90-degree bent elbow pump - Back View) ---
      const draw3DArm = (isLeft: boolean, phase: number) => {
        ctx.save();
        const fSns = isLeft ? -1 : 1;
        
        const shoulderX = fSns * (visualSize * 0.31);
        const shoulderY = -visualSize * 0.72;
        
        let elbowX = 0;
        let elbowY = 0;
        let handX = 0;
        let handY = 0;

        if (runner.state === 'saltando') {
          // Heroic leaping balance arm overrides
          if (isLeft) {
            // Left arm pointing back and down for visual balance
            elbowX = shoulderX - visualSize * 0.12;
            elbowY = shoulderY + visualSize * 0.14;
            handX = elbowX - visualSize * 0.08;
            handY = elbowY - visualSize * 0.04;
          } else {
            // Right arm reaching forward and up
            elbowX = shoulderX + visualSize * 0.08;
            elbowY = shoulderY + visualSize * 0.05;
            handX = elbowX + visualSize * 0.10;
            handY = elbowY - visualSize * 0.12;
          }
        } else {
          // NATURAL ATHLETIC ELBOW PUMP CYCLE (Back-view perspective)
          const swing = Math.sin(phase); // swings continuously between -1 and 1
          
          if (swing > 0) {
            // Arm is pumping forward (elbow bent, hand rises towards chest center)
            elbowX = shoulderX + fSns * (visualSize * 0.04) - fSns * (visualSize * 0.06) * swing;
            elbowY = shoulderY + (visualSize * 0.22) + (visualSize * 0.04) * swing;
            
            handX = shoulderX - fSns * (visualSize * 0.08) * swing;
            handY = shoulderY + (visualSize * 0.14) - (visualSize * 0.04) * swing;
          } else {
            // Arm is pumping backward (elbow flares out and high, hand trails down/back near hips)
            elbowX = shoulderX + fSns * (visualSize * 0.14) * Math.abs(swing);
            elbowY = shoulderY + (visualSize * 0.20) - (visualSize * 0.06) * Math.abs(swing);
            
            handX = elbowX + fSns * (visualSize * 0.05) * Math.abs(swing);
            handY = elbowY + (visualSize * 0.15) * Math.abs(swing);
          }
        }
        
        // 1. Smooth Skin Arm segments
        const armGrad = ctx.createLinearGradient(shoulderX, shoulderY, handX, handY);
        armGrad.addColorStop(0, '#FED7AA');
        armGrad.addColorStop(1, '#FDBA74');
        ctx.strokeStyle = armGrad;
        ctx.lineWidth = visualSize * 0.105; // Muscle-toned cartoon arms
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // 3D Muscle highlight lines
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = visualSize * 0.03;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY + 2);
        ctx.lineTo(elbowX, elbowY - 1);
        ctx.stroke();
        ctx.restore();
        
        // 2. Leather bracers (Drawn exactly at the wrist before the hand/fist)
        ctx.save();
        ctx.strokeStyle = '#451A03';
        ctx.lineWidth = visualSize * 0.085;
        const fdx = handX - elbowX;
        const fdy = handY - elbowY;
        const flen = Math.hypot(fdx, fdy) || 1;
        const fnx = -fdy / flen * (visualSize * 0.045);
        const fny = fdx / flen * (visualSize * 0.045);
        const wx = handX - fdx / flen * (visualSize * 0.02);
        const wy = handY - fdy / flen * (visualSize * 0.02);
        ctx.beginPath();
        ctx.moveTo(wx - fnx, wy - fny);
        ctx.lineTo(wx + fnx, wy + fny);
        ctx.stroke();

        // Gold studs for King's royal armguards
        if (isReiDavid) {
          ctx.fillStyle = '#FBBF24';
          ctx.beginPath();
          ctx.arc(wx, wy, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 3. Realistic anatomical fists instead of stumpy sticks!
        ctx.save();
        ctx.fillStyle = '#FED7AA';
        ctx.strokeStyle = '#E68A4F';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(handX, handY, visualSize * 0.057, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Thumb overlapping
        ctx.fillStyle = '#FDBA74';
        ctx.beginPath();
        ctx.arc(handX + fSns * (visualSize * 0.018), handY + (visualSize * 0.012), visualSize * 0.024, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // 4. Overlapping short Tunic sleeves (overlaying arm connection with 3D puff!)
        ctx.save();
        ctx.fillStyle = isReiDavid ? '#D97706' : '#FDFBF7';
        ctx.strokeStyle = isReiDavid ? '#FEF08A' : '#E7D8C4';
        ctx.lineWidth = 1.5;
        
        ctx.translate(shoulderX, shoulderY);
        const armAngle = Math.atan2(elbowY - shoulderY, elbowX - shoulderX);
        ctx.rotate(armAngle);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, visualSize * 0.11, visualSize * 0.075, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Sleeve hem border
        ctx.strokeStyle = isReiDavid ? '#FBBF24' : '#E0D2BE';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(visualSize * 0.04, 0, visualSize * 0.075, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.restore();
        
        ctx.restore();
      };

      // Arms pump in anti-phase sync with opposite legs
      draw3DArm(true, legWalkCycle + Math.PI);
      draw3DArm(false, legWalkCycle);

      // --- BLUE WAIST SASH (Faixa Azul - Authentic shepherd belt tied at the waist from back view) ---
      ctx.save();
      ctx.fillStyle = isReiDavid ? '#4F46E5' : '#1D4ED8'; // Bright royal/pastor blue sash
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 1.0;
      
      const sashY = -visualSize * 0.51;
      const sashW = visualSize * 0.53;
      const sashH = visualSize * 0.11;
      const sashX = -sashW / 2;
      
      ctx.beginPath();
      ctx.roundRect(sashX, sashY, sashW, sashH, 3.2);
      ctx.fill();
      ctx.stroke();

      // Overlying sturdy leather belt
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.roundRect(-sashW * 0.45, sashY + sashH * 0.2, sashW * 0.9, sashH * 0.6, 1);
      ctx.fill();

      // In the back view, the belt buckle is on the front side, so on the back side we see
      // the sash elegantly tied with fluttering back ties blowing in the wind!
      ctx.fillStyle = isReiDavid ? '#4F46E5' : '#1D4ED8';
      const tieOscBack = Math.sin(Date.now() * 0.01) * 4.5;
      ctx.beginPath();
      ctx.moveTo(-4, sashY + sashH);
      ctx.bezierCurveTo(-12 + tieOscBack, sashY + sashH + 12, -18 + tieOscBack, sashY + sashH + 20, -15 + tieOscBack, sashY + sashH + 25);
      ctx.lineTo(-8 + tieOscBack, sashY + sashH + 25);
      ctx.bezierCurveTo(-10 + tieOscBack, sashY + sashH + 15, -2, sashY + sashH + 5, 0, sashY + sashH);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(2, sashY + sashH);
      ctx.bezierCurveTo(8 + tieOscBack, sashY + sashH + 10, 14 + tieOscBack, sashY + sashH + 18, 12 + tieOscBack, sashY + sashH + 23);
      ctx.lineTo(6 + tieOscBack, sashY + sashH + 23);
      ctx.bezierCurveTo(4 + tieOscBack, sashY + sashH + 13, 0, sashY + sashH + 5, 0, sashY + sashH);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
  
      // --- SHEPHERD'S DIAGONAL STRAP & POUCH (Bolsa de Pastor - Beautiful back view overlay) ---
      if (!isReiDavid) {
        ctx.save();
        // 1. Diagonal shoulder strap (Right shoulder -> Left waist across the back)
        ctx.strokeStyle = '#451A03'; 
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(visualSize * 0.22, -visualSize * 0.74);
        ctx.lineTo(-visualSize * 0.18, -visualSize * 0.44);
        ctx.stroke();
        
        // 2. Leather satchel pouch resting on left hip
        const pouchX = -visualSize * 0.31;
        const pouchY = -visualSize * 0.37;
        const pouchW = visualSize * 0.17;
        const pouchH = visualSize * 0.17;
        
        ctx.fillStyle = '#78350F';
        ctx.beginPath();
        ctx.roundRect(pouchX, pouchY, pouchW, pouchH, 3);
        ctx.fill();
        
        // Front folding lid flap
        ctx.fillStyle = '#451A03';
        ctx.beginPath();
        ctx.roundRect(pouchX, pouchY, pouchW, pouchH * 0.58, [3, 3, 1, 1]);
        ctx.fill();
        
        // Golden buckle clasp dot
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(pouchX + pouchW / 2, pouchY + pouchH * 0.58, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- WOODEN SLINGSHOT (Funda - Hanging on right side belt loop visible from back) ---
      if (!isReiDavid) {
        ctx.save();
        const slingX = visualSize * 0.24;
        const slingY = -visualSize * 0.45;
        
        // Slingshot frame Y wood shape
        ctx.strokeStyle = '#B45309'; 
        ctx.lineWidth = 1.9;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(slingX, slingY);
        ctx.lineTo(slingX + 4, slingY + 8); 
        ctx.moveTo(slingX + 4, slingY + 8);
        ctx.lineTo(slingX + 0.5, slingY + 13.5);
        ctx.moveTo(slingX + 4, slingY + 8);
        ctx.lineTo(slingX + 7.5, slingY + 12.5);
        ctx.stroke();
        
        // Thin strings hanging down
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(slingX + 0.5, slingY + 13.5);
        ctx.bezierCurveTo(slingX + 2, slingY + 20, slingX + 5, slingY + 20, slingX + 4, slingY + 24);
        ctx.moveTo(slingX + 7.5, slingY + 12.5);
        ctx.bezierCurveTo(slingX + 6, slingY + 20, slingX + 5, slingY + 20, slingX + 4, slingY + 24);
        ctx.stroke();
        
        // Leather release wrap holder at tip
        ctx.fillStyle = '#4B5563';
        ctx.beginPath();
        ctx.arc(slingX + 4, slingY + 24, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- 3D HEAD & SKIN (Back-view perspective, no face details!) ---
      ctx.save();
      // Neck segment
      ctx.fillStyle = '#FED7AA';
      ctx.fillRect(-3.5, -visualSize * 0.93, 7, 7);
      
      const headRadius = visualSize * 0.21;
      const headY = -visualSize * 0.94;
      
      // Beautiful rounded head sphere from back-view
      const headGrad3D = ctx.createRadialGradient(-headRadius * 0.1, headY - headRadius * 0.1, 1, 0, headY, headRadius);
      headGrad3D.addColorStop(0, '#FED7AA'); 
      headGrad3D.addColorStop(0.7, '#FDBA74'); 
      headGrad3D.addColorStop(1.0, '#E68A4F'); 
      
      ctx.fillStyle = headGrad3D;
      ctx.beginPath();
      ctx.arc(0, headY, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Shepherd Headband / Ribbon wrapped around the temple, knotted at the back!
      if (!isReiDavid) {
        ctx.fillStyle = '#DC2626'; // Vibrant Red visual headband
        ctx.beginPath();
        // Shows headband wrapping around back of skull
        ctx.roundRect(-headRadius * 1.01, headY - headRadius * 0.22, headRadius * 2.02, headRadius * 0.22, 1.2);
        ctx.fill();

        // Beautiful headband tie knot in the center back!
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(0, headY - headRadius * 0.11, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Fluttering headband ribbon tails blowing elegantly to the sides in the running wind!
        const tieOsc = Math.sin(Date.now() * 0.015) * 5.2;
        ctx.beginPath();
        ctx.moveTo(0, headY - headRadius * 0.11);
        ctx.quadraticCurveTo(-headRadius * 0.8, headY + headRadius * 0.3 + tieOsc, -headRadius * 1.3, headY + headRadius * 0.45 + tieOsc);
        ctx.lineTo(-headRadius * 1.1, headY + headRadius * 0.55 + tieOsc);
        ctx.quadraticCurveTo(-headRadius * 0.6, headY + headRadius * 0.35 + tieOsc, 0, headY - headRadius * 0.11);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, headY - headRadius * 0.11);
        ctx.quadraticCurveTo(headRadius * 0.7, headY + headRadius * 0.28 - tieOsc, headRadius * 1.15, headY + headRadius * 0.4 - tieOsc);
        ctx.lineTo(headRadius * 1.0, headY + headRadius * 0.5 - tieOsc);
        ctx.quadraticCurveTo(headRadius * 0.5, headY + headRadius * 0.3 - tieOsc, 0, headY - headRadius * 0.11);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // --- 3D CURLY GINGER RED HAIR (Layered locks & highlights matching beautiful RED hair!) ---
      ctx.save();
      const hairShadow = '#7C2D12';       // Deep red mahogany rust shadow
      const hairMain = '#EA580C';         // Vibrant ginger red-orange
      const hairHighlight = '#F97316';    // Luminous sunset red
      
      const drawCurlyLock = (cx: number, cy: number, r: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        // gorgeous glossy highlight curve on raw red curls
        ctx.strokeStyle = '#FEF08A'; // gold sunbeams highlighting ginger hair edges!
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 0.9, Math.PI * 1.6);
        ctx.stroke();
      };

      // Base curly background volume covering back of the skull completely
      drawCurlyLock(-14, headY - 10, 7.5, hairShadow);
      drawCurlyLock(14, headY - 10, 7.5, hairShadow);
      drawCurlyLock(-16, headY - 2, 6.5, hairShadow);
      drawCurlyLock(16, headY - 2, 6.5, hairShadow);
      drawCurlyLock(-8, headY - 16, 8.5, hairShadow);
      drawCurlyLock(8, headY - 16, 8.5, hairShadow);
      drawCurlyLock(0, headY - 18, 9.5, hairShadow);
      
      // Layer 2: Main body of vibrant ginger/red curls draping down
      drawCurlyLock(-9, headY - 8, 7.8, hairMain);
      drawCurlyLock(9, headY - 8, 7.8, hairMain);
      drawCurlyLock(-11, headY - 1, 7.2, hairMain);
      drawCurlyLock(11, headY - 1, 7.2, hairMain);
      drawCurlyLock(-5, headY + 5, 6.8, hairMain); 
      drawCurlyLock(5, headY + 5, 6.8, hairMain);
      drawCurlyLock(0, headY - 6, 8.2, hairMain);
      
      // Layer 3: Sunlit brilliant highlights catching the beautiful horizon sunset
      drawCurlyLock(-5, headY - 14, 6.2, hairHighlight);
      drawCurlyLock(5, headY - 14, 6.2, hairHighlight);
      drawCurlyLock(0, headY - 15, 6.5, hairHighlight);
      drawCurlyLock(-2, headY - 2, 5.8, hairHighlight);
      ctx.restore();

      // --- COROA DE REI DAVID (Golden crown with embedded jewels, rendered only for King selection) ---
      if (isReiDavid) {
        ctx.save();
        ctx.translate(0, -visualSize * 1.14);
        
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(-7, 3);
        ctx.lineTo(-9, -2);
        ctx.lineTo(-4, 1);
        ctx.lineTo(0, -5);
        ctx.lineTo(4, 1);
        ctx.lineTo(9, -2);
        ctx.lineTo(7, 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#EF4444'; // Red ruby jewels
        ctx.beginPath();
        ctx.arc(0, -5, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#10B981'; // Green emerald gems
        ctx.beginPath();
        ctx.arc(-9, -2, 1, 0, Math.PI * 2);
        ctx.arc(9, -2, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-visualSize * 0.45, -visualSize * 0.85, visualSize * 0.9, visualSize * 0.95);
        ctx.restore();
      }

      ctx.restore(); // Restore Upper Body Rotation & Sway
      ctx.restore(); // Restore Player Transform Wrapper State (squish, tilt, translate)

      // --- DRAW FLOATING SCORE PILLS (+10, +2) MATCHING THE IMAGE EXACTLY ---
      floatingTexts3D.forEach(ft => {
        ctx.save();
        const opacity = Math.min(1.0, ft.life / 10);
        ctx.globalAlpha = opacity;
        
        ctx.font = 'black bold 13px sans-serif';
        const textMetric = ctx.measureText(ft.text);
        const pillW = textMetric.width + 16;
        const pillH = 21;
        
        // Exact reference pill color styling (glorious glowing orange with double stroke amber highlights)
        ctx.fillStyle = '#F97316'; 
        ctx.strokeStyle = '#FEF08A'; 
        ctx.lineWidth = 3.2;
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 12;
        
        ctx.beginPath();
        ctx.roundRect(ft.x - pillW / 2, ft.y - pillH / 2, pillW, pillH, 8.5);
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ft.text, ft.x, ft.y + 0.5);
        ctx.restore();
      });

      // Draw active 3D game particles
      particles3D.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Loop triggers
      if (gameState === 'playing_3d' && !is3DGameOverRef.current) {
        animFrame3D = requestAnimationFrame(gameLoop3D);
      }
    };

    animFrame3D = requestAnimationFrame(gameLoop3D);

    return () => {
      cancelAnimationFrame(animFrame3D);
      window.removeEventListener('keydown', handleKD3D);
    };
  }, [gameState, characterSelected, canvas3DElement, gameSessionId]);

  // Touch handlers mapping helper
  const handleTouchStart = (dir: 'left' | 'right' | 'jump' | 'shoot') => {
    touchInputs.current[dir] = true;
  };
  const handleTouchEnd = (dir: 'left' | 'right' | 'jump' | 'shoot') => {
    touchInputs.current[dir] = false;
  };

  // Helper renderer for locked landscape views on mobile iframe sizes
  const handleRotateTrigger = () => {
    setIsRotatingScreen(!isRotatingScreen);
  };

  return (
    <div className={`min-h-screen text-white relative transition-colors duration-500 overflow-x-hidden select-none font-sans bg-[#070b13] flex flex-col justify-between ${
      isRotatingScreen 
        ? 'fixed inset-0 w-[100vh] h-[100vw] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 origin-center overflow-hidden z-50 shadow-[0_0_80px_rgba(0,0,0,0.9)] scale-95 rounded-2xl' 
        : 'w-full relative'
    }`}>
      
      {/* Dynamic Mobile Portrait Friendly Orientation Prompt Banner */}
      {isMobileDevice && isPortrait && !isRotatingScreen && (
        <motion.div 
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-4 py-3 text-xs font-black shadow-[0_4px_15px_rgba(245,158,11,0.25)] z-50 flex items-center justify-between gap-3 font-sans"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">📱</span>
            <p className="leading-tight">
              Para a melhor jogabilidade, gire seu aparelho deitado ou ative a rotação virtual!
            </p>
          </div>
          <button 
            onClick={handleRotateTrigger}
            className="shrink-0 bg-slate-950 text-[#FBBF24] border border-transparent active:border-yellow-300 hover:border-yellow-300 px-3 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-widest shadow-md transition-all active:scale-[0.97]"
          >
            Girar Tela 🔄
          </button>
        </motion.div>
      )}

      {/* 1. APP BAR HEADER REMOVED FOR UNIFIED IN-GAME SCREEN VIEWS */}

      {/* MAIN GAME STAGE CONTAINER */}
      <main className="flex-1 flex items-center justify-center relative p-3">
        
        <AnimatePresence mode="wait">

          {gameState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                sfx.startBGM(); // Safely trigger on click anywhere to bypass policies
              }}
              className="w-full max-w-5xl aspect-square sm:aspect-[1.5/1] md:aspect-[1.91/1] min-h-[380px] sm:min-h-[480px] rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-amber-950/40 shadow-[0_15px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden bg-gradient-to-b from-[#0B0D19] via-[#11112D] via-[#1A1844] via-[#351C55] via-[#5F1A65] via-[#861E58] via-[#B91C1C] via-[#C2410C] via-[#D97706] to-[#15803D] flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 select-none"
            >
              {/* Starry Night Sky details (Little white glowing stars) */}
              <div className="absolute top-[8%] left-[12%] w-1 h-1 bg-white/70 rounded-full blur-[0.5px] animate-pulse" />
              <div className="absolute top-[5%] left-[55%] w-1.5 h-1.5 bg-yellow-100/60 rounded-full blur-[0.5px]" />
              <div className="absolute top-[12%] right-[10%] w-1 h-1 bg-white/80 rounded-full blur-[0.5px] animate-pulse" />
              <div className="absolute top-[22%] left-[45%] w-0.5 h-0.5 bg-white/50 rounded-full" />
              <div className="absolute top-[18%] right-[35%] w-1 h-1 bg-[#93C5FD]/60 rounded-full animate-ping animate-duration-[3s]" />

              {/* Majestic glowing Crescent / Full Moon on upper left */}
              <div className="absolute top-[10%] left-[8%] sm:left-[10%] flex items-center justify-center pointer-events-none">
                {/* Moon Outer Glow Layers */}
                <div className="absolute w-24 h-24 rounded-full bg-yellow-105/10 blur-xl animate-pulse" />
                <div className="absolute w-16 h-16 rounded-full bg-yellow-50/15 blur-md" />
                {/* The Moon Orb */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFFDF5] to-[#E2E8F0] shadow-[0_0_25px_rgba(255,255,255,0.7),inset_-3px_-3px_10px_rgba(0,0,0,0.15)]" />
              </div>

              {/* Layered purple silhouetted mountains in middle ground */}
              {/* Back mountains */}
              <div 
                className="absolute left-0 right-0 bottom-[18%] h-[40%] bg-gradient-to-b from-[#311145]/70 to-[#100319]/90 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 80%, 15% 45%, 32% 65%, 48% 30%, 65% 55%, 82% 35%, 100% 70%, 100% 100%, 0 100%)'
                }}
              />
              {/* Front mountains closer */}
              <div 
                className="absolute left-0 right-0 bottom-[12%] h-[35%] bg-gradient-to-b from-[#240B36]/85 to-[#08010B] pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 90%, 22% 55%, 45% 75%, 68% 42%, 88% 68%, 100% 50%, 100% 100%, 0% 100%)'
                }}
              />

              {/* Rolling pastoral green foothills grass in foreground */}
              <div className="absolute left-0 right-0 bottom-0 h-[15%] bg-gradient-to-b from-[#166534] via-[#14532D] to-[#052E16] border-t border-[#22C55E]/15 pointer-events-none" />

              {/* Flying birds silhouette in the sky */}
              <div className="absolute top-[28%] right-[24%] opacity-55 animate-pulse pointer-events-none">
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0B0D19] fill-current">
                   <path d="M0 6C3 1 8 5 12 12C16 5 21 1 24 6C20 9 15 11 12 12C9 11 4 9 0 6Z" stroke="none" />
                </svg>
              </div>
              <div className="absolute top-[32%] right-[20%] opacity-40 animate-pulse pointer-events-none" style={{ animationDelay: '0.8s' }}>
                <svg width="18" height="9" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0B0D19] fill-current">
                   <path d="M0 6C3 1 8 5 12 12C16 5 21 1 24 6C20 9 15 11 12 12C9 11 4 9 0 6Z" stroke="none" />
                </svg>
              </div>

              {/* Silhouette Tree on the left */}
              <div className="absolute left-[3%] sm:left-[5%] bottom-[12%] w-[24%] max-w-[180px] aspect-[2/3] z-10 pointer-events-none flex flex-col items-center">
                {/* Organic rounded leaves canopy with multiple green gradient bubbles */}
                <div className="w-full aspect-square bg-gradient-to-br from-[#165B20]/90 to-[#0A2F11]/95 rounded-full relative shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                  <div className="absolute -top-3 left-[15%] w-[70%] h-[70%] bg-gradient-to-b from-[#14532D]/90 to-[#052E16]/95 rounded-full" />
                  <div className="absolute top-[10%] -left-4 w-[60%] h-[60%] bg-gradient-to-br from-[#1B6F2D]/90 to-[#0A2F11]/95 rounded-full" />
                  <div className="absolute -right-2 top-[15%] w-[60%] h-[60%] bg-gradient-to-br from-[#114E1B]/95 to-[#05220A]/98 rounded-full" />
                </div>
                {/* Dark brown solid trunk */}
                <div className="w-5 sm:w-7 flex-1 bg-gradient-to-r from-[#170E04] to-[#2E1A08] border-r border-[#3D250D]/20 shadow-inner mr-1.5" />
              </div>

              <WelcomePastureAnimated />

              {/* INNER HUD FOR WELCOME CARD WITH FULL CONTROLS */}
              <div className="w-full flex items-center justify-between gap-3 pb-3 border-b border-white/5 z-30">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate('/')}
                    className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md pointer-events-auto"
                    title="Voltar à Loja Principal"
                  >
                    <ArrowLeft size={11} /> Loja
                  </button>
                  <span className="text-[9px] font-mono tracking-widest text-[#FDE047]/70 uppercase font-black bg-amber-950/40 border border-[#FDE047]/10 px-2 sm:px-2.5 py-0.5 rounded-full">
                    Fé e Coragem
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pointer-events-auto">
                  {/* Real-time stats display */}
                  <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 py-0.5 px-2 rounded-xl text-[9px] font-bold max-sm:hidden">
                    <span className="text-[#3B82F6]">PT: {store.victoryPoints}</span>
                    <span className="text-slate-800">|</span>
                    <span className="text-[#F59E0B]">🪙 {store.coins}</span>
                  </div>

                  {/* Sound controller */}
                  <button 
                    onClick={toggleMute}
                    className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 transition-all active:scale-95 shadow-md flex items-center justify-center w-7 h-7"
                    title={muted ? 'Desmutar' : 'Mutar'}
                  >
                    {muted ? <VolumeX size={11} className="text-slate-500" /> : <Volume2 size={11} className="text-emerald-400" />}
                  </button>

                  {/* Rotate screen toggle */}
                  <button 
                    onClick={handleRotateTrigger}
                    className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 transition-all active:scale-95 shadow-md flex items-center justify-center w-7 h-7"
                    title="Rotacionar Tela"
                  >
                    <RefreshCw size={11} className={isRotatingScreen ? 'animate-spin-slow' : ''} />
                  </button>

                  {/* Info Modal Button */}
                  <button 
                    onClick={() => {
                      sfx.playCoin();
                      setShowInfoModal(true);
                    }}
                    className="p-1.5 px-2.5 h-7 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-amber-400 font-extrabold text-[9px] uppercase tracking-wider transition-all active:scale-95 shadow-md flex items-center gap-0.5"
                    title="Ver Instruções"
                  >
                    📖 Info
                  </button>
                </div>
              </div>

              {/* MIDDLE HERO TITLE STYLED PRECISELY BASED ON THE CONCEPT */}
              <div className="my-auto text-center z-30 flex flex-col items-center gap-1 mt-6">
                <motion.span 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-[#FEF3C7] font-cinzel pr-2.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                >
                  A VIDA DE
                </motion.span>
                
                <motion.h1
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl sm:text-6xl md:text-7xl tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFF3C2] via-[#F59E0B] to-[#92400E] filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.78)] pb-1.5 select-none font-medieval capitalize"
                >
                  David
                </motion.h1>
                
                <p className="text-xs sm:text-sm text-[#FEF3C7]/90 max-w-sm mx-auto italic font-serif leading-relaxed px-4 my-1 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                  "O Senhor não vê como o homem vê... O Senhor olha para o coração."
                </p>
              </div>

              {/* CENTRAL ACTIONS ROW */}
              <div className="z-30 w-full max-w-md flex flex-col sm:flex-row gap-3.5 mb-2 mt-auto">
                <button
                  id="welcome_btn_play"
                  onClick={() => {
                    sfx.playJump();
                    sfx.startBGM(); // Ensure BGM gets fully turned on
                    setGameState('menu');
                  }}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 font-black text-black tracking-widest text-xs sm:text-sm uppercase rounded-2xl shadow-[0_5px_22px_rgba(245,158,11,0.5),0_0_12px_rgba(255,255,255,0.4)] border border-yellow-200 hover:scale-[1.03] transition-all focus:outline-none"
                >
                  INICIA O JOGO ⚔️
                </button>
                <button
                  id="welcome_btn_info"
                  onClick={() => {
                    sfx.playCoin();
                    setShowInfoModal(true);
                  }}
                  className="py-3 px-6 bg-slate-950/80 hover:bg-slate-900 border border-amber-600/40 font-bold text-amber-300 tracking-wider text-xs uppercase rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  📖 INFORMAÇÃO & FASES
                </button>
              </div>

              {/* BOTTOM META DETAILS */}
              <div className="w-full flex items-center justify-between mt-auto pt-2 border-t border-white/10 z-30">
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#FEF3C7]/50 font-bold">
                  ORIGEM DO KING DAVID • V1.8
                </span>

                {/* Floating Sound Controller */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="p-2 rounded-full bg-slate-950/90 border border-slate-700/80 shadow hover:bg-slate-900 transition-colors"
                  title="Alternar Áudio"
                >
                  {muted ? (
                    <VolumeX size={13} className="text-slate-500" />
                  ) : (
                    <Volume2 size={13} className="text-yellow-400 animate-pulse" />
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-5xl bg-gradient-to-b from-slate-900/95 via-[#030712]/98 to-slate-950/95 border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.15),0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden flex flex-col gap-4"
            >
              {/* INNER HEADER FOR MENU SCREEN */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800/80 z-30">
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <button 
                    onClick={() => {
                      sfx.playJump();
                      setGameState('welcome');
                    }}
                    className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider transition-all active:scale-95 shadow-md"
                    title="Voltar ao início"
                  >
                    <ArrowLeft size={11} /> Voltar
                  </button>
                  <div className="text-right sm:text-left">
                    <span className="text-[9px] font-mono tracking-widest text-[#FDE047] uppercase font-black bg-[#78350F]/45 border border-[#FDE047]/10 px-2.5 py-0.5 rounded-full">
                      Rei Ungido
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                  {/* Points stats */}
                  <div className="flex items-center gap-3 bg-[#0B1220]/75 border border-slate-800/80 py-1 px-2.5 rounded-xl text-xs">
                    <div className="flex items-center gap-1 text-[#3B82F6] font-bold">
                      <span className="font-mono text-[10px]">PT:</span>
                      <span className="font-extrabold text-[#93C5FD]">{store.victoryPoints}</span>
                    </div>
                    <span className="text-slate-800">|</span>
                    <div className="flex items-center gap-1 text-[#F59E0B] font-bold">
                      <span>🪙</span>
                      <span className="font-extrabold text-[#FDE047]">{store.coins}</span>
                    </div>
                  </div>

                  {/* Audio button */}
                  <button 
                    onClick={toggleMute}
                    className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 transition-all active:scale-95 shadow-md flex items-center justify-center h-8 w-8"
                    title="Alternar Áudio"
                  >
                    {muted ? <VolumeX size={12} className="text-slate-500" /> : <Volume2 size={12} className="text-[#22C55E]" />}
                  </button>

                  {/* Rotation button */}
                  <button 
                    onClick={handleRotateTrigger}
                    className="p-1.5 h-8 w-8 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 transition-all active:scale-95 shadow-md flex items-center justify-center"
                    title="Rotacionar Tela"
                  >
                    <RefreshCw size={12} className={isRotatingScreen ? 'animate-spin-slow' : ''} />
                  </button>

                  {/* Info button */}
                  <button 
                    onClick={() => {
                      sfx.playCoin();
                      setShowInfoModal(true);
                    }}
                    className="p-1.5 px-3 h-8 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-amber-400 transition-all active:scale-95 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md"
                    title="Ver Instruções"
                  >
                    📖 Info
                  </button>
                </div>
              </div>
              {/* Mythical background neon lights */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
                
                {/* Visual Character select panel - RPG Legendary card style */}
                <div className="md:col-span-2 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800/80 md:border-[#3B82F6]/10 pb-6 md:pb-0 pr-0 md:pr-8 gap-6">
                  <div className="text-center w-full">
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-400 font-mono">SELEÇÃO DE CAMPEÃO</span>
                    <h3 className="text-xl font-black uppercase mt-0.5 tracking-tight text-white font-serif">O Escolhido</h3>
                  </div>

                  {/* Character visual box with golden neon outline and detail */}
                  <div className={`relative w-full h-auto min-h-[450px] border ${
                    characterSelected === 'rei_david' 
                      ? 'border-yellow-500 bg-gradient-to-b from-amber-950/40 to-slate-950/80 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                      : 'border-blue-500/50 bg-gradient-to-b from-blue-950/15 to-slate-950/85'
                    } rounded-2xl p-4 flex flex-col items-center justify-between overflow-hidden group`}
                  >
                    {/* Corner golden visual brackets */}
                    <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-amber-500/40" />
                    <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-amber-500/40" />
                    <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-amber-500/40" />
                    <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-amber-500/40" />

                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_80%)] pointer-events-none" />
                    
                    {/* Immersive 60FPS Interactive Shepherd Pastoral Canvas */}
                    <ShepherdLobbyCanvas activeCharacter={characterSelected} />

                    {characterSelected === 'david_jovem' ? (
                      <>
                        <div className="w-full text-center mt-3">
                          <span className="text-xs font-serif text-slate-300 italic">"O menor da casa de Jessé"</span>
                          <p className="text-[10.5px] text-slate-400 mt-1 font-medium leading-relaxed">Fiel, humilde e veloz. Defende as ovelhas usando apenas a sua fé e a sua funda.</p>
                        </div>

                        {/* RPG Stat Meters */}
                        <div className="w-full space-y-1.5 mt-3 pt-3 border-t border-slate-800/85">
                          <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                            <span>VELOCIDADE / SALTO</span>
                            <span className="text-blue-400">90%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: '90%' }} />
                          </div>

                          <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                            <span>PRECISÃO (FUNDA)</span>
                            <span className="text-emerald-400">85%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                          </div>

                          <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                            <span>FÉ & COMBATE</span>
                            <span className="text-yellow-400">100%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 animate-pulse" style={{ width: '100%' }} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full text-center mt-3 flex flex-col items-center">
                          <span className="text-[8.5px] uppercase bg-yellow-500/25 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded-full font-black tracking-wider animate-pulse inline-block">
                            COROADO DE GLÓRIA
                          </span>
                          <p className="text-[10.5px] text-slate-400 mt-1.5 font-medium leading-relaxed">Possui bônus de combate supremo, maior vigor espiritual e herança real.</p>
                        </div>

                        {/* RPG Stat Meters */}
                        <div className="w-full space-y-1.5 mt-3 pt-3 border-t border-slate-800/85">
                          <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                            <span>VELOCIDADE / VELOZ</span>
                            <span className="text-blue-400">75%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: '75%' }} />
                          </div>

                          <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                            <span>FORÇA / ATAQUE</span>
                            <span className="text-emerald-400">95%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '95%' }} />
                          </div>

                          <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                            <span>FÉ & REALEZA</span>
                            <span className="text-yellow-400">100%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 animate-pulse" style={{ width: '100%' }} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Character Tab Selectors */}
                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <button 
                      onClick={() => selectChar('david_jovem')}
                      className={`py-2 px-3 text-xs font-black uppercase rounded-xl transition-all border ${
                        characterSelected === 'david_jovem' 
                          ? 'bg-[#1E40AF] border-[#3B82F6] text-white shadow-md' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      Davi Jovem
                    </button>
                    <button 
                      onClick={() => {
                        if (store.unlockedReiDavid) {
                          selectChar('rei_david');
                        } else {
                          sfx.playHurt();
                          alert("Coroa Bloqueada! Complete a corrida 3D para Belém para herdar a coroa de Israel!");
                        }
                      }}
                      className={`py-2 px-3 text-xs font-black uppercase rounded-xl transition-all border flex items-center justify-center gap-1.5 ${
                        store.unlockedReiDavid 
                          ? characterSelected === 'rei_david'
                            ? 'bg-[#D97706] border-yellow-400 text-black font-black shadow-md' 
                            : 'bg-slate-950 border-yellow-500/40 text-yellow-500'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <span>{store.unlockedReiDavid ? 'Rei Davi' : '🔒 Trancado'}</span>
                    </button>
                  </div>
                </div>

                {/* Main Menu Levels Dashboard columns */}
                <div className="md:col-span-3 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 text-lg">🛡️</span>
                        <h2 className="text-2xl font-black uppercase text-white tracking-tight font-serif">
                          A JORNADA DE DAVID
                        </h2>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      Acompanhe e jogue as etapas heróicas do humilde jovem pastor à coroa real de Israel. Comande Davi utilizando sua funda contra ferozes feras predadoras e dispute a corrida espiritual faux-3D!
                    </p>
                  </div>

                  {/* Level lists with low opacity beautiful covers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Fase 1 */}
                    <div 
                      onClick={() => startNarrative(1)}
                      className="p-3.5 border border-emerald-500/20 bg-emerald-950/10 hover:bg-emerald-950/20 hover:border-emerald-500/40 rounded-2xl cursor-pointer transition-all duration-300 group flex items-center justify-between relative overflow-hidden active:scale-[0.98]"
                    >
                      {/* background Unsplash thumbnail */}
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                      <div className="z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent absolute inset-0 pointer-events-none" />
                      
                      <div className="z-10">
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block font-mono">Fase 1 • Requer Fé</span>
                        <h4 className="text-sm font-black text-white mt-1 group-hover:text-emerald-300 transition-colors">O Lobo de Rapina</h4>
                        <p className="text-[10px] text-slate-300 mt-0.5">Defenda o rebanho do lobo solitário.</p>
                      </div>
                      
                      <div className="z-10 flex flex-col items-center gap-1">
                        <span className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/20 font-black text-[10px] uppercase tracking-wider">
                          {store.completedPhases.includes('fase1') ? 'COMPLETA ✓' : 'ENTRAR'}
                        </span>
                      </div>
                    </div>

                    {/* Fase 2 */}
                    <div 
                      onClick={() => {
                        if (store.completedPhases.includes('fase1')) {
                          startNarrative(2);
                        } else {
                          sfx.playHurt();
                          alert("Bloqueado! Adquira vitória na Fase 1 primeiro.");
                        }
                      }}
                      className={`p-3.5 border rounded-2xl cursor-pointer transition-all duration-300 group flex items-center justify-between relative overflow-hidden active:scale-[0.98] ${
                        store.completedPhases.includes('fase1')
                          ? 'border-blue-500/20 bg-blue-950/10 hover:bg-blue-950/20 hover:border-blue-500/40'
                          : 'border-slate-800 bg-slate-950/30 opacity-55 cursor-not-allowed'
                      }`}
                    >
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                      <div className="z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent absolute inset-0 pointer-events-none" />

                      <div className="z-10">
                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest block font-mono">Fase 2 • Desafio</span>
                        <h4 className="text-sm font-black text-white mt-1 group-hover:text-blue-300 transition-colors">O Urso Gigante</h4>
                        <p className="text-[10px] text-slate-300 mt-0.5 font-medium">Enfrente a fera das montanhas de Israel.</p>
                      </div>

                      <div className="z-10">
                        <span className={`px-2.5 py-1.5 rounded-xl font-black text-[10px] border tracking-wider flex items-center justify-center uppercase ${
                          store.completedPhases.includes('fase1')
                            ? store.completedPhases.includes('fase2')
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-slate-900/60 text-slate-500 border-slate-800'
                        }`}>
                          {store.completedPhases.includes('fase2') ? 'CONCLUÍDO ✓' : store.completedPhases.includes('fase1') ? 'JOGAR' : '🔒'}
                        </span>
                      </div>
                    </div>

                    {/* Fase 3 */}
                    <div 
                      onClick={() => {
                        if (store.completedPhases.includes('fase2')) {
                          startNarrative(3);
                        } else {
                          sfx.playHurt();
                          alert("Bloqueado! Complete a Fase 2: O Urso primeiro.");
                        }
                      }}
                      className={`p-3.5 border rounded-2xl cursor-pointer transition-all duration-300 group flex items-center justify-between relative overflow-hidden active:scale-[0.98] ${
                        store.completedPhases.includes('fase2')
                          ? 'border-red-500/20 bg-red-950/10 hover:bg-red-950/20 hover:border-red-500/40'
                          : 'border-slate-800 bg-slate-950/30 opacity-55 cursor-not-allowed'
                      }`}
                    >
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                      <div className="z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent absolute inset-0 pointer-events-none" />

                      <div className="z-10">
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block font-mono">Fase 3 • Perigo Real</span>
                        <h4 className="text-sm font-black text-white mt-1 group-hover:text-red-400 transition-colors">O Glorioso Leão</h4>
                        <p className="text-[10px] text-slate-300 mt-0.5">Defenda a presa das bochechas da fera.</p>
                      </div>

                      <div className="z-10">
                        <span className={`px-2.5 py-1.5 rounded-xl font-black text-[10px] border tracking-wider flex items-center justify-center uppercase ${
                          store.completedPhases.includes('fase2')
                            ? store.completedPhases.includes('fase3')
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-slate-900/60 text-slate-500 border-slate-800'
                        }`}>
                          {store.completedPhases.includes('fase3') ? 'CONCLUÍDO ✓' : store.completedPhases.includes('fase2') ? 'JOGAR' : '🔒'}
                        </span>
                      </div>
                    </div>

                    {/* Fase 4 Bonus Corridor */}
                    <div 
                      onClick={() => {
                        if (store.completedPhases.includes('fase3')) {
                          start3DPhase();
                        } else {
                          sfx.playHurt();
                          alert("Bloqueado! Vença o Leão da Tribo na Fase 3 primeiro.");
                        }
                      }}
                      className={`p-3.5 border rounded-2xl cursor-pointer transition-all duration-300 group flex items-center justify-between relative overflow-hidden active:scale-[0.98] ${
                        store.completedPhases.includes('fase3')
                          ? 'border-amber-500/20 bg-amber-950/10 hover:bg-amber-950/20 hover:border-amber-500/40'
                          : 'border-slate-800 bg-slate-950/30 opacity-55 cursor-not-allowed'
                      }`}
                    >
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                      <div className="z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent absolute inset-0 pointer-events-none" />

                      <div className="z-10">
                        <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest block font-mono">Fase Bônus • Pseudo-3D</span>
                        <h4 className="text-sm font-black text-white mt-1 group-hover:text-amber-300 transition-colors">Estrada Para Casa</h4>
                        <p className="text-[10px] text-slate-300 mt-0.5">Corra 3000 metros colhendo providências.</p>
                      </div>

                      <div className="z-10">
                        <span className={`px-2.5 py-1.5 rounded-xl font-black text-[10px] border tracking-wider flex items-center justify-center uppercase ${
                          store.completedPhases.includes('fase3')
                            ? store.unlockedReiDavid
                              ? 'bg-amber-500 text-black font-extrabold border-amber-400'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-slate-900/60 text-slate-500 border-slate-800'
                        }`}>
                          {store.unlockedReiDavid ? 'COROADO 👑' : store.completedPhases.includes('fase3') ? 'CORRER' : '🔒'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Achievements badges row */}
                  <div className="pt-4 border-t border-slate-800/80">
                    <span className="text-[9px] uppercase tracking-widest text-[#10B981] font-mono font-bold block">Medalhas Sagradas & Conquistas</span>
                    <div className="flex flex-wrap gap-2.5 mt-2.5">
                      {['Matador de Lobos', 'Derrubador de Ursos', 'Vencedor de Leões', 'Guerreiro Ungido'].map((medal) => {
                        const hasIt = store.medals.includes(medal);
                        return (
                          <div 
                            key={medal} 
                            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-[10px] font-extrabold transition-all duration-300 ${
                              hasIt 
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.08)] scale-[1.02]' 
                                : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                            }`}
                          >
                            <Award size={12} className={hasIt ? 'text-yellow-400' : 'text-slate-500'} />
                            <span>{medal}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Foot button resetting progress cleanly */}
                  <div className="flex justify-between items-center bg-slate-950/45 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[9.5px] font-mono font-medium text-slate-500">Quer recalibrar sua jornada espiritual de Davi?</span>
                    <button 
                      onClick={() => {
                        if (confirm("Quer redefinir os seus dados de progresso e as suas moedas espirituais?")) {
                          store.resetProgress();
                          sfx.playJump();
                        }
                      }}
                      className="text-[9.5px] font-black uppercase tracking-wider bg-red-950/35 hover:bg-red-900/40 border border-red-900/40 px-3 py-1.5 rounded-xl text-red-300 transition-colors"
                    >
                      Zerar Dados
                    </button>
                  </div>

                </div>
              </div>

            </motion.div>
          )}

          {/* ----- STATE B. PERGAMINHO NARRATIVE INTRODUÇÕES ----- */}
          {gameState === 'intro' && (
            <motion.div 
              key="intro_p"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-3xl bg-gradient-to-b from-[#FFFDF5] via-[#FDF5E2] to-[#F3E2C4] border-[4px] sm:border-[6px] border-double border-[#6A4303] shadow-[0_15px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(106,67,3,0.35)] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 relative flex flex-col items-center select-text"
            >
              {/* Physical Wooden Scroll Roller Cylinders (Pilhares do Pergaminho) */}
              {/* Left Roller */}
              <div className="absolute -left-3.5 top-3 bottom-3 w-3 bg-gradient-to-r from-[#3E2502] via-[#6A4303] to-[#251501] rounded-l border-y-[4px] border-[#251501] shadow-lg pointer-events-none hidden sm:block">
                {/* Gold Top Knob */}
                <div className="absolute -top-3.5 -left-1 w-5 h-4 bg-gradient-to-b from-[#FFF2B2] via-[#D1A12A] to-[#8C660D] rounded-t-full border border-[#523A04] shadow" />
                {/* Gold Bottom Knob */}
                <div className="absolute -bottom-3.5 -left-1 w-5 h-4 bg-gradient-to-t from-[#FFF2B2] via-[#D1A12A] to-[#8C660D] rounded-b-full border border-[#523A04] shadow" />
              </div>
              {/* Right Roller */}
              <div className="absolute -right-3.5 top-3 bottom-3 w-3 bg-gradient-to-r from-[#251501] via-[#6A4303] to-[#3E2502] rounded-r border-y-[4px] border-[#251501] shadow-lg pointer-events-none hidden sm:block">
                {/* Gold Top Knob */}
                <div className="absolute -top-3.5 -right-1 w-5 h-4 bg-gradient-to-b from-[#FFF2B2] via-[#D1A12A] to-[#8C660D] rounded-t-full border border-[#523A04] shadow" />
                {/* Gold Bottom Knob */}
                <div className="absolute -bottom-3.5 -right-1 w-5 h-4 bg-gradient-to-t from-[#FFF2B2] via-[#D1A12A] to-[#8C660D] rounded-b-full border border-[#523A04] shadow" />
              </div>

              {/* Gold Ribbon Header */}
              <div className="absolute -top-3.5 left-[50%] translate-x-[-50%] px-6 py-1.5 bg-gradient-to-r from-[#6A4303] to-[#8A5A00] text-[#FFFAD9] text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] border border-[#FFF2B2]/30 flex items-center gap-1.5 z-20">
                <span className="text-yellow-400">❖</span> LIVRO DOS REIS DE ISRAEL <span className="text-yellow-400">❖</span>
              </div>

              {/* Decorative inner borders */}
              <div className="absolute inset-2 border border-[#8C660D]/20 rounded-lg pointer-events-none" />
              <div className="absolute left-2.5 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-[#8C660D]/25 to-transparent" />
              <div className="absolute right-2.5 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-[#8C660D]/25 to-transparent" />

              {/* Scroll Content Area */}
              <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 mt-3 relative z-10">
                
                {/* Illustration with antique double-bordered heavy frame */}
                <div className="md:col-span-2 flex flex-col items-center justify-center">
                  <div className="w-full aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden border-[4px] border-double border-[#6A4303] p-1 bg-[#F5E9CE] shadow-[0_8px_20px_rgba(92,58,0,0.3)] group relative">
                    <div className="absolute inset-0 bg-[#6A4303]/5 pointer-events-none group-hover:bg-transparent duration-500 transition-colors z-10" />
                    <img 
                      src={getIntroSteps()[currentIntroStep].illustration} 
                      className="w-full h-full object-cover sepia-[0.35] contrast-[1.08] hover:sepia-0 scale-100 hover:scale-[1.04] transition-all duration-700"
                      alt="Ilustração Bíblica de Davi" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="mt-2.5 text-[9.5px] tracking-wide font-extrabold text-[#6A4303]/75 font-serif italic text-center">
                    Registro de Ontem, Revelação de Hoje
                  </span>
                </div>

                {/* Narrative Text Content Column */}
                <div className="md:col-span-3 flex flex-col justify-between gap-5 text-left">
                  <div className="space-y-4">
                    {/* Title with decorative glyphs */}
                    <div className="flex items-center gap-2 border-b border-[#6A4303]/20 pb-2">
                      <span className="text-[#8C660D] text-sm">⚔️</span>
                      <h3 className="text-[#4A2F00] font-black text-xl md:text-2xl tracking-wide uppercase font-serif">
                        {getIntroSteps()[currentIntroStep].title}
                      </h3>
                    </div>

                    {/* Highly polished scripture-like layout text block */}
                    <div className="relative">
                      {/* Decorative drop-cap badge on the paragraph */}
                      <p className="text-[#3A2500] text-sm md:text-base leading-relaxed font-serif text-justify font-medium whitespace-pre-line pl-1 border-l-2 border-[#8C660D]/25">
                        {getIntroSteps()[currentIntroStep].text}
                      </p>
                    </div>

                    {/* Small Divider motif */}
                    <div className="flex justify-center py-1 opacity-45">
                      <span className="text-xs text-[#6A4303] tracking-[0.5em]">❦ ✥ ❦</span>
                    </div>
                  </div>

                  {/* Elegant Golden Action Control Buttons */}
                  <div className="flex gap-3 justify-end pt-2 border-t border-[#6A4303]/10">
                    {currentIntroStep > 0 ? (
                      <button 
                        onClick={() => {
                          sfx.playJump();
                          setCurrentIntroStep(prev => prev - 1);
                        }}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#6A4303] bg-amber-250/30 hover:bg-[#F0D59E] border border-[#6A4303]/40 rounded-xl transition-all shadow-sm"
                      >
                        ⬅ Voltar
                      </button>
                    ) : (
                      <button 
                        onClick={() => setGameState('menu')}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#6A4303] bg-amber-250/30 hover:bg-[#F0D59E] border border-[#6A4303]/40 rounded-xl transition-all shadow-sm"
                      >
                        ⬅ Voltar
                      </button>
                    )}

                    {currentIntroStep < getIntroSteps().length - 1 ? (
                      <button 
                        onClick={() => {
                          sfx.playJump();
                          setCurrentIntroStep(prev => prev + 1);
                        }}
                        className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-gradient-to-b from-[#6A4303] to-[#4A2F00] hover:from-[#8A5A00] hover:to-[#6A4303] text-white border border-[#3E2502] rounded-xl transition-all shadow-md flex items-center gap-1.5 active:translate-y-[1px]"
                      >
                        ➡ Próximo
                      </button>
                    ) : (
                      <button 
                        onClick={() => start2DPhase(currentIntroPhase)}
                        className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-800 hover:from-emerald-500 hover:to-green-700 text-white border border-emerald-950 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_4px_15px_rgba(21,128,61,0.35)] animate-pulse"
                      >
                        ▶ Iniciar Fase
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* ----- STATE C. GAMEPLAY 2D CANVAS CONTAINER ----- */}
          {gameState === 'playing_2d' && (
            <motion.div 
              key="game2d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl flex flex-col items-center gap-3"
            >
              {/* STAGE CONTAINER WITH ACCENT PULSING AND ROTATION TRIGGER */}
              <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden border-2 border-[#3B82F6]/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-neon-blue-green bg-[#111827]">
                
                {/* ABSOLUTE OVERLAY HUD - FULLY INTEGRATED IN-GAME CONTROLS */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none z-20 select-none">
                  
                  {/* LEFT CLUSTER: HP / Coins info */}
                  <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1 px-1.5 rounded-xl border border-white/10 shadow-lg">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      {/* Vidas ❤️ */}
                      <div className="flex items-center gap-0.5" title="Vidas de Davi">
                        <span className="text-red-500 text-[10px]">❤️</span>
                        <div className="flex gap-0.5 max-sm:hidden">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-sm select-none transition-all duration-300 font-sans leading-none ${i < playerHp2D ? 'text-red-500 scale-110 drop-shadow-[0_0_5px_rgba(239,68,68,0.7)]' : 'text-slate-600 opacity-20'}`}
                            >
                              ♥
                            </span>
                          ))}
                        </div>
                        {/* Compact indicator on tiny screens */}
                        <span className="text-[9px] font-black text-red-500 sm:hidden leading-none">{playerHp2D}/3</span>
                      </div>
                      
                      <span className="text-white/10 select-none text-[9px]">|</span>
                      
                      {/* Moedas 🪙 */}
                      <div className="flex items-center gap-0.5" title="Moedas da Fase">
                        <span className="text-[10px]">🪙</span>
                        <span className="text-[9px] font-black text-amber-400 font-mono tracking-wider">{phaseCoins}</span>
                      </div>
                    </div>
                  </div>

                  {/* CENTER CLUSTER: Wave Indicator / Boss Health */}
                  <div className="pointer-events-auto">
                    {bossHp !== null ? (
                      <div className="bg-slate-950/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-xl border border-red-500/30 flex flex-col items-center gap-0.5 shadow-2xl w-28 sm:w-44">
                        <span className="text-[8px] sm:text-[9px] font-black text-red-500 uppercase tracking-wider leading-none truncate w-full text-center">
                          👹 CHEFE: {activeFase === 1 ? 'Lobo' : activeFase === 2 ? 'Urso' : 'Leão'}
                        </span>
                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                          <div 
                             className="h-full bg-gradient-to-r from-red-600 to-amber-500 duration-150 transition-all rounded-full"
                             style={{ width: `${Math.max(0, (bossHp / (activeFase === 1 ? 15 : activeFase === 2 ? 35 : 60)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-blue-500/20 shadow-md">
                        <span className="text-[8px] sm:text-[9px] uppercase font-black tracking-widest text-[#3B82F6] font-mono leading-none">
                          🛡️ {waveIndicator}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* RIGHT CLUSTER: PAUSE ONLY (Clean cinematic view) */}
                  <div className="flex items-center pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
                    <button 
                      onClick={() => setIsPaused(prev => !prev)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-all active:scale-95 flex items-center justify-center w-6 h-6 text-[10px]"
                      title="Menu de Pausa / Configurações"
                    >
                      ⏸️
                    </button>
                  </div>

                </div>

                {/* DYNAMIC REACT PAUSE DIALOG WITH MULTIPLE OPTION TRIGGERS */}
                {isPaused && (
                  <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 sm:p-6 z-35 pointer-events-auto overflow-y-auto w-full h-full">
                    <span className="text-[9px] font-black tracking-widest text-[#FFF] font-mono leading-none bg-[#1E293B] border border-blue-400/20 px-2.5 py-1 rounded-full uppercase mb-2">⏸️ JOGO EM PAUSA</span>
                    <h3 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight font-serif">Ovelhas sob Guarnição</h3>
                    <p className="text-[10px] text-slate-400 max-w-sm mb-3.5 leading-normal">
                      Davi está vigiando temporariamente o pasto. Veja as informações de pontos e configure o jogo:
                    </p>

                    {/* STATUS DASHBOARD ON PAUSE GRID */}
                    <div className="grid grid-cols-3 gap-2 w-full max-w-sm bg-slate-900/80 p-2.5 sm:p-3 rounded-2xl border border-white/5 shadow-md mb-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block font-mono">PONTOS</span>
                        <span className="text-xs sm:text-sm font-black text-yellow-300 font-mono whitespace-nowrap mt-0.5">⭐ {score}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center border-x border-white/5">
                        <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block font-mono">MOEDAS</span>
                        <span className="text-xs sm:text-sm font-black text-amber-400 font-mono whitespace-nowrap mt-0.5">🪙 {phaseCoins}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block font-mono">VIDA</span>
                        <span className="text-xs sm:text-sm font-black text-red-500 font-sans whitespace-nowrap mt-0.5">❤️ {playerHp2D}/3</span>
                      </div>
                    </div>

                    {/* ICON CONTROLS CLUSTER ROW */}
                    <div className="flex items-center justify-center gap-3 mb-4 p-2 px-3 rounded-xl bg-slate-900/50 border border-white/5 shadow">
                      {/* Seta Volta */}
                      <button 
                        onClick={() => {
                          setIsPaused(false);
                          setGameState('menu');
                        }}
                        className="p-1 px-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all active:scale-90 flex flex-col items-center gap-0.5 w-11"
                        title="Sair para Seleção de Fases"
                      >
                        <ArrowLeft size={13} />
                        <span className="text-[7.5px] font-black uppercase tracking-wider leading-none">Voltar</span>
                      </button>

                      {/* Icone do Audio */}
                      <button 
                        onClick={toggleMute}
                        className="p-1 px-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all active:scale-90 flex flex-col items-center gap-0.5 w-11"
                        title="Alternar Áudio"
                      >
                        {muted ? <VolumeX size={13} className="text-slate-500" /> : <Volume2 size={13} className="text-emerald-400" />}
                        <span className="text-[7.5px] font-black uppercase tracking-wider leading-none">Áudio</span>
                      </button>

                      {/* Icone Refresh (Rotation) */}
                      <button 
                        onClick={handleRotateTrigger}
                        className="p-1 px-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all active:scale-90 flex flex-col items-center gap-0.5 w-11"
                        title="Recarregar/Girar Tela"
                      >
                        <RefreshCw size={12} className={isRotatingScreen ? 'animate-spin-slow' : ''} />
                        <span className="text-[7.5px] font-black uppercase tracking-wider leading-none">Girar</span>
                      </button>

                      {/* Recarregar / Reiniciar Fase (Icone Refresh Fase) */}
                      <button 
                        onClick={() => {
                          start2DPhase(activeFase);
                        }}
                        className="p-1 px-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-[#1E3A8A] hover:border-blue-700/50 transition-all active:scale-90 flex flex-col items-center gap-0.5 w-11"
                        title="Reiniciar Desafio"
                      >
                        <RotateCcw size={12} className="text-blue-400" />
                        <span className="text-[7.5px] font-black uppercase tracking-wider leading-none">Reset</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full max-w-xs">
                      <button 
                        onClick={() => setIsPaused(false)}
                        className="w-full px-5 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg border border-emerald-400 transition-all active:scale-98"
                      >
                        ▶️ Retomar Combate
                      </button>
                      <button 
                        onClick={() => {
                          setIsPaused(false);
                          setGameState('menu');
                        }}
                        className="w-full px-5 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-extrabold uppercase rounded-xl transition-all border border-slate-700 active:scale-98"
                      >
                        🚪 Sair para Seleção de Fases
                      </button>
                      <button 
                        onClick={() => {
                          setIsPaused(false);
                          navigate('/');
                        }}
                        className="w-full px-5 py-2 bg-red-950/45 hover:bg-red-900/60 text-red-300 border border-red-900/40 text-xs font-extrabold uppercase rounded-xl transition-all active:scale-98"
                      >
                        🛒 Voltar à Loja Principal
                      </button>
                    </div>

                    <div className="mt-4 text-[8px] font-mono text-slate-500 max-w-xs text-center border-t border-white/5 pt-2 uppercase">
                      💡 Teclado: WASD / Setas | F / Enter para Atacar
                    </div>
                  </div>
                )}

                {/* IN-SCREEN KEYBOARD GUIDE */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-950/65 backdrop-blur-sm border border-white/5 py-1 px-3 rounded-full text-[8.5px] font-medium text-slate-400 uppercase tracking-wider max-sm:hidden select-none pointer-events-none text-center whitespace-nowrap z-0">
                  🎮 Teclado: WASD / Setas para mover e pular | F / Enter para Atacar
                </div>

                <canvas ref={setCanvasElement} className="w-full h-full object-contain outline-none focus:outline-none" />

                {/* GAME RESULT OVERLAY (WIN / LOST) */}
                {gameResult === 'lost' && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                    <p className="text-red-500 font-black tracking-widest text-lg uppercase animate-pulse">Davi faliu em combate</p>
                    <h3 className="text-2xl font-black uppercase mt-1">NÃO DESISTA! COLOQUE SUA FÉ EM DEUS</h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-3">"O Senhor é o meu pastor; de nada terei falta." — Salmo 23:1</p>
                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={() => start2DPhase(activeFase)}
                        className="px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-xs font-black uppercase rounded-2xl flex items-center gap-1.5 shadow-lg border border-blue-400"
                      >
                        <RotateCcw size={14} /> Tentar Novamente
                      </button>
                      <button 
                        onClick={() => setGameState('menu')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase rounded-2xl"
                      >
                        Voltar ao Menu
                      </button>
                    </div>
                  </div>
                )}

                {/* GAME WON OVERLAY */}
                {gameResult === 'won' && (
                  <div className="absolute inset-0 bg-[#070b13]/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                    <Award className="text-yellow-400 animate-bounce" size={48} />
                    <h3 className="text-2xl font-black uppercase text-white tracking-wide mt-2">FASE CONCLUÍDA COM SUCESSO! 🛡️</h3>
                    <p className="text-xs text-slate-300 max-w-md mt-2 leading-relaxed">
                      "O mesmo Senhor que me livrou das garras do leão e do urso me livrará..." — 1 Samuel 17:37
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-xs w-full bg-slate-900/60 p-3 rounded-2xl border border-emerald-500/20 mt-4 text-xs font-bold">
                      <div className="flex flex-col text-[#10B981]">
                        <span>Pontos de Vitória:</span>
                        <span className="font-extrabold text-lg">+{activeFase === 1 ? 100 : activeFase === 2 ? 250 : 500}</span>
                      </div>
                      <div className="flex flex-col text-[#F59E0B]">
                        <span>Extra Moedas:</span>
                        <span className="font-extrabold text-lg">+{activeFase === 1 ? 50 : activeFase === 2 ? 100 : 180}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button 
                        onClick={() => {
                          if (activeFase === 3) {
                            // Trigger final cinematic ending first
                            setGameState('cinematic_ending');
                          } else {
                            startNarrative((activeFase + 1) as 1 | 2 | 3);
                          }
                        }}
                        className="px-6 py-3 bg-[#10B981] hover:bg-emerald-600 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg border border-emerald-400 animate-pulse"
                      >
                        {activeFase === 3 ? 'FASE BÔNUS 3D ⭐' : 'PRÓXIMO DESAFIO ⚔️'}
                      </button>
                      <button 
                        onClick={() => setGameState('menu')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase rounded-2xl"
                      >
                        Voltar ao Menu
                      </button>
                    </div>
                  </div>
                )}



                {/* IN-SCREEN OVERLAY VIRTUAL CONTROLS */}
                {gameResult === 'playing' && (
                  <>
                    {/* LEFT SIDE: TRANSLUCENT ANALOG JOYSTICK WITH DIAGONALS */}
                    <div className="absolute bottom-4 left-4 z-10 pointer-events-auto select-none scale-75 sm:scale-100 origin-bottom-left">
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-slate-600/35 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.65),0_0_20px_rgba(59,130,246,0.15)]">
                        {/* Inner concentric layout indicator rings pointer-events-none */}
                        <div className="absolute inset-1.5 rounded-full border border-white/5 pointer-events-none" />
                        <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
                        
                        {/* SECTOR - UP (Para cima: Davi pula) */}
                        <button 
                          onMouseDown={() => { touchInputs.current.jump = true; touchInputs.current.jumpPressed = true; }}
                          onMouseUp={() => { touchInputs.current.jump = false; }}
                          onMouseLeave={() => { touchInputs.current.jump = false; }}
                          onTouchStart={(e) => { e.preventDefault(); touchInputs.current.jump = true; touchInputs.current.jumpPressed = true; }}
                          onTouchEnd={() => { touchInputs.current.jump = false; }}
                          className="absolute top-1 left-9 right-9 h-8 bg-white/[0.02] hover:bg-[#3B82F6]/15 active:bg-[#3B82F6]/30 rounded-t-lg flex items-center justify-center text-[10px] font-bold text-slate-400/80 cursor-pointer focus:outline-none transition-colors border-t border-white/5"
                        >
                          ▲
                        </button>

                        {/* SECTOR - DOWN (Para baixo: Davi abaixa) */}
                        <button 
                          onMouseDown={() => { touchInputs.current.down = true; }}
                          onMouseUp={() => { touchInputs.current.down = false; }}
                          onMouseLeave={() => { touchInputs.current.down = false; }}
                          onTouchStart={(e) => { e.preventDefault(); touchInputs.current.down = true; }}
                          onTouchEnd={() => { touchInputs.current.down = false; }}
                          className="absolute bottom-1 left-9 right-9 h-8 bg-white/[0.02] hover:bg-[#3B82F6]/15 active:bg-[#3B82F6]/30 rounded-b-lg flex items-center justify-center text-[10px] font-bold text-slate-400/80 cursor-pointer focus:outline-none transition-colors border-b border-white/5"
                        >
                          ▼
                        </button>

                        {/* SECTOR - LEFT (Para esquerda: Davi anda para trás) */}
                        <button 
                          onMouseDown={() => { touchInputs.current.left = true; }}
                          onMouseUp={() => { touchInputs.current.left = false; }}
                          onMouseLeave={() => { touchInputs.current.left = false; }}
                          onTouchStart={(e) => { e.preventDefault(); touchInputs.current.left = true; }}
                          onTouchEnd={() => { touchInputs.current.left = false; }}
                          className="absolute left-1 top-9 bottom-9 w-8 bg-white/[0.02] hover:bg-[#3B82F6]/15 active:bg-[#3B82F6]/30 rounded-l-lg flex items-center justify-center text-[10px] font-bold text-slate-400/80 cursor-pointer focus:outline-none transition-colors border-l border-white/5"
                        >
                          ◀
                        </button>

                        {/* SECTOR - RIGHT (Para direita: Davi anda para frente) */}
                        <button 
                          onMouseDown={() => { touchInputs.current.right = true; }}
                          onMouseUp={() => { touchInputs.current.right = false; }}
                          onMouseLeave={() => { touchInputs.current.right = false; }}
                          onTouchStart={(e) => { e.preventDefault(); touchInputs.current.right = true; }}
                          onTouchEnd={() => { touchInputs.current.right = false; }}
                          className="absolute right-1 top-9 bottom-9 w-8 bg-white/[0.02] hover:bg-[#3B82F6]/15 active:bg-[#3B82F6]/30 rounded-r-lg flex items-center justify-center text-[10px] font-bold text-slate-400/80 cursor-pointer focus:outline-none transition-colors border-r border-white/5"
                        >
                          ▶
                        </button>

                        {/* DIAGONAL - UP-RIGHT (Entre cima e direita: Davi pula pra frente) */}
                        <button 
                          onMouseDown={() => { touchInputs.current.jump = true; touchInputs.current.jumpPressed = true; touchInputs.current.right = true; }}
                          onMouseUp={() => { touchInputs.current.jump = false; touchInputs.current.right = false; }}
                          onMouseLeave={() => { touchInputs.current.jump = false; touchInputs.current.right = false; }}
                          onTouchStart={(e) => { e.preventDefault(); touchInputs.current.jump = true; touchInputs.current.jumpPressed = true; touchInputs.current.right = true; }}
                          onTouchEnd={() => { touchInputs.current.jump = false; touchInputs.current.right = false; }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white/[0.01] hover:bg-amber-500/10 active:bg-amber-500/20 rounded-md flex items-center justify-center text-[8px] font-black text-amber-500/50 cursor-pointer focus:outline-none"
                          title="Pular pra Frente"
                        >
                          ↗
                        </button>

                        {/* DIAGONAL - UP-LEFT (Entre cima e esquerda: Davi pula pra trás) */}
                        <button 
                          onMouseDown={() => { touchInputs.current.jump = true; touchInputs.current.jumpPressed = true; touchInputs.current.left = true; }}
                          onMouseUp={() => { touchInputs.current.jump = false; touchInputs.current.left = false; }}
                          onMouseLeave={() => { touchInputs.current.jump = false; touchInputs.current.left = false; }}
                          onTouchStart={(e) => { e.preventDefault(); touchInputs.current.jump = true; touchInputs.current.jumpPressed = true; touchInputs.current.left = true; }}
                          onTouchEnd={() => { touchInputs.current.jump = false; touchInputs.current.left = false; }}
                          className="absolute top-2 left-2 w-7 h-7 bg-white/[0.01] hover:bg-amber-500/10 active:bg-amber-500/20 rounded-md flex items-center justify-center text-[8px] font-black text-amber-500/50 cursor-pointer focus:outline-none"
                          title="Pular pra Trás"
                        >
                          ↖
                        </button>

                        {/* Beautiful Center stick thumb knob */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-b from-blue-500/60 to-blue-700/60 border border-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.4)] pointer-events-none mix-blend-screen transition-transform duration-150 transform active:scale-90" />
                      </div>
                    </div>

                    {/* RIGHT SIDE: ACTION BUTTONS (PUNHAL, FUNDA/PEDRA) OVERLAY */}
                    <div className="absolute bottom-4 right-4 z-10 pointer-events-auto select-none scale-75 sm:scale-100 origin-bottom-right flex flex-row items-end gap-3">
                      {/* Sub-Weapon: PUNHAL (Crimson / Steel metal design) */}
                      <button 
                        onMouseDown={() => { touchInputs.current.shootPunhal = true; }}
                        onMouseUp={() => { touchInputs.current.shootPunhal = false; }}
                        onMouseLeave={() => { touchInputs.current.shootPunhal = false; }}
                        onTouchStart={(e) => { e.preventDefault(); touchInputs.current.shootPunhal = true; }}
                        onTouchEnd={() => { touchInputs.current.shootPunhal = false; }}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 hover:from-rose-600 hover:to-red-400 active:scale-95 text-white font-extrabold border-2 border-rose-300 shadow-[0_6px_20px_rgba(225,29,72,0.45)] flex flex-col items-center justify-center gap-0.5 outline-none transition-all"
                        title="Ataque Rápido com Punhal"
                      >
                        <span className="text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">🗡️</span>
                        <span className="text-[7.5px] font-black uppercase tracking-widest leading-none">PUNHAL</span>
                      </button>

                      {/* Giant Yellow Golden Trigger: ATAQUE (Funda e Pedra) */}
                      <button 
                        onMouseDown={() => { touchInputs.current.shootFunda = true; }}
                        onMouseUp={() => { touchInputs.current.shootFunda = false; }}
                        onMouseLeave={() => { touchInputs.current.shootFunda = false; }}
                        onTouchStart={(e) => { e.preventDefault(); touchInputs.current.shootFunda = true; }}
                        onTouchEnd={() => { touchInputs.current.shootFunda = false; }}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 hover:from-yellow-400 hover:to-amber-500 active:scale-95 text-[#451A03] font-black border-4 border-[#FFEFA6] shadow-[0_8px_25px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center gap-0.5 outline-none transition-all"
                        title="Atacar com Funda (Pedra)"
                      >
                        <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">🪨</span>
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">FUNDA (PEDRA)</span>
                      </button>
                    </div>
                  </>
                )}

              </div>



            </motion.div>
          )}

          {/* ----- STATE D. BONUS RUNNER 3D CANVAS ----- */}
          {gameState === 'playing_3d' && (
            <motion.div 
              key="game3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl flex flex-col items-center gap-3"
            >
              {/* 3D SCREEN VIEWPORT */}
              <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.25)] bg-[#070b13] animate-neon-blue-green">
                
                {/* ABSOLUTE HUD FOR 3D VIEWPORT */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none z-20 select-none">
                  
                  {/* Left: Distance Gauge */}
                  <div className="bg-slate-950/85 backdrop-blur-sm px-3 py-1 rounded-xl border border-amber-500/20 shadow-md flex flex-col items-center gap-0.5 w-32 sm:w-44 pointer-events-auto">
                    <span className="text-[8px] sm:text-[9.5px] font-black text-amber-400 font-mono tracking-wider leading-none">
                      🛣️ {distance3D}M / 3000M
                    </span>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all rounded-full"
                        style={{ width: `${Math.min(100, (distance3D / 3000) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Center: Phase indicator */}
                  <div className="max-sm:hidden bg-slate-950/85 backdrop-blur-sm px-2.5 py-1 rounded-full border border-amber-500/25">
                    <span className="text-[9px] font-black text-[#F59E0B] tracking-wider uppercase">Fase Bônus 3D</span>
                  </div>

                  {/* Right: Pause Button Only (Clean cinematic view) */}
                  <div className="flex items-center pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
                    <button 
                      onClick={() => setIsPaused(prev => !prev)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-all active:scale-95 flex items-center justify-center w-6 h-6 text-[10px]"
                      title="Menu de Pausa / Configurações"
                    >
                      ⏸️
                    </button>
                  </div>
                </div>

                {/* DYNAMIC REACT PAUSE DIALOG FOR 3D CHALLENGE STATE */}
                {isPaused && (
                  <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 sm:p-6 z-35 pointer-events-auto overflow-y-auto w-full h-full">
                    <span className="text-[9px] font-black tracking-widest text-[#F59E0B] font-mono leading-none bg-[#451A03] border border-amber-400/20 px-2.5 py-1 rounded-full uppercase mb-2">⏸️ CORRIDA PAUSADA</span>
                    <h3 className="text-lg sm:text-2xl font-black uppercase text-white mt-1 tracking-tight font-serif">Viagem a Belém</h3>
                    <p className="text-[10px] text-slate-400 max-w-sm mb-3.5 leading-normal">
                      Davi está fazendo uma pausa santa em sua corrida. Veja as informações e configure o jogo:
                    </p>

                    {/* STATUS DASHBOARD ON PAUSE GRID */}
                    <div className="grid grid-cols-2 gap-2 w-full max-w-sm bg-slate-900/80 p-2.5 sm:p-3 rounded-2xl border border-white/5 shadow-md mb-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block font-mono">DISTÂNCIA</span>
                        <span className="text-xs sm:text-sm font-black text-amber-400 font-mono whitespace-nowrap mt-0.5">🛣️ {distance3D}M / 3000M</span>
                      </div>
                      <div className="flex flex-col items-center justify-center border-l border-white/5">
                        <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block font-mono">MOEDAS</span>
                        <span className="text-xs sm:text-sm font-black text-yellow-300 font-mono whitespace-nowrap mt-0.5">🪙 {phaseCoins}</span>
                      </div>
                    </div>

                    {/* ICON CONTROLS CLUSTER ROW */}
                    <div className="flex items-center justify-center gap-3 mb-4 p-2 px-3 rounded-xl bg-slate-900/50 border border-white/5 shadow">
                      {/* Seta Volta */}
                      <button 
                        onClick={() => {
                          setIsPaused(false);
                          setGameState('menu');
                        }}
                        className="p-1 px-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all active:scale-90 flex flex-col items-center gap-0.5 w-11"
                        title="Sair para Seleção de Fases"
                      >
                        <ArrowLeft size={13} />
                        <span className="text-[7.5px] font-black uppercase tracking-wider leading-none">Voltar</span>
                      </button>

                      {/* Icone do Audio */}
                      <button 
                        onClick={toggleMute}
                        className="p-1 px-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all active:scale-90 flex flex-col items-center gap-0.5 w-11"
                        title="Alternar Áudio"
                      >
                        {muted ? <VolumeX size={13} className="text-slate-500" /> : <Volume2 size={13} className="text-[#F59E0B]" />}
                        <span className="text-[7.5px] font-black uppercase tracking-wider leading-none">Áudio</span>
                      </button>

                      {/* Icone Refresh (Rotation) */}
                      <button 
                        onClick={handleRotateTrigger}
                        className="p-1 px-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all active:scale-90 flex flex-col items-center gap-0.5 w-11"
                        title="Recarregar/Girar Tela"
                      >
                        <RefreshCw size={12} className={isRotatingScreen ? 'animate-spin-slow' : ''} />
                        <span className="text-[7.5px] font-black uppercase tracking-wider leading-none">Girar</span>
                      </button>

                      {/* Recarregar / Reiniciar Fase (Icone Refresh Fase) */}
                      <button 
                        onClick={() => {
                          start3DPhase();
                        }}
                        className="p-1 px-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-amber-900/50 hover:border-amber-700/50 transition-all active:scale-90 flex flex-col items-center gap-0.5 w-11"
                        title="Reiniciar Desafio"
                      >
                        <RotateCcw size={12} className="text-amber-400" />
                        <span className="text-[7.5px] font-black uppercase tracking-wider leading-none">Reset</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full max-w-xs animate-scale-up">
                      <button 
                        onClick={() => setIsPaused(false)}
                        className="w-full px-5 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg border border-emerald-400 transition-all active:scale-98"
                      >
                        ▶️ Retomar Corrida
                      </button>
                      <button 
                        onClick={() => {
                          setIsPaused(false);
                          setGameState('menu');
                        }}
                        className="w-full px-5 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-extrabold uppercase rounded-xl transition-all border border-slate-700 active:scale-98"
                      >
                        🚪 Sair para Seleção de Fases
                      </button>
                      <button 
                        onClick={() => {
                          setIsPaused(false);
                          navigate('/');
                        }}
                        className="w-full px-5 py-2 bg-red-950/45 hover:bg-red-900/60 text-red-300 border border-red-900/40 text-xs font-extrabold uppercase rounded-xl transition-all active:scale-98"
                      >
                        🛒 Voltar à Loja Principal
                      </button>
                    </div>

                    <div className="mt-4 text-[8px] font-mono text-slate-500 max-w-xs text-center border-t border-white/5 pt-2 uppercase">
                      💡 Teclado: Setas Esquerda/Direita para mover | Espaço para Saltar
                    </div>
                  </div>
                )}

                {/* IN-SCREEN KEYBOARD GUIDE */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-950/65 backdrop-blur-sm border border-white/5 py-1 px-3 rounded-full text-[8.5px] font-medium text-slate-400 uppercase tracking-wider max-sm:hidden select-none pointer-events-none text-center whitespace-nowrap z-0">
                  🎮 Teclado: Setas Esquerda/Direita para trocar de pista | Espaço para Saltar
                </div>

                {/* LEFT SIDE: TRANSLUCENT ANALOG JOYSTICK WITH DIAGONALS FOR 3D RUNNER */}
                <div className="absolute bottom-4 left-4 z-15 pointer-events-auto select-none scale-75 sm:scale-90 md:scale-100 origin-bottom-left">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-slate-600/35 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.65),0_0_20px_rgba(59,130,246,0.15)]">
                    {/* Inner concentric layout indicator rings */}
                    <div className="absolute inset-1.5 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />

                    {/* SECTOR - UP (SALTAR / JUMP) */}
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); const ev = new KeyboardEvent('keydown', { key: 'ArrowUp' }); window.dispatchEvent(ev); }}
                      onTouchStart={(e) => { e.preventDefault(); const ev = new KeyboardEvent('keydown', { key: 'ArrowUp' }); window.dispatchEvent(ev); }}
                      className="absolute top-1 left-9 right-9 h-8 bg-white/[0.02] hover:bg-amber-500/15 active:bg-amber-500/30 rounded-t-lg flex items-center justify-center text-[10px] font-bold text-slate-400/80 cursor-pointer focus:outline-none transition-colors border-t border-white/5"
                      title="Saltar / Pular"
                    >
                      ▲
                    </button>

                    {/* SECTOR - LEFT (MOVER ESQUERDA) */}
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); const ev = new KeyboardEvent('keydown', { key: 'ArrowLeft' }); window.dispatchEvent(ev); }}
                      onTouchStart={(e) => { e.preventDefault(); const ev = new KeyboardEvent('keydown', { key: 'ArrowLeft' }); window.dispatchEvent(ev); }}
                      className="absolute left-1 top-9 bottom-9 w-8 bg-white/[0.02] hover:bg-[#3B82F6]/15 active:bg-[#3B82F6]/30 rounded-l-lg flex items-center justify-center text-[10px] font-bold text-slate-400/80 cursor-pointer focus:outline-none transition-colors border-l border-white/5"
                      title="Desviar para a Esquerda"
                    >
                      ◀
                    </button>

                    {/* SECTOR - RIGHT (MOVER DIREITA) */}
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); const ev = new KeyboardEvent('keydown', { key: 'ArrowRight' }); window.dispatchEvent(ev); }}
                      onTouchStart={(e) => { e.preventDefault(); const ev = new KeyboardEvent('keydown', { key: 'ArrowRight' }); window.dispatchEvent(ev); }}
                      className="absolute right-1 top-9 bottom-9 w-8 bg-white/[0.02] hover:bg-[#3B82F6]/15 active:bg-[#3B82F6]/30 rounded-r-lg flex items-center justify-center text-[10px] font-bold text-slate-400/80 cursor-pointer focus:outline-none transition-colors border-r border-white/5"
                      title="Desviar para a Direita"
                    >
                      ▶
                    </button>

                    {/* Beautiful Center stick thumb knob */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-b from-blue-500/60 to-blue-700/60 border border-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.4)] pointer-events-none mix-blend-screen" />
                  </div>
                </div>

                {/* RIGHT SIDE: TRANSPARENT SALTAR ACTION BUTTON FOR 2-THUMB GAMEPLAY */}
                <div className="absolute bottom-4 right-4 z-15 pointer-events-auto select-none scale-75 sm:scale-90 md:scale-100 origin-bottom-right">
                  <button 
                    onMouseDown={(e) => { e.preventDefault(); const ev = new KeyboardEvent('keydown', { key: 'ArrowUp' }); window.dispatchEvent(ev); }}
                    onTouchStart={(e) => { e.preventDefault(); const ev = new KeyboardEvent('keydown', { key: 'ArrowUp' }); window.dispatchEvent(ev); }}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600/45 via-yellow-500/45 to-amber-300/45 hover:from-yellow-400/60 hover:to-amber-500/60 active:scale-95 text-[#FFF] font-black border-4 border-[#FFEFA6]/30 backdrop-blur-xs shadow-[0_8px_25px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center gap-0.5 outline-none transition-all cursor-pointer"
                    title="Saltar / Pular"
                  >
                    <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">🚀</span>
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">SALTAR</span>
                  </button>
                </div>
                
                <canvas ref={setCanvas3DElement} className="w-full h-full object-contain outline-none focus:outline-none" />

                {/* SCRIPTURE SENSORY MILESTONES OVERLAY POPUP */}
                {activeVersePrompt && (
                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 select-text z-40">
                    <p className="text-[#FBBF24] font-black tracking-widest text-[10px] uppercase">💎 REVELAÇÃO CELESTIAL UNLOCKED 💎</p>
                    <h3 className="text-xl font-bold font-serif text-white uppercase mt-2">{activeVersePrompt.title}</h3>
                    <p className="text-slate-200 mt-2 text-sm italic font-serif leading-relaxed max-w-md px-4 border-l-2 border-amber-500/40">
                      "{activeVersePrompt.text}"
                    </p>
                    <button 
                      onClick={() => {
                        sfx.playDivine();
                        setActiveVersePromptVal(null);
                        store.addCoins(50);
                      }}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 font-extrabold uppercase text-xs tracking-wider text-black rounded-full mt-6 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse"
                    >
                      Receber Força (+50 Moedas)
                    </button>
                  </div>
                )}

                {/* 3D RUNNER GAMEOVER POPUP */}
                {is3DGameOver && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-5 z-40">
                    <p className="text-red-500 font-black tracking-widest text-sm uppercase">Davi tropeçou no caminho</p>
                    <h3 className="text-xl font-black uppercase mt-1">UM OBSTÁCULO O DERRUBOU</h3>
                    <p className="text-xs text-slate-400 mt-2">"Ele guarda os pés dos seus santos..." — 1 Samuel 2:9</p>
                    <div className="flex gap-3 mt-5">
                      <button 
                        onClick={() => start3DPhase()}
                        className="px-5 py-2.5 bg-[#F59E0B] hover:bg-amber-400 text-xs font-black uppercase text-black rounded-2xl flex items-center gap-1.5"
                      >
                        <RotateCcw size={14} /> Tentar Novamente
                      </button>
                      <button 
                        onClick={() => setGameState('menu')}
                        className="px-4 py-2 bg-slate-850 hover:bg-slate-700 text-xs font-black uppercase rounded-2xl"
                      >
                        Voltar ao Menu
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          )}

          {/* ----- STATE D2. FINAL CINEMATOGRÁFICO: LEÃO REI VENCIDO ----- */}
          {gameState === 'cinematic_ending' && (
            <motion.div 
              key="cinematic_ending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-[#030712] border-2 border-slate-800/40 rounded-3xl p-8 flex flex-col items-center justify-between text-center relative overflow-hidden h-[450px]"
            >
              <style>{`
                @keyframes windFlow {
                  0% { transform: translateX(0); opacity: 0; }
                  10% { opacity: 0.6; }
                  90% { opacity: 0.6; }
                  100% { transform: translateX(500px); opacity: 0; }
                }
                .animate-wind-flow {
                  animation: windFlow 6s linear infinite;
                }
              `}</style>

              {/* Animated Peaceful Hills and Sheep Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#020617] opacity-90 animate-pulse duration-5000 animate-duration-1000" />
              
              {/* Sunbeam / Sunset glow */}
              <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
              
              {/* Mountain silhouettes drawn with simple canvas styled divs */}
              <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#020617] to-emerald-950/20 pointer-events-none rounded-b-3xl">
                {/* Visual Sheep dots grazing peacefully at night */}
                <div className="absolute bottom-16 left-12 w-6 h-4 bg-white/70 rounded-full animate-bounce duration-1000" style={{ animationDelay: '0.1s' }} />
                <div className="absolute bottom-12 left-24 w-8 h-5 bg-white/60 rounded-full animate-bounce duration-1000" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-14 left-44 w-5 h-3.5 bg-white/50 rounded-full" />
                <div className="absolute bottom-20 right-32 w-7 h-4 bg-white/80 rounded-full animate-bounce duration-1000" style={{ animationDelay: '0.3s' }} />
                <div className="absolute bottom-10 right-16 w-8 h-5 bg-white/65 rounded-full" />
              </div>

              {/* Centered Young David watcher silhouette */}
              <div className="absolute bottom-12 left-[50%] translate-x-[-50%] flex flex-col items-center opacity-80 pointer-events-none scale-90">
                {/* Shepherd staff silhouette */}
                <div className="w-1.5 h-16 bg-[#78350F] rounded-full relative">
                  {/* Hook at top of staff */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#78350F] rounded-tl-full" />
                </div>
                {/* Tiny sheep resting next to staff */}
                <div className="w-5 h-3.5 bg-white/90 rounded-full absolute -bottom-1 -left-6" />
              </div>

              {/* Wind particle dust lines blowing left-to-right gently */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-1/4 left-10 w-24 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-wind-flow" style={{ animationDuration: '4s' }} />
                <div className="absolute top-2/4 left-5 w-32 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-wind-flow" style={{ animationDuration: '6s', animationDelay: '1s' }} />
                <div className="absolute top-3/4 left-20 w-20 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-wind-flow" style={{ animationDuration: '5s', animationDelay: '2s' }} />
              </div>

              {/* The Cinematic Text - fading over a subtle timer */}
              <div className="z-10 flex-1 flex flex-col justify-center items-center px-4 max-w-lg mt-6">
                <span className="text-[10px] tracking-widest font-black uppercase text-slate-400 bg-slate-900/40 px-2.5 py-1 rounded-full border border-slate-800">
                  ⚔️ VITÓRIA DOS CAMPOS ⚔️
                </span>
                
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white mt-6">
                  O LEÃO REI FOI DERROTADO!
                </h3>
                
                {/* Majestic theological phrase requested by user */}
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                  className="text-amber-300 font-serif font-medium text-lg sm:text-xl italic leading-relaxed mt-5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                >
                  "Deus preparava David para algo muito maior."
                </motion.p>
                
                <p className="text-slate-400 text-xs mt-3 leading-relaxed max-w-md font-sans">
                  As ovelhas do pai estão salvas e intactas. Nenhum lobo, urso ou leão pôde contra a força e fé do jovem pastor. A jornada das colinas chegou ao seu brilhante crepúsculo.
                </p>
              </div>

              {/* Button triggering the transition to 3D Bonus Game */}
              <div className="z-10 w-full max-w-sm mt-4 flex flex-col items-center">
                <button 
                  onClick={() => {
                    sfx.playJump();
                    start3DPhase();
                  }}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-amber-500 through-yellow-400 to-amber-600 hover:scale-[1.02] active:scale-95 text-[#3b1c03] font-black tracking-widest text-xs uppercase rounded-2xl shadow-[0_8px_30px_rgba(245,158,11,0.25)] border border-yellow-300 transition-all flex items-center justify-center gap-2"
                >
                  Continuar Para Desafio Bônus 3D ✨
                </button>
              </div>

            </motion.div>
          )}

          {/* ----- STATE E. FINAL SAMUEL ANOINTS DAVID CUTSCENE ----- */}
          {gameState === 'cutscene' && (
            <motion.div 
              key="cutscene"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-gradient-to-b from-[#1E1B4B] via-[#0F172A] to-[#020617] border-2 border-yellow-500/45 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden"
            >
              {/* Pillar of celestial light vertical vector */}
              <div className="absolute top-0 bottom-0 left-[50%] translate-x-[-50%] w-24 bg-gradient-to-r from-transparent via-[#FBBF24]/15 to-transparent pointer-events-none animate-pulse" />
              
              <div className="z-10 flex flex-col items-center">
                <span className="text-[10px] tracking-widest font-black uppercase text-yellow-400">COROAÇÃO DE ISRAEL</span>
                <h2 className="text-2xl font-extrabold uppercase mt-1 leading-tight bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">SAMUEL UNGE DAVID COMO REI</h2>
                
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-yellow-400/50 bg-slate-900/60 my-6 flex items-center justify-center relative shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                  <div className="w-full h-full bg-cover bg-center absolute opacity-80" style={{ backgroundImage: `url(${davidKingImg})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  <Award size={48} className="text-[#FBBF24] absolute animate-bounce" />
                </div>

                <p className="text-slate-300 text-sm leading-relaxed max-w-md font-serif">
                  Samuel tomou o vaso de azeite aromático e sagrado, derramando-o sobre a cabeça do jovem pastor. Naquele momento, o Espírito do Senhor apoderou-se dele para cumprir seu divino chamado e reinar grandiosamente sobre todas as doze tribos.
                </p>

                <p className="text-amber-400 text-xs mt-3 italic font-serif">
                   "O Senhor escolheu Davi. De sua descendência nascerá o Salvador do Mundo!"
                </p>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4 z-10 w-full max-w-sm">
                <button 
                  onClick={() => setGameState('unlocked_reel')}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-amber-400 hover:to-yellow-300 font-black tracking-widest text-[#070b13] text-xs uppercase tracking-wider rounded-2xl shadow-[0_8px_25px_rgba(245,158,11,0.3)] border border-yellow-300"
                >
                  REIVINDICAR REI DAVID 👑
                </button>
              </div>

            </motion.div>
          )}

          {/* ----- STATE F. REVELATION REEL BLOCK ----- */}
          {gameState === 'unlocked_reel' && (
            <motion.div 
              key="unlocked_reel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xl bg-gradient-to-b from-[#0F172A] to-[#020617] border-2 border-emerald-500/40 p-6 rounded-3xl text-center flex flex-col items-center justify-between"
            >
              <div className="p-3.5 bg-emerald-500/10 rounded-full border border-emerald-400/20 text-[#10B981]">
                <CheckCircle2 size={36} />
              </div>

              <h2 className="text-xl font-black uppercase text-white mt-4">JORNADA SAGRADA CONCLUÍDA! 🎉</h2>
              <p className="text-xs text-slate-400 max-w-md mt-2">
                Parabéns! Você viajou desde as colinas de pasto protegendo ovelhas até se tornar o ungido governante de Israel.
              </p>

              <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800 p-4 space-y-2 mt-5 text-left text-xs font-semibold">
                <div className="flex justify-between border-b border-slate-800 pb-2 text-[#94A3B8]">
                  <span>Fases Concluídas:</span>
                  <span className="font-extrabold text-white text-sm">4 de 4</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2 text-[#94A3B8]">
                  <span>Total Pontos de Vitória:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">+{store.victoryPoints} PT</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2 text-[#94A3B8]">
                  <span>Bonus Moedas Acumuladas:</span>
                  <span className="font-extrabold text-yellow-400 text-sm">{store.coins} moedas</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Personagem Desbloqueado:</span>
                  <span className="font-extrabold text-amber-400 text-sm uppercase">REI DAVID HABILITADO</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3 w-full max-w-md">
                <button 
                  onClick={() => {
                    store.setSelectedCharacter('rei_david');
                    setCharacterSelected('rei_david');
                    setGameState('menu');
                  }}
                  className="flex-1 px-5 py-3 bg-[#10B981] hover:bg-emerald-600 text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-900/25 border border-emerald-400"
                >
                  Equipar Rei David
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase rounded-2xl text-slate-300"
                >
                  Voltar à Loja
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>



      {showInfoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-slate-800">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-gradient-to-b from-[#FFFDF5] via-[#FDF5E2] to-[#F3E2C4] border-4 border-[#6A4303] shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-6 rounded-2xl relative max-h-[85vh] overflow-y-auto no-scrollbar scroll-smooth"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                sfx.playJump();
                setShowInfoModal(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#6A4303] hover:bg-amber-900 text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer transition-colors"
            >
              ✕
            </button>

            <h3 className="text-center font-serif text-[#6A4303] text-2xl font-black uppercase tracking-wide border-b border-[#6A4303]/35 pb-2 mb-4">
              ❖ INFORMAÇÕES DA JORNADA SAGRADA ❖
            </h3>

            <div className="space-y-4 text-xs md:text-sm font-serif text-[#4A2F00] leading-relaxed">
              <div>
                <h4 className="font-extrabold text-[#6A4303] uppercase tracking-wider flex items-center gap-1 text-[13px] md:text-sm">
                  🛡️ Histórico Geral do Jogo
                </h4>
                <p className="pl-3.5 mt-1 border-l border-[#8C660D]/30 text-[11px] md:text-xs">
                  O jogo acompanha a trajetória bíblica do jovem pastor Davi. De sua humilde lida diária cuidando do rebanho de seu pai, Jessé, nas colinas ao redor de Belém, até o momento em que é ungido rei de Israel pelo profeta Samuel. Usando uma funda, ele enfrentará feras perigosas antes de disputar a corrida do chamado espiritual rumo a Belém!
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#6A4303] uppercase tracking-wider flex items-center gap-1 text-[13px] md:text-sm">
                  ⚔️ Mecânica de Combate e Movimento (2D)
                </h4>
                <p className="pl-3.5 mt-1 border-l border-[#8C660D]/30 text-[11px] md:text-xs">
                  Nas fases de combate 2D, Davi deve proteger suas ovelhas e herdar a fidelidade espiritual contra predadores ferozes:
                </p>
                <ul className="list-disc pl-8 space-y-1 mt-1 font-sans text-[11px] md:text-xs text-slate-800">
                  <li><strong>Movimentos:</strong> Teclas Setas / WASD ou os botões translúcidos na tela (Esquerda/Direita).</li>
                  <li><strong>Pulo:</strong> Seta para Cima ou Botão Pular para desviar dos ataques das feras e saltar plataformas.</li>
                  <li><strong>Ataque de Funda:</strong> Tecla F ou Botão Atacar para arremessar pedras lisas na fera com precisão.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-[#6A4303] uppercase tracking-wider flex items-center gap-1 text-[13px] md:text-sm text-[#C2410C]">
                  🐺 Detalhes das Fases
                </h4>
                <div className="pl-3.5 space-y-2.5 mt-1.5 border-l border-[#8C660D]/30 font-sans text-[11px] md:text-xs text-slate-800">
                  <div>
                    <span className="font-extrabold text-emerald-800">Fase 1: O Lobo de Rapina</span>
                    <p className="font-serif text-slate-900 mt-0.5 text-[11px] md:text-xs pl-2 border-l border-emerald-600/30">Uma besta solitária e rápida rasteja pelas relvas. Atire pedras nela para defender as ovelhas que pastam pacificamente.</p>
                  </div>
                  <div>
                    <span className="font-extrabold text-blue-800">Fase 2: O Urso Gigante</span>
                    <p className="font-serif text-slate-900 mt-0.5 text-[11px] md:text-xs pl-2 border-l border-blue-600/30">Uma fera incrivelmente forte que desce das encostas. Cuidado: após saltar altos patamares, as batidas do seu peso provocam ondas de choque que requerem pulos precisos!</p>
                  </div>
                  <div>
                    <span className="font-extrabold text-red-800">Fase 3: O Glorioso Leão</span>
                    <p className="font-serif text-slate-900 mt-0.5 text-[11px] md:text-xs pl-2 border-l border-red-600/30">O predador mais feroz. Ele ruge gerando ondas sísmicas destruidoras. Utilize saltos contínuos e arremessos rápidos de funda antes que ele fustigue o rebanho!</p>
                  </div>
                  <div>
                    <span className="font-extrabold text-amber-800">Fase Bônus 3D: Estrada Para Belém</span>
                    <p className="font-serif text-slate-900 mt-0.5 text-[11px] md:text-xs pl-2 border-l border-amber-600/30">A corrida santa! Desvie para os lados para esquivar de troncos caídos e cercas rústicas, enquanto colhe providências de trigo e os rolos de salmos sagrados para herdar as medalhas.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-[#6A4303] uppercase tracking-wider flex items-center gap-1 text-[13px] md:text-sm text-amber-700">
                  👑 Moedas, Vigor e Herança Real
                </h4>
                <ul className="list-disc pl-6 space-y-1 mt-1 font-sans text-[11px] md:text-xs text-slate-800">
                  <li><strong>Vigor / HP:</strong> Davi inicia com 5 corações. Se todos forem perdidos ele perde a fase.</li>
                  <li><strong>Moedas Espirituais:</strong> Coletar moedas repara as feridas de Davi e reabastece seu HP.</li>
                  <li><strong>Ungido:</strong> Complete a Fase Bônus 3D alcançando 3000 metros para herdar a coroa e desbloquear permanentemente o poderoso <strong>Rei Davi</strong> no menu!</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  sfx.playJump();
                  setShowInfoModal(false);
                }}
                className="py-2.5 px-8 bg-gradient-to-b from-[#6A4303] to-[#4A2F00] hover:from-[#8A5A00] text-white font-extrabold uppercase tracking-widest rounded-xl text-xs shadow-md border border-[#3E2502] cursor-pointer transition-colors"
              >
                Entendido, Iniciar Caminho!
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
