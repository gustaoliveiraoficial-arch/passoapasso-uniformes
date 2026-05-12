"use client";

import { CheckCircle2, MessageCircle, Star, Target, Users, BookOpen } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Header Temporário */}
      <header className="fixed top-0 w-full glass-panel z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">
              PP
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Passo a Passo</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#formandos" className="font-medium hover:text-blue-600 transition-colors">Formandos 2026</a>
            <a href="#diferenciais" className="font-medium hover:text-blue-600 transition-colors">Diferenciais</a>
            <a href="#catalogo" className="font-medium hover:text-blue-600 transition-colors">Catálogo</a>
          </nav>
          <a href="https://wa.me/5551999999999?text=Oii! Gostaria de orçar uniformes para minha turma!" target="_blank" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/30">
            <MessageCircle size={18} /> Orçar Agora
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4 opacity-40">
          <div className="w-96 h-96 bg-blue-400 rounded-full blur-[100px]" />
        </div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/3 opacity-40">
          <div className="w-[500px] h-[500px] bg-amber-300 rounded-full blur-[120px]" />
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
            <Target size={16} /> Especialistas em Formandos (8º e 3º ano)
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8">
            O uniforme perfeito para uma <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-500">turma inesquecível.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Há 30 anos vestindo quem faz acontecer no Vale dos Sinos. Criamos junto com vocês o layout ideal, passo a passo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://wa.me/5551999999999?text=Quero um orçamento de moletom para minha turma!" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-blue-600/30 flex justify-center items-center gap-2">
              Chamar no WhatsApp <MessageCircle size={20} />
            </a>
            <a href="#catalogo" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg border border-slate-200 transition-all shadow-sm flex justify-center items-center">
              Ver Modelos
            </a>
          </div>
        </div>
      </section>

      {/* Diferenciais Section */}
      <section id="diferenciais" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-xl">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Star size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">+30 Anos de Mercado</h3>
              <p className="text-slate-600 leading-relaxed">Experiência e tradição gaúcha. Não somos apenas uma fábrica, somos um parceiro da sua escola.</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-xl">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Pedido Acessível</h3>
              <p className="text-slate-600 leading-relaxed">Sabemos que algumas turmas são pequenas. Nosso pedido mínimo é de apenas 10 peças.</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-xl">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Simulador Visual</h3>
              <p className="text-slate-600 leading-relaxed">Veja exatamente como o seu modelo vai ficar antes mesmo de produzirmos a primeira peça.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Catalog / CTA */}
      <section id="catalogo" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div className="w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Moletons & Camisetas de Terceirão</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">Catálogo interativo com modelos Colleges, Sublimadas Frente/Verso, Moletom Canguru Premium e muito mais.</p>
          
          <div className="glass-panel max-w-lg mx-auto bg-white/10 border-white/20 p-8 rounded-3xl backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-4">Gere seu orçamento em 2 minutos</h3>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400" /> Atendimento humano no WhatsApp</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400" /> Provas e ajustes de layout gratuitos</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400" /> Qualidade garantida Passo a Passo</li>
            </ul>
             <a href="https://wa.me/5551999999999?text=Oi! Sou formando e quero ver o catálogo de modelos 2026!" target="_blank" className="w-full bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-green-500/30 flex justify-center items-center gap-2">
              Eu quero orçar <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
