import React, { useState, useEffect } from 'react';

const UserList = ({ searchTerm }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {

                const response = await fetch('https://api.example.com/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('failed to fetch user', error)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers();
    }, []);

    const renderUserProfile = (profile) => {
        return <div>{profile}</div>;
    };

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>
                    <h2>{user.name}</h2>
                    {renderUserProfile(user.profile)}
                    <button onClick={() => {
                        fetch(`/api/users/${user.id}/activate`, { method: 'POST' })
                            .then(response => response.json())
                            .then(data => console.log(data));
                    }}>
                        Activate User
                    </button>
                </div>
            ))}
        </div>
    );
};

const Dashboard = () => {
    const [search, setSearch] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('wss://api.example.com/notifications');
        ws.onmessage = (event) => {
            setNotifications(prev => [...prev, event.data]);
        };

        return () => {
            ws.close();
        }
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div>
            <input
                type="text"
                onChange={handleSearch}
                value={search}
            />
            <UserList searchTerm={search} />
            <div>
                {notifications.map((note, index) => (
                    <div>{note}</div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;