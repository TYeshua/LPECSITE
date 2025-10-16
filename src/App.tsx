import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import News from './components/News';
import Research from './components/Research';
import Projects from './components/Projects';
import Publications from './components/Publications';
import Team from './components/Team';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main>
        <Hero />
        <About />
        <News />
        <Research />
        <Projects />
        <Publications />
        <Team />
      </main>
      <Footer />
    </div>
  );
}

export default App;
