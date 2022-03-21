import { createAsyncThunk, createSelector, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const ServerURI = process.env.REACT_APP_SERVER_URL;

const menuAdapter = createEntityAdapter();

const initialState = menuAdapter.getInitialState({
    status: 'idle',
});

/**
 *      SLICE REDUCER
 */

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    extraReducers: builder => {
        builder
            .addCase(fetchMenu.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                const newItems = {};
                action.payload.forEach(item => {
                    newItems[item._id] = item;
                })
                state.items = newItems;
                state.status = 'idle';
            })
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                const newCategories = {};
                action.payload.forEach(category => {
                    newCategories[category._id] = category;
                })
                state.categories = newCategories;
            })
    }
})

export default menuSlice.reducer;

/**
 *      THUNK
 */

export const fetchMenu = createAsyncThunk('menu/fetchMenu', async () => {
    const response = await axios.get(`${ServerURI}/funiture/all`, {
        withCredentials: true
    });
    if (response.status === 200) {
        //console.log(response.data.data);
        return response.data.data;
    }
})

export const fetchCategories = createAsyncThunk('menu/fetchCategories', async () => {
    const response = await axios.get(`${ServerURI}/category/all`, {
        withCredentials: true
    });
    if (response.status === 200) {
        //console.log(response.data.data);
        return response.data.data
    }
})

/**
 *      SELECTOR
 */

