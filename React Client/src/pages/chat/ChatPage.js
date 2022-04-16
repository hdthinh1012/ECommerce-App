import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { SocketClient } from "./SocketClient";
import { initiateChatSocket, destroyChatSocket, changeCurrentChatUser, emitMessage } from "./chatSlice";

import { IoMdSend } from "react-icons/io";
import { IconContext } from "react-icons";
import "./ChatPage.css";

let socket = {};

const ChatPage = (props) => {
    const [cookies] = useCookies(['accountInfo', 'uniqueSessionID']);
    const dispatch = useDispatch();
    const accountUser = useSelector(state => state.account);
    const isAccountLoggedIn = accountUser["status"] === "member";

    const chatPageData = useSelector(state => state.chat);
    const { onlineUsers, currentChatUser, allRelatedChatBox } = chatPageData;

    const messageList = [
        { id: "1", self: false, content: "Hello employee", time: "3:08PM 13th March 2022" },
        { id: "2", self: true, content: "What category would you like to know about ?", time: "3:10PM 13th March 2022" },
    ];
    let currentChatBox = null;
    allRelatedChatBox.forEach(chatBoxItem => {
        console.log("currentChatUser._id", currentChatUser);
        console.log("accountUser._id", accountUser);
        if (JSON.stringify(chatBoxItem.idlist) === JSON.stringify([currentChatUser._id, accountUser._id].sort())) {
            currentChatBox = chatBoxItem;
        }
    })

    /**
     * - Trulu create new socket: socket = io(...)
     * - Dispatch 'initiateEventListeners' event
     */

    const handleChangeChatUser = (newChatUser) => {
        dispatch(changeCurrentChatUser({ newChatUser, accountUser, socket }));
    }

    useEffect(() => {
        if (isAccountLoggedIn) {
            socket = new SocketClient(cookies, dispatch);

            /**
             * - Calling await socket.connect: this.socket.connect()
             */
            dispatch(initiateChatSocket(socket));
            return () => {
                dispatch(destroyChatSocket(socket))
            };
        }
    }, []);

    const handleMessageSend = async (event) => {
        event.preventDefault();
        const messageContent = event.target.message.value;
        const { currentChatUser } = chatPageData;
        let idlist = [currentChatUser._id, accountUser._id].sort();

        dispatch(emitMessage({
            fromId: accountUser._id,
            toId: currentChatUser._id,
            idlist, messageContent, socket
        }));
    }

    if (isAccountLoggedIn) {
        return (<div>
            <div className="chat-page-title">
                <div>Contact Support</div>
            </div>
            <div className="chat-page-wrapper">
                <div className="chat-page-user-list">
                    <div className="chat-page-search-user-bar">
                        <input type="text" className="chat-page-search-user-input" placeholder="Search Username" />
                    </div>
                    {onlineUsers.map(onlineUser => {
                        return (
                            <div key={onlineUser._id} onClick={() => handleChangeChatUser(onlineUser)} className="chat-user-item">
                                <div>{onlineUser.username} {onlineUser.username === accountUser.username ? "(You)" : ""}</div>
                                <div className="chat-user-status-active"></div>
                            </div>
                        )
                    })}

                </div>
                <div className="chat-page-message-box">
                    <div className="chat-page-user-avatar-bar">
                        <div className="chat-user-status-active"></div>
                        <div className="chat-user-avatar">
                            {chatPageData.currentChatUser ? (`${chatPageData.currentChatUser.username} ${chatPageData.currentChatUser.username === accountUser.username ? "(You)" : "Choose someone"}`) : ''}
                        </div>
                    </div>
                    <div className="chat-message-list">
                        {currentChatBox && currentChatBox.messages.map(messageItem => {
                            if (messageItem.fromId === accountUser._id) return (
                                <div key={messageItem._id} className="chat-message-line-self">
                                    <div className="chat-message-item-self">{messageItem.messageContent}</div>
                                    <div className="chat-message-item-time-self">{messageItem.time}</div>
                                </div>
                            )
                            return (
                                <div key={messageItem._id} className="chat-message-line-not-self">
                                    <div className="chat-message-item-not-self">{messageItem.messageContent}</div>
                                    <div className="chat-message-item-time-not-self">{messageItem.time}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="chat-input-div">
                        <form onSubmit={(event) => handleMessageSend(event)}>
                            <input type="text" name="message" className="chat-input-box" placeholder="Write your message" />
                        </form>
                        <IconContext.Provider value={{ className: "send-icon" }}>
                            <IoMdSend />
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
        </div >)
    }
    else {
        return <div className='pay-button'><h1>Please Login Before Contact Our Support</h1></div>
    }
}

export default ChatPage;