import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import {
  User,
  Recipe,
  WeeklyMenus,
  RateLimit,
  TimestampedRecipeCollection,
  TimestampedWeeklyMenus,
  RecipeCollection,
} from './types'

const DATA_DIR = process.env.DATA_DIR || './data'
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const MAX_PASSWORD_LENGTH = 64

// In-memory storage
let users: User[] = []
const rateLimits: Map<string, RateLimit> = new Map()

// Configuration
const config = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '2097152'), // 2MB default
  rateLimit: {
    perMinute: parseInt(process.env.RATE_LIMIT_MINUTE || '10'),
    perHour: parseInt(process.env.RATE_LIMIT_HOUR || '100'),
    perDay: parseInt(process.env.RATE_LIMIT_DAY || '1000'),
  },
}

// Ensure data directory exists
export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Load users from file into memory
export function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8')
      users = JSON.parse(data)
      console.log(`Loaded ${users.length} users from ${USERS_FILE}`)
    } else {
      users = []
      console.log('No users file found, starting with empty user list')
    }
  } catch (error) {
    console.error('Error loading users:', error)
    users = []
  }
}

// Save users to file
export function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
    console.log(`Saved ${users.length} users to ${USERS_FILE}`)
  } catch (error) {
    console.error('Error saving users:', error)
    throw error
  }
}

// Find user by username
export function findUserByUsername(username: string): User | undefined {
  return users.find((user) => user.username === username)
}

// Find user by UUID
export function findUserByUuid(uuid: string): User | undefined {
  return users.find((user) => user.uuid === uuid)
}

// Verify password
export async function verifyPassword(username: string, password: string): Promise<User | null> {
  const user = findUserByUsername(username)
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}

// Change user password
export async function changeUserPassword(uuid: string, newPassword: string): Promise<boolean> {
  if (newPassword.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Password exceeds maximum length of ${MAX_PASSWORD_LENGTH} characters`)
  }

  const userIndex = users.findIndex((user) => user.uuid === uuid)
  if (userIndex === -1) return false

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  users[userIndex].password = hashedPassword
  saveUsers()
  return true
}

// Add new user
export async function addUser(username: string, password: string): Promise<string> {
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Password exceeds maximum length of ${MAX_PASSWORD_LENGTH} characters`)
  }

  if (findUserByUsername(username)) {
    throw new Error('Username already exists')
  }

  const uuid = require('crypto').randomUUID()
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser: User = {
    uuid,
    username,
    password: hashedPassword,
  }

  users.push(newUser)
  saveUsers()
  return uuid
}

// Rate limiting functions
export function checkRateLimit(uuid: string): boolean {
  const now = Date.now()
  const currentMinute = Math.floor(now / 60000)
  const currentHour = Math.floor(now / 3600000)
  const currentDay = Math.floor(now / 86400000)

  let limit = rateLimits.get(uuid)
  if (!limit) {
    limit = {
      minute: 0,
      hour: 0,
      day: 0,
      lastMinute: currentMinute,
      lastHour: currentHour,
      lastDay: currentDay,
    }
    rateLimits.set(uuid, limit)
  }

  // Reset counters if time period has passed
  if (currentMinute > limit.lastMinute) {
    limit.minute = 0
    limit.lastMinute = currentMinute
  }
  if (currentHour > limit.lastHour) {
    limit.hour = 0
    limit.lastHour = currentHour
  }
  if (currentDay > limit.lastDay) {
    limit.day = 0
    limit.lastDay = currentDay
  }

  // Check limits
  if (
    limit.minute >= config.rateLimit.perMinute ||
    limit.hour >= config.rateLimit.perHour ||
    limit.day >= config.rateLimit.perDay
  ) {
    return false
  }

  // Increment counters
  limit.minute++
  limit.hour++
  limit.day++

  return true
}

// File operations for user data with timestamp support
export function loadUserRecipes(uuid: string): TimestampedRecipeCollection {
  try {
    const filePath = path.join(DATA_DIR, `${uuid}-recipes.json`)
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    }
    return { data: {}, lastModified: 0 }
  } catch (error) {
    console.error(`Error loading recipes for user ${uuid}:`, error)
    return { data: {}, lastModified: 0 }
  }
}

export function saveUserRecipes(
  uuid: string,
  recipeCollection: RecipeCollection,
  expectedLastModified?: number
): TimestampedRecipeCollection {
  // Load current data to check timestamp
  const currentData = loadUserRecipes(uuid)

  // Check for stale data if expectedLastModified is provided
  if (expectedLastModified !== undefined && currentData.lastModified > expectedLastModified) {
    throw new Error('STALE_DATA')
  }

  const now = Date.now()
  const timestampedData: TimestampedRecipeCollection = {
    data: recipeCollection,
    lastModified: now,
  }

  const jsonData = JSON.stringify(timestampedData, null, 2)
  if (Buffer.byteLength(jsonData, 'utf8') > config.maxFileSize) {
    throw new Error(`File size exceeds maximum limit of ${config.maxFileSize} bytes`)
  }

  const filePath = path.join(DATA_DIR, `${uuid}-recipes.json`)
  fs.writeFileSync(filePath, jsonData)

  return timestampedData
}

export function loadUserWeeklyMenus(uuid: string): TimestampedWeeklyMenus {
  try {
    const filePath = path.join(DATA_DIR, `${uuid}-weeklymenus.json`)
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    }
    return { data: {}, lastModified: 0 }
  } catch (error) {
    console.error(`Error loading weekly menus for user ${uuid}:`, error)
    return { data: {}, lastModified: 0 }
  }
}

export function saveUserWeeklyMenus(
  uuid: string,
  weeklyMenus: WeeklyMenus,
  expectedLastModified?: number
): TimestampedWeeklyMenus {
  // Load current data to check timestamp
  const currentData = loadUserWeeklyMenus(uuid)

  // Check for stale data if expectedLastModified is provided
  if (expectedLastModified !== undefined && currentData.lastModified > expectedLastModified) {
    throw new Error('STALE_DATA')
  }

  const now = Date.now()
  const timestampedData: TimestampedWeeklyMenus = {
    data: weeklyMenus,
    lastModified: now,
  }

  const jsonData = JSON.stringify(timestampedData, null, 2)
  if (Buffer.byteLength(jsonData, 'utf8') > config.maxFileSize) {
    throw new Error(`File size exceeds maximum limit of ${config.maxFileSize} bytes`)
  }

  const filePath = path.join(DATA_DIR, `${uuid}-weeklymenus.json`)
  fs.writeFileSync(filePath, jsonData)

  return timestampedData
}
