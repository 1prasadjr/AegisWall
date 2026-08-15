import type { CompiledPolicy } from "./types";

/**
 * Loads a compiled WASM policy module from raw bytes.
 *
 * This function takes already-loaded WASM bytes (from a file read by the
 * composition root, not this package) and loads them into the OPA WASM
 * runtime. The returned CompiledPolicy can be used with evaluatePolicy.
 *
 * @param wasmBytes The raw WASM module bytes (from OPA build -t wasm)
 * @returns CompiledPolicy ready for evaluation
 * @throws Error if the WASM module fails to load (e.g., invalid format)
 */
export async function loadCompiledPolicy(wasmBytes: Uint8Array): Promise<CompiledPolicy> {
  // Use @open-policy-agent/opa-wasm to load the WASM module (ESM import)
  const { loadPolicy } = await import("@open-policy-agent/opa-wasm");

  // loadPolicy loads the WASM bytes and returns a LoadedPolicy
  // The returned object has an evaluate method matching the expected signature
  const loadedPolicy = await loadPolicy(wasmBytes);

  return {
    evaluate: async (input: Record<string, unknown>): Promise<Record<string, unknown>> => {
      // Evaluate the policy with the input (raw result, mapping happens in evaluate.ts)
      const result = loadedPolicy.evaluate(input);
      return result;
    },
  };
}
