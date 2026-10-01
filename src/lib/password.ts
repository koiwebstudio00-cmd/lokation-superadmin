export function generatePassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_";
  return `U!${Array.from(bytes, value => alphabet[value % alphabet.length]).join("")}`;
}
