'use client';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

// SCRIPT DO IFRAME BLINDADO (SEM DUPLICAÇÃO, COM SUPORTE TOTAL A FORMATOS E BORDAS)
const SCRIPT_PREVIEW = `<script id="editor-magic-script">
    let modoEdicao = false;
    let elSelecionado = null;

    function rgbToHex(rgb) {
        let res = rgb.match(/\\d+/g);
        if(!res) return '#000000';
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
                    el.classList.remove('animate-pulse', 'animate-bounce', 'hover:scale-105', 'hover:scale-110', 'transition-transform', 'transition-all', 'duration-300');
                    if(event.data.animationClass) event.data.animationClass.split(' ').forEach(cls => el.classList.add(cls));
                }

                if(event.data.customClasses !== undefined) {
                    if(el.dataset.customClasses) el.dataset.customClasses.split(' ').forEach(cls => { if(cls) el.classList.remove(cls); });
                    if(event.data.customClasses) event.data.customClasses.split(' ').forEach(cls => { if(cls) el.classList.add(cls); });
                    el.dataset.customClasses = event.data.customClasses; 
                }

                // CONTROLES DE IMAGEM CORRIGIDOS E DIRETOS
                if(event.data.imgFormat !== undefined) {
                    el.classList.remove('aspect-video', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'h-auto', 'h-[450px]', 'h-[500px]', 'object-cover');
                    if (event.data.imgFormat) { 
                        el.classList.add(event.data.imgFormat); 
                        el.classList.add('object-cover', 'w-full'); 
                    }
                }
                if(event.data.imgRounded !== undefined) {
                    el.classList.remove('rounded-none', 'rounded-md', 'rounded-xl', 'rounded-full');
                    if (event.data.imgRounded) { el.classList.add(event.data.imgRounded); }
                }
                if(event.data.imgBorder !== undefined) {
                    if (event.data.imgBorder) { 
                        el.style.borderWidth = '6px';
                        el.style.borderStyle = 'solid';
                        el.classList.add('shadow-2xl');
                    } else { 
                        el.style.borderWidth = '0px';
                        el.classList.remove('shadow-2xl');
                    }
                }
                if(event.data.borderColor !== undefined) {
                    el.style.borderColor = event.data.borderColor;
                }

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
        e.target.style.outline = '2px dashed #4f46e5';
        e.target.style.cursor = 'crosshair';
    });
    
    document.addEventListener('mouseout', (e) => {
        if(!modoEdicao || e.target === document.body || e.target === document.documentElement) return;
        if(e.target !== elSelecionado) { e.target.style.outline = e.target.dataset.oldOutline || ''; }
    });

    document.addEventListener('click', (e) => {
        var link = e.target.closest('a');
        if (link) {
            if (link.hasAttribute('onclick')) return; 
            e.preventDefault(); e.stopPropagation();
            if (!modoEdicao) {
                var href = link.getAttribute('href') || '';
                if(href.startsWith('#')) {
                    var hash = href.substring(href.indexOf('#'));
                    if (hash.length > 1) {
                        try { var targetEl = document.querySelector(hash); if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(err) {}
                    }
                } else if (href && !href.startsWith('javascript:')) {
                    window.open(href, '_blank');
                }
                return; 
            }
        }

        if(!modoEdicao) return;
        e.preventDefault(); e.stopPropagation();

        // SELEÇÃO CIRÚRGICA DO ELEMENTO CLICADO (IMPEDE SELECIONAR BLOCOS INTEIROS POR ENGANO)
        let targetEl = e.target;
        if (targetEl.tagName === 'SECTION' || targetEl.tagName === 'DIV' && targetEl.children.length > 2) {
            // Se clicar num container grande, tenta focar no elemento interno clicado
            return;
        }

        if(elSelecionado) elSelecionado.style.outline = '';
        elSelecionado = targetEl;
        elSelecionado.style.outline = '3px solid #4f46e5';

        if(!elSelecionado.id) elSelecionado.id = 'el_' + Math.random().toString(36).substr(2,9);

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
                let cleanHtml = e.data.html.replace(/<script id="editor-magic-script">[\s\S]*?<\/script>/gi, '');
                cleanHtml = cleanHtml.replace(/ outline: 3px solid rgb\(79, 70, 229\);/g, '');
                codEl.value = cleanHtml;
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

  const atualizarElementoManual = (field: string, value: string | number | boolean) => {
      if(!elementoSelecionado) return;
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      iframe.contentWindow?.postMessage({ type: 'UPDATE_ELEMENT', id: elementoSelecionado.id, [field]: value }, '*');
      setElementoSelecionado((prev: any) => ({...prev, [field]: value}));
  };

  const refinarElementoComIA = async (comandoOverride?: string) => {
      const promptInput = document.getElementById('ai_prompt_element') as HTMLInputElement;
      const comando = comandoOverride || promptInput?.value.trim();
      if(!comando || !elementoSelecionado) { (window as any).showNotification("Digite o que deseja mudar na IA.", "error"); return; }

      const systemInstruction = `Você é um Copywriter de Elite e Programador Cirúrgico.
      Receberá o HTML de UM único elemento. Modifique apenas o que for pedido: "${comando}". 
      REGRA MÁXIMA: Se for pedido para reescrever, melhorar ou refazer o texto, APENAS DEVOLVA O TEXTO PERSUASIVO FINAL DENTRO DA TAG HTML. NUNCA escreva coisas literais como "Aqui está a reescrita" ou "Refazendo o texto".
      Preserve o atributo id="${elementoSelecionado.id}".`;
      
      const resData = await (window as any).chamarIABase(systemInstruction, [{text: `HTML ORIGINAL:\n${elementoSelecionado.outerHTML}`}], true);
      
      if(resData && resData.html) {
          const cleanHtml = resData.html.replace(/```html/gi, '').replace(/```/g, '').trim();
          const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
          iframe.contentWindow?.postMessage({ type: 'REPLACE_ELEMENT_HTML', id: elementoSelecionado.id, newHtml: cleanHtml }, '*');
          if(promptInput) promptInput.value = '';
          (window as any).showNotification("Elemento alterado por IA!", "success");
      }
  };

  const handleUploadImgElem = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev: any) => { atualizarElementoManual('src', ev.target.result); };
      reader.readAsDataURL(file);
      e.target.value = ''; 
  };

  // BUSCA AUTOMÁTICA DE IMAGEM SEM ALERTA / PROMPT CHATO
  const gerarNovaImagemIAAutomatica = async () => {
      if(!elementoSelecionado) return;
      (window as any).showNotification("Buscando nova imagem inteligente...", "success");
      
      // Extrai palavras-chave do alt ou usa um termo genérico profissional
      let termoBusca = "professional business modern";
      if (elementoSelecionado.text && elementoSelecionado.text.length < 30) {
          termoBusca = elementoSelecionado.text;
      }

      try {
          const res = await fetch(`/api/unsplash?q=${encodeURIComponent(termoBusca)}`);
          const data = await res.json();
          if(data && data.url) { 
              atualizarElementoManual('src', data.url); 
              (window as any).showNotification("Imagem atualizada com sucesso!", "success"); 
          }
      } catch(err) { 
          (window as any).showNotification("Erro ao buscar imagem.", "error"); 
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
    if (e.target.files) { Array.from(e.target.files).forEach(file => processFile(file as File)); e.target.value = ''; }
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
        btnV.className = "flex-1 py-1.5 text-xs font-bold rounded bg-white shadow-sm text-indigo-700 transition";
        btnC.className = "flex-1 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-700 transition";
        contV.style.display = 'block'; contC.style.display = 'none';
      } else {
        btnC.className = "flex-1 py-1.5 text-xs font-bold rounded bg-white shadow-sm text-indigo-700 transition";
        btnV.className = "flex-1 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-700 transition";
        contC.style.display = 'block'; contV.style.display = 'none';
      }
    };

    (window as any).chamarIABase = async (systemInstructionText: string, promptParts: any[], isElementRefinement = false) => {
      const loadOverlay = document.getElementById('loadingOverlay');
      if (loadOverlay) loadOverlay.style.display = 'flex';
      setStatusApis({ texto: isElementRefinement ? 'Groq (Copy)' : 'Google Gemini', imagem: '' });

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

    const getMegaPromptEstilo = () => {
      const estilo = (document.getElementById('nichoEstilo') as HTMLSelectElement)?.value || 'nenhum';
      if (estilo === 'premium') return "DIRETRIZ VISUAL: Design sofisticado (Premium). Tipografia serifada elegante.";
      if (estilo === 'terapia') return "DIRETRIZ VISUAL: Layout minimalista, calmo e acolhedor. Muito espaço em branco e bordas arredondadas.";
      if (estilo === 'agressivo') return "DIRETRIZ VISUAL: Altíssima conversão, Dark Mode agressivo com textos claros.";
      return "DIRETRIZ VISUAL: Crie um design profissional, moderno e altamente focado em conversão.";
    };

    const getMegaPromptCores = () => {
      const cor = (document.getElementById('paletaCores') as HTMLSelectElement)?.value || 'auto';
      if (cor === 'personalizada') return `OVERRIDE - CORES: Fundo principal: ${(document.getElementById('corFundo') as HTMLInputElement)?.value}, Cor de Destaque: ${(document.getElementById('corPrimaria') as HTMLInputElement)?.value}`;
      if (cor === 'auto') return "PALETA: Clone as cores exatas da referência visual.";
      return `PALETA DE CORES: Foco em ${cor.toUpperCase()}.`;
    };

    const getMegaPromptHero = () => {
      const hero = (document.getElementById('heroLayout') as HTMLSelectElement)?.value || 'auto';
      if (hero === 'center') return "ESTRUTURA DO HERO: Centralizado (text-center).";
      if (hero === 'split') return "ESTRUTURA DO HERO: Dividido em duas colunas (Texto e Imagem).";
      return "";
    };

    (window as any).executarGeracaoSite = async (imagesList: any[]) => {
      if (imagesList.length === 0) { (window as any).showNotification('Anexe referências visuais na caixa de Upload.', 'error'); return; }
      const isMenu = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked ? "CRIE UM MENU SUPERIOR FIXO." : "NÃO CRIE MENU.";
      
      let promptParts: any[] = [{ text: "Gere a Landing Page COMPLETA (Topo, Benefícios, Prova Social, Sobre, FAQ e Rodapé). Faça a engenharia reversa exata do design desta imagem:" }];
      imagesList.forEach(img => promptParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } }));
      
      const instrucoesFinais = `Dev Sênior e Especialista UI/UX. \n${isMenu} \n${getMegaPromptEstilo()} \n${getMegaPromptHero()} \n${getMegaPromptCores()}`;
      const data = await (window as any).chamarIABase(instrucoesFinais, promptParts, false);
      if (data) processarResposta(data);
    };

    (window as any).gerarSiteComCopy = async () => {
      const content = (document.getElementById('productContent') as HTMLTextAreaElement)?.value.trim();
      if (!content) { (window as any).showNotification('Insira o texto base ou comando.', 'error'); return; }
      const isMenu = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked ? "CRIE UM MENU SUPERIOR FIXO." : "NÃO CRIE MENU.";
      const instrucoesFinais = `Copywriter e Dev Sênior. Crie uma Landing Page COMPLETA do zero (Topo, Benefícios, Prova Social, Sobre, FAQ e Rodapé). \n${isMenu} \n${getMegaPromptEstilo()} \n${getMegaPromptHero()} \n${getMegaPromptCores()}`;
      
      const data = await (window as any).chamarIABase(instrucoesFinais, [{ text: content }], false);
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
      document.getElementById('tabPreview')!.classList.toggle('bg-white', aba === 'preview');
      document.getElementById('tabPreview')!.classList.toggle('text-blue-600', aba === 'preview');
      document.getElementById('tabCode')!.classList.toggle('bg-white', aba === 'code');
      document.getElementById('tabCode')!.classList.toggle('text-blue-600', aba === 'code');
    };

    (window as any).showNotification = (msg: string, type: string) => {
      const exist = document.getElementById('custom-toast'); if(exist) exist.remove();
      const div = document.createElement('div'); div.id = 'custom-toast';
      div.className = type === 'error' ? `fixed top-10 left-1/2 -translate-x-1/2 bg-white border-l-4 border-red-500 px-6 py-4 rounded shadow-2xl z-[9999] flex gap-4 max-w-xl` : `fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded shadow-xl z-[9999] flex gap-2`;
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
      a.download = siteEditando ? `${siteEditando.slug}.html` : 'landing-page-pro.html'; a.click();
    };

    (window as any).handlePublicarSite = async () => {
      const htmlContent = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!htmlContent) return;
      if (siteEditando) { await supabase.from('sites_gerados').update({ html_content: htmlContent }).eq('id', siteEditando.id); (window as any).showNotification('Atualizado!', 'success'); return; }
      const nome = prompt('Nome do site:'); if (!nome) return; 
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
    if (carregandoSites) return <p className="text-center text-sm text-slate-500 py-8">Carregando...</p>;
    if (listaSites.length === 0) return <div className="text-center py-16 text-slate-400"><p className="text-sm font-semibold">Nenhum site publicado.</p></div>;
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sitesAtuais.map((site) => {
            const linkUrl = `${window.location.origin}/${site.slug}`;
            return (
              <div key={site.id} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col">
                <h3 className="font-black text-sm mb-2">{site.titulo}</h3>
                <input type="text" readOnly value={linkUrl} className="bg-slate-50 border rounded text-[11px] w-full p-1.5 mb-3 font-mono" />
                <div className="flex justify-between items-center mt-auto">
                  <a href={`/${site.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold">Abrir</a>
                  <div className="flex gap-2">
                    <button onClick={() => editarSite(site)} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded">Editar</button>
                    <button onClick={() => deletarSite(site.id, site.slug)} className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t">
            <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1} className="px-3 py-1 bg-white border text-xs rounded">Anterior</button>
            <span className="text-[11px] font-bold">Página {paginaAtual} de {totalPaginas}</span>
            <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className="px-3 py-1 bg-white border text-xs rounded">Próxima</button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="h-screen overflow-hidden flex relative bg-slate-100 text-slate-800 font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style dangerouslySetInnerHTML={{__html: `
        .input-style { width: 100%; padding: .45rem .6rem; border-radius: .5rem; border: 1px solid #cbd5e1; font-size: .75rem; outline: none; font-weight: 500; color: #334155; }
        .input-style:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
        .drop-zone { border: 2px dashed #cbd5e1; border-radius: .75rem; background: #f8fafc; cursor: pointer; text-align: center; }
        #previewFrame, #codigoContainer { display: none; }
        #previewFrame.active, #codigoContainer.active { display: block; }
        #loadingOverlay { position: fixed; inset:0; background: rgba(15,23,42,0.95); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        #loadingSpinner { border: 4px solid rgba(79,70,229,0.2); border-top: 4px solid #4f46e5; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin-bottom: 2rem; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />

      <div id="loadingOverlay" style={{ display: 'none' }}><div id="loadingSpinner"></div><p id="loadingText" className="text-white font-bold text-lg mt-4">Processando no Google Gemini...</p></div>

      <div className="w-full md:w-[420px] bg-white shadow-xl flex flex-col h-full border-r border-slate-200 z-10">
          <div className="p-5 border-b border-slate-100 bg-white">
              <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3 shadow-md"><i className="fas fa-layer-group text-white text-sm"></i></div>
                  Builder<span className="text-indigo-600">Pro</span>
              </h1>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button id="btnTabVisual" onClick={() => (window as any).mudarModoApp('visual')} className="flex-1 py-1.5 text-xs font-bold rounded bg-white shadow-sm text-indigo-700">Visão & Clonagem</button>
                  <button id="btnTabCopy" onClick={() => (window as any).mudarModoApp('copy')} className="flex-1 py-1.5 text-xs font-bold rounded text-slate-500">Gerar via Texto</button>
              </div>
          </div>

          <div className="overflow-y-auto p-5 flex-grow custom-scrollbar flex flex-col bg-slate-50/50">
              <button onClick={toggleModoEdicao} className={`w-full py-3.5 px-4 rounded-xl text-sm font-black shadow-sm flex items-center justify-center mb-5 transition-all ${modoEdicaoVisual ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50'}`}>
                  <i className={`fas ${modoEdicaoVisual ? 'fa-check-circle text-green-400' : 'fa-mouse-pointer'} mr-2 text-lg`}></i> 
                  {modoEdicaoVisual ? 'Edição Mágica Ativada!' : 'Ativar Edição Visual por Clique'}
              </button>

              <div id="containerModoVisual" className="flex-1 flex flex-col">
                  {modoEdicaoVisual ? (
                      <div className="bg-white border-2 border-indigo-500 rounded-xl p-5 shadow-lg relative">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Painel do Elemento</div>
                          
                          {!elementoSelecionado ? (
                              <div className="text-center py-10 text-slate-400">
                                  <i className="fas fa-crosshairs text-3xl mb-3 text-indigo-400"></i>
                                  <p className="text-[11px] font-bold uppercase text-slate-500">Selecione um elemento<br/>no site ao lado</p>
                              </div>
                          ) : (
                              <div className="space-y-4 pt-3">
                                  <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
                                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-mono font-black uppercase"><i className="fas fa-code mr-1"></i> {elementoSelecionado.tagName}</span>
                                  </div>
                                  
                                  {elementoSelecionado.tagName === 'img' ? (
                                      <>
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center"><i className="fas fa-link text-indigo-400 mr-1.5"></i> Link da Imagem</label>
                                              <input type="text" value={elementoSelecionado.src} onChange={(e) => atualizarElementoManual('src', e.target.value)} className="w-full text-xs p-2.5 border rounded-lg bg-slate-50 outline-none font-mono mb-2" />
                                              <div className="flex gap-2">
                                                  <button onClick={gerarNovaImagemIAAutomatica} className="flex-1 bg-white text-indigo-600 text-[10px] font-bold py-2 rounded-lg border border-indigo-200 shadow-sm"><i className="fas fa-wand-magic-sparkles mr-1"></i> Buscar IA</button>
                                                  <label className="flex-1 bg-white text-indigo-600 text-[10px] font-bold py-2 rounded-lg border border-indigo-200 text-center cursor-pointer shadow-sm"><i className="fas fa-upload mr-1"></i> Upload PC<input type="file" accept="image/*" className="hidden" onChange={handleUploadImgElem} /></label>
                                              </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-3 pt-2">
                                              <div>
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-2">Formato</label>
                                                  <select onChange={(e) => atualizarElementoManual('imgFormat', e.target.value)} className="input-style bg-slate-50 p-2 text-[10px]">
                                                      <option value="">Livre (Original)</option>
                                                      <option value="aspect-video">Horizontal (16:9)</option>
                                                      <option value="aspect-[3/4]">Vertical (Retrato)</option>
                                                      <option value="aspect-square">Quadrado (1:1)</option>
                                                  </select>
                                              </div>
                                              <div>
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-2">Cantos</label>
                                                  <select onChange={(e) => atualizarElementoManual('imgRounded', e.target.value)} className="input-style bg-slate-50 p-2 text-[10px]">
                                                      <option value="rounded-none">Retos</option>
                                                      <option value="rounded-md">Suaves</option>
                                                      <option value="rounded-xl">Arredondados</option>
                                                      <option value="rounded-full">Círculo</option>
                                                  </select>
                                              </div>
                                          </div>
                                          <div className="pt-2 bg-slate-50 p-2.5 rounded-lg border">
                                              <label className="flex items-center gap-2 cursor-pointer mb-2">
                                                  <input type="checkbox" onChange={(e) => atualizarElementoManual('imgBorder', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                                  <span className="text-[10px] font-bold text-slate-700 uppercase">Ativar Borda Espessa</span>
                                              </label>
                                              <div className="flex items-center justify-between">
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase">Cor da Borda</label>
                                                  <input type="color" value={elementoSelecionado.borderColor || '#ffffff'} onChange={(e) => atualizarElementoManual('borderColor', e.target.value)} className="w-7 h-7 rounded cursor-pointer border p-0" />
                                              </div>
                                          </div>
                                      </>
                                  ) : (
                                      <>
                                          {(elementoSelecionado.tagName === 'a' || elementoSelecionado.tagName === 'button') && (
                                              <div className="mb-4 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                                  <label className="text-[10px] font-black text-emerald-700 uppercase mb-1.5 flex items-center"><i className="fas fa-link mr-1"></i> Link do Botão</label>
                                                  <input type="text" placeholder="https://... ou #secao" value={elementoSelecionado.href} onChange={(e) => atualizarElementoManual('href', e.target.value)} className="w-full text-[10px] p-2 border rounded bg-white font-mono" />
                                              </div>
                                          )}

                                          <div>
                                              <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase">Texto</label>
                                                <div className="flex bg-slate-100 rounded border">
                                                    <button onClick={() => atualizarElementoManual('textAlign', 'text-left')} className="p-1 px-2 hover:bg-slate-200 text-slate-600"><i className="fas fa-align-left text-[10px]"></i></button>
                                                    <button onClick={() => atualizarElementoManual('textAlign', 'text-center')} className="p-1 px-2 hover:bg-slate-200 text-slate-600 border-x"><i className="fas fa-align-center text-[10px]"></i></button>
                                                    <button onClick={() => atualizarElementoManual('textAlign', 'text-right')} className="p-1 px-2 hover:bg-slate-200 text-slate-600 border-r"><i className="fas fa-align-right text-[10px]"></i></button>
                                                    <button onClick={() => atualizarElementoManual('textAlign', 'text-justify')} className="p-1 px-2 hover:bg-slate-200 text-slate-600"><i className="fas fa-align-justify text-[10px]"></i></button>
                                                </div>
                                              </div>
                                              <textarea rows={3} value={elementoSelecionado.text} onChange={(e) => atualizarElementoManual('text', e.target.value)} className="w-full text-xs p-2.5 border rounded-lg bg-slate-50 resize-none shadow-inner"></textarea>
                                          </div>
                                          
                                          <div className="grid grid-cols-2 gap-3">
                                              <div className="bg-slate-50 p-2.5 rounded-lg border">
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 flex justify-between"><span>Tamanho</span><span className="text-indigo-600 font-bold">{elementoSelecionado.fontSize}px</span></label>
                                                  <input type="range" min="10" max="100" value={elementoSelecionado.fontSize || 16} onChange={(e) => atualizarElementoManual('fontSize', parseInt(e.target.value))} className="w-full h-1.5 accent-indigo-600" />
                                              </div>
                                              <div className="bg-slate-50 p-2.5 rounded-lg border flex flex-col justify-between">
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase flex justify-between items-center"><span>Fundo</span><input type="color" value={elementoSelecionado.bgColor} onChange={(e) => atualizarElementoManual('bgColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer" /></label>
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase flex justify-between items-center pt-1 border-t"><span>Letra</span><input type="color" value={elementoSelecionado.textColor} onChange={(e) => atualizarElementoManual('textColor', e.target.value)} className="w-5 h-5 rounded cursor-pointer" /></label>
                                              </div>
                                          </div>

                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Efeito Animado</label>
                                              <select onChange={(e) => atualizarElementoManual('animationClass', e.target.value)} className="w-full text-[10px] p-2 border rounded-lg bg-slate-50 font-bold">
                                                  <option value="">Nenhum</option>
                                                  <option value="animate-pulse">Pulsar Suavemente</option>
                                                  <option value="animate-bounce">Pular Continuamente</option>
                                                  <option value="hover:scale-110 transition-transform duration-300">Zoom ao Passar o Mouse</option>
                                              </select>
                                          </div>

                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tailwind Custom (Degradê)</label>
                                              <input type="text" placeholder="Ex: bg-gradient-to-r from-blue-500 to-purple-500" value={elementoSelecionado.customClasses} onChange={(e) => atualizarElementoManual('customClasses', e.target.value)} className="w-full text-[10px] p-2 border rounded-lg bg-slate-800 text-emerald-400 font-mono" />
                                          </div>
                                      </>
                                  )}

                                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mt-4">
                                      <label className="text-[10px] font-black text-indigo-800 uppercase mb-2 flex items-center gap-1"><i className="fas fa-robot text-indigo-600"></i> Groq Copywriter IA</label>
                                      {elementoSelecionado.tagName !== 'img' && (
                                          <div className="grid grid-cols-2 gap-2 mb-2">
                                              <button onClick={() => refinarElementoComIA("Reescreva com copy persuasiva de conversão")} className="bg-white border text-indigo-700 text-[9px] font-bold py-1.5 rounded"><i className="fas fa-sync-alt mr-1"></i> Melhorar</button>
                                              <button onClick={() => refinarElementoComIA("Reescreva com forte urgência e escassez")} className="bg-white border text-indigo-700 text-[9px] font-bold py-1.5 rounded"><i className="fas fa-fire mr-1 text-orange-500"></i> Urgência</button>
                                          </div>
                                      )}
                                      <div className="flex gap-2">
                                          <input type="text" id="ai_prompt_element" placeholder="Comando livre para o Groq..." className="input-style flex-1 bg-white text-[10px]" />
                                          <button onClick={() => refinarElementoComIA()} className="bg-indigo-600 text-white w-9 rounded-lg flex items-center justify-center"><i className="fas fa-paper-plane"></i></button>
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <details className="group bg-white border rounded-xl shadow-sm overflow-hidden" open>
                              <summary className="font-black text-xs text-slate-700 uppercase cursor-pointer px-4 py-3 flex justify-between bg-slate-50">
                                  <span><i className="fas fa-paint-roller text-blue-500 mr-2"></i> 1. Estilo & Cores</span>
                                  <i className="fas fa-chevron-down text-slate-400"></i>
                              </summary>
                              <div className="p-4 space-y-3">
                                  <div>
                                      <label htmlFor="nichoEstilo" className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Estilo Visual:</label>
                                      <select id="nichoEstilo" className="input-style bg-slate-50">
                                          <option value="nenhum">Padrão Limpo</option>
                                          <option value="minimalista">Minimalista (Apple)</option>
                                          <option value="premium">Infoproduto Premium</option>
                                          <option value="agressivo">Lançamento / Dark Mode</option>
                                          <option value="feminino">Nicho Feminino / Luxo</option>
                                          <option value="consultor">Mentor / Consultor</option>
                                          <option value="terapia">Saúde / Terapia</option>
                                          <option value="corporativo">Corporativo B2B</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label htmlFor="paletaCores" className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Paleta de Cores:</label>
                                      <select id="paletaCores" value={corSelecionada} onChange={(e) => setCorSelecionada(e.target.value)} className="input-style bg-slate-50">
                                          <option value="auto">Extrair Cores da Imagem (Clone)</option>
                                          <option value="dark">Dark Mode Total</option>
                                          <option value="azul">Azul Profundo</option>
                                          <option value="verde">Verde Esmeralda</option>
                                          <option value="terracota">Terracota & Nude</option>
                                          <option value="roxo">Roxo Real</option>
                                          <option value="vermelho">Vermelho Rubi</option>
                                          <option value="personalizada">Personalizada Manual...</option>
                                      </select>
                                      {corSelecionada === 'personalizada' && (
                                          <div className="flex gap-3 mt-2 p-3 bg-indigo-50 rounded-lg border">
                                              <div className="flex-1"><label className="text-[9px] block font-bold">Fundo</label><input type="color" id="corFundo" className="w-full h-7 rounded border p-0 cursor-pointer" defaultValue="#ffffff" /></div>
                                              <div className="flex-1"><label className="text-[9px] block font-bold">Destaque</label><input type="color" id="corPrimaria" className="w-full h-7 rounded border p-0 cursor-pointer" defaultValue="#2563eb" /></div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </details>

                          <details className="group bg-white border rounded-xl shadow-sm overflow-hidden">
                              <summary className="font-black text-xs text-slate-700 uppercase cursor-pointer px-4 py-3 flex justify-between bg-slate-50">
                                  <span><i className="fas fa-cubes text-emerald-500 mr-2"></i> 2. Estrutura & Efeitos</span>
                                  <i className="fas fa-chevron-down text-slate-400"></i>
                              </summary>
                              <div className="p-4 space-y-3">
                                  <div>
                                      <label htmlFor="heroLayout" className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Formato do Topo (Hero):</label>
                                      <select id="heroLayout" className="input-style bg-slate-50">
                                          <option value="auto">Automático / Seguir Imagem</option>
                                          <option value="center">Centralizado</option>
                                          <option value="split">Dividido (Texto e Imagem)</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label htmlFor="dinamicaSite" className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Animação:</label>
                                      <select id="dinamicaSite" className="input-style bg-slate-50">
                                          <option value="estatico">Estático (Rápido)</option>
                                          <option value="suave">Suave (Scroll)</option>
                                          <option value="impacto">Máximo Impacto (3D)</option>
                                      </select>
                                  </div>
                                  <div className="flex items-center gap-3 pt-2">
                                      <input type="checkbox" id="checkComMenu" className="w-4 h-4 text-emerald-600 rounded cursor-pointer" />
                                      <label htmlFor="checkComMenu" className="text-xs font-bold text-slate-700 cursor-pointer">Criar Menu Superior Fixo</label>
                                  </div>
                              </div>
                          </details>

                          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm mt-4">
                              <h3 className="font-black text-xs text-blue-800 uppercase mb-3 flex items-center"><i className="fas fa-crop-alt mr-2"></i>Clonar Site por Imagem (Gemini)</h3>
                              <div className="drop-zone py-6 border-dashed border-2 border-blue-200 bg-blue-50/30 rounded-xl flex flex-col items-center justify-center gap-2" onClick={() => document.getElementById('imageUploadInput')?.click()}>
                                  <i className="fas fa-cloud-upload-alt text-2xl text-blue-400"></i>
                                  <p className="text-xs font-bold text-slate-600 uppercase">Cole a Foto Aqui <span className="text-[9px] block text-slate-400">(Ctrl+V ou Clique)</span></p>
                              </div>
                              <input type="file" id="imageUploadInput" multiple accept="image/*" className="hidden" onChange={handleImageUploadInput} />
                              {uploadedImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-3">
                                  {uploadedImages.map((imgObj, idx) => (
                                    <div key={idx} className="relative h-14 rounded-lg overflow-hidden border">
                                      <img src={`data:${imgObj.mimeType};base64,${imgObj.data}`} className="w-full h-full object-cover" />
                                      <button className="absolute top-1 right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[8px]" onClick={() => removerImagem(idx)}><i className="fas fa-times"></i></button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <button onClick={() => (window as any).executarGeracaoSite(uploadedImages)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl shadow-md mt-4 text-xs uppercase tracking-wide">
                                  <i className="fas fa-bolt text-yellow-300 mr-1.5"></i> Construir Site (Gemini)
                              </button>
                          </div>
                      </div>
                  )}
              </div>

              <div id="containerModoCopy" style={{ display: 'none' }} className="flex-1 flex flex-col">
                  <div className="bg-white border rounded-xl p-4 flex-1 flex flex-col shadow-sm">
                      <label className="text-xs font-black text-slate-700 uppercase mb-2 flex items-center"><i className="fas fa-keyboard text-indigo-500 mr-2"></i>Gerar Site via Texto (Gemini)</label>
                      <textarea id="productContent" className="w-full border rounded-xl resize-none flex-1 mb-3 bg-slate-50 text-xs p-3 outline-none" placeholder="Descreva o site que você quer criar..."></textarea>
                      <button onClick={() => (window as any).gerarSiteComCopy()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase py-3 rounded-xl text-xs">
                          <i className="fas fa-pen-nib mr-1.5"></i> Criar Site Completo (Gemini)
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div className="flex-grow flex flex-col bg-slate-200 relative">
          <div className="bg-white border-b flex justify-between items-center px-6 h-16 shadow-sm z-10">
              <div className="flex h-full items-center gap-5">
                  <div className="flex bg-slate-100 rounded-lg p-1 border h-10">
                      <button id="tabPreview" onClick={() => (window as any).mudarSeparador('preview')} className="px-5 rounded font-black text-xs bg-white text-blue-600 shadow-sm border flex items-center">Visualização</button>
                      <button id="tabCode" onClick={() => (window as any).mudarSeparador('code')} className="px-5 rounded font-bold text-xs text-slate-500 flex items-center">Código Fonte</button>
                  </div>
                  <button onClick={desfazerCodigo} className="bg-white text-slate-600 text-xs font-bold py-2 px-3 rounded-lg border shadow-sm"><i className="fas fa-undo mr-1"></i> Desfazer</button>
                  <div className="flex items-center border border-indigo-200 bg-indigo-50 rounded-lg px-3 py-1.5 shadow-sm">
                      <i className="fas fa-brain text-indigo-600 mr-2"></i>
                      <span className="text-[10px] font-black text-indigo-900 uppercase">Motor Principal: Google Gemini</span>
                  </div>
              </div>

              <div className="flex items-center gap-3">
                  <button onClick={carregarMeusSites} className="bg-slate-800 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg"><i className="fas fa-th-large mr-1.5"></i> Meus Projetos</button>
                  {siteEditando ? (
                      <>
                          <button onClick={() => setSiteEditando(null)} className="bg-slate-200 text-slate-700 text-[11px] font-bold py-2.5 px-3 rounded-lg">Cancelar</button>
                          <button onClick={() => (window as any).handlePublicarSite()} className="bg-blue-600 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg"><i className="fas fa-save mr-1"></i> Salvar</button>
                      </>
                  ) : (
                      <button onClick={() => (window as any).handlePublicarSite()} className="bg-emerald-600 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-sm uppercase"><i className="fas fa-globe mr-1.5"></i> Publicar</button>
                  )}
                  <button onClick={() => (window as any).baixarHtmlGerado()} className="bg-white text-blue-600 border border-blue-200 text-[11px] font-bold py-2.5 px-3 rounded-lg shadow-sm"><i className="fas fa-download mr-1"></i> Baixar</button>
              </div>
          </div>
          
          <div className="flex-grow relative bg-slate-800">
              {modoEdicaoVisual && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-8 py-3 rounded-full shadow-2xl font-black text-xs uppercase tracking-widest animate-bounce flex items-center gap-3 border-[3px] border-indigo-400">
                      <i className="fas fa-magic text-yellow-300"></i> Clique num elemento do site para editá-lo com o Groq!
                  </div>
              )}
              <iframe id="previewFrame" className="w-full h-full active border-none bg-white shadow-inner" sandbox="allow-scripts allow-same-origin" title="Preview"></iframe>
              <div id="codigoContainer" className="w-full h-full bg-[#0d1117] p-6">
                  <textarea id="codigoGerado" className="w-full h-full font-mono text-sm bg-[#0d1117] text-[#56d364] border-none outline-none resize-none custom-scrollbar rounded-xl p-4"></textarea>
              </div>
          </div>
      </div>
      
      {modalMeusSitesAberto && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-800"><i className="fas fa-server text-blue-500 mr-2"></i>Meus Projetos</h2>
              <button onClick={() => setModalMeusSitesAberto(false)} className="w-8 h-8 rounded-full bg-slate-200 font-bold">✕</button>
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