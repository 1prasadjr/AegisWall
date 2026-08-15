import type { TrustZone } from "@gov/shared";

export type RawInput = {
  content: unknown;
  zone: Extract<TrustZone, "TB-2" | "TB-3">;
  receivedAt: string;
};

export type NormalizedInput = {
  content: unknown;
  zone: TrustZone;
  normalizedAt: string;
};

export type ProvenanceSignalSet = {
  signals: ReadonlyArray<{ signalType: string; grounded: boolean }>;
};

export type ReliabilityDetermination =
  "qualified" | "low_confidence" | "unqualified";

export type QualifiedInput = {
  content: unknown;
  determination: ReliabilityDetermination;
  qualifiedAt: string;
};
