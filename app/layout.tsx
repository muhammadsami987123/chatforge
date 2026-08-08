import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { clientEnv } from '@/lib/env';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_APP_URL),
  title: {
    default: 'ChatForge — open-source chatbot builder',
    template: '%s · ChatForge',
  },
  description:
    'Build, train, and embed conversational bots. A self-hostable, MIT-licensed alternative to Typebot, Voiceflow, and Chatbase.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
