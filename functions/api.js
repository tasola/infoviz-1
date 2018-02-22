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
  } else {
    console.log('Här kommer top 100!');
    // SKicka alla top 100 users
  }

  /*
	var docRef = db.collection("cities").doc("SF");

	docRef.get().then(function(doc) {
	    if (doc.exists) {
	        console.log("Document data:", doc.data());
	    } else {
	        // doc.data() will be undefined in this case
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});*/
});

// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.use('/api', router);

// Export the api
module.exports = functions.https.onRequest(app);
