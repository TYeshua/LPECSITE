// src/App.tsx

import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import News from './components/News';
import Research from './components/Research';
import Projects from './components/Projects';
import Publications from './components/Publications';
import Team from './components/Team';
import Footer from './components/Footer';
import AtomCursor from './components/AtomCursor';

function App() {
  return (
    // overflow-x-hidden no container principal garante que o site não crie barras 
    // de rolagem horizontais indesejadas fora da nossa zona controlada.
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans cursor-none">
      <AtomCursor />
      <Header />
      
      <main className="relative">
        {/* 1. SCROLL VERTICAL INICIAL */}
        {/* O Hero gerencia a sua própria altura (150vh) e o seu efeito sticky internamente */}
        <Hero />

        {/* 2. SEÇÕES SOBRE E NOTÍCIAS */}
        {/* O fluxo agora segue naturalmente no eixo Y, evitando o travamento de scroll.
            Adicionado 'relative z-20 bg-black' para garantir que as seções se sobreponham 
            ao Hero sem transparência ou interferência de z-index. */}
        <div className="w-full flex flex-col relative z-20">
          <About />
          <News />
        </div>

        {/* 3. RETORNO AO SCROLL VERTICAL NORMAL */}
        {/* Daqui para baixo, o utilizador volta a rolar para baixo naturalmente.
            O fundo bg-zinc-950 garante uma transição suave do preto absoluto do Hero/About/News 
            para o resto do conteúdo. */}
        <div className="">
          <Research />
          <Projects />
          <Publications />
          <Team />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;