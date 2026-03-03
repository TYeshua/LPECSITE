import { Mail, MapPin, Phone, Linkedin, Code } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-orange-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="./lafi_logo.png" alt="LAFI Logo" className="h-12 w-12 object-contain" />
              <div>
                <h3 className="text-xl font-bold text-orange-500">LAFI</h3>
                <p className="text-xs text-zinc-400">Laboratório de Física Industrial</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Desenvolvendo soluções inovadoras através da integração de petrofísica, estatística avançada e modelagem computacional.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-orange-500  mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-zinc-400 text-sm">
                <MapPin className="flex-shrink-0 text-orange-500 mt-0.5" size={18} />
                <span>Universidade Federal do Rio de Janeiro</span>
              </li>
              <li className="flex items-start space-x-3 text-zinc-400 text-sm">
                <Mail className="flex-shrink-0 text-orange-500 mt-0.5" size={18} />
                <a href="mailto:contato@lafi.ufrj.br" className="hover:text-orange-500 transition-colors duration-200">
                  contato@lafi.ufrj.br
                </a>
              </li>
              <li className="flex items-start space-x-3 text-zinc-400 text-sm">
                <Phone className="flex-shrink-0 text-orange-500 mt-0.5" size={18} />
                <span>+55 (21) 1234-5678</span>
              </li>
            </ul>
          </div>
        </div>

        {/* NOVO: Seção inferior com copyright e crédito ao desenvolvedor */}
        <div className="border-t border-orange-600/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left text-zinc-500 text-sm">
            © {currentYear} LAFI. Todos os direitos reservados.
          </p>
          <a 
  href="https://www.linkedin.com/in/thiagoyeshua/" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="flex items-center gap-2 text-zinc-500 hover:text-orange-400 text-sm transition-colors duration-300"
  aria-label="LinkedIn do Desenvolvedor"
>
  <Code size={18} className="text-orange-500" />
  <span>Thiago Yeshua</span>
</a>
        </div>
      </div>
    </footer>
  );
}
