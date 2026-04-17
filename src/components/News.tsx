// src/components/News.tsx

import React, { useState, useCallback } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// Importe o seu novo componente
import CardSwap, { Card } from './CardSwap';

interface NewsItem {
  title: string;
  excerpt: string;
  fullContent: string;
  date: string;
  category: string;
  image: string;
}

const news: NewsItem[] = [
  {
    title: "LAFI publica artigo sobre modelagem de reservatórios com IA",
    excerpt: "Nosso novo algoritmo melhora a precisão da caracterização de reservatórios utilizando redes neurais convolucionais.",
    fullContent: "O estudo, publicado na revista Geophysics, detalha uma nova arquitetura de rede neural que consegue identificar fácies sedimentares com 95% de acurácia a partir de dados sísmicos. Esta inovação representa um salto significativo para a exploração de campos complexos, reduzindo incertezas e otimizando o posicionamento de poços.",
    date: "2025-10-15",
    category: "Publicações",
    image: "https://picsum.photos/800/600?random=1",
  },
  {
    title: "Nova colaboração com o Centro de Geociências da Petrobras",
    excerpt: "Firmamos uma parceria estratégica para o desenvolvimento de métodos geostatísticos avançados em ambientes offshore.",
    fullContent: "A colaboração com o CGEO visa unir a expertise em petrofísica do LAFI com a modelagem geoestatística avançada do centro. O projeto foca na criação de modelos preditivos para propriedades de rochas em áreas com dados escassos, um desafio comum na indústria de óleo e gás. Esperamos publicar os primeiros resultados em meados de 2026, com foco em aplicações práticas.",
    date: "2025-10-02",
    category: "Colaboração",
    image: "https://picsum.photos/800/600?random=2"
  },
  {
    title: "Workshop de Petrofísica Digital é um sucesso em Salvador",
    excerpt: "Evento exclusivo reuniu especialistas para discutir as últimas tendências em análise de rochas digitais e machine learning.",
    fullContent: "O workshop contou com a participação de mais de 80 profissionais da indústria e da academia, abordando tópicos como microtomografia de raios-X, simulação de fluxo em escala de poros e aplicação de inteligência artificial na interpretação de dados. O feedback foi extremamente positivo, e já planejamos a próxima edição.",
    date: "2025-09-25",
    category: "Eventos",
    image: "https://picsum.photos/800/600?random=3"
  },
  {
    title: "Avanços na pesquisa de fluxo em meios porosos complexos",
    excerpt: "Pesquisadores do LAFI anunciam um avanço significativo na simulação de fluxo multifásico em rochas carbonáticas.",
    fullContent: "Nossa equipe desenvolveu um novo modelo numérico que permite simular com maior precisão o comportamento de fluidos em reservatórios complexos. Isso é crucial para otimizar a recuperação de óleo e gás em campos desafiadores, contribuindo para a eficiência e sustentabilidade da produção.",
    date: "2025-09-18",
    category: "Pesquisa",
    image: "https://picsum.photos/800/600?random=4"
  },
];

const CategoryPill: React.FC<{ category: string }> = ({ category }) => (
  <span className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border bg-[#ff6d00]/10 text-[#ff6d00] border-[#ff6d00]/20 shadow-[0_0_10px_rgba(255,109,0,0.1)]">
    {category}
  </span>
);

const NewsModal: React.FC<{ item: NewsItem | null; onClose: () => void }> = ({ item, onClose }) => (
  <AnimatePresence>
    {item && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 sm:p-6"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 30, opacity: 0 }} 
          animate={{ scale: 1, y: 0, opacity: 1 }} 
          exit={{ scale: 0.95, y: 30, opacity: 0 }} 
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} 
          onClick={(e) => e.stopPropagation()} 
          // max-h-[90dvh] garante que não vaze no iOS/Android
          className="relative bg-zinc-950 border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[90dvh] overflow-y-auto shadow-[0_0_50px_rgba(255,109,0,0.05)] custom-scrollbar"
        >
          <div className="relative w-full h-52 sm:h-80 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent z-10" />
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
          
          {/* Ajuste de padding no mobile para não espremer o texto */}
          <div className="p-6 sm:p-12 relative z-20 -mt-12 sm:-mt-16">
            <div className="flex items-center justify-start sm:justify-between mb-5 sm:mb-6 flex-wrap gap-3 sm:gap-4">
              <CategoryPill category={item.category} />
              <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm font-medium bg-black px-3 py-1.5 rounded-full border border-white/5">
                <CalendarDays size={16} className="text-[#ff6d00]" />
                {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}
              </div>
            </div>
            {/* Responsividade na tipografia do título do modal */}
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">{item.title}</h3>
            <p className="text-zinc-300 leading-relaxed font-light whitespace-pre-line text-base sm:text-lg">{item.fullContent}</p>
          </div>
          
          <button 
            onClick={onClose} 
            aria-label="Fechar modal"
            // Posição ajustada no mobile para não cortar
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 p-2 sm:p-2.5 rounded-full bg-black/50 backdrop-blur-md sm:bg-black text-white hover:bg-[#ff6d00] hover:text-white transition-all duration-300 border border-white/10 hover:border-[#ff6d00] hover:scale-110"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const News = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: 'transparent' } }, 
    fpsLimit: 45, 
    interactivity: { events: { onHover: { enable: true, mode: 'repulse' }, resize: true }, modes: { repulse: { distance: 100, duration: 0.4 } } }, 
    particles: { color: { value: '#ff6d00' }, links: { color: '#ff6d00', distance: 150, enable: true, opacity: 0.75, width: 1 }, collisions: { enable: true }, move: { direction: 'none' as const, enable: true, outModes: { default: 'bounce' as const }, random: false, speed: 0.3, straight: false }, number: { density: { enable: true, area: 800 }, value: 45 }, opacity: { value: 0.9 }, shape: { type: 'circle' as const }, size: { value: { min: 1, max: 3 } } }, 
    detectRetina: true
  };

  const itemVariants = { 
    hidden: { y: 30, opacity: 0 }, 
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } 
  };

  return (
    <>
      {/* Trocado para min-h-[100dvh] e pt-24 para respiro sob a navbar no mobile */}
      <section id="news" className="relative w-full min-h-[100dvh] flex flex-col justify-center pt-24 pb-12 lg:py-16 text-white overflow-hidden">
        
        <Particles id="tsparticles-news" init={particlesInit} options={particlesOptions} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
        
        <motion.div 
          className="max-w-7xl mx-auto px-6 sm:px-8 w-full relative z-10 grid grid-cols-1 lg:[grid-template-columns:1fr_2fr] gap-4 lg:gap-12 items-center" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }} 
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Coluna esquerda: textos - Alinhado ao centro no mobile e à esquerda no PC */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-sm sm:text-base font-semibold tracking-widest text-zinc-500 uppercase mb-3">Atualizações</h2>
            <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 sm:mb-6">
              Últimas <span className="bg-gradient-to-r from-[#ff6d00] to-orange-400 bg-clip-text text-transparent">Notícias</span>
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed max-w-md mx-auto lg:mx-0">
              Acompanhe as pesquisas, eventos e colaborações mais recentes do laboratório.
            </p>
          </motion.div>

          {/* Coluna direita: CardSwap */}
          <motion.div variants={itemVariants} className="flex justify-center items-center w-full">
            {/* Altura adaptativa: h-[450px] no mobile para não deixar um vácuo, h-[660px] no PC */}
            <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[660px] flex items-center justify-center">
              <CardSwap
                width={470}
                height={570}
                cardDistance={35}
                verticalDistance={45}
                delay={4000}
                pauseOnHover={true}
                easing="elastic"
              >
                {news.map((item, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl rounded-2xl group cursor-pointer transition-all hover:bg-zinc-800 hover:border-[#ff6d00]/50"
                    onClick={() => setSelectedNews(item)}
                  >
                    <div className="h-40 sm:h-44 overflow-hidden relative border-b border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90 z-10" />
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                      />
                      <div className="absolute top-4 left-4 z-20">
                         <span className="px-3 py-1 bg-black border border-white/10 rounded-full text-[#ff6d00] text-xs font-bold tracking-wider uppercase">
                           {item.category}
                         </span>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-5 flex flex-col flex-grow bg-transparent">
                      <div className="flex items-center gap-2 text-zinc-400 text-[11px] sm:text-xs font-medium mb-2 sm:mb-3">
                        <CalendarDays size={14} className="text-zinc-500" />
                        {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#ff6d00] transition-colors duration-300 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </motion.div>

        </motion.div>
      </section>
      
      <NewsModal item={selectedNews} onClose={() => setSelectedNews(null)} />
    </>
  );
};

export default News;