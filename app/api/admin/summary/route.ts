import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import User from '@/lib/models/User'
import Member from '@/lib/models/Member'
import Resource from '@/lib/models/Resource'
import Discussion from '@/lib/models/Discussion'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('authToken')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

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