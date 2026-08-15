import type { Failure } from "@gov/shared";

export type Ss2Failure = Failure<
  "origin_unresolved" | "identity_not_distinguishable" | "not_attributable"
>;
