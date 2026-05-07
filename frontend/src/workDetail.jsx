import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/global.css';
import apiFetch from './api';

function WorkDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [work, setWork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch(`/_/backend/work/detail/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Napaka pri pridobivanju termina");
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
    }, [id]);

    if (loading) return (
        <div className="page-container">
            <p style={{ color: 'white', fontSize: '18px' }}>Nalaganje...</p>
        </div>
    );

    if (error) return (
        <div className="page-container">
            <p style={{ color: '#f44336', background: 'white', padding: '16px', borderRadius: '12px' }}>⚠️ {error}</p>
        </div>
    );

    return (
        <div className="page-container">
            <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'white', border: '1px solid white', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', marginBottom: '20px' }}>
                ← Nazaj
            </button>

            <div className="card" style={{ maxWidth: '600px' }}>
                <h2 style={{ margin: 0 }}>
                    {work.type === 'prevoz' ? '🚗' : work.type === 'servis' ? '🔧' : work.type === 'dostava' ? '📦' : work.type === 'sestanek' ? '📅' : '💻'} {work.type?.toUpperCase()}
                </h2>
                <p>Dodeljeno: {work.assignedUser}</p>
                <p>Čas: {new Date(work.time).toLocaleString()}</p>
                {work.updatedAt && work.isCompleted && <p>Opravljeno: {new Date(work.updatedAt).toLocaleString()}</p>}

                {work.type === 'prevoz' && <>
                    <p>Stranka: {work.clientName}</p>
                    <p>Prevzem: {work.pickupAddress}</p>
                    <p>Cilj: {work.destinationAddress}</p>
                </>}
                {work.type === 'servis' && <>
                    <p>Vozilo: {work.vehicle}</p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>Opis: {work.serviceDescription}</p>
                </>}
                {work.type === 'dostava' && <>
                    <p>Paket: {work.packageDesc}</p>
                    <p>Naslov: {work.deliveryAddress}</p>
                    <p>Prejemnik: {work.recipient}</p>
                </>}
                {work.type === 'sestanek' && <>
                    <p>Tema: {work.topic}</p>
                    <p>Lokacija: {work.location}</p>
                </>}
                {work.type === 'it_ticket' && <>
                    <p>Naslov: {work.title}</p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>Opis: {work.description}</p>
                    <p>Prioriteta: {work.priority}</p>
                </>}

                {work.isCompleted && <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ Opravljeno</p>}
            </div>
        </div>
    );
}

export default WorkDetail;