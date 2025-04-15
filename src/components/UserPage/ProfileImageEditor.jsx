import { useState } from "react";

function ProfileImageEditor({ initialImage, onEditProfile }) {
  const [image, setImage] = useState(initialImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="mb-6 flex justify-center">
      <div className="flex flex-col items-center gap-3">
        <img
          src={image}
          alt="Profile"
          className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md transition-transform hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <label className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-poppins text-white transition-colors hover:bg-primary/90">
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
    </div>
  );
}

export default ProfileImageEditor;