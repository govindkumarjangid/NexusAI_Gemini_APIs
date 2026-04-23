import React, { useState } from "react";
import SettingsModal from "../SettingsModal";
import { Settings } from "lucide-react";

export default function SidebarSettingsTrigger() {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            <button
                className="w-full flex items-center rounded-full dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer transition-colors text-sm dark:text-gray-300 text-gray-600 h-11 overflow-hidden"
                onClick={() => setShowSettings(true)}
            >
                <div className="w-11 shrink-0 flex items-center justify-center">
                    <Settings size={20} />
                </div>
                <span className="whitespace-nowrap truncate pr-3"> Preferences </span>
            </button>
            <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
        </>
    );
}
