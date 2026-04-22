import { useState, useEffect } from 'react';
import './styles/global.css'
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
        <div className="page-container">
            <h2 className="page-title">Moje skupine</h2>
            {groups.length === 0 ? (
                <p style={{ color: 'white' }}>Nisi v nobeni skupini.</p>
            ) : (
                <div className="card-grid">
                    {groups.map(group => (
                        <div key={group._id} className="card">
                            <h3>{group.groupName}</h3>
                            <p>Admin: {group.groupAdmin}</p>
                            <p>Člani: {group.members.join(', ')}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyGroups;