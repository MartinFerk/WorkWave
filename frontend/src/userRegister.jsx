import { useState } from 'react'

import './styles/global.css'
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
        <div className="page-container">
            <div className="form-card">
                <h2>Registracija</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Uporabniško ime:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Uporabniško ime"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Geslo:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Geslo"
                            required
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                        <label style={{ margin: 0 }}>Administrator</label>
                    </div>
                    <button type="submit" className="btn" style={{width: '100%'}}>Registracija</button>
                    {successMsg && (
                        <p style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>
                            {successMsg}
                        </p>
                    )}
                </form>
                {errorMsg && <p className="error-text" style={{color: 'red', marginTop: '10px'}}>{errorMsg}</p>}
            </div>
        </div>
    )
}

export default Register