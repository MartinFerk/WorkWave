import { useState, useEffect } from 'react';
import './styles/global.css';
import apiFetch from './api';

function ArchivePage() {
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        <div key={w._id} className="card" style={{ borderLeft: '4px solid #4CAF50' }}>
                            <h4 style={{ margin: 0 }}>
                                {w.type === 'prevoz' ? '🚗' : w.type === 'servis' ? '🔧' : w.type === 'dostava' ? '📦' : w.type === 'sestanek' ? '📅' : '💻'} {w.type?.toUpperCase()}
                            </h4>
                            <p>Dodeljeno: {w.assignedUser}</p>
                            <p>Čas: {new Date(w.time).toLocaleString()}</p>
                            <p>Opravljeno: {new Date(w.updatedAt).toLocaleString()}</p>

                            {w.type === 'prevoz' && <>
                                <p>Stranka: {w.clientName}</p>
                                <p>Prevzem: {w.pickupAddress}</p>
                                <p>Cilj: {w.destinationAddress}</p>
                            </>}
                            {w.type === 'servis' && <>
                                <p>Vozilo: {w.vehicle}</p>
                                <p>Opis: {w.serviceDescription}</p>
                            </>}
                            {w.type === 'dostava' && <>
                                <p>Paket: {w.packageDesc}</p>
                                <p>Naslov: {w.deliveryAddress}</p>
                                <p>Prejemnik: {w.recipient}</p>
                            </>}
                            {w.type === 'sestanek' && <>
                                <p>Tema: {w.topic}</p>
                                <p>Lokacija: {w.location}</p>
                            </>}
                            {w.type === 'it_ticket' && <>
                                <p>Naslov: {w.title}</p>
                                <p>Opis: {w.description}</p>
                                <p>Prioriteta: {w.priority}</p>
                            </>}

                            <p style={{ color: '#4CAF50', fontWeight: 'bold', marginTop: '4px' }}>✓ Opravljeno</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ArchivePage;