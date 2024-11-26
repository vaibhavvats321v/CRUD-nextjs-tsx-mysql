'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ListUser(){

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/users/list');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
                    method: 'DELETE',
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response text:', errorText);
                    alert('Failed to delete user');
                    return;
                }
    
                const result = await response.json();
                alert(result.message);  // Show success message
                // Refresh users list after deletion
                setUsers(users.filter(user => user.id !== userId));
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Error deleting user');
            }
        }
    };
    


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }



    return (
        <table className="table table-zebra">
            <thead className="text-sm text-gray-700 uppercase bg-gray50">
                <tr>
                    <th className="px-6 py-3 ">#</th>
                    <th className="px-6 py-3 ">Name</th>
                    <th className="px-6 py-3 ">Email</th>
                    <th className="px-6 py-3 ">Username</th>
                    <th className="px-6 py-3 text-center">Action</th>
                </tr>
            </thead>
            <tbody>
               {users.map((user, index) => (
                    <tr key={user.id} className="bg-white border-b">
                        <td className="px-6 py-3">{index + 1}</td>
                        <td className="px-6 py-3">{user.name}</td>
                        <td className="px-6 py-3">{user.email}</td>
                        <td className="px-6 py-3">{user.username}</td>
                        <td className="flex justify-center gap-1 py-3">
                            <Link href={`/users/edit/${user.id}`} className="btn btn-info">Edit</Link>
                            <button className="btn btn-error" onClick={() => handleDelete(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}