import { UserCircle, LogOut } from 'lucide-react';
import SidebarSettingsTrigger from './SidebarSettingsTrigger';

const SidebarBottom = ({ sidebarOpen, handleLogout }) => (
  <div className="p-3 border-t space-y-1 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
    <button
      className="w-full flex items-center rounded-full cursor-pointer transition-colors text-sm h-11 overflow-hidden hover:opacity-80"
      style={{ color: 'var(--text-secondary)' }}
      title={!sidebarOpen ? "Profile Settings" : ""}
    >
      <div className="w-11 shrink-0 flex items-center justify-center"><UserCircle size={20} /></div>
      {sidebarOpen && <span className="whitespace-nowrap truncate pr-3">Profile Settings</span>}
    </button>
    <SidebarSettingsTrigger />
    <button
      onClick={handleLogout}
      className="w-full flex items-center rounded-full hover:bg-red-500/10 cursor-pointer hover:text-red-400 transition-colors text-sm h-11 overflow-hidden"
      style={{ color: 'var(--text-secondary)' }}
      title={!sidebarOpen ? "Log out" : ""}
    >
      <div className="w-11 shrink-0 flex items-center justify-center"><LogOut size={20} /></div>
      {sidebarOpen && <span className="whitespace-nowrap truncate pr-3">Log out</span>}
    </button>
  </div>
);

export default SidebarBottom;
