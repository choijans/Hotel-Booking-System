-- +goose Up
-- SQL statements for migrating up

CREATE TABLE guests (
    guest_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    birthdate DATE,
    contact_info JSONB,  -- Stores phone, email, etc.
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guest_preferences (
    preference_id SERIAL PRIMARY KEY,
    guest_id INTEGER NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
    preference_type VARCHAR(50),
    preference_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- +goose Down
-- SQL statements for migrating down

DROP TABLE IF EXISTS guest_preferences;
DROP TABLE IF EXISTS guests;
