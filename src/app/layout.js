import { ClerkProvider } from '@clerk/nextjs';
import { Cormorant_Garamond, Sora } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
});

export const metadata = {
  title: 'CineMax - Movie Booking',
  description: 'Book your favorite movies',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${sora.variable} ${cormorant.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}