import type { Failure } from "@gov/shared";
import type { Ss7Failure } from "@gov/ss7";

export type Ss3Failure = Failure<
  | "intake_refused"
  | "target_indeterminate"
  | "parameters_indeterminate"
  | "scope_indeterminate"
  | "action_indeterminate"
>;
export type Ss7ForwardedFailure = Ss7Failure;
