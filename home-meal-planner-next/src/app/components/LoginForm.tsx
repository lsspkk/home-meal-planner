import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useToast } from '../ToastContext'
import { Button } from './Button'

export default function LoginForm() {
  const { login, isLoading } = useAuth()
  const { showToast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
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

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-w-xs mx-auto p-6 bg-white rounded shadow'>
      <h2 className='text-xl font-bold mb-2'>Kirjaudu sisään</h2>
      <div>
        <label htmlFor='username' className='block mb-1 font-medium'>
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
      <Button type='submit' variant='primary' disabled={isLoading} className='w-full'>
        {isLoading ? 'Kirjaudutaan...' : 'Kirjaudu'}
      </Button>
    </form>
  )
}
