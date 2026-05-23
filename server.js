const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nmims_bus_management'
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database!");
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'schedule.html'));
});

// New endpoint to get schedule data
app.get('/schedule-data', (req, res) => {
    const query = `
        SELECT 
            b.bus_number AS 'Bus Number',
            d.name AS 'Driver Name',
            d.phone AS 'Driver Phone',
            GROUP_CONCAT(CONCAT(bs.name, ' - ', TIME_FORMAT(rs.estimated_time, '%H:%i')) 
                        ORDER BY rs.sequence_number SEPARATOR ', ') AS 'Stops & Timings'
        FROM buses b
        LEFT JOIN drivers d ON b.bus_id = d.bus_id
        LEFT JOIN bus_schedules sch ON b.bus_id = sch.bus_id
        LEFT JOIN route_stops rs ON sch.route_id = rs.route_id
        LEFT JOIN bus_stops bs ON rs.stop_id = bs.stop_id
        WHERE sch.is_active = TRUE
        GROUP BY b.bus_id, d.driver_id
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
