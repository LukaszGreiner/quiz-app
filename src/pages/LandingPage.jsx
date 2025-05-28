import React, { useState } from "react";
import {
  ChevronRight,
  Zap,
  Brain,
  Award,
  Users,
  PlayCircle,
  HelpCircle,
  BarChart2,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
  Star,
  Edit3,
  PlusSquare,
  Plus,
  Menu,
  X, // Added X icon for closing menu
} from "lucide-react";
import Logo from "../components/Layout/Logo";
import ThemeToggle from "../components/UI/ThemeToggle";
import Btn from "../components/UI/Btn";

// Przykładowe dane dla wyróżnionych quizów - zastąp rzeczywistymi danymi w razie potrzeby
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

// Dane do opinii
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

// Główny komponent aplikacji
export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="bg-background text-text min-h-screen antialiased">
      <header className="bg-surface-elevated/80 border-border sticky top-0 z-50 border-b shadow-lg backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <Logo />
            </div>

            <nav className="hidden items-center justify-center space-x-2 sm:flex">
              <ThemeToggle />
              <span className="mx-2">|</span>
              <Btn variant="base" size="small" to="/login">
                Zaloguj się
              </Btn>
              <Btn variant="primary" size="small" to="/signup">
                Zarejestruj się
              </Btn>
            </nav>

            {/* mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-text hover:text-primary focus:text-primary transition-colors duration-200 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          <div
            className={`border-border bg-surface-elevated overflow-hidden border-t transition-all duration-300 ease-in-out sm:hidden ${
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`transform space-y-3 px-4 py-3 transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? "translate-y-0" : "-translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-text text-sm font-medium">Motyw</span>
                <ThemeToggle />
              </div>
              <div className="border-border flex flex-wrap border-t py-3">
                <Btn
                  variant="outline"
                  size="small"
                  to="user/login"
                  className="w-full flex-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Zaloguj się
                </Btn>
                <span className="text-text mx-2">|</span>
                <Btn
                  variant="white"
                  size="small"
                  to="/user/signup"
                  className="w-full flex-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Zarejestruj się
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Sekcja HERO */}
      <section
        id="home"
        className="bg-surface relative overflow-hidden py-20 md:py-32"
      >
        {/* Opcjonalny dekoracyjny element tła */}
        <div className="absolute inset-0 opacity-10">
          <div className="bg-accent absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl"></div>
          <div className="bg-primary absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl"></div>
        </div>

        {/* Dodana grafika SVG */}
        <div className="pointer-events-none absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 opacity-5 lg:opacity-10">
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
            <span className="text-text mb-2 block">Quizowisko</span>
            <span className="bg-gradient from-primary to-accent block bg-gradient-to-r bg-clip-text text-3xl leading-normal text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
              Graj, twórz i ucz się z quizami!
            </span>
          </h1>
          <p className="text-text-muted mx-auto mb-12 max-w-3xl text-lg leading-relaxed md:text-xl lg:text-2xl">
            Sprawdź swoją wiedzę, rywalizuj ze znajomymi i twórz własne quizy w
            kilka minut. Nauka nigdy nie była tak wciągająca. Zacznij teraz!
          </p>

          {/* Statystyki */}
          <div className="mx-auto mb-8 grid max-w-3xl grid-cols-3 gap-4">
            <div className="bg-surface-elevated/30 rounded-lg p-3">
              <div className="text-primary text-2xl font-bold">1000+</div>
              <div className="text-sm">Quizów</div>
            </div>
            <div className="bg-surface-elevated/30 rounded-lg p-3">
              <div className="text-accent text-2xl font-bold">50+</div>
              <div className="text-sm">Kategorii</div>
            </div>
            <div className="bg-surface-elevated/30 rounded-lg p-3">
              <div className="text-info text-2xl font-bold">10k+</div>
              <div className="text-sm">Użytkowników</div>
            </div>
          </div>

          <div className="mx-auto grid max-w-md grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
            <Btn variant="primary" size="large" to="/signup">
              <PlayCircle className="mr-2 h-5 w-5" />
              Rozpocznij grę!
            </Btn>
            <Btn variant="outline" size="large" className="group" to="/newquiz">
              <PlusSquare className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              Utwórz quiz
            </Btn>
          </div>
        </div>
      </section>{" "}
      {/* Features Section */}
      <section id="features" className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-text mb-4 text-3xl font-bold md:text-4xl">
              Dlaczego Quizowisko?
            </h2>
            <p className="text-text-muted mx-auto max-w-xl text-lg">
              Odkryj funkcje, które sprawiają, że nauka staje się przyjemnością
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Zap className="text-primary h-8 w-8" />,
                title: "Błyskawiczna rozgrywka",
                description:
                  "Rozpocznij quiz w ciągu sekund. Bez zbędnych komplikacji.",
              },
              {
                icon: <Brain className="text-accent h-8 w-8" />,
                title: "Inteligentny system",
                description:
                  "Algorytm dopasowuje trudność do Twojego poziomu wiedzy.",
              },
              {
                icon: <Users className="text-info h-8 w-8" />,
                title: "Graj z przyjaciółmi",
                description:
                  "Zaproś znajomych i rywalizuj w czasie rzeczywistym.",
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
                icon: <ShieldCheck className="text-secondary h-8 w-8" />,
                title: "Bezpieczne i prywatne",
                description: "Twoje dane są w pełni chronione i szyfrowane.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-surface-elevated border-border rounded-xl border p-6 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="bg-surface mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-text mb-2 text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>{" "}
      {/* How it works */}
      <section id="how-it-works" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-text mb-4 text-3xl font-bold md:text-4xl">
              Jak to działa?
            </h2>
            <p className="text-text-muted mx-auto max-w-xl text-lg">
              W trzech krokach od rejestracji do rozgrywki. Gotowy na wyzwanie?
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {[
              {
                step: 1,
                title: "Załóż konto za darmo",
                description:
                  "Jeden formularz, kilka sekund i już jesteś częścią społeczności! Śledź swoje postępy i odblokowuj nowe poziomy.",
                icon: <Users className="text-primary mx-auto h-10 w-10" />,
              },
              {
                step: 2,
                title: "Znajdź swój quiz",
                description:
                  "Setki kategorii czekają na Ciebie - od historii po popkulturę. Nie znajdziesz swojego tematu? Stwórz własny quiz!",
                icon: (
                  <HelpCircle className="text-secondary mx-auto h-10 w-10" />
                ),
              },
              {
                step: 3,
                title: "Graj i się rozwijaj",
                description:
                  "Zdobywaj punkty, wspinaj się w rankingach i dziel się wynikami. Każda gra to nowa porcja wiedzy!",
                icon: <PlayCircle className="text-correct mx-auto h-10 w-10" />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-surface-elevated border-border rounded-xl border p-6 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="bg-surface ring-primary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ring-4">
                  {item.icon}
                </div>
                <h3 className="text-text mb-2 text-xl font-semibold">
                  Krok {item.step}: {item.title}
                </h3>
                <p className="text-text-muted">{item.description}</p>{" "}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Quizzes Section */}
      <section id="quizzes" className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-text mb-4 text-3xl font-bold md:text-4xl">
              Popularne Quizy
            </h2>
            <p className="text-text-muted mx-auto max-w-xl text-lg">
              Sprawdź swoją wiedzę w naszych najlepszych quizach
            </p>
          </div>{" "}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="group bg-surface-elevated border-border transform overflow-hidden rounded-xl border shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center">
                    <div className="bg-surface group-hover:bg-primary mr-4 rounded-full p-3 transition-colors duration-300">
                      {quiz.icon}
                    </div>
                    <div>
                      <h3 className="text-text group-hover:text-primary text-xl font-semibold transition-colors duration-300">
                        {quiz.title}
                      </h3>
                      <p className="text-primary text-sm font-medium">
                        {quiz.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-text-muted mb-4 text-sm">
                    Sprawdź swoją wiedzę w {quiz.questions} wymagających
                    pytaniach.
                  </p>
                  <Btn
                    variant="primary"
                    className="group w-full"
                    onClick={() => console.log(`Zagraj w quiz ${quiz.id}`)}
                  >
                    Zagraj Teraz{" "}
                    <PlayCircle className="ml-2 h-5 w-5 group-hover:animate-pulse" />
                  </Btn>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Btn variant="outline" size="large">
              Przeglądaj Więcej Quizów
            </Btn>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section id="testimonials" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-text mb-4 text-3xl font-bold md:text-4xl">
              Co mówią nasi użytkownicy?
            </h2>
            <p className="text-text-muted mx-auto max-w-xl text-lg">
              Dołącz do tysięcy zadowolonych graczy
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-surface-elevated border-border rounded-xl border p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="mr-4 h-12 w-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-text font-semibold">
                      {testimonial.name}
                    </h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="text-warning h-4 w-4 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-text-muted italic">
                  "{testimonial.feedback}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>{" "}
      {/* CTA Section */}
      <section
        id="contact"
        className="from-primary to-accent bg-gradient-to-r py-20 text-white md:py-32"
      >
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            Gotowy na intelektualną przygodę?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-white/80 md:text-xl">
            Dołącz do tysięcy graczy, którzy codziennie poszerzają swoją wiedzę
            i świetnie się bawią. Pierwsza gra jest za darmo!
          </p>
          <Btn variant="tertiary" size="large" to="/signup">
            <PlayCircle className="mr-3 h-6 w-6" />
            Rozpocznij przygodę - za darmo!
          </Btn>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-border bg-surface-elevated border-t py-12">
        <div className="text-text-muted container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center md:mb-0">
              <Logo />
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary transition-colors">
                Start
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Funkcje
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Polityka Prywatności");
                }}
                className="hover:text-primary transition-colors"
              >
                Polityka Prywatności
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Warunki Usługi");
                }}
                className="hover:text-primary transition-colors"
              >
                Warunki Usługi
              </a>
            </div>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Quizowisko. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </footer>{" "}
    </div>
  );
}
