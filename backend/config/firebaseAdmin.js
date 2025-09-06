import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// The service account key is loaded from the JSON file.
// Using readFile is more robust than a direct import for some environments.
const serviceAccount = JSON.parse(
  await readFile(
    new URL('../firebase-service-account-key.json', import.meta.url)
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
