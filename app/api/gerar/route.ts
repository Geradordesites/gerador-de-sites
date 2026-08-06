import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica } = body;

    const anoAtual = new Date().getFullYear();

    let regraImagens = "- REGRA ABSOLUTA DE IMAGENS: Não use desenhos, animações, gráficos ou ficção científica. Apenas fotografias humanas e cenários reais.";
    if (imageStyle === 'ilustracao') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo ILUSTRAÇÃO. Gere palavras-chave focadas em ilustrações, vetores, 3d render ou minimal art.";
    } else if (imageStyle === 'tecnologia') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo TECNOLOGIA. Gere palavras-chave focadas em tecnologia, cyber, data e sci-fi.";
    }

    let instrucaoDinamica = "";
    if (dinamica === 'suave') {
        instrucaoDinamica = "- ANIMAÇÕES DE SCROLL (AOS): Adicione o atributo data-aos=\"fade-up\" ou data-aos=\"zoom-in\" nas tags HTML de seções, textos e imagens.";
    } else if (dinamica === 'impacto') {
        instrucaoDinamica = "- ANIMAÇÕES DE SCROLL (AOS): OBRIGATÓRIO usar atributos data-aos=\"fade-up\". Substitua grids comuns por Bento Grids, use Glassmorphism (bg-white/10 backdrop-blur-md) e coloque hover:scale-105 e animate-pulse nos botões.";
    }

    const regrasObrigatorias = `
=== REGRA DE OURO: FIDELIDADE VISUAL MÁXIMA ===
1. Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html" com o código da página inteira. Não adicione textos Markdown.
2. ENGENHARIA REVERSA E CORES: Se a imagem anexada possuir fundo ESCURO ou PRETO, você é ESTRITAMENTE OBRIGADO a gerar o código com fundo escuro (ex: bg-slate-900 ou bg-black) e textos claros (text-white). É TERMINANTEMENTE PROIBIDO gerar layout branco se a foto for escura. Copie as exatas cores de botões e fundos.

=== REGRAS DE ESTRUTURA E UI/UX ===
3. ESTRUTURA PREMIUM: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; }.
- NAVEGAÇÃO POR ÂNCORAS: Crie os IDs nas seções para os menus funcionarem.
- ESPAÇAMENTO: OBRIGATÓRIO um espaço de uma linha em branco entre títulos e parágrafos.
${instrucaoDinamica}

4. PLACEHOLDERS E IMAGENS (BLINDAGEM):
- TAG <img>: Utilize EXATAMENTE: https://images.unsplash.com/random/1200x800/?keyword (substitua keyword por palavra em inglês, sem chaves e sem colchetes). 
${regraImagens}

5. COMPLIANCE E RODAPÉ JURÍDICO (PROIBIDO RESUMIR ESTE BLOCO):
Você é obrigado a copiar e colar o bloco abaixo no final do código HTML, sem omitir NENHUMA palavra.
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
                <p><strong>1. Coleta de Informações:</strong> Coletamos informações fornecidas voluntariamente por você ao preencher formulários em nosso site, além de dados de navegação coletados automaticamente por ferramentas de analytics e pixels de rastreamento para fins de otimização de campanhas.</p>
                <p><strong>2. Uso das Informações:</strong> Seus dados são utilizados exclusivamente para o processamento de pagamentos, fornecimento do serviço ou produto solicitado e suporte ao cliente. Não vendemos, alugamos ou compartilhamos seus dados com terceiros não essenciais para a operação.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Termos e Condições de Uso</h4>
                <p>Ao acessar e utilizar este site e nossos produtos/serviços, você concorda expressamente em cumprir estes Termos de Serviço, todas as leis e regulamentos aplicáveis. O uso contínuo constitui a aceitação incondicional destes termos.</p>
                <p><strong>1. Licença e Propriedade Intelectual:</strong> Todo o conteúdo disponibilizado neste site, incluindo textos, gráficos, logotipos, vídeos, metodologias e áudios, é de propriedade exclusiva dos criadores e é protegido por leis de direitos autorais.</p>
            </div>
            <div id="panel-cookies" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Política de Cookies e Rastreamento</h4>
                <p>Para proporcionar a melhor experiência possível, analisar o tráfego do site e veicular anúncios personalizados, utilizamos cookies e tecnologias de rastreamento semelhantes.</p>
                <p><strong>1. O que são Cookies?</strong> Cookies são pequenos arquivos de texto que são baixados e armazenados no seu dispositivo quando você visita o nosso site. Eles permitem que o site reconheça o seu dispositivo e lembre das suas preferências.</p>
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
    let provedorTextoUsado = 'Google Gemini';
    let logErros: string[] = [];

    const rotasGemini = [
        { key: process.env.GEMINI_API_KEY, model: "gemini-2.5-flash", nome: "Chave 1" },
        { key: process.env.GEMINI_API_KEY_2, model: "gemini-2.5-flash", nome: "Chave 2" },
        { key: process.env.GEMINI_API_KEY_3, model: "gemini-2.5-flash", nome: "Chave 3" }
    ].filter(r => r.key);

    if (rotasGemini.length === 0) {
        throw new Error("Nenhuma chave API configurada.");
    }

    let isRateLimit = false;

    for (const rota of rotasGemini) {
        try {
            const genAI = new GoogleGenerativeAI(rota.key!);
            const model = genAI.getGenerativeModel({
                model: rota.model,
                systemInstruction: { role: "system", parts: [{ text: systemInstructionFinal }] }
            });

            const result = await model.generateContent({
                contents: [{ role: "user", parts: promptParts }],
                generationConfig: { responseMimeType: "application/json" }
            });

            htmlCode = extrairHtmlDeJson(result.response.text());

            if (htmlCode && htmlCode.length > 500 && htmlCode.includes('<html')) {
                provedorTextoUsado = `Google Gemini (${rota.nome})`;
                break; 
            } else {
                throw new Error("Formato inválido retornado.");
            }

        } catch (err: any) {
            let msg = err.message || "";
            if(msg.includes('429')) {
                msg = "Cota Esgotada (429)";
                isRateLimit = true;
            }
            logErros.push(`${rota.nome}: ${msg}`);
            htmlCode = ''; 
        }
    }

    if (!htmlCode) {
        if (isRateLimit) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw new Error(`Falhas: ${logErros.join(' | ')}`);
    }

    if (dinamica && dinamica !== 'estatico') {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (!htmlCode.includes('aos.css') && htmlCode.includes('</head>')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (!htmlCode.includes('AOS.init') && htmlCode.includes('</body>')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

    let provedorImagemUsado = 'Sem imagens';
    const regexUnsplash = /https:\/\/images\.unsplash\.com\/random\/1200x800\/\?([^"&<>\s]+)/g;
    let match;
    const urlsToReplace = [];

    while ((match = regexUnsplash.exec(htmlCode)) !== null) {
      urlsToReplace.push({ fullMatch: match[0], keyword: match[1] });
    }

    if (urlsToReplace.length > 0) {
      let unsplashUsado = false, flickrUsado = false;
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
                imagemEncontrada = true; unsplashUsado = true;
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
      else if (flickrUsado) provedorImagemUsado = 'LoremFlickr (Seguro)';
    }

    return NextResponse.json({
      success: true, html: htmlCode, provedorTexto: provedorTextoUsado, provedorImagem: provedorImagemUsado
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
  return htmlCode.replace(/```html/gi, '').replace(/```/g, '').trim();
}