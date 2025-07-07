# Building Live Activities in Expo: Complete Guide with Remote Start and Update

iOS Live Activities provide real-time, glanceable updates that appear in the Dynamic Island and Lock Screen, keeping users engaged with your app even when it's not active. While several tutorials cover basic Live Activity setup in Expo apps, most focus only on locally-triggered activities. This comprehensive guide fills that gap by showing you how to build Live Activities that can be **started and updated remotely** using Apple Push Notifications (APNs), making them truly dynamic and server-driven.

We'll be building this using **Yapster**, a social app that uses Live Activities to show real-time conversation updates. By the end of this tutorial, you'll have a complete system that can start Live Activities from your server and update them in real-time.

## What You'll Build

- **Remote Live Activity Control**: Start Live Activities from your server using APNs
- **Real-time Updates**: Update Live Activity content dynamically while running
- **Dynamic Island Integration**: Beautiful, context-aware Live Activity views
- **Lock Screen Widgets**: Rich Live Activity displays on the lock screen
- **Server Infrastructure**: Express server handling APNs push notifications

## Prerequisites

Before we begin, ensure you have:

- **macOS** with Xcode 14.1+ installed
- **Apple Developer Account** (required for Live Activities)
- **Node.js** and **yarn/npm**
- **Expo CLI** (`npm install -g @expo/cli`)
- Basic knowledge of React Native and Swift

**Important**: Live Activities are iOS 16.1+ only and require a physical device or iOS Simulator for testing.

## Step 1: Create Your Expo Project

Start by creating a new Expo project with the latest template:

```bash
npx create-expo-app --template
# Choose the Navigation template for a more complete starting point
```

**[CODE TEMPLATE: Basic project setup commands]**

## Step 2: Add Live Activity Support to app.json

Configure your app to support Live Activities by adding the necessary permissions:

**[CODE TEMPLATE: app.json configuration with team ID and Live Activity permissions]**

Key configuration points:

- `NSSupportsLiveActivities`: Enables Live Activities for your app
- `NSSupportsLiveActivitiesFrequentUpdates`: Allows frequent updates via push notifications
- Apple Team ID is required for push notifications

## Step 3: Create the Widget Target

Live Activities in iOS are technically App Extensions, so we need to create a separate target for our widget. We'll use the excellent `expo-apple-targets` tool:

```bash
npx create-expo-target widget
```

This creates a `targets/widget/` directory with the basic structure for your Live Activity widget.

**[CODE TEMPLATE: Widget target structure and initial setup]**

### Configure the Widget Target

Update the `expo-target.config.js` to properly configure your widget:

**[CODE TEMPLATE: expo-target.config.js configuration]**

## Step 4: Design Your Live Activity in Swift

Now comes the fun part - designing your Live Activity! Open Xcode and navigate to your widget target files.

### Clean Up and Organize

First, let's organize our Swift files for better maintainability:

1. **Delete unnecessary files**: Remove all Swift files except `WidgetLiveActivity.swift` and `index.swift`
2. **Create Attributes.swift**: Move Live Activity attributes to a separate file
3. **Set up your Live Activity types**: Define enum cases for different activity states

**[CODE TEMPLATE: Attributes.swift with ActivityAttributes protocol]**

### Implement the Live Activity Views

Live Activities have multiple view states you need to design:

1. **Notification Center View**: The expanded view when users long-press
2. **Dynamic Island Compact View**: Small view in the Dynamic Island
3. **Dynamic Island Expanded View**: Larger view when Dynamic Island is tapped

**[CODE TEMPLATE: Complete WidgetLiveActivity.swift with all view implementations]**

### Preview Your Design

Use Xcode's preview feature to iterate on your design:

**[CODE TEMPLATE: SwiftUI preview code for testing designs]**

## Step 5: Create the Expo Module Interface

To communicate between your React Native code and the Swift Live Activity code, we need to create a custom Expo module:

```bash
npx create-expo-module@latest --local
# Name it something like "live-activity-interface"
```

### Configure the Module

**[CODE TEMPLATE: expo-module.config.json configuration]**

### Create Shared Attributes

Create an identical `Attributes.swift` file in your module's iOS folder to ensure consistency:

**[CODE TEMPLATE: Module Attributes.swift file]**

### Implement the Module Interface

Create the Swift module that will handle Live Activity operations:

**[CODE TEMPLATE: LiveActivityInterfaceModule.swift with start/update/end functions]**

### TypeScript Interface

Define the TypeScript interface for your module:

**[CODE TEMPLATE: TypeScript module interface and types]**

## Step 6: Add Push Notification Capabilities

In Xcode, add the Push Notifications capability to your main app target:

1. Open your project in Xcode: `xed ios`
2. Select your app target
3. Go to "Signing & Capabilities"
4. Click "+" and add "Push Notifications"

**[CODE TEMPLATE: Visual guide or entitlements file example]**

## Step 7: Set Up the Server Infrastructure

This is where our tutorial diverges from others - we're building a complete server solution for remote Live Activity management.

### Create the Express Server

**[CODE TEMPLATE: Complete Express server setup with APNs integration]**

Key components:

- **APNs Provider**: Handles Apple Push Notification service connections
- **Live Activity Service**: Manages Live Activity lifecycle
- **Token Management**: Handles push-to-start and push-to-update tokens

### Configure APNs Credentials

**[CODE TEMPLATE: Environment configuration and APNs setup]**

## Step 8: Implement Client-Side Token Management

Your React Native app needs to manage push tokens and communicate with your server:

### Create Context for Token Management

**[CODE TEMPLATE: LiveActivityContext with token management]**

### Implement APNs Service

**[CODE TEMPLATE: Client-side service for communicating with server]**

### Create the Live Activity Hook

**[CODE TEMPLATE: Custom hook for Live Activity operations]**

## Step 9: Build the User Interface

Create a beautiful interface for testing your Live Activities:

**[CODE TEMPLATE: React Native UI components for starting/updating/ending Live Activities]**

## Step 10: Testing and Debugging

### Local Testing

1. **Start your server**: `yarn server`
2. **Build and run your app**: `npx expo run:ios`
3. **Test the flow**: Start → Update → End

### Physical Device Testing

For testing on physical devices, use ngrok to expose your local server:

```bash
npm install -g ngrok
ngrok http 3000
```

**[CODE TEMPLATE: Device testing configuration changes]**

### Common Issues and Solutions

**[CODE TEMPLATE: Troubleshooting guide with common issues]**

## Step 11: Production Considerations

### Server Deployment

**[CODE TEMPLATE: Production server deployment guide]**

### Security Best Practices

**[CODE TEMPLATE: Security considerations and implementation]**

### Performance Optimization

**[CODE TEMPLATE: Performance tips and optimizations]**

## Conclusion

You've now built a complete Live Activity system with remote start and update capabilities! Your users can receive real-time updates through beautiful, interactive widgets that appear in the Dynamic Island and Lock Screen.

This setup provides the foundation for powerful user engagement features that keep your app relevant even when it's not actively being used. The remote control capability opens up possibilities for server-driven experiences, real-time collaboration features, and much more.

### Next Steps

- **Customize the design** to match your app's branding
- **Add more Live Activity types** for different use cases
- **Implement analytics** to track Live Activity engagement
- **Explore advanced features** like interactive buttons and deep linking

### Resources

- [Apple Live Activities Documentation](https://developer.apple.com/documentation/activitykit)
- [Expo Apple Targets](https://github.com/EvanBacon/expo-apple-targets)
- [APNs Provider API](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server)

---

_This tutorial was created using Yapster, a social app that leverages Live Activities for real-time conversation updates. The complete example code is available on GitHub._
