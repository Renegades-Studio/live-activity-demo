import { requireNativeView } from 'expo';
import * as React from 'react';

import { LiveActivityInterfaceViewProps } from './LiveActivityInterface.types';

const NativeView: React.ComponentType<LiveActivityInterfaceViewProps> =
  requireNativeView('LiveActivityInterface');

export default function LiveActivityInterfaceView(props: LiveActivityInterfaceViewProps) {
  return <NativeView {...props} />;
}
