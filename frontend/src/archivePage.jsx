import { useState, useEffect } from 'react';
import './styles/global.css';
import apiFetch from './api';
import { useNavigate } from 'react-router-dom';

function ArchivePage() {
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);

        apiFetch('/_/backend/admin/archive')
            .then(res => {
                if (!res.ok) throw new Error("Napaka pri pridobivanju arhiva");
                return res.json();
            })
            .then(data => {
                setArchive(data);
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
            <h2 className="page-title">Arhiv opravljenih terminov</h2>

            {archive.length === 0 ? (
                <p style={{ color: 'white' }}>Ni arhiviranih terminov.</p>
            ) : (
                <div className="card-grid">
                    {archive.map(w => (
                        <div key={w._id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/work/detail/${w._id}`)}>
                            <h4 style={{ margin: 0 }}>
                                {w.type === 'prevoz' ? '🚗' : w.type === 'servis' ? '🔧' : w.type === 'dostava' ? '📦' : w.type === 'sestanek' ? '📅' : '💻'} {w.type?.toUpperCase()}
                            </h4>
                            <p>Dodeljeno: {w.assignedUser}</p>
                            <p>Čas: {new Date(w.time).toLocaleString()}</p>
                            <p>Opravljeno: {w.updatedAt ? new Date(w.updatedAt).toLocaleString() : 'Ni podatka'}</p>
                            <p style={{ color: '#4CAF50', fontWeight: 'bold', marginTop: '4px' }}>✓ Opravljeno — klikni za več →</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ArchivePage;