//
//  Attributes.swift
//  liveactivitydemo
//
//  Created by Jai Chawla on 7/2/25.
//

import Foundation
import WidgetKit
import ActivityKit

struct WidgetAttributes: ActivityAttributes {
  // enum for types of live activities
  public enum ContentState: Codable, Hashable {
    // the pregame live activity UI requires the start time, end time, and a title
    case preGame(startTimeMs: Int64, endTimeMs: Int64, title: String)
    
    // attributes for each live activity type
    private enum CodingKeys: String, CodingKey {
      case type // key to determine which live activity type is being encoded/decoded
      case startTimeMs, endTimeMs, title
    }

    // Encoder/Decoder to take JSON payload and convert to a Swift enum
    public init(from decoder: Decoder) throws {
      let container = try decoder.container(keyedBy: CodingKeys.self)
      
      // json contains a "type" field to determine which
      let type = try container.decode(String.self, forKey: .type)
      
      // take keys and decode to swift types, then create live activity type
      switch type {
      case "preGame":
        let startTimeMs = try container.decode(Int64.self, forKey: .startTimeMs)
        let endTimeMs = try container.decode(Int64.self, forKey: .endTimeMs)
        let title = try container.decode(String.self, forKey: .title)
        self = .preGame(startTimeMs: startTimeMs, endTimeMs: endTimeMs, title: title)
        
      default:
        throw DecodingError.dataCorruptedError(forKey: .type, in: container, debugDescription: "Invalid type value")
      }
    }
    
    public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      
      // package live activity type into json
      switch self {
      case .preGame(let startTimeMs, let endTimeMs, let title):
        try container.encode("preGame", forKey: .type)
        try container.encode(startTimeMs, forKey: .startTimeMs)
        try container.encode(endTimeMs, forKey: .endTimeMs)
        try container.encode(title, forKey: .title)
      }
    }
  }
}
