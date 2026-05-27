'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, BookOpen, MessageSquare, Activity, LayoutGrid, CalendarDays } from 'lucide-react'

interface SummaryData {
  students: number
  teachers: number
  admins: number
  members: number
  events: number
}

type Discussion = {
  _id: string
  title: string
  created_at?: string
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const [statsResponse, discussionsResponse] = await Promise.all([
          fetch('/api/admin/stats', { cache: 'no-store' }),
          fetch('/api/discussions?limit=5', { cache: 'no-store' }),
        ])

        if (!statsResponse.ok) {
          const data = await statsResponse.json().catch(() => null)
          setError(data?.error || 'Impossible de charger les statistiques admin.')
          return
        }

        setSummary(await statsResponse.json())
        if (discussionsResponse.ok) {
          const payload = await discussionsResponse.json()
          setDiscussions(payload.data || [])
        }
      } catch (err) {
        console.error('Summary fetch failed:', err)
        setError('Impossible de charger les statistiques admin.')
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  const stats = [
    { icon: Users, label: 'Etudiants', value: summary ? summary.students.toLocaleString('fr-FR') : loading ? '...' : '0', color: 'text-blue-500' },
    { icon: BookOpen, label: 'Enseignants', value: summary ? summary.teachers.toLocaleString('fr-FR') : loading ? '...' : '0', color: 'text-green-500' },
    { icon: Activity, label: 'Membres', value: summary ? summary.members.toLocaleString('fr-FR') : loading ? '...' : '0', color: 'text-red-500' },
    { icon: CalendarDays, label: 'Evenements', value: summary ? summary.events.toLocaleString('fr-FR') : loading ? '...' : '0', color: 'text-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Tableau de Bord Administrateur</h2>
        <p className="text-muted-foreground">Gestion et moderation de la communaute</p>
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
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
            <CardDescription>Sujets actifs a surveiller</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {discussions.map((discussion) => (
                <Link key={discussion._id} href="/admin/discussions" className="block rounded-lg border border-border p-3 hover:bg-muted/50">
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
            <Link href="/admin/members">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Gerer Membres
              </Button>
            </Link>
            <Link href="/admin/resources">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Moderer Ressources
              </Button>
            </Link>
            <Link href="/admin/discussions">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Moderer Discussions
              </Button>
            </Link>
            <Link href="/admin/content">
              <Button variant="outline" className="w-full justify-start">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Zones Publiques
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
