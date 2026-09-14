import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usamos a Service Role Key para poder injetar os créditos com permissão de Admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // A chave Mestra!
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. A Cakto manda o status da compra. Só queremos liberar se estiver APROVADA.
    const event = body.event || body.status;
    if (event !== 'transaction.approved' && event !== 'approved' && event !== 'paid' && event !== 'PAID') {
      return NextResponse.json({ message: 'Ignorado: Status não é de aprovação.' }, { status: 200 });
    }

    // 2. Pega o E-mail do cliente e o ID/Nome do produto que ele comprou
    const email = body.customer?.email || body.client?.email || body.email;
    const offerName = body.offer?.name || body.product?.name || body.product_name || '';
    
    if (!email) {
      return NextResponse.json({ error: 'Email não encontrado no webhook' }, { status: 400 });
    }

    // 3. Busca o cliente no nosso banco de dados
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, credits, is_premium')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error('Usuário não encontrado no banco:', email);
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // =========================================================================
    // 4. A MÁGICA ACONTECE AQUI: Lendo o nome da oferta e liberando o acesso!
    // =========================================================================
    const nomeOferta = offerName.toUpperCase();
    let updates = {};

    // A. PACOTES DE CRÉDITOS AVULSOS
    if (nomeOferta.includes('INICIANTE') || nomeOferta.includes('70 CRÉDITOS')) {
      updates = { credits: userData.credits + 70 };
    } 
    else if (nomeOferta.includes('PROFISSIONAL') || nomeOferta.includes('200 CRÉDITOS')) {
      updates = { credits: userData.credits + 200 };
    } 
    else if (nomeOferta.includes('AGÊNCIA') || nomeOferta.includes('500 CRÉDITOS')) {
      updates = { credits: userData.credits + 500 };
    }
    
    // B. PLANOS DE ASSINATURA (SUA CHAVE)
    else if (nomeOferta.includes('MENSAL') || nomeOferta.includes('ANUAL')) {
      updates = { is_premium: true }; 
    }

    // C. SAAS COMPLETO OU VITALÍCIO 
    else if (nomeOferta.includes('VITALÍCIO') || nomeOferta.includes('SAAS')) {
      console.log('Venda de High Ticket recebida! Entrar em contato com:', email);
      return NextResponse.json({ message: 'Venda de instalação recebida. Requer ação manual.' }, { status: 200 });
    }

    else {
      console.log('Oferta não mapeada:', offerName);
      return NextResponse.json({ message: 'Oferta não mapeada.' }, { status: 200 });
    }

    // 5. Atualiza o saldo do cliente no Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userData.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: `Créditos/Acesso liberados para ${email}!` }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no Webhook da Cakto:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}