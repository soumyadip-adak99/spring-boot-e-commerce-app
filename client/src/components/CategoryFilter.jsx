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
        <div className="space-y-12">
            <div>
                <h3 className="museo-label text-white/40 tracking-widest mb-6">
                    CATEGORIES
                </h3>
                <div className="space-y-4">
                    {categories.map((cat) => (
                        <label
                            key={cat}
                            className="flex items-center gap-4 cursor-pointer group"
                        >
                            <div
                                className={`w-4 h-4 border transition-colors flex items-center justify-center ${
                                    selectedCategory === cat
                                        ? "border-[#ea0000] bg-[#ea0000]"
                                        : "border-white/20 group-hover:border-white/50"
                                }`}
                            >
                                {selectedCategory === cat && (
                                    <Check size={12} className="text-white" strokeWidth={3} />
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
                                className={`museo-label transition-colors ${
                                    selectedCategory === cat
                                        ? "text-white"
                                        : "text-white/50 group-hover:text-white"
                                }`}
                            >
                                {cat === "All" ? "ALL PRODUCTS" : cat.toUpperCase()}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="museo-label text-white/40 tracking-widest">
                        MAX VALUE
                    </h3>
                    <span className="museo-label text-white">
                        ₹{maxPrice.toLocaleString()}
                    </span>
                </div>

                <input
                    type="range"
                    min="0"
                    max={priceRange.max}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-[1px] bg-white/20 appearance-none cursor-pointer accent-[#ea0000] hover:accent-white focus:outline-none transition-all"
                />
                <div className="flex justify-between mt-4 museo-label text-white/30">
                    <span>₹0</span>
                    <span>₹{priceRange.max.toLocaleString()}+</span>
                </div>
            </div>

            <div className="mt-12 bg-[#0a0a0a] border border-white/5 p-8 text-center">
                <h4 className="museo-headline text-lg mb-2 text-white">Need Help?</h4>
                <p className="museo-body text-white/50 text-sm mb-6">
                    Our support team can help you find the perfect product.
                </p>
                <button className="w-full py-4 bg-white text-black museo-label hover:bg-[#ea0000] hover:text-white transition-colors">
                    CONTACT SUPPORT
                </button>
            </div>
        </div>
    );
}
