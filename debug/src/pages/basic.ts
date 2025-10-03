import { db, log, success, error } from '../main'

export const basicOperationsPage = {
  render() {
    return `
      <div class="page">
        <h1>Basic Operations</h1>
        <p>Test basic CRUD operations with Ombor</p>

        <div class="test-section">
          <h2>1. Add Data</h2>
          <button class="btn btn-primary" id="test-add">Add Single User</button>
          <button class="btn btn-primary" id="test-add-multiple">Add Multiple Users</button>
        </div>

        <div class="test-section">
          <h2>2. Get Data</h2>
          <button class="btn btn-primary" id="test-get-all">Get All Users</button>
          <button class="btn btn-primary" id="test-get-one">Get One User</button>
        </div>

        <div class="test-section">
          <h2>3. Update Data</h2>
          <button class="btn btn-primary" id="test-update">Update User Age</button>
        </div>

        <div class="test-section">
          <h2>4. Delete Data</h2>
          <button class="btn btn-danger" id="test-delete">Delete User</button>
          <button class="btn btn-danger" id="test-delete-all">Delete Collection</button>
        </div>
      </div>
    `
  },

  init() {
    // Add single user
    document.getElementById('test-add')?.addEventListener('click', async () => {
      try {
        log('Adding single user...')
        const result = await db.collection('users').add({
          name: 'Otabek',
          age: 25,
          city: 'Toshkent',
          role: 'Developer'
        })
        success('User added successfully!', result)
      } catch (err) {
        error('Failed to add user', err)
      }
    })

    // Add multiple users
    document.getElementById('test-add-multiple')?.addEventListener('click', async () => {
      try {
        log('Adding multiple users...')
        const users = [
          { name: 'Ali', age: 30, city: 'Samarqand', role: 'Designer' },
          { name: 'Vali', age: 28, city: 'Buxoro', role: 'Manager' },
          { name: 'Guli', age: 26, city: 'Xiva', role: 'Developer' }
        ]

        for (const user of users) {
          await db.collection('users').add(user)
        }

        success(`Added ${users.length} users successfully!`)
      } catch (err) {
        error('Failed to add users', err)
      }
    })

    // Get all users
    document.getElementById('test-get-all')?.addEventListener('click', async () => {
      try {
        log('Fetching all users...')
        const users = await db.collection('users').get()
        success(`Found ${users.length} users`, users)
      } catch (err) {
        error('Failed to get users', err)
      }
    })

    // Get one user
    document.getElementById('test-get-one')?.addEventListener('click', async () => {
      try {
        log('Fetching user with name: Otabek...')
        const user = await db.collection('users').doc({ name: 'Otabek' }).get()
        success('User found!', user)
      } catch (err) {
        error('Failed to get user', err)
      }
    })

    // Update user
    document.getElementById('test-update')?.addEventListener('click', async () => {
      try {
        log('Updating user age...')
        await db.collection('users').doc({ name: 'Otabek' }).update({ age: 26 })
        success('User updated successfully!')

        const updated = await db.collection('users').doc({ name: 'Otabek' }).get()
        log('Updated user:', updated)
      } catch (err) {
        error('Failed to update user', err)
      }
    })

    // Delete user
    document.getElementById('test-delete')?.addEventListener('click', async () => {
      try {
        log('Deleting user...')
        await db.collection('users').doc({ name: 'Ali' }).delete()
        success('User deleted successfully!')
      } catch (err) {
        error('Failed to delete user', err)
      }
    })

    // Delete collection
    document.getElementById('test-delete-all')?.addEventListener('click', async () => {
      if (confirm('Delete entire users collection?')) {
        try {
          log('Deleting users collection...')
          await db.collection('users').delete()
          success('Collection deleted successfully!')
        } catch (err) {
          error('Failed to delete collection', err)
        }
      }
    })
  }
}
