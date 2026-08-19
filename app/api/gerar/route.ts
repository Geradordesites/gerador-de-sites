import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// LISTA DE MODELOS (ROTAÇÃO AUTOMÁTICA)
// Você pode alterar a ordem, remover ou adicionar novos modelos aqui facilmente.
// O sistema tenta o primeiro; se falhar, tenta o segundo, e assim por diante.
const MODELOS_GEMINI = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview"
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Removida qualquer referência a 'useGroq' ou outras APIs
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
    
    // Junta todo o texto enviado para análise
    for (const part of promptParts) {
        if (part.inlineData) temImagem = true;
        if (part.text) textoDoPrompt += part.text + "\n";
    }

    // 1. DETECTOR INFALÍVEL DE MENU
    let regraMenu = "";
    if (textoDoPrompt.includes("OBRIGATORIAMENTE deve conter um Menu Superior")) {
        regraMenu = "🚨 REGRA FATAL: O HTML DEVE OBRIGATORIAMENTE INICIAR COM UMA TAG <nav> CONTENDO UM MENU FIXO, LOGOTIPO, LINKS DE ÂNCORA E UM BOTÃO CTA. SE VOCÊ NÃO CRIAR O MENU, O SISTEMA IRÁ FALHAR.";
    } else if (textoDoPrompt.includes("NÃO crie menu")) {
        regraMenu = "🚨 REGRA FATAL: É TOTALMENTE PROIBIDO CRIAR MENU OU TAG <nav>. O site deve começar diretamente no conteúdo (Hero Section).";
    }

    // 2. DIRETRIZ DE MÍDIA PROFISSIONAL
    const regraImagens = `
=== SISTEMA DE MÍDIA PROFISSIONAL EXCLUSIVO (UNSPLASH API) ===
🚨 REGRA ABSOLUTA: É ESTRITAMENTE PROIBIDO usar links reais de imagens, loremflickr, ou tags genéricas.
Você DEVE utilizar a nossa tag de requisição para TODAS as imagens geradas.
Sintaxe exata: src="[UNSPLASH: resolucao: keywords_em_ingles]"

Tamanhos Obrigatórios de Resolução:
- 1280x720 (Paisagem/Landscape): Para fundos largos, Hero Section e Banners.
- 800x1200 (Retrato/Portrait): Para fotos de pessoas, equipe, mentores ou cards verticais.
- 800x800 (Quadrado/Squarish): Para ícones, logos, serviços ou avatares pequenos.

Keywords: Use 2 ou 3 palavras altamente precisas em inglês para definir o contexto (ex: business meeting, confident therapist, modern clinic).
Exemplo: <img src="[UNSPLASH: 800x1200: confident business woman]" class="w-full h-auto object-cover rounded-xl shadow-lg" alt="Profissional" />
`;
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES (AOS): Adicione data-aos=\"fade-up\" nas tags estruturais principais (<section>, <header>, <div> principais).";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES (AOS): OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism (bg-white/10 backdrop-blur-md) e hover:scale-105 nos botões.";

    let regrasObrigatorias = "";
    
    if (isSiteRefinement) {
        regrasObrigatorias = `=== REGRA DE REFATORAÇÃO GLOBAL ===\nModifique APENAS o que foi pedido pelo usuário e devolva TODO o código HTML estruturado no JSON. NÃO CORTE O CÓDIGO DO SITE.`;
    } else if (isElementRefinement) {
        regrasObrigatorias = `=== MICRO-OTIMIZAÇÃO ===\nDevolva APENAS a Tag HTML do elemento fornecido perfeitamente otimizado, dentro do JSON. Sem explicações adicionais.`;
    } else {
        regrasObrigatorias = `
=== REGRA DE OURO 1: ARQUITETURA LONGA E COMPLETA ===
Retorne EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ATENÇÃO: GERE UMA LANDING PAGE EXTENSA E PROFISSIONAL COM NO MÍNIMO 6 SEÇÕES (Ex: Hero, Dores/Problemas, Benefícios, Sobre o Especialista, Prova Social/Depoimentos, CTA Final, FAQ). NÃO faça um site curto. NÃO corte o código pela metade. O valor DEVE conter do <!DOCTYPE html> até o fechamento </html>.
Force o espaçamento de UMA LINHA inteira entre títulos e parágrafos ('mb-4' ou 'mb-6').

${regraMenu}

=== REGRA DE OURO 2: MOBILE-FIRST RESPONSIVO ===
O site DEVE ser perfeito no celular. Use flex-col para empilhar no celular e md:flex-row para parear no PC. Espaçamentos menores no mobile (p-4, py-10) e maiores no desktop (md:p-8, lg:py-20). Menus devem quebrar adequadamente.

${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE: RODAPÉ JURÍDICO FUNCIONAL ===
Sempre finalize o </body> com este exato rodapé, copiando letra por letra:
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
    
    // VARIÁVEIS DE CONTROLE DA ROTAÇÃO
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    let htmlCode = '';
    let provedorTextoUsado = '';
    let geracaoSucesso = false;
    let historicoErros: any[] = [];

    // LÓGICA DE ROTAÇÃO DOS MODELOS GEMINI
    for (const modelName of MODELOS_GEMINI) {
        if (geracaoSucesso) break; // Se já gerou com sucesso, ignora o resto da lista

        // 2 REQUISIÇÕES (TENTATIVAS) MÁXIMAS POR CADA MODELO
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
                    break; // Sai do loop de tentativas deste modelo específico
                } else {
                    throw new Error("HTML gerado foi bloqueado, está muito curto ou inválido.");
                }
            } catch (error: any) {
                // Registra o erro de forma invisível para o cliente
                historicoErros.push({
                    modelo: modelName,
                    tentativa: tentativa,
                    erro: error.message || "Erro desconhecido",
                    hora: new Date().toISOString()
                });
            }
        }
    }

    // REGISTRO DE ERROS NO SEU ADMIN (SUPABASE)
    // Se ocorreram falhas (mesmo que o último modelo tenha salvado o dia), nós logamos
    if (historicoErros.length > 0) {
        try {
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!, 
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            await supabaseAdmin.from('api_logs').insert([{
                modelos_falhos: JSON.stringify(historicoErros, null, 2),
                sucesso_final: geracaoSucesso,
                data_hora: new Date().toISOString()
            }]);
        } catch (e) {
            console.error("Falha ao gravar no Supabase", e);
        }
    }

    // A MENSAGEM QUE O CLIENTE VÊ SE TUDO FALHAR
    if (!geracaoSucesso) {
        throw new Error("Nossos motores de Inteligência Artificial estão temporariamente congestionados devido a alta demanda. Por favor, aguarde 30 segundos e tente gerar novamente.");
    }

    // Injeta scripts de animação caso não existam
    if (dinamica && dinamica !== 'estatico' && !isBlockRefinement && !isElementRefinement && !isSiteRefinement) {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (htmlCode.includes('</head>') && !htmlCode.includes('aos.css')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (htmlCode.includes('</body>') && !htmlCode.includes('aos.js')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

    // 3. MOTOR DE IMAGENS BLINDADO (Garante busca e inserção via Unsplash)
    const regexImgReq = /\[UNSPLASH:\s*(\d+x\d+)\s*:\s*([^\]]+)\]/g;
    let match;
    let urlsToReplace = [];
    
    while ((match = regexImgReq.exec(htmlCode)) !== null) {
        urlsToReplace.push({ fullMatch: match[0], dimensao: match[1], keywords: match[2] });
    }

    if (urlsToReplace.length > 0 && process.env.UNSPLASH_API_KEY) {
        for (const item of urlsToReplace) {
            let orient = 'landscape';
            if (item.dimensao === '800x1200') orient = 'portrait';
            if (item.dimensao === '800x800') orient = 'squarish';
            
            const kwFormatada = encodeURIComponent(item.keywords.trim());
            
            // Link genérico super profissional de segurança
            let imagemFinal = `https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`; 

            try {
                // Busca em alta definição na Unsplash
                const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${kwFormatada}&per_page=10&orientation=${orient}&client_id=${process.env.UNSPLASH_API_KEY}`);
                if (uRes.ok) {
                    const uData = await uRes.json();
                    if (uData.results && uData.results.length > 0) {
                        imagemFinal = uData.results[Math.floor(Math.random() * uData.results.length)].urls.regular;
                    }
                }
            } catch (e) {
                console.log("Falha ao comunicar com Unsplash API.");
            }
            // Injeta a foto perfeita no código
            htmlCode = htmlCode.replace(item.fullMatch, imagemFinal);
        }
    } else {
        // Fallback de limpeza caso a API key não exista
        htmlCode = htmlCode.replace(/\[UNSPLASH:[^\]]+\]/g, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
    }

    // Corrige qualquer alucinação em que a IA tenta colocar um link fake da Unsplash diretamente
    htmlCode = htmlCode.replace(/https:\/\/source\.unsplash\.com\/random\/\d+x\d+\/\?([^"&<>\s']+)/g, (match, keyword) => {
        return `https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`;
    });

    return NextResponse.json({ success: true, html: htmlCode, provedorTexto: provedorTextoUsado });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// O NOVO EXTRATOR BLINDADO (Impede que a resposta da IA quebre a tela se tiver caracteres estranhos)
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