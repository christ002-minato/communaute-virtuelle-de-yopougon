import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import Member from '@/lib/models/Member'
import User from '@/lib/models/User'
import { verifyToken } from '@/lib/auth'

const allowedRoles = ['student', 'teacher', 'admin', 'moderator', 'user']

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'admin') {
    return null
  }

  return decoded
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAdmin(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const members = await Member.find()
      .populate({ path: 'user_id', select: 'name email role status' })
      .sort({ join_date: -1 })

    const payload = members.map((member) => {
      const user = member.user_id as any
      return {
        id: member._id.toString(),
        userId: user?._id?.toString() ?? '',
        name: user?.name ?? 'Utilisateur supprimé',
        email: user?.email ?? '',
        role: user?.role ?? 'student',
        status: user?.status ?? 'inactive',
        joinDate: member.join_date?.toISOString() ?? '',
      }
    })

    return NextResponse.json({ members: payload }, { status: 200 })
  } catch (error) {
    console.error('Admin members GET error:', error)
    return NextResponse.json({ error: 'Impossible de récupérer les membres.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await requireAdmin(request)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, role } = body as { userId?: string; role?: string }

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 })
    }

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    await connectDB()

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      { userId: updatedUser._id.toString(), role: updatedUser.role },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin members PATCH error:', error)
    return NextResponse.json({ error: 'Impossible de mettre à jour le rôle.' }, { status: 500 })
  }
}
