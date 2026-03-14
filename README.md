iberia Events – Concert Streaming Platform

Liberia Events is a full-stack web application designed to stream Liberian concerts to people around the world, especially members of the Liberian diaspora who may not be able to attend events in person.

The platform allows users to purchase access to a live concert and watch the stream securely from their device. It also includes an admin dashboard for managing sales, access tokens, and stream settings.

Live Demo

Production URL:
https://events-liberia-5dxggwcko-dez2025-hues-projects.vercel.app

Features
Payments and Ticket Access

The platform uses Stripe to handle secure payments.
After purchasing a ticket, users receive a unique token that allows them to access the stream.

Key features include:

Secure payment processing

Token-based stream access

One-device security per ticket

Email confirmations and reminders

Live Streaming

The application provides a simple and secure way for viewers to watch concerts online.

Features include:

High-quality live video streaming

Compatibility with both mobile and desktop devices

Secure token validation before allowing access

Real-time stream control from the admin panel

Admin Dashboard

Administrators can manage the event and monitor sales through a dedicated dashboard.

Capabilities include:

Viewing ticket sales and analytics

Managing users and stream tokens

Controlling the live stream status

Exporting event data

Design

The interface is clean, responsive, and inspired by Liberia’s national colors.

Responsive layout for all screen sizes

Modern UI components using Radix UI

Styled with Tailwind CSS

Built with accessibility in mind

Tech Stack

Frontend: Next.js (App Router)

Styling: Tailwind CSS

UI Components: Radix UI

Database: Supabase (PostgreSQL)

Payments: Stripe

Analytics: Vercel Analytics

Deployment: Vercel

Language: TypeScript

Getting Started
Prerequisites

Before running the project locally, make sure you have:

Node.js 18 or later

npm or yarn

A Supabase account

A Stripe account

Installation

Clone the repository:

git clone https://github.com/DEz2025-hue/Liberia-Events-.git
cd Liberia-Events-


Install dependencies:

npm install


Create a .env.local file and add the following variables:

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_PASSWORD=Liberia@26


Run the development server:

npm run dev


Open your browser and go to:

http://localhost:3000

Project Structure
├── app/                 Next.js App Router
│   ├── admin/           Admin dashboard
│   ├── api/             API routes
│   ├── checkout/        Payment page
│   ├── stream/          Live stream viewer
│   └── success/         Payment confirmation
├── components/          Reusable UI components
├── lib/                 Utilities and configuration
├── supabase/            Database migrations
└── hooks/               Custom React hooks

Key Pages

Homepage (/)
Displays the event details and ticket purchase option.

Checkout (/checkout)
Handles the payment process.

Stream (/stream?token=xxx)
The page where users watch the live concert after purchasing access.

Success (/success)
Confirms that a payment has been completed successfully.

Admin (/admin)
Dashboard used to manage the event and monitor activity.

Configuration

Concert details can be updated in:

lib/concert-config.ts


From there you can change:

Event name and artist

Date and venue

Ticket price

Description and SEO metadata

Database Structure

The application uses three main tables in Supabase:

purchases – stores customer purchase records

token_usage – tracks how access tokens are used

stream_settings – controls the status of the live stream

Deployment

The easiest way to deploy the application is with Vercel.

Steps:

Connect the repository from GitHub

Add environment variables in the Vercel dashboard

Deploy automatically whenever changes are pushed

Manual deployment:

npm run build
npm start

Analytics

The project integrates Vercel Analytics to monitor:

Page views

User sessions

Device types

Geographic traffic

Performance metrics

Security

Security is an important part of the platform.

Measures include:

Row Level Security (RLS) on database tables

Token-based authentication for stream access

One-time tokens to prevent sharing

Stripe webhook verification

IP and device tracking

About the Project

Liberia Events was built to help connect Liberian artists with their global audience. Many members of the diaspora cannot attend concerts in person, and this platform provides a simple way for them to still be part of those experiences online.
