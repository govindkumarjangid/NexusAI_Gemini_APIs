import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';

const ImagePreviewModal = ({ selectedImage, setSelectedImage, isMobile }) => {

    const handleDownload = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `nexusai-image-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(imageUrl, '_blank');
        }
    };

    return (
        <AnimatePresence>
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`fixed inset-0 z-9999 flex ${isMobile ? 'items-end' : 'items-center'} justify-center bg-black/40 sm:backdrop-blur-sm p-0 sm:p-10`}
                    onClick={() => setSelectedImage(null)}
                >
                    {/* Modal Panel */}
                    <motion.div
                        initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.98 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", damping: 35, stiffness: 300 }}
                        className={`relative z-1000 ${isMobile
                            ? "w-full rounded-t-3xl bg-(--bg-surface) px-4 pb-safe"
                            : "max-w-3xl w-full p-0"
                            } flex flex-col items-center justify-center gap-4 sm:gap-6 shadow-2xl overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile Handle */}
                        {isMobile && (
                            <div className="flex justify-center pt-4 pb-2 w-full">
                                <div className="w-10 h-1 rounded-full opacity-30 bg-(--text-primary)" />
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            className={`absolute ${isMobile ? 'hidden' : 'top-2 right-2'} p-1.5 bg-accent text-white rounded-full transition-all duration-200 cursor-pointer active:scale-95 shadow-lg z-99`}
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={isMobile ? 20 : 24} />
                        </button>


                        {/* Image Container */}
                        <div className={`relative group overflow-hidden rounded-3xl shadow-2xl border border-white/10 w-full flex justify-center`}>
                            <motion.img
                                src={selectedImage}
                                alt="Full size preview"
                                className={`object-cover ${isMobile ? 'max-h-[60vh] rounded-3xl max-w-full' : 'min-w-full max-h-[80vh] h-full'}`}
                            />
                        </div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`flex items-center gap-3 bg-white/10 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-xl ${isMobile ? 'bg-(--bg-accent)/50' : ''}`}
                        >
                            <button
                                onClick={() => handleDownload(selectedImage)}
                                className="flex items-center gap-2 text-(--text-primary) sm:text-white hover:text-accent transition-colors px-3 py-1.5 cursor-pointer hover:bg-(--accent-color)/20 rounded-full"
                                title="Download Image"
                            >
                                <Download size={18} />
                                <span className="text-sm font-medium">Download</span>
                            </button>
                            <div className="w-px h-6 bg-white/20" />
                            <button
                                onClick={() => window.open(selectedImage, '_blank')}
                                className="flex items-center gap-2 text-(--text-primary) sm:text-white hover:text-accent transition-colors px-3 py-1.5 rounded-full cursor-pointer hover:bg-(--accent-color)/20"
                                title="Open Original"
                            >
                                <ExternalLink size={18} />
                                <span className="text-sm font-medium">Original</span>
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImagePreviewModal;
