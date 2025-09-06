<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Mj6U0no3KwY7b3C17_dY5b8a7m9zOhJZ

## Run Locally

This is now a full-stack application with a React frontend and a Node.js backend.

**Prerequisites:** Node.js

### 1. Frontend Setup (Root Directory)

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
   You can create this file if it doesn't exist:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### 2. Backend Setup (`backend` Directory)

1. Navigate to the backend directory:
   `cd backend`
2. Install backend dependencies:
   `npm install`
3. Create a `.env` file in the `backend` directory and add your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://ankitmgs:987654321@cluster0.6o3q9.mongodb.net/FitTrackAI?retryWrites=true&w=majority
   PORT=5000
   ```
4. **IMPORTANT: Firebase Admin SDK Setup**
   - Go to your Firebase project console.
   - Go to Project Settings > Service Accounts.
   - Click "Generate new private key" and download the JSON file.
   - Rename the downloaded file to `firebase-service-account-key.json`.
   - Place this file inside the `backend` directory. **This file is required for the backend to authenticate users.**

### 3. Run Both Servers

After setting up both the frontend and backend, navigate back to the root directory of the project.

1. Run the application:
   `npm run dev`

This command will start both the frontend Vite server and the backend Node.js server concurrently.