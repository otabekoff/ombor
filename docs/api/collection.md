# Collection Metodlari

Collection - bu documentlar to'plami. Firebase Firestore kabi ishlaydi.

## collection(name)

Collectionni tanlaydi. Agar mavjud bo'lmasa, avtomatik yaratiladi.

### Parametrlar

- `name` (string) - Collection nomi

### Qaytaradi

Ombor instance (method chaining uchun)

### Misol

```javascript
const db = new Ombor('mydb')

// Collection tanlash
db.collection('users')
db.collection('products')
db.collection('orders')
```

## add(data, key?)

Collectionga yangi document qo'shadi.

### Parametrlar

- `data` (object) - Qo'shiladigan ma'lumot
- `key` (string | number, optional) - IndexedDB uchun kalit

### Qaytaradi

Promise

### Misollar

```javascript
// Oddiy qo'shish
await db.collection('users').add({
  id: 1,
  ism: 'Otabek',
  yosh: 19,
  email: 'otabek@example.com'
})

// O'z kaliti bilan
await db.collection('users').add({
  id: 1,
  ism: 'Otabek',
  yosh: 19
}, 'user-1')

// Promise bilan
db.collection('users')
  .add({ id: 1, ism: 'Otabek' })
  .then(() => console.log('Qo\'shildi'))
  .catch(err => console.error('Xato:', err))

// Ko'p ma'lumot qo'shish
const users = [
  { id: 1, ism: 'Otabek', yosh: 19 },
  { id: 2, ism: 'Abdulaziz', yosh: 25 },
  { id: 3, ism: 'Ulugbek', yosh: 30 }
]

for (const user of users) {
  await db.collection('users').add(user)
}
```

## get(options?)

Collectiondan barcha documentlarni oladi.

### Parametrlar

- `options` (object, optional)
  - `keys` (boolean) - Agar true bo'lsa, kalitlarni ham qaytaradi

### Qaytaradi

Promise<Array>

### Misollar

```javascript
// Barcha documentlar
const users = await db.collection('users').get()
console.log(users)
// [
//   { id: 1, ism: 'Otabek', yosh: 19 },
//   { id: 2, ism: 'Abdulaziz', yosh: 25 }
// ]

// Kalitlar bilan
const usersWithKeys = await db.collection('users').get({ keys: true })
console.log(usersWithKeys)
// [
//   {
//     key: 'auto-generated-key-1',
//     data: { id: 1, ism: 'Otabek', yosh: 19 }
//   },
//   {
//     key: 'auto-generated-key-2',
//     data: { id: 2, ism: 'Abdulaziz', yosh: 25 }
//   }
// ]

// Tartiblangan
const sorted = await db.collection('users')
  .orderBy('yosh', 'desc')
  .get()

// Cheklangan
const limited = await db.collection('users')
  .orderBy('ism')
  .limit(10)
  .get()
```

## set(data)

Butun collectionni qayta yozadi. **Ehtiyot bo'ling**: Bu mavjud barcha documentlarni o'chiradi!

### Parametrlar

- `data` (Array) - Documentlar arrayi
- `options` (object, optional)
  - `keys` (boolean) - Agar documentlarda `_key` maydoni bo'lsa

### Qaytaradi

Promise

### Misollar

```javascript
// Collectionni qayta yozish
await db.collection('users').set([
  { id: 1, ism: 'Otabek', yosh: 19 },
  { id: 2, ism: 'Abdulaziz', yosh: 25 },
  { id: 3, ism: 'Ulugbek', yosh: 30 }
])

// Kalitlar bilan
await db.collection('users').set([
  { id: 1, ism: 'Otabek', yosh: 19, _key: 'user-1' },
  { id: 2, ism: 'Abdulaziz', yosh: 25, _key: 'user-2' }
], { keys: true })
```

## delete()

Collectionni va undagi barcha documentlarni o'chiradi.

### Qaytaradi

Promise

### Misollar

```javascript
// Collection o'chirish
await db.collection('users').delete()

// Promise bilan
db.collection('users')
  .delete()
  .then(() => console.log('O\'chirildi'))
  .catch(err => console.error('Xato:', err))

// Async function ichida
async function deleteAllUsers() {
  try {
    await db.collection('users').delete()
    console.log('Barcha foydalanuvchilar o\'chirildi')
  } catch (error) {
    console.error('Xato yuz berdi:', error)
  }
}
```

## Method Chaining

Omborning eng kuchli tomoni - method chaining:

```javascript
// Tartiblangan va cheklangan
const topUsers = await db.collection('users')
  .orderBy('score', 'desc')
  .limit(10)
  .get()

// Filtrlangan, tartiblangan va cheklangan
const recentPosts = await db.collection('posts')
  .orderBy('createdAt', 'desc')
  .limit(20)
  .get()

// Document tanlab yangilash
await db.collection('users')
  .doc({ id: 1 })
  .update({ status: 'active' })
```

## Real loyiha misoli

```javascript
// User CRUD operatsiyalari
class UserService {
  constructor() {
    this.db = new Ombor('myapp')
    this.collection = 'users'
  }

  async create(userData) {
    const user = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    await this.db.collection(this.collection).add(user)
    return user
  }

  async getAll() {
    return await this.db.collection(this.collection)
      .orderBy('createdAt', 'desc')
      .get()
  }

  async getById(id) {
    return await this.db.collection(this.collection)
      .doc({ id })
      .get()
  }

  async update(id, updates) {
    return await this.db.collection(this.collection)
      .doc({ id })
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
  }

  async delete(id) {
    return await this.db.collection(this.collection)
      .doc({ id })
      .delete()
  }

  async deleteAll() {
    return await this.db.collection(this.collection).delete()
  }
}

// Ishlatish
const userService = new UserService()

// Yangi user yaratish
const newUser = await userService.create({
  ism: 'Otabek',
  email: 'otabek@example.com'
})

// Barcha userlarni olish
const users = await userService.getAll()

// ID bo'yicha olish
const user = await userService.getById(newUser.id)

// Yangilash
await userService.update(newUser.id, {
  email: 'newemail@example.com'
})

// O'chirish
await userService.delete(newUser.id)
```
