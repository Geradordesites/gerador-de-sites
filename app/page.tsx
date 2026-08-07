'use client';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

// SCRIPT INJETADO NO IFRAME (BLINDAGEM ANTI-INCEPTION E NOVO MOTOR VISUAL)
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
                // Textos e Mídias
                if(event.data.text !== undefined) el.innerText = event.data.text;
                if(event.data.src !== undefined) el.src = event.data.src;
                if(event.data.href !== undefined) el.setAttribute('href', event.data.href);
                
                // Cores e Tamanhos
                if(event.data.bgColor !== undefined) el.style.backgroundColor = event.data.bgColor;
                if(event.data.textColor !== undefined) el.style.color = event.data.textColor;
                if(event.data.fontSize !== undefined) el.style.fontSize = event.data.fontSize + 'px';
                
                // Imagem de Fundo Avançada
                if(event.data.bgImage !== undefined) {
                    if(event.data.bgImage) {
                        el.style.backgroundImage = "url('" + event.data.bgImage + "')";
                        el.style.backgroundSize = "cover";
                        el.style.backgroundPosition = "center";
                    } else {
                        el.style.backgroundImage = "none";
                    }
                }

                // Alinhamento
                if(event.data.textAlign !== undefined) {
                    el.classList.remove('text-left', 'text-center', 'text-right', 'text-justify');
                    if(event.data.textAlign) el.classList.add(event.data.textAlign);
                }

                // Efeitos e Animações Rápidas
                if(event.data.animationClass !== undefined) {
                    el.classList.remove('animate-pulse', 'animate-bounce', 'hover:scale-105', 'hover:scale-110', 'transition-transform', 'transition-all', 'duration-300');
                    if(event.data.animationClass) {
                        event.data.animationClass.split(' ').forEach(cls => el.classList.add(cls));
                    }
                }

                // Classes Tailwind Livres (Degradês, Opacidade, etc)
                if(event.data.customClasses !== undefined) {
                    // Aqui substituímos as classes antigas do usuário pelas novas, sem perder a base
                    if(el.dataset.customClasses) {
                        el.dataset.customClasses.split(' ').forEach(cls => { if(cls) el.classList.remove(cls); });
                    }
                    if(event.data.customClasses) {
                        event.data.customClasses.split(' ').forEach(cls => { if(cls) el.classList.add(cls); });
                    }
                    el.dataset.customClasses = event.data.customClasses; // salva o estado
                }

                // Efeitos Específicos para Tags IMG
                if(event.data.imgFormat !== undefined) {
                    el.classList.remove('aspect-video', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]');
                    if (event.data.imgFormat) { el.classList.add(event.data.imgFormat); el.classList.add('object-cover'); }
                }
                if(event.data.imgRounded !== undefined) {
                    el.classList.remove('rounded-none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full');
                    if (event.data.imgRounded) el.classList.add(event.data.imgRounded);
                }
                if(event.data.imgBorder !== undefined) {
                    if (event.data.imgBorder) el.classList.add('border-4', 'border-white', 'shadow-2xl');
                    else el.classList.remove('border-4', 'border-white', 'shadow-2xl');
                }

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
        
        // ---- A NOVA BLINDAGEM ANTI-INCEPTION ----
        if (link) {
            e.preventDefault(); // Bloqueio agressivo nativo
            e.stopPropagation();

            if (!modoEdicao) {
                var href = link.getAttribute('href') || '';
                if(href.startsWith('#')) {
                    // Menu Âncora suave
                    var hash = href.substring(href.indexOf('#'));
                    if (hash.length > 1) {
                        try {
                            var targetEl = document.querySelector(hash);
                            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } catch(err) {}
                    }
                } else if (href && !href.startsWith('javascript:')) {
                    // A MÁGICA: Abre links externos em NOVA ABA, nunca dentro do painel
                    window.open(href, '_blank');
                }
                return; // Encerra a ação do clique aqui se não estiver editando
            }
        }

        if(!modoEdicao) return;
        e.preventDefault(); e.stopPropagation();

        if(elSelecionado) elSelecionado.style.outline = '';
        elSelecionado = e.target;
        elSelecionado.style.outline = '3px solid #4f46e5';

        if(!elSelecionado.id) elSelecionado.id = 'el_' + Math.random().toString(36).substr(2,9);

        let compStyle = window.getComputedStyle(elSelecionado);
        
        // Puxando imagem de fundo se houver
        let bgImg = elSelecionado.style.backgroundImage || '';
        if(bgImg.startsWith('url(')) bgImg = bgImg.slice(5, -2); 
        else bgImg = '';

        window.parent.postMessage({
            type: 'ELEMENT_SELECTED',
            id: elSelecionado.id,
            tagName: elSelecionado.tagName.toLowerCase(),
            text: elSelecionado.innerText,
            src: elSelecionado.src || '',
            href: elSelecionado.getAttribute('href') || '',
            className: elSelecionado.className,
            bgColor: rgbToHex(compStyle.backgroundColor),
            textColor: rgbToHex(compStyle.color),
            fontSize: parseInt(compStyle.fontSize),
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

  const atualizarElementoManual = (field: string, value: string | number | boolean) => {
      if(!elementoSelecionado) return;
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      iframe.contentWindow?.postMessage({ type: 'UPDATE_ELEMENT', id: elementoSelecionado.id, [field]: value }, '*');
      setElementoSelecionado((prev: any) => ({...prev, [field]: value}));
  };

  const refinarElementoComIA = async () => {
      const promptInput = document.getElementById('ai_prompt_element') as HTMLInputElement;
      const comando = promptInput.value.trim();
      if(!comando || !elementoSelecionado) { (window as any).showNotification("Digite o que deseja mudar na IA.", "error"); return; }

      const systemInstruction = `Você é um Copywriter de Elite e Programador Cirúrgico.
      Receberá o HTML de UM único elemento. Modifique apenas o que for pedido: "${comando}". 
      REGRA MÁXIMA: Se for pedido para reescrever, melhorar ou refazer o texto, APENAS DEVOLVA O TEXTO PERSUASIVO FINAL DENTRO DA TAG HTML. NUNCA escreva coisas literais como "Aqui está a reescrita" ou "Refazendo o texto". AJA COMO O COPYWRITER e entregue direto.
      Preserve o atributo id="${elementoSelecionado.id}".`;
      
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

    const getMegaPromptEstilo = () => {
      const estilo = (document.getElementById('nichoEstilo') as HTMLSelectElement)?.value || 'nenhum';
      if (estilo === 'premium') return "DIRETRIZ VISUAL: Design sofisticado (Premium). Tipografia serifada elegante (ex: Playfair Display ou Merriweather).";
      if (estilo === 'terapia') return "DIRETRIZ VISUAL: Layout minimalista, calmo e acolhedor. Muito espaço em branco (respiro), bordas arredondadas e suavidade nas seções.";
      if (estilo === 'agressivo') return "DIRETRIZ VISUAL: Altíssima conversão, Dark Mode agressivo com textos claros, blocos de forte impacto visual e gatilhos de urgência destacados.";
      if (estilo === 'corporativo') return "DIRETRIZ VISUAL: Corporativo Institucional B2B, limpo e direto. Tipografia moderna (ex: Inter, Roboto) e simetria estruturada.";
      if (estilo === 'consultor') return "DIRETRIZ VISUAL: Elegante, focado em autoridade pessoal. Tipografia marcante e seções de biografia e prova social altamente destacadas.";
      if (estilo === 'feminino') return "DIRETRIZ VISUAL: Sofisticado, suave e luxuoso. Fontes delicadas, curvas orgânicas nas seções e sensação de leveza.";
      if (estilo === 'minimalista') return "DIRETRIZ VISUAL: Ultra minimalista (estilo Apple). Máximo de espaço em branco, tipografia fina e limpa, zero poluição visual.";
      return "DIRETRIZ VISUAL: Crie um design profissional, moderno e altamente focado em conversão e usabilidade.";
    };

    const getMegaPromptCores = () => {
      const cor = (document.getElementById('paletaCores') as HTMLSelectElement)?.value || 'auto';
      if (cor === 'personalizada') return `OVERRIDE - CORES: Fundo principal: ${(document.getElementById('corFundo') as HTMLInputElement)?.value}, Cor de Destaque (Botões/Títulos): ${(document.getElementById('corPrimaria') as HTMLInputElement)?.value}`;
      if (cor === 'auto') return "PALETA: Identifique na imagem anexada e Clone as cores exatas (fundos, textos e botões) da referência visual.";
      if (cor === 'azul') return "PALETA DE CORES: Azul Profundo/Meia-Noite como cor de fundo primária, textos claros e botões em cores de alto contraste.";
      if (cor === 'verde') return "PALETA DE CORES: Tons de Verde Esmeralda e Musgo, transmitindo saúde e crescimento. Fundo claro e botões verdes.";
      if (cor === 'terracota') return "PALETA DE CORES: Tons terrosos de Terracota, Nude e Areia. Muito elegante e acolhedor.";
      if (cor === 'roxo') return "PALETA DE CORES: Roxo Real e Violeta. Sensação de luxo, mistério e inovação.";
      if (cor === 'dark') return "PALETA DE CORES: Dark Mode Total (Fundos quase pretos ou grafite muito escuro), textos brancos/cinzas e destaques em Neon ou Dourado.";
      if (cor === 'cinza') return "PALETA DE CORES: Tons de Cinza Minimalista e Prata. Neutro, chique e profissional.";
      if (cor === 'vermelho') return "PALETA DE CORES: Destaques em Vermelho Rubi e Bordô para máxima atenção e urgência.";
      if (cor === 'amarelo') return "PALETA DE CORES: Preto sólido contrastando com Amarelo Solar vibrante.";
      if (cor === 'rosa') return "PALETA DE CORES: Rosa Pastel e Magenta. Focado no público feminino, suave e moderno.";
      return "";
    };

    const getMegaPromptHero = () => {
      const hero = (document.getElementById('heroLayout') as HTMLSelectElement)?.value || 'auto';
      if (hero === 'center') return "ESTRUTURA DO HERO (TOPO): OBRIGATORIAMENTE Centralizado (text-center). O título, subtítulo e botão de chamada para ação devem estar perfeitamente alinhados no meio da tela.";
      if (hero === 'split') return "ESTRUTURA DO HERO (TOPO): OBRIGATORIAMENTE Dividido em duas colunas (Side-by-side no Desktop). Texto (Copy) e Botões de um lado, e a Imagem de destaque do outro lado.";
      return "ESTRUTURA DO HERO: Siga a estrutura exata apresentada na imagem de referência ou otimize para a melhor conversão.";
    };

    (window as any).executarGeracaoSite = async (imagesList: any[]) => {
      if (imagesList.length === 0) { (window as any).showNotification('Anexe referências visuais na caixa de Upload.', 'error'); return; }
      const isMenu = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked ? "CRIE UM MENU SUPERIOR FIXO COM LINKS ÂNCORA PARA AS SEÇÕES." : "NÃO CRIE MENU SUPERIOR.";
      
      let promptParts: any[] = [{ text: "ATENÇÃO: Faça a engenharia reversa exata do design desta imagem (textos e layout), mas aplique AS SEGUINTES DIRETRIZES TÉCNICAS E VISUAIS impostas pelo usuário no sistema:" }];
      imagesList.forEach(img => promptParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } }));
      
      const instrucoesFinais = `Especialista Tailwind CSS. \n${isMenu} \n${getMegaPromptEstilo()} \n${getMegaPromptHero()} \n${getMegaPromptCores()}`;
      const data = await (window as any).chamarIABase(instrucoesFinais, promptParts);
      if (data) processarResposta(data);
    };

    (window as any).gerarSiteComCopy = async () => {
      const content = (document.getElementById('productContent') as HTMLTextAreaElement)?.value.trim();
      if (!content) { (window as any).showNotification('Por favor, insira o texto base ou o comando de criação primeiro.', 'error'); return; }
      
      const isMenu = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked ? "CRIE UM MENU SUPERIOR FIXO COM LINKS ÂNCORA PARA AS SEÇÕES." : "NÃO CRIE MENU SUPERIOR.";
      const instrucoesFinais = `Copywriter de Elite e Dev Sênior Tailwind. Crie uma Landing Page completa do zero com base nestas instruções de Copy. \n${isMenu} \n${getMegaPromptEstilo()} \n${getMegaPromptHero()} \n${getMegaPromptCores()}`;
      
      const data = await (window as any).chamarIABase(instrucoesFinais, [{ text: "INSTRUÇÕES/TEXTO DO USUÁRIO:\n" + content }]);
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
      div.className = type === 'error' 
        ? `fixed top-10 left-1/2 -translate-x-1/2 bg-white border-l-4 border-red-500 px-6 py-4 rounded shadow-2xl z-[9999] flex gap-4 max-w-xl` 
        : `fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded shadow-xl z-[9999] flex gap-2`;
      div.innerHTML = type === 'error' ? `<i class="fas fa-exclamation-circle text-red-500 mt-1"></i> <div class="flex-1 text-sm font-medium text-slate-800">${msg}</div>` : `<i class="fas fa-check-circle"></i> <span class="text-sm font-medium">${msg}</span>`;
      document.body.appendChild(div);
      setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 500); }, 3000);
    };

    (window as any).copiarCodigo = () => {
      const txt = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!txt) return; navigator.clipboard.writeText(txt); (window as any).showNotification('Código copiado para a área de transferência!', 'success');
    };

    (window as any).baixarHtmlGerado = () => {
      const txt = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!txt) { (window as any).showNotification('Não há código para baixar. Gere um site primeiro.', 'error'); return; }
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/html' }));
      a.download = siteEditando ? `${siteEditando.slug}.html` : 'landing-page-pro.html'; a.click();
    };

    (window as any).handlePublicarSite = async () => {
      const htmlContent = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!htmlContent) { (window as any).showNotification('Você precisa gerar um site antes de publicar.', 'error'); return; }
      if (siteEditando) { await supabase.from('sites_gerados').update({ html_content: htmlContent }).eq('id', siteEditando.id); (window as any).showNotification('Site atualizado com sucesso!', 'success'); return; }
      const nome = prompt('Dê um nome para a sua Landing Page (será usado no Link Público):'); if (!nome) return; 
      let slug = nome.trim().toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || nanoid(6); 
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { alert('Sessão expirada. Faça login novamente.'); window.location.href = '/login'; return; }
      const { error } = await supabase.from('sites_gerados').insert([{ user_id: session?.user.id, slug, titulo: nome, html_content: htmlContent }]);
      if (error) { (window as any).showNotification('Erro: Este nome de link já está em uso.', 'error'); return; }
      const linkPublico = `${window.location.origin}/${slug}`;
      navigator.clipboard.writeText(linkPublico);
      alert(`🎉 Site publicado e online!\n\nSeu link foi copiado para a área de transferência:\n${linkPublico}`);
    };
  }, [siteEditando]); 

  const desfazerCodigo = () => {
    if (historicoCodigo.length === 0) { (window as any).showNotification('Você já está na versão mais antiga.', 'error'); return; }
    const ultimo = historicoCodigo[historicoCodigo.length - 1];
    setHistoricoCodigo(prev => prev.slice(0, prev.length - 1));
    (document.getElementById('codigoGerado') as HTMLTextAreaElement).value = ultimo;
    (document.getElementById('previewFrame') as HTMLIFrameElement).srcdoc = ultimo + SCRIPT_PREVIEW; 
    setElementoSelecionado(null);
    (window as any).showNotification('Ação desfeita com sucesso!', 'success');
  };

  const indexOfLastSite = paginaAtual * SITES_POR_PAGINA;
  const indexOfFirstSite = indexOfLastSite - SITES_POR_PAGINA;
  const sitesAtuais = listaSites.slice(indexOfFirstSite, indexOfLastSite);
  const totalPaginas = Math.ceil(listaSites.length / SITES_POR_PAGINA);

  const renderConteudoModal = () => {
    if (carregandoSites) return <p className="text-center text-sm text-slate-500 py-8">Carregando seus projetos...</p>;
    if (listaSites.length === 0) return <div className="text-center py-16 text-slate-400 space-y-2"><p className="text-sm font-semibold">Nenhum site publicado ainda. Crie seu primeiro projeto!</p></div>;
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sitesAtuais.map((site) => {
            const linkUrl = `${window.location.origin}/${site.slug}`;
            return (
              <div key={site.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col hover:shadow-md transition">
                <h3 className="font-black text-sm text-slate-800 mb-2 truncate" title={site.titulo}>{site.titulo}</h3>
                <div className="flex bg-slate-50 border border-slate-200 rounded overflow-hidden mb-3">
                    <span className="bg-slate-200 text-slate-500 px-2 py-1.5 text-[10px] font-bold border-r border-slate-200 flex items-center"><i className="fas fa-link"></i></span>
                    <input type="text" readOnly value={linkUrl} className="bg-transparent text-[11px] w-full p-1.5 outline-none text-slate-600 font-mono" />
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <a href={`/${site.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold hover:underline flex items-center"><i className="fas fa-external-link-alt mr-1"></i> Abrir</a>
                  <div className="flex gap-2">
                    <button onClick={() => editarSite(site)} className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 transition">Editar</button>
                    <button onClick={() => deletarSite(site.id, site.slug)} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 transition"><i className="fas fa-trash-alt"></i></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-slate-100">
            <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-slate-50 shadow-sm transition"><i className="fas fa-chevron-left"></i></button>
            <span className="text-[11px] font-black text-slate-500 tracking-wider">PÁGINA {paginaAtual} DE {totalPaginas}</span>
            <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-slate-50 shadow-sm transition"><i className="fas fa-chevron-right"></i></button>
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
        .drop-zone { border: 2px dashed #cbd5e1; border-radius: .75rem; background: #f8fafc; cursor: pointer; text-align: center; transition: all 0.2s ease; }
        .drop-zone:hover { border-color: #60a5fa; background: #eff6ff; }
        #previewFrame, #codigoContainer { display: none; }
        #previewFrame.active, #codigoContainer.active { display: block; }
        #loadingOverlay { position: fixed; inset:0; background: rgba(15,23,42,0.95); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        #loadingSpinner { border: 4px solid rgba(79,70,229,0.2); border-top: 4px solid #4f46e5; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin-bottom: 2rem; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
      `}} />

      <div id="loadingOverlay" style={{ display: 'none' }}><div id="loadingSpinner"></div><p id="loadingText" className="text-white font-bold tracking-wide text-lg mt-4"></p></div>

      <div className="w-full md:w-[420px] bg-white shadow-[4px_0_24px_rgba(0,0,0,0.04)] flex flex-col h-full border-r border-slate-200 z-10">
          <div className="p-5 border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3 shadow-md shadow-indigo-200">
                          <i className="fas fa-layer-group text-white text-sm"></i>
                      </div>
                      Builder<span className="text-indigo-600">Pro</span>
                  </h1>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button id="btnTabVisual" onClick={() => (window as any).mudarModoApp('visual')} className="flex-1 py-1.5 text-xs font-bold rounded bg-white shadow-sm text-indigo-700 transition">Visão & Clonagem</button>
                  <button id="btnTabCopy" onClick={() => (window as any).mudarModoApp('copy')} className="flex-1 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-700 transition">Gerar via Texto</button>
              </div>
          </div>

          <div className="overflow-y-auto p-5 flex-grow custom-scrollbar flex flex-col bg-slate-50/50">
              
              <button onClick={toggleModoEdicao} className={`w-full py-3.5 px-4 rounded-xl text-sm font-black shadow-sm flex items-center justify-center mb-5 transition-all duration-300 ${modoEdicaoVisual ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[0.98]' : 'bg-white border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'}`}>
                  <i className={`fas ${modoEdicaoVisual ? 'fa-check-circle text-green-400' : 'fa-mouse-pointer'} mr-2 text-lg`}></i> 
                  {modoEdicaoVisual ? 'Edição Mágica Ativada!' : 'Ativar Edição Visual por Clique'}
              </button>

              <div id="containerModoVisual" className="flex-1 flex flex-col">
                  {modoEdicaoVisual ? (
                      <div className="bg-white border-2 border-indigo-500 rounded-xl p-5 shadow-lg shadow-indigo-100 relative animate-[fadeIn_0.3s_ease]">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">Painel do Elemento</div>
                          
                          {!elementoSelecionado ? (
                              <div className="text-center py-10 text-slate-400">
                                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                                      <i className="fas fa-crosshairs text-2xl text-indigo-400"></i>
                                  </div>
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Selecione um elemento<br/>no site ao lado</p>
                              </div>
                          ) : (
                              <div className="space-y-4 pt-3">
                                  <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
                                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-mono font-black uppercase"><i className="fas fa-code mr-1"></i> {elementoSelecionado.tagName}</span>
                                      <span className="text-[9px] text-slate-400 font-mono">ID: {elementoSelecionado.id.substring(0,8)}</span>
                                  </div>
                                  
                                  {/* RENDERIZAÇÃO CONDICIONAL: IMAGEM VS TEXTO/BLOCO */}
                                  {elementoSelecionado.tagName === 'img' ? (
                                      <>
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center"><i className="fas fa-link text-indigo-400 mr-1.5"></i> Link da Imagem</label>
                                              <input type="text" value={elementoSelecionado.src} onChange={(e) => atualizarElementoManual('src', e.target.value)} className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-500 outline-none" />
                                          </div>
                                          <div className="grid grid-cols-2 gap-3 pt-2">
                                              <div>
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-2"><i className="fas fa-crop-alt text-indigo-400 mr-1"></i> Formato</label>
                                                  <select onChange={(e) => atualizarElementoManual('imgFormat', e.target.value)} className="input-style bg-slate-50 p-2 text-xs">
                                                      <option value="">Livre</option>
                                                      <option value="aspect-video">Horizontal (16:9)</option>
                                                      <option value="aspect-[3/4]">Vertical (Retrato)</option>
                                                      <option value="aspect-square">Quadrado (1:1)</option>
                                                  </select>
                                              </div>
                                              <div>
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-2"><i className="fas fa-circle-notch text-indigo-400 mr-1"></i> Cantos</label>
                                                  <select onChange={(e) => atualizarElementoManual('imgRounded', e.target.value)} className="input-style bg-slate-50 p-2 text-xs">
                                                      <option value="rounded-none">Retos</option>
                                                      <option value="rounded-md">Suaves</option>
                                                      <option value="rounded-xl">Arredondados</option>
                                                      <option value="rounded-full">Círculo Perfeito</option>
                                                  </select>
                                              </div>
                                          </div>
                                          <div className="pt-2">
                                              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 p-2.5 rounded-lg hover:bg-slate-100 transition">
                                                  <input type="checkbox" onChange={(e) => atualizarElementoManual('imgBorder', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Adicionar Moldura Branca</span>
                                              </label>
                                          </div>
                                      </>
                                  ) : (
                                      <>
                                          {/* LINK DO BOTÃO / ÂNCORA */}
                                          {(elementoSelecionado.tagName === 'a' || elementoSelecionado.tagName === 'button') && (
                                              <div className="mb-4">
                                                  <label className="text-[10px] font-bold text-emerald-600 uppercase mb-1.5 flex items-center"><i className="fas fa-link mr-1.5"></i> Link / Destino do Botão</label>
                                                  <input type="text" placeholder="https://... ou #secao" value={elementoSelecionado.href} onChange={(e) => atualizarElementoManual('href', e.target.value)} className="w-full text-xs p-2.5 border border-emerald-200 rounded-lg bg-emerald-50 focus:border-emerald-500 outline-none font-mono" />
                                              </div>
                                          )}

                                          <div>
                                              <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase"><i className="fas fa-font text-indigo-400 mr-1.5"></i> Texto ou Conteúdo</label>
                                                <div className="flex bg-slate-100 rounded border border-slate-200">
                                                    <button onClick={() => atualizarElementoManual('textAlign', 'text-left')} className="p-1 px-2 hover:bg-slate-200 text-slate-600 transition" title="Alinhar Esquerda"><i className="fas fa-align-left text-[10px]"></i></button>
                                                    <button onClick={() => atualizarElementoManual('textAlign', 'text-center')} className="p-1 px-2 hover:bg-slate-200 text-slate-600 transition border-x border-slate-200" title="Centralizar"><i className="fas fa-align-center text-[10px]"></i></button>
                                                    <button onClick={() => atualizarElementoManual('textAlign', 'text-right')} className="p-1 px-2 hover:bg-slate-200 text-slate-600 transition" title="Alinhar Direita"><i className="fas fa-align-right text-[10px]"></i></button>
                                                </div>
                                              </div>
                                              <textarea rows={3} value={elementoSelecionado.text} onChange={(e) => atualizarElementoManual('text', e.target.value)} className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all resize-none shadow-inner"></textarea>
                                          </div>
                                          
                                          {/* TAMANHO E FUNDO */}
                                          <div className="grid grid-cols-2 gap-4">
                                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 flex items-center justify-between">
                                                      <span><i className="fas fa-text-height text-indigo-400 mr-1"></i> Tamanho</span>
                                                      <span className="text-indigo-600 font-black">{elementoSelecionado.fontSize}px</span>
                                                  </label>
                                                  <input type="range" min="10" max="100" value={elementoSelecionado.fontSize || 16} onChange={(e) => atualizarElementoManual('fontSize', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                              </div>
                                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 flex items-center"><i className="fas fa-fill-drip text-indigo-400 mr-1"></i> Fundo (Cor sólida)</label>
                                                  <input type="color" value={elementoSelecionado.bgColor} onChange={(e) => atualizarElementoManual('bgColor', e.target.value)} className="w-full h-7 rounded border border-slate-200 cursor-pointer p-0" />
                                              </div>
                                          </div>
                                          
                                          {/* FUNDO AVANÇADO (IMAGEM) E COR DA FONTE */}
                                          <div className="grid grid-cols-2 gap-4">
                                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 flex items-center"><i className="fas fa-image text-indigo-400 mr-1"></i> Imagem Fundo (URL)</label>
                                                  <input type="text" placeholder="https://..." value={elementoSelecionado.bgImage || ''} onChange={(e) => atualizarElementoManual('bgImage', e.target.value)} className="w-full text-[10px] p-1.5 border border-slate-200 rounded bg-white outline-none" />
                                              </div>
                                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                  <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 flex items-center"><i className="fas fa-paint-brush text-indigo-400 mr-1"></i> Cor da Fonte/Ícone</label>
                                                  <input type="color" value={elementoSelecionado.textColor} onChange={(e) => atualizarElementoManual('textColor', e.target.value)} className="w-full h-7 rounded border border-slate-200 cursor-pointer p-0" />
                                              </div>
                                          </div>

                                          {/* ANIMAÇÕES E EFEITOS ESPECIAIS */}
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center"><i className="fas fa-magic text-indigo-400 mr-1.5"></i> Efeito Animado Rápido</label>
                                              <select onChange={(e) => atualizarElementoManual('animationClass', e.target.value)} className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 outline-none font-medium">
                                                  <option value="">Nenhum / Remover Efeito</option>
                                                  <option value="animate-pulse">Pulsar Suavemente (Chamar atenção)</option>
                                                  <option value="animate-bounce">Pular Continuamente</option>
                                                  <option value="hover:scale-110 transition-transform duration-300">Crescer ao Passar o Mouse (Zoom)</option>
                                                  <option value="hover:-translate-y-2 transition-transform duration-300">Levantar ao Passar o Mouse</option>
                                              </select>
                                          </div>

                                          {/* DEGRADÊS E CLASSES EXTRAS */}
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center"><i className="fas fa-code text-indigo-400 mr-1.5"></i> Classes Tailwind Livres (Degradês, etc)</label>
                                              <input type="text" placeholder="Ex: bg-gradient-to-r from-blue-500 to-purple-500 opacity-90" value={elementoSelecionado.customClasses} onChange={(e) => atualizarElementoManual('customClasses', e.target.value)} className="w-full text-[10px] p-2 border border-slate-200 rounded-lg bg-slate-800 text-green-400 outline-none font-mono" />
                                          </div>
                                      </>
                                  )}

                                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mt-4">
                                      <label className="text-[10px] font-black text-indigo-800 uppercase mb-2 flex items-center gap-1.5"><i className="fas fa-robot text-base text-indigo-600"></i> Magia com IA</label>
                                      <p className="text-[9px] text-indigo-600 mb-2 leading-relaxed">
                                          {elementoSelecionado.tagName === 'img' 
                                            ? "Peça para a IA trocar a foto, focar em outra coisa ou mudar o formato." 
                                            : "Peça para reescrever com tom agressivo, amigável ou formatar."}
                                      </p>
                                      <div className="flex gap-2">
                                          <input type="text" id="ai_prompt_element" placeholder="Ex: Reescreva com senso de urgência..." className="input-style flex-1 border-white bg-white text-xs shadow-sm" />
                                          <button onClick={refinarElementoComIA} className="bg-indigo-600 hover:bg-indigo-700 text-white w-10 rounded-lg shadow-md flex items-center justify-center transition-colors"><i className="fas fa-paper-plane"></i></button>
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <details className="group bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden" open>
                              <summary className="font-black text-xs text-slate-700 uppercase tracking-wide cursor-pointer px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
                                  <span className="flex items-center gap-2"><i className="fas fa-paint-roller text-blue-500 text-base"></i> 1. Estilo & Cores</span>
                                  <span className="transition-transform duration-300 group-open:rotate-180 text-slate-400"><i className="fas fa-chevron-down"></i></span>
                              </summary>
                              <div className="p-4 space-y-3">
                                  <div>
                                      <label htmlFor="nichoEstilo" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Estilo Visual do Design:</label>
                                      <div className="relative">
                                          <i className="fas fa-swatchbook absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                          <select id="nichoEstilo" className="input-style pl-9 bg-slate-50">
                                              <option value="nenhum">⚪ Padrão Limpo (Automático)</option>
                                              <option value="minimalista">🍏 Minimalista (Estilo Apple)</option>
                                              <option value="premium">💎 Infoproduto Premium (Elegante)</option>
                                              <option value="agressivo">⚡ Lançamento / Alta Conversão</option>
                                              <option value="feminino">✨ Nicho Feminino (Suave & Luxo)</option>
                                              <option value="consultor">💼 Mentor / Consultor (Autoridade)</option>
                                              <option value="terapia">🌿 Saúde / Terapia (Acolhedor)</option>
                                              <option value="corporativo">🏢 Corporativo Institucional B2B</option>
                                          </select>
                                      </div>
                                  </div>

                                  <div>
                                      <label htmlFor="paletaCores" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Paleta de Cores Mestra:</label>
                                      <div className="relative">
                                          <i className="fas fa-palette absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                          <select id="paletaCores" value={corSelecionada} onChange={(e) => setCorSelecionada(e.target.value)} className="input-style pl-9 bg-slate-50">
                                              <option value="auto">🎨 Extrair Cores da Imagem (Clone)</option>
                                              <option value="dark">⚫ Dark Mode (Preto & Neon/Dourado)</option>
                                              <option value="azul">🔵 Azul Profundo (Confiança)</option>
                                              <option value="verde">🟢 Verde Esmeralda (Crescimento)</option>
                                              <option value="terracota">🟠 Terracota & Nude (Elegância)</option>
                                              <option value="roxo">🟣 Roxo Real (Inovação/Luxo)</option>
                                              <option value="rosa">🌸 Rosa Pastel (Suavidade)</option>
                                              <option value="vermelho">🔴 Vermelho Rubi (Urgência)</option>
                                              <option value="cinza">⚪ Cinza & Prata (Tecnologia)</option>
                                              <option value="amarelo">🟡 Amarelo Solar (Energia)</option>
                                              <option value="personalizada">🖌️ Personalizada Manualmente...</option>
                                          </select>
                                      </div>
                                      
                                      {corSelecionada === 'personalizada' && (
                                          <div className="flex gap-3 mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100 animate-[fadeIn_0.2s_ease]">
                                              <div className="flex-1">
                                                  <label className="text-[9px] block mb-1 font-black text-indigo-800 uppercase">Fundo Site</label>
                                                  <input type="color" id="corFundo" className="w-full h-8 rounded border border-indigo-200 p-0 cursor-pointer shadow-sm" defaultValue="#ffffff" />
                                              </div>
                                              <div className="flex-1">
                                                  <label className="text-[9px] block mb-1 font-black text-indigo-800 uppercase">Botões/Destaque</label>
                                                  <input type="color" id="corPrimaria" className="w-full h-8 rounded border border-indigo-200 p-0 cursor-pointer shadow-sm" defaultValue="#2563eb" />
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </details>

                          <details className="group bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                              <summary className="font-black text-xs text-slate-700 uppercase tracking-wide cursor-pointer px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
                                  <span className="flex items-center gap-2"><i className="fas fa-cubes text-emerald-500 text-base"></i> 2. Estrutura & Efeitos</span>
                                  <span className="transition-transform duration-300 group-open:rotate-180 text-slate-400"><i className="fas fa-chevron-down"></i></span>
                              </summary>
                              <div className="p-4 space-y-3">
                                  <div>
                                      <label htmlFor="heroLayout" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Formato da 1ª Tela (Hero):</label>
                                      <select id="heroLayout" className="input-style bg-slate-50">
                                          <option value="auto">🤖 Seguir Imagem / Decisão da IA</option>
                                          <option value="center">📝 Centralizado (Foco total no Texto)</option>
                                          <option value="split">🖼️ Dividido (Texto Esquerda, Imagem Direita)</option>
                                      </select>
                                  </div>
                                  
                                  <div>
                                      <label htmlFor="dinamicaSite" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Animações (Scroll Reveal):</label>
                                      <select id="dinamicaSite" className="input-style bg-slate-50">
                                          <option value="estatico">🧊 Estático (Carregamento Ultrarrápido)</option>
                                          <option value="suave">🌬️ Suave (Aparece ao rolar a página)</option>
                                          <option value="impacto">🔥 Máximo Impacto (Saltos e Efeitos 3D)</option>
                                      </select>
                                  </div>

                                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-2">
                                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                          <input type="checkbox" id="checkComMenu" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-emerald-500 transition-all duration-200" />
                                          <label htmlFor="checkComMenu" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"></label>
                                      </div>
                                      <label htmlFor="checkComMenu" className="text-xs font-bold text-slate-700 cursor-pointer">Criar Menu de Navegação</label>
                                      <style dangerouslySetInnerHTML={{__html:`.toggle-checkbox:checked { right: 0; border-color: #10b981; } .toggle-checkbox:checked + .toggle-label { background-color: #a7f3d0; }`}} />
                                  </div>
                              </div>
                          </details>

                          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-md relative overflow-hidden mt-6">
                              <div className="absolute top-0 left-0 w-1 bg-blue-600 h-full"></div>
                              <h3 className="font-black text-xs text-blue-800 uppercase tracking-wider mb-3 flex items-center"><i className="fas fa-crop-alt text-blue-600 mr-2 text-lg"></i>Clonar Interface (Imagem)</h3>
                              
                              <div className="drop-zone py-6 border-dashed border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-colors rounded-xl flex flex-col items-center justify-center gap-2" onClick={() => document.getElementById('imageUploadInput')?.click()}>
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500 mb-1">
                                      <i className="fas fa-cloud-upload-alt text-2xl"></i>
                                  </div>
                                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Cole a Foto Aqui <span className="text-[9px] text-slate-400 block mt-1">(Ctrl+V) ou Clique</span></p>
                              </div>
                              <input type="file" id="imageUploadInput" multiple accept="image/*" className="hidden" onChange={handleImageUploadInput} />
                              
                              {uploadedImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-4">
                                  {uploadedImages.map((imgObj, idx) => (
                                    <div key={idx} className="relative h-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                                      <img src={`data:${imgObj.mimeType};base64,${imgObj.data}`} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <button className="text-white hover:text-red-400" onClick={() => removerImagem(idx)}><i className="fas fa-trash-alt"></i></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <button onClick={() => (window as any).executarGeracaoSite(uploadedImages)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-blue-200 mt-4 transition-all hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 uppercase tracking-wide">
                                  <i className="fas fa-bolt text-yellow-300"></i> Construir Site
                              </button>
                          </div>
                      </div>
                  )}
              </div>

              <div id="containerModoCopy" style={{ display: 'none' }} className="flex-1 flex flex-col">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex-1 flex flex-col shadow-sm relative">
                      <div className="absolute top-0 left-0 w-1 bg-indigo-600 h-full rounded-l-xl"></div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 flex items-center"><i className="fas fa-keyboard text-indigo-500 mr-2 text-lg"></i>A Copy de Vendas</label>
                      <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Cole o texto completo ou dê as instruções para a IA criar tudo do zero. As regras de estilo e cor da aba "Clonar & Visual" também se aplicam aqui!</p>
                      
                      <textarea id="productContent" className="w-full border border-slate-200 rounded-xl resize-none flex-1 mb-4 bg-slate-50 focus:bg-white text-sm p-4 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all custom-scrollbar" placeholder="Ex: Crie uma landing page de alta conversão para meu curso de inglês..."></textarea>
                      
                      <button onClick={() => (window as any).gerarSiteComCopy()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wide py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2">
                          <i className="fas fa-pen-nib"></i> Gerar Landing Page
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div className="flex-grow flex flex-col bg-slate-200 relative">
          <div className="bg-white border-b border-gray-200 flex justify-between items-center px-6 h-16 shadow-sm z-10">
              <div className="flex h-full items-center gap-5">
                  <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 h-10">
                      <button id="tabPreview" onClick={() => (window as any).mudarSeparador('preview')} className="px-5 rounded font-black text-xs tracking-wide bg-white text-blue-600 shadow-sm border border-slate-200 flex items-center transition">🖥️ Visualização</button>
                      <button id="tabCode" onClick={() => (window as any).mudarSeparador('code')} className="px-5 rounded font-bold text-xs tracking-wide text-slate-500 hover:text-slate-700 flex items-center transition">💻 Código Fonte</button>
                  </div>
                  
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  
                  <button onClick={desfazerCodigo} className="bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold py-2 px-4 rounded-lg border border-slate-200 shadow-sm transition flex items-center gap-2" title="Desfazer">
                    <i className="fas fa-undo"></i> Desfazer
                  </button>
                  
                  <div className="flex items-center ml-2 border border-emerald-200 bg-emerald-50 rounded-lg px-4 py-2 shadow-sm">
                      <i className="fas fa-microchip animate-pulse text-emerald-500 mr-2 text-lg"></i> 
                      <span className="text-[10px] font-black text-emerald-800 tracking-wider uppercase">Motor: {statusApis.texto}</span>
                  </div>
              </div>

              <div className="flex items-center gap-3">
                  <button onClick={carregarMeusSites} className="bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-sm transition flex items-center"><i className="fas fa-th-large mr-2"></i> Meus Projetos</button>
                  
                  {siteEditando ? (
                      <>
                          <button onClick={() => setSiteEditando(null)} className="bg-slate-200 text-slate-700 text-[11px] font-bold py-2.5 px-4 rounded-lg hover:bg-slate-300 transition">Cancelar Edição</button>
                          <button onClick={() => (window as any).handlePublicarSite()} className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2.5 px-5 rounded-lg shadow-sm transition flex items-center"><i className="fas fa-save mr-2"></i> Salvar Projeto</button>
                      </>
                  ) : (
                      <button onClick={() => (window as any).handlePublicarSite()} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2.5 px-5 rounded-lg shadow-sm shadow-emerald-200 transition flex items-center uppercase tracking-wide"><i className="fas fa-globe mr-2"></i> Publicar Online</button>
                  )}

                  <div className="w-px h-6 bg-slate-200 mx-1"></div>

                  <button onClick={() => (window as any).baixarHtmlGerado()} className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 text-[11px] font-bold py-2.5 px-4 rounded-lg shadow-sm transition flex items-center gap-2" title="Baixar Arquivo HTML">
                      <i className="fas fa-download"></i> Baixar HTML
                  </button>
                  <button onClick={() => (window as any).copiarCodigo()} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-bold py-2.5 px-3 rounded-lg shadow-sm transition flex items-center" title="Copiar Código"><i className="fas fa-copy"></i></button>
              </div>
          </div>
          
          <div className="flex-grow relative bg-slate-800">
              {modoEdicaoVisual && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-8 py-3 rounded-full shadow-2xl shadow-indigo-500/50 font-black text-xs uppercase tracking-widest animate-bounce flex items-center gap-3 border-[3px] border-indigo-400">
                      <i className="fas fa-magic text-yellow-300 text-lg"></i> Clique no site abaixo para editar!
                  </div>
              )}
              <iframe id="previewFrame" className="w-full h-full active border-none bg-white shadow-inner" sandbox="allow-scripts allow-same-origin" title="Preview"></iframe>
              <div id="codigoContainer" className="w-full h-full bg-[#0d1117] p-6">
                  <textarea id="codigoGerado" className="w-full h-full font-mono text-sm bg-[#0d1117] text-[#56d364] border-none outline-none resize-none custom-scrollbar rounded-xl p-4 leading-relaxed"></textarea>
              </div>
          </div>
      </div>
      
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