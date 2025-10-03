# Kalitlar bilan ishlash

Omborning eng kuchli xususiyatlaridan biri - IndexedDB kalitlarini to'liq nazorat qilish imkoniyati.

## Key nima?

Har bir document IndexedDB da unique **key** bilan saqlanadi:

```
Key: "auto-generated-uuid-123"
Value: { id: 1, ism: 'Otabek', yosh: 19 }
```

## Avtomatik keylar

Odatiy holda, Ombor har bir document uchun avtomatik key yaratadi:

```javascript
await db.collection('users').add({
  id: 1,
  ism: 'Otabek',
  yosh: 19
})

// IndexedDB da:
// Key: "01HMFD2X3K5T6W7Y8Z9A0B1C2D"  (avtomatik)
// Value: { id: 1, ism: 'Otabek', yosh: 19 }
```

## O'z keyingizni kiritish

### add() metodi bilan

```javascript
// 2-parametr - key
await db.collection('users').add({
  id: 1,
  ism: 'Otabek',
  yosh: 19
}, 'user-1')  // ← O'z keyingiz

// IndexedDB da:
// Key: "user-1"
// Value: { id: 1, ism: 'Otabek', yosh: 19 }
```

### doc().set() metodi bilan

```javascript
// doc() ichida key, set() ichida ma'lumot
await db.collection('users')
  .doc('user-1')  // ← Key
  .set({
    id: 1,
    ism: 'Otabek',
    yosh: 19
  })

// IndexedDB da:
// Key: "user-1"
// Value: { id: 1, ism: 'Otabek', yosh: 19 }
```

## Key turlari

### String keylar

```javascript
// User IDlari
await db.collection('users').add(userData, 'user-123')
await db.collection('users').add(userData, 'admin-1')

// Email
await db.collection('users').add(userData, 'user@example.com')

// UUID
await db.collection('users').add(userData, '550e8400-e29b-41d4-a716-446655440000')
```

### Number keylar

```javascript
// Integer keylar
await db.collection('users').add(userData, 1)
await db.collection('users').add(userData, 2)
await db.collection('users').add(userData, 999)

// Timestamp keylar
await db.collection('events').add(eventData, Date.now())
```

## Key bilan operatsiyalar

### Olish (get)

```javascript
// Key bilan document olish
const user = await db.collection('users')
  .doc('user-1')
  .get()

// Number key bilan
const item = await db.collection('items')
  .doc(123)
  .get()
```

### Yangilash (update)

```javascript
// Key bilan yangilash
await db.collection('users')
  .doc('user-1')
  .update({
    email: 'newemail@example.com'
  })

// Number key bilan
await db.collection('items')
  .doc(123)
  .update({
    price: 1500
  })
```

### O'rnatish (set)

```javascript
// Key bilan qayta yozish
await db.collection('users')
  .doc('user-1')
  .set({
    id: 1,
    ism: 'Yangi ism',
    email: 'new@example.com'
  })
```

### O'chirish (delete)

```javascript
// Key bilan o'chirish
await db.collection('users')
  .doc('user-1')
  .delete()

// Number key bilan
await db.collection('items')
  .doc(123)
  .delete()
```

## Collection bilan keylar

### Keylar bilan set()

```javascript
// Har bir document uchun _key maydoni
await db.collection('users').set([
  {
    id: 1,
    ism: 'Otabek',
    yosh: 19,
    _key: 'user-1'  // ← Key
  },
  {
    id: 2,
    ism: 'Abdulaziz',
    yosh: 25,
    _key: 'user-2'  // ← Key
  }
], { keys: true })  // ← { keys: true } majburiy!
```

### Keylar bilan get()

```javascript
// Kalitlarni ham qaytarish
const usersWithKeys = await db.collection('users').get({ keys: true })

console.log(usersWithKeys)
// [
//   {
//     key: 'user-1',
//     data: { id: 1, ism: 'Otabek', yosh: 19 }
//   },
//   {
//     key: 'user-2',
//     data: { id: 2, ism: 'Abdulaziz', yosh: 25 }
//   }
// ]
```

## Real loyiha misollari

### 1. User Authentication

```javascript
class AuthService {
  constructor() {
    this.db = new Ombor('auth')
  }

  async register(email, password, userData) {
    // Email ni key sifatida ishlatish
    await this.db.collection('users').add({
      ...userData,
      email,
      password: this.hashPassword(password),
      createdAt: Date.now()
    }, email)  // ← Email = Key
  }

  async login(email, password) {
    try {
      // Email key bilan user topish
      const user = await this.db.collection('users')
        .doc(email)  // ← Email key
        .get()
      
      if (this.verifyPassword(password, user.password)) {
        return user
      }
    } catch {
      return null
    }
  }

  async updateProfile(email, updates) {
    // Email key bilan yangilash
    await this.db.collection('users')
      .doc(email)
      .update(updates)
  }

  hashPassword(password) {
    // Haqiqiy hash kerak (bcrypt, etc.)
    return btoa(password)
  }

  verifyPassword(password, hash) {
    return btoa(password) === hash
  }
}

// Ishlatish
const auth = new AuthService()

// Ro'yxatdan o'tish
await auth.register('user@example.com', 'password123', {
  ism: 'Otabek',
  yosh: 19
})

// Kirish
const user = await auth.login('user@example.com', 'password123')
```

### 2. Settings Storage

```javascript
class SettingsService {
  constructor() {
    this.db = new Ombor('settings')
  }

  async set(key, value) {
    // Setting key ni key sifatida ishlatish
    await this.db.collection('app')
      .doc(key)
      .set({ value })
  }

  async get(key, defaultValue = null) {
    try {
      const setting = await this.db.collection('app')
        .doc(key)
        .get()
      return setting.value
    } catch {
      return defaultValue
    }
  }

  async remove(key) {
    await this.db.collection('app')
      .doc(key)
      .delete()
  }

  async getAll() {
    const settings = await this.db.collection('app').get({ keys: true })
    
    // Object ga aylantirish
    const result = {}
    settings.forEach(item => {
      result[item.key] = item.data.value
    })
    
    return result
  }
}

// Ishlatish
const settings = new SettingsService()

// O'rnatish
await settings.set('theme', 'dark')
await settings.set('language', 'uz')
await settings.set('notifications', true)

// Olish
const theme = await settings.get('theme')  // 'dark'
const lang = await settings.get('language')  // 'uz'
const notif = await settings.get('notifications', false)  // true

// Barcha settingslar
const all = await settings.getAll()
// { theme: 'dark', language: 'uz', notifications: true }
```

### 3. Cache System

```javascript
class CacheService {
  constructor(ttl = 3600000) {  // 1 soat
    this.db = new Ombor('cache')
    this.ttl = ttl
  }

  async set(key, data) {
    await this.db.collection('data')
      .doc(key)
      .set({
        data,
        timestamp: Date.now()
      })
  }

  async get(key) {
    try {
      const cached = await this.db.collection('data')
        .doc(key)
        .get()
      
      // TTL tekshirish
      if (Date.now() - cached.timestamp > this.ttl) {
        await this.delete(key)
        return null
      }
      
      return cached.data
    } catch {
      return null
    }
  }

  async delete(key) {
    await this.db.collection('data')
      .doc(key)
      .delete()
  }

  async clear() {
    await this.db.collection('data').delete()
  }
}

// Ishlatish
const cache = new CacheService(60000)  // 1 daqiqa TTL

// Cache ga qo'yish
await cache.set('api-users', usersData)
await cache.set('api-products', productsData)

// Cache dan olish
const users = await cache.get('api-users')
if (!users) {
  // Cache da yo'q yoki eski, API dan oling
  const freshUsers = await fetch('/api/users').then(r => r.json())
  await cache.set('api-users', freshUsers)
}
```

### 4. Local Draft System

```javascript
class DraftService {
  constructor() {
    this.db = new Ombor('drafts')
  }

  async save(draftId, content) {
    await this.db.collection('posts')
      .doc(draftId)
      .set({
        content,
        lastSaved: Date.now()
      })
  }

  async load(draftId) {
    try {
      return await this.db.collection('posts')
        .doc(draftId)
        .get()
    } catch {
      return null
    }
  }

  async list() {
    return await this.db.collection('posts')
      .get({ keys: true })
  }

  async delete(draftId) {
    await this.db.collection('posts')
      .doc(draftId)
      .delete()
  }

  async autosave(draftId, content, interval = 30000) {
    // Har 30 soniyada avtomatik saqlash
    setInterval(async () => {
      await this.save(draftId, content)
      console.log('Draft saqlandi')
    }, interval)
  }
}

// Ishlatish
const drafts = new DraftService()

// Saqlash
await drafts.save('post-123', {
  title: 'Mening postim',
  body: 'Post matni...',
  tags: ['javascript', 'web']
})

// Yuklash
const draft = await drafts.load('post-123')

// Barcha draftlar
const allDrafts = await drafts.list()
```

## Best Practices

### ✅ Yaxshi keylar

```javascript
// 1. Unique IDlar
'user-123'
'product-abc'
'order-2024-001'

// 2. Email addresslar (user uchun)
'user@example.com'

// 3. Sluglar
'how-to-use-ombor'
'javascript-tutorial'

// 4. Timestamps (chronological order kerak bo'lsa)
Date.now()
1704067200000

// 5. UUIDs
'550e8400-e29b-41d4-a716-446655440000'
```

### ❌ Yomon keylar

```javascript
// 1. Bo'sh stringlar
''  // ❌

// 2. Juda uzun stringlar
'very-long-key-that-goes-on-and-on-and-on...'  // ❌

// 3. Maxsus belgilar (ba'zi brauzerlarda muammo)
'user@#$%'  // ⚠️

// 4. Object (string ga aylanadi)
{ id: 1 }  // ❌ '[object Object]' bo'lib qoladi
```

## Key konvensiyalari

```javascript
// Resource:ID pattern
await db.collection('data').add(user, `user:${user.id}`)
await db.collection('data').add(product, `product:${product.id}`)
await db.collection('data').add(order, `order:${order.id}`)

// Hierarchical keys
await db.collection('data').add(data, `users:123:profile`)
await db.collection('data').add(data, `users:123:settings`)
await db.collection('data').add(data, `posts:456:comments`)

// Namespaced keys
await db.collection('cache').add(data, `cache:api:users`)
await db.collection('cache').add(data, `cache:api:products`)
await db.collection('cache').add(data, `cache:images:thumb:123`)
```
