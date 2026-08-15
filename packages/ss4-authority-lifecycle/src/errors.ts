import type { Failure } from "@gov/shared";

export type Ss4Failure = Failure<"need_insufficient" | "issuance_refused">;
