import { useRef, useState } from "react";
import { FaImage, FaTrash } from "react-icons/fa";

const ImageUpload = ({
  image,
  onChange,
  label = "Dodaj zdjęcie (jpg/png)",
}) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allowed file types (MIME types for JPG and PNG)
    const allowedTypes = ["image/jpeg", "image/png"];
    // Allowed extensions (for additional validation)
    const allowedExtensions = [".jpg", ".jpeg", ".png"];

    // Check MIME type
    const isValidType = allowedTypes.includes(file.type);
    // Check file extension
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    const isValidExtension = allowedExtensions.includes(fileExtension);

    if (!isValidType || !isValidExtension) {
      setError("Proszę wybrać plik w formacie JPG lub PNG.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Clear any previous error and set the image
    setError("");
    onChange(file);
  };

  const handleRemoveImage = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  return (
    <div className="mb-2">
      <label className="mb-2 flex items-center gap-1 text-sm text-gray-600">
        <FaImage size={12} /> {label}
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="mb-2 w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-1 file:text-indigo-700 file:hover:bg-indigo-100"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {image && (
        <div className="relative mt-1 inline-block">
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="max-h-32 rounded-md object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            title="Usuń zdjęcie"
          >
            <FaTrash size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
