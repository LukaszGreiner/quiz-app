import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pl' ? 'en' : 'pl';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="hover:bg-background hover:[&_svg] flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm [&_svg]:size-4 hover:[&_svg]:fill-current"
      aria-label={`Switch to ${i18n.language === 'pl' ? 'English' : 'Polish'}`}
      title={`Switch to ${i18n.language === 'pl' ? 'English' : 'Polish'}`}
    >
      <Globe className="text-text fill-none" />
      <span className="sr-only ml-1 text-xs font-medium">
        {i18n.language.toUpperCase()}
      </span>
    </button>
  );
}
