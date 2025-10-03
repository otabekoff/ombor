# Security Policy | Xavfsizlik Siyosati

## Supported Versions | Qo'llab-quvvatlanadigan Versiyalar

We release patches for security vulnerabilities for the following versions:

Biz quyidagi versiyalar uchun xavfsizlik zaifliklariga patch'lar chiqaramiz:

| Version | Supported | Qo'llab-quvvatlanadi |
| ------- | --------- | -------------------- |
| 0.0.5   | ✅ Yes    | ✅ Ha                |
| 0.0.4   | ✅ Yes    | ✅ Ha                |
| 0.0.3   | ⚠️ Limited | ⚠️ Cheklangan       |
| < 0.0.3 | ❌ No     | ❌ Yo'q              |

## Reporting a Vulnerability | Zaiflikni Xabar Qilish

**Please do not report security vulnerabilities through public GitHub issues.**

**Iltimos, xavfsizlik zaifliklarini ommaviy GitHub issues orqali xabar qilmang.**

Instead, please report them via email to:

O'rniga, ularni quyidagi email orqali xabar qiling:

**Email:** mohirlab@gmail.com

### What to Include | Nimalarni Kiritish Kerak

Please include as much of the following information as possible:

Iltimos, quyidagi ma'lumotlardan imkon qadar ko'proq kiriting:

* **Type of vulnerability** | Zaiflik turi
* **Full paths of source file(s) related to the vulnerability** | Zaiflikka aloqador manba fayl(lar)ning to'liq yo'li
* **Location of the affected source code** (tag/branch/commit or direct URL) | Ta'sirlangan manba kodining joylashuvi (tag/branch/commit yoki to'g'ridan-to'g'ri URL)
* **Step-by-step instructions to reproduce the issue** | Muammoni takrorlash uchun qadam-baqadam ko'rsatmalar
* **Proof-of-concept or exploit code** (if possible) | Proof-of-concept yoki exploit kodi (agar mumkin bo'lsa)
* **Impact of the vulnerability** | Zaiflikning ta'siri
* **Any possible mitigations you've identified** | Siz aniqlagan har qanday mumkin bo'lgan yengillashtirish

### Response Timeline | Javob Vaqt Jadval

* **Initial Response** | Dastlabki Javob: Within 48 hours | 48 soat ichida
* **Status Update** | Holat Yangilanishi: Within 7 days | 7 kun ichida
* **Fix Timeline** | Tuzatish Vaqti:
  - **Critical**: 1-3 days | Kritik: 1-3 kun
  - **High**: 7-14 days | Yuqori: 7-14 kun
  - **Medium**: 14-30 days | O'rtacha: 14-30 kun
  - **Low**: 30-90 days | Past: 30-90 kun

## Security Best Practices | Xavfsizlik Eng Yaxshi Amaliyotlari

When using Ombor, we recommend:

Ombor'dan foydalanganda biz tavsiya qilamiz:

### 1. Data Validation | Ma'lumotlarni Tekshirish

```javascript
// Always validate user input before storing
// Saqlashdan oldin har doim foydalanuvchi kiritmasini tekshiring
function validateUser(user) {
  if (!user.name || typeof user.name !== 'string') {
    throw new Error('Invalid user name')
  }
  if (!user.age || typeof user.age !== 'number') {
    throw new Error('Invalid user age')
  }
  return true
}

const user = { name: 'Otabek', age: 25 }
if (validateUser(user)) {
  await db.collection('users').add(user)
}
```

### 2. Sensitive Data | Maxfiy Ma'lumotlar

```javascript
// Never store sensitive data in plain text
// Hech qachon maxfiy ma'lumotlarni oddiy matnda saqlamang

// ❌ BAD - Don't do this | YOMON - Buni qilmang
await db.collection('users').add({
  name: 'Otabek',
  password: 'mypassword123' // Plain text password!
})

// ✅ GOOD - Hash sensitive data first | YAXSHI - Avval maxfiy ma'lumotlarni hashlang
import { hash } from 'bcrypt'
const hashedPassword = await hash('mypassword123', 10)
await db.collection('users').add({
  name: 'Otabek',
  password: hashedPassword // Hashed password
})
```

### 3. Input Sanitization | Kiritishni Tozalash

```javascript
// Sanitize user input to prevent injection attacks
// Injection hujumlarini oldini olish uchun foydalanuvchi kiritmasini tozalang
function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '')
  }
  return input
}

const userInput = '<script>alert("xss")</script>'
const safeInput = sanitizeInput(userInput)
await db.collection('data').add({ content: safeInput })
```

### 4. Access Control | Kirish Nazorati

```javascript
// Implement proper access control in your application
// Ilovangizda to'g'ri kirish nazoratini amalga oshiring

function checkPermission(user, action) {
  if (action === 'delete' && user.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can delete')
  }
}

// Before deleting | O'chirishdan oldin
checkPermission(currentUser, 'delete')
await db.collection('users').doc({ id: userId }).delete()
```

### 5. Regular Updates | Muntazam Yangilanishlar

```bash
# Keep Ombor and dependencies up to date
# Ombor va bog'liqliklarni yangilab turing
npm update ombor
npm audit fix
```

## Security Features | Xavfsizlik Xususiyatlari

Ombor includes the following security features:

Ombor quyidagi xavfsizlik xususiyatlarini o'z ichiga oladi:

* ✅ **Zero Dependencies** (except localforage, uuid, vue) | Nol Bog'liqliklar (localforage, uuid, vue bundan mustasno)
* ✅ **No Remote Code Execution** - All code runs locally | Masofaviy Kod Bajarish Yo'q - Barcha kod mahalliy ishlaydi
* ✅ **No Network Requests** - Fully offline | Tarmoq So'rovlari Yo'q - To'liq offlayn
* ✅ **IndexedDB Security** - Browser's built-in security | IndexedDB Xavfsizligi - Brauzerning o'rnatilgan xavfsizligi
* ✅ **TypeScript Type Safety** - Compile-time checks | TypeScript Turi Xavfsizligi - Kompilyatsiya vaqtida tekshirishlar
* ✅ **Modern Crypto API** - UUID v7 with secure random generation | Zamonaviy Crypto API - Xavfsiz tasodifiy yaratish bilan UUID v7

## Known Limitations | Ma'lum Cheklovlar

1. **Browser Storage Limits** | Brauzer Saqlash Chegaralari
   - IndexedDB typically has 50MB-1GB limit per origin
   - IndexedDB odatda origin uchun 50MB-1GB chegaraga ega

2. **Same-Origin Policy** | Bir-Origin Siyosati
   - Data is isolated per origin (domain)
   - Ma'lumotlar origin (domen) bo'yicha ajratilgan

3. **Browser Security** | Brauzer Xavfsizligi
   - Security depends on browser implementation
   - Xavfsizlik brauzer amalga oshirishiga bog'liq

## Acknowledgments | E'tiroflar

We would like to thank the following security researchers:

Biz quyidagi xavfsizlik tadqiqotchilariga minnatdormiz:

* None yet - Be the first to report a vulnerability!
* Hali yo'q - Zaiflikni xabar bergan birinchi bo'ling!

## Contact | Aloqa

For any security concerns, contact:

Har qanday xavfsizlik muammolari bo'yicha murojaat qiling:

* **Email:** mohirlab@gmail.com
* **GitHub:** https://github.com/otabekoff/ombor/security

---

**Last Updated | Oxirgi Yangilanish:** October 3, 2025 | 3-Oktabr, 2025
