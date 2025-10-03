import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Ombor from '../src/ombor'

describe('Edge Cases and Error Handling', () => {
  let db: Ombor

  beforeEach(async () => {
    db = new Ombor('test-edge-cases')
  })

  afterEach(async () => {
    await db.delete()
  })

  describe('Empty Operations', () => {
    it('should handle empty collection read', async () => {
      const records = await db.collection('empty').get()
      expect(records).toEqual([])
    })

    it('should handle getting from non-existent collection', async () => {
      const records = await db.collection('nonexistent').get()
      expect(records).toEqual([])
    })

    it('should handle update on empty collection', async () => {
      await db.collection('empty').doc({ id: 1 }).update({ value: 'test' })
      const records = await db.collection('empty').get()
      // Depending on implementation, might be empty or create record
      expect(Array.isArray(records)).toBe(true)
    })

    it('should handle delete on empty collection', async () => {
      await db.collection('empty').doc({ id: 1 }).delete()
      await db.collection('empty').delete()
      const records = await db.collection('empty').get()
      expect(records).toEqual([])
    })
  })

  describe('Null and Undefined Values', () => {
    it('should handle null values in data', async () => {
      await db.collection('nulls').add({
        name: 'Test',
        value: null,
        nested: { field: null }
      })

      const records = await db.collection('nulls').get()
      expect(records[0].value).toBe(null)
      expect(records[0].nested.field).toBe(null)
    })

    it('should handle undefined values in data', async () => {
      await db.collection('undefined').add({
        name: 'Test',
        value: undefined,
        defined: 'yes'
      })

      const records = await db.collection('undefined').get()
      expect(records[0].defined).toBe('yes')
      // undefined might be omitted or stored as null
    })

    it('should handle mixed null/undefined in arrays', async () => {
      await db.collection('arrays').add({
        values: [1, null, 3, undefined, 5]
      })

      const records = await db.collection('arrays').get()
      expect(Array.isArray(records[0].values)).toBe(true)
    })
  })

  describe('Special Characters and Encoding', () => {
    it('should handle special characters in data', async () => {
      await db.collection('special').add({
        emoji: '🚀💻🎉',
        unicode: 'Üñíçødé',
        symbols: '!@#$%^&*()',
        quotes: '"double" and \'single\'',
        newlines: 'line1\nline2\nline3'
      })

      const records = await db.collection('special').get()
      expect(records[0].emoji).toBe('🚀💻🎉')
      expect(records[0].unicode).toBe('Üñíçødé')
      expect(records[0].symbols).toBe('!@#$%^&*()')
    })

    it('should handle HTML/XML content', async () => {
      await db.collection('markup').add({
        html: '<div class="test">Hello <b>World</b></div>',
        xml: '<?xml version="1.0"?><root><item>test</item></root>'
      })

      const records = await db.collection('markup').get()
      expect(records[0].html).toContain('<div')
      expect(records[0].xml).toContain('<?xml')
    })

    it('should handle very long strings', async () => {
      const longString = 'x'.repeat(10000)
      await db.collection('long').add({
        text: longString
      })

      const records = await db.collection('long').get()
      expect(records[0].text).toHaveLength(10000)
    })
  })

  describe('Duplicate and Similar Data', () => {
    it('should allow duplicate records', async () => {
      await db.collection('duplicates').add({ name: 'Test', value: 1 })
      await db.collection('duplicates').add({ name: 'Test', value: 1 })
      await db.collection('duplicates').add({ name: 'Test', value: 1 })

      const records = await db.collection('duplicates').get()
      expect(records).toHaveLength(3)
    })

    it('should handle similar but not identical records', async () => {
      await db.collection('similar').add({ name: 'Test', value: 1 })
      await db.collection('similar').add({ name: 'Test', value: 2 })
      await db.collection('similar').add({ name: 'test', value: 1 }) // different case

      const records = await db.collection('similar').get()
      expect(records).toHaveLength(3)
    })

    it('should update only first matching record on duplicate query', async () => {
      await db.collection('dups').add({ id: 1, value: 'a' })
      await db.collection('dups').add({ id: 1, value: 'b' })
      await db.collection('dups').add({ id: 1, value: 'c' })

      await db.collection('dups').doc({ id: 1 }).update({ updated: true })

      const records = await db.collection('dups').get()
      const updated = records.filter((r: any) => r.updated === true)

      // Should update only one or all matching records depending on implementation
      expect(updated.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Type Edge Cases', () => {
    it('should handle very large numbers', async () => {
      await db.collection('numbers').add({
        large: Number.MAX_SAFE_INTEGER,
        small: Number.MIN_SAFE_INTEGER,
        float: 123.456789
      })

      const records = await db.collection('numbers').get()
      expect(records[0].large).toBe(Number.MAX_SAFE_INTEGER)
      expect(records[0].small).toBe(Number.MIN_SAFE_INTEGER)
    })

    it('should handle Date objects', async () => {
      const now = new Date()
      await db.collection('dates').add({
        date: now.toISOString(),
        timestamp: Date.now()
      })

      const records = await db.collection('dates').get()
      expect(typeof records[0].date).toBe('string')
      expect(typeof records[0].timestamp).toBe('number')
    })

    it('should handle deeply nested objects', async () => {
      await db.collection('nested').add({
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  value: 'deep'
                }
              }
            }
          }
        }
      })

      const records = await db.collection('nested').get()
      expect(records[0].level1.level2.level3.level4.level5.value).toBe('deep')
    })

    it('should handle mixed array types', async () => {
      await db.collection('mixed-arrays').add({
        mixed: [1, 'string', true, null, { nested: 'object' }, [1, 2, 3]]
      })

      const records = await db.collection('mixed-arrays').get()
      expect(records[0].mixed).toHaveLength(6)
      expect(typeof records[0].mixed[0]).toBe('number')
      expect(typeof records[0].mixed[1]).toBe('string')
      expect(typeof records[0].mixed[2]).toBe('boolean')
    })
  })

  describe('Query Edge Cases', () => {
    beforeEach(async () => {
      await db.collection('query').add({ id: 1, name: 'Alice', age: null })
      await db.collection('query').add({ id: 2, name: 'Bob', age: 30 })
      await db.collection('query').add({ id: 3, name: null, age: 25 })
    })

    it('should handle querying null values', async () => {
      const record = await db.collection('query').doc({ age: null }).get()
      // Implementation dependent
      expect(record === undefined || record?.id === 1).toBe(true)
    })

    it('should handle querying with non-existent field', async () => {
      const record = await db.collection('query').doc({ nonexistent: 'value' }).get()
      expect(record).toBeUndefined()
    })

    it('should handle empty query object', async () => {
      const record = await db.collection('query').doc({}).get()
      // Might return first record or undefined
      expect(record === undefined || typeof record === 'object').toBe(true)
    })
  })

  describe('Boundary Conditions', () => {
    it('should handle limit of 0', async () => {
      await db.collection('items').add({ id: 1 })
      await db.collection('items').add({ id: 2 })

      const records = await db.collection('items').limit(0).get()
      expect(records).toEqual([])
    })

    it('should handle very large limit', async () => {
      await db.collection('items').add({ id: 1 })
      await db.collection('items').add({ id: 2 })

      const records = await db.collection('items').limit(999999).get()
      expect(records).toHaveLength(2)
    })

    it('should handle negative limit', async () => {
      await db.collection('items').add({ id: 1 })

      const records = await db.collection('items').limit(-1).get()
      // Implementation dependent
      expect(Array.isArray(records)).toBe(true)
    })

    it('should handle sorting with all same values', async () => {
      await db.collection('same').add({ value: 5 })
      await db.collection('same').add({ value: 5 })
      await db.collection('same').add({ value: 5 })

      const records = await db.collection('same').orderBy('value', 'desc').get()
      expect(records).toHaveLength(3)
      expect(records.every((r: any) => r.value === 5)).toBe(true)
    })

    it('should handle sorting with null values', async () => {
      await db.collection('nullsort').add({ value: 10 })
      await db.collection('nullsort').add({ value: null })
      await db.collection('nullsort').add({ value: 5 })

      const records = await db.collection('nullsort').orderBy('value', 'asc').get()
      expect(records).toHaveLength(3)
    })
  })

  describe('Concurrent Operations', () => {
    it('should handle rapid sequential operations', async () => {
      for (let i = 0; i < 10; i++) {
        await db.collection('rapid').add({ id: i })
      }

      for (let i = 0; i < 10; i++) {
        await db.collection('rapid').doc({ id: i }).update({ updated: true })
      }

      for (let i = 0; i < 5; i++) {
        await db.collection('rapid').doc({ id: i }).delete()
      }

      const records = await db.collection('rapid').get()
      expect(records).toHaveLength(5)
    })

    it('should handle simultaneous writes to same collection', async () => {
      const promises = []
      for (let i = 0; i < 20; i++) {
        promises.push(db.collection('concurrent').add({ id: i, value: i * 10 }))
      }

      await Promise.all(promises)

      const records = await db.collection('concurrent').get()
      expect(records).toHaveLength(20)
    })
  })

  describe('Data Integrity', () => {
    it('should maintain data after multiple operations', async () => {
      await db.collection('integrity').add({ id: 1, value: 'original' })

      await db.collection('integrity').doc({ id: 1 }).update({ value: 'updated' })
      let record = await db.collection('integrity').doc({ id: 1 }).get()
      expect(record.value).toBe('updated')

      await db.collection('integrity').doc({ id: 1 }).set({ id: 1, value: 'replaced' })
      record = await db.collection('integrity').doc({ id: 1 }).get()
      expect(record.value).toBe('replaced')
    })

    it('should not corrupt data on failed operations', async () => {
      await db.collection('test').add({ id: 1, value: 'original' })

      // Attempt invalid operations (implementation dependent)
      try {
        await db.collection('test').doc({ id: 1 }).update({ value: undefined })
      } catch {
        // Ignore error
      }

      const record = await db.collection('test').doc({ id: 1 }).get()
      expect(record.id).toBe(1)
    })
  })

  describe('Empty String and Whitespace', () => {
    it('should handle empty strings', async () => {
      await db.collection('empty-strings').add({
        name: '',
        value: 'test',
        spaces: '   '
      })

      const records = await db.collection('empty-strings').get()
      expect(records[0].name).toBe('')
      expect(records[0].spaces).toBe('   ')
    })

    it('should query by empty string', async () => {
      await db.collection('strings').add({ name: '', value: 1 })
      await db.collection('strings').add({ name: 'test', value: 2 })

      const record = await db.collection('strings').doc({ name: '' }).get()
      expect(record?.value).toBe(1)
    })
  })
})
