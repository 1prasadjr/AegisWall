import pino from "pino";

const REDACT_PATHS = [
  "req.headers.authorization",
  "DATABASE_URL",
  "*.secret",
  "*.token",
  "*.*.secret",
  "*.*.token",
  "*.*.*.secret",
  "*.*.*.token",
] as const;

export function createLogger(): unknown {
  return pino({
    redact: {
      censor: "[REDACTED]",
      paths: [...REDACT_PATHS],
      remove: false,
    },
  });
}
