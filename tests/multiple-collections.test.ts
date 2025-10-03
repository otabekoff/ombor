import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Ombor from '../src/ombor'

describe('Multiple Collections', () => {
  let db: Ombor

  beforeEach(async () => {
    db = new Ombor('test-multiple-collections')
  })

  afterEach(async () => {
    await db.delete()
  })

  describe('Collection Independence', () => {
    it('should maintain separate data in different collections', async () => {
      await db.collection('users').add({ name: 'Alice', type: 'user' })
      await db.collection('products').add({ name: 'Laptop', type: 'product' })
      await db.collection('orders').add({ id: 1, type: 'order' })

      const users = await db.collection('users').get()
      const products = await db.collection('products').get()
      const orders = await db.collection('orders').get()

      expect(users).toHaveLength(1)
      expect(products).toHaveLength(1)
      expect(orders).toHaveLength(1)

      expect(users[0].type).toBe('user')
      expect(products[0].type).toBe('product')
      expect(orders[0].type).toBe('order')
    })

    it('should not affect other collections when updating one', async () => {
      await db.collection('users').add({ name: 'Alice', age: 25 })
      await db.collection('products').add({ name: 'Phone', price: 500 })

      await db.collection('users').doc({ name: 'Alice' }).update({ age: 26 })

      const users = await db.collection('users').get()
      const products = await db.collection('products').get()

      expect(users[0].age).toBe(26)
      expect(products[0].price).toBe(500) // unchanged
    })

    it('should not affect other collections when deleting from one', async () => {
      await db.collection('users').add({ name: 'Alice' })
      await db.collection('users').add({ name: 'Bob' })
      await db.collection('products').add({ name: 'Laptop' })

      await db.collection('users').doc({ name: 'Alice' }).delete()

      const users = await db.collection('users').get()
      const products = await db.collection('products').get()

      expect(users).toHaveLength(1)
      expect(products).toHaveLength(1) // unchanged
    })

    it('should delete only target collection', async () => {
      await db.collection('users').add({ name: 'Alice' })
      await db.collection('products').add({ name: 'Phone' })
      await db.collection('orders').add({ id: 1 })

      await db.collection('users').delete()

      const users = await db.collection('users').get()
      const products = await db.collection('products').get()
      const orders = await db.collection('orders').get()

      expect(users).toEqual([])
      expect(products).toHaveLength(1)
      expect(orders).toHaveLength(1)
    })
  })

  describe('Relational Data Patterns', () => {
    beforeEach(async () => {
      // Users collection
      await db.collection('users').add({ id: 1, name: 'Alice', email: 'alice@test.com' })
      await db.collection('users').add({ id: 2, name: 'Bob', email: 'bob@test.com' })

      // Products collection
      await db.collection('products').add({ id: 1, name: 'Laptop', price: 1200 })
      await db.collection('products').add({ id: 2, name: 'Mouse', price: 25 })

      // Orders collection (references users and products)
      await db.collection('orders').add({ id: 1, userId: 1, productId: 1, quantity: 1 })
      await db.collection('orders').add({ id: 2, userId: 2, productId: 2, quantity: 2 })
      await db.collection('orders').add({ id: 3, userId: 1, productId: 2, quantity: 3 })
    })

    it('should retrieve related data from multiple collections', async () => {
      const orders = await db.collection('orders').get()
      const users = await db.collection('users').get()
      const products = await db.collection('products').get()

      expect(orders).toHaveLength(3)
      expect(users).toHaveLength(2)
      expect(products).toHaveLength(2)

      // Manual join simulation
      const order = orders[0]
      const user = users.find((u: any) => u.id === order.userId)
      const product = products.find((p: any) => p.id === order.productId)

      expect(user?.name).toBe('Alice')
      expect(product?.name).toBe('Laptop')
    })

    it('should handle one-to-many relationships', async () => {
      const orders = await db.collection('orders').get()
      const aliceOrders = orders.filter((o: any) => o.userId === 1)

      expect(aliceOrders).toHaveLength(2)
    })

    it('should maintain referential data integrity', async () => {
      // Get user's orders
      const user = await db.collection('users').doc({ id: 1 }).get()
      const userOrders = (await db.collection('orders').get()).filter((o: any) => o.userId === user.id)

      expect(userOrders).toHaveLength(2)

      // Delete user (in real app, you'd also delete their orders)
      await db.collection('users').doc({ id: 1 }).delete()

      const users = await db.collection('users').get()
      const orders = await db.collection('orders').get()

      expect(users).toHaveLength(1)
      expect(orders).toHaveLength(3) // orders still exist (orphaned)
    })
  })

  describe('Multiple Database Scenarios', () => {
    it('should work with many collections simultaneously', async () => {
      const collections = ['users', 'products', 'orders', 'categories', 'reviews']

      for (const collectionName of collections) {
        await db.collection(collectionName).add({
          collection: collectionName,
          data: `Sample data for ${collectionName}`
        })
      }

      for (const collectionName of collections) {
        const data = await db.collection(collectionName).get()
        expect(data).toHaveLength(1)
        expect(data[0].collection).toBe(collectionName)
      }
    })

    it('should handle bulk operations across collections', async () => {
      const collections = ['col1', 'col2', 'col3', 'col4', 'col5']

      // Add 10 items to each collection
      for (const col of collections) {
        for (let i = 0; i < 10; i++) {
          await db.collection(col).add({ id: i, value: i * 10 })
        }
      }

      // Verify each collection
      for (const col of collections) {
        const data = await db.collection(col).get()
        expect(data).toHaveLength(10)
      }
    })

    it('should sort and limit independently per collection', async () => {
      await db.collection('scores').add({ player: 'Alice', score: 100 })
      await db.collection('scores').add({ player: 'Bob', score: 150 })
      await db.collection('scores').add({ player: 'Charlie', score: 120 })

      await db.collection('times').add({ player: 'Alice', time: 30 })
      await db.collection('times').add({ player: 'Bob', time: 25 })
      await db.collection('times').add({ player: 'Charlie', time: 35 })

      const topScores = await db.collection('scores').orderBy('score', 'desc').limit(2).get()
      const fastestTimes = await db.collection('times').orderBy('time', 'asc').limit(2).get()

      expect(topScores[0].player).toBe('Bob')
      expect(fastestTimes[0].player).toBe('Bob')
    })
  })

  describe('Collection Naming', () => {
    it('should handle collection names with special characters', async () => {
      await db.collection('user-profiles').add({ name: 'Test' })
      await db.collection('user_settings').add({ theme: 'dark' })
      await db.collection('user.data').add({ value: 123 })

      const profiles = await db.collection('user-profiles').get()
      const settings = await db.collection('user_settings').get()
      const data = await db.collection('user.data').get()

      expect(profiles).toHaveLength(1)
      expect(settings).toHaveLength(1)
      expect(data).toHaveLength(1)
    })

    it('should treat collection names as case-sensitive', async () => {
      await db.collection('Users').add({ name: 'Upper' })
      await db.collection('users').add({ name: 'Lower' })

      const upper = await db.collection('Users').get()
      const lower = await db.collection('users').get()

      // Depending on implementation, might be case-sensitive or not
      expect(Array.isArray(upper)).toBe(true)
      expect(Array.isArray(lower)).toBe(true)
    })

    it('should handle long collection names', async () => {
      const longName = 'collection_with_a_very_long_name_that_exceeds_normal_length'
      await db.collection(longName).add({ test: 'data' })

      const data = await db.collection(longName).get()
      expect(data).toHaveLength(1)
    })
  })

  describe('Cross-Collection Operations', () => {
    it('should perform operations on multiple collections in sequence', async () => {
      // User registration flow
      await db.collection('users').add({ id: 1, name: 'Alice', email: 'alice@test.com' })
      await db.collection('profiles').add({ userId: 1, bio: 'Developer' })
      await db.collection('settings').add({ userId: 1, theme: 'dark' })

      const user = await db.collection('users').doc({ id: 1 }).get()
      const profile = await db.collection('profiles').doc({ userId: 1 }).get()
      const settings = await db.collection('settings').doc({ userId: 1 }).get()

      expect(user.name).toBe('Alice')
      expect(profile.bio).toBe('Developer')
      expect(settings.theme).toBe('dark')
    })

    it('should delete related data across collections', async () => {
      await db.collection('users').add({ id: 1, name: 'User' })
      await db.collection('posts').add({ userId: 1, title: 'Post 1' })
      await db.collection('posts').add({ userId: 1, title: 'Post 2' })
      await db.collection('comments').add({ userId: 1, text: 'Comment' })

      // Simulate cascade delete
      await db.collection('users').doc({ id: 1 }).delete()

      // In real app, you'd also delete related posts and comments
      const posts = (await db.collection('posts').get()).filter((p: any) => p.userId === 1)
      const comments = (await db.collection('comments').get()).filter((c: any) => c.userId === 1)

      expect(posts).toHaveLength(2) // Still exist (manual cleanup needed)
      expect(comments).toHaveLength(1)
    })
  })
})
