'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { EventCalendar, type CalendarEvent } from '@/components/event-calendar'
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock, X, RefreshCw } from 'lucide-react'

const eventTypeOptions = [
  { value: 'cours', label: 'Cours de soutien', color: 'bg-blue-500' },
  { value: 'formation', label: 'Formation speciale', color: 'bg-green-600' },
  { value: 'sport', label: 'Journee sportive', color: 'bg-red-500' },
  { value: 'detente', label: 'Sortie detente', color: 'bg-yellow-500' },
]

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'cours' as CalendarEvent['type'],
    description: '',
  })

  async function fetchEvents() {
    try {
      setLoading(true)
      const response = await fetch('/api/events?admin=true&limit=200', { cache: 'no-store' })
      if (!response.ok) throw new Error('Impossible de charger les evenements.')
      const payload = await response.json()
      setEvents(payload.data || [])
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const openModal = (event?: CalendarEvent) => {
    if (event) {
      setEditingEvent(event)
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type,
        description: event.description || '',
      })
    } else {
      setEditingEvent(null)
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        type: 'cours',
        description: '',
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const response = await fetch('/api/events', {
        method: editingEvent ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent ? { id: editingEvent.id, ...formData } : formData),
      })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error || 'Enregistrement impossible.')
      }
      await fetchEvents()
      closeModal()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const deleteEvent = async (id: string) => {
    if (!confirm('Supprimer cet evenement?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/events?id=${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload?.error || 'Suppression impossible.')
      }
      setEvents((items) => items.filter((event) => event.id !== id))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    return eventTypeOptions.find(opt => opt.value === type)?.color || 'bg-gray-500'
  }

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    return eventTypeOptions.find(opt => opt.value === type)?.label || type
  }

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Gestion du Calendrier</h2>
          <p className="text-muted-foreground">Ajoutez, modifiez ou supprimez les evenements MongoDB</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchEvents} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvel evenement
          </Button>
        </div>
      </div>

      {error && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Apercu du calendrier</CardTitle>
            <CardDescription>Visualisez les evenements tels qu'ils apparaissent sur le site</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Chargement...</p> : <EventCalendar events={events} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des evenements</CardTitle>
            <CardDescription>{events.length} evenement(s) programme(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {sortedEvents.map(event => (
                <div
                  key={event.id}
                  className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getEventTypeColor(event.type)}`} />
                      <span className="font-medium text-foreground truncate">{event.title}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openModal(event)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteEvent(event.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${getEventTypeColor(event.type)}`}>
                      {getEventTypeLabel(event.type)}
                    </span>
                  </div>
                </div>
              ))}

              {!loading && events.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>Aucun evenement programme</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{editingEvent ? 'Modifier' : 'Nouvel'} evenement</CardTitle>
                <CardDescription>
                  {editingEvent ? "Modifiez les details de l'evenement" : 'Ajoutez un nouvel evenement au calendrier'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'evenement</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Cours Python"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Horaire</Label>
                    <Input
                      id="time"
                      value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      placeholder="14:00 - 16:00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Lieu (Yopougon)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Centre CVY, Yopougon Maroc"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type d'activite</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {eventTypeOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: option.value as CalendarEvent['type'] })}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.type === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${option.color}`} />
                          <span className="text-sm font-medium text-foreground">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Details supplementaires sur l'evenement..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {editingEvent ? 'Enregistrer' : 'Creer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
