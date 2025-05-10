import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return new Response('Missing code', { status: 400 })
  }

  const response = await fetch(
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/token/callback`
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error('Token exchange failed', data)
    return new Response('Failed to exchange code for token', { status: 500 })
  }

  const refreshToken = data.refresh_token

  return new Response(
    `<html>
    <body style="font-family: sans-serif; padding: 2rem;">
      <h1>Refresh Token</h1>
      <code id="token" style="word-break: break-all; background: #f5f5f5; display: block; padding: 1rem;">${refreshToken}</code>
      <button onclick="copy()" style="margin-top: 1rem;">Copy to clipboard</button>
      <p id="status" style="color: green; display: none; margin-top: 0.5rem;">Copied!</p>
      <p>Save this securely in your .env or secret store.</p>
      <script>
        function copy() {
          const text = document.getElementById('token').textContent;
          navigator.clipboard.writeText(text).then(() => {
            const status = document.getElementById('status');
            status.style.display = 'block';
            setTimeout(() => { status.style.display = 'none'; }, 2000);
          });
        }
      </script>
    </body>
  </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
