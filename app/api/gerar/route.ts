import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60; // Dá 60 segundos para a IA responder
export const dynamic = 'force-dynamic'; // Evita que a Vercel congele a rota

// 1. MODELOS DE TEXTO PARA API GRÁTIS (Mantidos exatamente como você solicitou)
const MODELOS_TEXTO_GRATIS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",    
];

// 2. MODELOS DE TEXTO SUPER ECONÔMICOS PARA A SUA API PAGA
const MODELOS_TEXTO_PAGO = [
  "gemini-3.5-flash", 
  "gemini-3.6-flash"  
];

// 3. MODELOS DE IMAGEM
const MODELOS_IMAGEM_GEMINI = [
  "gemini-3.1-flash-image",
  "gemini-3.1-flash-lite-image"
];

const CUSTO_POR_ACAO = 10; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, promptIa, systemInstruction, promptParts, dinamica, isElementRefinement, isSiteRefinement, clientApiKey, clientUnsplashKey, userId, userEmail } = body;

    const anoAtual = new Date().getFullYear();
    const MEU_EMAIL_ADMIN = 'josevg10@gmail.com';
    const isAdmin = userEmail === MEU_EMAIL_ADMIN;

    // 🚨 A CORREÇÃO FINANCEIRA: Se for um pedido só de imagem, o custo é ZERO, pois o site já foi pago!
    const custoDestaOperacao = action === 'gerar-imagem' ? 0 : CUSTO_POR_ACAO;

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

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

    if (clientApiKey && clientApiKey.length > 10) {
        if (!isAdmin && chavePropriaAutorizada) {
            if (!userPlanExpiration || userPlanExpiration < new Date()) throw new Error("A sua assinatura expirou.");
        } else if (!isAdmin && !chavePropriaAutorizada) {
            throw new Error("Chave própria desativada para a sua conta.");
        }
        chaveParaUsar = clientApiKey; 
        if (!clientUnsplashKey || clientUnsplashKey.trim().length < 5) {
            provedorDeImagens = 'ai_paid'; 
            modelosDeTextoParaUsar = MODELOS_TEXTO_PAGO;
        } else {
            provedorDeImagens = 'unsplash'; 
            modelosDeTextoParaUsar = MODELOS_TEXTO_GRATIS; 
        }
    } else if (isAdmin) {
        chaveParaUsar = process.env.GEMINI_API_KEY!;
    } else if (isGlobalAdminKeyEnabled || allowAdminTestKey) {
        if (userCredits < custoDestaOperacao) throw new Error(`Sem saldo.`);
        isUsingCredits = true;
        chaveParaUsar = process.env.GEMINI_API_KEY!;
    } else if (isAdminKeyEnabled) {
        if (userCredits < custoDestaOperacao) throw new Error(`Sem saldo.`);
        isUsingCredits = true;
        chaveParaUsar = process.env.API_KEY_PAGA!;
        provedorDeImagens = 'ai_paid';
        modelosDeTextoParaUsar = MODELOS_TEXTO_PAGO; 
    } else {
        throw new Error("Acesso Bloqueado. Adicione a sua chave Gemini.");
    }

    // =========================================================================
    // ROTA PARALELA: GERAÇÃO DE IMAGEM INDIVIDUAL
    // =========================================================================
    if (action === 'gerar-imagem') {
        try {
            const basePrompt = "Professional, hyper-realistic, high quality photography of " + promptIa;
            let urlImagemBucket = '';
            const genAI = new GoogleGenerativeAI(chaveParaUsar);
            
            for (const imgModelName of MODELOS_IMAGEM_GEMINI) {
                try {
                    const imageModel = genAI.getGenerativeModel({ model: imgModelName });
                    const imgResult = await imageModel.generateContent({ contents: [{ role: "user", parts: [{ text: basePrompt }] }] });
                    const response = imgResult.response;
                    if (response.candidates && response.candidates[0]?.content?.parts) {
                        for (const part of response.candidates[0].content.parts) {
                            if (part.inlineData && part.inlineData.data) {
                                const buffer = Buffer.from(part.inlineData.data, 'base64');
                                const mimeType = part.inlineData.mimeType || 'image/jpeg';
                                const fileName = `ai_img_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
                                const { error } = await supabaseAdmin.storage.from('imagens-geradas').upload(fileName, buffer, { contentType: mimeType, upsert: false });
                                if (!error) {
                                    urlImagemBucket = supabaseAdmin.storage.from('imagens-geradas').getPublicUrl(fileName).data.publicUrl;
                                    break;
                                }
                            }
                        }
                    }
                } catch(e) {}
                if (urlImagemBucket) break;
            }
            if (urlImagemBucket) return NextResponse.json({ success: true, url: urlImagemBucket });
            else return NextResponse.json({ success: false, error: "Limite da IA atingido." }, { status: 400 });
        } catch (error: any) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    }

    // =========================================================================
    // GERAÇÃO DE TEXTO DO SITE
    // =========================================================================
    let regraImagens = "";
    if (provedorDeImagens === 'unsplash') {
        regraImagens = `=== SISTEMA DE MÍDIA (UNSPLASH) ===\n🚨 Para TODAS as imagens, use OBRIGATORIAMENTE este formato exato: <img data-tema="palavra1,palavra2" alt="desc" class="suas classes" />\nNÃO use o atributo src.`;
    } else {
        regraImagens = `=== SISTEMA DE GERAÇÃO DE MÍDIA POR IA ===\n🚨 REGRA ABSOLUTA PARA IMAGENS: Para QUALQUER imagem, você DEVE utilizar EXCLUSIVAMENTE a sintaxe abaixo:\n<img data-ia="descreva_o_prompt_aqui_em_ingles" alt="descrição" class="suas classes" />\nÉ ESTRITAMENTE PROIBIDO usar links de internet e PROIBIDO usar o atributo src. Use apenas data-ia="...".`;
    }

    const regraMenu = `Se o layout exigir menu, ele DEVE ser feito com links de âncora internos (href="#alvo").\nA tag HTML principal DEVE incluir class="scroll-smooth". NUNCA redirecione para outras páginas.`;
    let instrucaoDinamica = dinamica === 'impacto' ? "OBRIGATÓRIO data-aos=\"fade-up\". Aplique hover:scale-105 nos botões." : "";

    let regrasObrigatorias = isSiteRefinement ? 
        `=== REGRA DE REFATORAÇÃO GLOBAL ===\nDEVOLVA TODO O CÓDIGO HTML DE PONTA A PONTA. Mantenha todas as seções e mude APENAS o que foi pedido. Retorne um JSON com a chave "codigo_html".\n${regraMenu}\n${regraImagens}` 
        : isElementRefinement ? 
        `=== MICRO-OTIMIZAÇÃO DE ELEMENTO ===\nAltere o elemento pedido e preserve o id original. Retorne um JSON com a chave "codigo_html".\n${regraImagens}` 
        : `Retorne EXCLUSIVAMENTE um JSON com a chave "codigo_html".\n🚨 GERE UMA LANDING PAGE PROFISSIONAL COM 6 SEÇÕES.\n🚨 ESPAÇAMENTO: Use mb-4 ou mb-6 nos parágrafos.\n🚨 TIPOGRAFIA E LEITURA (MOBILE-FIRST): É ESTRITAMENTE PROIBIDO criar textos minúsculos. NUNCA use as classes "text-xs" ou "text-sm" para descrições, parágrafos ou botões. Use OBRIGATORIAMENTE as classes "text-base md:text-lg" para parágrafos normais e "text-lg md:text-xl" para destaques, garantindo leitura perfeita e confortável nas telas de celulares.\n🚨 PROIBIÇÃO DE FORMULÁRIOS: É ESTRITAMENTE PROIBIDO gerar tags <form>, <input>, <select> ou <textarea>. A página DEVE usar APENAS Botões de Ação (CTAs) normais e Links. NÃO CRIE NENHUM TIPO DE FORMULÁRIO DE CONTATO OU CADASTRO.\n${regraMenu}\n${regraImagens}\n${instrucaoDinamica}\nRodapé: <footer class="w-full font-sans py-16 mt-12 border-t"><div class="text-center pt-8 border-t flex flex-col items-center gap-4"><p class="text-sm">&copy; ${anoAtual} Todos os direitos reservados.</p></div></footer>`;    
        
    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    const genAI = new GoogleGenerativeAI(chaveParaUsar);
    let htmlCode = '';
    let geracaoSucesso = false;
    let motivoDoErro = '';

    for (const modelName of modelosDeTextoParaUsar) {
        if (geracaoSucesso) break; 

        try {
            // Tenta diretamente o modelo sem repetições excessivas para evitar Timeout
            const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemInstructionFinal, safetySettings });
            const result = await model.generateContent({ contents: [{ role: "user", parts: promptParts }], generationConfig: { temperature: isSiteRefinement ? 0.2 : 0.4 } });
            htmlCode = extrairHtmlDeJson(result.response.text());
            if (htmlCode && htmlCode.length >= 50) { 
                geracaoSucesso = true; 
                break; 
            }
        } catch (error: any) { 
            motivoDoErro = error.message;
            console.warn(`Falha rápida com o modelo ${modelName}:`, error.message); 
        }
    }

    // Se falhar agora, envia o motivo real para o ecrã em vez de um erro genérico
    if (!geracaoSucesso) {
        throw new Error(motivoDoErro || "A IA falhou a gerar o conteúdo (Verifique os limites da chave ou a conexão).");
    }
    
    // Apenas desconta os créditos SE foi a geração de texto (custoDestaOperacao = 10)
    if (geracaoSucesso && !isAdmin && isUsingCredits && userId && custoDestaOperacao > 0) {
        try { await supabaseAdmin.from('profiles').update({ credits: userCredits - custoDestaOperacao }).eq('id', userId); } catch (e) {}
    }

    return NextResponse.json({ success: true, html: htmlCode });

  } catch (error: any) {
    console.error("Erro completo da API:", error);
    
    // 🚨 Tratamento para Erro de Tempo (Timeout Vercel - Erro 504)
    if (error.message && (error.message.includes('504') || error.message.includes('timeout'))) {
        return NextResponse.json({ 
            success: false, 
            error: "O servidor cortou a conexão por limite de tempo. A modificação global é muito pesada. Tente modificar blocos individualmente." 
        }, { status: 504 });
    }

    return NextResponse.json({ 
        success: false, 
        error: error.message || 'Erro inesperado na geração do conteúdo' 
    }, { status: 500 });
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
          if (typeof extracted === 'string') return extracted.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '\t');
      }
      return clean;
  } catch (e) {
      let fallback = text.replace(/```(html|json)?/gi, '').replace(/```/g, '').trim();
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