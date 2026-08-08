import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica, isBlockRefinement, isElementRefinement } = body;

    const anoAtual = new Date().getFullYear();

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    let temImagem = false;
    let textoDoPrompt = "";
    
    for (const part of promptParts) {
        if (part.inlineData) temImagem = true;
        if (part.text) textoDoPrompt += part.text + "\n";
    }

    // REGRA REFORÇADA PARA IMAGENS
    const regraImagens = "- MÍDIAS E IMAGENS: 🚨 NUNCA INVENTE URLs DE FOTOS. Você DEVE obrigatoriamente usar este formato exato para todas as imagens: https://images.unsplash.com/random/1200x800/?keyword1,keyword2 (Substitua as keywords por termos ultradirecionados em INGLÊS que combinem com a seção). NUNCA use URLs com '/photo-'.";
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES: Adicione data-aos=\"fade-up\" nas tags estruturais principais (<section>, <div> grandes).";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES: OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism (bg-white/10 backdrop-blur-md) e hover:scale-105 nos botões.";

    let regrasObrigatorias = "";
    
    if (!isBlockRefinement && !isElementRefinement) {
        regrasObrigatorias = `
=== REGRA DE OURO 1: ALTA PERFORMANCE E FIDELIDADE ===
Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 O valor DEVE CONTER O SITE INTEIRO (do <!DOCTYPE html> até o </html>). NUNCA utilize marcações de corte como "<!-- resto do código -->". 

=== REGRA DE OURO 2: RESPONSIVIDADE MOBILE-FIRST (OBRIGATÓRIO) ===
O site DEVE se adaptar perfeitamente a celulares, tablets e desktops. Use classes flex responsivas (ex: flex-col md:flex-row) e espaçamentos percentuais.

=== REGRA DE OURO 3: ARQUITETURA E ESPAÇAMENTOS ===
- Force o espaçamento de UMA LINHA entre títulos e parágrafos utilizando as classes 'mb-4' ou 'mb-6'.
- Otimize todas as tags <img> com: "w-full mx-auto h-auto object-cover rounded-xl shadow-lg".
${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE: RODAPÉ JURÍDICO FUNCIONAL ===
Copie e cole este bloco HTML antes do fechamento do </body>:
<footer data-bloco="rodape" class="bg-slate-900 text-slate-300 py-12 text-center text-sm mt-12 border-t border-slate-800 w-full overflow-hidden">
    <div class="w-full max-w-5xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-8 font-medium">
            <a href="#privacidade" onclick="toggleLegal(event, 'panel-privacidade')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal(event, 'panel-termos')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Termos de Uso</a>
        </div>
        <div id="legal-panels" class="text-left mb-10 text-slate-200 text-base leading-relaxed hidden bg-slate-800 p-6 md:p-8 rounded-2xl w-full max-w-4xl mx-auto border border-slate-700 shadow-xl transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Política de Privacidade</h4>
                <p>Nossa coleta de dados está em conformidade com as normas vigentes de proteção de dados. Coletamos informações estritamente necessárias apenas para otimização de campanhas, atendimento e suporte essencial.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Termos de Uso</h4>
                <p>Este portal não é afiliado ou endossado por nenhuma plataforma de mídia social de terceiros. Os resultados dependem do uso correto das informações aqui prestadas.</p>
            </div>
        </div>
        <p class="text-slate-500 font-medium tracking-wide text-sm">&copy; ${anoAtual} Todos os direitos reservados.</p>
    </div>
    <script>
        function toggleLegal(e, panelId) {
            if(e) e.preventDefault();
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
        regrasObrigatorias = `
=== DIRETRIZ DE MICRO-OTIMIZAÇÃO E COPYWRITING ===
Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ATENÇÃO: Devolva APENAS a Tag HTML do elemento fornecido. 
🚨 NUNCA narre o que você está fazendo. Devolva O CÓDIGO HTML PRONTO.
        `;
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    let htmlCode = '';
    let provedorTextoUsado = 'Google Gemini';

    const usarGroq = isElementRefinement && !body.isGeminiForced;

    if (!usarGroq) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: systemInstructionFinal,
            safetySettings: safetySettings 
        });

        const result = await model.generateContent({ 
            contents: [{ role: "user", parts: promptParts }], 
            generationConfig: { temperature: 0.2 } 
        });
        
        htmlCode = extrairHtmlDeJson(result.response.text());
    } else {
        provedorTextoUsado = 'Groq Engine (Copy)';
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST", headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: systemInstructionFinal }, { role: "user", content: textoDoPrompt }],
                response_format: { type: "json_object" },
                temperature: 0.7
            })
        });
        const groqData = await groqResponse.json();
        htmlCode = extrairHtmlDeJson(groqData.choices[0].message.content);
    }

    if (!htmlCode || htmlCode.length < 50) throw new Error("A Inteligência Artificial retornou um escopo inválido ou vazio. Tente refazer a requisição.");

    if (dinamica && dinamica !== 'estatico' && !isBlockRefinement && !isElementRefinement) {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (htmlCode.includes('</head>')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (htmlCode.includes('</body>')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

    // CORREÇÃO: Limpador de Imagens Quebradas (Se a IA inventar links errados)
    const regexBrokenUnsplash = /https:\/\/images\.unsplash\.com\/photo-[^"&<>\s']+/g;
    htmlCode = htmlCode.replace(regexBrokenUnsplash, 'https://loremflickr.com/1200/800/business');

    // BUSCA DE IMAGENS REAIS
    let provedorImagemUsado = 'Sem imagens';
    const regexUnsplash = /https:\/\/(?:images|source)\.unsplash\.com\/(?:random\/)?(\d+x\d+)\/\?([^"&<>\s']+)/g;
    let match; const urlsToReplace = [];
    while ((match = regexUnsplash.exec(htmlCode)) !== null) {
        urlsToReplace.push({ fullMatch: match[0], dimensao: match[1], keyword: match[2] });
    }

    if (urlsToReplace.length > 0) {
      let unsplashUsado = false, flickrUsado = false;
      for (const item of urlsToReplace) {
        let imagemEncontrada = false;
        const kw = encodeURIComponent(item.keyword.replace(/[{}]/g, '').split(',')[0]);
        let orient = item.dimensao === '800x1200' ? 'portrait' : 'landscape';
        if (process.env.UNSPLASH_API_KEY) {
          try {
            const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${kw}&per_page=15&orientation=${orient}&client_id=${process.env.UNSPLASH_API_KEY}`);
            if (uRes.ok) {
              const uData = await uRes.json();
              if (uData.results?.length > 0) {
                htmlCode = htmlCode.replace(item.fullMatch, uData.results[Math.floor(Math.random() * uData.results.length)].urls.regular);
                imagemEncontrada = true; unsplashUsado = true;
              }
            }
          } catch (e) {}
        }
        if (!imagemEncontrada) {
          const w = item.dimensao === '800x1200' ? '800' : '1200', h = item.dimensao === '800x1200' ? '1200' : '800';
          htmlCode = htmlCode.replace(item.fullMatch, `https://loremflickr.com/${w}/${h}/${kw}?lock=${Math.floor(Math.random() * 9999)}`);
          flickrUsado = true;
        }
      }
      provedorImagemUsado = unsplashUsado && flickrUsado ? 'Unsplash + Flickr' : unsplashUsado ? 'Unsplash API' : 'LoremFlickr';
    }

    return NextResponse.json({ success: true, html: htmlCode, provedorTexto: provedorTextoUsado, provedorImagem: provedorImagemUsado });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function extrairHtmlDeJson(text: string): string {
  try {
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const json = JSON.parse(clean);
      let extracted = json.codigo_html || json.html || Object.values(json)[0] || "";
      if (typeof extracted !== 'string') extracted = JSON.stringify(extracted);
      extracted = extracted.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '\t');
      return extracted;
  } catch (e) {
      return text.replace(/```html/g, '').replace(/```/g, '').trim();
  }
}