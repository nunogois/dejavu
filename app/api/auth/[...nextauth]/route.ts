import NextAuth, { AuthOptions } from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'

export const authOptions: AuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid offline_access Files.ReadWrite User.Read'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token
        }
      }

      if (!token.expires_at || Date.now() / 1000 < token.expires_at)
        return token
      if (!token.refresh_token) throw new Error('Missing refresh_token')

      try {
        const response = await fetch(
          'https://login.microsoftonline.com/common/oauth2/v2.0/token',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.AZURE_AD_CLIENT_ID!,
              client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token!,
              scope: 'https://graph.microsoft.com/.default'
            })
          }
        )

        const refreshed = await response.json()

        if (!response.ok) throw refreshed

        return {
          access_token: refreshed.access_token,
          expires_at: Math.floor(Date.now() / 1000 + refreshed.expires_in),
          refresh_token: refreshed.refresh_token ?? token.refresh_token
        }
      } catch (error) {
        console.error('Error refreshing Azure access_token', error)
        token.error = 'RefreshTokenError'
        return token
      }
    },
    async session({ session, token }) {
      return {
        ...session,
        error: token.error
      }
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
