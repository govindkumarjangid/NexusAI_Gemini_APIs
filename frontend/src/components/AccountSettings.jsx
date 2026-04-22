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
        <div className="space-y-6 dark:bg-transparent bg-white rounded-2xl p-2">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4">Account</h2>
            <div className="flex items-center justify-between">
                <span className="dark:text-gray-300 text-gray-700">Name</span>
                <span className="dark:text-white text-gray-900">{mockUser.name}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="dark:text-gray-300 text-gray-700">Email</span>
                <span className="dark:text-white text-gray-900">{mockUser.email}</span>
            </div>
            <div className="flex items-center justify-between border-b dark:border-gray-600/40 border-gray-200 pb-6">
                <span className="dark:text-gray-300 text-gray-700">Last Updated</span>
                <span className="dark:text-white text-gray-900">{mockUser.lastUpdated}</span>
            </div>
            <div className="pt-4">
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors cursor-pointer"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    <Trash2 size={18} /> Delete Account
                </button>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm">
                    <div className="dark:bg-[#232323] bg-white rounded-xl p-8 shadow-xl w-full max-w-xl text-center">
                        <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">
                            Are you sure you want to delete your account?
                        </h3>
                        <p className="dark:text-gray-400 text-gray-600 mb-6">
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-6 py-2 rounded-full dark:bg-gray-700 bg-gray-200 dark:text-gray-200 text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 font-semibold cursor-pointer"
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
