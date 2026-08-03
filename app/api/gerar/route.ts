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