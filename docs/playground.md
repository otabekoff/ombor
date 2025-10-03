---
layout: doc
title: Playground
---

<script setup>
import Playground from './components/Playground.vue'
</script>

# 🎮 Ombor Playground

Ombor kutubxonasini brauzeringizda bevosita sinab ko'ring! Quyida kod yozing va natijalarni real vaqtda ko'ring.

<Playground />

## 💡 Maslahatlar

- Kod yozish uchun yuqoridagi editordan foydalaning
- **"Ishga tushirish"** tugmasini bosing yoki `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac) dan foydalaning
- Console chiqishlarini pastdagi panelda ko'ring
- **"Tozalash"** tugmasi bilan IndexedDB ma'lumotlarini o'chirishingiz mumkin
- **"Misollar"** menyusidan tayyor kod namunalarini sinab ko'ring

## 🚀 Tezkor Misollar

### Ma'lumot Qo'shish
```js
await db.collection('users').add({
  name: 'Otabek',
  age: 25,
  city: 'Toshkent'
})
```

### Ma'lumotlarni O'qish
```js
const users = await db.collection('users').get()
console.log(users)
```

### Filterlash
```js
const adults = await db.collection('users')
  .orderBy('age', 'desc')
  .limit(5)
  .get()
```

### Yangilash
```js
await db.collection('users').doc({ name: 'Otabek' }).update({
  age: 26
})
```

### O'chirish
```js
await db.collection('users').doc({ name: 'Otabek' }).delete()
```
