'use client';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

// SCRIPT DO IFRAME: BLINDAGEM, OPACIDADE INTELIGENTE E LIBERAÇÃO DE SANFONAS + DELETAR ELEMENTO
const SCRIPT_PREVIEW = `<script id="editor-magic-script">
    let modoEdicao = false;
    let elSelecionado = null;

    if (!document.getElementById('builder-core-styles')) {
        const style = document.createElement('style');
        style.id = 'builder-core-styles';
        style.innerHTML = \`body.builder-editing * { cursor: crosshair !important; }\`;
        document.head.appendChild(style);
    }

    // Leitura perfeita de RGB para Hexadecimal
    function rgbToHex(rgb) {
        if(!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return '';
        let res = rgb.match(/\\d+/g);
        if(!res || res.length < 3) return '';
        return "#" + res.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }

    function sendCleanHtml() {
        let outlineAntigo = '';
        if(elSelecionado) { outlineAntigo = elSelecionado.style.outline; elSelecionado.style.outline = ''; }
        let htmlStr = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
        if(elSelecionado) { elSelecionado.style.outline = outlineAntigo; }
        window.parent.postMessage({ type: 'HTML_SYNC', html: htmlStr }, '*');
    }

    function selectElement(targetEl) {
        if (targetEl.tagName === 'BODY' || targetEl.tagName === 'HTML') return;

        if(elSelecionado) { elSelecionado.style.outline = ''; elSelecionado.style.outlineOffset = ''; }
        elSelecionado = targetEl;
        elSelecionado.style.outline = '3px solid #4f46e5';
        elSelecionado.style.outlineOffset = '-3px';

        if(!elSelecionado.id) elSelecionado.id = 'node_' + Math.random().toString(36).substr(2,9);

        let isContainer = Array.from(elSelecionado.children).some(child => child.tagName !== 'BR');
        let isNavOrSection = ['SECTION', 'NAV', 'HEADER', 'FOOTER', 'UL', 'DIV', 'ARTICLE'].includes(elSelecionado.tagName);
        let bloqueiaTexto = isContainer && isNavOrSection;

        let compStyle = window.getComputedStyle(elSelecionado);
        let isImg = elSelecionado.tagName === 'IMG';
        
        let cColor = elSelecionado.dataset.rawBgColor || rgbToHex(compStyle.backgroundColor);
        let bgImg = elSelecionado.dataset.rawBgImage;
        
        if (bgImg === undefined) {
            let rawBg = elSelecionado.style.backgroundImage || '';
            let match = rawBg.match(/url\\(['"]?([^'"]+)['"]?\\)/);
            bgImg = match ? match[1] : '';
        }

        let aspect = elSelecionado.style.aspectRatio || '';
        let objOpacity = 1;
        
        if (isImg) { 
            objOpacity = parseFloat(compStyle.opacity); 
        } else { 
            objOpacity = parseFloat(elSelecionado.dataset.bgOpacity); 
        }
        if (isNaN(objOpacity)) objOpacity = 1;

        window.parent.postMessage({
            type: 'ELEMENT_SELECTED',
            id: elSelecionado.id,
            tagName: elSelecionado.tagName.toLowerCase(),
            text: elSelecionado.innerText || '',
            src: elSelecionado.src || '',
            href: elSelecionado.getAttribute('href') || '',
            className: elSelecionado.className,
            bgColor: cColor,
            textColor: rgbToHex(compStyle.color),
            borderColor: rgbToHex(compStyle.borderColor),
            fontSize: parseInt(compStyle.fontSize) || 16,
            opacity: objOpacity,
            bgImage: bgImg,
            imgFormat: aspect,
            bloqueiaTexto: bloqueiaTexto,
            outerHTML: elSelecionado.outerHTML
        }, '*');
    }

    window.addEventListener('message', (event) => {
        if(event.data.type === 'TOGGLE_EDIT_MODE') {
            modoEdicao = event.data.value;
            if(modoEdicao) {
                document.body.classList.add('builder-editing');
            } else {
                document.body.classList.remove('builder-editing');
                if(elSelecionado) { elSelecionado.style.outline = ''; elSelecionado.style.outlineOffset = ''; elSelecionado = null; }
                document.querySelectorAll('[data-old-outline]').forEach(el => {
                    el.style.outline = el.dataset.oldOutline || '';
                    el.style.outlineOffset = '';
                    delete el.dataset.oldOutline;
                });
                document.querySelectorAll('*').forEach(el => {
                    if (el.style.cursor === 'crosshair') el.style.cursor = '';
                });
            }
        }
        
        if (event.data.type === 'SELECT_PARENT') {
            let el = document.getElementById(event.data.id);
            if (el && el.parentElement && el.parentElement.tagName !== 'BODY') {
                selectElement(el.parentElement);
            }
        }

        if (event.data.type === 'DELETE_ELEMENT') {
            let el = document.getElementById(event.data.id);
            if(el) {
                el.remove();
                elSelecionado = null;
                sendCleanHtml();
            }
        }

        if(event.data.type === 'UPDATE_ELEMENT') {
            let el = document.getElementById(event.data.id);
            if(el) {
                let isImg = el.tagName === 'IMG';

                if(event.data.text !== undefined && event.data.forceTextUpdate) el.innerText = event.data.text;
                if(event.data.src !== undefined) el.src = event.data.src;
                if(event.data.href !== undefined) el.setAttribute('href', event.data.href);
                if(event.data.textColor !== undefined) el.style.color = event.data.textColor;
                if(event.data.fontSize !== undefined) el.style.fontSize = event.data.fontSize + 'px';
                
                if (event.data.bgColor !== undefined) el.dataset.rawBgColor = event.data.bgColor;
                if (event.data.bgImage !== undefined) el.dataset.rawBgImage = event.data.bgImage;
                
                if (event.data.opacity !== undefined) {
                    if (isImg) {
                        el.style.opacity = event.data.opacity;
                    } else {
                        el.dataset.bgOpacity = event.data.opacity;
                        el.style.opacity = ''; 
                    }
                }

                // MOTOR DE SOBREPOSIÇÃO DE FUNDO E OPACIDADE
                if (!isImg) {
                    let cBgColor = el.dataset.rawBgColor || rgbToHex(window.getComputedStyle(el).backgroundColor);
                    if (!cBgColor || cBgColor === '') cBgColor = '#ffffff'; 

                    let cBgImage = el.dataset.rawBgImage;
                    if (cBgImage === undefined) {
                        let rawBg = el.style.backgroundImage || '';
                        let match = rawBg.match(/url\\(['"]?([^'"]+)['"]?\\)/);
                        cBgImage = match ? match[1] : '';
                    }
                    
                    let cOpacity = parseFloat(el.dataset.bgOpacity);
                    if (isNaN(cOpacity)) cOpacity = 1;

                    let r = 255, g = 255, b = 255;
                    if (cBgColor.startsWith('#')) {
                        let hex = cBgColor.replace('#', '');
                        if (hex.length === 3) hex = hex.split('').map(x => x+x).join('');
                        if (hex.length === 6) {
                            r = parseInt(hex.substring(0,2), 16);
                            g = parseInt(hex.substring(2,4), 16);
                            b = parseInt(hex.substring(4,6), 16);
                        }
                    }

                    let rgbaStr = \`rgba(\${r}, \${g}, \${b}, \${cOpacity})\`;

                    // Remove bloqueios do Tailwind
                    el.style.setProperty('--tw-bg-opacity', '1');

                    if (cBgImage && cBgImage !== 'none') {
                        el.style.backgroundColor = 'transparent'; // A cor será aplicada pelo gradiente overlay
                        el.style.backgroundImage = \`linear-gradient(\${rgbaStr}, \${rgbaStr}), url('\${cBgImage}')\`;
                        el.style.backgroundSize = "cover"; 
                        el.style.backgroundPosition = "center";
                        el.style.backgroundRepeat = "no-repeat";
                    } else {
                        el.style.backgroundImage = "none";
                        el.style.backgroundColor = rgbaStr;
                    }

                    // Aplica Glassmorphism Automático se a cor estiver transparente
                    if (cOpacity < 1 && cOpacity > 0) el.classList.add('backdrop-blur-md');
                    else el.classList.remove('backdrop-blur-md');
                    
                } else {
                    if(event.data.bgColor !== undefined) el.style.backgroundColor = event.data.bgColor;
                }

                if(event.data.textAlign !== undefined) {
                    el.classList.remove('text-left', 'text-center', 'text-right', 'text-justify');
                    if(event.data.textAlign) el.classList.add(event.data.textAlign);
                }

                if(event.data.animationClass !== undefined) {
                    el.classList.remove('animate-pulse', 'animate-bounce', 'hover:scale-105', 'hover:scale-110', 'transition-transform', 'transition-all', 'duration-300', 'hover:-translate-y-2');
                    if(event.data.animationClass) event.data.animationClass.split(' ').forEach(cls => el.classList.add(cls));
                }

                if(event.data.imgFormat !== undefined) {
                    if (event.data.imgFormat === '') {
                        el.style.aspectRatio = '';
                        el.style.height = '';
                        el.classList.remove('object-cover', 'w-full', 'h-auto');
                    } else {
                        el.className = el.className.replace(/\\bh-(full|screen|auto|min|max|fit|px|\\d+|\\[.*?\\])\\b/g, '').trim();
                        el.style.aspectRatio = event.data.imgFormat;
                        el.style.height = 'auto'; 
                        el.classList.add('object-cover', 'w-full');
                    }
                }
                
                if(event.data.imgRounded !== undefined) {
                    const allClassesToRemove = [
                        'rounded-none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full',
                        'shadow-none', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
                        'border-2', 'border-4', 'border-8', 'border-white', 'border-indigo-500', 'border-emerald-500',
                        'shadow-indigo-500/50', 'shadow-emerald-500/50', 'shadow-rose-500/50'
                    ];
                    el.classList.remove(...allClassesToRemove);
                    if (event.data.imgRounded) { event.data.imgRounded.split(' ').forEach(cls => { if (cls) el.classList.add(cls); }); }
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
        e.target.style.outline = '2px solid #0ea5e9'; 
        e.target.style.outlineOffset = '-2px';
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
        let form = e.target.closest('form');
        let summary = e.target.closest('summary');

        if (form && !summary && !btn) { e.preventDefault(); }
        
        if (modoEdicao) {
            if (!summary) e.preventDefault(); 
            e.stopPropagation();

            selectElement(e.target);
            return;
        }

        if (link) {
            let href = link.getAttribute('href') || '';
            if (link.hasAttribute('onclick')) { 
                if (href === '/' || href === '' || href === '#') e.preventDefault(); 
                return; 
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            if(href.startsWith('#') && href.length > 1) {
                try { 
                    var tEl = document.querySelector(href); 
                    if (tEl) tEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
                } catch(err) {}
            } else if (href && !href.startsWith('javascript:') && href !== '/' && href !== '#') {
                window.open(href, '_blank'); 
            }
            return;
        }
        
        if (btn && btn.type === 'submit') { e.preventDefault(); e.stopPropagation(); return; }
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
  
  // ABAS SIMPLIFICADAS
  const [abaAtiva, setAbaAtiva] = useState<'gerar' | 'refinar'>('gerar');
  
  const [modoInspetor, setModoInspetor] = useState(false);
  const [elementoSelecionado, setElementoSelecionado] = useState<any>(null);
  const [statusApis, setStatusApis] = useState<{ texto: string; processing: boolean }>({ texto: 'Aguardando Operação', processing: false });

  const [nichoEstilo, setNichoEstilo] = useState('minimalista');
  const [heroLayout, setHeroLayout] = useState('auto');
  const [productContent, setProductContent] = useState('');
  const [terMenuTexto, setTerMenuTexto] = useState(true);

  // FAXINA FINAL DO HTML
  const purificarHTML = (rawHtml: string) => {
      let clean = rawHtml.replace(/<script id="editor-magic-script">[\s\S]*?<\/script>/gi, '');
      clean = clean.replace(/<style id="builder-core-styles">[\s\S]*?<\/style>/gi, '');
      clean = clean.replace(/\bbuilder-editing\b/gi, '');
      clean = clean.replace(/cursor:\s*crosshair;?/gi, '')
                   .replace(/outline:\s*2px solid rgb\(14, 165, 233\);?/gi, '')
                   .replace(/outline:\s*3px solid rgb\(79, 70, 229\);?/gi, '')
                   .replace(/outline-offset:\s*-[234]px;?/gi, '')
                   .replace(/data-old-outline="[^"]*"/gi, '')
                   .replace(/\s*style="\s*"/gi, ''); 
      clean = clean.replace(/ class="\s*"/gi, ''); 
      return clean;
  };

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
                const htmlLimpo = purificarHTML(e.data.html);
                setHistoricoCodigo(prev => {
                    if (prev.length > 0 && prev[prev.length - 1] === htmlLimpo) return prev;
                    return [...prev, codEl.value]; 
                });
                codEl.value = htmlLimpo; 
            }
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const toggleInspetor = () => {
      const newMode = !modoInspetor;
      setModoInspetor(newMode);
      setElementoSelecionado(null);
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      if(iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'TOGGLE_EDIT_MODE', value: newMode }, '*');
  };

  const atualizarElemento = (field: string, value: string | number | boolean, forceTextUpdate = false) => {
      if(!elementoSelecionado) return;
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      iframe.contentWindow?.postMessage({ type: 'UPDATE_ELEMENT', id: elementoSelecionado.id, [field]: value, forceTextUpdate }, '*');
      setElementoSelecionado((prev: any) => ({...prev, [field]: value}));
  };

  const deletarElementoSelecionado = () => {
      if(!elementoSelecionado) return;
      if(!confirm('Tem certeza que deseja excluir este elemento do site?')) return;
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      iframe.contentWindow?.postMessage({ type: 'DELETE_ELEMENT', id: elementoSelecionado.id }, '*');
      setElementoSelecionado(null);
  };

  const desfazerCodigo = () => {
    if (historicoCodigo.length === 0) {
        (window as any).showNotification("Nenhuma alteração para desfazer.", "error");
        return;
    }
    
    const novoHistorico = [...historicoCodigo];
    const estadoAnterior = novoHistorico.pop();
    setHistoricoCodigo(novoHistorico);
    
    const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
    const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
    
    if (codEl) codEl.value = estadoAnterior || '';
    if (prevEl) prevEl.srcdoc = (estadoAnterior || '') + SCRIPT_PREVIEW; 
    
    setElementoSelecionado(null);
    (window as any).showNotification("Ação desfeita com sucesso.", "success");
  };

  const otimizarComIA = async (comandoOverride?: string) => {
      const promptInput = document.getElementById('ai_prompt_element') as HTMLInputElement;
      const comando = comandoOverride || promptInput?.value.trim();
      if(!comando || !elementoSelecionado) { (window as any).showNotification("Informe a instrução de otimização.", "error"); return; }

      const systemInstruction = `Atue como Especialista de Interface e Copywriter Sênior. Você receberá o HTML de UM elemento. Aplique a seguinte modificação: "${comando}". 
      REGRA MÁXIMA: DEVOLVA APENAS A TAG HTML FINAL E PRONTA PARA USO. Não explique nada. Preserve obrigatoriamente o ID original id="${elementoSelecionado.id}".`;
      
      const resData = await chamarMotorIA(systemInstruction, [{text: `CÓDIGO ORIGINAL:\n${elementoSelecionado.outerHTML}`}], true);
      
      if(resData && resData.html) {
          const cleanHtml = resData.html.replace(/```html/gi, '').replace(/```/g, '').trim();
          const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
          iframe.contentWindow?.postMessage({ type: 'REPLACE_ELEMENT_HTML', id: elementoSelecionado.id, newHtml: cleanHtml }, '*');
          if(promptInput) promptInput.value = '';
          (window as any).showNotification("Atualizado com sucesso pelo assistente IA.", "success");
      }
  };

  const executarRefinamentoGlobal = async () => {
    const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
    const currentHtml = codEl?.value || '';
    
    if (!currentHtml || currentHtml.length < 100) {
        (window as any).showNotification("Você precisa ter um site gerado para poder modificá-lo estruturalmente.", "error");
        return;
    }

    const promptInput = document.getElementById('refineGlobalContent') as HTMLTextAreaElement;
    const comando = promptInput?.value.trim();
    if (!comando) {
        (window as any).showNotification("Descreva o que deseja adicionar ou alterar no site.", "error");
        return;
    }

    setStatusApis({ texto: 'Modificando estrutura do Site...', processing: true });

    try {
        const response = await fetch('/api/gerar', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                systemInstruction: "Engenheiro Sênior de Software. Gere conteúdo completo para todas as seções solicitadas, cobrindo o fluxo de conversão detalhado.", 
                promptParts: [{ text: `COMANDO DO USUÁRIO:\n${comando}\n\n=== CÓDIGO HTML DO SITE ATUAL ===\n${currentHtml}` }], 
                isSiteRefinement: true, 
                isGeminiForced: true 
            })
        });
        
        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            if (response.status === 413 || response.status === 429 || responseText.includes('Too Large') || responseText.startsWith('Request')) {
                throw new Error("O site atual é muito extenso para esta modificação de uma só vez.");
            }
            throw new Error("Ocorreu um erro no servidor de IA. Tente reescrever a sua instrução.");
        }

        if (!data.success) throw new Error(data.error);
        
        if (data.html && data.html.length > 50) {
            processarRespostaDOM(data);
            promptInput.value = '';
            (window as any).showNotification("Alteração Global aplicada com sucesso!", "success");
        } else {
            throw new Error("A IA falhou ao processar a modificação global.");
        }

    } catch (err: any) {
        (window as any).showNotification(err.message || "Erro na modificação do site.", "error");
    } finally {
        setStatusApis({ texto: 'Aguardando Operação', processing: false });
    }
  };

  const chamarMotorIA = async (systemInstructionText: string, promptParts: any[], isElementRefinement = false) => {
    setStatusApis({ texto: isElementRefinement ? 'A IA está reescrevendo...' : 'A IA está estruturando o site...', processing: true });

    try {
      const dinamicaStyle = (document.getElementById('dinamicaSite') as HTMLSelectElement)?.value || 'estatico';

      const response = await fetch('/api/gerar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: systemInstructionText, promptParts, imageStyle: 'real', dinamica: dinamicaStyle, isElementRefinement, isGeminiForced: !isElementRefinement })
      });
      
      const responseText = await response.text();
      let data;
      try {
          data = JSON.parse(responseText);
      } catch (err) {
          if (response.status === 413 || responseText.includes('Too Large') || responseText.startsWith('Request')) {
              throw new Error("A sua imagem de referência é muito pesada para a IA ler.");
          }
          throw new Error("Houve um gargalo na comunicação com a Inteligência Artificial.");
      }

      if (!data.success) throw new Error(data.error === 'RATE_LIMIT_EXCEEDED' ? "Limite de acessos da Inteligência Artificial atingido. Aguarde 60 segundos." : data.error);
      return data;
    } catch (err: any) {
      let errorMsg = err.message;
      if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota') || errorMsg.includes('RATE_LIMIT')) {
          errorMsg = "Servidor da IA ocupado. Por favor, aguarde cerca de um minuto e tente novamente.";
      } else if (errorMsg.includes('fetch') || errorMsg.includes('network')) {
          errorMsg = "Verifique sua conexão de internet e tente novamente.";
      }
      (window as any).showNotification(errorMsg, 'error');
      return null;
    } finally {
      setStatusApis({ texto: 'Aguardando Ação', processing: false });
    }
  };

  const getMegaPromptEstilo = () => {
    const estilo = nichoEstilo;
    if (estilo === 'premium') return "DIRETRIZ DE DESIGN: Crie uma aparência sofisticada e de alto padrão (Premium). Use fontes serifadas elegantes e simetria perfeita.";
    if (estilo === 'terapia') return "DIRETRIZ DE DESIGN: Crie uma aparência calma, acolhedora e leve (Saúde mental). Use muito espaço em branco, bordas suaves e cores que transmitem paz.";
    if (estilo === 'agressivo') return "DIRETRIZ DE DESIGN: Foco total em Conversão e Vendas (Lançamento). Use alto contraste, cores fortes de CTA e layout muito direto ao ponto.";
    return "DIRETRIZ DE DESIGN: Interface limpa, moderna e altamente profissional.";
  };

  const getMegaPromptCores = () => {
    const cor = corSelecionada;
    if (cor === 'personalizada') return `CORES DO SITE: Use ${(document.getElementById('corFundo') as HTMLInputElement)?.value} como fundo principal e ${(document.getElementById('corPrimaria') as HTMLInputElement)?.value} para botões e destaques.`;
    if (cor === 'auto') return "CORES DO SITE: Copie fielmente as cores da imagem que o usuário anexou.";
    
    const mapaCores:any = {
        'dark': 'Modo Escuro Profundo (Fundos em tons de Chumbo/Preto com texto claro e alto contraste)',
        'azul': 'Tons de Azul (Transmite profissionalismo, segurança e tecnologia)',
        'verde': 'Tons de Verde (Transmite saúde, sucesso financeiro e natureza)',
        'roxo': 'Tons de Roxo (Transmite inovação, criatividade e luxo)',
        'terracota': 'Tons Terrosos e Terracota (Transmite elegância, conforto e sofisticação)',
        'rosa': 'Tons de Rosa e Suaves (Transmite delicadeza, cuidado e modernidade)',
        'vermelho': 'Vermelho Alerta (Tons de alto impacto, urgência e excitação)',
        'amarelo': 'Amarelo Otimista (Fundo escuro contrastando com amarelo energia/sol)',
        'laranja': 'Laranja Criativo (Tons quentes, amigáveis, com muita energia e estímulo)',
        'cinza': 'Cinza Monocromático (Estilo limpo, prata, ultra minimalista e focado na estrutura)'
    };
    return `CORES DO SITE: A paleta principal de cores deve ser baseada em: ${mapaCores[cor] || 'Cores neutras'}.`;
  };

  const getMegaPromptHero = () => {
    const hero = heroLayout;
    if (hero === 'center') return "A PRIMEIRA SEÇÃO DO SITE (TOPO): Deve ter o texto centralizado na tela para focar na leitura.";
    if (hero === 'split') return "A PRIMEIRA SEÇÃO DO SITE (TOPO): Deve ser dividida ao meio (Texto persuasivo de um lado e Imagem forte do outro).";
    return "";
  };

  const executarGeracaoSiteHibrida = async () => {
    const content = productContent.trim();
    if (uploadedImages.length === 0 && !content) {
        (window as any).showNotification('Por favor, anexe uma imagem OU digite um texto para a IA gerar o site.', 'error');
        return;
    }

    const isMenu = terMenuTexto ? "O site OBRIGATORIAMENTE deve conter um Menu Superior fixo no topo com a tag <nav>." : "NÃO crie menu no topo do site, vá direto ao conteúdo.";

    let promptParts: any[] = [];
    let commandText = "Gere a Landing Page completa cobrindo todo o fluxo de conversão detalhado. O espaçamento de linha entre os títulos e os parágrafos deve ser exato. Respeite as regras restritas do sistema.\n\n";

    if (content) {
        commandText += `INSTRUÇÕES DE CONTEÚDO / COPY:\n"""\n${content}\n"""\n\n`;
    }
    if (uploadedImages.length > 0) {
        commandText += `Use a IMAGEM ANEXADA como base rigorosa para extrair a estrutura de layout e a paleta de cores.`;
        uploadedImages.forEach(img => promptParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } }));
    }

    promptParts.unshift({ text: commandText });

    const basePrompt = `Como Engenheiro Sênior de Software e Especialista em Interface, você deve criar uma Landing Page espetacular, completa e de página inteira que cubra todo o fluxo de conversão. Não se limite a apenas um topo e um botão; crie seções para Hero, Recursos, Benefícios, Prova Social, Preços, FAQ, e uma Chamada para Ação clara. Use espaçamentos precisos, tipografia legível e cores consistentes.`;

    const instrucoesFinais = `${basePrompt} \n${isMenu} \n${getMegaPromptEstilo()} \n${getMegaPromptHero()} \n${getMegaPromptCores()}`;

    const data = await chamarMotorIA(instrucoesFinais, promptParts, false);
    if (data) processarRespostaDOM(data);
  };

  function processarRespostaDOM(data: any) {
      const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
      const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
      if (codEl) { 
          setHistoricoCodigo(prev => [...prev, codEl.value]);
          codEl.value = purificarHTML(data.html); 
      }
      if (prevEl) prevEl.srcdoc = purificarHTML(data.html) + SCRIPT_PREVIEW; 
      (window as any).showNotification(`Pronto! Operação concluída com sucesso.`, 'success');
      if (modoInspetor) toggleInspetor(); 
  }

  const handleUploadImgElem = (e: React.ChangeEvent<HTMLInputElement>, isBg = false) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev: any) => { atualizarElemento(isBg ? 'bgImage' : 'src', ev.target.result); };
      reader.readAsDataURL(file);
      e.target.value = ''; 
  };

  const gerarNovaImagemIAAutomatica = async (isBackground = false, overrideFormat?: string) => {
      if(!elementoSelecionado) return;
      (window as any).showNotification("A IA está analisando o contexto e buscando a foto ideal na Unsplash...", "success");
      
      let formatToUse = overrideFormat !== undefined ? overrideFormat : (elementoSelecionado.imgFormat || '');
      let orientation = 'landscape'; 
      let w = 1280, h = 720;
      
      if (formatToUse === '3/4' || formatToUse === 'aspect-[3/4]') { orientation = 'portrait'; w = 800; h = 1200; }
      else if (formatToUse === '1/1' || formatToUse === 'aspect-square') { orientation = 'squarish'; w = 800; h = 800; }

      let termoContexto = elementoSelecionado.text || productContent || "business";
      if (termoContexto.length > 200) termoContexto = termoContexto.substring(0, 200);

      try {
          const jsonPrompt = `Resuma o seguinte texto em apenas 2 palavras em INGLÊS que sirvam como termo de busca impecável para a API fotográfica do Unsplash. Texto: "${termoContexto}". Devolva APENAS o JSON EXATO: {"keyword": "palavra1,palavra2"}`;
          const iaRes = await fetch('/api/gerar', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ systemInstruction: "Especialista Unsplash.", promptParts: [{text: jsonPrompt}], isElementRefinement: true, isGeminiForced: false })
          });
          const iaData = await iaRes.json();
          let keywordFinal = "professional business";
          
          if(iaData && iaData.html) {
              try {
                  const kwJson = JSON.parse(iaData.html.replace(/```json/gi, '').replace(/```/g, '').trim());
                  if (kwJson.keyword) keywordFinal = kwJson.keyword;
              } catch(e) {}
          }

          const res = await fetch(`/api/unsplash?q=${encodeURIComponent(keywordFinal)}&orientation=${orientation}`);
          const data = await res.json();
          
          if(data && data.url) { 
              atualizarElemento(isBackground ? 'bgImage' : 'src', data.url);
              (window as any).showNotification("Foto aplicada perfeitamente!", "success"); 
          } else {
              throw new Error("API não retornou foto");
          }
      } catch(err) { 
          const fallback = `https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&q=80`;
          atualizarElemento(isBackground ? 'bgImage' : 'src', fallback);
          (window as any).showNotification("Usando imagem padrão por limite de cota.", "error"); 
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
    if (!confirm(`Deseja excluir este projeto para sempre?`)) return;
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
    if (!file.type.startsWith('image/')) {
        (window as any).showNotification('Por favor, envie apenas arquivos de imagem.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width;
            let h = img.height;
            const maxDim = 1400; 

            if (w > maxDim || h > maxDim) {
                if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; } 
                else { w = Math.round((w * maxDim) / h); h = maxDim; }
            }

            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                const base64Data = dataUrl.split(',')[1];
                setUploadedImages(prev => [...prev, { mimeType: 'image/jpeg', data: base64Data }]);
            }
        };
        img.src = e.target.result;
    };
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
      document.getElementById('tabPreview')!.className = aba === 'preview' ? "px-5 py-2 rounded-md font-bold text-[11px] bg-slate-800 text-white shadow-sm transition" : "px-5 py-2 rounded-md font-bold text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition";
      document.getElementById('tabCode')!.className = aba === 'code' ? "px-5 py-2 rounded-md font-bold text-[11px] bg-slate-800 text-white shadow-sm transition" : "px-5 py-2 rounded-md font-bold text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition";
    };

    (window as any).showNotification = (msg: string, type: string) => {
      const exist = document.getElementById('custom-toast'); if(exist) exist.remove();
      const div = document.createElement('div'); div.id = 'custom-toast';
      
      div.className = type === 'error' 
      ? `fixed top-6 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-xl z-[9999] flex items-start gap-3 text-sm font-semibold max-w-lg w-full break-words` 
      : `fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-xl z-[9999] flex items-center gap-3 text-sm font-semibold`;
      
      div.innerHTML = type === 'error' 
      ? `<i class="fas fa-exclamation-circle text-red-500 mt-0.5 text-lg shrink-0"></i> <span class="flex-1">${msg}</span>` 
      : `<i class="fas fa-check-circle text-emerald-400 text-lg shrink-0"></i> <span>${msg}</span>`;
      
      document.body.appendChild(div);
      setTimeout(() => { div.style.opacity = '0'; div.style.transition = 'opacity 0.4s'; setTimeout(() => div.remove(), 4000); }, 4000);
    };

    (window as any).copiarCodigo = () => {
      const txt = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!txt) return; navigator.clipboard.writeText(txt); (window as any).showNotification('O Código HTML foi copiado para sua área de transferência.', 'success');
    };

    (window as any).baixarHtmlGerado = () => {
      const txt = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!txt) return;
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/html' }));
      a.download = siteEditando ? `${siteEditando.slug}.html` : 'meu-site-profissional.html'; a.click();
    };

    (window as any).handlePublicarSite = async () => {
      const htmlContent = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!htmlContent) { (window as any).showNotification('Você precisa criar um site primeiro.', 'error'); return; }
      
      let cleanHtml = purificarHTML(htmlContent);

      if (siteEditando) { await supabase.from('sites_gerados').update({ html_content: cleanHtml }).eq('id', siteEditando.id); (window as any).showNotification('Seu site foi atualizado na internet!', 'success'); return; }
      const nome = prompt('Qual será o nome do seu site? (Vai aparecer no Link):'); if (!nome) return; 
      let slug = nome.trim().toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || nanoid(6); 
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { alert('Sua conta desconectou. Entre novamente.'); return; }
      await supabase.from('sites_gerados').insert([{ user_id: session?.user.id, slug, titulo: nome, html_content: cleanHtml }]);
      navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      alert(`Parabéns! Seu site já está no ar.\nO link foi copiado:\n${window.location.origin}/${slug}`);
    };
  }, [siteEditando]); 

  const indexOfLastSite = paginaAtual * SITES_POR_PAGINA;
  const indexOfFirstSite = indexOfLastSite - SITES_POR_PAGINA;
  const sitesAtuais = listaSites.slice(indexOfFirstSite, indexOfLastSite);
  const totalPaginas = Math.ceil(listaSites.length / SITES_POR_PAGINA);

  return (
    <div className="h-screen overflow-hidden flex relative bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style dangerouslySetInnerHTML={{__html: `
        .input-standard { width: 100%; padding: 0.6rem 0.8rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; background-color: #f8fafc; font-size: 0.75rem; outline: none; color: #334155; transition: all 0.2s; font-weight: 500;}
        .input-standard:focus { border-color: #6366f1; background-color: #ffffff; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .input-label { font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; display: block; }
        .panel-section { padding: 1.2rem; border-bottom: 1px solid #f1f5f9; }
        
        #previewFrame, #codigoContainer { display: none; }
        #previewFrame.active, #codigoContainer.active { display: block; }
        
        ::-webkit-scrollbar { width: 6px; height: 6px;}
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
      `}} />

      {/* OVERLAY DE CARREGAMENTO AMIGÁVEL */}
      {statusApis.processing && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
              <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-5"></div>
              <p className="text-slate-800 font-black text-xl tracking-tight mb-2">{statusApis.texto}</p>
              <p className="text-slate-500 font-medium text-sm">Isso pode levar alguns segundos. Estamos construindo...</p>
          </div>
      )}

      {/* PAINEL LATERAL ESQUERDO */}
      <div className="w-[360px] bg-white border-r border-slate-200 flex flex-col h-full z-10 flex-shrink-0 shadow-sm">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h1 className="text-xl font-black tracking-tight text-slate-800 flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center mr-2.5 text-white shadow-md shadow-indigo-200"><i className="fas fa-layer-group text-xs"></i></div>
                  Builder<span className="text-indigo-600">Pro</span>
              </h1>
              
              <button onClick={toggleInspetor} className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${modoInspetor ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                  <i className={`fas fa-crosshairs ${modoInspetor ? 'animate-pulse text-yellow-300' : ''}`}></i> {modoInspetor ? 'Editando...' : 'Editar Site'}
              </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
              
              {modoInspetor ? (
                  <div className="animate-[fadeIn_0.2s_ease]">
                      <div className="bg-indigo-600 text-white p-4 text-[11px] font-black tracking-widest uppercase flex justify-between items-center shadow-inner">
                          <span>Editor Visual</span>
                          <i className="fas fa-paint-brush text-indigo-300"></i>
                      </div>

                      {!elementoSelecionado ? (
                          <div className="flex flex-col items-center justify-center p-14 text-center text-slate-400">
                              <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                                  <i className="fas fa-mouse-pointer text-2xl text-indigo-300"></i>
                              </div>
                              <p className="text-sm font-bold text-slate-600 mb-1">Selecione para Editar</p>
                              <p className="text-xs font-medium text-slate-400">Clique em qualquer texto, botão, fundo ou imagem no site ao lado.</p>
                          </div>
                      ) : (
                          <div className="pb-10 bg-white">
                              <div className="panel-section bg-slate-50/50">
                                  <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md shadow-sm">{elementoSelecionado.tagName}</span>
                                          <button onClick={() => {
                                              const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
                                              iframe.contentWindow?.postMessage({ type: 'SELECT_PARENT', id: elementoSelecionado.id }, '*');
                                          }} className="text-[9px] font-bold text-slate-500 hover:text-indigo-600 transition flex items-center bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">
                                              <i className="fas fa-level-up-alt mr-1"></i> Pai
                                          </button>
                                          
                                          {/* BOTÃO DE DELETAR O ELEMENTO SELECIONADO */}
                                          <button onClick={deletarElementoSelecionado} className="text-[9px] font-bold text-red-500 hover:text-red-700 transition flex items-center bg-white border border-red-100 hover:border-red-300 px-2 py-1 rounded shadow-sm">
                                              <i className="fas fa-trash-alt mr-1"></i> Excluir
                                          </button>

                                      </div>
                                      <span className="text-[9px] font-bold text-slate-400">ID: {elementoSelecionado.id.substring(0,6)}</span>
                                  </div>
                              </div>

                              {elementoSelecionado.tagName === 'img' ? (
                                  <>
                                      <div className="panel-section">
                                          <label className="input-label">Mudar Imagem</label>
                                          <input type="text" value={elementoSelecionado.src} onChange={(e) => atualizarElemento('src', e.target.value)} className="input-standard font-mono mb-3 text-[10px]" />
                                          <div className="flex gap-2">
                                              <button onClick={() => gerarNovaImagemIAAutomatica(false)} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2 rounded-lg transition border border-indigo-100"><i className="fas fa-robot mr-1.5"></i> Usar Inteligência</button>
                                              <label className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2 rounded-lg text-center cursor-pointer transition"><i className="fas fa-upload mr-1.5"></i> Do Computador<input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImgElem(e, false)} /></label>
                                          </div>
                                      </div>
                                      <div className="panel-section grid grid-cols-2 gap-4">
                                          <div>
                                              <label className="input-label">Proporção (Formato)</label>
                                              <select value={elementoSelecionado.imgFormat || ''} onChange={(e) => {
                                                  const novoFormato = e.target.value;
                                                  atualizarElemento('imgFormat', novoFormato);
                                                  if(novoFormato !== '') {
                                                      gerarNovaImagemIAAutomatica(false, novoFormato);
                                                  }
                                              }} className="input-standard border-indigo-200 focus:border-indigo-500 bg-indigo-50">
                                                  <option value="">Tamanho Original</option>
                                                  <option value="aspect-video">Paisagem (Deitado)</option>
                                                  <option value="aspect-[3/4]">Retrato (Em pé)</option>
                                                  <option value="aspect-square">Quadrado</option>
                                              </select>
                                          </div>
                                          <div>
                                              <label className="input-label">Bordas da Foto</label>
                                              <select onChange={(e) => atualizarElemento('imgRounded', e.target.value)} className="input-standard">
                                                  <option value="rounded-none shadow-none">Retas (Simples)</option>
                                                  <option value="rounded-md shadow-md">Suaves com Sombra</option>
                                                  <option value="rounded-xl shadow-xl">Arredondadas (Premium)</option>
                                                  <option value="rounded-full shadow-lg">Círculo Perfeito</option>
                                                  <option value="rounded-xl shadow-2xl shadow-indigo-500/50">Brilho Colorido (Glow)</option>
                                                  <option value="rounded-lg border-4 border-white shadow-xl">Cartão Polaroid</option>
                                                  <option value="rounded-full border-4 border-emerald-500 shadow-lg">Círculo com Borda (Status)</option>
                                              </select>
                                          </div>
                                      </div>
                                      
                                      <div className="panel-section">
                                          <label className="input-label flex justify-between">Transparência (Opacidade) <span>{Math.round((elementoSelecionado.opacity || 1) * 100)}%</span></label>
                                          <input type="range" min="0" max="100" value={(elementoSelecionado.opacity || 1) * 100} onChange={(e) => atualizarElemento('opacity', parseInt(e.target.value) / 100)} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2" />
                                      </div>

                                  </>
                              ) : (
                                  <>
                                      {(elementoSelecionado.tagName === 'a' || elementoSelecionado.tagName === 'button') && (
                                          <div className="p-4 mx-4 mt-4 bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm">
                                              <label className="text-[11px] font-black text-emerald-800 uppercase mb-2 flex items-center"><i className="fas fa-link mr-2 text-emerald-600"></i> Para onde este botão leva?</label>
                                              <input type="text" placeholder="Cole o link aqui (ex: whatsapp, instagram, etc)" value={elementoSelecionado.href} onChange={(e) => atualizarElemento('href', e.target.value)} className="input-standard border-emerald-300 focus:border-emerald-600 font-medium" />
                                          </div>
                                      )}

                                      <div className="panel-section">
                                          {!elementoSelecionado.bloqueiaTexto && (
                                              <div className="flex justify-between items-center mb-3">
                                                  <label className="input-label mb-0">Texto do Elemento</label>
                                                  <div className="flex bg-slate-100 rounded-lg border border-slate-200 p-1">
                                                      <button onClick={() => atualizarElemento('textAlign', 'text-left')} className="w-7 h-6 flex items-center justify-center hover:bg-white rounded text-slate-500 transition"><i className="fas fa-align-left text-[10px]"></i></button>
                                                      <button onClick={() => atualizarElemento('textAlign', 'text-center')} className="w-7 h-6 flex items-center justify-center hover:bg-white rounded text-slate-500 transition"><i className="fas fa-align-center text-[10px]"></i></button>
                                                      <button onClick={() => atualizarElemento('textAlign', 'text-right')} className="w-7 h-6 flex items-center justify-center hover:bg-white rounded text-slate-500 transition"><i className="fas fa-align-right text-[10px]"></i></button>
                                                  </div>
                                              </div>
                                          )}
                                          
                                          {elementoSelecionado.bloqueiaTexto ? (
                                              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-orange-800">
                                                  <p className="text-xs font-bold mb-1"><i className="fas fa-exclamation-triangle"></i> Container Estrutural</p>
                                                  <p className="text-[10px] leading-relaxed">Clique em textos ou botões para editar seus conteúdos. Neste painel você ajusta apenas a Cor (Película) e a Imagem de Fundo desta caixa.</p>
                                              </div>
                                          ) : (
                                              <textarea rows={4} value={elementoSelecionado.text} onChange={(e) => atualizarElemento('text', e.target.value, true)} className="input-standard resize-y shadow-inner text-sm"></textarea>
                                          )}
                                      </div>
                                      
                                      <div className="panel-section grid grid-cols-2 gap-5">
                                          <div>
                                              <label className="input-label flex justify-between">Tamanho da Letra <span>{elementoSelecionado.fontSize}px</span></label>
                                              <input type="range" min="10" max="120" value={elementoSelecionado.fontSize || 16} onChange={(e) => atualizarElemento('fontSize', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-3" />
                                          </div>
                                          <div className="flex flex-col gap-3">
                                              <div className="flex justify-between items-center">
                                                  <label className="text-[10px] font-bold text-slate-600 uppercase">Cor do Fundo</label>
                                                  <input type="color" value={elementoSelecionado.bgColor || '#ffffff'} onChange={(e) => atualizarElemento('bgColor', e.target.value)} className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shadow-sm" />
                                              </div>
                                              <div className="flex justify-between items-center">
                                                  <label className="text-[10px] font-bold text-slate-600 uppercase">Cor da Letra</label>
                                                  <input type="color" value={elementoSelecionado.textColor || '#000000'} onChange={(e) => atualizarElemento('textColor', e.target.value)} className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shadow-sm" />
                                              </div>
                                          </div>
                                      </div>

                                      <div className="panel-section">
                                          <label className="input-label flex justify-between">Opacidade da Cor (Película) <span>{Math.round((elementoSelecionado.opacity || 1) * 100)}%</span></label>
                                          <input type="range" min="0" max="100" value={(elementoSelecionado.opacity || 1) * 100} onChange={(e) => atualizarElemento('opacity', parseInt(e.target.value) / 100)} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2" />
                                      </div>

                                      <div className="panel-section">
                                          <label className="input-label flex items-center gap-1.5"><i className="fas fa-image text-slate-400"></i> Imagem de Fundo (Seção)</label>
                                          <div className="flex gap-2 mb-2">
                                              <input type="text" placeholder="Link direto da imagem..." value={elementoSelecionado.bgImage || ''} onChange={(e) => atualizarElemento('bgImage', e.target.value)} className="input-standard flex-1 text-[10px]" />
                                          </div>
                                          <div className="flex gap-2">
                                              <button onClick={() => gerarNovaImagemIAAutomatica(true)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded transition"><i className="fas fa-robot mr-1"></i> Inteligência Artificial</button>
                                              <label className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded text-center cursor-pointer transition"><i className="fas fa-desktop mr-1"></i> Computador<input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImgElem(e, true)} /></label>
                                          </div>
                                      </div>

                                      <div className="panel-section bg-slate-50/50">
                                          <label className="input-label">Efeitos Interativos (Ao passar o mouse)</label>
                                          <select onChange={(e) => atualizarElemento('animationClass', e.target.value)} className="input-standard font-medium">
                                              <option value="">Sem Efeito</option>
                                              <option value="hover:scale-105 transition-transform duration-300">Dar Zoom (Crescer)</option>
                                              <option value="hover:-translate-y-2 transition-transform duration-300">Levantar Levemente</option>
                                              <option value="animate-pulse">Pulsar sem parar (Atenção)</option>
                                          </select>
                                      </div>
                                  </>
                              )}

                              {/* PAINEL DO COPYWRITER IA */}
                              <div className="m-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 shadow-xl text-white">
                                  <label className="text-[11px] font-black uppercase tracking-widest text-indigo-300 mb-4 flex items-center"><i className="fas fa-robot text-xl mr-2 text-white"></i> Otimização com IA</label>
                                  
                                  {elementoSelecionado.tagName !== 'img' && !elementoSelecionado.bloqueiaTexto && (
                                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                                          <button onClick={() => otimizarComIA("Reescreva com copy persuasiva para prender a atenção e vender mais, deixando o texto profissional e elegante.")} className="bg-slate-700 hover:bg-slate-600 text-[10px] font-bold py-2.5 rounded-lg text-white transition shadow-sm border border-slate-600">Mais Persuasivo</button>
                                          <button onClick={() => otimizarComIA("Reescreva gerando forte urgência, escassez e apelo forte para clicar. O usuário deve sentir que precisa agir agora.")} className="bg-orange-600 hover:bg-orange-500 text-[10px] font-bold py-2.5 rounded-lg text-white transition shadow-sm border border-orange-500 flex items-center justify-center gap-1.5"><i className="fas fa-fire"></i> Gerar Urgência</button>
                                      </div>
                                  )}
                                  <div className="flex gap-2 relative">
                                      <input type="text" id="ai_prompt_element" placeholder="Escreva o que a IA deve fazer..." className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-4 py-3 outline-none focus:border-indigo-400 placeholder-slate-400" />
                                      <button onClick={() => otimizarComIA()} className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-indigo-600 hover:bg-indigo-500 rounded-md flex items-center justify-center transition shadow-sm"><i className="fas fa-paper-plane"></i></button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              ) : (
                  
                  <div className="animate-[fadeIn_0.2s_ease] pb-12 bg-white">
                      
                      {/* NOVAS ABAS DE NAVEGAÇÃO */}
                      <div className="flex p-2 bg-slate-50 border-b border-slate-200 gap-1.5 overflow-x-auto custom-scrollbar">
                          <button onClick={() => setAbaAtiva('gerar')} className={`whitespace-nowrap flex-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition flex justify-center items-center ${abaAtiva === 'gerar' ? 'bg-white shadow border border-slate-200 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}><i className="fas fa-magic mr-1.5"></i> Criar Site</button>
                          <button onClick={() => setAbaAtiva('refinar')} className={`whitespace-nowrap flex-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition flex justify-center items-center ${abaAtiva === 'refinar' ? 'bg-white shadow border border-slate-200 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}><i className="fas fa-code-branch mr-1.5"></i> Modificar</button>
                      </div>

                      {abaAtiva === 'refinar' ? (
                          <div className="p-5 space-y-6">
                              <div>
                                  <h3 className="text-xs font-black uppercase text-slate-800 mb-3.5 tracking-wide flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-500"><i className="fas fa-magic"></i></span> Refatoração Global</h3>
                                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">Adicione blocos inteiros, links no rodapé ou botões extras no site sem precisar recriar tudo do zero.</p>
                                  <textarea id="refineGlobalContent" className="input-standard h-36 resize-none leading-relaxed text-sm p-4 rounded-xl shadow-inner border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" placeholder="Ex: Adicione um link para 'Blog' no menu superior, ou crie um botão flutuante de WhatsApp no canto da tela..."></textarea>
                                  
                                  <button onClick={executarRefinamentoGlobal} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2">
                                      <i className="fas fa-code-branch text-yellow-300 text-lg"></i> Aplicar Modificação (IA)
                                  </button>
                              </div>
                          </div>
                      ) : (
                          <div className="p-5 space-y-6">
                              <div>
                                  <h3 className="text-xs font-black uppercase text-slate-800 mb-3.5 tracking-wide flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-500">1</span> Cores e Estilo</h3>
                                  <div className="space-y-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                      
                                      <div>
                                          <label className="input-label mb-2">Paleta de Cores</label>
                                          <div className="flex flex-wrap gap-2.5">
                                              {[
                                                  {id: 'auto', cor: 'bg-gradient-to-r from-blue-400 to-purple-500', title: 'Extrair Inteligente'},
                                                  {id: 'dark', cor: 'bg-slate-900', title: 'Modo Escuro'},
                                                  {id: 'azul', cor: 'bg-blue-600', title: 'Azul Confiança'},
                                                  {id: 'verde', cor: 'bg-emerald-500', title: 'Verde Dinheiro/Saúde'},
                                                  {id: 'roxo', cor: 'bg-purple-600', title: 'Roxo Criativo'},
                                                  {id: 'rosa', cor: 'bg-pink-500', title: 'Rosa Suave'},
                                                  {id: 'vermelho', cor: 'bg-red-600', title: 'Vermelho Urgência'},
                                                  {id: 'amarelo', cor: 'bg-yellow-400', title: 'Amarelo Energia'},
                                                  {id: 'laranja', cor: 'bg-orange-500', title: 'Laranja Criativo'},
                                                  {id: 'terracota', cor: 'bg-amber-700', title: 'Terracota Conforto'},
                                                  {id: 'cinza', cor: 'bg-zinc-500', title: 'Cinza Monocromático'},
                                                  {id: 'personalizada', cor: 'bg-white border-2 border-dashed border-slate-300', title: 'Escolher Manualmente'}
                                              ].map(c => (
                                                  <button key={c.id} onClick={() => setCorSelecionada(c.id)} className={`w-8 h-8 rounded-full shadow-sm transition-transform ${corSelecionada === c.id ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110' : 'hover:scale-105'} ${c.cor} flex items-center justify-center`} title={c.title}>
                                                      {c.id === 'auto' && <i className="fas fa-wand-magic-sparkles text-white text-[10px]"></i>}
                                                      {c.id === 'personalizada' && <i className="fas fa-plus text-slate-400 text-[10px]"></i>}
                                                  </button>
                                              ))}
                                          </div>
                                          
                                          {corSelecionada === 'personalizada' && (
                                              <div className="flex gap-3 mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 animate-[fadeIn_0.2s_ease]">
                                                  <div className="flex-1"><label className="input-label">Fundo do Site</label><input type="color" id="corFundo" className="w-full h-8 rounded-md cursor-pointer p-0 border border-slate-300 shadow-sm" defaultValue="#ffffff" /></div>
                                                  <div className="flex-1"><label className="input-label">Botões / Detalhes</label><input type="color" id="corPrimaria" className="w-full h-8 rounded-md cursor-pointer p-0 border border-slate-300 shadow-sm" defaultValue="#4f46e5" /></div>
                                              </div>
                                          )}
                                      </div>

                                      <div className="pt-2">
                                          <label htmlFor="nichoEstilo" className="input-label">Aparência do Site</label>
                                          <select id="nichoEstilo" value={nichoEstilo} onChange={(e) => setNichoEstilo(e.target.value)} className="input-standard text-sm font-bold text-slate-700">
                                              <option value="minimalista">Clean e Moderno</option>
                                              <option value="premium">Premium Elegante (Alto Padrão)</option>
                                              <option value="agressivo">Venda Agressiva (Lançamentos)</option>
                                              <option value="terapia">Acolhedor e Suave (Saúde)</option>
                                          </select>
                                      </div>
                                  </div>
                              </div>

                              <div>
                                  <h3 className="text-xs font-black uppercase text-slate-800 mb-3.5 tracking-wide flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-500">2</span> Formato do Topo</h3>
                                  <div className="space-y-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                      <div>
                                          <label htmlFor="heroLayout" className="input-label">Como o topo vai aparecer?</label>
                                          <select id="heroLayout" value={heroLayout} onChange={(e) => setHeroLayout(e.target.value)} className="input-standard">
                                              <option value="auto">Deixar a IA escolher</option>
                                              <option value="center">Texto no Centro (Melhor para leitura)</option>
                                              <option value="split">Texto de um lado, Imagem do outro</option>
                                          </select>
                                      </div>
                                      <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition">
                                          <input type="checkbox" checked={terMenuTexto} onChange={(e) => setTerMenuTexto(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                          <span className="text-xs font-bold text-slate-700">Ter um Menu no Topo do Site</span>
                                      </label>
                                  </div>
                              </div>

                              {/* A NOVA SEÇÃO 3: HÍBRIDA (COPY + REFERÊNCIA) */}
                              <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
                                  <h3 className="text-xs font-black uppercase text-indigo-900 mb-3 tracking-wide flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span> Base de Conhecimento</h3>
                                  
                                  {/* Área de Texto / Prompt */}
                                  <div className="mb-4">
                                      <label className="input-label text-indigo-800">Texto / Copy / Prompt (Opcional)</label>
                                      <textarea 
                                          value={productContent} 
                                          maxLength={5000} 
                                          onChange={(e) => setProductContent(e.target.value)} 
                                          className="input-standard h-28 resize-y leading-relaxed text-sm p-4 rounded-xl border-indigo-200 shadow-inner" 
                                          placeholder="Cole a copy do site, descreva seu negócio, ou dê comandos extras para a IA... (Até 5.000 caracteres)"
                                      ></textarea>
                                      <div className="text-right text-[9px] text-indigo-400 mt-1 font-bold">{productContent.length}/5000</div>
                                  </div>

                                  {/* Área de Imagem */}
                                  <div className="mb-4">
                                      <label className="input-label text-indigo-800">Imagem de Referência (Opcional)</label>
                                      <div className="bg-white border-2 border-dashed border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm" onClick={() => document.getElementById('imageUploadInput')?.click()}>
                                          <div className="w-10 h-10 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-2"><i className="fas fa-image text-lg"></i></div>
                                          <p className="text-xs font-bold text-slate-700">Anexar imagem base do layout</p>
                                          <p className="text-[10px] font-medium text-slate-500 mt-0.5">Ou cole aqui (Ctrl+V)</p>
                                      </div>
                                      <input type="file" id="imageUploadInput" multiple accept="image/*" className="hidden" onChange={handleImageUploadInput} />
                                      
                                      {uploadedImages.length > 0 && (
                                          <div className="flex gap-3 mt-3 overflow-x-auto pb-2 custom-scrollbar">
                                              {uploadedImages.map((imgObj, idx) => (
                                                  <div key={idx} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-indigo-200 shadow-sm group">
                                                      <img src={`data:${imgObj.mimeType};base64,${imgObj.data}`} className="w-full h-full object-cover" />
                                                      <button className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" onClick={(e) => { e.stopPropagation(); removerImagem(idx); }}><i className="fas fa-trash text-sm"></i></button>
                                                  </div>
                                              ))}
                                          </div>
                                      )}
                                  </div>

                                  <button onClick={executarGeracaoSiteHibrida} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2">
                                      <i className="fas fa-rocket text-yellow-300 text-lg"></i> Gerar Meu Site Agora
                                  </button>
                              </div>

                          </div>
                      )}
                  </div>
              )}
          </div>
      </div>

      <div className="flex-grow flex flex-col bg-slate-200 relative min-w-0">
          
          <div className="bg-white border-b border-slate-200 flex justify-between items-center px-4 md:px-6 h-[60px] shadow-sm z-10">
              <div className="flex items-center gap-3 md:gap-5">
                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                      <button id="tabPreview" onClick={() => (window as any).mudarSeparador('preview')} className="px-5 py-2 rounded-md font-bold text-xs bg-white text-indigo-700 shadow-sm transition">Ver o Site</button>
                      <button id="tabCode" onClick={() => (window as any).mudarSeparador('code')} className="px-5 py-2 rounded-md font-bold text-xs text-slate-500 hover:text-slate-800 transition">Código Fonte</button>
                  </div>
                  <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
                  <button onClick={desfazerCodigo} className="hidden md:flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-bold transition px-2 py-1 rounded hover:bg-slate-100"><i className="fas fa-undo"></i> Desfazer Erro</button>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                  <button onClick={carregarMeusSites} className="text-slate-600 hover:text-indigo-600 font-bold text-xs px-3 py-2 rounded hover:bg-slate-100 transition"><i className="fas fa-th-large mr-1.5"></i> Meus Projetos</button>
                  <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
                  
                  <div className="flex bg-slate-50 rounded-lg border border-slate-200 mr-1 hidden lg:flex">
                      <button onClick={() => (window as any).baixarHtmlGerado()} className="text-slate-500 hover:text-indigo-600 text-xs px-3 py-2 border-r border-slate-200 transition" title="Baixar Arquivo para o Computador"><i className="fas fa-download"></i></button>
                      <button onClick={() => (window as any).copiarCodigo()} className="text-slate-500 hover:text-indigo-600 text-xs px-3 py-2 transition" title="Copiar todo o Código HTML"><i className="fas fa-copy"></i></button>
                  </div>
                  
                  {siteEditando ? (
                      <div className="flex gap-2">
                          <button onClick={() => setSiteEditando(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition border border-slate-200">Cancelar</button>
                          <button onClick={() => (window as any).handlePublicarSite()} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-md flex items-center"><i className="fas fa-cloud-upload-alt mr-1.5"></i> Salvar Edição</button>
                      </div>
                  ) : (
                      <button onClick={() => (window as any).handlePublicarSite()} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wide rounded-lg shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 flex items-center"><i className="fas fa-globe mr-1.5"></i> Publicar Online</button>
                  )}
              </div>
          </div>
          
          <div className="flex-grow relative bg-slate-200 p-0 md:p-6 lg:p-8 overflow-hidden flex justify-center">
              {modoInspetor && (
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-8 py-3 rounded-full shadow-2xl shadow-indigo-500/50 font-black text-xs uppercase tracking-widest flex items-center gap-3 border-[3px] border-indigo-400 animate-bounce pointer-events-none">
                      <i className="fas fa-mouse-pointer text-yellow-300"></i> Pode Clicar e Editar o Site!
                  </div>
              )}
              
              <div className={`w-full h-full max-w-[1440px] bg-white mx-auto shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300 ${modoInspetor ? 'ring-4 ring-indigo-500/30 rounded-xl' : 'rounded-none md:rounded-2xl border border-slate-300'}`}>
                  {modoInspetor && (
                      <div className="h-7 w-full bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-slate-300"></div><div className="w-3 h-3 rounded-full bg-slate-300"></div><div className="w-3 h-3 rounded-full bg-slate-300"></div>
                          <div className="mx-auto bg-white border border-slate-200 text-[9px] text-slate-500 px-10 py-0.5 rounded-full font-bold">Visualização do Site</div>
                      </div>
                  )}
                  <iframe id="previewFrame" className="w-full flex-1 border-none active bg-white" sandbox="allow-scripts allow-same-origin" title="Navegador do Site"></iframe>
                  <div id="codigoContainer" className="w-full h-full bg-[#0d1117] relative">
                      <textarea id="codigoGerado" className="absolute inset-0 w-full h-full font-mono text-[13px] bg-[#0d1117] text-[#56d364] border-none outline-none resize-none custom-scrollbar p-8 leading-relaxed"
                          onBlur={(e) => {
                              const newHtml = e.target.value;
                              const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
                              if (iframe) { iframe.srcdoc = newHtml + SCRIPT_PREVIEW; }
                              setHistoricoCodigo(prev => {
                                  if (prev.length > 0 && prev[prev.length - 1] === newHtml) return prev;
                                  return [...prev, newHtml];
                              });
                          }}
                      ></textarea>
                  </div>
              </div>
          </div>
      </div>
      
      {modalMeusSitesAberto && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-black text-slate-800 flex items-center"><i className="fas fa-server text-indigo-500 mr-2.5"></i> Seus Projetos Publicados</h2>
              <button onClick={() => setModalMeusSitesAberto(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition font-bold"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
              {carregandoSites ? <div className="text-center py-16"><i className="fas fa-circle-notch fa-spin text-4xl text-indigo-500 mb-4"></i><p className="text-sm font-bold text-slate-500">Buscando seus sites...</p></div> : listaSites.length === 0 ? <div className="text-center py-20"><i className="fas fa-folder-open text-6xl text-slate-300 mb-4"></i><p className="text-lg font-bold text-slate-600">Você ainda não tem nenhum projeto.</p><p className="text-sm text-slate-400 mt-2">Crie seu primeiro site e publique para aparecer aqui!</p></div> : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {sitesAtuais.map((site) => {
                        const linkUrl = `${window.location.origin}/${site.slug}`;
                        return (
                          <div key={site.id} className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-lg transition-all bg-white flex flex-col group">
                            <h3 className="font-black text-base text-slate-800 mb-3 truncate group-hover:text-indigo-700 transition-colors">{site.titulo}</h3>
                            <div className="flex bg-slate-50 border border-slate-200 rounded-lg text-xs overflow-hidden mb-5">
                                <span className="bg-slate-100 text-slate-500 px-3 py-2 border-r border-slate-200 flex items-center"><i className="fas fa-link"></i></span>
                                <input type="text" readOnly value={linkUrl} className="bg-transparent w-full p-2 outline-none font-mono text-slate-600" />
                            </div>
                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                              <a href={`/${site.slug}`} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase text-indigo-600 hover:text-indigo-800 transition flex items-center"><i className="fas fa-external-link-alt mr-1.5"></i> Acessar Link</a>
                              <div className="flex gap-2">
                                <button onClick={() => editarSite(site)} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition shadow-sm"><i className="fas fa-pen mr-1"></i> Abrir</button>
                                <button onClick={() => deletarSite(site.id, site.slug)} className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-lg transition" title="Deletar Projeto"><i className="fas fa-trash"></i></button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {totalPaginas > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-8 pt-6">
                        <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-slate-50 transition shadow-sm"><i className="fas fa-chevron-left"></i> Voltar</button>
                        <span className="text-xs font-black text-slate-500 tracking-widest uppercase bg-white px-4 py-2 rounded-lg border border-slate-200">Página {paginaAtual} de {totalPaginas}</span>
                        <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-slate-50 transition shadow-sm">Próxima <i className="fas fa-chevron-right ml-1"></i></button>
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