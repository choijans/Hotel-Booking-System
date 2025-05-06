const express = require("express");
const amqp = require("amqplib");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from the frontend
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allowed headers
}));

const RABBITMQ_URL = "amqp://localhost";
const HASURA_URL = "http://localhost:8080/v1/graphql";
const HASURA_ADMIN_SECRET = "supersecureadminsecret";

// Function to publish a message to RabbitMQ
async function publishToQueue(queueName, message) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log(`Message published to queue: ${queueName}`);
  await channel.close();
  await connection.close();
}

// Route to handle booking creation
app.post("/createbooking", async (req, res) => {
  const bookingPayload = {
    room_id: req.body.room_id,
    guest_id: req.body.guest_id,
    check_in_date: req.body.check_in_date,
    check_out_date: req.body.check_out_date,
    total_amount: req.body.total_amount,
    status: "Pending", // Initial status
    payment_status: "Pending",
  };

  try {
    // Step 1: Insert booking into Hasura
    const mutation = `
      mutation CreateBooking($bookingData: bookings_insert_input!) {
        insert_bookings_one(object: $bookingData) {
          booking_id
        }
      }
    `;

    const response = await axios.post(
      HASURA_URL,
      {
        query: mutation,
        variables: { bookingData: bookingPayload },
      },
      {
        headers: {
          "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    const bookingId = response.data.data.insert_bookings_one.booking_id;

    // Step 2: Publish booking event to RabbitMQ
    const bookingEvent = {
      booking_id: bookingId,
      room_id: bookingPayload.room_id,
      guest_id: bookingPayload.guest_id,
      total_amount: bookingPayload.total_amount,
    };

    await publishToQueue("booking_events", bookingEvent);

    // Step 3: Respond to the frontend
    res.status(201).json({
      message: "Booking created successfully and event published.",
      booking_id: bookingId,
    });
  } catch (error) {
    console.error("Error creating booking:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to create booking." });
  }
});

// Add a root route to confirm the service is running
app.get("/", (req, res) => {
  res.send("Booking Service is running!");
});

// Start the server and log a confirmation message
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Booking Service is running on http://localhost:${PORT}`);
});