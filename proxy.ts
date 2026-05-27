import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

const publicRoutes = ['/login', '/register', '/forgot-password', '/auth/callback', '/']

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

function base64UrlToJson<T>(value: string): T {
  const bytes = base64UrlToBytes(value)
  const json = new TextDecoder().decode(bytes)
  return JSON.parse(json) as T
}

async function verifyJwt(token: string) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.')
  if (!encodedHeader || !encodedPayload || !encodedSignature) return null

  const header = base64UrlToJson<{ alg?: string }>(encodedHeader)
  if (header.alg !== 'HS256') return null

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToBytes(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  )

  if (!isValid) return null

  const payload = base64UrlToJson<{ role?: string; exp?: number }>(encodedPayload)
  if (payload.exp && payload.exp * 1000 < Date.now()) return null

  return payload
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get('authToken')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const decoded = await verifyJwt(token)
  if (!decoded) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('authToken')
    return response
  }

  if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
