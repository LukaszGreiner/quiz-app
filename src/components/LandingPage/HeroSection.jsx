import React from "react";
import { PlayCircle, PlusSquare } from "lucide-react";
import Btn from "../common/Btn";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="from-surface via-surface to-surface-elevated relative overflow-hidden bg-gradient-to-br py-24 md:py-32"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="bg-primary absolute top-20 right-20 h-72 w-72 rounded-full blur-3xl"></div>
        <div className="bg-accent absolute bottom-20 left-20 h-72 w-72 rounded-full blur-3xl"></div>
      </div>

      <div className="pointer-events-none absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <svg
          width="600"
          height="600"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path
            fill="currentColor"
            d="M37.8,-60.9C51.2,-55.1,65.8,-49.8,73.5,-39.7C81.2,-29.6,82,-14.8,78.7,-1.7C75.4,11.4,68.1,22.8,60.4,34.9C52.7,47,44.7,60,33.6,66.8C22.5,73.6,8.3,74.3,-5.3,72.5C-18.9,70.7,-37.8,66.4,-49.5,56.9C-61.2,47.3,-65.7,32.5,-69.4,17.2C-73.1,1.9,-76.1,-13.9,-70.3,-26.7C-64.5,-39.5,-50,-49.3,-36.6,-55.4C-23.2,-61.5,-11.6,-63.9,1.1,-65.1C13.8,-66.3,27.5,-66.6,37.8,-60.9Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="text-text mb-4 block">Quizowisko</span>
          <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-3xl leading-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
            Graj, twórz i ucz się z quizami!
          </span>
        </h1>
        <p className="text-text-muted mx-auto mb-12 max-w-3xl text-lg leading-relaxed md:text-xl lg:text-2xl">
          Sprawdź swoją wiedzę, rywalizuj ze znajomymi i twórz własne quizy w
          kilka minut. Nauka nigdy nie była tak wciągająca.
        </p>

        <div className="mx-auto mb-12 grid max-w-4xl grid-cols-3 gap-6">
          <div className="bg-surface-elevated/50 border-border/50 rounded-xl border p-4 backdrop-blur-sm">
            <div className="text-primary text-3xl font-bold lg:text-4xl">
              1000+
            </div>
            <div className="text-text-muted text-sm lg:text-base">Quizów</div>
          </div>
          <div className="bg-surface-elevated/50 border-border/50 rounded-xl border p-4 backdrop-blur-sm">
            <div className="text-accent text-3xl font-bold lg:text-4xl">
              50+
            </div>
            <div className="text-text-muted text-sm lg:text-base">
              Kategorii
            </div>
          </div>
          <div className="bg-surface-elevated/50 border-border/50 rounded-xl border p-4 backdrop-blur-sm">
            <div className="text-secondary text-3xl font-bold lg:text-4xl">
              10k+
            </div>
            <div className="text-text-muted text-sm lg:text-base">
              Użytkowników
            </div>
          </div>
        </div>        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <Btn variant="primary" size="lg" to="/signup" className="group">
            <PlayCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            Rozpocznij grę!
          </Btn>
          <Btn variant="outline" size="lg" to="/newquiz" className="group">
            <PlusSquare className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
            Utwórz quiz
          </Btn>
        </div>
      </div>
    </section>
  );
}
