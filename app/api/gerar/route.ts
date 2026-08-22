import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// 1. MODELOS DE TEXTO PARA API GRÁTIS OU CHAVE DO CLIENTE (6 Modelos)
const MODELOS_TEXTO_GRATIS = [
  "gemini-3.7-flash",
  "gemini-3.5-flash", 
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview"
];

// 2. MODELOS DE TEXTO SUPER ECONÔMICOS PARA A SUA API PAGA (2 Modelos)
const MODELOS_TEXTO_PAGO = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite"
];

// 3. MODELOS DE IMAGEM ECONÔMICOS (Usados apenas na API Paga)
const MODELOS_IMAGEM_GEMINI = [
  "gemini-3.1-flash-image",
  "gemini-3.1-flash-lite-image"
];

const CUSTO_POR_ACAO = 10; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica, isBlockRefinement, isElementRefinement, isSiteRefinement, clientApiKey, clientUnsplashKey, userId, userEmail } = body;

    const anoAtual = new Date().getFullYear();
    const MEU_EMAIL_ADMIN = 'josevg10@gmail.com';
    const isAdmin = userEmail === MEU_EMAIL_ADMIN;

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

    // === LÓGICA DE SEPARAÇÃO FINANCEIRA E DE CHAVES ===
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: settings } = await supabaseAdmin.from('system_settings').select('*').eq('id', 'global').single();
    
    let isByokEnabled = settings?.byok_enabled ?? true;
    const isAdminKeyEnabled = settings?.admin_paid_key_enabled ?? true; 
    const isGlobalAdminKeyEnabled = settings?.global_admin_key_enabled ?? false; 

    let userByokAllowed = false;
    let userCredits = 0;
    let userPlanExpiration: Date | null = null;
    let allowAdminTestKey = false;

    if (userId) {
        const { data: profile } = await supabaseAdmin.from('profiles').select('allow_byok, credits, plan_expiration, allow_admin_test_key').eq('id', userId).single();
        if (profile) {
            userByokAllowed = profile.allow_byok;
            userCredits = profile.credits || 0;
            allowAdminTestKey = profile.allow_admin_test_key || false;
            if (profile.plan_expiration) userPlanExpiration = new Date(profile.plan_expiration);
        }
    }

    const chavePropriaAutorizada = isByokEnabled || userByokAllowed;
    
    let chaveParaUsar = "";
    let isUsingCredits = false;
    let provedorDeImagens = 'unsplash'; 
    let modelosDeTextoParaUsar = MODELOS_TEXTO_GRATIS; 

    if (isAdmin) {
        chaveParaUsar = process.env.GEMINI_API_KEY!;
        provedorDeImagens = 'unsplash'; 
        modelosDeTextoParaUsar = MODELOS_TEXTO_GRATIS; 
    } else if (chavePropriaAutorizada && clientApiKey && clientApiKey.length > 10) {
        if (!userPlanExpiration || userPlanExpiration < new Date()) {
            throw new Error("Sua assinatura mensal expirou. Renove para continuar utilizando sua chave própria.");
        }
        chaveParaUsar = clientApiKey;
        provedorDeImagens = 'unsplash'; 
        modelosDeTextoParaUsar = MODELOS_TEXTO_GRATIS; 
    } else if (isGlobalAdminKeyEnabled || allowAdminTestKey) {
        if (userCredits < CUSTO_POR_ACAO) throw new Error(`INSUFFICIENT_CREDITS: Esta operação consome ${CUSTO_POR_ACAO} créditos.`);
        isUsingCredits = true;
        chaveParaUsar = process.env.GEMINI_API_KEY!;
        provedorDeImagens = 'unsplash'; 
        modelosDeTextoParaUsar = MODELOS_TEXTO_GRATIS; 
    } else if (isAdminKeyEnabled) {
        if (userCredits < CUSTO_POR_ACAO) throw new Error(`INSUFFICIENT_CREDITS: Esta operação consome ${CUSTO_POR_ACAO} créditos.`);
        isUsingCredits = true;
        chaveParaUsar = process.env.API_KEY_PAGA!;
        provedorDeImagens = 'ai_paid';
        modelosDeTextoParaUsar = MODELOS_TEXTO_PAGO; 
    } else {
        throw new Error("Geração bloqueada: O Administrador desativou o acesso geral.");
    }

    let regraImagens = "";
    if (provedorDeImagens === 'unsplash') {
        regraImagens = `
=== SISTEMA DE MÍDIA GRATUITA (UNSPLASH) ===
🚨 Use APENAS fotografias realistas de humanos. Proibido desenhos ou vetores.
Sintaxe exata: src="[UNSPLASH: resolucao: keywords_em_ingles]"
`;
    } else {
        regraImagens = `
=== SISTEMA DE GERAÇÃO DE MÍDIA POR IA (GEMINI IMAGE ECONÔMICO) ===
🚨 REGRA ABSOLUTA: Para QUALQUER imagem gerada ou modificada, você DEVE utilizar exclusivamente a tag de IA do Gemini.
Sintaxe exata: src="[IMAGEM_IA: prompt_detalhado_em_ingles]"
`;
    }

    let regraMenu = "";
    if (textoDoPrompt.includes("OBRIGATORIAMENTE deve conter um Menu Superior")) {
        regraMenu = "🚨 REGRA FATAL: O HTML DEVE INICIAR COM UMA TAG <nav> CONTENDO UM MENU FIXO, LOGOTIPO, LINKS DE ÂNCORA E UM BOTÃO CTA.";
    } else if (textoDoPrompt.includes("NÃO crie menu")) {
        regraMenu = "🚨 REGRA FATAL: É TOTALMENTE PROIBIDO CRIAR MENU OU TAG <nav>.";
    }
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES (AOS): Adicione data-aos=\"fade-up\" nas tags estruturais principais.";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES (AOS): OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism (bg-white/10 backdrop-blur-md) e hover:scale-105 nos botões.";

    let regrasObrigatorias = "";
    if (isSiteRefinement) {
        regrasObrigatorias = `=== REGRA DE REFATORAÇÃO GLOBAL ===\nModifique APENAS o que foi pedido e devolva TODO o código HTML estruturado no JSON.\n${regraImagens}`;
    } else if (isElementRefinement || isBlockRefinement) {
        regrasObrigatorias = `=== MICRO-OTIMIZAÇÃO ===\nDevolva APENAS a Tag HTML do elemento perfeitamente otimizado, dentro do JSON.\n${regraImagens}`;
    } else {
        regrasObrigatorias = `
=== REGRA DE OURO 1: ARQUITETURA E ESPAÇAMENTO ===
Retorne EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ATENÇÃO: GERE UMA LANDING PAGE PROFISSIONAL COM NO MÍNIMO 6 SEÇÕES.
🚨 ESPAÇAMENTO OBRIGATÓRIO: Organize o layout para que os títulos dos tópicos tenham EXATAMENTE O ESPAÇO DE UMA LINHA entre eles e os parágrafos subsequentes (ex: mb-4 ou mb-6).
🚨 PROIBIÇÃO DE FORMULÁRIOS: É PROIBIDO gerar tags <form>, <input> ou <textarea>. Use APENAS Botões de Ação (CTA).
${regraMenu}

=== REGRA DE OURO 2: MOBILE-FIRST E MÍDIA ===
O site DEVE ser perfeito no celular.
${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE: RODAPÉ JURÍDICO E CORES HARMONIOSAS ===
O rodapé DEVE OBRIGATORIAMENTE utilizar as exatas MESMAS CORES de fundo e de texto do restante do site.
<footer class="w-full font-sans py-16 mt-12 border-t">
    <div class="max-w-5xl mx-auto px-6">
        <div class="text-center pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"><p class="font-medium tracking-wide text-sm">&copy; ${anoAtual} Todos os direitos reservados.</p></div>
    </div>
</footer>
`;
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    const genAI = new GoogleGenerativeAI(chaveParaUsar);
    let htmlCode = '';
    let provedorTextoUsado = '';
    let geracaoSucesso = false;
    let historicoErros: any[] = [];

    for (const modelName of modelosDeTextoParaUsar) {
        if (geracaoSucesso) break; 
        for (let tentativa = 1; tentativa <= 2; tentativa++) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemInstructionFinal, safetySettings });
                const result = await model.generateContent({ 
                    contents: [{ role: "user", parts: promptParts }], 
                    generationConfig: { temperature: isSiteRefinement ? 0.3 : 0.4 } 
                });
                
                htmlCode = extrairHtmlDeJson(result.response.text());
                
                if (htmlCode && htmlCode.length >= 50) {
                    geracaoSucesso = true;
                    provedorTextoUsado = `Google Gemini (${modelName})`;
                    break; 
                } else {
                    throw new Error("HTML gerado foi bloqueado, curto ou inválido.");
                }
            } catch (error: any) {
                historicoErros.push({ modelo: modelName, tentativa: tentativa, erro: error.message || "Erro desconhecido" });
            }
        }
    }

    if (!geracaoSucesso) throw new Error("Nossos motores de IA retornaram erro. Nenhum crédito foi descontado. Tente novamente.");

    if (geracaoSucesso && !isAdmin && isUsingCredits && userId) {
        try { await supabaseAdmin.from('profiles').update({ credits: userCredits - CUSTO_POR_ACAO }).eq('id', userId); } 
        catch (e) {}
    }

    if (provedorDeImagens === 'ai_paid') {
        const regexIa = /\[IMAGEM_IA:\s*([^\]]+)\]/g;
        let matchIa;
        let iaUrlsToReplace = [];
        
        while ((matchIa = regexIa.exec(htmlCode)) !== null) { 
            iaUrlsToReplace.push({ fullMatch: matchIa[0], prompt: matchIa[1] }); 
        }

        for (const item of iaUrlsToReplace) {
            const basePrompt = "Professional, hyper-realistic, high quality photography of " + item.prompt;
            let imagemGeradaComSucesso = false;
            let base64Image = '';

            for (const imgModelName of MODELOS_IMAGEM_GEMINI) {
                if (imagemGeradaComSucesso) break;
                try {
                    const imageModel = genAI.getGenerativeModel({ model: imgModelName });
                    const imgResult = await imageModel.generateContent({
                        contents: [{ role: "user", parts: [{ text: basePrompt }] }]
                    });

                    const response = imgResult.response;
                    if (response.candidates && response.candidates[0]?.content?.parts) {
                        for (const part of response.candidates[0].content.parts) {
                            if (part.inlineData && part.inlineData.data) {
                                base64Image = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
                                imagemGeradaComSucesso = true;
                                break;
                            }
                        }
                    }
                } catch (modelErr: any) {}
            }

            if (imagemGeradaComSucesso && base64Image) {
                htmlCode = htmlCode.replace(item.fullMatch, base64Image);
            } else {
                throw new Error(`Falha no modo pago: Nenhum modelo econômico de imagem do Gemini conseguiu processar o prompt: "${item.prompt}".`);
            }
        }
    } 
    // PROCESSAMENTO MODO GRATUITO (UNSPLASH)
    else {
        const regexImgReq = /\[UNSPLASH:\s*(\d+x\d+)\s*:\s*([^\]]+)\]/g;
        let match;
        let urlsToReplace = [];
        while ((match = regexImgReq.exec(htmlCode)) !== null) { urlsToReplace.push({ fullMatch: match[0], dimensao: match[1], keywords: match[2] }); }

        // EXIGÊNCIA ERICTA: Usa APENAS a chave informada pelo cliente. Sem fallback para chave global do admin!
        const unsplashKeyParaUsar = (clientUnsplashKey && clientUnsplashKey.trim().length > 10) 
            ? clientUnsplashKey 
            : null;

        if (urlsToReplace.length > 0 && unsplashKeyParaUsar) {
            for (const item of urlsToReplace) {
                let orient = 'landscape';
                if (item.dimensao === '800x1200') orient = 'portrait';
                if (item.dimensao === '800x800') orient = 'squarish';
                const kwFormatada = encodeURIComponent(item.keywords.trim());
                let imagemFinal = ''; // Deixa vazio se não encontrar
                try {
                    const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${kwFormatada}&per_page=15&orientation=${orient}&client_id=${unsplashKeyParaUsar}`);
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
            // Se o cliente não colocou a chave do Unsplash, limpa e remove as tags deixando sem imagem (vazio)
            for (const item of urlsToReplace) {
                htmlCode = htmlCode.replace(item.fullMatch, '');
            }
        }
    }
    
    // Limpeza final de qualquer tag remanescente, transformando em string vazia para o local ficar sem imagem
    htmlCode = htmlCode.replace(/\[UNSPLASH:[^\]]+\]/g, '');
    htmlCode = htmlCode.replace(/\[IMAGEM_IA:[^\]]+\]/g, '');

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
