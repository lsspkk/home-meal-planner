'use client'
import Link from 'next/link'
import {
  Cog6ToothIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  SunIcon,
  MoonIcon,
  CalendarDaysIcon,
  CalendarIcon,
  SparklesIcon,
  HeartIcon,
  CloudIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'
import { Theme, useTheme } from '../components/ThemeProvider'
import { useViewMode } from '../useViewMode'
import { Button } from '../components/Button'
import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useToast } from '../ToastContext'

function RainbowIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <linearGradient id='rainbow-gradient' x1='0' y1='12' x2='24' y2='12' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#f87171' />
          <stop offset='0.25' stopColor='#fbbf24' />
          <stop offset='0.5' stopColor='#34d399' />
          <stop offset='0.75' stopColor='#60a5fa' />
          <stop offset='1' stopColor='#a78bfa' />
        </linearGradient>
      </defs>
      <path
        d='M4 18a8 8 0 0116 0'
        stroke='url(#rainbow-gradient)'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <path
        d='M8 18a4 4 0 018 0'
        stroke='url(#rainbow-gradient)'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
    </svg>
  )
}

const themes = [
  { name: 'Vaalea', value: 'white', icon: SunIcon, color: 'text-yellow-400' },
  { name: 'Tumma', value: 'dark', icon: MoonIcon, color: 'text-gray-700' },
  { name: 'Pinkki', value: 'pink', icon: HeartIcon, color: 'text-pink-500' },
  { name: 'Vihreä', value: 'green', icon: SparklesIcon, color: 'text-green-500' },
  { name: 'Taivas', value: 'sky', icon: CloudIcon, color: 'text-sky-400' },
  { name: 'Sateenkaari', value: 'rainbow', icon: RainbowIcon, color: '' },
]

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { userInfo, username } = useAuth()
  const { showToast } = useToast()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const credentials = btoa(`${username}:${oldPassword}`)
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/' + userInfo?.uuid + '/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({ newPassword }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Salasanan vaihto epäonnistui')
      }
      showToast('Salasana vaihdettu!', 'success')
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Salasanan vaihto epäonnistui')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-4 md:p-6' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-xl md:text-2xl font-bold mb-4 md:mb-6'>Vaihda salasana</h2>
        <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
          <div className='space-y-2 md:space-y-3'>
            <div>
              <label htmlFor='oldPassword' className='block mb-1 md:mb-2 font-medium text-sm md:text-base'>
                Nykyinen salasana
              </label>
              <input
                id='oldPassword'
                type='password'
                className='w-full border p-3 md:p-4 rounded-lg text-sm md:text-base'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete='current-password'
                required
              />
            </div>
            <div>
              <label htmlFor='newPassword' className='block mb-1 md:mb-2 font-medium text-sm md:text-base'>
                Uusi salasana
              </label>
              <input
                id='newPassword'
                type='password'
                className='w-full border p-3 md:p-4 rounded-lg text-sm md:text-base'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete='new-password'
                required
              />
            </div>
          </div>
          {error && <div className='text-red-600 text-sm md:text-base'>{error}</div>}
          <Button type='submit' variant='primary' disabled={isLoading} size='lg' className='w-full'>
            {isLoading ? 'Vaihdetaan...' : 'Vaihda salasana'}
          </Button>
        </form>
        <Button type='button' variant='secondary' onClick={onClose} size='lg' className='w-full mt-3 md:mt-4'>
          Peruuta
        </Button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { viewMode, save } = useViewMode()
  const { userMode, showLogin } = useAuth()
  const [showChangePw, setShowChangePw] = useState(false)

  return (
    <div className='px-4 md:px-6 py-4 md:py-6'>
      <div className='max-w-xl mx-auto space-y-6 md:space-y-8'>
        <h1 className='text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-3 md:gap-4'>
          <Cog6ToothIcon className='w-7 h-7 md:w-8 md:h-8 text-gray-500' />
          Asetukset
        </h1>
        
        {/* Login/Password Section */}
        {userMode === 'visitor' ? (
          <div className='space-y-4'>
            <h2 className='font-semibold text-lg md:text-xl'>Kirjautuminen</h2>
            <Button variant='primary' onClick={showLogin} size='lg' className='w-full md:w-auto'>
              Kirjaudu sisään
            </Button>
          </div>
        ) : userMode === 'authenticated' && (
          <div className='space-y-4'>
            <h2 className='font-semibold text-lg md:text-xl'>Tili</h2>
            <Button 
              variant='primary' 
              onClick={() => setShowChangePw(true)} 
              size='lg' 
              className='w-full md:w-auto'
              icon={<KeyIcon className='w-5 h-5' />}
            >
              Vaihda salasana
            </Button>
            <ChangePasswordModal open={showChangePw} onClose={() => setShowChangePw(false)} />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className='space-y-4'>
          <h2 className='font-semibold text-lg md:text-xl'>Toiminnot</h2>
          <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
            <Link
              href='/settings/import-export'
              className='flex items-center justify-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full md:w-auto text-sm md:text-base font-medium'
            >
              <ArrowDownTrayIcon className='w-5 h-5 md:w-6 md:h-6' />
              Tuo/Vie tiedot
            </Link>
            <Link
              href='/settings/manage'
              className='flex items-center justify-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full md:w-auto text-sm md:text-base font-medium'
            >
              <PencilSquareIcon className='w-5 h-5 md:w-6 md:h-6' />
              Muokkaa reseptejä
            </Link>
          </div>
        </div>
        
        {/* Theme Section */}
        <div className='space-y-4'>
          <h2 className='font-semibold text-lg md:text-xl'>Teema</h2>
          <div className='grid grid-cols-3 gap-3 md:gap-4'>
            {themes.map(({ name, value, icon: Icon, color }) => (
              <Button
                key={value}
                variant={theme === value ? 'primary' : 'outline'}
                className={`theme-button flex items-center gap-2 ${theme === value ? 'ring-2 ring-blue-300' : ''}`}
                onClick={() => setTheme(value as Theme)}
                type='button'
                size='md'
              >
                <Icon className={`w-5 h-5 ${color}`} />
                {name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* View Mode Section */}
        <div className='space-y-4'>
          <h2 className='font-semibold text-lg md:text-xl'>Etusivun näkymä</h2>
          <div className='flex gap-3 md:gap-4'>
            <Button
              variant={viewMode === 'week' ? 'primary' : 'outline'}
              className='flex items-center gap-2 w-1/2 md:w-1/4'
              onClick={() => {
                save('week')
              }}
              type='button'
              size='md'
            >
              <CalendarDaysIcon className='w-5 h-5' />
              Viikko
            </Button>
            <Button
              variant={viewMode === 'month' ? 'primary' : 'outline'}
              className='flex items-center gap-2 w-1/2 md:w-1/4'
              onClick={() => {
                save('month')
              }}
              type='button'
              size='md'
            >
              <CalendarIcon className='w-5 h-5' />
              Koko kuukausi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
