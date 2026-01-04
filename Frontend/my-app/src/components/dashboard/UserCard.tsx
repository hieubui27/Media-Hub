import Image from "next/image";

interface UserCardProps {
  avatar: string;
  displayName: string;
  email: string;
}

export default function UserCard({ avatar, displayName, email }: UserCardProps) {
  return (
    <div className="flex flex-col items-center mb-6 p-4 bg-[#353a45] rounded-lg">
      <Image
        src={avatar}
        alt="User Avatar"
        width={80}
        height={80}
        className="rounded-full mb-3 border-2 border-violet-600"
      />
      <p className="font-semibold text-center">{displayName}</p>
      <p className="text-xs text-gray-400 text-center break-words">{email}</p>
    </div>
  );
}
