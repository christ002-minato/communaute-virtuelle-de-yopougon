'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, CheckCircle, Lock, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function AdminDiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const discussions = [
    {
      id: 1,
      title: 'Comment lancer une startup?',
      author: 'Marie Diallo',
      status: 'Actif',
      reports: 0,
      replies: 24,
      date: '2024-02-20',
    },
    {
      id: 2,
      title: 'Opportunités d\'emploi à Yopougon',
      author: 'Pierre Koffi',
      status: 'Actif',
      reports: 0,
      replies: 18,
      date: '2024-02-18',
    },
    {
      id: 3,
      title: 'Discussion contenant du spam',
      author: 'Utilisateur X',
      status: 'Fermé',
      reports: 3,
      replies: 5,
      date: '2024-02-15',
    },
    {
      id: 4,
      title: 'Expérience en formation digitale',
      author: 'Aya Kouadio',
      status: 'Actif',
      reports: 1,
      replies: 31,
      date: '2024-02-12',
    },
  ]

  const filteredDiscussions = discussions.filter(disc =>
    disc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Modération des Discussions</h2>
        <p className="text-muted-foreground">Gérer les discussions de la communauté</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une discussion..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discussions à Modérer</CardTitle>
          <CardDescription>Surveiller et gérer les discussions actives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <div
                key={discussion.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {discussion.author.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-lg line-clamp-2">
                          {discussion.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">par {discussion.author}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        discussion.status === 'Actif'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}>
                        {discussion.status}
                      </span>
                      <span className="text-muted-foreground">
                        {discussion.replies} réponses
                      </span>
                      {discussion.reports > 0 && (
                        <span className="bg-red-500/10 text-red-600 px-2 py-1 rounded-full">
                          {discussion.reports} signalement(s)
                        </span>
                      )}
                      <span className="text-muted-foreground">{discussion.date}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approuver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Lock className="w-4 h-4" />
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
