// src/components/News.tsx

import React, { useState, useCallback } from 'react';
import { Calendar, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

// NOVO: Importações para o background de partículas
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// --- Tipagem e Dados de Exemplo (Sem alterações) ---
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
        title: "LPEC publica artigo sobre modelagem de reservatórios com IA",
        excerpt: "Nosso novo algoritmo melhora a precisão da caracterização de reservatórios utilizando redes neurais convolucionais.",
        fullContent: "O estudo, publicado na revista Geophysics, detalha uma nova arquitetura de rede neural que consegue identificar fácies sedimentares com 95% de acurácia a partir de dados sísmicos. Esta inovação representa um salto significativo para a exploração de campos complexos, reduzindo incertezas e otimizando o posicionamento de poços.",
        date: "2025-10-15",
        category: "Publicações",
        image: "https://picsum.photos/800/600?random=1",
    },
    {
        title: "Nova colaboração com o Centro de Geociências da Petrobras",
        excerpt: "Firmamos uma parceria estratégica para o desenvolvimento de métodos geostatísticos avançados em ambientes offshore.",
        fullContent: "A colaboração com o CGEO visa unir a expertise em petrofísica do LPEC com a modelagem geoestatística avançada do centro. O projeto foca na criação de modelos preditivos para propriedades de rochas em áreas com dados escassos, um desafio comum na indústria de óleo e gás. Esperamos publicar os primeiros resultados em meados de 2026, com foco em aplicações práticas.",
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
        excerpt: "Pesquisadores do LPEC anunciam um avanço significativo na simulação de fluxo multifásico em rochas carbonáticas naturalmente fraturadas.",
        fullContent: "Nossa equipe desenvolveu um novo modelo numérico que permite simular com maior precisão o comportamento de fluidos em reservatórios complexos. Isso é crucial para otimizar a recuperação de óleo e gás em campos desafiadores, contribuindo para a eficiência e sustentabilidade da produção.",
        date: "2025-09-18",
        category: "Pesquisa",
        image: "https://picsum.photos/800/600?random=4"
    },
];

// ==================================================================
// COMPONENTES AUXILIARES (Sem alterações)
// ==================================================================
const CategoryPill: React.FC<{ category: string }> = ({ category }) => (
  <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-950/50 text-orange-300 border-orange-500/30 transition-all hover:bg-orange-950/80 hover:border-orange-500/60">
    {category}
  </span>
);

const NewsModal: React.FC<{ item: NewsItem | null; onClose: () => void }> = ({ item, onClose }) => (
  <AnimatePresence>
    {item && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} onClick={(e) => e.stopPropagation()} drag="y" dragConstraints={{ top: 0, bottom: 200 }} onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }} className="relative bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-orange-500/10 cursor-default">
          <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded-t-2xl" />
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <CategoryPill category={item.category} />
              <div className="flex items-center text-zinc-400 text-sm">
                <Calendar className="w-4 h-4 mr-1.5 text-orange-500/70" />
                {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-orange-400 mb-4">{item.title}</h3>
            <p className="text-zinc-300 leading-relaxed sm:leading-loose whitespace-pre-line">{item.fullContent}</p>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-orange-500 transition-colors border border-white/10 backdrop-blur-sm"><X size={20} /></button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const NewsCard: React.FC<{ item: NewsItem; onOpen: () => void }> = ({ item, onOpen }) => {
  const formattedDate = new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return (
    <div className="keen-slider__slide h-full flex flex-col">
      <button onClick={onOpen} className="group w-full text-left bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:border-orange-500/50 hover:shadow-orange-500/20 hover:-translate-y-1 h-full flex flex-col">
        <div className="h-48 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <CategoryPill category={item.category} />
            <div className="flex items-center text-zinc-400 text-sm"><Calendar className="w-4 h-4 mr-1.5 text-orange-500/70" />{formattedDate}</div>
          </div>
          <div className="flex-grow border-l-2 border-orange-500/30 group-hover:border-orange-500/80 pl-4 transition-colors duration-300 flex flex-col">
            <h4 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-orange-400 transition-colors flex-grow">{item.title}</h4>
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{item.excerpt}</p>
          </div>
          <div className="mt-6 text-orange-400 group-hover:text-orange-300 transition-colors duration-200 flex items-center space-x-2 font-semibold text-sm">
            <span>Ler mais</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </button>
    </div>
  );
};

// ==================================================================
// COMPONENTE PRINCIPAL (COM NOVO BACKGROUND)
// ==================================================================
const News = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: news.length > 3,
    mode: "snap",
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2, spacing: 20 } },
      "(min-width: 1024px)": { slides: { perView: 3, spacing: 30 } },
      "(min-width: 1536px)": { slides: { perView: 3, spacing: 40 } },
    },
    slides: { perView: 1.2, spacing: 15 },
    slideChanged(slider) { setCurrentSlide(slider.track.details.rel); },
    created() { setLoaded(true); },
  });

  // NOVO: Configuração das partículas
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: 'transparent' } }, fpsLimit: 120, interactivity: { events: { onHover: { enable: true, mode: 'repulse' }, resize: true }, modes: { repulse: { distance: 100, duration: 0.4 } } }, particles: { color: { value: '#ff6d00' }, links: { color: '#ff9b57', distance: 150, enable: true, opacity: 0.2, width: 1 }, collisions: { enable: true }, move: { direction: 'none' as const, enable: true, outModes: { default: 'bounce' as const }, random: false, speed: 0.5, straight: false }, number: { density: { enable: true, area: 800 }, value: 80 }, opacity: { value: 0.3 }, shape: { type: 'circle' as const }, size: { value: { min: 1, max: 5 } } }, detectRetina: true
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } } };

  return (
    <>
      <section id="news" className="py-24 sm:py-32 bg-zinc-950 text-white relative overflow-hidden">
        {/* NOVO: Camadas de Background do Hero */}
        <Particles
          id="tsparticles-news" // ID diferente para evitar conflitos
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
        <div 
          className="absolute inset-0 z-1 bg-black"
        />
        <div className="absolute inset-0 bg-black" />
        
        {/* Conteúdo da Seção de Notícias */}
        <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants}>
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">
              Últimas Notícias
            </h2>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto">Acompanhe as principais novidades, publicações e desenvolvimentos do LPEC.</p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div ref={sliderRef} className="keen-slider">
              {news.map((item, index) => (
                <NewsCard key={index} item={item} onOpen={() => setSelectedNews(item)} />
              ))}
            </div>
          </motion.div>

          {loaded && instanceRef.current && (
            <motion.div className="flex items-center justify-center gap-6 mt-12" variants={itemVariants}>
              <button aria-label="Notícia Anterior" onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }} className="p-3 rounded-full bg-zinc-800/60 text-orange-400 hover:text-white transition-all duration-200 border border-white/10 hover:border-orange-500/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed" disabled={!instanceRef.current.options.loop && currentSlide === 0}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center justify-center gap-3">
                {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => (
                  <button key={idx} aria-label={`Ir para a notícia ${idx + 1}`} onClick={() => { instanceRef.current?.moveToIdx(idx); }} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-5 bg-orange-500' : 'bg-zinc-700 hover:bg-zinc-500'}`}></button>
                ))}
              </div>
              <button aria-label="Próxima Notícia" onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }} className="p-3 rounded-full bg-zinc-800/60 text-orange-400 hover:text-white transition-all duration-200 border border-white/10 hover:border-orange-500/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed" disabled={!instanceRef.current.options.loop && currentSlide === instanceRef.current.track.details.slides.length - 1}>
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>
      <NewsModal item={selectedNews} onClose={() => setSelectedNews(null)} />
    </>
  );
};

export default News;