import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Sparkles, Trophy, Timer, Coins, Star, 
  CheckCircle2, Lock, ChevronRight, RefreshCw, Play, Award, Volume2, VolumeX, Info, X 
} from "lucide-react";
import { useCacaPalavrasStore, ACHIEVEMENTS, type Achievement } from "../store/useCacaPalavrasStore";
import { WORLDS, CacaPalavrasPhase, CacaPalavrasWorld } from "../data/cacaPalavrasData";
import { generateCacaPalavrasGrid, getSelectionLineCoords, CellCoord, PlacedWord } from "../lib/cacaPalavrasEngine";
import { playSound } from "../utils/audio";

// Minimal local confetti implementation using simple absolute divs for offline support
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  rotation: number;
}

export function CacaPalavras() {
  const navigate = useNavigate();
  const { 
    completedPhases, xp, coins, stars, unlockedAchievements, completePhase, resetProgress, spendCoins, addCoins 
  } = useCacaPalavrasStore();

  // Navigation page views: "worlds", "game", "achievements"
  const [view, setView] = useState<"worlds" | "game" | "achievements">("worlds");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active game logic
  const [selectedWorld, setSelectedWorld] = useState<CacaPalavrasWorld | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<CacaPalavrasPhase | null>(null);
  
  // Grid state
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  
  // Advanced Word Found status
  interface FoundWordProgress {
    word: string;
    colorIndex: number;
    coords: CellCoord[];
  }
  const [completedWordsList, setCompletedWordsList] = useState<FoundWordProgress[]>([]);
  
  // Computed values
  const foundWords = completedWordsList.map(cw => cw.word);
  const foundCoords = completedWordsList.flatMap(cw => cw.coords);

  // Interactive selection state
  const [selectionStart, setSelectionStart] = useState<CellCoord | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<CellCoord | null>(null);
  const [selectionCoords, setSelectionCoords] = useState<CellCoord[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isSelectionError, setIsSelectionError] = useState(false);
  const [errorCoords, setErrorCoords] = useState<CellCoord[]>([]);

  // Accessibility Sizing Zoom
  const [zoomLevel, setZoomLevel] = useState<"sm" | "md" | "lg" | "xl">("lg");

  // Hint items highlighting
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintLetters, setHintLetters] = useState<CellCoord[]>([]);

  // Game timing
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Victory feedback
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [unlockedInThisPhase, setUnlockedInThisPhase] = useState<Achievement[]>([]);
  const [confettis, setConfettis] = useState<ConfettiParticle[]>([]);
  const confettiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time custom matched particle sparkles
  interface FloatingSparkle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
  }
  const [sparkles, setSparkles] = useState<FloatingSparkle[]>([]);

  // Distinct word color configs in sequence
  const WORD_COLORS = [
    { text: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/40", hex: "#10B981", rgb: "16, 185, 129" }, // 🟢 Verde
    { text: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/40", hex: "#8B5CF6", rgb: "139, 92, 246" }, // 🟣 Roxo
    { text: "text-pink-400", bg: "bg-pink-500/15", border: "border-pink-500/40", hex: "#EC4899", rgb: "236, 72, 153" }, // 🩷 Rosa
    { text: "text-amber-500", bg: "bg-amber-500/15", border: "border-amber-500/40", hex: "#F59E0B", rgb: "245, 158, 11" }, // 🟠 Laranja
    { text: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/40", hex: "#3B82F6", rgb: "59, 130, 246" }, // 🔵 Azul
    { text: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/40", hex: "#EAB308", rgb: "234, 179, 8" }, // 🟡 Amarelo
    { text: "text-amber-800", bg: "bg-amber-800/15", border: "border-amber-800/40", hex: "#78350F", rgb: "120, 53, 15" }, // 🟤 Marrom
    { text: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/40", hex: "#EF4444", rgb: "239, 68, 68" }, // 🔴 Vermelho
  ];

  const zoomConfig = {
    sm: { cell: "w-8 h-8 min-w-[32px] min-h-[32px]", font: "text-xs", label: "Pequena" },
    md: { cell: "w-9 h-9 min-w-[36px] min-h-[36px]", font: "text-sm", label: "Média" },
    lg: { cell: "w-11 h-11 min-w-[44px] min-h-[44px]", font: "text-base", label: "Grande" },
    xl: { cell: "w-13 h-13 min-w-[52px] min-h-[52px]", font: "text-xl", label: "Extra G." }
  };

  const zoomOptions: ("sm" | "md" | "lg" | "xl")[] = ["sm", "md", "lg", "xl"];

  // Offline zero-latency Synthesizer beep
  const playSfx = (type: 'pop' | 'success' | 'victory' | 'fail' | 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.18); // C6
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(147, ctx.currentTime + 0.14); // D3
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'victory') {
        // Glorious arpeggio chords
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + idx * 0.08 + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
          oscNode.start(ctx.currentTime + idx * 0.08);
          oscNode.stop(ctx.currentTime + idx * 0.08 + 0.4);
        });
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch (_) {}
  };

  // Safe device short vibration support
  const triggerVibrate = (ms = 60) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (_) {}
    }
  };

  // Restore Sizing Preferences on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("caca_palavras_zoom");
      if (saved && (saved === "sm" || saved === "md" || saved === "lg" || saved === "xl")) {
        setZoomLevel(saved);
      }
    } catch (_) {}
  }, []);

  const changeZoom = (level: "sm" | "md" | "lg" | "xl") => {
    setZoomLevel(level);
    try {
      localStorage.setItem("caca_palavras_zoom", level);
    } catch (_) {}
  };

  const decreaseZoom = () => {
    const idx = zoomOptions.indexOf(zoomLevel);
    if (idx > 0) {
      changeZoom(zoomOptions[idx - 1]);
      playSfx('click');
    }
  };

  const increaseZoom = () => {
    const idx = zoomOptions.indexOf(zoomLevel);
    if (idx < zoomOptions.length - 1) {
      changeZoom(zoomOptions[idx + 1]);
      playSfx('click');
    }
  };

  // Unlocking rules helper
  const isWorldUnlocked = (world: CacaPalavrasWorld): boolean => {
    if (world.id === 1) return true; // first world is always unlocked
    
    // Check if it's the special world (Word 10, index 9)
    if (world.isSpecial) {
      // Must complete ALL phases of ALL other worlds
      const regularWorlds = WORLDS.filter(w => !w.isSpecial);
      const allPhases = regularWorlds.flatMap(w => w.phases.map(p => p.id));
      return allPhases.every(pId => completedPhases.includes(pId));
    }

    // Otherwise, check if previous world is fully completed
    const prevWorld = WORLDS.find(w => w.id === world.id - 1);
    if (!prevWorld) return true;
    
    const prevWorldPhases = prevWorld.phases.map(p => p.id);
    return prevWorldPhases.every(pId => completedPhases.includes(pId));
  };

  // Convert game coordinates to localized string for simpler keying
  const coordKey = (r: number, c: number) => `${r}-${c}`;

  // Load saved current level progress if any
  useEffect(() => {
    if (selectedPhase && selectedWorld) {
      try {
        const savedKey = `caca_palavras_progress_${selectedPhase.id}`;
        const saved = localStorage.getItem(savedKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed)) {
            setCompletedWordsList(parsed);
          }
        } else {
          setCompletedWordsList([]);
        }
      } catch (e) {
        setCompletedWordsList([]);
      }
      setHintsUsed(0);
      setHintLetters([]);
    }
  }, [selectedPhase, selectedWorld]);

  // Save current level progress automatically when it changes
  useEffect(() => {
    if (selectedPhase && completedWordsList.length > 0) {
      try {
        const savedKey = `caca_palavras_progress_${selectedPhase.id}`;
        localStorage.setItem(savedKey, JSON.stringify(completedWordsList));
      } catch (e) {}
    }
  }, [completedWordsList, selectedPhase]);

  // Clean saved progress on victory
  const clearLevelSave = (phaseId: string) => {
    try {
      localStorage.removeItem(`caca_palavras_progress_${phaseId}`);
    } catch (e) {}
  };

  // Start selected Level
  const startLevel = (world: CacaPalavrasWorld, phase: CacaPalavrasPhase) => {
    setSelectedWorld(world);
    setSelectedPhase(phase);
    setCompletedWordsList([]);
    setSelectionStart(null);
    setSelectionEnd(null);
    setSelectionCoords([]);
    setTimeElapsed(0);
    setShowVictoryModal(false);
    setUnlockedInThisPhase([]);
    setHintsUsed(0);
    setHintLetters([]);

    // Determine grid size based on world or word max length
    const maxWordLen = Math.max(...phase.words.map(w => w.length));
    const gridSize = Math.max(9, maxWordLen + 2, 10); 

    // Generate grid
    const generated = generateCacaPalavrasGrid(phase.words, gridSize);
    setGrid(generated.grid);
    setPlacedWords(generated.placedWords);
    setView("game");

    // Init Stopwatch
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    playSfx('pop');
  };

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (confettiTimerRef.current) clearInterval(confettiTimerRef.current);
    };
  }, []);

  // Selection state updates
  useEffect(() => {
    if (selectionStart && selectionEnd) {
      const line = getSelectionLineCoords(selectionStart, selectionEnd);
      if (line) {
        setSelectionCoords(line);
      }
    } else {
      setSelectionCoords([]);
    }
  }, [selectionStart, selectionEnd]);

  // Handle cell touch/click down
  const handleCellStart = (r: number, c: number) => {
    if (isSelectionError) return; // block during error blink
    setIsSelecting(true);
    const startCoord = { r, c };
    setSelectionStart(startCoord);
    setSelectionEnd(startCoord);
    playSfx('pop');
    triggerVibrate(30);
  };

  // Handle cell hover/drag movement
  const handleCellEnter = (r: number, c: number) => {
    if (!isSelecting || !selectionStart || isSelectionError) return;
    setSelectionEnd({ r, c });
    triggerVibrate(20);
  };

  // End selection and evaluate
  const handleCellEnd = () => {
    if (!isSelecting || !selectionStart || !selectionEnd || isSelectionError) {
      setIsSelecting(false);
      return;
    }
    
    setIsSelecting(false);

    // Get characters spelling in both directions (forward and reverse)
    const lineCoords = getSelectionLineCoords(selectionStart, selectionEnd);
    if (lineCoords && selectedPhase) {
      const textForward = lineCoords.map(co => grid[co.r][co.c]).join("");
      const textBackward = [...textForward].reverse().join("");

      // Find if matched in the listed words
      const matchedPlacedWord = placedWords.find(pw => {
        const uppercaseClean = pw.word;
        return (
          (uppercaseClean === textForward || uppercaseClean === textBackward) &&
          !foundWords.includes(pw.word)
        );
      });

      if (matchedPlacedWord) {
        // MATCH SUCCESS!
        const correctWord = matchedPlacedWord.word;
        
        // Find consecutive colors sequence index
        const colorSeqIdx = completedWordsList.length % WORD_COLORS.length;

        const newFoundObj: FoundWordProgress = {
          word: correctWord,
          colorIndex: colorSeqIdx,
          coords: matchedPlacedWord.coords
        };

        const nextCompletedList = [...completedWordsList, newFoundObj];
        setCompletedWordsList(nextCompletedList);

        playSfx('success');
        triggerVibrate(120);
        triggerParticles();

        // Check level Win Condition
        if (nextCompletedList.length === placedWords.length) {
          handleVictory();
        }
      } else {
        // MATCH FAILED: Run incorrect state flash error red & vibration
        setIsSelectionError(true);
        setErrorCoords([...lineCoords]);
        triggerVibrate(180);
        playSfx('fail');

        setTimeout(() => {
          setIsSelectionError(false);
          setErrorCoords([]);
          setSelectionStart(null);
          setSelectionEnd(null);
        }, 500);
        return;
      }
    }

    setSelectionStart(null);
    setSelectionEnd(null);
  };

  // Handle Level Complete Victory
  const handleVictory = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    playSfx('victory');
    clearLevelSave(selectedPhase!.id);
    
    // Confetti stream
    triggerConfettiExplosion();

    if (selectedPhase && selectedWorld) {
      // Complete phase in Zustand store
      setTimeout(() => {
        const { newAchievements } = completePhase(selectedPhase.id, selectedWorld.id, placedWords.length);
        setUnlockedInThisPhase(newAchievements);
        setShowVictoryModal(true);
      }, 600);
    }
  };

  // Sparkles blast effect on correct word match
  const triggerParticles = () => {
    const list: FloatingSparkle[] = [];
    const colors = ["#10B981", "#8B5CF6", "#EC4899", "#F59E0B", "#3B82F6", "#EAB308", "#EF4444"];
    for (let i = 0; i < 20; i++) {
      list.push({
        id: Math.random() + i,
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 70,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8
      });
    }
    setSparkles(list);
    setTimeout(() => {
      setSparkles([]);
    }, 1200);
  };

  // Launch Confetti shower using simple css layout
  const triggerConfettiExplosion = () => {
    const list: ConfettiParticle[] = [];
    const colors = ["#3B82F6", "#F59E0B", "#10B981", "#EC4899", "#8B5CF6", "#EF4444"];
    
    for (let i = 0; i < 80; i++) {
      list.push({
        id: Math.random() + i,
        x: Math.random() * 100, // percentage units
        y: -10 - Math.random() * 20, // start off-screen top
        size: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360,
        speed: 2 + Math.random() * 5,
        rotation: Math.random() * 360
      });
    }

    setConfettis(list);

    confettiTimerRef.current = setInterval(() => {
      setConfettis(prev => 
        prev.map(p => ({
          ...p,
          y: p.y + p.speed,
          rotation: p.rotation + 4,
          x: p.x + Math.sin(p.y / 10) * 0.5
        })).filter(p => p.y < 110)
      );
    }, 30);
  };

  // 💡 Highlight next available unselected letter tip helper
  const handleUseHint = async () => {
    const isFree = hintsUsed < 3;
    if (!isFree) {
      if (coins < 15) {
        alert("Moedas insuficientes! Cada dica custa 15 moedas.");
        return;
      }
      const success = await spendCoins(15);
      if (!success) {
        alert("Moedas insuficientes!");
        return;
      }
    }

    const nextUnfound = placedWords.filter(pw => !foundWords.includes(pw.word));
    if (nextUnfound.length === 0) return;

    // Target the first unfound word inside gameplay
    const targetWord = nextUnfound[0];
    
    // Find the first letter coordinate that isn't highlighted in hintLetters yet
    const targetLetter = targetWord.coords.find(co => 
      !hintLetters.some(hl => hl.r === co.r && hl.c === co.c)
    );

    if (targetLetter) {
      setHintLetters(prev => [...prev, targetLetter]);
      setHintsUsed(prev => prev + 1);
      triggerVibrate(80);
      playSfx('click');
    } else {
      // Fallback first coordinate
      const fbCoord = targetWord.coords[0];
      if (fbCoord) {
        setHintLetters(prev => [...prev, fbCoord]);
        setHintsUsed(prev => prev + 1);
        triggerVibrate(80);
        playSfx('click');
      }
    }
  };

  // Go to next world phase
  const handleNextPhase = () => {
    if (!selectedWorld || !selectedPhase) return;
    
    const currIndex = selectedWorld.phases.findIndex(p => p.id === selectedPhase.id);
    if (currIndex !== -1 && currIndex < selectedWorld.phases.length - 1) {
      // next phase in same world
      const nextPhase = selectedWorld.phases[currIndex + 1];
      startLevel(selectedWorld, nextPhase);
    } else {
      // Find next world
      const nextWorld = WORLDS.find(w => w.id === selectedWorld.id + 1);
      if (nextWorld && isWorldUnlocked(nextWorld)) {
        startLevel(nextWorld, nextWorld.phases[0]);
      } else {
        setView("worlds"); // go back to map if none available or locked
      }
    }
  };

  // Formatter for Stopwatch seconds
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Progress calculations
  const totalFases = WORLDS.flatMap(w => w.phases).length;
  const completedCount = completedPhases.length;
  const gameProgressPercent = totalFases > 0 ? Math.round((completedCount / totalFases) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col font-sans relative overflow-hidden select-none">
      
      {/* Confetti canvas overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {confettis.map(c => (
          <div 
            key={c.id}
            className="absolute rounded-sm opacity-80"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              backgroundColor: c.color,
              transform: `rotate(${c.rotation}deg)`,
              transition: 'transform 0.03s linear'
            }}
          />
        ))}
      </div>

      {/* Floating Glowing backdrop orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/10 opacity-50 blur-[130px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#F59E0B]/10 opacity-30 blur-[120px]"></div>
      </div>

      {/* VIEW: LEADER / WORLDS SELECTOR SCREEN */}
      {view === "worlds" && (
        <div className="relative z-10 flex-1 flex flex-col w-full max-w-lg mx-auto pb-32">
          
          {/* Dashboard Premium Top info bar */}
          <header className="px-6 pt-10 pb-6 flex items-center justify-between border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#172033] hover:text-[#3B82F6] hover:bg-white/5 transition-all border border-white/10 active:scale-95 shadow-md shadow-white/5"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#3B82F6] font-[900] uppercase tracking-[0.2em]">DESAFIOS BÍBLICOS</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  🎮 Caça-Palavras
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-10 h-10 rounded-full bg-[#172033]/80 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white shadow-md shadow-white/5"
                title={soundEnabled ? "Mutar Sons" : "Ativar Sons"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button 
                onClick={() => setView("achievements")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#172033] border border-white/10 text-xs font-black text-white hover:text-[#3B82F6] transition-all shadow-md shadow-white/5"
              >
                <Trophy size={14} className="text-[#F59E0B]" />
                <span className="text-[10px] tracking-wider font-extrabold">{unlockedAchievements.length}</span>
              </button>
            </div>
          </header>

          {/* Body content */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-8 no-scrollbar">
            
            {/* XP and Coins HUD panel */}
            <div className="grid grid-cols-3 gap-3 bg-[#172033] border border-white/10 rounded-[20px] p-4.5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#3B82F6]/5 blur-lg"></div>
              
              <div className="flex flex-col items-center border-r border-white/5 py-1">
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#94A3B8] mb-1">XP total</span>
                <div className="flex items-center gap-1">
                  <Sparkles size={13} className="text-[#3B82F6] fill-[#3B82F6]/20 animate-pulse" />
                  <span className="font-extrabold text-[15px]">{xp}</span>
                </div>
              </div>

              <div className="flex flex-col items-center border-r border-white/5 py-1">
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#94A3B8] mb-1">MOEDAS</span>
                <div className="flex items-center gap-1">
                  <Coins size={13} className="text-[#F59E0B] fill-[#F59E0B]/20 animate-bounce" />
                  <span className="font-extrabold text-[15px]">{coins}</span>
                </div>
              </div>

              <div className="flex flex-col items-center py-1">
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#94A3B8] mb-1">ESTRELAS</span>
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-emerald-400 fill-emerald-400/20" />
                  <span className="font-extrabold text-[15px]">{stars}</span>
                </div>
              </div>
            </div>

            {/* General progress banner */}
            <div className="bg-[#172033]/50 border border-white/10 rounded-[24px] p-5">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-white text-sm font-bold">Resumo da Jornada</span>
                <span className="text-[#3B82F6] font-[900] text-xs uppercase tracking-wider">{gameProgressPercent}% Concluído</span>
              </div>
              <div className="h-2.5 bg-[#0B1220] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#3B82F6] via-purple-500 to-[#F59E0B] transition-all duration-[1.5s]" style={{ width: `${gameProgressPercent}%` }}></div>
              </div>
              <p className="text-[11px] text-[#94A3B8] font-medium mt-2 leading-relaxed">
                Você completou <span className="font-extrabold text-white">{completedCount}</span> de <span className="font-extrabold text-white">{totalFases}</span> fases bíblicas e gerais disponíveis.
              </p>
            </div>

            {/* List of worlds - map styled */}
            <div className="space-y-6">
              <h2 className="text-md uppercase font-[900] tracking-widest text-[#94A3B8] px-1 flex items-center gap-2">
                <span>📍</span> MAPA DO TESOURO BÍBLICO
              </h2>

              <div className="space-y-6">
                {WORLDS.map((world, idx) => {
                  const unlocked = isWorldUnlocked(world);
                  const worldPhases = world.phases.map(p => p.id);
                  const phasesDone = worldPhases.filter(pId => completedPhases.includes(pId)).length;
                  const pct = Math.round((phasesDone / worldPhases.length) * 100);

                  return (
                    <div 
                      key={world.id}
                      className={`relative bg-[#172033]/80 border rounded-[24px] p-5 transition-all duration-300 ${
                        unlocked 
                          ? 'border-white/10 hover:border-[#3B82F6]/20' 
                          : 'border-white/5 opacity-50'
                      }`}
                    >
                      {/* Accent glow line inside */}
                      <div className="absolute right-[-20px] top-[-20px] w-32 h-32 rounded-full bg-[#3B82F6]/5 blur-2xl pointer-events-none"></div>

                      {/* Header details */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl bg-[#0B1220] w-12 h-12 rounded-[16px] flex items-center justify-center border border-white/5 shadow-md">
                            {world.icon}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-[#3B82F6] tracking-widest">MUNDO {world.id}</span>
                            <h3 className="font-extrabold text-md text-white flex items-center gap-1.5">
                              {world.name}
                              {world.isSpecial && <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500">Especial</span>}
                            </h3>
                          </div>
                        </div>

                        {unlocked ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-black text-[#94A3B8]">{phasesDone}/{worldPhases.length}</span>
                            <span className="text-[10px] text-emerald-400 font-extrabold">{pct}% concluído</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-black/40 rounded-full border border-white/5 text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">
                            <Lock size={10} /> Trancado
                          </div>
                        )}
                      </div>

                      {/* Info on World Completion */}
                      {unlocked && (
                        <div className="mb-4">
                          <div className="h-1.5 bg-[#0B1220] rounded-full overflow-hidden">
                            <div className="h-full bg-[#3B82F6] transition-all duration-[1s]" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      )}

                      {/* List of Phases */}
                      {unlocked ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          {world.phases.map((phase, pIdx) => {
                            const isDone = completedPhases.includes(phase.id);
                            return (
                              <button
                                key={phase.id}
                                onClick={() => startLevel(world, phase)}
                                className={`flex items-center justify-between p-3.5 rounded-2xl text-left border transition-all active:scale-95 group shadow-md shadow-white/5 ${
                                  isDone 
                                    ? 'bg-[#172033] hover:bg-[#172033]/80 border-emerald-500/25 text-white' 
                                    : 'bg-[#0B1220]/50 hover:bg-[#0B1220] border-white/5 hover:border-[#3B82F6]/30 text-white'
                                }`}
                              >
                                <div className="flex flex-col min-w-0 pr-1.5">
                                  <span className="text-[9px] uppercase text-[#94A3B8] font-bold">FASE {pIdx + 1}</span>
                                  <span className="text-[12px] font-extrabold truncate group-hover:text-[#3B82F6] transition-colors">{phase.name}</span>
                                </div>

                                {isDone ? (
                                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 fill-emerald-400/10" />
                                ) : (
                                  <Play size={13} className="text-[#3B82F6] fill-[#3B82F6]/10 shrink-0 group-hover:scale-110 transition-transform" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-2 px-1 text-[11px] text-[#94A3B8] font-semibold flex items-center gap-1.5 leading-relaxed bg-[#0B1220]/30 rounded-xl border border-white/5 px-3">
                          <span>🔒</span>
                          {world.isSpecial 
                            ? "Complete todo o mapa regular para desvendar este conhecimento sagrado."
                            : `Conclua todas as ${world.phases.length} fases do mundo anterior para desbloquear.`
                          }
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset button inside settings block */}
            <div className="pt-6 border-t border-white/5 text-center pb-12">
              <button 
                onClick={() => {
                  if (confirm("Tem certeza que deseja zerar todo o seu progresso no jogo Caça-Palavras? Seus dados de moedas, conquistas e níveis serão redefinidos.")) {
                    resetProgress().then(() => alert("Progresso reiniciado com sucesso!"));
                  }
                }}
                className="text-xs text-[#EF4444] hover:underline font-extrabold uppercase tracking-wide flex items-center justify-center gap-1.5 mx-auto opacity-70 hover:opacity-100"
              >
                <RefreshCw size={12} /> Reiniciar Todo o Jogo
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: ACTIVE WORD SEARCH GAMEPLAY */}
      {view === "game" && selectedWorld && selectedPhase && (
        <div className="relative z-10 flex-1 flex flex-col w-full max-w-lg mx-auto pb-12 px-4 selection:bg-transparent">
          
          {/* Header Bar */}
          <header className="pt-10 pb-5 flex items-center justify-between border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-xl sticky top-0 z-30">
            <button 
              onClick={() => {
                if (confirm("Deseja sair do jogo em andamento? Seu progresso nesta fase não será salvo.")) {
                  setView("worlds");
                }
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#172033] hover:text-[#3B82F6] hover:bg-white/5 transition-all border border-white/10 active:scale-95 shadow-md shadow-white/5"
            >
              <ArrowLeft size={18} />
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-[0.14em] flex items-center gap-1">
                <span>{selectedWorld.icon}</span> {selectedWorld.name}
              </span>
              <h2 className="text-base font-extrabold text-white truncate max-w-[150px]">
                {selectedPhase.name}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-[#172033] px-3.5 py-1.5 border border-white/10 rounded-full">
              <Timer size={14} className="text-[#3B82F6]" />
              <span className="font-mono text-xs font-black text-white">{formatTime(timeElapsed)}</span>
            </div>
          </header>

          {/* Sizing of grid wrapper */}
          <div className="flex-1 overflow-y-auto pt-4 pb-6 space-y-6 no-scrollbar flex flex-col justify-between">
            
            {/* Control Row with Zoom & Hints */}
            <div className="flex justify-between items-center bg-[#172033]/60 border border-white/5 rounded-2xl p-2.5 shadow-lg">
              {/* Zoom Buttons */}
              <div className="flex items-center gap-1.5 rounded-full bg-[#0B1220] p-1 border border-white/10 shadow-inner">
                <button 
                  onClick={decreaseZoom} 
                  disabled={zoomLevel === 'sm'}
                  className="w-7 h-7 rounded-full bg-[#172033] hover:text-[#3B82F6] disabled:opacity-30 border border-white/5 flex items-center justify-center font-bold text-xs shadow-none"
                  title="Diminuir Letras"
                >
                  A-
                </button>
                <span className="text-[10px] font-black uppercase text-[#94A3B8] px-1 bg-[#172033]/45 rounded py-0.5 min-w-[54px] text-center">
                  {zoomConfig[zoomLevel].label}
                </span>
                <button 
                  onClick={increaseZoom} 
                  disabled={zoomLevel === 'xl'}
                  className="w-7 h-7 rounded-full bg-[#172033] hover:text-[#3B82F6] disabled:opacity-30 border border-white/5 flex items-center justify-center font-bold text-xs shadow-none"
                  title="Aumentar Letras"
                >
                  A+
                </button>
              </div>

              {/* 💡 Hint Button */}
              <button
                onClick={handleUseHint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider transition-all scale-100 hover:scale-102 active:scale-95 shadow-md shadow-amber-500/5"
              >
                <span>💡</span>
                {hintsUsed < 3 ? (
                  <span>Dica Rápida ({3 - hintsUsed}/3)</span>
                ) : (
                  <span className="flex items-center gap-1">Dica (+15 🪙)</span>
                )}
              </button>
            </div>

            {/* Found word count info */}
            <div className="flex justify-between items-baseline px-1.5">
              <span className="text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                Encontre as Palavras
              </span>
              <span className="text-emerald-400 text-xs font-black tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {foundWords.length} / {placedWords.length} ENCONTRADAS
              </span>
            </div>

            {/* Interactive Grid Card */}
            <div className="bg-[#172033]/90 border border-white/10 rounded-[28px] p-4 shadow-2xl relative overflow-auto no-scrollbar flex justify-center items-center">
              
              {/* Connected active selection line overlay */}
              {isSelecting && selectionStart && selectionEnd && (
                <svg className="absolute inset-0 pointer-events-none z-20 w-full h-full">
                  <line
                    x1={`${((selectionStart.c + 0.5) / grid.length) * 100}%`}
                    y1={`${((selectionStart.r + 0.5) / grid.length) * 100}%`}
                    x2={`${((selectionEnd.c + 0.5) / grid.length) * 100}%`}
                    y2={`${((selectionEnd.r + 0.5) / grid.length) * 100}%`}
                    stroke="rgba(245, 158, 11, 0.45)"
                    strokeWidth={grid.length > 10 ? "18" : "24"}
                    strokeLinecap="round"
                    className="animate-pulse"
                    style={{ filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))" }}
                  />
                </svg>
              )}

              {/* Connected permanent lines overlay for found words */}
              {completedWordsList.map((cw, idx) => {
                const start = cw.coords[0];
                const end = cw.coords[cw.coords.length - 1];
                const color = WORD_COLORS[cw.colorIndex];
                if (!start || !end) return null;
                return (
                  <svg key={`${cw.word}-${idx}`} className="absolute inset-0 pointer-events-none z-10 w-full h-full">
                    <line
                      x1={`${((start.c + 0.5) / grid.length) * 100}%`}
                      y1={`${((start.r + 0.5) / grid.length) * 100}%`}
                      x2={`${((end.c + 0.5) / grid.length) * 100}%`}
                      y2={`${((end.r + 0.5) / grid.length) * 100}%`}
                      stroke={color.hex}
                      strokeWidth={grid.length > 10 ? "13" : "18"}
                      strokeLinecap="round"
                      className="opacity-40"
                      style={{ filter: `drop-shadow(0 0 4px ${color.hex})` }}
                    />
                  </svg>
                );
              })}

              {/* Sparkles match sparks overlay */}
              {sparkles.map(sp => (
                <div
                  key={sp.id}
                  className="absolute rounded-full animate-ping pointer-events-none z-35"
                  style={{
                    left: `${sp.x}%`,
                    top: `${sp.y}%`,
                    width: `${sp.size}px`,
                    height: `${sp.size}px`,
                    backgroundColor: sp.color,
                    boxShadow: `0 0 10px ${sp.color}`,
                    animationDuration: '1s'
                  }}
                />
              ))}

              <div 
                className="grid gap-[4px] relative"
                style={{ 
                  gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
                  touchAction: "none" // disable native mobile scroll during drags
                }}
                onPointerDown={(e) => {
                  const target = e.target as HTMLElement;
                  if (target && target.getAttribute("data-cell") === "true") {
                    try {
                      target.releasePointerCapture(e.pointerId);
                    } catch (_) {}
                    const r = parseInt(target.getAttribute("data-row") || "0", 10);
                    const c = parseInt(target.getAttribute("data-col") || "0", 10);
                    handleCellStart(r, c);
                  }
                }}
                onPointerMove={(e) => {
                  if (!isSelecting) return;
                  const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
                  if (target && target.getAttribute("data-cell") === "true") {
                    const r = parseInt(target.getAttribute("data-row") || "0", 10);
                    const c = parseInt(target.getAttribute("data-col") || "0", 10);
                    handleCellEnter(r, c);
                  }
                }}
                onPointerUp={handleCellEnd}
                onPointerLeave={handleCellEnd}
              >
                {grid.map((rowArr, rIdx) => 
                  rowArr.map((char, cIdx) => {
                    // Check if cel is found
                    const cellFoundInfo = [...completedWordsList].reverse().find(cw => 
                      cw.coords.some(co => co.r === rIdx && co.c === cIdx)
                    );
                    const isCoordFound = !!cellFoundInfo;
                    const foundColor = cellFoundInfo ? WORD_COLORS[cellFoundInfo.colorIndex] : null;
                    
                    // Highlight logic for active selection
                    const isSelectedNow = selectionCoords.some(co => co.r === rIdx && co.c === cIdx);

                    // Check error status blinking
                    const isCellInError = isSelectionError && errorCoords.some(co => co.r === rIdx && co.c === cIdx);

                    // Hint indicator
                    const isCellHinted = hintLetters.some(hl => hl.r === rIdx && hl.c === cIdx) && !isCoordFound;

                    // Compute dynamic classes
                    let cellClasses = "flex items-center justify-center font-bold select-none cursor-pointer border transition-all duration-150 rounded-lg shadow-none ";
                    let cellStyles: React.CSSProperties = {};

                    if (isCellInError) {
                      cellClasses += "bg-red-500 border-red-400 text-white animate-pulse scale-95 shadow-lg shadow-red-500/20";
                    } else if (isCoordFound && foundColor) {
                      cellClasses += `${foundColor.bg} ${foundColor.text} ${foundColor.border} font-black scale-95`;
                      cellStyles = {
                        boxShadow: `inset 0 0 6px rgba(${foundColor.rgb || "255,255,255"}, 0.1), 0 0 10px rgba(${foundColor.rgb || "255,255,255"}, 0.08)`
                      };
                    } else if (isSelectedNow) {
                      cellClasses += "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 border-amber-500 scale-105 font-black shadow-lg shadow-amber-500/25";
                    } else if (isCellHinted) {
                      cellClasses += "bg-amber-400/25 text-amber-300 border-amber-400/50 font-black animate-bounce scale-102 shadow-md shadow-amber-400/10";
                    } else {
                      cellClasses += "bg-slate-900/55 hover:bg-slate-900/80 text-[#E2E8F0] border-white/5 font-semibold hover:text-white";
                    }

                    return (
                      <div
                        key={coordKey(rIdx, cIdx)}
                        data-cell="true"
                        data-row={rIdx}
                        data-col={cIdx}
                        className={`${cellClasses} ${zoomConfig[zoomLevel].cell} ${zoomConfig[zoomLevel].font}`}
                        style={cellStyles}
                      >
                        {char}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Target Words beneath (color-matched checklist) */}
            <div className="bg-[#172033]/40 border border-white/5 rounded-[24px] p-5">
              <div className="flex flex-wrap gap-2.5 justify-center">
                {placedWords.map((pw, idx) => {
                  const doneObj = completedWordsList.find(cw => cw.word === pw.word);
                  const isDone = !!doneObj;
                  const color = doneObj ? WORD_COLORS[doneObj.colorIndex] : null;

                  return (
                    <span 
                      key={`${pw.word}-${idx}`}
                      className={`text-xs px-3.5 py-2 rounded-xl font-extrabold uppercase tracking-widest border transition-all flex items-center gap-1.5 select-none shadow-none ${
                        isDone && color
                          ? `${color.bg} ${color.text} ${color.border} line-through opacity-85 shadow-[0_0_8px_rgba(${color.rgb || "255,255,255"},0.12)]` 
                          : 'bg-[#172033] border-white/10 text-white'
                      }`}
                    >
                      {isDone ? (
                        <span className="flex items-center gap-1">✔ {pw.word}</span>
                      ) : (
                        <span>{pw.word}</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Quick Helper reset level button */}
            <div className="text-center">
              <button 
                onClick={() => {
                  if (confirm("Deseja reiniciar esta rodada?")) {
                    startLevel(selectedWorld, selectedPhase);
                  }
                }}
                className="text-[11px] text-[#94A3B8] hover:text-[#3B82F6] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto bg-transparent border-none shadow-none"
              >
                <RefreshCw size={11} /> Reiniciar Fase
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: ACHIEVEMENTS TAB */}
      {view === "achievements" && (
        <div className="relative z-10 flex-1 flex flex-col w-full max-w-lg mx-auto pb-32">
          
          <header className="px-6 pt-10 pb-6 flex items-center justify-between border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView("worlds")}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#172033] hover:text-[#3B82F6] hover:bg-white/5 transition-all border border-white/10 active:scale-95 shadow-md shadow-white/5"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                🏆 Conquistas
              </h1>
            </div>
            <span className="text-xs font-black text-[#94A3B8]">
              {unlockedAchievements.length} / {ACHIEVEMENTS.length} Desbloqueadas
            </span>
          </header>

          <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-4 no-scrollbar pb-12">
            {ACHIEVEMENTS.map(ach => {
              const isUnlocked = unlockedAchievements.includes(ach.id);
              
              return (
                <div 
                  key={ach.id}
                  className={`flex items-center gap-4 p-4 rounded-[20px] border transition-all ${
                    isUnlocked 
                      ? 'bg-[#172033] border-emerald-500/25 text-white' 
                      : 'bg-[#172033]/40 border-white/5 text-[#94A3B8] opacity-60'
                  }`}
                >
                  <span className={`text-4xl p-2 rounded-[16px] flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-[#0B1220]' : 'bg-[#0B1220]/40'}`}>
                    {ach.icon}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-extrabold text-[14px] ${isUnlocked ? 'text-white' : 'text-[#94A3B8]'}`}>{ach.title}</h3>
                    <p className="text-[11px] font-medium leading-relaxed mt-0.5 text-[#94A3B8]">
                      {ach.description}
                    </p>
                    <span className="inline-block mt-2 text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-black/40 text-amber-500 border border-white/5">
                      Condição: {ach.conditionDescription}
                    </span>
                  </div>

                  {isUnlocked && (
                    <span className="text-xs font-extrabold text-[#10B981] px-2.5 py-1 bg-emerald-500/15 rounded-full border border-emerald-500/25 uppercase tracking-wider">
                      Ativo
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VICTORY VICTORY MODAL PORTAL */}
      <AnimatePresence>
        {showVictoryModal && selectedWorld && selectedPhase && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B1220]/95 backdrop-blur-md flex items-center justify-center p-6 z-50 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#172033] border border-white/10 rounded-[32px] p-6 w-full max-w-sm text-center relative shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              
              {/* Confetti particle elements */}
              <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-[#F59E0B]/10 blur-xl"></div>
              
              {/* Trophy layout */}
              <div className="relative inline-block mt-2">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 shadow-md">
                  <Trophy size={36} className="text-amber-400 fill-amber-400/25 animate-bounce" />
                </div>
                <span className="absolute bottom-[-4px] right-[-4px] text-xl">✨</span>
              </div>

              <div>
                <span className="text-[10px] text-[#3B82F6] font-black uppercase tracking-[0.2em]">{selectedWorld.name}</span>
                <h1 className="text-2xl font-black text-white mt-1">Fase Concluída!</h1>
                <p className="text-xs text-[#94A3B8] font-bold mt-1.5 uppercase tracking-wider">Você desvendou {placedWords.length} palavras no tempo {formatTime(timeElapsed)}</p>
              </div>

              {/* Achievements banner if unlocked inside this level */}
              {unlockedInThisPhase.length > 0 && (
                <div className="bg-[#0B1220] border border-emerald-500/25 p-3.5 rounded-2xl relative text-left">
                  <div className="flex gap-2.5 items-center">
                    <span className="text-3xl">🏆</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#10B981]">Conquista Desbloqueada!</span>
                      <h4 className="text-xs font-black text-white truncate">{unlockedInThisPhase[0].title}</h4>
                      <p className="text-[10px] text-[#94A3B8] font-medium leading-normal mt-0.5 truncate">{unlockedInThisPhase[0].description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rewards metrics panel */}
              <div className="bg-[#0B1220]/75 border border-white/5 rounded-2xl p-4 grid grid-cols-3 gap-1">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase font-bold text-[#94A3B8]">Mais XP</span>
                  <div className="flex items-center gap-1 mt-1 text-white font-extrabold text-sm">
                    <Sparkles size={12} className="text-[#3B82F6]" />
                    <span>+150</span>
                  </div>
                </div>

                <div className="flex flex-col items-center border-x border-white/5">
                  <span className="text-[9px] uppercase font-bold text-[#94A3B8]">MOEDAS</span>
                  <div className="flex items-center gap-1 mt-1 text-white font-extrabold text-sm font-sans">
                    <Coins size={12} className="text-[#F59E0B]" />
                    <span>+30</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase font-bold text-[#94A3B8]">ESTRELAS</span>
                  <div className="flex items-center gap-1 mt-1 text-white font-extrabold text-sm">
                    <Star size={12} className="text-emerald-400" />
                    <span>+3</span>
                  </div>
                </div>
              </div>

              {/* Actions panel */}
              <div className="space-y-2 pt-2">
                <button 
                  onClick={handleNextPhase}
                  className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-2xl shadow-lg shadow-[#3B82F6]/20 transition-all cursor-pointer transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Próxima Fase <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => startLevel(selectedWorld, selectedPhase)}
                  className="w-full bg-[#172033] hover:bg-white/5 text-[#94A3B8] hover:text-white border border-white/10 font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-2xl transition-all cursor-pointer"
                >
                  Jogar Novamente
                </button>
                <button 
                  onClick={() => setView("worlds")}
                  className="w-full text-xs font-bold text-[#94A3B8] hover:text-white transition-all py-1 cursor-pointer hover:underline"
                >
                  Voltar ao Mapa de Mundos
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
