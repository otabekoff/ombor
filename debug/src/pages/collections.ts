import { db, log, success, error } from '../main'

export const collectionsPage = {
  render() {
    return `
      <div class="container">
        <header>
          <h1>📚 Multiple Collections</h1>
          <p>Work with multiple collections in the same database</p>
        </header>

        <div class="controls">
          <div class="section">
            <h2>👥 Users Collection</h2>
            <button id="mc-add-user">Add User</button>
            <button id="mc-get-users">Get All Users</button>
          </div>

          <div class="section">
            <h2>📦 Products Collection</h2>
            <button id="mc-add-product">Add Product</button>
            <button id="mc-get-products">Get All Products</button>
          </div>

          <div class="section">
            <h2>🛒 Orders Collection</h2>
            <button id="mc-add-order">Add Order</button>
            <button id="mc-get-orders">Get All Orders</button>
          </div>

          <div class="section">
            <h2>🎯 Operations</h2>
            <button id="mc-get-all">Get All Collections</button>
            <button id="mc-seed">Seed All Collections</button>
            <button id="mc-clear" class="danger">Clear All</button>
          </div>
        </div>
      </div>
    `
  },

  init() {
    document.getElementById('mc-add-user')?.addEventListener('click', async () => {
      try {
        log('Adding user...')
        await db.collection('users').add({
          name: 'Otabek',
          email: 'otabek@example.com',
          role: 'Admin'
        })
        success('User added to users collection!')
      } catch (err) {
        error('Add failed', err)
      }
    })

    document.getElementById('mc-get-users')?.addEventListener('click', async () => {
      try {
        log('Getting all users...')
        const users = await db.collection('users').get()
        success(`Found ${users.length} users`, users)
      } catch (err) {
        error('Get failed', err)
      }
    })

    document.getElementById('mc-add-product')?.addEventListener('click', async () => {
      try {
        log('Adding product...')
        await db.collection('products').add({
          name: 'Laptop',
          price: 1200,
          stock: 50
        })
        success('Product added to products collection!')
      } catch (err) {
        error('Add failed', err)
      }
    })

    document.getElementById('mc-get-products')?.addEventListener('click', async () => {
      try {
        log('Getting all products...')
        const products = await db.collection('products').get()
        success(`Found ${products.length} products`, products)
      } catch (err) {
        error('Get failed', err)
      }
    })

    document.getElementById('mc-add-order')?.addEventListener('click', async () => {
      try {
        log('Adding order...')
        await db.collection('orders').add({
          userId: 1,
          productId: 1,
          quantity: 2,
          total: 2400,
          date: new Date().toISOString()
        })
        success('Order added to orders collection!')
      } catch (err) {
        error('Add failed', err)
      }
    })

    document.getElementById('mc-get-orders')?.addEventListener('click', async () => {
      try {
        log('Getting all orders...')
        const orders = await db.collection('orders').get()
        success(`Found ${orders.length} orders`, orders)
      } catch (err) {
        error('Get failed', err)
      }
    })

    document.getElementById('mc-get-all')?.addEventListener('click', async () => {
      try {
        log('Getting data from all collections...')
        const users = await db.collection('users').get()
        const products = await db.collection('products').get()
        const orders = await db.collection('orders').get()

        success('All collections data:', {
          users: { count: users.length, data: users },
          products: { count: products.length, data: products },
          orders: { count: orders.length, data: orders }
        })
      } catch (err) {
        error('Get all failed', err)
      }
    })

    document.getElementById('mc-seed')?.addEventListener('click', async () => {
      try {
        log('Seeding all collections...')

        // Add users
        await db.collection('users').add({ name: 'Admin', email: 'admin@test.com', role: 'Admin' })
        await db.collection('users').add({ name: 'User', email: 'user@test.com', role: 'User' })

        // Add products
        await db.collection('products').add({ name: 'Laptop', price: 1200, stock: 50 })
        await db.collection('products').add({ name: 'Mouse', price: 25, stock: 200 })
        await db.collection('products').add({ name: 'Keyboard', price: 75, stock: 150 })

        // Add orders
        await db.collection('orders').add({ userId: 1, productId: 1, quantity: 1, total: 1200 })
        await db.collection('orders').add({ userId: 2, productId: 2, quantity: 2, total: 50 })

        success('All collections seeded!')
      } catch (err) {
        error('Seed failed', err)
      }
    })

    document.getElementById('mc-clear')?.addEventListener('click', async () => {
      if (confirm('Clear all collections?')) {
        try {
          log('Clearing all collections...')
          await db.collection('users').delete()
          await db.collection('products').delete()
          await db.collection('orders').delete()
          success('All collections cleared!')
        } catch (err) {
          error('Clear failed', err)
        }
      }
    })
  }
}
