import ActivityKit
import WidgetKit
import SwiftUI


// Common components
struct TimerDisplay: View {
  let startTimeMs: Int64
  let endTimeMs: Int64
  let size: CGFloat
  let isDark: Bool
  
  private var startDate: Date {
    Date(timeIntervalSince1970: TimeInterval(startTimeMs) / 1000.0)
  }
  
  private var endDate: Date {
    Date(timeIntervalSince1970: TimeInterval(endTimeMs) / 1000.0)
  }
  
  var body: some View {
    Text(timerInterval: startDate...endDate, pauseTime: nil, countsDown: true)
      .foregroundColor(Color(hex: "FFDF2B")!)
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


// Main views
struct YapsterActivityView: View {
  let context: ActivityViewContext<WidgetAttributes>
  @Environment(\.colorScheme) var colorScheme
  
  private func contentView() -> some View {
    switch context.state {
    case let .preGame(startTimeMs, endTimeMs, title):
      return VStack {
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
      contentView()
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
  @Environment(\.colorScheme) var colorScheme
  
  var body: some View {
    HStack(alignment: .bottom) {
      TopicDisplay(title: "topic of the day", isDark: true)
      Spacer()
      ActionButton(text: "join game", isDark: true)
    }
  }
}

struct WidgetLiveActivity: Widget {
  let kind: String = "Yapster_Widget"
  
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: WidgetAttributes.self) { context in
      YapsterActivityView(context: context)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          switch context.state {
          case .preGame:
            Image("yapster-round")
              .padding(.leading, 5)
          }
        }
        DynamicIslandExpandedRegion(.trailing) {
          switch context.state {
          case let .preGame(startTimeMs, endTimeMs, _):
            if context.isStale {
              EmptyView()
            } else {
              let startDate = Date(timeIntervalSince1970: TimeInterval(startTimeMs) / 1000.0)
              let endDate = Date(timeIntervalSince1970: TimeInterval(endTimeMs) / 1000.0)
              Text(timerInterval: startDate...endDate, pauseTime: nil, countsDown: true)
                .foregroundColor(Color(hex: "FFDF2B"))
                .font(.comicSans(size: 14, weight: .bold))
                .frame(maxWidth: 50)
            }
          }
        }
        DynamicIslandExpandedRegion(.bottom) {
          YapsterIslandBottom(context: context)
            .padding(.bottom, 5)
            .padding(.horizontal, 5)
        }
      } compactLeading: {
        switch context.state {
        case .preGame:
          Image("yapster-round")
        }
      } compactTrailing: {
        switch context.state {
        case let .preGame(startTimeMs, endTimeMs, _):
          if context.isStale {
            EmptyView()
          } else {
            let startDate = Date(timeIntervalSince1970: TimeInterval(startTimeMs) / 1000.0)
            let endDate = Date(timeIntervalSince1970: TimeInterval(endTimeMs) / 1000.0)
            Text(timerInterval: startDate...endDate, pauseTime: nil, countsDown: true)
              .foregroundColor(Color(hex: "FFDF2B"))
              .font(.comicSans(size: 14, weight: .bold))
              .frame(maxWidth: 50)
          }
        }
      } minimal: {
        Image("yapster-round")
      }
    }
  }
}

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

#Preview("Notification", as: .content, using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.preGameState
}
