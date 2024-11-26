'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditUser({ params }) {
    const router = useRouter();
    const [user, setUser] = useState({ name: '', email: '', username: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [id, setId] = useState<string | null>(null); // State to store the unwrapped `id`

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            console.log('Resolved params:', resolvedParams); // Log resolved params
            setId(resolvedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/users/${id}`);
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Error response text:', errorText);
                        throw new Error('Failed to fetch user');
                    }
                    const data = await response.json();
                    setUser(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            // Redirect to the users list after successful update
            router.push('/');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Edit User</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        className="input input-bordered w-full"
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
