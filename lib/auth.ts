import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required.')
  }
  return secret
})()

export interface DecodedToken {
  userId: string;
  email: string;
  role?: string;
  iat: number;
  exp: number;
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  return token || null;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as unknown as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<DecodedToken | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}