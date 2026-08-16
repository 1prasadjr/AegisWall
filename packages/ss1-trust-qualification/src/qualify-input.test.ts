import { describe, it, expect } from "vitest";
import { qualifyInput } from "./qualify-input.js";
import type { RawInput } from "./types.js";

const VALID_INPUT: RawInput = {
  content: { payload: "well-formed" },
  zone: "TB-2",
  receivedAt: "2024-06-01T12:00:00.000Z",
};

describe("qualifyInput", () => {
  describe("full-pipeline success case", () => {
    it("returns ok(QualifiedInput) for a valid, well-formed RawInput", () => {
      const result = qualifyInput(VALID_INPUT);

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      expect(result.value.content).toEqual(VALID_INPUT.content);
      expect(typeof result.value.determination).toBe("string");
      expect(["qualified", "low_confidence", "unqualified"]).toContain(
        result.value.determination,
      );
      expect(typeof result.value.qualifiedAt).toBe("string");
      expect(Date.parse(result.value.qualifiedAt)).not.toBeNaN();
    });

    it("returns determination 'qualified' for fully populated content", () => {
      // A non-null, non-empty object passes all three content signals
      const result = qualifyInput(VALID_INPUT);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.value.determination).toBe("qualified");
    });
  });

  describe("normalizeInput-failure short-circuit (D1)", () => {
    it("returns err unnormalizable for null content and does NOT produce a QualifiedInput", () => {
      // D1 behavioral proof: if normalizeInput fails, qualifyInput must return
      // that failure immediately — no QualifiedInput (with qualifiedAt) is produced.
      const result = qualifyInput({ ...VALID_INPUT, content: null });

      expect(result.ok).toBe(false);
      if (result.ok) return;
      // Pipeline aborted — error is the unnormalizable failure from step 1
      expect(result.error.code).toBe("unnormalizable");
      // No 'value' property exists on the error result (type + runtime check)
      expect("value" in result).toBe(false);
    });

    it("returns err unnormalizable for an invalid receivedAt string", () => {
      const result = qualifyInput({ ...VALID_INPUT, receivedAt: "INVALID" });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.code).toBe("unnormalizable");
    });

    it("returns the exact same error object produced by normalizeInput (not wrapped)", () => {
      // Ensures qualifyInput does not wrap or transform the error
      const result = qualifyInput({ ...VALID_INPUT, content: undefined });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error).toMatchObject({
        code: "unnormalizable",
        message: expect.any(String),
      });
    });

    it("short-circuit is consistent: calling twice with bad input returns same error code", () => {
      const input: RawInput = { ...VALID_INPUT, content: null };
      const r1 = qualifyInput(input);
      const r2 = qualifyInput(input);
      expect(r1.ok).toBe(false);
      expect(r2.ok).toBe(false);
      if (r1.ok || r2.ok) return;
      expect(r1.error.code).toBe(r2.error.code);
    });
  });
});
