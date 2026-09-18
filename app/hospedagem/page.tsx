'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Sparkles, Rocket, ExternalLink, ArrowLeft, ShieldCheck, Key, Camera, Cpu, Image as ImageIcon, Film, ChevronDown, ChevronUp } from 'lucide-react';

export default function HospedagemTutorialPage() {
  const router = useRouter();
  const [showUnsplashImages, setShowUnsplashImages] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Botão Voltar */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl transition shadow-sm mb-8">
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
          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Aprenda a configurar suas chaves de inteligência artificial e bancos de imagens (APIs) para automatizar o seu construtor e a colocar seu site no ar gratuitamente.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* ==========================================
              SEÇÃO 1: API GOOGLE GEMINI (INTELIGÊNCIA)
          ========================================== */}
          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Cpu className="size-6 text-purple-600" /> 1. Configurar Inteligência Artificial (Google Gemini)
            </h3>
            
            <div className="bg-white rounded-3xl border-2 border-purple-500 shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
                  <Key className="size-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Chave de API do Google Gemini</h2>
                  <p className="text-sm md:text-base text-slate-500 mt-1">Dá o "cérebro" ao seu sistema para estruturar textos e layouts automáticos.</p>
                </div>
              </div>

              <div className="space-y-4 mb-8 text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                <p>1. Acesse o <strong>Google AI Studio</strong> com sua conta Google padrão através do botão abaixo.</p>
                <p>2. Clique no botão de criar chave de API (<strong>Create API Key</strong>).</p>
                <p>3. Copie o código gerado e insira no painel principal do construtor.</p>
              </div>

              <div className="flex justify-end pt-5 border-t border-slate-100">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center gap-2">
                  Acessar Google AI Studio <ExternalLink className="size-5" />
                </a>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* ==========================================
              SEÇÃO 2: API UNSPLASH (IMAGENS)
          ========================================== */}
          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Camera className="size-6 text-sky-500" /> 2. Configurar Imagens Automáticas (Unsplash)
            </h3>
            
            <div className="bg-white rounded-3xl border-2 border-sky-400 shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 shrink-0 shadow-sm">
                  <Key className="size-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Chave de API do Unsplash</h2>
                  <p className="text-sm md:text-base text-slate-500 mt-1">Garante buscas de fotografias em alta resolução para o seu construtor.</p>
                </div>
              </div>

              <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                Acesse o portal de desenvolvedores da Unsplash, crie uma aplicação gratuita e copie o seu código de acesso (<strong>Access Key</strong>) para colar no campo correspondente no painel do construtor.
              </p>

              {/* Botão de Toggle para as Imagens do Unsplash */}
              <div className="mt-6 mb-6">
                <button
                  onClick={() => setShowUnsplashImages(!showUnsplashImages)}
                  className="flex items-center gap-2 px-5 py-3 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-sm rounded-xl transition-colors border border-sky-200"
                >
                  <ImageIcon className="size-5" />
                  {showUnsplashImages ? 'Ocultar passo a passo visual' : 'Ver passo a passo em imagens'}
                  {showUnsplashImages ? <ChevronUp className="size-5 ml-1" /> : <ChevronDown className="size-5 ml-1" />}
                </button>

                {/* Container das Imagens do Tutorial */}
                {showUnsplashImages && (
                  <div className="mt-6 space-y-6 bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <p className="font-bold text-slate-700">Passo 1:</p>
                      <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlgnygu8X_y_bba9n0K6hdW5PgtJu6Upd5pmVaymGcsHgK3gn8xhyphenhyphensAnPeEp5Z623YL7nkJpvTR5NMi1AwKRYpg1P98to9N9GakBffe3zDeEnTKuhLOk4xDTsovhc_G7iPiMQSIbw47O7Vnwt9MWm4pCplUS-EIUzKvOvjH7PvkfEDjbwcaV__nB7Xags/s1600/u1.png" alt="Passo 1 Unsplash" className="w-full rounded-xl shadow-md border border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-slate-700">Passo 2:</p>
                      <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEizEg9lt25qwZXPA3oe9GhSQXonsCeLHNuiUxin9uLHceTQBjavHQMb7aIEgiZwSn3K1II40IDIVO_mwR0dYrBqzDGIwoZziG8whwodMtrPPF3yOyu1dxiTscYNZb3txHMsRjr5ckpmUR1YXKK0ua_8mV2HoVOU8EUYDEGkGjW03dFx0c_JM7BSA7bc6G8/s1600/u2.png" alt="Passo 2 Unsplash" className="w-full rounded-xl shadow-md border border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-slate-700">Passo 3:</p>
                      <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVuBBzhYv9tJe43YHodBN2B_ONH8mzOb4qnslS-IsAjdjK0Z44-udA8-847GOJy9Bl-8DlL8NZSVxkx_wK4W1EydOQ6ZAjmz_14-CTu4ecd3Hwter7SA31Q23efErOys8R8I1kvAp6XIIBdlySw9fkU_bMJRfhuZm4yVqjwafIiKAZaFoNBbZMWOrbxqU/s1600/u3.png" alt="Passo 3 Unsplash" className="w-full rounded-xl shadow-md border border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-slate-700">Passo 4 (Copiar a chave):</p>
                      <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYaks0PkeMMsb_GDHwQbQoifdnQNomL7JtIx1AIvMAgAp3emlbxosTmrO5gniALq6vfeR3gA14Cl10RLy06KKMx9Jg6jNyx9M5qSAEc4dvOhqoZD8lwxyePYyHJMldc4dV1LDe2_iB2vb5B7S96Y1NYs8l5gHGgiUPmHcq1USJElvUfhFsWdCfJIv9TgM/s1600/u4.png" alt="Passo 4 Unsplash" className="w-full rounded-xl shadow-md border border-slate-200" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-5 border-t border-slate-100">
                <a 
                  href="https://unsplash.com/oauth/applications" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-sky-200 transition-all flex items-center gap-2">
                  Pegar Chave Unsplash <ExternalLink className="size-5" />
                </a>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* ==========================================
              SEÇÃO 3: API PEXELS (IMAGENS)
          ========================================== */}
          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <ImageIcon className="size-6 text-emerald-600" /> 3. Configurar Banco de Imagens Pexels (Rotação 2)
            </h3>
            
            <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                  <Key className="size-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Chave de API do Pexels</h2>
                  <p className="text-sm md:text-base text-slate-500 mt-1">Permite até 20.000 requisições mensais gratuitas de imagens impressionantes.</p>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                <p>1. Acesse o site oficial do Pexels dedicado a desenvolvedores através do botão abaixo.</p>
                <p>2. Faça o seu cadastro gratuito ou login na plataforma.</p>
                <p>3. Preencha o formulário simples informando o uso (ex: ferramenta de design) e copie a sua <strong>API Key</strong> gerada na tela.</p>
              </div>

              <div className="flex justify-end pt-5 border-t border-slate-100">
                <a 
                  href="https://www.pexels.com/api/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                  Pegar Chave Pexels <ExternalLink className="size-5" />
                </a>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* ==========================================
              SEÇÃO 4: API PIXABAY (IMAGENS)
          ========================================== */}
          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Film className="size-6 text-amber-500" /> 4. Configurar Banco de Imagens Pixabay (Rotação 3)
            </h3>
            
            <div className="bg-white rounded-3xl border-2 border-amber-500 shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                  <Key className="size-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Chave de API do Pixabay</h2>
                  <p className="text-sm md:text-base text-slate-500 mt-1">Oferece limite robusto de 5.000 requisições por hora para o seu sistema.</p>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                <p>1. Entre na sua conta do Pixabay utilizando o link direto abaixo.</p>
                <p>2. Role a documentação da API para baixo até localizar a seção <strong>Parameters</strong>.</p>
                <p>3. Na linha escrita <strong>key</strong>, copie a sequência numérica e alfanumérica destacada em verde na tela para colá-la no construtor.</p>
              </div>

              <div className="flex justify-end pt-5 border-t border-slate-100">
                <a 
                  href="https://pixabay.com/api/docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center gap-2">
                  Pegar Chave Pixabay <ExternalLink className="size-5" />
                </a>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* ==========================================
              SEÇÃO 5: HOSPEDAGEM
          ========================================== */}
          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <Globe className="size-6 text-indigo-600" /> 5. Como Publicar Seu Site
            </h3>
            
            {/* OPÇÃO 1: RECOMENDADA (NETLIFY DROP) */}
            <div className="bg-white rounded-3xl border-2 border-indigo-600 shadow-xl p-6 md:p-8 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest px-5 py-2 rounded-bl-2xl shadow-sm flex items-center gap-1.5">
                <Sparkles className="size-4" /> A Mais Fácil (Recomendada)
              </div>

              <div className="flex items-start gap-4 mb-6 mt-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                  <Rocket className="size-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Netlify Drop (Arraste e Solte)</h2>
                  <p className="text-sm md:text-base text-slate-500 mt-1">Ideal para iniciantes. Não precisa criar conta para publicar o site em segundos.</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                    Clique no botão <strong>"Baixar Site"</strong> lá no topo do editor para salvar o arquivo HTML no seu computador.
                  </p>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                    Acesse o site oficial de publicação rápida clicando no botão roxo logo abaixo.
                  </p>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                    Basta <strong>arrastar o arquivo baixado</strong> do seu computador e soltá-lo na área tracejada da página do Netlify. Pronto! Seu site estará no ar instantaneamente.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-center justify-between pt-6 border-t border-slate-100">
                <span className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                  <ShieldCheck className="size-5 text-emerald-500" /> Servidores seguros com SSL automático
                </span>
                <a 
                  href="https://drop.netlify.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                  Abrir Netlify Drop <ExternalLink className="size-5" />
                </a>
              </div>
            </div>

            {/* OPÇÃO 2: ALTERNATIVA (VERCEL) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-sm">
                  <Globe className="size-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Vercel (Para Projetos Definitivos)</h2>
                  <p className="text-sm md:text-base text-slate-500 mt-1">Excelente opção para quem deseja gerenciar vários sites e conectar domínios.</p>
                </div>
              </div>
              <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                A Vercel oferece uma infraestrutura gratuita de nível mundial para páginas estáticas. Basta criar uma conta gratuita e importar seu arquivo.
              </p>
              <div className="flex justify-end pt-5 border-t border-slate-100">
                <a 
                  href="https://vercel.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm">
                  Acessar Vercel <ExternalLink className="size-5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}