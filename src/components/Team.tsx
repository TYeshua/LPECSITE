// src/components/Team.tsx

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import { Mail, Linkedin, ArrowLeft, ArrowRight, User, X, Plus, Award } from 'lucide-react';
import "keen-slider/keen-slider.min.css";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Environment, useGLTF, Float, ContactShadows } from '@react-three/drei';

// Importações para o background de partículas
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// --- Tipagem e Dados ---
interface Member {
  name: string;
  role?: string;
  specialization: string;
  education: string;
  image: string;
  bio: string;
  email?: string;
  linkedin?: string;
  modelPath?: string;
}

const team = {
  coordenadores: [
    { name: "Dr. Thiago Rafael S. Moura", role: "Coordenador", specialization: "Física Estatística e Computacional", education: "Doutor em Física Estatística e Computacional", image: import.meta.env.BASE_URL + "TRSM.png", email: "trsmoura@ufpa.br", linkedin: "#", bio: "É graduado, mestre e doutor em Física pela Universidade Federal do Rio Grande do Norte (UFRN). Realizou estágio pós-doutoral em Física Biológica no Departamento de Biofísica da UFRN. Atualmente, é professor de Física na Universidade Federal do Pará (UFPA), no campus de Salinópolis, PA. Desde 2017, lidera o Laboratório de Inovação Interdisciplinar (LabX) e Laboratório de Física Industrial (LAFI) da UFPA e ocupa o cargo de diretor da Faculdade de Física." },
    { name: "Dr. José Leão de Luna", role: "Vice-Coodenador", specialization: "Geologia", education: "Doutor em Geologia", image: import.meta.env.BASE_URL + "JLUNA.jpeg", email: "jose.luna@lafi.com", linkedin: "#", bio: "Possui graduação em Física pela Universidade Federal do Rio de Janeiro (2008), mestrado em GEOLOGIA pelo Instituto de Geociências - UFRJ (2012) e doutorado em Geologia pela Universidade Federal do Rio de Janeiro (2017). Tem experiência na área de Física, com ênfase em física aplicada a geologia, atuando principalmente nos seguintes temas: geofísica, perfilagem geofísica de poços e petrofísica." },
  ],
  pesquisadores: [
    { name: "Daniana de Costa", role: "", specialization: "Doutora em Educação (Educação em Ciências e Matemática)", education: "Filosofia da Linguagem e Modelagem Matemática no Ensino de Ciências", image: import.meta.env.BASE_URL + "daniana.png", email: "mariana@lafi.com", linkedin: "#", bio: "Daniana de Costa é professora efetiva com dedicação exclusiva na UFPA (Campus Salinópolis) e docente permanente do Programa de Pós-Graduação em Docência em Educação em Ciências e Matemáticas (PPGDOC/UFPA). Possui uma sólida trajetória de 16 anos no magistério (Educação Básica e EJA), com passagens pelo ensino superior na UNESP e UEAP. Sua formação é marcadamente interdisciplinar, unindo graduações em Matemática e Pedagogia a um mestrado em Desenvolvimento Regional e doutorado em Educação. Atualmente, integra laboratórios de ponta, como o LabX (Laboratório de Inovação Interdisciplinar) LabIndustrial (Laboratório de Física Industrial) em Salinópolis, e grupos de pesquisa na USP e UFSCar." },
    { name: "Silvério Sirotheau C. Neto", role: "", specialization: "Doutor em Ciência da Computação", education: "Inteligência Computacional Aplicada a Ambientes de Aprendizagem e Ciência de Dados.", image: import.meta.env.BASE_URL + "silverio.png", email: "joao@lafi.com", linkedin: "#", bio: "Silvério Sirotheau é Professor Adjunto da UFPA e atua no programa de pós-graduação PROFNIT, voltado para Propriedade Intelectual e Inovação. Com uma trajetória acadêmica sólida na Ciência da Computação, possui mestrado e doutorado pela própria UFPA e especialização em Gerência de Projetos de Software. Sua carreira é marcada pela aplicação de tecnologias de ponta em dados e inteligência artificial para otimizar processos educacionais e de inovação tecnológica." },
  ],
  colaboradores: [
    { name: "Thiago Yeshua", specialization: "Engenharia de Exploração e Produção de Petróleo", education: "Descoberta de Conhecimento em Bases de Dados de Petrofísica de Bacias Brasileiras", image: import.meta.env.BASE_URL + "yeshuanovo.jpeg", email: "Thiagoyeshua01@gmail.com", linkedin: "https://www.linkedin.com/in/thiagoyeshua", bio: "O projeto consiste na aplicação de Ciência de Dados e Big Data sobre o acervo de dados petrofísicos das bacias sedimentares brasileiras, disponibilizados pelo REATE (ANP/CPRM). O trabalho foca em transformar grandes volumes de dados brutos (estruturados e não estruturados) em ativos de valor estratégico para a indústria de energia. Através do uso de ferramentas como Power BI e técnicas de mineração de dados, o projeto busca otimizar a tomada de decisão e a proposição de regras de negócio para a produção de petróleo em território nacional." },
    { name: "Roberta Souza", specialization: "Engenharia de Exploração e Produção de Petróleo", education: "Hibridização de Dados e Redes Neurais Profundas para a Gestão de Ativos de Petróleo e Gás.", image: import.meta.env.BASE_URL + "roberta.jpeg", email: "bia@lafi.com", linkedin: "#", bio: "O projeto propõe o desenvolvimento de um Digital Twin (Gêmeo Digital) para a otimização da produção de petróleo em campos offshore, com foco especial no cenário complexo do Pré-Sal brasileiro. O objetivo central é superar a alta latência computacional dos simuladores numéricos tradicionais através do uso de Inteligência Artificial. Ao criar uma réplica virtual de alta fidelidade e resposta rápida, o framework permitirá realizar análises de sensibilidade instantâneas, servindo como uma ferramenta crítica de suporte à decisão para maximizar a eficiência produtiva em tempo real." },
    { name: "Antônio Silva", specialization: "Licenciatura em Física", education: "Estudo computacional da histerese térmica e transições de fase em sistemas de spin via Estatística de Kaniadakis", image: import.meta.env.BASE_URL + "ronan.jpeg", email: "bia@lafi.com", linkedin: "#", bio: "A histerese térmica é fundamental no estudo de transições de fase magnéticas, mas em sistemas complexos e não-extensivos, a estatística de Boltzmann-Gibbs mostra-se insuficiente, exigindo abordagens generalizadas como a estatística de Kaniadakis (kappa-estatística). O uso dessa teoria justifica-se porque materiais reais, como nanoestruturas, frequentemente exibem distribuições de energia em lei de potência (power-law), que a deformação kappa captura naturalmente. Sendo assim, este projeto tem o objetivo de analisar computacionalmente a histerese térmica em um modelo de Ising 2D, focando em quantificar a influência do parâmetro kappa na temperatura crítica (T_c) e na área do laço de histerese. Para isso, a metodologia baseia-se em simulações de Monte Carlo via algoritmo de Metropolis adaptado, onde o fator de Boltzmann é substituído pela probabilidade kappa-exponencial exp kappa(x). A partir da simulação de ciclos de aquecimento e resfriamento, serão extraídas grandezas macroscópicas fundamentais, como magnetização, susceptibilidade, energia e cumulante de Binder. Como conclusão e finalidade computacional, o estudo mapeará como a deformação estatística expande ou contrai as zonas de metaestabilidade, fornecendo um modelo preditivo robusto e preciso para descrever materiais magnéticos desordenados." },
    { name: "Douglas Fonseca", specialization: "Licenciatura em Física", education: "Desenvolvimento e aplicação de simulações e jogos digitais para a compreensão de conceitos de mecânica no ensino de Física.", image: import.meta.env.BASE_URL + "douglas.jpeg", email: "bia@lafi.com", linkedin: "#", bio: "Este projeto propõe o desenvolvimento e a aplicação de simulações interativas e jogos digitais para facilitar a compreensão de conceitos abstratos de mecânica, como o movimento retilíneo e as Leis de Newton. Utilizando técnicas de game design e programação computacional, a pesquisa visa transformar equações teóricas em experimentos virtuais concretos e manipuláveis. O objetivo é estruturar sequências didáticas para o Ensino Médio e a graduação, validando, por meio de uma abordagem quali-quantitativa, como a ludicidade e a interatividade auxiliam na superação da aprendizagem mecânica e promovem o protagonismo do aluno na construção do conhecimento científico." },
    { name: "Moysés Nobre", specialization: "Licenciatura em Física", education: "Deslocamento da Temperatura de Bloqueio em Nanopartículas Ferromagnéticas no Âmbito da Estatística de Kaniadakis", image: import.meta.env.BASE_URL + "moyses.jpeg", email: "bia@lafi.com", linkedin: "#", bio: "O projeto dedica-se ao estudo das propriedades micromagnéticas de materiais nanoestruturados e sistemas de matéria ativa, fundamentando-se no arcabouço teórico da Estatística Generalizada de Kaniadakis. A pesquisa foca na determinação da temperatura de bloqueio, parâmetro essencial que define a transição entre os estados ordenado (bloqueado) e desordenado (superparamagnético) em nanopartículas ferromagnéticas." },
  ],
};

const director = team.coordenadores[0];

// --- Componentes Auxiliares 3D ---
const Model: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.8} />;
};

// --- Componentes de Modais ---
const MemberDetailModal: React.FC<{ member: Member; onClose: () => void }> = ({ member, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
      <motion.div className="absolute inset-0 bg-black/90" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        // Ajuste: max-h-[90dvh], p-6 no mobile para não estrangular a leitura e rounded-2xl.
        className="relative z-10 w-full max-w-4xl bg-zinc-950/90 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-[0_0_80px_rgba(255,109,0,0.15)] overflow-hidden flex flex-col max-h-[90dvh] backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff6d00]/80 to-transparent" />
        {/* Ajuste: Botão de fechar não deve colidir no celular */}
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-2.5 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-[#ff6d00] transition-all duration-300 border border-white/5 hover:border-[#ff6d00] z-20">
          <X size={20} strokeWidth={2} />
        </button>
        
        <div className="overflow-y-auto custom-scrollbar pr-2 mt-2 sm:mt-0">
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 sm:gap-10 text-center md:text-left mb-6 sm:mb-8">
            {/* Ajuste: max-w reduzido no mobile (220px) para sobrar tela */}
            <div className="relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px] flex-shrink-0 mx-auto md:mx-0">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ff6d00]/30 to-transparent blur-2xl" />
              {member.modelPath ? (
                <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_-10px_rgba(255,109,0,0.3)] bg-gradient-to-b from-zinc-900/80 to-black group">
                  <Canvas camera={{ position: [0, 0, 3.5], fov: 35 }} className="cursor-grab active:cursor-grabbing">
                    <ambientLight intensity={1.5} />
                    <spotLight position={[5, 5, 5]} angle={0.2} penumbra={1} intensity={2} color="#ff6d00" />
                    <spotLight position={[-5, 5, -5]} angle={0.5} penumbra={1} intensity={1} color="#ffffff" />
                    <Suspense fallback={null}>
                      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
                        <Center><Model url={member.modelPath} /></Center>
                      </Float>
                      <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={10} blur={2} far={4} color="#000000" />
                      <Environment preset="city" />
                    </Suspense>
                    <OrbitControls autoRotate enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
                  </Canvas>
                </div>
              ) : (
                <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_-10px_rgba(255,109,0,0.3)] bg-zinc-900/50 group">
                  <img src={member.image} alt={member.name} className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              )}
            </div>
            <div className="flex-1 mt-0 flex flex-col justify-center">
              {/* Tipografia ajustada text-3xl no mobile */}
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight tracking-tight">{member.name}</h3>
              {member.specialization && <p className="text-[#ff6d00] font-bold tracking-widest uppercase text-xs mb-4 sm:mb-6">{member.specialization}</p>}
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-4 sm:mb-6">
                <span className="flex items-center gap-2 text-[11px] sm:text-xs font-medium bg-zinc-900 text-zinc-300 px-3 py-1.5 rounded-full border border-white/5 text-left">
                  {member.education}
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                {member.email && member.email !== '#' && (
                  <a 
                    href={`mailto:${member.email}`} 
                    className="p-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-[#ff6d00] border border-white/5 hover:border-[#ff6d00] transition-all duration-300"
                    title="Enviar E-mail"
                  >
                    <Mail size={20} />
                  </a>
                )}
                {member.linkedin && member.linkedin !== '#' && (
                  <a 
                    href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-[#ff6d00] border border-white/5 hover:border-[#ff6d00] transition-all duration-300"
                    title="Ver LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <h4 className="text-white font-bold mb-3 text-lg">Sobre</h4>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light">{member.bio}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Modais simplificados - Mantenha sua implementação real do ContactModal no seu projeto
const ContactModal: React.FC<{ member: Member; onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
      <motion.div className="absolute inset-0 bg-black/80" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        className="relative z-10 w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(255,109,0,0.2)]"
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#ff6d00]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#ff6d00]/20">
            <User size={32} className="text-[#ff6d00]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Junte-se ao LAFI</h3>
          <p className="text-zinc-400 text-sm mb-8">
            Interessado em colaborar ou fazer parte da nossa equipe? Entre em contato conosco.
          </p>
          
          <div className="space-y-4">
            <a 
              href="mailto:trsmoura@ufpa.br" 
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#ff6d00] text-white font-bold rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-500/20"
            >
              <Mail size={20} />
              Enviar E-mail para Coordenação
            </a>
            <p className="text-zinc-500 text-xs">
              Ou visite-nos no Laboratório de Física Industrial da UFPA.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Cards Hierarquizados ---

// Card Premium para Coordenadores
const CoordinatorCard: React.FC<{ member: Member; onClick: () => void }> = ({ member, onClick }) => (
  <motion.div
    onClick={onClick}
    className="group relative bg-zinc-950/80 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left transition-all duration-500 w-full hover:bg-zinc-900/90 hover:border-[#ff6d00]/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(255,109,0,0.2)] cursor-pointer"
  >
    <div className="absolute top-4 right-4 sm:top-5 sm:right-5 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
      <Award size={20} className="sm:w-6 sm:h-6 text-[#ff6d00]" strokeWidth={1.5} />
    </div>

    <div className="relative mb-6 sm:mb-0 sm:mr-8 flex-shrink-0">
      <div className="absolute inset-0 rounded-full bg-[#ff6d00]/20 group-hover:bg-[#ff6d00]/40 blur-xl transition-all duration-500" />
      <img src={member.image} alt={member.name} className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-white/20 group-hover:border-[#ff6d00] transition-colors duration-500 shadow-xl" />
    </div>
    
    <div className="flex flex-col justify-center h-full pt-0 sm:pt-2 w-full">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#ff6d00] transition-colors duration-300">{member.name}</h3>
      {member.specialization && <p className="text-[#ff6d00] text-xs sm:text-sm font-bold uppercase tracking-widest mb-3 sm:mb-4">{member.specialization}</p>}
      <p className="text-zinc-400 text-xs sm:text-sm font-light line-clamp-3 mb-5 sm:mb-6 leading-relaxed px-2 sm:px-0">{member.bio}</p>
      
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-auto">
        <div className="flex items-center gap-2 text-zinc-300 text-[11px] sm:text-xs bg-black/40 px-4 py-2 sm:py-2.5 rounded-xl border border-white/5">
          <span className="truncate max-w-[150px] sm:max-w-none">{member.education}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {member.email && member.email !== '#' && (
            <a 
              href={`mailto:${member.email}`} 
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-[#ff6d00] border border-white/5 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail size={16} />
            </a>
          )}
          {member.linkedin && member.linkedin !== '#' && (
            <a 
              href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-[#ff6d00] border border-white/5 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// Card Padrão para Pesquisadores e Colaboradores
const ResearcherCard: React.FC<{ member: Member; onClick: () => void }> = ({ member, onClick }) => (
  <motion.div
    onClick={onClick}
    className="group relative bg-zinc-950/60 backdrop-blur-sm border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center h-full transition-all duration-500 w-full hover:bg-zinc-900/80 hover:border-[#ff6d00]/40 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(255,109,0,0.15)] cursor-pointer"
  >
    <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-[#ff6d00]/10 group-hover:border-[#ff6d00]/30 transition-all duration-300">
      <Plus size={16} className="text-[#ff6d00]" strokeWidth={2} />
    </div>
    
    <div className="relative z-10 flex flex-col items-center h-full w-full">
      <div className="relative mb-5 sm:mb-6">
        <div className="absolute inset-0 rounded-full bg-[#ff6d00]/0 group-hover:bg-[#ff6d00]/20 blur-md transition-all duration-500" />
        <img src={member.image} alt={member.name} className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-white/10 group-hover:border-[#ff6d00]/80 transition-colors duration-500" />
      </div>
      
      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#ff6d00] transition-colors duration-300">{member.name}</h3>
      {member.specialization && <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">{member.specialization}</p>}
      
      <div className="flex items-center gap-3 mt-auto w-full">
        <div className="flex-1 text-zinc-400 text-[10px] sm:text-xs bg-black/40 px-3 sm:px-4 py-2 rounded-xl border border-white/5 truncate">
          {member.education}
        </div>
        <div className="flex gap-2">
          {member.email && member.email !== '#' && (
            <a 
              href={`mailto:${member.email}`} 
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-[#ff6d00] border border-white/5 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail size={14} />
            </a>
          )}
          {member.linkedin && member.linkedin !== '#' && (
            <a 
              href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-[#ff6d00] border border-white/5 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Layouts de Seção ---

const CoordinatorsGrid: React.FC<{ members: Member[]; onMemberClick: (member: Member) => void; }> = ({ members, onMemberClick }) => (
  <motion.div className="mb-16 sm:mb-24 relative" variants={itemVariants}>
    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 sm:mb-10 text-center sm:text-left relative inline-block">
      Coordenação
      <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 w-1/2 h-1 bg-gradient-to-r from-[#ff6d00] to-transparent rounded-full" />
    </h3>
    <div className={`grid gap-4 sm:gap-6 ${members.length === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 lg:grid-cols-2'}`}>
      {members.map((member) => (
        <CoordinatorCard key={member.name} member={member} onClick={() => onMemberClick(member)} />
      ))}
    </div>
  </motion.div>
);

const TeamCarousel: React.FC<{ title: string; members: Member[]; onMemberClick: (member: Member) => void; }> = ({ title, members, onMemberClick }) => {
  const perViewDesktop = 3;
  const needsCarousel = members.length > perViewDesktop;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    centered: false, 
    loop: false,     
    slides: { perView: 1.1, spacing: 16 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2, spacing: 24 } },
      '(min-width: 1024px)': { slides: { perView: members.length < perViewDesktop ? members.length : perViewDesktop, spacing: 32 } },
    },
  });

  return (
    <motion.div className="mb-16 sm:mb-20 last:mb-0 relative" variants={itemVariants}>
      <div className="flex flex-row justify-between items-end mb-6 sm:mb-8 gap-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white relative inline-block">
          {title}
        </h3>
        
        {needsCarousel && (
          <div className="flex gap-2 sm:gap-3">
            <button onClick={() => instanceRef.current?.prev()} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#ff6d00] hover:bg-[#ff6d00]/10 hover:border-[#ff6d00]/30 transition-all duration-300" aria-label="Anterior"><ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]"/></button>
            <button onClick={() => instanceRef.current?.next()} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-[#ff6d00] hover:bg-[#ff6d00]/10 hover:border-[#ff6d00]/30 transition-all duration-300" aria-label="Próximo"><ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]"/></button>
          </div>
        )}
      </div>
      
      {!needsCarousel ? (
        <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 ${members.length < perViewDesktop ? 'justify-start' : ''}`}>
           {members.map((member) => (
            <div key={member.name} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-21px)]">
              <ResearcherCard member={member} onClick={() => onMemberClick(member)} />
            </div>
          ))}
        </div>
      ) : (
        <div ref={sliderRef} className="keen-slider cursor-grab active:cursor-grabbing -mx-2 px-2 py-2 sm:py-4">
          {members.map((member) => (
            <div key={member.name} className="keen-slider__slide">
              <ResearcherCard member={member} onClick={() => onMemberClick(member)} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
const itemVariants = { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };

// --- Componente Principal ---
const Team = () => {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = useMemo(() => ({
    background: { color: { value: 'transparent' } }, 
    fpsLimit: 60,  
    interactivity: { 
        events: { onHover: { enable: true, mode: 'repulse' }, resize: true }, 
        modes: { repulse: { distance: 120, duration: 0.4 } } 
    }, 
    particles: { 
        color: { value: '#ff6d00' }, 
        links: { color: '#ff6d00', distance: 150, enable: true, opacity: 0.3, width: 1 }, 
        collisions: { enable: true }, 
        move: { direction: 'none' as const, enable: true, outModes: { default: 'bounce' as const }, random: false, speed: 0.4, straight: false }, 
        number: { density: { enable: true, area: 800 }, value: 30 }, 
        opacity: { value: 0.6 }, 
        shape: { type: 'circle' as const }, 
        size: { value: { min: 1, max: 2.5 } } 
    }, 
    detectRetina: true
  }), []);

  return (
    <>
      <section id="team" className="py-24 sm:py-32 text-white relative overflow-hidden bg-black">
        
        <Particles
          id="tsparticles-team"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Ajuste: Border Radius e Paddings fluidos para o mobile */}
          <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-[#ff6d00]/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div 
              className="text-center mb-16 sm:mb-24 relative z-20"
              variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            >
              <motion.h2 className="text-sm font-semibold tracking-widest text-[#ff6d00] uppercase mb-4" variants={itemVariants}>
                Quem Somos
              </motion.h2>
              <motion.h3 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6" variants={itemVariants}>
                Nossa <span className="bg-gradient-to-r from-[#ff6d00] to-orange-400 bg-clip-text text-transparent">Equipe</span>
              </motion.h3>
              <motion.p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed px-2 sm:px-0" variants={itemVariants}>
                Um time multidisciplinar dedicado à pesquisa e inovação em Petrofísica Computacional e Geociências.
              </motion.p>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} className="relative z-20">
              
              <CoordinatorsGrid members={team.coordenadores} onMemberClick={setSelectedMember} />

              {team.pesquisadores.length > 0 && (
                <TeamCarousel title="Colaboradores" members={team.pesquisadores} onMemberClick={setSelectedMember} />
              )}
              {team.colaboradores.length > 0 && (
                <TeamCarousel title="Bolsistas e Pesquisadores" members={team.colaboradores} onMemberClick={setSelectedMember} />
              )}

              <motion.div 
                // Ajuste: Padding reduzido e layout do botão fluido no mobile
                className="relative overflow-hidden bg-zinc-950/80 border border-white/10 p-8 sm:p-14 rounded-[2rem] sm:rounded-[2.5rem] text-center mt-24 sm:mt-32 shadow-2xl" 
                variants={itemVariants}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff6d00]/10 to-transparent pointer-events-none" />
                
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 sm:mb-4 relative z-10">Junte-se a Nós!</h3>
                <p className="text-zinc-400 text-sm sm:text-lg font-light mb-8 sm:mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
                  Estamos sempre abertos a novas colaborações e talentos que queiram contribuir com a pesquisa e o avanço tecnológico na Indústria e no mundo.
                </p>
                <motion.button 
                  type="button"
                  onClick={() => window.location.href = 'mailto:trsmoura@ufpa.br'}
                  className="relative z-20 group inline-flex w-full sm:w-auto items-center justify-center space-x-3 px-6 sm:px-8 py-4 bg-[#ff6d00] text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(255,109,0,0.3)] hover:shadow-[0_0_40px_rgba(255,109,0,0.5)] hover:bg-orange-500 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                >
                  <Mail size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base">Entre em Contato</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isContactModalOpen && <ContactModal member={director} onClose={() => setContactModalOpen(false)} />}
        {selectedMember && <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Team;