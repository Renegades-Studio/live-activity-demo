import ExpoModulesCore
import ActivityKit

public class LiveActivityInterfaceModule: Module {
    public func definition() -> ModuleDefinition {
        Name("LiveActivityInterface")
        
        AsyncFunction("getPushToStartToken") { (promise: Promise) in
            let logger = Logger(logHandlers: [createOSLogHandler(category: Logger.EXPO_LOG_CATEGORY)])
            logger.info("getPushToStartToken()")
            
            if #available(iOS 17.2, *) {
                Task {
                    for await pushToken in Activity<WidgetAttributes>.pushToStartTokenUpdates {
                        let pushTokenString = pushToken.reduce("") { $0 + String(format: "%02x", $1) }
                        logger.info("Push token received: \(pushTokenString)")
                        promise.resolve(pushTokenString)
                        break // Exit after first token
                    }
                }
            } else {
                promise.reject("ERR_VERSION", "iOS version is lower than 16.2. Live Activity is not available.")
            }
        }

        AsyncFunction("getPushToUpdateToken") { (promise: Promise) in
            let logger = Logger(logHandlers: [createOSLogHandler(category: Logger.EXPO_LOG_CATEGORY)])
            logger.info("getPushToUpdateToken()")

            if #available(iOS 17.2, *) {
                Task {
                    for await activity in Activity<WidgetAttributes>.activityUpdates {
                        Task {
                            for await tokenData in activity.pushTokenUpdates {
                                let token = tokenData.map {String(format: "%02x", $0)}.joined()
                                promise.resolve(token)
                            }
                        }
                    }
                }
            } else {
                promise.reject("ERR_VERSION", "iOS version is lower than 16.2. Live Activity is not available.")
            }
        }

        AsyncFunction("startActivity") { (startTimeMs: Int64, endTimeMs: Int64, title: String, type: String, promise: Promise) in
            let logger = Logger(logHandlers: [createOSLogHandler(category: Logger.EXPO_LOG_CATEGORY)])
            logger.info("startActivity()")
            
            if #available(iOS 16.2, *) {
                let attributes = WidgetAttributes()
                var contentState: WidgetAttributes.ContentState
                
                contentState = WidgetAttributes.ContentState.preGame(
                    startTimeMs: startTimeMs,
                    endTimeMs: endTimeMs,
                    title: title
                )
                
                let activityContent = ActivityContent(state: contentState, staleDate: nil)
                
                do {
                    let activity = try Activity.request(attributes: attributes, content: activityContent, pushType: .token)
                    promise.resolve(activity.id)
                } catch (let error) {
                    logger.info("Error requesting Live Activity \(error.localizedDescription).")
                    promise.reject("ERR_ACTIVITY", "Error requesting Live Activity \(error.localizedDescription).")
                }
            } else {
                logger.info("iOS version is lower than 16.2. Live Activity is not available.")
                promise.reject("ERR_VERSION", "iOS version is lower than 16.2. Live Activity is not available.")
            }
        }
    }
}
