-- +goose Up
-- SQL statements for migrating up

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,  -- To be linked with Booking Service
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),  -- e.g., Credit Card, PayPal, Cash on Arrival
    payment_status VARCHAR(20) DEFAULT 'Pending',  -- Paid, Pending, Failed
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,  -- To be linked with Booking Service
    total_amount DECIMAL(10, 2) NOT NULL,
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT 'Unpaid'  -- Paid, Unpaid
);

CREATE TABLE transaction_logs (
    transaction_id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL REFERENCES payments(payment_id),
    status VARCHAR(20),  -- Success, Failed
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_gateway VARCHAR(50),  -- e.g., Stripe, PayPal
    error_details TEXT  -- Details for failed transactions
);

-- +goose Down
-- SQL statements for migrating down

DROP TABLE IF EXISTS transaction_logs;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS payments;
