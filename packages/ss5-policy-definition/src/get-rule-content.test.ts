// SS-5 getRuleContent contract tests (RS-5.4, RD7, D10).
//
// Verifies the public read path: it must
//   (a) delegate to readRule on every call (no in-package cache),
//   (b) return the literal string 'no_applicable_rule' for an unauthored
//       category (never an empty object, never a thrown error),
//   (c) expose the latest versioned rule when one exists.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRuleContent } from "./get-rule-content.js";
import { readRule } from "./rule-repository.js";
import type { RuleContent } from "./types.js";

vi.mock("./rule-repository.js", () => ({
  readRule: vi.fn(),
}));

const mockRead = readRule as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockRead.mockReset();
});

describe("getRuleContent", () => {
  it("returns 'no_applicable_rule' for an unauthored category (D10 Fail-Closed)", async () => {
    mockRead.mockResolvedValue("no_applicable_rule");

    const result = await getRuleContent("never-authored");

    expect(result).toBe("no_applicable_rule");
    expect(mockRead).toHaveBeenCalledTimes(1);
    expect(mockRead).toHaveBeenCalledWith("never-authored");
  });

  it("returns the rule content when readRule yields a row", async () => {
    const content: RuleContent = {
      category: "data-access",
      version: 3,
      regoSource: "package test\n",
    };
    mockRead.mockResolvedValue(content);

    const result = await getRuleContent("data-access");

    expect(result).not.toBe("no_applicable_rule");
    if (result === "no_applicable_rule") return;
    expect(result.category).toBe("data-access");
    expect(result.version).toBe(3);
    expect(result.regoSource).toBe("package test\n");
    expect(mockRead).toHaveBeenCalledTimes(1);
  });

  it("delegates to readRule on every call — two sequential calls both hit the read path (RD7, no caching)", async () => {
    mockRead.mockResolvedValue({
      category: "fresh-read",
      version: 1,
      regoSource: "package fresh\n",
    });

    const first = await getRuleContent("fresh-read");
    const second = await getRuleContent("fresh-read");

    expect(mockRead).toHaveBeenCalledTimes(2);
    expect(mockRead).toHaveBeenNthCalledWith(1, "fresh-read");
    expect(mockRead).toHaveBeenNthCalledWith(2, "fresh-read");
    expect(first).not.toBe("no_applicable_rule");
    expect(second).not.toBe("no_applicable_rule");
  });

  it("does not catch / swallow a thrown readRule — surfaces as a rejection", async () => {
    // getRuleContent is a pure passthrough; the repository is the layer
    // that maps read failures to 'no_applicable_rule' (D10). The public
    // surface here does not add its own try/catch.
    mockRead.mockRejectedValue(new Error("DB boom"));

    await expect(getRuleContent("anything")).rejects.toThrow("DB boom");
  });
});
