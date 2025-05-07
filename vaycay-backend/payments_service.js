const amqp = require("amqplib");
const axios = require("axios");

const RABBITMQ_URL = "amqp://localhost";
const HASURA_URL = "http://localhost:8080/v1/graphql";
const HASURA_ADMIN_SECRET = "supersecureadminsecret";

async function consumeQueue(queueName) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });

  console.log('Waiting for messages in queue: ${queueName}');

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const bookingEvent = JSON.parse(msg.content.toString());
      console.log("Received booking event:", bookingEvent);

      try {
        // Step 1: Create payment in Hasura
        const paymentPayload = {
          booking_id: bookingEvent.booking_id,
          amount: bookingEvent.total_amount,
          payment_method: "Credit Card", // Example method
          payment_status: "Pending", // You could change this dynamically if needed
        };

        const createPaymentMutation = `
          mutation CreatePayment($paymentData: payments_insert_input!) {
            insert_payments_one(object: $paymentData) {
              payment_id
              payment_status
            }
          }
        `;

        const paymentResponse = await axios.post(
          HASURA_URL,
          {
            query: createPaymentMutation,
            variables: { paymentData: paymentPayload },
          },
          {
            headers: {
              "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
              "Content-Type": "application/json",
            },
          }
        );

        const insertedPayment = paymentResponse.data.data.insert_payments_one;

        console.log("Payment created:", insertedPayment);

        // Step 2: Only update booking if payment is "Complete"
        if (insertedPayment.payment_status === "Complete") {
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

          const updateResponse = await axios.post(
            HASURA_URL,
            {
              query: updateBookingMutation,
              variables: { booking_id: bookingEvent.booking_id },
            },
            {
              headers: {
                "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Booking updated to Confirmed:", updateResponse.data);
        } else {
          console.log("Payment status is not Complete. Booking will not be updated.");
        }

        // Step 3: Acknowledge the message
        channel.ack(msg);
      } catch (error) {
        console.error("Error processing booking event:", error.response?.data || error.message);
        channel.nack(msg, false, true); // Requeue the message
      }
    }
  });
}

consumeQueue("booking_events").catch((error) => {
  console.error("Error consuming queue:", error);
});
