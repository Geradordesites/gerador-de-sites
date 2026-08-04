'use client';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [modalMeusSitesAberto, setModalMeusSitesAberto] = useState(false);
  const [listaSites, setListaSites] = useState<any[]>([]);
  const [carregandoSites, setCarregandoSites] = useState(false);
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const SITES_POR_PAGINA = 6; 

  const [siteEditando, setSiteEditando] = useState<{id: string, slug: string, titulo: string} | null>(null);

  // CATRACA DE SEGURANÇA: VERIFICA SE ESTÁ LOGADO
  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login'; 
      }
    };
    verificarSessao();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const carregarMeusSites = async () => {
    setCarregandoSites(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data, error } = await supabase.from('sites_gerados').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    if (!error) { 
      setListaSites(data || []); 
      setPaginaAtual(1); 
    }
    setCarregandoSites(false);
    setModalMeusSitesAberto(true);
  };

  const deletarSite = async (id: string, slug: string) => {
    if (!confirm(`Tem certeza que deseja deletar o site "${slug}"?`)) return;
    const { error } = await supabase.from('sites_gerados').delete().eq('id', id);
    if (!error) {
      const novaLista = listaSites.filter(site => site.id !== id);
      setListaSites(novaLista);
      const totalPaginasRestantes = Math.ceil(novaLista.length / SITES_POR_PAGINA);
      if (paginaAtual > totalPaginasRestantes && totalPaginasRestantes > 0) setPaginaAtual(totalPaginasRestantes);
      if (siteEditando && siteEditando.id === id) setSiteEditando(null);
      (window as any).showNotification('Site deletado com sucesso!', 'success');
    }
  };

  const editarSite = (site: any) => {
    const codigoGeradoEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
    const previewFrameEl = document.getElementById('previewFrame') as HTMLIFrameElement;
    if (codigoGeradoEl) codigoGeradoEl.value = site.html_content;
    if (previewFrameEl) previewFrameEl.srcdoc = site.html_content;
    if ((window as any).mapearElementosGerados) (window as any).mapearElementosGerados(site.html_content);
    if ((window as any).mudarSeparador) (window as any).mudarSeparador('preview');
    
    setSiteEditando({ id: site.id, slug: site.slug, titulo: site.titulo });
    setModalMeusSitesAberto(false);
    (window as any).showNotification(`Modo de Edição ativado: ${site.titulo}`, 'success');
  };

  useEffect(() => {
    let uploadedImagesData: any[] = [];
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
            const inputId = zone.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            const input = document.getElementById(inputId || '') as HTMLInputElement;
            if (e.dataTransfer.files?.length > 0 && input) {
              input.files = e.dataTransfer.files;
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          } catch (err) {}
        });
      });
    }, 500);

    (window as any).mudarModoApp = (modo: string) => {
      const btnV = document.getElementById('btnTabVisual'), btnC = document.getElementById('btnTabCopy');
      const contV = document.getElementById('containerModoVisual'), contC = document.getElementById('containerModoCopy');
      if (!btnV || !btnC || !contV || !contC) return;

      if (modo === 'visual') {
        btnV.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50 transition-colors";
        btnC.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors";
        contV.style.display = 'block'; contC.style.display = 'none';
      } else {
        btnC.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50 transition-colors";
        btnV.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors";
        contC.style.display = 'block'; contV.style.display = 'none';
      }
    };

    const renderImagePreviewGrid = () => {
      const grid = document.getElementById('imagePreviewGrid'), countSpan = document.getElementById('imageCount');
      if (!grid || !countSpan) return;
      grid.innerHTML = ''; countSpan.textContent = uploadedImagesData.length.toString();
      uploadedImagesData.forEach((imgObj, index) => {
        const div = document.createElement('div');
        div.className = 'image-preview-item shadow-sm';
        div.innerHTML = `<img src="data:${imgObj.mimeType};base64,${imgObj.data}"><div class="remove-img" onclick="window.removerImagem(${index})"><i class="fas fa-times"></i></div>`;
        grid.appendChild(div);
      });
    };

    (window as any).removerImagem = (index: number) => { uploadedImagesData.splice(index, 1); renderImagePreviewGrid(); };

    const processFile = (file: File) => {
      if (!file.type.startsWith('image/')) return;
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

    async function chamarIA(systemInstructionText: string, promptParts: any[], isRefinement = false) {
      const loadOverlay = document.getElementById('loadingOverlay');
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

    // MEGA-PROMPTS DE ESTILOS PROFISSIONAIS
    const getMegaPromptEstilo = () => {
      const estilo = (document.getElementById('nichoEstilo') as HTMLSelectElement)?.value || 'premium';
      if (estilo === 'premium') return "DIRETRIZ VISUAL OBRIGATÓRIA: Aplique um design sofisticado e de alto valor (Premium). Utilize tipografia serifada elegante para os títulos (ex: Playfair Display) e sans-serif limpa para leitura (ex: Inter). Estruture o layout aplicando um espaçamento exato de uma linha em branco entre os títulos dos tópicos e o início dos parágrafos subsequentes para garantir uma leitura fluida e elegante. Cores base: tons profundos com detalhes em dourado ou cores de destaque refinadas.";
      if (estilo === 'terapia') return "DIRETRIZ VISUAL OBRIGATÓRIA: Crie um layout minimalista, transmitindo calma e autoridade. Use muito espaço em branco (white space), paletas em tons pastéis (verde sálvia, azul sereno ou areia). Os cantos das imagens e botões devem ser levemente arredondados. Mantenha a estrutura de texto limpa, exigindo um espaço de uma única linha separando os títulos principais dos parágrafos de texto.";
      if (estilo === 'agressivo') return "DIRETRIZ VISUAL OBRIGATÓRIA: Layout de altíssima conversão focado em contraste e urgência. Fundo escuro (Dark Mode) com textos claros e botões em cores neon/vibrantes (verde limão, amarelo ou laranja). Estrutura de leitura em blocos curtos, respeitando a regra estrita de uma linha de espaço entre títulos de tópicos e parágrafos. Destaque máximo para a oferta e os botões de compra.";
      if (estilo === 'corporativo') return "DIRETRIZ VISUAL OBRIGATÓRIA: Design corporativo, limpo e direto ao ponto. Foco em clareza, profissionalismo e confiança. Tons de azul marinho, cinza e branco. Tipografia moderna e legível. Elementos bem alinhados, cantos retos ou levemente arredondados, e espaçamentos consistentes (1 linha de espaço entre títulos e parágrafos).";
      return "";
    };

    (window as any).gerarSite = () => {
      if (uploadedImagesData.length === 0) { (window as any).showNotification('Anexe referências.', 'error'); return; }
      
      const isMenuChecked = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked;
      const diretrizMenu = isMenuChecked ? "CRIE OBRIGATORIAMENTE UM MENU SUPERIOR NAVEGÁVEL COM LINKS ÂNCORA." : "NÃO CRIE MENU SUPERIOR. PÁGINA DIRETA SEM NAVEGAÇÃO NO TOPO.";
      
      const modo = (document.getElementById('modoClonagem') as HTMLSelectElement)?.value || 'exato';
      const diretrizModo = modo === 'exato' ? "Cópia exata." : "Focado em conversão.";
      
      const megaPrompt = getMegaPromptEstilo();
      const systemInstruction = `Especialista Sênior UI/UX. Retorne JSON com chave "codigo_html". MODO: ${diretrizModo}. ${diretrizMenu}. ${megaPrompt}`;
      
      let promptParts: any[] = [{ text: "Crie a página baseada nestas imagens:" }];
      uploadedImagesData.forEach(img => promptParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } }));
      chamarIA(systemInstruction, promptParts, false);
    };

    (window as any).gerarSiteComCopy = () => {
      const content = (document.getElementById('productContent') as HTMLTextAreaElement)?.value.trim();
      if (!content) { (window as any).showNotification('Insira conteúdo ou comando.', 'error'); return; }
      
      const isMenuChecked = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked;
      const diretrizMenu = isMenuChecked ? "CRIE OBRIGATORIAMENTE UM MENU SUPERIOR NAVEGÁVEL COM LINKS ÂNCORA." : "NÃO CRIE MENU SUPERIOR. PÁGINA DIRETA SEM NAVEGAÇÃO NO TOPO.";

      const megaPrompt = getMegaPromptEstilo();
      const systemInstruction = `Copywriter de Elite. Retorne JSON com chave "codigo_html". ${diretrizMenu}. ${megaPrompt}`;
      
      chamarIA(systemInstruction, [{ text: "Gere a Landing Page a partir deste conteúdo/comando:\n" + content }], false);
    };

    (window as any).refinarSiteEstrito = () => {
      const prompt = (document.getElementById('promptRefinamento') as HTMLTextAreaElement)?.value.trim();
      const codigo = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!prompt || !codigo) return;
      chamarIA(`Compilador estrito. Retorne JSON com chave "codigo_html".`, [{text: `CÓDIGO:\n${codigo}\nPEDIDO:\n${prompt}`}], true);
    };

    (window as any).handleElementImageUpload = (event: any, index: number) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const input = document.getElementById(`img_replace_${index}`) as HTMLInputElement;
        if (input) { input.value = e.target.result; (window as any).aplicarNovosElementos(); }
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
          let currentScale = img.getAttribute('data-scale') || '100'; 
          const div = document.createElement('div');
          
          div.innerHTML = `
            <label class="text-[9px] font-bold text-gray-500 uppercase flex justify-between items-center mb-1">
                <span class="truncate pr-2">${label}</span>
                <span class="bg-gray-200 text-gray-600 px-1 py-0.5 rounded text-[8px]">${img.width || '?'}x${img.height || '?'}</span>
            </label>
            <div class="flex gap-2 mb-1">
                <input type="text" id="img_replace_${index}" class="input-style text-xs py-1.5 px-2 flex-1" value="${img.src}" placeholder="Cole URL externa ou faça Upload">
                <label class="bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer px-3 py-1.5 rounded flex items-center justify-center border border-blue-200 transition" title="Upload Local">
                    <i class="fas fa-upload"></i>
                    <input type="file" accept="image/*" class="hidden" onchange="window.handleElementImageUpload(event, ${index})">
                </label>
            </div>
            <div class="flex items-center gap-2 mt-2 bg-slate-50 p-1.5 rounded border border-slate-200 mb-4">
                <span class="text-[9px] font-bold text-slate-500 w-12">Tamanho:</span>
                <input type="range" id="img_scale_${index}" min="10" max="200" value="${currentScale}" class="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer" oninput="document.getElementById('img_scale_val_${index}').innerText = this.value + '%'; window.aplicarNovosElementos()">
                <span id="img_scale_val_${index}" class="text-[9px] font-mono text-blue-700 font-bold w-8 text-right">${currentScale}%</span>
            </div>
          `;
          imgContainer.appendChild(div);
        });
      } else { document.getElementById('imageSection')!.style.display = 'none'; }

      if (links.length > 0) {
        temLinks = true; document.getElementById('linkSection')!.style.display = 'block';
        links.forEach((a, index) => {
          let label = a.innerText.trim() || a.getAttribute('aria-label') || a.title || `Link ${index + 1}`;
          let isBuyButton = /comprar|adquirir|quero|checkout|garantir|acessar/i.test(label);
          let badgeCompra = isBuyButton ? `<span class="bg-green-100 text-green-700 px-1 py-0.5 rounded text-[8px] ml-2 border border-green-200 shadow-sm"><i class="fas fa-shopping-cart mr-1"></i>BOTÃO DE COMPRA</span>` : '';

          const div = document.createElement('div');
          div.innerHTML = `<label class="text-[9px] font-bold text-gray-500 uppercase mb-1 flex items-center truncate">${label} ${badgeCompra}</label>
                           <input type="text" id="link_replace_${index}" class="input-style text-xs py-1.5 px-2" value="${a.getAttribute('href')}" placeholder="Cole seu link de checkout/WhatsApp aqui">`;
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
        const inpUrl = document.getElementById(`img_replace_${i}`) as HTMLInputElement;
        const inpScale = document.getElementById(`img_scale_${i}`) as HTMLInputElement;
        
        if (inpUrl && inpUrl.value && inpUrl.value !== img.src) { img.src = inpUrl.value; alterou = true; }
        
        if (inpScale) {
            img.setAttribute('data-scale', inpScale.value);
            if (inpScale.value !== '100') {
                img.style.width = `${inpScale.value}%`;
                img.style.height = 'auto'; 
                img.style.objectFit = 'contain';
            } else {
                img.style.width = ''; img.style.height = ''; img.style.objectFit = '';
            }
            alterou = true;
        }
      });

      Array.from(doc.querySelectorAll('a')).filter(a => a.hasAttribute('href') && !a.getAttribute('href')!.startsWith('javascript:')).forEach((a, i) => {
        const inp = document.getElementById(`link_replace_${i}`) as HTMLInputElement;
        if (inp && inp.value && inp.value !== a.getAttribute('href')) { a.setAttribute('href', inp.value); alterou = true; }
      });

      if (alterou) {
        const novo = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
        codEl.value = novo; prevEl.srcdoc = novo;
      }
    };

    (window as any).dispararAtualizacao = () => {
      (window as any).aplicarNovosElementos();
      (window as any).showNotification('Elementos atualizados no painel visual!', 'success');
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

      if (siteEditando) {
        const { error } = await supabase.from('sites_gerados').update({ html_content: htmlContent }).eq('id', siteEditando.id);
        if (error) { (window as any).showNotification('Erro ao salvar as alterações.', 'error'); return; }
        (window as any).showNotification('Alterações salvas com sucesso no mesmo link!', 'success');
        return;
      }

      const nomeDoSite = prompt('Digite o nome do seu site (ele será usado no título e no link):');
      if (nomeDoSite === null) return; 
      
      const titulo = nomeDoSite.trim() || 'Landing Page';
      let slug = titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!slug) slug = nanoid(6); 

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { alert('Sessão expirada. Faça login novamente.'); window.location.href = '/login'; return; }

      const { error } = await supabase.from('sites_gerados').insert([{ user_id: session.user.id, slug, titulo, html_content: htmlContent }]);

      if (error) { (window as any).showNotification('Erro: Link já em uso.', 'error'); return; }

      const linkPublico = `${window.location.origin}/${slug}`;
      navigator.clipboard.writeText(linkPublico);
      alert(`Site publicado com sucesso!\n\nLink copiado: \n${linkPublico}`);
    };

  }, [siteEditando]); 

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
                
                {/* MENU NOVO DE ESTILO E NICHO */}
                <div className="flex flex-col gap-2 mb-4 px-3 py-3 bg-indigo-50 border border-indigo-100 rounded-lg shadow-inner">
                    <label htmlFor="nichoEstilo" className="text-[10px] font-bold text-indigo-800 uppercase"><i className="fas fa-paint-roller mr-1"></i> Estilo Visual do Site:</label>
                    <select id="nichoEstilo" className="input-style text-xs font-medium text-slate-700 bg-white border-indigo-200">
                        <option value="premium">💎 Infoproduto Premium (Elegante)</option>
                        <option value="terapia">🌿 Saúde e Terapia (Calmo)</option>
                        <option value="agressivo">⚡ Lançamento (Dark Mode/Urgência)</option>
                        <option value="corporativo">🏢 Corporativo (Limpo & Direto)</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 mb-3 px-1 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                    <input type="checkbox" id="checkComMenu" defaultChecked={false} className="w-4 h-4 ml-2 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                    <label htmlFor="checkComMenu" className="text-[11px] font-bold text-blue-800 cursor-pointer">CRIAR SITE COM MENU SUPERIOR?</label>
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
                        <h3 className="label-style"><i className="fas fa-file-lines"></i>Conteúdo ou Prompt (Máx 5000)</h3>
                        <p className="text-[10px] text-gray-500 mb-3">Cole o texto base do seu produto OU digite um comando direto para a IA construir o site.</p>
                        <textarea id="productContent" maxLength={5000} rows={7} className="input-style resize-none text-xs" placeholder="Ex: Crie uma página de vendas para um e-book sobre..."></textarea>
                    </div>
                    <button onClick={() => (window as any).gerarSiteComCopy()} className="primary-btn w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700">
                        <i className="fas fa-pen-nib mr-2"></i> Gerar Página de Vendas
                    </button>
                </div>

                <div id="elementManagerCard" className="card p-4 border-blue-200 bg-blue-50" style={{ display: 'none' }}>
                    <h3 className="label-style text-blue-800"><i className="fas fa-edit"></i>Editar Conteúdos Rápidos</h3>
                    <div id="imageSection" style={{ display: 'none' }} className="mb-4">
                        <p className="text-[10px] font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2">IMAGENS</p>
                        <div id="imageInputsContainer" className="space-y-3 max-h-[400px] overflow-y-auto pr-2"></div>
                    </div>
                    <div id="linkSection" style={{ display: 'none' }}>
                        <p className="text-[10px] font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2">LINKS (BOTÕES DE COMPRA)</p>
                        <div id="linkInputsContainer" className="space-y-3 max-h-40 overflow-y-auto pr-2"></div>
                    </div>
                    
                    <button onClick={() => (window as any).dispararAtualizacao()} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded mt-4 transition-colors">
                        <i className="fas fa-sync-alt mr-2"></i> Atualizar Elementos no Site
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
                    
                    {siteEditando ? (
                        <>
                            <button onClick={() => setSiteEditando(null)} className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold py-1.5 px-3 rounded shadow transition">Cancelar Edição</button>
                            <button onClick={() => (window as any).handlePublicarSite()} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded shadow transition flex items-center gap-1"><i className="fas fa-save"></i> Salvar Alterações</button>
                        </>
                    ) : (
                        <button onClick={() => (window as any).handlePublicarSite()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-1.5 px-3 rounded shadow transition flex items-center gap-1"><i className="fas fa-globe"></i> Publicar</button>
                    )}

                    <button onClick={() => (window as any).copiarCodigo()} className="bg-gray-100 text-gray-700 text-xs font-semibold py-1.5 px-3 rounded border border-gray-300">Copiar</button>
                    
                    <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold py-1.5 px-3 rounded transition ml-2">
                      <i className="fas fa-sign-out-alt"></i> Sair
                    </button>
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
                )
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}