import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
    
    for (const part of promptParts) {
        if (part.inlineData) temImagem = true;
        if (part.text) textoDoPrompt += part.text + "\n";
    }

    const regraImagens = `
- DIRETRIZ DE MÍDIA: 🚨 É TERMINANTEMENTE PROIBIDO inventar URLs ou usar serviços falsos. 
- Use EXCLUSIVAMENTE o formato: https://loremflickr.com/WIDTH/HEIGHT/keyword1,keyword2?lock=NUMERO_ALEATORIO
- Para Fundos e Hero Sections (Horizontais): Use 1280 e 720.
- Para Retratos e Pessoas (Verticais): Use 800 e 1200.
- Para Cards e Ícones (Quadrados): Use 800 e 800.
- Keywords devem ser SEMPRE em inglês e contextualizadas ao briefing.
- PROIBIDO uso de ilustrações, desenhos, gráficos 3D ou sci-fi. APENAS FOTOGRAFIAS REAIS E HUMANAS.`;
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES (AOS): Adicione data-aos=\"fade-up\" nas tags estruturais principais.";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES (AOS): OBRIGATÓRIO data-aos=\"fade-up\". Aplique Glassmorphism (bg-white/10 backdrop-blur-md) e hover:scale-105 nos botões de CTA.";

    let regrasObrigatorias = "";
    
    if (isSiteRefinement) {
        regrasObrigatorias = `
=== REGRA DE REFATORAÇÃO GLOBAL DE ESTRUTURA ===
Você receberá o código HTML completo de um site e um pedido de alteração estrutural feito pelo usuário.
Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html" com o HTML COMPLETO E ATUALIZADO.
🚨 ATENÇÃO MÁXIMA: NÃO corte o código. Mantenha todo o resto do site estritamente intacto (incluindo imagens, textos e o script do rodapé), alterando, adicionando ou removendo APENAS o que foi expressamente solicitado no comando.
NUNCA narre o que você está fazendo. Devolva apenas o JSON final.
        `;
    } else if (isElementRefinement) {
        regrasObrigatorias = `
=== DIRETRIZ DE MICRO-OTIMIZAÇÃO E COPYWRITING ===
Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ATENÇÃO: Devolva APENAS a Tag HTML ou o resultado solicitado. 
🚨 REGRA: Nunca narre o que você está fazendo. Devolva O RESULTADO DIRETO.
        `;
    } else {
        regrasObrigatorias = `
=== REGRA DE OURO: ALTA PERFORMANCE E FIDELIDADE ===
1. Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ALERTA CRÍTICO: O valor DEVE CONTER O SITE INTEIRO (do <!DOCTYPE html> até o </html>). NUNCA utilize marcações de corte como "<!-- resto do código -->". O código deve estar pronto para produção.

2. MAPEAMENTO SEMÂNTICO: Injete o atributo [data-bloco="nome_da_secao"] em TODAS as tags estruturais primárias (<header>, <section>, <footer>).

3. ARQUITETURA DE INFORMAÇÃO: Em TODOS os blocos textuais, force o espaçamento de UMA LINHA entre títulos (h2, h3) e parágrafos (p) utilizando as classes utilitárias 'mb-4' ou 'mb-6'.

4. MÍDIAS: Otimize todas as tags <img> com: "w-full mx-auto h-auto object-cover rounded-xl shadow-lg".
${regraImagens}
${instrucaoDinamica}

=== COMPLIANCE: RODAPÉ JURÍDICO FUNCIONAL ===
5. OBRIGATÓRIO: Injete o seguinte bloco HTML exatamente antes do fechamento do </body>. Ele contém o script necessário para o funcionamento das sanfonas legais.
<footer data-bloco="rodape" class="bg-slate-900 text-slate-300 py-12 text-center text-sm mt-12 border-t border-slate-800 w-full overflow-hidden">
    <div class="max-w-5xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-8 font-medium">
            <a href="#privacidade" onclick="toggleLegal(event, 'panel-privacidade')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Política de Privacidade</a>
            <a href="#termos" onclick="toggleLegal(event, 'panel-termos')" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 cursor-pointer">Termos de Uso</a>
        </div>
        <div id="legal-panels" class="text-left mb-10 text-slate-200 text-base leading-relaxed hidden bg-slate-800 p-6 md:p-8 rounded-2xl w-full max-w-4xl mx-auto border border-slate-700 shadow-xl transition-all duration-300">
            <div id="panel-privacidade" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Política de Privacidade</h4>
                <p>Nossa coleta de dados está em conformidade com as normas vigentes de proteção de dados. Coletamos informações estritamente necessárias apenas para otimização de campanhas, atendimento e suporte essencial ao cliente.</p>
            </div>
            <div id="panel-termos" class="legal-panel hidden space-y-4">
                <h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Termos de Uso</h4>
                <p>Este portal não é afiliado ou endossado por nenhuma plataforma de mídia social de terceiros. Os resultados dependem do uso correto das informações aqui prestadas e do esforço individual de cada usuário.</p>
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
            
            if (isVisible) {
                container.classList.add('hidden');
            } else {
                container.classList.remove('hidden');
                target.classList.remove('hidden');
            }
        }
    </script>
</footer>
`;
    }

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    let htmlCode = '';
    let provedorTextoUsado = 'Google Gemini (Pro)';

    // O ROTEAMENTO INTELIGENTE (GROQ VS GEMINI)
    const usarGroq = isElementRefinement && !body.isGeminiForced && !isSiteRefinement;

    if (!usarGroq) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: systemInstructionFinal,
            safetySettings: safetySettings 
        });

        const result = await model.generateContent({ 
            contents: [{ role: "user", parts: promptParts }], 
            generationConfig: { temperature: isSiteRefinement ? 0.3 : 0.2 } 
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

    if (dinamica && dinamica !== 'estatico' && !isBlockRefinement && !isElementRefinement && !isSiteRefinement) {
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

// O NOVO EXTRATOR BLINDADO (Impede que o erro de formatação vaze para a tela)
function extrairHtmlDeJson(text: string): string {
  try {
      // Remove formatações de markdown
      let clean = text.replace(/```json/gi, '').replace(/```html/gi, '').replace(/```/g, '').trim();
      
      // Encontra exatamente onde começa e termina o JSON para ignorar textos extras como "Aqui está o código:" ou "json {"
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      
      if (start !== -1 && end !== -1) {
          const jsonString = clean.substring(start, end + 1);
          const json = JSON.parse(jsonString);
          let extracted = json.codigo_html || json.html || Object.values(json)[0] || jsonString;
          
          if (typeof extracted === 'string') {
              extracted = extracted.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '\t');
          }
          return extracted;
      }
      
      return clean;
  } catch (e) {
      // Se falhar o parse do JSON, extrai como texto bruto limpando "json {"
      let fallback = text.replace(/```(html|json)?/gi, '').replace(/```/g, '').trim();
      if (fallback.toLowerCase().startsWith('json')) {
          fallback = fallback.substring(4).trim();
      }
      if (fallback.startsWith('{') && fallback.includes('"codigo_html":')) {
          const marker = '"codigo_html":';
          const idx = fallback.indexOf(marker);
          if (idx !== -1) {
              let rawHtml = fallback.substring(idx + marker.length).trim();
              if (rawHtml.startsWith('"')) rawHtml = rawHtml.substring(1);
              if (rawHtml.endsWith('}')) rawHtml = rawHtml.slice(0, -1).trim();
              if (rawHtml.endsWith('"')) rawHtml = rawHtml.slice(0, -1);
              return rawHtml.replace(/\\n/g, '\n').replace(/\\"/g, '"');
          }
      }
      return fallback;
  }
}