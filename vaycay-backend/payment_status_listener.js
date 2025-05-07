const amqp = require("amqplib");
const axios = require("axios");

const RABBITMQ_URL = "amqp://localhost";
const HASURA_URL = "http://localhost:8080/v1/graphql";
const HASURA_ADMIN_SECRET = "supersecureadminsecret";

async function consumePaymentUpdates(queueName) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });

  console.log(`Listening for payment updates in queue: ${queueName}`);

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const paymentEvent = JSON.parse(msg.content.toString());
      console.log("Received payment event:", paymentEvent);

      try {
        if (paymentEvent.payment_status === "Complete") {
          const updateBookingMutation = `
            mutation UpdateBookingStatus($booking_id: Int!) {
              update_bookings_by_pk(
                pk_columns: { booking_id: $booking_id },
                _set: { status: "Confirmed", payment_status: "Confirmed" }
              ) {
                booking_id
                status
                payment_status
              }
            }
          `;

          const response = await axios.post(
            HASURA_URL,
            {
              query: updateBookingMutation,
              variables: { booking_id: paymentEvent.booking_id },
            },
            {
              headers: {
                "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Booking confirmed based on payment:", response.data);
        } else {
          console.log("Payment status not complete. Ignoring.");
        }

        channel.ack(msg);
      } catch (error) {
        console.error("Failed to update booking:", error.response?.data || error.message);
        channel.nack(msg, false, true);
      }
    }
  });
}

consumePaymentUpdates("payment_events").catch(console.error);
