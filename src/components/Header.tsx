// src/components/Header.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { label: 'Início', id: 'home' },
    { label: 'Sobre', id: 'about' },
    { label: 'Notícias', id: 'news' },
    { label: 'Pesquisas', id: 'research' },
    { label: 'Projetos', id: 'projects' },
    { label: 'Publicações', id: 'publications' },
    { label: 'Equipe', id: 'team' },
  ];

  // Efeito de fundo ao rolar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efeito para detectar a seção ativa
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' } // Ativa quando a seção está no meio da tela
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [navItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 transition-all duration-500">
          
          {/* LOGO */}
          <button 
            onClick={() => scrollToSection('home')}
            className="flex items-center space-x-3 sm:space-x-4 group focus:outline-none"
          >
            <div className="relative flex items-center justify-center">
              {/* Glow sutil ao passar o mouse */}
              <div className="absolute inset-0 bg-[#ff6d00]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={import.meta.env.BASE_URL + "lafi_logo.png"} 
                alt="LAFI Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain relative z-10 transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-[#ff6d00] to-orange-400 bg-clip-text text-transparent tracking-tight">
                LabIndustrial
              </h1>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-medium tracking-wide hidden sm:block group-hover:text-zinc-400 transition-colors duration-300">
                Laboratório de Física Industrial
              </p>
            </div>
          </button>

          {/* NAVEGAÇÃO DESKTOP COM "MAGIC UNDERLINE" */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-300 rounded-lg focus:outline-none ${
                  activeSection === item.id ? 'text-white' : 'text-zinc-400 hover:text-[#ff6d00]'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff6d00] to-transparent"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* BOTÃO MOBILE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-[#ff6d00] hover:bg-white/5 transition-all focus:outline-none z-20"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <motion.div animate={{ rotate: isMobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isMobileMenuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* MENU MOBILE ANIMADO */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-zinc-950/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden shadow-2xl"
          >
            <nav className="px-4 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05, ease: 'easeOut' }}
                  >
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-5 py-4 text-base font-bold tracking-wide rounded-xl transition-all duration-300 ${
                        activeSection === item.id 
                          ? 'bg-[#ff6d00]/10 text-[#ff6d00] border border-[#ff6d00]/20' 
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      {item.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}