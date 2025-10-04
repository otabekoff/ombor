# 🔧 Process.env UMD Build Fix

**Sana / Date:** 2025-10-03  
**Issue:** `ReferenceError: process is not defined` in browser  
**Status:** ✅ Resolved

---

## ❌ Muammo / Problem

### Xatolik
```javascript
ombor.umd.js:6  Uncaught (in promise) ReferenceError: process is not defined
    at ombor.umd.js:6
    at eval (VM601:9)
    at runCode (Playground.vue:304)
```

### Sabab / Root Cause

**1. `process.env` browser'da mavjud emas**

Browser muhitida Node.js'ning `process` obyekti mavjud emas. Lekin bizning source code'da ishlatilgan:

```javascript
// src/utils/logger.js
if (process.env.NODE_ENV == 'development' && this.config.debug) {
  console.log('%cOmbor', style, message)
}
```

**2. UMD build'da `process` defined emas**

Vite build process'da `process.env` ni replace qilmagan.

---

## ✅ Yechim / Solution

### Fix 1: Logger.js - Safe Process Check

`src/utils/logger.js` faylida `process` mavjudligini tekshiramiz:

#### ❌ Oldin (Before)
```javascript
if (process.env.NODE_ENV == 'development' && this.config.debug) {
  console.log('%cOmbor', style, message)
}
```

#### ✅ Hozir (After)
```javascript
// Safe check for both Node and browser environments
const isDev = typeof process !== 'undefined' && 
              process.env && 
              process.env.NODE_ENV === 'development'

if (isDev && this.config.debug) {
  console.log('%cOmbor', style, message)
}
```

**Tushuntirish:**
1. `typeof process !== 'undefined'` - process mavjudligini tekshirish
2. `process.env` - process.env mavjudligini tekshirish
3. `process.env.NODE_ENV === 'development'` - development mode'ni tekshirish

---

### Fix 2: Vite Config - Define Process.env

`vite.config.ts` faylida `process.env` ni define qildik:

#### ✅ Qo'shildi
```typescript
export default defineConfig({
  plugins: [...],
  define: {
    // Define process.env for UMD build (browser compatibility)
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  build: {...}
})
```

**Tushuntirish:**
- Vite build vaqtida `process.env.NODE_ENV` ni literal string bilan replace qiladi
- Browser'da `process.env.NODE_ENV` o'rniga `"production"` yoziladi

---

### Fix 3: Rollup Output - Auto Exports

`vite.config.ts` da export strategiyasini to'g'riladik:

#### ❌ Oldin
```typescript
output: {
  exports: 'default',  // Error: named exports ham bor
  globals: {...}
}
```

#### ✅ Hozir
```typescript
output: {
  exports: 'auto',  // Rollup o'zi hal qiladi
  globals: {...}
}
```

**Natija:**
- Build muvaffaqiyatli
- Warning: `Ombor.default` ishlatish kerak
- Playground'da handle qilingan

---

### Fix 4: Playground - Handle UMD Export

`docs/components/Playground.vue` da UMD export pattern'larini handle qilamiz:

```javascript
omborScript.onload = () => {
  if (window.Ombor) {
    if (typeof window.Ombor === 'function') {
      // Direct constructor
      addLog('info', 'Ombor kutubxonasi yuklandi ✅')
    } else if (window.Ombor.default && typeof window.Ombor.default === 'function') {
      // UMD exports as Ombor.default
      window.Ombor = window.Ombor.default
      addLog('info', 'Ombor kutubxonasi yuklandi ✅')
    }
  }
}

// In runCode()
const OmborConstructor = window.Ombor.default || window.Ombor
await asyncFunction(OmborConstructor)
```

---

## 📊 O'zgartirilgan Fayllar / Files Changed

| Fayl | O'zgarish | Sabab |
|------|-----------|-------|
| `src/utils/logger.js` | Safe `process` check | Browser compatibility |
| `vite.config.ts` | Added `define` | Define process.env for UMD |
| `vite.config.ts` | `exports: 'auto'` | Handle mixed exports |
| `docs/components/Playground.vue` | Handle `.default` | UMD export pattern |

---

## 🧪 Testing

### 1. Build Test
```bash
npm run build
```

**Natija:**
```
✓ 28 modules transformed.
dist/ombor.es.js  21.72 kB
dist/ombor.umd.js  15.79 kB
✓ built in 3.10s
```

### 2. Browser Test
```javascript
// Browser console'da
console.log(window.Ombor)           // ✅ Function (constructor)
console.log(typeof window.Ombor)   // ✅ "function"

const db = new Ombor('testDB')      // ✅ Works!
```

### 3. Playground Test
1. Open /playground (on development server)
2. Run default code
3. ✅ No errors in console
4. ✅ "Ombor kutubxonasi yuklandi ✅" message
5. ✅ Code executes successfully

---

## 🔍 Debugging Guide

### Check 1: Process Defined?
```javascript
// Browser console
console.log(typeof process)  // Should be "undefined" or "object"
```

### Check 2: UMD Export Pattern
```javascript
// Browser console (after loading)
console.log(window.Ombor)         // Constructor or object?
console.log(window.Ombor.default) // If object, check .default
```

### Check 3: Build Output
```bash
# Check the dist/ombor.umd.js file
# Search for "process.env" - should be replaced with literal string
grep "process.env" dist/ombor.umd.js
```

---

## 💡 Best Practices

### 1. Safe Environment Checks
```javascript
// ✅ Good: Safe check
const isDev = typeof process !== 'undefined' && 
              process.env && 
              process.env.NODE_ENV === 'development'

// ❌ Bad: Assumes process exists
if (process.env.NODE_ENV === 'development') { ... }
```

### 2. Vite Define Plugin
```typescript
// Always define environment variables for UMD builds
define: {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  'process.env.DEBUG': JSON.stringify(process.env.DEBUG || 'false')
}
```

### 3. Handle Mixed Exports
```javascript
// Handle both patterns
const Constructor = window.Library.default || window.Library
```

---

## 📚 Related Documentation

### Vite
- [Define Option](https://vitejs.dev/config/shared-options.html#define)
- [Library Mode](https://vitejs.dev/guide/build.html#library-mode)

### Rollup
- [Output Exports](https://rollupjs.org/configuration-options/#output-exports)
- [Output Globals](https://rollupjs.org/configuration-options/#output-globals)

### UMD Pattern
- [Universal Module Definition](https://github.com/umdjs/umd)
- [Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

## 🚀 Deployment Checklist

- [x] Fix logger.js with safe process check
- [x] Add define to vite.config.ts
- [x] Change exports to 'auto'
- [x] Update Playground to handle .default
- [x] Build successfully
- [x] Test in browser
- [x] Test in Playground
- [ ] Commit changes
- [ ] Push to GitHub
- [ ] Publish new version to NPM
- [ ] Update CDN cache

---

## 🔄 Version Updates

### Before (v0.0.3)
```javascript
❌ ReferenceError: process is not defined
❌ Build fails with exports: 'default'
```

### After (v0.0.4 - planned)
```javascript
✅ process check is safe
✅ Build succeeds with exports: 'auto'
✅ UMD works in browser
✅ Playground fully functional
```

---

## 📝 Commit Message Template

```
fix(build): resolve process.env error in UMD browser build

BREAKING: UMD consumers need to use Ombor.default pattern

Changes:
- src/utils/logger.js: Add safe process check for browser compatibility
- vite.config.ts: Define process.env.NODE_ENV for UMD build
- vite.config.ts: Change exports to 'auto' for mixed export support
- Playground.vue: Handle both Ombor and Ombor.default patterns

Fixes:
- ReferenceError: process is not defined in browser
- Build error with mixed default/named exports

Testing:
- npm run build: ✅ Success
- Browser console: ✅ No errors
- Playground: ✅ Fully functional

Closes #XX
```

---

## ✅ Xulosa / Conclusion

**Muammo:** `process.env` browser'da mavjud emas  
**Yechim:** Safe check + Vite define + UMD export handling  
**Natija:** ✅ To'liq ishlaydi

**Next Steps:**
1. Version bump: `0.0.3` → `0.0.4`
2. NPM publish
3. Update documentation
4. Notify users

---

**Status:** ✅ Production Ready  
**Last Updated:** 2025-10-03  
**Tested:** Browser, Playground, Build
