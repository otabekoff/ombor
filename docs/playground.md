---
layout: doc
title: Playground
sidebar: false
aside: false
footer: false
pageClass: playground-page
---

<script setup>
import Playground from './components/Playground.vue'
</script>
<Playground />

<div id="explanation-content">
<h1>💡 Maslahatlar</h1>

<ul>
    <li>Kod yozish uchun yuqoridagi editordan foydalaning</li>
    <li><strong>"Ishga tushirish"</strong> tugmasini bosing yoki <code>Ctrl+Enter</code> (Windows) / <code>Cmd+Enter</code> (Mac) dan foydalaning</li>
    <li>Console chiqishlarini pastdagi panelda ko'ring</li>
    <li><strong>"Tozalash"</strong> tugmasi bilan IndexedDB ma'lumotlarini o'chirishingiz mumkin</li>
    <li><strong>"Misollar"</strong> menyusidan tayyor kod namunalarini sinab ko'ring</li>
</ul>

<h2>🚀 Tezkor Misollar</h2>

<h3>Ma'lumot Qo'shish</h3>

```js
await db.collection('users').add({
  name: 'Otabek',
  age: 25,
  city: 'Toshkent'
})
```

<h3>Ma'lumotlarni O'qish</h3>

```js
const users = await db.collection('users').get()
console.log(users)
```

<h3>Filterlash</h3>

```js
const adults = await db.collection('users').orderBy('age', 'desc').limit(5).get()
```

<h3>Yangilash</h3>

```js
await db.collection('users').doc({ name: 'Otabek' }).update({
  age: 26
})
```

<h3>O'chirish</h3>

```js
await db.collection('users').doc({ name: 'Otabek' }).delete()
```

</div>

<style>
    .playground-page #VPContent > div > div > div.content {
        max-width: 100%;
        width: 100%;
        padding:0;
        margin:0;
    }
    .playground-page #VPContent > div.VPDoc {
        margin:0;
        padding:0;
    }
    .playground-page #VPContent > div.VPDoc > div.container {
        margin:0;
        padding:0;
        width:100%;
        max-width:100%;
    }
   #explanation-content {
    padding: 32px;
    max-width:740px;
    margin: 0 auto;
   } 
</style>
