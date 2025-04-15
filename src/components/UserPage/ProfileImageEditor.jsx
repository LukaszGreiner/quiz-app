import { useState } from "react";

function ProfileImageEditor({ initialImage, readOnly, onEditProfile }) {
  const [image, setImage] = useState(initialImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="mb-6 flex flex-col items-center">
      <img
        src={image}
        alt="Profile"
        className="mb-4 h-32 w-32 rounded-full border-4 border-white object-cover shadow-md transition-transform hover:scale-105"
        referrerPolicy="no-referrer"
      />
      {!readOnly && (
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-poppins text-white text-center transition-colors hover:bg-primary/90">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <button
            className="rounded-lg bg-primary px-4 py-2 font-poppins text-white transition-colors hover:bg-primary/90"
            onClick={onEditProfile}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileImageEditor;