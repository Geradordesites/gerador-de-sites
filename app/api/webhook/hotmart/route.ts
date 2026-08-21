import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // LOG PARA DEBUG: Registra no painel da Vercel o que a Hotmart enviou
    console.log('[WEBHOOK HOTMART RECEBIDO]:', JSON.stringify(body, null, 2));

    if (body.event === 'PURCHASE_APPROVED') {
      const emailComprador = body.data?.buyer?.email;
      const produtoId = body.data?.product?.id;

      let creditosParaAdicionar = 0;

      // Lê pelo ID do Produto. Isso garante que QUALQUER link promocional funcione,
      // pois o ID do produto é a raiz de todas as ofertas.
      if (produtoId == 8354118) { 
        creditosParaAdicionar = 70; // Plano Iniciante
      } else if (produtoId == 8354331) {
        creditosParaAdicionar = 200; // Plano Profissional
      } else if (produtoId == 8354316) {
        creditosParaAdicionar = 500; // Plano Agência
      }

      if (emailComprador && creditosParaAdicionar > 0) {
        // BUG CORRIGIDO: A coluna correta no banco é 'credits', e não 'creditos'
        const { data: usuario, error: fetchError } = await supabaseAdmin
          .from('profiles') 
          .select('credits') 
          .eq('email', emailComprador)
          .single();

        // Se o cliente pagou antes de criar a conta, avisa no console
        if (fetchError) {
            console.log(`[AVISO] Cliente ${emailComprador} pagou, mas ainda não tem conta. Erro:`, fetchError.message);
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Lê o saldo atual usando a coluna 'credits'
        const creditosAtuais = usuario?.credits || 0;
        const novoSaldo = creditosAtuais + creditosParaAdicionar;
        
        // Pega a data e hora exata da aprovação
        const dataAtual = new Date().toISOString();

        // Atualiza o saldo somando com o anterior na coluna correta
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ 
              credits: novoSaldo,
              data_compra: dataAtual 
          })
          .eq('email', emailComprador);

        if (updateError) {
             console.error('[ERRO AO ATUALIZAR SALDO]:', updateError.message);
             return NextResponse.json({ error: 'Erro ao atualizar saldo' }, { status: 500 });
        }
          
        console.log(`[SUCESSO] Adicionados ${creditosParaAdicionar} créditos. Novo saldo de ${emailComprador}: ${novoSaldo}`);
      } else {
         console.log(`[IGNORADO] Produto não reconhecido ou e-mail ausente. Produto ID: ${produtoId}`);
      }
    }

    return NextResponse.json({ recebido: true }, { status: 200 });
  } catch (error) {
    console.error('[ERRO INTERNO WEBHOOK]:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
