import { useState, useEffect } from 'react';
import './styles/global.css'
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
        <div className="page-container">
            <h2 className="page-title">Moje delo</h2>
            {work.length === 0 ? (
                <p style={{ color: 'white' }}>Nimaš nobenega dela.</p>
            ) : (
                <div className="card-grid">
                    {work.map(w => (
                        <div key={w._id} className="card">
                            <h3>{w.clientName}</h3>
                            <p>Čas: {new Date(w.time).toLocaleString()}</p>
                            <p>Prevzem: {w.pickupAddress}</p>
                            <p>Cilj: {w.destinationAddress}</p>
                            {!currentUser.isAdmin && (
                                <button className="btn btn-green" style={{ marginTop: '8px' }} onClick={() => handleDone(w._id)}>✓ Opravljeno</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyWorkLog;