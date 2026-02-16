import { Check } from "lucide-react";

export default function CategoryFilter({
    categories,
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    priceRange,
}) {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Categories
                </h3>
                <div className="space-y-1">
                    {["All", ...categories].map((cat) => (
                        <label
                            key={cat}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                                selectedCategory === cat ? "bg-indigo-50" : "hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`relative flex items-center justify-center w-5 h-5 rounded border ${
                                        selectedCategory === cat
                                            ? "bg-indigo-600 border-indigo-600"
                                            : "border-gray-300 bg-white"
                                    }`}
                                >
                                    {selectedCategory === cat && (
                                        <Check size={12} className="text-white" />
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    name="category"
                                    className="hidden"
                                    checked={selectedCategory === cat}
                                    onChange={() => setSelectedCategory(cat)}
                                />
                                <span
                                    className={`text-sm ${
                                        selectedCategory === cat
                                            ? "text-indigo-900 font-semibold"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {cat === "All" ? "All Products" : cat}
                                </span>
                            </div>
                            {selectedCategory === cat && (
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            )}
                        </label>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Max Price
                    </h3>
                    <span className="bg-gray-100 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                        ₹{maxPrice}
                    </span>
                </div>

                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max={priceRange.max}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    />
                </div>
                <div className="flex justify-between mt-3 text-xs font-medium text-gray-400">
                    <span>₹0</span>
                    <span>₹{priceRange.max}+</span>
                </div>
            </div>

            <div className="mt-8 bg-indigo-900 rounded-xl p-5 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="font-bold mb-1">Need Help?</h4>
                    <p className="text-indigo-200 text-xs mb-3">
                        Find the perfect product for your needs.
                    </p>
                    <button className="text-xs font-bold bg-white text-indigo-900 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                        Chat with Sales
                    </button>
                </div>

                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl"></div>
            </div>
        </div>
    );
}
