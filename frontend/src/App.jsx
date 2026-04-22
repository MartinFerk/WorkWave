import { useState } from 'react'

import './styles/App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import UserRegister from "./userRegister.jsx";
import UserLogin from "./userLogin.jsx";
import WorkLog from "./createWorkLog.jsx";
import { useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';
import CreateGroup from "./createGroup.jsx";
import MyGroups from "./myGroups.jsx";
import MyWorkLog from "./myWorkLog.jsx";
import AdminPage from './adminPage.jsx';


function App() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {

        const shranjenUporabnik = localStorage.getItem('prijavljenUporabnik');

        if (shranjenUporabnik) {
            const podatki = JSON.parse(shranjenUporabnik);
            setUser(podatki);
            setIsLoggedIn(true);
            setIsAdmin(podatki.isAdmin || false);
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
                    <span className="adminNav">{isAdmin  && isLoggedIn ? (
                        <>
                            <button onClick={() => navigate('/create-group')}> Ustvari skupino</button>
                            <button onClick={() => navigate('/admin')}> Pregled</button>
                        </>
                    ) : null }

                    </span>

                    <span className="userNav">{ isLoggedIn ? (
                        <>
                            <button onClick={() => navigate('/my-groups')}> Moje skupine</button>
                            <button onClick={() => navigate('/my-worklog')}> Moje delo</button>
                        </>
                    ) : null }

                    </span>
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
                      <header style={{ textAlign: 'center', color: 'white', paddingTop: '100px' }}>
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
                  <Route path="/login" element={<UserLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser}  setIsAdmin={setIsAdmin}/>} />
                  <Route path="/work" element={< WorkLog />} />
                  <Route path="/create-group" element={< CreateGroup />} />
                  <Route path="/my-groups" element={< MyGroups />} />
                  <Route path="/my-worklog" element={< MyWorkLog />} />
                  <Route path="/admin" element={<AdminPage />} />

              </Routes>
          </div>
          <Analytics />
      </section>
  )
}
export default App
