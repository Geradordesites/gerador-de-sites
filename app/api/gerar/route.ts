import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts } = body;

    // A INJEÇÃO DE PERFORMANCE SÊNIOR E UI/UX REQUISITADA
    const regrasObrigatorias = `
=== REGRAS OBRIGATÓRIAS DE ENGENHARIA DE PERFORMANCE E MOBILE (NÍVEL SÊNIOR) ===
Atue como um Engenheiro de Performance Web de nível Sênior. Sua meta é fazer a página carregar visualmente pronta em menos de 2 segundos no mobile, eliminando o FOUC e bloqueios.
Aplique RIGOROSAMENTE as seguintes técnicas em HTML/Tailwind:

1. HEAD E OTIMIZAÇÃO DE FCP/LCP:
- Tag Viewport obrigatória: <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">.
- Pré-conexão: <link rel="preconnect" href="https://cdn.tailwindcss.com"> e DNS Prefetch.
- Preload LCP: Identifique a imagem principal acima da dobra e use <link rel="preload" as="image" href="...">.
- Fontes: Use &display=swap na URL do Google Fonts para evitar FOIT.
- Anti-FOUC: Adicione <style> após o <title> com: html, body { background-color: [COR]; }.
- Tailwind: Mantenha o script do CDN no <head> SEM defer ou async para renderização estratégica imediata.

2. LAYOUT MOBILE FIRST (CSS/JS):
- Adicione no style global: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
- Estrutura da 1ª dobra Mobile: Headline no topo -> Imagem Principal (fetchpriority="high", nunca lazy) -> Botão centralizado.
- Botão "comprar": Garanta que o texto dele fique perfeitamente centralizado.
- Alturas: Use max-height (ex: 80vh) onde for relevante.
- Crie uma função JavaScript closeMenu() que remova a classe '.active' do menu no exato momento do clique num link mobile.

3. NAVEGAÇÃO E IMAGENS:
- Menu e Rolagem: Use âncoras para IDs internos (<a href="#secao" target="_self">).
- As imagens abaixo da dobra devem TER obrigatoriamente loading="lazy" e decoding="async".
- SE não tiver a URL de uma imagem enviada pelo usuário, use placeholders estáveis como https://placehold.co/800x600/f8fafc/334155?text=Sua+Imagem (NUNCA invente links do Imgur).

4. SANFONA DE TERMOS NO RODAPÉ:
- O rodapé deve ter links para "Política de Privacidade", "Termos de Uso" e "Política de Cookies".
- Esses links DEVEM abrir uma SANFONA (Accordion) expansível embutida no próprio rodapé (ou em modais), usando JavaScript puro.
- Inicialização Segura: Todo o JS deve estar dentro de document.addEventListener('DOMContentLoaded', () => { ... });
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
          systemInstruction: {
            role: "system",
            parts: [{ text: systemInstructionFinal }]
          }
        });

        result = await model.generateContent({
          contents: [{ role: "user", parts: promptParts }],
          generationConfig: { responseMimeType: "application/json" }
        });
        break;
      } catch (err: any) {
        ultimoErro = err;
        console.warn(`Tentativa com o modelo ${nomeModelo} falhou. Tentando próximo...`);
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

    return NextResponse.json({ success: true, html: htmlCode });

  } catch (error: any) {
    console.error("Erro no Servidor:", error);
    return NextResponse.json({ success: false, error: error.message || "Erro interno." }, { status: 500 });
  }
}