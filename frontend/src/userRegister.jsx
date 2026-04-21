import { useState } from 'react'

import './styles/userRegister.css';
import {useNavigate} from "react-router-dom";
import apiFetch from './api';



function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const podatki = {email, username, password, isAdmin};
        try {
            const odgovor = await apiFetch('/_/backend/register', {
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
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
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
                        <label>Uporabniško ime: </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Uporabniško ime"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Geslo: </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Geslo"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Administrator
                            <input type="checkbox"
                                   checked={isAdmin}
                                   onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                        </label>
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