import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica } = body;

    const anoAtual = new Date().getFullYear();

    // LÓGICA DINÂMICA DO ESTILO DE IMAGEM
    let regraImagens = "- REGRA ABSOLUTA DE IMAGENS: Não use NENHUM tipo de desenho, animação, gráfico ou elemento de ficção científica. Utilize estrita e exclusivamente FOTOGRAFIAS HUMANAS E CENÁRIOS REAIS.";
    if (imageStyle === 'ilustracao') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo ILUSTRAÇÃO. Gere palavras-chave focadas em ilustrações, vetores, 3d render, minimal art ou digital painting.";
    } else if (imageStyle === 'tecnologia') {
      regraImagens = "- REGRA DE IMAGENS: O usuário escolheu o estilo TECNOLOGIA. Gere palavras-chave focadas em tecnologia, cyber, data, sci-fi, futurismo e abstrato.";
    }

    // LÓGICA DE EFEITOS E DINÂMICA
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
=== REGRAS OBRIGATÓRIAS DE DESIGN SÊNIOR, COMPLIANCE E UI/UX ===
1. ESTRUTURA E ESPAÇAMENTO PREMIUM:
- CSS Global: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
- NAVEGAÇÃO POR ÂNCORAS (MENU): Se você criar um menu com links do tipo href="#nome-da-secao", você é OBRIGADO a criar as seções correspondentes com id="nome-da-secao" para que o scroll funcione.
- ESPAÇAMENTO RIGOROSO: OBRIGATÓRIO estruturar o código para que haja EXATAMENTE UM ESPAÇO DE UMA LINHA EM BRANCO entre os títulos dos tópicos e os parágrafos subsequentes.
- ÍCONES: NUNCA USE EMOJIS (🚫). Use exclusivamente a biblioteca FontAwesome (<link rel="stylesheet" href="[https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css)">).
${instrucaoDinamica}

2. IMAGENS IDEAIS E PLACEHOLDERS (BLINDAGEM TOTAL):
- OBRIGATÓRIO: PARA TODA TAG <img>, utilize EXATAMENTE este formato de src: [https://images.unsplash.com/random/1200x800/?keyword](https://images.unsplash.com/random/1200x800/?keyword) (substitua a palavra keyword por UMA palavra em inglês, SEM CHAVES e SEM ESPAÇOS). Ex: [https://images.unsplash.com/random/1200x800/?business](https://images.unsplash.com/random/1200x800/?business)
- IMAGENS DE FUNDO (BACKGROUND): OBRIGATORIAMENTE use estilos inline na tag no formato: style="background-image: url('[https://images.unsplash.com/random/1200x800/?keyword](https://images.unsplash.com/random/1200x800/?keyword)'); background-size: cover; background-position: center;". NUNCA use colchetes, chaves ou variáveis na URL.
${regraImagens}
- TAMANHO IDEAL: Aplique classes Tailwind para imagens normais: "w-full max-w-2xl mx-auto h-auto object-cover rounded-xl shadow-lg". NUNCA coloque style="width: 70%" inline.

3. COMPLIANCE E RODAPÉ (SANFONA INTELIGENTE E BLINDADA PARA FACEBOOK ADS):
- NÃO crie seções separadas de "Informações Legais" soltas no meio da página.
- OBRIGATÓRIO: Você DEVE usar EXATAMENTE o código HTML e SCRIPT abaixo no lugar do rodapé. Preserve todo o script toggleLegal.
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
                <p><strong>2. Uso das Informações:</strong> Seus dados são utilizados exclusivamente para o processamento de pagamentos, fornecimento do serviço ou produto solicitado, envio de comunicações transacionais, suporte ao cliente e ofertas de marketing previamente autorizadas. Não vendemos, alugamos ou compartilhamos seus dados com terceiros não essenciais para a operação.</p>
                <p><strong>3. Segurança e Retenção:</strong> Adotamos as melhores práticas de segurança da informação e criptografia de ponta a ponta para proteger seus dados contra acessos não autorizados. Os dados serão mantidos apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados.</p>
                <p><strong>4. Direitos do Titular:</strong> Você tem o direito de solicitar o acesso, a correção, a anonimização ou a exclusão total dos seus dados pessoais de nossa base a qualquer momento, bastando entrar em contato através dos nossos canais oficiais de atendimento presentes nesta página.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Termos e Condições de Uso</h4>
                <p>Ao acessar e utilizar este site e nossos produtos/serviços, você concorda expressamente em cumprir estes Termos de Serviço, todas as leis e regulamentos aplicáveis. O uso contínuo constitui a aceitação incondicional destes termos.</p>
                <p><strong>1. Licença e Propriedade Intelectual:</strong> Todo o conteúdo disponibilizado neste site, incluindo textos, gráficos, logotipos, vídeos, metodologias e áudios, é de propriedade exclusiva dos criadores e é protegido por leis de direitos autorais. É terminantemente proibida a reprodução, distribuição, modificação ou revenda não autorizada de qualquer material.</p>
                <p><strong>2. Isenção de Responsabilidade:</strong> Os materiais neste site são fornecidos "como estão". Não oferecemos garantias de resultados específicos ou ganhos financeiros, de saúde ou relacionais. Os resultados variam de pessoa para pessoa e dependem do esforço individual e da correta aplicação das metodologias ensinadas.</p>
                <p><strong>3. Política de Arrependimento e Reembolso:</strong> Em conformidade com o Código de Defesa do Consumidor (Art. 49), garantimos o prazo de 7 (sete) dias corridos, a contar da data da compra, para o cancelamento e estorno integral do valor pago caso você não esteja satisfeito com o produto digital, sem necessidade de justificativa.</p>
                <p><strong>4. Conduta do Usuário:</strong> O usuário concorda em utilizar o site apenas para fins lícitos, sendo vedado o uso para transmissão de material difamatório, ameaçador, obsceno ou que viole direitos de terceiros.</p>
            </div>
            <div id="panel-cookies" class="legal-panel hidden space-y-3">
                <h4 class="font-bold text-white mb-2 text-lg">Política de Cookies e Rastreamento</h4>
                <p>Para proporcionar a melhor experiência possível, analisar o tráfego do site e veicular anúncios personalizados, utilizamos cookies e tecnologias de rastreamento semelhantes.</p>
                <p><strong>1. O que são Cookies?</strong> Cookies são pequenos arquivos de texto que são baixados e armazenados no seu computador, smartphone ou dispositivo móvel quando você visita o nosso site. Eles permitem que o site reconheça o seu dispositivo e lembre das suas preferências nas próximas visitas.</p>
                <p><strong>2. Tipos de Cookies que Utilizamos:</strong></p>
                <ul class="list-disc pl-5 space-y-1">
                    <li><em>Cookies Estritamente Necessários:</em> Essenciais para o funcionamento básico do site, como navegação de páginas e acesso a áreas seguras (ex: checkouts).</li>
                    <li><em>Cookies de Desempenho e Analytics:</em> Permitem rastrear e analisar o volume de visitas e fontes de tráfego, ajudando a medir e melhorar a performance da página.</li>
                    <li><em>Cookies de Publicidade e Pixels:</em> Utilizados por nós e nossos parceiros (como Facebook/Meta e Google) para construir um perfil dos seus interesses e mostrar anúncios relevantes em outros sites.</li>
                </ul>
                <p><strong>3. Gerenciamento de Cookies:</strong> Você pode optar por aceitar ou recusar o uso de cookies não essenciais. A maioria dos navegadores da web aceita cookies automaticamente, mas você pode modificar a configuração do seu navegador para recusá-los, se preferir. Note que isso pode impedir que você tire o máximo proveito da experiência no site.</p>
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

4. NAVEGAÇÃO E CONVERSÃO:
- Proibido uso de <form>. Utilize botões diretos de ação/WhatsApp.
`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;

    let htmlCode = '';
    let provedorTextoUsado = '';

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
      } catch (err) { console.warn("Gemini falhou ou atingiu limite."); }
    }

    if (!htmlCode && process.env.GROQ_API_KEY) {
      try {
        const groqRes = await fetch('[https://api.groq.com/openai/v1/chat/completions](https://api.groq.com/openai/v1/chat/completions)', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
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
      } catch (err) { console.warn("Groq falhou."); }
    }

    if (!htmlCode && process.env.OPENROUTER_API_KEY) {
      try {
        const openRouterRes = await fetch('[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
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
      } catch (err) { console.warn("OpenRouter falhou."); }
    }

    if (!htmlCode) throw new Error("Todas as APIs falharam.");

    // INJEÇÃO SEGURA DA BIBLIOTECA AOS (Não duplica se já existir no refinamento)
    if (dinamica && dinamica !== 'estatico') {
        const aosCss = '<link href="[https://unpkg.com/aos@2.3.1/dist/aos.css](https://unpkg.com/aos@2.3.1/dist/aos.css)" rel="stylesheet">';
        const aosJs = '<script src="[https://unpkg.com/aos@2.3.1/dist/aos.js](https://unpkg.com/aos@2.3.1/dist/aos.js)"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        
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
        
        // LIMPADOR DE CHAVES (Garante que a IA não quebrou o link)
        const keywordLimpaFormatada = encodeURIComponent(item.keyword.replace(/[{}]/g, '').split(',')[0]);

        if (process.env.UNSPLASH_API_KEY) {
          try {
            const unsplashRes = await fetch(`[https://api.unsplash.com/search/photos?query=$](https://api.unsplash.com/search/photos?query=$){keywordLimpaFormatada}&per_page=15&orientation=landscape&client_id=${process.env.UNSPLASH_API_KEY}`);
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
          const flickrUrl = `[https://loremflickr.com/1200/800/$](https://loremflickr.com/1200/800/$){keywordLimpaFormatada}?lock=${lockId}`;
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