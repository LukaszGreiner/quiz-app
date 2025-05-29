import Logo from "../common/Logo";

export default function Footer() {
  return (
    <footer className="border-border bg-surface-elevated border-t py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
          <div className="mb-6 flex items-center md:mb-0">
            <Logo />
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a
              href="#"
              className="text-text-muted hover:text-primary transition-colors"
            >
              Start
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-primary transition-colors"
            >
              Funkcje
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                console.log("Polityka Prywatności");
              }}
              className="text-text-muted hover:text-primary transition-colors"
            >
              Polityka Prywatności
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                console.log("Warunki Usługi");
              }}
              className="text-text-muted hover:text-primary transition-colors"
            >
              Warunki Usługi
            </a>
          </div>
        </div>
        <div className="border-border border-t pt-8 text-center">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} Quizowisko. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
