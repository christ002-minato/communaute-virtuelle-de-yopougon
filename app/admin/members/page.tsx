'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Trash2, Lock, Unlock } from 'lucide-react'

interface MemberRow {
  id: string
  userId: string
  name: string
  email: string
  role: string
  status: string
  joinDate: string
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/admin/members')
        if (!response.ok) {
          const data = await response.json().catch(() => null)
          setError(data?.error || 'Impossible de charger la liste des membres.')
          return
        }

        const data = await response.json()
        setMembers(data.members || [])
      } catch (err) {
        console.error('Members fetch failed:', err)
        setError('Impossible de charger la liste des membres.')
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const handleRoleUpdate = async (userId: string, role: string) => {
    setUpdatingUserId(userId)
    setError(null)

    try {
      const response = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error || 'Impossible de modifier le rôle.')
        return
      }

      const updatedUser = await response.json()
      setMembers((current) =>
        current.map((member) =>
          member.userId === updatedUser.userId
            ? { ...member, role: updatedUser.role }
            : member
        )
      )
    } catch (err) {
      console.error('Role update failed:', err)
      setError('Impossible de modifier le rôle.')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <p className="text-base text-muted-foreground">Chargement de la liste des membres...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Gestion des Membres</h2>
        <p className="text-muted-foreground">Contrôler et modérer les comptes utilisateurs</p>
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
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des Membres ({filteredMembers.length})</CardTitle>
          <CardDescription>Gestion administrative des comptes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Rôle</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">Statut</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{member.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{member.email}</td>
                    <td className="py-3 px-4">
                      <select
                        className="text-sm bg-muted border border-border rounded px-2 py-1"
                        value={member.role}
                        disabled={updatingUserId === member.userId}
                        onChange={(e) => handleRoleUpdate(member.userId, e.target.value)}
                      >
                        <option value="student">Étudiant</option>
                        <option value="teacher">Enseignant</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Modérateur</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        member.status === 'Actif'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">
                          {member.status === 'Actif' ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
