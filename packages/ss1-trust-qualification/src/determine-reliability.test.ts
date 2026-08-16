import { describe, it, expect } from "vitest";
import { determineReliability } from "./determine-reliability.js";
import type { ProvenanceSignalSet } from "./types.js";

function makeSignals(
  pairs: { signalType: string; grounded: boolean }[],
): ProvenanceSignalSet {
  return { signals: pairs };
}

describe("determineReliability", () => {
  describe("fail-closed cases → 'unqualified'", () => {
    it("returns unqualified when signals array is empty", () => {
      expect(determineReliability(makeSignals([]))).toBe("unqualified");
    });

    it("returns unqualified when all signals are ungrounded", () => {
      const signals = makeSignals([
        { signalType: "content-present", grounded: false },
        { signalType: "content-structured", grounded: false },
        { signalType: "content-non-empty", grounded: false },
      ]);
      expect(determineReliability(signals)).toBe("unqualified");
    });

    it("returns unqualified for a single ungrounded signal", () => {
      expect(
        determineReliability(
          makeSignals([{ signalType: "content-present", grounded: false }]),
        ),
      ).toBe("unqualified");
    });
  });

  describe("qualified cases", () => {
    it("returns qualified when all three standard signals are grounded", () => {
      const signals = makeSignals([
        { signalType: "content-present", grounded: true },
        { signalType: "content-structured", grounded: true },
        { signalType: "content-non-empty", grounded: true },
      ]);
      expect(determineReliability(signals)).toBe("qualified");
    });

    it("returns qualified for a single grounded signal (100% of signals grounded)", () => {
      expect(
        determineReliability(
          makeSignals([{ signalType: "content-present", grounded: true }]),
        ),
      ).toBe("qualified");
    });
  });

  describe("low_confidence cases", () => {
    it("returns low_confidence when some but not all signals are grounded", () => {
      const signals = makeSignals([
        { signalType: "content-present", grounded: true },
        { signalType: "content-structured", grounded: true },
        { signalType: "content-non-empty", grounded: false },
      ]);
      expect(determineReliability(signals)).toBe("low_confidence");
    });

    it("returns low_confidence when exactly one of three signals is grounded", () => {
      const signals = makeSignals([
        { signalType: "content-present", grounded: true },
        { signalType: "content-structured", grounded: false },
        { signalType: "content-non-empty", grounded: false },
      ]);
      expect(determineReliability(signals)).toBe("low_confidence");
    });
  });

  describe("determinism (D6)", () => {
    it("produces the same output for the same input called multiple times", () => {
      const signals = makeSignals([
        { signalType: "content-present", grounded: true },
        { signalType: "content-structured", grounded: false },
      ]);
      const results = Array.from({ length: 5 }, () =>
        determineReliability(signals),
      );
      expect(new Set(results).size).toBe(1);
    });
  });
});
