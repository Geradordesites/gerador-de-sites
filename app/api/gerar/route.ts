import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const MODELOS_GEMINI = [
  "gemini-3.5-flash", // Atualizado para usar o padrão mais rápido
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview"
];

const CUSTO_POR_ACAO = 10; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica, isBlockRefinement, isElementRefinement, isSiteRefinement, clientApiKey, userId, userEmail } = body;

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
    const isAdminKeyEnabled = settings?.admin_paid_key_enabled ?? true; // Chave Central Paga
    const isGlobalAdminKeyEnabled = settings?.global_admin_key_enabled ?? false; // Chave Global do Admin (Grátis)

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
    let provedorDeImagens = 'unsplash'; // Padrão: Imagens Grátis

    // VERIFICA O SALDO E DEFINE A CHAVE NA ORDEM DE PRIORIDADE CORRETA
    if (isAdmin) {
        chaveParaUsar = process.env.GEMINI_API_KEY!;
        provedorDeImagens = 'unsplash'; 
    } else if (chavePropriaAutorizada && clientApiKey && clientApiKey.length > 10) {
        if (!userPlanExpiration || userPlanExpiration < new Date()) {
            throw new Error("Sua assinatura mensal expirou. Renove para continuar utilizando sua chave própria.");
        }
        chaveParaUsar = clientApiKey;
        provedorDeImagens = 'unsplash'; // Cliente com chave própria usa Unsplash para não gastar sua API de IA
    } else if (isGlobalAdminKeyEnabled || allowAdminTestKey) {
        // Chave Admin (Testes/Grátis)
        if (userCredits < CUSTO_POR_ACAO) throw new Error(`INSUFFICIENT_CREDITS: Esta operação consome ${CUSTO_POR_ACAO} créditos.`);
        isUsingCredits = true;
        chaveParaUsar = process.env.GEMINI_API_KEY!;
        provedorDeImagens = 'unsplash';
    } else if (isAdminKeyEnabled) {
        // Chave Central Paga (Usa Créditos e gera Imagens de IA)
        if (userCredits < CUSTO_POR_ACAO) throw new Error(`INSUFFICIENT_CREDITS: Esta operação consome ${CUSTO_POR_ACAO} créditos.`);
        isUsingCredits = true;
        chaveParaUsar = process.env.API_KEY_PAGA || process.env.GEMINI_API_KEY_CLIENTES!;
        provedorDeImagens = 'ai_paid'; // Aciona a geração de imagens paga!
    } else {
        throw new Error("Geração bloqueada: O Administrador desativou o acesso geral.");
    }

    // REGRAS DE IMAGEM BASEADAS NO PROVEDOR SELECIONADO
    let regraImagens = "";
    if (provedorDeImagens === 'unsplash') {
        regraImagens = `
=== SISTEMA DE MÍDIA GRATUITA (UNSPLASH) ===
🚨 REGRA ABSOLUTA: Use APENAS fotografias realistas de humanos em situações cotidianas. É ESTRITAMENTE PROIBIDO usar desenhos ou vetores.
Sintaxe exata: src="[UNSPLASH: resolucao: keywords_em_ingles]"
Resoluções: 1280x720, 800x1200 ou 800x800.
Exemplo: <img src="[UNSPLASH: 1280x720: business team meeting]" />
`;
    } else {
        regraImagens = `
=== SISTEMA DE GERAÇÃO DE MÍDIA POR IA ===
🚨 REGRA ABSOLUTA: Para as imagens do site, você DEVE utilizar a nossa tag de IA.
Sintaxe exata: src="[IMAGEM_IA: prompt_detalhado_em_ingles]"
Exemplo: <img src="[IMAGEM_IA: realistic photography of a confident businessman in a modern office, photorealistic, 8k]" />
🚨 PROIBIÇÕES SEVERAS: É ESTRITAMENTE PROIBIDO gerar desenhos, ilustrações, gráficos animados ou imagens com estilo sci-fi/tecnologia extravagante. Exija SEMPRE imagens REAIS e hiper-realistas de seres humanos.
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
        regrasObrigatorias = `=== REGRA DE REFATORAÇÃO GLOBAL ===\nModifique APENAS o que foi pedido e devolva TODO o código HTML estruturado no JSON.`;
    } else if (isElementRefinement || isBlockRefinement) {
        regrasObrigatorias = `=== MICRO-OTIMIZAÇÃO ===\nDevolva APENAS a Tag HTML do elemento perfeitamente otimizado, dentro do JSON.`;
    } else {
        regrasObrigatorias = `
=== REGRA DE OURO 1: ARQUITETURA E ESPAÇAMENTO ===
Retorne EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ATENÇÃO: GERE UMA LANDING PAGE PROFISSIONAL COM NO MÍNIMO 6 SEÇÕES.
🚨 ESPAÇAMENTO OBRIGATÓRIO: Você deve organizar o layout para que os títulos dos tópicos tenham EXATAMENTE O ESPAÇO DE UMA LINHA entre eles e os parágrafos subsequentes. Use margens precisas (ex: mb-4 ou mb-6) para garantir essa separação visual.
🚨 PROIBIÇÃO DE FORMULÁRIOS: É PROIBIDO gerar tags <form>, <input> ou <textarea>. Use APENAS Botões de Ação (CTA).
${regraMenu}

=== REGRA DE OURO 2: MOBILE-FIRST E MÍDIA ===
O site DEVE ser perfeito no celular. Use flex-col para empilhar no celular e md:flex-row para parear no PC.
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

    // TENTA GERAR O SITE
    for (const modelName of MODELOS_GEMINI) {
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

    if (historicoErros.length > 0) {
        try { await supabaseAdmin.from('api_logs').insert([{ modelos_falhos: JSON.stringify(historicoErros), sucesso_final: geracaoSucesso }]); } 
        catch (e) {}
    }

    if (!geracaoSucesso) throw new Error("Nossos motores de IA retornaram erro. Nenhum crédito foi descontado. Tente novamente.");

    // DESCONTO DE CRÉDITOS
    if (geracaoSucesso && !isAdmin && isUsingCredits && userId) {
        try { await supabaseAdmin.from('profiles').update({ credits: userCredits - CUSTO_POR_ACAO }).eq('id', userId); } 
        catch (e) {}
    }

    // PROCESSAMENTO DE IMAGENS - SISTEMA HÍBRIDO (UNSPLASH vs API DE IA)
    if (provedorDeImagens === 'ai_paid') {
        const regexIa = /\[IMAGEM_IA:\s*([^\]]+)\]/g;
        let matchIa;
        let iaUrlsToReplace = [];
        
        while ((matchIa = regexIa.exec(htmlCode)) !== null) { 
            iaUrlsToReplace.push({ fullMatch: matchIa[0], prompt: matchIa[1] }); 
        }

        for (const item of iaUrlsToReplace) {
            let imagemFinalB64 = '';
            // Força a regra da fotografia real antes de enviar para a API de imagem
            const basePrompt = "Hyper-realistic photography, real human people, highly detailed, photorealistic. NO drawings, NO 3D, NO sci-fi. " + item.prompt;
            
            try {
                // OPÇÃO TOGETHER.AI (Fallback Integrado - Basta adicionar USE_TOGETHER=true na Vercel)
                if (process.env.TOGETHER_API_KEY && process.env.USE_TOGETHER === 'true') {
                    const tRes = await fetch("https://api.together.xyz/v1/images/generations", {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ model: "black-forest-labs/FLUX.1-schnell-Free", prompt: basePrompt, width: 1024, height: 768, steps: 4, response_format: "b64_json" })
                    });
                    const tData = await tRes.json();
                    if (tData.data && tData.data[0].b64_json) imagemFinalB64 = `data:image/jpeg;base64,${tData.data[0].b64_json}`;
                } 
                // OPÇÃO GOOGLE IMAGEN (Principal)
                else {
                    const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${chaveParaUsar}`, { 
                        method: "POST", 
                        headers: { "Content-Type": "application/json" }, 
                        body: JSON.stringify({ instances: [{ prompt: basePrompt }], parameters: { sampleCount: 1, aspectRatio: "16:9" } }) 
                    });
                    const gData = await gRes.json();
                    if (gData.predictions && gData.predictions[0].bytesBase64Encoded) {
                        imagemFinalB64 = `data:image/jpeg;base64,${gData.predictions[0].bytesBase64Encoded}`;
                    }
                }
                
                if (imagemFinalB64) {
                    htmlCode = htmlCode.replace(item.fullMatch, imagemFinalB64);
                } else {
                    htmlCode = htmlCode.replace(item.fullMatch, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3');
                }
            } catch (e) {
                htmlCode = htmlCode.replace(item.fullMatch, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3');
            }
        }
    } 
    // FALLBACK DE SEGURANÇA PARA UNSPLASH (Se usar Chave Grátis ou falhar)
    else {
        const regexImgReq = /\[UNSPLASH:\s*(\d+x\d+)\s*:\s*([^\]]+)\]/g;
        let match;
        let urlsToReplace = [];
        while ((match = regexImgReq.exec(htmlCode)) !== null) { urlsToReplace.push({ fullMatch: match[0], dimensao: match[1], keywords: match[2] }); }

        if (urlsToReplace.length > 0 && process.env.UNSPLASH_API_KEY) {
            for (const item of urlsToReplace) {
                let orient = 'landscape';
                if (item.dimensao === '800x1200') orient = 'portrait';
                if (item.dimensao === '800x800') orient = 'squarish';
                const kwFormatada = encodeURIComponent(item.keywords.trim());
                let imagemFinal = `https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`; 
                try {
                    const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${kwFormatada}&per_page=10&orientation=${orient}&client_id=${process.env.UNSPLASH_API_KEY}`);
                    if (uRes.ok) {
                        const uData = await uRes.json();
                        if (uData.results && uData.results.length > 0) imagemFinal = uData.results[Math.floor(Math.random() * uData.results.length)].urls.regular;
                    }
                } catch (e) {}
                htmlCode = htmlCode.replace(item.fullMatch, imagemFinal);
            }
        }
    }
    
    // Limpeza extra caso sobre alguma tag do Unsplash sem formatação no HTML
    htmlCode = htmlCode.replace(/\[UNSPLASH:[^\]]+\]/g, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3');
    htmlCode = htmlCode.replace(/\[IMAGEM_IA:[^\]]+\]/g, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3');

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
