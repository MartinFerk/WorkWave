import { useState } from 'react'

import './styles/global.css'
import {useNavigate} from "react-router-dom";
import apiFetch from "./api.js";


function Login({ setIsLoggedIn, setUser, setIsAdmin }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const podatki = {username:username,  password: password};
        try {
            const odgovor = await apiFetch('/_/backend/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(podatki)
            });

            const rezultat = await odgovor.json();

            if (!odgovor.ok) {
                setErrorMsg(rezultat.error);

            } else {

                localStorage.setItem('token', rezultat.token);


                setIsLoggedIn(true);
                setIsAdmin(rezultat.user.isAdmin || false);

                localStorage.setItem('prijavljenUporabnik', JSON.stringify(rezultat.user));
                setSuccessMsg("Prijava uspešna!");
                setErrorMsg('');
                setUser(rezultat.user);

                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            setErrorMsg("Povezava s strežnikom ni uspela.");
        }
    }

    return (
        <div className="page-container">
            <div className="form-card">
                <h2>Prijava</h2>
                <form onSubmit={handleLogin}>
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
                    <button type="submit" className="btn" style={{width: '100%'}}>Prijava</button>
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

export default Login;