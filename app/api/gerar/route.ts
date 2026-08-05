import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle } = body;

    const anoAtual = new Date().getFullYear();

    // LÓGICA DINÂMICA DO ESTILO DE IMAGEM
    let regraImagens = "- REGRA ABSOLUTA DE IMAGENS: Não use desenhos, animações, gráficos ou ficção científica. Apenas fotografias humanas e cenários reais.";
    if (imageStyle === 'ilustracao') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo ILUSTRAÇÃO. Gere palavras-chave focadas em ilustrações, vetores, 3d render, minimal art ou digital painting.";
    } else if (imageStyle === 'tecnologia') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo TECNOLOGIA. Gere palavras-chave focadas em tecnologia, cyber, data, sci-fi, futurismo e abstrato.";
    }

    const regrasObrigatorias = `
=== REGRAS OBRIGATÓRIAS DE DESIGN SÊNIOR, COMPLIANCE E UI/UX ===
1. ESTRUTURA E ESPAÇAMENTO PREMIUM:
- CSS Global: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
- ESPAÇAMENTO ESTRITO: Organize o layout para que os títulos dos tópicos tenham sempre um espaço exato de uma linha em branco entre eles e os parágrafos subsequentes.
- ÍCONES: NUNCA USE EMOJIS (🚫). É terminantemente proibido. Use exclusivamente a biblioteca FontAwesome (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">).

2. IMAGENS IDEAIS E PLACEHOLDERS:
- Para imagens, utilize placeholders no formato: https://images.unsplash.com/random/1200x800/?{palavra-chave_em_ingles}
${regraImagens}
- TAMANHO IDEAL: Aplique classes Tailwind: "w-full max-w-2xl mx-auto h-auto object-cover rounded-xl shadow-lg". NUNCA coloque style="width: 70%" inline.

3. COMPLIANCE E RODAPÉ (SANFONA INTERNA):
- COPYRIGHT DINÂMICO: Exiba obrigatoriamente "© ${anoAtual} Todos os direitos reservados."
- LINKS JURÍDICOS: O rodapé deve usar o modelo visual abaixo, mas APONTANDO PARA ÂNCORAS INTERNAS na própria página. NUNCA aponte para sites externos.
<!-- Modelo do Rodapé -->
<div class="flex flex-wrap justify-center gap-4 md:gap-8 text-xs text-gray-500 mb-6">
    <a href="#privacidade" class="hover:text-white transition-colors underline decoration-gray-700 underline-offset-4">Política de Privacidade</a>
    <a href="#termos" class="hover:text-white transition-colors underline decoration-gray-700 underline-offset-4">Termos de Uso</a>
    <a href="#cookies" class="hover:text-white transition-colors underline decoration-gray-700 underline-offset-4">Política de Cookies</a>
</div>
- SANFONA (ACCORDION) OBRIGATÓRIA: Imediatamente ANTES do rodapé, você DEVE gerar uma seção com os conteúdos jurídicos em formato de sanfona expansível. Use as tags <details> e <summary> nativas do HTML5. Cada tag <details> deve conter o id correspondente (id="privacidade", id="termos", id="cookies") para que os links do rodapé funcionem na mesma página sem abrir páginas extras.

4. NAVEGAÇÃO E CONVERSÃO:
- Proibido uso de <form>. Utilize botões diretos de ação/WhatsApp.
`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;

    let htmlCode = '';
    let provedorTextoUsado = '';

    // =========================================================================
    // TENTATIVA 1: GOOGLE GEMINI
    // =========================================================================
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
          systemInstruction: { role: "system", parts: [{ text: systemInstructionFinal }] }
        });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: promptParts }],
          generationConfig: { responseMimeType: "application/json" }
        });

        const responseText = result.response.text();
        htmlCode = extrairHtmlDeJson(responseText);
        provedorTextoUsado = 'Google Gemini';
      } catch (err) {
        console.warn("Gemini falhou ou atingiu limite. Pulo para o próximo provedor...");
      }
    }

    // =========================================================================
    // TENTATIVA 2: GROQ (LLAMA 3.3 70B) - BACKUP RÁPIDO
    // =========================================================================
    if (!htmlCode && process.env.GROQ_API_KEY) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemInstructionFinal + "\nRetorne um JSON estrito no formato {\"codigo_html\": \"...\"}" },
              { role: 'user', content: JSON.stringify(promptParts) }
            ],
            response_format: { type: "json_object" }
          })
        });

        const groqData = await groqRes.json();
        if (groqData.choices && groqData.choices[0]?.message?.content) {
          htmlCode = extrairHtmlDeJson(groqData.choices[0].message.content);
          provedorTextoUsado = 'Groq (Llama 3.3 70B)';
        }
      } catch (err) {
        console.warn("Groq falhou. Pulo para o próximo provedor...");
      }
    }

    // =========================================================================
    // TENTATIVA 3: OPENROUTER (QWEN 2.5 CODER FREE) - BACKUP FINAL
    // =========================================================================
    if (!htmlCode && process.env.OPENROUTER_API_KEY) {
      try {
        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'qwen/qwen-2.5-coder-32b-instruct:free',
            messages: [
              { role: 'system', content: systemInstructionFinal + "\nRetorne um JSON estrito com chave codigo_html." },
              { role: 'user', content: JSON.stringify(promptParts) }
            ]
          })
        });

        const openData = await openRouterRes.json();
        if (openData.choices && openData.choices[0]?.message?.content) {
          htmlCode = extrairHtmlDeJson(openData.choices[0].message.content);
          provedorTextoUsado = 'OpenRouter (Qwen Coder)';
        }
      } catch (err) {
        console.warn("OpenRouter falhou.");
      }
    }

    if (!htmlCode) {
      throw new Error("Todas as APIs de IA de texto falharam ou estão sem chaves configuradas.");
    }

    // =========================================================================
    // SISTEMA ROTATIVO DE IMAGENS (FALLBACK IMAGEM POR IMAGEM)
    // =========================================================================
    let provedorImagemUsado = 'Sem imagens';
    const regexUnsplash = /https:\/\/images\.unsplash\.com\/random\/1200x800\/\?([^"&<>\s]+)/g;
    let match;
    const urlsToReplace = [];

    while ((match = regexUnsplash.exec(htmlCode)) !== null) {
      urlsToReplace.push({ fullMatch: match[0], keyword: match[1] });
    }

    if (urlsToReplace.length > 0) {
      let unsplashUsado = false;
      let flickrUsado = false;

      for (const item of urlsToReplace) {
        let imagemEncontrada = false;

        // 1. TENTA UNSPLASH PRIMEIRO
        if (process.env.UNSPLASH_API_KEY) {
          try {
            const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${item.keyword}&per_page=15&orientation=landscape&client_id=${process.env.UNSPLASH_API_KEY}`);
            
            // Verifica se a API respondeu 200 OK (não estourou limite)
            if (unsplashRes.ok) {
              const uData = await unsplashRes.json();
              // Verifica se encontrou alguma imagem com essa palavra
              if (uData.results && uData.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * uData.results.length);
                htmlCode = htmlCode.replace(item.fullMatch, uData.results[randomIndex].urls.regular);
                imagemEncontrada = true;
                unsplashUsado = true;
              }
            }
          } catch (e) {
            // Falhou a requisição (cai pro fallback abaixo)
          }
        }

        // 2. FALLBACK IMEDIATO: SE UNSPLASH FALHOU NESSA IMAGEM, ACIONA O FLICKR
        if (!imagemEncontrada) {
          const keywordLimpa = encodeURIComponent(item.keyword.split(',')[0]);
          const lockId = Math.floor(Math.random() * 9999);
          const flickrUrl = `https://loremflickr.com/1200/800/${keywordLimpa}?lock=${lockId}`;
          htmlCode = htmlCode.replace(item.fullMatch, flickrUrl);
          flickrUsado = true;
        }
      }

      // DEFINE O STATUS PRO PAINEL
      if (unsplashUsado && flickrUsado) {
        provedorImagemUsado = 'Unsplash + Flickr (Misto)';
      } else if (unsplashUsado) {
        provedorImagemUsado = 'Unsplash API (Premium)';
      } else if (flickrUsado) {
        provedorImagemUsado = 'LoremFlickr (Backup Seguro)';
      }
    }

    return NextResponse.json({
      success: true,
      html: htmlCode,
      provedorTexto: provedorTextoUsado,
      provedorImagem: provedorImagemUsado
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro interno." }, { status: 500 });
  }
}

// FUNÇÕES AUXILIARES DE TRATAMENTO
function extrairHtmlDeJson(responseText: string): string {
  let htmlCode = '';
  try {
    const json = JSON.parse(responseText);
    htmlCode = json.codigo_html || json.html || Object.values(json)[0];
  } catch (e) {
    htmlCode = responseText;
  }
  const doctypeIndex = htmlCode.toLowerCase().indexOf('<!doctype html>');
  if (doctypeIndex !== -1) htmlCode = htmlCode.substring(doctypeIndex);
  return htmlCode.replace(/```html/i, '').replace(/```/g, '').trim();
}