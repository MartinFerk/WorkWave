import { useState } from 'react'

import './styles/App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import UserRegister from "./userRegister.jsx";
import UserLogin from "./userLogin.jsx";
import WorkLog from "./createWorkLog.jsx";
import { useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';

function App() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false); // Stanje prijave
    const [user, setUser] = useState(null);

    useEffect(() => {

        const shranjenUporabnik = localStorage.getItem('prijavljenUporabnik');

        if (shranjenUporabnik) {
            const podatki = JSON.parse(shranjenUporabnik);
            setUser(podatki);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('prijavljenUporabnik');
        navigate('/');
    };

  return (
      <section>
          <div className="wave">
              <span></span>
              <span></span>
              <span></span>
          </div>

          <span className="globalNav">
                <span className="navigationButtons">
                <button onClick={() => navigate('/')}>Domov</button>
            </span>
            <span className="userNav">
    {!isLoggedIn ? (
        <>
            <button onClick={() => navigate('/login')}>Prijava</button>
            <button onClick={() => navigate('/register')}>Registracija</button>
        </>
    ) : (
        <button onClick={handleLogout}>Odjava</button>
    )}
</span>
        </span>

          <div style={{ position: 'relative', zIndex: 10 }}>
              <Routes>
                  <Route path="/" element={
                      <header style={{ textAlign: 'center', color: 'white' }}>
                          <h1>Work Wave</h1>
                          {isLoggedIn && user && (
                              <>
                                  <h2>Pozdravljen, {user.username}</h2>
                                  <div>
                                      <button onClick={ ()=>navigate('/work')} className="termin-btn"> Ustvari Termin </button>
                                  </div>
                              </>
                          )}
                      </header>
                  } />

                  <Route path="/register" element={<UserRegister />} />
                  <Route path="/login" element={<UserLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
                  <Route path="/work" element={< WorkLog />} />
              </Routes>
          </div>
          <Analytics />
      </section>
  )
}
export default App
