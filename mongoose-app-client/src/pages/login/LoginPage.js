import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { Cookies, useCookies } from 'react-cookie';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLoginAccount } from '../account/accountSlice';

import "./LoginPage.css"

const ServerURI = process.env.REACT_APP_SERVER_URL;

const submit = async (event, formData, navigate, dispatch, setCookie) => {
    event.preventDefault();
    await dispatch(fetchLoginAccount(formData));
    /**
     * Rechecking uniqueSessionID valid
     */
    const response = await axios.get(`${ServerURI}/session`, {
        withCredentials: true, /* If uniqueSessionID exist in cookies, send it or else send random non-exist sessionID */
    });
    console.log("after login session check response:" , response);
    const { sessionID, accountInfo } = response.data;
    if (sessionID) {
        setCookie("accountInfo", JSON.stringify(accountInfo.userInfo), { path: '/' });

        navigate("/");
    } else {
        setCookie("accountInfo", null, { path: '/' });
        setCookie("uniqueSessionID", null, { path: '/' });
        alert("Login failed");
    }
};

const updateState = (obj, formData, setFormData) => {
    let newFormData = { ...formData };
    for (const [key, value] of Object.entries(obj)) {
        newFormData[key] = value;
    }
    setFormData(newFormData);
};

function LoginPage(props) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [cookies, setCookie] = useCookies(["uniqueSessionID", "accountInfo"]);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    return (
        <div>
            <div className="cart-page-title"><div>Login Page</div></div>
            <div className='login-form-wrapper'>
                <LoginForm
                    email={formData.email}
                    password={formData.password}
                    onLogin={(event) => { submit(event, formData, navigate, dispatch, setCookie) }}
                    onKeyPress={(obj) => { updateState(obj, formData, setFormData) }}
                />
            </div>
        </div>
    );
}

export default LoginPage;