import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './LiveActivityInterface.types';

type LiveActivityInterfaceModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class LiveActivityInterfaceModule extends NativeModule<LiveActivityInterfaceModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(LiveActivityInterfaceModule, 'LiveActivityInterfaceModule');
