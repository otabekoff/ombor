<template>
  <div class="playground-container">
    <div class="playground-header">
      <div class="playground-actions">
        <select v-model="selectedExample" @change="loadExample" class="example-select">
          <option value="">-- Misolni tanlang --</option>
          <option value="add">Ma'lumot Qo'shish</option>
          <option value="get">Ma'lumotlarni O'qish</option>
          <option value="filter">Filterlash</option>
          <option value="update">Yangilash</option>
          <option value="delete">O'chirish</option>
          <option value="complex">Murakkab Misol</option>
        </select>
        <button @click="runCode" class="btn btn-run" :disabled="isRunning">
          {{ isRunning ? '⏳ Ishlamoqda...' : '▶️ Ishga tushirish' }}
        </button>
        <button @click="clearDatabase" class="btn btn-clear">
          🗑️ Tozalash
        </button>
        <button @click="resetCode" class="btn btn-reset">
          ↺ Qayta tiklash
        </button>
      </div>
    </div>

    <div class="playground-editor">
      <div class="editor-panel">
        <div class="panel-header">
          <span class="panel-title">📝 JavaScript</span>
          <span class="panel-hint">Ctrl+Enter / Cmd+Enter - ishga tushirish</span>
        </div>
        <textarea
          v-model="code"
          class="code-editor"
          spellcheck="false"
          @keydown.ctrl.enter.prevent="runCode"
          @keydown.meta.enter.prevent="runCode"
          placeholder="// Ombor kodingizni shu yerda yozing..."
        ></textarea>
      </div>

      <div class="output-panel">
        <div class="panel-header">
          <span class="panel-title">📊 Console</span>
          <button @click="clearOutput" class="btn-clear-output">Tozalash</button>
        </div>
        <div class="console-output" ref="consoleOutput">
          <div v-if="output.length === 0" class="console-empty">
            Natijalar bu yerda ko'rinadi...
          </div>
          <div
            v-for="(log, index) in output"
            :key="index"
            :class="['console-log', `console-${log.type}`]"
          >
            <span class="log-icon">{{ getLogIcon(log.type) }}</span>
            <span class="log-content">{{ formatLog(log.content) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="playground-info">
      <p>
        💡 <strong>Eslatma:</strong> Bu playground <code>ombor</code> kutubxonasini brauzeringizning IndexedDB'sida ishlatadi.
        Barcha ma'lumotlar mahalliy saqlanadi va serverga yuborilmaydi.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const code = ref('')
const output = ref([])
const isRunning = ref(false)
const selectedExample = ref('')
const consoleOutput = ref(null)
const db = ref(null)

const defaultCode = `// Ombor kutubxonasini ishlatish
const db = new Ombor('myDatabase')

// Ma'lumot qo'shish
await db.collection('users').add({
  name: 'Otabek',
  age: 25,
  city: 'Toshkent'
})

// Ma'lumotlarni o'qish
const users = await db.collection('users').get()
console.log('Foydalanuvchilar:', users)
`

const examples = {
  add: `// Ma'lumot qo'shish
const db = new Ombor('myDatabase')

// Bitta yozuv qo'shish
await db.collection('users').add({
  name: 'Ali',
  age: 30,
  email: 'ali@example.com'
})

// Ko'p yozuv qo'shish
await db.collection('users').add([
  { name: 'Vali', age: 28, email: 'vali@example.com' },
  { name: 'Guli', age: 25, email: 'guli@example.com' }
])

console.log('Ma\\'lumotlar muvaffaqiyatli qo\\'shildi! ✅')
`,
  
  get: `// Ma'lumotlarni o'qish
const db = new Ombor('myDatabase')

// Barcha ma'lumotlarni olish
const allUsers = await db.collection('users').get()
console.log('Barcha foydalanuvchilar:', allUsers)

// Bitta hujjatni olish
const user = await db.collection('users').doc({ name: 'Ali' }).get()
console.log('Bitta foydalanuvchi:', user)
`,

  filter: `// Filterlash va tartiblash
const db = new Ombor('myDatabase')

// Yoshga ko'ra kamayish tartibida
const sorted = await db.collection('users')
  .orderBy('age', 'desc')
  .get()
console.log('Tartiblangan:', sorted)

// Limitlangan natijalar
const limited = await db.collection('users')
  .orderBy('age', 'desc')
  .limit(2)
  .get()
console.log('Birinchi 2ta:', limited)
`,

  update: `// Ma'lumotni yangilash
const db = new Ombor('myDatabase')

// Bitta maydonni yangilash
await db.collection('users')
  .doc({ name: 'Ali' })
  .update({ age: 31 })

console.log('Ma\\'lumot yangilandi! ✅')

// Yangilangan ma'lumotni ko'rish
const updated = await db.collection('users').doc({ name: 'Ali' }).get()
console.log('Yangilangan foydalanuvchi:', updated)
`,

  delete: `// Ma'lumotni o'chirish
const db = new Ombor('myDatabase')

// Bitta hujjatni o'chirish
await db.collection('users')
  .doc({ name: 'Ali' })
  .delete()

console.log('Foydalanuvchi o\\'chirildi! ✅')

// Qolgan foydalanuvchilarni ko'rish
const remaining = await db.collection('users').get()
console.log('Qolgan foydalanuvchilar:', remaining)
`,

  complex: `// Murakkab misol - To-Do ilovasi
const db = new Ombor('myDatabase')

// Vazifalar qo'shish
await db.collection('todos').add([
  { title: 'Nonushta qilish', done: true, priority: 'low' },
  { title: 'Kod yozish', done: false, priority: 'high' },
  { title: 'Sport qilish', done: false, priority: 'medium' },
  { title: 'Kitob o\\'qish', done: false, priority: 'low' }
])

// Bajarilmagan vazifalarni olish
const pending = await db.collection('todos')
  .orderBy('priority', 'desc')
  .get()

const pendingTasks = pending.filter(t => !t.done)
console.log('Bajarilmagan vazifalar:', pendingTasks)

// Birinchi vazifani bajarildi qilish
if (pendingTasks.length > 0) {
  await db.collection('todos')
    .doc({ title: pendingTasks[0].title })
    .update({ done: true })
  
  console.log('Vazifa bajarildi! ✅')
}

// Statistika
const all = await db.collection('todos').get()
const completed = all.filter(t => t.done).length
console.log(\`Jami: \${all.length}, Bajarilgan: \${completed}\`)
`
}

onMounted(() => {
  code.value = defaultCode
  
  // Load Ombor library
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/ombor@latest/dist/ombor.umd.js'
  script.onload = () => {
    addLog('info', 'Ombor kutubxonasi yuklandi ✅')
  }
  script.onerror = () => {
    addLog('error', 'Ombor kutubxonasini yuklashda xatolik yuz berdi')
  }
  document.head.appendChild(script)
})

function loadExample() {
  if (selectedExample.value && examples[selectedExample.value]) {
    code.value = examples[selectedExample.value]
  }
}

function resetCode() {
  code.value = defaultCode
  selectedExample.value = ''
  addLog('info', 'Kod qayta tiklandi')
}

async function runCode() {
  if (isRunning.value) return
  
  isRunning.value = true
  clearOutput()
  
  // Intercept console methods
  const originalLog = console.log
  const originalError = console.error
  const originalWarn = console.warn
  
  console.log = (...args) => {
    addLog('log', args)
    originalLog(...args)
  }
  
  console.error = (...args) => {
    addLog('error', args)
    originalError(...args)
  }
  
  console.warn = (...args) => {
    addLog('warn', args)
    originalWarn(...args)
  }
  
  try {
    // Check if Ombor is loaded
    if (typeof window.Ombor === 'undefined') {
      throw new Error('Ombor kutubxonasi hali yuklanmagan. Bir oz kuting...')
    }
    
    // Create async function and execute
    const asyncFunction = new Function('Ombor', `
      return (async () => {
        ${code.value}
      })()
    `)
    
    await asyncFunction(window.Ombor)
    
    if (output.value.length === 0) {
      addLog('success', 'Kod muvaffaqiyatli bajarildi! ✅')
    }
  } catch (error) {
    addLog('error', `Xatolik: ${error.message}`)
  } finally {
    // Restore console methods
    console.log = originalLog
    console.error = originalError
    console.warn = originalWarn
    isRunning.value = false
  }
}

async function clearDatabase() {
  try {
    const dbName = 'myDatabase'
    const request = indexedDB.deleteDatabase(dbName)
    
    request.onsuccess = () => {
      addLog('success', 'Ma\'lumotlar bazasi tozalandi! 🗑️')
    }
    
    request.onerror = () => {
      addLog('error', 'Ma\'lumotlar bazasini tozalashda xatolik')
    }
  } catch (error) {
    addLog('error', `Xatolik: ${error.message}`)
  }
}

function clearOutput() {
  output.value = []
}

function addLog(type, content) {
  output.value.push({ type, content })
  
  // Auto scroll to bottom
  setTimeout(() => {
    if (consoleOutput.value) {
      consoleOutput.value.scrollTop = consoleOutput.value.scrollHeight
    }
  }, 10)
}

function getLogIcon(type) {
  const icons = {
    log: '📝',
    error: '❌',
    warn: '⚠️',
    info: 'ℹ️',
    success: '✅'
  }
  return icons[type] || '📝'
}

function formatLog(content) {
  if (Array.isArray(content)) {
    return content.map(item => {
      if (typeof item === 'object') {
        return JSON.stringify(item, null, 2)
      }
      return String(item)
    }).join(' ')
  }
  
  if (typeof content === 'object') {
    return JSON.stringify(content, null, 2)
  }
  
  return String(content)
}
</script>

<style scoped>
.playground-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 2rem 0;
  background: var(--vp-c-bg);
}

.playground-header {
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.playground-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.example-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  cursor: pointer;
  flex: 1;
  min-width: 200px;
}

.example-select:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-run {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.btn-run:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.btn-clear {
  background: var(--vp-c-danger-soft);
  border-color: var(--vp-c-danger-1);
  color: var(--vp-c-danger-1);
}

.btn-clear:hover {
  background: var(--vp-c-danger-1);
  color: white;
}

.btn-reset {
  background: var(--vp-c-bg-soft);
}

.playground-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--vp-c-divider);
  min-height: 500px;
}

@media (max-width: 768px) {
  .playground-editor {
    grid-template-columns: 1fr;
  }
}

.editor-panel,
.output-panel {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 14px;
}

.panel-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.panel-hint {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.btn-clear-output {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear-output:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.code-editor {
  flex: 1;
  padding: 1rem;
  border: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  tab-size: 2;
}

.code-editor::placeholder {
  color: var(--vp-c-text-3);
}

.console-output {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.console-empty {
  color: var(--vp-c-text-3);
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

.console-log {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
}

.console-log.console-error {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
}

.console-log.console-warn {
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-warning-1);
}

.console-log.console-success {
  background: var(--vp-c-success-soft);
  color: var(--vp-c-success-1);
}

.console-log.console-info {
  background: var(--vp-c-tip-soft);
  color: var(--vp-c-tip-1);
}

.log-icon {
  flex-shrink: 0;
}

.log-content {
  flex: 1;
  white-space: pre-wrap;
  word-break: break-word;
}

.playground-info {
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  font-size: 14px;
}

.playground-info p {
  margin: 0;
  color: var(--vp-c-text-2);
}

.playground-info code {
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-size: 13px;
}
</style>
