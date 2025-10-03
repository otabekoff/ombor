import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Ombor from '../src/ombor'

describe('Basic Operations', () => {
  let db: Ombor

  beforeEach(async () => {
    db = new Ombor('test-basic-operations')
  })

  afterEach(async () => {
    // Clean up - delete the test database
    await db.delete()
  })

  describe('Add Operations', () => {
    it('should add a single record to a collection', async () => {
      await db.collection('users').add({
        name: 'John Doe',
        age: 30,
        email: 'john@example.com'
      })

      const users = await db.collection('users').get()
      expect(users).toHaveLength(1)
      expect(users[0].name).toBe('John Doe')
      expect(users[0].age).toBe(30)
      expect(users[0].email).toBe('john@example.com')
    })

    it('should add multiple records to a collection', async () => {
      await db.collection('users').add({ name: 'Alice', age: 25 })
      await db.collection('users').add({ name: 'Bob', age: 30 })
      await db.collection('users').add({ name: 'Charlie', age: 35 })

      const users = await db.collection('users').get()
      expect(users).toHaveLength(3)
    })

    it('should add records with different data types', async () => {
      await db.collection('mixed').add({
        string: 'text',
        number: 123,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
        null_value: null,
        date: new Date().toISOString()
      })

      const records = await db.collection('mixed').get()
      expect(records).toHaveLength(1)
      expect(records[0].string).toBe('text')
      expect(records[0].number).toBe(123)
      expect(records[0].boolean).toBe(true)
      expect(records[0].array).toEqual([1, 2, 3])
      expect(records[0].object).toEqual({ nested: 'value' })
      expect(records[0].null_value).toBe(null)
    })

    it('should add records with nested objects', async () => {
      await db.collection('profiles').add({
        name: 'User',
        profile: {
          bio: 'Developer',
          social: {
            twitter: '@user',
            github: 'user'
          }
        }
      })

      const profiles = await db.collection('profiles').get()
      expect(profiles[0].profile.social.twitter).toBe('@user')
    })

    it('should add records with arrays', async () => {
      await db.collection('tags').add({
        title: 'Post',
        tags: ['javascript', 'typescript', 'react'],
        scores: [85, 90, 95]
      })

      const posts = await db.collection('tags').get()
      expect(posts[0].tags).toHaveLength(3)
      expect(posts[0].scores).toEqual([85, 90, 95])
    })
  })

  describe('Get Operations', () => {
    beforeEach(async () => {
      // Seed data
      await db.collection('users').add({ name: 'Alice', age: 25, city: 'NY' })
      await db.collection('users').add({ name: 'Bob', age: 30, city: 'LA' })
      await db.collection('users').add({ name: 'Charlie', age: 35, city: 'SF' })
    })

    it('should get all records from a collection', async () => {
      const users = await db.collection('users').get()
      expect(users).toHaveLength(3)
    })

    it('should get a specific record by criteria', async () => {
      const user = await db.collection('users').doc({ name: 'Bob' }).get()
      expect(user.name).toBe('Bob')
      expect(user.age).toBe(30)
    })

    it('should get a record by multiple criteria', async () => {
      const user = await db.collection('users').doc({ name: 'Alice', age: 25 }).get()
      expect(user.name).toBe('Alice')
      expect(user.city).toBe('NY')
    })

    it('should return empty array for empty collection', async () => {
      const empty = await db.collection('empty').get()
      expect(empty).toEqual([])
    })

    it('should handle getting non-existent record', async () => {
      const user = await db.collection('users').doc({ name: 'NonExistent' }).get()
      expect(user).toBeUndefined()
    })
  })

  describe('Update Operations', () => {
    beforeEach(async () => {
      await db.collection('users').add({ name: 'Alice', age: 25, city: 'NY' })
      await db.collection('users').add({ name: 'Bob', age: 30, city: 'LA' })
    })

    it('should update a single field', async () => {
      await db.collection('users').doc({ name: 'Alice' }).update({ age: 26 })

      const user = await db.collection('users').doc({ name: 'Alice' }).get()
      expect(user.age).toBe(26)
      expect(user.city).toBe('NY') // other fields unchanged
    })

    it('should update multiple fields', async () => {
      await db.collection('users').doc({ name: 'Bob' }).update({
        age: 31,
        city: 'SF'
      })

      const user = await db.collection('users').doc({ name: 'Bob' }).get()
      expect(user.age).toBe(31)
      expect(user.city).toBe('SF')
    })

    it('should add new fields during update', async () => {
      await db.collection('users').doc({ name: 'Alice' }).update({
        email: 'alice@example.com',
        verified: true
      })

      const user = await db.collection('users').doc({ name: 'Alice' }).get()
      expect(user.email).toBe('alice@example.com')
      expect(user.verified).toBe(true)
    })

    it('should update nested objects', async () => {
      await db.collection('profiles').add({
        name: 'User',
        settings: { theme: 'dark', notifications: true }
      })

      await db.collection('profiles').doc({ name: 'User' }).update({
        settings: { theme: 'light', notifications: false }
      })

      const profile = await db.collection('profiles').doc({ name: 'User' }).get()
      expect(profile.settings.theme).toBe('light')
    })
  })

  describe('Set Operations', () => {
    beforeEach(async () => {
      await db.collection('users').add({
        name: 'Alice',
        age: 25,
        city: 'NY',
        email: 'alice@old.com'
      })
    })

    it('should replace entire document', async () => {
      await db.collection('users').doc({ name: 'Alice' }).set({
        name: 'Alice',
        age: 26,
        country: 'USA'
      })

      const user = await db.collection('users').doc({ name: 'Alice' }).get()
      expect(user.age).toBe(26)
      expect(user.country).toBe('USA')
      expect(user.city).toBeUndefined() // old field removed
      expect(user.email).toBeUndefined() // old field removed
    })

    it('should set new document structure', async () => {
      await db.collection('users').doc({ name: 'Alice' }).set({
        name: 'Alice',
        profile: {
          bio: 'Developer',
          skills: ['js', 'ts']
        }
      })

      const user = await db.collection('users').doc({ name: 'Alice' }).get()
      expect(user.profile.bio).toBe('Developer')
      expect(user.age).toBeUndefined()
    })
  })

  describe('Delete Operations', () => {
    beforeEach(async () => {
      await db.collection('users').add({ name: 'Alice', age: 25 })
      await db.collection('users').add({ name: 'Bob', age: 30 })
      await db.collection('users').add({ name: 'Charlie', age: 35 })
    })

    it('should delete a single document', async () => {
      await db.collection('users').doc({ name: 'Bob' }).delete()

      const users = await db.collection('users').get()
      expect(users).toHaveLength(2)

      const bob = await db.collection('users').doc({ name: 'Bob' }).get()
      expect(bob).toBeUndefined()
    })

    it('should delete by multiple criteria', async () => {
      await db.collection('users').doc({ name: 'Alice', age: 25 }).delete()

      const users = await db.collection('users').get()
      expect(users).toHaveLength(2)
    })

    it('should delete entire collection', async () => {
      await db.collection('users').delete()

      const users = await db.collection('users').get()
      expect(users).toEqual([])
    })

    it('should delete database', async () => {
      await db.collection('users').add({ name: 'Test' })
      await db.collection('products').add({ name: 'Product' })

      await db.delete()

      const users = await db.collection('users').get()
      const products = await db.collection('products').get()
      expect(users).toEqual([])
      expect(products).toEqual([])
    })

    it('should handle deleting non-existent document', async () => {
      await db.collection('users').doc({ name: 'NonExistent' }).delete()

      const users = await db.collection('users').get()
      expect(users).toHaveLength(3) // no change
    })
  })
})
