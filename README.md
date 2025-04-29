# 🌀 dejavu

**dejavu** scans your OneDrive folder for .xlsx files and generates a `dejavu.xlsx` file in the same folder containing rows where a target column has duplicate values across those files.

## 🔍 Example:

- **Folder**: dv-A/dv-B
- **Column**: Client ID

To trigger a sync:

`GET /api/sync?folder=dv-A/dv-B&column=Client ID`

## 🗓 Scheduling

1. Visit `/api/token` in your browser.
2. Authorize access to your OneDrive. This will return a **refresh token**.
3. Use this token to schedule syncs via curl, CRON, or your scheduler of choice.

**Example:**

```bash
curl -X GET \
  'https://your-app-url/api/sync?folder=dv-A/dv-B&column=Client ID' \
  -H 'Authorization: Bearer YOUR_REFRESH_TOKEN'
```

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
