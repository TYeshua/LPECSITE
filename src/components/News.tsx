// src/components/News.tsx

import React, { useState, useCallback, useRef } from 'react';
import { X, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

import CardSwap, { Card, CardSwapHandle } from './CardSwap';

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
    title: "Guia Prático de Prompts para Professores — Patente de Programa de Computador",
    excerpt: "Registrado como patente de programa de computador, o \"Guia Prático de Prompts para Professores\" é um recurso inovador que transforma a Inteligência Artificial em aliada do trabalho docente — do planejamento à avaliação. Com 15 capítulos essenciais, capacita educadores a dominar IA com método, clareza e propósito pedagógico.",
    fullContent: `A Inteligência Artificial como sua aliada no planejamento, atividades e avaliações.

Registrado como patente de programa de computador, o "Guia Prático de Prompts para Professores" é um recurso inovador que posiciona a Inteligência Artificial como uma verdadeira aliada do educador contemporâneo. Mais do que explorar ferramentas como ChatGPT e Gemini por curiosidade, o guia ensina professores a utilizá-las com método, estrutura e intencionalidade pedagógica — transformando a IA em parte estratégica do cotidiano docente.

Organizado em 15 capítulos cuidadosamente planejados, o guia cobre desde os fundamentos até a aplicação prática avançada:

• Capítulo 1 — IA na Educação: O Essencial: Entenda o papel da IA no trabalho docente e como ela pode ampliar sua capacidade sem substituir sua criatividade.

• Capítulo 2 — ChatGPT e Gemini: Menos curiosidade, mais método. Saiba como usar as principais ferramentas com foco e eficiência real.

• Capítulo 3 — O Segredo dos Prompts: Aprenda a estrutura de prompts eficientes que geram resultados de qualidade de forma consistente.

• Capítulo 4 — Planejamento de Aula (BNCC): Crie planos de aula alinhados à Base Nacional Comum Curricular com agilidade e precisão.

• Capítulo 5 — Ementas e Sequências: Organize o semestre inteiro com ementa, sequência didática e cronograma gerados com apoio da IA.

• Capítulo 6 — Atividades Pedagógicas: Crie atividades diversificadas e de qualidade, adaptadas ao perfil e à faixa etária dos seus alunos.

• Capítulo 7 — Avaliações e Rubricas: Avalie com critério e clareza, utilizando rubricas objetivas e instrumentos avaliativos bem estruturados.

• Capítulo 8 — Feedback e Comunicação: Desenvolva uma comunicação pedagógica eficiente com alunos, responsáveis e equipe escolar.

• Capítulo 9 — BNCC da Computação: Explore o pensamento computacional e a cultura digital integrados ao currículo.

• Capítulo 10 — Metodologias Ativas: Torne suas aulas mais participativas com aprendizagem baseada em projetos, sala invertida e mais.

• Capítulo 11 — Organização e Produtividade: Reutilize seus materiais de forma inteligente e economize horas do seu planejamento semanal.

• Capítulo 12 — Erros Comuns no Uso da IA: Identifique e evite as armadilhas mais frequentes no uso pedagógico da inteligência artificial.

• Capítulo 13 — Boas Práticas: Use a tecnologia de forma consciente, ética e responsável no ambiente educacional.

• Capítulo 14 — Banco de Prompts Rápidos: Tenha em mãos um guia de consulta rápida com prompts prontos para o dia a dia da sala de aula.

• Capítulo 15 — Continue Evoluindo: Descubra os próximos passos para aprofundar seu domínio da IA na educação e manter-se atualizado.

Com linguagem acessível, exemplos práticos e foco no contexto brasileiro, o Guia Prático de Prompts para Professores é a ferramenta que faltava para quem deseja ensinar melhor, planejar com mais eficiência e liderar a transformação digital na educação.`,
    date: "2026-01-01",
    category: "Propriedade Intelectual",
    image: import.meta.env.BASE_URL + "prompts.png",
  },
  {
    title: "SIGMA - Patente de Programa de Computador",
    excerpt: "O SIGMA, registrado em 2026, é um software web para análise geoquímica de bacias sedimentares desenvolvido em Python e TypeScript. A plataforma automatiza a limpeza de dados, a classificação de querogênio e utiliza Machine Learning (Redes Neurais MLP) para modelagem preditiva e validação de consistência. Seu objetivo é tornar o fluxo de análise técnica em engenharia de petróleo mais ágil, robusto e centralizado em uma única interface.",
    fullContent: "Trata-se de uma plataforma web voltada para o fluxo de análise geoquímica de bacias sedimentares, desenvolvida em Python e TypeScript. O software integra três módulos principais: o pré-processamento para padronização e limpeza de dados brutos; a análise automatizada que classifica o querogênio e a maturidade térmica com base em regras clássicas da geoquímica; e a modelagem preditiva, que utiliza Machine Learning (Redes Neurais MLP) para validar a consistência dos dados e gerar predições em tempo real. A ferramenta centraliza processos complexos em uma interface gráfica para tornar a análise geoquímica mais ágil e robusta.",
    date: "2026-02-24",
    category: "Propriedade Intelectual",
    image: import.meta.env.BASE_URL + "sigma.webp",
  },
];

// ─── Category Pill ────────────────────────────────────────────────────────────
const CategoryPill: React.FC<{ category: string }> = ({ category }) => (
  <span className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border bg-[#ff6d00]/10 text-[#ff6d00] border-[#ff6d00]/20 shadow-[0_0_10px_rgba(255,109,0,0.1)]">
    {category}
  </span>
);

// ─── News Modal ───────────────────────────────────────────────────────────────
const NewsModal: React.FC<{
  item: NewsItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
}> = ({ item, onClose, onPrev, onNext, currentIndex, total }) => (
  <AnimatePresence>
    {item && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0.92, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 40, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-zinc-950 border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[90dvh] overflow-y-auto shadow-[0_0_80px_rgba(255,109,0,0.08)] custom-scrollbar"
        >
          {/* Header image */}
          <div className="relative w-full h-52 sm:h-80 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/30 to-transparent z-10" />
            <motion.img
              key={item.image}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            {/* Prev / Next arrows inside the image */}
            {total > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onPrev(); }}
                  aria-label="Notícia anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-[#ff6d00] hover:border-[#ff6d00] transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onNext(); }}
                  aria-label="Próxima notícia"
                  className="absolute right-14 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-[#ff6d00] hover:border-[#ff6d00] transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Body */}
          <div className="p-6 sm:p-10 relative z-20 -mt-10 sm:-mt-14">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <CategoryPill category={item.category} />
              <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm font-medium bg-black/60 px-3 py-1.5 rounded-full border border-white/5">
                <CalendarDays size={14} className="text-[#ff6d00]" />
                {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}
              </div>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-5 sm:mb-7 leading-tight">
              {item.title}
            </h3>

            <p className="text-zinc-300 leading-relaxed font-light whitespace-pre-line text-sm sm:text-base lg:text-lg">
              {item.fullContent}
            </p>

            {/* Dot indicators */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-white/5">
                {Array.from({ length: total }).map((_, i) => (
                  <span
                    key={i}
                    className={`block rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? 'w-6 h-2 bg-[#ff6d00] shadow-[0_0_8px_rgba(255,109,0,0.6)]'
                        : 'w-2 h-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="absolute top-4 right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-[#ff6d00] hover:text-white transition-all duration-300 border border-white/10 hover:border-[#ff6d00] hover:scale-110"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Main News Component ──────────────────────────────────────────────────────
const News = () => {
  // Modal state — independent from CardSwap animation
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  // frontIndex tracks which card is currently on top (fed by CardSwap's onFrontChange)
  const [frontIndex, setFrontIndex] = useState(0);

  // Ref to CardSwap's imperative API
  const swapRef = useRef<CardSwapHandle>(null);

  const total = news.length;

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
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
    detectRetina: true,
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  // Navigation handlers — call GSAP directly, no React state that touches CardSwap
  const handlePrev = () => swapRef.current?.swapPrev();
  const handleNext = () => swapRef.current?.swapNext();
  const handleDot  = (i: number) => swapRef.current?.swapTo(i);

  // Modal navigation
  const handleModalPrev = () => setModalIndex(idx => idx !== null ? (idx - 1 + total) % total : 0);
  const handleModalNext = () => setModalIndex(idx => idx !== null ? (idx + 1) % total : 0);

  return (
    <>
      <section
        id="news"
        className="relative w-full min-h-[100dvh] flex flex-col justify-center pt-24 pb-16 lg:py-16 text-white overflow-hidden"
      >
        {/* Particles */}
        <Particles
          id="tsparticles-news"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        />

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#ff6d00]/5 blur-[120px] pointer-events-none z-0" />

        <motion.div
          className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10 grid grid-cols-1 lg:[grid-template-columns:1fr_2fr] gap-8 lg:gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
        >

          {/* ── Left column: text + navigation ── */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left mb-2 lg:mb-0"
          >
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-widest text-[#ff6d00]/70 uppercase mb-3">
              <span className="w-5 h-px bg-[#ff6d00]/40" />
              Atualizações
              <span className="w-5 h-px bg-[#ff6d00]/40" />
            </span>

            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Últimas{' '}
              <span className="bg-gradient-to-r from-[#ff6d00] to-orange-400 bg-clip-text text-transparent">
                Notícias
              </span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto lg:mx-0 mb-8">
              Acompanhe as pesquisas, eventos e colaborações mais recentes do laboratório.
            </p>

            {/* Navigation controls */}
            <div className="flex flex-col items-center lg:items-start gap-4 w-full">

              {/* Arrows + counter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  aria-label="Notícia anterior"
                  className="group flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-[#ff6d00] hover:border-[#ff6d00] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,109,0,0.4)]"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
                </button>

                <span className="text-xs text-zinc-500 font-mono tabular-nums min-w-[3.5rem] text-center select-none">
                  {String(frontIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>

                <button
                  onClick={handleNext}
                  aria-label="Próxima notícia"
                  className="group flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-[#ff6d00] hover:border-[#ff6d00] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,109,0,0.4)]"
                >
                  <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </div>

              {/* Dot indicators — reflect frontIndex driven by GSAP callback */}
              <div className="flex items-center gap-2">
                {news.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDot(i)}
                    aria-label={`Ir para notícia ${i + 1}`}
                    className={`rounded-full transition-all duration-300 focus:outline-none ${
                      i === frontIndex
                        ? 'w-7 h-2.5 bg-[#ff6d00] shadow-[0_0_8px_rgba(255,109,0,0.6)]'
                        : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* "Ver detalhes" CTA */}
              <button
                onClick={() => setModalIndex(frontIndex)}
                className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff6d00]/10 border border-[#ff6d00]/30 text-[#ff6d00] text-sm font-semibold hover:bg-[#ff6d00] hover:text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,109,0,0.35)] hover:scale-105"
              >
                Ver detalhes
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>

          {/* ── Right column: CardSwap ── */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center w-full"
          >
            <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[660px] flex items-center justify-center">
              <CardSwap
                ref={swapRef}
                width={470}
                height={570}
                cardDistance={35}
                verticalDistance={45}
                delay={4000}
                pauseOnHover={true}
                easing="elastic"
                onFrontChange={setFrontIndex}
              >
                {news.map((item, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden bg-zinc-900/90 border border-white/10 shadow-2xl rounded-2xl group cursor-pointer transition-all duration-300 hover:bg-zinc-800 hover:border-[#ff6d00]/50 hover:shadow-[0_0_40px_rgba(255,109,0,0.12)]"
                    onClick={() => setModalIndex(index)}
                  >
                    {/* Card image */}
                    <div className="h-44 overflow-hidden relative border-b border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90 z-10" />
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <span className="px-2.5 py-1 bg-black/70 backdrop-blur-sm border border-[#ff6d00]/30 rounded-full text-[#ff6d00] text-[10px] font-bold tracking-wider uppercase">
                          {item.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <span className="px-2 py-0.5 bg-black/50 border border-white/10 rounded-full text-zinc-400 text-[10px] font-mono">
                          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-medium mb-3">
                        <CalendarDays size={13} className="text-[#ff6d00]/70" />
                        {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                      </div>

                      <h4 className="text-base font-bold text-white mb-2.5 leading-snug group-hover:text-[#ff6d00] transition-colors duration-300 line-clamp-2">
                        {item.title}
                      </h4>

                      <p className="text-zinc-400 text-xs leading-relaxed font-light line-clamp-4 flex-grow">
                        {item.excerpt}
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[#ff6d00] text-xs font-semibold tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                          Ler mais
                          <ChevronRight size={14} />
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6d00]/60 animate-pulse" />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </motion.div>

        </motion.div>

        {/* Mobile-only bottom navigation strip */}
        <div className="lg:hidden relative z-10 flex items-center justify-center gap-4 mt-6 px-5">
          <button
            onClick={handlePrev}
            aria-label="Notícia anterior"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-[#ff6d00] hover:border-[#ff6d00] transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {news.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDot(i)}
                aria-label={`Notícia ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === frontIndex
                    ? 'w-6 h-2 bg-[#ff6d00] shadow-[0_0_6px_rgba(255,109,0,0.5)]'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Próxima notícia"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-[#ff6d00] hover:border-[#ff6d00] transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>

      </section>

      {/* Modal — completely detached from CardSwap state */}
      <NewsModal
        item={modalIndex !== null ? news[modalIndex] : null}
        onClose={() => setModalIndex(null)}
        onPrev={handleModalPrev}
        onNext={handleModalNext}
        currentIndex={modalIndex ?? 0}
        total={total}
      />
    </>
  );
};

export default News;