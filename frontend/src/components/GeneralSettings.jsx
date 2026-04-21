import React, { useState } from "react";

const ACCENT_COLORS = [
  { name: "Yellow", value: "yellow", color: "#FFD600" },
  { name: "Blue", value: "blue", color: "#2196F3" },
  { name: "Green", value: "green", color: "#4CAF50" },
];

export default function GeneralSettings() {
  const [appearance, setAppearance] = useState("dark");
  const [contrast, setContrast] = useState("system");
  const [accent, setAccent] = useState("yellow");
  const [language, setLanguage] = useState("auto");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
      {/* Appearance */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Appearance</span>
        <select
          className="bg-[#292929] text-white rounded-full px-3 py-2 outline-none"
          value={appearance}
          onChange={e => setAppearance(e.target.value)}
        >
          <option value="light" className="rounded-full">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      {/* Contrast */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Contrast</span>
        <select
          className="bg-[#292929] text-white rounded-full px-3 py-2 outline-none"
          value={contrast}
          onChange={e => setContrast(e.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="high">High</option>
          <option value="system">System</option>
        </select>
      </div>
      {/* Accent Color */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Accent Color</span>
        <div className="flex items-center gap-2">
          <select
            className="bg-[#292929] text-white rounded-full px-3 py-2 outline-none"
            value={accent}
            onChange={e => setAccent(e.target.value)}
          >
            {ACCENT_COLORS.map(c => (
              <option key={c.value} value={c.value}>
                {c.name}
              </option>
            ))}
          </select>
          <span
            className="inline-block w-4 h-4 rounded-full border border-gray-500"
            style={{ background: ACCENT_COLORS.find(c => c.value === accent)?.color }}
          />
        </div>
      </div>
      {/* Language */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Language</span>
        <select
          className="bg-[#292929] text-white rounded-full px-3 py-2 outline-none"
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
