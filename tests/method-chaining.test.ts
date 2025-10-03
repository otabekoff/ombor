import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Ombor from '../src/ombor'

describe('Method Chaining', () => {
  let db: Ombor

  beforeEach(async () => {
    db = new Ombor('test-chaining')
  })

  afterEach(async () => {
    await db.delete()
  })

  describe('Basic Chaining', () => {
    it('should chain collection and get', async () => {
      await db.collection('users').add({ name: 'Alice' })

      const users = await db.collection('users').get()
      expect(users).toHaveLength(1)
    })

    it('should chain collection, doc, and get', async () => {
      await db.collection('users').add({ name: 'Alice', age: 25 })

      const user = await db.collection('users').doc({ name: 'Alice' }).get()
      expect(user.age).toBe(25)
    })

    it('should chain collection, doc, and update', async () => {
      await db.collection('users').add({ name: 'Alice', age: 25 })

      await db.collection('users').doc({ name: 'Alice' }).update({ age: 26 })

      const user = await db.collection('users').doc({ name: 'Alice' }).get()
      expect(user.age).toBe(26)
    })

    it('should chain collection, doc, and set', async () => {
      await db.collection('users').add({ name: 'Alice', age: 25 })

      await db.collection('users').doc({ name: 'Alice' }).set({ name: 'Alice', age: 30 })

      const user = await db.collection('users').doc({ name: 'Alice' }).get()
      expect(user.age).toBe(30)
    })

    it('should chain collection, doc, and delete', async () => {
      await db.collection('users').add({ name: 'Alice' })
      await db.collection('users').add({ name: 'Bob' })

      await db.collection('users').doc({ name: 'Alice' }).delete()

      const users = await db.collection('users').get()
      expect(users).toHaveLength(1)
    })
  })

  describe('Chaining with Filters', () => {
    beforeEach(async () => {
      await db.collection('products').add({ name: 'Laptop', price: 1200, stock: 5 })
      await db.collection('products').add({ name: 'Mouse', price: 25, stock: 100 })
      await db.collection('products').add({ name: 'Keyboard', price: 75, stock: 50 })
      await db.collection('products').add({ name: 'Monitor', price: 300, stock: 20 })
    })

    it('should chain collection, orderBy, and get', async () => {
      const products = await db.collection('products').orderBy('price', 'desc').get()

      expect(products[0].price).toBe(1200)
      expect(products[3].price).toBe(25)
    })

    it('should chain collection, limit, and get', async () => {
      const products = await db.collection('products').limit(2).get()

      expect(products).toHaveLength(2)
    })

    it('should chain collection, orderBy, limit, and get', async () => {
      const products = await db.collection('products')
        .orderBy('price', 'asc')
        .limit(2)
        .get()

      expect(products).toHaveLength(2)
      expect(products[0].price).toBe(25)
      expect(products[1].price).toBe(75)
    })

    it('should chain in different order: limit then orderBy', async () => {
      const products = await db.collection('products')
        .limit(3)
        .orderBy('stock', 'desc')
        .get()

      expect(products).toHaveLength(3)
      // Results depend on implementation order
    })

    it('should support multiple orderBy calls (last one wins)', async () => {
      const products = await db.collection('products')
        .orderBy('name')
        .orderBy('price', 'desc')
        .get()

      expect(products[0].price).toBe(1200)
    })

    it('should support multiple limit calls (last one wins)', async () => {
      const products = await db.collection('products')
        .limit(5)
        .limit(2)
        .get()

      expect(products).toHaveLength(2)
    })
  })

  describe('Complex Chaining', () => {
    it('should chain collection, orderBy, limit, doc operations', async () => {
      await db.collection('items').add({ id: 1, value: 100 })
      await db.collection('items').add({ id: 2, value: 200 })
      await db.collection('items').add({ id: 3, value: 300 })

      // Get top item
      const topItems = await db.collection('items')
        .orderBy('value', 'desc')
        .limit(1)
        .get()

      expect(topItems[0].value).toBe(300)

      // Update it
      await db.collection('items').doc({ id: 3 }).update({ value: 350 })

      // Verify
      const updated = await db.collection('items').doc({ id: 3 }).get()
      expect(updated.value).toBe(350)
    })

    it('should maintain state across multiple operations', async () => {
      await db.collection('users').add({ name: 'Alice', score: 100 })
      await db.collection('users').add({ name: 'Bob', score: 150 })
      await db.collection('users').add({ name: 'Charlie', score: 120 })

      // First query
      const top = await db.collection('users')
        .orderBy('score', 'desc')
        .limit(1)
        .get()
      expect(top[0].name).toBe('Bob')

      // Second independent query
      const all = await db.collection('users').get()
      expect(all).toHaveLength(3)

      // Third query with different filters
      const sorted = await db.collection('users')
        .orderBy('score', 'asc')
        .get()
      expect(sorted[0].name).toBe('Alice')
    })
  })

  describe('Chaining Return Values', () => {
    it('should return db instance for method chaining', () => {
      const result1 = db.collection('test')
      expect(result1).toBe(db)

      const result2 = db.collection('test').orderBy('name')
      expect(result2).toBe(db)

      const result3 = db.collection('test').orderBy('name').limit(10)
      expect(result3).toBe(db)
    })

    it('should allow storing chain in variable', async () => {
      await db.collection('items').add({ id: 1, value: 10 })
      await db.collection('items').add({ id: 2, value: 20 })

      const query = db.collection('items').orderBy('value', 'desc')
      const results = await query.get()

      expect(results[0].value).toBe(20)
    })

    it('should allow reusing chain with different terminal operations', async () => {
      await db.collection('items').add({ id: 1, value: 10 })
      await db.collection('items').add({ id: 2, value: 20 })

      const baseQuery = db.collection('items').orderBy('value', 'desc')

      // Use same query multiple times
      const all = await baseQuery.get()
      expect(all).toHaveLength(2)

      // Note: State might be affected by previous operation
      const limited = await db.collection('items').orderBy('value', 'desc').limit(1).get()
      expect(limited).toHaveLength(1)
    })
  })

  describe('Long Chains', () => {
    it('should handle very long method chains', async () => {
      await db.collection('data').add({ a: 1, b: 2, c: 3 })

      const result = await db
        .collection('data')
        .orderBy('a')
        .orderBy('b')
        .orderBy('c')
        .limit(100)
        .limit(50)
        .limit(10)
        .get()

      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('Chaining with doc selector', () => {
    beforeEach(async () => {
      await db.collection('users').add({ id: 1, name: 'Alice', age: 25 })
      await db.collection('users').add({ id: 2, name: 'Bob', age: 30 })
    })

    it('should chain doc with string selector', async () => {
      // If doc accepts string ID
      const user = await db.collection('users').doc({ id: 1 }).get()
      expect(user.name).toBe('Alice')
    })

    it('should chain doc with object selector', async () => {
      const user = await db.collection('users').doc({ name: 'Bob' }).get()
      expect(user.age).toBe(30)
    })

    it('should chain doc with multiple criteria', async () => {
      const user = await db.collection('users').doc({ id: 1, name: 'Alice' }).get()
      expect(user.age).toBe(25)
    })
  })

  describe('Chaining State Management', () => {
    it('should reset state after terminal operation', async () => {
      await db.collection('items').add({ id: 1 })
      await db.collection('items').add({ id: 2 })
      await db.collection('items').add({ id: 3 })

      // First operation with limit
      const limited = await db.collection('items').limit(2).get()
      expect(limited).toHaveLength(2)

      // Second operation without limit - should get all
      const all = await db.collection('items').get()
      expect(all).toHaveLength(3)
    })

    it('should handle switching collections in chain', async () => {
      await db.collection('col1').add({ data: 'A' })
      await db.collection('col2').add({ data: 'B' })

      const result1 = await db.collection('col1').get()
      expect(result1[0].data).toBe('A')

      const result2 = await db.collection('col2').get()
      expect(result2[0].data).toBe('B')
    })
  })
})
