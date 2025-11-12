import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Star, Zap, PlayCircle, ChevronRight } from "lucide-react";
import Btn from "../common/Btn";

const featuredQuizzes = [
  {
    id: 1,
    title: "Wiedza Ogólna Challenge",
    category: "Trivia",
    questions: 20,
    icon: <Brain className="h-8 w-8 text-indigo-500" />,
  },
  {
    id: 2,
    title: "Mania Popkultury",
    category: "Rozrywka",
    questions: 15,
    icon: <Star className="h-8 w-8 text-pink-500" />,
  },
  {
    id: 3,
    title: "Naukowy Zawrót Głowy",
    category: "Edukacja",
    questions: 25,
    icon: <Zap className="h-8 w-8 text-green-500" />,
  },
];

export default function FeaturedQuizzes() {
  const navigate = useNavigate();

  return (
    <section id="quizzes" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-text mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
            Popularne Quizy
          </h2>
          <p className="text-text-muted mx-auto max-w-2xl text-lg md:text-xl">
            Sprawdź swoją wiedzę w naszych najlepszych quizach
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group bg-surface-elevated border-border overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="p-8">
                <div className="mb-6 flex items-center">
                  <div className="bg-surface mr-4 rounded-xl p-3 transition-transform duration-300 group-hover:scale-110">
                    {quiz.icon}
                  </div>
                  <div>
                    <h3 className="text-text group-hover:text-primary text-xl font-semibold transition-colors duration-300">
                      {quiz.title}
                    </h3>
                    <p className="text-text-muted text-sm font-medium">
                      {quiz.category}
                    </p>
                  </div>
                </div>
                <p className="text-text-muted mb-6 leading-relaxed">
                  Sprawdź swoją wiedzę w {quiz.questions} wymagających
                  pytaniach.
                </p>
                <Btn
                  variant="primary"
                  className="group w-full"
                  onClick={() => navigate("/login")}
                >
                  Zagraj Teraz
                  <PlayCircle className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
                </Btn>
              </div>
            </div>
          ))}
        </div>{" "}
        <div className="mt-16 text-center">
          <Btn variant="outline" size="lg" onClick={() => navigate("/login")}>
            Przeglądaj Więcej Quizów
            <ChevronRight className="ml-2 h-5 w-5" />
          </Btn>
        </div>
      </div>
    </section>
  );
}
