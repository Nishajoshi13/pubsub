const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// Configure CORS to allow all origins (adjust this for production)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

// Initialize Pub/Sub client with credentials
const pubsub = new PubSub({
  keyFilename: './my-kubernetes-project-444304-998516f6374c.json'
});

// Define Pub/Sub topic and subscription names
const topicName = 'topic1';
const subscriptionName = 'subscription1';

// Publish a message to the topic
app.post('/publish', async (req, res) => {
  const message = req.body.message;
  if (!message) {
    return res.status(400).send('Message body is required.');
  }
  try {
    const dataBuffer = Buffer.from(message);
    await pubsub.topic(topicName).publishMessage({ data: dataBuffer });
    res.status(200).send('Message published.');
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).send('Failed to publish message.');
  }
});

// Pull messages from the subscription
app.get('/pull', async (req, res) => {
  try {
    const subscription = pubsub.subscription(subscriptionName);

    const messages = [];

    const messageHandler = (message) => {
      messages.push(message.data.toString());
      message.ack();
    };

    // Listen for new messages
    subscription.on('message', messageHandler);

    // Set a timeout to stop listening for messages
    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      res.status(200).json({ messages });
    }, 5000); // Wait for 5 seconds to collect messages
  } catch (error) {
    console.error('Error pulling messages:', error);
    res.status(500).send('Failed to pull messages.');
  }
});

// Default route for health check
app.get('/', (req, res) => {
  res.send('Welcome to the Pub/Sub backend server!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
