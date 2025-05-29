import React from "react";
import { Zap, Brain, Award, Users, BarChart2, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Zap className="text-primary h-8 w-8" />,
    title: "Błyskawiczna rozgrywka",
    description: "Rozpocznij quiz w ciągu sekund. Bez zbędnych komplikacji.",
  },
  {
    icon: <Brain className="text-accent h-8 w-8" />,
    title: "Inteligentny system",
    description: "Algorytm dopasowuje trudność do Twojego poziomu wiedzy.",
  },
  {
    icon: <Users className="text-secondary h-8 w-8" />,
    title: "Graj z przyjaciółmi",
    description: "Zaproś znajomych i rywalizuj w czasie rzeczywistym.",
  },
  {
    icon: <Award className="text-correct h-8 w-8" />,
    title: "System osiągnięć",
    description: "Zdobywaj odznaki i wspinaj się w rankingach.",
  },
  {
    icon: <BarChart2 className="text-warning h-8 w-8" />,
    title: "Szczegółowe statystyki",
    description: "Śledź swoje postępy i analizuj wyniki.",
  },
  {
    icon: <ShieldCheck className="text-info h-8 w-8" />,
    title: "Bezpieczne i prywatne",
    description: "Twoje dane są w pełni chronione i szyfrowane.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-text mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
            Dlaczego Quizowisko?
          </h2>
          <p className="text-text-muted mx-auto max-w-2xl text-lg md:text-xl">
            Odkryj funkcje, które sprawiają, że nauka staje się przyjemnością
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-surface-elevated border-border group rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="bg-surface mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-text mb-4 text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
