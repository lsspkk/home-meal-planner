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

  // If the user is authenticated (i.e. userMode is not "visitor" and userInfo (uuid) is present), do not render the modal.
  if (userMode !== 'visitor' && userInfo) return null

  return (
    <Modal open={true} onClose={() => {}}>
      <h2 className='text-xl font-bold mb-2 lg:mb-6'>Kirjaudu sisään</h2>
      <form onSubmit={handleSubmit} className='space-y-4 lg:flex-col lg:flex lg:gap-4'>
        <div>
          <label htmlFor='username' className='block mb-1 font-medium '>
            Käyttäjätunnus
          </label>
          <input
            id='username'
            type='text'
            className='w-full border p-2 rounded'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete='username'
            required
          />
        </div>
        <div>
          <label htmlFor='password' className='block mb-1 font-medium'>
            Salasana
          </label>
          <input
            id='password'
            type='password'
            className='w-full border p-2 rounded'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='current-password'
            required
          />
        </div>
        {error && <div className='text-red-600 text-sm'>{error}</div>}
        <div className='flex gap-2 justify-between'>
          <Button type='button' variant='secondary' className='' onClick={logout} disabled={isLoading}>
            Vieras
          </Button>
          <Button type='submit' variant='primary' className='' disabled={isLoading}>
            {isLoading ? 'Kirjaudutaan...' : 'Kirjaudu'}
          </Button>
        </div>
        <div className='text-xs text-gray-500 text-center mt-2'>
          Vierailijan ruokalistat tallentuvat omalle laitteelle.
        </div>
      </form>
    </Modal>
  )
}
