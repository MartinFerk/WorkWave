import { useState, useEffect } from 'react';
import './styles/userRegister.css';

function MyWorkLog() {
const [work, setWork] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem('prijavljenUporabnik'));

    useEffect(() => {
        if (!currentUser) return;

        fetch(`/_/backend/work/${currentUser.username}`)
            .then(res => res.json())
            .then(data => setWork(data))
            .catch(err => console.log("Napaka pri pridobivanju dela", err));
    }, []);

    return (
        <div className="register-container">
            <h2>Moje delo</h2>
            {work.length === 0 ? (
                <p>Nimaš nobenega dela.</p>
            ) : (
                work.map(w => (
                    <div key={w._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <h3>{w.clientName}</h3>
                        <p>Čas: {new Date(w.time).toLocaleString()}</p>
                        <p>Prevzem: {w.pickupAddress}</p>
                        <p>Cilj: {w.destinationAddress}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default MyWorkLog;