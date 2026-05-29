import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image, FolderUp, Mic, Plus, ArrowUp, X, Loader, Sparkles } from 'lucide-react';
import axiosInstance from '../../configs/axiosInstance';
import { toast } from 'react-hot-toast';

const ChatInputArea = ({
    handleSendMessage,
    inputText,
    setInputText,
    isStreaming,
    imagePreview,
    setImagePreview,
    isUploading,
    setIsUploading,
    uploadedImageUrl,
    setUploadedImageUrl,
    isImageMode,
    setIsImageMode
}) => {

    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    const textareaRef = useRef(null);
    const menuRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);
    const preVoiceTextRef = useRef("");

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
            recognitionRef.current.onresult = (event) => {
                let currentTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                const baseText = preVoiceTextRef.current;
                setInputText(baseText + (baseText.trim() ? " " : "") + currentTranscript);
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                }
            };
        }

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target))
                setIsAddMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (recognitionRef.current) {
                preVoiceTextRef.current = inputText;
                recognitionRef.current.start();
                setIsAddMenuOpen(false);
            } else {
                toast.error("Your browser does not support voice input. Please use Chrome.");
            }
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
        setIsAddMenuOpen(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        const localPreview = URL.createObjectURL(file);
        setImagePreview(localPreview);
        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axiosInstance.post('/messages/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadedImageUrl(response.data.url);
            console.log(response.data.url)
            setIsUploading(false);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Image upload failed");
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setUploadedImageUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = (e) => {
        if (!inputText.trim() && !uploadedImageUrl) return;
        handleSendMessage(e, uploadedImageUrl);
        handleRemoveImage();
        if (textareaRef.current)
            textareaRef.current.style.height = 'auto';
    };


    return (
        <>
            <div className="shrink-0 w-full px-3 sm:px-4">
                <div className="w-full max-w-4xl mx-auto">
                    <form
                        onSubmit={onSubmit}
                        className="flex flex-col rounded-3xl px-2 py-2 shadow-sm transition-all bg-(--bg-panel) border-(--border-color)"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />

                        {imagePreview && (
                            <div className="relative inline-block w-fit px-3 pt-2">
                                <div className="relative group">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className={`h-24 w-24 object-cover rounded-2xl border border-(--border-color) ${isUploading ? 'opacity-50' : ''}`}
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader className="animate-spin text-accent" size={24} />
                                        </div>
                                    )}
                                    {!isUploading && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-1 right-1 p-1 bg-gray-900/80 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg cursor-pointer"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {isImageMode && (
                            <div className="px-4 pt-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--accent-color)/10 border border-(--accent-color)/20 w-fit">
                                    <Sparkles size={14} className="text-(--accent-color)" />
                                    <span className="text-xs font-semibold text-(--accent-color)">Image Generation Mode</span>
                                    <button
                                        type="button"
                                        onClick={() => setIsImageMode(false)}
                                        className="p-0.5 hover:bg-(--accent-color)/20 rounded-full transition-colors cursor-pointer"
                                    >
                                        <X size={12} className="text-(--accent-color)" />
                                    </button>
                                </div>
                            </div>
                        )}

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
                            placeholder={isImageMode ? "Describe the image you want to generate..." : "Ask NexusAI anything..."}
                            className="w-full max-h-40 sm:max-h-62.5 min-h-12.5 bg-transparent px-3 sm:px-4 py-3 focus:outline-none resize-none overflow-y-auto custom-scrollbar rounded-2xl text-(--text-primary)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    onSubmit(e);
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
                                        <>
                                            {/* Mobile Backdrop */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 bg-black/30  z-40 sm:hidden"
                                                onClick={() => setIsAddMenuOpen(false)}
                                            />

                                            <motion.div
                                                initial={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{
                                                    y: 0,
                                                    scale: 1,
                                                    opacity: 1,
                                                    transition: isMobile
                                                        ? { type: "spring", damping: 28, stiffness: 260 }
                                                        : { type: "spring", damping: 22, stiffness: 280 }
                                                }}
                                                exit={isMobile
                                                    ? { y: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
                                                    : { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" } }
                                                }
                                                className="fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-full sm:left-0 mb-0 sm:mb-3 w-full sm:w-48 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-50 p-4 sm:p-2 text-sm font-semibold border-t sm:border bg-(--bg-panel) border-(--border-color) space-y-1"
                                            >
                                                {/* Mobile Handle */}
                                                {
                                                    isMobile && (
                                                        <div className="flex justify-center my-2 pb-1">
                                                            <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)" />
                                                        </div>
                                                    )
                                                }

                                                <button
                                                    type="button"
                                                    onClick={handleImageClick}
                                                    className="w-full flex items-center gap-3 px-4 py-3.5 sm:py-2.5 text-sm dark:text-gray-200 text-gray-700 dark:hover:bg-(--bg-hover) hover:bg-gray-100 transition-colors text-left rounded-2xl cursor-pointer"
                                                >
                                                    <Image size={18} className="dark:text-gray-400 text-gray-500" />
                                                    <span>Upload Image</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={toggleListening}
                                                    className="w-full flex items-center gap-3 px-4 py-3.5 sm:py-2.5 text-sm dark:text-gray-200 text-gray-700 dark:hover:bg-(--bg-hover) hover:bg-gray-100 transition-colors text-left rounded-2xl cursor-pointer"
                                                >
                                                    <Mic size={18} className="dark:text-gray-400 text-gray-500" />
                                                    <span>Voice Input</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsImageMode(true);
                                                        setIsAddMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3.5 sm:py-2.5 text-sm dark:text-gray-200 text-gray-700 dark:hover:bg-(--bg-hover) hover:bg-gray-100 transition-colors text-left rounded-2xl cursor-pointer"
                                                >
                                                    <Sparkles size={18} className="text-purple-400" />
                                                    <span>Generate Image</span>
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    disabled={(!inputText.trim() && !uploadedImageUrl) || isStreaming || isUploading}
                                    className="p-2.5 bg-accent disabled:opacity-40 text-accent-contrast rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95"
                                >
                                    {isStreaming ? (
                                        <Loader size={20} className="animate-spin" />
                                    ) : (
                                        <ArrowUp size={20} />
                                    )}
                                </button>
                            </div>

                        </div>
                    </form>

                    <p className="text-center text-[10px] py-1 text-(--text-muted)">
                        NexusAI is AI and can make mistakes.
                    </p>
                </div>
            </div>

            {/* Voice Listening UI Overlay */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10000 flex items-end sm:items-center justify-center bg-black/30 p-0 sm:p-4"
                        onClick={toggleListening}
                    >
                        <motion.div
                            initial={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
                            animate={{
                                y: 0,
                                scale: 1,
                                opacity: 1,
                                transition: isMobile
                                    ? { type: "spring", damping: 28, stiffness: 260 }
                                    : { type: "spring", damping: 22, stiffness: 280 }
                            }}
                            exit={isMobile
                                ? { y: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
                                : { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
                            }
                            className="bg-(--bg-surface) border-t sm:border border-(--border-color) rounded-t-3xl sm:rounded-4xl p-8 sm:p-10 flex flex-col items-center gap-6 sm:gap-8 shadow-2xl max-w-lg w-full mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Mobile Handle */}
                            {
                                !isMobile && (
                                    <div className="flex justify-center -mt-3 pb-1">
                                        <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)" />
                                    </div>
                                )
                            }
                            {/* Pulsing Mic Animation */}
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-(--accent-color)/20 rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                    className="absolute inset-0 bg-(--accent-color)/30 rounded-full"
                                />
                                <div className="relative bg-(--accent-color) text-(--accent-color-contrast) p-6 rounded-full shadow-lg shadow-(--accent-color)/40">
                                    <Mic size={30} strokeWidth={2.5} />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-(--text-primary)">Listening...</h3>
                                <p className="text-(--text-muted) text-xs px-4">Speak clearly, NexusAI is transcribing your voice in real-time.</p>
                            </div>

                            {/* Live Text Preview */}
                            <div className="w-full min-h-20 max-h-37.5 overflow-y-auto bg-black/5 dark:bg-white/5 rounded-3xl p-4 border border-(--border-color) text-base italic text-(--text-secondary) text-center">
                                {inputText.replace(preVoiceTextRef.current, "").trim() || "Waiting for audio..."}
                            </div>

                            <button
                                onClick={toggleListening}
                                className="w-fit sm:w-auto bg-(--accent-color) text-(--accent-color-contrast) px-6 py-3 rounded-full font-bold transition-all active:scale-95 shadow-lg shadow-(--accent-color)/20 cursor-pointer text-sm sm:text-md"
                            >
                                Stop Recording
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ChatInputArea;