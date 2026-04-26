import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-(--bg-base) text-(--text-primary) p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-accent to-(--accent-color)/50 mb-4 select-none">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">Oops! Page not found</h2>
                    <p className="text-(--text-secondary) mb-10 text-lg leading-relaxed">
                        The page you are looking for doesn't exist or has been moved to another galaxy.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-(--border-color) bg-(--bg-elevated) hover:bg-(--bg-accent) transition-all duration-300 font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                            <ArrowLeft size={20} />
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-accent text-accent-contrast shadow-xl shadow-accent/20 hover:brightness-110 transition-all duration-300 font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                            <Home size={20} />
                            Home Page
                        </button>
                    </div>
                </motion.div>

                {/* Subtle decorative stars/dots */}
                <div className="mt-16 flex justify-center gap-2">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                            className="w-1.5 h-1.5 rounded-full bg-accent"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
