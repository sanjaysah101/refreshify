# Refreshify

Refreshify is an AI-powered website transformation tool that helps modernize and enhance any website's design using advanced AI technology.

## Features

- 🎨 AI-Powered Design Transformation
- 🔄 Real-time Preview Comparison
- 📱 Responsive Design Testing
- 🚀 Multiple Modern Themes
- 💾 Export & Share Capabilities
- ✨ Interactive UI Elements

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma
- MongoDB

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

Update the .env file with your MongoDB connection string and other required variables.

4. Initialize the database:

```bash
pnpm prisma generate
pnpm prisma db push
```

5. Run the development server:

```bash
pnpm dev
```

Open <http://localhost:3000> with your browser to see the result.
