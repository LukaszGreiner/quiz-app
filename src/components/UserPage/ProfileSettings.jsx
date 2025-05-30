import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useUsernameValidation } from "../../hooks/useUsernameValidation";

function ProfileSettings({
  initialUsername,
  initialUserType,
  initialGoal,
  initialDescription,
  onSave,
}) {
  const [username, setUsername] = useState(initialUsername);
  const [userType, setUserType] = useState(initialUserType);
  const [goal, setGoal] = useState(initialGoal);
  const [description, setDescription] = useState(initialDescription); // Use username validation hook
  const {
    validationState: { isValid: isUsernameValid, error: usernameMessage },
    isChecking: isCheckingUsername,
    validateUsername: checkUsername,
  } = useUsernameValidation(initialUsername);
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    checkUsername(value);
  };
  const handleSave = async () => {
    try {
      if (!isUsernameValid && username !== initialUsername) {
        throw new Error("Nazwa użytkownika nie jest prawidłowa");
      }
      await onSave({ username, userType, goal, description });
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };
  return (
    <div className="border-border bg-surface-elevated rounded-2xl border p-6 shadow-lg">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <svg
            className="text-primary h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h2 className="font-montserrat text-text text-xl font-bold">
            Profile Settings
          </h2>
          <p className="font-quicksand text-text-muted text-sm">
            Update your personal information
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {" "}
        {/* Username */}
        <div>
          <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
            Display Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your display name"
              className={`border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full rounded-xl border p-3 pr-10 transition-all duration-200 focus:ring-2 focus:outline-none ${
                username.trim() &&
                username !== initialUsername &&
                isUsernameValid
                  ? "border-correct ring-correct/20"
                  : username.trim() &&
                      username !== initialUsername &&
                      !isUsernameValid
                    ? "border-incorrect ring-incorrect/20"
                    : ""
              }`}
            />
            {username.trim() && username !== initialUsername && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                {isCheckingUsername ? (
                  <Loader2 className="text-text-muted h-5 w-5 animate-spin" />
                ) : isUsernameValid ? (
                  <CheckCircle className="text-correct h-5 w-5" />
                ) : (
                  <XCircle className="text-incorrect h-5 w-5" />
                )}
              </div>
            )}
          </div>
          {username.trim() &&
            username !== initialUsername &&
            usernameMessage && (
              <p
                className={`font-quicksand mt-2 text-sm ${
                  isUsernameValid ? "text-correct" : "text-incorrect"
                }`}
              >
                {usernameMessage}
              </p>
            )}
        </div>
        {/* User Type */}
        <div>
          <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
            User Type
          </label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
          >
            <option value="Student">Student</option>
            <option value="Uczeń">Uczeń</option>
            <option value="Nauczyciel">Nauczyciel</option>
            <option value="Wykładowca">Wykładowca</option>
            <option value="Pracownik">Pracownik</option>
            <option value="Ankieter">Ankieter</option>
            <option value="Inne">Inne</option>
          </select>
        </div>
        {/* Goal */}
        <div>
          <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
            Primary Goal
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full cursor-pointer appearance-none rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
          >
            <option value="Własny rozwój">Personal Development</option>
            <option value="Nauczanie">Teaching</option>
            <option value="Badania">Research</option>
            <option value="Rozrywka">Entertainment</option>
          </select>
        </div>
        {/* Description */}
        <div>
          <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
            About Me
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full resize-none rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
            rows="4"
            placeholder="Tell us about yourself, your interests, and what you hope to achieve..."
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="font-quicksand text-text-muted text-xs">
              This will be visible on your public profile
            </p>
            <p className="font-quicksand text-text-muted text-xs">
              {description.length}/500
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="border-border mt-8 flex justify-end border-t pt-6">
        <button
          onClick={handleSave}
          className="bg-primary font-quicksand text-text-inverse hover:bg-primary/90 flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
