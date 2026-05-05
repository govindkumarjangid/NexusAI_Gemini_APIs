const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-base">
    <div
      className="flex flex-col items-center gap-4"
    >
      <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      <p className="text-sm font-semibold text-muted tracking-widest uppercase">NexusAI</p>
    </div>
  </div>
);

export default PageLoader;
