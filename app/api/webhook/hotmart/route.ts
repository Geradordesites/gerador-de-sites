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
        // Busca o saldo atual na tabela 'usuarios'
        const { data: usuario, error: fetchError } = await supabaseAdmin
          .from('usuarios') 
          .select('creditos')
          .eq('email', emailComprador)
          .single();

        // Se der erro (ex: cliente pagou antes de criar a conta), avisamos no console, 
        // mas não quebramos o servidor da Hotmart
        if (fetchError) {
            console.log(`[AVISO] Cliente ${emailComprador} pagou, mas ainda não tem conta em 'usuarios'.`);
            return NextResponse.json({ error: 'Usuário não encontrado ainda' }, { status: 404 });
        }

        const creditosAtuais = usuario?.creditos || 0;
        const novoSaldo = creditosAtuais + creditosParaAdicionar;
        
        // Pega a data e hora exata da aprovação
        const dataAtual = new Date().toISOString();

        // Atualiza o saldo somando com o anterior e registra a data da compra
        await supabaseAdmin
          .from('usuarios')
          .update({ 
              creditos: novoSaldo,
              data_compra: dataAtual 
          })
          .eq('email', emailComprador);
          
        console.log(`Sucesso! Adicionados ${creditosParaAdicionar} créditos. Novo saldo de ${emailComprador}: ${novoSaldo}`);
      }
    }

    return NextResponse.json({ recebido: true }, { status: 200 });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
