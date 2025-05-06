const amqp = require("amqplib");
const axios = require("axios");

const RABBITMQ_URL = "amqp://localhost";
const HASURA_URL = "http://localhost:8080/v1/graphql";
const HASURA_ADMIN_SECRET = "supersecureadminsecret";

async function consumeQueue(queueName) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });

  console.log(`Waiting for messages in queue: ${queueName}`);

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const bookingEvent = JSON.parse(msg.content.toString());
      console.log("Received booking event:", bookingEvent);

      try {
        // Step 1: Create payment in Hasura
        const paymentPayload = {
          booking_id: bookingEvent.booking_id,
          amount: bookingEvent.total_amount,
          payment_method: "Credit Card", // Example payment method
          payment_status: "Complete",
        };

        const mutation = `
          mutation CreatePayment($paymentData: payments_insert_input!) {
            insert_payments_one(object: $paymentData) {
              payment_id
            }
          }
        `;

        const response = await axios.post(
          HASURA_URL,
          {
            query: mutation,
            variables: { paymentData: paymentPayload },
          },
          {
            headers: {
              "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Payment created successfully:", response.data);

        // Acknowledge the message
        channel.ack(msg);
      } catch (error) {
        console.error("Error creating payment:", error.response?.data || error.message);
        // Optionally, you can reject the message and requeue it
        channel.nack(msg, false, true);
      }
    }
  });
}

consumeQueue("booking_events").catch((error) => {
  console.error("Error consuming queue:", error);
});