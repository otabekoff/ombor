# 🎮 Ombor Playground

Ombor kutubxonasining interaktiv playgroundi - Kotlin Playground, W3Schools va Vue Playground'dan ilhomlanib yaratilgan!

## ✨ Xususiyatlar

### 🚀 Real vaqt ijrosi
- Kodingizni brauzerda bevosita yozib, ishga tushiring
- Hech qanday server talab qilinmaydi - hammasi mahalliy ishlaydi
- IndexedDB'da real ma'lumotlar bilan ishlash

### 📝 Kod editoru
- Sintaksisga oid yordam
- `Ctrl+Enter` / `Cmd+Enter` bilan tezkor ishga tushirish
- To'liq qatorli JavaScript/ES6+ qo'llab-quvvatlash
- Async/await qo'llab-quvvatlash

### 📊 Console chiqishi
- Real vaqtda console.log natijalarini ko'rish
- Xatoliklarni chiroyli ko'rinishda ko'rsatish
- JSON obyektlarini formatted holda ko'rsatish
- Turli xil log tiplari: log, error, warn, success, info

### 🎯 Tayyor misollar
Quyidagi tayyor misollarni sinab ko'ring:
- **Ma'lumot Qo'shish**: Bitta yoki ko'p yozuvlarni qo'shish
- **Ma'lumotlarni O'qish**: Collection va documentlarni o'qish
- **Filterlash**: orderBy va limit bilan ishlash
- **Yangilash**: Mavjud ma'lumotlarni yangilash
- **O'chirish**: Ma'lumotlarni o'chirish
- **Murakkab Misol**: To-Do ilovasi misolida to'liq CRUD operatsiyalari

### 🛠️ Yordamchi asboblar
- **Tozalash tugmasi**: IndexedDB ma'lumotlarini butunlay o'chirish
- **Qayta tiklash**: Boshlang'ich kodga qaytish
- **Misollar menyusi**: Tez misollarni yuklash

## 🎨 Dizayn

Playground VitePress'ning dark/light theme'lari bilan to'liq mos keladi va responsive dizaynga ega:
- Desktop: Split-screen layout (Editor + Console)
- Mobile: Stack layout (Editor ustida, Console pastda)

## 🔧 Texnik tafsilotlar

### Texnologiyalar
- **Vue 3**: Playground komponenti Vue 3 Composition API bilan qurilgan
- **VitePress**: Hujjatlar frameworki
- **IndexedDB**: Brauzerda ma'lumotlarni saqlash
- **Ombor**: Sizning kutubxonangiz! (CDN orqali yuklanadi)

### CDN Integration
Playground Ombor kutubxonasini CDN orqali yuklaydi:
```html
<script src="https://cdn.jsdelivr.net/npm/ombor@latest/dist/ombor.umd.js"></script>
```

Bu foydalanuvchilarga eng so'nggi versiyani ko'rishga imkon beradi.

## 📱 Foydalanish

1. **Docs serverini ishga tushiring**:
   ```bash
   npm run docs:dev
   ```

2. **Playgroundni oching**:
   - Brauzerda: http://localhost:5173/playground (yoki ko'rsatilgan portda)
   - Navigatsiyada "🎮 Playground" tugmasini bosing

3. **Kod yozing va ishga tushiring**:
   - Editorga kodingizni yozing
   - "▶️ Ishga tushirish" tugmasini bosing
   - Yoki `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac) bosing
   - Console panelida natijalarni ko'ring

## 🌟 Misollar

### Oddiy misol
```javascript
const db = new Ombor('myDatabase')

await db.collection('users').add({
  name: 'Otabek',
  age: 25
})

const users = await db.collection('users').get()
console.log('Foydalanuvchilar:', users)
```

### Murakkab misol
```javascript
const db = new Ombor('myDatabase')

// Ko'p ma'lumot qo'shish
await db.collection('products').add([
  { name: 'Laptop', price: 1000, category: 'Electronics' },
  { name: 'Phone', price: 500, category: 'Electronics' },
  { name: 'Book', price: 20, category: 'Education' }
])

// Filterlash va tartiblash
const expensive = await db.collection('products')
  .orderBy('price', 'desc')
  .limit(2)
  .get()

console.log('Eng qimmat 2ta mahsulot:', expensive)

// Yangilash
await db.collection('products')
  .doc({ name: 'Laptop' })
  .update({ price: 900 })

console.log('Narx yangilandi!')
```

## 🚀 Kelajak rejalar

- [ ] Kod namunalarini URL orqali ulashish
- [ ] Kod tarixini saqlash (localStorage)
- [ ] Multiple tabs (HTML, CSS, JS)
- [ ] Syntax highlighting (Monaco Editor integratsiyasi)
- [ ] Auto-save funksiyasi
- [ ] Database viewer panel (mavjud ma'lumotlarni ko'rish)
- [ ] Export/Import qo'llab-quvvatlash
- [ ] Code snippets library
- [ ] Collaborative editing (real-time)

## 🎓 O'xshash playgroundlar

Ombor Playground quyidagi mashhur playgroundlardan ilhom oldi:
- [Kotlin Playground](https://play.kotlinlang.org/)
- [Vue Playground](https://play.vuejs.org/)
- [W3Schools Tryit Editor](https://www.w3schools.com/tryit/)
- [CodePen](https://codepen.io/)
- [JSFiddle](https://jsfiddle.net/)

## 💡 Foydalanuvchi uchun maslahatlar

1. **Kod yozishda qulaylik**: Editor Tab tugmasini qo'llab-quvvatlaydi (2 space)
2. **Tez ishga tushirish**: `Ctrl+Enter` yoki `Cmd+Enter` tugmachalar kombinatsiyasi
3. **Ma'lumotlarni tozalash**: "🗑️ Tozalash" tugmasi bilan IndexedDB'ni butunlay tozalang
4. **Misollardan foydalanish**: Yuqoridagi dropdown menyudan tayyor misollarni tanlang
5. **Console chiqishi**: Har xil rang kodlari bilan turli xil log tiplarini ajratib ko'ring

## 🔗 Linklar

- **Playground**: `/playground` (hujjatlar saytida)
- **GitHub**: https://github.com/otabekoff/ombor
- **NPM**: https://www.npmjs.com/package/ombor
- **Documentation**: https://otabekoff.github.io/ombor/

---

**Ombor Playground** - kodingizni sinash va o'rganish uchun eng oson yo'l! 🚀
