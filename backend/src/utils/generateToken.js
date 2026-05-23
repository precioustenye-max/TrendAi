import crypto from "node:crypto"

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url")
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function createSignature(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url")
}

export function signToken(payload, secret) {
  const sessionPayload = {
    ...payload,
    exp: Date.now() + TOKEN_TTL_MS,
  }

  const encodedPayload = toBase64Url(JSON.stringify(sessionPayload))
  const signature = createSignature(encodedPayload, secret)

  return `${encodedPayload}.${signature}`
}

export function verifyToken(token, secret) {
  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = createSignature(encodedPayload, secret)

  if (signature.length !== expectedSignature.length) {
    return null
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload))

  if (!payload.exp || payload.exp < Date.now()) {
    return null
  }

  return payload
}
