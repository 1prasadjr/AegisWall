import { describe, it, expect } from "vitest";
import { intakeRuleRequest } from "./intake-rule-request.js";
import type { RuleAuthoringInput } from "./types.js";

const validInput: RuleAuthoringInput = {
  category: "data-access",
  regoSource: "package test\n\ndefault allow = false\n",
  authoredBy: "opa-authority-1",
};

describe("intakeRuleRequest", () => {
  it("returns a normalized request on the success path (drops TB-4 caller ref)", () => {
    const result = intakeRuleRequest(validInput);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.category).toBe("data-access");
    expect(result.value.regoSource).toBe(validInput.regoSource);
    // The normalized form must NOT carry authoredBy — it is a TB-4 caller
    // reference that belongs to the input envelope only, not the persisted
    // record (which carries only category + regoSource).
    expect(
      (result.value as unknown as Record<string, unknown>).authoredBy,
    ).toBeUndefined();
  });

  it("returns 'unauthorable' when category is missing", () => {
    const result = intakeRuleRequest({
      ...validInput,
      category: undefined as unknown as string,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("unauthorable");
  });

  it("returns 'unauthorable' when category is empty", () => {
    const result = intakeRuleRequest({ ...validInput, category: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("unauthorable");
  });

  it("returns 'unauthorable' when regoSource is missing", () => {
    const result = intakeRuleRequest({
      ...validInput,
      regoSource: undefined as unknown as string,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("unauthorable");
  });

  it("returns 'unauthorable' when regoSource is empty", () => {
    const result = intakeRuleRequest({ ...validInput, regoSource: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("unauthorable");
  });

  it("returns 'unauthorable' when authoredBy is missing (TB-4 caller reference)", () => {
    const result = intakeRuleRequest({
      ...validInput,
      authoredBy: undefined as unknown as string,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("unauthorable");
  });

  it("returns 'unauthorable' when authoredBy is empty", () => {
    const result = intakeRuleRequest({ ...validInput, authoredBy: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("unauthorable");
  });

  it("returns 'unauthorable' when the entire request is null", () => {
    const result = intakeRuleRequest(
      null as unknown as RuleAuthoringInput,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("unauthorable");
  });

  it("returns 'unauthorable' when a field has the wrong type", () => {
    const result = intakeRuleRequest({
      ...validInput,
      category: 42 as unknown as string,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("unauthorable");
  });
});
