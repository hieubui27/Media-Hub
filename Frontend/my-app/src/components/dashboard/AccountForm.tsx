import { useState, useEffect } from "react";
import ChangePasswordModal from "../common/ChangePasswordModal";
import { useUser } from "@/src/contexts/UserContext";
import { changeUserInfo } from "@/src/services/authService";

// ... (Keep interfaces and StatusAlert, RadioInput components)
interface AccountFormProps {
  email: string;
  displayName: string;
  userGender: string; 
  userDob?: string | Date;
  onSubmit?: () => void;
}

const StatusAlert = ({ type, message }: { type: 'success' | 'error', message: string }) => {
  const isSuccess = type === 'success';
  return (
    <div className={`flex items-center p-4 mb-6 rounded-lg border ${
      isSuccess 
        ? 'bg-green-500/10 border-green-500/50 text-green-500' 
        : 'bg-red-500/10 border-red-500/50 text-red-500'
    }`}>
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

const RadioInput = ({ value, label, currentGender, onChange }: { value: string; label: string; currentGender: string; onChange: (value: string) => void }) => (
  <label className="flex items-center cursor-pointer select-none group mr-4 mb-2">
    <input type="radio" name="gender" value={value} checked={currentGender === value} onChange={() => onChange(value)} className="hidden" />
    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 transition-colors ${currentGender === value ? 'border-violet-600' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
      {currentGender === value && <span className="w-2.5 h-2.5 bg-violet-600 rounded-full"></span>}
    </span>
    <span className={`${currentGender === value ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{label}</span>
  </label>
);

export default function AccountForm({ email, displayName, userGender, userDob, onSubmit }: AccountFormProps) {
  const { user, login } = useUser();
  const [name, setName] = useState(displayName);
  const [gender, setGender] = useState(userGender || "other");
  
  // Helper function to format date to YYYY-MM-DD for date input
  const formatDateForInput = (dateInput?: string | Date) => {
    if (!dateInput) return "";
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  const [dob, setDob] = useState<string>(formatDateForInput(userDob));
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Synchronize local state when props from parent (AccountPage) change
  useEffect(() => {
    setName(displayName);
    setGender(userGender || "other");
    setDob(formatDateForInput(userDob));
  }, [displayName, userGender, userDob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    if (!user || !user.accessToken) {
        setStatus({ type: 'error', message: "Session expired." });
        setLoading(false);
        return;
    }

    try {
        const dobDate = dob ? new Date(dob) : null;
        const response = await changeUserInfo(name, gender, user.accessToken, dobDate as any);

        if (!response.success) {
            throw new Error(response.message || "Update failed");
        }

        setStatus({ type: 'success', message: "Information updated successfully!" });

        // IMPORTANT UPDATE: Push full new information into Global Context
        if (user) {
            const updatedUser = {
                ...user,
                displayName: name,
                gender: gender,
                userDob: dob, // Ensure new dob value is saved
            };
            login(updatedUser); 
        }

        if (onSubmit) onSubmit(); // Call callback so parent (AccountPage) can refresh if needed
        setTimeout(() => setStatus(null), 3000);

    } catch (err) {
        setStatus({ type: 'error', message: err instanceof Error ? err.message : "An error occurred." });
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {status && <StatusAlert type={status.type} message={status.message} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
                <label className="block text-zinc-400 mb-2 text-sm font-medium">Email</label>
                <input type="email" value={email} disabled className="w-full bg-[#1f232b] border border-white/5 rounded-lg px-4 py-3 text-zinc-500 cursor-not-allowed" />
            </div>

            <div className="col-span-1 md:col-span-2">
                <label className="block text-zinc-400 mb-2 text-sm font-medium">Display Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-violet-600" />
            </div>

            <div className="col-span-1">
                 <label className="block text-zinc-400 mb-2 text-sm font-medium">Date of Birth</label>
                 <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white [color-scheme:dark]" />
            </div>

            <div className="col-span-1">
                 <label className="block text-zinc-400 mb-2 text-sm font-medium">Gender</label>
                 <div className="flex flex-wrap items-center h-[50px]"> 
                    <RadioInput value="male" label="Male" currentGender={gender} onChange={setGender} />
                    <RadioInput value="female" label="Female" currentGender={gender} onChange={setGender} />
                    <RadioInput value="other" label="Other" currentGender={gender} onChange={setGender} />
                 </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
             <button type="button" className="text-zinc-500 hover:text-violet-500 text-sm" onClick={() => setShowModal(true)}>Change Password?</button>
             <button type="submit" disabled={loading} className="w-full sm:w-auto bg-violet-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-violet-700 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
             </button>
        </div>
        <ChangePasswordModal open={showModal} onClose={() => setShowModal(false)} />
    </form>
  );
}