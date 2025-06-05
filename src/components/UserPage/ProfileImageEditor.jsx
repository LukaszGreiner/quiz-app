import { useState } from "react";
import { Edit, Camera, User, LogOut } from "lucide-react";
import Btn from "../common/Btn";

function ProfileImageEditor({
  initialImage,
  readOnly,
  onEditProfile,
  onLogout,
}) {
  const [image, setImage] = useState(initialImage || "/profile_icon.jpg");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Profile Image Container */}
      <div className="group relative">        <div className="ring-primary/20 ring-offset-surface-elevated group-hover:ring-primary/30 relative overflow-hidden rounded-full ring-4 ring-offset-4 transition-all duration-300 group-hover:ring-offset-2">
          <img
            src={image}
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/profile_icon.jpg";
            }}
            className="h-32 w-32 object-cover transition-all duration-300 group-hover:scale-105 sm:h-40 sm:w-40"
            referrerPolicy="no-referrer"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Edit Badge */}
        <div className="bg-primary text-text-inverse border-surface-elevated hover:bg-primary/90 absolute -right-1 -bottom-1 rounded-full border-2 p-2 shadow-lg transition-all duration-200 hover:scale-110">
          <Edit className="h-4 w-4" />
        </div>
      </div>{" "}
      {!readOnly && (
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          {/* Action Buttons */}
          <div className="flex w-full gap-3">
            <label className="flex-1">
              <Btn
                variant="primary"
                className="group w-full cursor-pointer"
                as="div"
              >
                <Camera className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Zmień zdjęcie
              </Btn>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <Btn
            variant="outline"
            onClick={onEditProfile}
            className="group w-full"
          >
            <User className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Edytuj profil
          </Btn>

          {onLogout && (
            <Btn variant="danger" onClick={onLogout} className="group w-full">
              <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Wyloguj się
            </Btn>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileImageEditor;
