import { createHash, randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  return hash
}

export async function verifyPassword(password: string, hash: string) {
  const isMatch = await bcrypt.compare(password, hash)

  return isMatch
}

export function generateApiKey() {
  const raw = randomBytes(32).toString('base64')
  const prefix = raw.slice(0, 8)
  const hash = createHash('sha256').update(raw).digest('hex')

  return { raw, prefix, hash }
}
