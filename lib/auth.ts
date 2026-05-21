import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
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
