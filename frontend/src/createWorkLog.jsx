import { useState, useEffect } from 'react';
import './styles/global.css'
import apiFetch from './api';

function WorkLog() {
    const [clientName, setClientName] = useState('');
    const [time, setTime] = useState('');
    const [pickupAddress, setPickupAddress] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [assignedUser, setAssignedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    useEffect(() => {
        apiFetch(`/_/backend/groups/${currentUser.username}`)
            .then(res => res.json())
            .then(data => {
                const allMembers = [...new Set(data.flatMap(group => group.members))];
                setUsers(allMembers)
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

    },[]);





    const handleCreateLog = async (e) => {
        e.preventDefault();

        const workData = { clientName, time, pickupAddress, destinationAddress, assignedUser };

        try {
            const response = await apiFetch('/_/backend/create-work', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workData)
            });

            if (response.ok) {
                setMessage({ text: "Termin uspešno ustvarjen!", type: 'success' });
                setClientName(''); setTime(''); setPickupAddress(''); setDestinationAddress(''); setAssignedUser('');
            } else {
                setMessage({ text: "Napaka pri ustvarjanju termina.", type: 'error' });
            }
        } catch (error) {
            setMessage({ text: "Povezava s strežnikom ni uspela.", type: 'error' });
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
            <h2 className="page-title">Ustvari Termin</h2>
            <form className="form-card" onSubmit={handleCreateLog}>
                <div className="form-group">
                    <label>Stranka:</label>
                    <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Čas:</label>
                    <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Naslov prevzema:</label>
                    <input type="text" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Naslov cilja:</label>
                    <input type="text" value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Voznik:</label>
                    <select value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)} required>
                        <option value="">Izberi voznika</option>
                        {users.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                <button type="submit">Ustvari</button>
                {message && (
                    <p style={{
                        color: message.type === 'error' ? '#f44336' : '#4CAF50',
                        marginTop: '10px'
                    }}>
                        {message.type === 'error' ? '⚠️' : '✓'} {message.text}
                    </p>
                )}
            </form>
        </div>
    );
}

export default WorkLog;