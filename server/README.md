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
3. Note down your **Key ID** and **Team ID**
4. Copy the contents of your .p8 file

### 3. Configure Environment

```bash
# Copy the example file
cp env.example .env

# Edit .env with your credentials
```

**Example `.env` file:**

````env
# Option 1: Store key content directly (recommended for demo)
APN_KEY=-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
-----END PRIVATE KEY-----
APN_KEY_ID=ABC123DEF4
APPLE_TEAM_ID=XYZ789ABC1
PORT=3000

### 4. Start the Server

```bash
# Development mode (auto-restart)
yarn dev

# Or from project root
yarn server
````

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
