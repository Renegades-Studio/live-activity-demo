import * as React from 'react';

import { LiveActivityInterfaceViewProps } from './LiveActivityInterface.types';

export default function LiveActivityInterfaceView(props: LiveActivityInterfaceViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
