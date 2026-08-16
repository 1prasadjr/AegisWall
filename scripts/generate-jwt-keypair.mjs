#!/usr/bin/env node
/**
 * JWT ES256 Keypair Generation Script
 *
 * Generates an ES256 (ECDSA with P-256 curve and SHA-256) asymmetric keypair
 * for JWT token verification as specified in TAS §2 and IS §10.1, §10.3.
 *
 * Usage: node scripts/generate-jwt-keypair.mjs
 *
 * Outputs:
 * - Public key (PEM format) to stdout - safe to commit to .env files
 * - Private key (PEM format) to stderr - MUST be stored securely, never committed
 */

import * as jose from "jose";

async function generateKeypair() {
  console.error("Generating ES256 keypair using jose library...\n");

  // Generate ES256 (ECDSA P-256) keypair
  const { publicKey, privateKey } = await jose.generateKeyPair("ES256", {
    extractable: true,
  });

  // Export keys to PEM format
  const publicKeyPEM = await jose.exportSPKI(publicKey);
  const privateKeyPEM = await jose.exportPKCS8(privateKey);

  console.error("=".repeat(80));
  console.error(
    "PUBLIC KEY (safe to store in .env.development, .env.test, .env.production)",
  );
  console.error("=".repeat(80));
  console.log(publicKeyPEM);

  console.error("\n" + "=".repeat(80));
  console.error(
    "PRIVATE KEY (NEVER COMMIT - store securely outside repository)",
  );
  console.error("=".repeat(80));
  console.error(privateKeyPEM);

  console.error("\n" + "=".repeat(80));
  console.error("INSTRUCTIONS");
  console.error("=".repeat(80));
  console.error("1. Copy the PUBLIC KEY above and set JWT_PUBLIC_KEY in:");
  console.error("   - .env.development");
  console.error("   - .env.test");
  console.error("   - .env.production");
  console.error("");
  console.error(
    "2. Store the PRIVATE KEY in a secure location OUTSIDE this repository:",
  );
  console.error(
    "   - Local development: ~/.ssh/jwt-private-key.pem or similar",
  );
  console.error(
    "   - Production: Use your platform's secret management (e.g., AWS Secrets Manager)",
  );
  console.error("");
  console.error(
    "3. Ensure .gitignore excludes any files containing the private key",
  );
  console.error("=".repeat(80));
}

generateKeypair().catch((error) => {
  console.error("Error generating keypair:", error);
  process.exit(1);
});
