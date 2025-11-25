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

    res.json({
      message: "Signup successful",
      uid: userRecord.uid,
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

    res.json({
      message: 'Login successful',
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      uid: data.localId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login };
