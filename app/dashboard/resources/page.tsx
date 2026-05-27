'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Search, Download, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

type Resource = {
  _id: string
  title: string
  description?: string
  url?: string
  file_url?: string
  category?: string
  download_count?: number
  author_id?: { name?: string } | string
  created_at?: string
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', url: '', file_url: '', category: 'general' })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchResources() {
    try {
      setLoading(true)
      const response = await fetch('/api/resources?limit=100', { cache: 'no-store' })
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

  async function createResource() {
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'link' }),
      })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error || 'Creation impossible.')
      }
      setFormData({ title: '', description: '', url: '', file_url: '', category: 'general' })
      setShowCreate(false)
      await fetchResources()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    }
  }

  async function uploadResourceFile(file: File) {
    try {
      setUploading(true)
      const payload = new FormData()
      payload.append('file', file)
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: payload,
      })
      if (!response.ok) {
        const json = await response.json()
        throw new Error(json?.error || 'Upload impossible.')
      }
      const json = await response.json()
      setFormData((current) => ({ ...current, file_url: json.url }))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setUploading(false)
    }
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (resource.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Ressources Partagees</h2>
        <p className="text-muted-foreground">Bibliotheque de ressources issues de MongoDB</p>
      </div>

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
        <Button className="whitespace-nowrap" onClick={() => setShowCreate((value) => !value)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une ressource
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardContent className="pt-6 grid gap-3">
            <Input placeholder="Titre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <Input placeholder="Categorie" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <Input placeholder="Lien externe" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,image/*,video/*,audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) uploadResourceFile(file)
              }}
            />
            {formData.file_url && (
              <p className="text-xs text-muted-foreground">Fichier importe: {formData.file_url}</p>
            )}
            <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={createResource} disabled={!formData.title.trim() || uploading}>Publier</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource._id} className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription>
                    {typeof resource.author_id === 'string' ? 'Utilisateur' : resource.author_id?.name || 'Utilisateur'}
                  </CardDescription>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                  {resource.category || 'general'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{resource.description}</p>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1" asChild disabled={!resource.url && !resource.file_url}>
                  <a href={resource.url || resource.file_url || '#'} target="_blank" rel="noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Ouvrir
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">Aucune ressource trouvee</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
