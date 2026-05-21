'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu, X, LogOut, Settings, Home, Users, BookOpen, MessageSquare, UserCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  _id: string
  name: string
  email: string
  avatar_url: string | null
  role: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const navItems = [
    { icon: Home, label: 'Accueil', href: '/dashboard' },
    { icon: UserCircle, label: 'Mon Profil', href: '/dashboard/profile' },
    { icon: Users, label: 'Membres', href: '/dashboard/members' },
    { icon: BookOpen, label: 'Ressources', href: '/dashboard/resources' },
    { icon: MessageSquare, label: 'Discussions', href: '/dashboard/discussions' },
  ]

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile')
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
          }
          return
        }

        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getInitials = () => {
    if (!user) return '?'
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '?'
  }

  const getDisplayName = () => {
    return user?.name || 'Utilisateur'
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="text-2xl font-bold text-sidebar-foreground">
            CVY
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border space-y-2">
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
              <Settings className="w-4 h-4 mr-2" />
              Parametres
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Deconnexion
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card border-b border-border sticky top-0 z-20">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-lg font-semibold text-foreground flex-1 md:flex-none ml-4 md:ml-0">
              Tableau de bord
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {loading ? '...' : getDisplayName()}
              </span>
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {loading ? '...' : getInitials()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
