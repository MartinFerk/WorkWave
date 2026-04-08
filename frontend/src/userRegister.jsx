import { useState } from 'react'

import './styles/userRegister.css';

import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function Register() {
    return (
        <div className={"register-container"}>
            <h2> Registracija Uporabnika</h2>
            <form className={"register-form"}>

                <div className={"form-group"}>
                    <label>Email: </label>
                    <input type="text" name="email" id="email" placeholder="Email" />
                </div>

                <div className={"form-group"}>
                    <label>Password: </label>
                    <input type="password" name="password" id="password" placeholder="Password" />
                </div>

                <button type="submit">Register</button>

            </form>
        </div>

    )
}

export default Register
