import { Settings, User } from "lucide-react";

export default function SettingsSidebar({ tab, setTab }) {
  const tabs = [
    { id: "general", label: "General", icon: <Settings size={18} /> },
    { id: "account", label: "Account", icon: <User size={18} /> },
  ];

  return (
    <nav
      className="flex flex-col w-40 py-6 px-3 border-r h-107 overflow-hidden shrink-0 border-(--border-color)"
    >
      {tabs.map(t => (
        <button
          key={t.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-full mb-2 cursor-pointer transition-colors text-sm font-medium hover:bg-(--bg-elevated) ${tab === t.id
              ? 'bg-(--bg-elevated) text-(--text-primary)'
              : 'bg-transparent text-(--text-secondary)'
            }`}
          onClick={() => setTab(t.id)}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </nav>
  );
}
