import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key)))
}
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  return `scrypt:${salt}:${(await derive(password, salt)).toString('hex')}`
}
export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, salt, hash] = encoded.split(':')
  if (algorithm !== 'scrypt' || !salt || !hash) return false
  const key = await derive(password, salt)
  const stored = Buffer.from(hash, 'hex')
  return stored.length === key.length && timingSafeEqual(stored, key)
}
