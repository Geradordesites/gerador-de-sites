import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica, isBlockRefinement, isElementRefinement } = body;

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    const regrasObrigatorias = `
=== REGRA DE OURO ===
Você é um desenvolvedor FullStack experiente e Copywriter nativo do Brasil (PT-BR).
Você DEVE retornar EXCLUSIVAMENTE um JSON com o código final.
Estrutura esperada: { "codigo_html": "<html>...</html>" }
`;

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
            method: "POST", 
            headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: systemInstructionFinal }, { role: "user", content: promptParts[0].text }],
                response_format: { type: "json_object" },
                temperature: 0.7
            })
        });
        const groqData = await groqResponse.json();
        htmlCode = extrairHtmlDeJson(groqData.choices[0].message.content);
    }

    if (!htmlCode || htmlCode.length < 10) throw new Error("A IA retornou um conteúdo inválido ou vazio. Tente novamente.");

    return NextResponse.json({ success: true, html: htmlCode, provedorTexto: provedorTextoUsado });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function extrairHtmlDeJson(text: string): string {
  try {
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const json = JSON.parse(clean);
      return json.codigo_html || json.html || "";
  } catch (e) {
      return text.replace(/```html/g, '').replace(/```/g, '').trim();
  }
}