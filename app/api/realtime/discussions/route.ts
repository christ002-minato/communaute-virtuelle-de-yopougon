export const runtime = 'nodejs'

import connectDB from '@/lib/mongodb/client'
import Discussion from '@/lib/models/Discussion'
import Comment from '@/lib/models/Comment'

import type { NextRequest } from 'next/server'

function sseHeaders() {
  return new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })
}

export async function GET(req: NextRequest) {
  await connectDB()

  const discStream = Discussion.watch([], { fullDocument: 'updateLookup' })
  const commStream = Comment.watch([], { fullDocument: 'updateLookup' })

  const stream = new ReadableStream({
    async start(controller) {
      function pushEvent(eventName: string, data: any) {
        try {
          const payload = JSON.stringify({ event: eventName, data })
          controller.enqueue(`data: ${payload}\n\n`)
        } catch (e) {
          console.error('SSE encode error', e)
        }
      }

      discStream.on('change', (change: any) => {
        if (change.operationType === 'insert') {
          pushEvent('discussion_insert', change.fullDocument)
        } else if (change.operationType === 'update' || change.operationType === 'replace') {
          pushEvent('discussion_update', change.fullDocument)
        }
      })

      commStream.on('change', (change: any) => {
        if (change.operationType === 'insert') {
          pushEvent('comment_insert', change.fullDocument)
        } else if (change.operationType === 'update' || change.operationType === 'replace') {
          pushEvent('comment_update', change.fullDocument)
        }
      })

      // keep the stream alive
      const keepAlive = setInterval(() => controller.enqueue(':\n\n'), 15000)

      req.signal.addEventListener('abort', () => {
        clearInterval(keepAlive)
        try { discStream.close() } catch (e) {}
        try { commStream.close() } catch (e) {}
        try { controller.close() } catch (e) {}
      })
    },
    cancel() {
      try { discStream.close() } catch (e) {}
      try { commStream.close() } catch (e) {}
    }
  })

  return new Response(stream, { headers: sseHeaders() })
}
