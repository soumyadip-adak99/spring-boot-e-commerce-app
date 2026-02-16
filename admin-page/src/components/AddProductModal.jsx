import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../app/actions/productActions";

function AddProductModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const { isLoading } = useSelector((state) => state.product || { isLoading: false });
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        productName: "",
        product_description: "",
        price: "",
        category: "",
        status: "IN_STOCK",
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    if (!isOpen) return null;

    const resetForm = () => {
        setFormData({
            productName: "",
            product_description: "",
            price: "",
            category: "",
            status: "IN_STOCK",
        });
        setImageFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            if (!imageFile) {
                alert("Please upload a product image.");
                return;
            }

            const data = new FormData();
            data.append("product_name", formData.productName);
            data.append("product_description", formData.product_description);
            data.append("price", formData.price);
            data.append("category", formData.category);
            data.append("status", formData.status);
            data.append("image", imageFile);

            console.log("📦 Form Data Entries:");
            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
            }

            const result = await dispatch(addProduct(data));

            if (result.meta.requestStatus === "fulfilled") {
                alert("Product added successfully!");
                resetForm();
                onClose();
            } else {
                alert(`Error: ${result.payload}`);
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong on server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="product_description"
                            value={formData.product_description}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 border rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="IN_STOCK">In Stock</option>
                            <option value="OUT_OF_STOCK">Out of Stock</option>
                            <option value="COMING_SOON">Coming Soon</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            required
                            className="w-full mt-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {preview && (
                            <div className="mt-3">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-md border"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 text-white rounded-md transition-colors ${
                                loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Adding..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;
