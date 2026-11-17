import type { Metadata, Viewport } from 'next';
import { Big_Shoulders, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/fx/SmoothScroll';
import MotionProvider from '@/components/fx/MotionProvider';
import Cursor from '@/components/fx/Cursor';
import { ScrollProgress } from '@/components/fx/primitives';

const display = Big_Shoulders({
  variable: '--font-big-shoulders',
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
});

const body = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ms-dhoni-website-seven.vercel.app'),
  title: {
    default: 'MS Dhoni | The Legend Under the Lights',
    template: '%s | MS Dhoni',
  },
  description:
    'An immersive tribute to Mahendra Singh Dhoni: Captain Cool, the finisher, the keeper, the only captain to win all three ICC white-ball trophies.',
  openGraph: {
    title: 'MS Dhoni | The Legend Under the Lights',
    description: 'Captain Cool, the finisher, the keeper. An immersive tribute.',
    images: [{ url: '/photos/bat-raised-milestone.webp', width: 1800, height: 1373 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#06070a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="grain antialiased">
        <a
          href="#content"
          className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-gold px-5 py-3 text-sm font-bold text-night transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <Cursor />
        <Navbar />
        <div id="content">
          <MotionProvider>{children}</MotionProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
