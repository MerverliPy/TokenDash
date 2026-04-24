import { timingSafeEqual } from 'node:crypto'

import type { NextFunction, Request, Response } from 'express'

export type BasicAuthConfig = {
  enabled: boolean
  username: string | null
  password: string | null
}

const BASIC_REALM = 'Basic realm="TokenDash"'

function toBuffer(value: string): Buffer {
  return Buffer.from(value, 'utf8')
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = toBuffer(left)
  const rightBuffer = toBuffer(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

function parseBasicAuthorizationHeader(headerValue: string | undefined): { username: string; password: string } | null {
  if (!headerValue) {
    return null
  }

  const [scheme, encoded] = headerValue.split(' ')

  if (!scheme || !encoded || scheme.toLowerCase() !== 'basic') {
    return null
  }

  let decoded = ''

  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8')
  } catch {
    return null
  }

  const separatorIndex = decoded.indexOf(':')

  if (separatorIndex < 0) {
    return null
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  }
}

function unauthorized(res: Response) {
  res.setHeader('WWW-Authenticate', BASIC_REALM)
  res.status(401).json({ error: 'Authentication required' })
}

export function getBasicAuthConfig(env: NodeJS.ProcessEnv = process.env): BasicAuthConfig {
  const username = env.TOKENDASH_AUTH_USER?.trim() || null
  const password = env.TOKENDASH_AUTH_PASSWORD?.trim() || null

  if (!username && !password) {
    return {
      enabled: false,
      username: null,
      password: null,
    }
  }

  if (!username || !password) {
    throw new Error('Both TOKENDASH_AUTH_USER and TOKENDASH_AUTH_PASSWORD must be set to enable HTTP Basic Auth.')
  }

  return {
    enabled: true,
    username,
    password,
  }
}

export function createBasicAuthMiddleware(config: BasicAuthConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!config.enabled || !config.username || !config.password) {
      next()
      return
    }

    const parsedCredentials = parseBasicAuthorizationHeader(req.headers.authorization)

    if (!parsedCredentials) {
      unauthorized(res)
      return
    }

    const usernameMatches = safeEqual(parsedCredentials.username, config.username)
    const passwordMatches = safeEqual(parsedCredentials.password, config.password)

    if (!usernameMatches || !passwordMatches) {
      unauthorized(res)
      return
    }

    next()
  }
}
