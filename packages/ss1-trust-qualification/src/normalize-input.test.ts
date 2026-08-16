import { describe, it, expect } from "vitest";
import { normalizeInput } from "./normalize-input.js";

const VALID_RAW = {
  content: { message: "hello" },
  zone: "TB-2" as const,
  receivedAt: "2024-01-15T10:00:00.000Z",
};

describe("normalizeInput", () => {
  describe("success path", () => {
    it("returns ok with NormalizedInput for a valid RawInput", () => {
      const result = normalizeInput(VALID_RAW);

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      expect(result.value.content).toEqual(VALID_RAW.content);
      expect(result.value.zone).toBe("TB-2");
      expect(typeof result.value.normalizedAt).toBe("string");
      expect(Date.parse(result.value.normalizedAt)).not.toBeNaN();
    });

    it("accepts zone TB-3", () => {
      const result = normalizeInput({ ...VALID_RAW, zone: "TB-3" });
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.value.zone).toBe("TB-3");
    });

    it("accepts non-object content (e.g. a string)", () => {
      const result = normalizeInput({ ...VALID_RAW, content: "plain string" });
      expect(result.ok).toBe(true);
    });

    it("does NOT add any origin/source field to the NormalizedInput (SI-8)", () => {
      const result = normalizeInput(VALID_RAW);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      // The type surface guarantees no origin field; verify at runtime too.
      const keys = Object.keys(result.value);
      expect(keys).not.toContain("origin");
      expect(keys).not.toContain("source");
    });
  });

  describe("failure path — code: 'unnormalizable'", () => {
    it("returns err unnormalizable when content is null", () => {
      const result = normalizeInput({ ...VALID_RAW, content: null });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.code).toBe("unnormalizable");
    });

    it("returns err unnormalizable when content is undefined", () => {
      const result = normalizeInput({ ...VALID_RAW, content: undefined });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.code).toBe("unnormalizable");
    });

    it("returns err unnormalizable when receivedAt is not a date string", () => {
      const result = normalizeInput({ ...VALID_RAW, receivedAt: "not-a-date" });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.code).toBe("unnormalizable");
    });

    it("returns err unnormalizable when receivedAt is empty string", () => {
      const result = normalizeInput({ ...VALID_RAW, receivedAt: "" });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.code).toBe("unnormalizable");
    });
  });
});
