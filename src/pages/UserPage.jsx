import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!currentUser) {
    return <p className="mt-8 text-center">Loading...</p>;
  }

  // Use Google profile picture with no-referrer, or local placeholder
  const profileImage = currentUser.photoURL || "/profile_icon.jpg";

  return (
    <div className="mx-auto mt-8 max-w-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        User Details
      </h1>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex justify-center">
          <img
            src={profileImage}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">Name</label>
          <p className="text-gray-900">
            {currentUser.displayName || "Not provided"}
          </p>
        </div>
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700">Email</label>
          <p className="text-gray-900">{currentUser.email}</p>
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-medium text-gray-700">Joined</label>
          <p className="text-gray-900">
            {currentUser.metadata.creationTime
              ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
              : "Unknown"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-warning hover:bg-warning/90 w-full cursor-pointer rounded-md py-2 text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserPage;
