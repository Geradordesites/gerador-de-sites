import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// 1. MODELOS DE TEXTO PARA API GRÁTIS OU CHAVE DO CLIENTE (6 Modelos)
const MODELOS_TEXTO_GRATIS = [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3-flash-preview",
    "gemini-2.5-flash"
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

<<<<<<< HEAD
=======
    // === ATUALIZAÇÃO: REGRA DE MENU E ÂNCORAS (TARGET="_SELF") INSERIDA AQUI ===
    let regraMenu = "";
    if (textoDoPrompt.includes("OBRIGATORIAMENTE deve conter um Menu Superior")) {
        regraMenu = `🚨 REGRA FATAL E NAVEGAÇÃO DO MENU: 
O HTML DEVE OBRIGATORIAMENTE INICIAR COM UMA TAG <nav> CONTENDO UM MENU FIXO, LOGOTIPO, LINKS DE ÂNCORA E UM BOTÃO CTA. SE VOCÊ NÃO CRIAR O MENU, O SISTEMA IRÁ FALHAR.

💡 REGRA OBRIGATÓRIA DE ÂNCORAS (COMPATIBILIDADE COM GOOGLE SITES/IFRAMES):
1. No Botão do Menu (O Gatilho): Use o atributo href começando com uma hashtag (#) seguida do nome do destino, e OBRIGATORIAMENTE inclua o atributo target="_self".
Exemplo de Código: <a href="#quem-somos" target="_self">Quem Somos</a>
2. Na Seção de Destino (O Alvo): Use o atributo id com exatamente o mesmo nome (sem a hashtag).
Exemplo de Código: <section id="quem-somos" class="section bg-white">
Isso garante que ao clicar na âncora, o navegador procure o elemento com o id correspondente e role a tela até ele automaticamente dentro do mesmo ambiente, sem abrir novas janelas.`;
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

=== COMPLIANCE: RODAPÉ JURÍDICO E CORES HARMONIOSAS ===
🚨 REGRA VITAL DE CORES: O rodapé DEVE OBRIGATORIAMENTE utilizar as exatas MESMAS CORES de fundo e de texto do restante do site. É ESTRITAMENTE PROIBIDO gerar rodapés neutros, azuis ou escuros se o site tiver outra identidade. Mantenha a harmonia de 100%.

Estrutura OBRIGATÓRIA do rodapé (Ajuste o Tailwind para combinar com a paleta do site):
<footer class="w-full font-sans py-16 mt-12 border-t">
    <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-10"><h3 class="text-xl font-bold mb-4">Informações Legais Importantes</h3><p class="text-sm">Clique nos links abaixo para ler a íntegra de cada política.</p></div>
        <div class="space-y-4 max-w-4xl mx-auto mb-12" id="rodape-sanfonas">
            <details id="det-privacidade" class="rounded-2xl border transition-colors cursor-pointer" onclick="const e = document.getElementById('det-termos'); if(e.hasAttribute('open')) { e.removeAttribute('open'); }">
                <summary class="p-6 font-bold text-lg outline-none select-none flex items-center justify-between">Política de Privacidade <i class="fas fa-chevron-down text-sm opacity-60"></i></summary>
                <div class="p-6 pt-2 text-sm leading-relaxed border-t opacity-90"><p class="mb-4"><strong>1. Coleta e Uso de Dados:</strong> Em conformidade com a LGPD, coletamos informações de navegação exclusivamente para otimizar sua experiência neste site e melhorar o direcionamento dos nossos anúncios.</p><p class="mb-4"><strong>2. Segurança:</strong> Seus dados de pagamento (se houver transação) são processados diretamente pelas plataformas de pagamento certificadas. Nós não temos acesso aos dados do seu cartão.</p><p><strong>3. Contato:</strong> Para requisições de exclusão de dados ou dúvidas legais, utilize nosso e-mail oficial de suporte.</p></div>
            </details>
            <details id="det-termos" class="rounded-2xl border transition-colors cursor-pointer" onclick="const e = document.getElementById('det-privacidade'); if(e.hasAttribute('open')) { e.removeAttribute('open'); }">
                <summary class="p-6 font-bold text-lg outline-none select-none flex items-center justify-between">Termos de Uso <i class="fas fa-chevron-down text-sm opacity-60"></i></summary>
                <div class="p-6 pt-2 text-sm leading-relaxed border-t opacity-90"><p class="mb-4"><strong>1. Isenção de Responsabilidade:</strong> Os resultados obtidos dependem do esforço individual de cada usuário e da correta aplicação do método. Casos de sucesso relatados não configuram garantia de ganhos idênticos.</p><p class="mb-4"><strong>2. Redes Sociais:</strong> Este portal não é endossado, administrado ou patrocinado por plataformas de terceiros.</p><p><strong>3. Direitos Autorais:</strong> É terminantemente proibida a cópia, pirataria, rateio ou distribuição ilegal de qualquer conteúdo desta página sob pena de processos judiciais severos.</p></div>
            </details>
        </div>
        <div class="text-center pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"><p class="font-medium tracking-wide text-sm">&copy; ${anoAtual} Todos os direitos reservados.</p><div class="flex gap-4 text-xl opacity-80"><i class="fab fa-cc-visa"></i><i class="fab fa-cc-mastercard"></i><i class="fas fa-lock"></i></div></div>
    </div>
    <script>document.querySelectorAll('#rodape-sanfonas summary').forEach(s => { s.style.listStyle = 'none'; if(s.childNodes[0] && s.childNodes[0].nodeName === "#text" && s.childNodes[0].nodeValue.includes('▶')) s.childNodes[0].nodeValue = ''; });</script>
</footer>
`;
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    
>>>>>>> aa1c495 (aaa)
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
