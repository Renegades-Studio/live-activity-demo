# Live Activity Demo

A React Native Expo app demonstrating iOS Live Activities with real APNs integration via a local Express server.

## Features

- **Remote Live Activity Control**: Start Live Activities from your app and control them remotely
- **Real-time Updates**: Update Live Activity content dynamically while it's running
- **Dynamic Island Integration**: See your Live Activity appear in the Dynamic Island
- **Lock Screen Widgets**: Live Activities display on the lock screen with live data
- **Graceful Termination**: End Live Activities programmatically when done

## Quick Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd live-activity-demo
yarn install
```

### 2. Configure APNs (Required)

1. Get APNs credentials from [Apple Developer Console](https://developer.apple.com)

   - Create an **APNs Auth Key** (.p8 file)
   - Download the `.p8` file to your computer
   - Note your **Key ID** and **Team ID**

2. Configure server environment:

```bash
cd server
cp env.example .env
# Edit .env with your credentials
```

3. Open your downloaded `.p8` file in a text editor and copy the entire contents

4. Paste the private key content into your `.env` file:

```env
# Paste your ENTIRE .p8 file contents here (including BEGIN/END lines)
APN_KEY=-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
(your actual private key content)
...
-----END PRIVATE KEY-----
APN_KEY_ID=ABC123DEF4
APPLE_TEAM_ID=XYZ789ABC1
PORT=3000
```

### 3. Start the Demo

**Terminal 1 - Server:**

```bash
yarn server
```

**Terminal 2 - Build & Run App:**

```bash
# Build the app (required for native module compilation)
npx expo run:ios

# This builds the Live Activity native module and launches the app
# Note: Use yarn start only for development after initial build
```

### 4. Test Live Activities

1. Open the app in iOS Simulator
2. Wait for push token to be ready
3. Tap "Start Live Activity"
4. Check Dynamic Island for the Live Activity
5. Test "Update" and "End" functionality

## Physical Device Testing

For testing on a physical device, use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose server (in new terminal)
ngrok http 3000

# Update SERVER_BASE_URL in services/apnsService.ts to use ngrok URL
```

## How It Works

1. **App loads** → Gets push-to-start token
2. **User taps Start** → App calls local server with token and data
3. **Server** → Sends real APNs notification to Apple
4. **Apple** → Delivers Live Activity to device
5. **Updates/End** → Same flow with push-to-update token

## Project Structure

```
├── app/                    # React Native app screens
├── server/                 # Express server with APNs integration
├── services/apnsService.ts # HTTP client for server communication
├── contexts/               # Token management
└── modules/                # Live Activity native module
```

---

**Note:** This is a demo project. Production apps would need proper authentication, error handling, and server deployment.
