import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const MODELOS_GEMINI = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview"
];

// TABELA DE PREÇOS / CUSTO DE CRÉDITOS POR AÇÃO
const CUSTOS = {
    GERACAO_COMPLETA: 20,   // Criar site do zero
    REFINAMENTO_GLOBAL: 10, // Modificar estrutura global
    REFINAMENTO_ELEMENTO: 2 // Modificar elemento ou bloco isolado
};

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

    let regraMenu = "";
    if (textoDoPrompt.includes("OBRIGATORIAMENTE deve conter um Menu Superior")) {
        regraMenu = "🚨 REGRA FATAL: O HTML DEVE OBRIGATORIAMENTE INICIAR COM UMA TAG <nav> CONTENDO UM MENU FIXO, LOGOTIPO, LINKS DE ÂNCORA E UM BOTÃO CTA. SE VOCÊ NÃO CRIAR O MENU, O SISTEMA IRÁ FALHAR.";
    } else if (textoDoPrompt.includes("NÃO crie menu")) {
        regraMenu = "🚨 REGRA FATAL: É TOTALMENTE PROIBIDO CRIAR MENU OU TAG <nav>. O site deve começar diretamente no conteúdo (Hero Section).";
    }

    const regraImagens = `
=== SISTEMA DE MÍDIA PROFISSIONAL EXCLUSIVO (UNSPLASH API) ===
🚨 REGRA ABSOLUTA: É ESTRITAMENTE PROIBIDO usar links reais de imagens, loremflickr, desenhos, vetores ou ilustrações sci-fi.
Você DEVE utilizar a nossa tag de requisição para TODAS as imagens geradas. Use APENAS fotografias realistas de humanos em situações cotidianas ou de negócios.
Sintaxe exata: src="[UNSPLASH: resolucao: keywords_em_ingles]"

Tamanhos Obrigatórios de Resolução:
- 1280x720 (Paisagem/Landscape): Para fundos largos, Hero Section e Banners.
- 800x1200 (Retrato/Portrait): Para fotos de pessoas, equipe, mentores ou cards verticais.
- 800x800 (Quadrado/Squarish): Para ícones, logos, serviços ou avatares pequenos.
Keywords: Use 2 ou 3 palavras altamente precisas em inglês para definir o contexto.
Exemplo: <img src="[UNSPLASH: 800x1200: confident business professional]" class="w-full h-auto object-cover rounded-xl shadow-lg" alt="Profissional" />
`;
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES (AOS): Adicione data-aos=\"fade-up\" nas tags estruturais principais (<section>, <header>, <div> principais).";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES (AOS): OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism (bg-white/10 backdrop-blur-md) e hover:scale-105 nos botões.";

    let regrasObrigatorias = "";
    if (isSiteRefinement) {
        regrasObrigatorias = `=== REGRA DE REFATORAÇÃO GLOBAL ===\nModifique APENAS o que foi pedido pelo usuário e devolva TODO o código HTML estruturado no JSON. NÃO CORTE O CÓDIGO DO SITE.`;
    } else if (isElementRefinement || isBlockRefinement) {
        regrasObrigatorias = `=== MICRO-OTIMIZAÇÃO ===\nDevolva APENAS a Tag HTML do elemento fornecido perfeitamente otimizado, dentro do JSON. Sem explicações adicionais.`;
    } else {
        regrasObrigatorias = `
=== REGRA DE OURO 1: ARQUITETURA LONGA E COMPLETA ===
Retorne EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ATENÇÃO: GERE UMA LANDING PAGE EXTENSA E PROFISSIONAL COM NO MÍNIMO 6 SEÇÕES. NÃO corte o código pela metade. O valor DEVE conter do <!DOCTYPE html> até o fechamento </html>.
Force o espaçamento de UMA LINHA inteira entre títulos e parágrafos ('mb-4' ou 'mb-6').

🚨 PROIBIÇÃO DE FORMULÁRIOS: É ESTRITAMENTE PROIBIDO gerar formulários, campos de captura, tags <form>, <input> ou <textarea> no corpo. Use APENAS Botões de Ação (CTA) diretos.

${regraMenu}

=== REGRA DE OURO 2: MOBILE-FIRST RESPONSIVO ===
O site DEVE ser perfeito no celular. Use flex-col para empilhar no celular e md:flex-row para parear no PC.
${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE: RODAPÉ JURÍDICO EM SANFONA ===
Sempre finalize o </body> com um rodapé estruturado profissionalmente utilizando a mesma identidade visual, paleta de cores e harmonia estética do restante do site gerado (nunca utilize cores fixas que destoem do tema). Ele deve conter obrigatoriamente as sanfonas (details/summary) interativas contendo Termos de Uso e Política de Privacidade reais e detalhados.
`;
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    
    // === LÓGICA DE SEPARAÇÃO FINANCEIRA E DE CHAVES ===
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: settings } = await supabaseAdmin.from('system_settings').select('*').eq('id', 'global').single();
    
    let isByokEnabled = settings?.byok_enabled ?? true;
    const isAdminKeyEnabled = settings?.admin_paid_key_enabled ?? true;

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

    // DEFINIÇÃO DO CUSTO DA AÇÃO ATUAL
    let custoOperacao = CUSTOS.GERACAO_COMPLETA;
    if (isSiteRefinement) custoOperacao = CUSTOS.REFINAMENTO_GLOBAL;
    else if (isElementRefinement || isBlockRefinement) custoOperacao = CUSTOS.REFINAMENTO_ELEMENTO;

    const chavePropriaAutorizada = isByokEnabled || userByokAllowed;
    let chaveParaUsar = "";
    let isUsingCredits = false;

    if (isAdmin) {
        // ADMIN: Usa sempre a chave pessoal de testes de graça
        chaveParaUsar = process.env.GEMINI_API_KEY!;
    } else if (chavePropriaAutorizada && clientApiKey && clientApiKey.length > 10) {
        // MODO MENSALIDADE (CHAVE PRÓPRIA DO CLIENTE): Checa validade e NÃO gasta créditos
        if (!userPlanExpiration || userPlanExpiration < new Date()) {
            throw new Error("Sua assinatura mensal expirou. Renove para continuar utilizando sua chave própria.");
        }
        chaveParaUsar = clientApiKey;
    } else if (allowAdminTestKey) {
        // MODO TESTE ADMIN: Usa a chave admin do sistema, mas DESCONTA os créditos do cliente
        if (userCredits < custoOperacao) {
            throw new Error(`Saldo insuficiente: Esta operação requer ${custoOperacao} créditos. Você tem apenas ${userCredits}.`);
        }
        isUsingCredits = true;
        chaveParaUsar = process.env.GEMINI_API_KEY!;
    } else {
        // MODO PAGO OFICIAL (CRÉDITOS COM CHAVE CENTRAL PAGA)
        if (userCredits < custoOperacao) {
            throw new Error(`Saldo insuficiente: Esta operação requer ${custoOperacao} créditos. Você tem apenas ${userCredits}. Adquira mais créditos.`);
        }
        isUsingCredits = true;
        if (isAdminKeyEnabled && process.env.GEMINI_API_KEY_CLIENTES) {
            chaveParaUsar = process.env.GEMINI_API_KEY_CLIENTES;
        } else {
            throw new Error("Geração bloqueada: O Administrador ainda não configurou a API Paga centralizada.");
        }
    }

    const genAI = new GoogleGenerativeAI(chaveParaUsar);
    let htmlCode = '';
    let provedorTextoUsado = '';
    let geracaoSucesso = false;
    let historicoErros: any[] = [];

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
                historicoErros.push({ modelo: modelName, tentativa: tentativa, erro: error.message || "Erro desconhecido", hora: new Date().toISOString() });
            }
        }
    }

    if (historicoErros.length > 0) {
        try {
            await supabaseAdmin.from('api_logs').insert([{ modelos_falhos: JSON.stringify(historicoErros, null, 2), sucesso_final: geracaoSucesso, data_hora: new Date().toISOString() }]);
        } catch (e) { console.error("Falha ao gravar log", e); }
    }

    if (!geracaoSucesso) {
        throw new Error("Nossos motores de IA estão temporariamente congestionados devido a alta demanda. Aguarde 30 segundos e tente novamente.");
    }

    // DESCONTO FINANCEIRO DE CRÉDITO VARIÁVEL APÓS SUCESSO
    if (geracaoSucesso && !isAdmin && isUsingCredits && userId) {
        try {
            await supabaseAdmin.from('profiles').update({ credits: userCredits - custoOperacao }).eq('id', userId);
        } catch (e) { console.error("Falha ao descontar crédito", e); }
    }

    if (dinamica && dinamica !== 'estatico' && !isBlockRefinement && !isElementRefinement && !isSiteRefinement) {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (htmlCode.includes('</head>') && !htmlCode.includes('aos.css')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (htmlCode.includes('</body>') && !htmlCode.includes('aos.js')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

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
            } catch (e) { console.log("Falha ao comunicar com Unsplash."); }
            htmlCode = htmlCode.replace(item.fullMatch, imagemFinal);
        }
    } else {
        htmlCode = htmlCode.replace(/\[UNSPLASH:[^\]]+\]/g, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
    }

    htmlCode = htmlCode.replace(/https:\/\/source\.unsplash\.com\/random\/\d+x\d+\/\?([^"&<>\s']+)/g, () => `https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`);

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