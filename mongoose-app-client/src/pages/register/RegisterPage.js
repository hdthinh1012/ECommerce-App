import React from 'react';
import RegisterForm from './RegisterForm';
import "./RegisterPage.css"
import axios from 'axios';

const ServerPort = process.env.REACT_APP_SERVER_PORT;
const ServerURL = process.env.REACT_APP_SERVER_URL;
const ServerURI = `${ServerURL}:${ServerPort}`;

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                username: "",
                email: "",
                password: "",
            }
        }
    }

    submit = async (event) => {
        event.preventDefault();
        const formData = this.state.formData;
        try {
            const response = await axios.post(`${ServerURI}/auth/register`, formData);
            console.log("Register response:", response);
            if (response.status === 200) {
                console.log("Register Success, data: ", response.data);
            } else {
                console.log("Register Failed, message: ", response.data.message);
            }
        } catch (err) {
            console.log(`Register error with code ${err.response.status}:`, err.response.data.message);
        }
    };

    updateState = (obj) => {
        let newFormData = { ...this.state.formData };
        for (const [key, value] of Object.entries(obj)) {
            newFormData[key] = value;
        }
        this.setState({ formData: newFormData });
    };

    render() {
        return (
            <div>
                <div className="register-page-title"><div>Register Page</div></div>
                <div className='register-form-wrapper'>
                    <RegisterForm
                        username={this.state.formData.username}
                        email={this.state.formData.email}
                        password={this.state.formData.password}
                        onRegister={this.submit}
                        onKeyPress={this.updateState}
                    />
                </div>
            </div>
        );
    }
}

export default RegisterPage;