import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Aleksandra P.",
    feedback:
      "To najlepsza aplikacja quizowa, jakiej kiedykolwiek używałam! Tyle ciekawych tematów.",
    avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=AP",
  },
  {
    id: 2,
    name: "Kamil S.",
    feedback:
      "Uwielbiam rywalizować z przyjaciółmi. Interfejs jest super przejrzysty i łatwy w obsłudze.",
    avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=KS",
  },
  {
    id: 3,
    name: "Michał L.",
    feedback:
      "Świetny sposób na naukę nowych rzeczy podczas zabawy. Gorąco polecam!",
    avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=ML",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="from-surface to-surface-elevated bg-gradient-to-b py-20 md:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-text mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
            Co mówią nasi użytkownicy?
          </h2>
          <p className="text-text-muted mx-auto max-w-2xl text-lg md:text-xl">
            Dołącz do tysięcy zadowolonych graczy
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-surface-elevated border-border group rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-6 flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="ring-border group-hover:ring-primary mr-4 h-12 w-12 rounded-full ring-2 transition-all"
                />
                <div>
                  <h4 className="text-text font-semibold">
                    {testimonial.name}
                  </h4>
                  <div className="mt-1 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-warning h-4 w-4 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-text-muted leading-relaxed italic">
                "{testimonial.feedback}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
