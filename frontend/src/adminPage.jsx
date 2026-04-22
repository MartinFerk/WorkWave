import { useState, useEffect } from 'react';
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

    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    };

    const inputStyle = {
        width: '100%',
        padding: '6px 10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        marginBottom: '6px',
        boxSizing: 'border-box'
    };

    const btnStyle = (color) => ({
        padding: '6px 14px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        background: color,
        color: 'white',
        fontWeight: 'bold',
        marginRight: '6px'
    });

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
            <h2 style={{ color: 'white', marginBottom: '30px' }}>Admin pregled</h2>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{ color: 'white', marginBottom: '16px' }}>Moje skupine</h3>
                    {groups.length === 0 ? (
                        <p style={{ color: 'white' }}>Nisi ustvaril nobene skupine.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                            {groups.map(g => (
                                <div key={g._id} style={cardStyle}>
                                    {editGroupId === g._id ? (
                                        <>
                                            <input style={inputStyle} value={editGroupData.groupName} onChange={e => setEditGroupData({...editGroupData, groupName: e.target.value})} />
                                            <div>
                                                <button style={btnStyle('#4CAF50')} onClick={() => handleSaveGroup(g._id)}>Shrani</button>
                                                <button style={btnStyle('#888')} onClick={() => setEditGroupId(null)}>Prekliči</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h4 style={{ margin: 0 }}>{g.groupName}</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Člani: {g.members.join(', ')}</p>
                                            <div style={{ marginTop: '8px' }}>
                                                <button style={btnStyle('#2196F3')} onClick={() => handleEditGroup(g)}>Uredi</button>
                                                <button style={btnStyle('#f44336')} onClick={() => handleDeleteGroup(g._id)}>Zbriši</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DESNA STRAN - TERMINI */}
                <div style={{ flex: 2, minWidth: '300px' }}>
                    <h3 style={{ color: 'white', marginBottom: '16px' }}>Vsi termini</h3>
                    {work.length === 0 ? (
                        <p style={{ color: 'white' }}>Ni nobenih terminov.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                            {work.map(w => (
                                <div key={w._id} style={cardStyle}>
                                    {editWorkId === w._id ? (
                                        <>
                                            <input style={inputStyle} value={editWorkData.clientName} onChange={e => setEditWorkData({...editWorkData, clientName: e.target.value})} />
                                            <input style={inputStyle} type="datetime-local" value={editWorkData.time} onChange={e => setEditWorkData({...editWorkData, time: e.target.value})} />
                                            <input style={inputStyle} value={editWorkData.pickupAddress} onChange={e => setEditWorkData({...editWorkData, pickupAddress: e.target.value})} />
                                            <input style={inputStyle} value={editWorkData.destinationAddress} onChange={e => setEditWorkData({...editWorkData, destinationAddress: e.target.value})} />
                                            <div>
                                                <button style={btnStyle('#4CAF50')} onClick={() => handleSaveWork(w._id)}>Shrani</button>
                                                <button style={btnStyle('#888')} onClick={() => setEditWorkId(null)}>Prekliči</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h4 style={{ margin: 0 }}>{w.clientName}</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Voznik: {w.assignedUser}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Čas: {new Date(w.time).toLocaleString()}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Prevzem: {w.pickupAddress}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Cilj: {w.destinationAddress}</p>
                                            <div style={{ marginTop: '8px' }}>
                                                <button style={btnStyle('#2196F3')} onClick={() => handleEditWork(w)}>Uredi</button>
                                                <button style={btnStyle('#f44336')} onClick={() => handleDeleteWork(w._id)}>Zbriši</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default AdminPage;