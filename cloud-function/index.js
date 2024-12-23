const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());
app.options('*', cors());

const pubsub = new PubSub({
 keyFilename: './my-kubernetes-project-444304-998516f6374c.json'
});

const topicName = 'cloudfunction-topic'; 
const subscriptionName = 'cloudfunction-sub'; 

app.post('/publish', async (req, res) => {
  const message = req.body.message;
  res.set('Access-Control-Allow-Origin', 'http://localhost:4200'); // Replace '*' with your frontend's URL in production
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
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
      res.status(200).json({ success: true, messages });
    }, 5000);
  } catch (error) {
    console.error('Error pulling messages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to the Pub/Sub backend server!');
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

