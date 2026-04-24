import React, { useState } from "react";
import Modal from "../model/Modal";
import GeneralSettings from "../account/GeneralSettings";
import AccountSettings from "../account/AccountSettings";
import { Settings, User } from "lucide-react";

const TABS = [
    { id: "general", label: "General", icon: <Settings size={16} /> },
    { id: "account", label: "Account", icon: <User size={16} /> },
];

export default function SettingsModal({ open, onClose }) {
    const [tab, setTab] = useState("general");

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)"/>
            </div>

            <div className="flex flex-col sm:flex-row sm:h-[480px]">
                <nav
                    className="flex flex-row sm:flex-col shrink-0 px-3 pt-2 pb-2 sm:py-6 sm:px-3 sm:w-44 gap-1 sm:gap-2 border-b sm:border-b-0 sm:border-r overflow-x-auto border-(--border-color)"
                >
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 hover:opacity-80"
                            style={{
                                backgroundColor: tab === t.id ? 'var(--bg-elevated)' : 'transparent',
                                color: tab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                            }}
                        >
                            {t.icon}
                            <span>{t.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Content area */}
                <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
                    {tab === "general" && <GeneralSettings />}
                    {tab === "account" && <AccountSettings />}
                </div>

            </div>
        </Modal>
    );
}