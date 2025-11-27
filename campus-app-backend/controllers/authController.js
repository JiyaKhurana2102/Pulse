const admin = require('firebase-admin');

// SIGNUP
const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let userRecord;

    try {
      // Try creating a new Firebase user
      userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });

      // If created, write to Firestore
      const db = admin.firestore();
      await db.collection('users').doc(userRecord.uid).set({
        email,
        name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (createErr) {
      console.warn('createUser error (may be existing user):', createErr);

      // If the email already exists, fetch the existing user and proceed
      if (createErr?.errorInfo?.code === 'auth/email-already-exists' || createErr?.code === 'auth/email-already-exists') {
        userRecord = await admin.auth().getUserByEmail(email);

        // Ensure Firestore has a user doc (create or update)
        try {
          const db = admin.firestore();
          const userRef = db.collection('users').doc(userRecord.uid);
          const userDoc = await userRef.get();
          if (!userDoc.exists) {
            await userRef.set({
              email,
              name: name || userRecord.displayName || email.split('@')[0],
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          } else if (name && userDoc.data()?.name !== name) {
            await userRef.update({ name });
          }
        } catch (dbErr) {
          console.warn('Failed to ensure Firestore user doc for existing user:', dbErr);
        }
      } else {
        console.error('Error creating user:', createErr);
        return res.status(400).json({ error: createErr.message || 'User creation failed' });
      }
    }

    // 3. Generate custom token for immediate login
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    // 4. Exchange custom token for ID token using Firebase REST API
    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      console.error('Missing FIREBASE_API_KEY in environment');
      return res.status(500).json({ error: 'Missing FIREBASE_API_KEY in server configuration' });
    }

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
      console.error('Token exchange error:', tokenData);
      return res.status(400).json({ error: tokenData.error.message || tokenData.error });
    }

    res.json({
      message: 'Signup successful',
      user: {
        uid: userRecord.uid,
        email,
        name: name || userRecord.displayName || email.split('@')[0],
      },
      idToken: tokenData.idToken,
      refreshToken: tokenData.refreshToken,
    });

  } catch (err) {
    console.error('Error during signup:', err);
    // If this is a FirebaseAuthError with code info, forward a cleaner message
    const code = err?.errorInfo?.code || err?.code;
    if (code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(400).json({ error: err.message || 'Signup failed' });
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
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.uid; // from auth middleware

  try {
    // Get user's email from Firestore
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password by attempting to sign in
    const apiKey = process.env.FIREBASE_API_KEY;
    const verifyResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: currentPassword,
          returnSecureToken: false,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.error) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    await admin.auth().updateUser(userId, {
      password: newPassword,
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: error.message });
  }
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' });

    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing FIREBASE_API_KEY' });

    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok || data.error) {
      const msg = data.error?.message || 'Token refresh failed';
      return res.status(401).json({ error: msg });
    }

    return res.json({
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      userId: data.user_id,
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ error: 'Internal error refreshing token' });
  }
};

module.exports = { signup, login, changePassword, refreshToken };
