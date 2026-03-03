// src/components/About.tsx

import React from 'react';
import { Target, Layers, TrendingUp, Database, LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';

// Tipagem dos pilares
type Pillar = {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
};

// Conteúdo dos pilares
const pillars: Pillar[] = [
  {
    icon: Database,
    title: 'Petrofísica',
    description:
      'Análise avançada de propriedades físicas e químicas de rochas e fluidos em reservatórios, com base em dados experimentais e modelagem.',
  },
  {
    icon: TrendingUp,
    title: 'Estatística',
    description:
      'Aplicação de métodos estatísticos robustos para interpretação, correlação e predição de dados geológicos e petrofísicos.',
  },
  {
    icon: Layers,
    title: 'Computação',
    description:
      'Uso de modelagem numérica, simulações e machine learning para caracterização e otimização de processos no subsolo.',
  },
];

// --- Componente Principal ---
const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.section
      id="about"
      className="relative py-24 sm:py-32 bg-black text-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Camada sutil de textura para evitar aparência “plana” demais */}
      <div
        className="absolute inset-0 bg-black"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título e subtítulo */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">
            Sobre o LAFI
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto">
            Integrando ciência de dados e geociências para desvendar os desafios do subsolo.
          </p>
        </motion.div>

        {/* Missão */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl mx-auto mb-24 bg-zinc-950 p-10 rounded-2xl border border-orange-600/30 shadow-[0_0_40px_-10px_rgba(255,115,0,0.25)]"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0 flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Target className="text-white" size={28} />
              </div>
              <h3 className="text-3xl font-bold text-white sm:hidden">Nossa Missão</h3>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-4 hidden sm:block">Nossa Missão</h3>
              <p className="text-zinc-300 leading-relaxed text-lg">
                Desenvolver e aplicar metodologias inovadoras que integrem petrofísica, estatística avançada e modelagem
                computacional para otimizar a exploração e produção de recursos energéticos.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pilares */}
        <motion.h3
          variants={itemVariants}
          className="text-3xl sm:text-4xl font-bold text-center tracking-tight mb-12 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
        >
          Nossos Pilares de Atuação
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="group relative bg-zinc-950 border border-zinc-800 rounded-2xl p-8 transition-all duration-300 hover:border-orange-500/40 hover:shadow-[0_0_25px_-10px_rgba(255,115,0,0.3)] hover:-translate-y-1"
              custom={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600/20 to-orange-500/10 border border-orange-600/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <pillar.icon className="text-orange-400" size={28} />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors duration-200">
                  {pillar.title}
                </h4>
                <p className="text-zinc-400 leading-relaxed text-sm">{pillar.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default About;
