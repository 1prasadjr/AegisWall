let jwtPublicKey: any = null;

export function initSs2(config: { jwtPublicKey: any }): void {
  jwtPublicKey = config.jwtPublicKey;
}

export function getSs2Config(): { jwtPublicKey: any } {
  if (!jwtPublicKey) {
    throw new Error("SS2 config not initialized. Call initSs2 first.");
  }
  return { jwtPublicKey };
}
