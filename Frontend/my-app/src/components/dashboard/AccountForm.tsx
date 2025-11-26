import { useState, useEffect } from "react";
import ChangePasswordModal from "../common/ChangePasswordModal";
import { useUser } from "@/src/contexts/UserContext";
import { changeUserInfo} from "@/src/services/authService";

interface AccountFormProps {
  email: string;
  displayName: string;
  userGender: string; 
  userDob?: string | Date;
  onSubmit?: () => void;
}

// Alert Component for displaying status
const StatusAlert = ({ type, message }: { type: 'success' | 'error', message: string }) => {
  const isSuccess = type === 'success';
  return (
    <div className={`flex items-center p-4 mb-4 rounded-lg border ${
      isSuccess 
        ? 'bg-green-500/10 border-green-500/50 text-green-500' 
        : 'bg-red-500/10 border-red-500/50 text-red-500'
    }`}>
      {/* Icon */}
      <div className="mr-3">
        {isSuccess ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        )}
      </div>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

// RadioInput Component
const RadioInput = ({ value, label, currentGender, onChange }: { value: string; label: string; currentGender: string; onChange: (value: string) => void }) => (
  <label className="flex items-center cursor-pointer select-none group">
    <input type="radio" name="gender" value={value} checked={currentGender === value} onChange={() => onChange(value)} className="hidden" />
    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 transition-colors ${currentGender === value ? 'border-blue-600' : 'border-gray-600 group-hover:border-gray-500'}`}>
      {currentGender === value && <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>}
    </span>
    <span className={`${currentGender === value ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>{label}</span>
  </label>
);

export default function AccountForm({ email, displayName, userGender, userDob, onSubmit }: AccountFormProps) {
  const { user,login } = useUser();
  
  // Form Data State
  const [name, setName] = useState(displayName);
  const [gender, setGender] = useState(userGender || "other");
  const [dob, setDob] = useState<string>(
    userDob ? new Date(userDob).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  
  // UI State
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Sync state with props
  useEffect(() => {
    setName(displayName);
    setGender(userGender || "other");
    if (userDob) {
      setDob(new Date(userDob).toISOString().split('T')[0]);
    }
  }, [displayName, userGender, userDob]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus(null);
  setLoading(true);

  if (!user || !user.accessToken) {
    setStatus({ type: 'error', message: "Session expired, please log in again." });
    setLoading(false);
    return;
  }

  try {
    const dobDate = new Date(dob);
    const response = await changeUserInfo(name, gender, user.accessToken, dobDate);

    if (!response.success) {
      throw new Error(response.message || "Update failed");
    }

    // --- SUCCESS ---
    setStatus({ type: 'success', message: "Profile updated successfully!" });

    // --- CẬP NHẬT USER CONTEXT ---
    const updatedUser = {
      ...user,
      displayName: name,
      gender: gender,
      // Nếu muốn update dob hay avatar, thêm vào đây
    };
    login(updatedUser); // cập nhật context + localStorage

    // Auto-hide success message
    setTimeout(() => setStatus(null), 3000);

    if (onSubmit) onSubmit();

  } catch (err) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
    setStatus({ type: 'error', message: msg });
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <form onSubmit={handleSubmit}>
        
        {/* Success/Error Feedback */}
        {status && <StatusAlert type={status.type} message={status.message} />}

        {/* Email Field */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            disabled 
            className="w-full bg-[#1f232b] border border-[#353a45] rounded-lg px-4 py-3 focus:outline-none text-gray-500 cursor-not-allowed select-none" 
          />
        </div>

        {/* Display Name Field */}
        <div className="mb-6">
          <label htmlFor="displayName" className="block text-gray-400 mb-2">Display Name</label>
          <input 
            type="text" 
            id="displayName" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full bg-[#1f232b] border border-[#353a45] rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 text-white transition-colors" 
          />
        </div>

        {/* Date of Birth Field */}
        <div className="mb-6">
          <label htmlFor="dob" className="block text-gray-400 mb-2">Date of Birth</label>
          <input 
            type="date" 
            id="dob" 
            value={dob} 
            onChange={e => setDob(e.target.value)} 
            className="w-full bg-[#1f232b] border border-[#353a45] rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 text-white scheme-dark transition-colors" 
          />
        </div>

        {/* Gender Selection */}
        <div className="mb-8">
          <label className="block text-gray-400 mb-2">Gender</label>
          <div className="flex items-center space-x-6 text-gray-300">
            <RadioInput value="male" label="Male" currentGender={gender} onChange={setGender} />
            <RadioInput value="female" label="Female" currentGender={gender} onChange={setGender} />
            <RadioInput value="other" label="Other" currentGender={gender} onChange={setGender} />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`
            bg-blue-600 text-white font-bold px-8 py-3 rounded-lg transition-all
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
          `}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>

        {/* Change Password Link */}
        <p className="text-gray-400 mt-8">
          To change password, click <button type="button" className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer" onClick={() => setShowModal(true)}>here</button>
        </p>
      </form>
      
      <ChangePasswordModal 
        open={showModal} 
        onClose={() => setShowModal(false)}
      />
    </>
  );
}