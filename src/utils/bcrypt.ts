import * as bcrypt from 'bcrypt';

const SALT = 10;
export function encodePassword(rawPassword: string) {
  return bcrypt.hash(rawPassword, SALT);
}

export async function comparePasswords(rawPassword: string, hash: string) {
  return await bcrypt.compare(rawPassword, hash);
}
