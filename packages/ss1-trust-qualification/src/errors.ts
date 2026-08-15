import type { Failure } from "@gov/shared";

export type Ss1Failure = Failure<
  "unnormalizable" | "ungrounded" | "unqualified"
>;
