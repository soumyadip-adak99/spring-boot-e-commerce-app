import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <svg
                        className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                        fill="currentColor"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon points="50,0 100,0 50,100 0,100" />
                    </svg>
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                                New Collection
                            </div>

                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block">Elevate your style</span>
                                <span className="block text-indigo-600">redefine comfort</span>
                            </h1>

                            <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Discover our latest premium streetwear collection, crafted with
                                sustainable materials and built for the modern urban explorer.
                                Comfort and quality that truly stand out.
                            </p>

                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <Link
                                        to="/products"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent
                                        text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                                        md:py-4 md:text-lg transition-all"
                                    >
                                        Shop Collection
                                    </Link>
                                </div>
                                {/* <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <a
                                        href="#"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300
                                        text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                                        md:py-4 md:text-lg transition-all"
                                    >
                                        <PlayCircle className="w-5 h-5 mr-2 text-gray-400" />
                                        Watch Video
                                    </a>
                                </div> */}
                            </div>
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                                <div className="flex -space-x-2 overflow-hidden">
                                    {[1, 2, 3, 4].map((num) => (
                                        <img
                                            key={num}
                                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                                            src={`https://randomuser.me/api/portraits/men/${
                                                num + 30
                                            }.jpg`}
                                            alt="Customer avatar"
                                            loading="lazy"
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center">
                                    <div className="flex text-yellow-400 mr-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                    <span className="font-semibold text-gray-900">4.9/5</span>
                                    <span className="mx-1">from</span>
                                    <span className="font-semibold text-gray-900">2k+ reviews</span>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1350&q=80"
                    alt="Model showcasing premium streetwear collection"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-r from-white to-transparent lg:via-white/20 lg:to-transparent"></div>
            </div>
        </div>
    );
}
