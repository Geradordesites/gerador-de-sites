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

    const regraImagens = `
=== SISTEMA DE MÍDIA PROFISSIONAL EXCLUSIVO ===
🚨 É ESTRITAMENTE PROIBIDO INVENTAR URLs DE IMAGENS OU USAR SERVIÇOS GENÉRICOS COMO LOREMFLICKR.
Você DEVE utilizar a nossa tag de requisição interna para todas as imagens: src="[UNSPLASH: resolucao: keywords_em_ingles]"

- resolucao deve ser: "1280x720" (para paisagens/fundos), "800x1200" (para retratos/pessoas em pé) ou "800x800" (para quadrados).
- keywords devem ser 2 a 3 palavras precisas em inglês sobre o contexto (ex: business meeting, happy therapist, minimalist office).

Exemplo: <img src="[UNSPLASH: 800x1200: confident business woman]" class="w-full h-auto object-cover rounded-xl shadow-lg" alt="Mulher de negócios" />
`;
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES (AOS): Adicione data-aos=\"fade-up\" nas tags estruturais principais (<section>, <header>, <div> principais).";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES (AOS): OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism (bg-white/10 backdrop-blur-md) e hover:scale-105 nos botões.";

    let regrasObrigatorias = "";
    
    if (isSiteRefinement) {
        regrasObrigatorias = `=== REGRA DE REFATORAÇÃO GLOBAL ===\nModifique APENAS o que foi pedido e devolva todo o HTML atualizado no JSON. NÃO CORTE O CÓDIGO.`;
    } else if (isElementRefinement) {
        regrasObrigatorias = `=== MICRO-OTIMIZAÇÃO ===\nDevolva APENAS a Tag HTML do elemento fornecido otimizado, dentro do JSON.`;
    } else {
        regrasObrigatorias = `
=== REGRA DE OURO 1: MOBILE-FIRST (OBRIGATÓRIO) ===
O site DEVE ser perfeito no celular. Use espaçamentos menores no mobile (p-4, py-8) e empilhe tudo (flex-col). Use breakpoints apenas para telas maiores (md:flex-row, lg:py-16, md:p-8). 
Menus devem usar flex-col no celular se não possuírem botão hambúrguer.

=== REGRA DE OURO 2: ARQUITETURA ===
Retorne EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html". O valor DEVE CONTER O SITE INTEIRO.
Force o espaçamento de UMA LINHA entre títulos e parágrafos ('mb-4' ou 'mb-6').

${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE: RODAPÉ JURÍDICO FUNCIONAL ===
Sempre finalize o </body> com este exato rodapé:
<footer data-bloco="rodape" class="bg-slate-900 text-slate-300 py-12 text-center text-sm mt-12 border-t border-slate-800 w-full overflow-hidden">
    <div class="w-full max-w-5xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-8 font-medium">
            <a href="#privacidade" onclick="toggleLegal(event, 'panel-privacidade')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal(event, 'panel-termos')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Termos de Uso</a>
        </div>
        <div id="legal-panels" class="text-left mb-10 text-slate-200 text-base leading-relaxed hidden bg-slate-800 p-6 md:p-8 rounded-2xl w-full max-w-4xl mx-auto border border-slate-700 shadow-xl transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-4"><h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Política de Privacidade</h4><p>Coleta de dados em conformidade com as normas vigentes para otimização de atendimento.</p></div>
            <div id="panel-termos" class="legal-panel hidden space-y-4"><h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Termos de Uso</h4><p>Este portal não é afiliado a nenhuma rede social de terceiros. Resultados dependem do esforço individual.</p></div>
        </div>
        <p class="text-slate-500 font-medium tracking-wide text-sm">&copy; ${anoAtual} Todos os direitos reservados.</p>
    </div>
    <script>function toggleLegal(e, id) { if(e) e.preventDefault(); document.querySelectorAll('.legal-panel').forEach(p => p.classList.add('hidden')); document.getElementById(id).classList.remove('hidden'); document.getElementById('legal-panels').classList.remove('hidden'); }</script>
</footer>
`;
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    let htmlCode = '';
    let provedorTextoUsado = 'Google Gemini (Pro)';

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

    if (!htmlCode || htmlCode.length < 50) throw new Error("A Inteligência Artificial falhou em gerar o código HTML. Tente refazer a requisição.");

    if (dinamica && dinamica !== 'estatico' && !isBlockRefinement && !isElementRefinement && !isSiteRefinement) {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (htmlCode.includes('</head>')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (htmlCode.includes('</body>')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

    // PROCESSADOR ABSOLUTO DO UNSPLASH API (Substitui as tags [UNSPLASH: ...] por links reais da API)
    const regexImgReq = /\[UNSPLASH:\s*(\d+x\d+):\s*([^\]]+)\]/g;
    let match;
    let urlsToReplace = [];
    while ((match = regexImgReq.exec(htmlCode)) !== null) {
        urlsToReplace.push({ fullMatch: match[0], dimensao: match[1], keywords: match[2] });
    }

    if (urlsToReplace.length > 0 && process.env.UNSPLASH_API_KEY) {
        for (const item of urlsToReplace) {
            let orient = item.dimensao === '800x1200' ? 'portrait' : 'landscape';
            if (item.dimensao === '800x800') orient = 'squarish';
            const kwFormatada = encodeURIComponent(item.keywords.trim());
            
            try {
                const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${kwFormatada}&per_page=5&orientation=${orient}&client_id=${process.env.UNSPLASH_API_KEY}`);
                if (uRes.ok) {
                    const uData = await uRes.json();
                    if (uData.results && uData.results.length > 0) {
                        const imagemFinal = uData.results[Math.floor(Math.random() * uData.results.length)].urls.regular;
                        htmlCode = htmlCode.replace(item.fullMatch, imagemFinal);
                        continue;
                    }
                }
            } catch (e) {}
            // Se falhar de buscar na API, usa o source raw do unsplash (sem usar loremflickr)
            htmlCode = htmlCode.replace(item.fullMatch, `https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`);
        }
    } else {
        // Fallback de segurança limpando tags perdidas
        htmlCode = htmlCode.replace(/\[UNSPLASH:[^\]]+\]/g, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
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