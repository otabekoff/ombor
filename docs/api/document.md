# Document Metodlari

Document - bu collectiondagi individual yozuv (object).

## doc(criteria)

Collectiondan documentni tanlaydi.

### Parametrlar

- `criteria` (object | string | number) - Qidiruv mezoni yoki kalit

### Qaytaradi

Ombor instance (method chaining uchun)

### Misollar

```javascript
// Object mezoni bilan
db.collection('users').doc({ id: 1 })
db.collection('users').doc({ email: 'user@example.com' })

// Kalit bilan
db.collection('users').doc('user-key-123')
db.collection('users').doc(12345)

// Ko'p maydon bilan
db.collection('products').doc({
  category: 'electronics',
  brand: 'Samsung'
})
```

## get()

Tanlangan documentni oladi.

### Qaytaradi

Promise\<Object\>

### Misollar

```javascript
// ID bo'yicha olish
const user = await db.collection('users')
  .doc({ id: 1 })
  .get()

console.log(user)
// { id: 1, ism: 'Otabek', yosh: 19 }

// Kalit bilan olish
const user = await db.collection('users')
  .doc('user-1')
  .get()

// Email bo'yicha olish
const user = await db.collection('users')
  .doc({ email: 'otabek@example.com' })
  .get()

// Promise bilan
db.collection('users')
  .doc({ id: 1 })
  .get()
  .then(user => console.log(user))
  .catch(err => console.error('Topilmadi:', err))

// Try-catch bilan
async function getUser(id) {
  try {
    const user = await db.collection('users')
      .doc({ id })
      .get()
    return user
  } catch (error) {
    console.error('User topilmadi:', error)
    return null
  }
}
```

## update(data)

Documentni qisman yangilaydi. Faqat berilgan maydonlar yangilanadi.

### Parametrlar

- `data` (object) - Yangilanadigan maydonlar

### Qaytaradi

Promise

### Misollar

```javascript
// Bitta maydonni yangilash
await db.collection('users')
  .doc({ id: 1 })
  .update({
    email: 'newemail@example.com'
  })

// Ko'p maydonni yangilash
await db.collection('users')
  .doc({ id: 1 })
  .update({
    email: 'newemail@example.com',
    phone: '+998901234567',
    updatedAt: new Date().toISOString()
  })

// Kalit bilan yangilash
await db.collection('users')
  .doc('user-1')
  .update({
    status: 'active'
  })

// Promise bilan
db.collection('users')
  .doc({ id: 1 })
  .update({ yosh: 20 })
  .then(() => console.log('Yangilandi'))
  .catch(err => console.error('Xato:', err))
```

### Muhim!

Agar bir nechta document mezon bo'yicha topilsa, **barcha** topilgan documentlar yangilanadi:

```javascript
// ⚠️ Barcha Samsung mahsulotlarini yangilaydi
await db.collection('products')
  .doc({ brand: 'Samsung' })
  .update({
    discount: 10
  })

// ✅ Faqat bitta mahsulotni yangilash uchun unique maydon ishlating
await db.collection('products')
  .doc({ id: 123 })
  .update({
    price: 1000
  })
```

## set(data)

Documentni to'liq qayta yozadi. Barcha eski maydonlar o'chiriladi.

### Parametrlar

- `data` (object) - Yangi document ma'lumotlari

### Qaytaradi

Promise

### Misollar

```javascript
// Documentni to'liq qayta yozish
await db.collection('users')
  .doc({ id: 1 })
  .set({
    id: 1,
    ism: 'Yangi ism',
    email: 'yangi@example.com',
    yosh: 25
  })

// Kalit bilan
await db.collection('users')
  .doc('user-1')
  .set({
    id: 1,
    ism: 'Otabek',
    email: 'otabek@example.com'
  })

// Promise bilan
db.collection('users')
  .doc({ id: 1 })
  .set({
    id: 1,
    ism: 'Updated User',
    status: 'active'
  })
  .then(() => console.log('O\'rnatildi'))
  .catch(err => console.error('Xato:', err))
```

### update() vs set()

```javascript
// Dastlabki document
// { id: 1, ism: 'Otabek', yosh: 19, email: 'old@example.com' }

// update() - faqat berilgan maydonlar yangilanadi
await db.collection('users')
  .doc({ id: 1 })
  .update({ email: 'new@example.com' })

// Natija:
// { id: 1, ism: 'Otabek', yosh: 19, email: 'new@example.com' }

// set() - butun document qayta yoziladi
await db.collection('users')
  .doc({ id: 1 })
  .set({ id: 1, email: 'new@example.com' })

// Natija:
// { id: 1, email: 'new@example.com' }
// ⚠️ ism va yosh maydonlari o'chib ketdi!
```

## delete()

Documentni o'chiradi.

### Qaytaradi

Promise

### Misollar

```javascript
// ID bo'yicha o'chirish
await db.collection('users')
  .doc({ id: 1 })
  .delete()

// Kalit bilan o'chirish
await db.collection('users')
  .doc('user-1')
  .delete()

// Promise bilan
db.collection('users')
  .doc({ id: 1 })
  .delete()
  .then(() => console.log('O\'chirildi'))
  .catch(err => console.error('Xato:', err))

// Async function ichida
async function deleteUser(id) {
  try {
    await db.collection('users')
      .doc({ id })
      .delete()
    console.log(`User ${id} o'chirildi`)
  } catch (error) {
    console.error('O\'chirishda xato:', error)
  }
}
```

### Muhim!

Agar bir nechta document mezon bo'yicha topilsa, **barcha** topilgan documentlar o'chiriladi:

```javascript
// ⚠️ Barcha admin roleli userlarni o'chiradi
await db.collection('users')
  .doc({ role: 'admin' })
  .delete()

// ✅ Faqat bitta userni o'chirish uchun unique maydon ishlating
await db.collection('users')
  .doc({ id: 123 })
  .delete()
```

## Real loyiha misoli

```javascript
// Todo CRUD
class TodoService {
  constructor() {
    this.db = new Ombor('todo-app')
    this.collection = 'todos'
  }

  async create(title) {
    const todo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    }
    await this.db.collection(this.collection).add(todo)
    return todo
  }

  async get(id) {
    return await this.db.collection(this.collection)
      .doc({ id })
      .get()
  }

  async getAll() {
    return await this.db.collection(this.collection)
      .orderBy('createdAt', 'desc')
      .get()
  }

  async toggle(id) {
    const todo = await this.get(id)
    return await this.db.collection(this.collection)
      .doc({ id })
      .update({
        completed: !todo.completed
      })
  }

  async updateTitle(id, newTitle) {
    return await this.db.collection(this.collection)
      .doc({ id })
      .update({
        title: newTitle,
        updatedAt: new Date().toISOString()
      })
  }

  async delete(id) {
    return await this.db.collection(this.collection)
      .doc({ id })
      .delete()
  }

  async deleteCompleted() {
    const todos = await this.getAll()
    const completed = todos.filter(t => t.completed)
    
    for (const todo of completed) {
      await this.delete(todo.id)
    }
  }
}

// Ishlatish
const todoService = new TodoService()

// Yangi todo
const todo = await todoService.create('Omborni o\'rganish')

// Statusni o'zgartirish
await todoService.toggle(todo.id)

// Titleni o'zgartirish
await todoService.updateTitle(todo.id, 'Omborni mukammal o\'rganish')

// O'chirish
await todoService.delete(todo.id)

// Barcha bajarilganlarni o'chirish
await todoService.deleteCompleted()
```
