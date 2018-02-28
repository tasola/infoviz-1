// Imports
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

// Init Firebase Admin
try {
  admin.initializeApp(functions.config().firebase);
} catch (e) {
  console.log('App already initialized...');
}

// Init the Firebase DB
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

module.exports = functions.firestore
  .document('users/{userId}')
  .onUpdate((event) => {
    const timestamp = moment(FieldValue.serverTimestamp()).startOf('day');
    const newData = event.data.data();
    const prevData = event.data.previous.data();

    if (newData.last_live_timestamp !== prevData.last_live_timestamp) {
      const avgCollection = db
        .collection('users')
        .doc(prevData.id)
        .collection('daily_average');

      avgCollection
        .where('timestamp', '==', timestamp.toDate())
        .get()
        .then((snapshot) => {
          if (!snapshot[0].exists) {
            return avgCollection.doc().set({
              entries: 1,
              total_viewers: prevData.last_viewer_count,
              avg_viewers: prevData.last_viewer_count,
              timestamp: timestamp.toDate(),
            });
          } else {
            const docData = snapshot[0].data();
            return avgCollection.doc(snapshot[0].id).set({
              entries: docData.entries + 1,
              total_viewers: docData.total_viewers + prevData.last_viewer_count,
              avg_viewers: Math.floor(
                (docData.total_viewers + prevData.last_viewer_count) /
                  (docData.entries + 1)
              ),
              timestamp: timestamp.toDate(),
            });
          }
        })
        .catch((error) => {
          return false;
        });
    } else {
      return false;
    }
  });
