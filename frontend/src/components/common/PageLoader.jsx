import { Loader } from 'lucide-react';

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-base">
    <div
      className="flex flex-col items-center gap-4"
    >
      <Loader className="w-16 h-16 text-accent animate-spin" />
      <p className="text-sm font-semibold text-muted tracking-widest uppercase">NexusAI</p>
    </div>
  </div>
);

export default PageLoader;
