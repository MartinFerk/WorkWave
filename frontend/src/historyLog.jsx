import { useState, useEffect } from 'react';
import apiFetch from './api';
import './styles/global.css'


function HistoryLog() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    useEffect(() => {
        if (!currentUser) return;

        apiFetch(`/_/backend/work/history/${currentUser.username}`)
            .then(res => {
                if (!res.ok) throw new Error("Napaka pri pridobivanju zgodovine");
                return res.json();
            })
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="page-container"><p style={{ color: 'white' }}>Nalaganje zgodovine...</p></div>;

    return (
        <div className="register-container">
            <h2 className="page-title">Zgodovina opravljenega dela</h2>

            {error && <p style={{ color: '#f44336', background: 'white', padding: '10px', borderRadius: '6px' }}>{error}</p>}

            {history.length === 0 ? (
                <p style={{ color: 'white' }}>Še nimaš opravljenih nalog.</p>
            ) : (
                <div className="card-grid">
                    {history.map(w => (
                        <div key={w._id} className="card" style={{ border: '2px solid #4CAF50', opacity: 0.8 }}>
                            <h3>{w.clientName}</h3>
                            <p><strong>Opravljeno:</strong> {new Date(w.time).toLocaleString()}</p>
                            <p>Prevzem: {w.pickupAddress}</p>
                            <p>Cilj: {w.destinationAddress}</p>
                            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ Opravljeno</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HistoryLog;