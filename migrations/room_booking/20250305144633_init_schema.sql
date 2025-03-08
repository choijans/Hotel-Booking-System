-- +goose Up
-- SQL statements for migrating up

CREATE TABLE room_types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    type_id INTEGER NOT NULL REFERENCES room_types(type_id),
    description TEXT,
    price DECIMAL(10, 2),
    availability BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'Available',  -- Available, Booked, Out of Service
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    guest_id INTEGER NOT NULL,  -- To be linked with Guest Service
    room_id INTEGER NOT NULL REFERENCES rooms(room_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',  -- Pending, Confirmed, Canceled
    total_amount DECIMAL(10, 2),
    payment_status VARCHAR(20) DEFAULT 'Pending',  -- Paid, Pending, Failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +goose Down
-- SQL statements for migrating down

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS room_types;
