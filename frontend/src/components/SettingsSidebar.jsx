import React from "react";
import { Settings, User } from "lucide-react";

export default function SettingsSidebar({ tab, setTab }) {
  return (
    <nav className="flex flex-col w-40 py-6 px-3 border-r dark:border-[#333] border-gray-200 h-100 overflow-hidden">
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full mb-2 cursor-pointer transition-colors ${
          tab === "general"
            ? "dark:bg-[#292929] bg-gray-100 dark:text-white text-gray-900"
            : "dark:text-gray-400 text-gray-500 dark:hover:bg-[#232323] hover:bg-gray-100"
        }`}
        onClick={() => setTab("general")}
      >
        <Settings size={18} /> General
      </button>
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-colors ${
          tab === "account"
            ? "dark:bg-[#292929] bg-gray-100 dark:text-white text-gray-900"
            : "dark:text-gray-400 text-gray-500 dark:hover:bg-[#232323] hover:bg-gray-100"
        }`}
        onClick={() => setTab("account")}
      >
        <User size={18} /> Account
      </button>
    </nav>
  );
}
