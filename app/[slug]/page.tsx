import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function PublicSitePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Busca o HTML correspondente ao slug no Supabase
  const { data, error } = await supabase
    .from('sites_gerados')
    .select('html_content')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    notFound();
  }

  // Renderiza o site em tela cheia para o seu cliente/lead visualizar
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: data.html_content }} 
      style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, border: 'none', overflow: 'auto' }}
    />
  );
}