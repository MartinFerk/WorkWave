import { useState, useEffect } from 'react';
import './styles/global.css';
import apiFetch from './api';
import { useNavigate } from 'react-router-dom';

function HistoryLog() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    if (loading) return (
        <div className="page-container">
            <p style={{ color: 'white', fontSize: '18px' }}>Nalaganje...</p>
        </div>
    );

    if (error) return (
        <div className="page-container">
            <p style={{ color: '#f44336', background: 'white', padding: '16px', borderRadius: '12px' }}>
                ⚠️ {error}
            </p>
        </div>
    );

    return (
        <div className="page-container">
            <h2 className="page-title">Zgodovina opravljenega dela</h2>

            {history.length === 0 ? (
                <p style={{ color: 'white' }}>Še nimaš opravljenih nalog.</p>
            ) : (
                <div className="card-grid">
                    {history.map(w => (
                        <div key={w._id} className="card" style={{ borderLeft: '4px solid #4CAF50', cursor: 'pointer' }} onClick={() => navigate(`/work/detail/${w._id}`)}>
                            <h3>{w.type === 'prevoz' ? '🚗' : w.type === 'servis' ? '🔧' : w.type === 'dostava' ? '📦' : w.type === 'sestanek' ? '📅' : '💻'} {w.type?.toUpperCase()}</h3>
                            <p>Čas: {new Date(w.time).toLocaleString()}</p>
                            <p>Opravljeno: {w.updatedAt ? new Date(w.updatedAt).toLocaleString() : 'Ni podatka'}</p>
                            <p style={{ color: '#4CAF50', fontWeight: 'bold', marginTop: '8px' }}>✓ Opravljeno — klikni za več →</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HistoryLog;