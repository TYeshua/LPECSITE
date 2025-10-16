// src/components/Projects.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useSpring } from 'framer-motion';
import { ExternalLink, Calendar, Users, Award, X, Github } from 'lucide-react';

// --- Tipagem dos Dados ---
interface Project {
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  status: 'Concluído' | 'Em Desenvolvimento' | 'Fase de Testes';
  team: number;
  duration: string;
  image: string;
  repo_url?: string;
  demo_url?: string;
}

// NOVO: Dados contextualizados para o LPEC
const featuredProjects: Project[] = [
  {
    title: "AI Reservoir Characterization",
    description: "Plataforma de IA para otimização da caracterização de reservatórios usando dados sísmicos e de poços.",
    detailedDescription: "Esta plataforma utiliza redes neurais convolucionais e algoritmos de aprendizado profundo para identificar fácies geológicas, prever porosidade e permeabilidade, reduzindo significativamente o tempo de interpretação e as incertezas do modelo de reservatório.",
    category: "Inteligência Artificial",
    status: "Em Desenvolvimento",
    team: 8,
    duration: "24 meses",
    image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800",
    repo_url: "#",
    demo_url: "#",
  },
  {
    title: "GeoStatSim Platform",
    description: "Software de simulação geoestatística para modelagem de heterogeneidade em reservatórios.",
    detailedDescription: "O GeoStatSim é uma ferramenta computacional que implementa algoritmos de simulação sequencial e baseada em objetos para gerar múltiplos cenários equiprováveis da distribuição de propriedades petrofísicas, essencial para a análise de risco e incerteza.",
    category: "Geoestatística & Simulação",
    status: "Fase de Testes",
    team: 6,
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
    team: 5,
    duration: "12 meses",
    image: "https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Seismic Inversion Toolkit",
    description: "Conjunto de ferramentas para inversão sísmica e estimativa de propriedades elásticas.",
    detailedDescription: "Desenvolvemos um toolkit em Python que implementa métodos de inversão sísmica, desde a pós-empilhamento até a pré-empilhamento simultânea, para transformar dados sísmicos em mapas de propriedades de rocha, como impedância acústica e razão de Poisson.",
    category: "Geofísica Computacional",
    status: "Em Desenvolvimento",
    team: 10,
    duration: "30 meses",
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
    repo_url: "#",
  }
];

// --- Componentes Auxiliares ---

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 50, stiffness: 100 });

  useEffect(() => { if (isInView) spring.set(value); }, [spring, isInView, value]);
  useEffect(() => spring.on("change", (latest) => { if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString('pt-BR'); }), [spring]);
  
  return <span ref={ref}>0</span>;
};

// ALTERADO: Modal reestilizado com nosso padrão
const Modal: React.FC<{ project: Project, onClose: () => void }> = ({ project, onClose }) => {
    useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}/>
            <motion.div 
              className="relative z-10 w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl shadow-orange-500/10 overflow-hidden" 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 200 }}
              onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
            >
                <img src={project.image} alt={project.title} className="w-full h-64 object-cover"/>
                <div className="p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/60 text-white hover:bg-orange-500 transition-colors border border-white/10"><X size={20} /></button>
                    <span className="text-sm font-semibold text-orange-400">{project.category}</span>
                    <h3 className="text-3xl font-bold text-white mt-2 mb-4">{project.title}</h3>
                    <p className="text-zinc-300 leading-relaxed mb-6">{project.detailedDescription}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-zinc-300 border-t border-white/10 pt-6">
                        <div className="flex items-center gap-2"><Award className="w-5 h-5 text-orange-400" /> <strong>Status:</strong> {project.status}</div>
                        <div className="flex items-center gap-2"><Users className="w-5 h-5 text-orange-400" /> <strong>Equipe:</strong> {project.team} pesquisadores</div>
                        <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-400" /> <strong>Duração:</strong> {project.duration}</div>
                    </div>
                    {(project.repo_url || project.demo_url) && (
                        <div className="flex items-center space-x-4 mt-6">
                            {project.repo_url && <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-orange-300 transition-colors"><Github className="w-4 h-4" /><span>Repositório</span></a>}
                            {project.demo_url && <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-orange-300 transition-colors"><ExternalLink className="w-4 h-4" /><span>Ver Demo</span></a>}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// --- Componente Principal ---
const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // ALTERADO: Cores de status alinhadas com nossa paleta
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Concluído': return 'bg-zinc-700/50 text-zinc-300 border-zinc-600/50';
      case 'Em Desenvolvimento': return 'bg-orange-950/80 text-orange-300 border-orange-500/30';
      case 'Fase de Testes': return 'bg-yellow-950/80 text-yellow-300 border-yellow-500/30';
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

  return (
    <>
      <section id="projects" className="py-24 sm:py-32 bg-zinc-950 text-white relative overflow-hidden">
        {/* ALTERADO: Fundo atmosférico com blur */}
        <div 
          className="absolute inset-0 z-0 bg-black" 
          aria-hidden="true" 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants}>
            {/* ALTERADO: Título com nosso gradiente laranja */}
            <motion.h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6" variants={itemVariants}>
              Projetos em Destaque
            </motion.h2>
            <motion.p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto" variants={itemVariants}>
              Conheça algumas das nossas iniciativas que impulsionam a inovação em geociências.
            </motion.p>
          </motion.div>

          <motion.div className="grid lg:grid-cols-2 gap-8 mb-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
            {featuredProjects.map((project, index) => (
              // ALTERADO: Card com nosso padrão visual
              <motion.button key={project.title} onClick={() => setSelectedProject(project)} custom={index} variants={itemVariants} className="text-left bg-zinc-900/70 rounded-xl overflow-hidden group border border-orange-600/20 transition-all duration-300 hover:border-orange-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 backdrop-blur-sm">
                <div className="h-48 overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-sm text-orange-400 font-semibold">{project.category}</span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-3">{project.title}</h3>
                  <p className="text-zinc-400 mb-6 leading-relaxed text-sm line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /><span>{project.team} pesquisadores</span></div>
                    <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /><span>{project.duration}</span></div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* ALTERADO: Painel de impacto com nosso padrão visual */}
          <motion.div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 to-zinc-900/50 border border-white/10 p-10 rounded-2xl text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <Award className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">Reconhecimento e Impacto</h3>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">Nossos projetos consolidam nossa posição como referência em inovação.</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2"><AnimatedNumber value={40} />+</div>
                <div className="text-zinc-400">Publicações</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2"><AnimatedNumber value={15} />+</div>
                <div className="text-zinc-400">Projetos Ativos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2"><AnimatedNumber value={8} />+</div>
                <div className="text-zinc-400">Colaborações Industriais</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Projects;