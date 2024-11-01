# AI Comic Creator

A web application that enables users to create AI-generated comics by inputting storylines, characters, and choosing art styles. Built with Next.js, Supabase, and various AI services.

## Features

- 🎨 AI-powered comic panel generation
- 👥 Character consistency across panels
- 🎭 Multiple comic styles (manga, superhero, cartoon, classic)
- 💳 Subscription-based access with different tiers
- 🔒 Secure authentication with Google OAuth
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: Supabase Auth, Google OAuth
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand, React Query
- **AI Services**: OpenAI GPT-4, Midjourney API
- **Payment Processing**: Stripe
- **Styling**: Tailwind CSS, HeadlessUI

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Midjourney API access
- Stripe account
- Google OAuth credentials

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Midjourney
NEXT_PUBLIC_MIDJOURNEY_API_URL=your_midjourney_api_url

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Database Schema

The application uses the following main tables in Supabase:

- `users`: User profiles and subscription information
- `projects`: Comic projects
- `characters`: Character definitions for each project
- `panels`: Generated comic panels
- `comic_styles`: Available comic styles
- `payments`: Payment records

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-comic-creator.git
   cd ai-comic-creator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── projects/          # Project pages
│   └── pricing/           # Pricing page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── comic/            # Comic-related components
│   └── shared/           # Shared components
├── hooks/                # Custom React hooks
├── services/             # External service integrations
├── store/               # State management
├── styles/              # Global styles
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## Subscription Tiers

- **Free**
  - 3 projects
  - 10 panels per project
  - Basic art styles

- **Basic** ($9.99/month)
  - 10 projects
  - 30 panels per project
  - Additional art styles
  - Priority generation

- **Pro** ($29.99/month)
  - Unlimited projects
  - Unlimited panels
  - All art styles
  - Highest priority
  - Custom style training

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
