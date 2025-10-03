# Filter Metodlari

Filter metodlari collectiondan ma'lumot olishda tartiblash va cheklash imkonini beradi.

## orderBy(field, direction?)

Collectionni ma'lum maydon bo'yicha tartiblaydi.

### Parametrlar

- `field` (string) - Tartiblash uchun maydon nomi
- `direction` (string, optional) - `'asc'` (default) yoki `'desc'`

### Qaytaradi

Ombor instance (method chaining uchun)

### Misollar

```javascript
// Yosh bo'yicha o'sish tartibida
const users = await db.collection('users')
  .orderBy('yosh')
  .get()

// Ism bo'yicha kamayish tartibida
const users = await db.collection('users')
  .orderBy('ism', 'desc')
  .get()

// Sana bo'yicha (eng yangi birinchi)
const posts = await db.collection('posts')
  .orderBy('createdAt', 'desc')
  .get()

// Ball bo'yicha (eng yuqori birinchi)
const players = await db.collection('players')
  .orderBy('score', 'desc')
  .get()

// Narx bo'yicha (arzon birinchi)
const products = await db.collection('products')
  .orderBy('price', 'asc')
  .get()
```

### Direction qiymatlari

| Direction | Ma'nosi | Misol |
|-----------|---------|-------|
| `'asc'` | O'sish tartibida (A-Z, 0-9) | 1, 2, 3, ... |
| `'desc'` | Kamayish tartibida (Z-A, 9-0) | 10, 9, 8, ... |

### Turli ma'lumot turlari bilan

```javascript
// Raqamlar
await db.collection('items')
  .orderBy('quantity', 'desc')
  .get()
// 100, 50, 25, 10, 5

// Satrlar (alifbo tartibida)
await db.collection('users')
  .orderBy('name', 'asc')
  .get()
// Ahror, Botir, Davron, ...

// Sanalar (ISO 8601 format)
await db.collection('events')
  .orderBy('date', 'desc')
  .get()
// 2024-01-15, 2024-01-10, 2024-01-05

// Boolean qiymatlar
await db.collection('tasks')
  .orderBy('completed', 'asc')
  .get()
// false, false, true, true
```

## limit(count)

Qaytariladigan documentlar sonini cheklaydi.

### Parametrlar

- `count` (number) - Maximum documentlar soni

### Qaytaradi

Ombor instance (method chaining uchun)

### Misollar

```javascript
// Faqat bitta document
const latestPost = await db.collection('posts')
  .orderBy('createdAt', 'desc')
  .limit(1)
  .get()

// Eng yuqori 10 ball
const topPlayers = await db.collection('players')
  .orderBy('score', 'desc')
  .limit(10)
  .get()

// Oxirgi 5 ta habar
const recentMessages = await db.collection('messages')
  .orderBy('timestamp', 'desc')
  .limit(5)
  .get()

// Birinchi 3 ta mahsulot
const products = await db.collection('products')
  .orderBy('createdAt', 'asc')
  .limit(3)
  .get()
```

## Method Chaining

orderBy va limit metodlarini birgalikda ishlating:

```javascript
// Top 5 eng qimmat mahsulotlar
const expensive = await db.collection('products')
  .orderBy('price', 'desc')
  .limit(5)
  .get()

// Oxirgi 10 ta foydalanuvchi
const newUsers = await db.collection('users')
  .orderBy('registeredAt', 'desc')
  .limit(10)
  .get()

// Eng past 3 ta narx
const cheapest = await db.collection('products')
  .orderBy('price', 'asc')
  .limit(3)
  .get()
```

## Real loyiha misollari

### Blog sahifasi

```javascript
class BlogService {
  constructor() {
    this.db = new Ombor('blog')
    this.postsPerPage = 10
  }

  // Oxirgi postlar
  async getLatestPosts(count = 5) {
    return await this.db.collection('posts')
      .orderBy('publishedAt', 'desc')
      .limit(count)
      .get()
  }

  // Eng mashhur postlar
  async getPopularPosts(count = 10) {
    return await this.db.collection('posts')
      .orderBy('views', 'desc')
      .limit(count)
      .get()
  }

  // Alphabetik ro'yxat
  async getPostsByTitle() {
    return await this.db.collection('posts')
      .orderBy('title', 'asc')
      .get()
  }
}
```

### E-commerce do'kon

```javascript
class ProductService {
  constructor() {
    this.db = new Ombor('shop')
  }

  // Yangi mahsulotlar
  async getNewArrivals(limit = 12) {
    return await this.db.collection('products')
      .orderBy('addedAt', 'desc')
      .limit(limit)
      .get()
  }

  // Arzon mahsulotlar
  async getCheapestProducts(limit = 20) {
    return await this.db.collection('products')
      .orderBy('price', 'asc')
      .limit(limit)
      .get()
  }

  // Qimmat mahsulotlar
  async getPremiumProducts(limit = 10) {
    return await this.db.collection('products')
      .orderBy('price', 'desc')
      .limit(limit)
      .get()
  }

  // Eng ko'p sotilgan
  async getBestSellers(limit = 15) {
    return await this.db.collection('products')
      .orderBy('soldCount', 'desc')
      .limit(limit)
      .get()
  }
}
```

### Leaderboard (o'yin)

```javascript
class GameService {
  constructor() {
    this.db = new Ombor('game')
  }

  // Top 100 o'yinchilar
  async getLeaderboard(limit = 100) {
    return await this.db.collection('players')
      .orderBy('score', 'desc')
      .limit(limit)
      .get()
  }

  // Eng faol o'yinchilar
  async getMostActivePlayers(limit = 50) {
    return await this.db.collection('players')
      .orderBy('gamesPlayed', 'desc')
      .limit(limit)
      .get()
  }

  // Yangi o'yinchilar
  async getNewestPlayers(limit = 20) {
    return await this.db.collection('players')
      .orderBy('joinedAt', 'desc')
      .limit(limit)
      .get()
  }
}
```

### Chat ilovasi

```javascript
class ChatService {
  constructor() {
    this.db = new Ombor('chat')
  }

  // Oxirgi habarlar
  async getRecentMessages(roomId, limit = 50) {
    const allMessages = await this.db.collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get()
    
    // Xona bo'yicha filtrlash (hozircha Ombor ichida yo'q)
    return allMessages.filter(m => m.roomId === roomId)
  }

  // Eng aktiv foydalanuvchilar
  async getMostActiveUsers(limit = 10) {
    return await this.db.collection('users')
      .orderBy('messageCount', 'desc')
      .limit(limit)
      .get()
  }
}
```

## Pagination misoli

Hozirda Omborda built-in pagination yo'q, lekin shunday amalga oshirish mumkin:

```javascript
class PaginationService {
  constructor(collectionName, itemsPerPage = 10) {
    this.db = new Ombor('myapp')
    this.collection = collectionName
    this.itemsPerPage = itemsPerPage
  }

  async getPage(pageNumber = 1, orderByField = 'createdAt') {
    // Barcha ma'lumotlarni olish
    const allItems = await this.db.collection(this.collection)
      .orderBy(orderByField, 'desc')
      .get()

    // Umumiy sahifalar soni
    const totalPages = Math.ceil(allItems.length / this.itemsPerPage)

    // Hozirgi sahifa ma'lumotlari
    const startIndex = (pageNumber - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    const items = allItems.slice(startIndex, endIndex)

    return {
      items,
      currentPage: pageNumber,
      totalPages,
      totalItems: allItems.length,
      hasNext: pageNumber < totalPages,
      hasPrev: pageNumber > 1
    }
  }
}

// Ishlatish
const pagination = new PaginationService('products', 20)

// 1-sahifa
const page1 = await pagination.getPage(1)
console.log(page1)
// {
//   items: [...20 items...],
//   currentPage: 1,
//   totalPages: 5,
//   totalItems: 95,
//   hasNext: true,
//   hasPrev: false
// }

// 2-sahifa
const page2 = await pagination.getPage(2)
```

## Performans maslahatlari

### ✅ Yaxshi amaliyotlar

```javascript
// 1. limit() dan foydalaning
const recent = await db.collection('items')
  .orderBy('date', 'desc')
  .limit(10)  // ✅ Faqat kerakli miqdorda
  .get()

// 2. orderBy() dan foydalaning
const sorted = await db.collection('items')
  .orderBy('priority', 'desc')  // ✅ Database level sorting
  .get()

// 3. Index maydonlar bo'yicha tartiblang
const items = await db.collection('items')
  .orderBy('id', 'asc')  // ✅ Tez ishlaydi
  .get()
```

### ❌ Yomon amaliyotlar

```javascript
// 1. limit() siz hamma ma'lumotni olish
const all = await db.collection('items').get()  // ❌ 10000+ items?
const recent = all.slice(0, 10)  // ❌ Ortiqcha yuklanish

// 2. Client-side sorting
const all = await db.collection('items').get()  // ❌
const sorted = all.sort((a, b) => b.date - a.date)  // ❌ Sekin

// 3. Ko'p marta DB ga murojaat
for (let i = 1; i <= 10; i++) {  // ❌
  await db.collection('items').doc({ id: i }).get()  // ❌ 10 ta query!
}

// Buning o'rniga:
const items = await db.collection('items')
  .orderBy('id')
  .limit(10)  // ✅ Faqat 1 ta query
  .get()
```
