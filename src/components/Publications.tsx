// src/components/Publications.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useSpring } from 'framer-motion';
import { BookOpen, Download, ExternalLink, TrendingUp, Users, X, Cpu, Layers } from 'lucide-react';

// --- Tipagem dos Dados ---
interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: string;
  citations: number;
  type: string;
  image: string;
  abstract: string;
}

// NOVO: Dados contextualizados para o LPEC
const recentPublications: Publication[] = [
    { 
      title: "Deep Learning for Seismic Facies Classification in Pre-Salt Reservoirs", 
      authors: "LIMA, J. R., SOUZA, C. F., et al.", 
      journal: "Geophysics", 
      year: "2025", 
      citations: 45, 
      type: "Artigo de Periódico",
      image: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=800",
      abstract: "Este artigo apresenta uma arquitetura de rede neural convolucional (CNN) para a classificação automática de fácies sísmicas em dados do pré-sal. Nosso modelo, treinado com dados sintéticos e validado com dados reais, alcançou uma acurácia de 92%, superando métodos tradicionais e acelerando o processo de interpretação geológica."
    },
    { 
      title: "A Geostatistical Approach to Reservoir Heterogeneity Modeling", 
      authors: "COSTA, M. A., PEREIRA, F. G., et al.", 
      journal: "SPE Journal", 
      year: "2024", 
      citations: 32, 
      type: "Artigo de Conferência",
      image: "https://images.pexels.com/photos/7164010/pexels-photo-7164010.jpeg?auto=compress&cs=tinysrgb&w=800",
      abstract: "Apresentamos uma metodologia geoestatística robusta para modelar a heterogeneidade de reservatórios carbonáticos. Utilizando simulação sequencial gaussiana e plurigaussiana, geramos múltiplos cenários de distribuição de porosidade e permeabilidade, fornecendo uma base sólida para a quantificação de incertezas no cálculo de volume de óleo."
    },
];

const publicationStats = [
  { label: "Publicações Totais", value: 250, icon: <BookOpen size={28} /> },
  { label: "Citações", value: 3500, icon: <TrendingUp size={28} /> },
  { label: "Projetos Ativos", value: 15, icon: <Cpu size={28} /> },
  { label: "Colaborações", value: 85, icon: <Users size={28} /> }
];

// --- Componentes Auxiliares ---

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 40, stiffness: 100 });

  useEffect(() => { if (isInView) spring.set(value); }, [spring, isInView, value]);
  useEffect(() => spring.on("change", (latest) => { if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString('pt-BR'); }), [spring]);
  
  return <span ref={ref}>0</span>;
};

// ALTERADO: Modal com nosso padrão visual
const Modal: React.FC<{ pub: Publication, onClose: () => void }> = ({ pub, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}/>
      <motion.div 
        className="relative z-10 w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl shadow-orange-500/10 overflow-hidden" 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        drag="y" dragConstraints={{ top: 0, bottom: 200 }} onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
      >
        <img src={pub.image} alt={`Imagem para ${pub.title}`} className="w-full h-56 object-cover" />
        <div className="p-8">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/60 text-white hover:bg-orange-500 transition-colors border border-white/10"><X size={20} /></button>
          <span className="bg-orange-950/80 text-orange-300 border border-orange-500/30 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 inline-block">{pub.type}</span>
          <h3 className="text-2xl font-bold text-white mb-3">{pub.title}</h3>
          <p className="text-sm text-zinc-400 mb-4 italic"><strong>{pub.authors}</strong> - {pub.journal} ({pub.year})</p>
          <h4 className="font-semibold text-white mb-2">Resumo:</h4>
          <p className="text-zinc-300 leading-relaxed text-sm max-h-48 overflow-y-auto pr-2">{pub.abstract}</p>
          <div className="flex items-center justify-between mt-6 border-t border-white/10 pt-4">
            <span className="flex items-center gap-2 text-sm text-zinc-300"><TrendingUp className="w-4 h-4 text-orange-400" />{pub.citations} citações</span>
            <div className="flex items-center space-x-4">
              <a href="#" className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-orange-300 transition-colors"><Download className="w-4 h-4" /><span>PDF</span></a>
              <a href="#" className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-orange-300 transition-colors"><ExternalLink className="w-4 h-4" /><span>Ver Online</span></a>
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

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

  return (
    <>
      <section id="publications" className="py-24 sm:py-32 bg-zinc-950 text-white relative overflow-hidden">
        {/* ALTERADO: Fundo com nosso padrão visual */}
        <div 
          className="absolute inset-0 z-0 bg-[radial-gradient(circle_farthest-side_at_50%_100%,rgba(255,109,0,0.1),transparent)]" 
          aria-hidden="true" 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants}>
            <motion.h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6" variants={itemVariants}>
              Produção Científica
            </motion.h2>
            <motion.p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto" variants={itemVariants}>
              Nossas contribuições para o avanço da ciência e tecnologia em geociências.
            </motion.p>
          </motion.div>

          {/* ALTERADO: Cards de estatísticas com nosso padrão visual */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants}>
            {publicationStats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants} className="bg-zinc-900/70 border border-orange-600/20 rounded-2xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-950/80 border border-orange-500/30 rounded-lg flex items-center justify-center text-orange-400">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-1"><AnimatedNumber value={stat.value} />+</div>
                <div className="text-zinc-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants}>
            <motion.h3 className="text-3xl font-bold text-white mb-8 text-center" variants={itemVariants}>Publicações Recentes</motion.h3>
            <div className="space-y-6">
              {recentPublications.map((pub) => (
                <motion.button
                  key={pub.title}
                  onClick={() => setSelectedPub(pub)}
                  variants={itemVariants}
                  className="w-full text-left bg-zinc-900/70 p-4 rounded-xl border border-white/10 transition-all duration-300 hover:bg-zinc-800/50 hover:border-orange-500/50 backdrop-blur-sm group"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-full sm:w-48 h-32 sm:h-auto flex-shrink-0 rounded-lg overflow-hidden">
                      <img src={pub.image} alt={pub.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <span className="bg-orange-950/80 text-orange-300 border border-orange-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">{pub.type}</span>
                        <span className="text-sm text-zinc-400 font-medium">{pub.year}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white mt-3 mb-2 group-hover:text-orange-400 transition-colors">{pub.title}</h4>
                      <p className="text-sm text-zinc-400 mb-3 italic">{pub.authors} - {pub.journal}</p>
                      <span className="flex items-center gap-2 text-sm text-zinc-300"><TrendingUp className="w-4 h-4 text-orange-400" />{pub.citations} citações</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.div className="text-center mt-12" variants={itemVariants}>
              <button className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-zinc-700 text-zinc-300 font-semibold rounded-lg hover:border-orange-500 hover:text-white transition-colors duration-300">
                <BookOpen size={16} />
                Ver Todas as Publicações
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedPub && <Modal pub={selectedPub} onClose={() => setSelectedPub(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Publications;