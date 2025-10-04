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
        <div class="code-editor-wrapper">
          <pre class="code-highlight" v-html="highlightedCode"></pre>
          <textarea
            v-model="code"
            class="code-editor"
            spellcheck="false"
            @keydown.ctrl.enter.prevent="runCode"
            @keydown.meta.enter.prevent="runCode"
            @input="updateHighlight"
            @scroll="syncScroll"
            ref="codeTextarea"
            placeholder="// Ombor kodingizni shu yerda yozing..."
          ></textarea>
        </div>
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
            <pre class="log-content" v-html="formatLog(log.content)"></pre>
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
import { ref, computed, onMounted } from 'vue'

const code = ref('')
const output = ref([])
const isRunning = ref(false)
const selectedExample = ref('')
const consoleOutput = ref(null)
const codeTextarea = ref(null)
const db = ref(null)

const highlightedCode = computed(() => {
  return highlightJS(code.value)
})

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

  // Load LocalForage first (Ombor dependency)
  const localforageScript = document.createElement('script')
  localforageScript.src = 'https://unpkg.com/localforage@1.10.0/dist/localforage.min.js'

  localforageScript.onload = () => {
    // Now load Ombor after LocalForage is loaded
    const omborScript = document.createElement('script')
    // Smart CDN selection with fallback
    // - For local development/preview: use local fixed build
    // - For production (GitHub Pages): use CDN with fallback
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    if (isLocalhost) {
      // Use local build for development/preview
      omborScript.src = '/ombor.umd.js'  // Served from docs/public/
      addLog('info', '🔧 Ishlab chiqish rejimi: Mahalliy Ombor versiyasi')
    } else {
      // Use CDN for production (v0.0.7 has the process.env fix)
      omborScript.src = 'https://cdn.jsdelivr.net/npm/ombor@latest/dist/ombor.umd.js'
      addLog('info', '🌐 Ishlab chiqarish rejimi: CDN Ombor versiyasi')
    }

    omborScript.onload = () => {
      // Handle named export (Ombor.Ombor pattern for UMD)
      if (window.Ombor) {
        if (typeof window.Ombor === 'function') {
          // Direct constructor
          addLog('info', 'Ombor kutubxonasi yuklandi ✅')
        } else if (window.Ombor.Ombor && typeof window.Ombor.Ombor === 'function') {
          // UMD named export: window.Ombor.Ombor
          window.Ombor = window.Ombor.Ombor
          addLog('info', 'Ombor kutubxonasi yuklandi ✅')
        } else {
          addLog('error', 'Ombor constructor topilmadi')
          console.log('window.Ombor:', window.Ombor)
        }
      } else {
        addLog('error', 'Ombor eksporti topilmadi')
      }
    }

    omborScript.onerror = () => {
      // Try fallback CDN (unpkg)
      addLog('warn', 'jsDelivr CDN bilan muammo, unpkg\'dan yuklanmoqda...')

      const fallbackScript = document.createElement('script')
      fallbackScript.src = 'https://unpkg.com/ombor@latest/dist/ombor.umd.js'

      fallbackScript.onload = () => {
        // Handle named export (same logic as above)
        if (window.Ombor) {
          if (typeof window.Ombor === 'function') {
            addLog('info', 'Ombor kutubxonasi yuklandi (unpkg CDN) ✅')
          } else if (window.Ombor.Ombor && typeof window.Ombor.Ombor === 'function') {
            window.Ombor = window.Ombor.Ombor
            addLog('info', 'Ombor kutubxonasi yuklandi (unpkg CDN) ✅')
          } else {
            addLog('error', 'Ombor constructor topilmadi')
          }
        } else {
          addLog('error', 'Ombor eksporti topilmadi')
        }
      }

      fallbackScript.onerror = () => {
        addLog('error', 'Ombor kutubxonasini yuklashda xatolik yuz berdi')
        addLog('info', 'Internetga ulanganingizni tekshiring yoki sahifani yangilang')
        addLog('info', 'Yoki ombor@latest NPM paketida muammo bo\'lishi mumkin')
      }

      document.head.appendChild(fallbackScript)
    }

    document.head.appendChild(omborScript)
  }

  localforageScript.onerror = () => {
    addLog('error', 'LocalForage kutubxonasini yuklashda xatolik')
  }

  document.head.appendChild(localforageScript)
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
    // Filter out Ombor internal logs (styled with %c)
    if (args[0] !== '%cOmbor') {
      addLog('log', args)
    }
    originalLog(...args)
  }

  console.error = (...args) => {
    // Filter out Ombor internal logs
    if (args[0] !== '%cOmbor') {
      addLog('error', args)
    }
    originalError(...args)
  }

  console.warn = (...args) => {
    // Filter out Ombor internal logs
    if (args[0] !== '%cOmbor') {
      addLog('warn', args)
    }
    originalWarn(...args)
  }

  try {
    // Check if Ombor is loaded
    if (typeof window.Ombor === 'undefined') {
      throw new Error('Ombor kutubxonasi hali yuklanmagan. Bir oz kuting...')
    }

    // Get the Ombor constructor (handle UMD named export)
    const OmborConstructor = (window.Ombor && window.Ombor.Ombor) || window.Ombor

    // Create async function and execute
    const asyncFunction = new Function('Ombor', `
      return (async () => {
        ${code.value}
      })()
    `)

    await asyncFunction(OmborConstructor)

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
        return syntaxHighlightJSON(JSON.stringify(item, null, 2))
      }
      return escapeHtml(String(item))
    }).join(' ')
  }

  if (typeof content === 'object') {
    return syntaxHighlightJSON(JSON.stringify(content, null, 2))
  }

  return escapeHtml(String(content))
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function syntaxHighlightJSON(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
    let cls = 'json-number'
    if (match.startsWith('"')) {
      if (match.endsWith(':')) {
        cls = 'json-key'
      } else {
        cls = 'json-string'
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean'
    } else if (/null/.test(match)) {
      cls = 'json-null'
    }
    return '<span class="' + cls + '">' + match + '</span>'
  })
}

function highlightJS(code) {
  // Escape HTML
  const escapeHtml = (str) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  let result = ''
  let i = 0

  while (i < code.length) {
    // Check for comments
    if (code[i] === '/' && code[i + 1] === '/') {
      let comment = ''
      while (i < code.length && code[i] !== '\n') {
        comment += code[i]
        i++
      }
      result += '<span class="js-comment">' + escapeHtml(comment) + '</span>'
      continue
    }

    // Check for strings
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i]
      let str = quote
      i++
      while (i < code.length) {
        if (code[i] === '\\' && i + 1 < code.length) {
          str += code[i] + code[i + 1]
          i += 2
          continue
        }
        if (code[i] === quote) {
          str += code[i]
          i++
          break
        }
        str += code[i]
        i++
      }
      result += '<span class="js-string">' + escapeHtml(str) + '</span>'
      continue
    }

    // Check for numbers
    if (/\d/.test(code[i])) {
      let num = ''
      while (i < code.length && /[\d.]/.test(code[i])) {
        num += code[i]
        i++
      }
      result += '<span class="js-number">' + escapeHtml(num) + '</span>'
      continue
    }

    // Check for keywords and identifiers
    if (/[a-zA-Z_$]/.test(code[i])) {
      let word = ''
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
        word += code[i]
        i++
      }

      const keywords = ['await', 'async', 'const', 'let', 'var', 'function', 'return',
        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
        'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'import',
        'export', 'default', 'from', 'as', 'typeof', 'instanceof', 'in', 'of',
        'this', 'super', 'static', 'get', 'set', 'delete', 'void', 'yield', 'debugger']

      const booleans = ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']

      if (keywords.includes(word)) {
        result += '<span class="js-keyword">' + escapeHtml(word) + '</span>'
      } else if (booleans.includes(word)) {
        result += '<span class="js-boolean">' + escapeHtml(word) + '</span>'
      } else {
        result += escapeHtml(word)
      }
      continue
    }

    // Regular character
    result += escapeHtml(code[i])
    i++
  }

  return result
}

function syncScroll(event) {
  const highlight = event.target.previousElementSibling
  if (highlight) {
    highlight.scrollTop = event.target.scrollTop
    highlight.scrollLeft = event.target.scrollLeft
  }
}

function updateHighlight() {
  // Computed property will handle this automatically
}
</script>

<style scoped>
.playground-container {
  /* border: 1px solid var(--vp-c-divider); */
  /* border-radius: 8px; */
  overflow: hidden;
  /* margin: 2rem 0; */
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

.code-editor-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.code-highlight {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  margin: 0;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow: auto;
  white-space: pre;
  word-wrap: normal;
  pointer-events: none;
  tab-size: 2;
  z-index: 1;
}

.code-editor {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: none;
  background: transparent;
  color: transparent;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  tab-size: 2;
  overflow: auto;
  caret-color: var(--vp-c-text-1);
  z-index: 2;
}

.code-editor::placeholder {
  color: var(--vp-c-text-3);
}

/* JavaScript Syntax Highlighting */
.code-highlight :deep(.js-keyword) {
  color: #c678dd;
  font-weight: 600;
}

.code-highlight :deep(.js-string) {
  color: #98c379;
}

.code-highlight :deep(.js-number) {
  color: #d19a66;
}

.code-highlight :deep(.js-boolean) {
  color: #56b6c2;
  font-weight: 600;
}

.code-highlight :deep(.js-function) {
  color: #61afef;
}

.code-highlight :deep(.js-comment) {
  color: #5c6370;
  font-style: italic;
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
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* JSON Syntax Highlighting */
.log-content :deep(.json-key) {
  color: #e06c75;
  font-weight: 500;
}

.log-content :deep(.json-string) {
  color: #98c379;
}

.log-content :deep(.json-number) {
  color: #d19a66;
}

.log-content :deep(.json-boolean) {
  color: #56b6c2;
  font-weight: 500;
}

.log-content :deep(.json-null) {
  color: #c678dd;
  font-weight: 500;
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
