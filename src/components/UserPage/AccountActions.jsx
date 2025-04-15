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
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Account Actions
      </h2>

      {/* Change Password */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-gray-600">
          Change Password
        </h3>
        <div className="space-y-3">
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
            className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={handleChangePassword}
            className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
          >
            Change Password
          </button>
          {passwordMessage && (
            <p className="text-sm text-green-600">{passwordMessage}</p>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-gray-600">Logout</h3>
        <button
          onClick={handleLogoutClick}
          className="w-full rounded-lg bg-gradient-to-r from-red-500 to-red-600 py-3 font-medium tracking-wide text-white shadow-md transition-all duration-300 hover:from-red-600 hover:to-red-700"
        >
          Logout
        </button>
      </div>

      {/* Delete Account */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-600">
          Delete Account
        </h3>
        {showConfirmDelete ? (
          <div className="space-y-3">
            <p className="text-sm text-red-600">
              Are you sure you want to delete your account? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="w-full rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
          >
            Delete Account
          </button>
        )}
        {deleteMessage && (
          <p className="mt-2 text-sm text-green-600">{deleteMessage}</p>
        )}
      </div>
    </div>
  );
}

export default AccountActions;