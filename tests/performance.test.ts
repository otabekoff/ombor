import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Ombor from '../src/ombor'

describe('Performance Tests', () => {
  let db: Ombor

  beforeEach(async () => {
    db = new Ombor('test-performance')
  })

  afterEach(async () => {
    await db.delete()
  })

  describe('Insert Performance', () => {
    it('should handle 100 inserts efficiently', async () => {
      const start = performance.now()

      for (let i = 0; i < 100; i++) {
        await db.collection('perf').add({
          id: i,
          name: `User ${i}`,
          email: `user${i}@test.com`,
          age: 20 + (i % 50),
          score: Math.random() * 100
        })
      }

      const end = performance.now()
      const duration = end - start

      const records = await db.collection('perf').get()
      expect(records).toHaveLength(100)
      expect(duration).toBeLessThan(10000) // Should complete in less than 10 seconds
    }, 15000)

    it('should handle 500 inserts', async () => {
      const start = performance.now()

      for (let i = 0; i < 500; i++) {
        await db.collection('perf').add({
          id: i,
          value: i * 10
        })
      }

      const end = performance.now()
      const duration = end - start

      const records = await db.collection('perf').get()
      expect(records).toHaveLength(500)

      console.log(`500 inserts took ${duration.toFixed(2)}ms (${(duration / 500).toFixed(2)}ms per insert)`)
    }, 30000)

    it('should handle bulk inserts with complex objects', async () => {
      const start = performance.now()

      for (let i = 0; i < 50; i++) {
        await db.collection('complex').add({
          id: i,
          name: `Item ${i}`,
          metadata: {
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            version: 1
          },
          tags: ['tag1', 'tag2', 'tag3'],
          settings: {
            enabled: true,
            priority: i % 5,
            options: {
              autoSave: true,
              notifications: false
            }
          },
          data: Array.from({ length: 10 }, (_, j) => ({ index: j, value: j * i }))
        })
      }

      const end = performance.now()
      const duration = end - start

      const records = await db.collection('complex').get()
      expect(records).toHaveLength(50)

      console.log(`50 complex inserts took ${duration.toFixed(2)}ms`)
    }, 15000)
  })

  describe('Read Performance', () => {
    beforeEach(async () => {
      // Seed 1000 records
      for (let i = 0; i < 1000; i++) {
        await db.collection('large').add({
          id: i,
          name: `User ${i}`,
          age: 20 + (i % 50),
          score: Math.random() * 100
        })
      }
    }, 60000)

    it('should read all 1000 records efficiently', async () => {
      const start = performance.now()
      const records = await db.collection('large').get()
      const end = performance.now()

      expect(records).toHaveLength(1000)
      expect(end - start).toBeLessThan(1000) // Should be fast

      console.log(`Reading 1000 records took ${(end - start).toFixed(2)}ms`)
    })

    it('should read with sorting efficiently', async () => {
      const start = performance.now()
      const records = await db.collection('large').orderBy('age', 'desc').get()
      const end = performance.now()

      expect(records).toHaveLength(1000)
      expect(records[0].age).toBeGreaterThanOrEqual(records[999].age)

      console.log(`Sorting 1000 records took ${(end - start).toFixed(2)}ms`)
    })

    it('should read with limit efficiently', async () => {
      const start = performance.now()
      const records = await db.collection('large').limit(100).get()
      const end = performance.now()

      expect(records).toHaveLength(100)
      expect(end - start).toBeLessThan(500)

      console.log(`Reading 100 of 1000 records took ${(end - start).toFixed(2)}ms`)
    })

    it('should read with sorting and limit efficiently', async () => {
      const start = performance.now()
      const records = await db.collection('large')
        .orderBy('score', 'desc')
        .limit(50)
        .get()
      const end = performance.now()

      expect(records).toHaveLength(50)

      console.log(`Sorting and limiting 1000 records took ${(end - start).toFixed(2)}ms`)
    })
  })

  describe('Update Performance', () => {
    beforeEach(async () => {
      // Seed 100 records
      for (let i = 0; i < 100; i++) {
        await db.collection('updates').add({
          id: i,
          value: i * 10,
          updated: false
        })
      }
    }, 15000)

    it('should update 100 records efficiently', async () => {
      const start = performance.now()

      for (let i = 0; i < 100; i++) {
        await db.collection('updates').doc({ id: i }).update({
          updated: true,
          timestamp: Date.now()
        })
      }

      const end = performance.now()
      const duration = end - start

      expect(duration).toBeLessThan(10000)

      console.log(`100 updates took ${duration.toFixed(2)}ms`)
    }, 15000)

    it('should update single field efficiently', async () => {
      const start = performance.now()

      for (let i = 0; i < 50; i++) {
        await db.collection('updates').doc({ id: i }).update({ value: i * 20 })
      }

      const end = performance.now()

      console.log(`50 single-field updates took ${(end - start).toFixed(2)}ms`)
    }, 10000)
  })

  describe('Delete Performance', () => {
    beforeEach(async () => {
      // Seed 200 records
      for (let i = 0; i < 200; i++) {
        await db.collection('deletes').add({
          id: i,
          value: i * 10
        })
      }
    }, 20000)

    it('should delete 100 individual records efficiently', async () => {
      const start = performance.now()

      for (let i = 0; i < 100; i++) {
        await db.collection('deletes').doc({ id: i }).delete()
      }

      const end = performance.now()
      const duration = end - start

      const remaining = await db.collection('deletes').get()
      expect(remaining).toHaveLength(100)

      console.log(`100 deletes took ${duration.toFixed(2)}ms`)
    }, 15000)

    it('should delete entire collection efficiently', async () => {
      const start = performance.now()
      await db.collection('deletes').delete()
      const end = performance.now()

      const records = await db.collection('deletes').get()
      expect(records).toEqual([])

      console.log(`Deleting collection with 200 records took ${(end - start).toFixed(2)}ms`)
    })
  })

  describe('Mixed Operations Performance', () => {
    it('should handle mixed CRUD operations', async () => {
      const start = performance.now()

      // Insert
      for (let i = 0; i < 50; i++) {
        await db.collection('mixed').add({ id: i, value: i })
      }

      // Read
      let records = await db.collection('mixed').get()
      expect(records).toHaveLength(50)

      // Update
      for (let i = 0; i < 25; i++) {
        await db.collection('mixed').doc({ id: i }).update({ value: i * 2 })
      }

      // Delete
      for (let i = 40; i < 50; i++) {
        await db.collection('mixed').doc({ id: i }).delete()
      }

      // Final read
      records = await db.collection('mixed').get()
      expect(records).toHaveLength(40)

      const end = performance.now()

      console.log(`Mixed operations took ${(end - start).toFixed(2)}ms`)
    }, 20000)
  })

  describe('Concurrent Operations', () => {
    it('should handle concurrent inserts', async () => {
      const start = performance.now()

      const promises = []
      for (let i = 0; i < 50; i++) {
        promises.push(
          db.collection('concurrent').add({
            id: i,
            value: i * 10
          })
        )
      }

      await Promise.all(promises)
      const end = performance.now()

      const records = await db.collection('concurrent').get()
      expect(records).toHaveLength(50)

      console.log(`50 concurrent inserts took ${(end - start).toFixed(2)}ms`)
    }, 10000)

    it('should handle concurrent reads from multiple collections', async () => {
      await db.collection('col1').add({ data: 'test1' })
      await db.collection('col2').add({ data: 'test2' })
      await db.collection('col3').add({ data: 'test3' })

      const start = performance.now()

      const [col1, col2, col3] = await Promise.all([
        db.collection('col1').get(),
        db.collection('col2').get(),
        db.collection('col3').get()
      ])

      const end = performance.now()

      expect(col1).toHaveLength(1)
      expect(col2).toHaveLength(1)
      expect(col3).toHaveLength(1)

      console.log(`Concurrent reads from 3 collections took ${(end - start).toFixed(2)}ms`)
    })
  })

  describe('Large Data Performance', () => {
    it('should handle records with large data', async () => {
      const largeText = 'Lorem ipsum '.repeat(100) // ~1200 characters
      const largeArray = Array.from({ length: 100 }, (_, i) => ({ id: i, value: i * 10 }))

      const start = performance.now()

      for (let i = 0; i < 20; i++) {
        await db.collection('large-data').add({
          id: i,
          text: largeText,
          array: largeArray,
          metadata: {
            created: new Date().toISOString(),
            tags: Array.from({ length: 50 }, (_, j) => `tag${j}`)
          }
        })
      }

      const end = performance.now()

      const records = await db.collection('large-data').get()
      expect(records).toHaveLength(20)

      console.log(`20 large records took ${(end - start).toFixed(2)}ms`)
    }, 15000)
  })

  describe('Memory and Cleanup', () => {
    it('should clean up after deleting database', async () => {
      // Add lots of data
      for (let i = 0; i < 100; i++) {
        await db.collection('temp').add({ id: i, data: 'x'.repeat(100) })
      }

      let records = await db.collection('temp').get()
      expect(records).toHaveLength(100)

      // Delete database
      await db.delete()

      // Verify cleanup
      records = await db.collection('temp').get()
      expect(records).toEqual([])
    }, 15000)
  })
})
