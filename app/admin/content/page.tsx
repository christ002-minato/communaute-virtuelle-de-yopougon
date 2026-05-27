'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageIcon, Plus, RefreshCw, Trash2 } from 'lucide-react'

type PublicItem = {
  _id: string
  title: string
  description?: string
  image_url?: string
  link_url?: string
  project_url?: string
  target_url?: string
  category?: string
  author_name?: string
  album?: string
  sponsor_name?: string
}

type ProjectForm = {
  title: string
  description: string
  image_url: string
  project_url: string
  category: string
  author_name: string
}

type GalleryForm = {
  title: string
  description: string
  image_url: string
  link_url: string
  album: string
  activity_date: string
}

type AdForm = {
  title: string
  image_url: string
  target_url: string
  placement: string
  sponsor_name: string
}

const defaultProject: ProjectForm = {
  title: '',
  description: '',
  image_url: '',
  project_url: '',
  category: 'site-web',
  author_name: '',
}

const defaultGallery: GalleryForm = {
  title: '',
  description: '',
  image_url: '',
  link_url: '',
  album: 'Activites CVY',
  activity_date: '',
}

const defaultAd: AdForm = {
  title: '',
  image_url: '',
  target_url: '',
  placement: 'banner',
  sponsor_name: '',
}

export default function AdminContentPage() {
  const [projects, setProjects] = useState<PublicItem[]>([])
  const [gallery, setGallery] = useState<PublicItem[]>([])
  const [ads, setAds] = useState<PublicItem[]>([])
  const [projectForm, setProjectForm] = useState<ProjectForm>(defaultProject)
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(defaultGallery)
  const [adForm, setAdForm] = useState<AdForm>(defaultAd)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchContent() {
    try {
      setLoading(true)
      const [projectPayload, galleryPayload, adPayload] = await Promise.all([
        fetch('/api/projects?admin=true&limit=50', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/gallery?admin=true&limit=50', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/ads?admin=true', { cache: 'no-store' }).then((r) => r.json()),
      ])
      setProjects(projectPayload.data || [])
      setGallery(galleryPayload.data || [])
      setAds(adPayload.data || [])
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  async function createItem(endpoint: string, body: Record<string, unknown>, reset: () => void) {
    try {
      setSaving(true)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error || 'Creation impossible.')
      }
      reset()
      await fetchContent()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  async function uploadFile(file: File, onUploaded: (url: string) => void, fieldName: string) {
    try {
      setUploadingField(fieldName)
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error || 'Upload impossible.')
      }
      const payload = await response.json()
      onUploaded(payload.url)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setUploadingField(null)
    }
  }

  async function deleteItem(endpoint: string, id: string) {
    try {
      setSaving(true)
      const response = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error || 'Suppression impossible.')
      }
      await fetchContent()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Zones Publiques</h2>
          <p className="text-muted-foreground">Alimentez la vitrine projets, la galerie et les espaces publicitaires.</p>
        </div>
        <Button variant="outline" onClick={fetchContent} disabled={loading}>
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

      <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="gallery">Galerie</TabsTrigger>
          <TabsTrigger value="ads">Publicites</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <ContentPanel
            title="Vitrine des projets"
            description="Sites web, affiches, applications mobiles et autres creations."
            items={projects}
            onDelete={(id) => deleteItem('/api/projects', id)}
            form={(
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  createItem('/api/projects', projectForm, () => setProjectForm(defaultProject))
                }}
              >
                <Field label="Titre"><Input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required /></Field>
                <Field label="Auteur"><Input value={projectForm.author_name} onChange={(e) => setProjectForm({ ...projectForm, author_name: e.target.value })} /></Field>
                <Field label="Image par URL"><Input value={projectForm.image_url} onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })} /></Field>
                <Field label="Ou importer une image">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadFile(file, (url) => setProjectForm((current) => ({ ...current, image_url: url })), 'project-image')
                    }}
                  />
                </Field>
                <Field label="URL projet"><Input value={projectForm.project_url} onChange={(e) => setProjectForm({ ...projectForm, project_url: e.target.value })} /></Field>
                <Field label="Categorie"><Input value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} placeholder="site-web, graphisme, mobile, autre" /></Field>
                <Field label="Description"><Textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} /></Field>
                <Button type="submit" disabled={saving || uploadingField === 'project-image'}><Plus className="w-4 h-4 mr-2" />Ajouter</Button>
              </form>
            )}
          />
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <ContentPanel
            title="Galerie d'activites"
            description="Photos d'apprentissage, sorties et moments communautaires."
            items={gallery}
            onDelete={(id) => deleteItem('/api/gallery', id)}
            form={(
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  createItem('/api/gallery', galleryForm, () => setGalleryForm(defaultGallery))
                }}
              >
                <Field label="Titre"><Input value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} required /></Field>
                <Field label="Image par URL"><Input value={galleryForm.image_url} onChange={(e) => setGalleryForm({ ...galleryForm, image_url: e.target.value })} required /></Field>
                <Field label="Ou importer une image">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadFile(file, (url) => setGalleryForm((current) => ({ ...current, image_url: url })), 'gallery-image')
                    }}
                  />
                </Field>
                <Field label="URL lien"><Input value={galleryForm.link_url} onChange={(e) => setGalleryForm({ ...galleryForm, link_url: e.target.value })} /></Field>
                <Field label="Album"><Input value={galleryForm.album} onChange={(e) => setGalleryForm({ ...galleryForm, album: e.target.value })} /></Field>
                <Field label="Date activite"><Input type="date" value={galleryForm.activity_date} onChange={(e) => setGalleryForm({ ...galleryForm, activity_date: e.target.value })} /></Field>
                <Field label="Description"><Textarea value={galleryForm.description} onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })} /></Field>
                <Button type="submit" disabled={saving || uploadingField === 'gallery-image'}><Plus className="w-4 h-4 mr-2" />Ajouter</Button>
              </form>
            )}
          />
        </TabsContent>

        <TabsContent value="ads" className="mt-6">
          <ContentPanel
            title="Zone publicitaire"
            description="Bannieres partenaires et sponsors locaux de Yopougon."
            items={ads}
            onDelete={(id) => deleteItem('/api/ads', id)}
            form={(
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  createItem('/api/ads', adForm, () => setAdForm(defaultAd))
                }}
              >
                <Field label="Titre"><Input value={adForm.title} onChange={(e) => setAdForm({ ...adForm, title: e.target.value })} required /></Field>
                <Field label="Sponsor"><Input value={adForm.sponsor_name} onChange={(e) => setAdForm({ ...adForm, sponsor_name: e.target.value })} /></Field>
                <Field label="Image par URL"><Input value={adForm.image_url} onChange={(e) => setAdForm({ ...adForm, image_url: e.target.value })} required /></Field>
                <Field label="Ou importer une image">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadFile(file, (url) => setAdForm((current) => ({ ...current, image_url: url })), 'ad-image')
                    }}
                  />
                </Field>
                <Field label="URL cible"><Input value={adForm.target_url} onChange={(e) => setAdForm({ ...adForm, target_url: e.target.value })} /></Field>
                <Field label="Placement"><Input value={adForm.placement} onChange={(e) => setAdForm({ ...adForm, placement: e.target.value })} placeholder="banner ou sidebar" /></Field>
                <Button type="submit" disabled={saving || uploadingField === 'ad-image'}><Plus className="w-4 h-4 mr-2" />Ajouter</Button>
              </form>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function ContentPanel({
  title,
  description,
  items,
  form,
  onDelete,
}: {
  title: string
  description: string
  items: PublicItem[]
  form: React.ReactNode
  onDelete: (id: string) => void
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{form}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Elements publies</CardTitle>
          <CardDescription>{items.length} element(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <div key={item._id} className="rounded-lg border border-border p-3">
                <div className="aspect-video overflow-hidden rounded-md bg-muted">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-7 w-7" />
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-medium text-foreground">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.description || item.author_name || item.album || item.sponsor_name}
                </p>
                {(item.project_url || item.link_url || item.target_url) && (
                  <a
                    href={item.project_url || item.link_url || item.target_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block truncate text-sm text-primary hover:underline"
                  >
                    {item.project_url || item.link_url || item.target_url}
                  </a>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => onDelete(item._id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun element pour le moment.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
