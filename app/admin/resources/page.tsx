'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, CheckCircle, Trash2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export default function AdminResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const resources = [
    {
      id: 1,
      title: 'Guide de l\'Entrepreneuriat',
      author: 'Marie Diallo',
      status: 'Approuvé',
      reports: 0,
      date: '2024-02-20',
    },
    {
      id: 2,
      title: 'Manuel de Gestion Financière',
      author: 'Pierre Koffi',
      status: 'En attente',
      reports: 0,
      date: '2024-02-19',
    },
    {
      id: 3,
      title: 'Ressources pour l\'Apprentissage Digital',
      author: 'Aya Kouadio',
      status: 'Approuvé',
      reports: 1,
      date: '2024-02-18',
    },
    {
      id: 4,
      title: 'Guide de Networking',
      author: 'Kofi Mensah',
      status: 'Rejeté',
      reports: 2,
      date: '2024-02-15',
    },
  ]

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Modération des Ressources</h2>
        <p className="text-muted-foreground">Approuver et gérer les ressources partagées</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une ressource..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ressources à Modérer</CardTitle>
          <CardDescription>Approuver ou rejeter les ressources soumises</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <h3 className="font-semibold text-foreground text-lg">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">par {resource.author}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        resource.status === 'Approuvé'
                          ? 'bg-green-500/10 text-green-600'
                          : resource.status === 'En attente'
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}>
                        {resource.status}
                      </span>
                      {resource.reports > 0 && (
                        <span className="bg-red-500/10 text-red-600 px-2 py-1 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {resource.reports} signalement(s)
                        </span>
                      )}
                      <span className="text-muted-foreground">{resource.date}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end md:items-center">
                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approuver
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
