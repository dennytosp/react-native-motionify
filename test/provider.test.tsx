import { afterEach, describe, expect, it } from "bun:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";

import {
  MotionifyProvider,
  useMotionify,
  useMotionifySupportIdle,
} from "../src/MotionifyProvider";
import type { MotionifyConfig, MotionifyContextValue } from "../src/types";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const scrollEvent = (y: number) =>
  ({
    nativeEvent: {
      contentOffset: { x: 0, y },
      contentSize: { height: 1000, width: 100 },
      layoutMeasurement: { height: 100, width: 100 },
    },
  }) as Parameters<MotionifyContextValue["onScroll"]>[0];

describe("useMotionify", () => {
  let renderer: ReactTestRenderer | null = null;

  afterEach(() => {
    if (renderer) {
      act(() => renderer?.unmount());
      renderer = null;
    }
  });

  it("keeps mounted consumers independent and their handlers stable", () => {
    const hooks: Record<string, MotionifyContextValue> = {};

    const Probe = ({
      id,
      config,
    }: {
      id: string;
      config?: MotionifyConfig;
    }) => {
      hooks[id] = useMotionify(config);
      return null;
    };

    act(() => {
      renderer = create(
        <MotionifyProvider threshold={30}>
          <Probe id="fast" config={{ threshold: 8 }} />
          <Probe id="default" />
        </MotionifyProvider>,
      );
    });

    const fastHandler = hooks.fast.onScroll;

    act(() => hooks.default.onScroll(scrollEvent(100)));
    act(() => hooks.default.onScroll(scrollEvent(120)));
    expect(hooks.default.directionShared.value).toBe("idle");

    act(() => hooks.fast.onScroll(scrollEvent(0)));
    act(() => hooks.fast.onScroll(scrollEvent(9)));

    expect(hooks.fast.directionShared.value).toBe("down");
    expect(hooks.fast.onScroll).toBe(fastHandler);
  });

  it("applies provider-wide threshold changes to consumers without overrides", () => {
    let hook: MotionifyContextValue;

    const Probe = () => {
      hook = useMotionify();
      return null;
    };

    act(() => {
      renderer = create(
        <MotionifyProvider threshold={30}>
          <Probe />
        </MotionifyProvider>,
      );
    });
    act(() => hook!.setThreshold(8));
    act(() => hook!.onScroll(scrollEvent(0)));
    act(() => hook!.onScroll(scrollEvent(9)));

    expect(hook!.directionShared.value).toBe("down");
  });

  it("does not let component cleanup cancel provider-owned idle", async () => {
    let hook: MotionifyContextValue;

    const Probe = () => {
      hook = useMotionify();
      return null;
    };

    const IdleRequester = () => {
      useMotionifySupportIdle(true);
      return null;
    };

    const Tree = ({ requestIdle }: { requestIdle: boolean }) => (
      <MotionifyProvider supportIdle>
        <Probe />
        {requestIdle ? <IdleRequester /> : null}
      </MotionifyProvider>
    );

    act(() => {
      renderer = create(<Tree requestIdle />);
    });
    act(() => hook!.onScroll(scrollEvent(0)));
    act(() => hook!.onScroll(scrollEvent(9)));
    expect(hook!.directionShared.value).toBe("down");

    act(() => renderer?.update(<Tree requestIdle={false} />));
    await act(async () => {
      await Bun.sleep(250);
    });

    expect(hook!.directionShared.value).toBe("idle");
  });

  it("keeps idle enabled until every component requester unmounts", async () => {
    let hook: MotionifyContextValue;

    const Probe = () => {
      hook = useMotionify();
      return null;
    };

    const IdleRequester = () => {
      useMotionifySupportIdle(true);
      return null;
    };

    const Tree = ({ requesterCount }: { requesterCount: number }) => (
      <MotionifyProvider>
        <Probe />
        {requesterCount >= 1 ? <IdleRequester key="first" /> : null}
        {requesterCount >= 2 ? <IdleRequester key="second" /> : null}
      </MotionifyProvider>
    );

    act(() => {
      renderer = create(<Tree requesterCount={2} />);
    });
    act(() => renderer?.update(<Tree requesterCount={1} />));
    act(() => hook!.onScroll(scrollEvent(0)));
    act(() => hook!.onScroll(scrollEvent(9)));
    expect(hook!.directionShared.value).toBe("down");

    await act(async () => {
      await Bun.sleep(250);
    });

    expect(hook!.directionShared.value).toBe("idle");
  });

  it("invalidates every consumer tracker when global state becomes idle", async () => {
    const hooks: Record<string, MotionifyContextValue> = {};

    const Probe = ({ id }: { id: string }) => {
      hooks[id] = useMotionify({ supportIdle: true });
      return null;
    };

    act(() => {
      renderer = create(
        <MotionifyProvider>
          <Probe id="first" />
          <Probe id="second" />
        </MotionifyProvider>,
      );
    });

    act(() => hooks.first.onScroll(scrollEvent(0)));
    act(() => hooks.first.onScroll(scrollEvent(9)));
    act(() => hooks.second.onScroll(scrollEvent(100)));
    act(() => hooks.second.onScroll(scrollEvent(109)));

    await act(async () => {
      await Bun.sleep(250);
    });

    expect(hooks.first.directionShared.value).toBe("idle");
    expect(hooks.first.isScrolling).toBe(false);

    act(() => hooks.first.onScroll(scrollEvent(10)));

    expect(hooks.first.directionShared.value).toBe("idle");
    expect(hooks.first.isScrolling).toBe(true);
  });
});
