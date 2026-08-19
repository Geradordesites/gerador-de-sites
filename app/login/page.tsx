'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sparkles, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [mensagem, setMensagem] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/') 
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMensagem('Conta criada! Faça login para continuar.')
        setIsLogin(true)
      }
    } catch (error: any) {
      setMensagem(error.message || 'Ocorreu um erro.')
    } finally {
      setLoading(false)
    }
  }

  const handleEsqueciSenha = async () => {
    if (!email) {
      setMensagem('Por favor, digite seu e-mail no campo acima primeiro para recuperar a senha.')
      return
    }
    setLoading(true)
    setMensagem('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://sites-flax.vercel.app/atualizar-senha',
      })
      if (error) throw error
      setMensagem('E-mail de recuperação enviado! Verifique sua caixa de entrada e spam.')
    } catch (error: any) {
      setMensagem(error.message || 'Erro ao enviar e-mail de recuperação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      
      {/* Logo clicável que volta para a página inicial */}
      <div className="flex items-center gap-2 mb-8 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/')}>
        <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-600/20">
          <Sparkles className="size-6 text-white" />
        </div>
        <span className="font-bold text-3xl text-slate-800 font-serif">SiteGen AI</span>
      </div>

      {/* Card Branco de Login */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta grátis'}
        </h2>
        <p className="text-slate-500 text-center mb-8 text-sm">
          {isLogin ? 'Insira seus dados para acessar o painel.' : 'Comece a gerar sites com IA agora mesmo.'}
        </p>

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-bold text-slate-700">Senha</label>
              {isLogin && (
                <button 
                  type="button" 
                  onClick={handleEsqueciSenha}
                  className="text-xs font-bold text-emerald-600 hover:underline transition-colors"
                >
                  Esqueci minha senha
                </button>
              )}
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
              placeholder="••••••••"
            />
          </div>

          {mensagem && (
            <div className={`p-3.5 rounded-xl text-sm font-bold text-center ${mensagem.includes('Erro') || mensagem.includes('error') || mensagem.includes('Invalid') ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
              {mensagem === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : mensagem}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(5,150,105,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 hover:-translate-y-0.5"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : (isLogin ? 'Entrar na Conta' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  )
}