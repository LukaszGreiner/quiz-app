import QuizCard from "./QuizCard";

export default function QuizesSection() {
  const cardData = [
    {
      imageSrc: "https://placehold.co/128x128.png?text=Matematyka",
      imageAlt: "Matematyka",
      title: "Matematyka na wesoło",
      description: "Liczenie z uśmiechem!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Historia",
      imageAlt: "Historia",
      title: "Ciekawostki historyczne",
      description: "Historia, która wciąga!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Zwierzęta",
      imageAlt: "Zwierzęta",
      title: "Zwierzęta świata",
      description: "Zwierzaki pełne niespodzianek.",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Nauka",
      imageAlt: "Nauka",
      title: "Eksperymenty naukowe",
      description: "Poznaj tajemnice świata!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Geografia",
      imageAlt: "Geografia",
      title: "Podróże po świecie",
      description: "Odkrywaj kontynenty!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Kosmos",
      imageAlt: "Kosmos",
      title: "Tajemnice kosmosu",
      description: "Eksploruj gwiazdy!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Muzyka",
      imageAlt: "Muzyka",
      title: "Rytmy i melodie",
      description: "Nauka przez muzykę!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Sztuka",
      imageAlt: "Sztuka",
      title: "Sztuka dla dzieci",
      description: "Twórz i odkrywaj!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Język",
      imageAlt: "Język",
      title: "Słowa i zagadki",
      description: "Baw się językiem!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Przyroda",
      imageAlt: "Przyroda",
      title: "Sekrety przyrody",
      description: "Odkrywaj naturę!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Fizyka",
      imageAlt: "Fizyka",
      title: "Fizyka w akcji",
      description: "Zasady, które rządzą światem!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Chemia",
      imageAlt: "Chemia",
      title: "Magia chemii",
      description: "Mieszaj i eksperymentuj!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Technologia",
      imageAlt: "Technologia",
      title: "Kod i roboty",
      description: "Przyszłość w Twoich rękach!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Sport",
      imageAlt: "Sport",
      title: "Sportowe wyzwania",
      description: "Ruszaj się i ucz!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Gotowanie",
      imageAlt: "Gotowanie",
      title: "Kuchnia dla dzieci",
      description: "Smakowita nauka!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Pogoda",
      imageAlt: "Pogoda",
      title: "Tajemnice pogody",
      description: "Co kryją chmury?",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Ocean",
      imageAlt: "Ocean",
      title: "Podwodny świat",
      description: "Zanurkuj w głębinach!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Czas",
      imageAlt: "Czas",
      title: "Podróż w czasie",
      description: "Zegar tyka - ucz się!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Rośliny",
      imageAlt: "Rośliny",
      title: "Świat roślin",
      description: "Zielona przygoda!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Liczby",
      imageAlt: "Liczby",
      title: "Zabawy z liczbami",
      description: "Matematyka w grach!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Kolory",
      imageAlt: "Kolory",
      title: "Kolorowy świat",
      description: "Ucz się przez kolory!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Kształty",
      imageAlt: "Kształty",
      title: "Kształty i figury",
      description: "Geometria na wesoło!",
      buttonText: "Zagraj!",
    },
    {
      imageSrc: "https://placehold.co/128x128.png?text=Kultura",
      imageAlt: "Kultura",
      title: "Kultury świata",
      description: "Odkrywaj tradycje!",
      buttonText: "Zagraj!",
    },
  ];
  return (
    <section className="w-full">
      <div className="flex flex-wrap justify-center gap-4 px-4 lg:px-0">
        {cardData.map((card, index) => (
          <QuizCard
            key={index}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
            title={card.title}
            description={card.description}
            buttonText={card.buttonText}
          />
        ))}
      </div>
    </section>
  );
}
