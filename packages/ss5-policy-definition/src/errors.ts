import type { Failure } from "@gov/shared";

export type Ss5Failure = Failure<
  "unauthorable" | "authoring_refused" | "invalid_rego_syntax"
>;
