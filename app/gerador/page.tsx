'use client'

import { useRouter } from 'next/navigation'
import { Sparkles, Layout, Image as ImageIcon, Zap, ArrowRight, Code, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

// =========================================================================
// CÓDIGOS HTML DOS SITES DE EXEMPLO
// Injetados via srcDoc para não precisarem de links externos ou hospedagem
// =========================================================================

const SITE_EBOOK = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código da Prosperidade | O Guia Prático para Multiplicar sua Renda</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: { extend: { colors: { emeraldCustom: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22' } } } }
        }
    </script>
</head>
<body class="bg-emeraldCustom-50 text-slate-800 font-sans antialiased selection:bg-emeraldCustom-600 selection:text-white">
    <nav class="fixed top-0 left-0 w-full bg-emeraldCustom-950/95 backdrop-blur-md text-white z-50 border-b border-emeraldCustom-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emeraldCustom-500 to-green-400 flex items-center justify-center text-emeraldCustom-950 font-black text-xl shadow-md"><i class="fas fa-book-open"></i></div>
                <span class="font-extrabold text-xl tracking-tight text-white">CÓDIGO <span class="text-emeraldCustom-500">PROSPERIDADE</span></span>
            </div>
            <div class="hidden md:flex items-center gap-8 font-medium text-sm text-emeraldCustom-100">
                <a href="#inicio" class="hover:text-emeraldCustom-500 transition-colors">Início</a>
                <a href="#problemas" class="hover:text-emeraldCustom-500 transition-colors">Para Quem É</a>
                <a href="#conteudo" class="hover:text-emeraldCustom-500 transition-colors">O Conteúdo</a>
            </div>
            <div>
                <a href="#checkout" class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-lg hover:shadow-orange-500/30 transition-all inline-flex items-center gap-2">
                    <span>QUERO O E-BOOK</span> <i class="fas fa-arrow-right text-xs"></i>
                </a>
            </div>
        </div>
    </nav>
    <div class="h-20"></div>
    <section id="inicio" class="relative bg-gradient-to-b from-emeraldCustom-950 via-emeraldCustom-900 to-emeraldCustom-800 text-white py-16 md:py-24 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
                <div class="w-full md:w-1/2 text-center md:text-left">
                    <div class="inline-flex items-center gap-2 bg-emeraldCustom-800/80 border border-emeraldCustom-600 px-4 py-1.5 rounded-full text-emeraldCustom-100 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
                        <i class="fas fa-star text-amber-400"></i> Método Comprovado
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">Aprenda o Passo a Passo Exato para Organizar suas Finanças e Multiplicar seu Dinheiro</h1>
                    <p class="text-lg md:text-xl text-emeraldCustom-100 leading-relaxed font-light mb-6">Descubra o mapa definitivo criado para quem deseja sair das dívidas, construir uma reserva sólida e alcançar a verdadeira segurança financeira.</p>
                </div>
                <div class="w-full md:w-1/2 flex justify-center">
                    <div class="relative max-w-md w-full">
                        <div class="absolute -inset-1 bg-gradient-to-r from-emeraldCustom-500 to-amber-400 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
                        <div class="relative bg-emeraldCustom-900 border border-emeraldCustom-700 p-4 rounded-2xl shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Mockup" class="w-full h-auto object-cover rounded-xl shadow-md">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="py-20 bg-white text-slate-800">
        <div class="max-w-5xl mx-auto px-4 text-center">
            <h2 class="text-3xl font-extrabold text-emeraldCustom-950 mb-4">Veja o Que Dizem Quem Já Aplicou o Método</h2>
            <p class="text-slate-600 text-lg mb-12">Pessoas comuns que decidiram tomar o controle de suas vidas financeiras.</p>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-emeraldCustom-50 p-6 rounded-2xl shadow-sm border border-emeraldCustom-100 text-left">
                    <div class="flex text-amber-400 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                    <p class="text-slate-600 text-sm mb-4">"O e-book é extremamente direto. Sem termos complicados. Aprendi a montar minha reserva."</p>
                    <div class="font-bold text-slate-900 text-sm">Carlos Eduardo</div>
                </div>
            </div>
        </div>
    </section>
</body></html>`;

const SITE_MENTORIA = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TRG - Terapia de Reprocessamento Generativo</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = { theme: { extend: { fontFamily: { serif: ['Playfair Display', 'serif'], sans: ['Plus Jakarta Sans', 'sans-serif'] }, colors: { navy: { 950: '#040B14', 900: '#0B1A30', 800: '#132847' }, gold: { 400: '#F3C669', 500: '#D4A338', 600: '#B58322' } } } } }
    </script>
</head>
<body class="bg-white text-navy-900 font-sans">
    <nav class="fixed top-0 w-full bg-navy-900/95 backdrop-blur-md border-b border-navy-800 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center text-navy-950 font-serif font-bold text-xl">T</div>
                <div class="flex flex-col"><span class="font-serif text-lg font-bold text-white">Instituto TRG</span></div>
            </div>
            <a href="#agendamento" class="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold px-6 py-2.5 rounded-full text-sm">Agendar Sessão</a>
        </div>
    </nav>
    <section class="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-navy-900 text-white min-h-screen flex items-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 opacity-95"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div class="flex flex-col md:flex-row items-center gap-12">
                <div class="w-full md:w-1/2 space-y-6">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase">
                        <i class="fas fa-shield-halved text-gold-400"></i> Terapia de Reprocessamento
                    </div>
                    <h1 class="font-serif text-4xl lg:text-5xl font-bold leading-tight text-white">Você continuará repetindo os mesmos padrões de dor ou fará a escolha de se libertar?</h1>
                    <p class="text-slate-300 text-lg font-light">Traumas do passado, ansiedade paralisante e bloqueios não precisam definir o seu futuro. Retome o controle da sua vida em poucas sessões.</p>
                </div>
                <div class="w-full md:w-1/2">
                    <div class="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1624268010368-2c3def0a26ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxzZXJlbmUlMjB3b21hbiUyMHBlYWNlZnVsJTIwZmFjZSUyMGxpZ2h0JTIwYmFja2dyb3VuZHxlbnwwfDF8fHwxNzg3MzE4OTA4fDA&ixlib=rb-4.1.0&q=80&w=1080" class="w-full h-[480px] object-cover" />
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="py-20 bg-slate-50 text-navy-900">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <h2 class="font-serif text-4xl font-bold text-navy-950 mb-12">As 5 Fases do Protocolo</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><span class="text-3xl font-serif text-gold-500 block mb-3">01</span><h3 class="font-bold text-lg">Cronológico</h3><p class="text-sm text-slate-600 mt-2">Varredura das memórias da infância até o presente.</p></div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><span class="text-3xl font-serif text-gold-500 block mb-3">02</span><h3 class="font-bold text-lg">Somático</h3><p class="text-sm text-slate-600 mt-2">Liberação de cargas emocionais presas no corpo.</p></div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><span class="text-3xl font-serif text-gold-500 block mb-3">03</span><h3 class="font-bold text-lg">Temático</h3><p class="text-sm text-slate-600 mt-2">Tratamento focado em fobias e lutos pendentes.</p></div>
            </div>
        </div>
    </section>
</body></html>`;

const SITE_INSTITUCIONAL = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KRONOS Engenharia & Construção</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Montserrat', 'sans-serif'] }, colors: { brand: { dark: '#0B0F17', asphalt: '#121824', card: '#1A2332', orange: '#FF5500' } } } } }
    </script>
</head>
<body class="bg-brand-dark text-slate-100 font-sans">
    <nav class="fixed top-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/5">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-brand-orange text-white flex items-center justify-center font-heading font-black text-xl rounded">K</div>
                <span class="font-heading font-extrabold text-xl tracking-wider text-white uppercase">KRONOS</span>
            </div>
            <a href="#contato" class="bg-brand-orange text-white px-6 py-2.5 rounded font-heading font-bold text-xs uppercase tracking-wider">Solicitar Orçamento</a>
        </div>
    </nav>
    <section class="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1732740674554-11b7772d8c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxtb2Rlcm4lMjBza3lzY3JhcGVyJTIwY29uc3RydWN0aW9uJTIwc3Vuc2V0JTIwZHJvbmV8ZW58MHwwfHx8MTc4NzMxNzYyOHww&ixlib=rb-4.1.0&q=80&w=1080" class="w-full h-full object-cover opacity-30" />
            <div class="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent"></div>
        </div>
        <div class="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div class="max-w-3xl">
                <h1 class="font-heading font-black text-5xl sm:text-7xl text-white uppercase tracking-tight leading-none mb-6">Construindo o Futuro com Solidez Monumental</h1>
                <p class="text-slate-300 text-xl font-light mb-8">Soluções completas para edifícios corporativos, complexos industriais e residências de alto padrão com precisão cirúrgica.</p>
                <a href="#portfolio" class="inline-flex justify-center items-center bg-brand-orange text-white px-8 py-4 rounded font-heading font-bold text-sm uppercase tracking-wider">Explorar Obras <i class="fas fa-building ml-2"></i></a>
            </div>
        </div>
    </section>
    <section class="py-24 bg-brand-asphalt">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16"><h2 class="font-heading font-black text-4xl text-white uppercase">Soluções Integradas</h2></div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><i class="fas fa-building-user text-3xl text-brand-orange mb-4"></i><h3 class="font-heading font-bold text-xl text-white mb-4">Obras Corporativas</h3><p class="text-slate-400 text-sm">Edifícios comerciais construídos com rapidez e eficiência energética.</p></div>
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><i class="fas fa-home text-3xl text-brand-orange mb-4"></i><h3 class="font-heading font-bold text-xl text-white mb-4">Residencial de Luxo</h3><p class="text-slate-400 text-sm">Casas e mansões de altíssimo padrão com acabamentos nobres.</p></div>
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><i class="fas fa-industry text-3xl text-brand-orange mb-4"></i><h3 class="font-heading font-bold text-xl text-white mb-4">Infraestrutura Industrial</h3><p class="text-slate-400 text-sm">Galpões logísticos de alto desempenho e fundações profundas.</p></div>
            </div>
        </div>
    </section>
</body></html>`;

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================

export default function PaginaDeVendas() {
  const router = useRouter()
  // Estado para controlar qual sanfona está aberta
  const [siteExpandido, setSiteExpandido] = useState<number | null>(null)

  // Dados dos 3 sites de exemplo mapeados com os HTMLs Injetados
  const exemplosSites = [
    {
      id: 1,
      titulo: "Página de Vendas para E-books",
      nicho: "Infoprodutos & Ebooks",
      thumb: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      codigoHtml: SITE_EBOOK
    },
    {
      id: 2,
      titulo: "Landing Page para Mentorias",
      nicho: "Consultorias & Especialistas",
      thumb: "https://images.unsplash.com/photo-1624268010368-2c3def0a26ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxzZXJlbmUlMjB3b21hbiUyMHBlYWNlZnVsJTIwZmFjZSUyMGxpZ2h0JTIwYmFja2dyb3VuZHxlbnwwfDF8fHwxNzg3MzE4OTA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      codigoHtml: SITE_MENTORIA
    },
    {
      id: 3,
      titulo: "Página Institucional",
      nicho: "Negócios Locais & Agências",
      thumb: "https://images.unsplash.com/photo-1732740674554-11b7772d8c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxtb2Rlcm4lMjBza3lzY3JhcGVyJTIwY29uc3RydWN0aW9uJTIwc3Vuc2V0JTIwZHJvbmV8ZW58MHwwfHx8MTc4NzMxNzYyOHww&ixlib=rb-4.1.0&q=80&w=1080",
      codigoHtml: SITE_INSTITUCIONAL
    }
  ]

  const toggleSanfona = (id: number) => {
    if (siteExpandido === id) {
      setSiteExpandido(null) // Fecha se clicar no que já está aberto
    } else {
      setSiteExpandido(id) // Abre o novo
    }
  }

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
            Crie sites profissionais em segundos com <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">Inteligência Artificial</span>
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

      {/* SAMPLES SECTION (Amostras de Sites - SANFONA INTERNA COM SRCDOC) */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 mb-4">
              Crie sites e landing pages para ebooks, cursos, mentoria e todos os nichos
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto">
              Os sites abaixo são modelos reais gerados 100% pelo nosso construtor de IA. Clique em "Ver Site Completo" para expandir e navegar no modelo sem sair desta página.
            </p>
          </div>

          {/* LISTA SANFONA */}
          <div className="space-y-6">
            {exemplosSites.map((site) => (
              <div key={site.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* CABEÇALHO DA SANFONA (Clicável) */}
                <div 
                  onClick={() => toggleSanfona(site.id)}
                  className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 cursor-pointer group"
                >
                  <div className="shrink-0 w-full md:w-48 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden relative border border-slate-100">
                    <img src={site.thumb} alt={site.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left w-full">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 block">{site.nicho}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{site.titulo}</h3>
                    <p className="text-slate-500 text-sm">Clique para ver o site completo com estrutura, copy e imagens geradas.</p>
                  </div>
                  
                  <div className="shrink-0">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                      {siteExpandido === site.id ? (
                        <>Fechar Site <ChevronUp className="size-4" /></>
                      ) : (
                        <>Ver Site Completo <ChevronDown className="size-4" /></>
                      )}
                    </button>
                  </div>
                </div>

                {/* CORPO DA SANFONA COM IFRAME BLINDADO (SRCDOC) */}
                {siteExpandido === site.id && (
                  <div className="border-t border-slate-100 bg-slate-100 p-2 md:p-6 animate-in slide-in-from-top-4 duration-300 ease-out">
                    <div className="flex justify-between items-center mb-3 px-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview do Site Interativo</span>
                      {/* Removido o botão de abrir em nova aba para reter o usuário no seu site */}
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold">100% Criado com IA</span>
                    </div>
                    {/* O iframe renderiza diretamente a string HTML (srcDoc) garantindo que o usuário nunca saia da página */}
                    <div className="w-full h-[600px] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                      <iframe 
                        srcDoc={site.codigoHtml} 
                        className="w-full h-full border-none"
                        loading="lazy"
                        title={site.titulo}
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
