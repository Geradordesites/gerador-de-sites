'use client'

import { useRouter } from 'next/navigation'
import { Sparkles, Layout, Image as ImageIcon, Zap, ArrowRight, Code, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

// =========================================================================
// CÓDIGOS HTML COMPLETOS DOS SITES DE EXEMPLO
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

    <!-- MENU SUPERIOR FIXO -->
    <nav class="fixed top-0 left-0 w-full bg-emeraldCustom-950/95 backdrop-blur-md text-white z-50 border-b border-emeraldCustom-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emeraldCustom-500 to-green-400 flex items-center justify-center text-emeraldCustom-950 font-black text-xl shadow-md">
                    <i class="fas fa-book-open"></i>
                </div>
                <span class="font-extrabold text-xl tracking-tight text-white">CÓDIGO <span class="text-emeraldCustom-500">PROSPERIDADE</span></span>
            </div>
            
            <div class="hidden md:flex items-center gap-8 font-medium text-sm text-emeraldCustom-100">
                <a href="#inicio" class="hover:text-emeraldCustom-500 transition-colors">Início</a>
                <a href="#problemas" class="hover:text-emeraldCustom-500 transition-colors">Para Quem É</a>
                <a href="#conteudo" class="hover:text-emeraldCustom-500 transition-colors">O Conteúdo</a>
                <a href="#autor" class="hover:text-emeraldCustom-500 transition-colors">Sobre o Autor</a>
                <a href="#faq" class="hover:text-emeraldCustom-500 transition-colors">Dúvidas</a>
            </div>

            <div>
                <a href="#checkout" class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2">
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

    <!-- SEÇÃO 4: SOBRE O AUTOR -->
    <section id="autor" class="py-20 bg-white text-slate-800">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
                
                <div class="w-full md:w-5/12">
                    <div class="relative">
                        <div class="absolute -inset-2 bg-emeraldCustom-500 rounded-2xl transform rotate-3 opacity-20"></div>
                        <img src="https://images.unsplash.com/photo-1765648763932-43a3e2f8f35c?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw0fHxjb25maWRlbnQlMjBidXNpbmVzcyUyMG1lbnRvciUyMGNvbnN1bHRhbnR8ZW58MHwxfHx8MTc4NzMxODI2Mnww&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080" alt="Especialista e Autor do Guia" class="relative w-full h-auto object-cover rounded-2xl shadow-xl"  style="outline: rgb(14, 165, 233) solid 2px; ">
                    </div>
                </div>

                <div class="w-full md:w-7/12">
                    <span class="text-emeraldCustom-600 font-bold uppercase tracking-wider text-xs mb-2 block">Sobre o Autor</span>
                    <h2 class="text-3xl sm:text-4xl font-extrabold text-emeraldCustom-950 mb-4">Especialista em Planejamento e Inteligência Financeira</h2>
                    
                    <p class="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">Com ampla experiência no setor financeiro e no estudo do comportamento econômico, dedico minha trajetória a simplificar conceitos complexos e transformá-los em métodos práticos para o dia a dia.</p>
                    <p class="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">Depois de analisar os principais erros que travam o crescimento financeiro da maioria das pessoas, desenvolvi uma metodologia focada em organização, eliminação de gargalos e construção consistente de patrimônio.</p>
                    <p class="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">Este material reúne as estratégias mais eficientes e validadas, condensadas em um passo a passo direto ao ponto para que você conquiste clareza, segurança e autonomia na sua vida financeira.</p>

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

    <!-- SEÇÃO 5: DEPOIMENTOS -->
    <section class="py-20 bg-emeraldCustom-50 text-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-3xl sm:text-4xl font-extrabold text-emeraldCustom-950 mb-4">Veja o Que Dizem Quem Já Aplicou o Método</h2>
                <p class="text-slate-600 text-base sm:text-lg mb-6">Pessoas comuns que decidiram tomar o controle de suas vidas financeiras e conquistaram resultados reais.</p>
            </div>

            <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-400 gap-1 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <p class="text-slate-600 text-sm leading-relaxed mb-4">"Em apenas 3 semanas aplicando o capítulo de blindagem, consegui renegociar uma dívida antiga com 60% de desconto e guardei minhas primeiras economias."</p>
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
                        <div class="flex text-amber-400 gap-1 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <p class="text-slate-600 text-sm leading-relaxed mb-4">"O e-book é extremamente direto. Sem termos complicados de economistas. Aprendi a montar minha reserva de emergência e hoje durmo em paz."</p>
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
                        <div class="flex text-amber-400 gap-1 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <p class="text-slate-600 text-sm leading-relaxed mb-4">"Valeu cada centavo! As planilhas bônus me ajudaram a ver exatamente para onde meu dinheiro estava indo. Recomendo para todo mundo."</p>
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
                <h2 class="text-3xl sm:text-4xl font-extrabold text-emeraldCustom-950 mb-4">Dúvidas Frequentes</h2>
                <p class="text-slate-600 text-base sm:text-lg mb-6">Tudo o que você precisa saber antes de adquirir o seu guia digital.</p>
            </div>
            <div class="space-y-4">
                <details class="group bg-emeraldCustom-50 rounded-2xl p-6 border border-emeraldCustom-100 cursor-pointer hover:bg-emeraldCustom-100/50">
                    <summary class="flex items-center justify-between font-bold text-slate-900 text-lg outline-none select-none list-none">
                        <span>Como vou receber o e-book após a compra?</span>
                        <span class="transition transform group-open:-rotate-180 text-emeraldCustom-600"><i class="fas fa-chevron-down"></i></span>
                    </summary>
                    <p class="mt-4 text-slate-600 text-sm leading-relaxed mb-4">O acesso é imediato! Você receberá um e-mail com o link exclusivo para baixar o e-book nos formatos PDF e EPUB.</p>
                </details>

                <details class="group bg-emeraldCustom-50 rounded-2xl p-6 border border-emeraldCustom-100 cursor-pointer hover:bg-emeraldCustom-100/50">
                    <summary class="flex items-center justify-between font-bold text-slate-900 text-lg outline-none select-none list-none">
                        <span>Preciso entender de economia ou matemática financeira?</span>
                        <span class="transition transform group-open:-rotate-180 text-emeraldCustom-600"><i class="fas fa-chevron-down"></i></span>
                    </summary>
                    <p class="mt-4 text-slate-600 text-sm leading-relaxed mb-4">Absolutamente não! O livro foi escrito em linguagem simples, direta e prática para iniciantes.</p>
                </details>

                <details class="group bg-emeraldCustom-50 rounded-2xl p-6 border border-emeraldCustom-100 cursor-pointer hover:bg-emeraldCustom-100/50">
                    <summary class="flex items-center justify-between font-bold text-slate-900 text-lg outline-none select-none list-none">
                        <span>E se eu ler e achar que não é para mim?</span>
                        <span class="transition transform group-open:-rotate-180 text-emeraldCustom-600"><i class="fas fa-chevron-down"></i></span>
                    </summary>
                    <p class="mt-4 text-slate-600 text-sm leading-relaxed mb-4">Você conta com nossa garantia incondicional de 7 dias. Devolveremos 100% do seu dinheiro sem perguntas.</p>
                </details>
            </div>
        </div>
    </section>

    <!-- SEÇÃO 7: CHECKOUT -->
    <section id="checkout" class="py-20 bg-gradient-to-b from-emeraldCustom-900 to-emeraldCustom-950 text-white relative overflow-hidden">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="bg-emeraldCustom-950 border-2 border-emeraldCustom-500 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative">
                <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-emeraldCustom-950 font-black text-xs sm:text-sm px-6 py-2 rounded-full uppercase tracking-wider shadow-md">
                    Oferta Especial por Tempo Limitado
                </div>
                <h2 class="text-3xl sm:text-4xl font-black text-white mt-4 mb-4">Garanta Seu Acesso ao E-book Código da Prosperidade</h2>
                <p class="text-emeraldCustom-100 text-base sm:text-lg mb-6">Receba o livro digital completo + todos os bônus exclusivos.</p>

                <div class="my-8 bg-emeraldCustom-900/60 p-6 rounded-2xl border border-emeraldCustom-800 max-w-md mx-auto">
                    <span class="text-slate-400 line-through text-lg block mb-1">De R$ 197,00</span>
                    <span class="text-sm text-emeraldCustom-100 block mb-2">Por apenas 12x de</span>
                    <div class="text-5xl font-black text-amber-400 mb-2">R$ 9,74</div>
                    <span class="text-xs text-slate-300 block">ou R$ 97,00 à vista no PIX ou Cartão</span>
                </div>

                <div class="mb-8">
                    <a href="#checkout" class="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-xl px-10 py-5 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 inline-flex items-center justify-center gap-3 transform hover:-translate-y-1 text-center">
                        <i class="fas fa-shopping-cart"></i>
                        <span>QUERO APROVEITAR A PROMOÇÃO E COMPRAR AGORA</span>
                    </a>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-6 text-xs text-emeraldCustom-100 opacity-90 border-t border-emeraldCustom-800/80 pt-6">
                    <div class="flex items-center gap-2"><i class="fas fa-lock text-emeraldCustom-500 text-base"></i> Pagamento 100% Seguro</div>
                    <div class="flex items-center gap-2"><i class="fas fa-shield-alt text-emeraldCustom-500 text-base"></i> Garantia de 7 Dias</div>
                </div>
            </div>
        </div>
    </section>

    <footer class="w-full font-sans py-16 bg-emeraldCustom-950 text-emeraldCustom-100 border-t border-emeraldCustom-800">
        <div class="max-w-5xl mx-auto px-6 text-center">
            <h3 class="text-xl font-bold mb-4 text-white">Informações Legais</h3>
            <p class="font-medium tracking-wide text-sm opacity-90">© 2026 Código da Prosperidade. Todos os direitos reservados.</p>
        </div>
    </footer>
</body></html>`;

const SITE_MENTORIA = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TRG - Terapia de Reprocessamento Generativo | Libertação Emocional</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { serif: ['Playfair Display', 'serif'], sans: ['Plus Jakarta Sans', 'sans-serif'] },
                    colors: { navy: { 950: '#040B14', 900: '#0B1A30', 800: '#132847', 700: '#1D3B66', 50: '#F0F4F9' }, gold: { 400: '#F3C669', 500: '#D4A338', 600: '#B58322' } }
                }
            }
        }
    </script>
</head>
<body class="bg-white text-navy-900 font-sans antialiased selection:bg-gold-500 selection:text-white">

    <!-- MENU -->
    <nav class="fixed top-0 left-0 w-full bg-navy-900/95 backdrop-blur-md border-b border-navy-800 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="#" class="flex items-center gap-3 group">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center text-navy-950 font-serif font-bold text-xl shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">T</div>
                <div class="flex flex-col">
                    <span class="font-serif text-lg font-bold tracking-wide text-white leading-tight">Instituto TRG</span>
                    <span class="text-xs text-gold-400 font-medium tracking-widest uppercase">Reprocessamento Emocional</span>
                </div>
            </a>
            <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
                <a href="#sobre" class="hover:text-gold-400 transition-colors">O Método</a>
                <a href="#o-que-resolve" class="hover:text-gold-400 transition-colors">O Que Trata</a>
                <a href="#passos" class="hover:text-gold-400 transition-colors">Como Funciona</a>
                <a href="#depoimentos" class="hover:text-gold-400 transition-colors">Depoimentos</a>
            </div>
            <a href="#agendamento" class="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold px-6 py-2.5 rounded-full text-sm shadow-md hover:shadow-gold-500/20 transition-all transform hover:-translate-y-0.5 border border-gold-400/30 flex items-center gap-2">
                <i class="fab fa-whatsapp text-base"></i> <span>Agendar Sessão</span>
            </a>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-navy-900 text-white overflow-hidden flex items-center min-h-screen">
        <div class="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 opacity-95"></div>
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
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
                        Traumas do passado, ansiedade paralisante e bloqueios invisíveis não precisam definir o seu futuro. Através do reprocessamento estruturado, é possível desligar a dor associada às memórias e retomar o controle definitivo da sua vida.
                    </p>
                    
                    <div class="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <a href="#agendamento" class="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-extrabold text-center px-8 py-4 rounded-xl shadow-xl hover:shadow-gold-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                            <span>Quero me libertar</span> <i class="fas fa-arrow-right text-sm"></i>
                        </a>
                    </div>
                </div>

                <div class="w-full md:w-1/2 relative">
                    <div class="relative mx-auto max-w-md lg:max-w-none">
                        <div class="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl bg-navy-800">
                            <img src="https://images.unsplash.com/photo-1624268010368-2c3def0a26ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxzZXJlbmUlMjB3b21hbiUyMHBlYWNlZnVsJTIwZmFjZSUyMGxpZ2h0JTIwYmFja2dyb3VuZHxlbnwwfDF8fHwxNzg3MzE4OTA4fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Pessoa tranquila" class="w-full h-[480px] lg:h-[540px] object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SOBRE -->
    <section id="sobre" class="py-20 md:py-28 bg-white text-navy-900 relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                <div class="w-full lg:w-5/12">
                    <img src="https://images.unsplash.com/photo-1762341124796-530c0085f7d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHwzfHxjb25maWRlbnQlMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHRoZXJhcGlzdCUyMHBvcnRyYWl0fGVufDB8MXx8fDE3ODczMTg5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Terapeuta TRG" class="w-full h-auto rounded-2xl shadow-xl object-cover" />
                </div>
                <div class="w-full lg:w-7/12 space-y-6">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 text-navy-800 text-xs font-bold tracking-widest uppercase">Autoridade Clínica</div>
                    <h2 class="font-serif text-3xl md:text-4xl font-bold text-navy-950 leading-tight">A ciência do reprocessamento rápido focada na raiz oculta do seu sofrimento.</h2>
                    <p class="text-slate-600 text-base leading-relaxed font-light">A TRG é um método terapêutico inovador de alta eficiência que não exige conversar infinitamente sobre os seus problemas. Ela opera mapeando e reprocessando cronologicamente desde a infância até a vida adulta todos os traumas, fobias e bloqueios reprimidos.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- O QUE TRATA -->
    <section id="o-que-resolve" class="py-20 md:py-28 bg-navy-900 text-white relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
                <h2 class="font-serif text-3xl md:text-4xl font-bold leading-tight">O que a Terapia de Reprocessamento Generativo resolve?</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-navy-800/80 rounded-2xl p-8 border border-navy-700 hover:border-gold-500/50 shadow-xl">
                    <i class="fas fa-heart-crack text-gold-400 text-3xl mb-4"></i>
                    <h3 class="font-serif text-xl font-bold text-white mb-3">Ansiedade Severa e Pânico</h3>
                    <p class="text-slate-300 text-sm font-light">A sensação de aperto constante no peito, falta de ar e o medo inexplicável de que algo terrível vá acontecer a qualquer momento.</p>
                </div>
                <div class="bg-navy-800/80 rounded-2xl p-8 border border-navy-700 hover:border-gold-500/50 shadow-xl">
                    <i class="fas fa-child-reaching text-gold-400 text-3xl mb-4"></i>
                    <h3 class="font-serif text-xl font-bold text-white mb-3">Traumas de Infância</h3>
                    <p class="text-slate-300 text-sm font-light">Feridas profundas causadas por rejeição, abusos emocionais ou físicos, negligência familiar e ambientes hostis no início da vida.</p>
                </div>
                <div class="bg-navy-800/80 rounded-2xl p-8 border border-navy-700 hover:border-gold-500/50 shadow-xl">
                    <i class="fas fa-lock text-gold-400 text-3xl mb-4"></i>
                    <h3 class="font-serif text-xl font-bold text-white mb-3">Bloqueios e Auto-sabotagem</h3>
                    <p class="text-slate-300 text-sm font-light">Incapacidade de prosperar financeiramente, procrastinação destrutiva e a sensação de nunca ser bom o suficiente.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- FASES -->
    <section id="passos" class="py-20 md:py-28 bg-slate-50 text-navy-900">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
                <h2 class="font-serif text-3xl md:text-4xl font-bold text-navy-950">As 5 Fases do Protocolo TRG</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100"><span class="text-3xl font-serif font-bold text-gold-500 block mb-3">01</span><h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Cronológico</h3></div>
                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100"><span class="text-3xl font-serif font-bold text-gold-500 block mb-3">02</span><h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Somático</h3></div>
                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100"><span class="text-3xl font-serif font-bold text-gold-500 block mb-3">03</span><h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Temático</h3></div>
                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100"><span class="text-3xl font-serif font-bold text-gold-500 block mb-3">04</span><h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Futuro</h3></div>
                <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-100"><span class="text-3xl font-serif font-bold text-gold-500 block mb-3">05</span><h3 class="font-serif font-bold text-navy-900 text-lg mb-2">Potencialização</h3></div>
            </div>
        </div>
    </section>

    <!-- INVESTIMENTO & AGENDAMENTO -->
    <section id="agendamento" class="py-20 md:py-28 bg-navy-950 text-white relative">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <h2 class="font-serif text-3xl md:text-4xl font-bold mb-12">Sessões Individuais &amp; Acompanhamento</h2>
            <div class="max-w-xl mx-auto bg-navy-900 rounded-3xl border-2 border-gold-500/50 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div class="my-8 py-6 border-y border-navy-800">
                    <div class="text-slate-400 text-xs line-through mb-1">Valor Regular: R$ 350,00</div>
                    <div class="text-4xl md:text-5xl font-serif font-bold text-gold-400 mb-2">R$ 220<span class="text-lg font-sans font-normal text-slate-300">/sessão</span></div>
                </div>
                <a href="#agendamento" class="w-full block bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 text-navy-950 font-bold py-4 rounded-xl shadow-xl transition-all text-base uppercase">Agendar Minha Consulta Agora</a>
            </div>
        </div>
    </section>
</body></html>`;

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

    <!-- NAV -->
    <nav class="fixed top-0 left-0 w-full z-50 bg-brand-dark/85 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="#" class="flex items-center gap-3 group">
                <div class="w-10 h-10 bg-brand-orange text-white flex items-center justify-center font-heading font-black text-xl rounded shadow-lg group-hover:scale-105 transition-transform">K</div>
                <span class="font-heading font-extrabold text-xl tracking-wider text-white uppercase">KRONOS</span>
            </a>
            
            <div class="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-300">
                <a href="#sobre" class="hover:text-brand-orange transition-colors">Sobre Nós</a>
                <a href="#servicos" class="hover:text-brand-orange transition-colors">Serviços</a>
                <a href="#portfolio" class="hover:text-brand-orange transition-colors">Portfólio</a>
                <a href="#prova-social" class="hover:text-brand-orange transition-colors">Depoimentos</a>
                <a href="#faq" class="hover:text-brand-orange transition-colors">FAQ</a>
            </div>

            <a href="#contato" class="hidden sm:inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white px-6 py-3 rounded font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg">
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

    <footer class="w-full py-12 bg-brand-asphalt text-center text-slate-400 border-t border-slate-800">
        <p>© 2026 KRONOS Engenharia & Construção. Todos os direitos reservados.</p>
    </footer>
</body></html>`;

// Script de rolagem interna do Iframe (Evita pular para fora do painel)
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

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================

export default function PaginaDeVendas() {
  const router = useRouter()
  // Estado para controlar qual sanfona está aberta
  const [siteExpandido, setSiteExpandido] = useState<number | null>(null)

  // Dados dos 3 sites de exemplo mapeados com os HTMLs Integrais + Script de Rolagem Correta
  const exemplosSites = [
    {
      id: 1,
      titulo: "Página de Vendas para E-books",
      nicho: "Infoprodutos & Ebooks",
      thumb: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      codigoHtml: SITE_EBOOK + SCROLL_FIX_SCRIPT
    },
    {
      id: 2,
      titulo: "Landing Page para Mentorias",
      nicho: "Consultorias & Especialistas",
      thumb: "https://images.unsplash.com/photo-1624268010368-2c3def0a26ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxzZXJlbmUlMjB3b21hbiUyMHBlYWNlZnVsJTIwZmFjZSUyMGxpZ2h0JTIwYmFja2dyb3VuZHxlbnwwfDF8fHwxNzg3MzE4OTA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      codigoHtml: SITE_MENTORIA + SCROLL_FIX_SCRIPT
    },
    {
      id: 3,
      titulo: "Página Institucional",
      nicho: "Negócios Locais & Agências",
      thumb: "https://images.unsplash.com/photo-1732740674554-11b7772d8c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MjMzOTJ8MHwxfHNlYXJjaHw5fHxtb2Rlcm4lMjBza3lzY3JhcGVyJTIwY29uc3RydWN0aW9uJTIwc3Vuc2V0JTIwZHJvbmV8ZW58MHwwfHx8MTc4NzMxNzYyOHww&ixlib=rb-4.1.0&q=80&w=1080",
      codigoHtml: SITE_INSTITUCIONAL + SCROLL_FIX_SCRIPT
    }
  ]

  const toggleSanfona = (id: number) => {
    if (siteExpandido === id) {
      setSiteExpandido(null)
    } else {
      setSiteExpandido(id)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900 relative">
      
      {/* HEADER SIMPLES */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 font-serif">SiteGen AI</span>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-24 pb-32 px-4 text-center overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-300/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm mb-8 border border-emerald-200 shadow-sm">
            <Zap className="size-4 fill-emerald-600" /> A Revolução da Criação Web
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 font-serif leading-[1.1]">
            Crie sites profissionais em segundos com <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">Inteligência Artificial</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Esqueça horas de programação ou templates engessados. Nossa IA constrói a estrutura visual, escreve os textos persuasivos e gera imagens exclusivas para o seu negócio com um único clique.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/planos')}
              className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-[0_8px_30px_rgb(5,150,105,0.3)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-xl"
            >
              Ver Planos de Créditos <ArrowRight className="size-6" />
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Escolha seu plano e comece a criar instantaneamente.</p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 mb-4">Tudo o que você precisa em um só lugar</h2>
            <p className="text-lg text-slate-500">Uma infraestrutura completa para lançar suas ideias na internet.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layout className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Design & Estrutura</h3>
              <p className="text-slate-600 leading-relaxed">
                Nossa IA constrói a estrutura visual completa, organizando seções de venda, depoimentos e captura de leads com foco total em conversão e responsividade.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Copywriting Automático</h3>
              <p className="text-slate-600 leading-relaxed">
                Títulos magnéticos e textos persuasivos gerados por inteligência artificial avançada, formatados especificamente para vender o seu produto ou serviço.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ImageIcon className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Imagens Fotorealistas</h3>
              <p className="text-slate-600 leading-relaxed">
                Chega de banco de imagens clichês. Integrado com poderosos motores de imagem, o sistema cria artes exclusivas e de altíssima qualidade para o seu site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLES SECTION (Amostras de Sites - SANFONA INTERNA COM SRCDOC E FIX DE ROLAGEM) */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 mb-4">
              Crie sites e landing pages para ebooks, cursos, mentoria e todos os nichos
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto">
              Os sites abaixo são modelos reais gerados 100% pelo nosso construtor de IA. Clique em "Ver Site Completo" para expandir e navegar no modelo sem sair desta página.
            </p>
          </div>

          <div className="space-y-6">
            {exemplosSites.map((site) => (
              <div key={site.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* CABEÇALHO DA SANFONA */}
                <div 
                  onClick={() => toggleSanfona(site.id)}
                  className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 cursor-pointer group"
                >
                  <div className="shrink-0 w-full md:w-48 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden relative border border-slate-100">
                    <img src={site.thumb} alt={site.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left w-full">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 block">{site.nicho}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{site.titulo}</h3>
                    <p className="text-slate-500 text-sm">Clique para ver o site completo com estrutura, copy e imagens geradas.</p>
                  </div>
                  
                  <div className="shrink-0">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                      {siteExpandido === site.id ? (
                        <>Fechar Site <ChevronUp className="size-4" /></>
                      ) : (
                        <>Ver Site Completo <ChevronDown className="size-4" /></>
                      )}
                    </button>
                  </div>
                </div>

                {/* CORPO DO IFRAME (Carrega todo o HTML e Rola Corretamente) */}
                {siteExpandido === site.id && (
                  <div className="border-t border-slate-100 bg-slate-100 p-2 md:p-6 animate-in slide-in-from-top-4 duration-300 ease-out">
                    <div className="flex justify-between items-center mb-3 px-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview do Site Interativo</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold">100% Criado com IA</span>
                    </div>
                    
                    <div className="w-full h-[600px] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                      <iframe 
                        srcDoc={site.codigoHtml} 
                        className="w-full h-full border-none"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin"
                        title={site.titulo}
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 leading-tight">Como a mágica acontece?</h2>
              <p className="text-slate-400 text-lg mb-10">Em apenas 3 passos, você sai de uma ideia na cabeça para um site profissional pronto para receber visitas.</p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Descreva sua ideia</h4>
                    <p className="text-slate-400">Diga para a IA qual é o seu negócio, produto ou serviço em poucas palavras.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">A IA cria tudo</h4>
                    <p className="text-slate-400">O sistema escreve os textos, monta a estrutura visual e desenha as imagens em tempo real.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Liberdade para Editar</h4>
                    <p className="text-slate-400">Clique em qualquer elemento para editar textos manualmente ou use nossa IA para reescrever blocos inteiros com um clique. Tudo perfeito? É só baixar o site pronto.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-4 shadow-2xl aspect-square flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="size-16 text-emerald-400 mx-auto mb-4" />
                  <p className="text-slate-300 font-medium">Sua Ideia + Nossa Tecnologia =<br/> <span className="text-emerald-400 font-bold text-xl mt-2 block">Resultado Incrível</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 px-4 bg-emerald-600 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold font-serif text-white mb-8">
            Pronto para escalar suas vendas?
          </h2>
          <p className="text-emerald-100 text-xl mb-12">
            Junte-se aos empreendedores que estão criando páginas de alta conversão de forma inteligente, rápida e sem depender de programadores.
          </p>
          <button 
            onClick={() => router.push('/planos')}
            className="px-10 py-5 bg-white text-emerald-700 font-extrabold rounded-2xl shadow-xl hover:scale-105 transition-transform text-xl"
          >
            Ver Planos e Começar Agora
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-12 text-center text-slate-500 border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} SiteGen AI. Todos os direitos reservados.</p>
      </footer>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/5561982096982?text=Olá,%20preciso%20de%20ajuda%20com%20o%20SiteGen%20AI."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center group"
        title="Fale conosco no WhatsApp"
      >
        <svg className="size-7 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out group-hover:ml-2 text-sm font-bold">
          Suporte WhatsApp
        </span>
      </a>
    </div>
  )
}
