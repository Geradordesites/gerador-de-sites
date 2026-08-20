'use client'

import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Mail, Lock, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'

// Componente interno que lida com os parâmetros da URL
function CadastroForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planoEscolhido = searchParams.get('plano') // Lê qual plano veio na URL

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucessoMsg, setSucessoMsg] = useState('')

  // Links da Hotmart repetidos aqui para o redirecionamento direto
  const linksHotmart = {
    basico: "https://pay.hotmart.com/A107248729B",
    pro: "https://pay.hotmart.com/G107249193B",
    agencia: "https://pay.hotmart.com/U107249140O"
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      // 1. Cria o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome: nome } }
      })

      if (error) throw error

      // 2. Atualiza o nome na tabela profiles
      if (data.user) {
        await supabase.from('profiles').update({ nome: nome }).eq('id', data.user.id)
      }

      // 3. LÓGICA DO REDIRECIONAMENTO INTELIGENTE
      if (planoEscolhido && linksHotmart[planoEscolhido as keyof typeof linksHotmart]) {
        setSucessoMsg('Conta criada! Levando você para o pagamento seguro...')
        
        // Manda direto pra Hotmart com o e-mail preenchido
        setTimeout(() => {
          const linkBase = linksHotmart[planoEscolhido as keyof typeof linksHotmart]
          window.location.href = `${linkBase}?email=${encodeURIComponent(email)}`
        }, 2000)

      } else {
        // Se ele não escolheu plano nenhum (veio pelo menu normal), vai pro gerador
        setSucessoMsg('Conta criada! Redirecionando para o painel...')
        setTimeout(() => {
          router.push('/gerador') 
        }, 2000)
      }

    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro ao criar sua conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        {planoEscolhido ? 'Crie sua conta para prosseguir' : 'Crie sua conta agora'}
      </h2>
      <p className="text-slate-500 text-center mb-6 text-sm">
        {planoEscolhido 
          ? 'Precisamos de alguns dados antes de liberar seu pacote de créditos.' 
          : 'Cadastre-se para começar a gerar seus sites.'}
      </p>

      {/* AVISO IMPORTANTE SOBRE O E-MAIL DA HOTMART */}
      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
        <AlertCircle className="size-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block mb-0.5 text-emerald-950">Aviso Importante</span>
          O e-mail cadastrado abaixo será o seu acesso oficial. 
          {planoEscolhido ? ' Ele será preenchido automaticamente na próxima etapa de pagamento.' : ' Utilize o mesmo e-mail caso vá adquirir créditos.'}
        </div>
      </div>

      {/* Mensagens de Erro e Sucesso */}
      {erro && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-bold flex items-center gap-2">
          <i className="fas fa-exclamation-circle"></i> {erro}
        </div>
      )}

      {sucessoMsg && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-sm font-bold flex items-center gap-2">
          <i className="fas fa-check-circle"></i> {sucessoMsg}
        </div>
      )}

      <form onSubmit={handleCadastro} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Seu Nome</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
              placeholder="Ex: João Silva"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">E-mail</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Senha</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(5,150,105,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 hover:-translate-y-0.5"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{planoEscolhido ? 'Criar Conta e Continuar' : 'Criar Minha Conta'} <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-slate-100">
        <p className="text-sm font-bold text-slate-500">
          Já tem uma conta?{' '}
          <button onClick={() => router.push('/login')} className="text-emerald-600 hover:text-emerald-700 transition-colors">
            Faça Login
          </button>
        </p>
      </div>
    </div>
  )
}

// O componente principal da página de Cadastro
export default function CadastroPage() {
  const router = useRouter()

  return (
    // Fundo bg-slate-50 combinando com a Página de Vendas e Login
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      
      {/* Logo clicável que volta para a página principal */}
      <div className="flex items-center gap-2 mb-8 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/')}>
        <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-600/20">
          <Sparkles className="size-6 text-white" />
        </div>
        <span className="font-bold text-3xl text-slate-800 font-serif">SiteGen AI</span>
      </div>

      {/* Usamos o Suspense porque o Next.js exige isso ao ler parâmetros da URL */}
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-emerald-600" />}>
        <CadastroForm />
      </Suspense>

    </div>
  )
}
