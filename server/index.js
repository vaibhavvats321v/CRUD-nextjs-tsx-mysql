const express = require('express');
require('dotenv').config();
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3001;


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'mrtech@123',
    database: 'nextproject' 
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database');
  });

  app.use(express.json());



  app.post('/api/users', (req, res) => {
    const { name, email, username, password } = req.body;
    const query = 'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, username, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
    
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Duplicate entry for email or username' });
            }
    
            return res.status(500).json({ error: 'Error inserting data', details: err.message });
        }
    
        res.status(200).json({ message: 'User added successfully' });
    });
        
});


app.get('/api/users/list', (req, res) => {
    const query = 'SELECT id, name, email, username FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ error: 'Error fetching users' });
        }
        res.status(200).json(results);
    });
});

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Fetching user with ID: ${id}`);

    const query = 'SELECT id, name, email, username FROM users WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(result[0]);
    });
});


app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, username } = req.body;

    const query = 'UPDATE users SET name = ?, email = ?, username = ? WHERE id = ?';
    db.query(query, [name, email, username, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err.message);
            return res.status(500).json({ error: 'Error updating user' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    });
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Deleting user with ID: ${id}`);

    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err.message);
            return res.status(500).json({ error: 'Error deleting user' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});