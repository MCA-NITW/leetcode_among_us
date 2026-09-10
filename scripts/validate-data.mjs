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
const REQUIRED_FIELD_SET = new Set(REQUIRED_FIELDS)
// Mirrors isValidUsername in server.ts. Keep the two in sync.
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{1,40}$/
const BATCH_PATTERN = /^\d{4}$/
const GENDERS = new Set(['male', 'female', 'other'])

/** @returns {string[]} problems with the shape of one entry */
function checkShape(entry, where) {
  const errors = []
  for (const field of REQUIRED_FIELDS) {
    if (typeof entry[field] !== 'string' || entry[field].trim() === '') {
      errors.push(`${where}: "${field}" must be a non-empty string.`)
    }
  }
  const extra = Object.keys(entry).filter(k => !REQUIRED_FIELD_SET.has(k))
  if (extra.length > 0) {
    errors.push(`${where}: unexpected field(s): ${extra.join(', ')}.`)
  }
  return errors
}

/** @returns {string[]} problems with field values (not uniqueness) */
function checkValues(entry, where) {
  const errors = []
  const { userName, batch, gender } = entry
  if (typeof userName === 'string' && !USERNAME_PATTERN.test(userName)) {
    errors.push(
      `${where}: userName "${userName}" must be 1-40 letters, digits, hyphens or underscores.`
    )
  }
  if (typeof batch === 'string' && !BATCH_PATTERN.test(batch)) {
    errors.push(`${where}: batch "${batch}" must be a four-digit year.`)
  }
  if (typeof gender === 'string' && !GENDERS.has(gender.toLowerCase())) {
    errors.push(
      `${where}: gender "${gender}" must be one of ${[...GENDERS].join(', ')}.`
    )
  }
  return errors
}

/**
 * Records `value` under `label` in `seen`; returns an error when it was
 * already there. Keys are case-folded: LeetCode usernames are
 * case-insensitive, so two spellings would produce a duplicate leaderboard row.
 * @returns {string | null}
 */
function checkUnique(seen, label, value, where, index) {
  if (typeof value !== 'string') return null
  const key = value.trim().toLowerCase()
  const previous = seen.get(key)
  if (previous !== undefined) {
    return `${where}: duplicate ${label} "${value}" (also entry #${previous}).`
  }
  seen.set(key, index + 1)
  return null
}

/**
 * @param {unknown} data parsed JSON
 * @returns {string[]} list of problems; empty when valid
 */
export function validateRoster(data) {
  if (!Array.isArray(data)) {
    return ['Roster must be a JSON array of entries.']
  }

  const errors = []
  const seenIds = new Map()
  const seenUserNames = new Map()

  data.forEach((entry, index) => {
    const where = `entry #${index + 1}`
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(`${where}: must be an object.`)
      return
    }

    errors.push(...checkShape(entry, where), ...checkValues(entry, where))

    const dupId = checkUnique(seenIds, 'id', entry.id, where, index)
    if (dupId) errors.push(dupId)
    const dupName = checkUnique(
      seenUserNames,
      'userName',
      entry.userName,
      where,
      index
    )
    if (dupName) errors.push(dupName)
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
