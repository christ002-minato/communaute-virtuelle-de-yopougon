import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import User from '@/lib/models/User';
import crypto from 'crypto';

// Note: Cette API est une implémentation basique
// En production, vous devriez utiliser un service d'email sécurisé
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      // Par sécurité, retourner le même message
      return NextResponse.json(
        { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé' },
        { status: 200 }
      );
    }

    // TODO: Implémenter l'envoi d'email avec un lien de reset
    // Pour le moment, retourner un message de succès
    
    // Exemple d'implémentation à faire:
    // 1. Générer un token de reset
    // const resetToken = crypto.randomBytes(32).toString('hex');
    // 2. Sauvegarder le token dans la base de données
    // user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // user.resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 heure
    // await user.save();
    // 3. Envoyer un email avec le lien de reset
    // const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;
    // TODO: Implémenter sendEmail(email, resetUrl);

    return NextResponse.json(
      { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
