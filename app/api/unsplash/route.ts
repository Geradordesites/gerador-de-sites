import { NextResponse } from 'next/server';

// 1. FORÇA O NEXT.JS A NUNCA SALVAR O CACHE DESTA ROTA (Toda busca será inédita)
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json({ error: 'Faltou a palavra-chave' }, { status: 400 });

  // 2. Gerador de código aleatório para "enganar" o cache do navegador no fallback
  const cacheBuster = Math.floor(Math.random() * 10000000);

  try {
    // 3. Aumentamos para 30 fotos (per_page=30) e adicionamos { cache: 'no-store' }
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape&client_id=${process.env.UNSPLASH_API_KEY}`, {
      cache: 'no-store'
    });
    
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      // Sorteia uma das 30 fotos para garantir muita variedade
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const imgUrl = data.results[randomIndex].urls.regular;
      return NextResponse.json({ url: imgUrl });
    } else {
      // 4. Fallback Blindado: Adicionamos o &sig=numero_aleatorio
      // Isso obriga o navegador a carregar uma foto nova para cada seção do site
      return NextResponse.json({ url: `https://images.unsplash.com/random/1200x800/?${encodeURIComponent(query)}&sig=${cacheBuster}` }); 
    }
  } catch (error) {
    // Fallback Blindado em caso de erro na API
    return NextResponse.json({ url: `https://images.unsplash.com/random/1200x800/?${encodeURIComponent(query)}&sig=${cacheBuster}` }); 
  }
}