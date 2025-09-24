import { MarkerSdk } from '@marker.io/browser';
import { runtimeEnv } from '../utils/runtime-env';

let widget: MarkerSdk | null = null;

const loadWidget = async () => {
  if (runtimeEnv.markerIoProjectId()) {
    const markerSDK = await import('@marker.io/browser');
    widget = await markerSDK.default.loadWidget({
      project: runtimeEnv.markerIoProjectId(),
    });
  }
};

export const markerio = () => widget;

export default loadWidget;
