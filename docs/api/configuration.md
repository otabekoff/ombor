# Konfiguratsiya

Ombor bir nechta konfiguratsiya parametrlarini qo'llab-quvvatlaydi.

## Constructor parametrlari

### Database nomi

```javascript
// Oddiy
const db = new Ombor('mening-db')

// Turli database nomlari
const userDb = new Ombor('users-db')
const productsDb = new Ombor('products-db')
const cacheDb = new Ombor('cache-db')
```

### Konfiguratsiya obyekti

```javascript
const db = new Ombor('mydb', {
  debug: true  // Console loglarni yoqish
})
```

## debug rejimi

Debug rejimi console loglarni nazorat qiladi.

### Yoqish

```javascript
const db = new Ombor('mydb')
db.config.debug = true  // Loglarni yoqish
```

### O'chirish

```javascript
const db = new Ombor('mydb')
db.config.debug = false  // Loglarni o'chirish
```

### Development va Production

```javascript
// Development
if (process.env.NODE_ENV === 'development') {
  db.config.debug = true
}

// Production
if (process.env.NODE_ENV === 'production') {
  db.config.debug = false
}

// Yoki qisqaroq
db.config.debug = process.env.NODE_ENV === 'development'
```

### Loglar misoli

Debug yoqilganda quyidagi loglar ko'rsatiladi:

```javascript
db.config.debug = true

await db.collection('users').add({ id: 1, name: 'John' })
// Console:
// ✅ Added document to users collection
// { id: 1, name: 'John' }

await db.collection('users').doc({ id: 1 }).get()
// Console:
// 📖 Retrieved document from users collection
// { id: 1, name: 'John' }

await db.collection('users').doc({ id: 1 }).update({ name: 'Jane' })
// Console:
// 🔄 Updated document in users collection
// { id: 1, name: 'Jane' }

await db.collection('users').doc({ id: 1 }).delete()
// Console:
// 🗑️ Deleted document from users collection
```

## LocalForage konfiguratsiyasi

Ombor LocalForage ustida qurilgan. Agar kerak bo'lsa, to'g'ridan-to'g'ri LocalForage konfiguratsiyasini o'zgartirishingiz mumkin:

```javascript
import localforage from 'localforage'

// Driver ni o'zgartirish
localforage.config({
  driver: localforage.INDEXEDDB, // INDEXEDDB, WEBSQL, yoki LOCALSTORAGE
  name: 'myAppDatabase',
  version: 1.0,
  size: 4980736, // Size in bytes
  storeName: 'keyvaluepairs',
  description: 'My app database'
})

// Keyin Omborni ishlatish
const db = new Ombor('mydb')
```

## Ko'p database bilan ishlash

```javascript
// Har xil maqsadlar uchun alohida databaselar
const userDb = new Ombor('users')
const productDb = new Ombor('products')
const cacheDb = new Ombor('cache')

// User ma'lumotlari
await userDb.collection('profiles').add({ id: 1, name: 'John' })

// Mahsulot ma'lumotlari
await productDb.collection('items').add({ id: 1, title: 'Laptop' })

// Vaqtinchalik cache
await cacheDb.collection('api-responses').add({ 
  url: '/api/users',
  data: {...},
  timestamp: Date.now()
})
```

## Environment o'zgaruvchilari

### .env fayl

```txt
VITE_DB_NAME=myapp
VITE_DB_DEBUG=true
```

### Kod

```javascript
const db = new Ombor(import.meta.env.VITE_DB_NAME)
db.config.debug = import.meta.env.VITE_DB_DEBUG === 'true'
```

### Turli environmentlar

```txt
# .env.development
VITE_DB_NAME=myapp-dev
VITE_DB_DEBUG=true

# .env.production
VITE_DB_NAME=myapp
VITE_DB_DEBUG=false

# .env.test
VITE_DB_NAME=myapp-test
VITE_DB_DEBUG=true
```

## Best Practices

### 1. Singleton pattern

```javascript
// db.js
import Ombor from 'ombor'

let instance = null

export function getDatabase() {
  if (!instance) {
    instance = new Ombor('myapp')
    instance.config.debug = import.meta.env.DEV
  }
  return instance
}

// Ishlatish
import { getDatabase } from './db'

const db = getDatabase()
await db.collection('users').get()
```

### 2. Composable (Vue 3)

```javascript
// composables/useDatabase.js
import { ref } from 'vue'
import Ombor from 'ombor'

let db = null

export function useDatabase() {
  if (!db) {
    db = new Ombor('myapp')
    db.config.debug = import.meta.env.DEV
  }

  return {
    db,
    collection: (name) => db.collection(name)
  }
}

// Ishlatish
import { useDatabase } from '@/composables/useDatabase'

const { db, collection } = useDatabase()
const users = await collection('users').get()
```

### 3. Service layer

```javascript
// services/DatabaseService.js
import Ombor from 'ombor'

class DatabaseService {
  constructor() {
    this.db = new Ombor(import.meta.env.VITE_DB_NAME || 'myapp')
    this.db.config.debug = import.meta.env.DEV
  }

  collection(name) {
    return this.db.collection(name)
  }

  async clear() {
    return this.db.delete()
  }

  async getSize() {
    // Barcha collectionlar hajmini hisoblash
    const collections = ['users', 'products', 'posts']
    let total = 0
    
    for (const name of collections) {
      const items = await this.collection(name).get()
      total += items.length
    }
    
    return total
  }
}

export default new DatabaseService()

// Ishlatish
import db from '@/services/DatabaseService'

const users = await db.collection('users').get()
const size = await db.getSize()
```

### 4. TypeScript konfiguratsiyasi

```typescript
// db.config.ts
import Ombor from 'ombor'

interface DbConfig {
  name: string
  debug: boolean
}

export const dbConfig: DbConfig = {
  name: import.meta.env.VITE_DB_NAME || 'myapp',
  debug: import.meta.env.DEV
}

export function createDatabase() {
  const db = new Ombor(dbConfig.name)
  db.config.debug = dbConfig.debug
  return db
}

// Ishlatish
import { createDatabase } from './db.config'

const db = createDatabase()
```

## Xotira boshqaruvi

### Eski ma'lumotlarni tozalash

```javascript
// Cache tozalash (1 kundan eski)
async function cleanOldCache() {
  const db = new Ombor('cache')
  const items = await db.collection('data').get({ keys: true })
  
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  
  for (const item of items) {
    if (item.data.timestamp < oneDayAgo) {
      await db.collection('data').doc(item.key).delete()
    }
  }
}

// Har kuni tekshirish
setInterval(cleanOldCache, 24 * 60 * 60 * 1000)
```

### Database hajmini tekshirish

```javascript
async function getDatabaseSize() {
  if ('estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    const usage = estimate.usage
    const quota = estimate.quota
    const percentUsed = (usage / quota * 100).toFixed(2)
    
    console.log(`Ishlatilgan: ${usage} bytes (${percentUsed}%)`)
    console.log(`Umumiy: ${quota} bytes`)
    
    return { usage, quota, percentUsed }
  }
}

// Tekshirish
const size = await getDatabaseSize()
```

## Xavfsizlik

### Sensitive ma'lumotlarni shifrlash

```javascript
// ⚠️ Oddiy misol - production uchun yaxshiroq shifrlash kerak
class SecureDatabase {
  constructor(dbName, encryptionKey) {
    this.db = new Ombor(dbName)
    this.key = encryptionKey
  }

  encrypt(data) {
    // Bu yerda haqiqiy shifrlash kerak
    return btoa(JSON.stringify(data))
  }

  decrypt(encrypted) {
    return JSON.parse(atob(encrypted))
  }

  async addSecure(collection, data) {
    const encrypted = this.encrypt(data)
    return await this.db.collection(collection).add({ 
      encrypted,
      _encrypted: true 
    })
  }

  async getSecure(collection) {
    const items = await this.db.collection(collection).get()
    return items
      .filter(item => item._encrypted)
      .map(item => this.decrypt(item.encrypted))
  }
}

// Ishlatish
const secureDb = new SecureDatabase('myapp', 'my-secret-key')
await secureDb.addSecure('passwords', { 
  site: 'example.com',
  password: 'secret123'
})
```
