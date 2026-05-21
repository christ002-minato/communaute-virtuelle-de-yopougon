'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MessageCircle, Eye, Plus } from 'lucide-react'
import { useState } from 'react'

export default function DiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const discussions = [
    {
      id: 1,
      title: 'Comment lancer une startup en 2024?',
      author: 'Marie Diallo',
      category: 'Entrepreneuriat',
      replies: 24,
      views: 485,
      date: '2024-02-20',
    },
    {
      id: 2,
      title: 'Opportunités d\'emploi à Yopougon',
      author: 'Pierre Koffi',
      category: 'Emploi',
      replies: 18,
      views: 342,
      date: '2024-02-18',
    },
    {
      id: 3,
      title: 'Partage d\'expérience en formation digitale',
      author: 'Aya Kouadio',
      category: 'Technologie',
      replies: 31,
      views: 567,
      date: '2024-02-15',
    },
    {
      id: 4,
      title: 'Stratégies de croissance personnelle',
      author: 'Kofi Mensah',
      category: 'Développement Personnel',
      replies: 22,
      views: 412,
      date: '2024-02-12',
    },
  ]

  const filteredDiscussions = discussions.filter(disc =>
    disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disc.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Discussions</h2>
        <p className="text-muted-foreground">Participez aux conversations de la communauté</p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une discussion..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" />
          Créer une discussion
        </Button>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer hover:bg-muted/30">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {discussion.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg line-clamp-2">
                        {discussion.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        par <span className="font-medium">{discussion.author}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                      {discussion.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(discussion.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>{discussion.replies}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{discussion.views}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiscussions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">Aucune discussion trouvée</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
