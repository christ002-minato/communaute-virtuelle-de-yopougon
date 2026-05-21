import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb/client'
import User from '@/lib/models/User'
import Member from '@/lib/models/Member'
import Resource from '@/lib/models/Resource'
import Discussion from '@/lib/models/Discussion'

async function seedDefaultData() {
  const password = await bcrypt.hash('Admin@123', 10)
  const adminUser = await User.create({
    name: 'Administrateur',
    email: 'admin@cvy.local',
    password,
    role: 'admin',
    bio: 'Compte administrateur créé automatiquement.',
    avatar_url: null,
  })

  await Member.create({
    user_id: adminUser._id,
    points: 100,
    level: 'gold',
    reputation: 100,
    is_verified: true,
  })

  await Resource.create({
    title: 'Bienvenue sur la communauté',
    description: 'Première ressource ajoutée automatiquement.',
    content: 'Cette ressource a été créée pour initialiser la base de données.',
    author_id: adminUser._id,
    category: 'introduction',
    tags: ['bienvenue', 'démarrage'],
  })

  await Discussion.create({
    title: 'Première discussion de la communauté',
    description: 'Discussion créée automatiquement pour démarrer.',
    content: 'Bienvenue dans le tableau de bord admin ! Utilisez les sections de modération pour gérer les membres, ressources et discussions.',
    author_id: adminUser._id,
  })
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userCount = await User.countDocuments()
    if (userCount === 0) {
      await seedDefaultData()
    }

    const [users, members, resources, discussions] = await Promise.all([
      User.countDocuments(),
      Member.countDocuments(),
      Resource.countDocuments(),
      Discussion.countDocuments(),
    ])

    if (members === 0) {
      const author = await User.findOne()
      if (author) {
        await Member.create({
          user_id: author._id,
          points: 50,
          level: 'silver',
          reputation: 30,
          is_verified: false,
        })
      }
    }

    if (resources === 0) {
      const author = await User.findOne()
      if (author) {
        await Resource.create({
          title: 'Ressource par défaut',
          description: 'Contenu créé automatiquement.',
          content: 'Ajoutez ici vos principaux documents ou liens.',
          author_id: author._id,
          category: 'general',
          tags: ['par défaut'],
        })
      }
    }

    if (discussions === 0) {
      const author = await User.findOne()
      if (author) {
        await Discussion.create({
          title: 'Discussion par défaut',
          description: 'Discussion créée automatiquement.',
          content: 'Cette discussion initialise la base de données.',
          author_id: author._id,
        })
      }
    }

    const summary = {
      users: await User.countDocuments(),
      members: await Member.countDocuments(),
      resources: await Resource.countDocuments(),
      discussions: await Discussion.countDocuments(),
    }

    return NextResponse.json(summary, { status: 200 })
  } catch (error) {
    console.error('Admin summary error:', error)
    return NextResponse.json({ error: 'Impossible de récupérer les statistiques admin.' }, { status: 500 })
  }
}
