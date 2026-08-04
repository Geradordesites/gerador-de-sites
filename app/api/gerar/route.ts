import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts } = body;

    // CAPTURA O ANO EXATO DO SERVIDOR AUTOMATICAMENTE
    const anoAtual = new Date().getFullYear();

    const regrasObrigatorias = `
=== REGRAS OBRIGATÓRIAS DE DESIGN SÊNIOR, COMPLIANCE E UI/UX ===
1. ESTRUTURA E ESPAÇAMENTO PREMIUM:
- CSS Global: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
- ESPAÇAMENTO ESTRITO: Organize o layout para que os títulos dos tópicos tenham sempre um espaço exato de uma linha em branco entre eles e os parágrafos subsequentes.
- ÍCONES: NUNCA USE EMOJIS (🚫). É terminantemente proibido. Use exclusivamente a biblioteca FontAwesome (adicione <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"> no <head>).

2. IMAGENS IDEAIS E REAIS (UNSPLASH):
- Para imagens, utilize: https://images.unsplash.com/random/1200x800/?{palavra-chave}
- REGRA ABSOLUTA DE IMAGENS: Não quero desenhos e sim imagens reais, REAIS. Não use imagens de tecnologia, animações ou ficção científica. Apenas fotografias humanas e cenários reais.
- TAMANHO IDEAL: As imagens nunca devem estourar na tela. Aplique classes Tailwind obrigatórias nas imagens: "w-full max-w-2xl mx-auto h-auto object-cover rounded-xl shadow-lg".

3. COMPLIANCE E RODAPÉ PROFISSIONAL (SANFONAS INTERLIGADAS):
- O rodapé DEVE conter links REAIS (ex: <a href="#termos" class="legal-link">Termos</a>, <a href="#privacidade" class="legal-link">Privacidade</a>).
- COPYRIGHT DINÂMICO: O texto de Copyright deve obrigatoriamente exibir o ano atual (${anoAtual}). Exemplo: "© ${anoAtual} Todos os direitos reservados."
- Abaixo dos links, crie DIVs compactas para o conteúdo (id="termos", id="privacidade") inicialmente ocultas (hidden).
- Insira textos jurídicos profissionais, densos e extensos (LGPD, Isenção de Responsabilidade, Cookies).
- ADICIONE OBRIGATORIAMENTE ESTE SCRIPT JS NO FINAL DO BODY para controlar as sanfonas:
  <script>
    document.querySelectorAll('.legal-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.querySelectorAll('.legal-content').forEach(content => {
          if(content.id === targetId) {
            content.classList.toggle('hidden');
          } else {
            content.classList.add('hidden');
          }
        });
        setTimeout(() => document.getElementById(targetId)?.scrollIntoView({behavior: 'smooth', block: 'start'}), 100);
      });
    });
  </script>
- Adicione a classe "legal-content hidden" nas divs de texto legal.

4. NAVEGAÇÃO SILENCIOSA E CONVERSÃO:
- Sem hashtag na URL para menus superiores. Use JS para 'event.preventDefault()' e 'scrollIntoView'.
- PROIBIDO formulários (<form>). Use apenas botões de WhatsApp elegantes.

5. HARMONIA DE CORES:
- Leia atentamente a "PALETA DE CORES OBRIGATÓRIA" enviada na instrução.
- Aplique essas cores usando classes avançadas do Tailwind CSS (ex: bg-slate-900, text-emerald-600, border-amber-500).
- Garanta contraste perfeito e elegante entre fundo e textos.
`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;

    const modelosParaTentar = [
      process.env.GEMINI_MODEL,
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-2.0-flash"
    ].filter(Boolean) as string[];

    let result: any = null;
    let ultimoErro: any = null;

    for (const nomeModelo of modelosParaTentar) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: nomeModelo,
          systemInstruction: { role: "system", parts: [{ text: systemInstructionFinal }] }
        });

        result = await model.generateContent({
          contents: [{ role: "user", parts: promptParts }],
          generationConfig: { responseMimeType: "application/json" }
        });
        break;
      } catch (err: any) {
        ultimoErro = err;
      }
    }

    if (!result) throw ultimoErro || new Error("Nenhum modelo do Gemini respondeu.");

    const responseText = result.response.text();
    let htmlCode = '';

    try {
      const json = JSON.parse(responseText);
      htmlCode = json.codigo_html || json.html || Object.values(json)[0];
    } catch (e) { htmlCode = responseText; }

    const doctypeIndex = htmlCode.toLowerCase().indexOf('<!doctype html>');
    if (doctypeIndex !== -1) htmlCode = htmlCode.substring(doctypeIndex);
    htmlCode = htmlCode.replace(/```html/i, '').replace(/```/g, '').trim();

    // =========================================================================
    // 🔴 MÁGICA: INTERCEPTADOR DA API OFICIAL DO UNSPLASH
    // =========================================================================
    if (process.env.UNSPLASH_API_KEY) {
      const regex = /https:\/\/images\.unsplash\.com\/random\/1200x800\/\?([^"&<>\s]+)/g;
      let match;
      const urlsToReplace = [];

      while ((match = regex.exec(htmlCode)) !== null) {
        urlsToReplace.push({ fullMatch: match[0], keyword: match[1] });
      }

      for (const item of urlsToReplace) {
        try {
           const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${item.keyword}&per_page=15&orientation=landscape&client_id=${process.env.UNSPLASH_API_KEY}`);
           const uData = await unsplashRes.json();
           if (uData.results && uData.results.length > 0) {
             const randomIndex = Math.floor(Math.random() * uData.results.length);
             const bestImg = uData.results[randomIndex].urls.regular;
             htmlCode = htmlCode.replace(item.fullMatch, bestImg); 
           }
        } catch(e) {
           console.error("Erro na API Unsplash:", e);
        }
      }
    }

    return NextResponse.json({ success: true, html: htmlCode });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro interno." }, { status: 500 });
  }
}