var admin = require('firebase-admin')

var serviceAccount = require('path/to/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://skbs-b0e5b.firebaseio.com',
})
