'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, CheckCircle, Trash2, AlertTriangle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type Resource = {
  _id: string
  title: string
  author_id?: { name?: string } | string
  status?: string
  report_count?: number
  created_at?: string
}

export default function AdminResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchResources() {
    try {
      setLoading(true)
      const response = await fetch('/api/resources?admin=true&limit=100', { cache: 'no-store' })
      if (!response.ok) throw new Error('Impossible de charger les ressources.')
      const payload = await response.json()
      setResources(payload.data || [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  async function updateResource(id: string, status: string) {
    const response = await fetch('/api/resources', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (response.ok) await fetchResources()
  }

  async function deleteResource(id: string) {
    const response = await fetch(`/api/resources?id=${id}`, { method: 'DELETE' })
    if (response.ok) setResources((items) => items.filter((item) => item._id !== id))
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Moderation des Ressources</h2>
        <p className="text-muted-foreground">Approuver et gerer les ressources partagees dans MongoDB</p>
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

      {error && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ressources a Moderer</CardTitle>
          <CardDescription>Approuver, rejeter ou supprimer les ressources soumises</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading && <p className="text-sm text-muted-foreground">Chargement...</p>}
            {filteredResources.map((resource) => {
              const author = typeof resource.author_id === 'string' ? 'Utilisateur' : resource.author_id?.name || 'Utilisateur'
              return (
                <div key={resource._id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <h3 className="font-semibold text-foreground text-lg">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">par {author}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          resource.status === 'approved'
                            ? 'bg-green-500/10 text-green-600'
                            : resource.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : 'bg-red-500/10 text-red-600'
                        }`}>
                          {resource.status || 'approved'}
                        </span>
                        {(resource.report_count || 0) > 0 && (
                          <span className="bg-red-500/10 text-red-600 px-2 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {resource.report_count} signalement(s)
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          {resource.created_at ? new Date(resource.created_at).toLocaleDateString('fr-FR') : '-'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end md:items-center">
                      <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => updateResource(resource._id, 'approved')}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approuver
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateResource(resource._id, 'rejected')}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteResource(resource._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
