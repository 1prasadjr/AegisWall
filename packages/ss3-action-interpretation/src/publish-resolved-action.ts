import type { AttestedIdentity } from "@gov/ss2";
import type { Decision } from "@gov/ss7";
import type {
  ResolvedParameters,
  ResolvedScope,
  ResolvedTarget,
} from "./types";

export function publishResolvedAction(
  _target: ResolvedTarget,
  _parameters: ResolvedParameters,
  _scope: ResolvedScope,
  _identity: AttestedIdentity,
): Promise<Decision> {
  // TODO: implement
  throw new Error("TODO: implement");
}
