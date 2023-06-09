import jwt from "jsonwebtoken";

const key = process.env.JWT_SECRET_KEY || "Yu-GPT-Next";

interface WrappedToken {
  subject: string;
  payload: object;
}

/**
 * Generate a token
 * @param {string} subject
 * @param {object} payload
 * @param {string | number} expiresIn
 * @returns {string}
 */
function generateToken(
  subject: string,
  payload: object,
  expiresIn?: string | number
): string {
  const wrapped: WrappedToken = {
    subject: subject,
    payload: payload,
  };
  return jwt.sign(wrapped, key, { expiresIn });
}

/**
 * Verify a token
 * @param {string} token
 * @param {string} subject
 * @returns {object} The payload
 * @throws {Error}
 */
function verifyToken(token: string, subject: string): object {
  const wrapped: WrappedToken = jwt.verify(token, key) as WrappedToken;
  if (wrapped.subject !== subject) {
    throw new Error("subject not match.");
  }
  return wrapped.payload;
}

export { generateToken, verifyToken };
