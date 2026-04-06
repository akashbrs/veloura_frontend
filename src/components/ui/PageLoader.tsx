

/**
 * Shared PageLoader component — matches auth page background
 */
const PageLoader = () => (
    <div className="min-h-screen flex justify-center items-center bg-[#f2f0ed]">
        <div className="w-8 h-8 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
    </div>
);

export default PageLoader;
