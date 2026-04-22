import { useState, useEffect } from 'react';
import './styles/userRegister.css';
import apiFetch from './api';

function AdminPage() {
    const [work, setWork] = useState([]);
    const [groups, setGroups] = useState([]);
    const [editWorkId, setEditWorkId] = useState(null);
    const [editWorkData, setEditWorkData] = useState({});
    const [editGroupId, setEditGroupId] = useState(null);
    const [editGroupData, setEditGroupData] = useState({});

    useEffect(() => {
        apiFetch('/_/backend/admin/work')
            .then(res => res.json())
            .then(data => setWork(data))
            .catch(err => console.log(err));

        apiFetch('/_/backend/admin/groups')
            .then(res => res.json())
            .then(data => setGroups(data))
            .catch(err => console.log(err));
    }, []);

    // --- TERMINI ---
    const handleEditWork = (w) => {
        setEditWorkId(w._id);
        setEditWorkData({
            clientName: w.clientName,
            time: new Date(w.time).toISOString().slice(0, 16),
            pickupAddress: w.pickupAddress,
            destinationAddress: w.destinationAddress,
            assignedUser: w.assignedUser
        });
    };

    const handleSaveWork = async (id) => {
        const response = await apiFetch(`/_/backend/work/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editWorkData)
        });
        if (response.ok) {
            const updated = await response.json();
            setWork(work.map(w => w._id === id ? updated : w));
            setEditWorkId(null);
        } else {
            alert("Napaka pri shranjevanju termina.");
        }
    };

    const handleDeleteWork = async (id) => {
        const response = await apiFetch(`/_/backend/work/${id}`, { method: 'DELETE' });
        if (response.ok) {
            setWork(work.filter(w => w._id !== id));
        } else {
            alert("Napaka pri brisanju termina.");
        }
    };

    // --- SKUPINE ---
    const handleEditGroup = (g) => {
        setEditGroupId(g._id);
        setEditGroupData({ groupName: g.groupName });
    };

    const handleSaveGroup = async (id) => {
        const response = await apiFetch(`/_/backend/groups/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editGroupData)
        });
        if (response.ok) {
            const updated = await response.json();
            setGroups(groups.map(g => g._id === id ? updated : g));
            setEditGroupId(null);
        } else {
            alert("Napaka pri shranjevanju skupine.");
        }
    };

    const handleDeleteGroup = async (id) => {
        const response = await apiFetch(`/_/backend/groups/${id}`, { method: 'DELETE' });
        if (response.ok) {
            setGroups(groups.filter(g => g._id !== id));
        } else {
            alert("Napaka pri brisanju skupine.");
        }
    };

    return (
        <div className="register-container">
            <h2>Admin pregled</h2>

            <h3>Moje skupine</h3>
            {groups.length === 0 ? <p>Nisi ustvaril nobene skupine.</p> : (
                groups.map(g => (
                    <div key={g._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        {editGroupId === g._id ? (
                            <>
                                <input value={editGroupData.groupName} onChange={e => setEditGroupData({...editGroupData, groupName: e.target.value})} />
                                <button onClick={() => handleSaveGroup(g._id)}>Shrani</button>
                                <button onClick={() => setEditGroupId(null)}>Prekliči</button>
                            </>
                        ) : (
                            <>
                                <h4>{g.groupName}</h4>
                                <p>Člani: {g.members.join(', ')}</p>
                                <button onClick={() => handleEditGroup(g)}>Uredi</button>
                                <button onClick={() => handleDeleteGroup(g._id)}>Zbriši</button>
                            </>
                        )}
                    </div>
                ))
            )}

            <h3 style={{ marginTop: '30px' }}>Vsi termini</h3>
            {work.length === 0 ? <p>Ni nobenih terminov.</p> : (
                work.map(w => (
                    <div key={w._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        {editWorkId === w._id ? (
                            <>
                                <input value={editWorkData.clientName} onChange={e => setEditWorkData({...editWorkData, clientName: e.target.value})} />
                                <input type="datetime-local" value={editWorkData.time} onChange={e => setEditWorkData({...editWorkData, time: e.target.value})} />
                                <input value={editWorkData.pickupAddress} onChange={e => setEditWorkData({...editWorkData, pickupAddress: e.target.value})} />
                                <input value={editWorkData.destinationAddress} onChange={e => setEditWorkData({...editWorkData, destinationAddress: e.target.value})} />
                                <button onClick={() => handleSaveWork(w._id)}>Shrani</button>
                                <button onClick={() => setEditWorkId(null)}>Prekliči</button>
                            </>
                        ) : (
                            <>
                                <h4>{w.clientName}</h4>
                                <p>Voznik: {w.assignedUser}</p>
                                <p>Čas: {new Date(w.time).toLocaleString()}</p>
                                <p>Prevzem: {w.pickupAddress}</p>
                                <p>Cilj: {w.destinationAddress}</p>
                                <button onClick={() => handleEditWork(w)}>Uredi</button>
                                <button onClick={() => handleDeleteWork(w._id)}>Zbriši</button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminPage;