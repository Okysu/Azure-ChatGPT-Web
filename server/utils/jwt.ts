import jwt from "jsonwebtoken";

const key = process.env.JWT_SECRET_KEY || "Yu-GPT-Next";

const subject = process.env.JWT_SUBJECT || "Yu-GPT-Next";

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

/**
 * Generate a login token
 * @param {object} user
 * @returns {string} The token
 */
function generateLoginToken(user: object): string {
  return generateToken(subject + "-Auth", user, "15d");
}

/**
 * Generate a register token
 * @param {object} user
 * @returns {string} The token
 */
function generateRegisterToken(user: object): string {
  return generateToken(subject + "-Register", user, "15d");
}

/**
 * Verify a login token
 * @param {string} token
 * @returns {any} The payload
 */
function verifyLoginToken(token: string): any {
  return verifyToken(token, subject + "-Auth");
}

/**
 * Verify a register token
 * @param {string} token
 * @returns {any} The payload
 */
function verifyRegisterToken(token: string): any {
  return verifyToken(token, subject + "-Register");
}

export {
  generateToken,
  verifyToken,
  generateLoginToken,
  generateRegisterToken,
  verifyLoginToken,
  verifyRegisterToken,
};
