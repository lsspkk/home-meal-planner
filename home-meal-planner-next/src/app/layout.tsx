import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeProvider } from './components/ThemeProvider'
import { Cog6ToothIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { AppStateProvider } from './AppStateContext'

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
        <AppStateProvider>
          <ThemeProvider>
            <nav className='flex items-center gap-4 px-4 py-2 bg-white shadow-sm border-b'>
              <Link href='/' className='flex items-center gap-2 font-bold text-lg'>
                <Image src='/favicon.svg' alt='Favicon' width={28} height={28} className='w-7 h-7' />
                <span className='navbar-title-shadow'>Kodin ruokalista</span>
              </Link>
              <div className='flex-1' />
              <Link href='/about' className='p-2 rounded hover:bg-gray-100' aria-label='Tietoa sovelluksesta'>
                <InformationCircleIcon className='w-7 h-7 text-gray-600' />
              </Link>
              <Link href='/settings' className='ml-1 p-2 rounded hover:bg-gray-100' aria-label='Asetukset'>
                <Cog6ToothIcon className='w-7 h-7 text-gray-600' />
              </Link>
            </nav>
            <main className='max-w-2xl mx-auto py-4 sm:p-4 w-full'>{children}</main>
          </ThemeProvider>
        </AppStateProvider>
      </body>
    </html>
  )
}
