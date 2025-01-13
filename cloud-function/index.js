const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub({
  keyFilename: './my-kubernetes-project-444304-998516f6374c.json'
});

exports.publishMessage = async (req, res) => {
  // CORS setup
  res.set('Access-Control-Allow-Origin', '*'); // Replace '*' with your frontend's URL in production
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send(''); // Pre-flight request
    return;
  }

  const topicName = 'cloudfunction-topic'; // Replace with your Pub/Sub topic name
  const message = req.body.message || 'Hello, Pub/Sub!';
  
  if (!message) {
    return res.status(400).send('Message body is required.');
  }

  try {
    const dataBuffer = Buffer.from(message);
    await pubsub.topic(topicName).publishMessage({ data: dataBuffer });
    res.status(200).json({ message: 'Message published.' });
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).send('Error publishing message.');
  }
};

exports.pullMessages = async (req, res) => {
  // CORS setup
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send(''); // Pre-flight request
    return;
  }

  const subscriptionName = 'cloudfunction-topic-sub'; // Replace with your subscription name

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
};


