# Best Practices

Ombordan samarali foydalanish uchun eng yaxshi amaliyotlar.

## Database tashkil etish

### ✅ Yaxshi: Har bir maqsad uchun alohida database

```javascript
const userDb = new Ombor('users')
const productsDb = new Ombor('products')
const cacheDb = new Ombor('cache')
```

### ❌ Yomon: Hamma narsa bitta databaseda

```javascript
const db = new Ombor('everything')
// ❌ Bir databaseda users, products, cache, settings...
```

## Collection nomlari

### ✅ Yaxshi: Ko'plik, lowercase

```javascript
db.collection('users')
db.collection('products')
db.collection('posts')
db.collection('comments')
```

### ❌ Yomon: Birlik, CamelCase, maxsus belgilar

```javascript
db.collection('User')        // ❌ Birlik va bosh harf
db.collection('UserProfiles')  // ❌ CamelCase
db.collection('user-data')     // ⚠️ Tire ishlatmaslik yaxshi
```

## Document struktura

### ✅ Yaxshi: Flat structure, consistent fields

```javascript
{
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-15T12:30:00.000Z'
}
```

### ❌ Yomon: Deeply nested, inconsistent

```javascript
{
  userId: 1,  // ❌ Inconsistent naming
  user: {     // ❌ Ortiqcha nesting
    data: {
      info: {
        personal: {
          name: 'John'
        }
      }
    }
  },
  created: new Date()  // ❌ Date object o'rniga ISO string
}
```

## ID maydonlari

### ✅ Yaxshi: Unique, consistent

```javascript
// Timestamp
{ id: Date.now() }

// Auto-increment (agar kerak bo'lsa)
{ id: await getNextId() }

// UUID
{ id: crypto.randomUUID() }
```

### ❌ Yomon: Non-unique, inconsistent

```javascript
{ id: Math.random() }  // ❌ Collision bo'lishi mumkin
{ userId: 1, id: 'abc' }  // ❌ Multiple ID fields
```

## Timestamps

### ✅ Yaxshi: ISO 8601 format

```javascript
{
  id: 1,
  name: 'Item',
  createdAt: new Date().toISOString(),  // ✅
  updatedAt: new Date().toISOString()   // ✅
}

// Yoki Unix timestamp (ms)
{
  id: 1,
  createdAt: Date.now(),  // ✅
  updatedAt: Date.now()   // ✅
}
```

### ❌ Yomon: Date objects

```javascript
{
  id: 1,
  createdAt: new Date()  // ❌ Saqlanmaydi to'g'ri
}
```

## Error handling

### ✅ Yaxshi: Try-catch, default values

```javascript
async function getUser(id) {
  try {
    return await db.collection('users').doc({ id }).get()
  } catch (error) {
    console.error('User topilmadi:', error)
    return null
  }
}

// Default value bilan
async function getUserEmail(id) {
  const user = await getUser(id)
  return user?.email || 'unknown@example.com'
}
```

### ❌ Yomon: No error handling

```javascript
async function getUser(id) {
  return await db.collection('users').doc({ id }).get()
  // ❌ Topilmasa crash bo'ladi
}
```

## Performance

### ✅ Yaxshi: limit() dan foydalanish

```javascript
// Faqat kerakli miqdorda
const recent = await db.collection('posts')
  .orderBy('date', 'desc')
  .limit(10)  // ✅
  .get()

// Pagination
async function getPage(pageNumber, pageSize = 20) {
  const all = await db.collection('items').orderBy('id').get()
  const start = (pageNumber - 1) * pageSize
  return all.slice(start, start + pageSize)
}
```

### ❌ Yomon: Hammani olish

```javascript
const posts = await db.collection('posts').get()  // ❌ 10000 items?
const recent = posts.slice(0, 10)  // ❌ Ortiqcha yuklanish
```

## Updates

### ✅ Yaxshi: Faqat kerakli maydonlar

```javascript
// update() - qisman yangilash
await db.collection('users')
  .doc({ id: 1 })
  .update({
    email: 'new@example.com',  // ✅ Faqat email
    updatedAt: Date.now()
  })
```

### ❌ Yomon: Butun documentni qayta yozish

```javascript
const user = await db.collection('users').doc({ id: 1 }).get()
user.email = 'new@example.com'

// ❌ set() bilan butun document qayta yoziladi
await db.collection('users').doc({ id: 1 }).set(user)
```

## Validation

### ✅ Yaxshi: Data validatsiyasi

```javascript
class UserService {
  validate(userData) {
    if (!userData.email) throw new Error('Email kerak')
    if (!userData.name) throw new Error('Name kerak')
    if (userData.age && userData.age < 0) {
      throw new Error('Age musbat bo\'lishi kerak')
    }
    return true
  }

  async create(userData) {
    this.validate(userData)
    return await db.collection('users').add(userData)
  }
}
```

### ❌ Yomon: Validation yo'q

```javascript
// ❌ Hech qanday tekshiruv yo'q
await db.collection('users').add(userData)
```

## Code Organization

### ✅ Yaxshi: Service layer

```javascript
// services/UserService.js
export class UserService {
  constructor() {
    this.db = new Ombor('myapp')
    this.collection = 'users'
  }

  async create(data) { /* ... */ }
  async get(id) { /* ... */ }
  async update(id, data) { /* ... */ }
  async delete(id) { /* ... */ }
}

// Ishlatish
import { UserService } from './services/UserService'
const userService = new UserService()
await userService.create(userData)
```

### ❌ Yomon: Hamma joyda to'g'ridan-to'g'ri

```javascript
// Component1.vue
await new Ombor('myapp').collection('users').add(data)

// Component2.vue
await new Ombor('myapp').collection('users').get()

// ❌ Kod takrorlanadi, boshqarish qiyin
```

## Caching

### ✅ Yaxshi: TTL bilan cache

```javascript
class CachedService {
  constructor(ttl = 60000) {
    this.cache = new Map()
    this.ttl = ttl
  }

  async getUsers() {
    const cached = this.cache.get('users')
    
    if (cached && Date.now() - cached.time < this.ttl) {
      return cached.data  // ✅ Cache dan
    }

    // Database dan
    const users = await db.collection('users').get()
    this.cache.set('users', {
      data: users,
      time: Date.now()
    })
    
    return users
  }
}
```

### ❌ Yomon: Har safar database dan

```javascript
async function getUsers() {
  return await db.collection('users').get()
  // ❌ Har safar database dan, sekin
}
```

## TypeScript

### ✅ Yaxshi: Type safety

```typescript
interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

const db = new Ombor('myapp')

// Type-safe
const users = await db.collection('users').get<User>()
users.forEach(user => {
  console.log(user.name)  // ✅ Type checked
})
```

### ❌ Yomon: any types

```typescript
const users = await db.collection('users').get()
// ❌ users: any[]
```

## Cleanup

### ✅ Yaxshi: Eski ma'lumotlarni tozalash

```javascript
class CleanupService {
  constructor() {
    this.db = new Ombor('cache')
  }

  async cleanOldCache(maxAge = 24 * 60 * 60 * 1000) {
    const items = await this.db.collection('data').get({ keys: true })
    const now = Date.now()
    
    for (const item of items) {
      if (now - item.data.timestamp > maxAge) {
        await this.db.collection('data').doc(item.key).delete()
      }
    }
  }

  // Har kuni tozalash
  startAutoCleanup() {
    setInterval(() => this.cleanOldCache(), 24 * 60 * 60 * 1000)
  }
}
```

### ❌ Yomon: Cleanup yo'q

```javascript
// ❌ Ma'lumotlar to'planib boradi, xotira to'lib ketadi
```

## Debug rejimi

### ✅ Yaxshi: Environment based

```javascript
const db = new Ombor('myapp')
db.config.debug = import.meta.env.DEV  // ✅ Faqat dev da

// Yoki
db.config.debug = process.env.NODE_ENV === 'development'
```

### ❌ Yomon: Har doim yoqiq

```javascript
const db = new Ombor('myapp')
db.config.debug = true  // ❌ Production da ham loglar
```

## Testing

### ✅ Yaxshi: Mock database

```javascript
// __tests__/UserService.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import Ombor from 'ombor'

describe('UserService', () => {
  let db
  
  beforeEach(async () => {
    db = new Ombor('test-db')
    await db.collection('users').delete()  // ✅ Har test oldidan tozalash
  })

  it('should create user', async () => {
    await db.collection('users').add({ id: 1, name: 'Test' })
    const users = await db.collection('users').get()
    expect(users).toHaveLength(1)
  })
})
```

### ❌ Yomon: Production database da test

```javascript
// ❌ Haqiqiy databaseni buzish xavfi
const db = new Ombor('production-db')
```

## Naming Conventions

```javascript
// Collections: ko'plik, lowercase
'users', 'products', 'orders'

// Variables: camelCase
const userService = new UserService()
const currentUser = await getUser()

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 100
const DEFAULT_LIMIT = 20

// Classes: PascalCase
class UserService {}
class ProductManager {}

// Keys: kebab-case yoki snake_case
'user-123', 'product-abc'
'user_123', 'product_abc'
```

## Summary

| Amaliyot | ✅ Yaxshi | ❌ Yomon |
|----------|----------|----------|
| Database | Har maqsad uchun alohida | Hammasi bitta db da |
| Collections | Ko'plik, lowercase | Birlik, CamelCase |
| IDs | Unique, consistent | Random, inconsistent |
| Timestamps | ISO string yoki Unix ms | Date objects |
| Errors | Try-catch, defaults | Handling yo'q |
| Performance | limit() dan foydalanish | Hammani yuklash |
| Updates | update() qisman | set() butun doc |
| Code | Service layer | Hamma joyda inline |
| Debug | Env based | Har doim yoqiq |
| Testing | Mock db | Production db |
