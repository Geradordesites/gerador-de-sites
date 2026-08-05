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

    let regraImagens = "- REGRA ABSOLUTA DE IMAGENS: Não use NENHUM tipo de desenho, animação, gráfico ou elemento de ficção científica. Utilize estrita e exclusivamente FOTOGRAFIAS HUMANAS E CENÁRIOS REAIS.";
    if (imageStyle === 'ilustracao') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo ILUSTRAÇÃO. Gere palavras-chave focadas em ilustrações, vetores, 3d render, minimal art ou digital painting.";
    } else if (imageStyle === 'tecnologia') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo TECNOLOGIA. Gere palavras-chave focadas em tecnologia, cyber, data, sci-fi, futurismo e abstrato.";
    }

    let instrucaoDinamica = "";
    if (dinamica === 'suave') {
        instrucaoDinamica = `
- ANIMAÇÕES DE SCROLL (AOS): Adicione o atributo data-aos="fade-up" ou data-aos="zoom-in" nas tags HTML de seções, textos e imagens.
- TRANSIÇÕES: Use transições suaves do Tailwind (transition-all duration-500).`;
    } else if (dinamica === 'impacto') {
        instrucaoDinamica = `
- ANIMAÇÕES DE SCROLL (AOS): OBRIGATÓRIO usar atributos data-aos="fade-up", data-aos="fade-right", etc., em todas as seções, textos e imagens.
- BENTO GRID E GLASSMORPHISM: Substitua seções de features por layouts "Bento Grid". Use Glassmorphism (bg-white/10 backdrop-blur-md border border-white/20 shadow-xl).
- TRATAMENTO EDITORIAL NAS FOTOS: Em imagens secundárias, use filtros como grayscale ou mix-blend-overlay.
- BOTÕES MAGNÉTICOS: Todos os botões de ação/compra devem ter animate-pulse, hover:scale-105, hover:shadow-2xl.`;
    }

    const regrasObrigatorias = `
=== REGRA DE OURO: FIDELIDADE VISUAL E CLONAGEM (LEIA ATENTAMENTE) ===
1. ENGENHARIA REVERSA: Sua função principal é olhar a imagem anexada (se houver) e RECRIAR O DESIGN DELA. Extraia todos os textos reais legíveis. NUNCA gere seções com "Lorem ipsum" se houver texto na imagem. Copie a exata disposição de elementos.
2. CORES ORIGINAIS OBRIGATÓRIAS: Aplique EXATAMENTE as mesmas cores de fundo (background), textos e botões da imagem enviada. Se a imagem de referência for escura/preta, o código HTML DEVE obrigatoriamente ter um fundo escuro (ex: bg-slate-900 ou style="background-color: #000"). É ESTRITAMENTE PROIBIDO retornar um site genérico branco se a referência for escura.

=== REGRAS DE ESTRUTURA E UI/UX ===
3. ESTRUTURA PREMIUM: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; }. NAVEGAÇÃO POR ÂNCORAS: Crie os IDs das seções para os menus funcionarem. ESPAÇAMENTO: OBRIGATÓRIO um espaço de uma linha em branco entre títulos e parágrafos. Não use emojis. Use FontAwesome.
${instrucaoDinamica}

4. PLACEHOLDERS E IMAGENS (BLINDAGEM TOTAL):
- Para TAG <img>: Utilize EXATAMENTE o src: https://images.unsplash.com/random/1200x800/?keyword (substitua a palavra keyword por UMA palavra em inglês, sem chaves). Ex: https://images.unsplash.com/random/1200x800/?business
- Para BACKGROUNDS: OBRIGATORIAMENTE use estilos inline na tag: style="background-image: url('https://images.unsplash.com/random/1200x800/?keyword'); background-size: cover; background-position: center;". NUNCA use chaves na URL.
${regraImagens}

5. COMPLIANCE E RODAPÉ JURÍDICO (NÃO ALTERE ESTE CÓDIGO):
O site gerado DEVE conter obrigatoriamente este bloco de rodapé no final do código:
<footer class="bg-slate-900 text-slate-400 py-12 text-center text-xs mt-12" ${dinamica !== 'estatico' ? 'data-aos="fade-up"' : ''}>
    <div class="max-w-4xl mx-auto px-4">
        <div class="flex flex-wrap justify-center gap-6 md:gap-12 mb-6 text-[13px]">
            <a href="#privacidade" onclick="toggleLegal('panel-privacidade', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal('panel-termos', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Termos de Uso</a>
            <a href="#cookies" onclick="toggleLegal('panel-cookies', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Política de Cookies</a>
        </div>
        <div id="legal-panels" class="text-left mb-8 text-slate-300 text-sm hidden bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-inner max-w-3xl mx-auto transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Política de Privacidade e Proteção de Dados</h4>
                <p>A sua privacidade é nossa prioridade. Esta política descreve como coletamos, usamos, armazenamos e protegemos os seus dados pessoais, em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).</p>
                <p><strong>1. Coleta de Informações:</strong> Coletamos informações fornecidas voluntariamente por você (como nome, e-mail e telefone) ao preencher formulários em nosso site, além de dados de navegação coletados automaticamente por ferramentas de analytics e pixels de rastreamento para fins de otimização de campanhas.</p>
                <p><strong>2. Uso das Informações:</strong> Seus dados são utilizados exclusivamente para o processamento de pagamentos, fornecimento do serviço ou produto solicitado, envio de comunicações transacionais, suporte ao cliente e ofertas de marketing previamente autorizadas.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Termos e Condições de Uso</h4>
                <p>Ao acessar e utilizar este site e nossos produtos/serviços, você concorda expressamente em cumprir estes Termos de Serviço, todas as leis e regulamentos aplicáveis. O uso contínuo constitui a aceitação incondicional destes termos.</p>
                <p><strong>1. Licença e Propriedade Intelectual:</strong> Todo o conteúdo disponibilizado neste site, incluindo textos, gráficos, logotipos, vídeos, metodologias e áudios, é de propriedade exclusiva dos criadores e é protegido por leis de direitos autorais. É terminantemente proibida a reprodução, distribuição, modificação ou revenda não autorizada de qualquer material.</p>
            </div>
            <div id="panel-cookies" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Política de Cookies e Rastreamento</h4>
                <p>Para proporcionar a melhor experiência possível, analisar o tráfego do site e veicular anúncios personalizados, utilizamos cookies e tecnologias de rastreamento semelhantes.</p>
                <p><strong>1. O que são Cookies?</strong> Cookies são pequenos arquivos de texto que são baixados e armazenados no seu computador, smartphone ou dispositivo móvel quando você visita o nosso site. Eles permitem que o site reconheça o seu dispositivo e lembre das suas preferências nas próximas visitas.</p>
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
            var isCurrentlyVisible = !target.classList.contains('hidden');
            panels.forEach(function(p) { p.classList.add('hidden'); });
            if (isCurrentlyVisible) {
                container.classList.add('hidden');
            } else {
                container.classList.remove('hidden');
                target.classList.remove('hidden');
            }
        }
    </script>
</footer>
`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;

    let htmlCode = '';
    let provedorTextoUsado = '';
    let logErros: string[] = [];

    // TENTATIVA 1: GEMINI (Agora focado em HTML puro, sem travas JSON)
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
          systemInstruction: { role: "system", parts: [{ text: systemInstructionFinal }] }
        });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: promptParts }]
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
              { role: 'system', content: systemInstructionFinal + "\nRetorne OBRIGATORIAMENTE apenas o código HTML completo. Sem JSON, sem textos extras." },
              { role: 'user', content: promptTextoPuro }
            ]
          })
        });
        const groqData = await groqRes.json();
        if (groqData.choices && groqData.choices[0]?.message?.content) {
          htmlCode = extrairHtmlDeJson(groqData.choices[0].message.content);
          provedorTextoUsado = 'Groq (Llama 3.3 70B)';
        } else {
           logErros.push(`Groq falhou: Resposta vazia.`);
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
              { role: 'system', content: systemInstructionFinal + "\nRetorne APENAS código HTML." },
              { role: 'user', content: promptTextoPuro }
            ]
          })
        });
        const openData = await openRouterRes.json();
        if (openData.choices && openData.choices[0]?.message?.content) {
          htmlCode = extrairHtmlDeJson(openData.choices[0].message.content);
          provedorTextoUsado = 'OpenRouter (Qwen Coder)';
        } else {
          logErros.push(`OpenRouter falhou: Sem resposta.`);
        }
      } catch (err: any) { logErros.push(`OpenRouter falhou: ${err.message}`); }
    }

    if (!htmlCode) {
        throw new Error(`As 3 APIs falharam. Motivos: ${logErros.join(' | ')}`);
    }

    // INJEÇÃO SEGURA DA BIBLIOTECA AOS
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