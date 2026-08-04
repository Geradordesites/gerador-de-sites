import { supabase } from '@/lib/supabase';

export default async function PublicSitePage({ params }: { params: { slug: string } }) {
  // Ajuste de segurança para o Next.js mais recente
  const { slug } = await params;

  const { data, error } = await supabase
    .from('sites_gerados')
    .select('html_content')
    .eq('slug', slug)
    .single();

  // Se o Supabase der erro (ex: bloqueio de leitura), ele mostra o erro exato na tela
  if (error) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#333' }}>
        <h2 style={{ color: '#ef4444' }}>Erro de Conexão com o Banco</h2>
        <p>O Supabase retornou o seguinte erro ao tentar ler o site:</p>
        <code style={{ background: '#f1f5f9', padding: '10px', display: 'block', borderRadius: '5px' }}>
          {error.message}
        </code>
      </div>
    );
  }

  // Se não achar o site, mostra qual link ele tentou procurar
  if (!data) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#333' }}>
        <h2>Site não encontrado</h2>
        <p>Não encontramos nenhum site salvo com o link: <strong>{slug}</strong></p>
      </div>
    );
  }

  // Se tudo der certo, renderiza o site!
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: data.html_content }} 
      style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, border: 'none', overflow: 'auto' }}
    />
  );
}