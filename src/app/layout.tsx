import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { DemoAuthProvider } from '@/components/DemoAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Self-Help App (Demo)',
  description: 'A comprehensive self-help application - Demo Version',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DemoAuthProvider>{children}</DemoAuthProvider>
      </body>
    </html>
  )
}