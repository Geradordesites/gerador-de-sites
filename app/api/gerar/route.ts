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

3. COMPLIANCE E RODAPÉ (SANFONA INTELIGENTE NOS LINKS):
- NÃO crie seções separadas de "Informações Legais" soltas no meio da página.
- OBRIGATÓRIO: Você DEVE usar EXATAMENTE o código HTML e SCRIPT abaixo no lugar do rodapé. Ele já possui os links com href reais internos exigidos pelo Facebook Ads e a lógica em JavaScript para abrir/fechar as sanfonas de texto abaixo dos links.
<!-- COLE EXATAMENTE ESTE CÓDIGO NO FINAL DA PÁGINA: -->
<footer class="bg-slate-900 text-slate-400 py-12 text-center text-xs mt-12">
    <div class="max-w-4xl mx-auto px-4">
        
        <!-- Links Reais do Rodapé -->
        <div class="flex flex-wrap justify-center gap-6 md:gap-12 mb-6 text-[13px]">
            <a href="#privacidade" onclick="toggleLegal('panel-privacidade', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal('panel-termos', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Termos de Uso</a>
            <a href="#cookies" onclick="toggleLegal('panel-cookies', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Política de Cookies</a>
        </div>

        <!-- Paineis de Sanfona Ocultos (Abrem abaixo dos links) -->
        <div id="legal-panels" class="text-left mb-8 text-slate-300 text-sm hidden bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-inner max-w-3xl mx-auto transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden">
                <h4 class="font-bold text-white mb-4 text-lg">Política de Privacidade</h4>
                <p class="mb-2">Sua privacidade é importante para nós. Coletamos e utilizamos seus dados apenas para fornecer e melhorar nossos serviços, sempre em conformidade com as leis de proteção de dados vigentes (LGPD).</p>
                <p>Não compartilhamos suas informações com terceiros sem o seu consentimento expresso. Seus dados são protegidos por criptografia de ponta a ponta.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden">
                <h4 class="font-bold text-white mb-4 text-lg">Termos de Uso</h4>
                <p class="mb-2">Ao acessar este site, você concorda em cumprir estes termos de serviço e todas as leis e regulamentos aplicáveis. O uso contínuo do site constitui a aceitação destes termos.</p>
                <p>O conteúdo aqui disponibilizado é de propriedade exclusiva e não pode ser reproduzido, copiado ou modificado sem nossa autorização prévia por escrito.</p>
            </div>
            <div id="panel-cookies" class="legal-panel hidden">
                <h4 class="font-bold text-white mb-4 text-lg">Política de Cookies</h4>
                <p class="mb-2">Utilizamos cookies para personalizar conteúdo e anúncios, fornecer recursos de mídia social e analisar nosso tráfego. Isso nos ajuda a oferecer uma experiência otimizada.</p>
                <p>Você pode desativá-los nas configurações do seu navegador a qualquer momento, embora isso possa afetar algumas funcionalidades do site.</p>
            </div>
        </div>
        
        <p>&copy; ${anoAtual} Todos os direitos reservados.</p>
    </div>

    <script>
        function toggleLegal(panelId, event) {
            var container = document.getElementById('legal-panels');
            var panels = document.querySelectorAll('.legal-panel');
            var target = document.getElementById(panelId);
            var isCurrentlyVisible = !target.classList.contains('hidden');
            
            // Fecha todos os painéis abertos
            panels.forEach(function(p) { p.classList.add('hidden'); });
            
            // Se o mesmo link foi clicado, fecha a caixa inteira
            if (isCurrentlyVisible) {
                container.classList.add('hidden');
            } else {
                // Caso contrário, abre a caixa e exibe o texto selecionado
                container.classList.remove('hidden');
                target.classList.remove('hidden');
            }
        }
    </script>
</footer>

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
            
            if (unsplashRes.ok) {
              const uData = await unsplashRes.json();
              if (uData.results && uData.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * uData.results.length);
                htmlCode = htmlCode.replace(item.fullMatch, uData.results[randomIndex].urls.regular);
                imagemEncontrada = true;
                unsplashUsado = true;
              }
            }
          } catch (e) {}
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