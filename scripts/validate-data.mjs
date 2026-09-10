#!/usr/bin/env node
/**
 * Validates client/src/assets/leetcoders_data.json.
 *
 * Runs automatically before the client build and via `pnpm validate:data`.
 * Exits non-zero with a readable list of problems so a bad roster entry fails
 * CI instead of silently producing an empty leaderboard row.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const REQUIRED_FIELDS = ['id', 'name', 'userName', 'batch', 'gender']
// Mirrors isValidUsername in server.ts. Keep the two in sync.
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{1,40}$/
const BATCH_PATTERN = /^\d{4}$/
const GENDERS = new Set(['male', 'female', 'other'])

/**
 * @param {unknown} data parsed JSON
 * @returns {string[]} list of problems; empty when valid
 */
export function validateRoster(data) {
  const errors = []
  if (!Array.isArray(data)) {
    return ['Roster must be a JSON array of entries.']
  }

  const seenIds = new Map()
  const seenUserNames = new Map()

  data.forEach((entry, index) => {
    const where = `entry #${index + 1}`
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(`${where}: must be an object.`)
      return
    }

    for (const field of REQUIRED_FIELDS) {
      if (typeof entry[field] !== 'string' || entry[field].trim() === '') {
        errors.push(`${where}: "${field}" must be a non-empty string.`)
      }
    }

    const extra = Object.keys(entry).filter(k => !REQUIRED_FIELDS.includes(k))
    if (extra.length > 0) {
      errors.push(`${where}: unexpected field(s): ${extra.join(', ')}.`)
    }

    const { id, userName, batch, gender } = entry

    if (typeof id === 'string') {
      const key = id.trim().toUpperCase()
      if (seenIds.has(key)) {
        errors.push(
          `${where}: duplicate id "${id}" (also entry #${seenIds.get(key)}).`
        )
      } else {
        seenIds.set(key, index + 1)
      }
    }

    if (typeof userName === 'string') {
      if (!USERNAME_PATTERN.test(userName)) {
        errors.push(
          `${where}: userName "${userName}" must be 1-40 letters, digits, hyphens or underscores.`
        )
      }
      // LeetCode usernames are case-insensitive, so two spellings of the same
      // name would produce a duplicate leaderboard row.
      const key = userName.toLowerCase()
      if (seenUserNames.has(key)) {
        errors.push(
          `${where}: duplicate userName "${userName}" (also entry #${seenUserNames.get(key)}).`
        )
      } else {
        seenUserNames.set(key, index + 1)
      }
    }

    if (typeof batch === 'string' && !BATCH_PATTERN.test(batch)) {
      errors.push(`${where}: batch "${batch}" must be a four-digit year.`)
    }

    if (typeof gender === 'string' && !GENDERS.has(gender.toLowerCase())) {
      errors.push(
        `${where}: gender "${gender}" must be one of ${[...GENDERS].join(', ')}.`
      )
    }
  })

  return errors
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const rosterPath = path.join(
    here,
    '..',
    'client',
    'src',
    'assets',
    'leetcoders_data.json'
  )

  let parsed
  try {
    parsed = JSON.parse(await readFile(rosterPath, 'utf8'))
  } catch (error) {
    console.error(`Could not read or parse ${rosterPath}:`)
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }

  const errors = validateRoster(parsed)
  if (errors.length > 0) {
    console.error(`Roster validation failed with ${errors.length} problem(s):`)
    for (const line of errors) console.error(`  - ${line}`)
    process.exit(1)
  }
  console.log(`Roster OK: ${parsed.length} entries validated.`)
}
