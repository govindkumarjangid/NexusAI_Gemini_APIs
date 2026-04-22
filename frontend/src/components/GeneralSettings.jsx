import { useState } from "react";
import useAuthStore from '../store/useAuthStore.js';

const ACCENT_COLORS = [
  { name: "Yellow", value: "yellow", color: "#FFD600" },
  { name: "Blue", value: "blue", color: "#2196F3" },
  { name: "Green", value: "green", color: "#4CAF50" },
  { name: "Purple", value: "purple", color: "#9C27B0" },
  { name: "Red", value: "red", color: "#F44336" },
  { name: "Orange", value: "orange", color: "#FF9800" },
  { name: "Pink", value: "pink", color: "#E91E63" },
  { name: "Teal", value: "teal", color: "#009688" },
];

export default function GeneralSettings() {
  
  const { theme, accentColor, contrast, setTheme, setAccentColor, setContrast } = useAuthStore();
  const [language, setLanguage] = useState("auto");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4">General Settings</h2>
      {/* Appearance */}
      <div className="flex items-center justify-between">
        <span className="dark:text-gray-300 text-gray-700">Appearance</span>
        <select
          className="dark:bg-[#292929] bg-gray-100 dark:text-white text-gray-900 rounded-full px-3 py-2 outline-none border dark:border-transparent border-gray-200"
          value={theme}
          onChange={e => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      {/* Contrast */}
      <div className="flex items-center justify-between">
        <span className="dark:text-gray-300 text-gray-700">Contrast</span>
        <select
          className="dark:bg-[#292929] bg-gray-100 dark:text-white text-gray-900 rounded-full px-3 py-2 outline-none border dark:border-transparent border-gray-200"
          value={contrast}
          onChange={e => setContrast(e.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="high">High</option>
          <option value="system">System</option>
        </select>
      </div>
      {/* Accent Color */}
      <div className="space-y-3">
        <span className="dark:text-gray-300 text-gray-700">Accent Color</span>
        <div className="flex items-center gap-2 flex-wrap">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.value}
              title={c.name}
              onClick={() => setAccentColor(c.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-110 ${
                accentColor === c.value
                  ? 'border-white dark:border-white scale-110 shadow-lg ring-2 ring-offset-2 dark:ring-offset-[#212121] ring-offset-white'
                  : 'border-transparent hover:border-gray-400'
              }`}
              style={{ 
                background: c.color,
                ringColor: c.color,
              }}
            />
          ))}
        </div>
      </div>
      {/* Language */}
      <div className="flex items-center justify-between">
        <span className="dark:text-gray-300 text-gray-700">Language</span>
        <select
          className="dark:bg-[#292929] bg-gray-100 dark:text-white text-gray-900 rounded-full px-3 py-2 outline-none border dark:border-transparent border-gray-200"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="auto">Auto-detect</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </div>
    </div>
  );
}
