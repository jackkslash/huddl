import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { Toast } from '@radix-ui/react-toast'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {authModal}
        <div className='container h-full pt-20 mx-auto max-w-7xl'>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
