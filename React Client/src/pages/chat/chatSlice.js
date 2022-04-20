import { createAsyncThunk, createSelector, createEntityAdapter, createSlice, useSelector, current } from "@reduxjs/toolkit";
import axios from "axios";

const ServerURI = process.env.REACT_APP_SERVER_URL;

const chatAdapter = createEntityAdapter();

const initialState = chatAdapter.getInitialState({
    status: "disconnected",
    chatSocketId: null,
    socketOwnerId: null,
    socketSessionId: null,
    onlineUsers: [],
    currentChatUser: null,
    allRelatedChatBox: [],
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

        /**
         * Must be called after initiateChatSocket action finished since socketOwnerId is necessary to 
         * remove chatbox with one person only
         */
        initiateCurrentOnlineUsers(state, action) {
            let onlineUsersList = action.payload.map(session => session.userInfo);

            /**
             * onlineUsersList not contain the socketOwnerId mean the user him/herself
             * so when there are no other online users, error not reading currentChatUser._id throw
             */

            onlineUsersList = onlineUsersList.filter(onlineUserItem => {
                return onlineUserItem._id !== current(state).socketOwnerId;
            });
            state.onlineUsers = onlineUsersList;

            /**
             * Test 
             */

            // state.currentChatUser = onlineUsersList[0];
        },
        initiateAllRelatedChatBox(state, action) {
            const allRelatedChatBox = action.payload;
            state.allRelatedChatBox = allRelatedChatBox;
        },
        addNewUserOnline(state, action) {
            const newUserInfo = action.payload;
            const isUserExisted = false;
            state.onlineUsers.forEach(user => {
                if (user._id === newUserInfo._id) {
                    isUserExisted = true;
                }
            })
            if (!isUserExisted) {
                state.onlineUsers.push(newUserInfo);
            }
        },
        removeNowOfflineUser(state, action) {
            const { userId } = action.payload;
            const newOnlineUsers = state.onlineUsers.filter(user => {
                return user._id !== userId;
            });
            state.onlineUsers = newOnlineUsers;
        },
        updateNewMessage(state, action) {
            const { fromId, toId, idlist, messageContent } = action.payload;
            const newMessage = { toId, fromId, messageContent };
            let newAllRelatedChatBox = [...current(state).allRelatedChatBox];
            newAllRelatedChatBox = newAllRelatedChatBox.map((chatBoxItem) => {
                if (JSON.stringify(chatBoxItem.idlist) === JSON.stringify(idlist)) {
                    console.log(newMessage);
                    let messages = [...chatBoxItem.messages];
                    messages.push(newMessage);
                    return {
                        ...chatBoxItem,
                        messages
                    };
                } else {
                    return chatBoxItem;
                }
            })
            state.allRelatedChatBox = [...newAllRelatedChatBox];
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
            .addCase(initiateChatSocket.rejected, (error) => {

            })

            .addCase(destroyChatSocket.fulfilled, (state, action) => {
                state.status = "disconnected";
                state.chatSocketId = null;
                state.socketOwnerId = null;
                state.socketSessionId = null;
            })

            .addCase(changeCurrentChatUser.fulfilled, (state, action) => {
                const { newChatUser, newChatBox } = action.payload;
                state.currentChatUser = newChatUser;
                let isChatBoxExisted = false;
                state.allRelatedChatBox.forEach(chatBoxItem => {
                    if (JSON.stringify(chatBoxItem.idlist) === JSON.stringify(newChatBox.idlist)) {
                        isChatBoxExisted = true;
                    }
                })
                if (!isChatBoxExisted) {
                    state.allRelatedChatBox.push(newChatBox);
                }
            })
    }
})

export const { onlineUsersChatSocketEvent, initiateCurrentOnlineUsers, initiateAllRelatedChatBox, addNewUserOnline, removeNowOfflineUser, updateNewMessage } = chatSlice.actions;
export default chatSlice.reducer;

/**
 *      THUNK
 */

/**
 * Is dispatch in line 57 ChatPage.js
 */
export const initiateChatSocket = createAsyncThunk('chat/initiateChatSocket', async (socket, thunkAPI) => {
    const { uniqueSessionId, userId } = socket.socket.auth;
    try {
        await socket.connect();
        console.log("initiateChatSocket");
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

/**
 * Is dispatch in line 27 SocketClient.js
 */
export const initiateEventListeners = createAsyncThunk('char/initiateEventListeners', async (socket, thunkAPI) => {
    console.log("Initiate Event Listener thunk called");

    await socket.on("current online users", ({ allSocketSession: onlineUsersSessionStore, allRelatedChatBox }) => {
        thunkAPI.dispatch(initiateCurrentOnlineUsers(onlineUsersSessionStore));
        thunkAPI.dispatch(initiateAllRelatedChatBox(allRelatedChatBox));
    })
    await socket.on("user connected", (userInfo) => {
        thunkAPI.dispatch(addNewUserOnline(userInfo));
    });
    await socket.on("user disconnected", (info) => {
        thunkAPI.dispatch(removeNowOfflineUser(info));
    })
    await socket.on("private message", (data) => {
        console.log("client receive private message event, info", data);
        thunkAPI.dispatch(updateNewMessage(data));
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
            return thunkAPI.rejectWithValue(error);
        }
    }
})

export const changeCurrentChatUser = createAsyncThunk('chat/changeCurrentChatUser', async ({ newChatUser, accountUser }, thunkAPI) => {
    try {
        const response = await axios.post(`${ServerURI}/chat/chatbox/get`, {
            idlist: [newChatUser._id, accountUser._id]
        }, {
            withCredentials: true
        });
        return {
            newChatUser,
            newChatBox: response.data
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const emitMessage = createAsyncThunk('chat/emitMessage', async ({ idlist, messageContent, fromId, toId, socket }, thunkAPI) => {
    try {
        await socket.emit('private message', {
            idlist, fromId, toId, messageContent
        });
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})