import { NextRequest, NextResponse } from 'next/server'

// Cette route n'est plus nécessaire avec MongoDB/JWT
// Les callbacks OAuth ont été remplacés par /api/auth/login et /api/auth/register
export async function GET(request: NextRequest) {
  const { origin } = request.nextUrl

  // Rediriger vers le dashboard si l'utilisateur est authentifié
  // ou vers le login s'il ne l'est pas
  return NextResponse.redirect(`${origin}/dashboard`)
}
