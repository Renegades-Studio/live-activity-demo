import { NativeModule, requireNativeModule } from "expo";

import { LiveActivityInterfaceModuleEvents } from "./LiveActivityInterface.types";

declare class LiveActivityInterfaceModule extends NativeModule<LiveActivityInterfaceModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<LiveActivityInterfaceModule>(
  "LiveActivityInterface"
);
