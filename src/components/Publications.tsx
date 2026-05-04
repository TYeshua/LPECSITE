// src/components/Publications.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Download, ExternalLink, X, ArrowRight } from 'lucide-react';

// Importações para o background de partículas
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// --- Tipagem dos Dados ---
interface Publication {
  title: string;
  authors: string;
  year: string;
  type: string;
  image: string;
  abstract: string;
}

// Dados contextualizados para o LAFI
const recentPublications: Publication[] = [
    { 
      title: "Sistema Inteligente de Geoquímica e Maturidade - SIGMA", 
      authors: "FERREIRA, T. Y. D., MOURA, T. R. S.", 
      year: "2026", 
      type: "Propriedade Intelectual - Registro de Programa de Computador (RPC)",
      image: "./public/sigma.webp",
      abstract: "Trata-se de uma plataforma web voltada para o fluxo de análise geoquímica de bacias sedimentares, desenvolvida em Python e TypeScript. O software integra três módulos principais: o pré-processamento para padronização e limpeza de dados brutos; a análise automatizada que classifica o querogênio e a maturidade térmica com base em regras clássicas da geoquímica; e a modelagem preditiva, que utiliza Machine Learning (Redes Neurais MLP) para validar a consistência dos dados e gerar predições em tempo real. A ferramenta centraliza processos complexos em uma interface gráfica para tornar a análise geoquímica mais ágil e robusta."
    },
    { 
      title: "A Geostatistical Approach to Reservoir Heterogeneity Modeling", 
      authors: "COSTA, M. A., PEREIRA, F. G., et al.", 
      year: "2024", 
      type: "Artigo de Conferência",
      image: "https://images.pexels.com/photos/7164010/pexels-photo-7164010.jpeg?auto=compress&cs=tinysrgb&w=800",
      abstract: "Apresentamos uma metodologia geoestatística robusta para modelar a heterogeneidade de reservatórios carbonáticos. Utilizando simulação sequencial gaussiana e plurigaussiana, geramos múltiplos cenários de distribuição de porosidade e permeabilidade, fornecendo uma base sólida para a quantificação de incertezas no cálculo de volume de óleo."
    },
];

// --- Componente do Modal ---
const Modal: React.FC<{ pub: Publication, onClose: () => void }> = ({ pub, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden'; 
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
        onClick={onClose} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
      />
      
      <motion.div 
        // Ajuste Crítico: max-h-[90dvh] garante que o scroll funcione perfeitamente no mobile
        className="relative z-10 w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(255,109,0,0.1)] overflow-hidden flex flex-col max-h-[90dvh]" 
        initial={{ opacity: 0, scale: 0.95, y: 30 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Imagem reduzida no mobile (h-48) para priorizar o título e o resumo */}
        <div className="relative w-full h-48 sm:h-64 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
          <img src={pub.image} alt={pub.title} className="w-full h-full object-cover" />
          <button 
            onClick={onClose} 
            // Posicionamento protegido contra bordas da tela
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2 sm:p-2.5 rounded-full bg-black/50 text-white hover:bg-[#ff6d00] transition-all duration-300 border border-white/10 hover:border-[#ff6d00] hover:scale-110"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Padding ajustado para o mobile (p-5 ou p-6 ao invés de p-8) */}
        <div className="p-6 sm:px-12 sm:pb-12 sm:pt-4 overflow-y-auto custom-scrollbar relative z-20">
          <span className="inline-block px-3 py-1 mb-4 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#ff6d00] bg-[#ff6d00]/10 border border-[#ff6d00]/20 rounded-full">
            {pub.type}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight pr-4 sm:pr-0">{pub.title}</h3>
          <p className="text-xs sm:text-sm text-zinc-400 mb-6 font-medium">
            <span className="text-zinc-300 italic">{pub.authors}</span> ({pub.year})
          </p>
          
          <h4 className="font-bold text-white mb-2 sm:mb-3 text-base sm:text-lg">Resumo</h4>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light mb-8">{pub.abstract}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-5 sm:gap-6 pt-6 border-t border-white/10">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-white text-sm font-medium hover:bg-zinc-800 hover:border-white/10 transition-all duration-300">
                <Download className="w-4 h-4" /> PDF
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl bg-[#ff6d00] text-white text-sm font-bold hover:bg-orange-500 transition-all duration-300 shadow-[0_0_15px_rgba(255,109,0,0.3)]">
                <ExternalLink className="w-4 h-4" /> Ver Online
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Componente Principal ---
const Publications = () => {
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = useMemo(() => ({
    background: { color: { value: 'transparent' } }, 
    fpsLimit: 45, 
    interactivity: { 
        events: { onHover: { enable: true, mode: 'repulse' }, resize: true }, 
        modes: { repulse: { distance: 100, duration: 0.4 } } 
    }, 
    particles: { 
        color: { value: '#ff6d00' }, 
        links: { color: '#ff6d00', distance: 150, enable: true, opacity: 0.6, width: 1 }, 
        collisions: { enable: true }, 
        move: { direction: 'none' as const, enable: true, outModes: { default: 'bounce' as const }, random: false, speed: 0.3, straight: false }, 
        number: { density: { enable: true, area: 800 }, value: 40 }, 
        opacity: { value: 0.8 }, 
        shape: { type: 'circle' as const }, 
        size: { value: { min: 1, max: 3 } } 
    }, 
    detectRetina: true
  }), []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

  return (
    <>
      <section id="publications" className="py-24 sm:py-32 text-white relative overflow-hidden">
        
        <Particles
          id="tsparticles-publications"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Border radius suavizado para 2rem no mobile */}
          <div className="bg-zinc-900 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[50%] h-32 bg-[#ff6d00]/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div className="text-center mb-12 sm:mb-16 relative z-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants}>
              <motion.h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase mb-4" variants={itemVariants}>
                Biblioteca LAFI
              </motion.h2>
              <motion.h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 sm:mb-6" variants={itemVariants}>
                Produção <span className="bg-gradient-to-r from-[#ff6d00] to-orange-400 bg-clip-text text-transparent">Científica</span>
              </motion.h3>
              <motion.p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed" variants={itemVariants}>
                Nossas contribuições para o avanço da ciência e tecnologia em geociências e ciência de dados.
              </motion.p>
            </motion.div>

            <motion.div className="max-w-4xl mx-auto relative z-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants}>
              <div className="flex items-center justify-center sm:justify-between mb-8">
                <motion.h4 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left" variants={itemVariants}>Publicações Recentes</motion.h4>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {recentPublications.map((pub, index) => (
                  <motion.button
                    key={pub.title}
                    onClick={() => setSelectedPub(pub)}
                    variants={itemVariants}
                    // Redução de padding interno no mobile (p-4 sm:p-5)
                    className="w-full text-left bg-zinc-950 p-4 sm:p-5 rounded-2xl border border-white/5 transition-all duration-300 hover:bg-zinc-900 hover:border-[#ff6d00]/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(255,109,0,0.15)] group focus:outline-none focus:ring-2 focus:ring-[#ff6d00]/50"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
                      <div className="w-full sm:w-48 h-48 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                        <img src={pub.image} alt={pub.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                      </div>
                      
                      <div className="flex-grow flex flex-col h-full justify-between py-1 w-full">
                        <div>
                          <div className="flex flex-wrap justify-between items-center gap-2 mb-3 mt-2 sm:mt-0">
                            <span className="bg-[#ff6d00]/10 text-[#ff6d00] border border-[#ff6d00]/20 text-[10px] sm:text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                              {pub.type}
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold text-zinc-500 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                              {pub.year}
                            </span>
                          </div>
                          <h4 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#ff6d00] transition-colors duration-300 line-clamp-2">
                            {pub.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-zinc-400 mb-4 font-light line-clamp-2 sm:line-clamp-1">
                            <span className="italic">{pub.authors}</span>
                          </p>
                        </div>
                        
                        </div>
                      </div>
                  </motion.button>
                ))}
              </div>
              
              <motion.div className="text-center mt-10 sm:mt-12" variants={itemVariants}>
                <button className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 bg-zinc-950 border border-white/10 text-white font-bold rounded-xl hover:border-[#ff6d00] hover:text-[#ff6d00] transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(255,109,0,0.15)]">
                  <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base">Explorar Acervo Completo</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
            
          </div>
        </div>    
      </section>

      <AnimatePresence>
        {selectedPub && <Modal pub={selectedPub} onClose={() => setSelectedPub(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Publications;