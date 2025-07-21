import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function ProfileAvatar({ avatar }) {
  const { currentUser } = useAuth();
  const profileURL = currentUser?.photoURL;

  return (
    <Link to="/user/details" className="flex items-center">
      <img
        src={profileURL || avatar || "../profile_icon.jpg"}
        alt="Profil"
        className="h-10 w-10 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    </Link>
  );
}
