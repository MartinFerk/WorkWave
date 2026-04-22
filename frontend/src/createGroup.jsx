import { useState, useEffect } from 'react';
import './styles/global.css'
import apiFetch from './api';

function CreateGroup() {
    const [groupName, setGroupName] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    useEffect(() => {
        setLoading(true);
        setError(null);

        apiFetch('/_/backend/users')
            .then(res => {
                if (!res.ok) throw new Error("Napaka pri pridobivanju userjev");
                return res.json();
            })
            .then(data => {
                setAllUsers(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const filteredUsers = searchTerm.trim() === ''
        ? []
        : allUsers.filter(user =>
            user.username &&
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const toggleUser = (username) => {
        if (selectedUsers.includes(username)) {
            setSelectedUsers(selectedUsers.filter(u => u !== username));
        } else {
            setSelectedUsers([...selectedUsers, username]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const podatki = {
            groupName: groupName,
            groupAdmin: currentUser.username,
            members: selectedUsers
        };

        try {
            const response = await apiFetch('/_/backend/create-group', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(podatki)
            });

            if (response.ok) {
                setMessage({ text: "Skupina uspešno ustvarjena!", type: 'success' });
                setGroupName('');
                setSelectedUsers([]);
            } else {
                setMessage({ text: "Napaka pri ustvarjanju skupine.", type: 'error' });
            }
        } catch (err) {
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
            <h2 className="page-title">Ustvari novo skupino</h2>
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ime skupine:</label>
                        <input type="text" placeholder="Ime skupine" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
                    </div>

                    <h3 style={{ marginTop: '20px', color: '#333' }}>Izberi uporabnike:</h3>
                    <input type="text" placeholder="Išči uporabnika..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ marginBottom: '15px' }} />

                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
                        {filteredUsers.map(user => (
                            <div key={user.username} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <input type="checkbox" checked={selectedUsers.includes(user.username)} onChange={() => toggleUser(user.username)} />
                                <span style={{ fontSize: '16px', color: '#333' }}>{user.username}</span>
                            </div>
                        ))}
                    </div>

                    <button type="submit" style={{ marginTop: '20px' }}>Ustvari</button>

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
        </div>
    );
}

export default CreateGroup;