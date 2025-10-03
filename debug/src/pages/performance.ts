import { db, log, success, error } from '../main'

export const performancePage = {
  render() {
    return `
      <div class="container">
        <header>
          <h1>⚡ Performance Tests</h1>
          <p>Benchmark Ombor performance with large datasets</p>
        </header>

        <div class="controls">
          <div class="section">
            <h2>📊 Insert Performance</h2>
            <button id="perf-insert-100">Insert 100 Records</button>
            <button id="perf-insert-500">Insert 500 Records</button>
            <button id="perf-insert-1000">Insert 1000 Records</button>
          </div>

          <div class="section">
            <h2>🔍 Read Performance</h2>
            <button id="perf-read-all">Read All Records</button>
            <button id="perf-read-filtered">Read with Filter</button>
            <button id="perf-read-sorted">Read with Sort</button>
          </div>

          <div class="section">
            <h2>✏️ Update Performance</h2>
            <button id="perf-update-one">Update 1 Record</button>
            <button id="perf-update-many">Update 100 Records</button>
          </div>

          <div class="section">
            <h2>🧹 Cleanup</h2>
            <button id="perf-clear" class="danger">Clear Test Data</button>
          </div>
        </div>
      </div>
    `
  },

  init() {
    async function insertRecords(count: number) {
      const start = performance.now()

      for (let i = 0; i < count; i++) {
        await db.collection('perf_test').add({
          id: i,
          name: `User ${i}`,
          email: `user${i}@test.com`,
          age: 20 + (i % 50),
          score: Math.random() * 100,
          created: new Date().toISOString()
        })
      }

      const end = performance.now()
      const duration = end - start
      const avgTime = duration / count

      return { duration, avgTime, count }
    }

    document.getElementById('perf-insert-100')?.addEventListener('click', async () => {
      try {
        log('Inserting 100 records...')
        const result = await insertRecords(100)
        success(`✅ Inserted ${result.count} records in ${result.duration.toFixed(2)}ms`, {
          totalTime: `${result.duration.toFixed(2)}ms`,
          avgPerRecord: `${result.avgTime.toFixed(2)}ms`,
          recordsPerSecond: Math.floor(1000 / result.avgTime)
        })
      } catch (err) {
        error('Insert failed', err)
      }
    })

    document.getElementById('perf-insert-500')?.addEventListener('click', async () => {
      try {
        log('Inserting 500 records...')
        const result = await insertRecords(500)
        success(`✅ Inserted ${result.count} records in ${result.duration.toFixed(2)}ms`, {
          totalTime: `${result.duration.toFixed(2)}ms`,
          avgPerRecord: `${result.avgTime.toFixed(2)}ms`,
          recordsPerSecond: Math.floor(1000 / result.avgTime)
        })
      } catch (err) {
        error('Insert failed', err)
      }
    })

    document.getElementById('perf-insert-1000')?.addEventListener('click', async () => {
      try {
        log('Inserting 1000 records...')
        const result = await insertRecords(1000)
        success(`✅ Inserted ${result.count} records in ${result.duration.toFixed(2)}ms`, {
          totalTime: `${result.duration.toFixed(2)}ms`,
          avgPerRecord: `${result.avgTime.toFixed(2)}ms`,
          recordsPerSecond: Math.floor(1000 / result.avgTime)
        })
      } catch (err) {
        error('Insert failed', err)
      }
    })

    document.getElementById('perf-read-all')?.addEventListener('click', async () => {
      try {
        log('Reading all records...')
        const start = performance.now()
        const records = await db.collection('perf_test').get()
        const end = performance.now()

        success(`✅ Read ${records.length} records in ${(end - start).toFixed(2)}ms`, {
          count: records.length,
          time: `${(end - start).toFixed(2)}ms`
        })
      } catch (err) {
        error('Read failed', err)
      }
    })

    document.getElementById('perf-read-filtered')?.addEventListener('click', async () => {
      try {
        log('Reading with filter (age > 30)...')
        const start = performance.now()
        const all = await db.collection('perf_test').get()
        const filtered = all.filter((r: any) => r.age > 30)
        const end = performance.now()

        success(`✅ Filtered ${filtered.length} records in ${(end - start).toFixed(2)}ms`, {
          total: all.length,
          filtered: filtered.length,
          time: `${(end - start).toFixed(2)}ms`
        })
      } catch (err) {
        error('Read failed', err)
      }
    })

    document.getElementById('perf-read-sorted')?.addEventListener('click', async () => {
      try {
        log('Reading with sort (by age)...')
        const start = performance.now()
        const records = await db.collection('perf_test').orderBy('age', 'desc').get()
        const end = performance.now()

        success(`✅ Sorted ${records.length} records in ${(end - start).toFixed(2)}ms`, {
          count: records.length,
          time: `${(end - start).toFixed(2)}ms`
        })
      } catch (err) {
        error('Read failed', err)
      }
    })

    document.getElementById('perf-update-one')?.addEventListener('click', async () => {
      try {
        log('Updating 1 record...')
        const start = performance.now()
        await db.collection('perf_test').doc({ id: 0 }).update({ updated: true })
        const end = performance.now()

        success(`✅ Updated 1 record in ${(end - start).toFixed(2)}ms`)
      } catch (err) {
        error('Update failed', err)
      }
    })

    document.getElementById('perf-update-many')?.addEventListener('click', async () => {
      try {
        log('Updating 100 records...')
        const start = performance.now()

        for (let i = 0; i < 100; i++) {
          await db.collection('perf_test').doc({ id: i }).update({ updated: true, updateTime: Date.now() })
        }

        const end = performance.now()

        success(`✅ Updated 100 records in ${(end - start).toFixed(2)}ms`, {
          totalTime: `${(end - start).toFixed(2)}ms`,
          avgPerRecord: `${((end - start) / 100).toFixed(2)}ms`
        })
      } catch (err) {
        error('Update failed', err)
      }
    })

    document.getElementById('perf-clear')?.addEventListener('click', async () => {
      if (confirm('Clear all performance test data?')) {
        try {
          log('Clearing test data...')
          await db.collection('perf_test').delete()
          success('Test data cleared!')
        } catch (err) {
          error('Clear failed', err)
        }
      }
    })
  }
}
