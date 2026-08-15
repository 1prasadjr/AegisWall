import type { AttestedIdentity } from "@gov/ss2";
import type { Decision } from "@gov/ss7";
import type {
  ResolvedParameters,
  ResolvedScope,
  ResolvedTarget,
} from "./types";

export function publishResolvedAction(
  target: ResolvedTarget,
  parameters: ResolvedParameters,
  scope: ResolvedScope,
  identity: AttestedIdentity,
): Promise<Decision> {
  // TODO: implement
  throw new Error("TODO: implement");
}
