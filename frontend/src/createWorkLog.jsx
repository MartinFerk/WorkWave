import { useState, useEffect } from 'react';
import './styles/userRegister.css';

function WorkLog() {
    const [clientName, setClientName] = useState('');
    const [time, setTime] = useState('');
    const [pickupAddress, setPickupAddress] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [assignedUser, setAssignedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/_/backend/users')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Strežnik je vrnil napako: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setUsers(data))
            .catch(err => console.error("Napaka pri fetch:", err));
    }, []);
    const handleCreateLog = async (e) => {
        e.preventDefault();

        const workData = { clientName, time, pickupAddress, destinationAddress, assignedUser };

        try {
            const response = await fetch('/_/backend/create-work', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workData)
            });

            if (response.ok) {
                setMessage("Termin uspešno ustvarjen!");
                setClientName(''); setTime(''); setPickupAddress(''); setDestinationAddress(''); setAssignedUser('');
            } else {
                setMessage("Napaka pri ustvarjanju termina.");
            }
        } catch (error) {
            setMessage("Povezava s strežnikom ni uspela.");
        }
    };

    return (
        <div className="register-container">
            <h2>Ustvari Termin</h2>
            <form className="register-form" onSubmit={handleCreateLog}>
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
                    <label>Naslov dostave:</label>
                    <input type="text" value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Voznik:</label>
                    <select value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)} required>
                        <option value="">Izberi voznika</option>
                        {users.map(u => <option key={u.username} value={u.username}>{u.username}</option>)}
                    </select>
                </div>
                <button type="submit">Ustvari</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default WorkLog;