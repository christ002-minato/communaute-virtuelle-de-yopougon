'use client'

import { useState, useEffect, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Camera, Loader2 } from 'lucide-react'

interface UserProfile {
  _id: string
  email: string
  name: string
  bio: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar_url: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile')

        if (!response.ok) {
          setError('Erreur lors de la récupération du profil')
          return
        }

        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        })
      } catch (err) {
        setError('Erreur lors de la connexion au serveur')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormData(prev => ({ ...prev, avatar_url: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error || 'Erreur lors de la mise à jour du profil')
        setSaving(false)
        return
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setFormData({
        name: updatedProfile.name || '',
        bio: updatedProfile.bio || '',
        avatar_url: updatedProfile.avatar_url || '',
      })
      setIsEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Erreur serveur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Inconnu'
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='space-y-1'>
          <h2 className='text-2xl sm:text-3xl font-bold text-foreground'>Mon Profil</h2>
          <p className='text-muted-foreground'>Consultez et modifiez vos informations personnelles</p>
        </div>
        <Button
          type='button'
          onClick={() => setIsEditing(prev => !prev)}
          variant={isEditing ? 'outline' : 'default'}
        >
          {isEditing ? 'Annuler' : 'Modifier le profil'}
        </Button>
      </div>

      {saved && (
        <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg'>
          Profil mis à jour avec succès !
        </div>
      )}

      {error && (
        <div className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSave()
        }}
        className='space-y-6'
      >
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Mettez à jour votre nom, votre biographie et votre image de profil.</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-6 lg:grid-cols-[240px_1fr]'>
            <div className='space-y-4'>
              <div className='relative mx-auto w-32 overflow-hidden rounded-full border-4 border-primary/20 bg-muted sm:mx-0'>
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt='Photo de profil'
                    className='h-32 w-32 object-cover'
                  />
                ) : (
                  <div className='flex h-32 w-32 items-center justify-center bg-primary/10 text-4xl font-bold text-primary'>
                    {profile?.name?.charAt(0) ?? '?'}
                  </div>
                )}
              </div>

              {isEditing && (
                <label className='inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-primary/5'>
                  <Camera className='w-4 h-4' />
                  Changer la photo
                  <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
                </label>
              )}
            </div>

            <div className='space-y-6'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='name' className='text-sm font-medium text-foreground'>Nom</label>
                  <Input
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder='Votre nom complet'
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='email' className='text-sm font-medium text-foreground'>Email</label>
                  <Input
                    id='email'
                    name='email'
                    value={profile?.email ?? ''}
                    disabled
                    placeholder='Votre adresse email'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='bio' className='text-sm font-medium text-foreground'>À propos de vous</label>
                <textarea
                  id='bio'
                  name='bio'
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className='w-full min-h-[140px] resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-muted'
                  placeholder='Écrivez une courte description de vous...'
                />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Rôle</p>
                  <div className='rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'>{profile?.role ?? 'Membre'}</div>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Membre depuis</p>
                  <div className='rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'>{profile ? formatDate(profile.created_at) : '-'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className='flex justify-end'>
            <Button type='submit' disabled={saving} className='min-w-[160px]'>
              {saving ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Enregistrement...
                </>
              ) : (
                'Sauvegarder'
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
