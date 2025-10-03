import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Ombor from '../src/ombor'

describe('Database Configuration', () => {
  let db: Ombor

  afterEach(async () => {
    if (db) {
      await db.delete()
    }
  })

  describe('Initialization', () => {
    it('should create database with given name', () => {
      db = new Ombor('test-db-init')
      expect(db.dbName).toBe('test-db-init')
    })

    it('should initialize with debug enabled by default', () => {
      db = new Ombor('test-db-debug')
      expect(db.config.debug).toBe(true)
    })

    it('should have null collection name initially', () => {
      db = new Ombor('test-db-null')
      expect(db.collectionName).toBe(null)
    })

    it('should have null orderBy properties initially', () => {
      db = new Ombor('test-db-order')
      expect(db.orderByProperty).toBe(null)
      expect(db.orderByDirection).toBe(null)
    })

    it('should have null limit initially', () => {
      db = new Ombor('test-db-limit')
      expect(db.limitBy).toBe(null)
    })

    it('should have empty userErrors array', () => {
      db = new Ombor('test-db-errors')
      expect(db.userErrors).toEqual([])
    })
  })

  describe('Multiple Database Instances', () => {
    it('should allow multiple database instances', () => {
      const db1 = new Ombor('database-1')
      const db2 = new Ombor('database-2')
      const db3 = new Ombor('database-3')

      expect(db1.dbName).toBe('database-1')
      expect(db2.dbName).toBe('database-2')
      expect(db3.dbName).toBe('database-3')
    })

    it('should maintain separate data in different database instances', async () => {
      const db1 = new Ombor('db-instance-1')
      const db2 = new Ombor('db-instance-2')

      await db1.collection('users').add({ name: 'Alice' })
      await db2.collection('users').add({ name: 'Bob' })

      const users1 = await db1.collection('users').get()
      const users2 = await db2.collection('users').get()

      expect(users1).toHaveLength(1)
      expect(users2).toHaveLength(1)
      expect(users1[0].name).toBe('Alice')
      expect(users2[0].name).toBe('Bob')

      await db1.delete()
      await db2.delete()
    })

    it('should handle concurrent operations on different databases', async () => {
      const db1 = new Ombor('concurrent-db-1')
      const db2 = new Ombor('concurrent-db-2')

      await Promise.all([
        db1.collection('data').add({ db: 1 }),
        db2.collection('data').add({ db: 2 })
      ])

      const data1 = await db1.collection('data').get()
      const data2 = await db2.collection('data').get()

      expect(data1[0].db).toBe(1)
      expect(data2[0].db).toBe(2)

      await db1.delete()
      await db2.delete()
    })
  })

  describe('Database Names', () => {
    it('should handle database names with special characters', () => {
      db = new Ombor('test-db-name')
      expect(db.dbName).toBe('test-db-name')
    })

    it('should handle database names with underscores', () => {
      db = new Ombor('test_db_name')
      expect(db.dbName).toBe('test_db_name')
    })

    it('should handle database names with dots', () => {
      db = new Ombor('test.db.name')
      expect(db.dbName).toBe('test.db.name')
    })

    it('should handle long database names', () => {
      const longName = 'very_long_database_name_that_exceeds_normal_length'
      db = new Ombor(longName)
      expect(db.dbName).toBe(longName)
    })
  })

  describe('Configuration Properties', () => {
    beforeEach(() => {
      db = new Ombor('test-config')
    })

    it('should have debug config property', () => {
      expect(db.config).toHaveProperty('debug')
      expect(typeof db.config.debug).toBe('boolean')
    })

    it('should allow reading debug config', () => {
      const isDebug = db.config.debug
      expect(typeof isDebug).toBe('boolean')
    })

    it('should maintain config state', async () => {
      const initialDebug = db.config.debug

      await db.collection('test').add({ data: 'test' })

      expect(db.config.debug).toBe(initialDebug)
    })
  })

  describe('LocalForage Integration', () => {
    beforeEach(() => {
      db = new Ombor('test-lf')
    })

    it('should have lf property for localForage instances', () => {
      expect(db.lf).toBeDefined()
      expect(typeof db.lf).toBe('object')
    })

    it('should initialize lf as empty object', () => {
      expect(Object.keys(db.lf)).toHaveLength(0)
    })
  })

  describe('Delete Queue', () => {
    beforeEach(() => {
      db = new Ombor('test-queue')
    })

    it('should have deleteCollectionQueue property', () => {
      expect(db.deleteCollectionQueue).toBeDefined()
    })

    it('should initialize queue with empty array', () => {
      expect(db.deleteCollectionQueue.queue).toEqual([])
    })

    it('should initialize queue with running false', () => {
      expect(db.deleteCollectionQueue.running).toBe(false)
    })
  })

  describe('API Methods Availability', () => {
    beforeEach(() => {
      db = new Ombor('test-api')
    })

    it('should have collection method', () => {
      expect(typeof db.collection).toBe('function')
    })

    it('should have doc method', () => {
      expect(typeof db.doc).toBe('function')
    })

    it('should have orderBy method', () => {
      expect(typeof db.orderBy).toBe('function')
    })

    it('should have limit method', () => {
      expect(typeof db.limit).toBe('function')
    })

    it('should have get method', () => {
      expect(typeof db.get).toBe('function')
    })

    it('should have add method', () => {
      expect(typeof db.add).toBe('function')
    })

    it('should have update method', () => {
      expect(typeof db.update).toBe('function')
    })

    it('should have set method', () => {
      expect(typeof db.set).toBe('function')
    })

    it('should have delete method', () => {
      expect(typeof db.delete).toBe('function')
    })
  })

  describe('State Management', () => {
    beforeEach(() => {
      db = new Ombor('test-state')
    })

    it('should update collection name when collection() is called', () => {
      db.collection('users')
      expect(db.collectionName).toBe('users')
    })

    it('should update orderBy properties when orderBy() is called', () => {
      db.orderBy('age', 'desc')
      expect(db.orderByProperty).toBe('age')
      expect(db.orderByDirection).toBe('desc')
    })

    it('should update limit when limit() is called', () => {
      db.limit(10)
      expect(db.limitBy).toBe(10)
    })

    it('should maintain state across multiple setter calls', () => {
      db.collection('users')
      db.orderBy('name', 'asc')
      db.limit(5)

      expect(db.collectionName).toBe('users')
      expect(db.orderByProperty).toBe('name')
      expect(db.orderByDirection).toBe('asc')
      expect(db.limitBy).toBe(5)
    })
  })

  describe('Instance Isolation', () => {
    it('should not share state between instances', () => {
      const db1 = new Ombor('db-isolation-1')
      const db2 = new Ombor('db-isolation-2')

      db1.collection('users')
      db2.collection('products')

      expect(db1.collectionName).toBe('users')
      expect(db2.collectionName).toBe('products')
    })

    it('should maintain independent state for filters', () => {
      const db1 = new Ombor('db-filters-1')
      const db2 = new Ombor('db-filters-2')

      db1.orderBy('age', 'asc').limit(10)
      db2.orderBy('name', 'desc').limit(5)

      expect(db1.orderByProperty).toBe('age')
      expect(db1.limitBy).toBe(10)
      expect(db2.orderByProperty).toBe('name')
      expect(db2.limitBy).toBe(5)
    })
  })
})
