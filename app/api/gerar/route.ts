import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const MODELOS_GEMINI = [
  "gemini-3.7-flash",
  "gemini-3.5-flash", 
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview"
];

const CUSTO_POR_ACAO = 10; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, dinamica, isBlockRefinement, isElementRefinement, isSiteRefinement, clientApiKey, userId, userEmail } = body;

    const anoAtual = new Date().getFullYear();
    const MEU_EMAIL_ADMIN = 'josevg10@gmail.com';
    const isAdmin = userEmail === MEU_EMAIL_ADMIN;

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

    if (isAdmin) {
        chaveParaUsar = process.env.GEMINI_API_KEY!;
        provedorDeImagens = 'unsplash'; 
    } else if (chavePropriaAutorizada && clientApiKey && clientApiKey.length > 10) {
        if (!userPlanExpiration || userPlanExpiration < new Date()) throw new Error("Assinatura expirada.");
        chaveParaUsar = clientApiKey;
        provedorDeImagens = 'unsplash'; 
    } else if (isGlobalAdminKeyEnabled || allowAdminTestKey) {
        if (userCredits < CUSTO_POR_ACAO) throw new Error(`Créditos insuficientes.`);
        isUsingCredits = true;
        chaveParaUsar = process.env.GEMINI_API_KEY!;
        provedorDeImagens = 'unsplash';
    } else if (isAdminKeyEnabled) {
        if (userCredits < CUSTO_POR_ACAO) throw new Error(`Créditos insuficientes.`);
        isUsingCredits = true;
        chaveParaUsar = process.env.API_KEY_PAGA || process.env.GEMINI_API_KEY_CLIENTES!;
        provedorDeImagens = 'ai_paid'; // MODO PAGO = IA TOTAL
    } else {
        throw new Error("Acesso bloqueado pelo administrador.");
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n=== REGRAS: Imagens reais, hiper-realistas, sem desenhos/sci-fi. Use [IMAGEM_IA: prompt] ===';
    const genAI = new GoogleGenerativeAI(chaveParaUsar);
    let htmlCode = '';
    
    // GERAÇÃO DO TEXTO
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash", systemInstruction: systemInstructionFinal, safetySettings });
    const result = await model.generateContent({ contents: [{ role: "user", parts: promptParts }] });
    htmlCode = extrairHtmlDeJson(result.response.text());

    // PROCESSAMENTO DE IMAGENS PAGO (SEM UNSPLASH)
    if (provedorDeImagens === 'ai_paid') {
        const regexIa = /\[IMAGEM_IA:\s*([^\]]+)\]/g;
        let matchIa;
        
        // Usando modelo de imagem via SDK conforme sugestão do próprio Gemini
        const imageModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image" });

        while ((matchIa = regexIa.exec(htmlCode)) !== null) { 
            const fullMatch = matchIa[0];
            const basePrompt = "Professional, hyper-realistic, high quality photography of " + matchIa[1];
            
            const imgResult = await imageModel.generateContent({
                contents: [{ role: "user", parts: [{ text: basePrompt }] }]
            });

            const response = imgResult.response;
            if (response.candidates && response.candidates[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData && part.inlineData.data) {
                        htmlCode = htmlCode.replace(fullMatch, `data:image/jpeg;base64,${part.inlineData.data}`);
                    }
                }
            } else {
                throw new Error("Falha total na geração da imagem pelo Gemini.");
            }
        }
    } else {
        // MODO GRATUITO (UNSPLASH)
        const regexImgReq = /\[UNSPLASH:\s*(\d+x\d+)\s*:\s*([^\]]+)\]/g;
        let match;
        while ((match = regexImgReq.exec(htmlCode)) !== null) {
            const fullMatch = match[0];
            const kwFormatada = encodeURIComponent(match[2].trim());
            const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${kwFormatada}&per_page=1&client_id=${process.env.UNSPLASH_API_KEY}`);
            if (uRes.ok) {
                const uData = await uRes.json();
                if (uData.results && uData.results.length > 0) htmlCode = htmlCode.replace(fullMatch, uData.results[0].urls.regular);
            }
        }
    }

    if (isUsingCredits && userId) await supabaseAdmin.from('profiles').update({ credits: userCredits - CUSTO_POR_ACAO }).eq('id', userId);

    return NextResponse.json({ success: true, html: htmlCode });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function extrairHtmlDeJson(text: string): string {
    let clean = text.replace(/```json/gi, '').replace(/```html/gi, '').replace(/```/g, '').trim();
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
        const json = JSON.parse(clean.substring(start, end + 1));
        return json.codigo_html || json.html || Object.values(json)[0];
    }
    return clean;
}
