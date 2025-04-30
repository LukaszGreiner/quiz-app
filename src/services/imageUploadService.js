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
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const blob = await response.blob();
    const fileName = imageUrl.split("/").pop().split("?")[0] || "image.jpg";
    return new File([blob], fileName, { type: blob.type });
  } catch (error) {
    console.error("Error converting image URL to File:", error);
    throw new Error("Failed to fetch image from database");
  }
};

export const getImageSource = (image) => {
  if (!image) return null;

  // Handle File objects
  if (image instanceof File) {
    try {
      return URL.createObjectURL(image);
    } catch (error) {
      console.error("Error creating object URL:", error);
      return null;
    }
  }

  // Handle URL strings (Firebase URLs or other image URLs)
  if (typeof image === "string" && image.length > 0) {
    return image;
  }

  // Return null for invalid inputs
  console.warn("Invalid image input:", image);
  return null;
};

export const handleImageChange = (file) => {
  if (!file) return null;
  return file;
};
