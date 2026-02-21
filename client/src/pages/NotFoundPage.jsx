function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative z-10 overflow-hidden select-none">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:32px_32px] mix-blend-overlay z-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-highlight/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                <div className="mx-auto h-24 w-24 text-highlight mb-6 drop-shadow-[0_0_15px_rgba(234,0,0,0.5)]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-full h-full animate-bounce"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                    </svg>
                </div>

                <div className="relative">
                    <h1 className="text-[12rem] leading-none font-black text-white/5 opacity-50 tracking-tighter drop-shadow-[0_0_100px_rgba(255,255,255,0.05)]">
                        404
                    </h1>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
                        <h2 className="text-4xl font-medium text-white tracking-wide">
                            Page not found
                        </h2>
                        <div className="h-1 w-12 bg-highlight mt-6 rounded-full shadow-glow"></div>
                        <p className="mt-6 text-sm text-white/50 max-w-sm mx-auto font-light leading-relaxed">
                            We couldn't find the page you're looking for. It might have been
                            removed, renamed, or temporarily unavailable.
                        </p>
                    </div>
                </div>

                <div className="mt-16 flex flex-col sm:flex-row gap-5 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="group inline-flex items-center justify-center px-6 py-4 border border-white/20 text-xs font-bold uppercase tracking-widest rounded-xl text-white bg-white/5 hover:bg-white/10 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95"
                    >
                        <svg
                            className="mr-3 -ml-1 h-5 w-5 text-white/40 group-hover:-translate-x-1 transition-transform"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />
                        </svg>
                        Go Back
                    </button>

                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-xs font-bold uppercase tracking-widest rounded-xl text-white bg-highlight hover:bg-red-700 transition-all shadow-glow hover:shadow-glow-strong active:scale-95"
                    >
                        Take me home
                    </a>
                </div>
            </div>

            <div className="mt-20 text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <p className="text-sm text-white/30 font-light">
                    Need help?{" "}
                    <a href="#" className="text-highlight hover:text-red-500 font-bold uppercase tracking-widest text-[10px] ml-2 transition-colors">
                        Contact Support
                    </a>
                </p>
            </div>
        </div>
    );
}

export default NotFound;
