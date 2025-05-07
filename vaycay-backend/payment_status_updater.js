const amqp = require("amqplib");
const axios = require("axios");

const RABBITMQ_URL = "amqp://localhost";
const HASURA_URL = "http://localhost:8080/v1/graphql";
const HASURA_ADMIN_SECRET = "supersecureadminsecret";

async function publishPaymentStatusUpdate(booking_id, payment_status) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queueName = "payment_events";

  await channel.assertQueue(queueName, { durable: true });

  const message = {
    booking_id,
    payment_status,
  };

  // Publish the message to the RabbitMQ queue
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`Published payment status update:`, message);

  // Update the payment status in the database via Hasura
  try {
    const updatePaymentMutation = `
      mutation UpdatePaymentStatus($booking_id: Int!, $payment_status: String!) {
        update_payments(
          where: { booking_id: { _eq: $booking_id } },
          _set: { payment_status: $payment_status }
        ) {
          affected_rows
          returning {
            payment_id
            payment_status
          }
        }
      }
    `;

    const response = await axios.post(
      HASURA_URL,
      {
        query: updatePaymentMutation,
        variables: {
          booking_id, // Use booking_id to find the payment record
          payment_status,
        },
      },
      {
        headers: {
          "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    const updatedPayments = response.data.data.update_payments.returning;
    if (updatedPayments.length > 0) {
      console.log("Payment status updated in database:", updatedPayments);
    } else {
      console.log("No payment records found for the given booking_id.");
    }
  } catch (error) {
    console.error("Failed to update payment status in database:", error.response?.data || error.message);
  }

  await channel.close();
  await connection.close();
}

// Example usage for manual testing:
const bookingIdArg = parseInt(process.argv[2]);
const statusArg = process.argv[3];

if (!bookingIdArg || !statusArg) {
  console.error("Usage: node payment_status_updater.js <booking_id> <payment_status>");
  process.exit(1);
}

publishPaymentStatusUpdate(bookingIdArg, statusArg).catch(console.error);