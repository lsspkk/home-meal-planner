'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { useToast } from '../ToastContext'
import { Button } from './Button'
import { Modal } from './Modal'

export default function LoginModal() {
  const { login, logout, userMode, userInfo, isLoading } = useAuth()
  const { showToast } = useToast()
  const [username, setUsername] = useState<string>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('auth_username') || '' : ''
  )
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // On mount (or re-render), if the user is not authenticated (visitor) and no userInfo (uuid) is present, autofocus the password field.
  useEffect(() => {
    if (userMode === 'visitor' && !userInfo) {
      const passwordInput = document.getElementById('password')
      if (passwordInput) passwordInput.focus()
    }
  }, [userMode, userInfo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
      // On successful login, save username in localStorage (password is stored only in context).
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_username', username)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err?.message || 'Kirjautuminen epäonnistui')
        showToast(err?.message || 'Kirjautuminen epäonnistui', 'error')
      } else {
        setError('Kirjautuminen epäonnistui')
        showToast('Kirjautuminen epäonnistui', 'error')
      }
    }
  }

  // Show the modal only when userMode is null (not visitor or authenticated)
  if (userMode !== null) return null

  return (
    <Modal open={true} onClose={() => {}}>
      <h2 className='text-xl md:text-2xl font-bold mb-4 md:mb-6'>Kirjaudu sisään</h2>
      <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
        <div className='space-y-2 md:space-y-3'>
          <div>
            <label htmlFor='username' className='block mb-1 md:mb-2 font-medium text-sm md:text-base'>
              Käyttäjätunnus
            </label>
            <input
              id='username'
              type='text'
              className='w-full border p-3 md:p-4 rounded-lg text-sm md:text-base'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete='username'
              required
            />
          </div>
          <div>
            <label htmlFor='password' className='block mb-1 md:mb-2 font-medium text-sm md:text-base'>
              Salasana
            </label>
            <input
              id='password'
              type='password'
              className='w-full border p-3 md:p-4 rounded-lg text-sm md:text-base'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
              required
            />
          </div>
        </div>
        {error && <div className='text-red-600 text-sm md:text-base'>{error}</div>}
        <div className='flex gap-3 md:gap-4 justify-between'>
          <Button type='button' variant='secondary' onClick={logout} disabled={isLoading} size='lg'>
            Vieras
          </Button>
          <Button type='submit' variant='primary' disabled={isLoading} size='lg'>
            {isLoading ? 'Kirjaudutaan...' : 'Kirjaudu'}
          </Button>
        </div>
        <div className='text-xs md:text-sm text-gray-500 text-center mt-4 md:mt-6'>
          Vierailijan ruokalistat tallentuvat omalle laitteelle.
        </div>
      </form>
    </Modal>
  )
}
