import { FaArrowUpFromBracket } from "react-icons/fa6";
import useImportQuestions from "../../hooks/useImportQuestions";
export default function QuizFromFileBtn({ onImportQuestions }) {
  const { fileInputRef, handleButtonClick, handleFileChange } =
    useImportQuestions(onImportQuestions);

  return (
    <button
      type="button"
      title="Importuj pytania z pliku"
      className="bg-primary text-text-inverse hover:bg-primary/85 focus:ring-primary/20 active:bg-primary/95 flex cursor-pointer items-center justify-center rounded-md px-4 py-2 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={handleButtonClick}
    >
      <input
        type="file"
        accept=".txt,.csv"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        tabIndex={-1}
        onChange={handleFileChange}
      />
      <FaArrowUpFromBracket className="mr-2" />
      Importuj z pliku
    </button>
  );
}
