function ProfileInfo({ displayName, creationTime, userId, lastLogin }) {
  return (
    <div className="mb-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Profile Information
      </h2>
      {/* Name */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Name
        </label>
        <p className="text-lg font-semibold text-gray-900">
          {displayName || "Not provided"}
        </p>
      </div>

      {/* UUID */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          UUID
        </label>
        <p className="text-lg font-semibold text-gray-900">
          {userId || "Not provided"}
        </p>
      </div>

      {/* Joined */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Joined
        </label>
        <p className="text-lg text-gray-900">
          {creationTime
            ? new Date(creationTime).toLocaleDateString()
            : "Unknown"}
        </p>
      </div>

      {/* Last Login */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Last Login
        </label>
        <p className="text-lg text-gray-900">{lastLogin}</p>
      </div>
    </div>
  );
}

export default ProfileInfo;
