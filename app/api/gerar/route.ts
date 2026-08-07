import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica, isBlockRefinement, isElementRefinement } = body;

    const anoAtual = new Date().getFullYear();

    let temImagem = false;
    let textoDoPrompt = "";
    
    for (const part of promptParts) {
        if (part.inlineData) temImagem = true;
        if (part.text) textoDoPrompt += part.text + "\n";
    }

    const regraImagens = "- REGRA ABSOLUTA DE IMAGENS: É TERMINANTEMENTE PROIBIDO o uso de ilustrações, desenhos animados ou gráficos 3D. Use APENAS fotografias humanas reais e cenários autênticos.";
    
    let instrucaoDinamica = "";
    if (dinamica === 'suave') instrucaoDinamica = "- ANIMAÇÕES (AOS): Adicione data-aos=\"fade-up\" nas tags principais.";
    else if (dinamica === 'impacto') instrucaoDinamica = "- ANIMAÇÕES (AOS): OBRIGATÓRIO usar data-aos=\"fade-up\". Use Glassmorphism e hover:scale-105 nos botões.";

    const regrasObrigatorias = `
=== REGRA DE OURO: SITE COMPLETO E PROFISSIONAL ===
1. Você DEVE retornar EXCLUSIVAMENTE um objeto JSON contendo a chave "codigo_html".
🚨 ALERTA CRÍTICO DE INTEGRIDADE: O site DEVE ser gerado COMPLETO, contendo todas as seções essenciais de uma Landing Page de alta conversão (Topo/Hero com Chamada para Ação, Seção de Benefícios/Dores, Depoimentos/Prova Social, Seção sobre o Especialista/Método, Perguntas Frequentes (FAQ) e Rodapé). É ESTRITAMENTE PROIBIDO entregar páginas cortadas ou metades de sites.

2. MAPEAMENTO: Adicione o atributo [data-bloco="nome_da_secao"] em TODAS as tags estruturais (<header>, <section>, <footer>). 

3. ARQUITETURA DE BLOCOS: Em TODOS os blocos de texto, mantenha espaço exato de UMA LINHA entre títulos (h2, h3) e parágrafos (p) usando classes Tailwind como 'mb-4' ou 'mb-6'.

4. IMAGENS: Use as classes "w-full mx-auto h-auto object-cover rounded-xl shadow-lg".
src: https://images.unsplash.com/random/1200x800/?keyword (humanos reais).
${regraImagens}
${instrucaoDinamica}

=== RODAPÉ JURÍDICO OBRIGATÓRIO E INDEPENDENTE ===
5. OBRIGATÓRIO: O rodapé abaixo DEVE ser inserido intacto no final do código HTML. Ele possui script próprio embutido para garantir que os modais de privacidade funcionem perfeitamente dentro de qualquer ambiente:
<footer data-bloco="rodape" class="bg-slate-900 text-slate-300 py-16 text-center text-sm mt-12 border-t border-slate-800" ${dinamica !== 'estatico' ? 'data-aos="fade-up"' : ''}>
    <div class="max-w-5xl mx-auto px-6">
        <div class="flex flex-wrap justify-center gap-8 md:gap-16 mb-8 font-medium">
            <a href="#privacidade" onclick="var c=document.getElementById('legal-panels'), p=document.getElementById('panel-privacidade'), t=document.getElementById('panel-termos'); c.classList.remove('hidden'); t.classList.add('hidden'); p.classList.toggle('hidden'); event.preventDefault();" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8 cursor-pointer">Política de Privacidade</a>
            <a href="#termos" onclick="var c=document.getElementById('legal-panels'), p=document.getElementById('panel-privacidade'), t=document.getElementById('panel-termos'); c.classList.remove('hidden'); p.classList.add('hidden'); t.classList.toggle('hidden'); event.preventDefault();" class="hover:text-white transition-colors underline decoration-slate-600 underline-offset-8 cursor-pointer">Termos de Uso</a>
        </div>
        <div id="legal-panels" class="text-left mb-10 text-slate-200 text-base leading-relaxed hidden bg-slate-800 p-8 rounded-2xl max-w-4xl mx-auto border border-slate-700 shadow-xl">
            <div id="panel-privacidade" class="hidden space-y-4">
                <h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Política de Privacidade</h4>
                <p>Nossa coleta de dados está em conformidade com a LGPD. Coletamos informações estritamente necessárias apenas para otimização de campanhas, atendimento e suporte essencial ao cliente.</p>
            </div>
            <div id="panel-termos" class="hidden space-y-4">
                <h4 class="font-bold text-white text-xl border-b border-slate-600 pb-2">Termos de Uso</h4>
                <p>Este site não é afiliado ou endossado pelo Facebook, Inc. ou qualquer outra plataforma de mídia social. Todos os resultados dependem exclusivamente do esforço individual de cada usuário.</p>
            </div>
        </div>
        <p class="text-slate-500 font-medium tracking-wide text-sm">&copy; ${anoAtual} Todos os direitos reservados.</p>
    </div>
</footer>
`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    let htmlCode = '';
    let provedorTextoUsado = '';

    const usarGroqParaTexto = isElementRefinement && !temImagem;

    if (!usarGroqParaTexto) {
        provedorTextoUsado = 'Google Gemini';
        const rotasGemini = [{ key: process.env.GEMINI_API_KEY, model: "gemini-2.5-flash", nome: "Google Gemini" }].filter(r => r.key);
        if (rotasGemini.length === 0) throw new Error("Chave API do Google Gemini não configurada.");

        let sucessoGemini = false;
        let erroFinal = "";

        for (const rota of rotasGemini) {
            try {
                const genAI = new GoogleGenerativeAI(rota.key!);
                const model = genAI.getGenerativeModel({ model: rota.model, systemInstruction: { role: "system", parts: [{ text: systemInstructionFinal }] } });
                const result = await model.generateContent({ 
                    contents: [{ role: "user", parts: promptParts }], 
                    generationConfig: { temperature: 0.2 } 
                });
                htmlCode = extrairHtmlDeJson(result.response.text());
                if (htmlCode) { sucessoGemini = true; provedorTextoUsado = rota.nome; break; }
            } catch (err: any) { erroFinal = err.message; }
        }
        if (!sucessoGemini) throw new Error(erroFinal.includes('429') ? "RATE_LIMIT_EXCEEDED" : `Falha no Gemini: ${erroFinal}`);

    } else {
        provedorTextoUsado = 'Groq Engine (Copy)';
        if (!process.env.GROQ_API_KEY) throw new Error("Chave do GROQ (GROQ_API_KEY) não configurada.");

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST", 
            headers: { 
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [ 
                    { role: "system", content: systemInstructionFinal }, 
                    { role: "user", content: textoDoPrompt } 
                ],
                response_format: { type: "json_object" },
                max_tokens: 2000, 
                temperature: 0.7
            })
        });

        if (!groqResponse.ok) { 
            const errData = await groqResponse.json(); 
            throw new Error(`Falha no Groq: ${errData.error?.message || 'Erro desconhecido'}`); 
        }
        
        const groqData = await groqResponse.json();
        htmlCode = extrairHtmlDeJson(groqData.choices[0].message.content);
        if (!htmlCode) throw new Error("O Groq não retornou um formato válido.");
    }

    if (dinamica && dinamica !== 'estatico' && !isBlockRefinement && !isElementRefinement) {
        const aosCss = '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">';
        const aosJs = '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n<script>AOS.init({duration: 800, once: true});</script>';
        if (htmlCode.includes('</head>')) htmlCode = htmlCode.replace('</head>', `\n${aosCss}\n</head>`);
        if (htmlCode.includes('</body>')) htmlCode = htmlCode.replace('</body>', `\n${aosJs}\n</body>`);
    }

    let provedorImagemUsado = 'Sem imagens';
    const regexUnsplash = /https:\/\/images\.unsplash\.com\/random\/(\d+x\d+)\/\?([^"&<>\s]+)/g;
    let match; const urlsToReplace = [];
    while ((match = regexUnsplash.exec(htmlCode)) !== null) urlsToReplace.push({ fullMatch: match[0], dimensao: match[1], keyword: match[2] });

    if (urlsToReplace.length > 0) {
      let unsplashUsado = false, flickrUsado = false;
      for (const item of urlsToReplace) {
        let imagemEncontrada = false;
        const kw = encodeURIComponent(item.keyword.replace(/[{}]/g, '').split(',')[0]);
        let orient = item.dimensao === '800x1200' ? 'portrait' : 'landscape';
        if (process.env.UNSPLASH_API_KEY) {
          try {
            const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${kw}&per_page=15&orientation=${orient}&client_id=${process.env.UNSPLASH_API_KEY}`);
            if (uRes.ok) {
              const uData = await uRes.json();
              if (uData.results?.length > 0) {
                htmlCode = htmlCode.replace(item.fullMatch, uData.results[Math.floor(Math.random() * uData.results.length)].urls.regular);
                imagemEncontrada = true; unsplashUsado = true;
              }
            }
          } catch (e) {}
        }
        if (!imagemEncontrada) {
          const w = item.dimensao === '800x1200' ? '800' : '1200', h = item.dimensao === '800x1200' ? '1200' : '800';
          htmlCode = htmlCode.replace(item.fullMatch, `https://loremflickr.com/${w}/${h}/${kw}?lock=${Math.floor(Math.random() * 9999)}`);
          flickrUsado = true;
        }
      }
      provedorImagemUsado = unsplashUsado && flickrUsado ? 'Unsplash + Flickr' : unsplashUsado ? 'Unsplash API' : 'LoremFlickr';
    }

    return NextResponse.json({ success: true, html: htmlCode, provedorTexto: provedorTextoUsado, provedorImagem: provedorImagemUsado });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro interno." }, { status: 500 });
  }
}

function extrairHtmlDeJson(responseText: string): string {
  let htmlCode = '';
  let cleanText = responseText.trim();

  if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json|html)?\n/i, '').replace(/\n```$/i, '');
  }

  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
      cleanText = jsonMatch[0];
  }

  try { 
      const json = JSON.parse(cleanText); 
      htmlCode = json.codigo_html || json.html || Object.values(json)[0]; 
  } catch (e) { 
      htmlCode = cleanText; 
  }
  
  if (typeof htmlCode !== 'string') htmlCode = JSON.stringify(htmlCode);
  
  htmlCode = htmlCode.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '\t');
  
  const doctypeIndex = htmlCode.toLowerCase().indexOf('<!doctype html>');
  if (doctypeIndex !== -1) htmlCode = htmlCode.substring(doctypeIndex);
  
  return htmlCode.replace(/```html/gi, '').replace(/```/g, '').trim();
}