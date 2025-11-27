// controllers/groupsController.js
// Do NOT initialize firebase-admin here
const admin = require('firebase-admin'); // OK to import for FieldValue

const createGroup = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description required' });
    }

    const newGroupRef = await db.collection('groups').add({
      name,
      description,
      members: [],
      events: []
    });

    res.status(201).json({ message: 'Group created', groupId: newGroupRef.id });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: error.message });
  }
};

const listGroups = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const groupsSnapshot = await db.collection('groups').get();

    const groups = groupsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(groups);
  } catch (error) {
    console.error('List groups error:', error);
    res.status(500).json({ error: error.message });
  }
};

const joinGroup = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id: groupId } = req.params;
    const { userId } = req.body;

    const groupDoc = await db.collection('groups').doc(groupId).get();
    if (!groupDoc.exists) return res.status(404).json({ error: 'Group not found' });

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    await db.collection('groups').doc(groupId).update({
      members: admin.firestore.FieldValue.arrayUnion(userId)
    });

    await db.collection('users').doc(userId).update({
      groups: admin.firestore.FieldValue.arrayUnion(groupId)
    });

    // Post a system message announcing the join
    const userName = userDoc.data()?.name || 'A member';
    await db.collection('messages').add({
      groupID: groupId,
      userId: 'system',
      senderName: 'System',
      text: `${userName} joined the chat`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      type: 'system',
    });

    res.json({ message: 'User added to group' });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: error.message });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id: groupId } = req.params;
    const userId = req.user.uid; // from auth middleware

    const groupRef = db.collection('groups').doc(groupId);
    const groupDoc = await groupRef.get();
    if (!groupDoc.exists) return res.status(404).json({ error: 'Group not found' });

    const groupData = groupDoc.data();
    if (!groupData.members.includes(userId)) {
      // Idempotent: if not a member, just acknowledge
      return res.json({ message: 'Already not a member' });
    }

    // Get user's name for system message
    const userDoc = await db.collection('users').doc(userId).get();
    const userName = userDoc.data()?.name || 'A member';

    // Create system message announcing the departure
    const messageData = {
      groupID: groupId,
      userId: 'system',
      senderName: 'System',
      text: `${userName} left the chat`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      type: 'system',
    };
    await db.collection('messages').add(messageData);

    // Remove user from group and group from user
    await groupRef.update({
      members: admin.firestore.FieldValue.arrayRemove(userId),
    });
    await db.collection('users').doc(userId).update({
      groups: admin.firestore.FieldValue.arrayRemove(groupId),
    });

    res.json({ message: 'Left group' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id: groupId } = req.params;
    const { text } = req.body;
    const userId = req.user.uid; // from auth middleware

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Verify user is member of group
    const groupDoc = await db.collection('groups').doc(groupId).get();
    if (!groupDoc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupData = groupDoc.data();
    if (!groupData.members.includes(userId)) {
      return res.status(403).json({ error: 'You must be a member of this group to send messages' });
    }

    // Get user's name
    const userDoc = await db.collection('users').doc(userId).get();
    const userName = userDoc.data()?.name || 'Unknown User';

    // Create message
    const messageData = {
      groupID: groupId,
      userId,
      senderName: userName,
      text: text.trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const messageRef = await db.collection('messages').add(messageData);

    res.status(201).json({
      id: messageRef.id,
      ...messageData,
      createdAt: Date.now(), // return timestamp for client
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id: groupId } = req.params;
    const userId = req.user.uid; // from auth middleware

    // Verify user is member of group
    const groupDoc = await db.collection('groups').doc(groupId).get();
    if (!groupDoc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupData = groupDoc.data();
    if (!groupData.members.includes(userId)) {
      return res.status(403).json({ error: 'You must be a member of this group to view messages' });
    }

    // Fetch messages for this group
    // Temporary fallback without composite index: drop orderBy and sort in code
    // If your index uses 'groupID' (capital D), change the where field below to 'groupID'
    const messagesSnapshot = await db
      .collection('messages')
      .where('groupID', '==', groupId)
      .get();

    const messages = messagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        groupId: data.groupID,
        userId: data.userId,
        senderName: data.senderName,
        text: data.text,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        type: data.type || 'user',
      };
    }).sort((a, b) => a.createdAt - b.createdAt);

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createGroup, listGroups, joinGroup, leaveGroup, sendMessage, getMessages };
