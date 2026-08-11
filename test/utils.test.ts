import { describe, expect, it } from "bun:test";
import { Extrapolation } from "react-native-reanimated";

import {
  DEFAULTS,
  INTERPOLATION_PRESETS,
  TRANSLATION_PRESETS,
  clamp,
  createFadeInterpolation,
  createInterpolation,
  createParallaxInterpolation,
  createRotationInterpolation,
  createScaleInterpolation,
  createTranslationRange,
  getExtrapolationMode,
  lerp,
  mapRange,
} from "../src/utils";

describe("clamp", () => {
  it("returns the value when it is inside the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to the bounds", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it("keeps the bounds themselves untouched", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("lerp", () => {
  it("returns the endpoints at progress 0 and 1", () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it("interpolates linearly in between", () => {
    expect(lerp(0, 100, 0.25)).toBe(25);
    expect(lerp(-50, 50, 0.5)).toBe(0);
  });

  it("extrapolates past the endpoints", () => {
    expect(lerp(0, 100, 1.5)).toBe(150);
    expect(lerp(0, 100, -0.5)).toBe(-50);
  });
});

describe("mapRange", () => {
  it("maps a value from one range to another", () => {
    expect(mapRange(50, 0, 100, 0, 1)).toBe(0.5);
    expect(mapRange(0, 0, 200, 0, -100)).toBe(0);
    expect(mapRange(200, 0, 200, 0, -100)).toBe(-100);
  });

  it("supports inverted output ranges", () => {
    expect(mapRange(25, 0, 100, 1, 0)).toBe(0.75);
  });
});

describe("getExtrapolationMode", () => {
  it("defaults to clamp", () => {
    expect(getExtrapolationMode()).toBe(Extrapolation.CLAMP);
  });

  it("passes an explicit mode through", () => {
    expect(getExtrapolationMode(Extrapolation.EXTEND)).toBe(
      Extrapolation.EXTEND,
    );
  });
});

describe("createTranslationRange", () => {
  it("builds a {from, to} pair", () => {
    expect(createTranslationRange(0, 80)).toEqual({ from: 0, to: 80 });
  });
});

describe("createInterpolation", () => {
  it("builds a config with the default extrapolation", () => {
    expect(createInterpolation([0, 100], [1, 0])).toEqual({
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: Extrapolation.CLAMP,
    });
  });

  it("accepts string output ranges (e.g. rotations)", () => {
    expect(
      createInterpolation([0, 1], ["0deg", "180deg"], Extrapolation.EXTEND),
    ).toEqual({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
      extrapolate: Extrapolation.EXTEND,
    });
  });
});

describe("createFadeInterpolation", () => {
  it("fades out by default", () => {
    expect(createFadeInterpolation(200)).toEqual({
      inputRange: [0, 100, 200],
      outputRange: [1, 0.5, 0],
      extrapolate: Extrapolation.CLAMP,
    });
  });

  it("fades in when asked", () => {
    expect(createFadeInterpolation(200, true).outputRange).toEqual([0, 0.5, 1]);
  });
});

describe("createScaleInterpolation", () => {
  it("scales from 1 to 0.8 by default", () => {
    expect(createScaleInterpolation(200)).toEqual({
      inputRange: [0, 200],
      outputRange: [1, 0.8],
      extrapolate: Extrapolation.CLAMP,
    });
  });

  it("honours custom scales", () => {
    expect(createScaleInterpolation(100, 0.5, 2).outputRange).toEqual([0.5, 2]);
  });
});

describe("createParallaxInterpolation", () => {
  it("moves at half speed by default and extends past the range", () => {
    expect(createParallaxInterpolation(200)).toEqual({
      inputRange: [0, 200],
      outputRange: [0, -100],
      extrapolate: Extrapolation.EXTEND,
    });
  });

  it("scales the offset by the parallax factor", () => {
    expect(createParallaxInterpolation(200, 2).outputRange).toEqual([0, -400]);
  });
});

describe("createRotationInterpolation", () => {
  it("rotates a full turn by default", () => {
    expect(createRotationInterpolation(360)).toEqual({
      inputRange: [0, 360],
      outputRange: [0, 360],
      extrapolate: Extrapolation.CLAMP,
    });
  });

  it("honours a custom rotation", () => {
    expect(createRotationInterpolation(100, 90).outputRange).toEqual([0, 90]);
  });
});

describe("constants", () => {
  it("exposes the documented defaults", () => {
    expect(DEFAULTS.THRESHOLD).toBe(8);
    expect(DEFAULTS.SCROLL_EVENT_THROTTLE).toBe(16);
    expect(DEFAULTS.SUPPORT_IDLE).toBe(false);
  });

  it("ships translation presets shaped like {from, to}", () => {
    for (const preset of Object.values(TRANSLATION_PRESETS)) {
      expect(typeof preset.from).toBe("number");
      expect(typeof preset.to).toBe("number");
    }
  });

  it("ships interpolation presets with matching range lengths", () => {
    for (const preset of Object.values(INTERPOLATION_PRESETS)) {
      expect(preset.inputRange.length).toBe(preset.outputRange.length);
      expect(preset.inputRange.length).toBeGreaterThan(1);
    }
  });
});
