'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Lock, Trash2, Unlock, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useEffect, useState } from 'react'

type Discussion = {
  _id: string
  title: string
  content: string
  author_id: { name?: string; avatar_url?: string } | string
  category?: string
  comment_count?: number
  is_locked?: boolean
  created_at: string
}

function getAuthorName(author: Discussion['author_id']) {
  return typeof author === 'string' ? 'Utilisateur' : author?.name || 'Utilisateur'
}

function getAuthorAvatar(author: Discussion['author_id']) {
  return typeof author === 'string' ? undefined : author?.avatar_url
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'U'
}

function relativeDate(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

export default function AdminDiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function fetchDiscussions() {
    try {
      setLoading(true)
      const response = await fetch('/api/discussions?limit=100', { cache: 'no-store' })
      if (!response.ok) throw new Error('Impossible de charger les discussions.')
      const payload = await response.json()
      setDiscussions(payload.data || [])
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscussions()
  }, [])

  async function toggleLocked(discussion: Discussion) {
    try {
      setUpdatingId(discussion._id)
      const response = await fetch('/api/discussions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discussionId: discussion._id, is_locked: !discussion.is_locked }),
      })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error || 'Mise a jour impossible.')
      }
      const updated = await response.json()
      setDiscussions((items) => items.map((item) => item._id === updated._id ? updated : item))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setUpdatingId(null)
    }
  }

  async function deleteDiscussion(discussionId: string) {
    try {
      setUpdatingId(discussionId)
      const response = await fetch(`/api/discussions?discussionId=${discussionId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error || 'Suppression impossible.')
      }
      setDiscussions((items) => items.filter((item) => item._id !== discussionId))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredDiscussions = discussions.filter((disc) =>
    disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getAuthorName(disc.author_id).toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Moderation des Discussions</h2>
        <p className="text-muted-foreground">Gerer les discussions reelles de la communaute</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une discussion..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchDiscussions} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {error && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Discussions a moderer</CardTitle>
          <CardDescription>Surveiller, verrouiller ou supprimer les sujets stockes dans MongoDB.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading && <p className="text-sm text-muted-foreground">Chargement...</p>}

            {filteredDiscussions.map((discussion) => {
              const authorName = getAuthorName(discussion.author_id)
              const avatar = getAuthorAvatar(discussion.author_id)

              return (
                <div
                  key={discussion._id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        {avatar ? (
                          <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-primary">{getInitial(authorName)}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-lg line-clamp-2">{discussion.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            par {authorName} - {relativeDate(discussion.created_at)}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{discussion.content}</p>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          discussion.is_locked
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-green-500/10 text-green-600'
                        }`}>
                          {discussion.is_locked ? 'Verrouille' : 'Actif'}
                        </span>
                        <span className="text-muted-foreground">{discussion.comment_count || 0} reponse(s)</span>
                        <span className="text-muted-foreground">{discussion.category || 'general'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleLocked(discussion)}
                        disabled={updatingId === discussion._id}
                      >
                        {discussion.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteDiscussion(discussion._id)}
                        disabled={updatingId === discussion._id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {!loading && filteredDiscussions.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune discussion trouvee.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
