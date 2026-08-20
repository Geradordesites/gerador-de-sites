import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usamos a Service Role Key para ter permissão de administrador e poder adicionar os créditos
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verifica se o evento é uma "Compra Aprovada" da Hotmart
    if (body.event === 'PURCHASE_APPROVED') {
      const emailComprador = body.data.buyer.email;
      const produtoId = body.data.product.id; 

      let creditosParaAdicionar = 0;

      // ATENÇÃO: Você vai trocar esses números pelos IDs dos seus produtos reais lá da Hotmart
      if (produtoId == 111111) {
        creditosParaAdicionar = 70;  // Plano Iniciante
      } else if (produtoId == 222222) {
        creditosParaAdicionar = 200; // Plano Profissional
      } else if (produtoId == 333333) {
        creditosParaAdicionar = 500; // Plano Agência
      }

      if (emailComprador && creditosParaAdicionar > 0) {
        // 1. Puxa os créditos que o usuário já tem hoje
        // IMPORTANTE: Troque 'usuarios' pelo nome exato da sua tabela no Supabase
        const { data: usuario } = await supabaseAdmin
          .from('usuarios') 
          .select('creditos')
          .eq('email', emailComprador)
          .single();

        const creditosAtuais = usuario?.creditos || 0;

        // 2. Soma os créditos antigos com os novos que ele acabou de comprar
        await supabaseAdmin
          .from('usuarios')
          .update({ creditos: creditosAtuais + creditosParaAdicionar })
          .eq('email', emailComprador);
          
        console.log(`Sucesso: ${creditosParaAdicionar} créditos adicionados para ${emailComprador}`);
      }
    }

    // Responde para a Hotmart que recebemos o aviso com sucesso
    return NextResponse.json({ recebido: true }, { status: 200 });
    
  } catch (error) {
    console.error('Erro no Webhook da Hotmart:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}