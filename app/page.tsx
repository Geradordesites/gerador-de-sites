import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts, imageStyle, dinamica, isBlockRefinement, isElementRefinement } = body;

    // Configuração para evitar bloqueios de conteúdo da IA
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    const regrasObrigatorias = `
=== REGRA DE OURO ===
Você é um desenvolvedor FullStack experiente. Sua tarefa é criar um site COMPLETO e PROFISSIONAL.
Você DEVE retornar EXCLUSIVAMENTE um JSON. Não escreva texto antes ou depois do JSON.
Estrutura esperada: { "codigo_html": "<!DOCTYPE html>...</html>" }
`;

    const systemInstructionFinal = (systemInstruction || '') + '\n\n' + regrasObrigatorias;
    let htmlCode = '';
    let provedorTextoUsado = 'Google Gemini';

    // ROTEAMENTO: Gemini para estrutura (Site completo), Groq para Copy (Elemento)
    const usarGroq = isElementRefinement && !body.isGeminiForced;

    if (!usarGroq) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash", 
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

    if (!htmlCode || htmlCode.length < 50) throw new Error("A IA retornou um conteúdo inválido ou vazio. Tente novamente.");

    return NextResponse.json({ success: true, html: htmlCode, provedorTexto: provedorTextoUsado });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function extrairHtmlDeJson(text: string): string {
  try {
      // Tenta remover markdown, garantir que é um JSON
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const json = JSON.parse(clean);
      return json.codigo_html || json.html || "";
  } catch (e) {
      // Se não for JSON, tenta extrair o HTML de qualquer forma
      return text.replace(/```html/g, '').replace(/```/g, '').trim();
  }
}