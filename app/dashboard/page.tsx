'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, BookOpen, MessageSquare, TrendingUp } from 'lucide-react'

export default function DashboardHome() {
  const [userName, setUserName] = useState('Utilisateur')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile')
        if (response.ok) {
          const data = await response.json()
          setUserName(data.name || 'Utilisateur')
        }
      } catch (error) {
        console.error('Unable to load profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const stats = [
    { icon: Users, label: 'Amis', value: '24', color: 'text-primary' },
    { icon: BookOpen, label: 'Ressources sauvegardées', value: '12', color: 'text-primary' },
    { icon: MessageSquare, label: 'Messages', value: '8', color: 'text-primary' },
    { icon: TrendingUp, label: 'Points', value: '450', color: 'text-primary' },
  ]

  const recentActivity = [
    { type: 'resource', user: 'Marie Diallo', action: 'a partagé une ressource', time: 'Il y a 2h' },
    { type: 'discussion', user: 'Pierre Koffi', action: 'a créé une discussion', time: 'Il y a 4h' },
    { type: 'joined', user: 'Aya Kouadio', action: 'a rejoint la communauté', time: 'Hier' },
    { type: 'resource', user: 'Sow Diané', action: 'a commenté une ressource', time: 'Il y a 1j' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Bienvenue {loading ? '...' : userName}</h2>
        <p className="text-muted-foreground">Voici un aperçu de votre activité communautaire</p>
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
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Les dernières mises à jour de la communauté</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
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
                Créer une discussion
              </Button>
            </Link>
            <Link href="/dashboard/members">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Trouver des amis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Prochains Événements</CardTitle>
          <CardDescription>Connectez-vous avec la communauté</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Réunion Mensuelle', date: '25 Mars 2024', time: '18h00' },
              { title: 'Atelier: Entrepreneuriat', date: '30 Mars 2024', time: '19h00' },
            ].map((event, idx) => (
              <div key={idx} className="border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground">{event.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Participer
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
