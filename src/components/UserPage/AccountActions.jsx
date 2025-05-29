import { useState } from "react";

function AccountActions({ onLogout }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const handleChangePassword = () => {
    setPasswordMessage("Password changed successfully (simulated)!");
    setOldPassword("");
    setNewPassword("");
  };

  const handleDelete = () => {
    setDeleteMessage("Account deleted successfully (simulated)!");
    setShowConfirmDelete(false);
  };

  const handleLogoutClick = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error("Wystąpił błąd z wylogowaniem:", error);
    }
  };
  return (
    <div className="border-border bg-surface-elevated rounded-2xl border p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-warning/10 flex h-10 w-10 items-center justify-center rounded-full">
          <svg
            className="text-warning h-5 w-5"
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
          <h2 className="font-montserrat text-text text-lg font-semibold">
            Account Actions
          </h2>
          <p className="font-quicksand text-text-muted text-sm">
            Manage your account settings
          </p>
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="text-primary h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-quicksand text-text font-semibold">
            Change Password
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-quicksand text-text-muted mb-2 block text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="border-border bg-surface text-text font-quicksand focus:border-border-focus focus:ring-primary/20 w-full rounded-xl border p-3 transition-all duration-200 focus:ring-2 focus:outline-none"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-primary font-quicksand text-text-inverse hover:bg-primary/90 w-full rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
            disabled={!oldPassword || !newPassword}
          >
            Update Password
          </button>
          {passwordMessage && (
            <div className="bg-correct/10 border-correct/20 flex items-center gap-2 rounded-xl border p-3">
              <svg
                className="text-correct h-4 w-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-quicksand text-correct text-sm font-medium">
                {passwordMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="text-accent h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-quicksand text-text font-semibold">Sign Out</h3>
        </div>
        <button
          onClick={handleLogoutClick}
          className="from-accent to-accent/90 font-quicksand text-text-inverse w-full rounded-xl bg-gradient-to-r py-3 font-medium shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          Sign Out of Account
        </button>
      </div>

      {/* Delete Account */}
      <div className="border-border border-t pt-6">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="text-incorrect h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-quicksand text-text font-semibold">
            Danger Zone
          </h3>
        </div>
        {showConfirmDelete ? (
          <div className="bg-incorrect/5 border-incorrect/20 space-y-4 rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <svg
                className="text-incorrect mt-0.5 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-quicksand text-text mb-1 text-sm font-semibold">
                  Permanently delete account
                </p>
                <p className="font-quicksand text-text-muted text-sm">
                  This action cannot be undone. All your data, including quizzes
                  and progress, will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="bg-incorrect font-quicksand text-text-inverse hover:bg-incorrect/90 flex-1 rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="border-border bg-surface font-quicksand text-text hover:bg-surface-elevated flex-1 rounded-xl border px-4 py-3 font-medium transition-all duration-200 active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="border-incorrect/30 bg-incorrect/10 font-quicksand text-incorrect hover:bg-incorrect/20 hover:border-incorrect/50 w-full rounded-xl border px-4 py-3 font-medium transition-all duration-200 active:scale-[0.98]"
          >
            Delete Account
          </button>
        )}
        {deleteMessage && (
          <div className="bg-correct/10 border-correct/20 mt-4 flex items-center gap-2 rounded-xl border p-3">
            <svg
              className="text-correct h-4 w-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-quicksand text-correct text-sm font-medium">
              {deleteMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountActions;
