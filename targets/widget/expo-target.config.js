/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = config => ({
  type: "widget",
  name: 'Live Activity',
  frameworks: ['SwiftUI', 'ActivityKit'],
});