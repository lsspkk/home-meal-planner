#!/usr/bin/env node
import dotenv from 'dotenv'
import { ensureDataDir, loadUsers, changeUserPassword, findUserByUsername } from '../dataService'

dotenv.config()

async function main() {
  const args = process.argv.slice(2)

  if (args.length !== 2) {
    console.error('Usage: npm run change-password <username> <newPassword>')
    console.error('Example: npm run change-password john newpassword123')
    process.exit(1)
  }

  const [username, newPassword] = args

  if (!username || !newPassword) {
    console.error('Both username and new password are required')
    process.exit(1)
  }

  try {
    ensureDataDir()
    loadUsers()

    const user = findUserByUsername(username)
    if (!user) {
      console.error(`User '${username}' not found`)
      process.exit(1)
    }

    const success = await changeUserPassword(user.uuid, newPassword)
    if (success) {
      console.log(`Password changed successfully for user: ${username}`)
    } else {
      console.error('Failed to change password')
      process.exit(1)
    }
  } catch (error: any) {
    console.error('Error changing password:', error.message)
    process.exit(1)
  }
}

main()
