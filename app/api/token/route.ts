export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.AZURE_AD_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/token/callback`,
    response_mode: 'query',
    scope: 'offline_access Files.ReadWrite User.Read'
  })

  return Response.redirect(
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`
  )
}
