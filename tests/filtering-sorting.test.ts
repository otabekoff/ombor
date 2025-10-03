import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Ombor from '../src/ombor'

describe('Filtering and Sorting', () => {
  let db: Ombor

  beforeEach(async () => {
    db = new Ombor('test-filtering-sorting')

    // Seed data with various ages and names
    await db.collection('users').add({ name: 'Alice', age: 30, score: 85 })
    await db.collection('users').add({ name: 'Bob', age: 25, score: 90 })
    await db.collection('users').add({ name: 'Charlie', age: 35, score: 75 })
    await db.collection('users').add({ name: 'David', age: 28, score: 95 })
    await db.collection('users').add({ name: 'Eve', age: 32, score: 80 })
  })

  afterEach(async () => {
    await db.delete()
  })

  describe('OrderBy Operations', () => {
    it('should sort by age in ascending order', async () => {
      const users = await db.collection('users').orderBy('age', 'asc').get()

      expect(users).toHaveLength(5)
      expect(users[0].name).toBe('Bob') // age 25
      expect(users[1].name).toBe('David') // age 28
      expect(users[2].name).toBe('Alice') // age 30
      expect(users[3].name).toBe('Eve') // age 32
      expect(users[4].name).toBe('Charlie') // age 35
    })

    it('should sort by age in descending order', async () => {
      const users = await db.collection('users').orderBy('age', 'desc').get()

      expect(users).toHaveLength(5)
      expect(users[0].name).toBe('Charlie') // age 35
      expect(users[1].name).toBe('Eve') // age 32
      expect(users[2].name).toBe('Alice') // age 30
      expect(users[3].name).toBe('David') // age 28
      expect(users[4].name).toBe('Bob') // age 25
    })

    it('should sort by name alphabetically', async () => {
      const users = await db.collection('users').orderBy('name').get()

      expect(users[0].name).toBe('Alice')
      expect(users[1].name).toBe('Bob')
      expect(users[2].name).toBe('Charlie')
      expect(users[3].name).toBe('David')
      expect(users[4].name).toBe('Eve')
    })

    it('should sort by score', async () => {
      const users = await db.collection('users').orderBy('score', 'desc').get()

      expect(users[0].score).toBe(95) // David
      expect(users[1].score).toBe(90) // Bob
      expect(users[2].score).toBe(85) // Alice
      expect(users[3].score).toBe(80) // Eve
      expect(users[4].score).toBe(75) // Charlie
    })

    it('should default to ascending order when direction not specified', async () => {
      const users = await db.collection('users').orderBy('age').get()

      expect(users[0].age).toBe(25)
      expect(users[4].age).toBe(35)
    })

    it('should handle sorting empty collection', async () => {
      const empty = await db.collection('empty').orderBy('age', 'desc').get()
      expect(empty).toEqual([])
    })

    it('should handle sorting by non-existent property', async () => {
      const users = await db.collection('users').orderBy('nonexistent', 'asc').get()
      expect(users).toHaveLength(5)
    })
  })

  describe('Limit Operations', () => {
    it('should limit results to 2 records', async () => {
      const users = await db.collection('users').limit(2).get()
      expect(users).toHaveLength(2)
    })

    it('should limit results to 1 record', async () => {
      const users = await db.collection('users').limit(1).get()
      expect(users).toHaveLength(1)
    })

    it('should return all records when limit exceeds total', async () => {
      const users = await db.collection('users').limit(100).get()
      expect(users).toHaveLength(5)
    })

    it('should handle limit of 0', async () => {
      const users = await db.collection('users').limit(0).get()
      expect(users).toEqual([])
    })

    it('should handle negative limit', async () => {
      const users = await db.collection('users').limit(-1).get()
      // Implementation dependent - might return all or empty
      expect(Array.isArray(users)).toBe(true)
    })
  })

  describe('Combined OrderBy and Limit', () => {
    it('should get top 3 oldest users', async () => {
      const users = await db.collection('users')
        .orderBy('age', 'desc')
        .limit(3)
        .get()

      expect(users).toHaveLength(3)
      expect(users[0].name).toBe('Charlie') // age 35
      expect(users[1].name).toBe('Eve') // age 32
      expect(users[2].name).toBe('Alice') // age 30
    })

    it('should get top 2 youngest users', async () => {
      const users = await db.collection('users')
        .orderBy('age', 'asc')
        .limit(2)
        .get()

      expect(users).toHaveLength(2)
      expect(users[0].name).toBe('Bob') // age 25
      expect(users[1].name).toBe('David') // age 28
    })

    it('should get top scorer', async () => {
      const users = await db.collection('users')
        .orderBy('score', 'desc')
        .limit(1)
        .get()

      expect(users).toHaveLength(1)
      expect(users[0].name).toBe('David')
      expect(users[0].score).toBe(95)
    })

    it('should support multiple chained operations', async () => {
      const result = await db.collection('users')
        .orderBy('score', 'desc')
        .limit(3)
        .get()

      expect(result).toHaveLength(3)
      expect(result[0].score).toBeGreaterThanOrEqual(result[1].score)
      expect(result[1].score).toBeGreaterThanOrEqual(result[2].score)
    })
  })

  describe('Pagination Scenarios', () => {
    beforeEach(async () => {
      // Clear and add more data for pagination
      await db.collection('items').delete()
      for (let i = 1; i <= 20; i++) {
        await db.collection('items').add({
          id: i,
          name: `Item ${i}`,
          value: i * 10
        })
      }
    })

    it('should get first page (1-5)', async () => {
      const page1 = await db.collection('items')
        .orderBy('id', 'asc')
        .limit(5)
        .get()

      expect(page1).toHaveLength(5)
      expect(page1[0].id).toBe(1)
      expect(page1[4].id).toBe(5)
    })

    it('should get specific page size', async () => {
      const pageSize = 3
      const page = await db.collection('items')
        .orderBy('id')
        .limit(pageSize)
        .get()

      expect(page).toHaveLength(pageSize)
    })

    it('should handle last page with fewer items', async () => {
      const items = await db.collection('items')
        .orderBy('id')
        .limit(25) // more than total
        .get()

      expect(items).toHaveLength(20) // only 20 items exist
    })
  })

  describe('Complex Sorting', () => {
    beforeEach(async () => {
      await db.collection('products').delete()
      await db.collection('products').add({ name: 'Laptop', price: 1200, stock: 5 })
      await db.collection('products').add({ name: 'Mouse', price: 25, stock: 100 })
      await db.collection('products').add({ name: 'Keyboard', price: 75, stock: 50 })
      await db.collection('products').add({ name: 'Monitor', price: 300, stock: 20 })
    })

    it('should sort by price ascending', async () => {
      const products = await db.collection('products')
        .orderBy('price', 'asc')
        .get()

      expect(products[0].price).toBe(25)
      expect(products[3].price).toBe(1200)
    })

    it('should sort by stock descending', async () => {
      const products = await db.collection('products')
        .orderBy('stock', 'desc')
        .get()

      expect(products[0].stock).toBe(100)
      expect(products[3].stock).toBe(5)
    })

    it('should get cheapest products', async () => {
      const cheap = await db.collection('products')
        .orderBy('price', 'asc')
        .limit(2)
        .get()

      expect(cheap).toHaveLength(2)
      expect(cheap[0].name).toBe('Mouse')
      expect(cheap[1].name).toBe('Keyboard')
    })

    it('should get most expensive product', async () => {
      const expensive = await db.collection('products')
        .orderBy('price', 'desc')
        .limit(1)
        .get()

      expect(expensive[0].name).toBe('Laptop')
    })
  })
})
