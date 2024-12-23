// const express = require('express');
// const { PubSub } = require('@google-cloud/pubsub');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();


// app.use(cors({
//   origin: 'http://localhost:4200',
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type'],
// }));

// app.use(bodyParser.json());
// app.options('*', cors());

// const pubsub = new PubSub({});

// const topicName = 'cloudfunction-topic'; 
// const subscriptionName = 'cloudfunction-sub'; 

// app.post('/publish', async (req, res) => {
//   const message = req.body.message;
//   if (!message || message.trim() === '') {
//     return res.status(400).json({ success: false, error: 'Message is required' });
//   }

//   console.log('Received request with message:', message);

//   try {
//     const dataBuffer = Buffer.from(message);
//     const messageId = await pubsub.topic(topicName).publishMessage({
//       data: dataBuffer,
//     });

//     console.log(`Message published with ID: ${messageId}`);
//     res.status(200).json({ success: true, messageId });
//   } catch (error) {
//     console.error('Error publishing message:', error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// app.get('/pull', async (req, res) => {
//   try {
//     const subscription = pubsub.subscription(subscriptionName);

//     const messages = [];
//     const messageHandler = (message) => {
//       messages.push(message.data.toString());
//       message.ack();
//     };

//     subscription.on('message', messageHandler);

//     setTimeout(() => {
//       subscription.removeListener('message', messageHandler);
//       res.status(200).json({ success: true, messages });
//     }, 5000);
//   } catch (error) {
//     console.error('Error pulling messages:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// app.get('/', (req, res) => {
//   res.send('Welcome to the Pub/Sub backend server!');
// });


// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Backend server running on port ${PORT}`);
// });


const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Enable CORS with custom configuration
app.use(
  cors({
    origin: 'http://localhost:4200', // Allow requests from this origin
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type'], // Allowed headers
  })
);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Fallback CORS configuration (not required but included for safety)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing purposes only)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Handle preflight requests
app.options('*', cors());

// Google Cloud Pub/Sub setup
const pubsub = new PubSub({});
const topicName = 'cloudfunction-topic'; // Replace with your topic name
const subscriptionName = 'cloudfunction-sub'; // Replace with your subscription name

// Publish Message to Pub/Sub
app.post('/publish', async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === '') {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  console.log('Received request to publish message:', message);

  try {
    const dataBuffer = Buffer.from(message);
    const messageId = await pubsub.topic(topicName).publish({ data: dataBuffer });

    console.log(`Message published with ID: ${messageId}`);
    res.status(200).json({ success: true, messageId });
  } catch (error) {
    console.error('Error publishing message:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Pull Messages from Pub/Sub
app.get('/pull', async (req, res) => {
  try {
    const subscription = pubsub.subscription(subscriptionName);

    const messages = [];
    const messageHandler = (message) => {
      messages.push(message.data.toString());
      message.ack();
    };

    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log('Retrieved messages:', messages);
      res.status(200).json({ success: true, messages });
    }, 5000);
  } catch (error) {
    console.error('Error pulling messages:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Example test route
app.get('/test', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Pub/Sub backend server!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
