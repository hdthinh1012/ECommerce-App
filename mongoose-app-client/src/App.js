import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import MenuPage from "./pages/menu/MenuPage";
import CartPage from "./pages/cart/CartPage";
import ChatPage from "./pages/chat/ChatPage";
import NavBar from "./navbar/NavBar";

import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import axios from "axios";

import { updateAccount } from "./pages/account/accountSlice";

const ServerURI = process.env.REACT_APP_SERVER_URL;

const App = () => {
  const [cookies, setCookie, getCookie] = useCookies(['accountInfo', 'uniqueSessionID']);
  const reduxAccountInfo = useSelector(state => state.account);
  const dispatch = useDispatch();
  /**
   * Why Effect here run many times ?
   */
  useEffect(() => {
    const fetchSessionData = async () => {
      const response = await axios.get(`${ServerURI}/session`, {
        withCredentials: true, /* If uniqueSessionID exist in cookies, send it or else send random non-exist sessionID */
      });
      const { sessionID, accountInfo } = response.data;
      if (sessionID && { ...accountInfo } !== { ...cookies["accountInfo"] }) {
        /**
         * setCookie will always trigger rerender despite the same cookies[accountInfo] values
         * { ...accountInfo } !== { ...cookies["accountInfo"] } after every setCookie despite same values
         * still need instruction about the update, trigger Effect flow
         */
        // setCookie("accountInfo", JSON.stringify(accountInfo.userInfo), { path: '/' });
        if (reduxAccountInfo.status === 'guest') {
          dispatch(updateAccount(accountInfo.userInfo));
        }
      } else {
        setCookie("accountInfo", null, { path: '/' });
        setCookie("uniqueSessionID", null, { path: '/' });
      }
    }
    fetchSessionData();
  });

  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
