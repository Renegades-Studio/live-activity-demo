# Live Activity Server

A simple Express server that sends real APNs Live Activity notifications for the React Native demo.

## Quick Setup

### 1. Install Dependencies

```bash
cd server
yarn install
```

### 2. Get APNs Credentials

1. Go to [Apple Developer Console](https://developer.apple.com)
2. Create an **APNs Auth Key** (.p8 file)
3. Download the `.p8` file to your computer
4. Note down your **Key ID** and **Team ID**

### 3. Configure Environment

```bash
# Copy the example file
cp env.example .env

# Edit .env with your credentials
```

1. Open your downloaded `.p8` file in a text editor
2. Copy the entire contents (including BEGIN/END lines)
3. Paste into your `.env` file:

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

### 4. Start the Server

```bash
# Development mode (auto-restart)
yarn dev

# Or from project root
yarn server
```

## Testing

**Start Live Activity:**

```bash
curl -X POST http://localhost:3000/api/live-activity/start \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your_push_token_here",
    "payload": {
      "title": "Test Activity",
      "startTimeMs": 1640995200000,
      "endTimeMs": 1640998800000
    },
    "isSandbox": true
  }'
```

## API Endpoints

- `POST /api/live-activity/start` - Start live activity
- `POST /api/live-activity/update` - Update live activity
- `POST /api/live-activity/end` - End live activity

## Usage with React Native App

1. Start this server: `yarn server`
2. Start React Native app: `yarn start` (from project root)
3. The RN app will make HTTP requests to `localhost:3000`

**Note:** The React Native app automatically determines the APNs environment:

- **Development mode** (`yarn start`): Uses sandbox APNs (`isSandbox: true`)
- **Production builds**: Uses production APNs (`isSandbox: false`)

---

**Note:** This is a demo server. In production, you'd want proper error handling, rate limiting, authentication, etc.
