import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const DOWNLOAD_SERVER = import.meta.env.VITE_DOWNLOAD_SERVER;
const LINUX_BINARY = import.meta.env.VITE_LINUX_RELEASE_BINARY;
const WINDOWS_BINARY = import.meta.env.VITE_WINDOWS_RELEASE_BINARY;
const MACOS_BINARY = import.meta.env.VITE_MACOS_RELEASE_BINARY;

const downloads = {
  windows: DOWNLOAD_SERVER + "/" + WINDOWS_BINARY,
  linux: DOWNLOAD_SERVER + "/" + LINUX_BINARY,
  macos: DOWNLOAD_SERVER + "/" + MACOS_BINARY,
};

export const GameIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-[var(--color-background)] select-none scroll-smooth">
      
      <section className="relative h-screen w-full flex flex-col items-center justify-center px-4 shrink-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/images/bg_city.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-background)]/80 to-[var(--color-background)]" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl">
          <div className="flex flex-col items-center w-full">
            <img
              src="/images/logo.png"
              alt="MAGNATE LOGO"
              className="w-[90%] max-w-[500px] md:max-w-[850px] lg:max-w-[1000px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            />
            <div className="flex items-center justify-center gap-4 mt-8 w-full">
              <div className="h-[2px] w-12 md:w-24 bg-white/20" />
              <p className="text-sm md:text-xl font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/40 whitespace-nowrap">
                Construye tu imperio
              </p>
              <div className="h-[2px] w-12 md:w-24 bg-white/20" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full mt-20 md:mt-32">
            <Button
              onClick={() => navigate("/login")}
              className="group relative w-full md:w-[400px] h-24 md:h-32 rounded-full border-4 border-white shadow-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 p-0"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none drop-shadow-md">
                  Iniciar
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/80 mt-1 md:mt-2">
                  Sesión
                </span>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/signup")}
              className="group relative w-full md:w-[400px] h-24 md:h-32 rounded-full border-4 border-white shadow-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 p-0"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none drop-shadow-md">
                  Registrar
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/80 mt-1 md:mt-2">
                  Nuevo socio
                </span>
              </div>
            </Button>
          </div>
        </div>

        <div 
          className="absolute bottom-10 flex flex-col items-center gap-3 cursor-pointer group animate-bounce"
          onClick={() => document.getElementById('manual-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <p className="text-white/40 font-black uppercase text-[10px] tracking-[0.4em] group-hover:text-white transition-colors text-center">
            Descargar binarios y reglas
          </p>
          <span className="text-2xl text-[var(--color-aux)]">↓</span>
        </div>
      </section>

      <section id="manual-section" className="relative z-10 px-6 md:px-10 py-32 max-w-[1600px] mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          
          <div className="relative p-12 md:p-20 flex flex-col items-center justify-center text-center bg-neutral-950/40 backdrop-blur-md rounded-[60px] border-[4px] border-[var(--color-primary)]/20 overflow-hidden transition-all duration-500 hover:border-[var(--color-primary)] hover:shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.15)] group hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h3 className="text-[var(--color-primary)] text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 drop-shadow-md relative z-10">
              Dado Bus
            </h3>
            <p className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide leading-snug max-w-[85%] relative z-10">
              Tira tres dados y domina el azar. Tú decides si mueves un dado o la suma total.
            </p>
          </div>

          <div className="relative p-12 md:p-20 flex flex-col items-center justify-center text-center bg-neutral-950/40 backdrop-blur-md rounded-[60px] border-[4px] border-[var(--color-aux)]/20 overflow-hidden transition-all duration-500 hover:border-[var(--color-aux)] hover:shadow-[0_0_50px_rgba(var(--color-aux-rgb),0.15)] group hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-aux)]/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h3 className="text-[var(--color-aux)] text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 drop-shadow-md relative z-10">
              Doble Anillo
            </h3>
            <p className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide leading-snug max-w-[85%] relative z-10">
              Navega entre dos pistas. Los puentes se abren según la paridad de tus resultados.
            </p>
          </div>

          <div className="relative p-12 md:p-20 flex flex-col items-center justify-center text-center bg-neutral-950/40 backdrop-blur-md rounded-[60px] border-[4px] border-[var(--color-primary)]/20 overflow-hidden transition-all duration-500 hover:border-[var(--color-primary)] hover:shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.15)] group hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h3 className="text-[var(--color-primary)] text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 drop-shadow-md relative z-10">
              Fantasía
            </h3>
            <p className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide leading-snug max-w-[85%] relative z-10">
              Elige el camino seguro pagando o arriesga gratis con la carta oculta.
            </p>
          </div>

          <div className="relative p-12 md:p-20 flex flex-col items-center justify-center text-center bg-neutral-950/40 backdrop-blur-md rounded-[60px] border-[4px] border-[var(--color-aux)]/20 overflow-hidden transition-all duration-500 hover:border-[var(--color-aux)] hover:shadow-[0_0_50px_rgba(var(--color-aux-rgb),0.15)] group hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-aux)]/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h3 className="text-[var(--color-aux)] text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 drop-shadow-md relative z-10">
              Subastas
            </h3>
            <p className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide leading-snug max-w-[85%] relative z-10">
              Pujas ciegas simultáneas. Pon a prueba tu sangre fría ante la banca.
            </p>
          </div>

        </div>

        <div className="mt-48 flex flex-col items-center">
          <div className="flex items-center gap-6 mb-16 w-full max-w-4xl px-4">
            <div className="h-[2px] flex-grow bg-white/10" />
            <p className="text-white/20 font-black uppercase text-sm tracking-[0.8em] whitespace-nowrap">Versión de escritorio</p>
            <div className="h-[2px] flex-grow bg-white/10" />
          </div>

          <div className="flex flex-wrap justify-center gap-8 w-full px-4">
            <Button
              onClick={() => window.location.href = downloads.windows}
              className="w-full md:w-[320px] h-20 rounded-full border-4 border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 text-xl font-black uppercase italic tracking-tighter"
            >
              Windows .exe
            </Button>
            <Button
              onClick={() => window.location.href = downloads.linux}
              className="w-full md:w-[320px] h-20 rounded-full border-4 border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 text-xl font-black uppercase italic tracking-tighter"
            >
              Linux Binary
            </Button>
            <Button
              onClick={() => window.location.href = downloads.macos}
              className="w-full md:w-[320px] h-20 rounded-full border-4 border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 text-xl font-black uppercase italic tracking-tighter"
            >
              MacOS App
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-20 flex flex-col items-center justify-center border-t border-white/5 opacity-20">
        <p className="text-white font-black uppercase text-[10px] tracking-[0.4em]">
          Magnate — Grupo 08 — 2026
        </p>
      </footer>

    </div>
  );
};
