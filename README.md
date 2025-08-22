# Zint Labs - Portfolio Platform

## Local Development with Subdomain Testing

### Testing Subdomains Locally

To test subdomain functionality during development, you can use local subdomain patterns:

1. **Regular localhost**: `http://localhost:3000` (main page)
2. **Local subdomain test**: `http://username.localhost:3000` (user portfolio page)

### How It Works

The middleware now supports:
- **Development**: `username.localhost:3000` → rewrites to `/username` route
- **Production**: `username.flavorr.in` → rewrites to `/username` route

### Testing Examples

- `http://john.localhost:3000` → serves John's portfolio
- `http://sarah.localhost:3000` → serves Sarah's portfolio  
- `http://localhost:3000` → serves main landing page

### Note

Local subdomain testing works out of the box with modern browsers. The middleware automatically detects local subdomain patterns and handles them appropriately.

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
