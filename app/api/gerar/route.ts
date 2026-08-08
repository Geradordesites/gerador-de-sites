import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export const maxDuration = 60;
export const bodySizeLimit = '10mb';

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

    let textoDoPrompt = "";
    for (const part of promptParts) {
        if (part.text) textoDoPrompt += part.text + "\n";
    }

    let regraMenu = "";
    if (textoDoPrompt.includes("OBRIGATORIAMENTE deve conter um Menu Superior")) {
        regraMenu = "🚨 REGRA FATAL: O HTML DEVE OBRIGATORIAMENTE INICIAR COM UMA TAG <nav> CONTENDO UM MENU FIXO, LOGOTIPO E LINKS.";
    } else if (textoDoPrompt.includes("NÃO crie menu")) {
        regraMenu = "🚨 REGRA FATAL: É TOTALMENTE PROIBIDO CRIAR MENU OU TAG <nav>. O site deve começar diretamente no conteúdo.";
    }

    const regraImagens = `
=== SISTEMA DE MÍDIA PROFISSIONAL (UNSPLASH API) ===
🚨 PROIBIDO usar links reais de imagens ou loremflickr. Use estritamente:
src="[UNSPLASH: resolucao: keywords_em_ingles]"
- 1280x720 (Paisagem) | 800x1200 (Retrato) | 800x800 (Quadrado)
Exemplo: <img src="[UNSPLASH: 800x1200: confident business woman]" class="w-full h-auto object-cover rounded-xl shadow-lg" alt="Profissional" />
`;

    let regrasObrigatorias = isSiteRefinement 
        ? `=== REFATORAÇÃO GLOBAL ===\nModifique APENAS o que foi pedido e devolva o HTML completo no JSON.` 
        : isElementRefinement 
        ? `=== MICRO-OTIMIZAÇÃO ===\nDevolva APENAS a Tag HTML otimizada no JSON.`
        : `=== LANDING PAGE COMPLETA ===\nRetorne EXCLUSIVAMENTE um objeto JSON com a chave "codigo_html" contendo o site completo (mínimo 6 seções). Espaçe títulos e parágrafos com 'mb-4'.\n${regraMenu}\n${regraImagens}`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemInstructionFinal, safetySettings });
    const result = await model.generateContent({ contents: [{ role: "user", parts: promptParts }], generationConfig: { temperature: 0.3 } });
    
    let htmlCode = extrairHtmlDeJson(result.response.text());

    if (!htmlCode || htmlCode.length < 50) throw new Error("A Inteligência Artificial retornou um escopo inválido.");

    // Processamento de imagens via Unsplash API
    const regexImgReq = /\[UNSPLASH:\s*(\d+x\d+)\s*:\s*([^\]]+)\]/g;
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
            let imagemFinal = `https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`;

            try {
                const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${kwFormatada}&per_page=10&orientation=${orient}&client_id=${process.env.UNSPLASH_API_KEY}`);
                if (uRes.ok) {
                    const uData = await uRes.json();
                    if (uData.results && uData.results.length > 0) {
                        imagemFinal = uData.results[Math.floor(Math.random() * uData.results.length)].urls.regular;
                    }
                }
            } catch (e) {}
            htmlCode = htmlCode.replace(item.fullMatch, imagemFinal);
        }
    } else {
        htmlCode = htmlCode.replace(/\[UNSPLASH:[^\]]+\]/g, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
    }

    return NextResponse.json({ success: true, html: htmlCode });

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
      return text.replace(/```(html|json)?/gi, '').replace(/```/g, '').trim();
  }
}