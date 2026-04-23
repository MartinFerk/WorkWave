import { useState, useEffect } from 'react';
import './styles/global.css'
import apiFetch from './api';

function MyWorkLog() {
    const [work, setWork] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    useEffect(() => {
        if (!currentUser) return;

        apiFetch(`/_/backend/work/${currentUser.username}`)
            .then(res => {
                if (!res.ok) throw new Error("Napaka pri pridobivanju dela");
                return res.json();
            })
            .then(data => {
                setWork(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleDone = async (id) => {
        const response = await apiFetch(`/_/backend/work/${id}/complete`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isCompleted: true })
        });

        if (response.ok) {
            setWork(work.filter(w => w._id !== id));
            setMessage({ text: "Termin uspešno opravljen!", type: 'success' });
        } else {
            setMessage({ text: "Napaka pri označevanju dela.", type: 'error' });
        }
    };

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
            <h2 className="page-title">Moje delo</h2>
            {work.length === 0 ? (
                <p style={{ color: 'white' }}>Nimaš nobenega dela.</p>
            ) : (
                <div className="card-grid">
                    {work.map(w => (
                        <div key={w._id} className="card">
                            <h3>{w.type === 'prevoz' ? '🚗' : w.type === 'servis' ? '🔧' : w.type === 'dostava' ? '📦' : w.type === 'sestanek' ? '📅' : '💻'} {w.type?.toUpperCase()}</h3>
                            <p>Čas: {new Date(w.time).toLocaleString()}</p>

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

                            {!currentUser.isAdmin && (
                                <button className="btn btn-green" style={{ marginTop: '8px' }} onClick={() => handleDone(w._id)}>✓ Opravljeno</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {message && (
                <p style={{
                    color: message.type === 'error' ? '#f44336' : '#4CAF50',
                    background: 'white',
                    padding: '10px',
                    borderRadius: '6px',
                    marginTop: '10px'
                }}>
                    {message.type === 'error' ? '⚠️' : '✓'} {message.text}
                </p>
            )}
        </div>
    );
}

export default MyWorkLog;