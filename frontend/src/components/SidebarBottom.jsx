import { UserCircle, LogOut } from 'lucide-react';
import SidebarSettingsTrigger from './SidebarSettingsTrigger';

const SidebarBottom = ({ sidebarOpen, handleLogout }) => (
  <div className="p-3 border-t dark:border-gray-700/40 border-gray-200 space-y-1 shrink-0">
    <button className="w-full flex items-center rounded-full dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer transition-colors text-sm dark:text-gray-300 text-gray-600 h-11 overflow-hidden" title={!sidebarOpen ? "Profile Settings" : ""}>
      <div className="w-11 shrink-0 flex items-center justify-center">
        <UserCircle size={20} />
      </div>
      {sidebarOpen && <span className="whitespace-nowrap truncate pr-3">Profile Settings</span>}
    </button>
    <SidebarSettingsTrigger />
    <button
      onClick={handleLogout}
      className="w-full flex items-center rounded-full hover:bg-red-500/10 cursor-pointer hover:text-red-400 transition-colors text-sm dark:text-gray-300 text-gray-600 h-11 overflow-hidden"
      title={!sidebarOpen ? "Log out" : ""}
    >
      <div className="w-11 shrink-0 flex items-center justify-center">
        <LogOut size={20} />
      </div>
      {sidebarOpen && <span className="whitespace-nowrap truncate pr-3">Log out</span>}
    </button>
  </div>
);

export default SidebarBottom;
