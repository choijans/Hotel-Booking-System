const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://localhost";

async function publishPaymentStatusUpdate(booking_id, payment_status) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queueName = "payment_events";

  await channel.assertQueue(queueName, { durable: true });

  const message = {
    booking_id,
    payment_status,
  };

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`Published payment status update:`, message);

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
