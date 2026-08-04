import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts } = body;

    // REGRAS TÉCNICAS OBRIGATÓRIAS INJETADAS AUTOMATICAMENTE NA IA
    const regrasObrigatorias = `
DIRETRIZES TÉCNICAS E DE NAVEGAÇÃO OBRIGATÓRIAS:
1. No <head>, adicione obrigatoriamente: <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">.
2. Para TODOS os links de menu ou navegação, utilize estritamente âncoras locais baseadas em IDs com target="_self" (Ex: <a href="#recursos" target="_self">Recursos</a>). NUNCA aponte menus para links externos quebrados ou abas novas que façam o site sumir do preview.
3. As seções de destino correspondentes devem possuir o ID exato correspondente (Ex: <section id="recursos">).
4. Adicione CSS inline anti-FOUC no <head> e configure no CSS global: html, body { width: 100%; max-width: 100%; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }.
5. Estrutura mobile na primeira dobra: Headline no topo, imagem principal (com fetchpriority="high" e sem lazy loading) logo abaixo, e o botão de "comprar" centralizado logo em seguida.
6. Imagens abaixo da dobra devem ter obrigatoriamente loading="lazy" e decoding="async".
`;

    // Combina a instrução recebida com as regras estritas de performance e menu
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
          generationConfig: {
            responseMimeType: "application/json",
          }
        });
        
        break;
      } catch (err: any) {
        ultimoErro = err;
        console.warn(`Tentativa com o modelo ${nomeModelo} falhou. Tentando próximo...`);
      }
    }

    if (!result) {
      throw ultimoErro || new Error("Nenhum modelo do Gemini respondeu com sucesso.");
    }

    const responseText = result.response.text();
    let htmlCode = '';

    try {
      const json = JSON.parse(responseText);
      htmlCode = json.codigo_html || json.html || Object.values(json)[0];
    } catch (e) {
      htmlCode = responseText;
    }

    const doctypeIndex = htmlCode.toLowerCase().indexOf('<!doctype html>');
    if (doctypeIndex !== -1) htmlCode = htmlCode.substring(doctypeIndex);
    htmlCode = htmlCode.replace(/```html/i, '').replace(/```/g, '').trim();

    return NextResponse.json({ success: true, html: htmlCode });

  } catch (error: any) {
    console.error("Erro no Servidor:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno na geração." }, 
      { status: 500 }
    );
  }
}