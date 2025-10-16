// src/components/Team.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useSpring } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import { Mail, Linkedin, GraduationCap, ArrowLeft, ArrowRight, User, X, Plus } from 'lucide-react';
import "keen-slider/keen-slider.min.css";

// --- Tipagem e Dados (com campo 'bio') ---
interface Member {
  name: string;
  role: string;
  specialization: string;
  education: string;
  image: string;
  bio: string; // NOVO: Descrição do trabalho do membro
  email?: string;
  linkedin?: string;
}

const team = {
  coordenadores: [
    { name: "Dr. Ricardo Oliveira", role: "Coordenador Geral", specialization: "Geofísica Computacional & IA", education: "PhD em Geofísica - Stanford University", image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=400", email: "ricardo.o@lpec.com", linkedin: "#", bio: "Lidera as iniciativas de pesquisa do laboratório, com foco na aplicação de inteligência artificial para resolver problemas complexos de caracterização de reservatórios." },
    { name: "Dra. Juliana Costa", role: "Coordenadora de Pesquisa", specialization: "Petrofísica Digital & Simulação de Fluxo", education: "PhD em Engenharia de Petróleo - UFPA", image: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400", email: "juliana.c@lpec.com", linkedin: "#", bio: "Supervisiona os projetos de petrofísica digital e modelagem em escala de poros, utilizando microtomografia para entender a física das rochas." },
  ],
  pesquisadores: [
    { name: "Mariana Lima", role: "Pesquisadora", specialization: "Machine Learning em Petrofísica", education: "Doutoranda em Geociências", image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400", email: "mariana@lpec.com", linkedin: "#", bio: "Desenvolve algoritmos de machine learning para prever propriedades de rochas a partir de perfis de poço e dados sísmicos, otimizando a análise de reservatórios." },
    { name: "João Pereira", role: "Pesquisador", specialization: "Simulação de Fluxo Multifásico", education: "Mestrando em Engenharia de Reservatórios", image: "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&w=400", email: "joao@lpec.com", linkedin: "#", bio: "Trabalha na implementação de modelos numéricos para simular o fluxo de óleo, gás e água em meios porosos complexos, incluindo rochas fraturadas." },
  ],
  colaboradores: [
    { name: "Beatriz Ribeiro", role: "Colaboradora", specialization: "Visualização Científica", education: "Mestranda em Design Computacional", image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400", email: "bia@lpec.com", linkedin: "#", bio: "Cria interfaces e visualizações de dados interativas para os softwares desenvolvidos no LPEC, facilitando a interpretação de resultados complexos." },
  ],
};

const director = team.coordenadores[0];

const teamStats = [
  { label: "Pesquisadores", value: 25 }, { label: "Publicações", value: 80 }, { label: "Projetos Ativos", value: 15 }, { label: "Colaboradores", value: 40 },
];

// --- Componentes Auxiliares ---

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 40, stiffness: 100 });
  useEffect(() => { if (isInView) spring.set(value); }, [spring, isInView, value]);
  useEffect(() => { if (ref.current) spring.on("change", (latest) => { ref.current!.textContent = Math.round(latest).toLocaleString('pt-BR'); }); }, [spring]);
  return <span ref={ref}>0</span>;
};

// NOVO: Modal para detalhes do membro
const MemberDetailModal: React.FC<{ member: Member; onClose: () => void }> = ({ member, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
    <motion.div
      className="relative z-10 w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-orange-500/10"
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      drag="y" dragConstraints={{ top: 0, bottom: 200 }} onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/60 text-white hover:bg-orange-500 transition-colors border border-white/10"><X size={20} /></button>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover flex-shrink-0 border-2 border-orange-500/50" />
        <div>
          <h3 className="text-2xl font-bold text-white">{member.name}</h3>
          <p className="text-orange-400 font-medium mb-2">{member.role}</p>
          <p className="text-zinc-400 text-sm">{member.bio}</p>
          <div className="flex items-center justify-center sm:justify-start space-x-4 mt-4">
            {member.email && <a href={`mailto:${member.email}`} className="text-zinc-400 hover:text-white transition-colors"><Mail size={22} /></a>}
            {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors"><Linkedin size={22} /></a>}
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

const ContactModal: React.FC<{ member: Member; onClose: () => void }> = ({ member, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
    <motion.div
      className="relative z-10 w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-orange-500/10 text-center"
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      drag="y" dragConstraints={{ top: 0, bottom: 200 }} onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/60 text-white hover:bg-orange-500 transition-colors border border-white/10"><X size={20} /></button>
      <h3 className="text-2xl font-bold text-white mb-6">Entre em Contato</h3>
      <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover mb-4 mx-auto border-2 border-orange-500/50" />
      <p className="text-xl font-bold text-white">{member.name}</p>
      <p className="text-orange-400 text-sm font-medium mb-4">{member.role}</p>
      <p className="text-zinc-400 text-sm mb-6">Para oportunidades, colaborações ou mais informações, entre em contato através dos links abaixo.</p>
      <div className="flex items-center space-x-6 justify-center">
        {member.email && <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-zinc-300 hover:text-orange-400 transition-colors"><Mail size={24} /> Email</a>}
        {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-300 hover:text-orange-400 transition-colors"><Linkedin size={24} /> LinkedIn</a>}
      </div>
    </motion.div>
  </div>
);

// ALTERADO: Card agora é um botão
const ResearcherCard: React.FC<{ member: Member; onClick: () => void }> = ({ member, onClick }) => (
  <motion.button
    onClick={onClick}
    className="group relative bg-zinc-900/70 border border-orange-600/20 rounded-2xl p-6 flex flex-col items-center text-center h-full backdrop-blur-sm transition-colors duration-300 w-full"
    variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    whileHover={{ y: -5 }}
  >
    <div className="absolute top-4 right-4 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <Plus size={16} className="text-orange-400" />
    </div>
    <div className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(400px at 50% 50%, rgba(249, 115, 22, 0.15), transparent 80%)' }} />
    <div className="relative z-10 flex flex-col items-center h-full w-full">
      <img src={member.image} alt={member.name} className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-zinc-700 group-hover:border-orange-500/80 transition-colors duration-300" />
      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
      <p className="text-orange-400 text-sm font-medium mb-2">{member.role}</p>
      <div className="flex items-start gap-2 text-zinc-500 text-xs mt-auto flex-grow">
        <GraduationCap className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>{member.education}</span>
      </div>
    </div>
  </motion.button>
);

// ALTERADO: Carrossel agora aceita um `onMemberClick`
const TeamCarousel: React.FC<{ title: string; members: Member[]; onMemberClick: (member: Member) => void; }> = ({ title, members, onMemberClick }) => {
  const perViewDesktop = members.length < 3 ? members.length : 3;
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    centered: true,
    loop: members.length > perViewDesktop,
    slides: { perView: 1.2, spacing: 16 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2, spacing: 24 } },
      '(min-width: 1024px)': { slides: { perView: perViewDesktop, spacing: 32 } },
    },
  });

  return (
    <motion.div className="mb-16 last:mb-0" variants={itemVariants}>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">{title}</h3>
        <div className="flex gap-3">
          <button onClick={() => instanceRef.current?.prev()} className="p-3 rounded-full bg-zinc-800/60 text-orange-400 hover:text-white transition-all duration-200 border border-white/10 hover:border-orange-500/50" aria-label="Anterior"><ArrowLeft size={18}/></button>
          <button onClick={() => instanceRef.current?.next()} className="p-3 rounded-full bg-zinc-800/60 text-orange-400 hover:text-white transition-all duration-200 border border-white/10 hover:border-orange-500/50" aria-label="Próximo"><ArrowRight size={18}/></button>
        </div>
      </div>
      <div ref={sliderRef} className="keen-slider">
        {members.map((member) => (
          <div key={member.name} className="keen-slider__slide">
            <ResearcherCard member={member} onClick={() => onMemberClick(member)} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } } };

// --- Componente Principal ---
const Team = () => {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <>
      <section id="team" className="py-24 sm:py-32 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black" aria-hidden="true" />
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">Nossa Equipe</h2>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto">Um time multidisciplinar dedicado à inovação em Petrofísica Computacional.</p>
          </motion.div>

          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20" variants={itemVariants}>
            {teamStats.map((stat) => (
              <div key={stat.label} className="bg-zinc-900/70 p-6 rounded-2xl text-center backdrop-blur-sm border border-orange-600/20">
                <div className="text-5xl font-bold text-orange-400 mb-2 leading-none"><AnimatedNumber value={stat.value} />+</div>
                <div className="text-lg text-zinc-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="space-y-20">
            <TeamCarousel title="Coordenadores" members={team.coordenadores} onMemberClick={setSelectedMember} />
            <TeamCarousel title="Pesquisadores" members={team.pesquisadores} onMemberClick={setSelectedMember} />
            <TeamCarousel title="Colaboradores" members={team.colaboradores} onMemberClick={setSelectedMember} />
          </div>

          <motion.div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 to-zinc-900/50 border border-white/10 p-12 rounded-2xl text-center mt-20 backdrop-blur-sm" variants={itemVariants}>
            <h3 className="text-3xl font-bold text-white mb-4">Junte-se à Nossa Missão Científica</h3>
            <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">Estamos sempre abertos a novas colaborações e talentos que queiram contribuir com a pesquisa e a inovação.</p>
            <motion.button 
              onClick={() => setContactModalOpen(true)}
              className="group inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <User size={20} /><span>Oportunidades</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      <AnimatePresence>
        {isContactModalOpen && <ContactModal member={director} onClose={() => setContactModalOpen(false)} />}
        {selectedMember && <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Team;