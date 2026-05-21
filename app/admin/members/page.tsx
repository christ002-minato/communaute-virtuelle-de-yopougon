'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Trash2, Lock, Unlock } from 'lucide-react'
import { useState } from 'react'

export default function AdminMembersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const members = [
    { id: 1, name: 'Marie Diallo', email: 'marie@example.com', role: 'Modérateur', status: 'Actif', joinDate: '2024-01-15' },
    { id: 2, name: 'Pierre Koffi', email: 'pierre@example.com', role: 'Membre', status: 'Actif', joinDate: '2024-02-01' },
    { id: 3, name: 'Aya Kouadio', email: 'aya@example.com', role: 'Membre', status: 'Actif', joinDate: '2024-02-10' },
    { id: 4, name: 'Sow Diané', email: 'sow@example.com', role: 'Membre', status: 'Suspendu', joinDate: '2024-01-20' },
    { id: 5, name: 'Kofi Mensah', email: 'kofi@example.com', role: 'Modérateur', status: 'Actif', joinDate: '2023-12-05' },
  ]

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                      <select className="text-sm bg-muted border border-border rounded px-2 py-1">
                        <option>Membre</option>
                        <option selected={member.role === 'Modérateur'}>Modérateur</option>
                        <option>Admin</option>
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
