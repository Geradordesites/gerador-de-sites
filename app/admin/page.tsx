'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Users, Shield, Zap, Key, CheckCircle, XCircle, Loader2, AlertTriangle, Eye, EyeOff, CalendarDays, FlaskConical } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [config, setConfig] = useState<any>({ byok_enabled: true, admin_paid_key_enabled: true, global_admin_key_enabled: false })
  const [apiLogs, setApiLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [salvandoConfig, setSalvandoConfig] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
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
    // Garanta que a coluna 'unsplash_api_key' está no select
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
      await supabase.from('system_settings').upsert({ id: 'global', byok_enabled: true, admin_paid_key_enabled: true, global_admin_key_enabled: false })
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

  const definirCreditosManuais = async (userId: string, valorDigitado: string) => {
    const novoValor = parseInt(valorDigitado);
    if (isNaN(novoValor) || novoValor < 0) return;
    const { error } = await supabase.from('profiles').update({ credits: novoValor }).eq('id', userId)
    if (error) alert('Erro ao definir créditos!')
    else setUsuarios(usuarios.map(u => u.id === userId ? { ...u, credits: novoValor } : u))
  }

  const alterarTempoPlanoDias = async (userId: string, dataAtual: string | null, diasParaSomarOuSubtrair: number) => {
    let base = dataAtual && new Date(dataAtual) > new Date() ? new Date(dataAtual) : new Date();
    base.setDate(base.getDate() + diasParaSomarOuSubtrair);
    
    const novaDataIso = base.toISOString();
    const { error } = await supabase.from('profiles').update({ plan_expiration: novaDataIso }).eq('id', userId);
    
    if (error) alert('Erro ao atualizar validade do plano!');
    else {
      setUsuarios(usuarios.map(u => u.id === userId ? { ...u, plan_expiration: novaDataIso } : u));
    }
  }

  const definirValidadeManual = async (userId: string, dataString: string) => {
    let novaIso = null;
    if (dataString) {
      novaIso = new Date(dataString + 'T12:00:00Z').toISOString();
    }
    const { error } = await supabase.from('profiles').update({ plan_expiration: novaIso }).eq('id', userId);
    if (error) alert('Erro ao atualizar validade!');
    else setUsuarios(usuarios.map(u => u.id === userId ? { ...u, plan_expiration: novaIso } : u));
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

  const alternarChaveTesteAdmin = async (userId: string, statusAtual: boolean) => {
    const novoStatus = !statusAtual
    const { error } = await supabase.from('profiles').update({ allow_admin_test_key: novoStatus }).eq('id', userId)
    if (error) alert('Erro ao alterar permissão de chave teste!')
    else setUsuarios(usuarios.map(u => u.id === userId ? { ...u, allow_admin_test_key: novoStatus } : u))
  }

  const salvarConfiguracoesGlobais = async (novaConfig: any) => {
    setSalvandoConfig(true)
    const { error } = await supabase
      .from('system_settings')
      .upsert({ 
        id: 'global',
        byok_enabled: novaConfig.byok_enabled, 
        admin_paid_key_enabled: novaConfig.admin_paid_key_enabled,
        global_admin_key_enabled: novaConfig.global_admin_key_enabled 
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

  const toggleVisibilidadeChave = (keyId: string) => {
    setChavesVisiveis(prev => ({ ...prev, [keyId]: !prev[keyId] }))
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
      <div className="max-w-[1400px] mx-auto">
        
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

        {/* CONTROLES GLOBAIS DE IA & BYOK */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Key className="size-5 text-amber-500" /> Controles Globais de IA & BYOK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-slate-900">Permitir Chave Própria (BYOK)</span>
                  <input type="checkbox" checked={config.byok_enabled} onChange={(e) => setConfig({ ...config, byok_enabled: e.target.checked })} className="size-5 accent-emerald-600 cursor-pointer" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Se ativado, TODOS os clientes poderão inserir a própria chave. Se desativado, apenas quem tiver permissão individual poderá.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-slate-900">Sua Chave Central (API Paga)</span>
                  <input type="checkbox" checked={config.admin_paid_key_enabled} onChange={(e) => setConfig({ ...config, admin_paid_key_enabled: e.target.checked })} className="size-5 accent-emerald-600 cursor-pointer" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Controla se a sua API paga centralizada está operacional para processar requisições através de Créditos.</p>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-colors h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-indigo-950">Chave Global do Admin</span>
                  <input type="checkbox" checked={config.global_admin_key_enabled} onChange={(e) => setConfig({ ...config, global_admin_key_enabled: e.target.checked })} className="size-5 accent-indigo-600 cursor-pointer" />
                </div>
                <p className="text-xs text-indigo-900/70 leading-relaxed">Se ativado, todos os clientes sem chave própria usarão a sua chave mestre de Administrador para as requisições.</p>
              </div>
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
              <Users className="size-5 text-indigo-600" /> Gestão de Clientes e Financeiro ({usuarios.length})
            </h2>
          </div>
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider bg-slate-50">
                  <th className="py-4 px-4 font-bold rounded-tl-lg">Cliente / E-mail</th>
                  <th className="py-4 px-4 font-bold">Gerenciar Créditos</th>
                  <th className="py-4 px-4 font-bold">Assinatura Mensal / Validade</th>
                  <th className="py-4 px-4 font-bold">Chave Própria (Gemini)</th>
                  <th className="py-4 px-4 font-bold">Chave Unsplash</th>
                  <th className="py-4 px-4 font-bold rounded-tr-lg">Permissões Especiais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {usuarios.map((user) => {
                  let badgeVencimento = null;
                  if (user.plan_expiration) {
                    const diffDias = Math.ceil((new Date(user.plan_expiration).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    if (diffDias < 0) {
                      badgeVencimento = <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded border border-rose-200 ml-2">Expirado</span>;
                    } else if (diffDias <= 5) {
                      badgeVencimento = <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 ml-2 animate-pulse" title="Vence em breve!">⚠️ Vence em {diffDias}d</span>;
                    } else {
                      badgeVencimento = <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-rose-200 ml-2">Ativo</span>;
                    }
                  } else {
                    badgeVencimento = <span className="text-[10px] text-slate-400 italic ml-2">Sem plano</span>;
                  }

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                     <td className="py-5 px-4 align-top">
                        {user.user_api_key ? (
                          <div className="flex items-center gap-2">
                            <code className="bg-slate-100 text-slate-700 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-mono max-w-[130px] overflow-hidden truncate block">
                              {chavesVisiveis[`${user.id}_gemini`] ? user.user_api_key : `${user.user_api_key.substring(0, 6)}••••••••`}
                            </code>
                            <button onClick={() => toggleVisibilidadeChave(`${user.id}_gemini`)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1" title="Mostrar/Ocultar Chave">
                              {chavesVisiveis[`${user.id}_gemini`] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic bg-slate-50 px-2 py-1 rounded">Sem chave Gemini</span>
                        )}
                      </td>

                      <td className="py-5 px-4 align-top">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 text-amber-800 font-black text-sm">
                              <Zap className="size-4 fill-amber-500 mr-1" /> {user.credits || 0}
                            </span>
                            <input 
                              type="number" 
                              defaultValue={user.credits || 0} 
                              key={user.credits}
                              onBlur={(e) => definirCreditosManuais(user.id, e.target.value)}
                              className="w-20 px-2 py-1 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 focus:bg-white outline-none"
                              title="Digite e clique fora para definir valor exato"
                            />
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => alterarCreditos(user.id, user.credits || 0, 100)} className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded border border-slate-200 shadow-sm">+100</button>
                            <button onClick={() => alterarCreditos(user.id, user.credits || 0, 500)} className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded border border-slate-200 shadow-sm">+500</button>
                            <button onClick={() => alterarCreditos(user.id, user.credits || 0, -100)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-bold rounded border border-slate-200 shadow-sm">-100</button>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-4 align-top bg-slate-50/50 border-l border-r border-slate-100">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center flex-wrap gap-2">
                            <input 
                              type="date"
                              value={user.plan_expiration ? user.plan_expiration.split('T')[0] : ''}
                              onChange={(e) => definirValidadeManual(user.id, e.target.value)}
                              className="px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white text-slate-700 focus:border-indigo-500 outline-none shadow-sm cursor-pointer"
                              title="Clique para escolher a data exata de vencimento"
                            />
                            {badgeVencimento}
                          </div>
                          <div className="flex gap-1.5 mt-1 flex-wrap">
                            <button onClick={() => alterarTempoPlanoDias(user.id, user.plan_expiration, 30)} className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded border border-indigo-200 shadow-sm" title="Adicionar 30 Dias">+ 30d</button>
                            <button onClick={() => alterarTempoPlanoDias(user.id, user.plan_expiration, -30)} className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded border border-rose-200 shadow-sm" title="Reduzir 30 Dias">- 30d</button>
                            <button onClick={() => definirValidadeManual(user.id, '')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded border border-slate-300 shadow-sm" title="Remover Plano">Zerar</button>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-4 align-top">
                        {user.client_api_key ? (
                          <div className="flex items-center gap-2">
                            <code className="bg-slate-100 text-slate-700 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-mono max-w-[130px] overflow-hidden truncate block">
                              {chavesVisiveis[`${user.id}_gemini`] ? user.client_api_key : `${user.client_api_key.substring(0, 6)}••••••••`}
                            </code>
                            <button onClick={() => toggleVisibilidadeChave(`${user.id}_gemini`)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1" title="Mostrar/Ocultar Chave">
                              {chavesVisiveis[`${user.id}_gemini`] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic bg-slate-50 px-2 py-1 rounded">Sem chave Gemini</span>
                        )}
                      </td>
                      
                      <td className="py-5 px-4 align-top">
                        {user.unsplash_api_key ? (
                          <div className="flex items-center gap-2">
                            <code className="bg-slate-100 text-slate-700 px-2 py-1.5 rounded-lg border border-slate-200 text-[10px] font-mono max-w-[130px] overflow-hidden truncate block">
                              {chavesVisiveis[`${user.id}_unsplash`] ? user.unsplash_api_key : `${user.unsplash_api_key.substring(0, 6)}••••••••`}
                            </code>
                            <button onClick={() => toggleVisibilidadeChave(`${user.id}_unsplash`)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1" title="Mostrar/Ocultar Chave Unsplash">
                              {chavesVisiveis[`${user.id}_unsplash`] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic bg-slate-50 px-2 py-1 rounded">Sem chave Unsplash</span>
                        )}
                      </td>

                      <td className="py-5 px-4 align-top">
                        <div className="flex flex-col gap-2 w-fit">
                          <button onClick={() => alternarByokIndividual(user.id, user.allow_byok)} className={`px-2.5 py-1.5 flex items-center justify-between gap-3 text-[10px] uppercase tracking-wider font-bold rounded-lg border transition-colors ${user.allow_byok ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`} title="Permite o usuário colar e usar a chave própria dele">
                             <span className="flex items-center"><Key className="size-3 mr-1.5" /> Liberar BYOK</span>
                             <div className={`w-2 h-2 rounded-full ${user.allow_byok ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                          </button>
                          
                          <button onClick={() => alternarChaveTesteAdmin(user.id, user.allow_admin_test_key)} className={`px-2.5 py-1.5 flex items-center justify-between gap-3 text-[10px] uppercase tracking-wider font-bold rounded-lg border transition-colors ${user.allow_admin_test_key ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`} title="VIP: Permite ele testar gastando créditos mas usando sua chave Admin">
                             <span className="flex items-center"><FlaskConical className="size-3 mr-1.5" /> Chave Teste Admin</span>
                             <div className={`w-2 h-2 rounded-full ${user.allow_admin_test_key ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {usuarios.length === 0 && (
                  <tr><td colSpan={6} className="py-16 text-center text-slate-500 font-medium">Nenhum usuário cadastrado no momento.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOGS DE FALHAS DA API */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" /> Relatório de Falhas da IA (Últimos Logs)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider bg-slate-50">
                  <th className="py-4 px-4 font-bold rounded-tl-lg">Data / Hora</th>
                  <th className="py-4 px-4 font-bold">Status Final</th>
                  <th className="py-4 px-4 font-bold rounded-tr-lg">Tentativas / Motivos de Falha</th>
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
                    <td className="py-4 px-4"><pre className="bg-white p-3 rounded-lg text-[10px] text-slate-600 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto border border-slate-200 custom-scrollbar">{log.modelos_falhos}</pre></td>
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
