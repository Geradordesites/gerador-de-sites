'use client';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [modalMeusSitesAberto, setModalMeusSitesAberto] = useState(false);
  const [listaSites, setListaSites] = useState<any[]>([]);
  const [carregandoSites, setCarregandoSites] = useState(false);
  
  // ESTADOS DO SISTEMA DE PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const SITES_POR_PAGINA = 6; // Quantidade de sites por página

  const carregarMeusSites = async () => {
    setCarregandoSites(true);
    const userId = '00000000-0000-0000-0000-000000000000';
    const { data, error } = await supabase.from('sites_gerados').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) { (window as any).showNotification('Erro ao carregar os sites.', 'error'); } 
    else { 
      setListaSites(data || []); 
      setPaginaAtual(1); // Sempre volta para a página 1 ao abrir
    }
    setCarregandoSites(false);
    setModalMeusSitesAberto(true);
  };

  const deletarSite = async (id: string, slug: string) => {
    if (!confirm(`Tem certeza que deseja deletar o site "${slug}"?`)) return;
    const { error } = await supabase.from('sites_gerados').delete().eq('id', id);
    if (error) alert('Erro ao deletar o site.');
    else {
      const novaLista = listaSites.filter(site => site.id !== id);
      setListaSites(novaLista);
      
      // Ajusta a página se deletar o último item da página atual
      const totalPaginasRestantes = Math.ceil(novaLista.length / SITES_POR_PAGINA);
      if (paginaAtual > totalPaginasRestantes && totalPaginasRestantes > 0) {
        setPaginaAtual(totalPaginasRestantes);
      }
      
      (window as any).showNotification('Site deletado com sucesso!', 'success');
    }
  };

  const editarSite = (htmlContent: string) => {
    const codigoGeradoEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
    const previewFrameEl = document.getElementById('previewFrame') as HTMLIFrameElement;
    if (codigoGeradoEl) codigoGeradoEl.value = htmlContent;
    if (previewFrameEl) previewFrameEl.srcdoc = htmlContent;
    if ((window as any).mapearElementosGerados) (window as any).mapearElementosGerados(htmlContent);
    if ((window as any).mudarSeparador) (window as any).mudarSeparador('preview');
    setModalMeusSitesAberto(false);
    (window as any).showNotification('Site carregado para edição!', 'success');
  };

  useEffect(() => {
    let uploadedImagesData: any[] = [];
    let uploadedCoverData: any = null;
    const domParser = new DOMParser();

    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());

    setTimeout(() => {
      document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', (e: any) => { e.preventDefault(); zone.classList.add('bg-blue-100', 'border-blue-500'); });
        zone.addEventListener('dragleave', (e: any) => { e.preventDefault(); zone.classList.remove('bg-blue-100', 'border-blue-500'); });
        zone.addEventListener('drop', (e: any) => {
          e.preventDefault(); zone.classList.remove('bg-blue-100', 'border-blue-500');
          try {
            const onclickAttr = zone.getAttribute('onclick');
            if (!onclickAttr) return;
            const match = onclickAttr.match(/'([^']+)'/);
            if (!match) return;
            const inputId = match[1];
            const input = document.getElementById(inputId) as HTMLInputElement;
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && input) {
              input.files = e.dataTransfer.files;
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          } catch (err) {}
        });
      });
    }, 500);

    (window as any).mudarModoApp = (modo: string) => {
      const btnVisual = document.getElementById('btnTabVisual'), btnCopy = document.getElementById('btnTabCopy');
      const contVisual = document.getElementById('containerModoVisual'), contCopy = document.getElementById('containerModoCopy');
      if (!btnVisual || !btnCopy || !contVisual || !contCopy) return;

      if (modo === 'visual') {
        btnVisual.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50 transition-colors";
        btnCopy.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors";
        contVisual.style.display = 'block'; contCopy.style.display = 'none';
      } else {
        btnCopy.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50 transition-colors";
        btnVisual.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors";
        contCopy.style.display = 'block'; contVisual.style.display = 'none';
      }
    };

    (window as any).handleCoverUpload = (event: any) => {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) { (window as any).showNotification('A capa deve ser uma imagem.', 'error'); return; }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        uploadedCoverData = { mimeType: file.type, data: e.target.result.split(',')[1] };
        document.getElementById('coverPreviewContainer')?.classList.remove('hidden');
        const img = document.getElementById('coverImgPreview') as HTMLImageElement;
        if (img) img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    };

    const renderImagePreviewGrid = () => {
      const grid = document.getElementById('imagePreviewGrid'), countSpan = document.getElementById('imageCount');
      if (!grid || !countSpan) return;
      grid.innerHTML = ''; countSpan.textContent = uploadedImagesData.length.toString();
      uploadedImagesData.forEach((imgObj, index) => {
        const div = document.createElement('div');
        div.className = 'image-preview-item shadow-sm';
        div.innerHTML = `<img src="data:${imgObj.mimeType};base64,${imgObj.data}">
                         <div class="remove-img" onclick="window.removerImagem(${index})"><i class="fas fa-times"></i></div>`;
        grid.appendChild(div);
      });
    };

    (window as any).removerImagem = (index: number) => { uploadedImagesData.splice(index, 1); renderImagePreviewGrid(); };

    const processFile = (file: File) => {
      if (uploadedImagesData.length >= 20) { (window as any).showNotification('Limite de 20 imagens.', 'error'); return; }
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) { (window as any).showNotification('Imagem excede 5MB.', 'error'); return; }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        uploadedImagesData.push({ mimeType: file.type, data: e.target.result.split(',')[1] });
        renderImagePreviewGrid();
      };
      reader.readAsDataURL(file);
    };

    (window as any).handleImageUpload = (event: any) => { Array.from(event.target.files).forEach((file: any) => processFile(file)); event.target.value = ''; };

    document.body.addEventListener('paste', function(e: any) {
      const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
      if (!items) return;
      for (let index in items) {
        if (items[index].kind === 'file' && items[index].type.startsWith('image/')) processFile(items[index].getAsFile());
      }
    });

    async function chamarIA(systemInstructionText: string, promptParts: any[], isRefinement = false, customLoadingMsg: string | null = null) {
      let loadingMsg = isRefinement ? "Aplicando alterações..." : "Construindo layout avançado...";
      if (customLoadingMsg) loadingMsg = customLoadingMsg;
      const loadText = document.getElementById('loadingText'), loadOverlay = document.getElementById('loadingOverlay');
      if (loadText) loadText.textContent = loadingMsg;
      if (loadOverlay) loadOverlay.style.display = 'flex';

      try {
        const response = await fetch('/api/gerar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemInstruction: systemInstructionText, promptParts: promptParts })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);

        const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
        const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
        if (codEl) codEl.value = data.html;
        if (prevEl) prevEl.srcdoc = data.html;
        if (!isRefinement && (window as any).mapearElementosGerados) (window as any).mapearElementosGerados(data.html);
        (window as any).showNotification('Sucesso!', 'success');
        if ((window as any).mudarSeparador) (window as any).mudarSeparador('preview');
      } catch (err: any) {
        (window as any).showNotification('Erro: ' + err.message, 'error');
      } finally {
        if (loadOverlay) loadOverlay.style.display = 'none';
      }
    }

    (window as any).gerarSite = () => {
      if (uploadedImagesData.length === 0) { (window as any).showNotification('Anexe referências.', 'error'); return; }
      const modo = (document.getElementById('modoClonagem') as HTMLSelectElement)?.value || 'exato';
      const diretrizModo = modo === 'exato' ? "Cópia exata e fiel." : "Modelo focado em conversão.";
      const systemInstruction = `Você é Especialista Sênior em UI/UX e Frontend. Retorne JSON com a chave "codigo_html". MODO: ${diretrizModo}`;
      let promptParts: any[] = [{ text: "Crie a página:" }];
      uploadedImagesData.forEach(img => promptParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } }));
      chamarIA(systemInstruction, promptParts, false);
    };

    (window as any).gerarSiteComCopy = () => {
      const content = (document.getElementById('productContent') as HTMLTextAreaElement)?.value.trim();
      const bio = (document.getElementById('authorBio') as HTMLTextAreaElement)?.value.trim();
      if (!content) { (window as any).showNotification('Insira conteúdo do produto.', 'error'); return; }
      const systemInstruction = `Você é Copywriter Sênior de Elite e Engenheiro Front-end. Retorne JSON com a chave "codigo_html".`;
      let textoMestre = `CONTEÚDO:\n${content}\n`;
      if (bio) textoMestre += `AUTOR:\n${bio}\n`;
      let promptParts: any[] = [{ text: "Gere a Landing Page a partir da copy:\n" + textoMestre }];
      if (uploadedCoverData) {
        promptParts.push({ text: "Use as cores desta capa." });
        promptParts.push({ inlineData: uploadedCoverData });
      }
      chamarIA(systemInstruction, promptParts, false, "Lendo texto e gerando layout...");
    };

    (window as any).refinarSiteEstrito = () => {
      const prompt = (document.getElementById('promptRefinamento') as HTMLTextAreaElement)?.value.trim();
      const codigo = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!prompt || !codigo) { (window as any).showNotification('Gere um site e escreva algo.', 'error'); return; }
      const sys = `Compilador estrito. Retorne JSON com a chave "codigo_html". Altere apenas o solicitado.`;
      chamarIA(sys, [{text: `CÓDIGO:\n${codigo}\nPEDIDO:\n${prompt}`}], true);
    };

    (window as any).handleElementImageUpload = (event: any, index: number) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const input = document.getElementById(`img_replace_${index}`) as HTMLInputElement;
        if (input) {
            input.value = e.target.result;
            (window as any).aplicarNovosElementos();
        }
      };
      reader.readAsDataURL(file);
    };

    (window as any).mapearElementosGerados = (html: string) => {
      const doc = domParser.parseFromString(html, 'text/html');
      const images = doc.querySelectorAll('img');
      const links = Array.from(doc.querySelectorAll('a')).filter(a => a.hasAttribute('href') && !a.getAttribute('href')!.startsWith('javascript:'));
      
      const card = document.getElementById('elementManagerCard'), imgContainer = document.getElementById('imageInputsContainer'), linkContainer = document.getElementById('linkInputsContainer');
      if (!card || !imgContainer || !linkContainer) return;
      imgContainer.innerHTML = ''; linkContainer.innerHTML = '';
      
      let temImagens = false, temLinks = false;

      if (images.length > 0) {
        temImagens = true; document.getElementById('imageSection')!.style.display = 'block';
        images.forEach((img, index) => {
          let label = img.id || img.alt || `Imagem ${index + 1}`;
          const div = document.createElement('div');
          
          div.innerHTML = `
            <label class="text-[9px] font-bold text-gray-500 uppercase flex justify-between items-center mb-1">
                <span class="truncate pr-2">${label}</span>
                <span class="bg-gray-200 text-gray-600 px-1 py-0.5 rounded text-[8px]">${img.width || '?'}x${img.height || '?'}</span>
            </label>
            <div class="flex gap-2">
                <input type="text" id="img_replace_${index}" class="input-style text-xs py-1.5 px-2 flex-1" value="${img.src}" placeholder="Cole URL externa ou faça Upload">
                <label class="bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer px-3 py-1.5 rounded flex items-center justify-center border border-blue-200 transition" title="Fazer Upload do Computador">
                    <i class="fas fa-upload"></i>
                    <input type="file" accept="image/*" class="hidden" onchange="window.handleElementImageUpload(event, ${index})">
                </label>
            </div>
          `;
          imgContainer.appendChild(div);
        });
      } else { document.getElementById('imageSection')!.style.display = 'none'; }

      if (links.length > 0) {
        temLinks = true; document.getElementById('linkSection')!.style.display = 'block';
        links.forEach((a, index) => {
          let label = a.innerText.trim() || a.getAttribute('aria-label') || a.title || `Link ${index + 1}`;
          const div = document.createElement('div');
          div.innerHTML = `<label class="text-[9px] font-bold text-gray-500 uppercase mb-1 block truncate">${label}</label>
                           <input type="text" id="link_replace_${index}" class="input-style text-xs py-1.5 px-2" value="${a.getAttribute('href')}" placeholder="URL">`;
          linkContainer.appendChild(div);
        });
      } else { document.getElementById('linkSection')!.style.display = 'none'; }

      card.style.display = (temImagens || temLinks) ? 'flex' : 'none';
    };

    (window as any).aplicarNovosElementos = () => {
      const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
      const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
      if (!codEl || !codEl.value) return;
      const doc = domParser.parseFromString(codEl.value, 'text/html');
      let alterou = false;

      doc.querySelectorAll('img').forEach((img, i) => {
        const inp = document.getElementById(`img_replace_${i}`) as HTMLInputElement;
        if (inp && inp.value && inp.value !== img.src) { img.src = inp.value; alterou = true; }
      });
      Array.from(doc.querySelectorAll('a')).filter(a => a.hasAttribute('href') && !a.getAttribute('href')!.startsWith('javascript:')).forEach((a, i) => {
        const inp = document.getElementById(`link_replace_${i}`) as HTMLInputElement;
        if (inp && inp.value && inp.value !== a.getAttribute('href')) { a.setAttribute('href', inp.value); alterou = true; }
      });

      if (alterou) {
        const novo = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
        codEl.value = novo; prevEl.srcdoc = novo;
        (window as any).showNotification('Elementos atualizados!', 'success');
      }
    };

    (window as any).mudarSeparador = (aba: string) => {
      const btnP = document.getElementById('tabPreview'), btnC = document.getElementById('tabCode');
      const boxP = document.getElementById('previewFrame'), boxC = document.getElementById('codigoContainer');
      if (!btnP || !btnC || !boxP || !boxC) return;

      if (aba === 'preview') {
        btnP.className = "h-full px-4 border-b-2 border-blue-600 text-blue-700 font-medium text-sm flex items-center";
        btnC.className = "h-full px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-medium text-sm flex items-center transition";
        boxP.classList.add('active'); boxC.classList.remove('active');
      } else {
        btnC.className = "h-full px-4 border-b-2 border-blue-600 text-blue-700 font-medium text-sm flex items-center";
        btnP.className = "h-full px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-medium text-sm flex items-center transition";
        boxC.classList.add('active'); boxP.classList.remove('active');
      }
    };

    (window as any).showNotification = (msg: string, type: string) => {
      const div = document.createElement('div');
      div.className = `fixed bottom-4 right-4 text-white px-4 py-2 rounded shadow-lg transition-opacity z-50 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
      div.textContent = msg; document.body.appendChild(div);
      setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 300); }, 3000);
    };

    (window as any).copiarCodigo = () => {
      const txt = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!txt) return;
      const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); (window as any).showNotification('Código copiado!', 'success'); } catch(e) {}
      document.body.removeChild(t);
    };

    (window as any).handlePublicarSite = async () => {
      const htmlContent = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!htmlContent) { (window as any).showNotification('Gere um site primeiro.', 'error'); return; }

      const promptTitulo = prompt('Digite um título para identificar este site (Ex: Finanças):');
      if (promptTitulo === null) return; 
      
      const titulo = promptTitulo || 'Landing Page';
      const slugSugerido = titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      let slug = prompt('Personalize o link final do seu site (não use espaços):', slugSugerido);
      if (slug === null) return; 
      
      if (!slug) slug = slugSugerido + '-' + nanoid(4); 

      const { error } = await supabase.from('sites_gerados').insert([{ user_id: '00000000-0000-0000-0000-000000000000', slug, titulo, html_content: htmlContent }]);

      if (error) { (window as any).showNotification('Erro: Link já em uso.', 'error'); return; }

      const linkPublico = `${window.location.origin}/${slug}`;
      navigator.clipboard.writeText(linkPublico);
      alert(`Site publicado com sucesso!\n\nLink copiado: \n${linkPublico}`);
    };

  }, []);

  // LÓGICA DE CÁLCULO DA PAGINAÇÃO
  const indexOfLastSite = paginaAtual * SITES_POR_PAGINA;
  const indexOfFirstSite = indexOfLastSite - SITES_POR_PAGINA;
  const sitesAtuais = listaSites.slice(indexOfFirstSite, indexOfLastSite);
  const totalPaginas = Math.ceil(listaSites.length / SITES_POR_PAGINA);

  return (
    <div className="h-screen overflow-hidden flex relative bg-slate-100 text-slate-800 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        .card { background: white; border-radius: .75rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0/0.05); padding: 1.5rem; display: flex; flex-direction: column; }
        .label-style { font-weight: 600; color: #1e293b; margin-bottom: .5rem; font-size: .875rem; display: flex; align-items: center;}
        .label-style i { margin-right: .5rem; color: #64748b; }
        .input-style { width: 100%; padding: .625rem .875rem; border-radius: .5rem; border: 1px solid #cbd5e1; font-size: .875rem; }
        .input-style:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
        .primary-btn { background: #2563eb; color: white; font-weight: 600; display: flex; justify-content: center; align-items: center;}
        .primary-btn:hover { background: #1d4ed8; }
        .drop-zone { border: 2px dashed #94a3b8; border-radius: .75rem; background: #f8fafc; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
        .image-preview-item { position: relative; border-radius: .5rem; overflow: hidden; border: 1px solid #e5e7eb; height: 80px; }
        .image-preview-item img { width: 100%; height: 100%; object-fit: cover; }
        .image-preview-item .remove-img { position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px; }
        #previewFrame, #codigoContainer { display: none; }
        #previewFrame.active, #codigoContainer.active { display: block; }
        #loadingOverlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(15,23,42,0.85); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        #loadingSpinner { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #3b82f6; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />

      <div id="main-app-container" className="w-full h-full flex overflow-hidden">
        <div id="loadingOverlay" style={{ display: 'none' }}>
            <div id="loadingSpinner"></div>
            <p id="loadingText" className="text-white mt-4 font-medium text-lg">Processando...</p>
        </div>

        <div className="w-full md:w-80 lg:w-96 bg-white shadow-xl flex flex-col h-full border-r border-gray-200 flex-shrink-0 z-10">
            <div className="p-5 border-b border-gray-100 bg-gray-50 pb-0">
                <h1 className="text-xl font-bold text-gray-800"><i className="fas fa-layer-group text-blue-600 mr-2"></i>Modelador Visual Pro</h1>
                <p className="text-xs text-gray-500 mt-1 mb-4">Engenharia reversa e Copywriting IA em alta performance.</p>
                <div className="flex border-b border-gray-200 mb-4">
                    <button id="btnTabVisual" onClick={() => (window as any).mudarModoApp('visual')} className="flex-1 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50">Modo Visual</button>
                    <button id="btnTabCopy" onClick={() => (window as any).mudarModoApp('copy')} className="flex-1 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50">Modo Texto (Copy)</button>
                </div>
            </div>

            <div className="overflow-y-auto p-5 space-y-5 flex-grow custom-scrollbar">
                <div id="containerModoVisual">
                    <div className="card p-4 mb-4">
                        <h3 className="label-style"><i className="fas fa-images"></i>Referências Visuais</h3>
                        <div className="drop-zone" onClick={() => document.getElementById('imageUploadInput')?.click()}>
                            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                            <p className="text-sm font-medium text-gray-600">Clique ou Cole (Ctrl+V)</p>
                        </div>
                        <input type="file" id="imageUploadInput" multiple accept="image/png, image/jpeg, image/webp" className="hidden" onChange={(e) => (window as any).handleImageUpload(e)} />
                        <div id="imagePreviewGrid" className="grid grid-cols-3 gap-2 mt-4"></div>
                    </div>
                    <div className="card p-4">
                        <h3 className="label-style"><i className="fas fa-cogs"></i>Modo de Construção</h3>
                        <select id="modoClonagem" className="input-style mb-4 font-medium text-gray-700">
                            <option value="exato">Recriação Fiel (Pixel Perfect)</option>
                            <option value="modelagem">Modelar (Conversão)</option>
                        </select>
                        <button onClick={() => (window as any).gerarSite()} className="primary-btn w-full py-3 rounded-lg mt-2">
                            <i className="fas fa-magic mr-2"></i> Gerar Site Alta Performance
                        </button>
                    </div>
                </div>

                <div id="containerModoCopy" style={{ display: 'none' }}>
                    <div className="card p-4 mb-4">
                        <h3 className="label-style"><i className="fas fa-file-lines"></i>Conteúdo</h3>
                        <textarea id="productContent" rows={5} className="input-style text-xs" placeholder="Conteúdo do produto..."></textarea>
                    </div>
                    <div className="card p-4 mb-4">
                        <h3 className="label-style"><i className="fas fa-image"></i>Capa</h3>
                        <div className="drop-zone py-4" onClick={() => document.getElementById('coverUploadInput')?.click()}>
                            <i className="fas fa-camera text-xl text-green-400 mb-1"></i><p className="text-xs">Anexar Capa</p>
                        </div>
                        <input type="file" id="coverUploadInput" accept="image/png, image/jpeg" className="hidden" onChange={(e) => (window as any).handleCoverUpload(e)} />
                        <div id="coverPreviewContainer" className="mt-2 hidden text-center"><img id="coverImgPreview" className="h-16 mx-auto rounded" /></div>
                    </div>
                    <button onClick={() => (window as any).gerarSiteComCopy()} className="primary-btn w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700">
                        <i className="fas fa-pen-nib mr-2"></i> Gerar Página de Vendas
                    </button>
                </div>

                <div id="elementManagerCard" className="card p-4 border-blue-200 bg-blue-50" style={{ display: 'none' }}>
                    <h3 className="label-style text-blue-800"><i className="fas fa-edit"></i>Editar Conteúdos Rápidos</h3>
                    <div id="imageSection" style={{ display: 'none' }} className="mb-4">
                        <p className="text-[10px] font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2">IMAGENS</p>
                        <div id="imageInputsContainer" className="space-y-3 max-h-60 overflow-y-auto pr-2"></div>
                    </div>
                    <div id="linkSection" style={{ display: 'none' }}>
                        <p className="text-[10px] font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2">LINKS</p>
                        <div id="linkInputsContainer" className="space-y-3 max-h-40 overflow-y-auto pr-2"></div>
                    </div>
                    <button onClick={() => (window as any).aplicarNovosElementos()} className="w-full bg-blue-600 text-white font-medium text-sm py-2 rounded mt-4">
                        Atualizar Elementos no Site
                    </button>
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-blue-50">
                <textarea id="promptRefinamento" rows={2} className="input-style w-full text-xs" placeholder="Ex: Mude o botão..."></textarea>
                <button onClick={() => (window as any).refinarSiteEstrito()} className="bg-blue-600 text-white font-medium text-sm py-2 px-3 mt-2 rounded w-full">
                    Aplicar Alteração
                </button>
            </div>
        </div>

        <div className="flex-grow flex flex-col bg-white relative">
            <div className="bg-white border-b border-gray-200 flex justify-between items-center px-4 h-14">
                <div className="flex h-full">
                    <button id="tabPreview" onClick={() => (window as any).mudarSeparador('preview')} className="h-full px-4 border-b-2 border-blue-600 text-blue-700 font-medium text-sm">Visualização</button>
                    <button id="tabCode" onClick={() => (window as any).mudarSeparador('code')} className="h-full px-4 border-b-2 border-transparent text-gray-500 font-medium text-sm">Código HTML</button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={carregarMeusSites} className="bg-blue-600 text-white text-xs font-semibold py-1.5 px-3 rounded shadow"><i className="fas fa-folder-open"></i> Meus Sites</button>
                    <button onClick={() => (window as any).handlePublicarSite()} className="bg-emerald-600 text-white text-xs font-semibold py-1.5 px-3 rounded shadow"><i className="fas fa-globe"></i> Publicar</button>
                    <button onClick={() => (window as any).copiarCodigo()} className="bg-gray-100 text-gray-700 text-xs font-semibold py-1.5 px-3 rounded border border-gray-300">Copiar</button>
                </div>
            </div>
            
            <div className="flex-grow bg-gray-200 relative">
                <iframe id="previewFrame" className="w-full h-full active border-none bg-white" sandbox="allow-scripts allow-same-origin" title="Preview"></iframe>
                <div id="codigoContainer" className="w-full h-full">
                    <textarea id="codigoGerado" className="w-full h-full p-6 font-mono text-sm bg-gray-900 text-green-400 border-none outline-none resize-none"></textarea>
                </div>
            </div>
        </div>
      </div>

      {modalMeusSitesAberto && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Meus Sites Publicados</h2>
              <button onClick={() => setModalMeusSitesAberto(false)} className="w-8 h-8 rounded-full bg-slate-200 font-bold">✕</button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {carregandoSites ? <p className="text-center text-sm text-slate-500">Carregando...</p> : 
                listaSites.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 space-y-2">
                    <p className="text-sm font-semibold">Nenhum site publicado ainda.</p>
                  </div>
                ) : (
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
                                <button onClick={() => editarSite(site.html_content)} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200">Editar</button>
                                <button onClick={() => deletarSite(site.id, site.slug)} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded border border-red-200">Deletar</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* CONTROLES DE PAGINAÇÃO */}
                    {totalPaginas > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                          disabled={paginaAtual === 1}
                          className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded disabled:opacity-50 hover:bg-slate-200 transition"
                        >
                          Anterior
                        </button>
                        <span className="text-xs font-semibold text-slate-500">
                          Página {paginaAtual} de {totalPaginas}
                        </span>
                        <button
                          onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                          disabled={paginaAtual === totalPaginas}
                          className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded disabled:opacity-50 hover:bg-slate-200 transition"
                        >
                          Próxima
                        </button>
                      </div>
                    )}
                  </>
                )
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}