import { db, log, success, error } from '../main'

export const errorsPage = {
  render() {
    return `
      <div class="container">
        <header>
          <h1>⚠️ Error Handling</h1>
          <p>Test error scenarios and edge cases</p>
        </header>

        <div class="controls">
          <div class="section">
            <h2>❌ Invalid Operations</h2>
            <button id="err-invalid-collection">Invalid Collection Name</button>
            <button id="err-missing-doc">Missing Document</button>
            <button id="err-invalid-data">Invalid Data</button>
          </div>

          <div class="section">
            <h2>🔍 Not Found</h2>
            <button id="err-get-missing">Get Missing Record</button>
            <button id="err-update-missing">Update Missing Record</button>
            <button id="err-delete-missing">Delete Missing Record</button>
          </div>

          <div class="section">
            <h2>🚨 Edge Cases</h2>
            <button id="err-empty-query">Empty Query</button>
            <button id="err-null-values">Null Values</button>
            <button id="err-undefined">Undefined Values</button>
          </div>

          <div class="section">
            <h2>✅ Error Recovery</h2>
            <button id="err-try-catch">Try-Catch Example</button>
            <button id="err-graceful">Graceful Degradation</button>
          </div>
        </div>
      </div>
    `
  },

  init() {
    document.getElementById('err-invalid-collection')?.addEventListener('click', async () => {
      try {
        log('Testing with empty collection name...')
        // Most libraries handle this, but let's test
        await db.collection('').add({ test: 'data' })
        success('Surprisingly worked!')
      } catch (err) {
        error('Expected error caught', err)
      }
    })

    document.getElementById('err-missing-doc')?.addEventListener('click', async () => {
      try {
        log('Getting document that doesn\'t exist...')
        const result = await db.collection('users').doc({ name: 'NonExistentUser123456' }).get()
        if (result) {
          success('Found:', result)
        } else {
          log('Document not found (returned null/undefined)')
        }
      } catch (err) {
        error('Error occurred', err)
      }
    })

    document.getElementById('err-invalid-data')?.addEventListener('click', async () => {
      try {
        log('Trying to add invalid data types...')
        await db.collection('test').add({
          func: () => console.log('function'), // Functions can't be stored in IndexedDB
          symbol: Symbol('test'), // Symbols can't be stored
          circular: {} // Circular references
        })
        success('Data added (may have been serialized)')
      } catch (err) {
        error('Expected error caught', err)
      }
    })

    document.getElementById('err-get-missing')?.addEventListener('click', async () => {
      try {
        log('Getting non-existent record...')
        const result = await db.collection('nonexistent').doc({ id: 999999 }).get()
        log('Result:', result || 'null/undefined/empty')
      } catch (err) {
        error('Error occurred', err)
      }
    })

    document.getElementById('err-update-missing')?.addEventListener('click', async () => {
      try {
        log('Updating non-existent record...')
        await db.collection('users').doc({ id: 999999 }).update({ name: 'Updated' })
        success('Update completed (may have been ignored)')
      } catch (err) {
        error('Expected error', err)
      }
    })

    document.getElementById('err-delete-missing')?.addEventListener('click', async () => {
      try {
        log('Deleting non-existent record...')
        await db.collection('users').doc({ id: 999999 }).delete()
        success('Delete completed (may have been ignored)')
      } catch (err) {
        error('Expected error', err)
      }
    })

    document.getElementById('err-empty-query')?.addEventListener('click', async () => {
      try {
        log('Querying with empty criteria...')
        const result = await db.collection('users').doc({}).get()
        log('Result:', result)
      } catch (err) {
        error('Error occurred', err)
      }
    })

    document.getElementById('err-null-values')?.addEventListener('click', async () => {
      try {
        log('Adding record with null values...')
        await db.collection('test').add({
          name: 'Test',
          nullField: null,
          value: 123
        })
        success('Record with null added!')
      } catch (err) {
        error('Failed', err)
      }
    })

    document.getElementById('err-undefined')?.addEventListener('click', async () => {
      try {
        log('Adding record with undefined values...')
        await db.collection('test').add({
          name: 'Test',
          undefinedField: undefined,
          value: 123
        })
        success('Record added (undefined may be ignored)')
      } catch (err) {
        error('Failed', err)
      }
    })

    document.getElementById('err-try-catch')?.addEventListener('click', async () => {
      log('Example of proper error handling:')
      try {
        await db.collection('users').doc({ name: 'Test' }).get()
        success('Operation successful')
      } catch (err) {
        error('Caught error:', err)
        log('💡 Always wrap async operations in try-catch!')
      }
    })

    document.getElementById('err-graceful')?.addEventListener('click', async () => {
      log('Example of graceful degradation...')
      try {
        const users = await db.collection('users').get()
        if (users.length === 0) {
          log('⚠️ No users found, showing empty state')
          success('Graceful handling: Empty state displayed')
        } else {
          success(`Found ${users.length} users`)
        }
      } catch (err) {
        error('Database error', err)
        log('💡 Showing fallback UI to user')
      }
    })
  }
}
