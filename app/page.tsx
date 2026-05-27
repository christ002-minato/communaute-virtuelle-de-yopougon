'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Users, GraduationCap, Lightbulb, MapPin, Play, ArrowRight, ImageIcon, ExternalLink } from 'lucide-react'
import { EventCalendar, type CalendarEvent } from '@/components/event-calendar'
import { useEffect, useState } from 'react'

type Project = {
  _id: string
  title: string
  description?: string
  image_url?: string
  project_url?: string
  category?: string
  author_name?: string
}

type GalleryItem = {
  _id: string
  title: string
  description?: string
  image_url: string
  link_url?: string
  album?: string
}

type Advertisement = {
  _id: string
  title: string
  image_url: string
  target_url?: string
  sponsor_name?: string
}

type PublicSummary = {
  members: number
  events: number
  projects: number
  galleryItems: number
}

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [ads, setAds] = useState<Advertisement[]>([])
  const [summary, setSummary] = useState<PublicSummary>({ members: 0, events: 0, projects: 0, galleryItems: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/events?limit=20').then((r) => r.json()),
      fetch('/api/projects?limit=6').then((r) => r.json()),
      fetch('/api/gallery?limit=6').then((r) => r.json()),
      fetch('/api/ads?placement=banner').then((r) => r.json()),
      fetch('/api/public/summary').then((r) => r.json()),
    ])
      .then(([eventsPayload, projectsPayload, galleryPayload, adsPayload, summaryPayload]) => {
        setEvents(eventsPayload.data || [])
        setProjects(projectsPayload.data || [])
        setGallery(galleryPayload.data || [])
        setAds(adsPayload.data || [])
        setSummary({
          members: summaryPayload.members || 0,
          events: summaryPayload.events || 0,
          projects: summaryPayload.projects || 0,
          galleryItems: summaryPayload.galleryItems || 0,
        })
      })
      .catch((error) => console.warn('Failed to load public Mongo data', error))
  }, [])

  const statCards = [
    { value: summary.members, label: 'Membres actifs' },
    { value: summary.events, label: 'Evenements publies' },
    { value: summary.projects, label: 'Projets valorises' },
    { value: summary.galleryItems, label: 'Photos partagees' },
  ]

  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">CVY</span>
              </div>
              <span className="hidden md:block font-semibold">Communaute Virtuelle Yopougon</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#" className="hover:opacity-80 font-medium border-b-2 border-white pb-1">Accueil</Link>
              <Link href="#about" className="hover:opacity-80">A propos</Link>
              <Link href="#calendar" className="hover:opacity-80">Calendrier</Link>
              <Link href="#projects" className="hover:opacity-80">Projets</Link>
              <Link href="#gallery" className="hover:opacity-80">Galerie</Link>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="secondary" size="sm">Connexion</Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Inscription
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <div className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm mb-4">
                Bienvenue chez nous
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Transformez vos <span className="italic font-serif">ambitions</span> en reussite
              </h1>
              <p className="text-white/80 mb-8 text-lg">
                Rejoignez la communaute de Yopougon et accedez a des formations, des evenements,
                des projets et des ressources issus de vraies donnees MongoDB.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Rejoindre maintenant <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#calendar">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary gap-2">
                    <Play className="w-4 h-4" /> Voir les activites
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-10">
                <div>
                  <div className="text-4xl font-bold">{summary.members}</div>
                  <div className="text-sm text-white/70">Membres actifs</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">{summary.events}</div>
                  <div className="text-sm text-white/70">Activites publiees</div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative w-full h-[400px]">
                <div className="absolute top-0 right-0 w-[280px] h-[320px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src="/images/hero-community.jpg" alt="Communaute CVY" fill className="object-cover" />
                </div>
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image src="/images/students-study.jpg" alt="Etudiants" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ borderTopLeftRadius: '50% 100%', borderTopRightRadius: '50% 100%' }} />
      </section>

      {ads.length > 0 && (
        <section className="py-6 px-4 bg-background">
          <div className="max-w-7xl mx-auto grid gap-4 md:grid-cols-2">
            {ads.slice(0, 2).map((ad) => (
              <a
                key={ad._id}
                href={ad.target_url || '#'}
                className="block overflow-hidden rounded-lg border border-border bg-card"
                target={ad.target_url ? '_blank' : undefined}
                rel={ad.target_url ? 'noreferrer' : undefined}
              >
                <img src={ad.image_url} alt={ad.title} className="h-32 w-full object-cover" />
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{ad.title}</span>
                  <span className="text-muted-foreground">{ad.sponsor_name}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="py-12 md:py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <Card key={stat.label} className="text-center p-6 border-none shadow-lg">
                <div className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-12 md:py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm mb-4">
              Pourquoi nous choisir
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Une communaute active a Yopougon
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <GraduationCap className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Formations</h3>
              <p className="text-muted-foreground text-sm">Cours physiques, ateliers pratiques et entraide informatique.</p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow group bg-primary text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vie communautaire</h3>
              <p className="text-white/80 text-sm">Sport, sorties detente et moments d'apprentissage partages.</p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <Lightbulb className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Projets reels</h3>
              <p className="text-muted-foreground text-sm">Sites web, affiches, applications mobiles et realisations des membres.</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="calendar" className="py-12 md:py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm mb-4">
              Nos activites
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Calendrier des evenements</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cours physiques a Yopougon, maracana, sorties et ateliers publies depuis l'administration.
            </p>
          </div>

          <Card className="p-4 md:p-6 shadow-lg">
            {events.length > 0 ? (
              <EventCalendar events={events} />
            ) : (
              <div className="py-12 text-center text-muted-foreground">Aucun evenement public pour le moment.</div>
            )}
          </Card>

          <div className="mt-8 md:hidden">
            <h3 className="font-semibold text-foreground mb-4">Prochains evenements</h3>
            <div className="space-y-3">
              {events.slice(0, 4).map(event => (
                <Card key={event.id} className="p-3 flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'cours' ? 'bg-blue-500' :
                    event.type === 'formation' ? 'bg-green-600' :
                    event.type === 'sport' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm truncate">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.date} - {event.time}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-12 md:py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm mb-4">
              Vitrine des projets
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Creations de la communaute</h2>
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {projects.map((project) => (
                <Card key={project._id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="text-xs text-primary">{project.category}</div>
                    <h3 className="mt-1 font-semibold text-foreground">{project.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground truncate">{project.author_name}</span>
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary">
                          Voir <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">Aucun projet public pour le moment.</Card>
          )}
        </div>
      </section>

      <section id="gallery" className="py-12 md:py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm mb-4">
              Galerie d'activites
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Moments de detente et d'apprentissage</h2>
          </div>

          {gallery.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  {item.link_url ? (
                    <a href={item.link_url} target="_blank" rel="noreferrer">
                      <img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" />
                    </a>
                  ) : (
                    <img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" />
                  )}
                  <CardContent className="p-4">
                    <div className="text-xs text-primary">{item.album}</div>
                    <h3 className="mt-1 font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">Aucune photo publique pour le moment.</Card>
          )}
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Commencez votre parcours avec la CVY</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Rejoignez les membres actifs et participez aux prochaines activites de Yopougon.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="gap-2">
              Creer mon compte <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer id="contact" className="bg-foreground text-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold">CVY</span>
              </div>
              <p className="text-sm text-background/70">
                La Communaute Virtuelle de Yopougon - ensemble pour un avenir meilleur.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="#" className="hover:text-primary">Accueil</Link></li>
                <li><Link href="#calendar" className="hover:text-primary">Calendrier</Link></li>
                <li><Link href="#projects" className="hover:text-primary">Projets</Link></li>
                <li><Link href="/login" className="hover:text-primary">Connexion</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-background/70">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Yopougon, Abidjan</p>
                <p className="flex items-center gap-2"><Users className="h-4 w-4" /> Communaute CVY</p>
              </div>
            </div>
          </div>
          <div className="border-t border-background/20 mt-10 pt-6 text-sm text-background/70">
            <p>&copy; 2026 Communaute Virtuelle de Yopougon. Tous droits reserves.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
