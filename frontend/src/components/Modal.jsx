import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 639px)");
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return isMobile;
}

export default function Modal({ open, onClose, children }) {
    const modalRef = useRef();
    const isMobile = useIsMobile();

    useEffect(() => {
        function handleClickOutside(e) {
            if (open && modalRef.current && !modalRef.current.contains(e.target))
                onClose();
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const mobileVariants = {
        hidden:  { y: "100%", opacity: 0 },
        visible: { y: 0,      opacity: 1, transition: { type: "spring", damping: 28, stiffness: 260 } },
        exit:    { y: "100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
    };

    const desktopVariants = {
        hidden:  { opacity: 0, scale: 0.95, y: -8 },
        visible: { opacity: 1, scale: 1,    y: 0,  transition: { type: "spring", damping: 24, stiffness: 300 } },
        exit:    { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
    };

    const variants = isMobile ? mobileVariants : desktopVariants;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="modal-backdrop"
                        className="fixed inset-0 z-50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Modal panel */}
                    <div className={`fixed inset-0 z-50 flex ${isMobile ? "items-end" : "items-center"} justify-center ${isMobile ? "p-0" : "p-4"}`}>
                        <motion.div
                            key="modal-panel"
                            ref={modalRef}
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl border overflow-hidden flex flex-col"
                            style={{
                                backgroundColor: "var(--bg-panel)",
                                borderColor: "var(--border-color)",
                                color: "var(--text-primary)",
                                maxHeight: "92dvh",
                            }}
                        >
                            {/* Close button */}
                            <button
                                className="absolute top-3 right-3 z-10 cursor-pointer rounded-full transition-colors p-1.5"
                                style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--bg-hover)"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--bg-elevated)"}
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                            <div className="overflow-y-auto flex-1">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
