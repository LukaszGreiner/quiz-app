import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaImage, FaTrash } from "react-icons/fa";
import {
  convertUrlToFile,
  getImageSource,
  handleImageChange,
} from "../../services/imageUploadService.js";

const ImageUpload = ({
  image,
  onChange,
  label = "Dodaj zdjęcie (jpg/png/gif)",
  fieldName = "image", // default to quiz image
}) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const { setValue } = useFormContext();
  const initRef = useRef(false);

  useEffect(() => {
    const initializeImage = async () => {
      // Don't try to convert if the image is already a File or empty object
      if (
        !image ||
        initRef.current ||
        image instanceof File ||
        (typeof image === "object" && !image.toString().includes("http"))
      )
        return;
      initRef.current = true;

      try {
        const file = await convertUrlToFile(image);
        if (file) {
          onChange(file);
          // Set imageUrl for the specific field (quiz or question)
          setValue(fieldName.replace("image", "imageUrl"), image);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    initializeImage();
  }, [image, onChange, setValue, fieldName]);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError("");
      onChange(handleImageChange(file));
      // Clear imageUrl for the specific field
      setValue(fieldName.replace("image", "imageUrl"), null);
    } catch (err) {
      setError(err.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onRemoveImage = () => {
    onChange(null);
    // Clear both image and imageUrl for the specific field
    setValue(fieldName, null);
    setValue(fieldName.replace("image", "imageUrl"), null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
  };

  return (
    <div className="mb-2">
      <label
        htmlFor={`${fieldName}-upload`}
        className="mb-2 flex items-center gap-1 text-sm text-gray-600"
      >
        <FaImage size={12} /> {label}
      </label>
      <input
        id={`${fieldName}-upload`}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={onImageChange}
        ref={fileInputRef}
        className="mb-2 w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-1 file:text-indigo-700 file:hover:bg-indigo-100"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {image && (
        <div className="relative mt-1 inline-block">
          <img
            src={getImageSource(image)}
            alt="Podgląd zdjęcia"
            className="h-32 rounded-md object-cover"
          />
          <button
            type="button"
            onClick={onRemoveImage}
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
