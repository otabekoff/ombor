# API Kirish

Ombor oddiy va intuitiv API taqdim etadi. Barcha operatsiyalar Promise qaytaradi va async/await bilan ishlaydi.

## Asosiy metodlar

### Collection metodlari

| Metod | Ta'rif | Qaytadi |
|-------|--------|---------|
| `collection(name)` | Collectionni tanlaydi | Ombor |
| `add(data, key?)` | Yangi document qo'shadi | Promise |
| `get(options?)` | Barcha documentlarni oladi | Promise<Array> |
| `set(data)` | Collectionni ustiga yozadi | Promise |
| `delete()` | Collectionni o'chiradi | Promise |

### Document metodlari

| Metod | Ta'rif | Qaytadi |
|-------|--------|---------|
| `doc(criteria)` | Documentni tanlaydi | Ombor |
| `get()` | Documentni oladi | Promise<Object> |
| `update(data)` | Documentni yangilaydi | Promise |
| `set(data)` | Documentni ustiga yozadi | Promise |
| `delete()` | Documentni o'chiradi | Promise |

### Filter metodlari

| Metod | Ta'rif | Qaytadi |
|-------|--------|---------|
| `orderBy(field, direction?)` | Tartiblab qaytaradi | Ombor |
| `limit(count)` | Cheklaydi | Ombor |

## Oddiy misollar

### Ma'lumot qo'shish

```javascript
// Oddiy qo'shish
await db.collection('users').add({
  id: 1,
  name: 'John',
  email: 'john@example.com'
})

// O'z kaliti bilan
await db.collection('users').add({
  id: 1,
  name: 'John'
}, 'user-1')
```

### Ma'lumot olish

```javascript
// Barcha documentlar
const users = await db.collection('users').get()

// Tartiblangan
const sorted = await db.collection('users')
  .orderBy('name', 'asc')
  .get()

// Cheklangan
const limited = await db.collection('users')
  .orderBy('age', 'desc')
  .limit(5)
  .get()

// Bitta document
const user = await db.collection('users')
  .doc({ id: 1 })
  .get()
```

### Ma'lumot yangilash

```javascript
// Qisman yangilash
await db.collection('users')
  .doc({ id: 1 })
  .update({
    email: 'newemail@example.com'
  })

// To'liq qayta yozish
await db.collection('users')
  .doc({ id: 1 })
  .set({
    id: 1,
    name: 'John Updated',
    email: 'new@example.com'
  })
```

### Ma'lumot o'chirish

```javascript
// Document o'chirish
await db.collection('users')
  .doc({ id: 1 })
  .delete()

// Collection o'chirish
await db.collection('users').delete()

// Butun bazani o'chirish
await db.delete()
```

## Keyingi bo'limlar

Har bir metodning batafsil hujjatlari:

- [Collection metodlari](/api/collection)
- [Document metodlari](/api/document)
- [Filter metodlari](/api/filters)
- [Konfiguratsiya](/api/configuration)
