import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Routes publiques (sans authentification requise)
const publicRoutes = ['/login', '/register', '/forgot-password', '/auth/callback', '/']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Obtenir le token du cookie
  const token = request.cookies.get('authToken')?.value

  // Si pas de token et route protégée, rediriger vers login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Vérifier le token
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string }

    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Token invalide ou expiré
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('authToken')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
