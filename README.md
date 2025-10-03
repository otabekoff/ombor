# Ombor <!-- omit in toc -->

Firebasega uslubidagi, offalyn, mahalliy ma'lumotlar bazasi.

> [!NOTE]
> Learn more in detail at [Ombor Docs](otabekoff.github.io/ombor/)

Ombor sizga Firebase uslubidagi sodda, kuchli, foydalanuvchi brauzerida saqlanadigan,IndexedDB ma'lumotlar bazasida ishlashni osonlashtiradigan offlayn ma'lumotlar bazasini taqdim etadi.

Siz xohlagancha ma'lumot bazalarini yaratishingiz mumkin.

Ma'lumot bazalari Collectionlar(to'plam) va Documentlar(hujjatlar)ga birlashtirilgan (xuddi Firebase Cloud Firestore kabi).

- **Ma'lumotlar bazalarida collectionlar** mavjud (misol: `foydalanuvchilar`)
- **Collectionlarda documentlar** mavjud (misol: `{ id: 1, ism: 'Otabek', yosh: 19 }`

Ombor [LocalForage](https://github.com/localForage/localForage) yordamida tuzilgan.


## Boshlashdan avval bilib qo'yishingiz yaxshi bo'lgan atamalar.

> Atamalar... Quyida ishlatilish mumkin bo'lgan ma'nolarda keltirildi.
- **Metod (Method)** - Funksiya, amal. Masalan: `.add()`, `.get()`, `.update()` - bular metodlar.
- **Order** - Tartib. Ma'lumotlarni qanday tartibda saralash yoki ko'rsatish.
- **OrderBy** - Bo'yicha tartiblash. Ma'lumotlarni ma'lum bir maydon bo'yicha saralash metodi.
- **Ascending (asc)** - O'suvchi tartibda. Kichikdan kattaga, A dan Z gacha. Masalan: 1, 2, 3 yoki A, B, C.
- **Descending (desc)** - Kamayuvchi tartibda. Kattadan kichikka, Z dan A gacha. Masalan: 3, 2, 1 yoki Z, Y, X.
- **Key(s)** - Kalit. Har bir documentning yagona identifikatori (ID). IndexedDB da saqlash uchun ishlatiladi.
- **Limit** - Chegara, cheklash. Nechta natija qaytarishni cheklash. Masalan: `.limit(10)` - faqat 10 ta document qaytaradi.
- **Field** - Maydon. Obyektdagi xususiyat, kalit va qiymat juftligi. Masalan: `{ ism: 'Otabek' }` da `ism` - maydon, `'Otabek'` - qiymat.
- **Document** - Hujjat yoki ma'lumot. Bitta obyekt, masalan: `{ id: 1, ism: 'Otabek', yosh: 19 }`.
- **Collection** - To'plam. Documentlar to'plami. Masalan: `foydalanuvchilar` collection - barcha foydalanuvchilar ma'lumotlari.
- **Databaza yoki Database** - Ma'lumotlar bazasi. Collectionlar saqlanadigan joy. Ombor da siz bir nechta databaza yaratishingiz mumkin.
- **Add** - Qo'shish. Yangi document qo'shish.
- **Get** - Olish. Ma'lumotni o'qish, olish.
- **Update** - Yangilash. Mavjud documentning bir qismini o'zgartirish. Qolgan qismi o'zgarishsiz qoladi.
- **Set** - O'rnatish. Bu yerda qayta yozish orqali yangilash ma'nosida. Butun documentni almashtirib yozish.
- **Delete** - O'chirish. Document yoki collectionni o'chirish.
- **Overwrite** - Ustiga yozish, qayta yozish. Eski ma'lumotni to'liq yangi ma'lumot bilan almashtirish.
- **Promise** - Va'da. JavaScript'da asinxron operatsiyalarni boshqarish uchun obyekt. `.then()` va `.catch()` bilan ishlaydi.
- **Async/Await** - Asinxron/Kutmoq. Promiselar bilan ishlashning zamonaviy usuli. Kodni o'qishni osonlashtiradi.
- **Console** - Konsol. Brauzer dasturchilar vositalari (Dev Tools) da JavaScript kodi natijalarini ko'rish joyi.
- **Log** - Jurnal, yozuv. Console'ga xabar chiqarish. Masalan: `console.log('Salom')`.
- **Error** - Xatolik. Dasturda yuz bergan muammo. Masalan: `console.error('Xato yuz berdi')`.
- **Then** - Keyin. Promise muvaffaqiyatli bo'lganda bajariladigan funksiya. Masalan: `.then(natija => { ... })`.
- **Playground** - O'yin maydoni. Kodni sinab ko'rish, tajriba o'tkazish uchun interaktiv muhit. 

## Mundarija <!-- omit in toc -->

- [Ishni Boshlash](#ishni-boshlash)
  - [O'rnatish va ishga tushirish](#ornatish-va-ishga-tushirish)
    - [Script tegi yordamida](#script-tegi-yordamida)
    - [NPM bilan](#npm-bilan)
    - [NuxtJS bilan](#nuxtjs-bilan)
- [Video Darslik](#video-darslik)
- [Qisqa Kirish](#qisqa-kirish)
- [Ma'lumot Qo'shish](#malumot-qoshish)
  - [Collectionga document qo'shish](#toplamga-document-qoshish)
  - [Documentni yangilash](#documentni-yangilash)
  - [Documentni o'rnatish (ustiga yozish)](#documentni-ornatish-ustiga-yozish)
  - [Collectionni o'rnatish (ustiga yozish)](#toplamni-ornatish-ustiga-yozish)
- [Ma'lumotni olish](#malumotni-olish)
  - [Collectionni olish](#toplamni-olish)
  - [Collectionni tartiblash](#toplamni-tartiblash)
  - [Collectionni cheklash](#toplamni-checklash)
  - [Documentni olish](#documentni-olish)
- [Ma'lumotni o'chirish](#malumotni-ochirish)
  - [Documentni o'chirish](#documentni-ochirish)
  - [Collectionni o'chirish](#toplamni-ochirish)
  - [Ma'lumotlar bazasini o'chirish](#malumotlar-bazasini-ochirish)
- [Kalitlardan yuqori darajada foydalanish](#kalitlardan-yuqori-darajada-foydalanish)
  - [Document qo'shish va o'z kalitingizni kiritish](#document-qoshish-va-oz-kalitingizni-kiritish)
  - [Kalitlarni o'z ichiga olgan collectionni o'rnatish (ustiga yozish)](#kalitlarni-oz-ichiga-olgan-toplamni-ornatish-ustiga-yozish)
  - [Documentni kalit bilan olish, yangilash, o'rnatish (qayta yozish) yoki o'chirish (document mezonlari o'rniga)](#documentni-kalit-bilan-olish-yangilash-ornatish-qayta-yozish-yoki-ochirish-document-mezonlari-orniga))
  - [Collectionni olish va kalitlarni ma'lumotlar bilan birga qaytarish.](#toplamni-olish-va-kalitlarni-malumotlar-bilan-birga-qaytarish)
- [Promiselar bilan ishlash](#promiselar-bilan-ishlash)
  - [Documentni qo'shib, keyin biron ish bajarish](#documentni-qoshib-keyin-biror-narsa-qilish)
  - [Documentni yangilab, keyin biron bir ishni bajarish](#documentni-yangilab-keyin-biron-bir-ishni-bajarish)
  - [Documentni o'rnatib (ustiga yozib), keyin biron ish bajarish](#documentni-ornatib-ustiga-yozib-keyin-biror-narsa-qilish)
  - [Documentni o'chirib tashlab, keyin biron ish bajarish](#documentni-ochirib-tashlab-keyin-biror-narsa-qilish)
  - [Collectionni o'chirib tashlab, keyin biron ish bajarish](#toplamni-ochirib-tashlab-keyin-biror-narsa-qilish)
  - [Ma'lumotlar bazasini o'chirib tashlab, keyin biron ish bajarish](#malumotlar-bazasini-ochirib-tashlab-keyin-biror-narsa-qilish)
- [Async / Await](#async--await)
  - [Document qo'shish (Async Await bilan)](#document-qoshish-async-await-bilan)
  - [Documentlarni yangilash (Async Await bilan)](#documentlarni-yangilash-async-await-bilan)
  - [Documentlarni o'rnatish (ustiga yozish, Async Await bilan)](#documentlarni-ornatish-ustiga-yozish-async-await-bilan))
  - [Collectionni olish va xatolarni ushlash (Async Await bilan)](#toplamni-olish-va-xatolarni-ushlash-async-await-bilan))
- [Sozlash](#sozlash)
  - [Consoledagi Loglarni o'chirish](#consoledagi-loglarni-ochirish)
- [Playground](#playground)


## Ishni Boshlash

### O'rnatish va ishga tushirish

#### Script tegi yordamida

Ishlab chiqish (development) varianti. Ushbu variant siz proyekt ustida ishlayotgan paytingizda tekshirish uchun ancha qulayliklar yaratib beradi. Misol ucun: yangi qo'shilagan, o'zgartirilgan, o'chirilgan va hkz ma'lumotlar to'grisida sizga browseringiz dev-tools(F12 yoki CTRL+SHIFT+I) oynasining console bo'limida rang bilan ajratilgan habarlar yozish imkonini beradi.

```html
<script src="https://unpkg.com/Ombor/dist/Ombor.dev.js"></script>

<script>
  let db = new Ombor('db')
</script>

# Yoki

<script src="./Ombor.dev.js"></script>

<script>
  let db = new Ombor('db')
</script>
```

Yoki, hajmi kichiklashtirilgan, ishlab chiqarish (production) variantidan foydlaning. Bu variantni siz proyektni tamomlaganingizdan keyin foydalanuvchilarga taqdim etganingizda ishlatishingiz mumkin. Bunda, qo'shilgan, yangilangan, o'chirilgan va hkz ma'lumotlar haqida browser dev-tools console bo'limida habarlar ko'rsatilmaydi. Va ishlab chiqish variantiga qaraganda fayl hajmi kamroq bo'ladi.
```html
<script src="https://unpkg.com/Ombor/dist/Ombor.min.js"></script>

<script>
  let db = new Ombor('db')
</script>

# Yoki

<script src="./Ombor.min.js"></script>

<script>
  let db = new Ombor('db')
</script>
```



#### NPM bilan

```
npm install Ombor --save
```

```javascript
import Ombor from 'Ombor'

let db = new Ombor('db')
```

#### NuxtJS bilan
```
npm install Ombor
```

```javascript
// plugins/Ombor.js

import Ombor from 'Ombor'
let db = new Ombor('db')
export default (context,inject) => {
  inject('db', db)
}
```

```javascript
// nuxt.config.js

export default {
  ...
  plugins: [
    { src: "~/plugins/Ombor", mode: "client" }
  ],
  ...
}
```

```html
<!-- pages/index.vue -->

<script>
export default {
  head: {
    title: 'Nuxt - bosh sahifa'
  },
  mounted() {
    this.$db.collection('foydalanuvchilar').add({
      id: 1,
      ism: 'Otabek',
      yosh: 19
    })
  }
}
</script>
```

## Video Darslik

Tez kunda... Videodarslik tayyorlanmoqda.
<!-- <a href="https://www.youtube.com/watch?" target="_blank">Mening Omborni ishlatish haqidagi videoimni ko'ring</a>, 0 dan boshlab to'lliq tushuntirilgan: -->

<!-- <a href="https://www.youtube.com/watch?v=" target="_blank">
  <img src="images/va-nihoyat-Ombor.png">
</a> -->

## Qisqa Kirish

To'plamga(endilikda collection) hujjat/ma'lumot(endilikda document) qo'shish bilan boshlang. `Collection` metodida to'plam nomini kiriting (to'plam avtomatik ravishda yaratiladi), keyin `add` usuli bilan qo'shmoqchi bo'lgan documentni (ma'lumotni) kiriting: 
```javascript
db.collection('foydalanuvchilar').add({
  id: 1,
  ism: 'Otabek',
  yosh: 19
})
```
Juda ham oddiy!

Collectionga ba'zi ma'lumotlarni qo'shgandan so'ng, siz `get` metodi bilan butun collectionni olishingiz mumkin:
```javascript
db.collection('foydalanuvchilar').get().then(foydalanuvchilar => {
  console.log(foydalanuvchilar)
})

//  [
//    { id: 1, ism: 'Otabek', yosh: 19 },
//    { id: 2, ism: 'Abdulaziz', yosh: 34 }
//  ]
```

## Ma'lumot Qo'shish

### Collectionga document qo'shish

Misol uchun:

```javascript
db.collection('foydalanuvchilar').add({
  id: 1,
  ism: 'Otabek',
  yosh: 19
})
```

### Documentni yangilash

Mavjud documentni(qisman yok butunlay) yangilash mumkin. Buning uchun `update` metodidan foydalaning. Documentga mos kelish uchun faqat maydon va qiymat (odatda id) bo'lgan obyektni kiriting.

> Diqqat! agar faqat aynan qaysidir maydonlarning o'zi yangilashi kerak bo'lsa o'sha maydonlarni o'zinigina update metodi ichiga kiriting.

```javascript
db.collection('foydalanuvchilar').doc({ id: 1 }).update({
  ism: 'Abdulaziz'
})

//  [
//    { id: 1, ism: 'Abdulaziz', yosh: 19 },
//    { id: 2, ism: 'Abdulaziz', yosh: 34 }
//  ]
```

**Diqqat:** Agar siz bergan mezon bo'yicha bittadan ko'p documentlar topilsa, misol: `.doc({ ism: 'Otabek' })` bo'yicha, unday holatda **barcha** mos tushgan (topilgan) documentlar yangilanadi. 

### Documentni o'rnatish (ustiga yozish)

Mavjud documentni set() metodi orqali yangilash.
Bunda set() metodi ichida barcha yangilanishi kerak bo'lgan document maydonlari taqdim etilishi kerak. Chunki set() metodi databazadagi collection ichidagi documentga kiritilayotgan yangi maydonlarning o'zini saqlab, eski saqlangan maydonlarni o'chirib yuboradi. Va update() metodi kabi berilgan maydonlarning o'zinigina yangilab, yangisini kiritib, qolganlarini o'z holatida qoldirmaydi. Yani update metodiga o'xshamagan holda, documentni to'liq qayta yozadi. Shuning uchun barcha kerakli maydonlarni `set` metodi ichida berish kerak.

```javascript
db.collection('foydalanuvchilar').doc({ id: 2 }).set({
  id: 4, 
  ism: 'Jakhongir',
  yosh: 27
})

//  [
//    { id: 1, ism: 'Otabek', yosh: 19 },
//    { id: 4, ism: 'Jakhongir', yosh: 27 }
//  ]
```

**Diqqat:** Agar siz bergan mezon bo'yicha bittadan ko'p documentlar topilsa, misol: `.doc({ ism: 'Otabek' })` bo'yicha, unday holatda **barcha** mos tushgan (topilgan) documentlar o'rnatiladi (qayta yoziladi). 

### Collectionni o'rnatish (ustiga yozish)

<!-- Overwrite an entire collection with an array of documents. This will completely overwrite the selected collection. -->
Documentlarning to'plami bo'lgan butun collection `o'rnatish` metodi bilan qayta yozish orqali yangilanadi.


```javascript
db.collection('foydalanuvchilar')
  .set([
    {
      id: 1,
      ism: 'Abdulakhad',
      yosh: 20
    },
    {
      id: 2, 
      ism: 'Abdurahmon',
      yosh: 14
    }
  ])

//  [
//    { id: 1, ism: 'Abdulakhad', yosh: 20 },
//    { id: 2, ism: 'Abdurahmon', yosh: 14 }
//  ]
```

## Ma'lumotni olish

### Collectionni olish

Collectiondan barcha narsalarni olish. Collection arrayda qaytariladi.

```javascript
db.collection('foydalanuvchilar').get().then(foydalanuvchilar => {
  console.log(foydalanuvchilar)
})

//  [
//    { id: 1, ism: 'Ahrorxo'ja', yosh: 17 },
//    { id: 2, ism: 'Ulugbek', yosh: 18 }
//  ]
```

### Collectionni tartiblash

Collectionni olish va uni ma'lum bir maydon bo'yicha tartiblash (ascending).

> orderBy metodi ikkita argument qabul qiladi. Birinchisi, qarab tartiblanishi kerak bo'lgan maydon. Ikkinchisi, tartiblanish uslubi. Tartiblanish uslubi ikki hil: 1. asc (ascending yani yuqoriga) va desc (descending pastga) qarab tartiblash.


```javascript
db.collection('foydalanuvchilar').orderBy('yosh').get().then(foydalanuvchilar => {
  console.log('foydalanuvchilar: ', foydalanuvchilar)
})

//  [
//    { id: 2, ism: 'Otabek', yosh: 19 },
//    { id: 1, ism: 'Abdulaziz', yosh: 47 }
//  ]
```

Collectionni olish va ma'lum bir maydon bo'yicha tartiblash (descending).

```javascript
db.collection('foydalanuvchilar').orderBy('ism', 'desc').get().then(foydalanuvchilar => {
  console.log('foydalanuvchilar: ', foydalanuvchilar)
})

//  [
//    { id: 2, ism: 'Ulugbek', yosh: 18 },
//    { id: 1, ism: 'Ahrorxo'ja', yosh: 17 }
//  ]
```

### Collectionni checklash

Collection tartiblash va uni ma'lum miqdordagi documentlar bilan checklash.

```javascript
db.collection('foydalanuvchilar').orderBy('ism', 'desc').limit(1).get().then(foydalanuvchilar => {
  console.log('foydalanuvchilar: ', foydalanuvchilar)
})

//  [
//    { id: 2, ism: 'Ulugbek', yosh: 18 }
//  ]
```


### Documentni olish

Collectiondan individual documentni olish

```javascript
db.collection('foydalanuvchilar').doc({ id: 1 }).get().then(document => {
  console.log(document)
})

// { id: 1, ism: 'Abdurahmon', yosh: 14 }
```

## Ma'lumotni o'chirish

### Documentni o'chirish
Collectiondan documentni o'chirish.
```javascript
db.collection('foydalanuvchilar').doc({ id: 1 }).delete()

//  [
//    { id: 2, ism: 'Abdulaziz', yosh: 34 }
//  ]
```

**Diqqat:** Agar siz bergan mezon bo'yicha bittadan ko'p documentlar topilsa, misol: `.doc({ ism: 'Otabek' })` bo'yicha, unday holatda **barcha** mos tushgan (topilgan) documentlar o'chiriladi. 

### Collectionni o'chirish
Collectionni va undagi barcha documentlarni o'chirib tashlash.
```javascript
db.collection('foydalanuvchilar').delete()
```

### Ma'lumotlar bazasini o'chirish
Ma'lumotlar bazasi va undagi barcha documentlarni o'chirib tashlash.
```javascript
db.delete()
```

## Kalitlardan yuqori darajada foydalanish

Sizning documentlaringiz **IndexedDB storeda** `key` bilan saqlanadi:

![IndexedDB Store - Keys](images/indexed-db-keys.png)

Odatda, Ombor bu keylar uchun tasodifiy, tartiblangan, yagona IDlarni yaratadi.

Ammo siz ushbu keylarning (kalitlarning) nomini boshqarishni(o'zgartirishni) xohlashingiz mumkin. Masalan siz:
- Document qo'shganda o'z keyingizni ko'rsatishingiz.
- Uni documentlarni tanlash (olayotganda, yangilayotganda, o'rnatayotganda yoki o'chirayotganda) ishlatishingiz
- Va collectionni olayotganingizda barcha keylarni document maydonlari sifatida qaytarishingiz mumkin. Masalan quyidagidek.
```javascript
[
  {
    key: 'kalit-2',
    data: {
      { id: 2, ism: 'Abdulaziz', yosh: 34 }
    }
  },
  {
    key: 'kalit-1',
    data: {
      { id: 1, ism: 'Adxamboy', yosh: 21 }
    }
  }
]
```

Siz bularning barchasini Ombor orqali qilishingiz mumkin:

### Document qo'shish va o'z kalitingizni kiritish

<!-- After specifying your document data, pass in a key (to be used by the IndexedDB store) as a second parameter: -->
Document ma'lumotlarini kiritgandan so'ng, ikkinchi parametr sifatida (IndexedDB store tomonidan foydalaniladigan) keyni kiriting kiriting:


```javascript
db.collection('foydalanuvchilar').add({
  id: 1,
  ism: 'Otabek',
  yosh: 19
}, 'kalit-1')
```

Yoki, siz shunchaki `set` metodini ishlatishingiz mumkin:

```javascript
db.collection('foydalanuvchilar').doc('kalit-1').set({
  id: 1, 
  ism: 'Abdulakhad',
  yosh: 20
})
```

IndexedDB da quyidagicha ko'rinadi:

![IndexedDB Store - Own Keys](images/indexed-db-own-keys.png)

### Kalitlarni o'z ichiga olgan collectionni o'natish (ustiga yozish)


To'liq collectionni documentlar arrayi bilan (qayta yozish orqali) o'rnating va har bir document uchun keyni kiriting. `{keys: true}" parametri kiritganingizga ishonch hosil qiling. Bu tanlangan collectionni to'liq qayta yozadi.

```javascript
db.collection('foydalanuvchilar')
  .set([
    {
      id: 1,
      ism: 'Otabek',
      yosh: 19,
      _key: 'kalit-1'
    },
    {
      id: 2, 
      ism: 'Ulugbek',
      yosh: 18,
      _key: 'kalit-2'
    }
  ], { keys: true })
```

### Documentni kalit bilan olish, yangilash, o'rnatish (qayta yozish) yoki o'chirish (document mezonlari o'rniga)

Documentni `doc`" metodi bilan tanlayotganda, maydon nomi va qiymati ko'rsatilgan obyekt kiritish o'rniga, shunchaki key bilan string (yoki number) kiriting:
```javascript
// kalit bilan docuementni olish
db.collection('foydalanuvchilar').doc('kalit-1').get().then(document => {
  console.log(document)
})

// documentni key bilan yangilash
db.collection('foydalanuvchilar').doc('kalit-1').update({
  ism: 'Abdurahmon'
})

// documentni key bilan o'rnatish
db.collection('foydalanuvchilar').doc('kalit-2').set({
  id: 4, 
  ism: 'Adxamboy',
  yosh: 21
})

// documentni key bilan o'chirish
db.collection('foydalanuvchilar').doc('kalit-1').delete()
```


### Collectionni olish va kalitlarni ma'lumotlar bilan birga qaytarish.

Collectionni olayotganda, shunchaki `{ keys: true }` ni `get` metodi ichida yozib qo'ying:

```javascript
db.collection('foydalanuvchilar').orderBy('ism', 'desc').get({ keys: true }).then(foydalanuvchilar => {
  console.log('foydalanuvchilar: ', foydalanuvchilar)
})

//  [
  //   {
  //      key: 'kalit-2',
  //      data: {
  //        { id: 1, ism: 'Abdulaziz', yosh: 34 }
  //      }
  //    },
//    {
//      key: 'kalit-1',
//      data: {
//        { id: 2, ism: 'Otabek', yosh:  19}
//      }
//    }
//  ]
```

## Promiselar bilan ishlash

Amallar muvaffaqiyatli bo'lganida yoki xato yuz berganda, barcha operatsiyalarga promise(va'dalar)ni qo'shishingiz va biror narsa bajarishingiz mumkin.

Misol uchun databazaga yangi collection qo'shilganda, u qo'shilganligi haqida browser dev-tools console bo'limida habar chiqarishingiz mumkin.

### Documentni qo'shib, keyin biron ish bajarish

```javascript
db.collection('foydalanuvchilar')
  .add({
    id: 1,
    ism: 'Otabek',
    yosh: 47
  }, 'kalit-1')
  .then(response => {
    console.log("Qo'shish muavvafaqiyatli amalga oshdi.")
  })
  .catch(error => {
    console.log("Xatolik yuz berdi, qaytadan harakat qilib ko'ring.")
  })

// Siz xatoni add() metodi ichida object o'rniga
// string, number yoki boolean yozish bilan
// tekshirib ko'rishingiz mumkin.
```

### Documentni yangilab, keyin biron bir ishni bajarish

```javascript
db.collection('foydalanuvchilar')
  .doc({ id: 1 })
  .update({
    ism: 'Abdurahmon'
  })
  .then(response => {
    console.log('Yangilash muvaffaqiyatli amalga oshdi.')
  })
  .catch(error => {
    console.log("Xatolik yuz berdi, qaytadan harakat qilib ko'ring.")
  })
  
// Siz xatolikni update() metodi ichiga hech narsa
// yozmaslik orqali tekshirib ko'rishingiz mumkin.
```

### Documentni o'rnatib (ustiga yozib), keyin biron ish bajarish

```javascript
db.collection('foydalanuvchilar')
  .doc({ id: 1 })
  .set({
    id: 1, 
    ism: 'Ulugbek',
    yosh: 27
  })
  .then(response => {
    console.log("O\'rnatish muvaffaqiyatli amalga oshdi.")
  })
  .catch(error => {
    console.log("Xatolik yuz berdi, qaytadan harakat qilib ko'ring.")
  })

// Siz xatolikni set() metodi ichiga hech narsa
// yozmaslik orqali tekshirib ko'rishingiz mumkin.
```

### Documentni o'chirib tashlab, keyin biron ish bajarish

```javascript
db.collection('foydalanuvchilar')
  .doc({ id: 1 })
  .delete()
  .then(response => {
    console.log("O'chirish muvaffaqiyatli amalga oshdi.")
  })
  .catch(error => {
    console.log("Xatolik yuz berdi, qaytadan harakat qilib ko'ring.")
  })

  // Siz xatolikni doc() metodi ichiga hech narsa
  // yozmaslik orqali tekshirib ko'rishingiz mumkin
```

### Collectionni o'chirib tashlab, keyin biron ish bajarish

```javascript
db.collection('foydalanuvchilar')
  .delete()
  .then(response => {
    console.log("Collection muvaffaqiyatli o'chirildi.")
  })
  .catch(error => {
    console.log("Xatolik yuz berdi, boshqatdan harakat qilib ko'ring.")
  })
  
// Siz xatolikni collection() metodi ichiga hech narsa
// yozmaslik orqali tekshirib ko'rishingiz mumkin
```

### Ma'lumotlar bazasini o'chirib tashlab, keyin biron ish bajarish

```javascript
db.delete()
  .then(response => {
    console.log("Ma'lumotlar bazasi muvaffaqiyatli o'chirildi.")
  })
  .catch(error => {
    console.log("Xatolik yuz berdi, boshqatdan harakat qilib ko'ring.")
  })
  
// Eslatma: ba'zida ma'lumotlar bazasini o'chirib
// tashlaganingizda, sahifani qayta yuklamaguningizcha
// Chrome Dev-tools vositalarida o'zgarish bo'lmaydi
```

## Async / Await

Bundan tashqari, barcha operatsiyalar bilan Async / Await dan foydalanishingiz mumkin

### Document qo'shish (Async Await bilan)

```javascript
async function qoshish() {
  await db.collection('foydalanuvchilar').add({
    id: 1,
    ism: 'Otabek',
    yosh: 19
  })
  console.log("Birinchi foydalanuvchi qo'shildi")
  await db.collection('foydalanuvchilar').add({
    id: 2,
    ism: 'Abdulaziz',
    yosh: 19
  })
  console.log("Ikkinchi foydalanuvchi qo'shildi")
}
qoshish()
```

### Documentlarni yangilash (Async Await bilan)

```javascript
async function yangilash() {
  let natija = await db.collection('foydalanuvchilar')
    .doc({ id: 1 })
    .update({
      ism: 'Abdulakhad'
    })
  console.log(natija)
}
yangilash()
```

### Documentlarni o'rnatish (ustiga yozish, Async Await bilan)

```javascript
async function ornatish() {
  let natija = await db.collection('foydalanuvchilar')
    .doc({ id: 2 })
    .set({
      id: 4, 
      ism: 'Abdurahmon',
      yosh: 14
    })
    console.log(natija)
}
ornatish()
```

### Collectionni olish va xatolarni ushlash (Async Await bilan)

```javascript
async function foydalanuvchilarniOlish() {
  try {
    let foydalanuvchilar = await db.collection('foydalanuvchilar')
      .orderBy('yosh')
      .get()
    console.log('foydalanuvchilar: ', foydalanuvchilar)
  }
  catch(error) {
    console.log('xatolik: ', error)
  }
}
foydalanuvchilarniOlish()

// Siz xatolikni collection() metodi ichiga hech narsa
// yozmaslik orqali tekshirib ko'rishingiz mumkin.
```

## Sozlash

### Consoledagi Loglarni o'chirish

Odatda, Ombor ishlab chiqish (development) variantida quyidagi kabi ajoyib loglarni browserning dev-tools console bo'limida chiqarib boradi:

![Consoleda chiqadigan loglar](images/console-loglar.png)

Siz bu loglarni `db.config.debug` boolean maydonigaa `false` qiymatini berish orqali o'zgartirishingiz mumkin.

Ma'lumotlar bazasini ishga tushirgandan so'ng va boshqa biror narsa bajarishdan oldin quyidagi kodni kiritish kerak:

```javascript
import Ombor from 'Ombor'
let db = new Ombor('db')

db.config.debug = false

// Buyog'iga databaza bilan biror narsa qilish kerak
```




## Playground

🎮 **Interaktiv Playground mavjud!**

Ombor kutubxonasini brauzeringizda bevosita sinab ko'ring! Hech narsa o'rnatmasdan, kodingizni yozib, real vaqtda ishga tushiring.

### ✨ Xususiyatlar
- **Real-time kod ijrosi** - Brauzerda bevosita ishga tushirish
- **Console chiqishi** - console.log, error, warn ko'rsatish
- **6 ta tayyor misol** - CRUD operatsiyalari uchun tayyor kod namunalari
- **IndexedDB tozalash** - Ma'lumotlar bazasini tozalash funksiyasi
- **Keyboard shortcuts** - `Ctrl+Enter` / `Cmd+Enter` 
- **Responsive dizayn** - Desktop va mobile qurilmalarda ishlaydi
- **Dark/Light theme** - VitePress theme bilan mos

### 🚀 Qanday ishlatish?

#### Online (GitHub Pages)
Bevosita brauzeringizda oching:
**[https://otabekoff.github.io/ombor/playground](https://otabekoff.github.io/ombor/playground)**

#### Local (development)
```bash
# Repository'ni clone qiling
git clone https://github.com/otabekoff/ombor.git
cd ombor

# Dependencies'larni o'rnating
npm install

# Docs serverini ishga tushiring
npm run docs:dev

# Brauzerda oching
# http://localhost:5173/playground
```

### 📊 Oddiy misol

```javascript
// Ma'lumot qo'shish
const db = new Ombor('myDatabase')

await db.collection('users').add({
  name: 'Otabek',
  age: 25,
  city: 'Toshkent'
})

// Ma'lumotlarni o'qish
const users = await db.collection('users').get()
console.log('Foydalanuvchilar:', users)
```

### 💡 Tayyor misollar
Playground'da quyidagi tayyor misollar mavjud:
1. **Ma'lumot Qo'shish** - `add()` metodi bilan ishlash
2. **Ma'lumotlarni O'qish** - `get()` metodi
3. **Filterlash** - `orderBy()` va `limit()`
4. **Yangilash** - `update()` metodi
5. **O'chirish** - `delete()` metodi
6. **Murakkab Misol** - To-Do ilovasi (Full CRUD)

### 🎓 O'xshash playgroundlar
Ombor Playground quyidagi mashhur playgroundlardan ilhom oldi:
- [Kotlin Playground](https://play.kotlinlang.org/)
- [Vue Playground](https://play.vuejs.org/)
- [W3Schools Tryit Editor](https://www.w3schools.com/tryit/)

### 📚 Ko'proq ma'lumot
- [Playground hujjatlari](./PLAYGROUND.md)
- [Developer guide](./PLAYGROUND_DEVELOPMENT.md)
- [Xususiyatlar ro'yxati](./PLAYGROUND_SUMMARY.md)


## Savol yoki takliflar
Ushbu `Ombor` nomli kutubxona borasida savollar, fikrlar, e'tirozlar, Ushbu reponing `issues` bo'limida qoldiring. Shuningdex, xatoliklar bo'lsa, o'zbekcha tarjimalarni yashilash bo'yicha fikrlar bo'lsa ham yuqoridagi `issues` bo'limida qoldiring.
**Albatta javob beramiz. E'tiboringiz uchun kattakon rahmat.**

> Zero errors, zero warnings, zero vulnerabilities, zero effort.
