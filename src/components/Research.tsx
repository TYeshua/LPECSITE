// src/pages/Research.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Scan, Waves, Signal, Cpu, Scaling, X } from 'lucide-react';

// Importações para o background de partículas
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

import { Marquee } from "@/components/ui/marquee";

// --- Tipagem dos Dados ---
interface ResearchLine {
  icon: JSX.Element;
  title: string;
  description: string;
  detailedDescription: string;
}

// --- DADOS ---
const researchLines: ResearchLine[] = [
  {
    icon: <Layers size={32} strokeWidth={1.5} />,
    title: "Filosofia da Linguagem e Modelagem Matemática na Formação Docente",
    description: "Investigação dos processos de ensino-aprendizagem de matemática através da filosofia da linguagem, focando na formação de docentes e no uso da modelagem para abordar sustentabilidade e cultura.",
    detailedDescription: "A pesquisa utiliza o referencial teórico da filosofia da linguagem de Ludwig Wittgenstein para analisar a matemática como um sistema de regras e usos práticos (jogos de linguagem). O foco está em como professores em formação podem utilizar a Modelagem Matemática não apenas como ferramenta de cálculo, mas como um método para interpretar e intervir em realidades complexas. O trabalho explora a conexão entre a matemática escolar e temas transversais, como a Educação Ambiental, a Sustentabilidade e a Etnomatemática, buscando desenvolver práticas pedagógicas que tornem o ensino de exatas mais humano, crítico e adaptado à diversidade cultural e linguística dos alunos.",
  },
  {
    icon: <Cpu size={32} strokeWidth={1.5} />,
    title: "Inteligência Computacional Aplicada a Ambientes de Aprendizagem e Ciência de Dados.",
    description: "Desenvolvimento de sistemas inteligentes utilizando Machine Learning e Processamento de Linguagem Natural para análise de dados educacionais, mineração de dados e inovação tecnológica.",
    detailedDescription: "A pesquisa foca no uso de algoritmos avançados de Deep Learning e Machine Learning para extrair conhecimento de grandes volumes de dados (Data Mining). O trabalho destaca-se na área de Learning Analytics e Educational Data Mining, onde o objetivo é criar Ambientes Inteligentes de Aprendizagem que entendam e prevejam o comportamento do estudante. Além disso, o pesquisador aplica Processamento de Linguagem Natural (PLN) para automatizar a compreensão de textos e apoiar a transferência de tecnologia e a propriedade intelectual, conectando a computação pura às necessidades práticas de inovação e gestão de projetos.",
  },
  {
    icon: <Scan size={32} strokeWidth={1.5} />,
    title: "Análise Inteligente e Mineração de Dados Petrofísicos de Bacias Petrolíferas Brasileiras.",
    description: "Implementação de um pipeline de Ciência de Dados para processar, modelar e visualizar dados públicos da ANP, visando a extração de insights e otimização da produção de hidrocarbonetos.",
    detailedDescription: "O projeto adota a metodologia clássica de Ciência de Dados dividida em seis etapas: definição do problema, coleta, pré-processamento (limpeza), análise exploratória, modelagem e comunicação. A base científica fundamenta-se nos 5 Vs do Big Data (Volume, Velocidade, Variedade, Veracidade e Valor). Tecnicamente, o trabalho envolve a mineração de dados petrofísicos complexos para identificar padrões de comportamento em bacias terrestres. O desenvolvimento utiliza o Power BI para a criação de Dashboards dinâmicos e modelos de Business Intelligence que permitem a interpretação célere de dados de produção, facilitando a gestão do conhecimento e a eficiência operacional no setor de óleo e gás.",
  },
  {
    icon: <Waves size={32} strokeWidth={1.5} />,
    title: "Estudo computacional da histerese térmica e transições de fase em sistemas de spin via Estatística de Kaniadakis",
    description: "O projeto investiga fenômenos magnéticos complexos através de uma abordagem de física teórica-computacional avançada. O foco está na superação das limitações da estatística convencional (Boltzmann-Gibbs) ao lidar com sistemas que não seguem distribuições padrão, como nanoestruturas e materiais desordenados. Utilizando a Estatística de Kaniadakis ($\kappa$-estatística), o estudo busca modelar como deformações na distribuição de energia afetam a estabilidade e a memória magnética (histerese) de sistemas de spin em redes bidimensionais.",
    detailedDescription: "A histerese térmica é fundamental no estudo de transições de fase magnéticas, mas em sistemas complexos e não-extensivos, a estatística de Boltzmann-Gibbs mostra-se insuficiente, exigindo abordagens generalizadas como a estatística de Kaniadakis (kappa-estatística). O uso dessa teoria justifica-se porque materiais reais, como nanoestruturas, frequentemente exibem distribuições de energia em lei de potência (power-law), que a deformação kappa captura naturalmente. Sendo assim, este projeto tem o objetivo de analisar computacionalmente a histerese térmica em um modelo de Ising 2D, focando em quantificar a influência do parâmetro kappa na temperatura crítica (T_c) e na área do laço de histerese. Para isso, a metodologia baseia-se em simulações de Monte Carlo via algoritmo de Metropolis adaptado, onde o fator de Boltzmann é substituído pela probabilidade kappa-exponencial exp kappa(x). A partir da simulação de ciclos de aquecimento e resfriamento, serão extraídas grandezas macroscópicas fundamentais, como magnetização, susceptibilidade, energia e cumulante de Binder. Como conclusão e finalidade computacional, o estudo mapeará como a deformação estatística expande ou contrai as zonas de metaestabilidade, fornecendo um modelo preditivo robusto e preciso para descrever materiais magnéticos desordenados.",
  },
  {
    icon: <Signal size={32} strokeWidth={1.5} />,
    title: "Desenvolvimento de Objetos de Aprendizagem Digitais e Gamificação aplicados à Mecânica Clássica",
    description: "Criação e validação de jogos e simulações computacionais para o ensino de Leis de Newton e cinemática, visando a transição da memorização para a compreensão conceitual profunda.",
    detailedDescription: "A pesquisa utiliza princípios de Game Design e lógica de programação para modelar fenômenos físicos (como Movimento Retilíneo Uniforme e Variado) em ambientes virtuais. O foco técnico está na tradução de modelos matemáticos em motores de simulação onde o usuário pode alterar variáveis em tempo real e observar os resultados imediatos. A metodologia adota uma abordagem quali-quantitativa, estruturando sequências didáticas que colocam o estudante no centro do processo (protagonismo). O objetivo final é combater a 'aprendizagem mecânica' (decoreba), promovendo uma compreensão intuitiva e concreta das forças e movimentos através da interatividade e de experimentos virtuais que seriam difíceis de reproduzir em laboratórios físicos convencionais.",
  },
  {
    icon: <Scaling size={32} strokeWidth={1.5} />,
    title: "Geomecânica de Reservatórios",
    description: "Análise da estabilidade de poços e o comportamento mecânico das rochas.",
    detailedDescription: "Esta linha investiga a interação entre as tensões da terra e as operações de perfuração e produção. O objetivo é prever e prevenir problemas como o colapso de poços, otimizar a fratura hidráulica e entender fenômenos como a compactação do reservatório e a subsidência de superfície.",
  }
];

// --- COMPONENTE DO MODAL ---
const Modal = ({ line, onClose }: { line: ResearchLine, onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        // Ajuste Crítico: max-h-[90dvh] e overflow-y-auto adicionados para garantir rolagem no mobile.
        // Padding reduzido no mobile (p-6) para economizar espaço de leitura.
        className="relative z-10 w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(255,109,0,0.05)] max-h-[90dvh] overflow-y-auto custom-scrollbar"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff6d00]/50 to-transparent" />

        <button 
          onClick={onClose} 
          // Ajuste: Botão de fechar reposicionado para não colidir com a borda no celular
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-2.5 rounded-full bg-zinc-900/80 sm:bg-zinc-900 text-zinc-400 hover:text-white hover:bg-[#ff6d00] hover:scale-110 transition-all duration-300 border border-white/5 hover:border-[#ff6d00]"
        >
          <X size={20} strokeWidth={2} />
        </button>

        {/* Ajuste: Espaçamentos (gap e mt) otimizados para fluir melhor ao empilhar */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8 mt-6 sm:mt-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-[#ff6d00] bg-gradient-to-br from-[#ff6d00]/20 to-[#ff6d00]/5 border border-[#ff6d00]/30 shadow-[0_0_15px_rgba(255,109,0,0.15)]">
            {line.icon}
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 sm:mb-2 leading-tight pr-6 sm:pr-0">{line.title}</h3>
          </div>
        </div>
        
        <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-light">
          {line.detailedDescription}
        </p>
      </motion.div>
    </div>
  );
};

function ResearchCard({ item, onClick }: { item: ResearchLine; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      // Ajuste Crítico: w-[18rem] garante que caiba em qualquer celular, w-[22rem] volta para o PC. 
      // mx-2 e p-5 no mobile economizam espaço lateral.
      className="group relative flex h-full min-h-[14rem] w-[18rem] sm:w-[22rem] cursor-pointer flex-col items-start justify-between rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all hover:border-[#ff6d00]/50 hover:bg-zinc-900 mx-2 sm:mx-3 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-[#ff6d00]/60 transition-all duration-500" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#ff6d00]/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="mb-4 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed relative z-10 line-clamp-4">
        {item.description}
      </div>
      
      <div className="mt-auto flex items-center gap-3 sm:gap-4 w-full border-t border-white/5 pt-4 relative z-10">
        <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center text-[#ff6d00] bg-[#ff6d00]/10 border border-[#ff6d00]/30 rounded-xl shadow-[0_0_15px_rgba(255,109,0,0.1)] group-hover:bg-[#ff6d00]/20 transition-colors">
          {item.icon}
        </div>
        <div className="flex flex-col">
          <div className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-[#ff6d00] transition-colors line-clamp-1">
            {item.title}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MarqueeResearch({ onSelectLine }: { onSelectLine: (line: ResearchLine) => void }) {
  return (
    <div className="relative w-full max-w-[1400px] mx-auto overflow-hidden">
      {/* Ajuste: Redução drástica da máscara de gradiente no mobile (w-8) para não esconder as pontas dos cards */}
      <div className="from-black absolute inset-y-0 left-0 z-10 w-8 sm:w-32 bg-gradient-to-r to-transparent pointer-events-none" />
      <div className="from-black absolute inset-y-0 right-0 z-10 w-8 sm:w-32 bg-gradient-to-l to-transparent pointer-events-none" />
      <Marquee className="py-4" direction="left">
        {[...researchLines, ...researchLines].map((item, index) => (
          <ResearchCard key={index} item={item} onClick={() => onSelectLine(item)} />
        ))}
      </Marquee>
      <Marquee className="py-4 mt-2" direction="right">
        {[...researchLines, ...researchLines].map((item, index) => (
          <ResearchCard key={`reverse-${index}`} item={item} onClick={() => onSelectLine(item)} />
        ))}
      </Marquee>
    </div>
  )
}

// --- COMPONENTE PRINCIPAL ---
const Research = () => {
  const [selectedLine, setSelectedLine] = useState<ResearchLine | null>(null);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = useMemo(() => ({
    background: { color: { value: 'transparent' } }, 
    fpsLimit: 45, 
    interactivity: { 
        events: { onHover: { enable: true, mode: 'repulse' }, resize: true }, 
        modes: { repulse: { distance: 120, duration: 0.4 } } 
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

  return (
    <section id="research" className="relative w-full text-white overflow-hidden py-24 lg:py-32">
      
      {/* Camada de Partículas preenchendo a seção toda */}
      <Particles
        id="tsparticles-research"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase mb-4">Nossa Atuação</h2>
        <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-md">
          Linhas de <span className="bg-gradient-to-r from-[#ff6d00] to-orange-400 bg-clip-text text-transparent">Pesquisa</span>
        </h3>
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
          Explore nossas frentes de inovação.
        </p>
      </div>

      {/* Marquee exibindo as linhas de pesquisa */}
      <div className="relative z-10 w-full">
        <MarqueeResearch onSelectLine={setSelectedLine} />
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