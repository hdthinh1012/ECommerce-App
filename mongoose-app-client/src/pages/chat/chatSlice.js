import { createAsyncThunk, createSelector, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const chatAdapter = createEntityAdapter();

const initialState = chatAdapter.getInitialState({
    status: "disconnected",
    chatSocketId: null,
    socketOwnerId: null,
    socketSessionId: null,
    currentUsers: [],
    allMessagesPerUsers: [],
});

/**
 *      SLICE REDUCER
 */

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        onlineUsersChatSocketEvent(state, action) {
            console.log("onlineUsersChatSocketEvent reducer action", action);
        },
        initiateCurrentOnlineUsers(state, action) {
            const currentUsersList = Object.values(action.payload).map(session => session.userInfo);
            state.currentUsers = currentUsersList;
        },
        addNewUserOnline(state, action) {
            const newUserInfo = action.payload;
            const isUserExisted = false;
            state.currentUsers.forEach(user => {
                if (user._id === newUserInfo._id) {
                    // console.log("addNewOnlineUser reducer: user already online");
                    isUserExisted = true;
                }
            })
            // console.log("addNewOnlineUser reducer: new user online", newUserInfo);
            if (!isUserExisted) {
                state.currentUsers.push(newUserInfo);
            }
        },
        removeNowOfflineUser(state, action) {
            const { userId } = action.payload;
            console.log("userId", userId);
            const newCurrentUsers = state.currentUsers.filter(user => {
                console.log("user._id", user._id);
                console.log("comparison", user._id !== userId);
                return user._id !== userId;
            });
            state.currentUsers = newCurrentUsers;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(initiateChatSocket.pending, (state, action) => {
                state.status = "connecting";
            })
            .addCase(initiateChatSocket.fulfilled, (state, action) => {
                state.status = "connected";
                state.chatSocketId = action.payload.chatSocketId;
                state.socketOwnerId = action.payload.socketOwnerId;
                state.socketSessionId = action.payload.socketSessionId;
            })

            .addCase(initiateEventListeners.fulfilled, (state, action) => {
                console.log("All socket event listeners registered reducer.fulfilled");
            })

            .addCase(destroyChatSocket.fulfilled, (state, action) => {
                console.log("destroyChatSocket.fulfilled reducer", action);
                state.status = "disconnected";
                state.chatSocketId = null;
                state.socketOwnerId = null;
                state.socketSessionId = null;
            })
            .addCase(destroyChatSocket.rejected, (state, action) => {
                console.log("destroyChatSocket.rejected reducer", action);
            })
    }
})

export const { onlineUsersChatSocketEvent, initiateCurrentOnlineUsers, addNewUserOnline, removeNowOfflineUser } = chatSlice.actions;
export default chatSlice.reducer;

/**
 *      THUNK
 */

export const initiateChatSocket = createAsyncThunk('chat/initiateChatSocket', async (socket, thunkAPI) => {
    const { uniqueSessionId, userId } = socket.socket.auth;
    try {
        await socket.connect();
        return { chatSocketId: socket.id, socketOwnerId: userId, socketSessionId: uniqueSessionId };
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

/**
 * The initiate event listener for the socket socket.on("event", ...)
 * must be initated even before connect to server socket.connect()
 * Since if register listener only after client event socket.on("connect")
 * means the events emitted from server in the first connection will be ignored
 * because no event listener registered yet, the client socket have just connected 
 */
export const initiateEventListeners = createAsyncThunk('char/initiateEventListeners', async (socket, thunkAPI) => {
    await socket.on("current online users", (onlineUsersSessionStore) => {
        console.log("response 1");
        console.log("initiateEventListeners redux Middleware Thunk eventListener onlineCurrentUsers", onlineUsersSessionStore);
        thunkAPI.dispatch(initiateCurrentOnlineUsers(onlineUsersSessionStore));
    })
    /**
     * Register more event listener with await socket.on(...) below here
     */
    await socket.on("user connected", (userInfo) => {
        thunkAPI.dispatch(addNewUserOnline(userInfo));
    });
    await socket.on("user disconnected", (info) => {
        thunkAPI.dispatch(removeNowOfflineUser(info));
    })

    return;
})

export const destroyChatSocket = createAsyncThunk('chat/destroyChatSocket', async (socket, thunkAPI) => {
    console.log("destroyChatSocket Thunk socket.socket", socket.socket);
    if (!socket.socket.connected) {
        return thunkAPI.rejectWithValue({ message: 'Socket has disconnected already' });
    } else {
        try {
            await socket.disconnect();
            return {};
        }
        catch (error) {
            console.log("destroyChatSocket Thunk socket.socket disconnect error", error);
            return thunkAPI.rejectWithValue(error);
        }
    }
})