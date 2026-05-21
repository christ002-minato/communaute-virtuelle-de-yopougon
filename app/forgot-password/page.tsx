'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la demande')
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch (err) {
      setError('Erreur lors de la connexion au serveur')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Email envoye!</h2>
                <p className="text-muted-foreground">
                  Si un compte existe avec l&apos;adresse <strong>{email}</strong>, 
                  vous recevrez un email avec les instructions pour reinitialiser votre mot de passe.
                </p>
                <p className="text-sm text-muted-foreground">
                  Verifiez egalement votre dossier spam.
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">Retour a la connexion</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour a la connexion
        </Link>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Mot de passe oublie?</CardTitle>
            <CardDescription>
              Entrez votre adresse email et nous vous enverrons un lien pour reinitialiser votre mot de passe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien de reinitialisation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
