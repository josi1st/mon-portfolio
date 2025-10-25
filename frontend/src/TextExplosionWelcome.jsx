// TextExplosionWelcome.jsx
import React, { useState, useEffect, useRef } from 'react';

const TextExplosionWelcome = ({ darkMode, visitorCount, onAnimationComplete }) => {
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [welcomeProgress, setWelcomeProgress] = useState(0);
  const [welcomeText, setWelcomeText] = useState('');
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [showExplosion, setShowExplosion] = useState(false);
  const particlesRef = useRef([]);
  const animationIdRef = useRef(null);

  class Particle {
    constructor(x, y, targetX, targetY, color) {
      this.x = x;
      this.y = y;
      this.targetX = targetX;
      this.targetY = targetY;
      this.color = color;
      this.size = Math.random() * 3 + 2;
      
      this.vx = (Math.random() - 0.5) * 20;
      this.vy = (Math.random() - 0.5) * 20 - 8;
      this.gravity = 0.4;
      this.friction = 0.97;
      
      this.phase = 'explode';
      this.explodeTime = 0;
      this.maxExplodeTime = 70;
      this.formProgress = 0;
      this.opacity = 1;
    }

    update() {
      if (this.phase === 'explode') {
        this.vx *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        
        this.explodeTime++;
        if (this.explodeTime > this.maxExplodeTime) {
          this.phase = 'form';
        }
      } else if (this.phase === 'form') {
        this.formProgress += 0.015;
        if (this.formProgress > 1) this.formProgress = 1;
        
        this.x = this.x + (this.targetX - this.x) * 0.08;
        this.y = this.y + (this.targetY - this.y) * 0.08;
        
        // Faire disparaître progressivement les particules
        if (this.formProgress > 0.7) {
          this.opacity = Math.max(0, 1 - (this.formProgress - 0.7) / 0.3);
        }
      }
    }

    draw(ctx) {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  const createParticlesFromText = (canvas, ctx, text, fontSize, isSource = false) => {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  
  tempCtx.font = `bold ${fontSize}px Arial`;
  tempCtx.fillStyle = 'white';
  tempCtx.textAlign = 'center';
  tempCtx.textBaseline = 'middle';
  tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);
  
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const newParticles = [];
  
  const step = 3;
  for (let y = 0; y < tempCanvas.height; y += step) {
    for (let x = 0; x < tempCanvas.width; x += step) {
      const index = (y * tempCanvas.width + x) * 4;
      const alpha = imageData.data[index + 3];
      
      if (alpha > 128) {
        // Gradient bleu-vert aléatoire pour chaque particule
        const colors = [
          'rgb(59, 130, 246)',   // bleu
          'rgb(34, 197, 94)',    // vert
          'rgb(16, 185, 129)',   // vert-bleu
          'rgb(37, 99, 235)',    // bleu foncé
          'rgb(20, 184, 166)'    // turquoise
        ];
        const particleColor = colors[Math.floor(Math.random() * colors.length)];
        
        if (isSource) {
          newParticles.push({x, y, color: particleColor});
        } else {
          newParticles.push({targetX: x, targetY: y, color: particleColor});
        }
      }
    }
  }
  
  return newParticles;
};

  // Animation de la barre de progression (première animation)
  useEffect(() => {
    const fullText = "Bienvenue sur le portfolio de Mr.JD";
    const duration = 3000;
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);
    let animationFrame;

    const animate = () => {
      setWelcomeProgress(prev => {
        if (prev >= 100) return 100;
        return Math.min(prev + increment, 100);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Mettre à jour le texte en fonction de la progression
  useEffect(() => {
    const fullText = "Bienvenue sur le portfolio de Mr.JD";
    const textLength = Math.floor((welcomeProgress / 100) * fullText.length);
    setWelcomeText(fullText.substring(0, textLength));

    // Quand la barre atteint 100%, attendre 1 seconde puis lancer l'explosion
    if (welcomeProgress >= 100) {
      setTimeout(() => {
        setShowProgressBar(false);
        setShowExplosion(true);
        setIsAnimating(true);
      }, 1000);
    }
  }, [welcomeProgress]);

  // Animation d'explosion (deuxième animation)
  useEffect(() => {
    if (!isAnimating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const welcomeFullText = "Bienvenue sur le portfolio de Mr.JD";
    const finalText = "JOSIAS DJIOLGOU";
    const fontSize = Math.min(canvas.width / 25, 40);

    const sourceParticles = createParticlesFromText(canvas, ctx, welcomeFullText, fontSize, true);
    const targetParticles = createParticlesFromText(canvas, ctx, finalText, fontSize * 1.3, false);
    
    const particles = [];
    const particleCount = Math.min(sourceParticles.length, targetParticles.length);
    
    for (let i = 0; i < particleCount; i++) {
      const source = sourceParticles[i];
      const target = targetParticles[i % targetParticles.length];
      
      particles.push(new Particle(
        source.x,
        source.y,
        target.targetX,
        target.targetY,
        source.color
      ));
    }
    
    particlesRef.current = particles;

    let animationStartTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - animationStartTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      // Afficher le texte final quand les particules commencent à former le texte
      if (elapsed > 2500 && !showFinalText) {
        setShowFinalText(true);
      }
      
      // Arrêter l'animation après 3.5 secondes
      if (elapsed < 3500) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setShowExplosion(false);
        if (onAnimationComplete) {
          setTimeout(() => onAnimationComplete(), 200);
        }
      }
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isAnimating, onAnimationComplete, showFinalText]);

  return (
    <div className="relative w-full">
      {/* Première animation : Barre de progression */}
      {showProgressBar && (
        <div className="space-y-4">
          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
              style={{ width: `${welcomeProgress}%` }}
            />
          </div>
          <div className="min-h-[100px] relative">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent text-center">
              {welcomeText}
            </div>
          </div>
        </div>
      )}

      {/* Deuxième animation : Explosion de particules + Texte final en overlay */}
      {showExplosion && (
        <div className="relative w-full h-[200px] md:h-[250px]">
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full"
          />
          
          {/* Texte final en overlay qui apparaît progressivement */}
          {showFinalText && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="space-y-2 animate-fadeIn">
                <p className="text-blue-500 font-semibold text-lg text-center">
                  👋 Bonjour visiteur <span className="font-bold text-green-500">{visitorCount + 1}</span>, je suis
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center">
                  <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                    Josias DJIOLGOU
                  </span>
                </h1>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Texte final seul (après l'explosion) */}
      {!showProgressBar && !showExplosion && showFinalText && (
        <div className="space-y-2 animate-fadeIn">
          <p className="text-blue-500 font-semibold text-lg text-center">
            👋 Bonjour visiteur <span className="font-bold text-green-500">{visitorCount + 1}</span>, je suis
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Josias DJIOLGOU
            </span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default TextExplosionWelcome;