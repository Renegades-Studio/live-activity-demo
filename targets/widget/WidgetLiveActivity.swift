import ActivityKit
import WidgetKit
import SwiftUI

// MARK: - Utilities
extension Date {
  static func fromMilliseconds(_ milliseconds: Int64) -> Date {
    Date(timeIntervalSince1970: TimeInterval(milliseconds) / 1000.0)
  }
}

// MARK: - Common Components
struct TimerDisplay: View {
  let startTimeMs: Int64
  let endTimeMs: Int64
  let size: CGFloat
  let isDark: Bool
  
  private var startDate: Date {
    Date.fromMilliseconds(startTimeMs)
  }
  
  private var endDate: Date {
    Date.fromMilliseconds(endTimeMs)
  }
  
  var body: some View {
    Text(timerInterval: startDate...endDate, pauseTime: nil, countsDown: true)
      .foregroundStyle(Color(hex: "FFDF2B")!)
      .font(.comicSans(size: size, weight: .bold))
      .shadow(color: isDark ? Color(hex: "FFDF2B")! : .black, radius: 2)
  }
}

struct TopicDisplay: View {
  let title: String
  let isDark: Bool
  
  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text("topic of the day")
        .font(.comicSans(size: 12, weight: .bold))
        .foregroundStyle(isDark ? .white : .black)
        .shadow(color: .white, radius: isDark ? 0 : 2)
      Text(title)
        .font(.comicSans(size: 16))
        .foregroundStyle(isDark ? .white : .black)
        .shadow(color: .white, radius: isDark ? 0 : 2)
        .lineLimit(1)
    }
  }
}

struct ActionButton: View {
  let text: String
  let isDark: Bool
  
  var body: some View {
    Capsule()
      .fill(.white)
      .shadow(
        color: isDark ? .white.opacity(0.8) : .black.opacity(0.8),
        radius: 0, x: 2, y: 3
      )
      .overlay {
        Capsule()
          .stroke(.black, lineWidth: 1.5)
      }
      .frame(width: 114, height: 44)
      .overlay {
        Text(text)
          .font(.comicSans(size: 18, weight: .bold))
          .foregroundStyle(.black)
      }
  }
}

struct YapsterIcon: View {
  var body: some View {
    Image("yapster-round")
  }
}

// MARK: - Main Views
struct YapsterActivityView: View {
  let context: ActivityViewContext<WidgetAttributes>
  
  private var contentView: some View {
    switch context.state {
    case let .preGame(startTimeMs, endTimeMs, title):
      VStack {
        HStack {
          VStack(alignment: .leading, spacing: 0) {
            Text("game starts in")
              .font(.comicSans(size: 12, weight: .bold))
              .foregroundStyle(.black)
              .shadow(color: .white, radius: 2)
            TimerDisplay(
              startTimeMs: startTimeMs,
              endTimeMs: endTimeMs,
              size: 35.3,
              isDark: false
            )
          }
          Spacer()
          Image("big-yapster")
            .resizable()
            .aspectRatio(contentMode: .fit)
            .frame(height: 20)
            .padding(.trailing, 12)
        }
        Spacer()
        HStack(alignment: .bottom) {
          TopicDisplay(title: title, isDark: false)
          Spacer()
          ActionButton(text: "join game", isDark: false)
        }
      }
    }
  }
  
  var body: some View {
    VStack {
      contentView
    }
    .frame(maxHeight: .infinity)
    .padding(.top, 18)
    .padding(.bottom, 20.5)
    .padding(.horizontal, 24)
    .background {
      Image("cloud-background")
        .resizable()
        .scaledToFill()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .clipped()
    }
  }
}

struct YapsterIslandBottom: View {
  let context: ActivityViewContext<WidgetAttributes>
  
  var body: some View {
    switch context.state {
    case let .preGame(_, _, title):
      HStack(alignment: .bottom) {
        TopicDisplay(title: title, isDark: true)
        Spacer()
        ActionButton(text: "join game", isDark: true)
      }
    }
  }
}

struct DynamicIslandTimerView: View {
  let context: ActivityViewContext<WidgetAttributes>
  
  var body: some View {
    switch context.state {
    case let .preGame(startTimeMs, endTimeMs, _):
      if context.isStale {
        EmptyView()
      } else {
        let startDate = Date.fromMilliseconds(startTimeMs)
        let endDate = Date.fromMilliseconds(endTimeMs)
        Text(timerInterval: startDate...endDate, pauseTime: nil, countsDown: true)
          .foregroundStyle(Color(hex: "FFDF2B")!)
          .font(.comicSans(size: 14, weight: .bold))
          .frame(maxWidth: 50)
      }
    }
  }
}

// MARK: - Widget Configuration
struct WidgetLiveActivity: Widget {
  let kind: String = "Yapster_Widget"
  
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: WidgetAttributes.self) { context in
      YapsterActivityView(context: context)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          YapsterIcon()
            .padding(.leading, 5)
        }
        DynamicIslandExpandedRegion(.trailing) {
          DynamicIslandTimerView(context: context)
        }
        DynamicIslandExpandedRegion(.bottom) {
          YapsterIslandBottom(context: context)
            .padding(.bottom, 5)
            .padding(.horizontal, 5)
        }
      } compactLeading: {
        YapsterIcon()
      } compactTrailing: {
        DynamicIslandTimerView(context: context)
      } minimal: {
        YapsterIcon()
      }
    }
  }
}

// MARK: - Preview Extensions
extension WidgetAttributes {
  fileprivate static var preview: WidgetAttributes {
    WidgetAttributes()
  }
}

extension WidgetAttributes.ContentState {
  fileprivate static var preGameState: WidgetAttributes.ContentState {
    .preGame(
      startTimeMs: Int64(Int(Date().timeIntervalSince1970 * 1000)),
      endTimeMs: Int64(Int((Date().timeIntervalSince1970 + 600) * 1000)),
      title: "Trump wins presidency in landslide"
    )
  }
}

// MARK: - Previews
#Preview("Notification", as: .content, using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.preGameState
}
