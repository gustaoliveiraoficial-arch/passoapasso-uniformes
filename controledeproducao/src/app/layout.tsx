import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Controle de Produção — Passo a Passo',
  description: 'Sistema de Controle de Produção de Uniformes',
  manifest: '/controledeproducao/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Produção PAP',
  },
  icons: {
    apple: '/controledeproducao/logo-pap.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Produção PAP" />
        <link rel="apple-touch-icon" href="/controledeproducao/logo-pap.png" />
        {/* Service Worker */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/controledeproducao/sw.js', {
                scope: '/controledeproducao/'
              }).catch(function() {});
            });
          }
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
