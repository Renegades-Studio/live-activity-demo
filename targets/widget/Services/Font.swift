//
//  Font.swift
//  liveactivitydemo
//
//  Created by Jai Chawla on 7/2/25.
//

import Foundation
import SwiftUI

extension Font {
  static func comicSans(size: CGFloat, weight: Font.Weight = .regular) -> Font {
    var fontName = "ComicSansMS"
    
    switch weight {
    case .bold:
      fontName = "ComicSansMS-Bold"
    case .regular:
      fontName = "ComicSansMS"
    default:
      fontName = "ComicSansMS"
    }
    
    return Font.custom(fontName, size: size)
  }
}
