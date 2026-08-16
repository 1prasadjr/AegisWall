import type { TrustZone } from "@gov/shared";

export interface RawInput {
  content: unknown;
  zone: Extract<TrustZone, "TB-2" | "TB-3">;
  receivedAt: string;
}

export interface NormalizedInput {
  content: unknown;
  zone: TrustZone;
  normalizedAt: string;
}

export interface ProvenanceSignalSet {
  signals: readonly { signalType: string; grounded: boolean }[];
}

export type ReliabilityDetermination =
  "qualified" | "low_confidence" | "unqualified";

export interface QualifiedInput {
  content: unknown;
  determination: ReliabilityDetermination;
  qualifiedAt: string;
}
