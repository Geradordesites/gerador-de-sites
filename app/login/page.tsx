'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // MODO CRIAR CONTA
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Conta criada com sucesso! Você já pode fazer login.');
        setIsSignUp(false);
      } else {
        // MODO ENTRAR
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Redireciona para o gerador de sites após o login
        window.location.href = '/'; 
      }
    } catch (error: any) {
      alert(error.message || 'Erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            <i className="fas fa-layer-group mr-2"></i>Modelador Pro
          </h1>
          <p className="text-blue-100 text-sm">Faça login para acessar o gerador de sites</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : isSignUp ? (
                <><i className="fas fa-user-plus"></i> Criar Minha Conta</>
              ) : (
                <><i className="fas fa-sign-in-alt"></i> Entrar no Sistema</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
            >
              {isSignUp ? 'Já tem uma conta? Faça login aqui' : 'Não tem conta? Crie uma agora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}