'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, BookOpen, MessageSquare, CalendarDays } from 'lucide-react'

type DashboardSummary = {
  members: number
  events: number
  resources: number
  discussions: number
}

type Discussion = {
  _id: string
  title: string
  created_at?: string
}

type EventItem = {
  id: string
  title: string
  date: string
  time: string
}

export default function DashboardHome() {
  const [userName, setUserName] = useState('Utilisateur')
  const [summary, setSummary] = useState<DashboardSummary>({ members: 0, events: 0, resources: 0, discussions: 0 })
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profileRes, publicSummaryRes, resourcesRes, discussionsRes, eventsRes] = await Promise.all([
          fetch('/api/auth/profile'),
          fetch('/api/public/summary'),
          fetch('/api/resources?limit=1'),
          fetch('/api/discussions?limit=5'),
          fetch('/api/events?limit=4'),
        ])

        if (profileRes.ok) {
          const profile = await profileRes.json()
          setUserName(profile.name || 'Utilisateur')
        }

        const publicSummary = publicSummaryRes.ok ? await publicSummaryRes.json() : {}
        const resourcesPayload = resourcesRes.ok ? await resourcesRes.json() : { pagination: { total: 0 } }
        const discussionsPayload = discussionsRes.ok ? await discussionsRes.json() : { data: [], pagination: { total: 0 } }
        const eventsPayload = eventsRes.ok ? await eventsRes.json() : { data: [] }

        setSummary({
          members: publicSummary.members || 0,
          events: publicSummary.events || 0,
          resources: resourcesPayload.pagination?.total || resourcesPayload.data?.length || 0,
          discussions: discussionsPayload.pagination?.total || discussionsPayload.data?.length || 0,
        })
        setDiscussions(discussionsPayload.data || [])
        setEvents(eventsPayload.data || [])
      } catch (error) {
        console.error('Unable to load dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const stats = [
    { icon: Users, label: 'Membres actifs', value: summary.members, color: 'text-primary' },
    { icon: BookOpen, label: 'Ressources', value: summary.resources, color: 'text-primary' },
    { icon: MessageSquare, label: 'Discussions', value: summary.discussions, color: 'text-primary' },
    { icon: CalendarDays, label: 'Evenements', value: summary.events, color: 'text-primary' },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Bienvenue {loading ? '...' : userName}</h2>
        <p className="text-muted-foreground">Voici un apercu dynamique de la communaute.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Discussions recentes</CardTitle>
            <CardDescription>Les derniers sujets publies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {discussions.map((discussion) => (
                <Link key={discussion._id} href="/dashboard/discussions" className="block rounded-lg border border-border p-3 hover:bg-muted/50">
                  <p className="font-medium text-foreground">{discussion.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {discussion.created_at ? new Date(discussion.created_at).toLocaleDateString('fr-FR') : ''}
                  </p>
                </Link>
              ))}
              {discussions.length === 0 && <p className="text-sm text-muted-foreground">Aucune discussion pour le moment.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/resources">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Ajouter une ressource
              </Button>
            </Link>
            <Link href="/dashboard/discussions">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Creer une discussion
              </Button>
            </Link>
            <Link href="/dashboard/members">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Voir les membres
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prochains Evenements</CardTitle>
          <CardDescription>Activites publiques a venir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <div key={event.id} className="border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground">{event.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>
            ))}
            {events.length === 0 && <p className="text-sm text-muted-foreground">Aucun evenement public pour le moment.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
