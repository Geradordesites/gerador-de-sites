'use client';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

// SCRIPT DO IFRAME: BLINDAGEM ANTI-NAVEGAÇÃO E SELEÇÃO CIRÚRGICA
const SCRIPT_PREVIEW = `<script id="editor-magic-script">
    let modoEdicao = false;
    let elSelecionado = null;

    function rgbToHex(rgb) {
        if(!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return '';
        let res = rgb.match(/\\d+/g);
        if(!res) return '';
        return "#" + res.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }

    function sendCleanHtml() {
        let outlineAntigo = '';
        if(elSelecionado) { outlineAntigo = elSelecionado.style.outline; elSelecionado.style.outline = ''; }
        let htmlStr = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
        if(elSelecionado) { elSelecionado.style.outline = outlineAntigo; }
        window.parent.postMessage({ type: 'HTML_SYNC', html: htmlStr }, '*');
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
                if(event.data.src !== undefined) el.src = event.data.src;
                if(event.data.href !== undefined) el.setAttribute('href', event.data.href);
                if(event.data.bgColor !== undefined) el.style.backgroundColor = event.data.bgColor;
                if(event.data.textColor !== undefined) el.style.color = event.data.textColor;
                if(event.data.fontSize !== undefined) el.style.fontSize = event.data.fontSize + 'px';
                
                if(event.data.bgImage !== undefined) {
                    if(event.data.bgImage) {
                        el.style.backgroundImage = "url('" + event.data.bgImage + "')";
                        el.style.backgroundSize = "cover"; el.style.backgroundPosition = "center";
                    } else { el.style.backgroundImage = "none"; }
                }

                if(event.data.textAlign !== undefined) {
                    el.classList.remove('text-left', 'text-center', 'text-right', 'text-justify');
                    if(event.data.textAlign) el.classList.add(event.data.textAlign);
                }

                if(event.data.animationClass !== undefined) {
                    el.classList.remove('animate-pulse', 'animate-bounce', 'hover:scale-105', 'hover:scale-110', 'transition-transform', 'transition-all', 'duration-300', 'hover:-translate-y-2');
                    if(event.data.animationClass) event.data.animationClass.split(' ').forEach(cls => el.classList.add(cls));
                }

                if(event.data.customClasses !== undefined) {
                    if(el.dataset.customClasses) el.dataset.customClasses.split(' ').forEach(cls => { if(cls) el.classList.remove(cls); });
                    if(event.data.customClasses) event.data.customClasses.split(' ').forEach(cls => { if(cls) el.classList.add(cls); });
                    el.dataset.customClasses = event.data.customClasses; 
                }

                if(event.data.imgFormat !== undefined) {
                    el.classList.remove('aspect-video', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'h-auto', 'h-[450px]', 'h-[500px]', 'object-cover');
                    if (event.data.imgFormat) { el.classList.add(event.data.imgFormat); el.classList.add('object-cover', 'w-full'); }
                }
                if(event.data.imgRounded !== undefined) {
                    el.classList.remove('rounded-none', 'rounded-md', 'rounded-xl', 'rounded-full');
                    if (event.data.imgRounded) { el.classList.add(event.data.imgRounded); }
                }
                if(event.data.imgBorder !== undefined) {
                    if (event.data.imgBorder) { 
                        el.style.borderWidth = '4px'; el.style.borderStyle = 'solid'; el.classList.add('shadow-xl');
                    } else { 
                        el.style.borderWidth = '0px'; el.classList.remove('shadow-xl');
                    }
                }
                if(event.data.borderColor !== undefined) el.style.borderColor = event.data.borderColor;

                sendCleanHtml();
            }
        }
        if(event.data.type === 'REPLACE_ELEMENT_HTML') {
            let el = document.getElementById(event.data.id);
            if(el) { el.outerHTML = event.data.newHtml; sendCleanHtml(); }
        }
    });

    document.addEventListener('mouseover', (e) => {
        if(!modoEdicao || e.target === document.body || e.target === document.documentElement) return;
        e.target.dataset.oldOutline = e.target.style.outline;
        e.target.style.outline = '2px solid #0ea5e9'; // Azul elegante do inspetor
        e.target.style.outlineOffset = '-2px';
        e.target.style.cursor = 'crosshair';
    });
    
    document.addEventListener('mouseout', (e) => {
        if(!modoEdicao || e.target === document.body || e.target === document.documentElement) return;
        if(e.target !== elSelecionado) { 
            e.target.style.outline = e.target.dataset.oldOutline || ''; 
            e.target.style.outlineOffset = '';
        }
    });

    window.addEventListener('submit', function(e) { e.preventDefault(); e.stopPropagation(); }, true);

    document.addEventListener('click', (e) => {
        let link = e.target.closest('a');
        let btn = e.target.closest('button');
        
        if (modoEdicao) {
            e.preventDefault(); 
            e.stopPropagation();

            let targetEl = e.target;
            if (targetEl.tagName === 'SECTION' || targetEl.tagName === 'DIV' && targetEl.children.length > 3) {
                return;
            }

            if(elSelecionado) {
                elSelecionado.style.outline = '';
                elSelecionado.style.outlineOffset = '';
            }
            elSelecionado = targetEl;
            elSelecionado.style.outline = '3px solid #4f46e5';
            elSelecionado.style.outlineOffset = '-3px';

            if(!elSelecionado.id) elSelecionado.id = 'node_' + Math.random().toString(36).substr(2,9);

            let compStyle = window.getComputedStyle(elSelecionado);
            let bgImg = elSelecionado.style.backgroundImage || '';
            if(bgImg.startsWith('url(')) bgImg = bgImg.slice(5, -2).replace(/['"]/g, ''); 
            else bgImg = '';

            window.parent.postMessage({
                type: 'ELEMENT_SELECTED',
                id: elSelecionado.id,
                tagName: elSelecionado.tagName.toLowerCase(),
                text: elSelecionado.innerText || '',
                src: elSelecionado.src || '',
                href: elSelecionado.getAttribute('href') || '',
                className: elSelecionado.className,
                bgColor: rgbToHex(compStyle.backgroundColor),
                textColor: rgbToHex(compStyle.color),
                borderColor: rgbToHex(compStyle.borderColor),
                fontSize: parseInt(compStyle.fontSize) || 16,
                bgImage: bgImg,
                customClasses: elSelecionado.dataset.customClasses || '',
                outerHTML: elSelecionado.outerHTML
            }, '*');
            
            return;
        }

        if (link) {
            if (link.hasAttribute('onclick')) return; 
            e.preventDefault();
            e.stopPropagation();
            var href = link.getAttribute('href') || '';
            if(href.startsWith('#')) {
                var hash = href.substring(href.indexOf('#'));
                if (hash.length > 1) {
                    try { var tEl = document.querySelector(hash); if (tEl) tEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(err) {}
                }
            } else if (href && !href.startsWith('javascript:')) {
                window.open(href, '_blank');
            }
            return;
        }
        if (btn && btn.type === 'submit') { e.preventDefault(); return; }
    }, true); 
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
  
  // STATUS DE UI PREMIUM
  const [abaAtiva, setAbaAtiva] = useState<'visual' | 'copy'>('visual');
  const [modoInspetor, setModoInspetor] = useState(false);
  const [elementoSelecionado, setElementoSelecionado] = useState<any>(null);
  const [statusApis, setStatusApis] = useState<{ texto: string; processing: boolean }>({ texto: 'Motor Standby', processing: false });

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
                let cleanHtml = e.data.html.replace(/<script id="editor-magic-script">[\s\S]*?<\/script>/gi, '');
                cleanHtml = cleanHtml.replace(/ outline: 3px solid rgb\(79, 70, 229\); outline-offset: -3px;/g, '');
                codEl.value = cleanHtml;
            }
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/login'; };

  const toggleInspetor = () => {
      const newMode = !modoInspetor;
      setModoInspetor(newMode);
      setElementoSelecionado(null);
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      if(iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'TOGGLE_EDIT_MODE', value: newMode }, '*');
  };

  const atualizarElemento = (field: string, value: string | number | boolean) => {
      if(!elementoSelecionado) return;
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      iframe.contentWindow?.postMessage({ type: 'UPDATE_ELEMENT', id: elementoSelecionado.id, [field]: value }, '*');
      setElementoSelecionado((prev: any) => ({...prev, [field]: value}));
  };

  const otimizarComIA = async (comandoOverride?: string) => {
      const promptInput = document.getElementById('ai_prompt_element') as HTMLInputElement;
      const comando = comandoOverride || promptInput?.value.trim();
      if(!comando || !elementoSelecionado) { (window as any).showNotification("Informe o parâmetro de otimização.", "error"); return; }

      const systemInstruction = `Atue como Engenheiro de UI/UX e Copywriter Sênior B2B. Receberá o HTML de UM nó. Aplique a modificação: "${comando}". 
      REGRA MÁXIMA: DEVOLVA APENAS O NÓ (TAG HTML) FINAL E OTIMIZADO. Não inclua Markdown, não explique, não use jargões como "Aqui está o texto". Preserve o ID original id="${elementoSelecionado.id}".`;
      
      const resData = await chamarMotorIA(systemInstruction, [{text: `NÓ ORIGINAL:\n${elementoSelecionado.outerHTML}`}], true);
      
      if(resData && resData.html) {
          const cleanHtml = resData.html.replace(/```html/gi, '').replace(/```/g, '').trim();
          const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
          iframe.contentWindow?.postMessage({ type: 'REPLACE_ELEMENT_HTML', id: elementoSelecionado.id, newHtml: cleanHtml }, '*');
          if(promptInput) promptInput.value = '';
          (window as any).showNotification("Nó otimizado com sucesso.", "success");
      }
  };

  const chamarMotorIA = async (systemInstructionText: string, promptParts: any[], isElementRefinement = false) => {
    setStatusApis({ texto: isElementRefinement ? 'Inferência Groq...' : 'Motor Gemini Activo...', processing: true });

    try {
      const imageStyle = (document.getElementById('estiloImagem') as HTMLSelectElement)?.value || 'real';
      const dinamicaStyle = (document.getElementById('dinamicaSite') as HTMLSelectElement)?.value || 'estatico';

      const response = await fetch('/api/gerar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: systemInstructionText, promptParts, imageStyle, dinamica: dinamicaStyle, isElementRefinement, isGeminiForced: !isElementRefinement })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error === 'RATE_LIMIT_EXCEEDED' ? "Rate limit atingido. Aguarde 60s." : data.error);
      return data;
    } catch (err: any) {
      (window as any).showNotification(err.message, 'error');
      return null;
    } finally {
      setStatusApis({ texto: 'Motor Standby', processing: false });
    }
  };

  const getMegaPromptEstilo = () => {
    const estilo = (document.getElementById('nichoEstilo') as HTMLSelectElement)?.value || 'nenhum';
    if (estilo === 'premium') return "DIRETRIZ UI: Design sofisticado, premium SaaS. Tipografia elegante e espaçamentos precisos.";
    if (estilo === 'terapia') return "DIRETRIZ UI: Layout minimalista, saúde/bem-estar. Muito negative space (respiro) e bordas suaves.";
    if (estilo === 'agressivo') return "DIRETRIZ UI: Landing Page B2C agressiva, conversão direta. Alto contraste.";
    return "DIRETRIZ UI: Interface moderna, enterprise-grade, clean e focada em conversão.";
  };

  const getMegaPromptCores = () => {
    const cor = (document.getElementById('paletaCores') as HTMLSelectElement)?.value || 'auto';
    if (cor === 'personalizada') return `CORES: Fundo principal: ${(document.getElementById('corFundo') as HTMLInputElement)?.value}, Destaque/CTA: ${(document.getElementById('corPrimaria') as HTMLInputElement)?.value}`;
    if (cor === 'auto') return "CORES: Extraia fielmente o esquema de cores primárias, secundárias e acentos da imagem fornecida.";
    return `CORES: Tema otimizado focado em tons de ${cor.toUpperCase()}.`;
  };

  const getMegaPromptHero = () => {
    const hero = (document.getElementById('heroLayout') as HTMLSelectElement)?.value || 'auto';
    if (hero === 'center') return "LAYOUT HEADER: Text-center simétrico. Título, subtítulo e CTA perfeitamente alinhados ao centro.";
    if (hero === 'split') return "LAYOUT HEADER: Split-screen. Copy persuasiva na esquerda, Hero Asset (Imagem) na direita.";
    return "";
  };

  const executarGeracaoSiteVisual = async () => {
    if (uploadedImages.length === 0) { (window as any).showNotification('Forneça um asset visual (imagem) de referência.', 'error'); return; }
    const isMenu = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked ? "INCLUIR NAVIGATION BAR FIXA." : "SEM NAVIGATION BAR.";
    
    let promptParts: any[] = [{ text: "Gere a interface HTML/Tailwind completa (Navbar, Hero, Features, Social Proof, FAQ, Footer) aplicando engenharia reversa nesta imagem estrutural:" }];
    uploadedImages.forEach(img => promptParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } }));
    
    const instrucoesFinais = `Senior Front-End Engineer. \n${isMenu} \n${getMegaPromptEstilo()} \n${getMegaPromptHero()} \n${getMegaPromptCores()}`;
    const data = await chamarMotorIA(instrucoesFinais, promptParts, false);
    if (data) processarRespostaDOM(data);
  };

  const executarGeracaoSiteTexto = async () => {
    const content = (document.getElementById('productContent') as HTMLTextAreaElement)?.value.trim();
    if (!content) { (window as any).showNotification('Forneça o escopo do projeto (Briefing).', 'error'); return; }
    const isMenu = (document.getElementById('checkComMenuTexto') as HTMLInputElement)?.checked ? "INCLUIR NAVIGATION BAR FIXA." : "SEM NAVIGATION BAR.";
    const instrucoesFinais = `Copywriter B2B e Senior Front-End Engineer. Desenvolva uma Landing Page completa do zero com base neste briefing: \n${isMenu} \n${getMegaPromptEstilo()} \n${getMegaPromptHero()} \n${getMegaPromptCores()}`;
    
    const data = await chamarMotorIA(instrucoesFinais, [{ text: content }], false);
    if (data) processarRespostaDOM(data);
  };

  function processarRespostaDOM(data: any) {
      const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
      const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
      if (codEl) { setHistoricoCodigo(prev => [...prev, codEl.value]); codEl.value = data.html; }
      if (prevEl) prevEl.srcdoc = data.html + SCRIPT_PREVIEW; 
      (window as any).showNotification(`Interface renderizada via ${data.provedorTexto}`, 'success');
      if (modoInspetor) setModoInspetor(false);
  }

  // UPLOAD E INTEGRAÇÃO DE IMAGENS NOS ELEMENTOS
  const handleUploadImgElem = (e: React.ChangeEvent<HTMLInputElement>, isBg = false) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev: any) => { atualizarElemento(isBg ? 'bgImage' : 'src', ev.target.result); };
      reader.readAsDataURL(file);
      e.target.value = ''; 
  };

  const gerarNovaImagemIAAutomatica = async (isBackground = false) => {
      if(!elementoSelecionado) return;
      (window as any).showNotification("Sintetizando ativo visual...", "success");
      let termoBusca = "professional business modern minimal";
      if (elementoSelecionado.text && elementoSelecionado.text.length < 30) termoBusca = elementoSelecionado.text;

      try {
          const res = await fetch(`/api/unsplash?q=${encodeURIComponent(termoBusca)}`);
          const data = await res.json();
          if(data && data.url) { 
              atualizarElemento(isBackground ? 'bgImage' : 'src', data.url);
              (window as any).showNotification("Ativo integrado com sucesso.", "success"); 
          }
      } catch(err) { (window as any).showNotification("Falha no pipeline de imagens.", "error"); }
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
    if (!confirm(`Remover projeto permanentemente?`)) return;
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
    if (e.target.files) { Array.from(e.target.files).forEach(file => processFile(file as File)); e.target.value = ''; }
  };

  const removerImagem = (index: number) => { setUploadedImages(prev => prev.filter((_, i) => i !== index)); };

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
    (window as any).mudarSeparador = (aba: string) => {
      document.getElementById('previewFrame')!.classList.toggle('active', aba === 'preview');
      document.getElementById('codigoContainer')!.classList.toggle('active', aba === 'code');
      document.getElementById('tabPreview')!.className = aba === 'preview' ? "px-4 py-1.5 rounded-md font-semibold text-xs bg-zinc-900 text-white shadow-sm transition" : "px-4 py-1.5 rounded-md font-medium text-xs text-zinc-500 hover:text-zinc-900 transition";
      document.getElementById('tabCode')!.className = aba === 'code' ? "px-4 py-1.5 rounded-md font-semibold text-xs bg-zinc-900 text-white shadow-sm transition" : "px-4 py-1.5 rounded-md font-medium text-xs text-zinc-500 hover:text-zinc-900 transition";
    };

    (window as any).showNotification = (msg: string, type: string) => {
      const exist = document.getElementById('custom-toast'); if(exist) exist.remove();
      const div = document.createElement('div'); div.id = 'custom-toast';
      div.className = type === 'error' ? `fixed top-6 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-800 px-5 py-3 rounded-lg shadow-xl z-[9999] flex items-center gap-3 text-sm font-medium` : `fixed bottom-6 right-6 bg-zinc-900 text-white px-5 py-3 rounded-lg shadow-xl z-[9999] flex items-center gap-3 text-sm font-medium`;
      div.innerHTML = type === 'error' ? `<i class="fas fa-exclamation-triangle text-red-500"></i> <span>${msg}</span>` : `<i class="fas fa-check-circle text-emerald-400"></i> <span>${msg}</span>`;
      document.body.appendChild(div);
      setTimeout(() => { div.style.opacity = '0'; div.style.transition = 'opacity 0.4s'; setTimeout(() => div.remove(), 400); }, 3000);
    };

    (window as any).copiarCodigo = () => {
      const txt = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!txt) return; navigator.clipboard.writeText(txt); (window as any).showNotification('Markup copiado para o clipboard.', 'success');
    };

    (window as any).baixarHtmlGerado = () => {
      const txt = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!txt) return;
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/html' }));
      a.download = siteEditando ? `${siteEditando.slug}.html` : 'build-export.html'; a.click();
    };

    (window as any).handlePublicarSite = async () => {
      const htmlContent = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!htmlContent) return;
      
      let cleanHtml = htmlContent.replace(/<script id="editor-magic-script">[\s\S]*?<\/script>/gi, '').replace(/ outline: 3px solid rgb\(79, 70, 229\);/g, '');

      if (siteEditando) { await supabase.from('sites_gerados').update({ html_content: cleanHtml }).eq('id', siteEditando.id); (window as any).showNotification('Deploy atualizado com sucesso.', 'success'); return; }
      const nome = prompt('Nome do Deploy (URL Slug):'); if (!nome) return; 
      let slug = nome.trim().toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || nanoid(6); 
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { alert('Autenticação expirada.'); return; }
      await supabase.from('sites_gerados').insert([{ user_id: session?.user.id, slug, titulo: nome, html_content: cleanHtml }]);
      navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      alert(`Deploy concluído!\nURL Copiada: ${window.location.origin}/${slug}`);
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

  return (
    <div className="h-screen overflow-hidden flex relative bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style dangerouslySetInnerHTML={{__html: `
        .input-standard { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #e4e4e7; background-color: #fafafa; font-size: 0.75rem; outline: none; color: #27272a; transition: all 0.2s; }
        .input-standard:focus { border-color: #09090b; background-color: #ffffff; ring: 1px solid #09090b; }
        .input-label { font-size: 0.65rem; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem; display: block; }
        .panel-section { padding: 1rem; border-bottom: 1px solid #f4f4f5; }
        
        #previewFrame, #codigoContainer { display: none; }
        #previewFrame.active, #codigoContainer.active { display: block; }
        
        /* Modern Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #a1a1aa; }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
      `}} />

      {/* OVERLAY DE CARREGAMENTO */}
      {statusApis.processing && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-900 font-bold tracking-tight">{statusApis.texto}</p>
          </div>
      )}

      {/* PAINEL LATERAL DE CONTROLE (O "WEBFLOW") */}
      <div className="w-[340px] bg-white border-r border-zinc-200 flex flex-col h-full z-10 flex-shrink-0 shadow-sm">
          
          {/* HEADER DO PAINEL */}
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
              <h1 className="text-lg font-black tracking-tight text-zinc-900 flex items-center">
                  <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center mr-2 text-white"><i className="fas fa-layer-group text-xs"></i></div>
                  System<span className="text-zinc-400 font-medium">Pro</span>
              </h1>
              
              {/* BOTÃO TOGGLE DO INSPETOR (AGORA É UM SWITCH MODERNO) */}
              <button onClick={toggleInspetor} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${modoInspetor ? 'bg-zinc-900 text-white shadow-md' : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}>
                  <i className={`fas fa-crosshairs ${modoInspetor ? 'animate-pulse' : ''}`}></i> {modoInspetor ? 'Inspecionando' : 'Inspetor'}
              </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white">
              
              {/* SE O INSPETOR ESTIVER ATIVO, SUBSTITUI TUDO PELAS PROPRIEDADES DO ELEMENTO */}
              {modoInspetor ? (
                  <div className="animate-[fadeIn_0.2s_ease]">
                      <div className="bg-zinc-900 text-white p-3 text-[10px] font-mono tracking-widest uppercase flex justify-between items-center">
                          <span>Inspetor Estrutural</span>
                          <i className="fas fa-code text-zinc-500"></i>
                      </div>

                      {!elementoSelecionado ? (
                          <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400">
                              <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-3">
                                  <i className="fas fa-mouse-pointer text-lg"></i>
                              </div>
                              <p className="text-xs font-medium">Selecione um elemento no canvas<br/>para acessar as propriedades.</p>
                          </div>
                      ) : (
                          <div className="pb-10">
                              {/* IDENTIFICAÇÃO DO NÓ */}
                              <div className="panel-section bg-zinc-50/50">
                                  <div className="flex justify-between items-center">
                                      <div>
                                          <span className="text-[10px] font-black uppercase text-zinc-800 bg-white border border-zinc-200 px-2 py-0.5 rounded shadow-sm">{elementoSelecionado.tagName}</span>
                                      </div>
                                      <span className="text-[9px] font-mono text-zinc-400">ID: {elementoSelecionado.id.substring(0,6)}</span>
                                  </div>
                              </div>

                              {/* PROPRIEDADES DE IMAGEM */}
                              {elementoSelecionado.tagName === 'img' ? (
                                  <>
                                      <div className="panel-section">
                                          <label className="input-label">Source URL (Origem)</label>
                                          <input type="text" value={elementoSelecionado.src} onChange={(e) => atualizarElemento('src', e.target.value)} className="input-standard font-mono mb-2" />
                                          <div className="flex gap-2">
                                              <button onClick={() => gerarNovaImagemIAAutomatica(false)} className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-bold py-1.5 rounded transition"><i className="fas fa-magic mr-1"></i> Auto Generate</button>
                                              <label className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-bold py-1.5 rounded text-center cursor-pointer transition"><i className="fas fa-upload mr-1"></i> Upload Asset<input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImgElem(e, false)} /></label>
                                          </div>
                                      </div>
                                      <div className="panel-section grid grid-cols-2 gap-4">
                                          <div>
                                              <label className="input-label">Aspect Ratio</label>
                                              <select onChange={(e) => atualizarElemento('imgFormat', e.target.value)} className="input-standard">
                                                  <option value="">Livre / Auto</option>
                                                  <option value="aspect-video">16:9 (Landscape)</option>
                                                  <option value="aspect-[3/4]">3:4 (Portrait)</option>
                                                  <option value="aspect-square">1:1 (Square)</option>
                                              </select>
                                          </div>
                                          <div>
                                              <label className="input-label">Border Radius</label>
                                              <select onChange={(e) => atualizarElemento('imgRounded', e.target.value)} className="input-standard">
                                                  <option value="rounded-none">0px (Sharp)</option>
                                                  <option value="rounded-md">6px (Soft)</option>
                                                  <option value="rounded-xl">12px (Smooth)</option>
                                                  <option value="rounded-full">100% (Circle)</option>
                                              </select>
                                          </div>
                                      </div>
                                      <div className="panel-section flex justify-between items-center">
                                          <label className="flex items-center gap-2 cursor-pointer">
                                              <input type="checkbox" onChange={(e) => atualizarElemento('imgBorder', e.target.checked)} className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                                              <span className="text-xs font-semibold text-zinc-700">Ativar Traçado (Stroke)</span>
                                          </label>
                                          <input type="color" value={elementoSelecionado.borderColor || '#000000'} onChange={(e) => atualizarElemento('borderColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border border-zinc-200 p-0" />
                                      </div>
                                  </>
                              ) : (
                                  <>
                                      {/* PROPRIEDADES DE TEXTOS / BOTÕES / CONTAINERS */}
                                      {(elementoSelecionado.tagName === 'a' || elementoSelecionado.tagName === 'button') && (
                                          <div className="panel-section bg-blue-50/30">
                                              <label className="input-label text-blue-700">Link Destino (HREF)</label>
                                              <input type="text" placeholder="/url ou #ancora" value={elementoSelecionado.href} onChange={(e) => atualizarElemento('href', e.target.value)} className="input-standard font-mono border-blue-200 focus:border-blue-500" />
                                          </div>
                                      )}

                                      <div className="panel-section">
                                          <div className="flex justify-between items-end mb-2">
                                              <label className="input-label mb-0">Conteúdo do Nó</label>
                                              <div className="flex bg-zinc-100 rounded border border-zinc-200 p-0.5">
                                                  <button onClick={() => atualizarElemento('textAlign', 'text-left')} className="w-6 h-5 flex items-center justify-center hover:bg-white rounded text-zinc-500"><i className="fas fa-align-left text-[9px]"></i></button>
                                                  <button onClick={() => atualizarElemento('textAlign', 'text-center')} className="w-6 h-5 flex items-center justify-center hover:bg-white rounded text-zinc-500"><i className="fas fa-align-center text-[9px]"></i></button>
                                                  <button onClick={() => atualizarElemento('textAlign', 'text-right')} className="w-6 h-5 flex items-center justify-center hover:bg-white rounded text-zinc-500"><i className="fas fa-align-right text-[9px]"></i></button>
                                              </div>
                                          </div>
                                          <textarea rows={3} value={elementoSelecionado.text} onChange={(e) => atualizarElemento('text', e.target.value)} className="input-standard resize-y"></textarea>
                                      </div>
                                      
                                      <div className="panel-section grid grid-cols-2 gap-4">
                                          <div>
                                              <label className="input-label flex justify-between">Typography <span>{elementoSelecionado.fontSize}px</span></label>
                                              <input type="range" min="10" max="120" value={elementoSelecionado.fontSize || 16} onChange={(e) => atualizarElemento('fontSize', parseInt(e.target.value))} className="w-full h-1 bg-zinc-200 rounded appearance-none cursor-pointer accent-zinc-900 mt-2" />
                                          </div>
                                          <div className="flex flex-col gap-2">
                                              <div className="flex justify-between items-center">
                                                  <label className="text-[10px] font-semibold text-zinc-600">Fill (Fundo)</label>
                                                  <input type="color" value={elementoSelecionado.bgColor || '#ffffff'} onChange={(e) => atualizarElemento('bgColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer border border-zinc-200 p-0" />
                                              </div>
                                              <div className="flex justify-between items-center">
                                                  <label className="text-[10px] font-semibold text-zinc-600">Color (Letra)</label>
                                                  <input type="color" value={elementoSelecionado.textColor || '#000000'} onChange={(e) => atualizarElemento('textColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer border border-zinc-200 p-0" />
                                              </div>
                                          </div>
                                      </div>

                                      <div className="panel-section">
                                          <label className="input-label">Background Image</label>
                                          <div className="flex gap-2">
                                              <input type="text" placeholder="URL direta" value={elementoSelecionado.bgImage || ''} onChange={(e) => atualizarElemento('bgImage', e.target.value)} className="input-standard flex-1 font-mono" />
                                              <button onClick={() => gerarNovaImagemIAAutomatica(true)} className="w-8 h-8 flex items-center justify-center bg-zinc-100 border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-200 transition"><i className="fas fa-magic"></i></button>
                                          </div>
                                      </div>

                                      <div className="panel-section grid grid-cols-2 gap-4">
                                          <div className="col-span-2">
                                              <label className="input-label">Transições e Hover</label>
                                              <select onChange={(e) => atualizarElemento('animationClass', e.target.value)} className="input-standard">
                                                  <option value="">Desativado</option>
                                                  <option value="hover:scale-105 transition-transform duration-300">Scale +5% (Hover)</option>
                                                  <option value="hover:-translate-y-2 transition-transform duration-300">Lift UP (Hover)</option>
                                                  <option value="animate-pulse">Pulse (Atenção contínua)</option>
                                              </select>
                                          </div>
                                          <div className="col-span-2">
                                              <label className="input-label">Custom Classes (Tailwind)</label>
                                              <input type="text" placeholder="ex: bg-gradient-to-r opacity-90" value={elementoSelecionado.customClasses} onChange={(e) => atualizarElemento('customClasses', e.target.value)} className="input-standard font-mono text-[10px]" />
                                          </div>
                                      </div>
                                  </>
                              )}

                              {/* O MOTOR DE INFERÊNCIA SEMÂNTICA (IA) */}
                              <div className="m-4 bg-zinc-900 rounded-lg p-4 shadow-md text-white">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-3 flex items-center"><i className="fas fa-bolt mr-2 text-yellow-400"></i> Otimização Semântica IA</label>
                                  
                                  {elementoSelecionado.tagName !== 'img' && (
                                      <div className="grid grid-cols-2 gap-2 mb-3">
                                          <button onClick={() => otimizarComIA("Reescreva com copy persuasiva de alta conversão B2B, tom profissional e conciso")} className="bg-zinc-800 hover:bg-zinc-700 text-[9px] font-semibold py-2 rounded text-zinc-300 transition">Copy Persuasiva</button>
                                          <button onClick={() => otimizarComIA("Reescreva gerando forte urgência, escassez e call to action incisivo")} className="bg-zinc-800 hover:bg-zinc-700 text-[9px] font-semibold py-2 rounded text-zinc-300 transition">Gerar Urgência</button>
                                      </div>
                                  )}
                                  <div className="flex gap-2 relative">
                                      <input type="text" id="ai_prompt_element" placeholder="Prompt livre..." className="w-full bg-zinc-800 border border-zinc-700 text-white text-[11px] rounded-md px-3 py-2 outline-none focus:border-zinc-500 placeholder-zinc-500" />
                                      <button onClick={() => otimizarComIA()} className="absolute right-1 top-1 bottom-1 w-8 bg-zinc-700 hover:bg-zinc-600 rounded flex items-center justify-center transition"><i className="fas fa-arrow-right text-xs"></i></button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              ) : (
                  
                  /* SE O INSPETOR ESTIVER DESATIVADO, MOSTRA O PAINEL DE GERAÇÃO (O BUILDER MESTRE) */
                  <div className="animate-[fadeIn_0.2s_ease] pb-10">
                      
                      {/* TABS DE MODO DE CRIAÇÃO */}
                      <div className="flex p-2 bg-zinc-100/50 border-b border-zinc-200">
                          <button onClick={() => setAbaAtiva('visual')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition ${abaAtiva === 'visual' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}>Design Visual</button>
                          <button onClick={() => setAbaAtiva('copy')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition ${abaAtiva === 'copy' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}>Briefing (Texto)</button>
                      </div>

                      <div className="p-4 space-y-5">
                          {/* SESSÃO 1: DIRETRIZES GLOBAIS */}
                          <div>
                              <h3 className="text-[11px] font-black uppercase text-zinc-800 mb-3 tracking-wide flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-zinc-800 mr-2"></span>1. Diretrizes Globais</h3>
                              <div className="space-y-3 bg-zinc-50 border border-zinc-200 p-3 rounded-lg">
                                  <div>
                                      <label htmlFor="nichoEstilo" className="input-label">Tema Base UI</label>
                                      <select id="nichoEstilo" className="input-standard">
                                          <option value="minimalista">Minimalista (Clean / Moderno)</option>
                                          <option value="premium">Premium (Elegante / B2B)</option>
                                          <option value="agressivo">Agressivo (Lançamentos / Dark)</option>
                                          <option value="corporativo">Corporativo (Institucional)</option>
                                          <option value="terapia">Acolhedor (Saúde / Terapia)</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label htmlFor="paletaCores" className="input-label">Design System (Cores)</label>
                                      <select id="paletaCores" value={corSelecionada} onChange={(e) => setCorSelecionada(e.target.value)} className="input-standard">
                                          <option value="auto">Inferir Fielmente da Referência (Auto)</option>
                                          <option value="dark">Dark Mode (Preto & High Contrast)</option>
                                          <option value="azul">Corporate Blue (Confiança/Tech)</option>
                                          <option value="verde">Emerald Green (Finanças/Saúde)</option>
                                          <option value="cinza">Zinc / Monocromático</option>
                                          <option value="personalizada">Definir Cores Customizadas...</option>
                                      </select>
                                      {corSelecionada === 'personalizada' && (
                                          <div className="flex gap-3 mt-3 p-3 bg-white rounded border border-zinc-200">
                                              <div className="flex-1"><label className="input-label">Background</label><input type="color" id="corFundo" className="w-full h-8 rounded cursor-pointer p-0 border border-zinc-200" defaultValue="#ffffff" /></div>
                                              <div className="flex-1"><label className="input-label">Accent / Call-to-action</label><input type="color" id="corPrimaria" className="w-full h-8 rounded cursor-pointer p-0 border border-zinc-200" defaultValue="#09090b" /></div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>

                          {/* SESSÃO 2: ESTRUTURA */}
                          <div>
                              <h3 className="text-[11px] font-black uppercase text-zinc-800 mb-3 tracking-wide flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-zinc-800 mr-2"></span>2. Estrutura Base</h3>
                              <div className="space-y-3 bg-zinc-50 border border-zinc-200 p-3 rounded-lg">
                                  <div>
                                      <label htmlFor="heroLayout" className="input-label">Hero Section (Primeira Dobra)</label>
                                      <select id="heroLayout" className="input-standard">
                                          <option value="auto">Inteligente (Análise da Imagem)</option>
                                          <option value="center">Centralizado (Foco em Copy)</option>
                                          <option value="split">Split Layout (Copy Left, Asset Right)</option>
                                      </select>
                                  </div>
                                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                                      <input type="checkbox" id="checkComMenu" defaultChecked={true} className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                                      <span className="text-xs font-semibold text-zinc-700">Incluir Navigation Bar Fixa</span>
                                  </label>
                              </div>
                          </div>

                          {/* SESSÃO 3: O MOTOR DE GERAÇÃO */}
                          {abaAtiva === 'visual' ? (
                              <div>
                                  <h3 className="text-[11px] font-black uppercase text-zinc-800 mb-3 tracking-wide flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>3. Input Visual (Clonagem)</h3>
                                  <div className="bg-white border-2 border-dashed border-zinc-200 hover:border-blue-400 hover:bg-blue-50/20 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => document.getElementById('imageUploadInput')?.click()}>
                                      <i className="fas fa-image text-2xl text-zinc-300 mb-2"></i>
                                      <p className="text-xs font-bold text-zinc-700">Forneça o Asset Visual</p>
                                      <p className="text-[10px] font-medium text-zinc-400 mt-1">Arraste ou Ctrl+V para injetar.</p>
                                  </div>
                                  <input type="file" id="imageUploadInput" multiple accept="image/*" className="hidden" onChange={handleImageUploadInput} />
                                  
                                  {uploadedImages.length > 0 && (
                                      <div className="flex gap-2 mt-3 overflow-x-auto pb-2 custom-scrollbar">
                                          {uploadedImages.map((imgObj, idx) => (
                                              <div key={idx} className="relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden border border-zinc-200 group">
                                                  <img src={`data:${imgObj.mimeType};base64,${imgObj.data}`} className="w-full h-full object-cover" />
                                                  <button className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs" onClick={(e) => { e.stopPropagation(); removerImagem(idx); }}><i className="fas fa-trash"></i></button>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                                  
                                  <button onClick={executarGeracaoSiteVisual} className="w-full mt-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-2">
                                      <i className="fas fa-code"></i> Gerar Interface HTML
                                  </button>
                              </div>
                          ) : (
                              <div>
                                  <h3 className="text-[11px] font-black uppercase text-zinc-800 mb-3 tracking-wide flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>3. Input Textual (Briefing)</h3>
                                  <textarea id="productContent" className="input-standard h-32 resize-none leading-relaxed" placeholder="Descreva o objetivo da Landing Page, público-alvo e principais benefícios que o motor deve estruturar..."></textarea>
                                  
                                  <button onClick={executarGeracaoSiteTexto} className="w-full mt-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-2">
                                      <i className="fas fa-code"></i> Construir do Zero
                                  </button>
                              </div>
                          )}
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* ÁREA PRINCIPAL DA DIREITA (PREVIEW / CÓDIGO) */}
      <div className="flex-grow flex flex-col bg-zinc-100 relative min-w-0">
          
          {/* HEADER DO WORKSPACE */}
          <div className="bg-white border-b border-zinc-200 flex justify-between items-center px-4 md:px-6 h-14 shadow-sm z-10">
              <div className="flex items-center gap-3">
                  <div className="flex bg-zinc-100 p-0.5 rounded-md border border-zinc-200">
                      <button id="tabPreview" onClick={() => (window as any).mudarSeparador('preview')} className="px-4 py-1.5 rounded-md font-semibold text-[11px] bg-white text-zinc-900 shadow-sm transition">Preview</button>
                      <button id="tabCode" onClick={() => (window as any).mudarSeparador('code')} className="px-4 py-1.5 rounded-md font-medium text-[11px] text-zinc-500 hover:text-zinc-900 transition">Markup</button>
                  </div>
                  <div className="w-px h-4 bg-zinc-200 mx-1 hidden md:block"></div>
                  <button onClick={desfazerCodigo} className="hidden md:flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-[11px] font-semibold transition"><i className="fas fa-undo"></i> Undo</button>
              </div>

              <div className="flex items-center gap-3">
                  <button onClick={carregarMeusSites} className="text-zinc-600 hover:text-zinc-900 font-semibold text-[11px] px-3 py-1.5 transition">Projects</button>
                  <div className="w-px h-4 bg-zinc-200"></div>
                  <button onClick={() => (window as any).baixarHtmlGerado()} className="text-zinc-600 hover:text-zinc-900 text-[11px] px-2 py-1.5 transition" title="Export HTML"><i className="fas fa-download"></i></button>
                  <button onClick={() => (window as any).copiarCodigo()} className="text-zinc-600 hover:text-zinc-900 text-[11px] px-2 py-1.5 transition mr-2" title="Copy Markup"><i className="fas fa-copy"></i></button>
                  
                  {siteEditando ? (
                      <div className="flex gap-2">
                          <button onClick={() => setSiteEditando(null)} className="px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[11px] rounded-md transition">Cancel</button>
                          <button onClick={() => (window as any).handlePublicarSite()} className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white font-bold text-[11px] rounded-md transition">Update Deploy</button>
                      </div>
                  ) : (
                      <button onClick={() => (window as any).handlePublicarSite()} className="px-5 py-1.5 bg-zinc-900 hover:bg-black text-white font-bold text-[11px] rounded-md shadow-sm transition">Publish</button>
                  )}
              </div>
          </div>
          
          {/* O CANVAS (ONDE O SITE FICA) */}
          <div className="flex-grow relative bg-zinc-100 p-0 md:p-6 lg:p-8 overflow-hidden flex justify-center">
              {modoInspetor && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-2 rounded-full shadow-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border border-zinc-700 animate-pulse pointer-events-none">
                      <i className="fas fa-crosshairs text-blue-400"></i> Selecione um nó no Canvas para Inspecionar
                  </div>
              )}
              
              {/* O Container simula uma tela de navegador/viewport */}
              <div className={`w-full h-full max-w-[1440px] bg-white mx-auto shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300 ${modoInspetor ? 'ring-4 ring-blue-500/20 rounded-lg' : 'rounded-none md:rounded-xl border border-zinc-200'}`}>
                  {modoInspetor && (
                      <div className="h-6 w-full bg-zinc-100 border-b border-zinc-200 flex items-center px-4 gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                          <div className="mx-auto bg-white border border-zinc-200 text-[9px] text-zinc-400 px-12 py-0.5 rounded font-mono">Viewport: Desktop 1440px</div>
                      </div>
                  )}
                  <iframe id="previewFrame" className="w-full flex-1 border-none active bg-white" sandbox="allow-scripts allow-same-origin" title="Preview Canvas"></iframe>
                  <div id="codigoContainer" className="w-full h-full bg-[#0d1117] relative">
                      <textarea id="codigoGerado" className="absolute inset-0 w-full h-full font-mono text-[13px] bg-[#0d1117] text-[#56d364] border-none outline-none resize-none custom-scrollbar p-6 leading-relaxed"></textarea>
                  </div>
              </div>
          </div>
      </div>
      
      {/* MODAL DE PROJETOS (DEPLOY MANAGER) */}
      {modalMeusSitesAberto && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-zinc-200">
            <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h2 className="text-sm font-black text-zinc-800 uppercase tracking-wider flex items-center"><i className="fas fa-server text-zinc-400 mr-2"></i> Deploy Manager</h2>
              <button onClick={() => setModalMeusSitesAberto(false)} className="w-7 h-7 rounded bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-white">
              {carregandoSites ? <p className="text-center text-sm font-medium text-zinc-400 py-12">Fetching deploys...</p> : listaSites.length === 0 ? <p className="text-center text-sm font-medium text-zinc-400 py-12">Nenhum projeto encontrado no servidor.</p> : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sitesAtuais.map((site) => {
                        const linkUrl = `${window.location.origin}/${site.slug}`;
                        return (
                          <div key={site.id} className="border border-zinc-200 rounded-lg p-4 hover:border-zinc-300 hover:shadow-md transition bg-white flex flex-col">
                            <h3 className="font-bold text-sm text-zinc-900 mb-3 truncate">{site.titulo}</h3>
                            <div className="flex bg-zinc-50 border border-zinc-200 rounded text-[10px] overflow-hidden mb-4">
                                <span className="bg-zinc-100 text-zinc-400 px-2 py-1.5 border-r border-zinc-200 flex items-center"><i className="fas fa-link"></i></span>
                                <input type="text" readOnly value={linkUrl} className="bg-transparent w-full p-1.5 outline-none font-mono text-zinc-600" />
                            </div>
                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-100">
                              <a href={`/${site.slug}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase text-zinc-500 hover:text-zinc-900 transition flex items-center"><i className="fas fa-external-link-alt mr-1.5"></i> Visit</a>
                              <div className="flex gap-2">
                                <button onClick={() => editarSite(site)} className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-[10px] font-bold rounded transition">Open in Editor</button>
                                <button onClick={() => deletarSite(site.id, site.slug)} className="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-[10px] font-bold rounded transition"><i className="fas fa-trash"></i></button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {totalPaginas > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-zinc-100">
                        <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1} className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 text-xs font-bold rounded disabled:opacity-50 hover:bg-zinc-50 transition"><i className="fas fa-chevron-left"></i></button>
                        <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Page {paginaAtual} of {totalPaginas}</span>
                        <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 text-xs font-bold rounded disabled:opacity-50 hover:bg-zinc-50 transition"><i className="fas fa-chevron-right"></i></button>
                      </div>
                    )}
                  </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}