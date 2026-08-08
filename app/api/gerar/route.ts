import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica, isBlockRefinement, isElementRefinement } = body;

    const anoAtual = new Date().getFullYear();

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

    const regraImagens = "- DIRETRIZ DE ASSETS: Proibido ilustrações infantis ou vetores genéricos. Utilize exclusivamente fotografias humanas reais e cenários de alta qualidade.";
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES: Adicione data-aos=\"fade-up\" nas tags estruturais principais (<section>, <div> grandes).";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES: OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism (bg-white/10 backdrop-blur-md) e hover:scale-105 nos botões.";

    let regrasObrigatorias = "";
    
    if (!isBlockRefinement && !isElementRefinement) {
        regrasObrigatorias = `
=== REGRA DE OURO 1: ALTA PERFORMANCE E FIDELIDADE ===
Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 O valor DEVE CONTER O SITE INTEIRO (do <!DOCTYPE html> até o </html>). NUNCA utilize marcações de corte como "<!-- resto do código -->". 

=== REGRA DE OURO 2: RESPONSIVIDADE MOBILE-FIRST (OBRIGATÓRIO) ===
O site DEVE se adaptar perfeitamente a celulares, tablets e desktops. 
- Use 'flex-col md:flex-row' para que elementos fiquem um embaixo do outro no celular e lado a lado no PC.
- Use 'p-4 md:p-8 lg:p-12' para espaçamentos dinâmicos.
- NUNCA use larguras fixas em pixels (ex: w-[800px]). Use sempre porcentagens ou max-width (ex: 'w-full max-w-6xl mx-auto').
- Menus devem ser responsivos (se não conseguir fazer botão hambúrguer funcional, empilhe os links no celular com flex-col).

=== REGRA DE OURO 3: ARQUITETURA E ESPAÇAMENTOS ===
- Force o espaçamento de UMA LINHA entre títulos (h2, h3) e parágrafos (p) utilizando as classes 'mb-4' ou 'mb-6'.
- Otimize todas as tags <img> com: "w-full mx-auto h-auto object-cover rounded-xl shadow-lg".
- Source de imagens: https://images.unsplash.com/random/1200x800/?keyword
${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE: RODAPÉ JURÍDICO FUNCIONAL ===
Copie e cole este bloco HTML antes do fechamento do </body>:
<footer data-bloco="rodape" class="bg-slate-900 text-slate-300 py-12 text-center text-sm mt-12 border-t border-slate-800 w-full overflow-hidden">
    <div class="w-full max-w-5xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-8 font-medium">
            <a href="#privacidade" onclick="toggleLegal(event, 'panel-privacidade')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal(event, 'panel-termos')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Termos de Uso</a>
        </div>
        <div id="legal-panels" class="text-left mb-10 text-slate-200 text-base leading-relaxed hidden bg-slate-800 p-6 md:p-8 rounded-2xl w-full max-w-4xl mx-auto border border-slate-700 shadow-xl transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Política de Privacidade</h4>
                <p>Nossa coleta de dados está em conformidade com as normas vigentes de proteção de dados. Coletamos informações estritamente necessárias apenas para otimização de campanhas, atendimento e suporte essencial.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Termos de Uso</h4>
                <p>Este portal não é afiliado ou endossado por nenhuma plataforma de mídia social de terceiros. Os resultados dependem do uso correto das informações aqui prestadas.</p>
            </div>
        </div>
        <p class="text-slate-500 font-medium tracking-wide text-sm">&copy; ${anoAtual} Todos os direitos reservados.</p>
    </div>
    <script>
        function toggleLegal(e, panelId) {
            if(e) e.preventDefault();
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
    } else {
        regrasObrigatorias = `
=== DIRETRIZ DE MICRO-OTIMIZAÇÃO E COPYWRITING ===
Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ATENÇÃO: Devolva APENAS a Tag HTML do elemento fornecido. 
🚨 NUNCA narre o que você está fazendo. Devolva O CÓDIGO HTML PRONTO. Mantenha as classes Tailwind existentes a menos que seja solicitado mudá-las.
        `;
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    let htmlCode = '';
    let provedorTextoUsado = 'Google Gemini';

    const usarGroq = isElementRefinement && !body.isGeminiForced;

    if (!usarGroq) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: systemInstructionFinal,
            safetySettings: safetySettings 
        });

        const result = await model.generateContent({ 
            contents: [{ role: "user", parts: promptParts }], 
            generationConfig: { temperature: 0.2 } 
        });
        
        htmlCode = extrairHtmlDeJson(result.response.text());
    } else {
        provedorTextoUsado = 'Groq Engine (Copy)';
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST", headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: systemInstructionFinal }, { role: "user", content: textoDoPrompt }],
                response_format: { type: "json_object" },
                temperature: 0.7
            })
        });
        const groqData = await groqResponse.json();
        htmlCode = extrairHtmlDeJson(groqData.choices[0].message.content);
    }

    if (!htmlCode || htmlCode.length < 50) throw new Error("A Inteligência Artificial retornou um escopo inválido ou vazio. Tente refazer a requisição.");

    if (dinamica && dinamica !== 'estatico' && !isBlockRefinement && !isElementRefinement) {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (htmlCode.includes('</head>')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (htmlCode.includes('</body>')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

    return NextResponse.json({ success: true, html: htmlCode, provedorTexto: provedorTextoUsado });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function extrairHtmlDeJson(text: string): string {
  try {
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const json = JSON.parse(clean);
      let extracted = json.codigo_html || json.html || Object.values(json)[0] || "";
      if (typeof extracted !== 'string') extracted = JSON.stringify(extracted);
      extracted = extracted.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '\t');
      return extracted;
  } catch (e) {
      return text.replace(/```html/g, '').replace(/```/g, '').trim();
  }
}