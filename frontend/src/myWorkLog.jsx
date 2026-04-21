import { useState, useEffect } from 'react';
import './styles/userRegister.css';
import apiFetch from './api';

function MyWorkLog() {
const [work, setWork] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    useEffect(() => {
        if (!currentUser) return;

        apiFetch(`/_/backend/work/${currentUser.username}`)
            .then(res => res.json())
            .then(data => setWork(data))
            .catch(err => console.log("Napaka pri pridobivanju dela", err));
    }, []);

    const handleDelete = async (id) => {
        const response = await apiFetch(`/_/backend/work/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            setWork(work.filter(w => w._id !== id));
        } else {
            alert("Napaka pri brisanju.");
        }
    };

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


    const handleEdit = (w) => {
        setEditId(w._id);
        setEditData({
            clientName: w.clientName,
            time: new Date(w.time).toISOString().slice(0, 16),
            pickupAddress: w.pickupAddress,
            destinationAddress: w.destinationAddress,
            assignedUser: w.assignedUser
        });
    };

    const handleSave = async (id) => {
        const response = await apiFetch(`/_/backend/work/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editData)
        });

        if (response.ok) {
            const updated = await response.json();
            setWork(work.map(w => w._id === id ? updated : w));
            setEditId(null);
        } else {
            alert("Napaka pri shranjevanju.");
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
                        {editId === w._id ? (
                            <>
                                <input value={editData.clientName} onChange={e => setEditData({...editData, clientName: e.target.value})} />
                                <input type="datetime-local" value={editData.time} onChange={e => setEditData({...editData, time: e.target.value})} />
                                <input value={editData.pickupAddress} onChange={e => setEditData({...editData, pickupAddress: e.target.value})} />
                                <input value={editData.destinationAddress} onChange={e => setEditData({...editData, destinationAddress: e.target.value})} />
                                <div className="funcButton">
                                    <button onClick={() => handleSave(w._id)}>Shrani</button>
                                    <button onClick={() => setEditId(null)}>Prekliči</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>{w.clientName}</h3>
                                <p>Čas: {new Date(w.time).toLocaleString()}</p>
                                <p>Prevzem: {w.pickupAddress}</p>
                                <p>Cilj: {w.destinationAddress}</p>
                                {currentUser.isAdmin && (
                                    <>
                                        <button onClick={() => handleEdit(w)}>Uredi</button>
                                        <button onClick={() => handleDelete(w._id)}>Zbriši</button>
                                    </>
                                )}
                                {!currentUser.isAdmin && (
                                    <button onClick={() => handleDone(w._id)}>✓ Opravljeno</button>
                                )}
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default MyWorkLog;