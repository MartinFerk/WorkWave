import { useState, useEffect } from 'react';
import './styles/global.css'
import apiFetch from './api';

function MyGroups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    useEffect(() => {
        if (!currentUser) return;

        apiFetch(`/_/backend/groups/${currentUser.username}`)
            .then(res => {
                if (!res.ok) throw new Error("Napaka pri pridobivanju skupin");
                return res.json();
            })
            .then(data => {
                setGroups(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

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