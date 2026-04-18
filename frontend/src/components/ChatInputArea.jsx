import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image, FolderUp, Mic, Plus, ArrowUp } from 'lucide-react';

const ChatInputArea = ({ handleSendMessage }) => {

    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [inputText, setInputText] = useState("");

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
        <div className="px-2 sm:px-4 shrink-0 w-full max-w-4xl mx-auto bg-transparent sm:mb-0 mb-1 rounded-3xl">
            <form
                onSubmit={handleSendMessage}
                className="flex flex-col border border-gray-700/60 rounded-3xl px-2 py-2 shadow-sm focus-within:border-gray-600 transition-all"
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
                    placeholder="Ask NexusAI anything..."
                    className="w-full max-h-40 sm:max-h-62.5 min-h-12.5 bg-transparent  text-gray-100 placeholder-gray-500 px-3 sm:px-4 py-3 focus:outline-none resize-none overflow-y-auto custom-scrollbar rounded-2xl"
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
                            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                            className={`p-2 rounded-full transition-colors ${isAddMenuOpen ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 text-gray-400'}`}
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
                                    className="absolute bottom-full left-0 mb-3 w-48 bg-[#2d2f31] border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden z-50 p-2 text-sm font-semibold"
                                >
                                    <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-[#3f4145] transition-colors text-left rounded-xl cursor-pointer">
                                        <Image size={18} className="text-gray-400" />
                                        <span>Upload Image</span>
                                    </button>
                                    <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-[#3f4145] transition-colors text-left rounded-xl cursor-pointer">
                                        <FolderUp size={18} className="text-gray-400" />
                                        <span>Upload File</span>
                                    </button>
                                    <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-[#3f4145] transition-colors text-left border-t border-gray-700/50 mt-1 pt-3 rounded-xl cursor-pointer">
                                        <Mic size={18} className="text-gray-400" />
                                        <span>Voice Input</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="p-2.5 bg-[#2563eb] hover:bg-blue-500 disabled:bg-[#2d2f31] disabled:text-gray-500 text-white rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95"
                        >
                            <ArrowUp size={20} />
                        </button>
                    </div>
                </div>
            </form>

            <p className="text-center text-[10px] text-gray-500 py-1">
                NexusAI may produce inaccurate information about people, places, or facts.
            </p>
        </div>
    );
};

export default ChatInputArea;
