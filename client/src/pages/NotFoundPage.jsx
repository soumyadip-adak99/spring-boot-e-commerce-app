function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="mx-auto h-24 w-24 text-indigo-600 mb-6">
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

                <h1 className="text-9xl font-black text-indigo-100 tracking-tighter select-none">
                    404
                </h1>

                <div className="relative -mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
                        Page not found
                    </h2>
                    <p className="mt-4 text-base text-gray-500">
                        Sorry, we couldn't find the page you're looking for. It might have been
                        removed, renamed, or doesn't exist.
                    </p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                    >
                        <svg
                            className="mr-2 -ml-1 h-5 w-5 text-gray-500"
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
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                    >
                        Take me home
                    </a>
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-sm text-gray-400">
                    Need help?{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                        Contact Support
                    </a>
                </p>
            </div>
        </div>
    );
}

export default NotFound;
