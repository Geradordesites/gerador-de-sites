import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica } = body;

    const anoAtual = new Date().getFullYear();

    let regraImagens = "- REGRA ABSOLUTA DE IMAGENS: Não use desenhos, animações, gráficos ou ficção científica. Apenas fotografias humanas e cenários reais.";
    if (imageStyle === 'ilustracao') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo ILUSTRAÇÃO. Gere palavras-chave focadas em ilustrações, vetores, 3d render ou minimal art.";
    } else if (imageStyle === 'tecnologia') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo TECNOLOGIA. Gere palavras-chave focadas em tecnologia, cyber, data e sci-fi.";
    }

    let instrucaoDinamica = "";
    if (dinamica === 'suave') {
        instrucaoDinamica = "- ANIMAÇÕES DE SCROLL (AOS): Adicione o atributo data-aos=\"fade-up\" ou data-aos=\"zoom-in\" nas tags HTML de seções, textos e imagens.";
    } else if (dinamica === 'impacto') {
        instrucaoDinamica = "- ANIMAÇÕES DE SCROLL (AOS): OBRIGATÓRIO usar atributos data-aos=\"fade-up\". Substitua grids comuns por Bento Grids, use Glassmorphism (bg-white/10 backdrop-blur-md) e coloque hover:scale-105 e animate-pulse nos botões.";
    }

    const regrasObrigatorias = `
=== REGRA DE OURO: ALTA PERFORMANCE E FIDELIDADE ===
1. Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html" com o código da página inteira. Não adicione Markdown.
2. ENGENHARIA REVERSA: EXTRAIA AS CORES EXATAS. Se a imagem for ESCURA, o código HTML DEVE ter fundo escuro (bg-slate-900).

=== REGRAS DE ESTRUTURA E IMAGENS (CONTROLE DE TAMANHO E ORIENTAÇÃO) ===
3. CONTROLE DE IMAGENS (OBRIGATÓRIO E VITAL): Para evitar que as imagens fiquem gigantes e quebrem o site, TODA tag <img> OBRIGATORIAMENTE deve conter estas classes Tailwind: "w-full max-w-2xl mx-auto h-auto object-cover rounded-xl shadow-lg".
- Para imagens HORIZONTAIS (paisagem), utilize EXATAMENTE o src: https://images.unsplash.com/random/1200x800/?keyword
- Para imagens VERTICAIS (retrato), utilize EXATAMENTE o src: https://images.unsplash.com/random/800x1200/?keyword
(substitua keyword por UMA única palavra em inglês).
${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE FACEBOOK ADS E RODAPÉ JURÍDICO ===
4. OBRIGATÓRIO: Você é PROIBIDO de resumir este bloco. Copie e cole exatamente como está abaixo no final do código HTML. Ele contém os gatilhos legais exigidos pelos robôs da Meta (Facebook Ads) para não bloquear a conta de anúncios. Textos devem manter as classes text-base ou text-lg.
<footer class="bg-slate-900 text-slate-300 py-16 text-center text-sm mt-12 border-t border-slate-800" ${dinamica !== 'estatico' ? 'data-aos="fade-up"' : ''}>
    <div class="max-w-5xl mx-auto px-6">
        <div class="flex flex-wrap justify-center gap-8 md:gap-16 mb-8 font-medium">
            <a href="#privacidade" onclick="toggleLegal('panel-privacidade', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8 text-base">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal('panel-termos', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8 text-base">Termos de Uso</a>
            <a href="#cookies" onclick="toggleLegal('panel-cookies', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8 text-base">Política de Cookies</a>
        </div>
        <div id="legal-panels" class="text-left mb-10 text-slate-200 text-base leading-relaxed hidden bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-inner max-w-4xl mx-auto transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white mb-4 text-xl border-b border-slate-600 pb-2">Política de Privacidade e Proteção de Dados</h4>
                <p>A sua privacidade é nossa prioridade. Esta política descreve como coletamos, usamos, armazenamos e protegemos os seus dados pessoais, em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).</p>
                <p><strong>1. Coleta de Informações:</strong> Coletamos informações fornecidas voluntariamente por você ao preencher formulários. Também coletamos dados de navegação automaticamente via cookies e pixels de rastreamento de parceiros (como a Meta/Facebook e Google) para otimização de campanhas publicitárias.</p>
                <p><strong>2. Uso e Compartilhamento:</strong> Seus dados são utilizados para processamento de pagamentos, entrega do produto, suporte e envio de comunicações essenciais. Não vendemos seus dados. Compartilhamos apenas com plataformas parceiras seguras de pagamento e e-mail marketing.</p>
                <p><strong>3. Seus Direitos:</strong> Você tem o direito de solicitar o acesso, a correção, a anonimização ou a exclusão total dos seus dados pessoais de nossa base a qualquer momento, enviando uma solicitação aos nossos canais de atendimento.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white mb-4 text-xl border-b border-slate-600 pb-2">Termos e Condições de Uso (Aviso Legal)</h4>
                <p>Ao acessar e utilizar este site e nossos produtos, você concorda expressamente em cumprir estes Termos de Serviço. O uso contínuo constitui a aceitação incondicional.</p>
                <p><strong>1. Propriedade Intelectual:</strong> Todo o conteúdo disponibilizado, incluindo textos, vídeos e metodologias, é protegido por leis de direitos autorais. É terminantemente proibida a pirataria, rateio, cópia, distribuição ou revenda não autorizada.</p>
                <p><strong>2. Isenção de Responsabilidade e Resultados:</strong> Os resultados apresentados neste site variam de pessoa para pessoa. Não oferecemos garantias de resultados específicos, ganhos ou curas. O sucesso depende da aplicação correta e do esforço individual. <em>Aviso legal importante:</em> Este site não é afiliado, patrocinado ou endossado pelo Facebook, Inc. (Meta). Os conteúdos aqui dispostos são de inteira responsabilidade nossa.</p>
                <p><strong>3. Política de Reembolso:</strong> Em estrita conformidade com o Código de Defesa do Consumidor (Artigo 49), garantimos a devolução incondicional do seu investimento dentro do prazo de 7 (sete) dias corridos, caso você não esteja satisfeito com o material.</p>
            </div>
            <div id="panel-cookies" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white mb-4 text-xl border-b border-slate-600 pb-2">Política de Cookies e Rastreamento</h4>
                <p>Utilizamos cookies e tecnologias semelhantes para garantir o funcionamento do site, analisar o tráfego e personalizar a sua experiência e nossos anúncios em plataformas de terceiros.</p>
                <p><strong>1. Tipos de Cookies Utilizados:</strong> <em>Cookies Estritamente Necessários:</em> fundamentais para segurança e checkout. <em>Cookies de Desempenho e Analytics:</em> nos ajudam a entender como os visitantes interagem com a página. <em>Cookies de Publicidade e Pixels:</em> utilizados para rastrear o desempenho de anúncios e direcionar campanhas relevantes (ex: Pixel da Meta).</p>
                <p><strong>2. Gerenciamento:</strong> Ao navegar em nosso site, você concorda com a utilização destas tecnologias. Você pode desativar os cookies a qualquer momento nas configurações do seu navegador.</p>
            </div>
        </div>
        <p class="text-slate-500 font-medium tracking-wide text-sm">&copy; ${anoAtual} Todos os direitos reservados.</p>
    </div>
    <script>
        function toggleLegal(panelId, event) {
            if(event) event.preventDefault();
            var container = document.getElementById('legal-panels');
            var panels = document.querySelectorAll('.legal-panel');
            var target = document.getElementById(panelId);
            var isVisible = !target.classList.contains('hidden');
            panels.forEach(function(p) { p.classList.add('hidden'); });
            if (isVisible) { container.classList.add('hidden'); } else { container.classList.remove('hidden'); target.classList.remove('hidden'); }
        }
    </script>
</footer>
`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;

    let htmlCode = '';
    let provedorTextoUsado = 'Google Gemini';
    let logErros: string[] = [];

    const rotasGemini = [
        { key: process.env.GEMINI_API_KEY, model: "gemini-2.5-flash", nome: "Chave 1" },
        { key: process.env.GEMINI_API_KEY_2, model: "gemini-1.5-flash", nome: "Chave 2" },
        { key: process.env.GEMINI_API_KEY_3, model: "gemini-1.5-flash", nome: "Chave 3" }
    ].filter(r => r.key);

    if (rotasGemini.length === 0) {
        throw new Error("Nenhuma chave API do Google Gemini configurada no ambiente.");
    }

    let isRateLimit = false;

    for (const rota of rotasGemini) {
        try {
            const genAI = new GoogleGenerativeAI(rota.key!);
            const model = genAI.getGenerativeModel({
                model: rota.model,
                systemInstruction: { role: "system", parts: [{ text: systemInstructionFinal }] }
            });

            const result = await model.generateContent({
                contents: [{ role: "user", parts: promptParts }],
                generationConfig: { responseMimeType: "application/json" }
            });

            htmlCode = extrairHtmlDeJson(result.response.text());

            if (htmlCode && htmlCode.length > 500 && htmlCode.includes('<html')) {
                provedorTextoUsado = `Google Gemini (${rota.nome})`;
                break; 
            } else {
                throw new Error("Formato inválido retornado.");
            }

        } catch (err: any) {
            let msg = err.message || "";
            if(msg.includes('429')) {
                msg = "Cota Esgotada (429)";
                isRateLimit = true;
            } else if (msg.includes('503')) {
                msg = "Servidor do Google Sobrecarregado (503)";
            }
            logErros.push(`${rota.nome}: ${msg}`);
            htmlCode = ''; 
        }
    }

    if (!htmlCode) {
        if (isRateLimit && logErros.every(e => e.includes('429') || e.includes('Esgotada'))) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw new Error(`As tentativas falharam. Motivos: ${logErros.join(' | ')}`);
    }

    if (dinamica && dinamica !== 'estatico') {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (!htmlCode.includes('aos.css') && htmlCode.includes('</head>')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (!htmlCode.includes('AOS.init') && htmlCode.includes('</body>')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

    // FILTRO DINÂMICO DE IMAGENS (IDENTIFICA VERTICAL E HORIZONTAL)
    let provedorImagemUsado = 'Sem imagens';
    const regexUnsplash = /https:\/\/images\.unsplash\.com\/random\/(\d+x\d+)\/\?([^"&<>\s]+)/g;
    let match;
    const urlsToReplace = [];

    while ((match = regexUnsplash.exec(htmlCode)) !== null) {
      urlsToReplace.push({ fullMatch: match[0], dimensao: match[1], keyword: match[2] });
    }

    if (urlsToReplace.length > 0) {
      let unsplashUsado = false, flickrUsado = false;
      for (const item of urlsToReplace) {
        let imagemEncontrada = false;
        const keywordLimpaFormatada = encodeURIComponent(item.keyword.replace(/[{}]/g, '').split(',')[0]);
        
        // Define a orientação correta baseada no pedido da IA
        let orientacaoAPI = 'landscape'; // Padrão
        if (item.dimensao === '800x1200') orientacaoAPI = 'portrait';
        else if (item.dimensao === '800x800') orientacaoAPI = 'squarish';

        if (process.env.UNSPLASH_API_KEY) {
          try {
            const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${keywordLimpaFormatada}&per_page=15&orientation=${orientacaoAPI}&client_id=${process.env.UNSPLASH_API_KEY}`);
            if (unsplashRes.ok) {
              const uData = await unsplashRes.json();
              if (uData.results && uData.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * uData.results.length);
                htmlCode = htmlCode.replace(item.fullMatch, uData.results[randomIndex].urls.regular);
                imagemEncontrada = true;
                unsplashUsado = true;
              }
            }
          } catch (e) {}
        }

        if (!imagemEncontrada) {
          const lockId = Math.floor(Math.random() * 9999);
          // Se falhar, usa o LoremFlickr respeitando a dimensão pedida
          let w = '1200', h = '800';
          if (item.dimensao === '800x1200') { w = '800'; h = '1200'; }
          const flickrUrl = `https://loremflickr.com/${w}/${h}/${keywordLimpaFormatada}?lock=${lockId}`;
          htmlCode = htmlCode.replace(item.fullMatch, flickrUrl);
          flickrUsado = true;
        }
      }
      if (unsplashUsado && flickrUsado) provedorImagemUsado = 'Unsplash + Flickr (Misto)';
      else if (unsplashUsado) provedorImagemUsado = 'Unsplash API (Premium)';
      else if (flickrUsado) provedorImagemUsado = 'LoremFlickr (Seguro)';
    }

    return NextResponse.json({
      success: true, html: htmlCode, provedorTexto: provedorTextoUsado, provedorImagem: provedorImagemUsado
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro interno." }, { status: 500 });
  }
}

function extrairHtmlDeJson(responseText: string): string {
  let htmlCode = '';
  try {
    const json = JSON.parse(responseText);
    htmlCode = json.codigo_html || json.html || Object.values(json)[0];
  } catch (e) { htmlCode = responseText; }
  const doctypeIndex = htmlCode.toLowerCase().indexOf('<!doctype html>');
  if (doctypeIndex !== -1) htmlCode = htmlCode.substring(doctypeIndex);
  return htmlCode.replace(/```html/gi, '').replace(/```/g, '').trim();
}