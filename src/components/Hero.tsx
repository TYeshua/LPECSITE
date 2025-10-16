// src/components/Hero.tsx

import React, { useCallback } from 'react';
import { ChevronDown, TestTube, Sigma, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// --- Componente Principal ---
const Hero: React.FC = () => {

  // Função de scroll
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Configuração das partículas
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // ALTERADO: Opacidade das partículas e links aumentada para mais destaque
  const particlesOptions = {
    background: { color: { value: 'transparent' } }, 
    fpsLimit: 120, 
    interactivity: { 
      events: { 
        onHover: { enable: true, mode: 'repulse' }, 
        resize: true 
      }, 
      modes: { 
        repulse: { distance: 100, duration: 0.4 } 
      } 
    }, 
    particles: { 
      color: { value: '#ff6d00' }, 
      links: { 
        color: '#ff9b57', 
        distance: 150, 
        enable: true, 
        opacity: 0.35, // Aumentado de 0.2
        width: 1 
      }, 
      collisions: { enable: true }, 
      move: { 
        direction: 'none' as const, 
        enable: true, 
        outModes: { default: 'bounce' as const }, 
        random: false, 
        speed: 0.5, 
        straight: false 
      }, 
      number: { 
        density: { enable: true, area: 800 }, 
        value: 80 
      }, 
      opacity: { 
        value: 0.5 // Aumentado de 0.3
      }, 
      shape: { type: 'circle' as const }, 
      size: { value: { min: 1, max: 5 } } 
    }, 
    detectRetina: true
  };

  // Variantes de animação
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99] } } };

  return (
    // ALTERADO: Fundo agora é 'bg-black'
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 1. Partículas (camada mais profunda) */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      
      {/* 2. Grid (camada intermediária) */}
      <div 
        // ALTERADO: Opacidade do grid aumentada para mais destaque
        className="absolute inset-0 z-1 bg-[linear-gradient(to_right,rgba(255,109,0,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,109,0,0.12)_1px,transparent_1px)] bg-[size:3rem_3rem]"
        style={{ maskImage: 'radial-gradient(ellipse at center, white 20%, transparent 70%)' }}
      />
      
      {/* 3. Overlay de gradiente escuro (acima do grid) */}
      {/* ALTERADO: Gradiente ajustado para 'black' */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/80 to-black z-2" />

      {/* 4. Conteúdo (camada superior) */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6"
        >
          <span className="block text-zinc-400 font-light">Laboratório de Petrofísica</span>
          <span 
            className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent"
            style={{ textShadow: '0 2px 12px rgba(255, 109, 0, 0.4)' }} // Efeito de brilho (glow)
          >
            Estatística e Computacional
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          Desenvolvendo soluções inovadoras através da integração de petrofísica, estatística avançada e modelagem computacional para a caracterização de reservatórios.
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center gap-3 sm:gap-4 mb-12"
        >
          {/* Tags com micro-interação */}
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-full text-sm text-zinc-300 transition-all duration-300 ease-in-out hover:border-orange-500/80 hover:bg-zinc-800 transform hover:-translate-y-1">
            <TestTube size={16} className="text-orange-500" />
            <span>Petrofísica</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-full text-sm text-zinc-300 transition-all duration-300 ease-in-out hover:border-orange-500/80 hover:bg-zinc-800 transform hover:-translate-y-1">
            <Sigma size={16} className="text-orange-500" />
            <span>Estatística</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-full text-sm text-zinc-300 transition-all duration-300 ease-in-out hover:border-orange-500/80 hover:bg-zinc-800 transform hover:-translate-y-1">
            <Cpu size={16} className="text-orange-500" />
            <span>Computação</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <motion.button
            onClick={scrollToAbout}
            className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Saiba Mais</span>
            <ChevronDown className="group-hover:translate-y-1 transition-transform duration-300" size={20} />
          </motion.button>
          
          <motion.a
            href="#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-zinc-700 text-zinc-300 font-semibold rounded-lg hover:border-orange-500 hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Projetos
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;