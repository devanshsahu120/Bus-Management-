CREATE DATABASE nmims_bus_management;
USE nmims_bus_management;
CREATE TABLE users (
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
CREATE TABLE buses (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(10) UNIQUE NOT NULL,
    capacity INT NOT NULL,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    last_updated TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE drivers (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT,
    bus_id INT,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE SET NULL
);
CREATE TABLE bus_stops (
    stop_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    landmark_description TEXT
);
CREATE TABLE routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);
CREATE TABLE route_stops (
    route_stop_id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    stop_id INT NOT NULL,
    sequence_number INT NOT NULL,
    estimated_time TIME NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES bus_stops(stop_id) ON DELETE CASCADE,
    UNIQUE KEY (route_id, sequence_number)
);
CREATE TABLE bus_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    route_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE CASCADE
);
CREATE TABLE bus_passes (
    pass_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bus_id INT NOT NULL,
    stop_id INT NOT NULL,
    photo_path VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Expired') DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES bus_stops(stop_id) ON DELETE CASCADE
);
CREATE TABLE location_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE CASCADE
);
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- Insert sample buses
INSERT INTO buses (bus_number, capacity, registration_number) VALUES
('101', 40, 'MP09AB1234'),
('102', 35, 'MP09CD5678'),
('103', 45, 'MP09EF9012');

-- Insert sample drivers
INSERT INTO drivers (name, license_number, phone, bus_id) VALUES
('Ramesh Kumar', 'DL12345678', '9876543210', 1),
('Suresh Sharma', 'DL87654321', '9876512345', 2),
('Anil Patel', 'DL56781234', '9876567890', 3);

-- Insert sample bus stops
INSERT INTO bus_stops (name, location_lat, location_lng) VALUES
('Vijay Nagar Square', 22.7196, 75.8577),
('Palasia Square', 22.7234, 75.8621),
('Rajwada', 22.7178, 75.8335),
('Geeta Bhawan', 22.7123, 75.8412),
('College', 22.7256, 75.8478),
('Airport Road', 22.7356, 75.8078),
('Super Corridor', 22.7456, 75.8178),
('Bypass Road', 22.7556, 75.8278),
('Rau Circle', 22.7656, 75.8378),
('Sapna Sangeeta', 22.7156, 75.8678),
('Tower Square', 22.7256, 75.8778),
('56 Dukan', 22.7356, 75.8878),
('Navlakha', 22.7456, 75.8978);

-- Insert routes
INSERT INTO routes (name, description) VALUES
('Route 101', 'Central Indore route via Vijay Nagar'),
('Route 102', 'North Indore route via Airport Road'),
('Route 103', 'South Indore route via Sapna Sangeeta');

-- Insert route stops for Route 101
INSERT INTO route_stops (route_id, stop_id, sequence_number, estimated_time) VALUES
(1, 1, 1, '07:00:00'),
(1, 2, 2, '07:20:00'),
(1, 3, 3, '07:40:00'),
(1, 4, 4, '08:00:00'),
(1, 5, 5, '08:30:00');

-- Insert schedules
INSERT INTO bus_schedules (bus_id, route_id, day_of_week, departure_time, arrival_time) VALUES
(1, 1, 'Monday', '07:00:00', '08:30:00'),
(1, 1, 'Tuesday', '07:00:00', '08:30:00'),
(1, 1, 'Wednesday', '07:00:00', '08:30:00'),
(1, 1, 'Thursday', '07:00:00', '08:30:00'),
(1, 1, 'Friday', '07:00:00', '08:30:00'),
(2, 2, 'Monday', '07:00:00', '08:45:00'),
(2, 2, 'Tuesday', '07:00:00', '08:45:00'),
(2, 2, 'Wednesday', '07:00:00', '08:45:00'),
(2, 2, 'Thursday', '07:00:00', '08:45:00'),
(2, 2, 'Friday', '07:00:00', '08:45:00'),
(3, 3, 'Monday', '07:00:00', '08:50:00'),
(3, 3, 'Tuesday', '07:00:00', '08:50:00'),
(3, 3, 'Wednesday', '07:00:00', '08:50:00'),
(3, 3, 'Thursday', '07:00:00', '08:50:00'),
(3, 3, 'Friday', '07:00:00', '08:50:00');
-- Check buses
SELECT * FROM buses;

-- Check routes
SELECT * FROM routes;
-- 1. Clear existing data if needed (BE CAREFUL - THIS DELETES DATA)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE bus_schedules;
TRUNCATE TABLE route_stops;
TRUNCATE TABLE bus_stops;
TRUNCATE TABLE routes;
TRUNCATE TABLE drivers;
TRUNCATE TABLE buses;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Insert buses (must come first)
INSERT INTO buses (bus_number, capacity, registration_number) VALUES
('101', 40, 'MP09AB1234'), -- This will get bus_id = 1
('102', 35, 'MP09CD5678'), -- bus_id = 2
('103', 45, 'MP09EF9012'); -- bus_id = 3

-- 3. Insert drivers (references buses)
INSERT INTO drivers (name, license_number, phone, bus_id) VALUES
('Ramesh Kumar', 'DL12345678', '9876543210', 1), -- References bus_id 1
('Suresh Sharma', 'DL87654321', '9876512345', 2), -- References bus_id 2
('Anil Patel', 'DL56781234', '9876567890', 3); -- References bus_id 3

-- 4. Insert bus stops
INSERT INTO bus_stops (name, location_lat, location_lng) VALUES
('Vijay Nagar Square', 22.7196, 75.8577),
('Palasia Square', 22.7234, 75.8621),
('Rajwada', 22.7178, 75.8335),
('Geeta Bhawan', 22.7123, 75.8412),
('College', 22.7256, 75.8478),
('Airport Road', 22.7356, 75.8078),
('Super Corridor', 22.7456, 75.8178),
('Bypass Road', 22.7556, 75.8278),
('Rau Circle', 22.7656, 75.8378),
('Sapna Sangeeta', 22.7156, 75.8678),
('Tower Square', 22.7256, 75.8778),
('56 Dukan', 22.7356, 75.8878),
('Navlakha', 22.7456, 75.8978);

-- 5. Insert routes
INSERT INTO routes (name, description) VALUES
('Route 101', 'Central Indore route via Vijay Nagar'), -- route_id = 1
('Route 102', 'North Indore route via Airport Road'),  -- route_id = 2
('Route 103', 'South Indore route via Sapna Sangeeta'); -- route_id = 3

-- 6. Insert route stops (references routes and bus_stops)
INSERT INTO route_stops (route_id, stop_id, sequence_number, estimated_time) VALUES
-- Route 101 stops
(1, 1, 1, '07:00:00'), -- Vijay Nagar Square
(1, 2, 2, '07:20:00'), -- Palasia Square
(1, 3, 3, '07:40:00'), -- Rajwada
(1, 4, 4, '08:00:00'), -- Geeta Bhawan
(1, 5, 5, '08:30:00'), -- College

-- Route 102 stops
(2, 6, 1, '07:00:00'), -- Airport Road
(2, 7, 2, '07:25:00'), -- Super Corridor
(2, 8, 3, '07:50:00'), -- Bypass Road
(2, 9, 4, '08:15:00'), -- Rau Circle
(2, 5, 5, '08:45:00'), -- College

-- Route 103 stops
(3, 10, 1, '07:00:00'), -- Sapna Sangeeta
(3, 11, 2, '07:30:00'), -- Tower Square
(3, 12, 3, '07:55:00'), -- 56 Dukan
(3, 13, 4, '08:20:00'), -- Navlakha
(3, 5, 5, '08:50:00'); -- College

-- 7. NOW insert bus schedules (references buses and routes)
INSERT INTO bus_schedules (bus_id, route_id, day_of_week, departure_time, arrival_time) VALUES
-- Bus 101 (bus_id=1) on Route 101 (route_id=1)
(1, 1, 'Monday', '07:00:00', '08:30:00'),
(1, 1, 'Tuesday', '07:00:00', '08:30:00'),
(1, 1, 'Wednesday', '07:00:00', '08:30:00'),
(1, 1, 'Thursday', '07:00:00', '08:30:00'),
(1, 1, 'Friday', '07:00:00', '08:30:00'),

-- Bus 102 (bus_id=2) on Route 102 (route_id=2)
(2, 2, 'Monday', '07:00:00', '08:45:00'),
(2, 2, 'Tuesday', '07:00:00', '08:45:00'),
(2, 2, 'Wednesday', '07:00:00', '08:45:00'),
(2, 2, 'Thursday', '07:00:00', '08:45:00'),
(2, 2, 'Friday', '07:00:00', '08:45:00'),

-- Bus 103 (bus_id=3) on Route 103 (route_id=3)
(3, 3, 'Monday', '07:00:00', '08:50:00'),
(3, 3, 'Tuesday', '07:00:00', '08:50:00'),
(3, 3, 'Wednesday', '07:00:00', '08:50:00'),
(3, 3, 'Thursday', '07:00:00', '08:50:00'),
(3, 3, 'Friday', '07:00:00', '08:50:00');
-- Verify buses and their schedules
SELECT b.bus_number, s.day_of_week, s.departure_time, s.arrival_time
FROM buses b
JOIN bus_schedules s ON b.bus_id = s.bus_id
ORDER BY b.bus_number, s.day_of_week;

-- Verify routes and their stops
SELECT r.name AS route, bs.name AS stop, rs.sequence_number, rs.estimated_time
FROM routes r
JOIN route_stops rs ON r.route_id = rs.route_id
JOIN bus_stops bs ON rs.stop_id = bs.stop_id
ORDER BY r.name, rs.sequence_number;
