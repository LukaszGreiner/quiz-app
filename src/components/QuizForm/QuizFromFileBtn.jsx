import { FaArrowUpFromBracket } from "react-icons/fa6";
import useImportQuestions from "../../hooks/useImportQuestions";
export default function QuizFromFileBtn({ onImportQuestions }) {
  const { fileInputRef, handleButtonClick, handleFileChange } =
    useImportQuestions(onImportQuestions);

  return (
    <button
      type="button"
      title="Importuj pytania z pliku"
      className="bg-primary hover:bg-primary-hover flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-white"
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
