import { useState } from 'react'

import './styles/userRegister.css';
import './styles/App.css'
import {useNavigate} from "react-router-dom";


// 1. V oklepajih funkcije sprejmi prop { setIsLoggedIn }
function Login({ setIsLoggedIn, setUser }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const podatki = {email: email,username:username,  password: password};
        try {
            const odgovor = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(podatki)
            });

            const rezultat = await odgovor.json();

            if (!odgovor.ok) {
                setErrorMsg(rezultat.error);

            } else {

                setIsLoggedIn(true);

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
        <div className="register-container">
            <h2>Prijava Uporabnika</h2>
            <form className="register-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Uporabniško ime: </label>
                    <input
                        type="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Uporabniško ime"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Geslo"
                        required
                    />
                </div>
                <button type="submit">Prijava</button>
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

export default Login;