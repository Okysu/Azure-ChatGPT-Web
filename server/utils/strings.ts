import { sha256 } from "js-sha256";

/**
 * Hash the password.
 * @param {string} str - The password.
 * @param {string} salt - The salt.
 * @returns {string} The hashed password.
 */
function hashPassword(str: string, salt: string = ""): string {
  return sha256(sha256(str + salt) + salt);
}

export { hashPassword };
