'use client';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

// SCRIPT INJETADO NO IFRAME (MAGIA DO CLIQUE E EDIÇÃO VISUAL)
const SCRIPT_PREVIEW = `<script>
    let modoEdicao = false;
    let elSelecionado = null;

    function rgbToHex(rgb) {
        let res = rgb.match(/\\d+/g);
        if(!res) return '#000000';
        return "#" + res.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }

    window.addEventListener('message', (event) => {
        if(event.data.type === 'TOGGLE_EDIT_MODE') {
            modoEdicao = event.data.value;
            if(!modoEdicao && elSelecionado) { elSelecionado.style.outline = ''; elSelecionado = null; }
        }
        if(event.data.type === 'UPDATE_ELEMENT') {
            let el = document.getElementById(event.data.id);
            if(el) {
                if(event.data.text !== undefined) el.innerText = event.data.text;
                if(event.data.bgColor !== undefined) el.style.backgroundColor = event.data.bgColor;
                if(event.data.textColor !== undefined) el.style.color = event.data.textColor;
                if(event.data.fontSize !== undefined) el.style.fontSize = event.data.fontSize + 'px';
                
                window.parent.postMessage({ type: 'HTML_SYNC', html: '<!DOCTYPE html>\\n' + document.documentElement.outerHTML }, '*');
            }
        }
        if(event.data.type === 'REPLACE_ELEMENT_HTML') {
            let el = document.getElementById(event.data.id);
            if(el) {
                el.outerHTML = event.data.newHtml;
                window.parent.postMessage({ type: 'HTML_SYNC', html: '<!DOCTYPE html>\\n' + document.documentElement.outerHTML }, '*');
            }
        }
    });

    document.addEventListener('mouseover', (e) => {
        if(!modoEdicao || e.target === document.body || e.target === document.documentElement) return;
        e.target.dataset.oldOutline = e.target.style.outline;
        e.target.style.outline = '2px dashed #4f46e5';
        e.target.style.cursor = 'crosshair';
    });
    
    document.addEventListener('mouseout', (e) => {
        if(!modoEdicao || e.target === document.body || e.target === document.documentElement) return;
        if(e.target !== elSelecionado) { e.target.style.outline = e.target.dataset.oldOutline || ''; }
    });

    document.addEventListener('click', (e) => {
        var link = e.target.closest('a');
        if (link && !modoEdicao) {
            var href = link.getAttribute('href') || '';
            if(href.startsWith('#') || link.hasAttribute('onclick')) {
                // Deixa ancoras e funções JS funcionarem normalmente
            } else if (!href.startsWith('javascript:')) {
                e.preventDefault(); console.log('Navegação externa bloqueada pelo Escudo.');
            }
        }

        if(!modoEdicao) return;
        e.preventDefault(); e.stopPropagation();

        if(elSelecionado) elSelecionado.style.outline = '';
        elSelecionado = e.target;
        elSelecionado.style.outline = '3px solid #4f46e5';

        if(!elSelecionado.id) elSelecionado.id = 'el_' + Math.random().toString(36).substr(2,9);

        let compStyle = window.getComputedStyle(elSelecionado);
        window.parent.postMessage({
            type: 'ELEMENT_SELECTED',
            id: elSelecionado.id,
            tagName: elSelecionado.tagName.toLowerCase(),
            text: elSelecionado.innerText,
            bgColor: rgbToHex(compStyle.backgroundColor),
            textColor: rgbToHex(compStyle.color),
            fontSize: parseInt(compStyle.fontSize),
            outerHTML: elSelecionado.outerHTML
        }, '*');
    }, true); 
    window.addEventListener('submit', function(e) { e.preventDefault(); e.stopPropagation(); }, true);
</script>`;

export default function Home() {
  const [modalMeusSitesAberto, setModalMeusSitesAberto] = useState(false);
  const [listaSites, setListaSites] = useState<any[]>([]);
  const [carregandoSites, setCarregandoSites] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const SITES_POR_PAGINA = 6; 

  const [siteEditando, setSiteEditando] = useState<{id: string, slug: string, titulo: string} | null>(null);
  const [corSelecionada, setCorSelecionada] = useState('auto');
  const [uploadedImages, setUploadedImages] = useState<{ mimeType: string; data: string }[]>([]);
  const [historicoCodigo, setHistoricoCodigo] = useState<string[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<'preview' | 'code'>('preview');
  
  const [modoEdicaoVisual, setModoEdicaoVisual] = useState(false);
  const [elementoSelecionado, setElementoSelecionado] = useState<any>(null);
  const [statusApis, setStatusApis] = useState<{ texto: string; imagem: string }>({ texto: 'Aguardando ação...', imagem: '' });

  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; }
    };
    verificarSessao();

    const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'ELEMENT_SELECTED') setElementoSelecionado(e.data);
        if (e.data.type === 'HTML_SYNC') {
            const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
            if (codEl) {
                setHistoricoCodigo(prev => [...prev, codEl.value]);
                codEl.value = e.data.html;
            }
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/login'; };

  const toggleModoEdicao = () => {
      const newMode = !modoEdicaoVisual;
      setModoEdicaoVisual(newMode);
      setElementoSelecionado(null);
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      if(iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'TOGGLE_EDIT_MODE', value: newMode }, '*');
  };

  const atualizarElementoManual = (field: string, value: string | number) => {
      if(!elementoSelecionado) return;
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      iframe.contentWindow?.postMessage({ type: 'UPDATE_ELEMENT', id: elementoSelecionado.id, [field]: value }, '*');
      setElementoSelecionado((prev: any) => ({...prev, [field]: value}));
  };

  const refinarElementoComIA = async () => {
      const promptInput = document.getElementById('ai_prompt_element') as HTMLInputElement;
      const comando = promptInput.value.trim();
      if(!comando || !elementoSelecionado) { (window as any).showNotification("Digite o que deseja mudar na IA.", "error"); return; }

      const systemInstruction = `Você é um editor cirúrgico. Receberá o HTML de UM único elemento. Modifique apenas o que for pedido: "${comando}". 
      DEVOLVA APENAS o HTML atualizado do elemento. Preserve o atributo id="${elementoSelecionado.id}".`;
      
      const resData = await (window as any).chamarIABase(systemInstruction, [{text: `HTML ORIGINAL:\n${elementoSelecionado.outerHTML}`}], true);
      
      if(resData && resData.html) {
          const cleanHtml = resData.html.replace(/```html/gi, '').replace(/```/g, '').trim();
          const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
          iframe.contentWindow?.postMessage({ type: 'REPLACE_ELEMENT_HTML', id: elementoSelecionado.id, newHtml: cleanHtml }, '*');
          promptInput.value = '';
          (window as any).showNotification("Elemento alterado por IA!", "success");
      }
  };

  const carregarMeusSites = async () => {
    setCarregandoSites(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase.from('sites_gerados').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    if (!error) { setListaSites(data || []); setPaginaAtual(1); }
    setCarregandoSites(false);
    setModalMeusSitesAberto(true);
  };

  const deletarSite = async (id: string, slug: string) => {
    if (!confirm(`Deletar o site "${slug}"?`)) return;
    await supabase.from('sites_gerados').delete().eq('id', id);
    setListaSites(listaSites.filter(site => site.id !== id));
    if (siteEditando?.id === id) setSiteEditando(null);
  };

  const editarSite = (site: any) => {
    const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
    const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
    if (codEl) codEl.value = site.html_content;
    if (prevEl) prevEl.srcdoc = site.html_content + SCRIPT_PREVIEW; 
    setSiteEditando({ id: site.id, slug: site.slug, titulo: site.titulo });
    setModalMeusSitesAberto(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e: any) => setUploadedImages(prev => [...prev, { mimeType: file.type, data: e.target.result.split(',')[1] }]);
    reader.readAsDataURL(file);
  };

  const handleImageUploadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => processFile(file));
      e.target.value = '';
    }
  };

  const removerImagem = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && items[i].type.startsWith('image/')) processFile(items[i].getAsFile()!);
      }
    };
    document.body.addEventListener('paste', handlePaste);
    return () => document.body.removeEventListener('paste', handlePaste);
  }, []);

  useEffect(() => {
    (window as any).mudarModoApp = (modo: string) => {
      const btnV = document.getElementById('btnTabVisual'), btnC = document.getElementById('btnTabCopy');
      const contV = document.getElementById('containerModoVisual'), contC = document.getElementById('containerModoCopy');
      if (!btnV || !btnC || !contV || !contC) return;
      if (modo === 'visual') {
        btnV.className = "flex-1 py-1.5 text-xs font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50";
        btnC.className = "flex-1 py-1.5 text-xs font-semibold border-transparent text-gray-500 hover:bg-gray-50";
        contV.style.display = 'block'; contC.style.display = 'none';
      } else {
        btnC.className = "flex-1 py-1.5 text-xs font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50";
        btnV.className = "flex-1 py-1.5 text-xs font-semibold border-transparent text-gray-500 hover:bg-gray-50";
        contC.style.display = 'block'; contV.style.display = 'none';
      }
    };

    (window as any).chamarIABase = async (systemInstructionText: string, promptParts: any[], isElementRefinement = false) => {
      const loadOverlay = document.getElementById('loadingOverlay');
      if (loadOverlay) loadOverlay.style.display = 'flex';
      setStatusApis({ texto: isElementRefinement ? 'Micro-IA Ativa...' : 'Motores Ativos...', imagem: '' });

      try {
        const imageStyle = (document.getElementById('estiloImagem') as HTMLSelectElement)?.value || 'real';
        const dinamicaStyle = (document.getElementById('dinamicaSite') as HTMLSelectElement)?.value || 'estatico';

        const response = await fetch('/api/gerar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemInstruction: systemInstructionText, promptParts, imageStyle, dinamica: dinamicaStyle, isElementRefinement })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error === 'RATE_LIMIT_EXCEEDED' ? "LIMIT_MODAL" : data.error);
        return data;
      } catch (err: any) {
        (window as any).showNotification(err.message === "LIMIT_MODAL" ? "Cota atingida! Aguarde 1 min." : err.message, 'error');
        setStatusApis({ texto: 'Falha', imagem: '' }); return null;
      } finally {
        if (loadOverlay) loadOverlay.style.display = 'none';
      }
    };

    const getMegaPromptCores = () => {
      const cor = (document.getElementById('paletaCores') as HTMLSelectElement)?.value || 'auto';
      if (cor === 'personalizada') return `OVERRIDE - CORES: Fundo: ${(document.getElementById('corFundo') as HTMLInputElement)?.value}, Principal: ${(document.getElementById('corPrimaria') as HTMLInputElement)?.value}`;
      if (cor === 'auto') return "PALETA: Clone as cores exatas da referência.";
      return `PALETA: Use a paleta focada em ${cor.toUpperCase()}.`;
    };

    (window as any).executarGeracaoSite = async (imagesList: any[]) => {
      if (imagesList.length === 0) { (window as any).showNotification('Anexe referências visuais.', 'error'); return; }
      const isMenu = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked ? "CRIE MENU COM LINKS ÂNCORA." : "SEM MENU.";
      const estilo = (document.getElementById('nichoEstilo') as HTMLSelectElement)?.value || 'nenhum';
      
      let promptParts: any[] = [{ text: "Faça engenharia reversa exata. Não resuma textos." }];
      imagesList.forEach(img => promptParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } }));
      
      const data = await (window as any).chamarIABase(`Especialista Tailwind. ${isMenu} Estilo: ${estilo}. ${getMegaPromptCores()}`, promptParts);
      if (data) processarResposta(data);
    };

    (window as any).gerarSiteComCopy = async () => {
      const content = (document.getElementById('productContent') as HTMLTextAreaElement)?.value.trim();
      if (!content) return;
      const data = await (window as any).chamarIABase(`Copywriter Tailwind. Crie Landing Page completa.`, [{ text: content }]);
      if (data) processarResposta(data);
    };

    function processarResposta(data: any) {
        const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
        const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
        if (codEl) { setHistoricoCodigo(prev => [...prev, codEl.value]); codEl.value = data.html; }
        if (prevEl) prevEl.srcdoc = data.html + SCRIPT_PREVIEW; 
        setStatusApis({ texto: data.provedorTexto, imagem: '' });
        (window as any).showNotification(`Site gerado por ${data.provedorTexto}!`, 'success');
        setModoEdicaoVisual(false); 
    }

    (window as any).mudarSeparador = (aba: string) => {
      document.getElementById('previewFrame')!.classList.toggle('active', aba === 'preview');
      document.getElementById('codigoContainer')!.classList.toggle('active', aba === 'code');
      document.getElementById('tabPreview')!.classList.toggle('border-blue-600', aba === 'preview');
      document.getElementById('tabCode')!.classList.toggle('border-blue-600', aba === 'code');
    };

    (window as any).showNotification = (msg: string, type: string) => {
      const exist = document.getElementById('custom-toast'); if(exist) exist.remove();
      const div = document.createElement('div'); div.id = 'custom-toast';
      div.className = type === 'error' 
        ? `fixed top-10 left-1/2 -translate-x-1/2 bg-white border-l-4 border-red-500 px-6 py-4 rounded shadow-2xl z-[9999] flex gap-4 max-w-xl` 
        : `fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded shadow-xl z-[9999] flex gap-2`;
      div.innerHTML = type === 'error' ? `<i class="fas fa-exclamation-circle text-red-500 mt-1"></i> <div class="flex-1 text-sm font-medium text-slate-800">${msg}</div>` : `<i class="fas fa-check-circle"></i> <span class="text-sm font-medium">${msg}</span>`;
      document.body.appendChild(div);
      setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 500); }, 3000);
    };

    (window as any).copiarCodigo = () => {
      const txt = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!txt) return; navigator.clipboard.writeText(txt); (window as any).showNotification('Código copiado!', 'success');
    };

    (window as any).baixarHtmlGerado = () => {
      const txt = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!txt) return;
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/html' }));
      a.download = siteEditando ? `${siteEditando.slug}.html` : 'meu-site.html'; a.click();
    };

    (window as any).handlePublicarSite = async () => {
      const htmlContent = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!htmlContent) return;
      if (siteEditando) { await supabase.from('sites_gerados').update({ html_content: htmlContent }).eq('id', siteEditando.id); (window as any).showNotification('Atualizado!', 'success'); return; }
      const nome = prompt('Nome do site (título/link):'); if (!nome) return; 
      let slug = nome.trim().toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || nanoid(6); 
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('sites_gerados').insert([{ user_id: session?.user.id, slug, titulo: nome, html_content: htmlContent }]);
      navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      alert(`Publicado!\nLink: ${window.location.origin}/${slug}`);
    };
  }, [siteEditando]); 

  const desfazerCodigo = () => {
    if (historicoCodigo.length === 0) return;
    const ultimo = historicoCodigo[historicoCodigo.length - 1];
    setHistoricoCodigo(prev => prev.slice(0, prev.length - 1));
    (document.getElementById('codigoGerado') as HTMLTextAreaElement).value = ultimo;
    (document.getElementById('previewFrame') as HTMLIFrameElement).srcdoc = ultimo + SCRIPT_PREVIEW; 
    setElementoSelecionado(null);
  };

  const indexOfLastSite = paginaAtual * SITES_POR_PAGINA;
  const indexOfFirstSite = indexOfLastSite - SITES_POR_PAGINA;
  const sitesAtuais = listaSites.slice(indexOfFirstSite, indexOfLastSite);
  const totalPaginas = Math.ceil(listaSites.length / SITES_POR_PAGINA);

  const renderConteudoModal = () => {
    if (carregandoSites) return <p className="text-center text-sm text-slate-500">Carregando...</p>;
    if (listaSites.length === 0) return <div className="text-center py-16 text-slate-400 space-y-2"><p className="text-sm font-semibold">Nenhum site publicado.</p></div>;
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sitesAtuais.map((site) => {
            const linkUrl = `${window.location.origin}/${site.slug}`;
            return (
              <div key={site.id} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col">
                <h3 className="font-bold text-sm mb-2">{site.titulo}</h3>
                <input type="text" readOnly value={linkUrl} className="bg-slate-50 border rounded text-[11px] w-full p-1.5 mb-3" />
                <div className="flex justify-between items-center">
                  <a href={`/${site.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-semibold">Abrir Site</a>
                  <div className="flex gap-2">
                    <button onClick={() => editarSite(site)} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200">Editar</button>
                    <button onClick={() => deletarSite(site.id, site.slug)} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded border border-red-200">Deletar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded disabled:opacity-50 hover:bg-slate-200 transition">Anterior</button>
            <span className="text-xs font-semibold text-slate-500">Página {paginaAtual} de {totalPaginas}</span>
            <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded disabled:opacity-50 hover:bg-slate-200 transition">Próxima</button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="h-screen overflow-hidden flex relative bg-slate-100 text-slate-800 font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style dangerouslySetInnerHTML={{__html: `
        .card { background: white; border-radius: .5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0/0.05); padding: .75rem; display: flex; flex-direction: column; }
        .input-style { width: 100%; padding: .35rem .5rem; border-radius: .375rem; border: 1px solid #cbd5e1; font-size: .75rem; outline: none; }
        .input-style:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
        .primary-btn { background: #2563eb; color: white; font-weight: 600; display: flex; justify-content: center; align-items: center;}
        .primary-btn:hover { background: #1d4ed8; }
        .drop-zone { border: 2px dashed #94a3b8; border-radius: .5rem; background: #f8fafc; cursor: pointer; text-align: center; }
        .image-preview-item { position: relative; border-radius: .5rem; overflow: hidden; height: 60px; }
        .image-preview-item .remove-img { position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 8px; }
        #previewFrame, #codigoContainer { display: none; }
        #previewFrame.active, #codigoContainer.active { display: block; }
        #loadingOverlay { position: fixed; inset:0; background: rgba(15,23,42,0.95); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        #loadingSpinner { border: 4px solid rgba(59,130,246,0.2); border-top: 4px solid #3b82f6; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin-bottom: 2rem; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}} />

      {/* CONTAINER PRINCIPAL (ESTA É A CAIXA QUE TINHA SUMIDO) */}
      <div id="main-app-container" className="w-full h-full flex overflow-hidden">
        
        <div id="loadingOverlay" style={{ display: 'none' }}><div id="loadingSpinner"></div><p id="loadingText" className="text-white font-medium text-lg"></p></div>

        <div className="w-full md:w-[420px] bg-white shadow-xl flex flex-col h-full border-r border-gray-200 z-10">
              <div className="p-4 border-b border-gray-100 bg-slate-50 pb-0">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center mb-3">
                      <i className="fas fa-layer-group text-blue-600 mr-2"></i> Web Builder Pro
                  </h1>
                  <div className="flex border-b border-gray-200">
                      <button id="btnTabVisual" onClick={() => (window as any).mudarModoApp('visual')} className="flex-1 py-2 text-xs font-bold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50">Clonar & Visual</button>
                      <button id="btnTabCopy" onClick={() => (window as any).mudarModoApp('copy')} className="flex-1 py-2 text-xs font-bold text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:bg-gray-50">Texto P/ Site</button>
                  </div>
              </div>

              <div className="overflow-y-auto p-4 flex-grow custom-scrollbar flex flex-col bg-slate-50">
                  <button onClick={toggleModoEdicao} className={`w-full py-3 px-4 rounded-xl text-sm font-black shadow-sm flex items-center justify-center mb-5 transition-all ${modoEdicaoVisual ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50'}`}>
                      <i className={`fas ${modoEdicaoVisual ? 'fa-check-circle' : 'fa-mouse-pointer'} mr-2 text-lg`}></i> 
                      {modoEdicaoVisual ? 'Edição por Clique Ativada!' : 'Ativar Edição Visual por Clique'}
                  </button>

                  <div id="containerModoVisual" className="flex-1 flex flex-col">
                      {modoEdicaoVisual ? (
                          <div className="bg-white border-2 border-indigo-200 rounded-xl p-4 shadow-sm relative">
                              <div className="absolute -top-3 left-4 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">Editor Mágico</div>
                              
                              {!elementoSelecionado ? (
                                  <div className="text-center py-8 text-slate-400">
                                      <i className="fas fa-crosshairs text-3xl mb-3 text-indigo-300"></i>
                                      <p className="text-xs font-bold uppercase tracking-wider">Clique num elemento do site<br/>para editá-lo aqui.</p>
                                  </div>
                              ) : (
                                  <div className="space-y-4 pt-2">
                                      <div className="flex items-center gap-2 mb-1">
                                          <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">{elementoSelecionado.tagName.toUpperCase()}</span>
                                      </div>
                                      
                                      <div>
                                          <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block"><i className="fas fa-font mr-1"></i> Texto ou Conteúdo</label>
                                          <textarea rows={3} value={elementoSelecionado.text} onChange={(e) => atualizarElementoManual('text', e.target.value)} className="w-full text-xs p-2 border border-slate-300 rounded bg-slate-50 focus:border-indigo-500 focus:bg-white transition-colors resize-none"></textarea>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-3">
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block"><i className="fas fa-text-height mr-1"></i> Tamanho da Fonte</label>
                                              <input type="range" min="10" max="100" value={elementoSelecionado.fontSize || 16} onChange={(e) => atualizarElementoManual('fontSize', parseInt(e.target.value))} className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                          </div>
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block"><i className="fas fa-fill-drip mr-1"></i> Fundo (Cor)</label>
                                              <input type="color" value={elementoSelecionado.bgColor} onChange={(e) => atualizarElementoManual('bgColor', e.target.value)} className="w-full h-8 rounded cursor-pointer border border-slate-200 p-0 shadow-sm" />
                                          </div>
                                      </div>
                                      
                                      <div>
                                          <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block"><i className="fas fa-paint-brush mr-1"></i> Cor do Texto</label>
                                          <input type="color" value={elementoSelecionado.textColor} onChange={(e) => atualizarElementoManual('textColor', e.target.value)} className="w-full h-8 rounded cursor-pointer border border-slate-200 p-0 shadow-sm" />
                                      </div>

                                      <div className="border-t border-slate-100 pt-4 mt-2">
                                          <label className="text-[10px] font-black text-indigo-700 uppercase mb-1 flex items-center gap-1"><i className="fas fa-robot text-lg"></i> Inteligência Artificial</label>
                                          <div className="flex gap-2 mt-2">
                                              <input type="text" id="ai_prompt_element" placeholder="Ex: Mude este ícone para um foguete" className="input-style flex-1 bg-indigo-50 border-indigo-200 text-xs" />
                                              <button onClick={refinarElementoComIA} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 rounded shadow flex items-center justify-center" title="Pedir para IA"><i className="fas fa-magic"></i></button>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>
                      ) : (
                          <div className="space-y-3">
                              <details className="group bg-slate-50 border border-slate-200 rounded-lg shadow-sm" open>
                                  <summary className="font-bold text-[11px] text-slate-700 uppercase cursor-pointer px-3 py-2 flex items-center justify-between">
                                      <span><i className="fas fa-sliders-h mr-2"></i>Diretrizes e Cores</span>
                                      <span className="transition group-open:rotate-180"><i className="fas fa-chevron-down"></i></span>
                                  </summary>
                                  <div className="p-3 pt-1 border-t border-slate-200 space-y-2">
                                      <div className="flex flex-col gap-1">
                                          <label htmlFor="nichoEstilo" className="text-[9px] font-bold text-slate-600 uppercase">Estilo Visual do Site:</label>
                                          <select id="nichoEstilo" className="input-style bg-white border-slate-200">
                                              <option value="nenhum">⚪ Padrão Limpo</option>
                                              <option value="premium">💎 Premium (Elegante)</option>
                                              <option value="agressivo">⚡ Alta Conversão (Dark)</option>
                                              <option value="corporativo">🏢 Corporativo (Direto)</option>
                                          </select>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                          <label htmlFor="paletaCores" className="text-[9px] font-bold text-slate-600 uppercase">Paleta de Cores:</label>
                                          <select id="paletaCores" value={corSelecionada} onChange={(e) => setCorSelecionada(e.target.value)} className="input-style bg-white border-slate-200">
                                              <option value="auto">🎨 Extrair da Imagem (Automático)</option>
                                              <option value="azul">🔵 Azul Profundo</option>
                                              <option value="dark">⚫ Dark Mode Total</option>
                                              <option value="personalizada">🖌️ Personalizada...</option>
                                          </select>
                                          {corSelecionada === 'personalizada' && (
                                              <div className="flex gap-2 mt-2 p-2 bg-slate-100 rounded border border-slate-200">
                                                  <div className="flex-1"><label className="text-[9px] block mb-1 font-bold">Principal</label><input type="color" id="corPrimaria" className="w-full h-6 rounded border-none p-0 cursor-pointer" defaultValue="#2563eb" /></div>
                                                  <div className="flex-1"><label className="text-[9px] block mb-1 font-bold">Fundo</label><input type="color" id="corFundo" className="w-full h-6 rounded border-none p-0 cursor-pointer" defaultValue="#ffffff" /></div>
                                              </div>
                                          )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-2 py-1 bg-white border border-slate-200 rounded px-2">
                                          <input type="checkbox" id="checkComMenu" defaultChecked={false} className="w-3 h-3 text-blue-600 rounded cursor-pointer" />
                                          <label htmlFor="checkComMenu" className="text-[10px] font-bold text-slate-700 cursor-pointer">Criar Menu Superior (Âncoras)</label>
                                      </div>
                                  </div>
                              </details>

                              <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                                  <h3 className="font-bold text-xs text-blue-800 uppercase mb-2"><i className="fas fa-images mr-2"></i>Clonar Interface (Imagem)</h3>
                                  <div className="drop-zone py-4 border-dashed border-2 border-blue-100 bg-blue-50/30 hover:bg-blue-50 transition-colors" onClick={() => document.getElementById('imageUploadInput')?.click()}>
                                      <i className="fas fa-cloud-upload-alt text-2xl text-blue-400 mb-2"></i>
                                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Cole (Ctrl+V) ou Arraste</p>
                                  </div>
                                  <input type="file" id="imageUploadInput" multiple accept="image/*" className="hidden" onChange={handleImageUploadInput} />
                                  {uploadedImages.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                      {uploadedImages.map((imgObj, idx) => (
                                        <div key={idx} className="relative h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                          <img src={`data:${imgObj.mimeType};base64,${imgObj.data}`} className="w-full h-full object-cover" />
                                          <div className="absolute top-1 right-1 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[8px] cursor-pointer hover:bg-red-600" onClick={() => removerImagem(idx)}><i className="fas fa-times"></i></div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <button onClick={() => (window as any).executarGeracaoSite(uploadedImages)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-md mt-3 transition text-sm flex items-center justify-center gap-2">
                                      <i className="fas fa-bolt"></i> Clonar e Estruturar Site
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>

                  <div id="containerModoCopy" style={{ display: 'none' }} className="flex-1 flex flex-col">
                      <div className="bg-white border border-slate-200 rounded-xl p-3 flex-1 flex flex-col shadow-sm">
                          <label className="text-[10px] font-bold text-slate-500 uppercase mb-2"><i className="fas fa-file-alt mr-1"></i>Texto Base ou Comando</label>
                          <textarea id="productContent" className="input-style resize-none flex-1 mb-3 bg-slate-50 border-slate-200 focus:bg-white text-sm p-3" placeholder="Ex: Crie uma landing page para meu curso de inglês focado em negócios..."></textarea>
                          <button onClick={() => (window as any).gerarSiteComCopy()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow transition text-sm">
                              <i className="fas fa-pen-nib mr-2"></i> Criar Site Completo
                          </button>
                      </div>
                  </div>
              </div>
          </div>

          <div className="flex-grow flex flex-col bg-slate-200 relative">
              <div className="bg-white border-b border-gray-200 flex justify-between items-center px-4 h-14 shadow-sm z-10">
                  <div className="flex h-full items-center gap-4">
                      <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 h-9">
                          <button id="tabPreview" onClick={() => (window as any).mudarSeparador('preview')} className="px-4 rounded font-bold text-[11px] bg-white text-blue-600 shadow-sm border border-slate-200 flex items-center transition">Visão Visual</button>
                          <button id="tabCode" onClick={() => (window as any).mudarSeparador('code')} className="px-4 rounded font-bold text-[11px] text-slate-500 hover:text-slate-700 flex items-center transition">Fonte HTML</button>
                      </div>
                      
                      <button onClick={desfazerCodigo} className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-1.5 px-3 rounded-lg border border-slate-200 shadow-sm transition flex items-center gap-1.5" title="Desfazer">
                        <i className="fas fa-undo text-slate-400"></i> Desfazer
                      </button>
                      
                      <div className="flex items-center ml-2 border border-emerald-200 bg-emerald-50 rounded-lg px-3 py-1.5 shadow-sm">
                          <i className="fas fa-microchip animate-pulse text-emerald-500 mr-2 text-lg"></i> 
                          <span className="text-[11px] font-black text-emerald-800 tracking-wide uppercase">Motor IA: {statusApis.texto}</span>
                      </div>
                  </div>

                  <div className="flex items-center gap-2">
                      <button onClick={carregarMeusSites} className="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold py-2 px-4 rounded-lg shadow-sm transition"><i className="fas fa-folder-open mr-1.5"></i> Meus Sites</button>
                      
                      {siteEditando ? (
                          <>
                              <button onClick={() => setSiteEditando(null)} className="bg-slate-200 text-slate-700 text-[11px] font-bold py-2 px-3 rounded-lg hover:bg-slate-300 transition">Cancelar</button>
                              <button onClick={() => (window as any).handlePublicarSite()} className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 px-4 rounded-lg shadow-sm transition"><i className="fas fa-save mr-1.5"></i> Salvar</button>
                          </>
                      ) : (
                          <button onClick={() => (window as any).handlePublicarSite()} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2 px-4 rounded-lg shadow-sm transition"><i className="fas fa-globe mr-1.5"></i> Publicar Online</button>
                      )}

                      <button onClick={() => (window as any).baixarHtmlGerado()} className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 text-[11px] font-bold py-2 px-4 rounded-lg shadow-sm transition flex items-center gap-1.5">
                          <i className="fas fa-download"></i> Baixar HTML
                      </button>
                      <button onClick={() => (window as any).copiarCodigo()} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-bold py-2 px-3 rounded-lg shadow-sm transition" title="Copiar Código"><i className="fas fa-copy"></i></button>
                  </div>
              </div>
              
              <div className="flex-grow relative bg-slate-800">
                  {modoEdicaoVisual && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-2 rounded-full shadow-2xl font-black text-xs uppercase tracking-widest animate-bounce flex items-center gap-2 border-2 border-indigo-400">
                          <i className="fas fa-mouse-pointer"></i> Clique num texto ou elemento para editar
                      </div>
                  )}
                  <iframe id="previewFrame" className="w-full h-full active border-none bg-white shadow-inner" sandbox="allow-scripts allow-same-origin" title="Preview"></iframe>
                  <div id="codigoContainer" className="w-full h-full bg-slate-900 p-6">
                      <textarea id="codigoGerado" className="w-full h-full font-mono text-sm bg-slate-900 text-green-400 border-none outline-none resize-none custom-scrollbar rounded-xl p-4"></textarea>
                  </div>
              </div>
          </div>
          
      </div> {/* FECHA A CAIXA MAIN APP CONTAINER AQUI! */}

      {modalMeusSitesAberto && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-800"><i className="fas fa-server text-blue-500 mr-2"></i>Servidor de Sites</h2>
              <button onClick={() => setModalMeusSitesAberto(false)} className="w-8 h-8 rounded-full bg-slate-200 font-bold hover:bg-red-500 hover:text-white transition shadow-sm"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              {renderConteudoModal()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}