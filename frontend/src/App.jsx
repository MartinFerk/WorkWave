import { useState } from 'react'

import './styles/App.css'
import './styles/global.css'
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
import HistoryPage from './historyLog.jsx';


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
            <nav className="globalNav">
              <span className="navigationButtons">
                  <button className="btn btn-gray" onClick={() => navigate('/')}>Domov</button>

                  {isAdmin && isLoggedIn && (
                      <span className="adminNav">
                          <button className="btn btn-gray" onClick={() => navigate('/create-group')}>Ustvari skupino</button>
                          <button className="btn btn-gray" onClick={() => navigate('/admin')}>Pregled</button>
                      </span>
                  )}

                  {isLoggedIn && (
                      <span className="userNav">
                          <button className="btn btn-gray" onClick={() => navigate('/my-groups')}>Moje skupine</button>
                          <button className="btn btn-gray" onClick={() => navigate('/my-worklog')}>Moje delo</button>
                          <button className="btn btn-gray" onClick={() => navigate('/history')}>Zgodovina</button>
                      </span>
                  )}
              </span>

                <span className="userNav">
                  {!isLoggedIn ? (
                      <>
                          <button className="btn btn-gray" onClick={() => navigate('/login')}>Prijava</button>
                          <button className="btn btn-gray" onClick={() => navigate('/register')}>Registracija</button>
                      </>
                  ) : (
                      <button className="btn btn-gray" onClick={handleLogout}>Odjava</button>
                  )}
              </span>

            </nav>

            <div className="page-container">
                <Routes>
                    <Route path="/" element={
                        <header style={{ textAlign: 'center', color: 'white', paddingTop: '100px' }}>
                            <h1>Work Wave</h1>
                            <p style={{ fontSize: '1.2rem', opacity: '0.8', marginBottom: '20px' }}>
                                {isLoggedIn
                                    ? "Tvoj osebni asistent za vodenje delovnih logov."
                                    : "Najlažji način za vodenje evidenc in skupinsko delo."}
                            </p>
                            {!isLoggedIn && (
                                <div style={{ marginTop: '50px', padding: '0 20px' }}>
                                    <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>Zakaj Work Wave?</h2>
                                    <div className="card-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
                                        <div className="card">
                                            <h3> Skupine</h3>
                                            <p>Organiziraj svoje sodelavce v skupine in delite delovne naloge.</p>
                                        </div>
                                        <div className="card">
                                            <h3> Sledenje delu</h3>
                                            <p>Enostavno beleženje terminov, časa in lokacij prevzema.</p>
                                        </div>
                                        <div className="card">
                                            <h3> Preglednost</h3>
                                            <p>Napredna zgodovina in administracija za popoln nadzor.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isLoggedIn && user && (
                                <>
                                    <h2>Pozdravljen, {user.username}</h2>
                                    {isAdmin && (
                                        <div style={{ marginTop: '20px' }}>
                                            <button onClick={() => navigate('/work')} className="btn btn-gray" style={{ fontSize: '18px', padding: '12px 24px' }}>
                                                Ustvari Termin
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </header>
                    } />

                    <Route path="/register" element={<UserRegister />} />
                    <Route path="/login" element={<UserLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} setIsAdmin={setIsAdmin} />} />
                    <Route path="/work" element={<WorkLog />} />
                    <Route path="/create-group" element={<CreateGroup />} />
                    <Route path="/my-groups" element={<MyGroups />} />
                    <Route path="/my-worklog" element={<MyWorkLog />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                </Routes>
            </div>
            <Analytics />
        </section>
    )
}
export default App
