import { describe, expect, it } from 'vitest'
import { readFile } from 'node:fs/promises'
import { validateRoster } from '../scripts/validate-data.mjs'

const valid = {
  id: '22MCF1R01',
  name: 'Jane Doe',
  userName: 'jane_doe',
  batch: '2025',
  gender: 'female'
}

describe('validateRoster', () => {
  it('accepts the committed roster', async () => {
    const roster = JSON.parse(
      await readFile(
        new URL('../client/src/assets/leetcoders_data.json', import.meta.url),
        'utf8'
      )
    )
    expect(validateRoster(roster)).toEqual([])
  })

  it('accepts a well-formed entry', () => {
    expect(validateRoster([valid])).toEqual([])
  })

  it('rejects non-array input', () => {
    expect(validateRoster({})).toHaveLength(1)
  })

  it('flags missing and empty required fields', () => {
    const errors = validateRoster([{ ...valid, name: '', batch: undefined }])
    expect(errors.some(e => e.includes('"name"'))).toBe(true)
    expect(errors.some(e => e.includes('"batch"'))).toBe(true)
  })

  it('flags unexpected fields', () => {
    const errors = validateRoster([{ ...valid, email: 'x@y.z' }])
    expect(errors[0]).toMatch(/unexpected field.*email/)
  })

  it('flags usernames the server would reject', () => {
    const errors = validateRoster([{ ...valid, userName: 'jane doe!' }])
    expect(errors[0]).toMatch(/userName/)
  })

  it('flags duplicate ids and case-insensitive duplicate usernames', () => {
    const errors = validateRoster([
      valid,
      { ...valid, id: '22mcf1r01', userName: 'JANE_DOE' }
    ])
    expect(errors.some(e => e.includes('duplicate id'))).toBe(true)
    expect(errors.some(e => e.includes('duplicate userName'))).toBe(true)
  })

  it('flags bad batch years and genders', () => {
    const errors = validateRoster([{ ...valid, batch: '25', gender: 'yes' }])
    expect(errors.some(e => e.includes('four-digit year'))).toBe(true)
    expect(errors.some(e => e.includes('gender'))).toBe(true)
  })
})
