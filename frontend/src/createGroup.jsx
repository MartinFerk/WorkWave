import { useState, useEffect } from 'react';
import './styles/userRegister.css'; // Uporabi obstoječi stil

function CreateGroup() {
    const [groupName, setGroupName] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // 1. Pridobi vse uporabnike ob nalaganju strani
    useEffect(() => {
        fetch('/_/backend/users')
            .then(res => res.json())
            .then(data => setAllUsers(data))
            .catch(err => console.error("Napaka pri pridobivanju userjev:", err));
    }, []);

    // 2. Logika za izbiro uporabnikov (checkbox)
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
            groupAdmin: currentUser.username, // Tukaj pošlješ ime admina
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

                <h3>Izberi uporabnike:</h3>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {allUsers.map(user => (
                        <div key={user.username}>
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.username)}
                                onChange={() => toggleUser(user.username)}
                            />
                            {user.username}
                        </div>
                    ))}
                </div>

                <button type="submit">Ustvari</button>
            </form>
        </div>
    );
}

export default CreateGroup;