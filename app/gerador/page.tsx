'use client'

import { useRouter } from 'next/navigation'
import { Sparkles, Layout, Image as ImageIcon, Zap, ArrowRight, Code, ChevronDown, ChevronUp, ImagePlus, Monitor } from 'lucide-react'
import { useState } from 'react'

export default function PaginaDeVendas() {
  const router = useRouter()
  const [siteExpandido, setSiteExpandido] = useState<number | null>(null)

  const exemplosSites = [
    {
      id: 1,
      titulo: "Landing Page Premium de Alta Conversão",
      nicho: "Infoprodutos & E-books",
      thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj225EWctgNmoZ7ZvtLHSXEJuJulFHh8DZaQYa6ow4iacWikcqHc9_S_6gB8adi9KfAz3sMxOcEvkLojc4KQFIvnFvj9ZWFm6I2Me0-Bb-BUbnYwpnY59MVHyj_PD2wkWf1bPTaowGoCpffWQuoJUuxwMNc67GUyCGP-bJNR0ptjQMwdlOfP0bu0bBc6F8/s1600/S2.jfif",
      imagemCompleta: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj225EWctgNmoZ7ZvtLHSXEJuJulFHh8DZaQYa6ow4iacWikcqHc9_S_6gB8adi9KfAz3sMxOcEvkLojc4KQFIvnFvj9ZWFm6I2Me0-Bb-BUbnYwpnY59MVHyj_PD2wkWf1bPTaowGoCpffWQuoJUuxwMNc67GUyCGP-bJNR0ptjQMwdlOfP0bu0bBc6F8/s1600/S2.jfif"
    },
    {
      id: 2,
      titulo: "Site Institucional e Mentorias",
      nicho: "Consultorias & Especialistas",
      thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhg_YFxQYaJ6ux839azuEbuy70GrcJdZweu-n-_8vDbmk-TAR5bK0uZrnCYiIf54OVfia9QHekeZPzR4Q_yh9dKES817qONN7hjZpevhdEH5Qgfc_Eff2RjxTaPUWqBLm5hdTxbs4tQc3Rs-l5nKspG41r20w0R5fFKini6JOxZdYC9MWBvGxVhbvL_CL8/s1600/s4.jfif",
      imagemCompleta: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhg_YFxQYaJ6ux839azuEbuy70GrcJdZweu-n-_8vDbmk-TAR5bK0uZrnCYiImportado/s1600/s4.jfif"
    },
    {
      id: 3,
      titulo: "Página de Captura Estratégica",
      nicho: "Negócios Locais & Serviços",
      thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh-gFL-kfUmx0xptn3EqunlzsvEfuLXUZrvdNbY9ZJ5-AEg6Zx6gExfd5fQqBXfZUTjDzAeqVeXduVyUjJnyeXA_3V7XodBt5Aow-utZwWegKwVwycSwLeZ_sUThe7bhs1Pb9jGZHNvarHDxz06jp8QPGJ_QZ8BD6MlqJCGIHhpoIlIvt5rUrh0b-DzKuY/s1600/s5.jfif",
      imagemCompleta: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh-gFL-kfUmx0xptn3EqunlzsvEfuLXUZrvdNbY9ZJ5-AEg6Zx6gExfd5fQqBXfZUTjDzAeqVeXduVyUjJnyeXA_3V7XodBt5Aow-utZwWegKwVwycSwLeZ_sUThe7bhs1Pb9jGZHNvarHDxz06jp8QPGJ_QZ8BD6MlqJCGIHhpoIlIvt5rUrh0b-DzKuY/s1600/s5.jfif"
    }
  ]

  const toggleSanfona = (id: number) => {
    if (siteExpandido === id) {
      setSiteExpandido(null)
    } else {
      setSiteExpandido(id)
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

      {/* SAMPLES SECTION (Amostras de Sites - MOCKUP DE TELA PROFISSIONAL) */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
                <ImagePlus className="size-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 mb-4">
              Crie sites a partir de Textos ou Imagens de Referência
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-4">
              Nosso sistema não cria apenas através de prompts de texto. <strong>Basta enviar uma imagem, arte ou print de referência</strong> e a nossa Inteligência Artificial vai extrair as cores, a estrutura e desenhar um site completo baseado nela!
            </p>
            <p className="text-slate-500 max-w-3xl mx-auto">
              Perfeito para gerar Páginas de Vendas de e-books, Lançamentos, Mentorias e Negócios Locais. Clique em "Ver Site Completo" para expandir a arte.
            </p>
          </div>

          <div className="space-y-6">
            {exemplosSites.map((site) => (
              <div key={site.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* CABEÇALHO DA SANFONA */}
                <div 
                  onClick={() => toggleSanfona(site.id)}
                  className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 cursor-pointer group"
                >
                  <div className="shrink-0 w-full md:w-48 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden relative border border-slate-100">
                    <img src={site.thumb} alt={site.titulo} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left w-full">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 block">{site.nicho}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{site.titulo}</h3>
                    <p className="text-slate-500 text-sm">Site gerado com inteligência artificial. Clique para expandir a arte completa.</p>
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

                {/* CORPO DO MOCKUP DE TELA (Proporção Perfeita Preservada) */}
                {siteExpandido === site.id && (
                  <div className="border-t border-slate-100 bg-slate-900 p-3 md:p-8 animate-in slide-in-from-top-4 duration-300 ease-out">
                    
                    {/* Barra de Navegação do Mockup (Estilo Navegador) */}
                    <div className="bg-slate-800 rounded-t-xl px-4 py-3 flex items-center justify-between border-b border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="bg-slate-900 text-slate-400 text-xs px-6 py-1 rounded-md font-mono flex items-center gap-2">
                        <Monitor className="size-3 text-emerald-400" /> sitegen-ai.com/preview/{site.id}
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-500/30">100% IA</span>
                    </div>

                    {/* Caixa de Rolagem com Largura Fixa e Altura Controlada (Mantém o Aspecto Real sem Achatamentos) */}
                    <div className="w-full h-[650px] bg-white rounded-b-xl overflow-y-auto custom-scrollbar shadow-2xl relative">
                      <img 
                        src={site.imagemCompleta} 
                        alt={`Design completo do site ${site.titulo}`} 
                        className="w-full h-auto block object-top"
                        loading="lazy"
                      />
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
                    <h4 className="text-xl font-bold mb-2">Envie a Ideia ou Imagem</h4>
                    <p className="text-slate-400">Diga para a IA qual é o seu negócio em poucas palavras ou faça o upload de uma imagem que você gostou do design.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">A IA cria tudo</h4>
                    <p className="text-slate-400">O sistema escreve os textos, monta a estrutura visual extraída da sua imagem e desenha artes exclusivas em tempo real.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Liberdade para Editar</h4>
                    <p className="text-slate-400">Clique em qualquer elemento para editar textos manualmente ou use nossa IA para reescrever blocos inteiros com um clique. Tudo perfeito? É só publicar.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-4 shadow-2xl aspect-square flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="size-16 text-emerald-400 mx-auto mb-4" />
                  <p className="text-slate-300 font-medium">Sua Imagem + Nossa IA =<br/> <span className="text-emerald-400 font-bold text-xl mt-2 block">Site Incrível em Segundos</span></p>
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

      {/* Estilo para barra de rolagem customizada */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  )
}
