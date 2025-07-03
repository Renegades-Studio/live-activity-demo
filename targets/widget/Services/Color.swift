//
//  Color.swift
//  liveactivitydemo
//
//  Created by Jai Chawla on 7/2/25.
//

import SwiftUI

extension Color {
  init?(hex: String) {
    var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    if hexString.hasPrefix("#") {
      hexString.removeFirst()
    }

    if hexString.count != 6 {
      return nil
    }

    var rgbValue: UInt64 = 0
    Scanner(string: hexString).scanHexInt64(&rgbValue)

    let red = Double((rgbValue & 0xFF0000) >> 16)
    let green = Double((rgbValue & 0x00FF00) >> 8)
    let blue = Double(rgbValue & 0x0000FF)

    self.init(red: red / 255, green: green / 255, blue: blue / 255)
  }
}
