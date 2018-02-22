// Imports
const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Init Firebase Admin
try {
  admin.initializeApp(functions.config().firebase);
} catch (e) {
  console.log('App already initialized...');
}

// Setup Firestore references
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// Router setup
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Make stuff happen here!
router.get('/users', (req, res) => {
  const requestID = req.query.id;
  console.log(requestID);
  if (requestID) {
    // skicka specifik user
    const usersRef = db.collection('users').doc(requestID);
    usersRef.get().then((doc) => {
      if (doc.exists) {
        return res.status(200).send(doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
        return res.status(500);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  }

  else {
    const usersRef = db.collection('users')
    var obj_counter = 0;
    var top_hundred = [];
    usersRef.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        obj_counter++;
        if (obj_counter >= 101){
          return false;
        }
        top_hundred.push(doc.data());
        console.log(obj_counter, " => ", doc.data());
      });
      return res.status(200).send(top_hundred);
    }
  )
  .catch((error) => {
    res.status(500).send(error);
  });
}
});

app.use('/api', router);

// Export the api
module.exports = functions.https.onRequest(app);