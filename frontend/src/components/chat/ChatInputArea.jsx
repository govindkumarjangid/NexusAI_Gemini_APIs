import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image, FolderUp, Mic, Plus, ArrowUp, X, Loader2 } from 'lucide-react';
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
    setUploadedImageUrl
}) => {

    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

    const textareaRef = useRef(null);
    const menuRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target))
                setIsAddMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleImageClick = () => {
        fileInputRef.current?.click();
        setIsAddMenuOpen(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        // Show local preview immediately
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
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };


    return (
        <div className="shrink-0 w-full px-3 sm:px-4 py-3">
            <div className="w-full max-w-4xl mx-auto">
                <form
                    onSubmit={onSubmit}
                    className="flex flex-col rounded-3xl px-2 py-2 shadow-sm transition-all border-2 bg-(--bg-surface) border-(--border-color)"
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
                                    className={`h-24 w-24 object-cover rounded-xl border border-(--border-color) ${isUploading ? 'opacity-50' : ''}`}
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-accent" size={24} />
                                    </div>
                                )}
                                {!isUploading && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 p-1 bg-gray-900/80 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
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
                        placeholder="Ask NexusAI anything..."
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
                                    <motion.div
                                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-0 mb-3 w-48 rounded-2xl shadow-xl overflow-hidden z-50 p-2 text-sm font-semibold border bg-(--bg-elevated) border-(--border-color)"
                                    >
                                        <button
                                            type="button"
                                            onClick={handleImageClick}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm dark:text-gray-200 text-gray-700 dark:hover:bg-[#3f4145] hover:bg-gray-100 transition-colors text-left rounded-xl cursor-pointer"
                                        >
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
                                disabled={(!inputText.trim() && !uploadedImageUrl) || isStreaming || isUploading}
                                className="p-2.5 bg-accent disabled:opacity-40 text-accent-contrast rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95"
                            >
                                <ArrowUp size={20} />
                            </button>
                        </div>
                    </div>
                </form>

                <p className="text-center text-[10px] py-1 text-(--text-muted)">
                    NexusAI may produce inaccurate information about people, places, or facts.
                </p>
            </div>
        </div>
    );
};

export default ChatInputArea;
