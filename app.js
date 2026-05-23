const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your MySQL username
    password: 'root',  // Replace with your MySQL password
    database: 'nmims_bus_management1'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes to serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

app.get('/buses', (req, res) => {
    // Fetch buses from the database and send as JSON
    connection.query('SELECT * FROM buses', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/routes', (req, res) => {
    // Fetch routes from the database and send as JSON
    connection.query('SELECT * FROM routes', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/schedules', (req, res) => {
    // Fetch schedules from the database and send as JSON
    const query = `
        SELECT buses.bus_number, routes.name AS route_name, bus_schedules.day_of_week, bus_schedules.departure_time, bus_schedules.arrival_time
        FROM bus_schedules
        JOIN buses ON bus_schedules.bus_id = buses.bus_id
        JOIN routes ON bus_schedules.route_id = routes.route_id
    `;
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API endpoint to create database and tables
app.get('/create-database', (req, res) => {
    const createDBQuery = `
        CREATE DATABASE IF NOT EXISTS nmims_bus_management1;
        USE nmims_bus_management1;

        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            sap_id VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            phone VARCHAR(15),
            year_of_study ENUM('1', '2', '3', '4') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS buses (
            bus_id INT AUTO_INCREMENT PRIMARY KEY,
            bus_number VARCHAR(10) UNIQUE NOT NULL,
            capacity INT NOT NULL,
            registration_number VARCHAR(20) UNIQUE NOT NULL,
            current_lat DECIMAL(10, 8),
            current_lng DECIMAL(11, 8),
            last_updated TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        );

        CREATE TABLE IF NOT EXISTS routes (
            route_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS bus_schedules (
            schedule_id INT AUTO_INCREMENT PRIMARY KEY,
            bus_id INT NOT NULL,
            route_id INT NOT NULL,
            day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
            departure_time TIME NOT NULL,
            arrival_time TIME NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (bus_id) REFERENCES buses(bus_id),
            FOREIGN KEY (route_id) REFERENCES routes(route_id)
        );

        INSERT IGNORE INTO buses (bus_number, capacity, registration_number) VALUES
            ('101', 40, 'MP09AB1234'),
            ('102', 35, 'MP09CD5678'),
            ('103', 45, 'MP09EF9012');

        INSERT IGNORE INTO routes (name, description) VALUES
            ('Route 101', 'Central Indore route via Vijay Nagar'),
            ('Route 102', 'North Indore route via Airport Road'),
            ('Route 103', 'South Indore route via Sapna Sangeeta');

        INSERT IGNORE INTO bus_schedules (bus_id, route_id, day_of_week, departure_time, arrival_time) VALUES
            (1, 1, 'Monday', '07:00:00', '08:30:00'),
            (2, 2, 'Monday', '07:00:00', '08:45:00'),
            (3, 3, 'Monday', '07:00:00', '08:50:00');
    `;
    
    connection.query(createDBQuery, (err, result) => {
        if (err) {
            console.error('Error creating database and tables:', err.stack);
            res.status(500).send('Error creating database and tables');
            return;
        }
        console.log('Database and tables created successfully.');
        res.send('Database and tables created successfully.');
    });
});

// Server is listening on port 3000
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
