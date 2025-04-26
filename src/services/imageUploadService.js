/**
 * Image Upload Service
 *
 * This service handles image-related operations for the quiz application:
 * - Converting Firebase Storage URLs to File objects
 * - Managing image sources for display
 */

export const convertUrlToFile = async (imageUrl) => {
  if (
    !imageUrl ||
    typeof imageUrl !== "string" ||
    !imageUrl.includes("firebasestorage.googleapis.com")
  ) {
    return null;
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileName = imageUrl.split("/").pop().split("?")[0];
    return new File([blob], fileName, { type: blob.type });
  } catch (error) {
    console.error("Wystąpił błąd przy konwersji UR zdjęcia do Pliku: ", error);
    throw new Error("Wystąpił błąd przy pobieraniu zdjęcia z bazy danych");
  }
};

export const getImageSource = (image) => {
  if (!image) return null;
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }
  return image;
};

export const handleImageChange = (file) => {
  if (!file) return null;
  return file;
};
