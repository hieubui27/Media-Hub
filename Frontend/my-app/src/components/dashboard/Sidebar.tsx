"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/src/contexts/UserContext";
import UserCard from "./UserCard";

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout, isLoading } = useUser();

  const navItems = [
    { href: "/dashboard/history", label: "History", icon: RewindIcon },
    { href: "/dashboard/account", label: "Account", icon: UserIcon },
  ];

  return (
    <aside className="bg-[#1f232b] text-white w-72 min-h-screen p-6 flex flex-col justify-between rounded-2xl">
      <div>
        <h1 className="text-2xl font-bold mb-8">Account management</h1>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center py-3 px-4 my-1 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-600"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div>
        {isLoading ? (
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-700 animate-pulse mb-4"></div>
            <div className="w-full text-center">
              <div className="h-4 bg-gray-700 rounded w-24 mb-2 animate-pulse mx-auto"></div>
              <div className="h-3 bg-gray-700 rounded w-32 animate-pulse mx-auto"></div>
            </div>
          </div>
        ) : user ? (
          <UserCard
            avatar={user.avatar}
            displayName={user.displayName}
            email={user.email}
          />
        ) : null}
        <button
          onClick={logout}
          className="flex items-center justify-center py-2 px-4 w-full rounded-lg hover:bg-red-600 transition-colors text-left bg-gray-700"
        >
          <LogoutIcon className="w-5 h-5 mr-3" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

const Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    {props.children}
  </svg>
);

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
    />
  </Icon>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </Icon>
);
const RewindIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
    />
  </Icon>
);
const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </Icon>
);
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </Icon>
);
const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </Icon>
);

export default Sidebar;
