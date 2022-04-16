import React, { Component } from 'react'

class RegisterForm extends Component {
    render() {
        return (
            <form className="register-form"
                method='POST'
                onSubmit={(event) => this.props.onRegister(event)}
                onChange={(event) => this.props.onKeyPress({ [event.target.name]: event.target.value })}
            >
                <label htmlFor="username">Username:</label>
                <input name="username" value={this.props.username} placeholder="Username" />
                <label htmlFor="email">Email:</label>
                <input name="email" value={this.props.email} placeholder="Email" />
                <label htmlFor="password">Password:</label>
                <input name="password" type="password" value={this.props.password} placeholder="Password" />
                <input type="Submit" value="Register" />
            </form>
        );
    }
}

export default RegisterForm;