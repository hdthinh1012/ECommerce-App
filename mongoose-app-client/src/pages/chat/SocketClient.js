import { io } from "socket.io-client";
import { initiateEventListeners } from "./chatSlice";

const ServerURI = process.env.REACT_APP_SERVER_URL;

export const createSocket = (cookies) => {
    const socket = io(`${ServerURI}`, {
        autoConnect: false,
        withCredentials: true,
    })

    const accountInfo = cookies['accountInfo'];
    socket.auth = {
        uniqueSessionID: cookies['uniqueSessionID'],
        userId: accountInfo._id,
    };
    return socket;
}

export class SocketClient {
    constructor(cookies, dispatch) {
        this.socket = createSocket(cookies);
        dispatch(initiateEventListeners(this.socket));
    }

    connect() {
        this.socket.connect();
        return new Promise((resolve, reject) => {
            this.socket.on("connect", () => {
                resolve();
            })
            this.socket.on("connect_error", (error) => {
                reject(error);
            })
        })
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            try {
                this.socket.disconnect();
                resolve();
            }
            catch (error) {
                reject({ message: "Error in socket.disconnect()", error })
            }
        })
    }

    emit(event, data) {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject("No socket connection")
            }
            this.socket.emit(event, data, (response) => {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve();
                }
            })
        })
    }


    on(event, handler) {
        return new Promise((resolve, reject) => {
            if (!this.socket) { return reject("No socket connection") }

            this.socket.on(event, handler);
            resolve();
        })
    }
}
