import { logger } from '@/lib/logger'
import ky from 'ky'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'invalid URL' }, { status: 400 })
  }

  try {
    const response = await ky.get(url, {
      timeout: false,
      onDownloadProgress: () => { },
    })

    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0')
    headers.set('Accept-Language', 'en-US,en;q=0.5')

    return new NextResponse(response.body, {
      headers,
      status: response.status,
      statusText: response.statusText,
    })
  } catch (error) {
    logger.error('proxy to video error: %o', error)
    return NextResponse.json({ error: 'proxy to video error' }, { status: 500 })
  }
}
