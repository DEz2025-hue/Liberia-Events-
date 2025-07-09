# 🇱🇷 Liberia Events - Concert Streaming Platform

A modern, full-stack web application for streaming Liberian concerts to the global diaspora community.

## 🎵 Live Demo

**Production URL:** [https://events-liberia-5dxggwcko-dez2025-hues-projects.vercel.app](https://events-liberia-5dxggwcko-dez2025-hues-projects.vercel.app)

## ✨ Features

### 🎫 **E-commerce & Payments**
- Secure Stripe payment processing
- Token-based access control
- One-device security per ticket
- Email confirmations and reminders

### 🎥 **Live Streaming Platform**
- HD quality live stream delivery
- Mobile and desktop compatible
- Real-time stream management
- Secure access token validation

### 👨‍💼 **Admin Dashboard**
- Sales analytics and reporting
- User management and token control
- Live stream status management
- Data export capabilities

### 🎨 **Design & UX**
- Patriotic Liberian red & white theme
- Responsive design for all devices
- Modern UI with Radix components
- Accessibility compliant

## 🛠️ Tech Stack

- **Frontend:** Next.js 13+ (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel
- **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DEz2025-hue/Liberia-Events-.git
   cd Liberia-Events-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_ADMIN_PASSWORD=Liberia@26
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── checkout/          # Payment page
│   ├── stream/            # Live stream viewer
│   └── success/           # Payment confirmation
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
├── supabase/              # Database migrations
└── hooks/                 # Custom React hooks
```

## 🎯 Key Pages

- **Homepage** (`/`) - Main landing page with event details
- **Checkout** (`/checkout`) - Payment form and order summary
- **Stream** (`/stream?token=xxx`) - Live stream viewer
- **Success** (`/success`) - Payment confirmation
- **Admin** (`/admin`) - Event management dashboard

## 🔧 Configuration

### Concert Details
Edit `lib/concert-config.ts` to update:
- Event name and artist
- Date, time, and venue
- Pricing and description
- SEO metadata

### Database Schema
The application uses three main tables:
- `purchases` - Customer purchase records
- `token_usage` - Access token tracking
- `stream_settings` - Live stream configuration

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Analytics

Vercel Analytics is integrated to track:
- Page views and user sessions
- Geographic data
- Device information
- Performance metrics

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Token-based authentication for stream access
- One-time use tokens prevent sharing
- IP and user agent tracking
- Stripe webhook verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🇱🇷 About

**Liberia First, Liberia Last!** 

This platform celebrates Liberian culture and connects the diaspora community through music and technology. Built with love for the Liberian community worldwide.

---

**Built with ❤️ for the Liberian Diaspora**