'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, BookOpen, MessageSquare, AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SummaryData {
  users: number
  members: number
  resources: number
  discussions: number
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('/api/admin/summary')
        if (!response.ok) {
          const data = await response.json().catch(() => null)
          setError(data?.error || 'Impossible de charger les statistiques admin.')
          return
        }

        const data = await response.json()
        setSummary(data)
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
    { icon: Users, label: 'Utilisateurs', value: summary ? summary.users.toLocaleString('fr-FR') : loading ? '...' : '0', change: '+12%', color: 'text-blue-500' },
    { icon: BookOpen, label: 'Ressources', value: summary ? summary.resources.toLocaleString('fr-FR') : loading ? '...' : '0', change: '+26%', color: 'text-green-500' },
    { icon: MessageSquare, label: 'Discussions', value: summary ? summary.discussions.toLocaleString('fr-FR') : loading ? '...' : '0', change: '+8%', color: 'text-purple-500' },
    { icon: AlertTriangle, label: 'Membres', value: summary ? summary.members.toLocaleString('fr-FR') : loading ? '...' : '0', change: '-2%', color: 'text-red-500' },
  ]

  const chartData = [
    { day: 'Lun', users: 450, activity: 240 },
    { day: 'Mar', users: 520, activity: 280 },
    { day: 'Mer', users: 480, activity: 260 },
    { day: 'Jeu', users: 620, activity: 350 },
    { day: 'Ven', users: 740, activity: 420 },
    { day: 'Sam', users: 890, activity: 480 },
    { day: 'Dim', users: 950, activity: 520 },
  ]

  const recentActivity = [
    { type: 'user', message: 'Nouveau membre: Aissatou Ba', time: 'Il y a 2h' },
    { type: 'resource', message: 'Ressource signalée par 3 utilisateurs', time: 'Il y a 4h' },
    { type: 'discussion', message: 'Discussion fermée: Contenu inapproprié', time: 'Hier' },
    { type: 'user', message: 'Compte utilisateur désactivé', time: 'Il y a 1j' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Tableau de Bord Administrateur</h2>
        <p className="text-muted-foreground">Gestion et modération de la communauté</p>
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Stats Grid */}
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
                    <p className="text-xs text-green-600 mt-2">{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activité Hebdomadaire</CardTitle>
            <CardDescription>Utilisateurs et activité par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="var(--primary)"
                  strokeWidth={2}
                  name="Utilisateurs connectés"
                />
                <Line 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="var(--secondary)"
                  strokeWidth={2}
                  name="Activité"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/members">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Gérer Membres
              </Button>
            </Link>
            <Link href="/admin/resources">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Modérer Ressources
              </Button>
            </Link>
            <Link href="/admin/discussions">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Modérer Discussions
              </Button>
            </Link>
            <Button className="w-full">Créer Annonce</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
          <CardDescription>Actions des administrateurs et événements système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  {activity.type === 'user' && <Users className="w-5 h-5 text-primary" />}
                  {activity.type === 'resource' && <BookOpen className="w-5 h-5 text-primary" />}
                  {activity.type === 'discussion' && <MessageSquare className="w-5 h-5 text-primary" />}
                  {activity.type === 'activity' && <Activity className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
