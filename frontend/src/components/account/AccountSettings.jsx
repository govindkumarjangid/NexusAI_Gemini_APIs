import { useState, useRef } from "react";
import { Trash2, LoaderIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
    return isMobile;
}

export function DeleteConfirmDialog({ open, onClose }) {
    const [password, setPassword] = useState('');
    const { deleteAccount, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const dialogRef = useRef(null);

    const handleDeleteAccount = async () => {
        if (!password) return toast.error('Please enter your password');
        onClose();
        await deleteAccount({ password, navigate });
    }

    const handleBackdropClick = (e) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target))
            onClose();
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/40"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        ref={dialogRef}
                        initial={{ y: 20, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="rounded-t-3xl sm:rounded-2xl p-8 pb-10 sm:pb-8 shadow-2xl w-full sm:max-w-sm text-center border bg-(--bg-panel) border-(--border-color)"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-3 text-(--text-primary)">
                            Delete Account?
                        </h3>
                        <p className="mb-6 text-sm wrap-break-word line-clamp-1 text-(--text-secondary)">
                            This action cannot be undone. All your chats will be permanently deleted.
                        </p>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border focus:ring-3 bg-(--bg-elevated) border-(--border-color) text-(--text-primary) focus:border-(--accent-color) ring-[color-mix(in_srgb,var(--accent-color)_30%,transparent)] mb-6"
                        />
                        <div className="flex justify-center gap-3">
                            <button
                                className="px-6 py-2 rounded-full transition-colors cursor-pointer bg-(--bg-elevated) text-(--text-primary) hover:bg-(--bg-hover)"
                                onClick={onClose}
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
                                            className="animate-spin text-white"
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
    );
}

export default function AccountSettings({ onOpenDeleteConfirm }) {
    const { user } = useAuthStore();

    const mockUser = {
        name: user?.name || "Govind Kumar Jangid",
        email: user?.email || "govindkumarjangid17@gmail.com",
        lastLogin: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never",
    }

    return (
        <div className="space-y-6 rounded-2xl p-2">
            <h2 className="text-xl font-semibold mb-4 text-(--text-primary)">Account</h2>
            <div className="flex items-center justify-between">
                <span className="text-(--text-secondary)">Name</span>
                <span className="text-(--text-primary)">{mockUser.name}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-(--text-secondary)">Email</span>
                <span className="text-(--text-primary)">{mockUser.email}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-6 border-(--border-color)">
                <span className="text-(--text-secondary)">Last Login</span>
                <span className="text-(--text-primary)">{mockUser.lastLogin}</span>
            </div>
            <div className="pt-4">
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer active:scale-95 hover:opacity-90"
                    onClick={onOpenDeleteConfirm}
                >
                    <Trash2 size={18} /> Delete Account
                </button>
            </div>
        </div>
    );
}
