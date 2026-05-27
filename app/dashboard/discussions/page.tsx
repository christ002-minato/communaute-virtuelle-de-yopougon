'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MessageCircle, Eye, Plus, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useEffect, useState } from 'react'

type Author = {
  name?: string
  avatar_url?: string
}

type Discussion = {
  _id: string
  title: string
  content: string
  author_id: Author | string
  category?: string
  comment_count?: number
  view_count?: number
  created_at: string
}

type Comment = {
  _id: string
  content: string
  author_id: Author | string
  discussion_id: string
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

export default function DiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('entraide-informatique')
  const [replyContent, setReplyContent] = useState('')

  async function fetchDiscussions() {
    try {
      setLoading(true)
      const res = await fetch('/api/discussions?limit=50', { cache: 'no-store' })
      if (!res.ok) throw new Error('Echec du chargement')
      const json = await res.json()
      setDiscussions(json.data || [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  async function fetchComments(discussionId: string) {
    try {
      setCommentsLoading(true)
      const res = await fetch(`/api/comments?discussionId=${discussionId}&limit=100`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Echec du chargement des reponses')
      const json = await res.json()
      setComments(json.data || [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setCommentsLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscussions()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let pollingTimer: ReturnType<typeof setInterval> | null = null

    if (!('EventSource' in window)) {
      pollingTimer = globalThis.setInterval(() => fetchDiscussions(), 10000)
      return () => { if (pollingTimer) clearInterval(pollingTimer) }
    }

    const es = new EventSource('/api/realtime/discussions')
    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        const { event, data } = msg
        if (event === 'discussion_insert') {
          setDiscussions((prev) => [data, ...prev.filter((item) => item._id !== data._id)])
        } else if (event === 'discussion_update') {
          setDiscussions((prev) => prev.map((item) => (item._id === data._id ? data : item)))
        } else if (event === 'comment_insert') {
          setDiscussions((prev) => prev.map((item) => (
            item._id === data.discussion_id
              ? { ...item, comment_count: (item.comment_count || 0) + 1 }
              : item
          )))
          setComments((prev) => (
            selectedDiscussion?._id === data.discussion_id
              ? [...prev.filter((item) => item._id !== data._id), data]
              : prev
          ))
        }
      } catch (err) {
        console.error('SSE parse', err)
      }
    }
    es.onerror = (err) => {
      console.warn('SSE error', err)
      try { es.close() } catch (e) {}
      if (!pollingTimer) pollingTimer = globalThis.setInterval(() => fetchDiscussions(), 10000)
    }

    return () => {
      try { es.close() } catch (e) {}
      if (pollingTimer) clearInterval(pollingTimer)
    }
  }, [selectedDiscussion?._id])

  async function handleCreate() {
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.error || 'Erreur creation')
      }
      setTitle('')
      setContent('')
      setShowCreate(false)
      await fetchDiscussions()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    }
  }

  async function handleReply() {
    if (!selectedDiscussion || !replyContent.trim()) return

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discussionId: selectedDiscussion._id, content: replyContent }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.error || 'Erreur reponse')
      }
      const created = await res.json()
      setReplyContent('')
      setComments((prev) => [...prev.filter((item) => item._id !== created._id), created])
      await fetchDiscussions()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    }
  }

  const filteredDiscussions = discussions.filter((disc) =>
    disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (disc.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Discussions</h2>
        <p className="text-muted-foreground">Participez aux conversations de la communaute</p>
      </div>

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
        <Button onClick={() => setShowCreate((value) => !value)} className="whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" />
          Creer une discussion
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-3">
              <Input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder="Categorie" value={category} onChange={(e) => setCategory(e.target.value)} />
              <textarea
                className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Votre sujet d'entraide informatique"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={!title.trim() || !content.trim()}>Publier</Button>
                <Button variant="ghost" onClick={() => setShowCreate(false)}>Annuler</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="text-center py-4">
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
        <div className="space-y-4">
          {loading && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">Chargement...</p>
              </CardContent>
            </Card>
          )}

          {filteredDiscussions.map((discussion) => {
            const authorName = getAuthorName(discussion.author_id)
            const avatar = getAuthorAvatar(discussion.author_id)

            return (
              <button
                key={discussion._id}
                type="button"
                onClick={() => {
                  setSelectedDiscussion(discussion)
                  fetchComments(discussion._id)
                }}
                className="w-full text-left"
              >
                <Card className={`hover:shadow-md transition-shadow hover:bg-muted/30 ${selectedDiscussion?._id === discussion._id ? 'border-primary' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-3">
                        <div className="flex items-start gap-3">
                          {avatar ? (
                            <img src={avatar} alt="" className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-semibold text-primary">{getInitial(authorName)}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-lg line-clamp-2">{discussion.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              par <span className="font-medium">{authorName}</span> - {relativeDate(discussion.created_at)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{discussion.content}</p>
                        <span className="inline-flex text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                          {discussion.category || 'general'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MessageCircle className="w-4 h-4" />
                          {discussion.comment_count || 0}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          {discussion.view_count || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            )
          })}

          {filteredDiscussions.length === 0 && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">Aucune discussion trouvee</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="pt-6 space-y-4">
            {selectedDiscussion ? (
              <>
                <div>
                  <h3 className="font-semibold text-lg">{selectedDiscussion.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {comments.length} reponse{comments.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-3 max-h-[28rem] overflow-auto pr-1">
                  {commentsLoading && <p className="text-sm text-muted-foreground">Chargement des reponses...</p>}
                  {comments.map((comment) => {
                    const authorName = getAuthorName(comment.author_id)
                    const avatar = getAuthorAvatar(comment.author_id)

                    return (
                      <div key={comment._id} className="rounded-lg border border-border p-3">
                        <div className="flex items-center gap-2">
                          {avatar ? (
                            <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                              {getInitial(authorName)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{authorName}</p>
                            <p className="text-xs text-muted-foreground">{relativeDate(comment.created_at)}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    )
                  })}
                  {!commentsLoading && comments.length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucune reponse pour le moment.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <textarea
                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Ecrire une reponse..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <Button className="w-full" onClick={handleReply} disabled={!replyContent.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Repondre
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Selectionnez une discussion pour lire et ajouter des reponses.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
