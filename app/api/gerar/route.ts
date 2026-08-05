import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica } = body;

    let promptTextoPuro = "";
    if (Array.isArray(promptParts)) {
        promptParts.forEach((part: any) => {
            if (part.text) promptTextoPuro += part.text + "\n\n";
        });
    }

    const anoAtual = new Date().getFullYear();

    let regraImagens = "- REGRA ABSOLUTA DE IMAGENS: Não use NENHUM tipo de desenho, animação ou gráfico. Utilize estrita e exclusivamente FOTOGRAFIAS HUMANAS E CENÁRIOS REAIS.";
    if (imageStyle === 'ilustracao') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo ILUSTRAÇÃO. Gere palavras-chave focadas em ilustrações, vetores, 3D render ou digital painting.";
    } else if (imageStyle === 'tecnologia') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo TECNOLOGIA. Gere palavras-chave focadas em tecnologia, cyber, data e futurismo.";
    }

    let instrucaoDinamica = "";
    if (dinamica === 'suave') {
        instrucaoDinamica = "- ANIMAÇÕES DE SCROLL (AOS): Adicione o atributo data-aos=\"fade-up\" nas tags HTML de seções, textos e imagens.";
    } else if (dinamica === 'impacto') {
        instrucaoDinamica = "- ANIMAÇÕES DE SCROLL (AOS): OBRIGATÓRIO usar data-aos=\"fade-up\" em seções e cards. Use botões com animate-pulse e hover:scale-105.";
    }

    const regrasObrigatorias = `
=== REGRAS ABSOLUTAS DE GERAÇÃO DE CÓDIGO HTML ===
1. FORMATO DE SAÍDA: VOCÊ É PROIBIDO DE RESPONDER COM TEXTOS EXPLICATIVOS OU FRASES DE RESUMO COMO "ESTE LAYOUT FOI RECRIADO". Retorne EXCLUSIVAMENTE um documento HTML completo e funcional em Tailwind CSS dentro do JSON.
2. ESTRUTURA E ESPAÇAMENTO:
- CSS Global obrigatório: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; }
- Espaçamento rigoroso: Mantenha um espaço limpo entre os títulos dos tópicos e os parágrafos.
- Ícones: Use exclusivamente FontAwesome (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">). Nunca use emojis.
${instrucaoDinamica}

3. IMAGENS E PLACEHOLDERS:
- Para tags <img>, use estritamente: https://images.unsplash.com/random/1200x800/?keyword (substitua keyword por uma palavra em inglês relevante, sem chaves).
- Para backgrounds: style="background-image: url('https://images.unsplash.com/random/1200x800/?keyword'); background-size: cover; background-position: center;"
${regraImagens}

4. RODAPÉ JURÍDICO E SANFONA OBRIGATÓRIA:
O site gerado DEVE conter obrigatoriamente este bloco de rodapé no final do código:
<footer class="bg-slate-900 text-slate-400 py-12 text-center text-xs mt-12">
    <div class="max-w-4xl mx-auto px-4">
        <div class="flex flex-wrap justify-center gap-6 md:gap-12 mb-6 text-[13px]">
            <a href="#privacidade" onclick="toggleLegal('panel-privacidade', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal('panel-termos', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Termos de Uso</a>
            <a href="#cookies" onclick="toggleLegal('panel-cookies', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Política de Cookies</a>
        </div>
        <div id="legal-panels" class="text-left mb-8 text-slate-300 text-sm hidden bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-inner max-w-3xl mx-auto transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Política de Privacidade</h4>
                <p>Em conformidade com a LGPD (Lei nº 13.709/2018), garantimos a segurança e confidencialidade dos seus dados coletados em nosso site.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Termos de Uso</h4>
                <p>Ao utilizar nossos serviços, você concorda com nossos termos de propriedade intelectual e condições de uso comercial.</p>
            </div>
            <div id="panel-cookies" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Política de Cookies</h4>
                <p>Utilizamos cookies para otimizar sua experiência de navegação e desempenho de campanhas de tráfego pago.</p>
            </div>
        </div>
        <p>&copy; ${anoAtual} Todos os direitos reservados.</p>
    </div>
    <script>
        function toggleLegal(panelId, event) {
            if(event) event.preventDefault();
            var container = document.getElementById('legal-panels');
            var panels = document.querySelectorAll('.legal-panel');
            var target = document.getElementById(panelId);
            var isVisible = !target.classList.contains('hidden');
            panels.forEach(function(p) { p.classList.add('hidden'); });
            if (isVisible) { container.classList.add('hidden'); } else { container.classList.remove('hidden'); target.classList.remove('hidden'); }
        }
    </script>
</footer>
`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;

    let htmlCode = '';
    let provedorTextoUsado = '';
    let logErros: string[] = [];

    // TENTATIVA 1: GEMINI
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
        htmlCode = extrairHtmlDeJson(result.response.text());
        provedorTextoUsado = 'Google Gemini';
      } catch (err: any) { logErros.push(`Gemini falhou: ${err.message}`); }
    }

    // TENTATIVA 2: GROQ
    if (!htmlCode && process.env.GROQ_API_KEY) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemInstructionFinal + "\nRetorne um JSON estrito contendo a chave \"codigo_html\" com o código HTML completo da página." },
              { role: 'user', content: promptTextoPuro }
            ],
            response_format: { type: "json_object" }
          })
        });
        const groqData = await groqRes.json();
        if (groqData.choices && groqData.choices[0]?.message?.content) {
          htmlCode = extrairHtmlDeJson(groqData.choices[0].message.content);
          provedorTextoUsado = 'Groq (Llama 3.3 70B)';
        }
      } catch (err: any) { logErros.push(`Groq falhou: ${err.message}`); }
    }

    // TENTATIVA 3: OPENROUTER
    if (!htmlCode && process.env.OPENROUTER_API_KEY) {
      try {
        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen/qwen-2.5-coder-32b-instruct:free',
            messages: [
              { role: 'system', content: systemInstructionFinal + "\nRetorne um JSON estrito com a chave \"codigo_html\"." },
              { role: 'user', content: promptTextoPuro }
            ]
          })
        });
        const openData = await openRouterRes.json();
        if (openData.choices && openData.choices[0]?.message?.content) {
          htmlCode = extrairHtmlDeJson(openData.choices[0].message.content);
          provedorTextoUsado = 'OpenRouter (Qwen Coder)';
        }
      } catch (err: any) { logErros.push(`OpenRouter falhou: ${err.message}`); }
    }

    // TRAVA DE SEGURANÇA: Se a IA tentou mandar um texto simples em vez de HTML
    if (!htmlCode || htmlCode.length < 300 || !htmlCode.includes('<html')) {
        throw new Error(`A IA retornou uma resposta inválida ou incompleta. Tente gerar novamente.`);
    }

    // INJEÇÃO DA BIBLIOTECA AOS
    if (dinamica && dinamica !== 'estatico') {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        
        if (!htmlCode.includes('aos.css') && htmlCode.includes('</head>')) {
            htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        }
        if (!htmlCode.includes('AOS.init') && htmlCode.includes('</body>')) {
            htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
        }
    }

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
        const keywordLimpaFormatada = encodeURIComponent(item.keyword.replace(/[{}]/g, '').split(',')[0]);

        if (process.env.UNSPLASH_API_KEY) {
          try {
            const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${keywordLimpaFormatada}&per_page=15&orientation=landscape&client_id=${process.env.UNSPLASH_API_KEY}`);
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

        if (!imagemEncontrada) {
          const lockId = Math.floor(Math.random() * 9999);
          const flickrUrl = `https://loremflickr.com/1200/800/${keywordLimpaFormatada}?lock=${lockId}`;
          htmlCode = htmlCode.replace(item.fullMatch, flickrUrl);
          flickrUsado = true;
        }
      }

      if (unsplashUsado && flickrUsado) provedorImagemUsado = 'Unsplash + Flickr (Misto)';
      else if (unsplashUsado) provedorImagemUsado = 'Unsplash API (Premium)';
      else if (flickrUsado) provedorImagemUsado = 'LoremFlickr (Backup Seguro)';
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

function extrairHtmlDeJson(responseText: string): string {
  let htmlCode = '';
  try {
    const json = JSON.parse(responseText);
    htmlCode = json.codigo_html || json.html || Object.values(json)[0];
  } catch (e) { htmlCode = responseText; }
  const doctypeIndex = htmlCode.toLowerCase().indexOf('<!doctype html>');
  if (doctypeIndex !== -1) htmlCode = htmlCode.substring(doctypeIndex);
  return htmlCode.replace(/```html/i, '').replace(/```/g, '').trim();
}