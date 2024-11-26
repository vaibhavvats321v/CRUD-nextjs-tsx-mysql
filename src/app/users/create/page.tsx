'use client';
import React, { useState } from 'react';
const Addnewuser = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit =async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Form data:', { name, email, username, password });

        const response = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, username, password }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
        if (response.ok) {
            console.log('User added successfully',data);
        } else {
            console.error('Failed to add user');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-5">
            <h1 className="text-2xl text-center mb-2">
                Add New User
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900">Name</label>
                    <input type="text" id="name"  value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered input-primary w-full max-w-xs" placeholder="Name..."/>
                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered input-primary w-full max-w-xs" placeholder="Email..."/>
                </div>
                <div className="mb-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-bordered input-primary w-full max-w-xs" placeholder="Username..."/>
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered input-primary w-full max-w-xs" placeholder="Password..."/>
                </div>
                <button type="submit" className="btn btn-primary">Add User</button>
            </form>
        </div>
    );
};

export default Addnewuser;