'use client';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [modalMeusSitesAberto, setModalMeusSitesAberto] = useState(false);
  const [listaSites, setListaSites] = useState<any[]>([]);
  const [carregandoSites, setCarregandoSites] = useState(false);

  // Função para buscar todos os sites salvos no Supabase
  const carregarMeusSites = async () => {
    setCarregandoSites(true);
    const userId = '00000000-0000-0000-0000-000000000000'; // ID padrão temporário

    const { data, error } = await supabase
      .from('sites_gerados')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar sites:", error);
      (window as any).showNotification('Erro ao carregar os sites.', 'error');
    } else {
      setListaSites(data || []);
    }
    setCarregandoSites(false);
    setModalMeusSitesAberto(true);
  };

  // Função para deletar um site do Supabase
  const deletarSite = async (id: string, slug: string) => {
    if (!confirm(`Tem certeza que deseja deletar o site de slug "${slug}"?`)) return;

    const { error } = await supabase
      .from('sites_gerados')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Erro ao deletar o site.');
    } else {
      setListaSites(listaSites.filter(site => site.id !== id));
      (window as any).showNotification('Site deletado com sucesso!', 'success');
    }
  };

  // Função para carregar o site de volta no editor para edição
  const editarSite = (htmlContent: string) => {
    const codigoGeradoEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
    const previewFrameEl = document.getElementById('previewFrame') as HTMLIFrameElement;

    if (codigoGeradoEl) codigoGeradoEl.value = htmlContent;
    if (previewFrameEl) previewFrameEl.srcdoc = htmlContent;

    if ((window as any).mapearElementosGerados) {
      (window as any).mapearElementosGerados(htmlContent);
    }

    if ((window as any).mudarSeparador) {
      (window as any).mudarSeparador('preview');
    }

    setModalMeusSitesAberto(false);
    (window as any).showNotification('Site carregado no editor para edição!', 'success');
  };

  useEffect(() => {
    let uploadedImagesData: any[] = [];
    let uploadedCoverData: any = null;
    const domParser = new DOMParser();

    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());

    setTimeout(() => {
      document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', (e: any) => {
          e.preventDefault();
          zone.classList.add('bg-blue-100', 'border-blue-500');
        });
        zone.addEventListener('dragleave', (e: any) => {
          e.preventDefault();
          zone.classList.remove('bg-blue-100', 'border-blue-500');
        });
        zone.addEventListener('drop', (e: any) => {
          e.preventDefault();
          zone.classList.remove('bg-blue-100', 'border-blue-500');
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
          } catch (err) { console.error("Erro no drop", err); }
        });
      });
    }, 500);

    (window as any).mudarModoApp = (modo: string) => {
      const btnVisual = document.getElementById('btnTabVisual');
      const btnCopy = document.getElementById('btnTabCopy');
      const contVisual = document.getElementById('containerModoVisual');
      const contCopy = document.getElementById('containerModoCopy');

      if (!btnVisual || !btnCopy || !contVisual || !contCopy) return;

      if (modo === 'visual') {
        btnVisual.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50 transition-colors";
        btnCopy.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors";
        contVisual.style.display = 'block';
        contCopy.style.display = 'none';
      } else {
        btnCopy.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50 transition-colors";
        btnVisual.className = "flex-1 py-2 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors";
        contCopy.style.display = 'block';
        contVisual.style.display = 'none';
      }
    };

    (window as any).handleCoverUpload = (event: any) => {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        (window as any).showNotification('A capa deve ser uma imagem (JPG, PNG).', 'error'); return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        uploadedCoverData = { mimeType: file.type, data: e.target.result.split(',')[1] };
        const previewContainer = document.getElementById('coverPreviewContainer');
        const imgPreview = document.getElementById('coverImgPreview') as HTMLImageElement;
        if (previewContainer) previewContainer.classList.remove('hidden');
        if (imgPreview) imgPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    };

    const renderImagePreviewGrid = () => {
      const grid = document.getElementById('imagePreviewGrid');
      const countSpan = document.getElementById('imageCount');
      if (!grid || !countSpan) return;
      grid.innerHTML = '';
      countSpan.textContent = uploadedImagesData.length.toString();
      
      uploadedImagesData.forEach((imgObj, index) => {
        const div = document.createElement('div');
        div.className = 'image-preview-item shadow-sm';
        div.innerHTML = `
          <img src="data:${imgObj.mimeType};base64,${imgObj.data}">
          <div class="remove-img" onclick="window.removerImagem(${index})"><i class="fas fa-times"></i></div>
        `;
        grid.appendChild(div);
      });
    };

    (window as any).removerImagem = (index: number) => {
      uploadedImagesData.splice(index, 1);
      renderImagePreviewGrid();
    };

    const processFile = (file: File) => {
      if (uploadedImagesData.length >= 20) {
        (window as any).showNotification('Limite de 20 imagens para manter a performance.', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) {
        (window as any).showNotification('Uma imagem excedeu 5MB e foi ignorada para não travar a IA.', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        uploadedImagesData.push({ mimeType: file.type, data: e.target.result.split(',')[1] });
        renderImagePreviewGrid();
      };
      reader.readAsDataURL(file);
    };

    (window as any).handleImageUpload = (event: any) => {
      Array.from(event.target.files).forEach((file: any) => processFile(file));
      event.target.value = '';
    };

    document.body.addEventListener('paste', function(e: any) {
      const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
      if (!items) return;
      for (let index in items) {
        if (items[index].kind === 'file' && items[index].type.startsWith('image/')) {
          processFile(items[index].getAsFile());
        }
      }
    });

    async function chamarIA(systemInstructionText: string, promptParts: any[], isRefinement = false, customLoadingMsg: string | null = null) {
      let loadingMsg = isRefinement ? "Aplicando alterações cirúrgicas..." : "Engenharia Reversa em andamento...";
      if (customLoadingMsg) loadingMsg = customLoadingMsg;

      const loadingTextEl = document.getElementById('loadingText');
      const loadingOverlayEl = document.getElementById('loadingOverlay');
      if (loadingTextEl) loadingTextEl.textContent = loadingMsg;
      if (loadingOverlayEl) loadingOverlayEl.style.display = 'flex';

      try {
        const response = await fetch('/api/gerar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: systemInstructionText,
            promptParts: promptParts
          })
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Erro interno na geração.");
        }

        let htmlCode = data.html;

        const codigoGeradoEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
        const previewFrameEl = document.getElementById('previewFrame') as HTMLIFrameElement;

        if (codigoGeradoEl) codigoGeradoEl.value = htmlCode;
        if (previewFrameEl) previewFrameEl.srcdoc = htmlCode;
        
        if (!isRefinement && (window as any).mapearElementosGerados) {
          (window as any).mapearElementosGerados(htmlCode);
        }
        
        (window as any).showNotification('Processo concluído com sucesso!', 'success');
        if ((window as any).mudarSeparador) (window as any).mudarSeparador('preview');

      } catch (error: any) {
        console.error("Erro no processamento:", error);
        (window as any).showNotification('Falha ao gerar o site: ' + error.message, 'error');
      } finally {
        if (loadingOverlayEl) loadingOverlayEl.style.display = 'none';
      }
    }

    (window as any).gerarSite = () => {
      if (uploadedImagesData.length === 0) {
        (window as any).showNotification('Por favor, anexe imagens para usar como referência.', 'error'); return;
      }

      const modoSelect = document.getElementById('modoClonagem') as HTMLSelectElement;
      const modo = modoSelect ? modoSelect.value : 'exato';
      const diretrizModo = modo === 'exato' 
        ? "Faça uma CÓPIA EXATA E FIEL (Pixel Perfect). Respeite as posições, margens, cores exatas e estrutura visual do Desktop." 
        : "Faça um MODELO INSPIRADO. Mantenha a essência visual, mas crie um layout focado em conversão e design fluído.";

      const systemInstruction = `Você é um Especialista Sênior em Web Performance e UI/UX.
Sua missão é modelar o layout das imagens fornecidas em UM ÚNICO arquivo HTML usando Tailwind CSS.
A estrutura base do site deve ser orientada a DESKTOP, mas adaptar-se perfeitamente a MOBILE.
Retorne um objeto JSON contendo APENAS a chave "codigo_html".
DIRETRIZ DE LAYOUT E MODOS: ${diretrizModo}`;

      let promptParts: any[] = [{ text: "Crie a página web de alta conversão baseada nestas referências visuais:" }];
      uploadedImagesData.forEach(img => {
        promptParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
      });

      chamarIA(systemInstruction, promptParts, false);
    };

    (window as any).gerarSiteComCopy = () => {
      const productContentEl = document.getElementById('productContent') as HTMLTextAreaElement;
      const authorBioEl = document.getElementById('authorBio') as HTMLTextAreaElement;
      const productContent = productContentEl ? productContentEl.value.trim() : '';
      const authorBio = authorBioEl ? authorBioEl.value.trim() : '';

      if (!productContent) {
        (window as any).showNotification('Por favor, insira o conteúdo do produto para gerar a Copy.', 'error'); return;
      }

      const systemInstruction = `Você é um Copywriter Sênior de Elite e Engenheiro Front-end Especialista em Alta Conversão e Web Performance.
Sua missão é ler o conteúdo fornecido, extrair a essência e escrever uma Landing Page Profissional completa em um ÚNICO arquivo HTML usando Tailwind CSS.
Retorne um objeto JSON contendo APENAS a chave "codigo_html".`;

      let textoMestre = `CONTEÚDO DO PRODUTO (Para basear a Copy):\n${productContent}\n\n`;
      if (authorBio) {
        textoMestre += `DESCRIÇÃO DO AUTOR:\n${authorBio}\n`;
      }

      let promptParts: any[] = [
        { text: "Por favor, analise a copy fornecida abaixo e gere o layout HTML completo da Landing Page:\n\n" + textoMestre }
      ];

      if (uploadedCoverData) {
        promptParts.push({ text: "Analise a imagem de capa em anexo e aplique suas cores dominantes usando Tailwind custom colors." });
        promptParts.push({ inlineData: uploadedCoverData });
      }

      chamarIA(systemInstruction, promptParts, false, "Lendo o texto, criando a Copy de Vendas e gerando layout...");
    };

    (window as any).refinarSiteEstrito = () => {
      const promptUsuarioEl = document.getElementById('promptRefinamento') as HTMLTextAreaElement;
      const codigoGeradoEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
      const promptUsuario = promptUsuarioEl ? promptUsuarioEl.value.trim() : '';
      const codigoAtual = codigoGeradoEl ? codigoGeradoEl.value : '';

      if (!promptUsuario || !codigoAtual) {
        (window as any).showNotification('Precisa gerar um site e escrever uma instrução primeiro.', 'error'); return;
      }

      const systemInstruction = `Você é um compilador HTML estrito. Receberá um código HTML e um pedido de alteração.
Retorne um objeto JSON contendo APENAS a chave "codigo_html".
Altere APENAS o que foi expressamente pedido pelo utilizador. Mantenha todo o resto intacto.`;

      const userContent = `CÓDIGO ATUAL:\n${codigoAtual}\n\nALTERAÇÃO CIRÚRGICA REQUERIDA:\n${promptUsuario}`;

      chamarIA(systemInstruction, [{text: userContent}], true);
      if (promptUsuarioEl) promptUsuarioEl.value = ''; 
    };

    (window as any).mapearElementosGerados = (html: string) => {
      const doc = domParser.parseFromString(html, 'text/html');
      const images = doc.querySelectorAll('img');
      const links = Array.from(doc.querySelectorAll('a')).filter(a => a.hasAttribute('href') && !a.getAttribute('href')!.startsWith('javascript:'));
      
      const card = document.getElementById('elementManagerCard');
      const imgSection = document.getElementById('imageSection');
      const imgContainer = document.getElementById('imageInputsContainer');
      const linkSection = document.getElementById('linkSection');
      const linkContainer = document.getElementById('linkInputsContainer');
      
      if (!card || !imgSection || !imgContainer || !linkSection || !linkContainer) return;

      imgContainer.innerHTML = ''; 
      linkContainer.innerHTML = '';
      
      let temImagens = false;
      let temLinks = false;

      if (images.length > 0) {
        temImagens = true;
        imgSection.style.display = 'block';
        images.forEach((img, index) => {
          let idOuAlt = img.id || img.alt || `Imagem ${index + 1}`;
          const div = document.createElement('div');
          div.innerHTML = `
            <label class="text-[9px] font-bold text-gray-500 uppercase flex justify-between items-center mb-1">
                <span class="truncate pr-2">${idOuAlt}</span>
                <span class="bg-gray-200 text-gray-600 px-1 py-0.5 rounded text-[8px]">${img.width || '?'}x${img.height || '?'}</span>
            </label>
            <input type="text" id="img_replace_${index}" class="input-style text-xs py-1.5 px-2" value="${img.src}" placeholder="Cole URL da nova imagem">
          `;
          imgContainer.appendChild(div);
        });
      } else {
        imgSection.style.display = 'none';
      }

      if (links.length > 0) {
        temLinks = true;
        linkSection.style.display = 'block';
        links.forEach((a, index) => {
          let linkText = a.innerText.trim() || a.getAttribute('aria-label') || a.title;
          if (!linkText && (a.innerHTML.includes('<svg') || a.innerHTML.includes('<i'))) {
            linkText = a.innerHTML.includes('whatsapp') ? "Botão WhatsApp" : "Botão de Ícone";
          }
          if (!linkText) linkText = `Link ${index + 1}`;
          if (linkText.length > 35) linkText = linkText.substring(0, 35) + '...'; 

          const div = document.createElement('div');
          div.innerHTML = `
            <label class="text-[9px] font-bold text-gray-500 uppercase mb-1 block truncate" title="${linkText}">${linkText}</label>
            <input type="text" id="link_replace_${index}" class="input-style text-xs py-1.5 px-2" value="${a.getAttribute('href')}" placeholder="Cole link ex: https://wa.me/...">
          `;
          linkContainer.appendChild(div);
        });
      } else {
        linkSection.style.display = 'none';
      }

      card.style.display = (temImagens || temLinks) ? 'flex' : 'none';
    };

    (window as any).aplicarNovosElementos = () => {
      const codigoGeradoEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
      const previewFrameEl = document.getElementById('previewFrame') as HTMLIFrameElement;
      const codigoAtual = codigoGeradoEl ? codigoGeradoEl.value : '';
      if (!codigoAtual) return;

      const doc = domParser.parseFromString(codigoAtual, 'text/html');
      const images = doc.querySelectorAll('img');
      const links = Array.from(doc.querySelectorAll('a')).filter(a => a.hasAttribute('href') && !a.getAttribute('href')!.startsWith('javascript:'));

      let alterou = false;

      images.forEach((img, index) => {
        const input = document.getElementById(`img_replace_${index}`) as HTMLInputElement;
        if (input && input.value && input.value !== img.src) {
          img.src = input.value;
          alterou = true;
        }
      });

      links.forEach((a, index) => {
        const input = document.getElementById(`link_replace_${index}`) as HTMLInputElement;
        if (input && input.value && input.value !== a.getAttribute('href')) {
          a.setAttribute('href', input.value);
          alterou = true;
        }
      });

      if (alterou) {
        const novoHtml = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
        if (codigoGeradoEl) codigoGeradoEl.value = novoHtml;
        if (previewFrameEl) previewFrameEl.srcdoc = novoHtml;
        (window as any).showNotification('Elementos do site atualizados com sucesso!', 'success');
      } else {
        (window as any).showNotification('Nenhuma URL ou Link foi modificado.', 'success');
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
      div.className = `fixed bottom-4 right-4 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 z-50 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
      div.textContent = msg;
      document.body.appendChild(div);
      setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 300); }, 3000);
    };

    (window as any).copiarCodigo = () => {
      const codigoGeradoEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
      const text = codigoGeradoEl ? codigoGeradoEl.value : '';
      if (!text) return;
      
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        const btn = document.getElementById('btnCopyText');
        if (btn) btn.textContent = 'Copiado!';
        setTimeout(() => { if (btn) btn.textContent = 'Copiar'; }, 2000);
        (window as any).showNotification('Código copiado para a área de transferência!', 'success');
      } catch (err) {
        (window as any).showNotification('Erro ao copiar código.', 'error');
      }
      document.body.removeChild(textarea);
    };

    (window as any).handlePublicarSite = async () => {
      const codigoGeradoEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
      const htmlContent = codigoGeradoEl ? codigoGeradoEl.value : '';
      
      if (!htmlContent) {
        (window as any).showNotification('Gere um site primeiro antes de publicar.', 'error');
        return;
      }

      // 1. Pede o título do site
      const titulo = prompt('Digite um título para identificar este site (Ex: Finanças):') || 'Landing Page';
      
      // 2. Limpa o título para criar um link bonito (tira acentos e espaços viram traço)
      const slugSugerido = titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      // 3. Deixa você escolher o link exato (O código aleatório não é mais obrigatório!)
      let slug = prompt('Personalize o link final do seu site (não use espaços):', slugSugerido);
      
      // Se você apagar tudo e der OK, ele gera um código de segurança
      if (!slug) slug = slugSugerido + '-' + nanoid(4); 

      const userId = '00000000-0000-0000-0000-000000000000'; 

      const { error } = await supabase
        .from('sites_gerados')
        .insert([
          { 
            user_id: userId, 
            slug: slug, 
            titulo: titulo, 
            html_content: htmlContent 
          }
        ]);

      if (error) {
        console.error("Erro ao salvar no Supabase:", error);
        (window as any).showNotification('Erro: Este link já está em uso por outro site.', 'error');
        return;
      }

      // REMOVIDO O /s/ DAQUI!
      const linkPublico = `${window.location.origin}/${slug}`;
      navigator.clipboard.writeText(linkPublico);
      alert(`Site publicado com sucesso!\n\nLink copiado para a área de transferência:\n${linkPublico}`);
    };

  }, []);

  return (
    <div className="h-screen overflow-hidden flex relative bg-slate-100 text-slate-800 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        .card { background-color: white; border-radius: 0.75rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); padding: 1.5rem; display: flex; flex-direction: column; }
        .label-style { font-weight: 600; color: #1e293b; margin-bottom: 0.5rem; font-size: 0.875rem; display: flex; align-items: center;}
        .label-style i { margin-right: 0.5rem; color: #64748b; }
        .input-style { width: 100%; padding: 0.625rem 0.875rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; transition: all 0.2s; font-size: 0.875rem; }
        .input-style:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
        .primary-btn { background-color: #2563eb; color: white; font-weight: 600; transition: all 0.2s; display: flex; justify-content: center; align-items: center;}
        .primary-btn:hover { background-color: #1d4ed8; }
        
        .drop-zone { border: 2px dashed #94a3b8; border-radius: 0.75rem; background-color: #f8fafc; transition: all 0.2s ease; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
        .drop-zone:hover, .drop-zone.dragover { background-color: #e2e8f0; border-color: #3b82f6; }
        
        .image-preview-item { position: relative; border-radius: 0.5rem; overflow: hidden; border: 1px solid #e5e7eb; height: 80px; }
        .image-preview-item img { width: 100%; height: 100%; object-fit: cover; }
        .image-preview-item .remove-img { position: absolute; top: 4px; right: 4px; background: rgba(239, 68, 68, 0.9); color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px; }
        
        #previewFrame, #codigoContainer { display: none; }
        #previewFrame.active, #codigoContainer.active { display: block; }

        #loadingOverlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(15, 23, 42, 0.85); z-index: 9999; display: flex; justify-content: center; align-items: center; flex-direction: column; backdrop-filter: blur(4px); }
        #loadingSpinner { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #3b82f6; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />

      {/* CONTAINER DA APLICAÇÃO */}
      <div id="main-app-container" className="w-full h-full flex overflow-hidden">

        {/* Loading Overlay */}
        <div id="loadingOverlay" style={{ display: 'none' }}>
            <div id="loadingSpinner"></div>
            <p id="loadingText" className="text-white mt-4 font-medium text-lg">Analisando referências...</p>
            <p className="text-blue-300 text-sm mt-2">Aplicando as Regras de Alta Performance e LCP.</p>
        </div>

        {/* PAINEL ESQUERDO (CONTROLOS) */}
        <div className="w-full md:w-80 lg:w-96 bg-white shadow-xl flex flex-col h-full border-r border-gray-200 flex-shrink-0 z-10" id="leftPanel">
            
            <div className="p-5 border-b border-gray-100 bg-gray-50 pb-0">
                <h1 className="text-xl font-bold text-gray-800"><i className="fas fa-layer-group text-blue-600 mr-2"></i>Modelador Visual Pro</h1>
                <p className="text-xs text-gray-500 mt-1 mb-4">Engenharia reversa e Copywriting IA em alta performance.</p>
                
                {/* ABAS DE NAVEGAÇÃO */}
                <div className="flex border-b border-gray-200 mb-4">
                    <button id="btnTabVisual" onClick={() => (window as any).mudarModoApp('visual')} className="flex-1 py-2 text-sm font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50 transition-colors">
                        <i className="fas fa-image mr-1"></i> Modo Visual
                    </button>
                    <button id="btnTabCopy" onClick={() => (window as any).mudarModoApp('copy')} className="flex-1 py-2 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                        <i className="fas fa-file-alt mr-1"></i> Modo Texto (Copy)
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto p-5 space-y-5 flex-grow custom-scrollbar">

                {/* CONTEÚDO DA ABA: MODO VISUAL (CLONAGEM) */}
                <div id="containerModoVisual">
                    <div className="card p-4 mb-4">
                        <h3 className="label-style"><i className="fas fa-images"></i>Referências Visuais</h3>
                        <div className="drop-zone" onClick={() => document.getElementById('imageUploadInput')?.click()}>
                            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                            <p className="text-sm font-medium text-gray-600">Clique ou Cole (Ctrl+V) referências aqui.</p>
                            <p className="text-[10px] text-gray-400 mt-1">O sistema lerá o design e o recriará em código.</p>
                        </div>
                        <input type="file" id="imageUploadInput" multiple accept="image/png, image/jpeg, image/webp" className="hidden" onChange={(e) => (window as any).handleImageUpload(e)} />
                        
                        <div id="imagePreviewGrid" className="grid grid-cols-3 gap-2 mt-4"></div>
                        <p className="text-xs text-gray-500 text-right mt-1"><span id="imageCount">0</span> imagens anexadas.</p>
                    </div>

                    <div className="card p-4">
                        <h3 className="label-style"><i className="fas fa-cogs"></i>Modo de Construção</h3>
                        <select id="modoClonagem" className="input-style mb-4 font-medium text-gray-700">
                            <option value="exato">Recriação Fiel (Pixel Perfect)</option>
                            <option value="modelagem">Modelar (Layout Similar / Inspiração)</option>
                        </select>

                        <button onClick={() => (window as any).gerarSite()} className="primary-btn w-full py-3 rounded-lg shadow-md mt-2">
                            <i className="fas fa-magic mr-2"></i> Gerar Site Alta Performance
                        </button>
                    </div>
                </div>

                {/* CONTEÚDO DA ABA: MODO TEXTO (COPYWRITING) */}
                <div id="containerModoCopy" style={{ display: 'none' }}>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4 text-xs text-indigo-700">
                        A IA vai ler o conteúdo, extrair a essência, criar uma Copy persuasiva e construir o layout do zero.
                    </div>

                    <div className="card p-4 mb-4">
                        <h3 className="label-style"><i className="fas fa-file-lines"></i>Conteúdo do Produto</h3>
                        <p className="text-[10px] text-gray-500 mb-2">Insira o índice, introdução ou trechos do seu e-book/curso (Máx 5000 caracteres).</p>
                        <textarea id="productContent" maxLength={5000} rows={5} className="input-style resize-none text-xs" placeholder="Ex: Módulo 1 - O início de tudo..." onInput={(e: any) => {
                            const charCountEl = document.getElementById('charCount');
                            if (charCountEl) charCountEl.textContent = e.target.value.length;
                        }}></textarea>
                        <div className="text-right mt-1 text-[10px] text-gray-400 font-medium"><span id="charCount">0</span>/5000</div>
                    </div>

                    <div className="card p-4 mb-4">
                        <h3 className="label-style"><i className="fas fa-user-tie"></i>Descrição do Autor</h3>
                        <textarea id="authorBio" rows={3} className="input-style resize-none text-xs" placeholder="Ex: Especialista em marketing digital..."></textarea>
                    </div>

                    <div className="card p-4 mb-4">
                        <h3 className="label-style"><i className="fas fa-image"></i>Capa do E-book/Curso (Opcional)</h3>
                        <div className="drop-zone py-4" onClick={() => document.getElementById('coverUploadInput')?.click()}>
                            <i className="fas fa-camera text-2xl text-green-400 mb-2"></i>
                            <p className="text-xs font-medium text-gray-600">Anexar Imagem da Capa</p>
                        </div>
                        <input type="file" id="coverUploadInput" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={(e) => (window as any).handleCoverUpload(e)} />
                        
                        <div id="coverPreviewContainer" className="mt-3 hidden text-center">
                            <p className="text-[10px] text-gray-500 mb-1">Paleta de cores será extraída desta capa:</p>
                            <img id="coverImgPreview" className="h-20 object-contain mx-auto border border-gray-200 rounded" alt="Capa" />
                        </div>
                    </div>

                    <button onClick={() => (window as any).gerarSiteComCopy()} className="primary-btn w-full py-3 rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700">
                        <i className="fas fa-pen-nib mr-2"></i> Gerar Página de Vendas com Copy
                    </button>
                </div>

                {/* GESTOR DE ELEMENTOS */}
                <div id="elementManagerCard" className="card p-4 border-blue-200 bg-blue-50" style={{ display: 'none' }}>
                    <h3 className="label-style text-blue-800"><i className="fas fa-edit"></i>Editar Conteúdos Rápidos</h3>
                    <p className="text-[10px] text-blue-600 mb-3">Substitua os links dos botões e as imagens provisórias:</p>
                    
                    <div id="imageSection" style={{ display: 'none' }} className="mb-4">
                        <p className="text-[10px] font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2"><i className="fas fa-image mr-1"></i>IMAGENS</p>
                        <div id="imageInputsContainer" className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar"></div>
                    </div>

                    <div id="linkSection" style={{ display: 'none' }}>
                        <p className="text-[10px] font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2"><i className="fas fa-link mr-1"></i>LINKS E BOTÕES</p>
                        <div id="linkInputsContainer" className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar"></div>
                    </div>

                    <button onClick={() => (window as any).aplicarNovosElementos()} className="w-full bg-blue-600 text-white font-medium text-sm py-2 rounded mt-4 hover:bg-blue-700 transition">
                        <i className="fas fa-sync-alt mr-2"></i> Atualizar Elementos no Site
                    </button>
                </div>

            </div>

            {/* REFINAMENTO ESTRITO */}
            <div className="p-4 border-t border-gray-200 bg-blue-50 shadow-inner">
                <label className="label-style text-sm text-blue-800"><i className="fas fa-wand-magic-sparkles"></i> Fazer Alterações Específicas</label>
                <p className="text-[10px] text-blue-600 mb-2 font-medium">Escreva abaixo o que deseja adicionar ou modificar.</p>
                <div className="flex flex-col gap-2">
                    <textarea id="promptRefinamento" rows={3} className="input-style w-full text-xs resize-none border-blue-300 focus:border-blue-500" placeholder="Ex: Mude a cor do botão 'Comprar' para verde..."></textarea>
                    <button onClick={() => (window as any).refinarSiteEstrito()} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-3 rounded-lg transition-colors flex justify-center items-center">
                        <i className="fas fa-check mr-2"></i> Aplicar Alteração Estrita
                    </button>
                </div>
            </div>
        </div>

        {/* PAINEL DIREITO (PREVIEW E CÓDIGO) */}
        <div className="flex-grow flex flex-col bg-white relative">
            <div className="bg-white border-b border-gray-200 flex justify-between items-center px-4 h-14">
                <div className="flex h-full">
                    <button id="tabPreview" onClick={() => (window as any).mudarSeparador('preview')} className="h-full px-4 border-b-2 border-blue-600 text-blue-700 font-medium text-sm flex items-center">
                        <i className="fas fa-desktop mr-2"></i> Visualização
                    </button>
                    <button id="tabCode" onClick={() => (window as any).mudarSeparador('code')} className="h-full px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-medium text-sm flex items-center transition">
                        <i className="fas fa-code mr-2"></i> Código HTML
                    </button>
                </div>
                
                {/* BOTÕES NO TOPO DIREITO INCLUÍDOS AQUI */}
                <div className="flex items-center gap-2">
                    <button 
                      onClick={carregarMeusSites} 
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded shadow transition flex items-center gap-1"
                    >
                        <i className="fas fa-folder-open"></i> Meus Sites
                    </button>
                    <button 
                      onClick={() => (window as any).handlePublicarSite()} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-1.5 px-3 rounded shadow transition flex items-center gap-1"
                    >
                        <i className="fas fa-globe"></i> Publicar & Link Curto
                    </button>
                    <button 
                      onClick={() => (window as any).copiarCodigo()} 
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-1.5 px-3 rounded border border-gray-300 transition"
                    >
                        <i className="fas fa-copy mr-1"></i> <span id="btnCopyText">Copiar</span>
                    </button>
                </div>
            </div>
            
            <div className="flex-grow bg-gray-200 relative">
                <iframe id="previewFrame" className="w-full h-full active border-none bg-white" sandbox="allow-scripts allow-same-origin" title="Preview"></iframe>
                <div id="codigoContainer" className="w-full h-full">
                    <textarea id="codigoGerado" className="w-full h-full p-6 font-mono text-sm bg-gray-900 text-green-400 border-none outline-none resize-none" spellCheck={false} placeholder="O código gerado aparecerá aqui..."></textarea>
                </div>
            </div>
        </div>

      </div>

      {/* MODAL DE GERENCIAMENTO DE SITES PUBLICADOS (MEUS SITES) */}
      {modalMeusSitesAberto && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <i className="fas fa-folder-open text-blue-600"></i> Meus Sites Publicados
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Gerencie todos os seus links curtos, visualize, edite ou remova.</p>
              </div>
              <button 
                onClick={() => setModalMeusSitesAberto(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
              {carregandoSites ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-500">Carregando seus sites do Supabase...</p>
                </div>
              ) : listaSites.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-2">
                  <i className="fas fa-inbox text-4xl mb-2 text-slate-300"></i>
                  <p className="text-sm font-semibold">Nenhum site publicado ainda.</p>
                  <p className="text-xs">Gere um site no painel e clique em "Publicar & Link Curto".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listaSites.map((site) => {
                    // REMOVIDO O /s/ DAQUI TAMBÉM!
                    const linkUrl = `${window.location.origin}/${site.slug}`;
                    return (
                      <div key={site.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-bold text-slate-800 text-sm truncate" title={site.titulo}>{site.titulo}</h3>
                            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                              /{site.slug}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mb-4">
                            Criado em: {new Date(site.created_at).toLocaleDateString('pt-BR')} às {new Date(site.created_at).toLocaleTimeString('pt-BR')}
                          </p>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                            <input 
                              type="text" 
                              readOnly 
                              value={linkUrl} 
                              className="bg-transparent text-[11px] text-slate-600 w-full outline-none px-1 font-mono"
                            />
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(linkUrl);
                                (window as any).showNotification('Link copiado para a área de transferência!', 'success');
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-semibold px-2 py-1 rounded transition"
                              title="Copiar Link"
                            >
                              Copiar
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {/* REMOVIDO O /s/ DO BOTÃO ABRIR SITE */}
                            <a 
                              href={`/${site.slug}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                            >
                              <i className="fas fa-external-link-alt"></i> Abrir Site
                            </a>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => editarSite(site.html_content)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded border border-amber-200 transition flex items-center gap-1"
                                title="Carregar no editor para modificar"
                              >
                                <i className="fas fa-edit"></i> Editar
                              </button>
                              <button 
                                onClick={() => deletarSite(site.id, site.slug)}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded border border-red-200 transition flex items-center gap-1"
                                title="Deletar permanentemente"
                              >
                                <i className="fas fa-trash"></i> Deletar
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setModalMeusSitesAberto(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
              >
                Fechar Painel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}