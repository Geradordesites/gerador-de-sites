'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Check, Zap, Star, Crown, Loader2, ArrowRight, MessageCircle, AlertTriangle, X, Infinity, Image as ImageIcon, Rocket } from 'lucide-react'

export default function PlanosPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tipoPlano, setTipoPlano] = useState<'ilimitado' | 'creditos'>('ilimitado')
  
  // Estados para o Modal de Aviso de E-mail
  const [showModal, setShowModal] = useState(false)
  const [planoSelecionado, setPlanoSelecionado] = useState<'mensal' | 'anual' | 'iniciante' | 'pro' | 'agencia' | null>(null)

  // Links de Checkout da Cakto (Substitua pelos links reais gerados no painel da Cakto)
  const linksCheckout = {
    mensal: "https://pay.cakto.com.br/LINK_MENSAL",
    anual: "https://pay.cakto.com.br/LINK_ANUAL",
    vitalicio: "https://pay.cakto.com.br/LINK_VITALICIO", // Link direto para o plano de instalação
    iniciante: "https://pay.cakto.com.br/LINK_INICIANTE",
    pro: "https://pay.cakto.com.br/LINK_PRO",
    agencia: "https://pay.cakto.com.br/LINK_AGENCIA",
    saas_completo: "https://pay.cakto.com.br/LINK_SAAS" // Link para quem comprar o sistema de 1.997
  }

  useEffect(() => {
    verificarSessao()
  }, [])

  const verificarSessao = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.email) {
      setUserEmail(session.user.email)
    }
    setLoading(false)
  }

  const handleAction = (plano: 'mensal' | 'anual' | 'iniciante' | 'pro' | 'agencia') => {
    if (!userEmail) {
      // Se não estiver logado, manda para o cadastro avisando qual plano ele escolheu na URL
      router.push(`/cadastro?plano=${plano}`)
      return
    }

    // Se estiver logado, abre o aviso confirmando o e-mail
    setPlanoSelecionado(plano)
    setShowModal(true)
  }

  const confirmarCompra = () => {
    if (!planoSelecionado || !userEmail) return

    // Oculta o modal e manda pra Cakto com o e-mail já preenchido na URL
    setShowModal(false)
    const urlCheckout = `${linksCheckout[planoSelecionado]}?email=${encodeURIComponent(userEmail)}`
    window.location.href = urlCheckout
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 font-sans relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho da Página */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
            Escolha o formato ideal para o seu negócio
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Gere landing pages profissionais em minutos. Escolha o acesso ilimitado conectando sua própria API, ou compre nossos pacotes de créditos avulsos.
          </p>
        </div>

        {/* Aviso para quem não está logado */}
        {!userEmail && (
          <div className="max-w-2xl mx-auto mb-12 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-amber-800 font-medium">
              <span className="font-bold block mb-1">Atenção!</span>
              Você precisa criar sua conta gratuitamente antes de adquirir um pacote. Escolha um plano abaixo para se cadastrar.
            </p>
          </div>
        )}

        {/* BOTOES DE ALTERNÂNCIA (TOGGLE) */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-200 p-1.5 rounded-2xl inline-flex relative shadow-inner flex-col sm:flex-row gap-2 sm:gap-0">
            <button 
              onClick={() => setTipoPlano('ilimitado')}
              className={`relative z-10 px-8 py-3.5 font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center ${tipoPlano === 'ilimitado' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Infinity className="size-5 mr-2" /> Ilimitado (Sua Chave)
            </button>
            <button 
              onClick={() => setTipoPlano('creditos')}
              className={`relative z-10 px-8 py-3.5 font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center ${tipoPlano === 'creditos' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Zap className="size-5 mr-2" /> Pacotes de Créditos
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODO 1: ACESSO ILIMITADO (BYOK) */}
        {/* ========================================================================= */}
        {tipoPlano === 'ilimitado' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-4xl mx-auto mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 shrink-0">
                <ImageIcon className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-indigo-900 mb-1">Como funcionam as imagens neste plano?</h4>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  Para garantir que você <strong>não tenha custos extras</strong> usando sua própria chave do Google Gemini, o sistema utilizará uma API gratuita de banco de imagens (Unsplash). Suas páginas serão geradas com fotografias reais e em alta qualidade sem gastar um centavo a mais.
                </p>
                <p className="text-sm text-indigo-700 font-semibold mt-2">
                  Lembre-se: Após o site ser gerado pela IA, tudo pode ser editado! Textos (copys), imagens e cores podem ser alterados de forma muito fácil em nosso editor visual.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              
              {/* Mensal */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                <div className="mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">Plano Mensal</span>
                  <div className="mt-4 flex items-baseline text-5xl font-black text-slate-900">
                    R$ 47<span className="text-lg text-slate-500 font-medium ml-1">/mês</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-3">Renovação automática. Cancele quando quiser.</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Geração ilimitada de sites</li>
                  <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Conecte sua chave grátis do Google</li>
                  <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Imagens via API Gratuita (Custo zero)</li>
                  <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Acesso total ao Editor Visual</li>
                </ul>
                <button onClick={() => handleAction('mensal')} className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex justify-center items-center gap-2">
                  {userEmail ? 'Assinar Mensal' : 'Criar Conta Primeiro'}
                </button>
              </div>

              {/* Anual */}
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative flex flex-col transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                  Melhor Custo-Benefício
                </div>
                <div className="mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Plano Anual</span>
                  <div className="mt-4 flex items-baseline text-5xl font-black text-white">
                    R$ 297<span className="text-lg text-slate-400 font-medium ml-1">/ano</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-3">Equivale a apenas R$ 24,75 por mês.</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-indigo-400 shrink-0 mt-0.5" /> Tudo do plano Mensal</li>
                  <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-indigo-400 shrink-0 mt-0.5" /> Desconto de 47% embutido</li>
                  <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-indigo-400 shrink-0 mt-0.5" /> Suporte prioritário via WhatsApp</li>
                </ul>
                <button onClick={() => handleAction('anual')} className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2">
                  {userEmail ? 'Assinar Anual' : 'Criar Conta Primeiro'} {userEmail && <ArrowRight className="size-5" />}
                </button>
              </div>

              {/* Vitalício (Instalação Independente - Não exige login) */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col relative overflow-hidden">
                <div className="mb-6 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Sua Própria Instalação
                  </span>
                  <div className="mt-5 flex items-baseline text-5xl font-black text-slate-900">
                    R$ 497<span className="text-lg text-slate-500 font-medium ml-1">/único</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-3">Sistema instalado para seu uso independente. Não é cobrado mensalidade.</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1 relative z-10">
                  <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Acesso vitalício e independente</li>
                  <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Geração ilimitada de sites</li>
                  <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Pagamento único no cartão ou PIX</li>
                </ul>
                
                {/* Link Direto sem handleAction - Ignora necessidade de conta */}
                <a 
                  href={linksCheckout.vitalicio} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative z-10 w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex justify-center items-center gap-2"
                >
                  Garantir Acesso Vitalício
                </a>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODO 2: PACOTES DE CRÉDITOS (API PAGA) */}
        {/* ========================================================================= */}
        {tipoPlano === 'creditos' && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Iniciante */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
              <div className="mb-6">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                  INICIANTE
                </span>
                <div className="mt-5 text-5xl font-black text-slate-900 mb-2">R$ 47</div>
                <p className="text-xs text-slate-500">Pagamento único (Sem renovação automática)</p>
                
                <div className="mt-6 flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center flex-shrink-0"><Zap className="size-5 fill-amber-500" /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">70 Créditos</h4>
                    <p className="text-[10px] text-slate-600 mt-1">Média de até 7 sites completos</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Gerador de Sites e Landing Pages</li>
                <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Imagens Fotorealistas geradas por IA</li>
                <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Acesso total ao Editor Visual</li>
                <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Edições manuais não consomem créditos</li>
              </ul>
              <button onClick={() => handleAction('iniciante')} className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex justify-center items-center gap-2">
                {userEmail ? 'Adicionar Pacote' : 'Criar Conta Primeiro'}
              </button>
            </div>

            {/* Profissional */}
            <div className="bg-[#0b1320] rounded-3xl p-8 border border-emerald-900 shadow-2xl relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1">
                <Star className="size-3 fill-white" /> MAIS VENDIDO
              </div>
              <div className="mb-6">
                <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                  PROFISSIONAL
                </span>
                <div className="mt-5 text-5xl font-black text-white mb-2">R$ 97</div>
                <p className="text-xs text-slate-400">Pagamento único (Sem renovação automática)</p>
                
                <div className="mt-6 flex items-start gap-4 p-4 bg-emerald-900/30 rounded-xl border border-emerald-800/50">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0"><Zap className="size-5 fill-emerald-400" /></div>
                  <div>
                    <h4 className="font-bold text-white">200 Créditos</h4>
                    <p className="text-[10px] text-emerald-400 mt-1">Média de até 20 sites completos</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0 mt-0.5" /> Tudo do plano Iniciante</li>
                <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0 mt-0.5" /> Média de até 20 sites</li>
                <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0 mt-0.5" /> Refinamento de Copy (Textos) com IA</li>
                <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0 mt-0.5" /> Suporte Prioritário</li>
              </ul>
              <button onClick={() => handleAction('pro')} className="w-full py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)] flex justify-center items-center gap-2">
                {userEmail ? 'Adicionar Pacote Pro' : 'Criar Conta Primeiro'} {userEmail && <ArrowRight className="size-5" />}
              </button>
            </div>

            {/* Agência */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
              <div className="mb-6">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                  AGÊNCIA
                </span>
                <div className="mt-5 text-5xl font-black text-slate-900 mb-2">R$ 197</div>
                <p className="text-xs text-slate-500">Pagamento único (Sem renovação automática)</p>
                
                <div className="mt-6 flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0"><Crown className="size-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">500 Créditos</h4>
                    <p className="text-[10px] text-slate-600 mt-1">Média de até 50 sites completos</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Tudo do plano Profissional</li>
                <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Média de até 50 sites</li>
                <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Alta escala de customização</li>
                <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0 mt-0.5" /> Edições manuais ilimitadas</li>
              </ul>
              <button onClick={() => handleAction('agencia')} className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex justify-center items-center gap-2">
                {userEmail ? 'Adicionar Pacote Agência' : 'Criar Conta Primeiro'}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* RODAPÉ ESPECIAL: OFERTA DO SISTEMA SAAS COMPLETO (WHITE LABEL) */}
        {/* ========================================================================= */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto shadow-2xl relative overflow-hidden border border-indigo-500/30">
          {/* Elemento de Fundo Decorativo */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
            <Rocket className="w-96 h-96 text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <span className="bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg mb-6 inline-block">
                Oportunidade de Negócio Exclusiva
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                Tenha o seu próprio SaaS Gerador de Sites com IA
              </h3>
              <p className="text-indigo-200 text-lg mb-0 leading-relaxed">
                Quer empreender? Nós instalamos o sistema completo no seu nome (White Label), com área de painel Admin para você gerenciar planos, cobrar de clientes e faturar 100% das vendas.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center shrink-0 w-full md:w-80 shadow-2xl">
              <div className="text-indigo-300 font-bold text-sm uppercase tracking-wider mb-2">Instalação Completa</div>
              <div className="text-5xl font-black text-white mb-2">R$ 1.997</div>
              <div className="text-slate-300 text-xs mb-6">Pagamento Único (PIX ou Cartão)</div>
              
              <a 
                href={linksCheckout.saas_completo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:scale-105"
              >
                <Rocket className="size-5" /> Quero Empreender
              </a>
              <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                Após a confirmação do pagamento, nossa equipe entrará em contato para realizar a instalação no seu domínio.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé Genérico de Contato */}
        <div className="text-center mt-12 mb-8">
          <a 
            href="https://wa.me/5561982096982?text=Olá!%20Gostaria%20de%20falar%20sobre%20os%20planos%20do%20gerador%20de%20sites."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <MessageCircle className="size-4" /> Dúvidas? Fale conosco no WhatsApp (61) 98209-6982
          </a>
        </div>

      </div>

      {/* MODAL DE CONFIRMAÇÃO DE E-MAIL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
            
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="size-8" />
            </div>
            
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">
              Aviso Importante!
            </h3>
            
            <p className="text-slate-600 text-center mb-6 leading-relaxed">
              Para que seu acesso seja liberado automaticamente, você será redirecionado para o Checkout com o seu e-mail já preenchido:
            </p>
            
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-center mb-6">
              <span className="block text-sm text-slate-500 mb-1">Não altere este e-mail no pagamento:</span>
              <strong className="text-lg text-emerald-700 break-all">{userEmail}</strong>
            </div>

            <button 
              onClick={confirmarCompra}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
            >
              Entendi, ir para o pagamento <ArrowRight className="size-5" />
            </button>
            
            <button 
              onClick={() => setShowModal(false)}
              className="w-full mt-3 py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}