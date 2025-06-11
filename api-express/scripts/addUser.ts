#!/usr/bin/env node
import dotenv from 'dotenv'
import { ensureDataDir, loadUsers, addUser } from '../dataService'

dotenv.config()

async function main() {
  const args = process.argv.slice(2)

  if (args.length !== 2) {
    console.error('Usage: npm run add-user <username> <password>')
    console.error('Example: npm run add-user john mypassword123')
    process.exit(1)
  }

  const [username, password] = args

  if (!username || !password) {
    console.error('Both username and password are required')
    process.exit(1)
  }

  try {
    ensureDataDir()
    loadUsers()

    const uuid = await addUser(username, password)
    console.log(`User added successfully!`)
    console.log(`Username: ${username}`)
    console.log(`UUID: ${uuid}`)
  } catch (error: any) {
    console.error('Error adding user:', error.message)
    process.exit(1)
  }
}

main()
