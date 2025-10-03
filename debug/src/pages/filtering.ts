import { db, log, success, error } from '../main'

export const filteringPage = {
  render() {
    return `
      <div class="container">
        <header>
          <h1>🔍 Filtering & Sorting</h1>
          <p>Test orderBy, limit, and filtering capabilities</p>
        </header>

        <div class="controls">
          <div class="section">
            <h2>📊 Sorting (OrderBy)</h2>
            <button id="filter-order-asc">Order by Age (ASC)</button>
            <button id="filter-order-desc">Order by Age (DESC)</button>
            <button id="filter-order-name">Order by Name</button>
          </div>

          <div class="section">
            <h2>🔢 Limiting</h2>
            <button id="filter-limit-5">Limit to 5</button>
            <button id="filter-limit-10">Limit to 10</button>
            <button id="filter-limit-1">Get First Record</button>
          </div>

          <div class="section">
            <h2>⚡ Combined</h2>
            <button id="filter-combined">OrderBy + Limit</button>
            <button id="filter-pagination">Pagination Example</button>
          </div>

          <div class="section">
            <h2>🎲 Setup Data</h2>
            <button id="filter-seed">Generate Test Data</button>
            <button id="filter-clear" class="danger">Clear Data</button>
          </div>
        </div>
      </div>
    `
  },

  init() {
    document.getElementById('filter-order-asc')?.addEventListener('click', async () => {
      try {
        log('Ordering by age (ascending)...')
        const users = await db.collection('users').orderBy('age', 'asc').get()
        success(`Sorted ${users.length} users by age (ASC)`, users)
      } catch (err) {
        error('OrderBy failed', err)
      }
    })

    document.getElementById('filter-order-desc')?.addEventListener('click', async () => {
      try {
        log('Ordering by age (descending)...')
        const users = await db.collection('users').orderBy('age', 'desc').get()
        success(`Sorted ${users.length} users by age (DESC)`, users)
      } catch (err) {
        error('OrderBy failed', err)
      }
    })

    document.getElementById('filter-order-name')?.addEventListener('click', async () => {
      try {
        log('Ordering by name...')
        const users = await db.collection('users').orderBy('name').get()
        success(`Sorted ${users.length} users by name`, users)
      } catch (err) {
        error('OrderBy failed', err)
      }
    })

    document.getElementById('filter-limit-5')?.addEventListener('click', async () => {
      try {
        log('Getting first 5 users...')
        const users = await db.collection('users').limit(5).get()
        success(`Got ${users.length} users`, users)
      } catch (err) {
        error('Limit failed', err)
      }
    })

    document.getElementById('filter-limit-10')?.addEventListener('click', async () => {
      try {
        log('Getting first 10 users...')
        const users = await db.collection('users').limit(10).get()
        success(`Got ${users.length} users`, users)
      } catch (err) {
        error('Limit failed', err)
      }
    })

    document.getElementById('filter-limit-1')?.addEventListener('click', async () => {
      try {
        log('Getting first record...')
        const users = await db.collection('users').limit(1).get()
        success('First record:', users[0])
      } catch (err) {
        error('Limit failed', err)
      }
    })

    document.getElementById('filter-combined')?.addEventListener('click', async () => {
      try {
        log('Combining orderBy + limit...')
        const users = await db.collection('users').orderBy('age', 'desc').limit(3).get()
        success('Top 3 oldest users:', users)
      } catch (err) {
        error('Combined query failed', err)
      }
    })

    document.getElementById('filter-pagination')?.addEventListener('click', async () => {
      try {
        log('Pagination example (page 1, 5 items)...')
        const page1 = await db.collection('users').orderBy('name').limit(5).get()
        success('Page 1 (5 items):', page1)
      } catch (err) {
        error('Pagination failed', err)
      }
    })

    document.getElementById('filter-seed')?.addEventListener('click', async () => {
      try {
        log('Generating 20 test users...')
        const names = ['Ali', 'Vali', 'Guli', 'Davron', 'Sardor', 'Aziz', 'Jasur', 'Bekzod', 'Dilshod', 'Eldor']
        const cities = ['Toshkent', 'Samarqand', 'Buxoro', 'Xiva', 'Andijon', 'Farg\'ona', 'Namangan', 'Qashqadaryo']

        for (let i = 0; i < 20; i++) {
          await db.collection('users').add({
            name: `${names[i % names.length]} ${i + 1}`,
            age: 20 + Math.floor(Math.random() * 40),
            city: cities[i % cities.length]
          })
        }
        success('Generated 20 test users!')
      } catch (err) {
        error('Seed failed', err)
      }
    })

    document.getElementById('filter-clear')?.addEventListener('click', async () => {
      if (confirm('Clear all users?')) {
        try {
          log('Clearing users...')
          await db.collection('users').delete()
          success('Users cleared!')
        } catch (err) {
          error('Clear failed', err)
        }
      }
    })
  }
}
