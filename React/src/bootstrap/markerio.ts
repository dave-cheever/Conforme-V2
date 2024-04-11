import { MarkerSdk } from '@marker.io/browser';

let widget: MarkerSdk | null = null;

const loadWidget = async () => {
  if (process.env.REACT_APP_MARKER_IO_PROJECT_ID) {
    const markerSDK = await import('@marker.io/browser');
    widget = await markerSDK.default.loadWidget({
      project: process.env.REACT_APP_MARKER_IO_PROJECT_ID || '',
    });
  }
};

export const markerio = () => widget;

export default loadWidget;
