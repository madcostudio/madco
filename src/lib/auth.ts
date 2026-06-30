import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "default_super_secret_session_key_123456";

export interface SessionData {
  userId: string;
  username: string;
  name: string;
  role: "admin" | "crew";
}

/**
 * Encrypts session data into a signed token.
 */
export function encryptSession(data: SessionData): string {
  const payload = JSON.stringify(data);
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${hmac}`;
}

/**
 * Decrypts a session token and verifies its signature.
 */
export function decryptSession(cookieVal: string): SessionData | null {
  try {
    const parts = cookieVal.split(".");
    if (parts.length !== 2) return null;
    const payload = Buffer.from(parts[0], "base64").toString("utf8");
    const hmac = parts[1];
    const expectedHmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (hmac !== expectedHmac) return null;
    return JSON.parse(payload) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Hashes a plaintext password using PBKDF2 with SHA-512 and a unique salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored PBKDF2 hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const salt = parts[0];
  const hash = parts[1];
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === testHash;
}
