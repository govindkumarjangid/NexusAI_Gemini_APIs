import { useState } from "react";
import useAuthStore from '../../store/useAuthStore.js';

const ACCENT_COLORS = [
  { name: "Blue", value: "blue", color: "#2196F3" },
  { name: "Yellow", value: "yellow", color: "#FFD600" },
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
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>General Settings</h2>

      {/* Appearance */}
      <div className="flex items-center justify-between">
        <span style={{ color: 'var(--text-secondary)' }}>Appearance</span>
        <select
          className="rounded-full px-3 py-2 outline-none border text-sm cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
          }}
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
        <span style={{ color: 'var(--text-secondary)' }}>Contrast</span>
        <select
          className="rounded-full px-3 py-2 outline-none border text-sm cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
          }}
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
        <span style={{ color: 'var(--text-secondary)' }}>Accent Color</span>
        <div className="flex items-center gap-3 flex-wrap mt-4">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.value}
              title={c.name}
              onClick={() => setAccentColor(c.value)}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-110 ${accentColor === c.value
                  ? 'scale-110 shadow-lg ring-2 ring-offset-2 ring-offset-(--bg-panel)'
                  : 'border-transparent hover:border-gray-400'
                }`}
              style={{
                background: c.color,
                borderColor: accentColor === c.value ? 'var(--text-primary)' : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="flex items-center justify-between">
        <span style={{ color: 'var(--text-secondary)' }}>Language</span>
        <select
          className="rounded-full px-3 py-2 outline-none border text-sm cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
          }}
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
