# 🌀 dejavu

**dejavu** scans your OneDrive folder for `.xlsx` files and generates a `dejavu.xlsx` file containing rows where a specific column has duplicate values across those files.

## 🔍 Example

Suppose you want to detect duplicate rows by the `Client ID` column inside the folder `dv-A/dv-B`.

- **Folder**: `dv-A/dv-B`
- **Column**: `Client ID`

You have two ways to trigger a sync:

### 🖱 Option 1: Use the UI

Visit [https://dejavu-psi.vercel.app](https://dejavu-psi.vercel.app), sign in with your Microsoft account, and click **Sync**.

### 🛠 Option 2: Manual API Call

```
GET https://dejavu-psi.vercel.app/api/sync?folder=dv-A/dv-B&column=Client ID
```

- If authenticated in the browser, this uses your session.
- If called from a script/server, you must provide a token (see below).

## 🗓 Scheduled Syncs

You can automate duplicate detection using a token and your scheduler of choice.

### 🔑 Step 1: Generate a Token

Visit:

👉 https://dejavu-psi.vercel.app/api/token

You’ll be prompted to authorize access to your OneDrive.
This will return a refresh token — keep it safe, as it grants access to your files.

---

### 🔁 Step 2: Schedule Syncs

Use the token to hit the `https://dejavu-psi.vercel.app/api/sync` endpoint.  
You must include:

- **folder**: the OneDrive path to scan (e.g., `dv-A/dv-B`)
- **column**: the target column header (e.g., `Client ID`)
- **Authorization**: `Bearer YOUR_TOKEN`

---

### 🧪 Example: curl

```sh
curl -X GET \
  'https://dejavu-psi.vercel.app/api/sync?folder=dv-A/dv-B&column=Client ID' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### ☁️ Example: Cloudflare Worker (Scheduled Cron Job)

```js
export default {
  async scheduled(event, env, ctx) {
    try {
      const url = new URL('https://dejavu-psi.vercel.app/api/sync')
      url.searchParams.set('folder', env.FOLDER)
      url.searchParams.set('column', env.COLUMN)

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${env.TOKEN}`
        }
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error(
          `Failed to sync. Status: ${res.status}. Response:`,
          errorText
        )
        return new Response('Failed to sync reports', { status: 500 })
      }

      const data = await res.json()

      console.log('Successfully synced:', data.message)
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (err) {
      console.error('Unexpected error during scheduled sync:', err)
      return new Response('Unexpected error', { status: 500 })
    }
  }
}
```

🛠 Be sure to define the `FOLDER`, `COLUMN`, and `TOKEN` in your Cloudflare Worker environment variables.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
