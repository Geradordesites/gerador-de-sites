import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export const maxDuration = 60;
export const bodySizeLimit = '10mb';

// Função auxiliar para tentar a requisição novamente se o servidor estiver ocupado
async function callGeminiWithRetry(model: any, promptParts: any, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await model.generateContent({ contents: [{ role: "user", parts: promptParts }] });
        } catch (err: any) {
            // Se for erro de Rate Limit (429) e ainda tivermos tentativas, aguarda e tenta de novo
            if ((err.status === 429 || err.message?.includes("429")) && i < retries - 1) {
                const waitTime = (i + 1) * 3000; // Espera 3s, depois 6s...
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            throw err;
        }
    }
}

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
    for (const part of promptParts) { if (part.text) textoDoPrompt += part.text + "\n"; }

    let regraMenu = "";
    if (textoDoPrompt.includes("OBRIGATORIAMENTE deve conter um Menu Superior")) {
        regraMenu = "🚨 REGRA FATAL: O HTML DEVE OBRIGATORIAMENTE INICIAR COM UMA TAG <nav> CONTENDO UM MENU FIXO, LOGOTIPO E LINKS.";
    } else if (textoDoPrompt.includes("NÃO crie menu")) {
        regraMenu = "🚨 REGRA FATAL: É TOTALMENTE PROIBIDO CRIAR MENU OU TAG <nav>.";
    }

    const regraImagens = `
=== SISTEMA DE MÍDIA PROFISSIONAL (UNSPLASH API) ===
Use EXCLUSIVAMENTE a tag: src="[UNSPLASH: resolucao: keywords_em_ingles]"
- 1280x720 (Paisagem) | 800x1200 (Retrato) | 800x800 (Quadrado)
`;
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES (AOS): Adicione data-aos=\"fade-up\" nas tags estruturais.";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES (AOS): OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism e hover:scale-105.";

    let regrasObrigatorias = isSiteRefinement 
        ? `=== REFATORAÇÃO GLOBAL ===\nModifique APENAS o que foi pedido e devolva todo o HTML no JSON. NÃO CORTE O CÓDIGO.` 
        : `=== LANDING PAGE COMPLETA ===\nRetorne EXCLUSIVAMENTE objeto JSON com chave "codigo_html". GERE PÁGINA LONGA E COMPLETA (mínimo 6 seções). Espaçe títulos e parágrafos com 'mb-4'.\n${regraMenu}\n${regraImagens}\n${instrucaoDinamica}`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemInstructionFinal, safetySettings });
    
    // CHAMADA COM RETRY AUTOMÁTICO
    const result = await callGeminiWithRetry(model, promptParts);
    let htmlCode = extrairHtmlDeJson(result.response.text());

    if (!htmlCode || htmlCode.length < 50) throw new Error("A IA falhou em gerar o código.");

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
      let fallback = text.replace(/```(html|json)?/gi, '').replace(/```/g, '').trim();
      return fallback;
  }
}