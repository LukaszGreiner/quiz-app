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
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <img
          src={image}
          alt="Profile"
          className="border-surface h-32 w-32 rounded-full border-4 object-cover shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          referrerPolicy="no-referrer"
        />
        <div className="bg-primary border-surface-elevated absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2">
          <svg
            className="text-text-inverse h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
      </div>

      {!readOnly && (
        <div className="flex w-full max-w-xs flex-col gap-3">
          {" "}
          <label className="bg-primary font-body text-text-inverse hover:bg-primary/90 cursor-pointer rounded-xl px-6 py-3 text-center font-medium transition-all duration-200 hover:shadow-md active:scale-95">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <button
            className="border-border bg-surface-elevated font-body text-text hover:bg-surface rounded-xl border px-6 py-3 font-medium transition-all duration-200 hover:shadow-md active:scale-95"
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
