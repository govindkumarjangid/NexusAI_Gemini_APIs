import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const user = JSON.parse(localStorage.getItem("user")) || null;

const mockUser = {
    name: user?.name || "Govind Kumar Jangid",
    email: user?.email || "govindkumarjangid17@gmail.com",
    lastUpdated: "2026-04-21 14:32",
};

export default function AccountSettings() {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    function handleDeleteAccount() {
        setShowDeleteConfirm(false);
        alert("Account deleted (mock)!");
        // Place real delete logic here
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
                <span style={{ color: 'var(--text-secondary)' }}>Last Updated</span>
                <span style={{ color: 'var(--text-primary)' }}>{mockUser.lastUpdated}</span>
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
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm">
                    <div
                        className="rounded-2xl p-8 shadow-2xl w-full max-w-sm text-center border"
                        style={{
                            backgroundColor: 'var(--bg-panel)',
                            borderColor: 'var(--border-color)',
                        }}
                    >
                        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                            Delete Account?
                        </h3>
                        <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            This action cannot be undone. All your chats will be permanently deleted.
                        </p>
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
                                className="px-6 py-2 rounded-full bg-accent text-accent-contrast font-semibold transition-all cursor-pointer active:scale-95 hover:opacity-90"
                                onClick={handleDeleteAccount}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
