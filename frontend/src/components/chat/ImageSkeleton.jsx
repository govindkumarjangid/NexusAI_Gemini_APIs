import { Sparkles } from 'lucide-react';

const ImageSkeleton = () => (
    <div className="w-full max-w-75 aspect-square rounded-xl bg-(--accent-color)/10 dark:bg-(--accent-color)/15 animate-pulse flex flex-col items-center justify-center gap-3 border border-(--accent-color)/20 shadow-inner">
        <div className="relative">
            <Sparkles className="text-(--accent-color) animate-bounce" size={32} />
            <div className="absolute inset-0 bg-(--accent-color)/30 blur-2xl animate-pulse rounded-full" />
        </div>
        <p className="text-xs font-bold text-(--accent-color) uppercase tracking-widest animate-pulse text-center px-4">Creating Magic...</p>
    </div>
);

export default ImageSkeleton;
