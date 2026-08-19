'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react'

export default function AtualizarSenhaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setLoading(true)
    
    // O Supabase entende que o usuário está no fluxo de reset pela URL
    const { error } = await supabase.auth.updateUser({ password: password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Lock className="size-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Nova Senha</h1>
          <p className="text-slate-500 text-sm mt-2">Escolha uma nova senha forte para sua conta.</p>
        </div>

        {success ? (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center text-sm font-bold border border-emerald-200">
            <CheckCircle className="size-8 mx-auto mb-2 text-emerald-500" />
            Senha atualizada com sucesso! Redirecionando...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-xs font-bold flex items-center gap-2 border border-rose-200">
                <AlertTriangle className="size-4" /> {error}
              </div>
            )}

            <div className="relative">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Nova Senha</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-200 mt-6 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : "Salvar Nova Senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}