import type { NextFunction, Request, Response } from 'express'

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export type RequestSecurityConfig = {
  enforceSameOrigin: boolean
}

function getRequestOrigin(req: Request): string | null {
  const host = req.headers.host

  if (!host) {
    return null
  }

  const forwardedProto = req.headers['x-forwarded-proto']
  const protocol = typeof forwardedProto === 'string' && forwardedProto.length > 0 ? forwardedProto : req.protocol

  return `${protocol}://${host}`
}

export function createRequestSecurityMiddleware(config: RequestSecurityConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!config.enforceSameOrigin || !UNSAFE_METHODS.has(req.method.toUpperCase())) {
      next()
      return
    }

    const origin = req.headers.origin

    if (!origin) {
      next()
      return
    }

    const requestOrigin = getRequestOrigin(req)

    if (requestOrigin && origin !== requestOrigin) {
      res.status(403).json({ error: 'Cross-origin unsafe requests are not allowed.' })
      return
    }

    next()
  }
}

export function createDevCorsMiddleware(enabled: boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!enabled) {
      next()
      return
    }

    const origin = req.headers.origin

    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
    }

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')

    if (req.method === 'OPTIONS') {
      res.sendStatus(204)
      return
    }

    next()
  }
}
