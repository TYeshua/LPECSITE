// src/components/Projects.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Award, X, Github, ArrowRight } from 'lucide-react';
import { FlippingCard } from "@/components/ui/flipping-card";

// Importações para o background de partículas
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// --- Tipagem dos Dados ---
export interface Project {
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  status: 'Concluído' | 'Em Desenvolvimento' | 'Fase de Testes';
  duration: string;
  image: string;
  repo_url?: string;
  demo_url?: string;
}

// DADOS contextualizados para o LAFI
const featuredProjects: Project[] = [
  {
    title: "Análise Inteligente e Mineração de Dados Petrofísicos de Bacias Petrolíferas Brasileiras",
    description: "Implementação de um pipeline de Ciência de Dados para processar, modelar e visualizar dados públicos da ANP, visando a extração de insights e otimização da produção de hidrocarbonetos.",
    detailedDescription: "O projeto adota a metodologia clássica de Ciência de Dados dividida em seis etapas: definição do problema, coleta, pré-processamento (limpeza), análise exploratória, modelagem e comunicação. A base científica fundamenta-se nos 5 Vs do Big Data (Volume, Velocidade, Variedade, Veracidade e Valor). Tecnicamente, o trabalho envolve a mineração de dados petrofísicos complexos para identificar padrões de comportamento em bacias terrestres. O desenvolvimento utiliza o Power BI para a criação de Dashboards dinâmicos e modelos de Business Intelligence que permitem a interpretação célere de dados de produção, facilitando a gestão do conhecimento e a eficiência operacional no setor de óleo e gás.",
    category: "Data Science & Machine Learning",
    status: "Em Desenvolvimento",
    duration: "12 meses",
    image: import.meta.env.BASE_URL + "dados.webp",
    repo_url: "#",
    demo_url: "#",
  },
  {
    title: "GeoStatSim Platform",
    description: "Software de simulação geoestatística para modelagem de heterogeneidade em reservatórios.",
    detailedDescription: "O GeoStatSim é uma ferramenta computacional que implementa algoritmos de simulação sequencial e baseada em objetos para gerar múltiplos cenários equiprováveis da distribuição de propriedades petrofísicas, essencial para a análise de risco e incerteza.",
    category: "Geoestatística & Simulação",
    status: "Fase de Testes",
    duration: "18 meses",
    image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800",
    repo_url: "#",
  },
  {
    title: "Digital Rock Physics Portal",
    description: "Plataforma web para análise e visualização de dados de petrofísica digital (μCT).",
    detailedDescription: "Este portal permite que pesquisadores façam upload, processem e visualizem imagens 3D de microtomografia de rochas. A plataforma calcula automaticamente propriedades como porosidade, tortuosidade e realiza simulações de fluxo em escala de poros.",
    category: "Petrofísica Digital",
    status: "Concluído",
    duration: "12 meses",
    image: "https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Seismic Inversion Toolkit",
    description: "Conjunto de ferramentas para inversão sísmica e estimativa de propriedades elásticas.",
    detailedDescription: "Desenvolvemos um toolkit em Python que implementa métodos de inversão sísmica, desde a pós-empilhamento até a pré-empilhamento simultânea, para transformar dados sísmicos em mapas de propriedades de rocha, como impedância acústica e razão de Poisson.",
    category: "Geofísica Computacional",
    status: "Em Desenvolvimento",
    duration: "30 meses",
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
    repo_url: "#",
  }
];

// --- Componentes Auxiliares ---

// Modal Premium
// Popup de Detalhes do Projeto
const ProjectPopup: React.FC<{ project: Project, onClose: () => void }> = ({ project, onClose }) => {
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
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
              onClick={onClose} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
            />
            
            <motion.div 
              className="relative z-10 w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(255,109,0,0.15)] overflow-hidden flex flex-col max-h-[85dvh]" 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Header com Gradiente */}
                <div className="relative w-full h-32 flex-shrink-0 bg-gradient-to-br from-[#ff6d00]/20 to-zinc-950 border-b border-white/5">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                  <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-[#ff6d00] transition-all duration-300 border border-white/10 hover:border-[#ff6d00] hover:scale-110"
                  >
                    <X size={20} strokeWidth={2} />
                  </button>
                  <div className="absolute bottom-6 left-8 sm:left-10">
                    <span className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-[#ff6d00] bg-[#ff6d00]/10 border border-[#ff6d00]/20 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                {/* Conteúdo do Popup */}
                <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar relative z-20">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 leading-tight">
                      {project.title}
                    </h3>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-light mb-8 whitespace-pre-wrap">
                        {project.detailedDescription}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-zinc-300 border-t border-white/10 pt-8 mt-4">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest"><Award size={14} className="text-[#ff6d00]" /> Status</span>
                          <span className="font-medium text-white text-sm sm:text-base">{project.status}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest"><Calendar size={14} className="text-[#ff6d00]" /> Duração</span>
                          <span className="font-medium text-white text-sm sm:text-base">{project.duration}</span>
                        </div>
                    </div>
                    
                    {(project.repo_url || project.demo_url) && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 pt-8 border-t border-white/10">
                            {project.repo_url && (
                              <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 border border-white/5 text-white text-sm font-medium hover:bg-zinc-800 transition-all duration-300">
                                <Github className="w-4 h-4" /> Repositório
                              </a>
                            )}
                            {project.demo_url && (
                              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ff6d00] text-white text-sm font-bold hover:bg-orange-500 transition-all duration-300 shadow-[0_0_20px_rgba(255,109,0,0.2)]">
                                Ver Demo <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'Concluído': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Em Desenvolvimento': return 'bg-[#ff6d00]/10 text-[#ff6d00] border-[#ff6d00]/20';
    case 'Fase de Testes': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
  }
};

// --- Front do Card ---
interface GenericCardFrontProps {
  project: Project;
}

function GenericCardFront({ project }: GenericCardFrontProps) {
  return (
    <div className="flex h-full w-full flex-col bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 group relative">
      <div className="h-48 sm:h-56 min-h-[12rem] sm:min-h-[14rem] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10 opacity-90" />
        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
        <div className="absolute top-4 left-4 z-20">
          <span className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>
      <div className="p-5 sm:p-8 flex flex-col flex-grow text-left relative z-20 -mt-6 sm:-mt-8 bg-zinc-900 rounded-t-2xl sm:rounded-t-3xl">
        <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#ff6d00] mb-2 line-clamp-1">{project.category}</span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 sm:mb-3 leading-tight group-hover:text-[#ff6d00] transition-colors duration-300 line-clamp-2">{project.title}</h3>
        <p className="text-zinc-400 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm font-light line-clamp-3">{project.description}</p>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500 mt-auto pt-4 border-t border-white/5 font-medium">
          <div className="flex items-center gap-1.5 sm:gap-2"><Calendar size={16} /><span>{project.duration}</span></div>
        </div>
      </div>
    </div>
  )
}

// --- Back do Card ---
interface GenericCardBackProps {
  project: Project;
  onClick: () => void;
}

function GenericCardBack({ project, onClick }: GenericCardBackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-zinc-950 rounded-2xl border border-[#ff6d00]/30 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff6d00]/10 to-transparent pointer-events-none" />
      
      <Award className="w-16 h-16 text-[#ff6d00] mb-6 relative z-10 opacity-80" strokeWidth={1} />
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center relative z-10 leading-tight px-4">{project.title}</h3>
      
      <p className="text-zinc-500 text-center text-xs mb-8 font-medium uppercase tracking-widest relative z-10">
        Explorar documentação e detalhes do projeto
      </p>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="relative z-50 pointer-events-auto bg-[#ff6d00] hover:bg-orange-500 text-white flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-sm font-bold transition-all duration-300 shadow-[0_0_30px_rgba(255,109,0,0.3)] hover:shadow-[0_0_40px_rgba(255,109,0,0.5)] hover:-translate-y-1 active:scale-95"
      >
        Ver detalhes completos <ArrowRight size={18} />
      </button>
    </div>
  )
}

// --- Componente Principal ---
const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
      {/* py-24 mantido para espaçamento orgânico de seções */}
      <section id="projects" className="py-24 sm:py-32 text-white relative overflow-hidden">
        
        <Particles
          id="tsparticles-projects"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0 pointer-events-none"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="bg-zinc-900 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[60%] h-32 bg-[#ff6d00]/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div className="text-center mb-10 sm:mb-16 relative z-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants}>
              <motion.h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase mb-4" variants={itemVariants}>
                Portfólio LAFI
              </motion.h2>
              <motion.h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 sm:mb-6" variants={itemVariants}>
                Projetos em <span className="bg-gradient-to-r from-[#ff6d00] to-orange-400 bg-clip-text text-transparent">Destaque</span>
              </motion.h3>
              <motion.p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed" variants={itemVariants}>
                Conheça algumas das nossas iniciativas que impulsionam a inovação integrando IA, estatística e geociências.
              </motion.p>
            </motion.div>

            <motion.div className="grid lg:grid-cols-2 gap-6 sm:gap-8 relative z-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
              {featuredProjects.map((project, index) => (
                // Ajuste Crítico de Altura: h-[420px] evita telas ocupadas inteiramente pelo card no celular
                <motion.div key={project.title} custom={index} variants={itemVariants} className="w-full h-[420px] sm:h-[480px]">
                  <FlippingCard
                    frontContent={<GenericCardFront project={project} />}
                    backContent={<GenericCardBack project={project} onClick={() => setSelectedProject(project)} />}
                  />
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && <ProjectPopup project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Projects;