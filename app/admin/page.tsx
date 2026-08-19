'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Users, Shield, Zap, Key, PlusCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [config, setConfig] = useState<any>({ byok_enabled: true, admin_paid_key_enabled: true })
  const [loading, setLoading] = useState(true)
  const [salvandoConfig, setSalvandoConfig] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    verificarAcesso()
  }, [])

  const verificarAcesso = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()

    // 1. Se não tiver ninguém logado, expulsa para a tela inicial
    if (!session) {
      router.push('/') 
      return
    }

    // 2. O SEU E-MAIL DE ADMIN
    const MEU_EMAIL_ADMIN = 'josevg10@gmail.com'

    // 3. Se for um cliente tentando bisbilhotar, expulsa
    if (session.user.email !== MEU_EMAIL_ADMIN) {
      alert('Acesso negado. Área restrita para administradores.')
      router.push('/')
      return
    }

    // 4. Libera o acesso e carrega os dados
    setIsAuthorized(true)
    await carregarDadosAdmin()
  }

  const carregarDadosAdmin = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('credits', { ascending: false })

    if (!error) setUsuarios(profiles || [])

    const { data: settings } = await supabase
      .from('system_settings')
      .select('*')
      .eq('id', 'global')
      .single()

    if (settings) setConfig(settings)

    setLoading(false)
  }

  const alterarCreditos = async (userId: string, creditosAtuais: number, quantidadeParaAdicionar: number) => {
    const novoValor = Math.max(0, creditosAtuais + quantidadeParaAdicionar)
    const { error } = await supabase.from('profiles').update({ credits: novoValor }).eq('id', userId)
    if (error) alert('Erro ao atualizar créditos!')
    else setUsuarios(usuarios.map(u => u.id === userId ? { ...u, credits: novoValor } : u))
  }

  const alternarStatus = async (userId: string, statusAtual: string) => {
    const novoStatus = statusAtual === 'ativo' ? 'inativo' : 'ativo'
    const { error } = await supabase.from('profiles').update({ status: novoStatus }).eq('id', userId)
    if (error) alert('Erro ao alterar status!')
    else setUsuarios(usuarios.map(u => u.id === userId ? { ...u, status: novoStatus } : u))
  }

  const salvarConfiguracoesGlobais = async (novaConfig: any) => {
    setSalvandoConfig(true)
    const { error } = await supabase.from('system_settings').update(novaConfig).eq('id', 'global')
    if (error) alert('Erro ao salvar configurações!')
    else {
      setConfig(novaConfig)
      alert('Configurações salvas com sucesso!')
    }
    setSalvandoConfig(false)
  }

  // Tela de carregamento clara
  if (loading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-900 gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
        <p className="font-bold text-lg">Verificando Credenciais...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">Área Restrita</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-slate-900">Painel de Controle SaaS</h1>
            <p className="text-slate-500 text-sm mt-1">Gerencie usuários, créditos, assinaturas e regras de Inteligência Artificial.</p>
          </div>

          <button 
            onClick={carregarDadosAdmin} 
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl transition-colors border border-slate-200 shadow-sm flex items-center gap-2"
          >
            Atualizar Dados
          </button>
        </div>

        {/* CONTROLES GLOBAIS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Key className="size-5 text-amber-500" /> Controles Globais de IA & BYOK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-slate-900">Permitir Chave Própria do Cliente (BYOK)</span>
                <input 
                  type="checkbox" 
                  checked={config.byok_enabled} 
                  onChange={(e) => setConfig({ ...config, byok_enabled: e.target.checked })}
                  className="size-5 accent-emerald-600 cursor-pointer"
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Se desativado, o campo de inserir a chave Gemini some, forçando o uso exclusivo da sua chave centralizada.</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-slate-900">Ativar Motor Central Pago (Sua Chave)</span>
                <input 
                  type="checkbox" 
                  checked={config.admin_paid_key_enabled} 
                  onChange={(e) => setConfig({ ...config, admin_paid_key_enabled: e.target.checked })}
                  className="size-5 accent-emerald-600 cursor-pointer"
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Controla se a sua API paga centralizada está operacional para processar requisições.</p>
            </div>

          </div>

          <div className="mt-6 flex justify-end pt-6 border-t border-slate-100">
            <button 
              onClick={() => salvarConfiguracoesGlobais(config)}
              disabled={salvandoConfig}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-70"
            >
              {salvandoConfig ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* TABELA DE CLIENTES */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="size-5 text-indigo-600" /> Clientes Cadastrados ({usuarios.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="py-4 px-4 font-bold">E-mail / ID</th>
                  <th className="py-4 px-4 font-bold">Status</th>
                  <th className="py-4 px-4 font-bold">Créditos</th>
                  <th className="py-4 px-4 font-bold">Ações Rápidas</th>
                  <th className="py-4 px-4 font-bold text-center">Alternar Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{user.nome || user.email || 'Sem Nome'}</div>
                      <div className="text-slate-400 text-xs font-mono mt-0.5">{user.id}</div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${user.status === 'ativo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {user.status === 'ativo' ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
                        {user.status?.toUpperCase() || 'INATIVO'}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-amber-600">
                      <span className="flex items-center gap-1.5 bg-amber-50 w-fit px-2.5 py-1 rounded-md border border-amber-200">
                        <Zap className="size-4 fill-amber-500 text-amber-500" /> {user.credits || 0} cr.
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => alterarCreditos(user.id, user.credits || 0, 100)} className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors" title="Adicionar 100">+100</button>
                        <button onClick={() => alterarCreditos(user.id, user.credits || 0, 500)} className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors" title="Adicionar 500">+500</button>
                        <button onClick={() => alterarCreditos(user.id, user.credits || 0, -100)} className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors" title="Remover 100">-100</button>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => alternarStatus(user.id, user.status)} 
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${user.status === 'ativo' ? 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50' : 'bg-emerald-600 text-white border border-transparent hover:bg-emerald-700'}`}
                      >
                        {user.status === 'ativo' ? 'Desativar Conta' : 'Ativar Conta'}
                      </button>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr><td colSpan={5} className="py-16 text-center text-slate-500 font-medium">Nenhum usuário cadastrado no momento.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}