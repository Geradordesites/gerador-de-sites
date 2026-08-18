'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Check, Zap, Star, Crown, Loader2, ArrowRight } from 'lucide-react'

export default function PlanosPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Links de Checkout da Hotmart (Você vai colocar os seus aqui depois)
  const linksHotmart = {
    basico: "https://pay.hotmart.com/SEU_LINK_BASICO",
    pro: "https://pay.hotmart.com/SEU_LINK_PRO",
    agencia: "https://pay.hotmart.com/SEU_LINK_AGENCIA"
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

  const handleComprar = (plano: 'basico' | 'pro' | 'agencia') => {
    if (!userEmail) {
      // Se não tem conta, manda para o login/cadastro avisando que ele quer assinar
      alert("Crie sua conta gratuitamente primeiro para depois adquirir seus créditos!")
      router.push('/login')
      return
    }

    // Se já tem conta, envia para a Hotmart com o e-mail preenchido (?email=...)
    // Isso é VITAL para o Webhook saber de quem é a compra depois!
    const urlCheckout = `${linksHotmart[plano]}?email=${encodeURIComponent(userEmail)}`
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
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho da Página */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
            Créditos sob medida para a sua escala
          </h1>
          <p className="text-lg text-slate-600">
            Sem mensalidades surpresas. Escolha o pacote de créditos ideal para gerar seus sites, landing pages e imagens fotorealistas com IA.
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Plano Básico */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow relative flex flex-col">
            <div className="mb-8">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide">
                INICIANTE
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-2">R$ 47</h2>
              <p className="text-slate-500 text-sm">Pagamento único (Sem renovação automática)</p>
            </div>
            
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                <Zap className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">500 Créditos</h3>
                <p className="text-sm text-slate-500">Rende aprox. 6 sites completos</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0" /> Gerador de Sites e Landing Pages</li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0" /> Imagens Fotorealistas exclusivas (FLUX)</li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-emerald-500 shrink-0" /> Acesso total ao Editor Visual</li>
            </ul>

            <button 
              onClick={() => handleComprar('basico')}
              className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex justify-center items-center gap-2"
            >
              Adquirir Pacote
            </button>
          </div>

          {/* Plano Pro (Destaque) */}
          <div className="bg-slate-900 rounded-3xl p-8 border-2 border-emerald-500 shadow-xl relative transform md:-translate-y-4 flex flex-col">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
              <Star className="size-4 fill-white" /> MAIS VENDIDO
            </div>

            <div className="mb-8 mt-2">
              <span className="bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold tracking-wide border border-emerald-800">
                PROFISSIONAL
              </span>
              <h2 className="text-4xl font-bold text-white mt-4 mb-2">R$ 97</h2>
              <p className="text-slate-400 text-sm">Pagamento único (Sem renovação automática)</p>
            </div>
            
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-800">
              <div className="bg-emerald-900 p-3 rounded-2xl text-emerald-400">
                <Zap className="size-6 fill-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">1.500 Créditos</h3>
                <p className="text-sm text-emerald-400 font-medium">Melhor custo-benefício</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0" /> Tudo do plano Iniciante</li>
              <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0" /> Créditos suficientes para ~18 sites</li>
              <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0" /> Refinamento de Copy (Textos) com IA</li>
              <li className="flex items-start gap-3 text-slate-300"><Check className="size-5 text-emerald-400 shrink-0" /> Suporte Prioritário</li>
            </ul>

            <button 
              onClick={() => handleComprar('pro')}
              className="w-full py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2"
            >
              Adquirir Pacote Pro <ArrowRight className="size-5" />
            </button>
          </div>

          {/* Plano Agência */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow relative flex flex-col">
            <div className="mb-8">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide border border-indigo-100">
                AGÊNCIA
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-2">R$ 197</h2>
              <p className="text-slate-500 text-sm">Pagamento único (Sem renovação automática)</p>
            </div>
            
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
              <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                <Crown className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">5.000 Créditos</h3>
                <p className="text-sm text-slate-500">Para produtores e agências</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0" /> Tudo do plano Profissional</li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0" /> Créditos suficientes para ~60 sites</li>
              <li className="flex items-start gap-3 text-slate-700"><Check className="size-5 text-indigo-500 shrink-0" /> Alta escala de geração de imagens</li>
            </ul>

            <button 
              onClick={() => handleComprar('agencia')}
              className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex justify-center items-center gap-2"
            >
              Adquirir Pacote Agência
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}