import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image, FolderUp, Mic, Plus, ArrowUp } from 'lucide-react';

const ChatInputArea = ({ handleSendMessage, inputText, setInputText, isStreaming }) => {

    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

    const textareaRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target))
                setIsAddMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div className="shrink-0 w-full px-3 sm:px-4 py-3">
            <div className="w-full max-w-4xl mx-auto">
                <form
                    onSubmit={handleSendMessage}
                    className="flex flex-col rounded-3xl px-2 py-2 shadow-sm transition-all border-2"
                    style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-color)',
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        rows="1"
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        disabled={isStreaming}
                        placeholder="Ask NexusAI anything..."
                        className="w-full max-h-40 sm:max-h-62.5 min-h-12.5 bg-transparent px-3 sm:px-4 py-3 focus:outline-none resize-none overflow-y-auto custom-scrollbar rounded-2xl"
                        style={{ color: 'var(--text-primary)' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />

                    <div className="flex items-center justify-between mt-1 px-2 pb-1 relative">
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                disabled={isStreaming}
                                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                                className={`p-2 rounded-full transition-colors ${isAddMenuOpen ? 'dark:bg-gray-800 bg-gray-200 dark:text-gray-200 text-gray-700' : 'dark:hover:bg-gray-800 hover:bg-gray-200 dark:text-gray-400 text-gray-500'}`}
                            >
                                <Plus size={22} className={`transition-transform duration-200 active:scale-95 cursor-pointer ${isAddMenuOpen ? 'rotate-45' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isAddMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-0 mb-3 w-48 rounded-2xl shadow-xl overflow-hidden z-50 p-2 text-sm font-semibold border"
                                        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
                                    >
                                        <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm dark:text-gray-200 text-gray-700 dark:hover:bg-[#3f4145] hover:bg-gray-100 transition-colors text-left rounded-xl cursor-pointer">
                                            <Image size={18} className="dark:text-gray-400 text-gray-500" />
                                            <span>Upload Image</span>
                                        </button>
                                        <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm dark:text-gray-200 text-gray-700 dark:hover:bg-[#3f4145] hover:bg-gray-100 transition-colors text-left rounded-xl cursor-pointer">
                                            <FolderUp size={18} className="dark:text-gray-400 text-gray-500" />
                                            <span>Upload File</span>
                                        </button>
                                        <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm dark:text-gray-200 text-gray-700 dark:hover:bg-[#3f4145] hover:bg-gray-100 transition-colors text-left border-t dark:border-gray-700/50 border-gray-200 mt-1 pt-3 rounded-xl cursor-pointer">
                                            <Mic size={18} className="dark:text-gray-400 text-gray-500" />
                                            <span>Voice Input</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isStreaming}
                                className="p-2.5 bg-accent disabled:opacity-40 text-accent-contrast rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95"
                            >
                                <ArrowUp size={20} />
                            </button>
                        </div>
                    </div>
                </form>

                <p className="text-center text-[10px] py-1" style={{ color: 'var(--text-muted)' }}>
                    NexusAI may produce inaccurate information about people, places, or facts.
                </p>
            </div>
        </div>
    );
};

export default ChatInputArea;
