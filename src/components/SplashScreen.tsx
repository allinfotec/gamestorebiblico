import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const sequence = [
  "No princípio era o Verbo...",
  "E o Verbo estava com Deus...",
  "E o Verbo era Deus.",
  "BÍBLIA SAGRADA"
];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < sequence.length - 1) {
      // Show each phrase for a set time
      const timer = setTimeout(() => {
        setIndex(index + 1);
      }, 1500); // 1.5s per phrase
      return () => clearTimeout(timer);
    } else {
      // Last text (Logo/Title), wait a bit longer then complete
      const timer = setTimeout(() => {
        onComplete();
      }, 2000); // Wait 2s on the final screen before entering the app
      return () => clearTimeout(timer);
    }
  }, [index, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0c] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {index < sequence.length - 1 ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute px-8 text-center"
          >
            <h1 className="text-2xl md:text-3xl font-serif font-medium leading-relaxed tracking-wide text-gray-200">
              {sequence[index]}
            </h1>
          </motion.div>
        ) : (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <motion.div 
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="w-24 h-24 bg-white text-black rounded-3xl flex items-center justify-center text-5xl shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              📖
            </motion.div>
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.8 }}
               className="flex flex-col items-center"
            >
               <h1 className="text-3xl font-serif font-bold tracking-wider text-white mb-2 shadow-black drop-shadow-xl">{sequence[index]}</h1>
               <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">Online</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
