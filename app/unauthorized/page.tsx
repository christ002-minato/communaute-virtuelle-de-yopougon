'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full rounded-3xl border border-border bg-card p-8 shadow-lg">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] items-center">
          <img
            src="https://placekitten.com/640/480"
            alt="Chat non autorisé"
            className="w-full rounded-3xl object-cover"
          />

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Accès refusé</p>
              <h1 className="mt-4 text-3xl font-bold text-foreground">Vous n'êtes pas autorisé à accéder à cette page</h1>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              Seuls les administrateurs peuvent consulter la section administration. Si vous pensez qu'il s'agit d'une erreur, contactez un administrateur ou connectez-vous avec un compte disposant des droits appropriés.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button variant="default">Retour au tableau de bord</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Se connecter</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
