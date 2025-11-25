const admin = require('firebase-admin');

// Create a new event
const createEvent = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { title, description, group, date } = req.body;

    // Validate fields
    if (!group || typeof group !== 'string' || group.trim() === "") {
      return res.status(400).json({ error: "Missing or invalid group ID" });
    }

    if (!title || !description || !date) {
      return res.status(400).json({ error: "Missing required event fields" });
    }

    // Check if group exists
    const groupDoc = await db.collection('groups').doc(group).get();
    if (!groupDoc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Add event
    const newEventRef = await db.collection('events').add({
      title,
      description,
      group,
      date,
      attendees: []
    });

    // Add event to group's event list
    await db.collection('groups').doc(group).update({
      events: admin.firestore.FieldValue.arrayUnion(newEventRef.id)
    });

    res.status(201).json({ message: 'Event created', eventId: newEventRef.id });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message });
  }
};

// List events in a group
const listEventsInGroup = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id: groupId } = req.params;

    const groupDoc = await db.collection('groups').doc(groupId).get();
    if (!groupDoc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const eventsSnapshot = await db.collection('events')
      .where('group', '==', groupId)
      .get();

    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(events);

  } catch (error) {
    console.error('List events error:', error);
    res.status(500).json({ error: error.message });
  }
};

// RSVP to event
const rsvpEvent = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id: eventId } = req.params;
    const { userId } = req.body;

    const eventDoc = await db.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const eventData = eventDoc.data();
    const groupId = eventData.group;

    const groupDoc = await db.collection('groups').doc(groupId).get();
    if (!groupDoc.exists) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupData = groupDoc.data();
    if (!groupData.members.includes(userId)) {
      return res.status(403).json({ error: 'User is not a member of this group' });
    }

    await db.collection('events').doc(eventId).update({
      attendees: admin.firestore.FieldValue.arrayUnion(userId)
    });

    await db.collection('users').doc(userId).update({
      eventsRSVPed: admin.firestore.FieldValue.arrayUnion(eventId)
    });

    res.json({ message: 'RSVP confirmed' });

  } catch (error) {
    console.error('RSVP event error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  listEventsInGroup,
  rsvpEvent
};
