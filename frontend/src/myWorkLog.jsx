import { useState, useEffect } from 'react';
import './styles/userRegister.css';
import apiFetch from './api';

function MyWorkLog() {
const [work, setWork] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    useEffect(() => {
        if (!currentUser) return;

        apiFetch(`/_/backend/work/${currentUser.username}`)
            .then(res => res.json())
            .then(data => setWork(data))
            .catch(err => console.log("Napaka pri pridobivanju dela", err));
    }, []);

    const handleDone = async (id) => {
        const response = await apiFetch(`/_/backend/work/${id}/done`, {
            method: 'DELETE'
        });
        if (response.ok) {
            setWork(work.filter(w => w._id !== id));
        } else {
            alert("Napaka pri označevanju.");
        }
    };

    return (
        <div className="register-container">
            <h2>Moje delo</h2>
            {work.length === 0 ? (
                <p>Nimaš nobenega dela.</p>
            ) : (
                work.map(w => (
                    <div key={w._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                                <h3>{w.clientName}</h3>
                                <p>Čas: {new Date(w.time).toLocaleString()}</p>
                                <p>Prevzem: {w.pickupAddress}</p>
                                <p>Cilj: {w.destinationAddress}</p>
                                {!currentUser.isAdmin && (
                                    <button onClick={() => handleDone(w._id)}>✓ Opravljeno</button>
                                )}
                    </div>
                ))
            )}
        </div>
    );
}

export default MyWorkLog;