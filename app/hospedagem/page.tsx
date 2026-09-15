'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Sparkles, Rocket, ExternalLink, ArrowLeft, ShieldCheck, Key, Camera, Cpu } from 'lucide-react';

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
            <ShieldCheck className="size-3.5" /> Central de Configurações
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Tutoriais e Publicação
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Aprenda a colocar seu site no ar gratuitamente e a configurar suas chaves de inteligência artificial (APIs) para automatizar a criação de textos e imagens.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* ==========================================
              SEÇÃO 1: HOSPEDAGEM (EXISTENTE)
          ========================================== */}
          <div>
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Globe className="size-5 text-indigo-600" /> 1. Como Publicar Seu Site
            </h3>
            
            {/* OPÇÃO 1: RECOMENDADA (NETLIFY DROP) */}
            <div className="bg-white rounded-3xl border-2 border-indigo-600 shadow-xl p-6 md:p-8 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> A Mais Fácil (Recomendada)
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                  <Rocket className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Netlify Drop (Arraste e Solte)</h2>
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
                  <ShieldCheck className="size-4 text-emerald-500" /> Servidores seguros com SSL automático
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
                  <h2 className="text-xl font-black text-slate-900">Vercel (Para Projetos Definitivos)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Excelente opção para quem deseja gerenciar vários sites e conectar domínios.</p>
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

          <hr className="border-slate-200" />

          {/* ==========================================
              SEÇÃO 2: API UNSPLASH (IMAGENS)
          ========================================== */}
          <div>
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Camera className="size-5 text-sky-500" /> 2. Configurar Imagens Automáticas (Unsplash)
            </h3>
            
            <div className="bg-white rounded-3xl border-2 border-sky-400 shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 shrink-0 shadow-sm">
                  <Key className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Chave de API do Unsplash</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Siga o passo a passo abaixo para liberar buscas ilimitadas de fotos em alta resolução para o seu construtor.</p>
                </div>
              </div>

              <div className="space-y-8 mb-8">
                {/* Passo 1 */}
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-sky-500 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-1">1</span>
                  <div className="w-full">
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Acesse o portal de desenvolvedores da Unsplash clicando no botão abaixo e faça login (ou crie uma conta gratuita). Em seguida, clique em <strong>"New Application"</strong>.
                    </p>
                    <a href="https://unsplash.com/oauth/applications" target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg mb-4 transition-all">
                      Acessar Portal Unsplash <ExternalLink className="size-3.5 ml-2" />
                    </a>
                    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlgnygu8X_y_bba9n0K6hdW5PgtJu6Upd5pmVaymGcsHgK3gn8xhyphenhyphensAnPeEp5Z623YL7nkJpvTR5NMi1AwKRYpg1P98to9N9GakBffe3zDeEnTKuhLOk4xDTsovhc_G7iPiMQSIbw47O7Vnwt9MWm4pCplUS-EIUzKvOvjH7PvkfEDjbwcaV__nB7Xags/s1600/u1.png" alt="Passo 1 Unsplash" className="w-full max-w-2xl rounded-xl border border-slate-200 shadow-sm" />
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-sky-500 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-1">2</span>
                  <div className="w-full">
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Leia as diretrizes de uso, marque todas as caixas de seleção confirmando que você concorda com os termos e clique no botão <strong>"Accept terms"</strong>.
                    </p>
                    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEizEg9lt25qwZXPA3oe9GhSQXonsCeLHNuiUxin9uLHceTQBjavHQMb7aIEgiZwSn3K1II40IDIVO_mwR0dYrBqzDGIwoZziG8whwodMtrPPF3yOyu1dxiTscYNZb3txHMsRjr5ckpmUR1YXKK0ua_8mV2HoVOU8EUYDEGkGjW03dFx0c_JM7BSA7bc6G8/s1600/u2.png" alt="Passo 2 Unsplash" className="w-full max-w-2xl rounded-xl border border-slate-200 shadow-sm" />
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-sky-500 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-1">3</span>
                  <div className="w-full">
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Preencha o nome do seu aplicativo (ex: <em>"Meu Construtor de Sites"</em>) e uma breve descrição. Depois, clique em <strong>"Create application"</strong>.
                    </p>
                    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVuBBzhYv9tJe43YHodBN2B_ONH8mzOb4qnslS-IsAjdjK0Z44-udA8-847GOJy9Bl-8DlL8NZSVxkx_wK4W1EydOQ6ZAjmz_14-CTu4ecd3Hwter7SA31Q23efErOys8R8I1kvAp6XIIBdlySw9fkU_bMJRfhuZm4yVqjwafIiKAZaFoNBbZMWOrbxqU/s1600/u3.png" alt="Passo 3 Unsplash" className="w-full max-w-2xl rounded-xl border border-slate-200 shadow-sm" />
                  </div>
                </div>

                {/* Passo 4 */}
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-sky-500 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-1">4</span>
                  <div className="w-full">
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">
                      Role a página recém-criada para baixo até encontrar a seção "Keys". Copie o código longo que aparece em <strong>Access Key</strong> e cole no painel de configurações do seu editor!
                    </p>
                    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYaks0PkeMMsb_GDHwQbQoifdnQNomL7JtIx1AIvMAgAp3emlbxosTmrO5gniALq6vfeR3gA14Cl10RLy06KKMx9Jg6jNyx9M5qSAEc4dvOhqoZD8lwxyePYyHJMldc4dV1LDe2_iB2vb5B7S96Y1NYs8l5gHGgiUPmHcq1USJElvUfhFsWdCfJIv9TgM/s1600/u4.png" alt="Passo 4 Unsplash" className="w-full max-w-2xl rounded-xl border border-slate-200 shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* ==========================================
              SEÇÃO 3: API GOOGLE GEMINI (INTELIGÊNCIA)
          ========================================== */}
          <div>
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Cpu className="size-5 text-purple-600" /> 3. Configurar Inteligência Artificial (Google)
            </h3>
            
            <div className="bg-white rounded-3xl border-2 border-purple-500 shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
                  <Key className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Chave de API do Google Gemini</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Esta é a chave que dá "cérebro" ao seu sistema para gerar os textos e o layout dos sites.</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                    Acesse a plataforma <strong>Google AI Studio</strong> clicando no botão abaixo e faça login com a sua conta Google normal (a mesma do Gmail).
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                    No menu lateral esquerdo ou no centro da tela, procure e clique no botão azul <strong>"Get API Key"</strong> ou <strong>"Create API Key"</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                    Clique no botão de criar chave em um novo projeto. O Google irá gerar um código alfanumérico longo. <strong>Copie essa chave</strong> e cole no painel de configurações do seu editor!
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center gap-2">
                  Acessar Google AI Studio <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}