import { useState } from 'react'

import './styles/App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import UserRegister from "./userRegister.jsx";
import UserLogin from "./userLogin.jsx";


function App() {
    const navigate = useNavigate();

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
                <button onClick={() => navigate('/login')}>Prijava</button>
                <button onClick={() => navigate('/register')}>Registracija</button>
            </span>
        </span>


          <div style={{ position: 'relative', zIndex: 10 }}>
              <Routes>
                  <Route path="/" element={
                      <header style={{ textAlign: 'center', color: 'white' }}>
                          <h1>Moj projekt</h1>
                      </header>
                  } />
                  <Route path="/register" element={<UserRegister />} />
                  <Route path="/login" element={<UserLogin />} />
              </Routes>
          </div>
      </section>
  )
}

export default App
