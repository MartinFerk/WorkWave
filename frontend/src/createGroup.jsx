import { useState, useEffect } from 'react';
import './styles/userRegister.css';

function CreateGroup() {
    const [groupName, setGroupName] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/_/backend/users')
            .then(res => res.json())
            .then(data => setAllUsers(data))
            .catch(err => console.error("Napaka pri pridobivanju userjev:", err));
    }, []);

    const filteredUsers = searchTerm.trim() === ''
        ? []
        : allUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const toggleUser = (username) => {
        if (selectedUsers.includes(username)) {
            setSelectedUsers(selectedUsers.filter(u => u !== username));
        } else {
            setSelectedUsers([...selectedUsers, username]);
        }
    };

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    const handleSubmit = async (e) => {
        e.preventDefault();

        const podatki = {
            groupName: groupName,
            groupAdmin: currentUser.username,
            members: selectedUsers
        };

        const response = await fetch('/_/backend/create-group', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(podatki)
        });

        if (response.ok) {
            alert("Skupina uspešno ustvarjena!");
            setGroupName('');
            setSelectedUsers([]);
        } else {
            alert("Napaka pri ustvarjanju skupine.");
        }
    };

    return (
        <div className="register-container">
            <h2>Ustvari Novo Skupino</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ime skupine"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                />

                <h3 style={{marginTop: '20px'}}>Izberi uporabnike:</h3>

                <input
                    type="text"
                    placeholder="Išči uporabnika..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '15px' }}
                />

                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px',backgroundColor: 'white',
                    position: 'relative',
                    zIndex: 100 }}>
                    {filteredUsers.map(user => (
                        <div
                            key={user.username}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '8px',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.username)}
                                onChange={() => toggleUser(user.username)}
                            />
                            <span style={{
                                fontSize: '16px',
                                color: '#333', // SPREMEMBA: Spremeni 'white' v temno barvo
                                display: 'inline-block'
                            }}>
            {user.username}
        </span>
                        </div>
                    ))}
                </div>
                <button type="submit" style={{ marginTop: '20px' }}>Ustvari</button>
            </form>
        </div>
    );
}

export default CreateGroup;