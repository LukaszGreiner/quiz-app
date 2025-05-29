import React from "react";
import { PlayCircle } from "lucide-react";
import Btn from "../common/Btn";

export default function CTASection() {
  return (
    <section
      id="contact"
      className="from-primary via-accent to-secondary bg-gradient-to-r py-24 text-white md:py-32"
    >
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold sm:text-4xl lg:text-5xl">
          Gotowy na intelektualną przygodę?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
          Dołącz do tysięcy graczy, którzy codziennie poszerzają swoją wiedzę i
          świetnie się bawią. Pierwsza gra jest za darmo!
        </p>
        <Btn
          variant="secondary"
          size="xl"
          to="/signup"
          className="group shadow-xl"
        >
          <PlayCircle className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
          Rozpocznij przygodę - za darmo!
        </Btn>
      </div>
    </section>
  );
}
