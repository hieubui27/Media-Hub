import { useState } from "react";
import ChangePasswordModal from "../common/ChangePasswordModal";

interface AccountFormProps {
  email: string;
  displayName: string;
  userGender: string; // Expected values: "male", "female", "other"
  onSubmit?: (data: { displayName: string; gender: string }) => void;
}

// Separated RadioInput component for cleanliness
const RadioInput = ({ 
  value, 
  label, 
  currentGender, 
  onChange 
}: { 
  value: string; 
  label: string; 
  currentGender: string; 
  onChange: (value: string) => void 
}) => (
  <label className="flex items-center cursor-pointer select-none">
    <input
      type="radio"
      name="gender"
      value={value}
      // Exact comparison to decide checked state
      checked={currentGender === value} 
      onChange={() => onChange(value)}
      className="hidden"
    />
    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 transition-colors ${currentGender === value ? 'border-blue-600' : 'border-gray-600'}`}>
      {currentGender === value && <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>}
    </span>
    {label}
  </label>
);

export default function AccountForm({ email, displayName, userGender, onSubmit }: AccountFormProps) {
  const [name, setName] = useState(displayName);
  const [gender, setGender] = useState(userGender || "other");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ displayName: name, gender });
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    // Password change logic here (API call)
    // For now, we resolve immediately as a placeholder
    return Promise.resolve();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            disabled 
            className="w-full bg-[#1f232b] border border-[#353a45] rounded-lg px-4 py-3 focus:outline-none text-gray-400 cursor-not-allowed" 
          />
        </div>

        <div className="mb-6">
          <label htmlFor="displayName" className="block text-gray-400 mb-2">Display Name</label>
          <input 
            type="text" 
            id="displayName" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full bg-[#1f232b] border border-[#353a45] rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 text-white" 
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-400 mb-2">Gender</label>
          <div className="flex items-center space-x-6 text-gray-300">
            <RadioInput 
              value="male" 
              label="Male" 
              currentGender={gender} 
              onChange={setGender} 
            />
            <RadioInput 
              value="female" 
              label="Female" 
              currentGender={gender} 
              onChange={setGender} 
            />
            <RadioInput 
              value="other" 
              label="Other" 
              currentGender={gender} 
              onChange={setGender} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update
        </button>

        <p className="text-gray-400 mt-8">
          To change password, click <button type="button" className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer" onClick={() => setShowModal(true)}>here</button>
        </p>
      </form>
      
      <ChangePasswordModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onSubmit={handleChangePassword} 
      />
    </>
  );
}