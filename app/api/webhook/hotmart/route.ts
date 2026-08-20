import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.event === 'PURCHASE_APPROVED') {
      const emailComprador = body.data.buyer.email;
      const produtoId = body.data.product.id;

      let creditosParaAdicionar = 0;

      // IDs configurados para o seu sistema:
      if (produtoId == 8354118) { 
        creditosParaAdicionar = 70; // Plano Iniciante
      } else if (produtoId == 8354331) {
        creditosParaAdicionar = 200; // Plano Profissional
      } else if (produtoId == 8354316) {
        creditosParaAdicionar = 500; // Plano Agência
      }

      if (emailComprador && creditosParaAdicionar > 0) {
        // ATENÇÃO: Se a sua tabela não for 'usuarios', troque o nome abaixo:
        const { data: usuario, error: fetchError } = await supabaseAdmin
          .from('usuarios') 
          .select('creditos')
          .eq('email', emailComprador)
          .single();

        if (fetchError) throw fetchError;

        const creditosAtuais = usuario?.creditos || 0;

        await supabaseAdmin
          .from('usuarios')
          .update({ creditos: creditosAtuais + creditosParaAdicionar })
          .eq('email', emailComprador);
      }
    }

    return NextResponse.json({ recebido: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
