export interface Config {
  databaseUrl: string;
  jwtPublicKey: string;
  opaPolicyWasmPath: string;
  logLevel: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
  httpPort: number;
  nodeEnv: "development" | "test" | "production";
}

export function loadConfig(): Config {
  // TODO: implement
  throw new Error("TODO: implement");
}
