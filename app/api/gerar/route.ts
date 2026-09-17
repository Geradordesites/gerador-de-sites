import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// =========================================================================
// 🚀 SOLUÇÃO DO ERRO 500: Aumenta o tempo da Vercel para 60 segundos
// =========================================================================
export const maxDuration = 60;

// 1. MODELOS DE TEXTO PARA API GRÁTIS OU CHAVE DO CLIENTE (6 Modelos)
const MODELOS_TEXTO_GRATIS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",    
];

// 2. MODELOS DE TEXTO SUPER ECONÔMICOS PARA A SUA API PAGA (2 Modelos)
const MODELOS_TEXTO_PAGO = [
  "gemini-2.5-flash",
  "gemini-3.5-flash"
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

    // 👉 NOVA LÓGICA DE PRIORIDADE: Se o usuário preencheu a chave no Painel, USA ELA!
    if (clientApiKey && clientApiKey.length > 10) {
        // Se NÃO for admin, faz a checagem rigorosa de vencimento do plano
        if (!isAdmin && chavePropriaAutorizada) {
            if (!userPlanExpiration || userPlanExpiration < new Date()) {
                throw new Error("Sua assinatura mensal expirou. Renove para continuar utilizando sua chave própria.");
            }
        } else if (!isAdmin && !chavePropriaAutorizada) {
            throw new Error("O recurso de chave própria está desativado para sua conta.");
        }
        
        chaveParaUsar = clientApiKey; // Prioridade MÁXIMA para a chave do input
        
        // Verifica a chave do Unsplash
        if (!clientUnsplashKey || clientUnsplashKey.trim().length < 5) {
            provedorDeImagens = 'ai_paid'; 
            modelosDeTextoParaUsar = MODELOS_TEXTO_PAGO;
        } else {
            provedorDeImagens = 'unsplash'; 
            modelosDeTextoParaUsar = MODELOS_TEXTO_GRATIS; 
        }
        
    } else if (isAdmin) {
        // Se não mandou chave e for admin, usa a global da Vercel
        chaveParaUsar = process.env.GEMINI_API_KEY!;
        provedorDeImagens = 'unsplash'; 
        modelosDeTextoParaUsar = MODELOS_TEXTO_GRATIS; 
    } else if (isGlobalAdminKeyEnabled || allowAdminTestKey) {
        // Usa créditos
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
        throw new Error("Geração bloqueada: Adicione sua própria chave do Gemini nas configurações para usar o sistema.");
    }

    let regraImagens = "";
    if (provedorDeImagens === 'unsplash') {
        regraImagens = `
=== SISTEMA DE MÍDIA GRATUITA (UNSPLASH) ===
🚨 ATENÇÃO: NÃO USE PLACEHOLDERS COMO [UNSPLASH]. Use OBRIGATORIAMENTE a tag <img> com o atributo data-tema="palavra1,palavra2" em inglês. O nosso sistema frontend fará a hidratação das imagens em alta velocidade.
`;
    } else {
        regraImagens = `
=== SISTEMA DE GERAÇÃO DE MÍDIA POR IA (GEMINI IMAGE ECONÔMICO) ===
🚨 REGRA ABSOLUTA: Para QUALQUER imagem gerada ou modificada, você DEVE utilizar exclusivamente a tag de IA do Gemini.
Sintaxe exata: src="[IMAGEM_IA: prompt_detalhado_em_ingles]"
`;
    }

    // === SISTEMA INTELIGENTE DE MENUS E ÂNCORAS (ROLAGEM SUAVE) ===
    const regraMenu = `
=== REGRAS DE NAVEGAÇÃO E MENUS (OBRIGATÓRIO) ===
Se o layout exigir um menu de navegação, ele DEVE ser feito com links de âncora internos.
1. No Botão/Link (Gatilho): Use o atributo href começando com hashtag e o target exato. Ex: <a href="#quem-somos" target="_self">Quem Somos</a>
2. Na Seção (Alvo): A seção OBRIGATORIAMENTE precisa ter o mesmo ID. Ex: <section id="quem-somos" class="...">
3. A tag principal do documento DEVE incluir a rolagem suave do Tailwind. Ex: <html lang="pt-BR" class="scroll-smooth">
NUNCA crie links redirecionando para outras páginas (ex: href="/contato"). Tudo deve ser resolvido na mesma Landing Page.
    `;
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES (AOS): Adicione data-aos=\"fade-up\" nas tags estruturais principais.";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES (AOS): OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism (bg-white/10 backdrop-blur-md) e hover:scale-105 nos botões.";

    let regrasObrigatorias = "";
    if (isSiteRefinement) {
        regrasObrigatorias = `=== REGRA DE REFATORAÇÃO GLOBAL (MODIFICAÇÃO CIRÚRGICA) ===
🚨 ATENÇÃO MÁXIMA: Você receberá o código HTML completo do site atual.
1. Cumpra a solicitação do usuário realizando as mudanças exatas no HTML.
2. DEVOLVA TODO O CÓDIGO HTML DE PONTA A PONTA. 
3. É EXPRESSAMENTE PROIBIDO CORTAR, RESUMIR OU USAR PLACEHOLDERS COMO "<!-- resto do código aqui -->". Se cortar o código, o site será corrompido!
4. Mantenha todas as seções, classes e IDs como estão, mudando APENAS o pedido.
5. Retorne EXCLUSIVAMENTE um JSON contendo a chave "codigo_html".
${regraMenu}
${regraImagens}`;
    } else if (isElementRefinement || isBlockRefinement) {
        regrasObrigatorias = `=== MICRO-OTIMIZAÇÃO DE ELEMENTO ===
🚨 ATENÇÃO: Você receberá o HTML de APENAS UM elemento.
1. Aplique a modificação pedida com exatidão.
2. PRESERVE OBRIGATORIAMENTE o atributo 'id' original do elemento (ex: id="node_xxxxx").
3. Retorne EXCLUSIVAMENTE a tag HTML final otimizada em um JSON com a chave "codigo_html".
${regraImagens}`;
    } else {
        regrasObrigatorias = `
=== REGRA DE OURO 1: ARQUITETURA E ESPAÇAMENTO ===
Retorne EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ATENÇÃO: GERE UMA LANDING PAGE PROFISSIONAL COM NO MÍNIMO 7 SEÇÕES.
🚨 ATENÇÃO: Usar o tamanho das fontes dos textos ideal para mobile também, use fontes no tamanho que seja legível e não muito pequenas.
🚨 ATENÇÃO: A descrição sobre o autor sempre deve ser feita numa seção exclusiva  e mais profinal do site. Nunca coloque o autor embaixo de uma imagem no inicio do site.
🚨 ESPAÇAMENTO OBRIGATÓRIO: Organize o layout para que os títulos dos tópicos tenham EXATAMENTE O ESPAÇO DE UMA LINHA entre eles e os parágrafos.
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

    for (const modelName of modelosDeTextoParaUsar) {
        if (geracaoSucesso) break; 
        for (let tentativa = 1; tentativa <= 2; tentativa++) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: systemInstructionFinal, safetySettings });
                const result = await model.generateContent({ 
                    contents: [{ role: "user", parts: promptParts }], 
                    generationConfig: { temperature: isSiteRefinement ? 0.2 : 0.4 } 
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
                console.error(`Falha no modelo ${modelName} (tentativa ${tentativa}):`, error);
            }
        }
    }

    if (!geracaoSucesso) throw new Error("A IA falhou em gerar o conteúdo ou recusou o comando. Verifique o prompt ou a validade da chave.");

    if (geracaoSucesso && !isAdmin && isUsingCredits && userId) {
        try { await supabaseAdmin.from('profiles').update({ credits: userCredits - CUSTO_POR_ACAO }).eq('id', userId); } 
        catch (e) {}
    }

    // =========================================================================
    // INTEGRAÇÃO SUPABASE STORAGE E LIMPEZA DE TAGS
    // =========================================================================
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
            let urlImagemBucket = '';

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
                                const base64Data = part.inlineData.data;
                                const mimeType = part.inlineData.mimeType || 'image/jpeg';
                                const buffer = Buffer.from(base64Data, 'base64');
                                const fileName = `ai_img_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

                                const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
                                    .from('imagens-geradas') 
                                    .upload(fileName, buffer, {
                                        contentType: mimeType,
                                        upsert: false
                                    });

                                if (uploadErr) {
                                    throw new Error("Falha ao salvar a imagem na nuvem.");
                                }

                                const { data: pubData } = supabaseAdmin.storage.from('imagens-geradas').getPublicUrl(fileName);
                                urlImagemBucket = pubData.publicUrl;
                                imagemGeradaComSucesso = true;
                                break;
                            }
                        }
                    }
                } catch (modelErr: any) {}
            }

            if (imagemGeradaComSucesso && urlImagemBucket) {
                htmlCode = htmlCode.replace(item.fullMatch, urlImagemBucket);
            } else {
                // Se a API do cliente falhar em gerar a imagem, coloca o placeholder e salva o site
                const placeholderUrl = `https://placehold.co/800x600/152246/E0DACB?text=` + encodeURIComponent("Imagem IA Omitida");
                htmlCode = htmlCode.replace(item.fullMatch, placeholderUrl);
            }
        }
    } else {
        htmlCode = htmlCode.replace(/\[UNSPLASH:[^\]]+\]/g, '');
    }
    
    // Limpeza de segurança final
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