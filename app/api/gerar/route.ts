import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { systemInstruction, promptParts } = body;

    const regrasObrigatorias = `
=== REGRAS OBRIGATÓRIAS DE PERFORMANCE, COMPLIANCE E UI/UX ===
1. ESTRUTURA E RESPONSIVIDADE:
- Tag Viewport obrigatória: <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">.
- CSS Global: html, body { width: 100%; max-width: 100%; overflow-x: hidden; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
- Botões de compra DEVEM estar centralizados no mobile. A 1ª dobra deve ter Headline -> Imagem -> Botão.

2. NAVEGAÇÃO SILENCIOSA (SEM HASHTAG NA URL):
- Se houver menu superior, a navegação NÃO DEVE alterar a URL (proibido aparecer #secao no link do navegador).
- Use Javascript puro para interceptar o clique no menu, usar 'event.preventDefault()', e rolar suavemente até a seção correspondente usando 'document.querySelector(id).scrollIntoView({ behavior: "smooth" })'.
- Inclua o fechamento automático do menu mobile após o clique.

3. COMPLIANCE PARA FACEBOOK/GOOGLE ADS (RODAPÉ):
- O rodapé DEVE conter seções de "Política de Privacidade", "Termos de Uso" e "Política de Cookies".
- Utilize a tag HTML <details> e <summary> para criar uma sanfona expansível.
- DENTRO de cada <details>, escreva PELO MENOS 3 parágrafos profissionais e longos contendo textos padrão sobre LGPD, Isenção de Responsabilidade e uso de dados. Seja exaustivo nestes textos para blindar a página.

4. IMAGENS E ANTI-FOUC:
- Imagens acima da dobra não devem ter lazy loading. Abaixo da dobra DEVEM ter loading="lazy".
- Adicione <style> após o <title> com o fundo do site para evitar tela branca.
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

    return NextResponse.json({ success: true, html: htmlCode });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro interno." }, { status: 500 });
  }
}