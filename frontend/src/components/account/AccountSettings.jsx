import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function AccountSettings() {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const { deleteAccount, isLoading, user } = useAuthStore();
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (!password) return toast.error('Please enter your password');
        setShowDeleteConfirm(false);
        await deleteAccount({ password, navigate });
    }

    const mockUser = {
        name: user?.name || "Govind Kumar Jangid",
        email: user?.email || "govindkumarjangid17@gmail.com",
        lastLogin: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never",
    }

    return (
        <div className="space-y-6 rounded-2xl p-2">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Account</h2>
            <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Name</span>
                <span style={{ color: 'var(--text-primary)' }}>{mockUser.name}</span>
            </div>
            <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Email</span>
                <span style={{ color: 'var(--text-primary)' }}>{mockUser.email}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Last Login</span>
                <span style={{ color: 'var(--text-primary)' }}>{mockUser.lastLogin}</span>
            </div>
            <div className="pt-4">
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer active:scale-95 hover:opacity-90"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    <Trash2 size={18} /> Delete Account
                </button>
            </div>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-60 flex items-end sm:items-center justify-center backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="rounded-t-3xl sm:rounded-2xl p-8 pb-10 sm:pb-8 shadow-2xl w-full sm:max-w-sm text-center border"
                            style={{
                                backgroundColor: 'var(--bg-panel)',
                                borderColor: 'var(--border-color)',
                            }}
                        >
                            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                                Delete Account?
                            </h3>
                            <p className="mb-6 text-sm wrap-break-word line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                                This action cannot be undone. All your chats will be permanently deleted.
                            </p>
                            <input
                                name="password"
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full peer dark:bg-[#131314] bg-gray-50 border dark:border-gray-100/20 border-gray-300 dark:focus:border-gray-100/50 focus:border-gray-400 focus:ring-3 dark:focus:ring-gray-100/20 focus:ring-gray-200 rounded-lg py-2 px-4 outline-none dark:placeholder-gray-400 placeholder-gray-400 transition-colors duration-200 dark:text-gray-100 text-gray-900 mb-4"
                            />
                            <div className="flex justify-center gap-3">
                                <button
                                    className="px-6 py-2 rounded-full transition-colors cursor-pointer"
                                    style={{
                                        backgroundColor: 'var(--bg-elevated)',
                                        color: 'var(--text-primary)',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-6 py-2 rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer active:scale-95 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isLoading || !password}
                                    onClick={handleDeleteAccount}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2 justify-center">
                                            <LoaderIcon
                                                size={20}
                                                className="h-7 w-7 animate-spin text-white"
                                            />
                                            <span>Deleting...</span>
                                        </div>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
