import React from "react";
import { Settings, User } from "lucide-react";

export default function SettingsSidebar({ tab, setTab }) {
  return (
    <nav className="flex flex-col w-40 py-6 px-3 border-r border-[#333] h-100 overflow-hidden">
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full mb-2 cursor-pointer transition-colors ${
          tab === "general"
            ? "bg-[#292929] text-white"
            : "text-gray-400 hover:bg-[#232323]"
        }`}
        onClick={() => setTab("general")}
      >
        <Settings size={18} /> General
      </button>
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-colors ${
          tab === "account"
            ? "bg-[#292929] text-white"
            : "text-gray-400 hover:bg-[#232323]"
        }`}
        onClick={() => setTab("account")}
      >
        <User size={18} /> Account
      </button>
    </nav>
  );
}
