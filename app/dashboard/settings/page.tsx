'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+225 01 23 45 67 89',
    bio: 'Passionné par la communauté et l\'entrepreneuriat',
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Paramètres du Compte</h2>
        <p className="text-muted-foreground">Gérez vos informations personnelles</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
          <CardDescription>Mettez à jour vos données de profil</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  Prénom
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Nom
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Téléphone
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-foreground">
                Biographie
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>

            <Button type="submit">Enregistrer les modifications</Button>
            {saved && (
              <p className="text-sm text-green-600">Paramètres enregistrés avec succès!</p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Confidentialité et Sécurité</CardTitle>
          <CardDescription>Contrôlez votre visibilité et votre sécurité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h4 className="font-medium text-foreground">Profil Public</h4>
              <p className="text-sm text-muted-foreground">Permettre aux autres de voir votre profil</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h4 className="font-medium text-foreground">Notifications par Email</h4>
              <p className="text-sm text-muted-foreground">Recevoir des emails de la communauté</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Authentification à deux facteurs</h4>
              <p className="text-sm text-muted-foreground">Sécurité renforcée pour votre compte</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Mot de Passe</CardTitle>
          <CardDescription>Changez votre mot de passe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                Mot de passe actuel
              </label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                Nouveau mot de passe
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Button>Changer le mot de passe</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Zone Dangereuse</CardTitle>
          <CardDescription>Actions irréversibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Supprimer mon compte</Button>
        </CardContent>
      </Card>
    </div>
  )
}
