import { describe, it, expect } from "vitest";
import { publishQualifiedInput } from "./publish-qualified-input.js";
import type { NormalizedInput, ReliabilityDetermination } from "./types.js";

const BASE_RECORD: NormalizedInput = {
  content: { id: 42, label: "test" },
  zone: "TB-2",
  normalizedAt: "2024-01-15T10:00:00.000Z",
};

describe("publishQualifiedInput", () => {
  const determinations: ReliabilityDetermination[] = [
    "qualified",
    "low_confidence",
    "unqualified",
  ];

  for (const determination of determinations) {
    it(`attaches determination '${determination}' exactly as received`, () => {
      const result = publishQualifiedInput(BASE_RECORD, determination);
      expect(result.determination).toBe(determination);
    });
  }

  it("preserves content from the NormalizedInput unchanged", () => {
    const result = publishQualifiedInput(BASE_RECORD, "qualified");
    expect(result.content).toEqual(BASE_RECORD.content);
  });

  it("attaches a valid ISO 8601 qualifiedAt timestamp", () => {
    const result = publishQualifiedInput(BASE_RECORD, "qualified");
    expect(typeof result.qualifiedAt).toBe("string");
    expect(Date.parse(result.qualifiedAt)).not.toBeNaN();
  });

  it("does not re-evaluate or override the determination (qualified stays qualified)", () => {
    // Even with zero-content record, determination must pass through
    const emptyRecord: NormalizedInput = {
      content: {},
      zone: "TB-3",
      normalizedAt: "2024-01-15T10:00:00.000Z",
    };
    const result = publishQualifiedInput(emptyRecord, "qualified");
    expect(result.determination).toBe("qualified");
  });

  it("does not add unexpected fields to QualifiedInput", () => {
    const result = publishQualifiedInput(BASE_RECORD, "qualified");
    const keys = Object.keys(result).sort();
    expect(keys).toEqual(["content", "determination", "qualifiedAt"]);
  });
});
