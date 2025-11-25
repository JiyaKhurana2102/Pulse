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

    res.json({ message: 'User added to group' });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: error.message });
  }
};



module.exports = { createGroup, listGroups, joinGroup };
