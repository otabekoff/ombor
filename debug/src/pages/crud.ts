import { db, log, success, error } from '../main'

export const crudPage = {
  render() {
    return `
      <div class="container">
        <header>
          <h1>🔄 CRUD Operations</h1>
          <p>Complete Create, Read, Update, Delete operations</p>
        </header>

        <div class="controls">
          <div class="section">
            <h2>📝 Create</h2>
            <button id="crud-create">Create User</button>
            <button id="crud-create-bulk">Create 5 Users</button>
          </div>

          <div class="section">
            <h2>📖 Read</h2>
            <button id="crud-read-all">Read All</button>
            <button id="crud-read-one">Read One</button>
          </div>

          <div class="section">
            <h2>✏️ Update</h2>
            <button id="crud-update">Update User</button>
            <button id="crud-set">Set (Replace)</button>
          </div>

          <div class="section">
            <h2>🗑️ Delete</h2>
            <button id="crud-delete">Delete User</button>
            <button id="crud-delete-all" class="danger">Delete All</button>
          </div>
        </div>
      </div>
    `
  },

  init() {
    document.getElementById('crud-create')?.addEventListener('click', async () => {
      try {
        log('Creating user...')
        await db.collection('users').add({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30
        })
        success('User created!')
      } catch (err) {
        error('Create failed', err)
      }
    })

    document.getElementById('crud-create-bulk')?.addEventListener('click', async () => {
      try {
        log('Creating 5 users...')
        for (let i = 1; i <= 5; i++) {
          await db.collection('users').add({
            name: `User ${i}`,
            email: `user${i}@example.com`,
            age: 20 + i
          })
        }
        success('5 users created!')
      } catch (err) {
        error('Bulk create failed', err)
      }
    })

    document.getElementById('crud-read-all')?.addEventListener('click', async () => {
      try {
        log('Reading all users...')
        const users = await db.collection('users').get()
        success(`Found ${users.length} users`, users)
      } catch (err) {
        error('Read failed', err)
      }
    })

    document.getElementById('crud-read-one')?.addEventListener('click', async () => {
      try {
        log('Reading one user...')
        const user = await db.collection('users').doc({ name: 'John Doe' }).get()
        success('User found!', user)
      } catch (err) {
        error('Read failed', err)
      }
    })

    document.getElementById('crud-update')?.addEventListener('click', async () => {
      try {
        log('Updating user...')
        await db.collection('users').doc({ name: 'John Doe' }).update({ age: 31 })
        success('User updated!')
      } catch (err) {
        error('Update failed', err)
      }
    })

    document.getElementById('crud-set')?.addEventListener('click', async () => {
      try {
        log('Setting (replacing) user data...')
        await db.collection('users').doc({ name: 'John Doe' }).set({
          name: 'John Doe',
          email: 'newemail@example.com',
          age: 32,
          verified: true
        })
        success('User data replaced!')
      } catch (err) {
        error('Set failed', err)
      }
    })

    document.getElementById('crud-delete')?.addEventListener('click', async () => {
      try {
        log('Deleting user...')
        await db.collection('users').doc({ name: 'User 1' }).delete()
        success('User deleted!')
      } catch (err) {
        error('Delete failed', err)
      }
    })

    document.getElementById('crud-delete-all')?.addEventListener('click', async () => {
      if (confirm('Delete all users?')) {
        try {
          log('Deleting all users...')
          await db.collection('users').delete()
          success('All users deleted!')
        } catch (err) {
          error('Delete failed', err)
        }
      }
    })
  }
}
