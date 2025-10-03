# 🛠️ Playground Development Guide

Bu fayl Ombor Playground'ni yanada yaxshilash istagan developerlar uchun qo'llanma.

## 📁 Fayl strukturasi

```
docs/
├── playground.md                      # Asosiy sahifa
├── components/
│   └── Playground.vue                 # Vue komponenti
└── .vitepress/
    ├── config.ts                      # VitePress konfiguratsiyasi
    └── theme/
        ├── index.ts                   # Theme konfiguratsiyasi
        └── style.css                  # Global styles
```

## 🔧 Playground.vue komponenti

### Struktura

```vue
<template>
  <!-- UI elementi -->
</template>

<script setup>
  // Vue Composition API
  import { ref, onMounted } from 'vue'
  
  // State management
  const code = ref('')
  const output = ref([])
  const isRunning = ref(false)
  const selectedExample = ref('')
  
  // Functions
  function runCode() { /* ... */ }
  function clearDatabase() { /* ... */ }
  function addLog(type, content) { /* ... */ }
</script>

<style scoped>
  /* Component styles */
</style>
```

### Asosiy funksiyalar

#### 1. `runCode()`
Foydalanuvchi kodini ishga tushirish:

```javascript
async function runCode() {
  // 1. Console metodlarini intercept qilish
  const originalLog = console.log
  console.log = (...args) => {
    addLog('log', args)
    originalLog(...args)
  }
  
  // 2. Async function yaratish
  const asyncFunction = new Function('Ombor', `
    return (async () => {
      ${code.value}
    })()
  `)
  
  // 3. Ishga tushirish
  await asyncFunction(window.Ombor)
  
  // 4. Console'ni restore qilish
  console.log = originalLog
}
```

#### 2. `clearDatabase()`
IndexedDB'ni tozalash:

```javascript
async function clearDatabase() {
  const request = indexedDB.deleteDatabase('myDatabase')
  request.onsuccess = () => {
    addLog('success', 'Ma\'lumotlar bazasi tozalandi!')
  }
}
```

#### 3. `addLog(type, content)`
Console chiqishiga log qo'shish:

```javascript
function addLog(type, content) {
  output.value.push({ type, content })
  
  // Auto scroll
  setTimeout(() => {
    consoleOutput.value.scrollTop = consoleOutput.value.scrollHeight
  }, 10)
}
```

## 🎨 Styling

### CSS Variables

Playground VitePress theme variables'dan foydalanadi:

```css
.playground-container {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.btn-run {
  background: var(--vp-c-brand-1);
  color: white;
}

.console-log.console-error {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
}
```

### Responsive Design

```css
@media (max-width: 768px) {
  .playground-editor {
    grid-template-columns: 1fr; /* Stack layout */
  }
}
```

## 🚀 Yangi misol qo'shish

### 1. `examples` obyektiga qo'shing:

```javascript
const examples = {
  myExample: `// Mening yangi misolim
const db = new Ombor('myDatabase')

await db.collection('items').add({
  name: 'Item 1'
})

console.log('Qo\\'shildi!')
`
}
```

### 2. `<select>` ga option qo'shing:

```vue
<option value="myExample">Mening misolim</option>
```

## 🔧 CDN Integration

### Ombor kutubxonasini yuklash

```javascript
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/ombor@latest/dist/ombor.umd.js'
  script.onload = () => {
    addLog('info', 'Ombor kutubxonasi yuklandi ✅')
  }
  document.head.appendChild(script)
})
```

### Version pinning

Agar specific version kerak bo'lsa:

```javascript
script.src = 'https://cdn.jsdelivr.net/npm/ombor@0.0.3/dist/ombor.umd.js'
```

## 📊 Console Log Formatting

### Log tiplar

```javascript
const logTypes = {
  log: '📝',      // Oddiy log
  error: '❌',    // Xatolik
  warn: '⚠️',     // Ogohlantirish
  info: 'ℹ️',     // Ma'lumot
  success: '✅'   // Muvaffaqiyat
}
```

### JSON formatting

```javascript
function formatLog(content) {
  if (typeof content === 'object') {
    return JSON.stringify(content, null, 2) // Pretty print
  }
  return String(content)
}
```

## 🎯 Yangi feature qo'shish

### Monaco Editor integratsiyasi

1. **Paketni o'rnatish**:
```bash
npm install @monaco-editor/react
```

2. **Komponentga import qilish**:
```vue
<script setup>
import Editor from '@monaco-editor/react'
</script>

<template>
  <Editor
    v-model="code"
    language="javascript"
    theme="vs-dark"
    :options="{
      minimap: { enabled: false },
      fontSize: 14
    }"
  />
</template>
```

### URL sharing

1. **Kodini encode qilish**:
```javascript
function shareCode() {
  const encoded = btoa(code.value)
  const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`
  navigator.clipboard.writeText(url)
}
```

2. **URL'dan load qilish**:
```javascript
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const encodedCode = params.get('code')
  if (encodedCode) {
    code.value = atob(encodedCode)
  }
})
```

### Auto-save (localStorage)

```javascript
import { watch } from 'vue'

// Auto-save on code change
watch(code, (newCode) => {
  localStorage.setItem('ombor-playground-code', newCode)
}, { debounce: 500 })

// Load from localStorage
onMounted(() => {
  const saved = localStorage.getItem('ombor-playground-code')
  if (saved) {
    code.value = saved
  }
})
```

## 🧪 Testing

### Unit testing (Vitest)

```javascript
// Playground.test.js
import { mount } from '@vue/test-utils'
import Playground from './Playground.vue'

describe('Playground', () => {
  it('renders correctly', () => {
    const wrapper = mount(Playground)
    expect(wrapper.find('.playground-container').exists()).toBe(true)
  })
  
  it('runs code when button clicked', async () => {
    const wrapper = mount(Playground)
    await wrapper.find('.btn-run').trigger('click')
    // Assert console output
  })
})
```

### E2E testing (Playwright)

```javascript
// playground.spec.js
import { test, expect } from '@playwright/test'

test('playground works', async ({ page }) => {
  await page.goto('/playground')
  
  // Write code
  await page.fill('.code-editor', 'console.log("Hello")')
  
  // Click run
  await page.click('.btn-run')
  
  // Check output
  await expect(page.locator('.console-output')).toContainText('Hello')
})
```

## 📈 Performance Optimization

### Code splitting

```javascript
// Lazy load heavy components
const MonacoEditor = defineAsyncComponent(() =>
  import('./MonacoEditor.vue')
)
```

### Debounce

```javascript
import { useDebounceFn } from '@vueuse/core'

const debouncedSave = useDebounceFn(() => {
  localStorage.setItem('code', code.value)
}, 500)
```

### Virtual scrolling (console output)

```vue
<script setup>
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(
  output,
  { itemHeight: 40 }
)
</script>
```

## 🐛 Common Issues

### Issue 1: Ombor undefined

**Problem**: `Ombor is not defined`

**Solution**: Kutubxona yuklanishini kutish

```javascript
if (typeof window.Ombor === 'undefined') {
  throw new Error('Ombor kutubxonasi hali yuklanmagan')
}
```

### Issue 2: Console not showing

**Problem**: Console.log natijalar ko'rinmayapti

**Solution**: Intercept konsol metodlarini to'g'ri qilish

```javascript
// Eslatma: Arrow function ishlatmang!
console.log = function(...args) {
  addLog('log', args)
  originalLog.apply(console, args)
}
```

### Issue 3: Async/await errors

**Problem**: `await is only valid in async function`

**Solution**: Code'ni async function ichida wrap qilish

```javascript
const asyncFunction = new Function('Ombor', `
  return (async () => {
    ${code.value}  // Bu yerda await ishlatsa bo'ladi
  })()
`)
```

## 🔐 Security

### XSS Prevention

```javascript
// DON'T: eval() ishlatmang
eval(code.value) // ❌ Xavfli!

// DO: Function constructor ishlatang
new Function('Ombor', code.value) // ✅ Xavfsizroq
```

### Content Security Policy

```html
<!-- VitePress config'da -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'unsafe-eval' cdn.jsdelivr.net;">
```

## 📚 Resources

### VitePress
- [Documentation](https://vitepress.dev/)
- [Custom Theme](https://vitepress.dev/guide/custom-theme)
- [Vue in Markdown](https://vitepress.dev/guide/using-vue)

### Vue 3
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Reactivity](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)

### IndexedDB
- [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Best Practices](https://web.dev/indexeddb-best-practices/)

## 🎯 Contribution Guidelines

1. **Fork repository**
2. **Create feature branch**: `git checkout -b feature/my-feature`
3. **Make changes**
4. **Test locally**: `npm run docs:dev`
5. **Commit**: `git commit -m "feat(playground): add new feature"`
6. **Push**: `git push origin feature/my-feature`
7. **Create Pull Request**

## 📝 Code Style

```javascript
// ✅ Good
const myFunction = async () => {
  const result = await db.collection('users').get()
  return result
}

// ❌ Bad
function myFunction(){
    return db.collection('users').get().then(r=>r)
}
```

## 🚀 Deployment

Playground avtomatik deploy bo'ladi:

1. **Push to main**: `git push origin main`
2. **GitHub Actions**: `.github/workflows/deploy-docs.yml`
3. **Build**: `npm run docs:build`
4. **Deploy**: GitHub Pages

## 🎉 Happy Contributing!

Savollaringiz bo'lsa, GitHub Issues'da savol bering:
https://github.com/otabekoff/ombor/issues

---

**Ombor Playground** - sizning hissalaringiz bilan yanada yaxshilanadi! 💪
