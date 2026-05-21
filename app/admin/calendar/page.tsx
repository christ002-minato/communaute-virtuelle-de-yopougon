'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { EventCalendar, type CalendarEvent } from '@/components/event-calendar'
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock, X } from 'lucide-react'

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Cours Python', date: '2026-03-25', time: '14:00 - 16:00', location: 'Centre CVY, Yopougon Maroc', type: 'cours', description: 'Introduction aux bases de Python' },
  { id: '2', title: 'Atelier CV', date: '2026-03-26', time: '10:00 - 12:00', location: 'Salle 2, Complexe Yopougon', type: 'formation', description: 'Comment rédiger un CV professionnel' },
  { id: '3', title: 'Maracana', date: '2026-03-28', time: '15:00 - 18:00', location: 'Complexe Sportif Yopougon', type: 'sport', description: 'Tournoi de football inter-quartiers' },
  { id: '4', title: 'Sortie Plage', date: '2026-03-29', time: '08:00 - 18:00', location: 'Grand-Bassam', type: 'detente', description: 'Journée détente à la plage' },
  { id: '5', title: 'Cours Réseaux', date: '2026-03-30', time: '14:00 - 16:00', location: 'Centre CVY, Yopougon Maroc', type: 'cours' },
  { id: '6', title: 'Initiation IA', date: '2026-04-02', time: '10:00 - 13:00', location: 'Salle Informatique, Yopougon', type: 'formation' },
]

const eventTypeOptions = [
  { value: 'cours', label: 'Cours de soutien', color: 'bg-blue-500' },
  { value: 'formation', label: 'Formation spéciale', color: 'bg-green-600' },
  { value: 'sport', label: 'Journée sportive', color: 'bg-red-500' },
  { value: 'detente', label: 'Sortie détente', color: 'bg-yellow-500' },
]

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEvent) {
      setEvents(events.map(ev => 
        ev.id === editingEvent.id 
          ? { ...ev, ...formData }
          : ev
      ))
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        ...formData,
      }
      setEvents([...events, newEvent])
    }
    closeModal()
  }

  const deleteEvent = (id: string) => {
    if (confirm('Supprimer cet événement?')) {
      setEvents(events.filter(ev => ev.id !== id))
    }
  }

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    return eventTypeOptions.find(opt => opt.value === type)?.color || 'bg-gray-500'
  }

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    return eventTypeOptions.find(opt => opt.value === type)?.label || type
  }

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Gestion du Calendrier</h2>
          <p className="text-muted-foreground">Ajoutez, modifiez ou supprimez les événements</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvel événement
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aperçu du calendrier</CardTitle>
            <CardDescription>Visualisez les événements tels qu'ils apparaissent sur le site</CardDescription>
          </CardHeader>
          <CardContent>
            <EventCalendar events={events} />
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des événements</CardTitle>
            <CardDescription>{events.length} événements programmés</CardDescription>
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

              {events.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>Aucun événement programmé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{editingEvent ? 'Modifier' : 'Nouvel'} événement</CardTitle>
                <CardDescription>
                  {editingEvent ? 'Modifiez les détails de l\'événement' : 'Ajoutez un nouvel événement au calendrier'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'événement</Label>
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
                  <Label>Type d'activité</Label>
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
                    placeholder="Détails supplémentaires sur l'événement..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingEvent ? 'Enregistrer' : 'Créer'}
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
