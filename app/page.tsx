'use client';

import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

// ESCUDO DE CLIQUE ABSOLUTO
const SCRIPT_PREVIEW = `<script>
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (link) {
            var href = link.getAttribute('href') || '';
            // Se for um link âncora (#) longo o suficiente, permite o scroll suave da página
            if (href.startsWith('#') && href.length > 1) {
                return;
            }
            // Bloqueio absoluto para qualquer outro link
            e.preventDefault();
            e.stopPropagation();
            console.log('Navegação bloqueada pelo Modo Preview.');
        }
    }, true); 
    document.addEventListener('submit', function(e) { e.preventDefault(); e.stopPropagation(); }, true);
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

  const [statusApis, setStatusApis] = useState<{ texto: string; imagem: string }>({ 
    texto: 'Aguardando geração...', 
    imagem: 'Aguardando...' 
  });

  const [apiUsage, setApiUsage] = useState({ chave1: 0, chave2: 0, chave3: 0 });

  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/login'; }
    };
    verificarSessao();

    const interval = setInterval(() => {
        setApiUsage({ chave1: 0, chave2: 0, chave3: 0 });
    }, 60000);
    return () => clearInterval(interval);
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
    if (previewFrameEl) previewFrameEl.srcdoc = site.html_content + SCRIPT_PREVIEW; 
    if ((window as any).mapearElementosGerados) (window as any).mapearElementosGerados(site.html_content, false);
    if ((window as any).mudarSeparador) (window as any).mudarSeparador('preview');
    
    setSiteEditando({ id: site.id, slug: site.slug, titulo: site.titulo });
    setModalMeusSitesAberto(false);
    (window as any).showNotification(`Modo de Edição ativado: ${site.titulo}`, 'success');
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64Data = e.target.result.split(',')[1];
      setUploadedImages(prev => [...prev, { mimeType: file.type, data: base64Data }]);
    };
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
        if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) processFile(file);
        }
      }
    };

    document.body.addEventListener('paste', handlePaste);
    return () => document.body.removeEventListener('paste', handlePaste);
  }, []);

  useEffect(() => {
    const domParser = new DOMParser();

    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());

    (window as any).mudarModoApp = (modo: string) => {
      const btnV = document.getElementById('btnTabVisual'), btnC = document.getElementById('btnTabCopy');
      const contV = document.getElementById('containerModoVisual'), contC = document.getElementById('containerModoCopy');
      if (!btnV || !btnC || !contV || !contC) return;

      if (modo === 'visual') {
        btnV.className = "flex-1 py-1.5 text-xs font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50 transition-colors";
        btnC.className = "flex-1 py-1.5 text-xs font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors";
        contV.style.display = 'block'; contC.style.display = 'none';
      } else {
        btnC.className = "flex-1 py-1.5 text-xs font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50 transition-colors";
        btnV.className = "flex-1 py-1.5 text-xs font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors";
        contC.style.display = 'block'; contV.style.display = 'none';
      }
    };

    async function chamarIA(systemInstructionText: string, promptParts: any[], isRefinement = false) {
      const loadOverlay = document.getElementById('loadingOverlay');
      const textElement = document.getElementById('loadingText');
      let loadingInterval: any;

      if (loadOverlay) {
          loadOverlay.style.display = 'flex';

          const badgeApis = document.getElementById('badge-apis');
          if (badgeApis) {
              badgeApis.classList.remove('bg-indigo-50', 'border-indigo-200');
              badgeApis.classList.add('bg-amber-100', 'border-amber-300', 'animate-pulse');
          }
          setStatusApis({ texto: 'Testando chaves...', imagem: 'Consultando bancos...' });

          const mensagens = [
              "Analisando referência visual...",
              "Acessando Motor Google Gemini...",
              "Ajustando Imagens e Textos de Compliance...",
              "Aplicando blocos Tailwind CSS...",
              "Injetando Scripts de Animação e Rodapé..."
          ];
          let msgIndex = 0;
          if (textElement) textElement.innerText = mensagens[0];
          loadingInterval = setInterval(() => {
              msgIndex = (msgIndex + 1) % mensagens.length;
              if (textElement) textElement.innerText = mensagens[msgIndex];
          }, 2500); 
      }

      const imageStyle = (document.getElementById('estiloImagem') as HTMLSelectElement)?.value || 'real';
      const dinamicaStyle = (document.getElementById('dinamicaSite') as HTMLSelectElement)?.value || 'estatico';

      try {
        const response = await fetch('/api/gerar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              systemInstruction: systemInstructionText, 
              promptParts: promptParts, 
              imageStyle: imageStyle,
              dinamica: dinamicaStyle
          })
        });
        const data = await response.json();
        
        if (!data.success) {
            if (data.error === 'RATE_LIMIT_EXCEEDED') {
                throw new Error("LIMIT_MODAL");
            }
            throw new Error(data.error);
        }

        if (data.provedorTexto) {
            if (data.provedorTexto.includes('Chave 1')) {
                setApiUsage(prev => ({...prev, chave1: prev.chave1 + 1}));
            } else if (data.provedorTexto.includes('Chave 2')) {
                setApiUsage(prev => ({...prev, chave1: 15, chave2: prev.chave2 + 1})); 
            } else if (data.provedorTexto.includes('Chave 3')) {
                setApiUsage(prev => ({...prev, chave1: 15, chave2: 15, chave3: prev.chave3 + 1}));
            }
        }

        const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
        const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
        
        if (codEl) {
          if (codEl.value) {
            setHistoricoCodigo(prev => [...prev, codEl.value]);
          }
          codEl.value = data.html; 
        }
        if (prevEl) prevEl.srcdoc = data.html + SCRIPT_PREVIEW; 
        
        if (!isRefinement && (window as any).mapearElementosGerados) (window as any).mapearElementosGerados(data.html, true);
        
        if (data.provedorTexto && data.provedorImagem) {
            setStatusApis({ texto: data.provedorTexto, imagem: data.provedorImagem });
            (window as any).showNotification(`Concluído via ${data.provedorTexto}!`, 'success');
        } else {
            (window as any).showNotification('Sucesso!', 'success');
        }
        
        if ((window as any).mudarSeparador) (window as any).mudarSeparador('preview');
      } catch (err: any) {
        if (err.message === "LIMIT_MODAL") {
            (window as any).showNotification("As suas chaves atingiram a cota máxima! Aguarde exatamente 1 minuto para o Google liberar mais saldo.", "limit");
        } else {
            (window as any).showNotification(err.message, 'error');
        }
        setStatusApis({ texto: 'Falha na geração', imagem: 'Erro' });
      } finally {
        if (loadingInterval) clearInterval(loadingInterval);
        if (loadOverlay) loadOverlay.style.display = 'none';
        
        const badgeApis = document.getElementById('badge-apis');
        if (badgeApis) {
            badgeApis.classList.remove('animate-pulse', 'bg-amber-100', 'border-amber-300');
            badgeApis.classList.add('bg-emerald-50', 'border-emerald-300', 'shadow-sm');
            setTimeout(() => {
                badgeApis.classList.remove('bg-emerald-50', 'border-emerald-300', 'shadow-sm');
                badgeApis.classList.add('bg-indigo-50', 'border-indigo-200'); 
            }, 3000);
        }
      }
    }

    const getMegaPromptEstilo = () => {
      const estilo = (document.getElementById('nichoEstilo') as HTMLSelectElement)?.value || 'nenhum';
      if (estilo === 'nenhum') return "Crie um design profissional e equilibrado, respeitando estritamente o layout enviado.";
      if (estilo === 'premium') return "DIRETRIZ VISUAL: Design sofisticado (Premium). Tipografia serifada elegante (ex: Playfair Display).";
      if (estilo === 'terapia') return "DIRETRIZ VISUAL: Layout minimalista, calmo e autoritário. Espaço em branco e bordas arredondadas.";
      if (estilo === 'agressivo') return "DIRETRIZ VISUAL: Altíssima conversão, Dark Mode agressivo com textos claros e blocos de impacto.";
      if (estilo === 'corporativo') return "DIRETRIZ VISUAL: Corporativo e limpo. Tipografia moderna e elementos rígidos.";
      if (estilo === 'consultor') return "DIRETRIZ VISUAL: Elegante e focado em autoridade pessoal. Tipografia marcante.";
      if (estilo === 'feminino') return "DIRETRIZ VISUAL: Sofisticado, suave e luxuoso. Fontes delicadas e imagens iluminadas.";
      return "";
    };

    const getMegaPromptHero = () => {
      const hero = (document.getElementById('heroLayout') as HTMLSelectElement)?.value || 'auto';
      if (hero === 'center') return "ESTRUTURA DO HERO: OBRIGATORIAMENTE Centralizado. Headline e Botão perfeitamente centralizados (text-center).";
      if (hero === 'split') return "ESTRUTURA DO HERO: OBRIGATORIAMENTE Dividido (Side-by-side). Texto de um lado, imagem do outro.";
      return "ESTRUTURA DO HERO: Respeite a estrutura exata que estiver na imagem de referência.";
    };

    const getMegaPromptCores = () => {
      const cor = (document.getElementById('paletaCores') as HTMLSelectElement)?.value || 'auto';
      if (cor === 'auto') return "PALETA DE CORES: Analise a imagem anexada como um scanner. VOCÊ DEVE OBRIGATORIAMENTE CLONAR AS CORES DE FUNDO. Se a foto for escura, use bg-slate-900. Se a foto for clara, use fundo claro.";
      if (cor === 'personalizada') {
         const cp = (document.getElementById('corPrimaria') as HTMLInputElement)?.value || '#2563eb';
         const cf = (document.getElementById('corFundo') as HTMLInputElement)?.value || '#ffffff';
         const cd = (document.getElementById('corDestaque') as HTMLInputElement)?.value || '#10b981';
         return `OVERRIDE - PALETA PERSONALIZADA: Ignore a imagem original e aplique ESTAS cores HEX: Fundo: ${cf}, Principal: ${cp}, Destaque: ${cd}.`;
      }
      if (cor === 'azul') return "PALETA: Azul Meia-Noite como cor principal, fundo correspondente e botões em destaque.";
      if (cor === 'verde') return "PALETA: Verde Esmeralda/Musgo como cor principal.";
      if (cor === 'terracota') return "PALETA: Terracota, Nude e Areia.";
      if (cor === 'roxo') return "PALETA: Roxo Real ou Violeta Escuro.";
      if (cor === 'dark') return "PALETA: Fundo Preto ou Cinza muito escuro (Dark Mode obrigatório). Botões em Dourado ou cor vibrante.";
      if (cor === 'cinza') return "PALETA: Escala de cinza e grafite.";
      if (cor === 'vermelho') return "PALETA: Vermelho Rubi e Bordô.";
      if (cor === 'amarelo') return "PALETA: Amarelo Solar e Preto (Dark Mode com amarelo).";
      if (cor === 'rosa') return "PALETA: Rosa Pastel e Magenta.";
      return "";
    };

    (window as any).executarGeracaoSite = (imagesList: any[]) => {
      if (imagesList.length === 0) { 
        (window as any).showNotification('Anexe referências visuais.', 'error'); 
        return; 
      }
      const isMenuChecked = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked;
      const diretrizMenu = isMenuChecked ? "CRIE OBRIGATORIAMENTE UM MENU SUPERIOR NAVEGÁVEL COM LINKS ÂNCORA." : "NÃO CRIE MENU SUPERIOR. PÁGINA DIRETA SEM NAVEGAÇÃO NO TOPO.";
      const modo = (document.getElementById('modoClonagem') as HTMLSelectElement)?.value || 'exato';
      const diretrizModo = modo === 'exato' ? "MODO DE ENGENHARIA REVERSA (PIXEL PERFECT): Reconstrua o layout da imagem com 100% de fidelidade visual. Copie a estrutura, o alinhamento e a ordem das seções." : "MODO MODELAGEM: Inspire-se no design da imagem, mas otimize estruturalmente para alta conversão.";
      
      const systemInstruction = `Especialista Sênior Front-end em Tailwind CSS. MODO: ${diretrizModo}. ${diretrizMenu}. \n${getMegaPromptEstilo()} \n${getMegaPromptHero()} \n${getMegaPromptCores()}`;
      
      let promptParts: any[] = [{ text: "ATENÇÃO MÁXIMA: Faça a engenharia reversa da imagem abaixo. Extraia as CORES REAIS EXATAS (fundo, botões, textos), transcreva os textos originais sem resumir e recrie o layout perfeitamente." }];
      imagesList.forEach(img => promptParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } }));
      chamarIA(systemInstruction, promptParts, false);
    };

    (window as any).gerarSiteComCopy = () => {
      const content = (document.getElementById('productContent') as HTMLTextAreaElement)?.value.trim();
      if (!content) { (window as any).showNotification('Insira conteúdo ou comando.', 'error'); return; }
      const isMenuChecked = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked;
      const diretrizMenu = isMenuChecked ? "CRIE OBRIGATORIAMENTE UM MENU SUPERIOR NAVEGÁVEL COM LINKS ÂNCORA." : "NÃO CRIE MENU SUPERIOR. PÁGINA DIRETA SEM NAVEGAÇÃO NO TOPO.";
      const systemInstruction = `Copywriter de Elite e Especialista Tailwind CSS. \n${diretrizMenu}. \n${getMegaPromptEstilo()} \n${getMegaPromptHero()} \n${getMegaPromptCores()}`;
      chamarIA(systemInstruction, [{ text: "Gere a Landing Page a partir deste conteúdo/comando:\n" + content }], false);
    };

    (window as any).refinarSiteEstrito = () => {
      const prompt = (document.getElementById('promptRefinamento') as HTMLTextAreaElement)?.value.trim();
      const codigo = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      
      if (!codigo) {
        (window as any).showNotification('Não há código ativo. Gere ou edite um site primeiro.', 'error');
        return;
      }

      const isMenuChecked = (document.getElementById('checkComMenu') as HTMLInputElement)?.checked;
      const diretrizMenu = isMenuChecked ? "CRIE OBRIGATORIAMENTE UM MENU SUPERIOR NAVEGÁVEL COM LINKS ÂNCORA. Lembre-se de colocar ID nas seções para o scroll." : "REMOVA O MENU SUPERIOR SE ELE EXISTIR NO CÓDIGO.";

      const systemInstruction = `PROGRAMADOR DE MANUTENÇÃO ESTRITA.
DIRETRIZ CIRÚRGICA: Você vai receber o código HTML de uma Landing Page e um pedido de alteração do usuário. VOCÊ É ESTRITAMENTE PROIBIDO DE REESCREVER A PÁGINA INTEIRA DO ZERO OU EXCLUIR O CONTEÚDO ORIGINAL.
1. Se o usuário pedir para "remover o fundo", ou "mudar botão", REMOVA/MUDE APENAS ISSO. MANTENHA todas as imagens originais da página (tags img), os textos originais, as cores não mencionadas e a estrutura.
2. PRESERVE A TODO CUSTO todas as tags <script> originais do arquivo e todos os blocos de Informações Legais/Rodapé.
3. Aplique as diretrizes:
${diretrizMenu}
${getMegaPromptEstilo()}
${getMegaPromptHero()}
${getMegaPromptCores()}`;

      const textoPedidoExtra = prompt ? `COMANDO CIRÚRGICO DO USUÁRIO:\n"${prompt}"\n(Cumpra a risca apenas isso e devolva o resto do HTML intacto)` : "Apenas atualize as opções do painel mantendo o conteúdo da copy intacto.";

      chamarIA(systemInstruction, [{text: `${textoPedidoExtra}\n\n=== CÓDIGO HTML ATUAL PARA SER MODIFICADO ===\n${codigo}`}], true);
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

    (window as any).gerarNovaImagem = async (index: number, palavraChave: string) => {
      const input = document.getElementById(`img_replace_${index}`) as HTMLInputElement;
      if (!input) return;

      const iconBtn = input.nextElementSibling?.querySelector('i');
      if (iconBtn) iconBtn.classList.add('fa-spin');

      try {
         const termo = palavraChave || 'professional';
         const res = await fetch(`/api/unsplash?q=${encodeURIComponent(termo)}`);
         const data = await res.json();

         input.value = data.url; 
         (window as any).aplicarNovosElementos();
         (window as any).showNotification('Imagem carregada!', 'success');
      } catch (e) {
         (window as any).showNotification('Erro ao buscar imagem.', 'error');
      } finally {
         if (iconBtn) iconBtn.classList.remove('fa-spin');
      }
    };

    (window as any).mapearElementosGerados = (html: string, isFromAI = false) => {
      const doc = domParser.parseFromString(html, 'text/html');
      const images = doc.querySelectorAll('img');
      const links = Array.from(doc.querySelectorAll('a')).filter(a => a.hasAttribute('href') && !a.getAttribute('href')!.startsWith('javascript:'));
      
      const card = document.getElementById('elementManagerCard'), imgContainer = document.getElementById('imageInputsContainer'), linkContainer = document.getElementById('linkInputsContainer');
      if (!card || !imgContainer || !linkContainer) return;
      imgContainer.innerHTML = ''; linkContainer.innerHTML = '';
      
      let temImagens = false, temLinks = false;
      let htmlModificado = false; 
      let indexCount = 0;

      if (images.length > 0) {
        temImagens = true; document.getElementById('imageSection')!.style.display = 'block';
        images.forEach((img) => {
          let label = img.id || img.alt || `Imagem ${indexCount + 1}`;
          let currentScale = img.getAttribute('data-scale'); 
          
          if (isFromAI) {
              currentScale = '100';
              img.setAttribute('data-scale', '100');
              img.style.width = ''; 
              img.style.height = ''; 
              img.style.objectFit = '';
              htmlModificado = true; 
          } else if (!currentScale) {
              currentScale = '100'; 
              img.setAttribute('data-scale', '100');
              htmlModificado = true;
          }

          let imagemSrc = img.src;
          if (imagemSrc.includes(window.location.origin + '/[')) {
              imagemSrc = imagemSrc.substring(imagemSrc.indexOf('[') + 1, imagemSrc.indexOf(']'));
              img.src = imagemSrc;
              htmlModificado = true;
          }

          const div = document.createElement('div');
          div.innerHTML = `
            <label class="text-[9px] font-bold text-gray-500 uppercase flex justify-between items-center mb-0.5">
                <span class="truncate pr-2">${label}</span>
                <span class="bg-gray-200 text-gray-600 px-1 py-0.5 rounded text-[8px]">${img.width || '?'}x${img.height || '?'}</span>
            </label>
            <div class="flex gap-1.5 mb-1">
                <input type="text" id="img_replace_${indexCount}" class="input-style flex-1 text-[10px]" value="${imagemSrc}" placeholder="URL">
                <button onclick="window.gerarNovaImagem(${indexCount}, '${label.replace(/'/g, "\\'")}')" class="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-[10px] font-bold px-2 py-1 rounded flex items-center justify-center border border-indigo-200 transition" title="Nova foto">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <label class="bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold cursor-pointer px-2 py-1 rounded flex items-center justify-center border border-blue-200 transition" title="Upload">
                    <i class="fas fa-upload"></i>
                    <input type="file" accept="image/*" class="hidden" onchange="window.handleElementImageUpload(event, ${indexCount})">
                </label>
            </div>
            <div class="flex items-center gap-2 mt-1.5 bg-slate-50 p-1 rounded border border-slate-200 mb-3">
                <span class="text-[9px] font-bold text-slate-500 w-10">Tam:</span>
                <input type="range" id="img_scale_${indexCount}" min="10" max="200" value="${currentScale}" class="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer" oninput="document.getElementById('img_scale_val_${indexCount}').innerText = this.value + '%'; window.aplicarNovosElementos()">
                <span id="img_scale_val_${indexCount}" class="text-[9px] font-mono text-blue-700 font-bold w-6 text-right">${currentScale}%</span>
            </div>
          `;
          imgContainer.appendChild(div);
          indexCount++;
        });
      }

      const todosElementos = doc.querySelectorAll('*');
      todosElementos.forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style && htmlEl.style.backgroundImage && htmlEl.style.backgroundImage.includes('url(')) {
              const match = htmlEl.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
              if (match && match[1]) {
                  let bgUrl = match[1];
                  
                  if (bgUrl.includes(window.location.origin + '/[')) {
                      bgUrl = bgUrl.substring(bgUrl.indexOf('[') + 1, bgUrl.indexOf(']'));
                      htmlEl.style.backgroundImage = `url('${bgUrl}')`;
                      htmlModificado = true;
                  }

                  let label = htmlEl.id || `Background ${indexCount + 1}`;
                  
                  const div = document.createElement('div');
                  div.innerHTML = `
                    <label class="text-[9px] font-bold text-emerald-600 uppercase flex justify-between items-center mb-0.5 mt-2">
                        <span class="truncate pr-2"><i class="fas fa-layer-group mr-1"></i> ${label}</span>
                        <span class="bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded text-[8px]">BG</span>
                    </label>
                    <div class="flex gap-1.5 mb-3">
                        <input type="text" id="img_replace_${indexCount}" class="input-style border-emerald-200 focus:border-emerald-500 flex-1 text-[10px]" value="${bgUrl}" placeholder="URL">
                        <button onclick="window.gerarNovaImagem(${indexCount}, 'background wallpaper')" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded flex items-center justify-center border border-emerald-200 transition" title="Nova foto de fundo">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <label class="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer px-2 py-1 rounded flex items-center justify-center border border-emerald-700 transition" title="Upload">
                            <i class="fas fa-upload"></i>
                            <input type="file" accept="image/*" class="hidden" onchange="window.handleElementImageUpload(event, ${indexCount})">
                        </label>
                    </div>
                  `;
                  imgContainer.appendChild(div);
                  temImagens = true;
                  indexCount++;
              }
          }
      });

      if (!temImagens) { document.getElementById('imageSection')!.style.display = 'none'; }

      if (links.length > 0) {
        temLinks = true; document.getElementById('linkSection')!.style.display = 'block';
        links.forEach((a, index) => {
          let label = a.innerText.trim() || a.getAttribute('aria-label') || a.title || `Link ${index + 1}`;
          let isBuyButton = /comprar|adquirir|quero|checkout|garantir|acessar/i.test(label);
          let badgeCompra = isBuyButton ? `<span class="bg-green-100 text-green-700 px-1 py-0.5 rounded text-[8px] ml-2 border border-green-200 shadow-sm"><i class="fas fa-shopping-cart"></i></span>` : '';

          const div = document.createElement('div');
          div.innerHTML = `<label class="text-[9px] font-bold text-gray-500 uppercase mb-0.5 flex items-center truncate">${label} ${badgeCompra}</label>
                           <input type="text" id="link_replace_${index}" class="input-style text-[10px] mb-2" value="${a.getAttribute('href')}" placeholder="Cole seu link">`;
          linkContainer.appendChild(div);
        });
      } else { document.getElementById('linkSection')!.style.display = 'none'; }

      if (htmlModificado) {
         const novoHtml = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
         const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
         const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
         if (codEl) codEl.value = novoHtml;
         
         if (prevEl) {
             const scrollY = prevEl.contentWindow?.scrollY || 0;
             const scriptManterScroll = `<script>requestAnimationFrame(() => { window.scrollTo({top: ${scrollY}, behavior: 'instant'}); setTimeout(() => window.scrollTo({top: ${scrollY}, behavior: 'instant'}), 50); });</script>`;
             prevEl.srcdoc = novoHtml + SCRIPT_PREVIEW + scriptManterScroll; 
         }
      }

      card.style.display = (temImagens || temLinks) ? 'flex' : 'none';
    };

    (window as any).aplicarNovosElementos = () => {
      const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
      const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
      if (!codEl || !codEl.value) return;
      const doc = domParser.parseFromString(codEl.value, 'text/html');
      let alterou = false;
      let indexCount = 0;

      doc.querySelectorAll('img').forEach((img) => {
        const inpUrl = document.getElementById(`img_replace_${indexCount}`) as HTMLInputElement;
        const inpScale = document.getElementById(`img_scale_${indexCount}`) as HTMLInputElement;
        
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
        indexCount++;
      });

      doc.querySelectorAll('*').forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style && htmlEl.style.backgroundImage && htmlEl.style.backgroundImage.includes('url(')) {
              const inpUrl = document.getElementById(`img_replace_${indexCount}`) as HTMLInputElement;
              if (inpUrl && inpUrl.value) {
                  const currentMatch = htmlEl.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
                  if (currentMatch && currentMatch[1] !== inpUrl.value) {
                      htmlEl.style.backgroundImage = `url('${inpUrl.value}')`;
                      alterou = true;
                  }
              }
              indexCount++;
          }
      });

      Array.from(doc.querySelectorAll('a')).filter(a => a.hasAttribute('href') && !a.getAttribute('href')!.startsWith('javascript:')).forEach((a, i) => {
        const inp = document.getElementById(`link_replace_${i}`) as HTMLInputElement;
        if (inp && inp.value && inp.value !== a.getAttribute('href')) { a.setAttribute('href', inp.value); alterou = true; }
      });

      if (alterou) {
        const novo = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
        codEl.value = novo; 
        
        const scrollY = prevEl.contentWindow?.scrollY || 0;
        const scriptManterScroll = `<script>
            requestAnimationFrame(() => { 
                window.scrollTo({top: ${scrollY}, behavior: 'instant'}); 
                setTimeout(() => window.scrollTo({top: ${scrollY}, behavior: 'instant'}), 50); 
            });
        </script>`;
        
        prevEl.srcdoc = novo + SCRIPT_PREVIEW + scriptManterScroll; 
      }
    };

    (window as any).dispararAtualizacao = () => {
      (window as any).aplicarNovosElementos();
      (window as any).showNotification('Elementos atualizados no painel visual!', 'success');
    };

    (window as any).baixarHtmlGerado = () => {
      const codigo = (document.getElementById('codigoGerado') as HTMLTextAreaElement)?.value;
      if (!codigo) {
        (window as any).showNotification('Gere um site primeiro para baixar!', 'error');
        return;
      }
      const blob = new Blob([codigo], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = siteEditando ? `${siteEditando.slug}.html` : 'landing-page-premium.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      (window as any).showNotification('Download iniciado com sucesso!', 'success');
    };

    (window as any).mudarSeparador = (aba: string) => {
      setAbaAtiva(aba as any);
      const btnP = document.getElementById('tabPreview'), btnC = document.getElementById('tabCode');
      const boxP = document.getElementById('previewFrame'), boxC = document.getElementById('codigoContainer');
      const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
      
      if (!btnP || !btnC || !boxP || !boxC) return;

      if (aba === 'preview') {
        if (codEl && codEl.value) {
          let currentPreview = boxP.getAttribute('srcdoc') || '';
          currentPreview = currentPreview.replace(SCRIPT_PREVIEW, '');
          currentPreview = currentPreview.replace(/<script>requestAnimationFrame[\s\S]*?<\/script>/, '');
          
          if (currentPreview && currentPreview !== codEl.value) {
            setHistoricoCodigo(prev => [...prev, currentPreview]);
          }
          boxP.setAttribute('srcdoc', codEl.value + SCRIPT_PREVIEW); 
          if ((window as any).mapearElementosGerados) {
            (window as any).mapearElementosGerados(codEl.value, false);
          }
        }
        btnP.className = "h-full px-4 border-b-2 border-blue-600 text-blue-700 font-medium text-xs flex items-center";
        btnC.className = "h-full px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-medium text-xs flex items-center transition";
        boxP.classList.add('active'); boxC.classList.remove('active');
      } else {
        btnC.className = "h-full px-4 border-b-2 border-blue-600 text-blue-700 font-medium text-xs flex items-center";
        btnP.className = "h-full px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-medium text-xs flex items-center transition";
        boxC.classList.add('active'); boxP.classList.remove('active');
      }
    };

    // ALERTA VISUAL ELEGANTE E COM ROLAGEM SE FOR TEXTO LONGO
    (window as any).showNotification = (msg: string, type: string) => {
      const exist = document.getElementById('custom-toast');
      if(exist) exist.remove();
      
      const div = document.createElement('div');
      div.id = 'custom-toast';
      
      if(type === 'limit') {
          div.className = `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-amber-300 px-8 py-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[9999] flex flex-col items-center text-center max-w-sm w-full transition-all`;
          div.innerHTML = `
              <div class="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner"><i class="fas fa-hourglass-half animate-pulse"></i></div>
              <h4 class="font-black text-amber-600 text-xl mb-2 uppercase tracking-wide">Pausa Temporária!</h4>
              <p class="text-sm font-medium text-slate-600 leading-relaxed mb-4">${msg}</p>
              <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Fechando em breve...</p>
          `;
      } else if(type === 'error') {
          // REMOVIDO o animate-bounce e adicionado scroll (overflow-y-auto)
          div.className = `fixed top-10 left-1/2 -translate-x-1/2 bg-white border-l-4 border-red-500 text-slate-800 px-6 py-4 rounded shadow-2xl z-[9999] flex items-start gap-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto transition-all`;
          div.innerHTML = `
              <i class="fas fa-exclamation-circle text-red-500 text-2xl mt-1"></i> 
              <div class="flex-1">
                  <h4 class="font-bold text-red-600 text-sm mb-1">Aviso do Sistema</h4>
                  <p class="text-[13px] font-medium leading-relaxed break-words whitespace-pre-wrap">${msg}</p>
              </div>
              <button onclick="document.getElementById('custom-toast').remove()" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
          `;
      } else {
          div.className = `fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded shadow-xl z-[9999] flex items-center gap-2 transition-all`;
          div.innerHTML = `<i class="fas fa-check-circle"></i> <span class="font-medium text-sm">${msg}</span>`;
      }
      
      document.body.appendChild(div);
      
      // Auto-fechar os modais
      if(type !== 'error') {
          setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 500); }, type === 'limit' ? 6000 : 3000); 
      }
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

  const desfazerCodigo = () => {
    if (historicoCodigo.length === 0) {
      (window as any).showNotification('Nenhum histórico anterior para retornar.', 'error');
      return;
    }
    const ultimoEstado = historicoCodigo[historicoCodigo.length - 1];
    setHistoricoCodigo(prev => prev.slice(0, prev.length - 1));

    const codEl = document.getElementById('codigoGerado') as HTMLTextAreaElement;
    const prevEl = document.getElementById('previewFrame') as HTMLIFrameElement;
    if (codEl) codEl.value = ultimoEstado;
    if (prevEl) prevEl.srcdoc = ultimoEstado + SCRIPT_PREVIEW; 
    if ((window as any).mapearElementosGerados) (window as any).mapearElementosGerados(ultimoEstado, false);
    
    (window as any).showNotification('Retornado ao código anterior com sucesso!', 'success');
  };

  const indexOfLastSite = paginaAtual * SITES_POR_PAGINA;
  const indexOfFirstSite = indexOfLastSite - SITES_POR_PAGINA;
  const sitesAtuais = listaSites.slice(indexOfFirstSite, indexOfLastSite);
  const totalPaginas = Math.ceil(listaSites.length / SITES_POR_PAGINA);

  return (
    <div className="h-screen overflow-hidden flex relative bg-slate-100 text-slate-800 font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style dangerouslySetInnerHTML={{__html: `
        .card { background: white; border-radius: .5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0/0.05); padding: .75rem; display: flex; flex-direction: column; }
        .label-style { font-weight: 600; color: #1e293b; margin-bottom: .25rem; font-size: .875rem; display: flex; align-items: center;}
        .label-style i { margin-right: .5rem; color: #64748b; }
        
        .input-style { width: 100%; padding: .35rem .5rem; border-radius: .375rem; border: 1px solid #cbd5e1; font-size: .75rem; }
        
        .input-style:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
        .primary-btn { background: #2563eb; color: white; font-weight: 600; display: flex; justify-content: center; align-items: center;}
        .primary-btn:hover { background: #1d4ed8; }
        .drop-zone { border: 2px dashed #94a3b8; border-radius: .5rem; background: #f8fafc; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: .5rem; text-align: center; }
        .image-preview-item { position: relative; border-radius: .5rem; overflow: hidden; border: 1px solid #e5e7eb; height: 60px; }
        .image-preview-item img { width: 100%; height: 100%; object-fit: cover; }
        .image-preview-item .remove-img { position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 8px; }
        #previewFrame, #codigoContainer { display: none; }
        #previewFrame.active, #codigoContainer.active { display: block; }
        
        #loadingOverlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(15,23,42,0.95); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        #loadingSpinner { border: 4px solid rgba(59,130,246,0.2); border-top: 4px solid #3b82f6; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin-bottom: 2rem; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        #loadingText { color: white; font-weight: 500; font-size: 1.1rem; letter-spacing: 0.05em; text-align: center; max-width: 80%; line-height: 1.5; }
      `}} />

      <div id="main-app-container" className="w-full h-full flex overflow-hidden">
        
        <div id="loadingOverlay" style={{ display: 'none' }}>
            <div id="loadingSpinner"></div>
            <p id="loadingText"></p>
        </div>

        <div className="w-full md:w-96 lg:w-[380px] bg-white shadow-xl flex flex-col h-full border-r border-gray-200 flex-shrink-0 z-10">
            <div className="p-3 border-b border-gray-100 bg-gray-50 pb-0">
                <h1 className="text-lg font-bold text-gray-800"><i className="fas fa-layer-group text-blue-600 mr-2"></i>Modelador Visual Pro</h1>
                
                <div className="flex border-b border-gray-200 mb-2 mt-2">
                    <button id="btnTabVisual" onClick={() => (window as any).mudarModoApp('visual')} className="flex-1 py-1.5 text-xs font-semibold border-b-2 border-blue-600 text-blue-700 bg-blue-50/50">Modo Visual</button>
                    <button id="btnTabCopy" onClick={() => (window as any).mudarModoApp('copy')} className="flex-1 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50">Modo Texto (Copy)</button>
                </div>
            </div>

            <div className="overflow-y-auto p-3 flex-grow custom-scrollbar flex flex-col">
                
                <div className="flex flex-col gap-1 mb-2 px-2 py-1.5 bg-indigo-50/50 border border-indigo-100 rounded shadow-sm">
                    <label htmlFor="nichoEstilo" className="text-[9px] font-bold text-indigo-800 uppercase"><i className="fas fa-paint-roller mr-1"></i> Estilo Visual do Site:</label>
                    <select id="nichoEstilo" className="input-style bg-white border-indigo-200">
                        <option value="nenhum">⚪ Nenhum (Layout Padrão Limpo)</option>
                        <option value="premium">💎 Infoproduto Premium (Elegante)</option>
                        <option value="terapia">🌿 Saúde e Terapia (Calmo)</option>
                        <option value="agressivo">⚡ Lançamento (Dark Mode/Urgência)</option>
                        <option value="corporativo">🏢 Corporativo (Limpo & Direto)</option>
                        <option value="consultor">💼 Mentor/Consultor (Autoridade)</option>
                        <option value="feminino">✨ Nicho Feminino (Suave & Luxo)</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1 mb-2 px-2 py-1.5 bg-amber-50/50 border border-amber-100 rounded shadow-sm">
                    <label htmlFor="heroLayout" className="text-[9px] font-bold text-amber-800 uppercase"><i className="fas fa-heading mr-1"></i> Topo (Primeira Tela):</label>
                    <select id="heroLayout" className="input-style bg-white border-amber-200">
                        <option value="auto">🤖 Automático (A IA escolhe)</option>
                        <option value="center">📝 Centralizado (Foco na Copy)</option>
                        <option value="split">🖼️ Dividido (Texto + Imagem)</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1 mb-2 px-2 py-1.5 bg-teal-50/50 border border-teal-100 rounded shadow-sm">
                    <label htmlFor="paletaCores" className="text-[9px] font-bold text-teal-800 uppercase"><i className="fas fa-palette mr-1"></i> Paleta de Cores:</label>
                    <select id="paletaCores" value={corSelecionada} onChange={(e) => setCorSelecionada(e.target.value)} className="input-style bg-white border-teal-200">
                        <option value="auto">🎨 Extrair Cor da Imagem / Automático</option>
                        <option value="azul">🔵 Azul Meia-Noite</option>
                        <option value="verde">🟢 Verde Esmeralda</option>
                        <option value="terracota">🟠 Terracota & Nude</option>
                        <option value="roxo">🟣 Roxo Real</option>
                        <option value="dark">⚫ Preto & Dourado (Dark)</option>
                        <option value="cinza">⚪ Cinza Minimalista</option>
                        <option value="vermelho">🔴 Vermelho Rubi</option>
                        <option value="amarelo">🟡 Amarelo Solar</option>
                        <option value="rosa">🌸 Rosa Pastel</option>
                        <option value="personalizada">🖌️ Personalizada (Escolher)</option>
                    </select>
                    
                    {corSelecionada === 'personalizada' && (
                      <div className="flex flex-col gap-1 mt-1 p-2 bg-white rounded border border-teal-200">
                          <div className="flex items-center justify-between">
                              <label className="text-[9px] font-bold text-slate-600">Principal:</label>
                              <input type="color" id="corPrimaria" className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0" defaultValue="#1e293b" />
                          </div>
                          <div className="flex items-center justify-between">
                              <label className="text-[9px] font-bold text-slate-600">Fundo:</label>
                              <input type="color" id="corFundo" className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0" defaultValue="#f8fafc" />
                          </div>
                          <div className="flex items-center justify-between">
                              <label className="text-[9px] font-bold text-slate-600">Botão:</label>
                              <input type="color" id="corDestaque" className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0" defaultValue="#10b981" />
                          </div>
                      </div>
                    )}
                </div>

                <div className="flex flex-col gap-1 mb-2 px-2 py-1.5 bg-purple-50/50 border border-purple-100 rounded shadow-sm">
                    <label htmlFor="estiloImagem" className="text-[9px] font-bold text-purple-800 uppercase"><i className="fas fa-image mr-1"></i> Imagens:</label>
                    <select id="estiloImagem" className="input-style bg-white border-purple-200">
                        <option value="real">📸 Fotografias Reais (Padrão)</option>
                        <option value="ilustracao">🎨 Ilustrações & 3D</option>
                        <option value="tecnologia">🚀 Tecnologia & Sci-Fi</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1 mb-2 px-2 py-1.5 bg-fuchsia-50/50 border border-fuchsia-100 rounded shadow-sm">
                    <label htmlFor="dinamicaSite" className="text-[9px] font-bold text-fuchsia-800 uppercase"><i className="fas fa-wand-magic-sparkles mr-1"></i> Efeitos / Animação:</label>
                    <select id="dinamicaSite" className="input-style bg-white border-fuchsia-200">
                        <option value="estatico">🧊 Estático (Carregamento Rápido)</option>
                        <option value="suave">🌬️ Suave (Animações ao Rolar)</option>
                        <option value="impacto">🔥 Máximo Impacto (Efeitos UAU)</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-blue-50 border border-blue-100 rounded">
                    <input type="checkbox" id="checkComMenu" defaultChecked={false} className="w-3 h-3 ml-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                    <label htmlFor="checkComMenu" className="text-[10px] font-bold text-blue-800 cursor-pointer">CRIAR SITE COM MENU SUPERIOR?</label>
                </div>

                <div id="containerModoVisual" className="flex-1 flex flex-col">
                    <div className="card mb-2">
                        <h3 className="label-style text-[10px] mb-1"><i className="fas fa-images"></i>Referências Visuais</h3>
                        <div className="drop-zone py-2 px-2 min-h-[60px]" onClick={() => document.getElementById('imageUploadInput')?.click()}>
                            <p className="text-[9px] font-medium text-gray-500"><i className="fas fa-cloud-upload-alt text-base block mb-0.5"></i>Clique ou Arraste / Cole (Ctrl+V)</p>
                        </div>
                        <input type="file" id="imageUploadInput" multiple accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageUploadInput} />
                        
                        {uploadedImages.length > 0 && (
                          <div className="grid grid-cols-4 gap-1.5 mt-2">
                            {uploadedImages.map((imgObj, index) => (
                              <div key={index} className="image-preview-item shadow-sm relative h-10">
                                <img src={`data:${imgObj.mimeType};base64,${imgObj.data}`} alt="Ref" className="w-full h-full object-cover rounded" />
                                <div className="remove-img" onClick={() => removerImagem(index)}>
                                  <i className="fas fa-times"></i>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className="card mb-2">
                        <select id="modoClonagem" className="input-style mb-2 text-gray-700 font-semibold bg-gray-50">
                            <option value="exato">Construção: Cópia Exata (Pixel Perfect)</option>
                            <option value="modelagem">Construção: Modelar Conversão</option>
                        </select>
                        <button onClick={() => (window as any).executarGeracaoSite(uploadedImages)} className="primary-btn w-full py-1.5 rounded text-xs">
                            <i className="fas fa-magic mr-1.5"></i> Gerar Site Profissional
                        </button>
                    </div>
                </div>

                <div id="containerModoCopy" style={{ display: 'none' }} className="flex-1 flex flex-col">
                    <div className="card mb-2 flex-1 flex flex-col">
                        <h3 className="label-style text-[10px] mb-1"><i className="fas fa-file-lines"></i>Conteúdo Base</h3>
                        <textarea id="productContent" maxLength={5000} className="input-style resize-none flex-1 min-h-[120px]" placeholder="Cole o texto base do seu produto..."></textarea>
                    </div>
                    <button onClick={() => (window as any).gerarSiteComCopy()} className="primary-btn w-full py-1.5 rounded text-xs bg-indigo-600 hover:bg-indigo-700 mb-2">
                        <i className="fas fa-pen-nib mr-1.5"></i> Gerar com Copy
                    </button>
                </div>

                <div id="elementManagerCard" className="card border-blue-200 bg-blue-50 mb-2" style={{ display: 'none' }}>
                    <h3 className="label-style text-blue-800 text-[10px] mb-1"><i className="fas fa-edit"></i>Gerenciador</h3>
                    <div id="imageSection" style={{ display: 'none' }} className="mb-1">
                        <div id="imageInputsContainer" className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1"></div>
                    </div>
                    <div id="linkSection" style={{ display: 'none' }}>
                        <div id="linkInputsContainer" className="space-y-1.5 max-h-24 overflow-y-auto pr-1 mt-1 border-t border-blue-100 pt-1"></div>
                    </div>
                    
                    <button onClick={() => (window as any).dispararAtualizacao()} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-[9px] py-1 rounded mt-1.5 transition-colors">
                        <i className="fas fa-sync-alt mr-1"></i> Atualizar View
                    </button>
                </div>

                <div className="card border-emerald-200 bg-emerald-50 mb-1 flex-1 flex flex-col min-h-[160px]">
                    <label className="text-[10px] font-bold text-emerald-800 uppercase mb-1 block"><i className="fas fa-wand-magic-sparkles mr-1"></i> Refinamento Cirúrgico</label>
                    <textarea id="promptRefinamento" className="input-style w-full resize-none text-[11px] flex-1" placeholder="Ex: Remova apenas a imagem X..."></textarea>
                    <button onClick={() => (window as any).refinarSiteEstrito()} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-2 mt-2 rounded w-full flex items-center justify-center gap-1.5 shadow-sm transition-colors">
                        <i className="fas fa-rotate"></i> Aplicar Opções ao Site
                    </button>
                </div>

            </div>
        </div>

        <div className="flex-grow flex flex-col bg-white relative">
            <div className="bg-white border-b border-gray-200 flex justify-between items-center px-4 h-12">
                <div className="flex h-full items-center gap-2">
                    <button id="tabPreview" onClick={() => (window as any).mudarSeparador('preview')} className="h-full px-4 border-b-2 border-blue-600 text-blue-700 font-medium text-xs flex items-center">Visualização</button>
                    <button id="tabCode" onClick={() => (window as any).mudarSeparador('code')} className="h-full px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-medium text-xs flex items-center transition">Código HTML</button>
                    
                    <button onClick={desfazerCodigo} className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-semibold py-1 px-2 rounded border border-amber-200 transition flex items-center gap-1 ml-2" title="Retornar para o código anterior">
                      <i className="fas fa-undo text-[9px]"></i> Desfazer
                    </button>
                    
                    {/* CONTADORES VISUAIS DE USO DAS CHAVES */}
                    <div className="flex items-center gap-1.5 ml-4 hidden lg:flex border border-slate-100 rounded p-1 bg-slate-50">
                        <div className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${apiUsage.chave1 >= 15 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`} title="Uso da Chave 1 neste minuto">
                            <i className="fas fa-key"></i> C1: {apiUsage.chave1}/15
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${apiUsage.chave2 >= 15 ? 'bg-red-50 text-red-600 border-red-200' : apiUsage.chave1 >= 15 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`} title="Uso da Chave 2 neste minuto">
                            <i className="fas fa-key"></i> C2: {apiUsage.chave2}/15
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${apiUsage.chave3 >= 15 ? 'bg-red-50 text-red-600 border-red-200' : apiUsage.chave2 >= 15 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`} title="Uso da Chave 3 neste minuto">
                            <i className="fas fa-key"></i> C3: {apiUsage.chave3}/15
                        </div>
                    </div>

                </div>

                <div className="flex items-center gap-2">
                    <button onClick={carregarMeusSites} className="bg-blue-600 text-white text-[10px] font-semibold py-1.5 px-2.5 rounded shadow"><i className="fas fa-folder-open"></i> Sites</button>
                    
                    {siteEditando ? (
                        <>
                            <button onClick={() => setSiteEditando(null)} className="bg-gray-500 hover:bg-gray-600 text-white text-[10px] font-semibold py-1.5 px-2.5 rounded shadow transition">Cancelar</button>
                            <button onClick={() => (window as any).handlePublicarSite()} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold py-1.5 px-2.5 rounded shadow transition flex items-center gap-1"><i className="fas fa-save"></i> Salvar</button>
                        </>
                    ) : (
                        <button onClick={() => (window as any).handlePublicarSite()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold py-1.5 px-2.5 rounded shadow transition flex items-center gap-1"><i className="fas fa-globe"></i> Publicar</button>
                    )}

                    <button onClick={() => (window as any).copiarCodigo()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold py-1.5 px-2.5 rounded border border-slate-300 transition">Copiar</button>
                    <button onClick={() => (window as any).baixarHtmlGerado()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold py-1.5 px-2.5 rounded border border-slate-300 transition"><i className="fas fa-download text-blue-600"></i></button>
                    <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[10px] font-semibold py-1.5 px-2.5 rounded transition"><i className="fas fa-sign-out-alt"></i></button>
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