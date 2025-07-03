// Reexport the native module. On web, it will be resolved to LiveActivityInterfaceModule.web.ts
// and on native platforms to LiveActivityInterfaceModule.ts
export { default } from './src/LiveActivityInterfaceModule';
export { default as LiveActivityInterfaceView } from './src/LiveActivityInterfaceView';
export * from  './src/LiveActivityInterface.types';
