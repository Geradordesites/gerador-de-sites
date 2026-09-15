'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Check, Loader2, ArrowRight, AlertTriangle, X, Image as ImageIcon } from 'lucide-react'

export default function OfertaAfiliadosPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [showModal, setShowModal] = useState(false)
  const [planoSelecionado, setPlanoSelecionado] = useState<'mensal' | 'anual' | null>(null)

  // Links reais de Checkout da Cakto (Apenas as opções liberadas para afiliados)
  const linksCheckout = {
    mensal: "https://pay.cakto.com.br/s29kpat",
    anual: "https://pay.cakto.com.br/eaxg525",
    vitalicio: "https://pay.cakto.com.br/hmu7wum", // Adicionado o link do Vitalício
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

  const handleAction = (plano: 'mensal' | 'anual') => {
    if (!userEmail) {
      router.push(`/cadastro?plano=${plano}`)
      return
    }
    setPlanoSelecionado(plano)
    setShowModal(true)
  }

  const confirmarCompra = () => {
    if (!planoSelecionado || !userEmail) return
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
          <span className="bg-indigo-100 text-indigo-800 font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block">
            Acesso Premium
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
            Gere sites profissionais em minutos com Inteligência Artificial
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Escolha o plano ideal e tenha acesso à ferramenta definitiva de criação de landing pages. Conecte sua própria chave de API e não pague custos extras por site gerado.
          </p>
        </div>

        {/* Aviso para quem não está logado */}
        {!userEmail && (
          <div className="max-w-2xl mx-auto mb-12 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-amber-800 font-medium">
              <span className="font-bold block mb-1">Atenção:</span>
              Para os planos Mensal e Anual, você criará sua conta gratuita na próxima tela antes do pagamento para liberação imediata.
            </p>
          </div>
        )}

        {/* Bloco de Avisos Explicativos da API */}
        <div className="max-w-4xl mx-auto mb-12 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-4 shadow-sm">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0">
            <ImageIcon className="size-6" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900 mb-1">Como funcionam as imagens e gerações?</h4>
            <p className="text-sm text-emerald-800 leading-relaxed mb-3">
              Para garantir que você <strong>não tenha custos extras</strong> usando sua própria chave do Google Gemini, o sistema utilizará uma API gratuita de banco de imagens (Unsplash). Suas páginas serão geradas com fotografias reais e em alta qualidade sem gastar um centavo a mais.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                A geração é ilimitada pelo nosso sistema. O volume de sites que você pode gerar por minuto dependerá apenas dos limites da sua própria conta do Google.
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Planos - 3 Colunas */}
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
              <li className="flex items-start gap-3 text-slate-700">
                <Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> 
                <span>Geração ilimitada de sites <span className="text-amber-500 font-bold">*</span></span>
              </li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Conecte sua chave grátis do Google</li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Imagens via API Gratuita (Custo zero)</li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Acesso total ao Editor Visual</li>
            </ul>
            <button onClick={() => handleAction('mensal')} className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex justify-center items-center gap-2">
              {userEmail ? 'Assinar Mensal' : 'Criar Conta e Assinar'}
            </button>
          </div>

          {/* Anual */}
          <div className="bg-[#0b1320] rounded-3xl p-8 border border-emerald-900 shadow-2xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
              Melhor Custo-Benefício
            </div>
            <div className="mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Plano Anual</span>
              <div className="mt-4 flex items-baseline text-5xl font-black text-white">
                R$ 297<span className="text-lg text-slate-400 font-medium ml-1">/ano</span>
              </div>
              <p className="text-sm text-slate-400 mt-3">Equivale a apenas R$ 24,75 por mês.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="size-5 text-emerald-400 shrink-0 mt-0.5" /> 
                <span>Geração ilimitada de sites <span className="text-amber-500 font-bold">*</span></span>
              </li>
              <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0 mt-0.5" /> Desconto de 47% embutido</li>
              <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0 mt-0.5" /> Todas as funções do plano mensal</li>
              <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0 mt-0.5" /> Suporte prioritário via WhatsApp</li>
            </ul>
            <button onClick={() => handleAction('anual')} className="w-full py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-2">
              {userEmail ? 'Assinar Anual' : 'Criar Conta e Assinar'} {userEmail && <ArrowRight className="size-5" />}
            </button>
          </div>

          {/* Vitalício (Instalação Independente) */}
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
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Acesso vitalício e independente</li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Geração ilimitada sem amarras</li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Pagamento único no cartão ou PIX</li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0 mt-0.5" /> Liberdade total de uso</li>
            </ul>
            
            {/* Como o Vitalício não exige a criação de conta no seu SaaS principal (é uma instalação separada), o link vai direto para o checkout! */}
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

      {/* MODAL DE CONFIRMAÇÃO DE E-MAIL (Apenas para Mensal/Anual) */}
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
              Quase lá!
            </h3>
            
            <p className="text-slate-600 text-center mb-6 leading-relaxed">
              Você será redirecionado para o Checkout com o seu e-mail já preenchido para liberar o seu acesso automaticamente:
            </p>
            
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-center mb-6">
              <span className="block text-sm text-slate-500 mb-1">Não altere este e-mail no pagamento:</span>
              <strong className="text-lg text-emerald-700 break-all">{userEmail}</strong>
            </div>

            <button 
              onClick={confirmarCompra}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
            >
              Ir para o pagamento <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}