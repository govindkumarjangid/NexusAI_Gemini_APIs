import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children }) {
    const modalRef = useRef();

    useEffect(() => {
        function handleClickOutside(e) {
            if (open && modalRef.current && !modalRef.current.contains(e.target))
                onClose();
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm transition-all">
            <div ref={modalRef} className="relative w-full max-w-2xl max-h-2/3 h-full rounded-2xl bg-[#212121] shadow-2xl transition-all duration-300">
                <button
                    className="absolute top-2 right-2 bg-[#2d2f31] hover:bg-[#383a3c] cursor-pointer rounded-full transition-colors text-gray-200 p-1"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={22} />
                </button>
                {children}
            </div>
        </div>
    );
}
