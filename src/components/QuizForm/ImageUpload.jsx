import { useRef, useState } from "react";
import { FaImage, FaTrash } from "react-icons/fa";
import { validateImage } from "../../utils/quizUtils";

const ImageUpload = ({
  image,
  onChange,
  label = "Dodaj zdjęcie (jpg/png/gif)",
}) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const validatedFile = validateImage(file, "zdjęcia");
      setError("");
      onChange(validatedFile);
    } catch (err) {
      setError(err.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
  };

  return (
    <div className="mb-2">
      <label
        htmlFor="image-upload"
        className="mb-2 flex items-center gap-1 text-sm text-gray-600"
      >
        <FaImage size={12} /> {label}
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="mb-2 w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-1 file:text-indigo-700 file:hover:bg-indigo-100"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {image && (
        <div className="relative mt-1 inline-block">
          <img
            src={URL.createObjectURL(image)}
            alt="Podgląd zdjęcia"
            className="h-32 rounded-md object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="bg-warning hover:bg-warning/80 absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white"
            aria-label="Usuń zdjęcie"
          >
            <FaTrash size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
