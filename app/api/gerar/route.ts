import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts } = body;

    // SISTEMA DE CASCATA AUTOMÁTICA: 
    // Se o Google atualizar ou descontinuar um modelo, o servidor testa o próximo automaticamente sem quebrar o site!
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
            parts: [{ text: systemInstruction }]
          }
        });

        result = await model.generateContent({
          contents: [{ role: "user", parts: promptParts }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        });
        
        // Se gerou com sucesso, interrompe o loop e usa este resultado
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
const systemInstruction = `Você é um Engenheiro de Performance Web Sênior e Especialista em UI/UX Mobile-First.
Sua missão é gerar landing pages de alta conversão em UM ÚNICO arquivo HTML usando Tailwind CSS via CDN.

REGRAS OBRIGATÓRIAS DE MOBILE E PERFORMANCE:
1. No <head>, adicione <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">.
2. Adicione links de preconnect e dns-prefetch para a CDN do Tailwind e Google Fonts.
3. Garanta CSS inline anti-FOUC no <head> com o fundo e cor padrão do site.
4. Para links de menu mobile, utilize sempre âncoras internas limpas baseadas em IDs (ex: <a href="#secao" target="_self">Menu</a>) para que a navegação ocorra de forma fluida na mesma página, sem abrir abas extras ou sumir com o layout.
5. Estrutura mobile obrigatória na primeira dobra: Headline no topo, imagem principal (com fetchpriority="high" e sem lazy loading) logo em seguida, e o botão de "comprar" centralizado logo abaixo.
6. Imagens abaixo da dobra devem ter obrigatoriamente loading="lazy" e decoding="async".
7. Aplique no CSS global: html, body { width: 100%; max-width: 100%; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }.
`;