import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { SocketClient } from "./SocketClient";
import { initiateChatSocket, destroyChatSocket } from "./chatSlice";

import { IoMdSend } from "react-icons/io";
import { IconContext } from "react-icons";
import "./ChatPage.css";

const ChatPage = (props) => {
    const [cookies] = useCookies(['accountInfo', 'uniqueSessionID']);
    const dispatch = useDispatch();
    const accountInfo = useSelector(state => state.account);
    const chatSlice = useSelector(state => state.chat);
    const isAccountLoggedIn = accountInfo["status"] === "member";
    const nameList = [{ id: "1", name: "hdthinh01" }, { id: "2", name: "thinh.huynhduc1012" }, { id: "3", name: "hdthinh02" }];
    const messageList = [
        { id: "1", self: false, content: "Hello employee", time: "3:08PM 13th March 2022" },
        { id: "2", self: true, content: "What category would you like to know about ?", time: "3:10PM 13th March 2022" },
        { id: "3", self: false, content: "Hello employee", time: "3:08PM 13th March 2022" },
        { id: "4", self: true, content: "What category would you like to know about ?", time: "3:10PM 13th March 2022" },
    ];

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        const socket = new SocketClient(cookies, dispatch);
        if (isAccountLoggedIn) {
            dispatch(initiateChatSocket(socket));
            console.log("ChatPage useEffect chatSlice.status", chatSlice.status);
            return () => {
                console.log("useEffect unsubscibe socket");
                dispatch(destroyChatSocket(socket))
            };
        }
    }, []);

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
                    {nameList.map(nameItem => {
                        return (
                            <div key={nameItem.id} className="chat-user-item">
                                <div>{nameItem.name}</div>
                                <div className="chat-user-status-active"></div>
                            </div>
                        )
                    })}
                    <div className="chat-user-item chat-user-item-active">
                        <div>YourSelf</div>
                        <div className="chat-user-status-active"></div>
                    </div>

                </div>
                <div className="chat-page-message-box">
                    <div className="chat-page-user-avatar-bar">
                        <div className="chat-user-status-active"></div>
                        <div className="chat-user-avatar">
                            YourSelf
                        </div>
                    </div>
                    <div className="chat-message-list">
                        {messageList.map(messageItem => {
                            if (messageItem.self) return (
                                <div key={messageItem.id} className="chat-message-line-self">
                                    <div className="chat-message-item-self">{messageItem.content}</div>
                                    <div className="chat-message-item-time-self">{messageItem.time}</div>
                                </div>
                            )
                            return (
                                <div key={messageItem.id} className="chat-message-line-not-self">
                                    <div className="chat-message-item-not-self">{messageItem.content}</div>
                                    <div className="chat-message-item-time-not-self">{messageItem.time}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="chat-input-div">
                        <input type="text" className="chat-input-box" placeholder="Write your message" />
                        <IconContext.Provider value={{ className: "send-icon" }}>
                            <IoMdSend />
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
        </div>)
    }
    else {
        return <div className='pay-button'><h1>Please Login Before Contact Our Support</h1></div>
    }
}

export default ChatPage;