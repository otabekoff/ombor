# ❌ Xatolikni Bartaraf Etish / Troubleshooting

## Keng tarqalgan xatoliklar va yechimlar

### 1. ❌ "localhost page can't be found" (404 Error)

**Muammo:**
```
This localhost page can't be found
http://localhost:5174/
HTTP ERROR 404
```

**Sabab:**
Siz noto'g'ri serverni ishga tushirgansiz! 

- `npm run dev` → **Library dev server** (port 5174/5175) ✗
- `npm run docs:dev` → **Documentation server** (port 5173) ✓

**Yechim:**
```bash
# Noto'g'ri ❌
npm run dev

# To'g'ri ✅
npm run docs:dev
```

**Tushuntirish:**
- `npm run dev` - Bu kutubxonani ishlab chiqish uchun (library development)
- `npm run docs:dev` - Bu dokumentatsiya va playground uchun (documentation + playground)

---

### 2. ❌ "Ombor is not a constructor"

**Muammo:**
```
❌ Xatolik: Ombor is not a constructor
```

**Sabab:**
UMD build to'g'ri eksport qilmayapti yoki CDN'dan yuklashda muammo bor.

**Yechim 1: Vite config'ni to'g'rilash**

`vite.config.ts` faylida:
```typescript
rollupOptions: {
  external: ['localforage'],
  output: {
    exports: 'default',  // 'named' emas, 'default' bo'lishi kerak
    globals: {
      localforage: 'localforage'
    }
  }
}
```

**Yechim 2: Playground komponentida handle qilish**

`docs/components/Playground.vue` faylida:
```javascript
// Get the Ombor constructor (handle both UMD patterns)
const OmborConstructor = window.Ombor.default || window.Ombor

await asyncFunction(OmborConstructor)
```

**Yechim 3: CDN URL'ni o'zgartirish**

```javascript
// jsdelivr o'rniga unpkg ishlatish
script.src = 'https://unpkg.com/ombor@latest/dist/ombor.umd.js'
```

**Rebuild kerak:**
```bash
npm run build
```

---

### 3. ⚠️ Port allaqachon ishlatilmoqda

**Muammo:**
```
Port 5173 is in use, trying another one...
Port 5174 is in use, trying another one...
```

**Yechim:**
```powershell
# PowerShell (Windows)
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Bash (Mac/Linux)
killall node
```

Keyin qayta ishga tushiring:
```bash
npm run docs:dev
```

---

### 4. ❌ "Ombor kutubxonasi hali yuklanmagan"

**Muammo:**
Console'da ko'rinadi:
```
❌ Xatolik: Ombor kutubxonasi hali yuklanmagan. Bir oz kuting...
```

**Sabab:**
CDN'dan yuklanish vaqti kerak yoki internet aloqasi yo'q.

**Yechim:**
1. **Internet aloqasini tekshiring**
2. **Sahifani yangilang** (F5 yoki Ctrl+R)
3. **Bir oz kuting** (2-3 soniya) va qayta "Ishga tushirish" bosing

**DevTools'da tekshirish:**
```javascript
// Browser console'da (F12) tekshiring:
console.log(window.Ombor)  // undefined bo'lmasligi kerak
```

---

### 5. ⚠️ IndexedDB'da ma'lumotlar ko'rinmayapti

**Muammo:**
Ma'lumot qo'shilgan, lekin DevTools > Application > IndexedDB'da ko'rinmayapti.

**Yechim:**
1. **Browser DevTools'ni oching** (F12)
2. **Application tab**ga o'ting
3. **IndexedDB**ni toping va expand qiling
4. **"myDatabase"**ni tanlang
5. **Refresh icon**ni bosing (⟳)

Agar yana ham ko'rinmasa:
```bash
# Tozalash tugmasini bosing
🗑️ Tozalash

# Keyin qayta ma'lumot qo'shing
```

---

### 6. ❌ Console chiqishi bo'sh

**Muammo:**
Kod ishga tushirildi, lekin console'da hech narsa yo'q.

**Sabab:**
- `console.log()` ishlatilmagan
- Xatolik yuz berdi va ushlandi

**Yechim:**
```javascript
// Har doim console.log qo'shing
const users = await db.collection('users').get()
console.log('Natija:', users)  // ✅ Bu yerda!
```

**Debug:**
```javascript
try {
  const users = await db.collection('users').get()
  console.log('Muvaffaqiyatli:', users)
} catch (error) {
  console.error('Xatolik:', error.message)
}
```

---

### 7. 🔄 Hot Reload ishlamayapti

**Muammo:**
Fayl o'zgartirildi, lekin brauzerda yangilanmayapti.

**Yechim:**
```bash
# Serverni to'xtatish (Ctrl+C)
# Keyin qayta ishga tushirish
npm run docs:dev
```

Yoki brauzerda:
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

---

### 8. ❌ Module not found xatoligi

**Muammo:**
```
Error: Cannot find module 'vitepress'
Error: Cannot find module '@vue/...'
```

**Yechim:**
```bash
# Dependencies'larni qayta o'rnatish
rm -rf node_modules
rm package-lock.json  # yoki yarn.lock
npm install

# Keyin qayta ishga tushirish
npm run docs:dev
```

---

### 9. ⚠️ TypeScript xatolari

**Muammo:**
```
Type 'X' is not assignable to type 'Y'
```

**Yechim:**
```bash
# Type check qilish
npm run type-check

# Agar xatoliklar bo'lsa, ularni to'g'rilash kerak
# Yoki tsconfig.json'da strict: false qilish (tavsiya etilmaydi)
```

---

### 10. 🐛 Vue component render xatoligi

**Muammo:**
```
[Vue warn]: Failed to resolve component
```

**Yechim:**

`docs/.vitepress/theme/index.ts` tekshiring:
```typescript
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  // ...
}
```

---

## 🔍 Umumiy Debug Usullari

### 1. Browser DevTools (F12)

**Console tab:**
```javascript
// Ombor yuklanganini tekshirish
console.log(window.Ombor)

// IndexedDB'ni tekshirish
indexedDB.databases().then(console.log)
```

**Application tab:**
- IndexedDB → myDatabase
- Local Storage
- Session Storage

**Network tab:**
- CDN yuklashni kuzatish
- 404 xatoliklarni topish

### 2. Terminal Loglar

```bash
# Verbose logs bilan ishga tushirish
DEBUG=* npm run docs:dev

# Yoki
npm run docs:dev -- --debug
```

### 3. Package versiyalarni tekshirish

```bash
# Node versiya
node --version  # 18+ bo'lishi kerak

# NPM versiya
npm --version   # 8+ bo'lishi kerak

# Dependencies versiyalari
npm list vitepress
npm list vue
```

---

## 📋 Quick Checklist

Playground ishlamasa, quyidagilarni tekshiring:

- [ ] To'g'ri server ishga tushirilganmi? (`npm run docs:dev`)
- [ ] Port band emasmikan? (5173)
- [ ] Internet aloqasi bormi? (CDN uchun)
- [ ] Browser console'da xatolik bormi? (F12)
- [ ] `node_modules` o'rnatilganmi? (`npm install`)
- [ ] IndexedDB yoqilganmi? (Browser settings)
- [ ] Sahifa to'liq yuklanganmi? (2-3 soniya kuting)

---

## 🆘 Yordam kerakmi?

Agar muammo hal bo'lmasa:

1. **GitHub Issues**: https://github.com/otabekoff/ombor/issues
2. **Screenshot qo'shing**: Browser console xatoligi
3. **Versiyalarni ko'rsating**: Node, NPM, Browser
4. **Steps to reproduce**: Qanday qilib xatolik yuz beradi

---

## 💡 Pro Tips

### Tezkor Restart
```bash
# alias qo'shish (PowerShell Profile)
function docs { npm run docs:dev }

# Keyin faqat
docs
```

### Port o'zgartirish
```bash
# docs:dev commandini package.json'da o'zgartiring
"docs:dev": "vitepress dev docs --port 3000"
```

### Debug Mode
```javascript
// Playground.vue'da debug qo'shish
onMounted(() => {
  console.log('🚀 Playground mounted')
  console.log('📊 Vue version:', version)
  // ...
})
```

---

**Esda saqlang:**
- ✅ Har doim `npm run docs:dev` ishlatish
- ✅ Port 5173 bo'sh ekanligini tekshirish
- ✅ Browser DevTools'dan foydalanish
- ✅ Xatoliklar haqida GitHub'da yozish

**Happy debugging! 🐛🔧**
