import { describe, it, expect } from "vitest";
import { analyzeProvenance } from "./analyze-provenance.js";
import type { NormalizedInput } from "./types.js";

function makeRecord(
  content: unknown,
  zone: NormalizedInput["zone"] = "TB-2",
): NormalizedInput {
  return { content, zone, normalizedAt: new Date().toISOString() };
}

describe("analyzeProvenance", () => {
  describe("SI-8: zone is never a grounding signal", () => {
    it("produces identical signals for the same content regardless of zone", () => {
      const content = { data: "test" };
      const recordTB2 = makeRecord(content, "TB-2");
      const recordTB3 = makeRecord(content, "TB-3");

      const signalsTB2 = analyzeProvenance(recordTB2);
      const signalsTB3 = analyzeProvenance(recordTB3);

      // Signals must be identical — zone change alone must not affect grounding
      expect(signalsTB2.signals).toEqual(signalsTB3.signals);
    });

    it("returns the same grounded values for all three zones when content is identical", () => {
      const content = "hello";
      const zones: NormalizedInput["zone"][] = ["TB-2", "TB-3", "TB-4"];
      const results = zones.map((zone) =>
        analyzeProvenance(makeRecord(content, zone)),
      );
      const first = results[0]!.signals;
      for (const r of results.slice(1)) {
        expect(r.signals).toEqual(first);
      }
    });
  });

  describe("signal correctness — derived from content only", () => {
    it("all signals grounded for a populated object", () => {
      const { signals } = analyzeProvenance(
        makeRecord({ key: "value" }),
      );
      expect(signals.every((s) => s.grounded)).toBe(true);
    });

    it("all signals grounded for a non-empty string", () => {
      const { signals } = analyzeProvenance(makeRecord("hello"));
      expect(signals.every((s) => s.grounded)).toBe(true);
    });

    it("all signals grounded for a non-empty array", () => {
      const { signals } = analyzeProvenance(makeRecord([1, 2, 3]));
      expect(signals.every((s) => s.grounded)).toBe(true);
    });

    it("content-present is ungrounded for null content", () => {
      const { signals } = analyzeProvenance(makeRecord(null));
      const present = signals.find((s) => s.signalType === "content-present");
      expect(present?.grounded).toBe(false);
    });

    it("content-non-empty is ungrounded for empty object", () => {
      const { signals } = analyzeProvenance(makeRecord({}));
      const nonEmpty = signals.find((s) => s.signalType === "content-non-empty");
      expect(nonEmpty?.grounded).toBe(false);
    });

    it("content-non-empty is ungrounded for empty array", () => {
      const { signals } = analyzeProvenance(makeRecord([]));
      const nonEmpty = signals.find((s) => s.signalType === "content-non-empty");
      expect(nonEmpty?.grounded).toBe(false);
    });

    it("returns exactly three signals with the expected signalType names", () => {
      const { signals } = analyzeProvenance(makeRecord({ x: 1 }));
      const types = signals.map((s) => s.signalType);
      expect(types).toContain("content-present");
      expect(types).toContain("content-structured");
      expect(types).toContain("content-non-empty");
      expect(signals).toHaveLength(3);
    });
  });
});
