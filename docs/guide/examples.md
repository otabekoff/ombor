# Misollar

Real loyihalar uchun to'liq misollar.

## Todo App

To'liq CRUD operatsiyalari bilan Todo ilovasi:

```javascript
import Ombor from 'ombor'

class TodoApp {
  constructor() {
    this.db = new Ombor('todo-app')
    this.collection = 'todos'
  }

  // Todo yaratish
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

  // Barcha todolarni olish
  async getAll() {
    return await this.db.collection(this.collection)
      .orderBy('createdAt', 'desc')
      .get()
  }

  // Aktiv todolarni olish
  async getActive() {
    const todos = await this.getAll()
    return todos.filter(t => !t.completed)
  }

  // Bajarilgan todolarni olish
  async getCompleted() {
    const todos = await this.getAll()
    return todos.filter(t => t.completed)
  }

  // Todo statusini o'zgartirish
  async toggle(id) {
    const todo = await this.db.collection(this.collection)
      .doc({ id })
      .get()
    
    await this.db.collection(this.collection)
      .doc({ id })
      .update({
        completed: !todo.completed
      })
  }

  // Todo titleni o'zgartirish
  async updateTitle(id, newTitle) {
    await this.db.collection(this.collection)
      .doc({ id })
      .update({
        title: newTitle,
        updatedAt: new Date().toISOString()
      })
  }

  // Todo o'chirish
  async delete(id) {
    await this.db.collection(this.collection)
      .doc({ id })
      .delete()
  }

  // Barcha bajarilganlarni o'chirish
  async clearCompleted() {
    const completed = await this.getCompleted()
    for (const todo of completed) {
      await this.delete(todo.id)
    }
  }

  // Hammasini o'chirish
  async clearAll() {
    await this.db.collection(this.collection).delete()
  }

  // Statistika
  async getStats() {
    const todos = await this.getAll()
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    }
  }
}

// Ishlatish
const app = new TodoApp()

// Todolar qo'shish
await app.create('Omborni o\'rganish')
await app.create('Proyekt qilish')
await app.create('Test yozish')

// Barcha todolarni ko'rsatish
const todos = await app.getAll()
console.log('Barcha todolar:', todos)

// Bitta todoni bajarish
await app.toggle(todos[0].id)

// Statistika
const stats = await app.getStats()
console.log('Statistika:', stats)
// { total: 3, active: 2, completed: 1 }
```

## E-Commerce Cart

Savatcha boshqaruvi:

```javascript
import Ombor from 'ombor'

class ShoppingCart {
  constructor() {
    this.db = new Ombor('shop')
    this.cartCollection = 'cart'
    this.productsCollection = 'products'
  }

  // Mahsulot qo'shish
  async addProduct(product) {
    await this.db.collection(this.productsCollection).add(product, product.id)
  }

  // Savatga qo'shish
  async addToCart(productId, quantity = 1) {
    try {
      // Allaqachon savatda bormi?
      const existing = await this.db.collection(this.cartCollection)
        .doc({ productId })
        .get()
      
      // Bor bo'lsa quantity ni oshirish
      await this.db.collection(this.cartCollection)
        .doc({ productId })
        .update({
          quantity: existing.quantity + quantity
        })
    } catch {
      // Yo'q bo'lsa yangi qo'shish
      await this.db.collection(this.cartCollection).add({
        productId,
        quantity,
        addedAt: Date.now()
      })
    }
  }

  // Savatdan olib tashlash
  async removeFromCart(productId) {
    await this.db.collection(this.cartCollection)
      .doc({ productId })
      .delete()
  }

  // Quantity o'zgartirish
  async updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      await this.removeFromCart(productId)
      return
    }
    
    await this.db.collection(this.cartCollection)
      .doc({ productId })
      .update({ quantity })
  }

  // Savatni tozalash
  async clearCart() {
    await this.db.collection(this.cartCollection).delete()
  }

  // Savatni olish (to'liq ma'lumot bilan)
  async getCart() {
    const cartItems = await this.db.collection(this.cartCollection).get()
    
    // Har bir item uchun mahsulot ma'lumotlarini olish
    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await this.db.collection(this.productsCollection)
          .doc(item.productId)
          .get()
        
        return {
          ...item,
          product,
          subtotal: product.price * item.quantity
        }
      })
    )
    
    return enrichedItems
  }

  // Umumiy narx
  async getTotal() {
    const cart = await this.getCart()
    return cart.reduce((sum, item) => sum + item.subtotal, 0)
  }

  // Itemlar soni
  async getItemCount() {
    const cart = await this.getCart()
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }
}

// Ishlatish
const cart = new ShoppingCart()

// Mahsulotlar qo'shish
await cart.addProduct({
  id: 1,
  name: 'Laptop',
  price: 5000000,
  image: '/laptop.jpg'
})

await cart.addProduct({
  id: 2,
  name: 'Mouse',
  price: 150000,
  image: '/mouse.jpg'
})

// Savatga qo'shish
await cart.addToCart(1, 1)  // 1 ta laptop
await cart.addToCart(2, 2)  // 2 ta mouse

// Savat
const items = await cart.getCart()
console.log('Savat:', items)

// Umumiy narx
const total = await cart.getTotal()
console.log('Jami:', total, 'so\'m')
// Jami: 5300000 so'm

// Itemlar soni
const count = await cart.getItemCount()
console.log('Itemlar:', count)
// Itemlar: 3
```

## Blog System

Blog postlari va commentlar:

```javascript
import Ombor from 'ombor'

class BlogSystem {
  constructor() {
    this.db = new Ombor('blog')
  }

  // Post yaratish
  async createPost(title, content, author) {
    const post = {
      id: Date.now(),
      slug: this.slugify(title),
      title,
      content,
      author,
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    }
    
    await this.db.collection('posts').add(post)
    return post
  }

  // Postni olish (slug bilan)
  async getPostBySlug(slug) {
    const posts = await this.db.collection('posts').get()
    const post = posts.find(p => p.slug === slug)
    
    if (post) {
      // Views ni oshirish
      await this.db.collection('posts')
        .doc({ id: post.id })
        .update({
          views: post.views + 1
        })
    }
    
    return post
  }

  // Barcha postlar
  async getAllPosts() {
    return await this.db.collection('posts')
      .orderBy('createdAt', 'desc')
      .get()
  }

  // Eng mashhur postlar
  async getPopularPosts(limit = 5) {
    return await this.db.collection('posts')
      .orderBy('views', 'desc')
      .limit(limit)
      .get()
  }

  // Post like qilish
  async likePost(postId) {
    const post = await this.db.collection('posts')
      .doc({ id: postId })
      .get()
    
    await this.db.collection('posts')
      .doc({ id: postId })
      .update({
        likes: post.likes + 1
      })
  }

  // Comment qo'shish
  async addComment(postId, author, content) {
    const comment = {
      id: Date.now(),
      postId,
      author,
      content,
      createdAt: new Date().toISOString()
    }
    
    await this.db.collection('comments').add(comment)
    return comment
  }

  // Post commentlarini olish
  async getComments(postId) {
    const comments = await this.db.collection('comments')
      .orderBy('createdAt', 'desc')
      .get()
    
    return comments.filter(c => c.postId === postId)
  }

  // Slug yaratish
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}

// Ishlatish
const blog = new BlogSystem()

// Post yaratish
const post = await blog.createPost(
  'Omborni qanday ishlatish',
  'Ombor - bu offlayn ma\'lumotlar bazasi...',
  'Otabek'
)

// Postni slug bilan olish
const foundPost = await blog.getPostBySlug('omborni-qanday-ishlatish')
console.log(foundPost.views)  // 1 (avtomatik oshdi)

// Like
await blog.likePost(post.id)

// Comment qo'shish
await blog.addComment(post.id, 'Abdulaziz', 'Ajoyib post!')
await blog.addComment(post.id, 'Ulugbek', 'Rahmat!')

// Commentlarni olish
const comments = await blog.getComments(post.id)
console.log('Commentlar:', comments.length)  // 2

// Eng mashhur postlar
const popular = await blog.getPopularPosts(5)
```

## User Profiles

Foydalanuvchi profillari:

```javascript
import Ombor from 'ombor'

class UserProfileSystem {
  constructor() {
    this.db = new Ombor('users')
  }

  // Profil yaratish
  async createProfile(username, email, data = {}) {
    const profile = {
      username,
      email,
      ...data,
      createdAt: Date.now(),
      lastActive: Date.now()
    }
    
    // Username ni key sifatida ishlatish
    await this.db.collection('profiles').add(profile, username)
    return profile
  }

  // Profil olish
  async getProfile(username) {
    try {
      return await this.db.collection('profiles')
        .doc(username)
        .get()
    } catch {
      return null
    }
  }

  // Profil yangilash
  async updateProfile(username, updates) {
    await this.db.collection('profiles')
      .doc(username)
      .update({
        ...updates,
        updatedAt: Date.now()
      })
  }

  // Last active ni yangilash
  async updateLastActive(username) {
    await this.db.collection('profiles')
      .doc(username)
      .update({
        lastActive: Date.now()
      })
  }

  // Avatar o'rnatish
  async setAvatar(username, avatarUrl) {
    await this.updateProfile(username, { avatar: avatarUrl })
  }

  // Settings o'rnatish
  async updateSettings(username, settings) {
    await this.db.collection('profiles')
      .doc(username)
      .update({
        settings: {
          ...settings
        }
      })
  }

  // Barcha profillar
  async getAllProfiles() {
    return await this.db.collection('profiles')
      .orderBy('createdAt', 'desc')
      .get({ keys: true })
  }

  // Qidiruv
  async search(query) {
    const profiles = await this.db.collection('profiles').get()
    const lowerQuery = query.toLowerCase()
    
    return profiles.filter(p => 
      p.username.toLowerCase().includes(lowerQuery) ||
      p.email.toLowerCase().includes(lowerQuery) ||
      (p.name && p.name.toLowerCase().includes(lowerQuery))
    )
  }
}

// Ishlatish
const userSystem = new UserProfileSystem()

// Profil yaratish
await userSystem.createProfile('otabekoff', 'otabek@example.com', {
  name: 'Otabek Sadiridinov',
  bio: 'Web developer',
  location: 'Tashkent',
  website: 'https://otabekoff.uz'
})

// Profil olish
const profile = await userSystem.getProfile('otabekoff')
console.log(profile)

// Avatar o'rnatish
await userSystem.setAvatar('otabekoff', '/avatars/otabek.jpg')

// Settings
await userSystem.updateSettings('otabekoff', {
  theme: 'dark',
  language: 'uz',
  notifications: true
})

// Qidiruv
const results = await userSystem.search('otabek')
console.log('Topildi:', results.length)
```

## Keyingi qadam

- [Best Practices](/guide/best-practices) - Eng yaxshi amaliyotlar
- [Troubleshooting](/guide/troubleshooting) - Muammolarni hal qilish
- [API hujjatlari](/api/introduction) - To'liq API reference
