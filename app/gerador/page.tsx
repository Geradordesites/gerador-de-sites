// =========================================================================
// CÓDIGOS HTML COMPLETOS DOS SITES DE EXEMPLO (COM MENU RESPONSIVO BLINDADO)
// =========================================================================

const SITE_EBOOK = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código da Prosperidade | O Guia Prático para Multiplicar sua Renda</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        emeraldCustom: {
                            50: '#f0fdf4',
                            100: '#dcfce7',
                            500: '#10b981',
                            600: '#059669',
                            700: '#047857',
                            800: '#065f46',
                            900: '#064e3b',
                            950: '#022c22',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-emeraldCustom-50 text-slate-800 font-sans antialiased selection:bg-emeraldCustom-600 selection:text-white ">

    <!-- MENU SUPERIOR FIXO (CORRIGIDO) -->
    <nav class="fixed top-0 left-0 w-full bg-emeraldCustom-950/95 backdrop-blur-md text-white z-50 border-b border-emeraldCustom-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 lg:gap-3 shrink-0">
                <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-tr from-emeraldCustom-500 to-green-400 flex items-center justify-center text-emeraldCustom-950 font-black text-lg lg:text-xl shadow-md">
                    <i class="fas fa-book-open"></i>
                </div>
                <span class="font-extrabold text-base lg:text-xl tracking-tight text-white hidden sm:block">CÓDIGO <span class="text-emeraldCustom-500">PROSPERIDADE</span></span>
            </div>
            
            <div class="hidden md:flex items-center gap-3 lg:gap-8 font-medium text-[11px] lg:text-sm text-emeraldCustom-100 whitespace-nowrap">
                <a href="#inicio" class="hover:text-emeraldCustom-500 transition-colors">Início</a>
                <a href="#problemas" class="hover:text-emeraldCustom-500 transition-colors">Para Quem É</a>
                <a href="#conteudo" class="hover:text-emeraldCustom-500 transition-colors">O Conteúdo</a>
                <a href="#autor" class="hover:text-emeraldCustom-500 transition-colors">Sobre o Autor</a>
                <a href="#faq" class="hover:text-emeraldCustom-500 transition-colors">Dúvidas</a>
            </div>

            <div class="shrink-0">
                <a href="#checkout" class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 lg:px-5 lg:py-2.5 rounded-full text-[11px] lg:text-sm shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2 whitespace-nowrap">
                    <span>QUERO O E-BOOK</span>
                    <i class="fas fa-arrow-right text-xs"></i>
                </a>
            </div>
        </div>
    </nav>

    <!-- ESPAÇADOR DO MENU -->
    <div class="h-20"></div>

    <!-- SEÇÃO 1: HERO (PROMESSA PRINCIPAL) -->
    <section id="inicio" class="relative bg-gradient-to-b from-emeraldCustom-950 via-emeraldCustom-900 to-emeraldCustom-800 text-white py-16 md:py-24 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
                
                <div class="w-full md:w-1/2 text-center md:text-left">
                    <div class="inline-flex items-center gap-2 bg-emeraldCustom-800/80 border border-emeraldCustom-600 px-4 py-1.5 rounded-full text-emeraldCustom-100 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
                        <i class="fas fa-star text-amber-400"></i> Método Comprovado de Liberdade Financeira
                    </div>
                    
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                        Aprenda o Passo a Passo Exato para Organizar suas Finanças e Multiplicar seu Dinheiro sem Sofrimento
                    </h1>
                    
                    <p class="text-lg md:text-xl text-emeraldCustom-100 leading-relaxed font-light mb-6">
                        Descubra o mapa definitivo criado para quem deseja sair das dívidas, construir uma reserva sólida e alcançar a verdadeira segurança financeira investindo com inteligência.
                    </p>
                    
                    <div class="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start mb-8">
                        <a href="#checkout" class="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-orange-500/40 transition-all duration-300 text-center transform hover:-translate-y-1 inline-flex items-center justify-center gap-3">
                            <i class="fas fa-download"></i>
                            <span>QUERO ACESSAR O E-BOOK AGORA</span>
                        </a>
                    </div>

                    <div class="flex items-center justify-center md:justify-start gap-6 text-xs text-emeraldCustom-100 opacity-90">
                        <div class="flex items-center gap-1.5">
                            <i class="fas fa-bolt text-amber-400"></i> Download Imediato
                        </div>
                        <div class="flex items-center gap-1.5">
                            <i class="fas fa-shield-alt text-emeraldCustom-500"></i> Leitura em Qualquer Dispositivo
                        </div>
                    </div>
                </div>

                <div class="w-full md:w-1/2 flex justify-center">
                    <div class="relative max-w-md w-full">
                        <div class="absolute -inset-1 bg-gradient-to-r from-emeraldCustom-500 to-amber-400 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
                        <div class="relative bg-emeraldCustom-900 border border-emeraldCustom-700 p-4 rounded-2xl shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80" alt="Mockup do E-book Código da Prosperidade" class="w-full h-auto object-cover rounded-xl shadow-md">
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- SEÇÃO 2: AGITAÇÃO DA DOR E IDENTIFICAÇÃO -->
    <section id="problemas" class="py-20 bg-white text-slate-800">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emeraldCustom-950 mb-4">
                    Você Se Sente Preso em um Ciclo Sem Fim Onde o Dinheiro Nunca É Suficiente?
                </h2>
                
                <p class="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                    Você trabalha duro o mês inteiro, abre mão do seu tempo livre, mas quando o salário cai na conta, parece que ele desaparece instantaneamente em boletos e despesas imprevistas.
                </p>
            </div>

            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <img src="https://images.unsplash.com/photo-1666558890267-12e89b72808d?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHwzfHxzdHJlc3NlZCUyMHBlcnNvbiUyMGRlc2slMjB3b3JraW5nfGVufDB8MXx8fDE3ODczMTgyNjF8MA&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Pessoa preocupada com contas" class="w-full h-auto object-cover rounded-2xl shadow-xl border border-slate-100">
                </div>

                <div class="space-y-6">
                    <div class="flex gap-4 items-start bg-emeraldCustom-50 p-5 rounded-2xl border border-emeraldCustom-100">
                        <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg flex-shrink-0 mt-1">
                            <i class="fas fa-times"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-900 text-lg mb-2">Ansiedade ao Abrir o Extrato</h3>
                            <p class="text-slate-600 text-sm leading-relaxed mb-4">
                                Medo constante de verificar o saldo bancário e ver que não sobrou nada para seus sonhos ou emergências.
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-4 items-start bg-emeraldCustom-50 p-5 rounded-2xl border border-emeraldCustom-100">
                        <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg flex-shrink-0 mt-1">
                            <i class="fas fa-times"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-900 text-lg mb-2">Sensação de Trabalhar Apenas para Pagar Contas</h3>
                            <p class="text-slate-600 text-sm leading-relaxed mb-4">
                                Ter a nítida impressão de que está trocando sua vida e energia por um estilo de vida que não sai do lugar.
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-4 items-start bg-emeraldCustom-50 p-5 rounded-2xl border border-emeraldCustom-100">
                        <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg flex-shrink-0 mt-1">
                            <i class="fas fa-times"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-900 text-lg mb-2">Falta de Direção nos Investimentos</h3>
                            <p class="text-slate-600 text-sm leading-relaxed mb-4">
                                Desejar investir, mas se sentir completamente perdido com tantos termos técnicos e promessas falsas na internet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- SEÇÃO 3: A SOLUÇÃO (CONTEÚDO DO E-BOOK) -->
    <section id="conteudo" class="py-20 bg-emeraldCustom-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div class="text-center max-w-3xl mx-auto">
                <span class="text-emeraldCustom-500 font-bold uppercase tracking-wider text-xs mb-2 block">O Que Você Vai Encontrar</span>
                <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                    Um Guia Prático, Direto ao Ponto e Livre de Enrolação
                </h2>
                
                <p class="text-emeraldCustom-100 text-base sm:text-lg mb-6">
                    Este e-book foi projetado para levar você da estagnação financeira para a construção de patrimônio real em 5 etapas bem estruturadas.
                </p>
            </div>

            <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-emeraldCustom-950 p-8 rounded-2xl border border-emeraldCustom-800 shadow-lg hover:border-emeraldCustom-500 transition-all duration-300">
                    <div class="w-12 h-12 bg-emeraldCustom-600/20 text-emeraldCustom-500 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                        01
                    </div>
                    <h3 class="text-xl font-bold text-white mb-4">Diagnóstico &amp; Blindagem Financeira</h3>
                    <p class="text-emeraldCustom-100 text-sm leading-relaxed mb-4">
                        Como estancar os vazamentos invisíveis de dinheiro e reestruturar suas contas do mês em menos de 7 dias.
                    </p>
                </div>

                <div class="bg-emeraldCustom-950 p-8 rounded-2xl border border-emeraldCustom-800 shadow-lg hover:border-emeraldCustom-500 transition-all duration-300">
                    <div class="w-12 h-12 bg-emeraldCustom-600/20 text-emeraldCustom-500 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                        02
                    </div>
                    <h3 class="text-xl font-bold text-white mb-4">A Psicologia da Riqueza</h3>
                    <p class="text-emeraldCustom-100 text-sm leading-relaxed mb-4">
                        Elimine crenças limitantes sobre o dinheiro e desenvolva a mentalidade das pessoas que acumulam capital sustentável.
                    </p>
                </div>

                <div class="bg-emeraldCustom-950 p-8 rounded-2xl border border-emeraldCustom-800 shadow-lg hover:border-emeraldCustom-500 transition-all duration-300">
                    <div class="w-12 h-12 bg-emeraldCustom-600/20 text-emeraldCustom-500 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                        03
                    </div>
                    <h3 class="text-xl font-bold text-white mb-4">O Plano Antidívidas</h3>
                    <p class="text-emeraldCustom-100 text-sm leading-relaxed mb-4">
                        Método prático de negociação e quitação acelerada de pendências sem sacrificar seu padrão de vida básico.
                    </p>
                </div>

                <div class="bg-emeraldCustom-950 p-8 rounded-2xl border border-emeraldCustom-800 shadow-lg hover:border-emeraldCustom-500 transition-all duration-300">
                    <div class="w-12 h-12 bg-emeraldCustom-600/20 text-emeraldCustom-500 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                        04
                    </div>
                    <h3 class="text-xl font-bold text-white mb-4">Investimento Sem Mistério</h3>
                    <p class="text-emeraldCustom-100 text-sm leading-relaxed mb-4">
                        O passo a passo para fazer suas primeiras aplicações com segurança, focando em Renda Fixa e ativos de baixo risco.
                    </p>
                </div>

                <div class="bg-emeraldCustom-950 p-8 rounded-2xl border border-emeraldCustom-800 shadow-lg hover:border-emeraldCustom-500 transition-all duration-300">
                    <div class="w-12 h-12 bg-emeraldCustom-600/20 text-emeraldCustom-500 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                        05
                    </div>
                    <h3 class="text-xl font-bold text-white mb-4">Multiplicação &amp; Renda Passiva</h3>
                    <p class="text-emeraldCustom-100 text-sm leading-relaxed mb-4">
                        Como criar fontes alternativas de renda e fazer com que os juros compostos trabalhem a seu favor ao longo dos anos.
                    </p>
                </div>

                <div class="bg-gradient-to-br from-emeraldCustom-800 to-emeraldCustom-950 p-8 rounded-2xl border border-emeraldCustom-600 flex flex-col justify-center items-center text-center shadow-lg">
                    <i class="fas fa-gift text-4xl text-amber-400 mb-4"></i>
                    <h3 class="text-xl font-bold text-white mb-4">+ Bônus Exclusivos Incluídos</h3>
                    <p class="text-emeraldCustom-100 text-sm leading-relaxed mb-4">
                        Planilha automática de controle financeiro e guia de bolso para compras inteligentes.
                    </p>
                </div>
            </div>

            <div class="mt-12 text-center">
                <a href="#checkout" class="bg-orange-500 hover:bg-orange-600 text-white font-black text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-orange-500/40 transition-all duration-300 inline-flex items-center gap-3 transform hover:-translate-y-1">
                    <span>QUERO MEU EXEMPLAR DIGITAL AGORA</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>

        </div>
    </section>

    <!-- SEÇÃO 4: SOBRE O AUTOR (HISTÓRIA CONSOLIDADA) -->
    <section id="autor" class="py-20 bg-white text-slate-800">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
                
                <div class="w-full md:w-5/12">
                    <div class="relative">
                        <div class="absolute -inset-2 bg-emeraldCustom-500 rounded-2xl transform rotate-3 opacity-20"></div>
                        <img src="https://images.unsplash.com/photo-1765648763932-43a3e2f8f35c?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw0fHxjb25maWRlbnQlMjBidXNpbmVzcyUyMG1lbnRvciUyMGNvbnN1bHRhbnR8ZW58MHwxfHx8MTc4NzMxODI2Mnww&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Especialista e Autor do Guia" class="relative w-full h-auto object-cover rounded-2xl shadow-xl">
                    </div>
                </div>

                <div class="w-full md:w-7/12">
                    <span class="text-emeraldCustom-600 font-bold uppercase tracking-wider text-xs mb-2 block">Sobre o Autor</span>
                    
                    <h2 class="text-3xl sm:text-4xl font-extrabold text-emeraldCustom-950 mb-4">
                        Especialista em Planejamento e Inteligência Financeira
                    </h2>
                    
                    <p class="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">
                        Com ampla experiência no setor financeiro e no estudo do comportamento econômico, dedico minha trajetória a simplificar conceitos complexos e transformá-los em métodos práticos para o dia a dia.
                    </p>

                    <p class="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">
                        Depois de analisar os principais erros que travam o crescimento financeiro da maioria das pessoas, desenvolvi uma metodologia focada em organização, eliminação de gargalos e construção consistente de patrimônio.
                    </p>

                    <p class="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">
                        Este material reúne as estratégias mais eficientes e validadas, condensadas em um passo a passo direto ao ponto para que você conquiste clareza, segurança e autonomia na sua vida financeira.
                    </p>

                    <div class="pt-4 border-t border-slate-100 flex items-center gap-6">
                        <div>
                            <div class="text-2xl font-black text-emeraldCustom-700">100%</div>
                            <div class="text-xs text-slate-500 font-medium">Método Prático e Aplicável</div>
                        </div>
                        <div class="h-8 w-px bg-slate-200"></div>
                        <div>
                            <div class="text-2xl font-black text-emeraldCustom-700">Comprovado</div>
                            <div class="text-xs text-slate-500 font-medium">Foco em Resultados Reais</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- SEÇÃO 5: PROVA SOCIAL / DEPOIMENTOS -->
    <section class="py-20 bg-emeraldCustom-50 text-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-3xl sm:text-4xl font-extrabold text-emeraldCustom-950 mb-4">
                    Veja o Que Dizem Quem Já Aplicou o Método
                </h2>
                
                <p class="text-slate-600 text-base sm:text-lg mb-6">
                    Pessoas comuns que decidiram tomar o controle de suas vidas financeiras e conquistaram resultados reais.
                </p>
            </div>

            <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-400 gap-1 mb-4">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                        <p class="text-slate-600 text-sm leading-relaxed mb-4">
                            "Em apenas 3 semanas aplicando o capítulo de blindagem, consegui renegociar uma dívida antiga com 60% de desconto e guardei minhas primeiras economias." 
                        </p>
                    </div>
                    <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80" alt="Foto Depoimento Mariana" class="w-12 h-12 rounded-full object-cover">
                        <div>
                            <div class="font-bold text-slate-900 text-sm">Mariana Costa</div>
                            <div class="text-xs text-slate-500">São Paulo / SP</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-400 gap-1 mb-4">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                        <p class="text-slate-600 text-sm leading-relaxed mb-4">
                            "O e-book é extremamente direto. Sem termos complicados de economistas. Aprendi a montar minha reserva de emergência e hoje durmo em paz." 
                        </p>
                    </div>
                    <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <img src="https://images.unsplash.com/photo-1770452603217-89b4f03e8271?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw1fHxzbWlsaW5nJTIwcHJvZmVzc2lvbmFsJTIwbWFuJTIwcG9ydHJhaXR8ZW58MHwyfHx8MTc4NzMxODI2M3ww&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Foto Depoimento Carlos" class="w-12 h-12 rounded-full object-cover">
                        <div>
                            <div class="font-bold text-slate-900 text-sm">Carlos Eduardo</div>
                            <div class="text-xs text-slate-500">Curitiba / PR</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-400 gap-1 mb-4">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                        <p class="text-slate-600 text-sm leading-relaxed mb-4">
                            "Valeu cada centavo! As planilhas bônus me ajudaram a ver exatamente para onde meu dinheiro estava indo. Recomendo para todo mundo." 
                        </p>
                    </div>
                    <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <img src="https://images.unsplash.com/photo-1632828169028-11b148c180fb?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw1fHxoYXBweSUyMHlvdW5nJTIwcHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MHwyfHx8MTc4NzMxODI2M3ww&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Foto Depoimento Patricia" class="w-12 h-12 rounded-full object-cover">
                        <div>
                            <div class="font-bold text-slate-900 text-sm">Patrícia Mendes</div>
                            <div class="text-xs text-slate-500">Belo Horizonte / MG</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- SEÇÃO 6: PERGUNTAS FREQUENTES (FAQ) -->
    <section id="faq" class="py-20 bg-white text-slate-800">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div class="text-center mb-12">
                <h2 class="text-3xl sm:text-4xl font-extrabold text-emeraldCustom-950 mb-4">
                    Dúvidas Frequentes
                </h2>
                
                <p class="text-slate-600 text-base sm:text-lg mb-6">
                    Tudo o que você precisa saber antes de adquirir o seu guia digital.
                </p>
            </div>

            <div class="space-y-4">
                <details class="group bg-emeraldCustom-50 rounded-2xl p-6 border border-emeraldCustom-100 [&amp;_summary::-webkit-details-marker]:hidden cursor-pointer transition-colors hover:bg-emeraldCustom-100/50">
                    <summary class="flex items-center justify-between font-bold text-slate-900 text-lg outline-none select-none">
                        <span>Como vou receber o e-book após a compra?</span>
                        <span class="transition transform group-open:-rotate-180 text-emeraldCustom-600">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </summary>
                    <p class="mt-4 text-slate-600 text-sm leading-relaxed mb-4">
                        O acesso é imediato! Assim que o seu pagamento for confirmado pelo sistema, você receberá um e-mail com o link exclusivo para baixar o e-book nos formatos PDF e EPUB, podendo ler em seu celular, tablet ou computador.
                    </p>
                </details>

                <details class="group bg-emeraldCustom-50 rounded-2xl p-6 border border-emeraldCustom-100 [&amp;_summary::-webkit-details-marker]:hidden cursor-pointer transition-colors hover:bg-emeraldCustom-100/50">
                    <summary class="flex items-center justify-between font-bold text-slate-900 text-lg outline-none select-none">
                        <span>Preciso entender de economia ou matemática financeira?</span>
                        <span class="transition transform group-open:-rotate-180 text-emeraldCustom-600">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </summary>
                    <p class="mt-4 text-slate-600 text-sm leading-relaxed mb-4">
                        Absolutamente não! O livro foi escrito em linguagem simples, direta e prática, pensado exatamente para iniciantes que desejam resultados rápidos sem complicações teóricas.
                    </p>
                </details>

                <details class="group bg-emeraldCustom-50 rounded-2xl p-6 border border-emeraldCustom-100 [&amp;_summary::-webkit-details-marker]:hidden cursor-pointer transition-colors hover:bg-emeraldCustom-100/50">
                    <summary class="flex items-center justify-between font-bold text-slate-900 text-lg outline-none select-none">
                        <span>Quais são as formas de pagamento aceitas?</span>
                        <span class="transition transform group-open:-rotate-180 text-emeraldCustom-600">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </summary>
                    <p class="mt-4 text-slate-600 text-sm leading-relaxed mb-4">
                        Aceitamos PIX (com liberação instantânea), Cartões de Crédito em até 12x e Cartão Virtual Caixa. A transação é 100% criptografada e segura.
                    </p>
                </details>

                <details class="group bg-emeraldCustom-50 rounded-2xl p-6 border border-emeraldCustom-100 [&amp;_summary::-webkit-details-marker]:hidden cursor-pointer transition-colors hover:bg-emeraldCustom-100/50">
                    <summary class="flex items-center justify-between font-bold text-slate-900 text-lg outline-none select-none">
                        <span>E se eu ler e achar que não é para mim?</span>
                        <span class="transition transform group-open:-rotate-180 text-emeraldCustom-600">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </summary>
                    <p class="mt-4 text-slate-600 text-sm leading-relaxed mb-4">
                        Você conta com nossa garantia incondicional de 7 dias. Se por qualquer motivo você achar que o conteúdo não agregou valor, basta enviar um único e-mail e devolveremos 100% do seu dinheiro sem perguntas.
                    </p>
                </details>
            </div>

        </div>
    </section>

    <!-- SEÇÃO 7: OFERTA IRRESISTÍVEL E GARANTIA (CHECKOUT) -->
    <section id="checkout" class="py-20 bg-gradient-to-b from-emeraldCustom-900 to-emeraldCustom-950 text-white relative overflow-hidden">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div class="bg-emeraldCustom-950 border-2 border-emeraldCustom-500 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative">
                
                <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-emeraldCustom-950 font-black text-xs sm:text-sm px-6 py-2 rounded-full uppercase tracking-wider shadow-md">
                    Oferta Especial por Tempo Limitado
                </div>

                <h2 class="text-3xl sm:text-4xl font-black text-white mt-4 mb-4">
                    Garanta Seu Acesso ao E-book Código da Prosperidade
                </h2>
                
                <p class="text-emeraldCustom-100 text-base sm:text-lg mb-6">
                    Receba o livro digital completo + todos os bônus exclusivos e comece sua transformação financeira hoje mesmo.
                </p>

                <!-- ANCORAGEM DE PREÇO -->
                <div class="my-8 bg-emeraldCustom-900/60 p-6 rounded-2xl border border-emeraldCustom-800 max-w-md mx-auto">
                    <span class="text-slate-400 line-through text-lg block mb-1">De R$ 197,00</span>
                    <span class="text-sm text-emeraldCustom-100 block mb-2">Por apenas 12x de</span>
                    <div class="text-5xl font-black text-amber-400 mb-2">
                        R$ 9,74
                    </div>
                    <span class="text-xs text-slate-300 block">ou R$ 97,00 à vista no PIX ou Cartão</span>
                </div>

                <!-- CTA PRINCIPAL DE COMPRA -->
                <div class="mb-8">
                    <a href="#checkout" class="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-xl px-10 py-5 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center gap-3 transform hover:-translate-y-1 text-center">
                        <i class="fas fa-shopping-cart"></i>
                        <span>QUERO APROVEITAR A PROMOÇÃO E COMPRAR AGORA</span>
                    </a>
                </div>

                <!-- SINAIS DE SEGURANÇA -->
                <div class="flex flex-wrap items-center justify-center gap-6 text-xs text-emeraldCustom-100 opacity-90 border-t border-emeraldCustom-800/80 pt-6">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-lock text-emeraldCustom-500 text-base"></i> Pagamento 100% Seguro
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="fas fa-bolt text-amber-400 text-base"></i> Acesso Imediato no E-mail
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="fas fa-shield-alt text-emeraldCustom-500 text-base"></i> Garantia de 7 Dias
                    </div>
                </div>

            </div>

            <!-- SELO DE GARANTIA -->
            <div class="mt-12 bg-emeraldCustom-900/40 border border-emeraldCustom-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div class="w-20 h-20 rounded-full bg-amber-400/10 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-3xl font-black flex-shrink-0">
                    <i class="fas fa-award"></i>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white mb-2">
                        Garantia Incondicional de Riscos Zero (7 Dias)
                    </h3>
                    <p class="text-emeraldCustom-100 text-sm leading-relaxed mb-4">
                        Leia o e-book, aplique o método e avalie os resultados. Se você sentir que o conteúdo não é para você, basta solicitar o reembolso integral dentro de 7 dias. Seu investimento está totalmente protegido.
                    </p>
                </div>
            </div>

        </div>
    </section>

    <!-- RODAPÉ JURÍDICO COMPLIANCE -->
    <footer class="w-full font-sans py-16 bg-emeraldCustom-950 text-emeraldCustom-100 border-t border-emeraldCustom-800">
        <div class="max-w-5xl mx-auto px-6">
            <div class="text-center mb-10">
                <h3 class="text-xl font-bold mb-4 text-white">Informações Legais Importantes</h3>
                <p class="text-sm text-emeraldCustom-100 opacity-90">Clique nos links abaixo para ler a íntegra de cada política.</p>
            </div>
            <div class="space-y-4 max-w-4xl mx-auto mb-12" id="rodape-sanfonas">
                <details id="det-privacidade" class="rounded-2xl border border-emeraldCustom-800 bg-emeraldCustom-900/50 transition-colors cursor-pointer" onclick="const e = document.getElementById('det-termos'); if(e.hasAttribute('open')) { e.removeAttribute('open'); }">
                    <summary class="p-6 font-bold text-lg outline-none select-none flex items-center justify-between text-white" style="list-style: none;">Política de Privacidade <i class="fas fa-chevron-down text-sm opacity-60"></i></summary>
                    <div class="p-6 pt-2 text-sm leading-relaxed border-t border-emeraldCustom-800/60 opacity-90 text-emeraldCustom-100">
                        <p class="mb-4"><strong>1. Coleta e Uso de Dados:</strong> Em conformidade com a LGPD, coletamos informações de navegação exclusivamente para otimizar sua experiência neste site e melhorar o direcionamento dos nossos anúncios.</p>
                        <p class="mb-4"><strong>2. Segurança:</strong> Seus dados de pagamento são processados diretamente pelas plataformas de pagamento certificadas e criptografadas. Nós não temos acesso aos dados do seu cartão de crédito.</p>
                        <p><strong>3. Contato:</strong> Para requisições de exclusão de dados ou dúvidas legais, utilize nosso e-mail oficial de suporte ao leitor.</p>
                    </div>
                </details>
                <details id="det-termos" class="rounded-2xl border border-emeraldCustom-800 bg-emeraldCustom-900/50 transition-colors cursor-pointer" onclick="const e = document.getElementById('det-privacidade'); if(e.hasAttribute('open')) { e.removeAttribute('open'); }">
                    <summary class="p-6 font-bold text-lg outline-none select-none flex items-center justify-between text-white" style="list-style: none;">Termos de Uso <i class="fas fa-chevron-down text-sm opacity-60"></i></summary>
                    <div class="p-6 pt-2 text-sm leading-relaxed border-t border-emeraldCustom-800/60 opacity-90 text-emeraldCustom-100">
                        <p class="mb-4"><strong>1. Isenção de Responsabilidade:</strong> Os resultados obtidos dependem do esforço individual de cada usuário e da correta aplicação do método. Casos de sucesso relatados não configuram garantia de ganhos idênticos.</p>
                        <p class="mb-4"><strong>2. Redes Sociais:</strong> Este portal não é endossado, administrado ou patrocinado por plataformas de terceiros como Meta, Google ou TikTok.</p>
                        <p><strong>3. Direitos Autorais:</strong> É terminantemente proibida a cópia, pirataria, rateio ou distribuição ilegal de qualquer conteúdo deste e-book sob pena de processos judiciais severos.</p>
                    </div>
                </details>
            </div>
            <div class="text-center pt-8 border-t border-emeraldCustom-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="font-medium tracking-wide text-sm opacity-90">© 2026 Código da Prosperidade. Todos os direitos reservados.</p>
                <div class="flex gap-4 text-xl opacity-80 text-emeraldCustom-100">
                    <i class="fab fa-cc-visa"></i>
                    <i class="fab fa-cc-mastercard"></i>
                    <i class="fas fa-pix"></i>
                    <i class="fas fa-lock"></i>
                </div>
            </div>
        </div>
        <script>document.querySelectorAll('#rodape-sanfonas summary').forEach(s => { s.style.listStyle = 'none'; if(s.childNodes[0] && s.childNodes[0].nodeName === "#text" && s.childNodes[0].nodeValue.includes('▶')) s.childNodes[0].nodeValue = ''; });</script>
    </footer>

</body></html>`;

const SITE_MENTORIA = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TRG - Terapia de Reprocessamento Generativo | Libertação Emocional e Cura de Traumas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        serif: ['Playfair Display', 'serif'],
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                    },
                    colors: {
                        navy: {
                            950: '#040B14',
                            900: '#0B1A30',
                            800: '#132847',
                            700: '#1D3B66',
                            600: '#2A528A',
                            50: '#F0F4F9'
                        },
                        gold: {
                            400: '#F3C669',
                            500: '#D4A338',
                            600: '#B58322',
                            700: '#8C6212'
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-white text-navy-900 font-sans antialiased selection:bg-gold-500 selection:text-white">

    <!-- MENU SUPERIOR FIXO (CORRIGIDO) -->
    <nav class="fixed top-0 left-0 w-full bg-navy-900/95 backdrop-blur-md border-b border-navy-800 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center gap-2">
            <a href="#" class="flex items-center gap-2 lg:gap-3 group shrink-0">
                <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center text-navy-950 font-serif font-bold text-lg lg:text-xl shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">
                    T
                </div>
                <div class="flex flex-col">
                    <span class="font-serif text-sm lg:text-lg font-bold tracking-wide text-white leading-tight">Instituto TRG</span>
                    <span class="text-[8px] lg:text-xs text-gold-400 font-medium tracking-widest uppercase hidden sm:block">Reprocessamento Emocional</span>
                </div>
            </a>

            <div class="hidden md:flex items-center gap-3 lg:gap-8 text-[11px] lg:text-sm font-medium text-slate-200 whitespace-nowrap">
                <a href="#sobre" class="hover:text-gold-400 transition-colors">O Método</a>
                <a href="#o-que-resolve" class="hover:text-gold-400 transition-colors">O Que Trata</a>
                <a href="#passos" class="hover:text-gold-400 transition-colors">Como Funciona</a>
                <a href="#depoimentos" class="hover:text-gold-400 transition-colors">Depoimentos</a>
            </div>

            <a href="#agendamento" class="shrink-0 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold px-4 py-2 lg:px-6 lg:py-2.5 rounded-full text-[11px] lg:text-sm shadow-md hover:shadow-gold-500/20 transition-all transform hover:-translate-y-0.5 border border-gold-400/30 flex items-center gap-2 whitespace-nowrap">
                <i class="fab fa-whatsapp text-sm lg:text-base"></i>
                <span>Agendar Sessão</span>
            </a>
        </div>
    </nav>

    <!-- SEÇÃO 1: HERO SECTION -->
    <section class="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-navy-900 text-white overflow-hidden flex items-center min-h-screen">
        <!-- Background gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 opacity-95"></div>
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent opacity-10"></div>

        <div class="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div class="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
                
                <div class="w-full md:w-1/2 text-left space-y-6">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                        <i class="fas fa-shield-halved text-gold-400"></i> Terapia de Reprocessamento Generativo
                    </div>
                    
                    <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
                        Você continuará repetindo os mesmos padrões de dor ou fará a escolha de se libertar agora?
                    </h1>
                    
                    <p class="mb-6 text-slate-300 text-base md:text-lg font-light leading-relaxed">
                        Traumas do passado, ansiedade paralisante e bloqueios invisíveis não precisam definir o seu futuro. Através do reprocessamento estruturado, é possível desligar a dor associada às memórias e retomar o controle definitivo da sua vida em poucas sessões.
                    </p>
                    
                    <div class="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <a href="#agendamento" class="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-extrabold text-center px-8 py-4 rounded-xl shadow-xl hover:shadow-gold-500/30 transition-all transform hover:-translate-y-1 text-base tracking-wide flex items-center justify-center gap-3 group">
                            <span>Quero me libertar</span>
                            <i class="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
                        </a>
                        
                        <div class="flex items-center justify-center sm:justify-start gap-3 px-4 py-2 text-slate-300 text-xs font-medium">
                            <i class="fas fa-lock text-gold-400 text-base"></i>
                            <span>Atendimento 100% confidencial & sigiloso</span>
                        </div>
                    </div>

                    <div class="pt-6 border-t border-navy-800/80 flex items-center gap-6 text-xs text-slate-400">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-check-circle text-gold-400"></i>
                            <span>Sem dependência de medicamentos</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-check-circle text-gold-400"></i>
                            <span>Resultados mensuráveis</span>
                        </div>
                    </div>
                </div>

                <div class="w-full md:w-1/2 relative">
                    <div class="relative mx-auto max-w-md lg:max-w-none">
                        <div class="absolute -inset-1 bg-gradient-to-r from-gold-500 to-navy-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div class="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl bg-navy-800">
                            <img src="https://images.unsplash.com/photo-1624268010368-2c3def0a26ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxzZXJlbmUlMjB3b21hbiUyMHBlYWNlZnVsJTIwZmFjZSUyMGxpZ2h0JTIwYmFja2dyb3VuZHxlbnwwfDF8fHwxNzg3MzE4OTA4fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Pessoa tranquila após libertação emocional com TRG" class="w-full h-[480px] lg:h-[540px] object-cover object-center transform hover:scale-105 transition-transform duration-700" />
                            <div class="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"></div>
                            <div class="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-navy-900/90 border border-gold-500/30 backdrop-blur-md">
                                <p class="text-xs text-gold-400 font-bold uppercase tracking-wider mb-1">Transformação Real</p>
                                <p class="text-sm text-slate-200 italic font-serif">"O alívio imediato no peito e a sensação de paz interior que eu não sentia há mais de vinte anos."</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- SEÇÃO 2: SOBRE O PROFISSIONAL E O MÉTODO -->
    <section id="sobre" class="py-20 md:py-28 bg-white text-navy-900 relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                
                <div class="w-full lg:w-5/12">
                    <div class="relative">
                        <div class="absolute -bottom-6 -right-6 w-full h-full border-2 border-gold-500 rounded-2xl -z-10 hidden sm:block"></div>
                        <img src="https://images.unsplash.com/photo-1762341124796-530c0085f7d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHwzfHxjb25maWRlbnQlMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHRoZXJhcGlzdCUyMHBvcnRyYWl0fGVufDB8MXx8fDE3ODczMTg5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Doutor Gabriel Vance Terapeuta TRG" class="w-full h-auto rounded-2xl shadow-xl object-cover" />
                        <div class="mt-4 p-4 bg-navy-50 rounded-xl border border-navy-100 text-center">
                            <h4 class="font-serif font-bold text-navy-900 text-lg">Dr. Gabriel Vance</h4>
                            <p class="text-xs text-gold-600 font-semibold uppercase tracking-wider">Terapeuta Master em TRG & Saúde Emocional</p>
                            <p class="text-xs text-slate-500 mt-1">CRTH-BR 84920/SP</p>
                        </div>
                    </div>
                </div>

                <div class="w-full lg:w-7/12 space-y-6">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 text-navy-800 text-xs font-bold tracking-widest uppercase">
                        Autoridade Clínica & Propósito
                    </div>
                    
                    <h2 class="font-serif text-3xl md:text-4xl font-bold text-navy-950 leading-tight">
                        A ciência do reprocessamento rápido focada na raiz oculta do seu sofrimento.
                    </h2>
                    
                    <p class="mb-4 text-slate-600 text-base leading-relaxed font-light">
                        Ao longo de mais de uma década dedicada à saúde psíquica e ao comportamento humano, o Dr. Gabriel Vance consolidou sua trajetória na aplicação exclusiva da Terapia de Reprocessamento Generativo (TRG). Após presenciar centenas de pacientes presos a terapias convencionais durante anos sem solucionar a dor original, ele especializou-se na identificação precisa das marcas psíquicas gravadas no cérebro emocional.
                    </p>
                    
                    <p class="mb-6 text-slate-600 text-base leading-relaxed font-light">
                        A TRG é um método terapêutico inovador de alta eficiência que não exige conversar infinitamente sobre os seus problemas. Ela opera mapeando e reprocessando cronologicamente desde a infância até a vida adulta todos os traumas, fobias e bloqueios reprimidos. Ao reestruturar o psiquismo, o cérebro desassocia a lembrança da carga de dor, gerando uma libertação definitiva, profunda e permanente.
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div class="p-4 rounded-xl bg-navy-50 border-l-4 border-gold-500">
                            <h3 class="font-serif font-bold text-navy-900 text-base mb-1">Foco no Trauma Raiz</h3>
                            <p class="text-xs text-slate-600 leading-normal">Não tratamos apenas os sintomas superficiais; eliminamos o gatilho original arquivado na memória psíquica.</p>
                        </div>
                        <div class="p-4 rounded-xl bg-navy-50 border-l-4 border-navy-800">
                            <h3 class="font-serif font-bold text-navy-900 text-base mb-1">Sem Exposição Desnecessária</h3>
                            <p class="text-xs text-slate-600 leading-normal">O método é estruturado para reprocessar a dor sem a necessidade de reviver o sofrimento de forma dramática.</p>
                        </div>
                    </div>

                    <div class="pt-4">
                        <a href="#o-que-resolve" class="inline-flex items-center gap-3 font-bold text-navy-900 hover:text-gold-600 transition-colors border-b-2 border-gold-500 pb-1 text-sm tracking-wide uppercase">
                            <span>Compreenda o que a TRG pode resolver por você</span>
                            <i class="fas fa-arrow-down text-xs text-gold-500"></i>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- SEÇÃO 3: O QUE A TRG RESOLVE? (GRID SOBRE AZUL MARINHO) -->
    <section id="o-que-resolve" class="py-20 md:py-28 bg-navy-900 text-white relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
                <span class="text-gold-400 font-semibold text-xs uppercase tracking-widest">Mapeamento das Dores</span>
                <h2 class="font-serif text-3xl md:text-4xl font-bold leading-tight">
                    O que a Terapia de Reprocessamento Generativo resolve?
                </h2>
                <p class="mb-4 text-slate-300 text-base font-light">
                    O acúmulo de traumas não resolvidos manifesta-se no corpo e na mente através de sintomas paralisantes. A TRG atua diretamente nas seguintes áreas:
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                <!-- Card 1 -->
                <div class="bg-navy-800/80 rounded-2xl p-8 border border-navy-700 hover:border-gold-500/50 transition-all duration-300 shadow-xl group hover:-translate-y-1">
                    <div class="w-14 h-14 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-center text-gold-400 text-2xl mb-6 group-hover:scale-110 transition-transform">
                        <i class="fas fa-heart-crack"></i>
                    </div>
                    <h3 class="font-serif text-xl font-bold text-white mb-3">Ansiedade Severa e Pânico</h3>
                    <p class="mb-4 text-slate-300 text-sm leading-relaxed font-light">
                        A sensação de aperto constante no peito, falta de ar, taquicardia e o medo inexplicável de que algo terrível vá acontecer a qualquer momento.
                    </p>
                    <span class="text-xs text-gold-400 font-medium flex items-center gap-2">
                        <i class="fas fa-check text-[10px]"></i> Reprocessamento de gatilhos
                    </span>
                </div>

                <!-- Card 2 -->
                <div class="bg-navy-800/80 rounded-2xl p-8 border border-navy-700 hover:border-gold-500/50 transition-all duration-300 shadow-xl group hover:-translate-y-1">
                    <div class="w-14 h-14 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-center text-gold-400 text-2xl mb-6 group-hover:scale-110 transition-transform">
                        <i class="fas fa-cloud-rain"></i>
                    </div>
                    <h3 class="font-serif text-xl font-bold text-white mb-3">Depressão e Desânimo Crônico</h3>
                    <p class="mb-4 text-slate-300 text-sm leading-relaxed font-light">
                        A falta de energia vital, o esvaziamento do prazer diário e a sensação de carregar um peso insustentável nas costas há anos.
                    </p>
                    <span class="text-xs text-gold-400 font-medium flex items-center gap-2">
                        <i class="fas fa-check text-[10px]"></i> Reconstrução da energia vital
                    </span>
                </div>

                <!-- Card 3 -->
                <div class="bg-navy-800/80 rounded-2xl p-8 border border-navy-700 hover:border-gold-500/50 transition-all duration-300 shadow-xl group hover:-translate-y-1">
                    <div class="w-14 h-14 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-center text-gold-400 text-2xl mb-6 group-hover:scale-110 transition-transform">
                        <i class="fas fa-child-reaching"></i>
                    </div>
                    <h3 class="font-serif text-xl font-bold text-white mb-3">Traumas de Infância e Abandono</h3>
                    <p class="mb-4 text-slate-300 text-sm leading-relaxed font-light">
                        Feridas profundas causadas por rejeição, abusos emocionais ou físicos, negligência familiar e ambientes hostis no início da vida.
                    </p>
                    <span class="text-xs text-gold-400 font-medium flex items-center gap-2">
                        <i class="fas fa-check text-[10px]"></i> Liberação da criança interior
                    </span>
                </div>

                <!-- Card 4 -->
                <div class="bg-navy-800/80 rounded-2xl p-8 border border-navy-700 hover:border-gold-500/50 transition-all duration-300 shadow-xl group hover:-translate-y-1">
                    <div class="w-14 h-14 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-center text-gold-400 text-2xl mb-6 group-hover:scale-110 transition-transform">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h3 class="font-serif text-xl font-bold text-white mb-3">Bloqueios e Auto-sabotagem</h3>
                    <p class="mb-4 text-slate-300 text-sm leading-relaxed font-light">
                        Incapacidade de prosperar financeiramente, medo da exposição, procrastinação destrutiva e a sensação de nunca ser bom o suficiente.
                    </p>
                    <span class="text-xs text-gold-400 font-medium flex items-center gap-2">
                        <i class="fas fa-check text-[10px]"></i> Destravamento de potencial
                    </span>
                </div>

                <!-- Card 5 -->
                <div class="bg-navy-800/80 rounded-2xl p-8 border border-navy-700 hover:border-gold-500/50 transition-all duration-300 shadow-xl group hover:-translate-y-1">
                    <div class="w-14 h-14 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-center text-gold-400 text-2xl mb-6 group-hover:scale-110 transition-transform">
                        <i class="fas fa-masks-theater"></i>
                    </div>
                    <h3 class="font-serif text-xl font-bold text-white mb-3">Fobias e Medos Paralisantes</h3>
                    <p class="mb-4 text-slate-300 text-sm leading-relaxed font-light">
                        Pavor inexplicável de dirigir, voar, falar em público, lugares fechados ou situações sociais que limitam drasticamente sua liberdade.
                    </p>
                    <span class="text-xs text-gold-400 font-medium flex items-center gap-2">
                        <i class="fas fa-check text-[10px]"></i> Extinção da resposta do medo
                    </span>
                </div>

                <!-- Card 6 -->
                <div class="bg-navy-800/80 rounded-2xl p-8 border border-navy-700 hover:border-gold-500/50 transition-all duration-300 shadow-xl group hover:-translate-y-1">
                    <div class="w-14 h-14 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-center text-gold-400 text-2xl mb-6 group-hover:scale-110 transition-transform">
                        <i class="fas fa-brain-circuit"></i>
                    </div>
                    <h3 class="font-serif text-xl font-bold text-white mb-3">Somatizações e Dores Físicas</h3>
                    <p class="mb-4 text-slate-300 text-sm leading-relaxed font-light">
                        Sintomas físicos sem causa médica aparente, como enxaquecas, tonturas, dores musculares crônicas e problemas gastrointestinais emocionais.
                    </p>
                    <span class="text-xs text-gold-400 font-medium flex items-center gap-2">
                        <i class="fas fa-check text-[10px]"></i> Alívio da tensão somática
                    </span>
                </div>

            </div>

            <div class="mt-16 text-center bg-navy-800 rounded-2xl p-8 border border-navy-700 max-w-4xl mx-auto">
                <h3 class="font-serif text-xl font-bold text-white mb-2">Reconhece algum destes sintomas em sua rotina?</h3>
                <p class="mb-6 text-slate-300 text-sm font-light">
                    Você não precisa continuar carregando este fardo sozinho. A libertação emocional é um direito seu.
                </p>
                <a href="#agendamento" class="inline-block bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all text-sm tracking-wide uppercase">
                    Iniciar Meu Reprocessamento Agora
                </a>
            </div>
        </div>
    </section>

    <!-- SEÇÃO 4: COMO FUNCIONA O PROCESSO TERAPÊUTICO (PASSO A PASSO) -->
    <section id="passos" class="py-20 md:py-28 bg-slate-50 text-navy-900">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
                <span class="text-gold-600 font-semibold text-xs uppercase tracking-widest">Metodologia Estruturada</span>
                <h2 class="font-serif text-3xl md:text-4xl font-bold text-navy-950 leading-tight">
                    As 5 Fases do Protocolo TRG
                </h2>
                <p class="mb-4 text-slate-600 text-base font-light">
                    Um caminho claro, lógico e orientado para resultados permanentes do início ao fim.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 relative flex flex-col justify-between">
                    <div>
                        <span class="text-3xl font-serif font-bold text-gold-500 block mb-3">01</span>
                        <h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Cronológico</h3>
                        <p class="mb-4 text-xs text-slate-600 leading-relaxed font-light">
                            Varredura das memórias da infância até o presente momento, reprocessando eventos traumáticos arquivados.
                        </p>
                    </div>
                    <span class="text-[11px] font-bold text-navy-800 uppercase tracking-wider">Fase Inicial</span>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 relative flex flex-col justify-between">
                    <div>
                        <span class="text-3xl font-serif font-bold text-gold-500 block mb-3">02</span>
                        <h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Somático</h3>
                        <p class="mb-4 text-xs text-slate-600 leading-relaxed font-light">
                            Liberação de cargas emocionais presas no corpo físico, eliminando dores somatizadas e angústias no peito.
                        </p>
                    </div>
                    <span class="text-[11px] font-bold text-navy-800 uppercase tracking-wider">Fase Física</span>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 relative flex flex-col justify-between">
                    <div>
                        <span class="text-3xl font-serif font-bold text-gold-500 block mb-3">03</span>
                        <h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Temático</h3>
                        <p class="mb-4 text-xs text-slate-600 leading-relaxed font-light">
                            Tratamento de temas específicos e focados, tais como medos específicos, lutos pendentes ou traições.
                        </p>
                    </div>
                    <span class="text-[11px] font-bold text-navy-800 uppercase tracking-wider">Fase Focada</span>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 relative flex flex-col justify-between">
                    <div>
                        <span class="text-3xl font-serif font-bold text-gold-500 block mb-3">04</span>
                        <h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Futuro</h3>
                        <p class="mb-4 text-xs text-slate-600 leading-relaxed font-light">
                            Dessensibilização do medo do amanhã, preparando a mente para cenários futuros sem ansiedade antecipatória.
                        </p>
                    </div>
                    <span class="text-[11px] font-bold text-navy-800 uppercase tracking-wider">Fase de Projeção</span>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 relative flex flex-col justify-between border-t-4 border-t-gold-500">
                    <div>
                        <span class="text-3xl font-serif font-bold text-gold-500 block mb-3">05</span>
                        <h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Potencialização</h3>
                        <p class="mb-4 text-xs text-slate-600 leading-relaxed font-light">
                            Instalação de novas crenças fortalecedoras, autoestima, autoconfiança e clareza de propósito.
                        </p>
                    </div>
                    <span class="text-[11px] font-bold text-gold-600 uppercase tracking-wider">Conclusão</span>
                </div>

            </div>
        </div>
    </section>

    <!-- SEÇÃO 5: DEPOIMENTOS DE PACIENTES (PROVA SOCIAL) -->
    <section id="depoimentos" class="py-20 md:py-28 bg-white text-navy-900">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
                <span class="text-gold-600 font-semibold text-xs uppercase tracking-widest">Histórias de Superação</span>
                <h2 class="font-serif text-3xl md:text-4xl font-bold text-navy-950 leading-tight">
                    Vidas reestruturadas pela Terapia de Reprocessamento
                </h2>
                <p class="mb-4 text-slate-600 text-base font-light">
                    Veja relatos reais de pessoas que decidiram interromper o ciclo da dor e conquistaram uma nova perspectiva de vida.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <!-- Depoimento 1 -->
                <div class="bg-navy-50 rounded-2xl p-8 border border-navy-100 flex flex-col justify-between relative shadow-sm">
                    <div>
                        <div class="flex text-gold-500 text-sm gap-1 mb-4">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                        <p class="mb-6 text-slate-700 text-sm italic leading-relaxed font-light">
                            "Eu vivia com crises diárias de pânico e achei que precisaria tomar remédios pelo resto da vida. Na quarta sessão de TRG, parecia que um peso enorme tinha sido tirado do meu peito. Voltei a dirigir e recuperei minha rotina de trabalho com paz."
                        </p>
                    </div>
                    <div class="flex items-center gap-4 pt-4 border-t border-navy-100">
                        <img src="https://images.unsplash.com/photo-1710777932534-2a58edf3603d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw2fHxzbWlsaW5nJTIwaGFwcHklMjBhZHVsdCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MHwyfHx8MTc4NzMxODkwOXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Paciente TRG" class="w-12 h-12 rounded-full object-cover border-2 border-gold-500" />
                        <div>
                            <h4 class="font-serif font-bold text-navy-900 text-sm">Mariana Silveira</h4>
                            <p class="text-xs text-slate-500">Empresária, 38 anos</p>
                        </div>
                    </div>
                </div>

                <!-- Depoimento 2 -->
                <div class="bg-navy-50 rounded-2xl p-8 border border-navy-100 flex flex-col justify-between relative shadow-sm">
                    <div>
                        <div class="flex text-gold-500 text-sm gap-1 mb-4">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                        <p class="mb-6 text-slate-700 text-sm italic leading-relaxed font-light">
                            "Carregava traumas graves da infância que destruíam todos os meus relacionamentos amorosos. A abordagem do Dr. Gabriel foi de um respeito absoluto. Conseguimos tratar memórias profundas sem escândalo emocional. Hoje tenho um casamento equilibrado."
                        </p>
                    </div>
                    <div class="flex items-center gap-4 pt-4 border-t border-navy-100">
                        <img src="https://images.unsplash.com/photo-1702207761808-ed9844a23b8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHwyfHxjb25maWRlbnQlMjBtYXR1cmUlMjBtYW4lMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MHwyfHx8MTc4NzMxODkwOXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Paciente TRG" class="w-12 h-12 rounded-full object-cover border-2 border-gold-500" />
                        <div>
                            <h4 class="font-serif font-bold text-navy-900 text-sm">Roberto Andrade</h4>
                            <p class="text-xs text-slate-500">Engenheiro, 45 anos</p>
                        </div>
                    </div>
                </div>

                <!-- Depoimento 3 -->
                <div class="bg-navy-50 rounded-2xl p-8 border border-navy-100 flex flex-col justify-between relative shadow-sm">
                    <div>
                        <div class="flex text-gold-500 text-sm gap-1 mb-4">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                        <p class="mb-6 text-slate-700 text-sm italic leading-relaxed font-light">
                            "Fiz anos de psicanálise e sabia exatamente a teoria do meu problema, mas a dor e a fobia de falar em público continuavam me travando. A TRG limpou a emoção associada ao trauma. Fazer apresentações hoje é algo natural para mim."
                        </p>
                    </div>
                    <div class="flex items-center gap-4 pt-4 border-t border-navy-100">
                        <img src="https://images.unsplash.com/photo-1583853275454-c8b542c291c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxjaGVlcmZ1bCUyMHByb2Zlc3Npb25hbCUyMHlvdW5nJTIwd29tYW58ZW58MHwyfHx8MTc4NzMxODkxMHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Paciente TRG" class="w-12 h-12 rounded-full object-cover border-2 border-gold-500" />
                        <div>
                            <h4 class="font-serif font-bold text-navy-900 text-sm">Camila Fernandes</h4>
                            <p class="text-xs text-slate-500">Advogada, 31 anos</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- SEÇÃO 6: INVESTIMENTO E MODELO DE ATENDIMENTO -->
    <section class="py-20 md:py-28 bg-navy-950 text-white relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
                <span class="text-gold-400 font-semibold text-xs uppercase tracking-widest">Investimento na Sua Saúde Emocional</span>
                <h2 class="font-serif text-3xl md:text-4xl font-bold leading-tight">
                    Sessões Individuais & Acompanhamento Exclusivo
                </h2>
                <p class="mb-4 text-slate-300 text-base font-light">
                    Atendimentos realizados na modalidade 100% online (via vídeo chamada segura) com flexibilidade de horários ou presencial sob consulta.
                </p>
            </div>

            <div class="max-w-xl mx-auto bg-navy-900 rounded-3xl border-2 border-gold-500/50 p-8 md:p-12 shadow-2xl relative overflow-hidden text-center">
                <div class="absolute top-0 right-0 bg-gold-500 text-navy-950 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                    Recomendado
                </div>
                
                <h3 class="font-serif text-2xl font-bold text-white mb-2">Sessão de Avaliação & Reprocessamento</h3>
                <p class="mb-6 text-slate-300 text-xs font-light">Sessão individual com duração aproximada de 50 minutos</p>
                
                <div class="my-8 py-6 border-y border-navy-800">
                    <div class="text-slate-400 text-xs line-through mb-1">Valor Regular: R$ 350,00</div>
                    <div class="text-4xl md:text-5xl font-serif font-bold text-gold-400 mb-2">R$ 220<span class="text-lg font-sans font-normal text-slate-300">/sessão</span></div>
                    <p class="text-xs text-emerald-400 font-medium"><i class="fas fa-check-circle mr-1"></i> Garantia de sigilo profissional absoluto</p>
                </div>

                <ul class="text-left space-y-4 mb-8 text-sm text-slate-300">
                    <li class="flex items-center gap-3">
                        <i class="fas fa-check text-gold-400"></i>
                        <span>Mapeamento inicial de gatilhos psíquicos</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fas fa-check text-gold-400"></i>
                        <span>Aplicação imediata do protocolo de TRG</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fas fa-check text-gold-400"></i>
                        <span>Suporte e orientação direta entre sessões</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fas fa-check text-gold-400"></i>
                        <span>Atendimento no conforto e privacidade da sua casa</span>
                    </li>
                </ul>

                <a href="#agendamento" class="w-full block bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold py-4 rounded-xl shadow-xl transition-all text-base uppercase tracking-wider">
                    Agendar Minha Consulta Agora
                </a>
            </div>
        </div>
    </section>

    <!-- SEÇÃO 7: PERGUNTAS FREQUENTES (FAQ) -->
    <section id="faq" class="py-20 md:py-28 bg-white text-navy-900">
        <div class="max-w-4xl mx-auto px-6">
            <div class="text-center space-y-4 mb-16">
                <span class="text-gold-600 font-semibold text-xs uppercase tracking-widest">Esclarecimentos</span>
                <h2 class="font-serif text-3xl md:text-4xl font-bold text-navy-950 leading-tight">
                    Perguntas Frequentes sobre a TRG
                </h2>
                <p class="mb-4 text-slate-600 text-base font-light">
                    Tire todas as suas dúvidas antes de dar o primeiro passo para a sua libertação.
                </p>
            </div>

            <div class="space-y-4">
                <div class="border border-slate-200 rounded-2xl p-6 hover:border-gold-500 transition-colors bg-slate-50/50">
                    <h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Quantas sessões são necessárias para sentir resultados?</h3>
                    <p class="mb-2 text-slate-600 text-sm leading-relaxed font-light">
                        Diferente das abordagens tradicionais que duram anos, a TRG é uma terapia breve de alto impacto. Grande parte dos pacientes relata um alívio expressivo nas primeiras 3 a 5 sessões, dependendo da complexidade do histórico traumático do indivíduo.
                    </p>
                </div>

                <div class="border border-slate-200 rounded-2xl p-6 hover:border-gold-500 transition-colors bg-slate-50/50">
                    <h3 class="font-serif font-bold text-navy-900 text-lg mb-2">A consulta online é tão eficiente quanto a presencial?</h3>
                    <p class="mb-2 text-slate-600 text-sm leading-relaxed font-light">
                        Sim, perfeitamente. O reprocessamento emocional TRG opera diretamente na estrutura psíquica e na voz do terapeuta. O ambiente online permite que você esteja no local onde mais se sente seguro e confortável, o que costuma potencializar a abertura emocional.
                    </p>
                </div>

                <div class="border border-slate-200 rounded-2xl p-6 hover:border-gold-500 transition-colors bg-slate-50/50">
                    <h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Preciso falar em detalhes sobre o trauma que vivi?</h3>
                    <p class="mb-2 text-slate-600 text-sm leading-relaxed font-light">
                        Não. A TRG não exige que você reviva verbalmente ou conte detalhes embaraçosos do evento traumático. Nós trabalhamos com a representação psíquica e somática da dor no seu cérebro, preservando sua intimidade e conforto.
                    </p>
                </div>

                <div class="border border-slate-200 rounded-2xl p-6 hover:border-gold-500 transition-colors bg-slate-50/50">
                    <h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Existe alguma contraindicação para o reprocessamento?</h3>
                    <p class="mb-2 text-slate-600 text-sm leading-relaxed font-light">
                        A TRG é uma metodologia completamente segura, natural e sem o uso de medicamentos. Pode ser aplicada em adultos de todas as idades. Pessoas em surto psicótico ativo devem ser avaliadas previamente.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- SEÇÃO 8: AGENDAMENTO E CHAMADA FINAL (SEM FORMULÁRIOS - APENAS CTA DIRETO) -->
    <section id="agendamento" class="py-20 md:py-28 bg-navy-900 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy-800 via-navy-900 to-navy-950 opacity-80"></div>
        
        <div class="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-8">
            <div class="w-20 h-20 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 text-3xl mx-auto mb-4">
                <i class="fas fa-calendar-check"></i>
            </div>

            <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto text-white">
                Dê o primeiro passo rumo à sua libertação emocional hoje mesmo.
            </h2>
            
            <p class="mb-6 text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Agende sua consulta diretamente pelo WhatsApp de maneira rápida, confidencial e sem intermediários. Nossa equipe de recepção clínica responderá imediatamente para alinhar o melhor horário.
            </p>

            <div class="pt-4 flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20sess%C3%A3o%20de%20TRG" target="_blank" class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3">
                    <i class="fab fa-whatsapp text-2xl"></i>
                    <span>Agendar Sessão via WhatsApp</span>
                </a>
            </div>

            <div class="pt-8 flex justify-center items-center gap-8 text-xs text-slate-400 border-t border-navy-800 max-w-lg mx-auto">
                <div class="flex items-center gap-2">
                    <i class="fas fa-user-shield text-gold-400"></i>
                    <span>Sigilo Profissional Garantido</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="fas fa-clock text-gold-400"></i>
                    <span>Resposta em até 15 min</span>
                </div>
            </div>
        </div>
    </section>

    <!-- RODAPÉ JURÍDICO HARMONIOSO (MANDATÓRIO) -->
    <footer class="w-full font-sans py-16 bg-navy-950 text-white border-t border-navy-800">
        <div class="max-w-5xl mx-auto px-6">
            <div class="text-center mb-10">
                <h3 class="text-xl font-serif font-bold mb-4 text-white">Informações Legais e Institucionais</h3>
                <p class="text-sm text-slate-400">Clique nos links abaixo para ler a íntegra de cada política e termo do serviço.</p>
            </div>
            
            <div class="space-y-4 max-w-4xl mx-auto mb-12" id="rodape-sanfonas">
                <details id="det-privacidade" class="rounded-2xl border border-navy-800 bg-navy-900/50 transition-colors cursor-pointer" onclick="const e = document.getElementById('det-termos'); if(e.hasAttribute('open')) { e.removeAttribute('open'); }">
                    <summary class="p-6 font-bold text-lg text-slate-200 hover:text-gold-400 outline-none select-none flex items-center justify-between">Política de Privacidade e Sigilo de Dados <i class="fas fa-chevron-down text-sm opacity-60"></i></summary>
                    <div class="p-6 pt-2 text-sm leading-relaxed border-t border-navy-800 text-slate-300 space-y-3">
                        <p><strong>1. Coleta e Uso de Dados:</strong> Em total conformidade com a LGPD (Lei Geral de Proteção de Dados), coletamos informações cadastrais exclusivamente para viabilizar o agendamento de consultas de TRG e personalizar seu atendimento psíquico.</p>
                        <p><strong>2. Sigilo Terapêutico:</strong> O conteúdo tratado durante as sessões de Terapia de Reprocessamento Generativo é protegido por sigilo absoluto de código de ética. Suas informações jamais serão compartilhadas ou comercializadas.</p>
                        <p><strong>3. Segurança:</strong> Seus dados de agendamento e pagamento são processados através de conexões criptografadas de ponta a ponta. Nós não armazenamos dados de cartão de crédito.</p>
                    </div>
                </details>
                
                <details id="det-termos" class="rounded-2xl border border-navy-800 bg-navy-900/50 transition-colors cursor-pointer" onclick="const e = document.getElementById('det-privacidade'); if(e.hasAttribute('open')) { e.removeAttribute('open'); }">
                    <summary class="p-6 font-bold text-lg text-slate-200 hover:text-gold-400 outline-none select-none flex items-center justify-between">Termos de Uso e Responsabilidade Clínica <i class="fas fa-chevron-down text-sm opacity-60"></i></summary>
                    <div class="p-6 pt-2 text-sm leading-relaxed border-t border-navy-800 text-slate-300 space-y-3">
                        <p><strong>1. Natureza do Serviço:</strong> A Terapia de Reprocessamento Generativo (TRG) é um método terapêutico complementar voltado ao reprocessamento de traumas emocionais. Não substitui tratamentos médicos ou psiquiátricos para diagnósticos graves sem acompanhamento profissional.</p>
                        <p><strong>2. Isenção de Resultados Garantidos:</strong> Os resultados do reprocessamento dependem da entrega do paciente ao método e da correta aplicação do protocolo. Depoimentos apresentados representam experiências individuais reais e não constituem promessa de resultado idêntico automático.</p>
                        <p><strong>3. Direitos Autorais:</strong> Todo o conteúdo, textos e marcas presentes nesta landing page pertencem exclusivamente ao Instituto TRG Dr. Gabriel Vance, sendo proibida a cópia integral ou parcial sob pena da lei.</p>
                    </div>
                </details>
            </div>
            
            <div class="text-center pt-8 border-t border-navy-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
                <p class="font-medium tracking-wide text-sm">&copy; 2026 Instituto TRG - Todos os direitos reservados.</p>
                <div class="flex gap-4 text-xl text-slate-400">
                    <i class="fab fa-cc-visa hover:text-gold-400 transition-colors"></i>
                    <i class="fab fa-cc-mastercard hover:text-gold-400 transition-colors"></i>
                    <i class="fas fa-pix hover:text-gold-400 transition-colors"></i>
                    <i class="fas fa-lock hover:text-gold-400 transition-colors"></i>
                </div>
            </div>
        </div>
        <script>document.querySelectorAll('#rodape-sanfonas summary').forEach(s => { s.style.listStyle = 'none'; if(s.childNodes[0] && s.childNodes[0].nodeName === "#text" && s.childNodes[0].nodeValue.includes('▶')) s.childNodes[0].nodeValue = ''; });</script>
    </footer>

</body>
</html>`;

const SITE_INSTITUCIONAL = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KRONOS Engenharia & Construção | Obras de Alto Padrão</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Montserrat', 'sans-serif'] },
                    colors: { brand: { dark: '#0B0F17', asphalt: '#121824', card: '#1A2332', orange: '#FF5500', orangeHover: '#E04B00' } }
                }
            }
        }
    </script>
</head>
<body class="bg-brand-dark text-slate-100 font-sans antialiased selection:bg-brand-orange selection:text-white">

    <!-- NAV (CORRIGIDA) -->
    <nav class="fixed top-0 left-0 w-full z-50 bg-brand-dark/85 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
            <a href="#" class="flex items-center gap-2 lg:gap-3 group shrink-0">
                <div class="w-8 h-8 lg:w-10 lg:h-10 bg-brand-orange text-white flex items-center justify-center font-heading font-black text-lg lg:text-xl rounded shadow-lg group-hover:scale-105 transition-transform">
                    K
                </div>
                <span class="font-heading font-extrabold text-base lg:text-xl tracking-wider text-white uppercase hidden sm:block">KRONOS</span>
            </a>
            
            <div class="hidden md:flex items-center gap-3 lg:gap-8 font-medium text-[11px] lg:text-sm text-slate-300 whitespace-nowrap">
                <a href="#sobre" class="hover:text-brand-orange transition-colors">Sobre Nós</a>
                <a href="#servicos" class="hover:text-brand-orange transition-colors">Serviços</a>
                <a href="#portfolio" class="hover:text-brand-orange transition-colors">Portfólio</a>
                <a href="#prova-social" class="hover:text-brand-orange transition-colors">Depoimentos</a>
            </div>

            <a href="#contato" class="shrink-0 hidden sm:inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white px-4 py-2 lg:px-6 lg:py-3 rounded font-heading font-bold text-[10px] lg:text-xs uppercase tracking-wider transition-all shadow-lg whitespace-nowrap">
                <i class="fas fa-paper-plane"></i> Solicitar Orçamento
            </a>
        </div>
    </nav>

    <!-- HERO -->
    <section class="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1732740674554-11b7772d8c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxtb2Rlcm4lMjBza3lzY3JhcGVyJTIwY29uc3RydWN0aW9uJTIwc3Vuc2V0JTIwZHJvbmV8ZW58MHwwfHx8MTc4NzMxNzYyOHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Obra" class="w-full h-full object-cover opacity-30 scale-105 animate-pulse" style="animation-duration: 10s;" />
            <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div class="max-w-3xl">
                <h1 class="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white uppercase tracking-tight leading-none mb-6">
                    Construindo o Futuro com <span class="text-brand-orange">Solidez Monumental</span>
                </h1>
                <p class="text-slate-300 text-lg sm:text-xl font-light leading-relaxed mb-8">
                    Transformamos visões complexas em infraestruturas imponentes. Soluções completas para edifícios corporativos, complexos industriais e residências de alto padrão com precisão cirúrgica.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="#contato" class="inline-flex justify-center items-center gap-3 bg-brand-orange text-white px-8 py-4 rounded font-heading font-bold text-sm uppercase">Iniciar Projeto <i class="fas fa-arrow-right"></i></a>
                    <a href="#portfolio" class="inline-flex justify-center items-center gap-3 bg-slate-800 text-white px-8 py-4 rounded font-heading font-bold text-sm uppercase border border-slate-700">Explorar Obras <i class="fas fa-building"></i></a>
                </div>
            </div>
        </div>
    </section>

    <!-- SOBRE NÓS -->
    <section id="sobre" class="py-24 bg-brand-asphalt relative border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <span class="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-2">Sólidos como Concreto</span>
                    <h2 class="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mb-6">Mais de duas décadas erguendo marcos da engenharia moderna</h2>
                    <p class="text-slate-300 text-base leading-relaxed mb-6">A Kronos Engenharia nasceu com o propósito de redefinir os padrões de excelência na construção civil pesada e residencial de luxo. Fundada por engenheiros estruturais com vasta experiência internacional, consolidadou-se no mercado através do rigor cronológico.</p>
                    <div class="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800">
                        <div><div class="font-heading font-black text-3xl text-brand-orange">+250k</div><div class="text-xs text-slate-400">m² Construídos</div></div>
                        <div><div class="font-heading font-black text-3xl text-brand-orange">180+</div><div class="text-xs text-slate-400">Obras Entregues</div></div>
                        <div><div class="font-heading font-black text-3xl text-brand-orange">22</div><div class="text-xs text-slate-400">Anos no Mercado</div></div>
                    </div>
                </div>
                <div>
                    <img src="https://images.unsplash.com/photo-1772442198624-4fc4d7281e89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwY2l2aWwlMjBlbmdpbmVlciUyMGhlbG1ldCUyMGJsdWVwcmludHMlMjBjbGllbnR8ZW58MHwxfHx8MTc4NzMxNzYyOHww&ixlib=rb-4.1.0&q=80&w=1080" class="w-full h-auto object-cover rounded-xl shadow-2xl border border-slate-700" />
                </div>
            </div>
        </div>
    </section>

    <!-- SERVIÇOS -->
    <section id="servicos" class="py-24 bg-brand-dark">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-3xl mx-auto mb-16">
                <h2 class="font-heading font-black text-4xl text-white uppercase tracking-tight mb-4">Soluções Integradas</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><i class="fas fa-building-user text-brand-orange text-3xl mb-4"></i><h3 class="font-heading font-bold text-xl text-white mb-4">Obras Corporativas</h3><p class="text-slate-300 text-sm">Edifícios comerciais construídos com rapidez, eficiência e acessibilidade.</p></div>
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><i class="fas fa-home text-brand-orange text-3xl mb-4"></i><h3 class="font-heading font-bold text-xl text-white mb-4">Residencial de Luxo</h3><p class="text-slate-300 text-sm">Casas e mansões de altíssimo padrão com acabamentos nobres.</p></div>
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><i class="fas fa-industry text-brand-orange text-3xl mb-4"></i><h3 class="font-heading font-bold text-xl text-white mb-4">Indústria & Galpões</h3><p class="text-slate-300 text-sm">Galpões logísticos de alto desempenho e pavimentação técnica.</p></div>
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><i class="fas fa-wrench text-brand-orange text-3xl mb-4"></i><h3 class="font-heading font-bold text-xl text-white mb-4">Retrofit & Reformas</h3><p class="text-slate-300 text-sm">Modernização estrutural e revitalização de edifícios antigos.</p></div>
            </div>
        </div>
    </section>

    <!-- PORTFÓLIO -->
    <section id="portfolio" class="py-24 bg-brand-asphalt border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-6">
            <div class="mb-16"><h2 class="font-heading font-black text-4xl text-white uppercase">Obras Emblemáticas</h2></div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-brand-card border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1774099690798-c4fe300374b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw2fHxtb2Rlcm4lMjBza3lzY3JhcGVyJTIwYXJjaGl0ZWN0dXJlJTIwR2xhc3N8ZW58MHwyfHx8MTc4NzMxNzYyOXww&ixlib=rb-4.1.0&q=80&w=1080" class="w-full h-48 object-cover" />
                    <div class="p-6"><h3 class="font-heading font-bold text-xl text-white">Torre Horizon Business</h3></div>
                </div>
                <div class="bg-brand-card border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1660361338517-8c8fbb3ac264?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBtb2Rlcm4lMjBob3VzZSUyMHBvb2wlMjBkdXNrfGVufDB8Mnx8fDE3ODczMTc2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080" class="w-full h-48 object-cover" />
                    <div class="p-6"><h3 class="font-heading font-bold text-xl text-white">Residência Alphaville Luxe</h3></div>
                </div>
                <div class="bg-brand-card border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1552129317-b4839add4a4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxsb2dpc3RpY3MlMjB3YXJlaG91c2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDB8Mnx8fDE3ODczMTc2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080" class="w-full h-48 object-cover" />
                    <div class="p-6"><h3 class="font-heading font-bold text-xl text-white">Complexo Logístico Nexus</h3></div>
                </div>
            </div>
        </div>
    </section>

    <!-- DEPOIMENTOS -->
    <section id="prova-social" class="py-24 bg-brand-dark">
        <div class="max-w-7xl mx-auto px-6">
            <h2 class="font-heading font-black text-4xl text-white uppercase text-center mb-16">Reconhecimento</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><p class="text-slate-300 italic mb-6">"A Kronos entregou a sede corporativa do nosso grupo dois meses antes do prazo contratual, sem nenhum aditivo de estouro de orçamento."</p><h4 class="font-bold text-white">Roberto Alencar</h4></div>
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><p class="text-slate-300 italic mb-6">"Construir nossa residência exigia soluções estruturais arrojadas. A equipe executou o projeto sem desviar um milímetro do desenho original."</p><h4 class="font-bold text-white">Dra. Patricia Mendonça</h4></div>
                <div class="bg-brand-card p-8 rounded-xl border border-slate-800"><p class="text-slate-300 italic mb-6">"A gestão da segurança e a limpeza do canteiro de obras do nosso galpão impressionaram as auditorias internacionais."</p><h4 class="font-bold text-white">Carlos Eduardo Fontes</h4></div>
            </div>
        </div>
    </section>

    <!-- FORMULÁRIO / CONTATO -->
    <section id="contato" class="py-24 bg-brand-asphalt border-t border-slate-800 text-center">
        <h2 class="font-heading font-black text-4xl text-white uppercase mb-8">Vamos Construir?</h2>
        <a href="#" class="inline-flex justify-center items-center bg-brand-orange text-white px-8 py-4 rounded font-heading font-bold text-sm uppercase">Fale com um Engenheiro</a>
    </section>

    <footer class="w-full py-12 bg-brand-asphalt text-center text-slate-400 border-t border-slate-800">
        <p>© 2026 KRONOS Engenharia & Construção. Todos os direitos reservados.</p>
    </footer>
</body></html>`;

// Script de rolagem interna do Iframe (Impede que o site principal pule)
const SCROLL_FIX_SCRIPT = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if(targetId && targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if(targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    });
</script>
`;
