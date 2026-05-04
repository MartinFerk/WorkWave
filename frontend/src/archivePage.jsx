import { useState, useEffect } from 'react';
import apiFetch from './api';
import './styles/global.css'

function ArchivePage() {
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
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

    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        borderLeft: '4px solid #4CAF50'
    };

    if (loading) return (
        <div style={{ padding: '100px 30px', color: 'white', fontSize: '18px' }}>
            Nalaganje...
        </div>
    );

    if (error) return (
        <div style={{ padding: '100px 30px' }}>
            <p style={{ color: '#f44336', background: 'white', padding: '16px', borderRadius: '12px' }}>
                ⚠️ {error}
            </p>
        </div>
    );

    return (
        <div style={{
            padding: '100px 30px 30px 30px',
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100vh',
            boxSizing: 'border-box',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 10
        }}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>Arhiv opravljenih terminov</h2>

            {archive.length === 0 ? (
                <p style={{ color: 'white' }}>Ni arhiviranih terminov.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                    {archive.map(w => (
                        <div key={w._id} style={cardStyle}>
                            <h4 style={{ margin: 0 }}>
                                {w.type === 'prevoz' ? '🚗' : w.type === 'servis' ? '🔧' : w.type === 'dostava' ? '📦' : w.type === 'sestanek' ? '📅' : '💻'} {w.type?.toUpperCase()}
                            </h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Dodeljeno: {w.assignedUser}</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Čas: {new Date(w.time).toLocaleString()}</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Opravljeno: {new Date(w.updatedAt).toLocaleString()}</p>

                            {w.type === 'prevoz' && <>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Stranka: {w.clientName}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Prevzem: {w.pickupAddress}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Cilj: {w.destinationAddress}</p>
                            </>}
                            {w.type === 'servis' && <>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Vozilo: {w.vehicle}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Opis: {w.serviceDescription}</p>
                            </>}
                            {w.type === 'dostava' && <>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Paket: {w.packageDesc}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Naslov: {w.deliveryAddress}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Prejemnik: {w.recipient}</p>
                            </>}
                            {w.type === 'sestanek' && <>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Tema: {w.topic}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Lokacija: {w.location}</p>
                            </>}
                            {w.type === 'it_ticket' && <>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Naslov: {w.title}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Opis: {w.description}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Prioriteta: {w.priority}</p>
                            </>}

                            <p style={{ margin: 0, fontSize: '13px', color: '#4CAF50', fontWeight: 'bold', marginTop: '4px' }}>✓ Opravljeno</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ArchivePage;