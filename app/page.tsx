'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { Users, BookOpen, Lightbulb, GraduationCap, ChevronDown, Phone, Mail, MapPin, Play, ArrowRight, Star } from 'lucide-react'
import { EventCalendar, type CalendarEvent } from '@/components/event-calendar'
import { useState } from 'react'

// Sample events data - in production, fetch from API/Google Sheets
const sampleEvents: CalendarEvent[] = [
  { id: '1', title: 'Cours Python', date: '2026-03-25', time: '14:00 - 16:00', location: 'Centre CVY, Yopougon Maroc', type: 'cours', description: 'Introduction aux bases de Python' },
  { id: '2', title: 'Atelier CV', date: '2026-03-26', time: '10:00 - 12:00', location: 'Salle 2, Complexe Yopougon', type: 'formation', description: 'Comment rédiger un CV professionnel' },
  { id: '3', title: 'Maracana', date: '2026-03-28', time: '15:00 - 18:00', location: 'Complexe Sportif Yopougon', type: 'sport', description: 'Tournoi de football inter-quartiers' },
  { id: '4', title: 'Sortie Plage', date: '2026-03-29', time: '08:00 - 18:00', location: 'Grand-Bassam', type: 'detente', description: 'Journée détente à la plage' },
  { id: '5', title: 'Cours Réseaux', date: '2026-03-30', time: '14:00 - 16:00', location: 'Centre CVY, Yopougon Maroc', type: 'cours' },
  { id: '6', title: 'Initiation IA', date: '2026-04-02', time: '10:00 - 13:00', location: 'Salle Informatique, Yopougon', type: 'formation' },
  { id: '7', title: 'Algorithmique', date: '2026-04-05', time: '14:00 - 16:00', location: 'Centre CVY, Yopougon Maroc', type: 'cours' },
  { id: '8', title: 'Journée Sport', date: '2026-04-12', time: '09:00 - 17:00', location: 'Stade Municipal Yopougon', type: 'sport' },
]

const testimonials = [
  { name: 'Kouassi Aya', role: 'Membre depuis 2024', text: 'La CVY m\'a permis de développer mes compétences en programmation et de rencontrer des personnes incroyables.', rating: 5 },
  { name: 'Diallo Ibrahim', role: 'Étudiant en informatique', text: 'Les formations sont de qualité et l\'ambiance est vraiment familiale. Je recommande à tous les jeunes de Yopougon!', rating: 5 },
]

const faqs = [
  { q: 'Comment rejoindre la communauté?', a: 'Créez simplement un compte gratuit et vous aurez accès à toutes nos ressources et activités.' },
  { q: 'Les formations sont-elles payantes?', a: 'La plupart de nos formations sont gratuites. Certains ateliers spéciaux peuvent avoir des frais symboliques.' },
  { q: 'Où se déroulent les activités?', a: 'Nos activités se déroulent principalement dans la commune de Yopougon, à différents endroits selon le type d\'événement.' },
  { q: 'Qui peut participer?', a: 'Toute personne résidant à Yopougon ou ayant un lien avec la commune peut rejoindre notre communauté.' },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">CVY</span>
              </div>
              <span className="hidden md:block font-semibold">Communauté Virtuelle Yopougon</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#" className="hover:opacity-80 font-medium border-b-2 border-white pb-1">Accueil</Link>
              <Link href="#about" className="hover:opacity-80">À Propos</Link>
              <Link href="#calendar" className="hover:opacity-80">Calendrier</Link>
              <Link href="#testimonials" className="hover:opacity-80">Témoignages</Link>
              <Link href="#contact" className="hover:opacity-80">Contact</Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-sm mr-4">
                <Phone className="w-4 h-4" />
                <span>+225 07 00 00 00</span>
              </div>
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

      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <div className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm mb-4">
                Bienvenue chez nous
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Transformez vos{' '}
                <span className="italic font-serif">Ambitions</span>{' '}
                en Réussite
              </h1>
              <p className="text-white/80 mb-8 text-lg">
                Rejoignez la communauté de Yopougon et accédez à des formations, 
                des événements et des ressources pour votre développement personnel et professionnel.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Rejoindre maintenant <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#calendar">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary gap-2">
                    <Play className="w-4 h-4" /> Voir les activités
                  </Button>
                </Link>
              </div>

              {/* Stats inline */}
              <div className="flex items-center gap-8 mt-10">
                <div>
                  <div className="text-4xl font-bold">99%</div>
                  <div className="text-sm text-white/70">Satisfaction</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/30 border-2 border-white" />
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold">2,500+</span>
                    <span className="text-white/70 ml-1">Membres actifs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Images */}
            <div className="relative hidden md:block">
              <div className="relative w-full h-[400px]">
                <div className="absolute top-0 right-0 w-[280px] h-[320px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/images/hero-community.jpg" 
                    alt="Communauté CVY" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image 
                    src="/images/students-study.jpg" 
                    alt="Étudiants" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative curve */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ borderTopLeftRadius: '50% 100%', borderTopRightRadius: '50% 100%' }} />
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-none shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-primary">30%</div>
              <p className="text-muted-foreground mt-2">De nos membres ont trouvé un emploi</p>
            </Card>
            <Card className="text-center p-6 border-none shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-primary">95%</div>
              <p className="text-muted-foreground mt-2">Recommandent nos formations</p>
            </Card>
            <Card className="text-center p-6 border-none shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-primary">50+</div>
              <p className="text-muted-foreground mt-2">Formations dispensées</p>
            </Card>
            <Card className="text-center p-6 border-none shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-primary">100+</div>
              <p className="text-muted-foreground mt-2">Événements organisés</p>
            </Card>
          </div>
        </div>
      </section>

      {/* About / Why Choose Us */}
      <section id="about" className="py-12 md:py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm mb-4">
              Pourquoi nous choisir
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Une des plus grandes communautés<br />de Yopougon
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Depuis 2020, nous accompagnons les jeunes de Yopougon dans leur développement 
              personnel, académique et professionnel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <GraduationCap className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Formation de qualité</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Des cours de soutien et formations pratiques dispensés par des professionnels expérimentés.
              </p>
              <Link href="/register" className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                En savoir plus <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow group bg-primary text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vie communautaire</h3>
              <p className="text-white/80 text-sm mb-4">
                Des événements sportifs, sorties détente et activités sociales pour renforcer les liens.
              </p>
              <Link href="/register" className="text-white text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                En savoir plus <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <Lightbulb className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Accompagnement</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Un suivi personnalisé pour vous aider à atteindre vos objectifs académiques et professionnels.
              </p>
              <Link href="/register" className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                En savoir plus <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Image + Text Section */}
      <section className="py-12 md:py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 bg-primary/10 rounded-2xl w-full h-full" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image 
                    src="/images/workshop.jpg" 
                    alt="Atelier formation" 
                    width={300} 
                    height={400} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                  <Image 
                    src="/images/sports-activity.jpg" 
                    alt="Activité sportive" 
                    width={300} 
                    height={400} 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm">
                <span className="text-primary font-bold">Depuis 2020</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
                La bonne opportunité peut transformer les rêves en réalité.
              </h2>
              <p className="text-muted-foreground mb-6">
                Fondée en 2020, la Communauté Virtuelle de Yopougon est une initiative citoyenne 
                qui vise à créer un espace d'échange, de formation et d'entraide pour les jeunes 
                de la commune. Notre mission est de contribuer au développement local en offrant 
                des opportunités de formation et d'épanouissement.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-foreground">Formations gratuites</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-foreground">Événements réguliers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-foreground">Accompagnement personnalisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-foreground">Réseau professionnel</span>
                </div>
              </div>
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Rejoindre la communauté <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendar" className="py-12 md:py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm mb-4">
              Nos activités
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Calendrier des événements
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos prochaines activités et inscrivez-vous pour participer. 
              Survolez un événement pour voir les détails.
            </p>
          </div>

          <Card className="p-4 md:p-6 shadow-lg">
            <EventCalendar events={sampleEvents} />
          </Card>

          {/* Upcoming Events List for Mobile */}
          <div className="mt-8 md:hidden">
            <h3 className="font-semibold text-foreground mb-4">Prochains événements</h3>
            <div className="space-y-3">
              {sampleEvents.slice(0, 4).map(event => (
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

      {/* Testimonials */}
      <section id="testimonials" className="py-12 md:py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm mb-4">
              Témoignages
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              La voix de notre communauté
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-6 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm mb-4">
              FAQ
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card 
                key={i} 
                className={`overflow-hidden transition-all cursor-pointer ${openFaq === i ? 'shadow-lg' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="p-4 flex items-center justify-between">
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-muted-foreground text-sm">
                    {faq.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Commencez votre parcours vers un avenir meilleur
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de membres qui transforment leurs ambitions en réussite 
            grâce à la Communauté Virtuelle de Yopougon.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="gap-2">
              Créer mon compte <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-foreground text-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">CVY</span>
                </div>
              </div>
              <p className="text-sm text-background/70 mb-4">
                La Communauté Virtuelle de Yopougon - Ensemble pour un avenir meilleur.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="#" className="hover:text-primary">Accueil</Link></li>
                <li><Link href="#about" className="hover:text-primary">À Propos</Link></li>
                <li><Link href="#calendar" className="hover:text-primary">Calendrier</Link></li>
                <li><Link href="/login" className="hover:text-primary">Connexion</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Activités</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="#" className="hover:text-primary">Formations</Link></li>
                <li><Link href="#" className="hover:text-primary">Cours de soutien</Link></li>
                <li><Link href="#" className="hover:text-primary">Événements sportifs</Link></li>
                <li><Link href="#" className="hover:text-primary">Sorties détente</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-background/70 mb-4">
                Recevez nos dernières actualités
              </p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Votre email" 
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button size="icon" className="shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
            <p>&copy; 2026 Communauté Virtuelle de Yopougon. Tous droits réservés.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary">Confidentialité</Link>
              <Link href="#" className="hover:text-primary">Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
