import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

// MÁGICA 1: PUXA O NOME DO SITE E COLOCA NA ABA DO NAVEGADOR
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const { data } = await supabase
    .from('sites_gerados')
    .select('titulo')
    .eq('slug', slug)
    .single();

  return {
    title: data?.titulo ? `${data.titulo} | Site Oficial` : 'Página de Vendas',
  };
}

export default async function PublicSitePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from('sites_gerados')
    .select('html_content, titulo')
    .eq('slug', slug)
    .single();

  if (error) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#333' }}>
        <h2 style={{ color: '#ef4444' }}>Erro de Conexão</h2>
        <code style={{ background: '#f1f5f9', padding: '10px', display: 'block' }}>{error.message}</code>
      </div>
    );
  }

  if (!data) {
    notFound();
  }

  return (
    // MÁGICA 2: O IFRAME BLINDADO
    // Em vez de 'dangerouslySetInnerHTML', o iframe protege o HTML.
    // O Tailwind, as fontes e o fundo preto vão carregar perfeitamente agora!
    <iframe 
      srcDoc={data.html_content} 
      title={data.titulo || 'Site Gerado'}
      style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, border: 'none', display: 'block' }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    />
  );
}
