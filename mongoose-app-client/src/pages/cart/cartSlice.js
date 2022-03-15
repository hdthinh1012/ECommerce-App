import { createAsyncThunk, createSelector, createEntityAdapter, createSlice } from "@reduxjs/toolkit";


const cartAdapter = createEntityAdapter();

const initialState = cartAdapter.getInitialState({
    customerInfo: {},
    items: {},
    voucher: {},  // {by: 'amount' 'percent', value: '50%' '200'}
    totalCost: 0.0,
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        itemAdded(state, action) {
            const { itemId, items } = action.payload;
            if (itemId in state.items) {
                state.items[itemId].quantity += 1;
            }
            else {
                const newItem = { ...items[itemId], quantity: 1 };
                state.items[itemId] = newItem;
            }
            state.totalCost += state.items[itemId].price;
        }
    }
})

export const { itemAdded } = cartSlice.actions;

export default cartSlice.reducer;

/**
 *      THUNK
 */

export function addItemToCart(itemId) {
    console.log("Add item to cart thunk", itemId);
    return async function addItemToCartThunk(dispatch, getState) {
        const { menu } = getState();
        const { items } = menu;
        dispatch(cartSlice.actions.itemAdded({ itemId, items }));
    }
}