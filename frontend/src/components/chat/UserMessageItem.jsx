import { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Check, Copy } from 'lucide-react';

const UserMessageItem = memo(({ msg, setSelectedImage, handleCopy, copiedId, idx }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);
    const [shouldShowExpand, setShouldShowExpand] = useState(false);

    useEffect(() => {
        if (contentRef.current) {
            const isLong = contentRef.current.scrollHeight > 100;
            setShouldShowExpand(isLong);
        }
    }, [msg.content]);

    const hasImage = !!(msg.imageUrl || msg.image);

    return (
        <div
            className={`group relative bg-accent text-accent-contrast rounded-3xl rounded-tr-sm px-4 py-2 sm:px-5 shadow-lg w-fit self-end transition-all duration-300 ${hasImage ? 'max-w-70 sm:max-w-75' : 'max-w-[95%] sm:max-w-[85%] md:max-w-[70%]'}`}
        >

            <div className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words w-full relative">
                {(msg.imageUrl || msg.image) && (
                    <div className="mb-2 w-full overflow-hidden rounded-2xl border border-white/20 bg-black/10 p-1 group relative">
                        <img
                            src={msg.imageUrl || msg.image}
                            alt="User upload"
                            className="max-h-65 w-full rounded-2xl object-cover cursor-pointer hover:brightness-110 transition-all"
                            onClick={() => setSelectedImage(msg.imageUrl || msg.image)}
                        />
                    </div>
                )}

                <motion.div
                    animate={{ height: isExpanded || !shouldShowExpand ? 'auto' : 100 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="overflow-hidden relative"
                >
                    <div
                        ref={contentRef}
                        className={`transition-all duration-300 ${!isExpanded && shouldShowExpand ? 'line-clamp-4' : ''}`}
                    >
                        {msg.content || msg.text}
                    </div>
                </motion.div>


                {shouldShowExpand && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 flex items-center gap-1 text-[11px] font-bold opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp size={14} />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown size={14} />
                                Read More
                            </>
                        )}
                    </button>
                )}

            </div>

            {/* Copy button */}
            <button
                onClick={() => handleCopy(msg.content || msg.text, msg._id || idx)}
                className="absolute right-full mr-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-sm transition-all duration-200 cursor-pointer border border-white/10"
                title="Copy message"
            >
                {copiedId === (msg._id || idx) ? (
                    <Check size={14} className="text-green-400" />
                ) : (
                    <Copy size={14} className="text-white/70" />
                )}
            </button>
        </div>
    );
});

export default UserMessageItem;
