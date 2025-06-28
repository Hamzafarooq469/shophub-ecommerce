var admin = require("firebase-admin");

// Use credentials from environment variable (for deployment)
let serviceAccount;
if (process.env.FIREBASE_CREDENTIALS) {
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
  // fallback to local file for local development
  serviceAccount = require("./firebaseCredentials.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;