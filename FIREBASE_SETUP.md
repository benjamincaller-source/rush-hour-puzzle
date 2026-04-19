# Firebase Setup — Rush Hour Puzzle

Follow these steps to enable user authentication (login, signup, email verification, password reset).

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Name it (e.g., `rush-hour-puzzle`)
4. Disable Google Analytics (not needed for this app)
5. Click **Create project**

## Step 2: Register a Web App

1. In your Firebase project, click the **Web** icon (`</>`) to add a web app
2. Name it `Rush Hour Puzzle`
3. **Do NOT** check "Firebase Hosting" (we don't need it)
4. Click **Register app**
5. You'll see a config block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "rush-hour-puzzle-xxxxx.firebaseapp.com",
  projectId: "rush-hour-puzzle-xxxxx",
  storageBucket: "rush-hour-puzzle-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

6. Copy these values.

## Step 3: Paste Config in index.html

Open `index.html` and find the `FIREBASE_CONFIG` section near the top of the `<script>` tag:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",          // ← Replace
  authDomain: "YOUR_PROJECT...",   // ← Replace
  projectId: "YOUR_PROJECT_ID",   // ← Replace
  storageBucket: "YOUR_PROJECT...",// ← Replace
  messagingSenderId: "YOUR_...",   // ← Replace
  appId: "YOUR_APP_ID"            // ← Replace
};
```

Replace each `"YOUR_..."` value with the corresponding value from Firebase.

## Step 4: Enable Firestore (for leaderboard)

1. In Firebase Console, go to **Build > Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (you can add security rules later)
4. Select a region closest to your users
5. Click **Enable**

Once enabled, go to the **Rules** tab and paste these security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This allows anyone to read the leaderboard but only authenticated users can write their own score.

## Step 5: Enable Email/Password Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Click **Email/Password**
5. Toggle **Enable** to ON
6. (Optional) Toggle **Email link (passwordless sign-in)** OFF
7. Click **Save**

## Step 6: Configure Authorized Domains

Firebase needs to know which domains your app runs on:

1. In **Authentication > Settings > Authorized domains**
2. The following are already added by default:
   - `localhost` (for local testing)
   - `your-project.firebaseapp.com`
3. If you deploy to a custom domain, add it here
4. For the iOS app (Capacitor), add: `localhost` and `capacitor://localhost`

## Step 7: Test It

1. Open `index.html` in a browser
2. Click **PLAY**
3. You should see the login/signup form
4. Create an account — you'll receive a verification email
5. Check your email and click the verification link

## Security Notes

- **Password requirements** are enforced client-side:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Firebase handles** password hashing (bcrypt/scrypt), rate limiting, and token management server-side
- **The API key** in the config is safe to include in client-side code — Firebase security rules control data access, not the API key
- User progress is stored in localStorage keyed to the Firebase user ID, so each account has its own progress

## Optional: Customize Email Templates

1. Go to **Authentication > Templates**
2. You can customize:
   - **Email address verification** — sent on signup
   - **Password reset** — sent when user clicks "Forgot password"
3. Change the sender name, subject, and body to match your brand

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Firebase is not configured" error | Make sure you replaced all `YOUR_...` values in FIREBASE_CONFIG |
| Signup fails silently | Open browser DevTools (F12) > Console to see Firebase errors |
| Email verification not received | Check spam folder; Firebase free tier has sending limits |
| "auth/too-many-requests" | Wait a few minutes — Firebase rate-limits auth attempts |
| App works but auth doesn't | Ensure Email/Password provider is enabled in Firebase Console |
