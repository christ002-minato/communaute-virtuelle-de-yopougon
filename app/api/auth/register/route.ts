import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import User from '@/lib/models/User';
import Member from '@/lib/models/Member';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const limited = rateLimit(`register:${ip}`, LIMIT, WINDOW_MS);
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Trop de comptes créés depuis cette adresse. Réessayez plus tard.' },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Adresse email invalide', fieldErrors: { email: 'Adresse email invalide' } },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        {
          error: 'Le mot de passe doit contenir au moins 6 caractères',
          fieldErrors: { password: 'Le mot de passe doit contenir au moins 6 caractères' },
        },
        { status: 400 }
      );
    }

    if (!String(name).trim()) {
      return NextResponse.json(
        { error: 'Le nom est requis', fieldErrors: { name: 'Le nom est requis' } },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          error: 'Cet email est déjà utilisé',
          fieldErrors: { email: 'Email déjà pris' },
        },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    const user = new User({
      email: normalizedEmail,
      name: String(name).trim(),
      password: hashedPassword,
    });

    await user.save();

    // Créer la fiche de membre automatiquement
    await Member.create({
      user_id: user._id,
      points: 0,
      level: 'bronze',
      reputation: 0,
      is_verified: false,
    });

    // Créer le JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Créer la réponse avec cookie
    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Définir le cookie JWT
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'ValidationError' && error.errors) {
      const fieldErrors: Record<string, string> = {}
      for (const key of Object.keys(error.errors)) {
        fieldErrors[key] = error.errors[key].message
      }
      return NextResponse.json(
        {
          error: 'Données invalides',
          fieldErrors,
        },
        { status: 400 }
      )
    }

    if (error.code === 11000 && error.keyValue?.email) {
      return NextResponse.json(
        {
          error: 'Cet email est déjà utilisé',
          fieldErrors: { email: 'Email déjà pris' },
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Impossible de créer le compte' },
      { status: 500 }
    );
  }
}