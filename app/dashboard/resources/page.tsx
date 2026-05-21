'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Heart, Share2, Plus } from 'lucide-react'
import { useState } from 'react'

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const resources = [
    {
      id: 1,
      title: 'Guide de l\'Entrepreneuriat en Côte d\'Ivoire',
      author: 'Marie Diallo',
      category: 'Entrepreneuriat',
      downloads: 234,
      likes: 45,
      date: '2024-02-20',
    },
    {
      id: 2,
      title: 'Manuel de Gestion Financière Personnelle',
      author: 'Pierre Koffi',
      category: 'Finance',
      downloads: 189,
      likes: 32,
      date: '2024-02-15',
    },
    {
      id: 3,
      title: 'Ressources pour l\'Apprentissage Digital',
      author: 'Aya Kouadio',
      category: 'Technologie',
      downloads: 312,
      likes: 67,
      date: '2024-02-10',
    },
    {
      id: 4,
      title: 'Guide de Networking Professionnel',
      author: 'Kofi Mensah',
      category: 'Carrière',
      downloads: 156,
      likes: 28,
      date: '2024-02-05',
    },
  ]

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Ressources Partagées</h2>
        <p className="text-muted-foreground">Bibliothèque de ressources créées par la communauté</p>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une ressource..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une ressource
        </Button>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription>{resource.author}</CardDescription>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                  {resource.category}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span>{resource.downloads} téléchargements</span>
                <span>{resource.likes} likes</span>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">Aucune ressource trouvée</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
