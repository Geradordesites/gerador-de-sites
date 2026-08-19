'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function CadastroPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      // 1. Cria o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
          }
        }
      })

      if (error) throw error

      // 2. Opcional: Atualiza o nome na tabela profiles caso o gatilho já tenha criado a linha
      if (data.user) {
        await supabase.from('profiles').update({ nome: nome }).eq('id', data.user.id)
      }

      setSucesso(true)
      
      // Redireciona para o gerador após 2 segundos
      setTimeout(() => {
        router.push('/') // Mude para '/gerador' se a sua página principal não for a raiz
      }, 2000)

    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro ao criar sua conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans selection:bg-indigo-100">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-indigo-200">
            <i className="fas fa-layer-group text-xl"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Criar Conta</h1>
          <p className="text-sm text-slate-500 mt-2">Cadastre-se para começar a gerar seus sites.</p>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-bold flex items-center gap-2">
            <i className="fas fa-exclamation-circle text-rose-500"></i> {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2">
            <i className="fas fa-check-circle text-emerald-500"></i> Conta criada com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleCadastro} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Seu Nome</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-800"
                placeholder="Ex: João Silva"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-800"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Senha</label>
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
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-800"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider text-sm py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Criar Minha Conta <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Já tem uma conta?{' '}
            <button onClick={() => router.push('/login')} className="text-indigo-600 font-bold hover:underline transition-all">
              Fazer Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}