import { useState, useEffect } from 'react';
import './styles/userRegister.css';
import apiFetch from './api';

function MyGroups() {
    const [groups, setGroups] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    useEffect(() => {
        if (!currentUser) return;

        apiFetch(`/_/backend/groups/${currentUser.username}`)
            .then(res => res.json())
            .then(data => setGroups(data))
            .catch(err => console.log("Napaka pri pridobivanju skupin", err));
    }, []);

    return (
        <div className="register-container">
            <h2>Moje skupine</h2>
            {groups.length === 0 ? (
                <p>Nisi v nobeni skupini.</p>
            ) : (
                groups.map(group => (
                    <div key={group._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>

                                <h3>{group.groupName}</h3>
                                <p>Admin: {group.groupAdmin}</p>
                                <p>Člani: {group.members.join(', ')}</p>

                    </div>
                ))
            )}
        </div>
    );
}

export default MyGroups;