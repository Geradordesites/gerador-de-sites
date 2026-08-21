'use client'

import { useRouter } from 'next/navigation'
import { Sparkles, Layout, Image as ImageIcon, Zap, ArrowRight, Code, ChevronDown } from 'lucide-react'

// ==========================================
// CÓDIGOS DOS SITES DE EXEMPLO (HTML BRUTO)
// ==========================================
const SITE_KRONOS = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KRONOS Engenharia & Construção | Obras de Alto Padrão</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Montserrat', 'sans-serif'], }, colors: { brand: { dark: '#0B0F17', asphalt: '#121824', card: '#1A2332', orange: '#FF5500', orangeHover: '#E04B00', gold: '#F59E0B', silver: '#94A3B8', } } } } }
    </script>
    <style>.glass-panel { background: rgba(26, 35, 50, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); } .glass-nav { background: rgba(11, 15, 23, 0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }</style>
</head>
<body class="bg-brand-dark text-slate-100 font-sans antialiased">
    <nav class="fixed top-0 left-0 w-full z-50 glass-nav">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-brand-orange text-white flex items-center justify-center font-heading font-black text-xl rounded">K</div>
                <span class="font-heading font-extrabold text-xl text-white">KRONOS</span>
            </div>
            <div class="hidden md:flex gap-8 text-sm text-slate-300">
                <span>Sobre Nós</span><span>Serviços</span><span>Portfólio</span>
            </div>
            <span class="hidden sm:inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded font-heading font-bold text-xs uppercase"><i class="fas fa-paper-plane"></i> Orçamento</span>
        </div>
    </nav>
    <section class="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1732740674554-11b7772d8c21?auto=format&fit=crop&w=1080&q=80" class="w-full h-full object-cover opacity-30" />
            <div class="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent"></div>
        </div>
        <div class="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div class="max-w-3xl">
                <h1 class="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white uppercase mb-6">Construindo o Futuro com <span class="text-brand-orange">Solidez Monumental</span></h1>
                <p class="text-slate-300 text-lg mb-8">Soluções completas para edifícios corporativos, complexos industriais e residências de alto padrão com precisão cirúrgica e rigor técnico.</p>
                <span class="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 rounded font-heading font-bold text-sm uppercase">Iniciar Projeto <i class="fas fa-arrow-right"></i></span>
            </div>
        </div>
    </section>
    <section class="py-24 bg-brand-asphalt text-center px-6 border-t border-slate-800">
        <h2 class="font-heading font-black text-3xl text-white mb-6">Obras Emblemáticas Finalizadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-12 text-left">
            <div class="bg-brand-card rounded-xl p-6 border border-slate-800"><h3 class="font-heading text-xl text-white mb-2">Torre Horizon Business</h3><p class="text-slate-400 text-sm">42 pavimentos corporativos em estrutura mista.</p></div>
            <div class="bg-brand-card rounded-xl p-6 border border-slate-800"><h3 class="font-heading text-xl text-white mb-2">Residência Alphaville</h3><p class="text-slate-400 text-sm">Mansão minimalista com balanços audaciosos.</p></div>
            <div class="bg-brand-card rounded-xl p-6 border border-slate-800"><h3 class="font-heading text-xl text-white mb-2">Complexo Logístico</h3><p class="text-slate-400 text-sm">Centro de distribuição de classe A.</p></div>
        </div>
    </section>
    <footer class="py-12 bg-brand-dark text-center text-slate-400 text-sm border-t border-slate-800">© 2026 KRONOS Engenharia & Construção.</footer>
</body>
</html>`;

const SITE_EBOOK = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código da Prosperidade</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>tailwind.config = { theme: { extend: { colors: { em: { 950: '#022c22', 900: '#064e3b', 800: '#065f46', 500: '#10b981', 100: '#dcfce7' } } } } }</script>
</head>
<body class="bg-em-100 text-slate-800 font-sans">
    <nav class="w-full bg-em-950 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <div class="font-black text-xl"><i class="fas fa-book-open text-em-500 mr-2"></i>CÓDIGO <span class="text-em-500">PROSPERIDADE</span></div>
        <span class="bg-orange-500 text-white font-bold px-5 py-2 rounded-full text-sm">QUERO O E-BOOK</span>
    </nav>
    <section class="bg-gradient-to-b from-em-950 to-em-800 text-white py-20 px-6 text-center">
        <div class="max-w-4xl mx-auto">
            <span class="bg-em-800 border border-em-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block text-amber-400">Método Comprovado</span>
            <h1 class="text-4xl md:text-5xl font-black mb-6">Aprenda o Passo a Passo para Organizar suas Finanças e Multiplicar seu Dinheiro</h1>
            <p class="text-lg text-em-100 mb-8">Descubra o mapa definitivo criado para quem deseja sair das dívidas, construir uma reserva sólida e investir com inteligência.</p>
            <span class="bg-orange-500 text-white font-black px-8 py-4 rounded-xl text-lg inline-block shadow-xl">QUERO ACESSAR O E-BOOK AGORA</span>
        </div>
    </section>
    <section class="py-20 bg-white text-center px-6">
        <h2 class="text-3xl font-black text-em-950 mb-12">Um Guia Prático, Direto ao Ponto</h2>
        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div class="p-8 bg-em-50 rounded-2xl border border-em-100"><h3 class="font-bold text-lg mb-2">Blindagem Financeira</h3><p class="text-slate-600 text-sm">Como estancar vazamentos de dinheiro.</p></div>
            <div class="p-8 bg-em-50 rounded-2xl border border-em-100"><h3 class="font-bold text-lg mb-2">Psicologia da Riqueza</h3><p class="text-slate-600 text-sm">Elimine crenças limitantes sobre dinheiro.</p></div>
            <div class="p-8 bg-em-50 rounded-2xl border border-em-100"><h3 class="font-bold text-lg mb-2">Renda Passiva</h3><p class="text-slate-600 text-sm">Faça os juros compostos trabalharem por você.</p></div>
        </div>
    </section>
    <section class="py-16 bg-em-950 text-white text-center px-6">
        <h2 class="text-3xl font-black mb-4">Oferta Especial por Tempo Limitado</h2>
        <div class="text-5xl font-black text-amber-400 my-6">12x de R$ 9,74</div>
        <span class="bg-orange-500 text-white font-black px-10 py-5 rounded-xl text-xl inline-block">COMPRAR AGORA</span>
    </section>
</body>
</html>`;

const SITE_TRG = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instituto TRG</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet">
    <script>tailwind.config = { theme: { extend: { fontFamily: { serif: ['Playfair Display', 'serif'], sans: ['Plus Jakarta Sans', 'sans'] }, colors: { navy: { 950: '#040B14', 900: '#0B1A30', 800: '#132847' }, gold: { 400: '#F3C669', 500: '#D4A338' } } } } }</script>
</head>
<body class="bg-white text-navy-900 font-sans">
    <nav class="w-full bg-navy-900 text-white py-4 px-6 flex justify-between items-center">
        <div class="font-serif font-bold text-xl flex items-center gap-2"><div class="w-8 h-8 bg-gold-500 text-navy-900 flex items-center justify-center rounded-full">T</div>Instituto TRG</div>
        <span class="bg-gold-500 text-navy-900 font-bold px-6 py-2 rounded-full text-sm">Agendar Sessão</span>
    </nav>
    <section class="bg-navy-900 text-white py-24 px-6 text-center">
        <div class="max-w-4xl mx-auto">
            <span class="text-gold-400 font-bold uppercase tracking-widest text-xs border border-gold-500/30 px-4 py-1 rounded-full mb-6 inline-block">Reprocessamento Generativo</span>
            <h1 class="text-4xl md:text-5xl font-serif font-bold mb-6">Você continuará repetindo os mesmos padrões de dor ou fará a escolha de se libertar agora?</h1>
            <p class="text-lg text-slate-300 mb-8">Desligue a dor associada às memórias traumáticas e retome o controle definitivo da sua vida em poucas sessões.</p>
            <span class="bg-gold-500 text-navy-950 font-bold px-8 py-4 rounded-xl text-lg inline-block">Quero me libertar agora</span>
        </div>
    </section>
    <section class="py-20 px-6 max-w-6xl mx-auto">
        <div class="text-center mb-12"><h2 class="font-serif text-3xl font-bold">O que a TRG resolve?</h2></div>
        <div class="grid md:grid-cols-3 gap-6">
            <div class="p-6 bg-navy-50 rounded-xl border border-navy-100"><i class="fas fa-heart-crack text-gold-500 text-3xl mb-4"></i><h3 class="font-serif font-bold text-xl mb-2">Ansiedade e Pânico</h3><p class="text-sm text-slate-600">Reprocessamento de gatilhos.</p></div>
            <div class="p-6 bg-navy-50 rounded-xl border border-navy-100"><i class="fas fa-cloud-rain text-gold-500 text-3xl mb-4"></i><h3 class="font-serif font-bold text-xl mb-2">Depressão</h3><p class="text-sm text-slate-600">Reconstrução da energia vital.</p></div>
            <div class="p-6 bg-navy-50 rounded-xl border border-navy-100"><i class="fas fa-child-reaching text-gold-500 text-3xl mb-4"></i><h3 class="font-serif font-bold text-xl mb-2">Traumas de Infância</h3><p class="text-sm text-slate-600">Liberação da criança interior.</p></div>
        </div>
    </section>
    <section class="py-16 bg-navy-950 text-white text-center px-6">
        <h2 class="font-serif text-3xl font-bold mb-8">Dê o primeiro passo rumo à sua libertação.</h2>
        <span class="bg-emerald-600 text-white font-bold px-10 py-5 rounded-xl text-xl inline-block"><i class="fab fa-whatsapp mr-2"></i> Agendar via WhatsApp</span>
    </section>
</body>
</html>`;


export default function PaginaDeVendas() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900 relative">
      
      {/* HEADER SIMPLES */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 font-serif">SiteGen AI</span>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-24 pb-32 px-4 text-center overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-300/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm mb-8 border border-emerald-200 shadow-sm">
            <Zap className="size-4 fill-emerald-600" /> A Revolução da Criação Web
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 font-serif leading-[1.1]">
            Crie sites profissionais em segundos com <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">Inteligência Artificial</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Esqueça horas de programação ou templates engessados. Nossa IA constrói a estrutura visual, escreve os textos persuasivos e gera imagens exclusivas para o seu negócio com um único clique.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/planos')}
              className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-[0_8px_30px_rgb(5,150,105,0.3)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-xl"
            >
              Ver Planos de Créditos <ArrowRight className="size-6" />
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Escolha seu plano e comece a criar instantaneamente.</p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 mb-4">Tudo o que você precisa em um só lugar</h2>
            <p className="text-lg text-slate-500">Uma infraestrutura completa para lançar suas ideias na internet.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layout className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Design & Estrutura</h3>
              <p className="text-slate-600 leading-relaxed">
                Nossa IA constrói a estrutura visual completa, organizando seções de venda, depoimentos e captura de leads com foco total em conversão e responsividade.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Copywriting Automático</h3>
              <p className="text-slate-600 leading-relaxed">
                Títulos magnéticos e textos persuasivos gerados por inteligência artificial avançada, formatados especificamente para vender o seu produto ou serviço.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ImageIcon className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Imagens Fotorealistas</h3>
              <p className="text-slate-600 leading-relaxed">
                Chega de banco de imagens clichês. Integrado com poderosos motores de imagem, o sistema cria artes exclusivas e de altíssima qualidade para o seu site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLES SECTION (Amostras de Sites - REFORMULADA COM SANFONA E IFRAME) */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
              Crie sites e landing pages para ebooks, cursos, mentoria e todos os nichos
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto bg-emerald-100/50 p-4 rounded-xl border border-emerald-200">
              <i className="fas fa-magic text-emerald-600 mr-2"></i>
              Estes são <strong>modelos 100% reais</strong> criados pelo nosso gerador de sites. Clique nas abas abaixo para visualizar a página completa funcionando na prática, sem sair desta tela.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* AMOSTRA 1: ENGENHARIA */}
            <details className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all [&_summary::-webkit-details-marker]:hidden">
              <summary className="p-6 md:p-8 cursor-pointer list-none flex items-center justify-between outline-none">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex flex-shrink-0 items-center justify-center">
                    <Layout className="size-7" />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800 text-lg md:text-xl">Site Corporativo (Empresas e Agências)</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">Exemplo criado: KRONOS Engenharia</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-open:rotate-180 transition-transform text-slate-400">
                  <ChevronDown className="size-5" />
                </div>
              </summary>
              <div className="border-t border-slate-100 p-2 md:p-4 bg-slate-200">
                {/* Cabeçalho fake de navegador do Mac */}
                <div className="bg-slate-800 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                   <div className="ml-4 text-xs text-slate-400 font-mono tracking-wider flex-1 text-center pr-10">kronos-engenharia.com</div>
                </div>
                <iframe
                  srcDoc={SITE_KRONOS}
                  className="w-full h-[60vh] md:h-[700px] border-none bg-white rounded-b-xl"
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                  title="Exemplo Site Engenharia"
                />
              </div>
            </details>

            {/* AMOSTRA 2: E-BOOK */}
            <details className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all [&_summary::-webkit-details-marker]:hidden">
              <summary className="p-6 md:p-8 cursor-pointer list-none flex items-center justify-between outline-none">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex flex-shrink-0 items-center justify-center">
                    <Sparkles className="size-7" />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800 text-lg md:text-xl">Página de Vendas (E-books e Infoprodutos)</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">Exemplo criado: Guia Código da Prosperidade</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-open:rotate-180 transition-transform text-slate-400">
                  <ChevronDown className="size-5" />
                </div>
              </summary>
              <div className="border-t border-slate-100 p-2 md:p-4 bg-slate-200">
                <div className="bg-slate-800 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                   <div className="ml-4 text-xs text-slate-400 font-mono tracking-wider flex-1 text-center pr-10">codigodaprosperidade.com.br</div>
                </div>
                <iframe
                  srcDoc={SITE_EBOOK}
                  className="w-full h-[60vh] md:h-[700px] border-none bg-white rounded-b-xl"
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                  title="Exemplo E-book"
                />
              </div>
            </details>

            {/* AMOSTRA 3: MENTORIA/TERAPIA */}
            <details className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all [&_summary::-webkit-details-marker]:hidden">
              <summary className="p-6 md:p-8 cursor-pointer list-none flex items-center justify-between outline-none">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex flex-shrink-0 items-center justify-center">
                    <Zap className="size-7" />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800 text-lg md:text-xl">Landing Page de Captura (Mentoria e Terapia)</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">Exemplo criado: Terapia TRG</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-open:rotate-180 transition-transform text-slate-400">
                  <ChevronDown className="size-5" />
                </div>
              </summary>
              <div className="border-t border-slate-100 p-2 md:p-4 bg-slate-200">
                <div className="bg-slate-800 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                   <div className="ml-4 text-xs text-slate-400 font-mono tracking-wider flex-1 text-center pr-10">instituto-trg.com.br</div>
                </div>
                <iframe
                  srcDoc={SITE_TRG}
                  className="w-full h-[60vh] md:h-[700px] border-none bg-white rounded-b-xl"
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                  title="Exemplo Mentoria TRG"
                />
              </div>
            </details>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 leading-tight">Como a mágica acontece?</h2>
              <p className="text-slate-400 text-lg mb-10">Em apenas 3 passos, você sai de uma ideia na cabeça para um site profissional pronto para receber visitas.</p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Descreva sua ideia</h4>
                    <p className="text-slate-400">Diga para a IA qual é o seu negócio, produto ou serviço em poucas palavras.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">A IA cria tudo</h4>
                    <p className="text-slate-400">O sistema escreve os textos, monta a estrutura visual e desenha as imagens em tempo real.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Liberdade para Editar</h4>
                    <p className="text-slate-400">Clique em qualquer elemento para editar textos manualmente ou use nossa IA para reescrever blocos inteiros com um clique. Tudo perfeito? É só baixar o site pronto.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-4 shadow-2xl aspect-square flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="size-16 text-emerald-400 mx-auto mb-4" />
                  <p className="text-slate-300 font-medium">Sua Ideia + Nossa Tecnologia =<br/> <span className="text-emerald-400 font-bold text-xl mt-2 block">Resultado Incrível</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 px-4 bg-emerald-600 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold font-serif text-white mb-8">
            Pronto para escalar suas vendas?
          </h2>
          <p className="text-emerald-100 text-xl mb-12">
            Junte-se aos empreendedores que estão criando páginas de alta conversão de forma inteligente, rápida e sem depender de programadores.
          </p>
          <button 
            onClick={() => router.push('/planos')}
            className="px-10 py-5 bg-white text-emerald-700 font-extrabold rounded-2xl shadow-xl hover:scale-105 transition-transform text-xl"
          >
            Ver Planos e Começar Agora
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-12 text-center text-slate-500 border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} SiteGen AI. Todos os direitos reservados.</p>
      </footer>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/5561982096982?text=Olá,%20preciso%20de%20ajuda%20com%20o%20SiteGen%20AI."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center group"
        title="Fale conosco no WhatsApp"
      >
        <svg className="size-7 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out group-hover:ml-2 text-sm font-bold">
          Suporte WhatsApp
        </span>
      </a>
    </div>
  )
}
