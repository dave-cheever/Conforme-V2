import { render } from '@testing-library/react';
import * as echarts from 'echarts';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import InsightsChart from '../../components/Insights/InsightsChart';

// ---- Mocks we need to assert against across tests
const resizeMock = vi.fn();
const setOptionMock = vi.fn();
const disposeMock = vi.fn();

// Mock echarts.init -> returns our fake chart API
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    resize: resizeMock,
    setOption: setOptionMock,
    dispose: disposeMock,
  })),
}));

// Capture the created ResizeObserver instance so we can trigger it
let lastRO: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn>; trigger: () => void } | null = null;

// Provide a global ResizeObserver mock (JSDOM doesn’t have one)
class MockResizeObserver {
  private readonly _cb: ResizeObserverCallback;

  public observe = vi.fn();

  public disconnect = vi.fn();

  constructor(cb: ResizeObserverCallback) {
    this._cb = cb;
    lastRO = {
      observe: this.observe,
      disconnect: this.disconnect,
      trigger: () => {
        // fire with an empty entries list, and a fake observer
        // @ts-ignore - we don’t need real entries/observer for this test
        this._cb([], this);
      },
    };
  }
}
// @ts-ignore - providing polyfill in test env
globalThis.ResizeObserver = MockResizeObserver;

// SUT import AFTER mocks

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  lastRO = null;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('InsightsChart', () => {
  test('initializes chart, sets option, and calls resize after 100ms timeout', () => {
    const option = { title: { text: 'Hello' } };

    render(<InsightsChart data-id="001521" option={option as any} />);

    // echarts.init called once with the div element
    expect((echarts.init as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);
    const initArg = (echarts.init as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(initArg).toBeInstanceOf(HTMLDivElement);

    // setOption applied
    expect(setOptionMock).toHaveBeenCalledWith(option);

    // no resize yet (before timeout)
    expect(resizeMock).not.toHaveBeenCalled();

    // advance the 100ms debounce timeout -> should call resize once
    vi.advanceTimersByTime(100);
    expect(resizeMock).toHaveBeenCalledTimes(1);
  });

  test('observes container with ResizeObserver and triggers resize when it fires', () => {
    render(<InsightsChart data-id="001522" option={{} as any} />);

    // ResizeObserver was created and observe called with our container
    expect(lastRO).not.toBeNull();
    expect(lastRO!.observe).toHaveBeenCalledTimes(1);
    const observedEl = lastRO!.observe.mock.calls[0][0];
    expect(observedEl).toBeInstanceOf(HTMLDivElement);

    // Clear previous calls, then simulate a resize observation callback
    resizeMock.mockClear();
    lastRO!.trigger();
    expect(resizeMock).toHaveBeenCalledTimes(1);
  });

  test('cleans up: clears timeout, disconnects ResizeObserver, and disposes chart on unmount', () => {
    const { unmount } = render(<InsightsChart data-id="001523" option={{} as any} />);

    // Don’t let the 100ms timer fire; unmount first
    resizeMock.mockClear();
    unmount();

    // after unmount, advancing timers should NOT call resize (timeout cleared)
    vi.advanceTimersByTime(200);
    expect(resizeMock).not.toHaveBeenCalled();

    // ResizeObserver was disconnected
    expect(lastRO).not.toBeNull();
    expect(lastRO!.disconnect).toHaveBeenCalledTimes(1);

    // Chart disposed
    expect(disposeMock).toHaveBeenCalledTimes(1);
  });

  test('reacts to window resize events by calling chart.resize', () => {
    render(<InsightsChart data-id="001524" option={{} as any} />);

    resizeMock.mockClear();
    globalThis.dispatchEvent(new Event('resize'));
    expect(resizeMock).toHaveBeenCalledTimes(1);
  });

  test('re-initializes chart when option identity changes (cleanup + new init/setOption)', () => {
    const { rerender } = render(<InsightsChart data-id="001525" option={{ x: 1 } as any} />);
    expect(setOptionMock).toHaveBeenCalledTimes(1);
    expect(disposeMock).toHaveBeenCalledTimes(0);

    // change option reference -> effect runs cleanup then init again
    setOptionMock.mockClear();
    rerender(<InsightsChart data-id="001526" option={{ x: 2 } as any} />);

    expect(disposeMock).toHaveBeenCalledTimes(1);
    expect((echarts.init as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(setOptionMock).toHaveBeenCalledTimes(1);
  });
});
