import { memo } from 'react';
import { Check, Copy } from 'lucide-react';
import RenderMessage from '../../configs/renderMessageContent.jsx';
import ImageSkeleton from './ImageSkeleton';

const AssistantMessageItem = memo(({ msg, isDark, setSelectedImage, handleCopy, copiedId, idx }) => {
    if (msg.isGeneratingImage && !msg.imageUrl) {
        return (
            <div className="min-w-0 transition-all duration-300 text-(--text-primary) px-4 py-3 sm:px-6 sm:py-4 rounded-3xl rounded-tl-sm leading-relaxed w-full">
                <ImageSkeleton />
            </div>
        );
    }
    const hasImage = !!(msg.imageUrl || msg.image || msg.isGeneratingImage);

    return (
        <div
            className={`min-w-0 transition-all duration-300 px-4 py-3 sm:px-6 sm:py-4 ${hasImage ? 'w-fit max-w-70 sm:max-w-75' : 'w-full'}`}
        >

            <div className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words w-full overflow-hidden">
                {(msg.imageUrl || msg.image) && (
                    <div className="mb-2 w-full overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-700/50 bg-black/5 dark:bg-white/5 p-1 group relative">
                        <img
                            src={msg.imageUrl || msg.image}
                            alt="Uploaded content"
                            className="max-h-65 w-full rounded-lg object-cover cursor-pointer opacity-0 transition-all duration-300 ease-in hover:brightness-90"
                            onClick={() => setSelectedImage(msg.imageUrl || msg.image)}
                            onLoad={(e) => e.target.classList.replace('opacity-0', 'opacity-100')}
                        />
                    </div>
                )}

                <>
                    <RenderMessage content={msg?.content} isDark={isDark} />
                </>

                {msg.role === 'assistant' && msg.content && (
                    <div className="mt-2 flex items-center gap-2">
                        <button
                            onClick={() => handleCopy(msg.content, msg._id || idx)}
                            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                            title="Copy response"
                        >
                            {copiedId === (msg._id || idx) ? (
                                <>
                                    <Check size={14} className="text-green-500" />
                                    <span className="text-green-500">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

export default AssistantMessageItem;
