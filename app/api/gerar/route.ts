import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica, isBlockRefinement, isElementRefinement, isSiteRefinement } = body;

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

    // A MÁGICA PROFISSIONAL DE IMAGENS ESTÁ AQUI
    const regraImagens = `
=== SISTEMA DE IMAGENS PROFISSIONAIS ===
🚨 PROIBIDO usar links do unsplash, loremflickr ou qualquer URL real nas imagens.
Você DEVE OBRIGATORIAMENTE usar o nosso formato de tag de requisição no atributo 'src' da seguinte forma:
Para fundos largos: src="[IMG_REQ: 1280x720: palavras chaves em inglês separadas por virgula]"
Para pessoas/retrato: src="[IMG_REQ: 800x1200: palavras chaves em inglês]"
Para quadrados: src="[IMG_REQ: 800x800: palavras chaves em inglês]"

Exemplo prático de como você deve gerar a tag img:
<img src="[IMG_REQ: 800x1200: happy woman, therapy, clinic, portrait]" alt="Terapeuta sorrindo" class="w-full h-full object-cover rounded-xl shadow-lg" />

Use palavras-chave (keywords) extremamente específicas, focadas em humanos, emoções e no nicho do site. NUNCA use palavras abstratas como 'background' ou '3d'. APENAS fotos realistas de pessoas e ambientes.`;
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- Adicione data-aos=\"fade-up\" nas tags estruturais principais (<section>, <div>).";
    else if (dinamica === 'impacto') instrucaoDinamica = "- OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism e hover:scale-105 nos botões de CTA.";

    let regrasObrigatorias = "";
    
    if (isSiteRefinement) {
        regrasObrigatorias = `
=== REGRA DE REFATORAÇÃO GLOBAL DE ESTRUTURA ===
Você receberá o código HTML completo. Modifique APENAS o que foi pedido.
DEVOLVA O HTML COMPLETO DENTRO DE UM JSON: { "codigo_html": "..." }
NÃO CORTE O CÓDIGO. Mantenha as imagens no formato [IMG_REQ: ...] que encontrar.
        `;
    } else if (isElementRefinement) {
        regrasObrigatorias = `
=== DIRETRIZ DE MICRO-OTIMIZAÇÃO E COPYWRITING ===
Você DEVE retornar EXCLUSIVAMENTE um objeto JSON: { "codigo_html": "..." }.
Devolva APENAS a Tag HTML do elemento modificado. Não narre a resposta.
        `;
    } else {
        regrasObrigatorias = `
=== REGRA DE OURO 1: ARQUITETURA OBRIGATÓRIA ===
Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 O valor DEVE CONTER O SITE INTEIRO. Se o usuário pedir um MENU (Navbar), é OBRIGATÓRIO que a primeira tag dentro do <body> seja uma <nav> fixa contendo links e um botão de CTA.

=== REGRA DE OURO 2: RESPONSIVIDADE MOBILE-FIRST ===
O site DEVE usar classes como 'flex-col md:flex-row' para garantir que os elementos se empilhem perfeitamente no celular e fiquem lado a lado no PC. Menus devem quebrar adequadamente no celular.

=== REGRA DE OURO 3: ESPAÇAMENTOS E IMAGENS ===
- Force o espaçamento de UMA LINHA entre títulos e parágrafos ('mb-4' ou 'mb-6').
${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE: RODAPÉ JURÍDICO FUNCIONAL ===
Sempre finalize o </body> com este rodapé exato:
<footer data-bloco="rodape" class="bg-slate-900 text-slate-300 py-12 text-center text-sm mt-12 border-t border-slate-800 w-full overflow-hidden">
    <div class="w-full max-w-5xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-8 font-medium">
            <a href="#privacidade" onclick="toggleLegal(event, 'panel-privacidade')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal(event, 'panel-termos')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Termos de Uso</a>
        </div>
        <div id="legal-panels" class="text-left mb-10 text-slate-200 text-base leading-relaxed hidden bg-slate-800 p-6 md:p-8 rounded-2xl w-full max-w-4xl mx-auto border border-slate-700 shadow-xl transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-4"><h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Política de Privacidade</h4><p>Coleta de dados em conformidade com as normas vigentes para otimização de atendimento.</p></div>
            <div id="panel-termos" class="legal-panel hidden space-y-4"><h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Termos de Uso</h4><p>Este portal não é afiliado ao Facebook. Resultados dependem do esforço individual.</p></div>
        </div>
        <p class="text-slate-500 font-medium tracking-wide text-sm">&copy; ${anoAtual} Todos os direitos reservados.</p>
    </div>
    <script>function toggleLegal(e, id) { if(e) e.preventDefault(); document.querySelectorAll('.legal-panel').forEach(p => p.classList.add('hidden')); document.getElementById(id).classList.remove('hidden'); document.getElementById('legal-panels').classList.remove('hidden'); }</script>
</footer>
`;
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    let htmlCode = '';
    let provedorTextoUsado = 'Google Gemini';

    const usarGroq = isElementRefinement && !body.isGeminiForced && !isSiteRefinement;

    if (!usarGroq) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemInstructionFinal, safetySettings });
        const result = await model.generateContent({ contents: [{ role: "user", parts: promptParts }], generationConfig: { temperature: isSiteRefinement ? 0.3 : 0.2 } });
        htmlCode = extrairHtmlDeJson(result.response.text());
    } else {
        provedorTextoUsado = 'Groq Engine (Copy)';
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST", headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: systemInstructionFinal }, { role: "user", content: textoDoPrompt }], response_format: { type: "json_object" }, temperature: 0.7 })
        });
        const groqData = await groqResponse.json();
        htmlCode = extrairHtmlDeJson(groqData.choices[0].message.content);
    }

    if (!htmlCode || htmlCode.length < 50) throw new Error("A Inteligência Artificial retornou um escopo inválido ou vazio. Tente refazer a requisição.");

    if (dinamica && dinamica !== 'estatico' && !isBlockRefinement && !isElementRefinement && !isSiteRefinement) {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (htmlCode.includes('</head>')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (htmlCode.includes('</body>')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

    // PROCESSAMENTO DE IMAGENS (Substituindo a Tag IMG_REQ por Fotos Reais do Unsplash)
    const regexImgReq = /\[IMG_REQ:\s*(\d+x\d+):\s*([^\]]+)\]/g;
    let match;
    let matchesUnsplash = [];
    while ((match = regexImgReq.exec(htmlCode)) !== null) {
        matchesUnsplash.push({ fullMatch: match[0], dimensao: match[1], keywords: match[2] });
    }

    if (matchesUnsplash.length > 0) {
        for (const item of matchesUnsplash) {
            let orient = item.dimensao === '800x1200' ? 'portrait' : 'landscape';
            if (item.dimensao === '800x800') orient = 'squarish';
            
            const kwFormatada = encodeURIComponent(item.keywords.trim());
            let imagemFinal = `https://loremflickr.com/${item.dimensao.replace('x', '/')}/${kwFormatada}?lock=${Math.floor(Math.random() * 999)}`;

            if (process.env.UNSPLASH_API_KEY) {
                try {
                    const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${kwFormatada}&per_page=5&orientation=${orient}&client_id=${process.env.UNSPLASH_API_KEY}`);
                    if (uRes.ok) {
                        const uData = await uRes.json();
                        if (uData.results && uData.results.length > 0) {
                            imagemFinal = uData.results[Math.floor(Math.random() * uData.results.length)].urls.regular;
                        }
                    }
                } catch (e) {}
            }
            // Substitui no HTML final
            htmlCode = htmlCode.replace(item.fullMatch, imagemFinal);
        }
    }

    return NextResponse.json({ success: true, html: htmlCode, provedorTexto: provedorTextoUsado });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function extrairHtmlDeJson(text: string): string {
  try {
      let clean = text.replace(/```json/gi, '').replace(/```html/gi, '').replace(/```/g, '').trim();
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
          const jsonString = clean.substring(start, end + 1);
          const json = JSON.parse(jsonString);
          let extracted = json.codigo_html || json.html || Object.values(json)[0] || jsonString;
          if (typeof extracted === 'string') extracted = extracted.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '\t');
          return extracted;
      }
      return clean;
  } catch (e) {
      let fallback = text.replace(/```(html|json)?/gi, '').replace(/```/g, '').trim();
      if (fallback.toLowerCase().startsWith('json')) fallback = fallback.substring(4).trim();
      if (fallback.startsWith('{') && fallback.includes('"codigo_html":')) {
          const idx = fallback.indexOf('"codigo_html":');
          if (idx !== -1) {
              let rawHtml = fallback.substring(idx + 14).trim();
              if (rawHtml.startsWith('"')) rawHtml = rawHtml.substring(1);
              if (rawHtml.endsWith('}')) rawHtml = rawHtml.slice(0, -1).trim();
              if (rawHtml.endsWith('"')) rawHtml = rawHtml.slice(0, -1);
              return rawHtml.replace(/\\n/g, '\n').replace(/\\"/g, '"');
          }
      }
      return fallback;
  }
}