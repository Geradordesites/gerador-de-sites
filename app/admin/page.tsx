'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Users, Shield, Zap, Key, CheckCircle, XCircle, Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [config, setConfig] = useState<any>({ byok_enabled: true, admin_paid_key_enabled: true })
  const [apiLogs, setApiLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [salvandoConfig, setSalvandoConfig] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  // Estado para controlar quais chaves estão visíveis na tela
  const [chavesVisiveis, setChavesVisiveis] = useState<Record<string, boolean>>({})

  useEffect(() => {
    verificarAcesso()
  }, [])

  const verificarAcesso = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push('/') 
      return
    }

    const MEU_EMAIL_ADMIN = 'josevg10@gmail.com'

    if (session.user.email !== MEU_EMAIL_ADMIN) {
      alert('Acesso negado. Área restrita para administradores.')
      router.push('/')
      return
    }

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

    if (settings) {
      setConfig(settings)
    } else {
      await supabase.from('system_settings').upsert({ id: 'global', byok_enabled: true, admin_paid_key_enabled: true })
    }

    const { data: logs } = await supabase
      .from('api_logs')
      .select('*')
      .order('data_hora', { ascending: false })
      .limit(20)
    
    if (logs) setApiLogs(logs)

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

  const alternarByokIndividual = async (userId: string, statusAtual: boolean) => {
    const novoStatus = !statusAtual
    const { error } = await supabase.from('profiles').update({ allow_byok: novoStatus }).eq('id', userId)
    if (error) alert('Erro ao alterar permissão de chave do usuário!')
    else setUsuarios(usuarios.map(u => u.id === userId ? { ...u, allow_byok: novoStatus } : u))
  }

  const salvarConfiguracoesGlobais = async (novaConfig: any) => {
    setSalvandoConfig(true)
    const { error } = await supabase
      .from('system_settings')
      .upsert({ 
        id: 'global',
        byok_enabled: novaConfig.byok_enabled, 
        admin_paid_key_enabled: novaConfig.admin_paid_key_enabled 
      })

    if (error) {
      console.error(error)
      alert(`Erro ao salvar: ${error.message}`)
    } else {
      setConfig(novaConfig)
      alert('Configurações salvas com sucesso!')
    }
    setSalvandoConfig(false)
  }

  const toggleVisibilidadeChave = (userId: string) => {
    setChavesVisiveis(prev => ({ ...prev, [userId]: !prev[userId] }))
  }

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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">Área Restrita</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-slate-900">Painel de Controle SaaS</h1>
            <p className="text-slate-500 text-sm mt-1">Gerencie usuários, créditos, assinaturas e regras de Inteligência Artificial.</p>
          </div>
          <button onClick={carregarDadosAdmin} className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl transition-colors border border-slate-200 shadow-sm flex items-center gap-2">
            Atualizar Dados
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Key className="size-5 text-amber-500" /> Controles Globais de IA & BYOK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-slate-900">Permitir Chave Própria (Acesso Global)</span>
                <input type="checkbox" checked={config.byok_enabled} onChange={(e) => setConfig({ ...config, byok_enabled: e.target.checked })} className="size-5 accent-emerald-600 cursor-pointer" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Se ativado, TODOS os clientes poderão inserir a própria chave. Se desativado, apenas quem tiver permissão individual (abaixo) poderá.</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-slate-900">Sua Chave Central (API Paga Ativa)</span>
                <input type="checkbox" checked={config.admin_paid_key_enabled} onChange={(e) => setConfig({ ...config, admin_paid_key_enabled: e.target.checked })} className="size-5 accent-emerald-600 cursor-pointer" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Controla se a sua API paga centralizada está operacional para processar requisições.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end pt-6 border-t border-slate-100">
            <button onClick={() => salvarConfiguracoesGlobais(config)} disabled={salvandoConfig} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-70">
              {salvandoConfig ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />} Salvar Alterações Globais
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden mb-10">
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
                  <th className="py-4 px-4 font-bold">Chave API do Cliente</th>
                  <th className="py-4 px-4 font-bold">Ações Rápidas & Permissões</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {user.nome || user.email || 'Sem Nome'}
                        {user.status === 'ativo' ? <CheckCircle className="size-3 text-emerald-500" /> : <XCircle className="size-3 text-rose-500" />}
                      </div>
                      <div className="text-slate-400 text-xs font-mono mt-0.5">{user.id}</div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <button onClick={() => alternarStatus(user.id, user.status)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase shadow-sm transition-all ${user.status === 'ativo' ? 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50' : 'bg-emerald-600 text-white border border-transparent hover:bg-emerald-700'}`}>
                        {user.status === 'ativo' ? 'Bloquear' : 'Ativar'}
                      </button>
                    </td>

                    <td className="py-4 px-4">
                      {user.user_api_key ? (
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 text-xs font-mono">
                            {chavesVisiveis[user.id] 
                              ? user.user_api_key 
                              : `${user.user_api_key.substring(0, 8)}••••••••${user.user_api_key.substring(user.user_api_key.length - 4)}`}
                          </code>
                          <button onClick={() => toggleVisibilidadeChave(user.id)} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Mostrar/Ocultar Chave">
                            {chavesVisiveis[user.id] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Sem chave cadastrada</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1 items-center">
                          <span className="flex items-center justify-center bg-amber-50 min-w-[60px] px-2 py-1.5 rounded-md border border-amber-200 text-amber-700 font-bold text-xs mr-2">
                            <Zap className="size-3 fill-amber-500 mr-1" /> {user.credits || 0}
                          </span>
                          <button onClick={() => alterarCreditos(user.id, user.credits || 0, 100)} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200 hover:bg-emerald-100">+100</button>
                          <button onClick={() => alterarCreditos(user.id, user.credits || 0, 500)} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-200 hover:bg-indigo-100">+500</button>
                        </div>
                        <button onClick={() => alternarByokIndividual(user.id, user.allow_byok)} className={`w-fit px-3 py-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg border transition-colors ${user.allow_byok ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'}`} title="Permite o usuário colocar a chave dele">
                           <Key className="size-3" /> {user.allow_byok ? 'Chave (BYOK) Liberada' : 'Chave (BYOK) Bloqueada'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr><td colSpan={4} className="py-16 text-center text-slate-500 font-medium">Nenhum usuário cadastrado no momento. (Crie uma conta para testar)</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" /> Relatório de Falhas da IA (Últimos Logs)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="py-4 px-4 font-bold">Data / Hora</th>
                  <th className="py-4 px-4 font-bold">Status Final</th>
                  <th className="py-4 px-4 font-bold">Tentativas / Motivos de Falha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {apiLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600 font-medium text-xs">{new Date(log.data_hora).toLocaleString('pt-BR')}</td>
                    <td className="py-4 px-4">
                      {log.sucesso_final ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">Recuperado</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200">Falha Total</span>
                      )}
                    </td>
                    <td className="py-4 px-4"><pre className="bg-slate-100 p-3 rounded-lg text-[10px] text-slate-600 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto border border-slate-200 custom-scrollbar">{log.modelos_falhos}</pre></td>
                  </tr>
                ))}
                {apiLogs.length === 0 && (
                  <tr><td colSpan={3} className="py-16 text-center text-slate-500 font-medium">Nenhum registro de falha recente. A API está rodando 100% lisa.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}