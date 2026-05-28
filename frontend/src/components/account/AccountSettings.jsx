import { useState, useRef, useEffect } from "react";
import { Trash2, Loader } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 639px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
}

const mobileVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 260 } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

const desktopVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 24, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: -8, transition: { type: 'spring', damping: 24, stiffness: 300 } },
};

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
                <>
                    {isMobile && (
                        <motion.div
                            key="delete-backdrop"
                            className="fixed inset-0 z-50 bg-black/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            onClick={handleBackdropClick}
                        />
                    )}
                    <motion.div
                        key="delete-dialog"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={isMobile ? mobileVariants : desktopVariants}
                        className={`fixed z-60 ${isMobile ? 'bottom-0 left-0 right-0 rounded-t-3xl' : 'inset-0 flex items-center justify-center'}`}
                        onClick={isMobile ? undefined : handleBackdropClick}
                    >
                        <motion.div
                            ref={dialogRef}
                            className={`${isMobile ? 'w-full rounded-t-3xl' : 'sm:max-w-sm w-full sm:rounded-3xl'} p-8 pb-10 sm:pb-8 shadow-2xl border bg-(--bg-panel) border-(--border-color)`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Mobile handle */}
                            {isMobile && (
                                <div className="flex justify-center pb-3">
                                    <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)" />
                                </div>
                            )}

                            <h3 className="text-lg font-semibold mb-3 text-(--text-primary) text-center">
                                Delete Account?
                            </h3>
                            <p className="mb-6 text-sm wrap-break-word line-clamp-1 text-(--text-secondary) text-center">
                                This action cannot be undone. All your chats will be permanently deleted.
                            </p>
                            <input
                                name="password"
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-full text-sm outline-none transition-all duration-200 border focus:ring-3 bg-(--bg-elevated) border-(--border-color) text-(--text-primary) focus:border-(--accent-color) ring-[color-mix(in_srgb,var(--accent-color)_30%,transparent)] mb-6"
                            />
                            <div className="flex justify-center gap-3">
                                <button
                                    className="px-5 py-2 rounded-full transition-colors cursor-pointer bg-(--bg-elevated) text-(--text-primary) hover:bg-(--bg-hover) text-sm"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-5 py-2 rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer active:scale-95 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                    disabled={isLoading || !password}
                                    onClick={handleDeleteAccount}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2 justify-center">
                                            <Loader
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
                            {isMobile && <div className="pb-safe h-4" />}
                        </motion.div>
                    </motion.div>
                </>
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
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, filter: "blur(5px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                className="space-y-6 rounded-2xl p-2">
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
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer active:scale-98 hover:opacity-90"
                        onClick={onOpenDeleteConfirm}
                    >
                        <Trash2 size={18} /> Delete Account
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
