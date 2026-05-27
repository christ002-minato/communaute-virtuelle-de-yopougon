'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

type Member = {
  _id: string
  name: string
  email: string
  role: string
  status: string
  created_at?: string
  avatar_url?: string | null
}

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/users', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Impossible de charger les membres.')
        return response.json()
      })
      .then((data) => setMembers(data || []))
      .catch((err) => {
        console.error(err)
        setError(err.message || 'Erreur')
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Membres de la Communaute</h2>
        <p className="text-muted-foreground">Connectez-vous avec les autres membres reels</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un membre..."
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
          <CardTitle>Tous les Membres ({filteredMembers.length})</CardTitle>
          <CardDescription>Liste complete issue de MongoDB</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">Membre depuis</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-semibold text-primary">{member.name.charAt(0)}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{member.role}</td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.status === 'active'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-gray-500/10 text-gray-600'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground text-xs">
                        {member.created_at ? new Date(member.created_at).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
