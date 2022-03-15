import React from 'react';

class LoginForm extends React.Component {
    render() {
        return (
            <form className="login-form"
                method='POST'
                onSubmit={(event) => { this.props.onLogin(event) }}
                onChange={(event) => { this.props.onKeyPress({ [event.target.name]: event.target.value }) }}
            >
                <label htmlFor="email">Email</label>
                <input name="email" value={this.props.email} placeholder="Email" />
                <label htmlFor="password">Password</label>
                <input name="password" type="password" value={this.props.password} placeholder="Password" />
                <input type="submit" value="Login" />
            </form>
        );
    }
}

export default LoginForm;