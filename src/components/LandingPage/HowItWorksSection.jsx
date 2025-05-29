import React from "react";
import { Users, HelpCircle, PlayCircle } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Załóż konto za darmo",
    description:
      "Jeden formularz, kilka sekund i już jesteś częścią społeczności! Śledź swoje postępy i odblokowuj nowe poziomy.",
    icon: <Users className="h-10 w-10" />,
    color: "primary",
  },
  {
    step: 2,
    title: "Znajdź swój quiz",
    description:
      "Setki kategorii czekają na Ciebie - od historii po popkulturę. Nie znajdziesz swojego tematu? Stwórz własny quiz!",
    icon: <HelpCircle className="h-10 w-10" />,
    color: "accent",
  },
  {
    step: 3,
    title: "Graj i się rozwijaj",
    description:
      "Zdobywaj punkty, wspinaj się w rankingach i dziel się wynikami. Każda gra to nowa porcja wiedzy!",
    icon: <PlayCircle className="h-10 w-10" />,
    color: "secondary",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="from-surface to-surface-elevated bg-gradient-to-b py-20 md:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-text mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
            Jak to działa?
          </h2>
          <p className="text-text-muted mx-auto max-w-2xl text-lg md:text-xl">
            W trzech krokach od rejestracji do rozgrywki. Gotowy na wyzwanie?
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-surface-elevated border-border group relative rounded-2xl border p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div
                className={`bg-${item.color} mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                {item.icon}
              </div>
              <div
                className={`text-${item.color} bg-surface-elevated absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-${item.color} text-sm font-bold`}
              >
                {item.step}
              </div>
              <h3 className="text-text mb-4 text-xl font-semibold">
                {item.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
