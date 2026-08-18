'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Shield, Zap, Key, PlusCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [config, setConfig] = useState<any>({ byok_enabled: true, admin_paid_key_enabled: true })
  const [loading, setLoading] = useState(true)
  const [salvandoConfig, setSalvandoConfig] = useState(false)

  useEffect(() => {
    carregarDadosAdmin()
  }, [])

  const carregarDadosAdmin = async () => {
    setLoading(true)
    
    // 1. Busca todos os usuários/perfis
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('credits', { ascending: false })

    if (error) {
      console.error('Erro ao carregar usuários:', error)
    } else {
      setUsuarios(profiles || [])
    }

    // 2. Busca as configurações globais do sistema
    const { data: settings } = await supabase
      .from('system_settings')
      .select('*')
      .eq('id', 'global')
      .single()

    if (settings) {
      setConfig(settings)
    }

    setLoading(false)
  }

  // Função para dar créditos manuais a um usuário
  const alterarCreditos = async (userId: string, creditosAtuais: number, quantidadeParaAdicionar: number) => {
    const novoValor = Math.max(0, creditosAtuais + quantidadeParaAdicionar)
    
    const { error } = await supabase
      .from('profiles')
      .update({ credits: novoValor })
      .eq('id', userId)

    if (error) {
      alert('Erro ao atualizar créditos!')
    } else {
      setUsuarios(usuarios.map(u => u.id === userId ? { ...u, credits: novoValor } : u))
    }
  }

  // Função para alternar o Status (Ativo / Inativo)
  const alternarStatus = async (userId: string, statusAtual: string) => {
    const novoStatus = statusAtual === 'ativo' ? 'inativo' : 'ativo'
    
    const { error } = await supabase
      .from('profiles')
      .update({ status: novoStatus })
      .eq('id', userId)

    if (error) {
      alert('Erro ao alterar status do usuário!')
    } else {
      setUsuarios(usuarios.map(u => u.id === userId ? { ...u, status: novoStatus } : u))
    }
  }

  // Função para salvar as configurações globais (BYOK)
  const salvarConfiguracoesGlobais = async (novaConfig: any) => {
    setSalvandoConfig(true)
    const { error } = await supabase
      .from('system_settings')
      .update(novaConfig)
      .eq('id', 'global')

    if (error) {
      alert('Erro ao salvar configurações globais!')
    } else {
      setConfig(novaConfig)
      alert('Configurações salvas com sucesso!')
    }
    setSalvandoConfig(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-400" />
        <p className="font-bold text-lg">Carregando Painel Administrativo...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Shield className="size-6" />
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800">Área Restrita</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-white">Painel de Controle SaaS</h1>
            <p className="text-slate-400 text-sm">Gerencie usuários, créditos, assinaturas e regras de Inteligência Artificial.</p>
          </div>

          <button 
            onClick={carregarDadosAdmin} 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-bold rounded-xl transition-colors border border-slate-700 shadow-sm"
          >
            Atualizar Dados
          </button>
        </div>

        {/* BLOCO DE CONFIGURAÇÕES GLOBAIS (BYOK E IA) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Key className="size-5 text-amber-400" /> Controles Globais de IA &amp; BYOK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Permitir Chave Própria do Cliente (BYOK)</span>
                <input 
                  type="checkbox" 
                  checked={config.byok_enabled} 
                  onChange={(e) => setConfig({ ...config, byok_enabled: e.target.checked })}
                  className="size-5 accent-emerald-500 cursor-pointer"
                />
              </div>
              <p className="text-xs text-slate-400">Se desativado, o campo de inserir a chave Gemini some da conta de todos os clientes, forçando o uso exclusivo da chave centralizada.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Ativar Motor Central Pago (Together.ai / Central)</span>
                <input 
                  type="checkbox" 
                  checked={config.admin_paid_key_enabled} 
                  onChange={(e) => setConfig({ ...config, admin_paid_key_enabled: e.target.checked })}
                  className="size-5 accent-emerald-500 cursor-pointer"
                />
              </div>
              <p className="text-xs text-slate-400">Controla se o sistema centralizado está operacional para processar as requisições dos créditos dos usuários.</p>
            </div>

          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => salvarConfiguracoesGlobais(config)}
              disabled={salvandoConfig}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {salvandoConfig ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
              Salvar Alterações Globais
            </button>
          </div>
        </div>

        {/* TABELA DE CLIENTES / USUÁRIOS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="size-5 text-indigo-400" /> Clientes Cadastrados ({usuarios.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Usuário / ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Créditos Atuais</th>
                  <th className="py-3 px-4">Ações Rápidas (Créditos)</th>
                  <th className="py-3 px-4 text-center">Alternar Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs text-slate-300">
                      <div className="font-bold text-white">{user.nome || 'Sem Nome'}</div>
                      <div className="text-slate-500">{user.id}</div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'ativo' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                        {user.status === 'ativo' ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
                        {user.status?.toUpperCase() || 'INATIVO'}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-amber-400">
                      <span className="flex items-center gap-1">
                        <Zap className="size-4 fill-amber-400 text-amber-400" /> {user.credits || 0} cr.
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => alterarCreditos(user.id, user.credits || 0, 100)}
                          className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          title="Adicionar 100 créditos"
                        >
                          <PlusCircle className="size-3" /> +100
                        </button>
                        <button 
                          onClick={() => alterarCreditos(user.id, user.credits || 0, 500)}
                          className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          title="Adicionar 500 créditos"
                        >
                          <PlusCircle className="size-3" /> +500
                        </button>
                        <button 
                          onClick={() => alterarCreditos(user.id, user.credits || 0, -100)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                          title="Remover 100 créditos"
                        >
                          -100
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => alternarStatus(user.id, user.status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${user.status === 'ativo' ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                      >
                        {user.status === 'ativo' ? 'Desativar' : 'Ativar Conta'}
                      </button>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      Nenhum usuário cadastrado no sistema ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}