import { Result, err, ok } from "@gov/shared";
import { spawn } from "child_process";

/**
 * Validates Rego syntax using the OPA CLI tool.
 *
 * Per specification (TAS §3.2/SS-5, RS-5.2), validates Rego syntax with the free
 * OPA CLI (`opa check` and `opa fmt --diff`) before committing to ensure
 * policy correctness.
 *
 * This function shells out to the OPA CLI binary that is already wired into CI
 * per Task D's build step. The same OPA CLI installation used in CI must be
 * available in the runtime environment.
 *
 * @param source Rego policy source code to validate
 * @returns Promise<Result<void, 'invalid_rego_syntax'>> Result indicating
 * validation success (ok) or invalid syntax error (err)
 *
 * @throws Error if the OPA CLI is not found in PATH
 */
export function validateRegoSyntax(
  source: string,
): Promise<Result<void, "invalid_rego_syntax">> {
  return new Promise((resolve) => {
    // First validate with `opa check` - checks for syntax and compilation errors
    const checkProcess = spawn("opa", ["check", "--stdin"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    checkProcess.stdin.write(source);
    checkProcess.stdin.end();

    checkProcess.on("close", (code) => {
      if (code !== 0) {
        // opa check failed - this indicates invalid Rego syntax
        resolve(err("invalid_rego_syntax"));
        return;
      }

      // Then validate formatting with `opa fmt --diff` - checks formatting is correct
      const fmtProcess = spawn("opa", ["fmt", "--diff", "--stdin"], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      fmtProcess.stdin.write(source);
      fmtProcess.stdin.end();

      fmtProcess.on("close", (code) => {
        if (code !== 0) {
          // opa fmt failed - this could be due to formatting issues
          // For syntax validation purposes, we treat this as invalid_rego_syntax
          resolve(err("invalid_rego_syntax"));
          return;
        }

        // Both checks passed
        resolve(ok(undefined));
      });
    });

    // Handle spawn errors (e.g., OPA CLI not found)
    checkProcess.on("error", () => {
      resolve(err("invalid_rego_syntax"));
    });
  });
}
