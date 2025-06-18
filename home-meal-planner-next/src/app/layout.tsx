import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeProvider } from './components/ThemeProvider'
import { Cog6ToothIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { AuthProvider } from './AuthContext'
import { ToastProvider } from './ToastContext'
import { AppStateProvider } from './AppStateContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import LoginModal from './components/LoginModal'
import React from 'react'

export const metadata = {
  title: 'Kodin ruokalista',
  description: 'Viikon ruokalista ja ostoslista helposti.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='fi'>
      <head>
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className='bg-gray-50 min-h-screen'>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <AppStateProvider>
                <LoginModal />
                <ErrorBoundary>
                  <nav className='flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white shadow-sm border-b'>
                    <Link href='/' className='flex items-center gap-2 md:gap-3 font-bold text-lg md:text-xl'>
                      <Image src='/favicon.svg' alt='Favicon' width={28} height={28} className='w-7 h-7 md:w-8 md:h-8' />
                      <span className='navbar-title-shadow'>Kodin ruokalista</span>
                    </Link>
                    <div className='flex-1' />
                    <Link href='/about' className='p-2 md:p-3 rounded-lg hover:bg-gray-100 transition-colors' aria-label='Tietoa sovelluksesta'>
                      <InformationCircleIcon className='w-7 h-7 md:w-8 md:h-8 text-gray-600' />
                    </Link>
                    <Link href='/settings' className='ml-1 p-2 md:p-3 rounded-lg hover:bg-gray-100 transition-colors' aria-label='Asetukset'>
                      <Cog6ToothIcon className='w-7 h-7 md:w-8 md:h-8 text-gray-600' />
                    </Link>
                  </nav>
                  <main className='py-0 md:py-4 w-full'>{children}</main>
                </ErrorBoundary>
              </AppStateProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
