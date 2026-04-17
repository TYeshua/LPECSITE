// src/components/Hero.tsx

import React, { useCallback, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion'; 
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// Importando o componente de brilho
import ShinyText from './ShinyText';

const Hero: React.FC = () => {
  // 1. Referências e Variáveis de Scroll
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Scroll-Triggered Animations: Suavizadas para maior fluidez
  const particlesOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const formulaOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 0.15]);
  const formulaScale = useTransform(scrollYProgress, [0.3, 0.8], [0.9, 1.1]);

  // 2. Funções Auxiliares
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };
  
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // 3. Configuração do Grafo Geométrico (Partículas)
  const particlesOptions = {
    background: { color: { value: 'transparent' } }, 
    fpsLimit: 45, 
    interactivity: { 
      events: { 
        onHover: { enable: true, mode: 'repulse' }, 
        resize: true 
      }, 
      modes: { repulse: { distance: 100, duration: 0.4 } } 
    }, 
    particles: { 
      color: { value: '#ff6d00' }, 
      links: { color: '#ff6d00', distance: 150, enable: true, opacity: 0.8, width: 1.5 }, 
      collisions: { enable: true }, 
      move: { direction: 'none' as const, enable: true, outModes: { default: 'bounce' as const }, random: false, speed: 0.5, straight: false }, 
      number: { density: { enable: true, area: 800 }, value: 80 }, 
      opacity: { value: 0.95 }, 
      shape: { type: 'circle' as const }, 
      size: { value: { min: 3, max: 7 } } 
    }, 
    detectRetina: true
  };

  // 4. Variantes de Animação de Entrada
  const containerVariants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } } 
  };
  const itemVariants = { 
    hidden: { y: 30, opacity: 0 }, 
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } 
  };

  return (
    <section 
      id="home" 
      ref={containerRef} 
      // Scroll Snapping mantido
      className="relative min-h-[110vh] flex items-start justify-center overflow-hidden bg-black snap-start"
    >
      {/* Container Sticky: Trocado de h-screen para h-[100dvh] para evitar bugs na barra de endereço mobile */}
      <div className="sticky top-0 w-full h-[100dvh] flex items-center justify-center overflow-hidden">
        
        {/* Camada 1: Partículas */}
        <motion.div className="absolute inset-0 z-0" style={{ opacity: particlesOpacity }}>
          <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
        </motion.div>

        {/* Camada 1.5: Fórmula Matemática */}
        <motion.div
          className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
          style={{ opacity: formulaOpacity, scale: formulaScale }}
        >
          {/* Ajuste milimétrico: Removido width/height fixos. Utilizando max-w responsivo para não vazar no mobile */}
          <svg viewBox="0 0 24 24" fill="none" stroke="#ff6d00" strokeWidth="0.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 w-[120%] max-w-[350px] md:max-w-[800px] h-auto">
            <path d="M18 7V4H6v16h12v-3" />
            <path d="M6 4l8 8-8 8" />
          </svg>
        </motion.div>
        
        {/* Camada 2: Grid Estático com Máscara Radial - Reduzido no mobile, mantido no desktop */}
        <div 
          className="absolute inset-0 z-[2] bg-[linear-gradient(to_right,rgba(255,109,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,109,0,0.08)_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:3rem_3rem]" 
          style={{ maskImage: 'radial-gradient(ellipse at center, white 20%, transparent 70%)' }} 
        />
        
        {/* Camada 3: Gradiente Overlay Escuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black z-[3]" />

        {/* Camada 4: Conteúdo Front-end */}
        <motion.div
          className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Foco no Produto e Hierarquia Visual Forte */}
          <motion.h1
            variants={itemVariants}
            // Adicionado min-[400px]:text-4xl para garantir que palavras grandes não quebrem no mobile pequeno
            className="text-3xl min-[400px]:text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-5 md:mb-6 flex flex-col items-center justify-center"
          >
            <span className="block text-zinc-500 font-light tracking-wide mb-2 md:mb-3 text-lg sm:text-2xl md:text-3xl uppercase">
              Laboratório de
            </span>
            
            <ShinyText 
              text="Física Industrial" 
              color="#ff6d00" 
              shineColor="#ffffff" 
              speed={3} 
              spread={90}
              className="drop-shadow-[0_0px_20px_rgba(255,109,0,0.3)]"
            />
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            // Margem inferior reduzida no mobile para aproximar os botões
            className="text-sm sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 md:mb-12 font-light leading-relaxed"
          >
            Desenvolvendo soluções inovadoras através da integração de petrofísica, estatística avançada e modelagem computacional para a caracterização de reservatórios.
          </motion.p>
          
          {/* Botões de Ação */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 w-full sm:w-auto px-2 sm:px-0">
            {/* Botão Primário */}
            <motion.button
              onClick={scrollToAbout}
              className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-[#ff6d00] text-black font-semibold rounded-xl shadow-[0_0_15px_rgba(255,109,0,0.2)] hover:shadow-[0_0_25px_rgba(255,109,0,0.4)] transition-all duration-300"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Saiba Mais</span>
              <ChevronDown className="group-hover:translate-y-1 transition-transform duration-300" size={18} />
            </motion.button>
            
            {/* Botão Secundário */}
            <motion.a
              href="#projects"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-transparent border border-zinc-700 text-zinc-300 rounded-xl hover:border-[#ff6d00] hover:bg-[#ff6d00]/5 transition-colors duration-300 font-medium"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver Projetos
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;