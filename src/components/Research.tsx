// src/pages/Research.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Scan, Waves, Signal, Cpu, Scaling, X } from 'lucide-react'; // Ícones relevantes para Geociências

// --- Tipagem dos Dados ---
interface ResearchLine {
  icon: JSX.Element;
  title: string;
  description: string;
  detailedDescription: string;
  projects: number;
}

// --- DADOS ADAPTADOS PARA O CONTEXTO DE GEOCIÊNCIAS/PETROFÍSICA ---
const researchLines: ResearchLine[] = [
  {
    icon: <Layers size={28} />,
    title: "Modelagem de Reservatórios",
    description: "Integração de dados geológicos, geofísicos e de engenharia para criar modelos 3D precisos.",
    detailedDescription: "Esta linha foca na construção de modelos estáticos e dinâmicos de reservatórios de petróleo. Utilizamos técnicas avançadas de geoestatística e modelagem estocástica para caracterizar a heterogeneidade das rochas, prever a distribuição de fluidos e otimizar estratégias de produção.",
    projects: 18,
  },
  {
    icon: <Cpu size={28} />,
    title: "IA em Geociências",
    description: "Aplicação de machine learning para acelerar a interpretação de dados e reduzir incertezas.",
    detailedDescription: "Desenvolvemos e aplicamos algoritmos de inteligência artificial para solucionar problemas complexos em geociências. Nossas pesquisas incluem a classificação de fácies sísmicas com redes neurais convolucionais, a previsão de propriedades de rochas a partir de perfis de poço e a otimização de produção com aprendizado por reforço.",
    projects: 15,
  },
  {
    icon: <Scan size={28} />,
    title: "Petrofísica Digital",
    description: "Análise de imagens de microtomografia (μCT) para entender o comportamento das rochas.",
    detailedDescription: "Através da análise de imagens 3D de alta resolução, criamos 'gêmeos digitais' de amostras de rocha. Isso nos permite simular propriedades como porosidade, permeabilidade e condutividade elétrica em escala de poros, validando e aprimorando modelos petrofísicos tradicionais.",
    projects: 12,
  },
  {
    icon: <Waves size={28} />,
    title: "Simulação de Fluxo",
    description: "Modelagem numérica do movimento de fluidos (óleo, gás, água) em meios porosos.",
    detailedDescription: "Nossa pesquisa se concentra no desenvolvimento e aplicação de simuladores de fluxo multifásico para prever o comportamento de reservatórios ao longo do tempo. Exploramos métodos numéricos eficientes para lidar com geometrias complexas e fenômenos físicos como o fluxo em rochas naturalmente fraturadas.",
    projects: 10,
  },
  {
    icon: <Signal size={28} />,
    title: "Geofísica Computacional",
    description: "Processamento e inversão de dados sísmicos para mapear o subsolo.",
    detailedDescription: "Trabalhamos com o desenvolvimento de algoritmos para melhorar a qualidade das imagens sísmicas e extrair quantitativamente as propriedades elásticas das rochas a partir desses dados. A pesquisa inclui inversão sísmica, migração e imageamento de alta resolução.",
    projects: 9,
  },
  {
    icon: <Scaling size={28} />,
    title: "Geomecânica de Reservatórios",
    description: "Análise da estabilidade de poços e o comportamento mecânico das rochas.",
    detailedDescription: "Esta linha investiga a interação entre as tensões da terra e as operações de perfuração e produção. O objetivo é prever e prevenir problemas como o colapso de poços, otimizar a fratura hidráulica e entender fenômenos como a compactação do reservatório e a subsidência de superfície.",
    projects: 7,
  }
];

// --- COMPONENTE DO MODAL (REESTILIZADO) ---
const Modal = ({ line, onClose }: { line: ResearchLine, onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-orange-500/10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 200 }}
        onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/60 text-white hover:bg-orange-500 transition-colors border border-white/10">
          <X size={20} />
        </button>

        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-orange-400 bg-orange-950/80 border border-orange-500/30">
            {line.icon}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">{line.title}</h3>
            <span className="font-semibold text-orange-400">{line.projects} projetos ativos</span>
          </div>
        </div>
        <p className="text-zinc-300 leading-relaxed">{line.detailedDescription}</p>
      </motion.div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (REESTILIZADO) ---
const Research = () => {
  const [selectedLine, setSelectedLine] = useState<ResearchLine | null>(null);

  return (
    <section id="research" className="py-24 sm:py-32 bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10" />
      </div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_farthest-side_at_50%_100%,rgba(255,109,0,0.1),transparent)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">
            Linhas de Pesquisa
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto">
            Clique em uma área para explorar em detalhes nossas frentes de inovação em geociências e computação.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {researchLines.map((line, index) => (
            <motion.button
              key={line.title}
              onClick={() => setSelectedLine(line)}
              className="text-left group bg-zinc-900/70 backdrop-blur-sm p-6 rounded-xl border border-orange-600/20 transition-all duration-300 hover:border-orange-500/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center text-orange-400 bg-orange-950/80 border border-orange-500/30 transition-transform duration-300 group-hover:scale-110">
                  {line.icon}
                </div>
                <span className="text-sm font-semibold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">
                  {line.projects} projetos
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">{line.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{line.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedLine && (
          <Modal line={selectedLine} onClose={() => setSelectedLine(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Research;