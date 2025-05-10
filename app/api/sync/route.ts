import { processReports } from '@/lib/graph/processReports'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || ''
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  const { searchParams } = new URL(req.url)
  const folder = searchParams.get('folder')
  const isSharedFolder = searchParams.get('is_shared_folder') === '1'
  const sheet = searchParams.get('sheet')
  const column = searchParams.get('column')
  const fileFilter = searchParams.get('file_filter')
  const outputFile = searchParams.get('output_file')

  if (!folder || !column) {
    return new Response('Missing folder or column', { status: 400 })
  }

  let accessToken: string | null = null

  if (bearerToken) {
    try {
      accessToken = await getAccessTokenFromRefreshToken(bearerToken)
    } catch {
      return new Response('Failed to get access token from refresh token', {
        status: 401
      })
    }
  } else {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    accessToken = token?.access_token || null
  }

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const result = await processReports(
      accessToken,
      folder,
      isSharedFolder,
      column,
      sheet,
      fileFilter,
      outputFile
    )
    return Response.json({ message: result })
  } catch (e) {
    console.error('Error processing reports', (e as Error).message)
    return Response.json({ error: (e as Error).message }, { status: 500 })
  }
}

async function getAccessTokenFromRefreshToken(
  bearerToken: string
): Promise<string> {
  const response = await fetch(
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: bearerToken,
        scope: 'https://graph.microsoft.com/.default'
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error_description || 'Failed to refresh access token')
  }

  return data.access_token
}
