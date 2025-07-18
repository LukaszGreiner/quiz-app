import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  pl: {
    translation: {
      // Navigation
      "nav.home": "Strona główna",
      "nav.createQuiz": "Stwórz Quiz",
      "nav.statistics": "Statystyki",
      "nav.profile": "Profil",
      
      // Common
      "common.loading": "Ładowanie...",
      "common.error": "Wystąpił błąd",
      "common.save": "Zapisz",
      "common.cancel": "Anuluj",
      "common.submit": "Wyślij",
      "common.back": "Wstecz",
      "common.next": "Dalej",
      
      // Quiz specific
      "quiz.title": "Tytuł quizu",
      "quiz.score": "Twój wynik",
      "quiz.attempts": "Liczba podejść",
      "quiz.loading": "Ładowanie quizów...",
      
      // Profile
      "profile.settings": "Ustawienia profilu",
      "profile.displayName": "Nazwa wyświetlana",
      "profile.age": "Wiek",
      "profile.gender": "Płeć",
      "profile.userType": "Typ użytkownika",
      "profile.goal": "Główny cel",
      "profile.interests": "Zainteresowania",
      "profile.about": "Coś o sobie",
      
      // Profile Setup Steps
      "profileSetup.step1.title": "Podstawowe informacje",
      "profileSetup.step1.subtitle": "Poznajmy się lepiej",
      "profileSetup.step2.title": "Kim jesteś?",
      "profileSetup.step2.subtitle": "Pomóż nam dostosować doświadczenie do Twoich potrzeb",
      "profileSetup.step3.title": "Finalizacja profilu",
      "profileSetup.step3.subtitle": "Ostatnie informacje, które pomogą nam dostosować aplikację",
      
      // Form validation
      "validation.required": "To pole jest wymagane",
      "validation.tooShort": "Za krótkie",
      "validation.tooLong": "Za długie",
      "validation.invalidUsername": "Nieprawidłowa nazwa użytkownika",
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.createQuiz": "Create Quiz",
      "nav.statistics": "Statistics",
      "nav.profile": "Profile",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "An error occurred",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.submit": "Submit",
      "common.back": "Back",
      "common.next": "Next",
      
      // Quiz specific
      "quiz.title": "Quiz title",
      "quiz.score": "Your score",
      "quiz.attempts": "Number of attempts",
      "quiz.loading": "Loading quizzes...",
      
      // Profile
      "profile.settings": "Profile Settings",
      "profile.displayName": "Display Name",
      "profile.age": "Age",
      "profile.gender": "Gender",
      "profile.userType": "User Type",
      "profile.goal": "Primary Goal",
      "profile.interests": "Interests",
      "profile.about": "About Me",
      
      // Profile Setup Steps
      "profileSetup.step1.title": "Basic Information",
      "profileSetup.step1.subtitle": "Let's get to know you better",
      "profileSetup.step2.title": "Who are you?",
      "profileSetup.step2.subtitle": "Help us tailor the experience to your needs",
      "profileSetup.step3.title": "Profile Finalization",
      "profileSetup.step3.subtitle": "Final information to help us customize the app",
      
      // Form validation
      "validation.required": "This field is required",
      "validation.tooShort": "Too short",
      "validation.tooLong": "Too long",
      "validation.invalidUsername": "Invalid username",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pl',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
