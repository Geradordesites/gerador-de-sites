'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Sparkles, Rocket, ExternalLink, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function HospedagemTutorialPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Botão Voltar */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition shadow-sm mb-8">
          <ArrowLeft className="size-4" /> Voltar ao Construtor
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4">
            <Globe className="size-3.5" /> Hospedagem 100% Gratuita
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Como Colocar Seu Site no Ar em Minutos
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Depois de baixar o arquivo do seu site, você não precisa pagar nada de hospedagem. Escolha uma das opções abaixo para publicar seu projeto na internet agora mesmo!
          </p>
        </div>

        {/* OPÇÃO 1: RECOMENDADA (NETLIFY DROP) */}
        <div className="bg-white rounded-3xl border-2 border-indigo-600 shadow-xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> A Mais Fácil (Recomendada)
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
              <Rocket className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Opção 1: Netlify Drop (Arraste e Solte)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Ideal para iniciantes. Não precisa criar conta para publicar o site em segundos.</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                Clique no botão <strong>"Baixar Site"</strong> lá no topo do editor para salvar o arquivo HTML no seu computador.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                Acesse o site oficial de publicação rápida clicando no botão verde logo abaixo.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                Basta <strong>arrastar o arquivo baixado</strong> do seu computador e soltá-lo na área tracejada da página do Netlify. Pronto! Seu site estará no ar instantaneamente.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" /> Servidores seguros com SSL (HTTPS) automático
            </span>
            <a 
              href="https://drop.netlify.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
              Abrir Netlify Drop <ExternalLink className="size-4" />
            </a>
          </div>
        </div>

        {/* OPÇÃO 2: ALTERNATIVA (VERCEL) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-sm">
              <Globe className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Opção 2: Vercel (Para Projetos Definitivos)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Excelente opção para quem deseja gerenciar vários sites e conectar domínios personalizados.</p>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6">
            A Vercel oferece uma infraestrutura gratuita de nível mundial para páginas estáticas. Basta criar uma conta gratuita e importar seu arquivo.
          </p>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <a 
              href="https://vercel.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm">
              Acessar Vercel <ExternalLink className="size-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}