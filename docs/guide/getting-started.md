# Ishni Boshlash

Ombor - bu Firebase uslubidagi, offalyn, mahalliy ma'lumotlar bazasi.

Ombor sizga Firebase uslubidagi sodda, kuchli, foydalanuvchi brauzerida saqlanadigan, IndexedDB ma'lumotlar bazasida ishlashni osonlashtiradigan offlayn ma'lumotlar bazasini taqdim etadi.

## Asosiy tushunchalar

- **Ma'lumotlar bazalarida collectionlar** mavjud (misol: `foydalanuvchilar`)
- **Collectionlarda documentlar** mavjud (misol: `{ id: 1, ism: 'Otabek', yosh: 19 }`)

Ombor [LocalForage](https://github.com/localForage/localForage) yordamida tuzilgan.

## O'rnatish

### NPM bilan

```bash
npm install ombor
```

### Yarn bilan

```bash
yarn add ombor
```

### PNPM bilan

```bash
pnpm add ombor
```

## Ishlatish

### Oddiy misol

```javascript
import Ombor from 'ombor'

// Ma'lumotlar bazasini yaratish
let db = new Ombor('mening-db')

// Document qo'shish
db.collection('foydalanuvchilar').add({
  id: 1,
  ism: 'Otabek',
  yosh: 19
})

// Ma'lumotlarni olish
db.collection('foydalanuvchilar').get().then(foydalanuvchilar => {
  console.log(foydalanuvchilar)
  // [{ id: 1, ism: 'Otabek', yosh: 19 }]
})
```

### TypeScript bilan

```typescript
import Ombor from 'ombor'

interface Foydalanuvchi {
  id: number
  ism: string
  yosh: number
}

const db = new Ombor('mening-db')

// Type-safe qo'shish
await db.collection('foydalanuvchilar').add<Foydalanuvchi>({
  id: 1,
  ism: 'Otabek',
  yosh: 19
})

// Type-safe olish
const foydalanuvchilar = await db
  .collection('foydalanuvchilar')
  .get<Foydalanuvchi>()
```

## NuxtJS bilan

### 1. Plugin yaratish

```javascript
// plugins/ombor.js
import Ombor from 'ombor'

export default defineNuxtPlugin(() => {
  const db = new Ombor('nuxt-db')
  
  return {
    provide: {
      db
    }
  }
})
```

### 2. Nuxt config

```javascript
// nuxt.config.js
export default defineNuxtConfig({
  plugins: [
    { src: '~/plugins/ombor', mode: 'client' }
  ]
})
```

### 3. Componentda ishlatish

```vue
<template>
  <div>
    <h1>Foydalanuvchilar</h1>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.ism }} - {{ user.yosh }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const { $db } = useNuxtApp()
const users = ref([])

onMounted(async () => {
  // Ma'lumot qo'shish
  await $db.collection('foydalanuvchilar').add({
    id: 1,
    ism: 'Otabek',
    yosh: 19
  })
  
  // Ma'lumotlarni olish
  users.value = await $db.collection('foydalanuvchilar').get()
})
</script>
```

## Vue 3 bilan

```vue
<template>
  <div>
    <button @click="addUser">Foydalanuvchi qo'shish</button>
    <button @click="loadUsers">Yuklash</button>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.ism }} - {{ user.yosh }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Ombor from 'ombor'

const db = new Ombor('vue-db')
const users = ref([])

const addUser = async () => {
  await db.collection('foydalanuvchilar').add({
    id: Date.now(),
    ism: 'Yangi foydalanuvchi',
    yosh: 25
  })
  await loadUsers()
}

const loadUsers = async () => {
  users.value = await db.collection('foydalanuvchilar').get()
}

onMounted(loadUsers)
</script>
```

## Keyingi qadam

Endi siz Omborni ishlatishga tayyorsiz! Quyidagi bo'limlarni o'qib chiqing:

- [API hujjatlari](/api/introduction) - Barcha metodlar va ularning ishlatilishi
- [Misollar](/guide/examples) - Real loyihalar uchun misollar
- [Best practices](/guide/best-practices) - Eng yaxshi amaliyotlar
