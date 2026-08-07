import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica, isBlockRefinement } = body;

    const anoAtual = new Date().getFullYear();

    let temImagem = false;
    let textoDoPrompt = "";
    
    for (const part of promptParts) {
        if (part.inlineData) temImagem = true;
        if (part.text) textoDoPrompt += part.text + "\n";
    }

    const regraImagens = "- REGRA ABSOLUTA DE IMAGENS: É TERMINANTEMENTE PROIBIDO o uso de ilustrações, desenhos animados, gráficos 3D ou elementos de tecnologia/sci-fi. Você deve focar estritamente em FOTOGRAFIAS HUMANAS REAIS E CENÁRIOS AUTÊNTICOS (REAIS).";
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') {
        instrucaoDinamica = "- ANIMAÇÕES (AOS): Adicione o atributo data-aos=\"fade-up\" nas tags HTML.";
    } else if (dinamica === 'impacto') {
        instrucaoDinamica = "- ANIMAÇÕES (AOS): OBRIGATÓRIO usar atributos data-aos=\"fade-up\". Use Glassmorphism (bg-white/10 backdrop-blur-md) e coloque hover:scale-105 nos botões.";
    }

    // Se NÃO for a edição de um bloco minúsculo, aplica as regras completas de site inteiro
    let regrasObrigatorias = "";
    
    if (!isBlockRefinement) {
        regrasObrigatorias = `
=== REGRA DE OURO: ALTA PERFORMANCE E FIDELIDADE ===
1. Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html" com o código da página inteira. Não adicione Markdown antes ou depois do JSON.
🚨 ALERTA CRÍTICO: O valor de "codigo_html" DEVE CONTER O SITE INTEIRO (do <!DOCTYPE html> até o </html>). É ESTRITAMENTE PROIBIDO cortar, resumir ou usar comentários como "<!-- resto do código -->".

=== NOVA REGRA MESTRA: MAPEAMENTO DE BLOCOS INVISÍVEIS ===
2. MAPEAMENTO: Para que o painel de controle do usuário funcione, VOCÊ DEVE OBRIGATORIAMENTE adicionar um atributo chamado [data-bloco="nome_da_secao"] em TODAS as tags estruturais primárias (<header>, <section>, <footer>, <main>). 
Exemplo: <section data-bloco="topo_hero" class="..."> ... </section>

=== REGRAS DE ESPAÇAMENTO E TIPOGRAFIA (OBRIGATÓRIO) ===
3. ARQUITETURA DE BLOCOS: O layout deve ser impecável. Em TODOS os blocos de texto, mantenha um espaço exato de UMA LINHA entre os títulos (h2, h3) e os parágrafos (p). Use 'mb-4' ou 'mb-6' no Tailwind.

=== REGRAS DE NAVEGAÇÃO E MENU ===
4. OBRIGATÓRIO PARA O MENU SUPERIOR: NO BOTÃO DO MENU use href com hashtag (#) e target="_self". NA SEÇÃO DE DESTINO use o id exato.

=== REGRAS DE ESTRUTURA E IMAGENS ===
5. CONTROLE DE IMAGENS: TODA tag <img> deve conter as classes: "w-full max-w-2xl mx-auto h-auto object-cover rounded-xl shadow-lg".
- Para imagens HORIZONTAIS, src: https://images.unsplash.com/random/1200x800/?keyword
- Para imagens VERTICAIS, src: https://images.unsplash.com/random/800x1200/?keyword
${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE FACEBOOK ADS E RODAPÉ JURÍDICO ===
6. OBRIGATÓRIO: Copie e cole o rodapé abaixo no final do código HTML.
<footer data-bloco="rodape" class="bg-slate-900 text-slate-300 py-16 text-center text-sm mt-12 border-t border-slate-800" ${dinamica !== 'estatico' ? 'data-aos="fade-up"' : ''}>
    <div class="max-w-5xl mx-auto px-6">
        <div class="flex flex-wrap justify-center gap-8 md:gap-16 mb-8 font-medium">
            <a href="#privacidade" onclick="toggleLegal('panel-privacidade', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8 text-base">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal('panel-termos', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8 text-base">Termos de Uso</a>
        </div>
        <div id="legal-panels" class="text-left mb-10 text-slate-200 text-base leading-relaxed hidden bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-inner max-w-4xl mx-auto transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white mb-4 text-xl border-b border-slate-600 pb-2">Política de Privacidade</h4>
                <p>Nossa coleta de dados está em conformidade com a LGPD. Coletamos dados apenas para otimização de campanhas e suporte essencial.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white mb-4 text-xl border-b border-slate-600 pb-2">Termos de Uso</h4>
                <p>Este site não é afiliado ou endossado pelo Facebook, Inc. (Meta). Os conteúdos são de nossa responsabilidade.</p>
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
    } else {
        // Regras Enxutas se for só para refinar UM ÚNICO BLOCO
        regrasObrigatorias = `
=== REGRA DE OURO DA MICRO-EDIÇÃO ===
Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ATENÇÃO: Devolva APENAS o bloco de código HTML modificado (a tag <section>, <header>, etc). NÃO adicione <html>, <head> ou <body>. 
PRESERVE obrigatoriamente os atributos 'data-bloco' e 'data-editor-id' que vierem no código do usuário.
Respeite o espaçamento exato de UMA LINHA entre títulos e parágrafos.
        `;
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;

    let htmlCode = '';
    let provedorTextoUsado = '';

    if (temImagem) {
        provedorTextoUsado = 'Google Gemini (Visão)';
        
        const rotasGemini = [
            { key: process.env.GEMINI_API_KEY, model: "gemini-2.5-flash", nome: "Gemini 1" },
            { key: process.env.GEMINI_API_KEY_2, model: "gemini-2.5-flash", nome: "Gemini 2" }
        ].filter(r => r.key);

        if (rotasGemini.length === 0) throw new Error("Nenhuma chave API do Google Gemini configurada.");

        let sucessoGemini = false;
        let erroFinal = "";

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
                
                // Se for refinamento de bloco, não precisa exigir '<html'
                if (htmlCode && (htmlCode.includes('<html') || isBlockRefinement)) {
                    sucessoGemini = true;
                    provedorTextoUsado = `Google Gemini (${rota.nome})`;
                    break; 
                }
            } catch (err: any) {
                erroFinal = err.message;
            }
        }
        
        if (!sucessoGemini) {
            if (erroFinal.includes('429') || erroFinal.includes('Esgotada')) throw new Error("RATE_LIMIT_EXCEEDED");
            throw new Error(`Falha no Gemini: ${erroFinal}`);
        }

    } else {
        provedorTextoUsado = 'Groq Engine (LLaMA 3)';
        
        if (!process.env.GROQ_API_KEY) throw new Error("Chave do GROQ (GROQ_API_KEY) não configurada no painel.");

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemInstructionFinal },
                    { role: "user", content: textoDoPrompt }
                ],
                response_format: { type: "json_object" },
                max_tokens: isBlockRefinement ? 2000 : 8000, 
                temperature: 0.1
            })
        });

        if (!groqResponse.ok) {
            const errData = await groqResponse.json();
            throw new Error(`Falha no Groq: ${errData.error?.message || 'Erro desconhecido'}`);
        }

        const groqData = await groqResponse.json();
        const contentResposta = groqData.choices[0].message.content;
        htmlCode = extrairHtmlDeJson(contentResposta);

        if (!htmlCode || (!htmlCode.includes('<html') && !isBlockRefinement)) {
            throw new Error("A IA falhou ao retornar a página completa. Tente novamente.");
        }
    }

    if (dinamica && dinamica !== 'estatico' && !isBlockRefinement) {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (!htmlCode.includes('aos.css') && htmlCode.includes('</head>')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (!htmlCode.includes('AOS.init') && htmlCode.includes('</body>')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

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
        
        let orientacaoAPI = 'landscape';
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
  
  if (typeof htmlCode !== 'string') {
      htmlCode = JSON.stringify(htmlCode);
  }
  
  const doctypeIndex = htmlCode.toLowerCase().indexOf('<!doctype html>');
  if (doctypeIndex !== -1) htmlCode = htmlCode.substring(doctypeIndex);
  return htmlCode.replace(/```html/gi, '').replace(/```/g, '').trim();
}