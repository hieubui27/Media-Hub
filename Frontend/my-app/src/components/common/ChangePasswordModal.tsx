import { useUser } from "@/src/contexts/UserContext";
import { changePassword } from "@/src/services/authService";
import { useState } from "react";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { user, isLoading } = useUser();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // prevent rendering until user is loaded
  if (isLoading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // check session
    if (!user || !user.accessToken) {
      setError("Session expired, please log in again.");
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(
        oldPassword,
        newPassword,
        confirmPassword,
        user.accessToken
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to change password");
      }

      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#23272f] p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Old Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-[#1f232b] border border-[#353a45] text-white focus:outline-none focus:border-blue-500"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-[#1f232b] border border-[#353a45] text-white focus:outline-none focus:border-blue-500"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-[#1f232b] border border-[#353a45] text-white focus:outline-none focus:border-blue-500"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded border border-red-500/20">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Changing..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
