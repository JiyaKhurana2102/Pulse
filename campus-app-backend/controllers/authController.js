const admin = require('firebase-admin');

// SIGNUP
const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. Create the Firebase user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Write to Firestore
    const db = admin.firestore();

    await db.collection("users")
      .doc(userRecord.uid)
      .set({
        email,
        name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    // 3. Generate custom token for immediate login
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    
    // 4. Exchange custom token for ID token using Firebase REST API
    const apiKey = process.env.FIREBASE_API_KEY;
    const tokenResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: customToken,
          returnSecureToken: true,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error.message });
    }

    res.json({
      message: "Signup successful",
      user: {
        uid: userRecord.uid,
        email,
        name,
      },
      idToken: tokenData.idToken,
      refreshToken: tokenData.refreshToken,
    });

  } catch (err) {
    console.error("Error during signup:", err);
    res.status(400).json({ error: err.message });
  }
};


// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  const apiKey = process.env.FIREBASE_API_KEY; // MUST be in .env

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing FIREBASE_API_KEY in .env' });
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Fetch user data from Firestore
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(data.localId).get();
    const userData = userDoc.data();

    res.json({
      message: 'Login successful',
      user: {
        uid: data.localId,
        email: data.email,
        name: userData?.name || email.split('@')[0],
      },
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login };
