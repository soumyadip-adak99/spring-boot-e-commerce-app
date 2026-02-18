import { BASE_API } from "../../utils/constants";

export const searchProducts = async (keyword) => {
    try {
        const response = await fetch(`${BASE_API}/public/search?keyword=${encodeURIComponent(keyword)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to search products");
        }

        const data = await response.json();
        return data.data; // Assuming API returns { data: [...] }
    } catch (error) {
        throw error;
    }
};
