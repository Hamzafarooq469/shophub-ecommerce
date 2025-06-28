var admin = require("firebase-admin");

// Use credentials from environment variable (for deployment)
let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    console.log("✅ Using Firebase credentials from environment variable");
  } catch (error) {
    console.error("❌ Error parsing FIREBASE_CREDENTIALS:", error.message);
    process.exit(1);
  }
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  // Alternative: use individual environment variables
  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID || "",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
  };
  console.log("✅ Using Firebase credentials from individual environment variables");
} else {
  // fallback to local file for local development
  try {
    serviceAccount = require("./firebaseCredentials.json");
    console.log("✅ Using Firebase credentials from local file");
  } catch (error) {
    console.error("❌ Firebase credentials not found!");
    console.error("Please set either:");
    console.error("1. FIREBASE_CREDENTIALS environment variable (JSON string)");
    console.error("2. Individual variables: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL");
    console.error("3. firebaseCredentials.json file for local development");
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("🚀 Firebase Admin initialized successfully");

module.exports = admin;