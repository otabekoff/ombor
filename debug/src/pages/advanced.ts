import { db, log, success, error } from '../main'

export const advancedPage = {
  render() {
    return `
      <div class="container">
        <header>
          <h1>🚀 Advanced Features</h1>
          <p>Advanced Ombor capabilities and edge cases</p>
        </header>

        <div class="controls">
          <div class="section">
            <h2>🔗 Complex Queries</h2>
            <button id="adv-nested">Nested Objects</button>
            <button id="adv-arrays">Array Data</button>
            <button id="adv-mixed">Mixed Data Types</button>
          </div>

          <div class="section">
            <h2>⚙️ Configuration</h2>
            <button id="adv-config">Database Config</button>
            <button id="adv-debug">Debug Mode</button>
          </div>

          <div class="section">
            <h2>🔄 Batch Operations</h2>
            <button id="adv-batch-add">Batch Add</button>
            <button id="adv-batch-update">Batch Update</button>
          </div>

          <div class="section">
            <h2>🧪 Edge Cases</h2>
            <button id="adv-empty">Empty Collection</button>
            <button id="adv-duplicate">Duplicate Data</button>
          </div>
        </div>
      </div>
    `
  },

  init() {
    document.getElementById('adv-nested')?.addEventListener('click', async () => {
      try {
        log('Testing nested objects...')
        await db.collection('advanced').add({
          name: 'User with nested data',
          profile: {
            bio: 'Developer',
            social: {
              twitter: '@user',
              github: 'user'
            }
          },
          settings: {
            theme: 'dark',
            notifications: true
          }
        })
        success('Nested object added!')
      } catch (err) {
        error('Failed', err)
      }
    })

    document.getElementById('adv-arrays')?.addEventListener('click', async () => {
      try {
        log('Testing array data...')
        await db.collection('advanced').add({
          name: 'User with arrays',
          tags: ['javascript', 'typescript', 'react'],
          scores: [85, 90, 95],
          friends: ['user1', 'user2', 'user3']
        })
        success('Array data added!')
      } catch (err) {
        error('Failed', err)
      }
    })

    document.getElementById('adv-mixed')?.addEventListener('click', async () => {
      try {
        log('Testing mixed data types...')
        await db.collection('advanced').add({
          string: 'text',
          number: 123,
          boolean: true,
          null_value: null,
          array: [1, 2, 3],
          object: { key: 'value' },
          date: new Date().toISOString()
        })
        success('Mixed data types added!')
      } catch (err) {
        error('Failed', err)
      }
    })

    document.getElementById('adv-config')?.addEventListener('click', () => {
      log('Database configuration:', {
        name: 'testDatabase',
        collections: ['users', 'products', 'orders', 'perf_test', 'advanced']
      })
    })

    document.getElementById('adv-debug')?.addEventListener('click', () => {
      log('Debug mode info - check browser console for Ombor internal logs')
    })

    document.getElementById('adv-batch-add')?.addEventListener('click', async () => {
      try {
        log('Batch adding 10 records...')
        const promises = []
        for (let i = 0; i < 10; i++) {
          promises.push(db.collection('batch').add({ id: i, value: Math.random() }))
        }
        await Promise.all(promises)
        success('Batch add completed!')
      } catch (err) {
        error('Batch add failed', err)
      }
    })

    document.getElementById('adv-batch-update')?.addEventListener('click', async () => {
      try {
        log('Batch updating records...')
        const records = await db.collection('batch').get()
        const promises = records.map((record: any) =>
          db.collection('batch').doc({ id: record.id }).update({ updated: true })
        )
        await Promise.all(promises)
        success(`Batch updated ${records.length} records!`)
      } catch (err) {
        error('Batch update failed', err)
      }
    })

    document.getElementById('adv-empty')?.addEventListener('click', async () => {
      try {
        log('Testing empty collection...')
        const empty = await db.collection('empty_collection').get()
        success(`Empty collection returned ${empty.length} items`, empty)
      } catch (err) {
        error('Failed', err)
      }
    })

    document.getElementById('adv-duplicate')?.addEventListener('click', async () => {
      try {
        log('Adding duplicate data...')
        await db.collection('duplicates').add({ name: 'Same', value: 1 })
        await db.collection('duplicates').add({ name: 'Same', value: 2 })
        await db.collection('duplicates').add({ name: 'Same', value: 3 })
        const all = await db.collection('duplicates').get()
        success(`Added duplicates, total: ${all.length}`, all)
      } catch (err) {
        error('Failed', err)
      }
    })
  }
}
