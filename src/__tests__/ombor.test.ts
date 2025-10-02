import { describe, it, expect, beforeEach } from 'vitest'
import Ombor from '../ombor'

describe('Ombor', () => {
  let db: Ombor

  beforeEach(() => {
    db = new Ombor('test-db')
  })

  it('should create a new database instance', () => {
    expect(db).toBeInstanceOf(Ombor)
    expect(db.dbName).toBe('test-db')
  })

  it('should have a collection method', () => {
    expect(typeof db.collection).toBe('function')
  })

  it('should have a doc method', () => {
    expect(typeof db.doc).toBe('function')
  })

  it('should have an orderBy method', () => {
    expect(typeof db.orderBy).toBe('function')
  })

  it('should have a limit method', () => {
    expect(typeof db.limit).toBe('function')
  })

  it('should have a get method', () => {
    expect(typeof db.get).toBe('function')
  })

  it('should have an add method', () => {
    expect(typeof db.add).toBe('function')
  })

  it('should have an update method', () => {
    expect(typeof db.update).toBe('function')
  })

  it('should have a set method', () => {
    expect(typeof db.set).toBe('function')
  })

  it('should have a delete method', () => {
    expect(typeof db.delete).toBe('function')
  })

  it('should initialize with debug enabled', () => {
    expect(db.config.debug).toBe(true)
  })

  it('should initialize with null collection name', () => {
    expect(db.collectionName).toBe(null)
  })

  it('should initialize with null order by property', () => {
    expect(db.orderByProperty).toBe(null)
  })

  it('should initialize with null limit', () => {
    expect(db.limitBy).toBe(null)
  })

  it('should initialize with empty user errors array', () => {
    expect(db.userErrors).toEqual([])
  })

  it('should set collection name when collection() is called', () => {
    const result = db.collection('users')
    expect(db.collectionName).toBe('users')
    expect(result).toBe(db) // should return this for chaining
  })

  it('should set orderBy properties when orderBy() is called', () => {
    db.orderBy('age', 'desc')
    expect(db.orderByProperty).toBe('age')
    expect(db.orderByDirection).toBe('desc')
  })

  it('should set limit when limit() is called', () => {
    db.limit(10)
    expect(db.limitBy).toBe(10)
  })

  it('should support method chaining', () => {
    const result = db.collection('users').orderBy('name').limit(5)
    expect(result).toBe(db)
    expect(db.collectionName).toBe('users')
    expect(db.orderByProperty).toBe('name')
    expect(db.limitBy).toBe(5)
  })
})
