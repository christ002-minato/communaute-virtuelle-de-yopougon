'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Communauté Virtuelle de Yopougon',
    siteDescription: 'Plateforme de connexion et d\'échange pour la communauté',
    contactEmail: 'admin@cvy.ci',
    maintenanceMode: false,
    maxUploadSize: '50',
    registrationEnabled: true,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
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
        <h2 className="text-3xl font-bold text-foreground">Paramètres Système</h2>
        <p className="text-muted-foreground">Configuration générale du site</p>
      </div>

      {/* Site Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du Site</CardTitle>
          <CardDescription>Configuration de base de la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="siteName" className="text-sm font-medium text-foreground">
                Nom du Site
              </label>
              <Input
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="siteDescription" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contactEmail" className="text-sm font-medium text-foreground">
                Email de Contact
              </label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxUploadSize" className="text-sm font-medium text-foreground">
                Taille Max d\'Upload (MB)
              </label>
              <Input
                id="maxUploadSize"
                name="maxUploadSize"
                type="number"
                value={settings.maxUploadSize}
                onChange={handleChange}
              />
            </div>

            <Button type="submit">Enregistrer</Button>
            {saved && (
              <p className="text-sm text-green-600">Paramètres enregistrés!</p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités</CardTitle>
          <CardDescription>Activer ou désactiver les fonctionnalités</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h4 className="font-medium text-foreground">Mode Maintenance</h4>
              <p className="text-sm text-muted-foreground">Mettre le site hors ligne</p>
            </div>
            <input 
              type="checkbox" 
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="w-5 h-5" 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Inscription Activée</h4>
              <p className="text-sm text-muted-foreground">Permettre les nouvelles inscriptions</p>
            </div>
            <input 
              type="checkbox" 
              name="registrationEnabled"
              checked={settings.registrationEnabled}
              onChange={handleChange}
              className="w-5 h-5" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup */}
      <Card>
        <CardHeader>
          <CardTitle>Sauvegarde et Maintenance</CardTitle>
          <CardDescription>Outils de maintenance du système</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full">
            Créer une Sauvegarde
          </Button>
          <Button variant="outline" className="w-full">
            Vider le Cache
          </Button>
          <Button variant="outline" className="w-full">
            Logs Système
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Zone Dangereuse</CardTitle>
          <CardDescription>Actions irréversibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full">
            Réinitialiser le Système
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
