// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config(); // Load .env variables

// Routes
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const chatbotRoutes = require('./routes/chatbot');
const eventRoutes = require('./routes/events');
// const chatRoutes = require('./routes/chat'); // Not needed for basic functionality


const app = express();

// -------------------
// Middleware
// -------------------
app.use(cors());
app.use(bodyParser.json());

// -------------------
// Firebase Admin Init
// -------------------
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    console.log('Loaded service account from FIREBASE_SERVICE_ACCOUNT_JSON env variable');
  } else if (process.env.FIREBASE_KEY_PATH) {
    serviceAccount = require(process.env.FIREBASE_KEY_PATH);
    console.log('Loaded service account from FIREBASE_KEY_PATH file');
  } else {
    throw new Error('Missing both FIREBASE_SERVICE_ACCOUNT_JSON and FIREBASE_KEY_PATH');
  }
} catch (err) {
  console.error('Failed to load Firebase service account:', err.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('Firebase Admin initialized successfully.');

// Make Firestore accessible in routes/controllers
app.locals.db = admin.firestore();

// -------------------
// Routes
// -------------------
app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);
app.use('/events', eventRoutes);
app.use('/chatbot', chatbotRoutes);

// -------------------
// Test route (optional)
// -------------------
app.get('/ping', (req, res) => {
  console.log('Ping route hit');
  res.send('pong');
});
// Lightweight health endpoint for deployment/tunnel checks
app.get('/health', (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

// Optional Firebase test route (can remove later)
app.get('/test-firebase', async (req, res) => {
  console.log('Test-firebase route hit');
  try {
    const user = await admin.auth().createUser({
      email: "testuser2@example.com",
      password: "password123"
    });
    res.json({
      message: "Test user created successfully",
      user
    });
  } catch (err) {
    console.error("Firebase error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------
// Global error handler
// -------------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message });
});

app.get('/debug/firestore', async (req, res) => {
  try {
    const doc = await admin.firestore().collection('groups').limit(1).get();
    res.json({ success: true, count: doc.size });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const fs = require('fs');
console.log("Looking for key at:", process.env.FIREBASE_KEY_PATH);
console.log("Exists?:", fs.existsSync(process.env.FIREBASE_KEY_PATH));

app.get('/debug/group-test', async (req, res) => {
  const db = admin.firestore();

  try {
    const doc = await db.collection('groups').doc('test').get();
    res.json({ 
      exists: doc.exists,
      data: doc.data() || null 
    });
  } catch (err) {
    res.json({ error: err.code, message: err.message });
  }
});

// Correct POST /groups handler
app.post('/groups', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Missing name or description" });
    }

    const newGroupRef = await db.collection('groups').add({
      name,
      description,
      members: [],
      events: []
    });

    res.status(201).json({ message: "Group created", groupId: newGroupRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// -------------------
// Start server
// -------------------
// Switched default port to 8080 to align with mobile client API base.
// You can override via environment variable PORT.
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access from device: Run 'ipconfig' to find your IP, then use http://YOUR_IP:${PORT}`);
});
