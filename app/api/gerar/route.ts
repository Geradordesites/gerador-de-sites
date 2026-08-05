import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica } = body;

    const anoAtual = new Date().getFullYear();

    // LÓGICA DINÂMICA DO ESTILO DE IMAGEM
    let regraImagens = "- REGRA ABSOLUTA DE IMAGENS: Não use desenhos, animações, gráficos ou ficção científica. Apenas fotografias humanas e cenários reais.";
    if (imageStyle === 'ilustracao') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo ILUSTRAÇÃO. Gere palavras-chave focadas em ilustrações, vetores, 3d render ou minimal art.";
    } else if (imageStyle === 'tecnologia') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo TECNOLOGIA. Gere palavras-chave focadas em tecnologia, cyber, data e sci-fi.";
    }

    // LÓGICA DE EFEITOS E DINÂMICA
    let instrucaoDinamica = "";
    if (dinamica === 'suave') {
        instrucaoDinamica = "- ANIMAÇÕES DE SCROLL (AOS): Adicione o atributo data-aos=\"fade-up\" ou data-aos=\"zoom-in\" nas tags HTML de seções, textos e imagens.";
    } else if (dinamica === 'impacto') {
        instrucaoDinamica = "- ANIMAÇÕES DE SCROLL (AOS): OBRIGATÓRIO usar atributos data-aos=\"fade-up\". Substitua grids comuns por Bento Grids, use Glassmorphism (bg-white/10 backdrop-blur-md) e coloque hover:scale-105 e animate-pulse nos botões.";
    }

    const regrasObrigatorias = `
=== REGRA DE OURO: FIDELIDADE VISUAL MÁXIMA ===
1. Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html" com o código da página inteira. Não adicione textos Markdown ou explicações.
2. ENGENHARIA REVERSA: Se receber uma imagem, EXTRAIA E COPIE AS CORES EXATAS (fundos, textos e botões) e os textos originais. Se a imagem de referência for ESCURA, o código HTML DEVE ter fundo escuro (ex: bg-slate-900). É PROIBIDO criar um site claro se a referência for escura.

=== REGRAS DE ESTRUTURA E UI/UX ===
3. ESTRUTURA PREMIUM: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; }.
- NAVEGAÇÃO POR ÂNCORAS: Crie os IDs das seções para os menus funcionarem.
- ESPAÇAMENTO: OBRIGATÓRIO um espaço exato de uma linha em branco entre os títulos dos tópicos e os parágrafos subsequentes.
- Use FontAwesome para ícones.
${instrucaoDinamica}

4. PLACEHOLDERS E IMAGENS (BLINDAGEM TOTAL):
- Para TAG <img>: Utilize EXATAMENTE o src: https://images.unsplash.com/random/1200x800/?keyword (substitua a palavra keyword por UMA palavra em inglês, sem chaves e sem colchetes). 
- Para BACKGROUNDS: OBRIGATORIAMENTE use estilos inline na tag: style="background-image: url('https://images.unsplash.com/random/1200x800/?keyword'); background-size: cover; background-position: center;".
${regraImagens}

5. COMPLIANCE E RODAPÉ JURÍDICO:
O site gerado DEVE conter obrigatoriamente este bloco no final do código HTML:
<footer class="bg-slate-900 text-slate-400 py-12 text-center text-xs mt-12" ${dinamica !== 'estatico' ? 'data-aos="fade-up"' : ''}>
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
    let provedorTextoUsado = 'Google Gemini';
    let logErros: string[] = [];

    // =========================================================================
    // CASCATA TRIPLA COM O MODELO CORRETO: gemini-2.5-flash
    // =========================================================================
    const chavesGemini = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3
    ].filter(Boolean) as string[];

    if (chavesGemini.length === 0) {
        throw new Error("Nenhuma chave API do Google Gemini configurada no ambiente.");
    }

    for (let i = 0; i < chavesGemini.length; i++) {
        try {
            const genAI = new GoogleGenerativeAI(chavesGemini[i]);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash", // MODELO OFICIAL CORRETO
                systemInstruction: { role: "system", parts: [{ text: systemInstructionFinal }] }
            });

            const result = await model.generateContent({
                contents: [{ role: "user", parts: promptParts }],
                generationConfig: { responseMimeType: "application/json" }
            });

            htmlCode = extrairHtmlDeJson(result.response.text());

            if (htmlCode && htmlCode.length > 500 && htmlCode.includes('<html')) {
                provedorTextoUsado = `Google Gemini (Chave ${i + 1})`;
                break; // SUCESSO! Chave válida assumiu o controle
            } else {
                throw new Error("A IA gerou um texto genérico em vez do código da página.");
            }

        } catch (err: any) {
            logErros.push(`Chave ${i + 1} Falhou: ${err.message}`);
            htmlCode = ''; 
        }
    }

    if (!htmlCode) {
        throw new Error(`As tentativas com o Google Gemini falharam. Motivos: ${logErros.join(' | ')}`);
    }

    // INJEÇÃO DA BIBLIOTECA AOS (ANIMAÇÕES)
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

    // FILTRO E ROTATIVIDADE DE IMAGENS (UNSPLASH / FLICKR)
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
  return htmlCode.replace(/```html/gi, '').replace(/```/g, '').trim();
}