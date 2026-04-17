// src/components/About.tsx

import React from 'react';
import { Target, Layers, TrendingUp, Database, LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';
import VisualizadorLafi from './VisualizadorLafi';

// --- DADOS DOS PILARES ---
type Pillar = {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
};

const pillars: Pillar[] = [
  {
    icon: Database,
    title: 'Petrofísica',
    description: 'Análise de propriedades físicas de rochas e fluidos.',
  },
  {
    icon: TrendingUp,
    title: 'Estatística',
    description: 'Predição de dados com métodos robustos.',
  },
  {
    icon: Layers,
    title: 'Computação',
    description: 'Modelagem, simulação e machine learning.',
  },
];

// --- COMPONENTE PRINCIPAL ---
const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.section
      id="about"
      // Trocado de min-h-screen para min-h-[100dvh]. Adicionado flex-col para mobile e lg:flex-row para PC.
      className="relative w-full min-h-[100dvh] flex flex-col lg:flex-row text-white overflow-hidden z-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      
      {/* METADE ESQUERDA: Conteúdo em Card */}
      {/* Ajustes milimétricos de padding: pt e pb adicionados para o mobile respirar, zerados no desktop (lg:py-0) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center pt-24 pb-12 lg:py-0 pl-6 pr-6 sm:pl-16 sm:pr-8 lg:pl-32 lg:pr-12 z-10">
        
        {/* Cabeçalho */}
        <motion.div variants={itemVariants} className="mb-8 lg:mb-10 text-center lg:text-left mt-8 lg:mt-0">
          <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Sobre o{" "}
            <span className="bg-gradient-to-r from-[#ff6d00] to-orange-400 bg-clip-text text-transparent">
              LabIndustrial
            </span>
          </h3>
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
            Integrando ciência de dados e geociências para desvendar os desafios do subsolo.
          </p>
        </motion.div>

        {/* Card da Missão */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl mb-8 max-w-xl group transition-all duration-300 hover:bg-zinc-800 mx-auto lg:mx-0 w-full"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff6d00]/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#ff6d00]/20 to-[#ff6d00]/5 border border-[#ff6d00]/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,109,0,0.1)]">
              <Target className="text-[#ff6d00]" size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2 tracking-wide">
                Nossa Missão
              </h4>
              <p className="text-zinc-400 leading-relaxed text-sm font-light">
                Desenvolver e aplicar metodologias inovadoras que integrem petrofísica, estatística avançada e modelagem computacional para otimizar a exploração e produção de recursos energéticos.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pilares */}
        <motion.div 
          variants={itemVariants} 
          // O gap foi levemente reduzido no mobile e o grid otimizado
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-5 max-w-2xl mx-auto lg:mx-0 w-full"
        >
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="relative bg-zinc-900 border border-white/5 rounded-2xl p-6 transition-all duration-300 ease-out hover:border-[#ff6d00]/30 text-center sm:text-left"
            >
              <div className="mb-4 text-[#ff6d00] transition-colors duration-300 flex justify-center sm:justify-start">
                <pillar.icon size={26} strokeWidth={1.5} />
              </div>
              <h4 className="text-base font-semibold text-white mb-2 tracking-wide">
                {pillar.title}
              </h4>
              <p className="text-zinc-400 text-sm font-light leading-relaxed transition-colors duration-300">
                {pillar.description}
              </p>
            </div>
          ))}
        </motion.div>
        
      </div>

      {/* METADE DIREITA: Visual WebGL */}
      {/* Removido o 'hidden'. Adicionado min-h para dar espaço ao cubo 3D no mobile. No PC volta para h-full */}
      <div className="flex w-full lg:w-1/2 min-h-[450px] sm:min-h-[550px] lg:min-h-screen relative items-center justify-center pb-20 lg:pb-0">
        <VisualizadorLafi />
      </div>
      
    </motion.section>
  );
};

export default About;