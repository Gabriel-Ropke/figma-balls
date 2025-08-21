import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Star } from 'lucide-react';

interface LevelUpAnimationProps {
  isVisible: boolean;
  skillName: string;
  newLevel: number;
  skillIcon: string;
  skillColor: string;
  onComplete: () => void;
}

export function LevelUpAnimation({ 
  isVisible, 
  skillName, 
  newLevel, 
  skillIcon, 
  skillColor, 
  onComplete 
}: LevelUpAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl p-8 border border-purple-500/30 max-w-sm mx-4 text-center backdrop-blur-md"
          >
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: ['50%', `${Math.random() * 100}%`],
                    y: ['50%', `${Math.random() * 100}%`],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                />
              ))}
            </div>

            {/* Main content */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="relative z-10"
            >
              <div className="text-6xl mb-4">{skillIcon}</div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-bold text-yellow-400 mb-2"
              >
                LEVEL UP!
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-2"
              >
                <p className="text-white font-medium">{skillName}</p>
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg border-2"
                  style={{ 
                    backgroundColor: `${skillColor}20`,
                    color: skillColor,
                    borderColor: skillColor
                  }}
                >
                  <Star className="w-5 h-5" />
                  Nível {newLevel}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-4 text-sm text-gray-300"
              >
                Continue assim! 🎯
              </motion.div>
            </motion.div>

            {/* Pulsing ring effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 3], opacity: [0, 0.5, 0] }}
              transition={{ 
                delay: 0.5, 
                duration: 1.5, 
                repeat: Infinity, 
                repeatDelay: 1 
              }}
              className="absolute inset-0 rounded-2xl border-4 border-yellow-400"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}