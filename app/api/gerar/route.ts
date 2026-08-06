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
1. Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html" com o código da página inteira.
2. ENGENHARIA REVERSA: EXTRAIA AS CORES EXATAS. Se a imagem for ESCURA, o código HTML DEVE ter fundo escuro (bg-slate-900). É PROIBIDO criar site claro se a referência for escura.
3. TAMANHO DE FONTES (ANTIBLOQUEIO FACEBOOK): Todos os textos de parágrafos, FAQs e rodapés devem ter tamanho text-base ou text-lg. NUNCA faça textos pequenos.

=== REGRAS DE ESTRUTURA E UI/UX ===
4. ESTRUTURA PREMIUM: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; }.
- ESPAÇAMENTO: OBRIGATÓRIO um espaço de uma linha em branco entre títulos e parágrafos.
${instrucaoDinamica}

5. IMAGENS: Utilize EXATAMENTE o src: https://images.unsplash.com/random/1200x800/?keyword (substitua keyword por palavra em inglês).
${regraImagens}

6. COMPLIANCE E RODAPÉ JURÍDICO (NÃO ALTERE, NÃO RESUMA):
O site gerado DEVE conter obrigatoriamente este bloco no final. As classes de tamanho grande (text-base, text-lg) são obrigatórias contra bloqueios.
<footer class="bg-slate-900 text-slate-300 py-16 text-center text-sm mt-12 border-t border-slate-800" ${dinamica !== 'estatico' ? 'data-aos="fade-up"' : ''}>
    <div class="max-w-5xl mx-auto px-6">
        <div class="flex flex-wrap justify-center gap-8 md:gap-16 mb-8 font-medium">
            <a href="#privacidade" onclick="toggleLegal('panel-privacidade', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal('panel-termos', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8">Termos de Uso</a>
            <a href="#cookies" onclick="toggleLegal('panel-cookies', event)" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8">Política de Cookies</a>
        </div>
        <div id="legal-panels" class="text-left mb-10 text-slate-200 text-base leading-relaxed hidden bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-inner max-w-4xl mx-auto transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white mb-4 text-xl border-b border-slate-600 pb-2">Política de Privacidade e Proteção de Dados</h4>
                <p>A sua privacidade é nossa prioridade. Esta política descreve como coletamos, usamos, armazenamos e protegemos os seus dados pessoais, em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).</p>
                <p><strong>1. Coleta de Informações:</strong> Coletamos informações fornecidas voluntariamente por você ao preencher formulários em nosso site, além de dados de navegação coletados automaticamente por ferramentas de analytics e pixels de rastreamento para fins de otimização de campanhas e inteligência de mercado.</p>
                <p><strong>2. Uso das Informações:</strong> Seus dados são utilizados exclusivamente para o processamento de pagamentos, fornecimento do serviço ou produto solicitado, comunicações essenciais e suporte ao cliente. Não vendemos, alugamos ou compartilhamos seus dados com terceiros não autorizados.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white mb-4 text-xl border-b border-slate-600 pb-2">Termos e Condições de Uso</h4>
                <p>Ao acessar e utilizar este site e nossos produtos/serviços, você concorda expressamente em cumprir estes Termos de Serviço, todas as leis e regulamentos aplicáveis. O uso contínuo constitui a aceitação incondicional destes termos.</p>
                <p><strong>1. Licença e Propriedade Intelectual:</strong> Todo o conteúdo disponibilizado neste site, incluindo textos, gráficos, logotipos, vídeos, metodologias e áudios, é de propriedade exclusiva dos criadores e é protegido por leis rigorosas de direitos autorais. É terminantemente proibida a cópia, reprodução, distribuição, modificação ou revenda não autorizada.</p>
            </div>
            <div id="panel-cookies" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white mb-4 text-xl border-b border-slate-600 pb-2">Política de Cookies e Rastreamento</h4>
                <p>Para proporcionar a melhor experiência de navegação possível, analisar o tráfego do site e veicular anúncios altamente personalizados, utilizamos cookies e tecnologias de rastreamento semelhantes do mercado.</p>
                <p><strong>1. O que são Cookies?</strong> Cookies são pequenos arquivos de texto fundamentais que são baixados e armazenados no seu dispositivo físico quando você visita o nosso site. Eles permitem que o nosso ecossistema reconheça o seu dispositivo e lembre das suas preferências em visitas futuras.</p>
            </div>
        </div>
        <p class="text-slate-500 font-medium tracking-wide">&copy; ${anoAtual} Todos os direitos reservados. É proibida a cópia parcial ou total.</p>
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
        throw new Error("Nenhuma chave API do Google Gemini configurada no ambiente.");
    }

    let limitReached = false;

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
                throw new Error("A IA gerou um formato inválido.");
            }

        } catch (err: any) {
            logErros.push(`${rota.nome}: ${err.message}`);
            htmlCode = ''; 
        }
    }

    if (!htmlCode) {
        if (logErros.some(e => e.includes('429'))) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw new Error(`As tentativas falharam. Motivos: ${logErros.join(' | ')}`);
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
  return htmlCode.replace(/```html/gi, '').replace(/```/g, '').trim();
}