import { useState } from 'react'

import './styles/userRegister.css';
import {useNavigate} from "react-router-dom";



function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const podatki = {email, password};
        try {
            const odgovor = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(podatki)
            });

            const rezultat = await odgovor.json();

            if (!odgovor.ok) {
                setErrorMsg(rezultat.error);
            } else {
                setSuccessMsg("Registracija uspešna!");
                setErrorMsg('');
                navigate('/login');
            }
        } catch (error) {
            setErrorMsg("Povezava s strežnikom ni uspela.");
        }
    }
    return (

            <div className="register-container">
                <h2>Registracija Uporabnika</h2>
                <form className="register-form" onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Email: </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                    {successMsg && (
                        <p style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>
                            {successMsg}
                        </p>
                    )}
                </form>
                {errorMsg && <p className="error-text">{errorMsg}</p>}
            </div>
    )
}

export default Register
