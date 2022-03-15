import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../pages/menu/menuSlice";
import cartReducer from "../pages/cart/cartSlice";
import accountSlice from "../pages/account/accountSlice";
import chatSlice from "../pages/chat/chatSlice";

const store = configureStore({
    reducer: {
        menu: menuReducer,
        cart: cartReducer,
        account: accountSlice,
        chat: chatSlice,
    },

})

export default store;