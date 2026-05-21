'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu, X, LogOut, Settings, BarChart3, Users, MessageSquare, Shield, BookOpen, CalendarDays, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const router = useRouter()

  const navItems = [
    { icon: BarChart3, label: 'Tableau de Bord', href: '/admin' },
    { icon: CalendarDays, label: 'Calendrier Activités', href: '/admin/calendar' },
    { icon: Users, label: 'Gestion Membres', href: '/admin/members' },
    { icon: BookOpen, label: 'Modération Ressources', href: '/admin/resources' },
    { icon: MessageSquare, label: 'Modération Discussions', href: '/admin/discussions' },
    { icon: Shield, label: 'Paramètres Système', href: '/admin/settings' },
  ]

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch('/api/auth/profile')

        if (!response.ok) {
          router.push('/login')
          return
        }

        const data = await response.json()
        if (data.role !== 'admin') {
          router.push('/unauthorized')
          return
        }
      } catch (error) {
        console.error('Admin verification failed:', error)
        router.push('/login')
        return
      } finally {
        setCheckingAdmin(false)
      }
    }

    verifyAdmin()
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

  if (checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-5 shadow-md">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-foreground">Vérification des droits administrateur...</span>
        </div>
      </div>
    )
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
            CVY Admin
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-primary/10 hover:text-primary-foreground transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border space-y-2">
          <Link href="/admin/settings">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-primary/10 hover:text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-primary/10 hover:text-primary-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
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
              Administration
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center font-semibold">
                AD
              </div>
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
