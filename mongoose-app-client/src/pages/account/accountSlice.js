import { createAsyncThunk, createSelector, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const ServerPort = process.env.REACT_APP_SERVER_PORT;
const ServerURL = process.env.REACT_APP_SERVER_URL;
const ServerURI = `${ServerURL}:${ServerPort}`;

const accountAdapter = createEntityAdapter();

const initialState = accountAdapter.getInitialState({
    status: 'guest',
    _id: null,
    username: null,
    email: null,
});

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        updateAccount(state, action) {
            const userInfo = action.payload;
            const { _id, username, email } = userInfo;
            state.status = 'member';
            state._id = _id;
            state.username = username;
            state.email = email;
        }
    },
    extraReducers: builder => {
        builder
            /* Login */
            .addCase(fetchLoginAccount.fulfilled, (state, action) => {
                const session = JSON.parse(action.payload.session);
                const { _id, username, email } = session.userInfo;
                state.status = 'member';
                state._id = _id;
                state.username = username;
                state.email = email;
            })
            .addCase(fetchLoginAccount.rejected, (state, action) => {
            })
            /* Logout */
            .addCase(fetchLogoutAccount.fulfilled, (state, action) => {
                state.status = 'guest';
                state._id = state.username = state.email = null;
            })
    }
})

export default accountSlice.reducer;
export const { updateAccount } = accountSlice.actions;

/**
 *      THUNK
 */

export const fetchLoginAccount = createAsyncThunk('account/fetchLoginAccount', async (formData, thunkAPI) => {
    try {
        console.log("login in here");
        const response = await axios.post(`${ServerURI}/auth/login`, formData, {
            withCredentials: true /** withCredential automatically setCookie(uniqueSessionID, "some string value") */
        });
        if (response.status === 200) {
            return response.data;
        }
    }
    catch (err) {
        console.log("fetchLoginAccount asyncThunk error", err.response.data)
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const fetchLogoutAccount = createAsyncThunk('account/fetchLogoutAccount', async (thunkAPI) => {
    try {
        const response = await axios.post(`${ServerURI}/auth/logout`, {}, {
            withCredentials: true,
        });
        console.log("fetchLogoutAccount asyncThunk response", response);
        if (response.status === 200) {
            return {};
        }
    }
    catch (err) {
        console.log("fetchLogoutAccount asyncThunk error", err.response.data)
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

