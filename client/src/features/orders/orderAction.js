import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/constants";

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async ({ id, orderData }, { dispatch, rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate payment delay
            
            const userId = localStorage.getItem("loggedInUserId");
            if (!userId) {
                return rejectWithValue("Unauthorized: User missing");
            }
            
            let users = JSON.parse(localStorage.getItem("demo_users")) || [];
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                return rejectWithValue("User not found");
            }
            
            const newOrder = {
                orderId: `OD${Math.floor(Math.random() * 10000000000)}`,
                ...orderData,
                status: "processing",
                date: new Date().toISOString()
            };
            
            users[userIndex].orders = users[userIndex].orders || [];
            users[userIndex].orders.push(newOrder);
            
            localStorage.setItem("demo_users", JSON.stringify(users));
            dispatch(getUserDetails());
            
            return newOrder;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const createOrderFromCart = createAsyncThunk(
    "order/createOrderFromCart",
    async (orderData, { dispatch, rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate payment delay
            
            const userId = localStorage.getItem("loggedInUserId");
            if (!userId) {
                return rejectWithValue("Unauthorized: User missing");
            }
            
            let users = JSON.parse(localStorage.getItem("demo_users")) || [];
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                return rejectWithValue("User not found");
            }
            
            const newOrder = {
                orderId: `OD${Math.floor(Math.random() * 10000000000)}`,
                ...orderData,
                status: "processing",
                date: new Date().toISOString()
            };
            
            users[userIndex].orders = users[userIndex].orders || [];
            users[userIndex].orders.push(newOrder);
            
            // Clear cart after checkout
            users[userIndex].cart_items = [];
            
            localStorage.setItem("demo_users", JSON.stringify(users));
            dispatch(getUserDetails());
            
            return newOrder;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);
