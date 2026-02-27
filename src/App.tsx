import React from "react";
import { motion } from "framer-motion";
import {
  Instagram,
  Phone,
  MapPin,
  Truck,
  PackageCheck,
  Tag,
  ShieldCheck,
  Layers,
} from "lucide-react";

import { Link } from "react-router-dom";

import background1 from "../src/assets/background1.png";
import background2 from "../src/assets/background2.png";
import background3 from "../src/assets/background3.png";

import photo1 from "../src/assets/photo1.jpg";

import fiorino from "../src/assets/fiorino.png";

import logo from "../src/assets/logo.png";

const Divider = () => (
  <div className="relative w-full flex justify-center py-5">
    <div className="w-24 h-0.5 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse" />
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="bg-zinc-950 text-white font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <img className="w-40" src={logo} alt="logo" />

          <div className="hidden md:flex gap-8 text-sm text-zinc-300">
            <a href="#sobre" className="hover:text-white transition">
              Sobre
            </a>
            <Link to="/portfolio" className="hover:text-white transition">
              Portfolio
            </Link>
            <a href="#entregas" className="hover:text-white transition">
              Entregas
            </a>
            <a href="#contato" className="hover:text-white transition">
              Contato
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center pt-28 px-6 md:px-12 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${background1})` }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-4xl font-bold leading-tight">
              Sublimação Profissional e Industrial
            </h1>
            <p className="mt-6 text-zinc-300 max-w-xl leading-relaxed">
              Estrutura equipada com maquinário de alta performance, controle
              digital de temperatura e processos padronizados para garantir
              produtividade contínua, cores fiéis e acabamento premium.
            </p>
          </motion.div>

          <motion.img
            src={photo1}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-white/10 shadow-2xl w-full h-auto"
          />
        </div>
      </section>

      <Divider />

      {/* SOBRE */}
      <section
        id="sobre"
        className="min-h-screen flex items-center px-6 md:px-12 bg-zinc-950"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 w-full">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Nossa Estrutura
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Plotters de alta resolução, calandras com cilindro cromado e
              controle digital de temperatura.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Fidelidade de cor, produtividade constante e acabamento premium.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10">
            <div className="w-full h-64 bg-linear-to-r from-zinc-700 to-zinc-800 rounded-xl" />
          </div>
        </div>
      </section>

      <Divider />

      {/* PORTFÓLIO */}
      <section
        id="portfolio"
        className="min-h-screen flex items-center px-6 md:px-12 bg-black"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16 gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Nosso Portfólio
              </h2>
              <p className="text-zinc-400 max-w-xl">
                Trabalhos recentes com definição extrema, cores precisas e
                acabamento industrial premium.
              </p>
            </div>

            <Link
              to="/portfolio"
              className="px-8 py-3 bg-white text-black rounded-full text-sm font-semibold hover:scale-105 transition-all duration-300 text-center w-fit"
            >
              Explorar
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.img
                key={i}
                loading="lazy"
                src={`https://picsum.photos/600/600?random=${200 + i}`}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.3 }}
                className="w-full aspect-square object-cover rounded-3xl border border-white/10 shadow-xl"
              />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ENTREGAS */}
      <section
        id="entregas"
        className="relative min-h-screen flex items-center px-6 md:px-12 bg-fixed bg-cover bg-center overflow-visible"
        style={{ backgroundImage: `url(${background2})` }}
      >
        <div className="absolute inset-0 bg-black/85" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full">
          {/* TEXTO */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Logística Própria com Entrega Finalizada
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-8 max-w-xl">
              Cuidamos de todo o fluxo: coleta, produção, conferência e
              devolução. Cada material retorna organizado, identificado e pronto
              para uso imediato.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <PackageCheck className="text-white mt-1" size={22} />
                <div>
                  <h4 className="text-white font-medium">
                    Embalagem Protegida
                  </h4>
                  <p className="text-zinc-400 text-sm">
                    Material acondicionado individualmente com proteção adequada
                    para transporte seguro.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Tag className="text-white mt-1" size={22} />
                <div>
                  <h4 className="text-white font-medium">
                    Etiquetagem Padronizada
                  </h4>
                  <p className="text-zinc-400 text-sm">
                    Identificação clara por cliente, lote ou coleção,
                    facilitando organização interna.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Layers className="text-white mt-1" size={22} />
                <div>
                  <h4 className="text-white font-medium">
                    Separação por Pedido
                  </h4>
                  <p className="text-zinc-400 text-sm">
                    Organização estratégica para reduzir tempo operacional ao
                    receber o material.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ShieldCheck className="text-white mt-1" size={22} />
                <div>
                  <h4 className="text-white font-medium">
                    Controle e Conferência
                  </h4>
                  <p className="text-zinc-400 text-sm">
                    Revisão final antes da entrega garantindo padrão visual e
                    integridade do pedido.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Truck className="text-white mt-1" size={22} />
                <div>
                  <h4 className="text-white font-medium">Transporte Próprio</h4>
                  <p className="text-zinc-400 text-sm">
                    Coleta e entrega realizadas com logística própria, mantendo
                    controle de prazo e segurança.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FIORINO ATRAVESSANDO O TEXTO */}
          <motion.img
            src={fiorino}
            initial={{ x: 300, opacity: 0, rotate: -6 }}
            whileInView={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            className="
        w-80 md:w-[520px]
        drop-shadow-[0_60px_80px_rgba(0,0,0,0.7)]
        absolute
        right-[-40px]
        md:right-[-120px]
        bottom-[-40px]
        z-20
        pointer-events-none
      "
          />
        </div>
      </section>

      <Divider />

      {/* FOOTER */}
      <footer
        id="contato"
        className="bg-black py-8 px-6 border-t border-white/10"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-400">
          <div className="text-center md:text-left">
            <img className="w-40" src={logo} alt="logo" />
            <span className="hidden md:inline mx-2 text-zinc-600">•</span>
            <span className="block md:inline">
              Sublimação industrial com padrão profissional
            </span>
          </div>

          <div className="flex items-center gap-6 text-zinc-300">
            <span>Segunda-feira à Sexta-feira • 08:00–18:00</span>
          </div>

          <div className="flex items-center gap-5 text-zinc-300">
            <Instagram className="w-4 h-4 hover:text-white transition" />
            <Phone className="w-4 h-4 hover:text-white transition" />
            <MapPin className="w-4 h-4 hover:text-white transition" />
          </div>
        </div>

        <div className="text-center text-zinc-600 mt-6 text-xs">
          © {new Date().getFullYear()} WiiPrint
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
