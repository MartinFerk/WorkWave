import { useState } from 'react'

import './styles/App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import UserRegister from "./userRegister.jsx";


function App() {
    const navigate = useNavigate();

  return (
      <div>
          <Routes>
              <Route path="/" element={<header>
                  <h1>Moj projekt</h1>
                  <nav>

                      <button onClick={() => navigate('/registracija')}>
                          Registracija
                      </button>
                  </nav>
              </header>} />

              <Route path="/registracija" element={<UserRegister />} />
          </Routes>
      </div>

  )
}

export default App
