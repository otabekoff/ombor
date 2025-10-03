# Deprecation Warning Notice | Eskirish Ogohlantirishi

## standard-version Deprecation | standard-version Eskirishi

### Current Issue | Joriy Muammo

When running `npm run release`, you may see the following deprecation warning:

`npm run release` ishga tushirganda quyidagi eskirish ogohlantirishini ko'rishingiz mumkin:

```
(node:84736) [DEP0176] DeprecationWarning: fs.F_OK is deprecated, use fs.constants.F_OK instead
```

### Why This Happens | Nima Uchun Bu Sodir Bo'ladi

**standard-version** is no longer actively maintained. Last update was in May 2022, and it uses deprecated Node.js APIs.

**standard-version** endi faol ravishda saqlanmaydi. Oxirgi yangilanish 2022-yil may oyida bo'lgan va u eskirgan Node.js API laridan foydalanadi.

- **Last Update | Oxirgi Yangilanish:** May 15, 2022 | 15-May, 2022
- **Status:** Deprecated | Eskirgan
- **Impact | Ta'sir:** Generates warnings but still works | Ogohlantirishlar yaratadi, lekin hali ham ishlaydi

### Should You Be Worried? | Tashvishlanish Kerakmi?

**No, not immediately.** | **Yo'q, darhol emas.**

- ⚠️ The warning is just a **notice**, not an error | Ogohlantirish shunchaki **xabar**, xato emas
- ✅ standard-version **still works correctly** | standard-version **hali ham to'g'ri ishlaydi**
- ✅ Your releases will continue to function | Sizning releaslaringiz ishlashda davom etadi
- ✅ All automated versioning works fine | Barcha avtomatlashtirilgan versiyalash yaxshi ishlaydi

### Recommended Migration Path | Tavsiya Etilgan Migratsiya Yo'li

For future updates, consider migrating to **release-please** or **semantic-release**:

Kelajakdagi yangilanishlar uchun **release-please** yoki **semantic-release** ga o'tishni ko'rib chiqing:

#### Option 1: release-please (Recommended for GitHub Projects)

**release-please** is actively maintained by Google and integrates well with GitHub.

**release-please** Google tomonidan faol saqlanadi va GitHub bilan yaxshi integratsiyalashadi.

```bash
# Install
npm install --save-dev release-please

# Setup GitHub Action (recommended)
# See: https://github.com/googleapis/release-please
```

**Benefits | Afzalliklar:**
- ✅ GitHub Actions integration | GitHub Actions integratsiyasi
- ✅ Actively maintained by Google | Google tomonidan faol saqlanadi
- ✅ Supports multiple languages | Ko'plab tillarni qo'llab-quvvatlaydi
- ✅ Automated PR creation | Avtomatlashtirilgan PR yaratish
- ✅ No deprecation warnings | Eskirish ogohlantirishlari yo'q

#### Option 2: semantic-release

**semantic-release** is another popular choice with extensive plugin ecosystem.

**semantic-release** keng plugin ekotizimi bilan boshqa mashhur tanlov.

```bash
# Install
npm install --save-dev semantic-release

# Configure in package.json or .releaserc
```

**Benefits | Afzalliklar:**
- ✅ Extensive plugin system | Keng plugin tizimi
- ✅ Highly customizable | Yuqori darajada sozlanishi
- ✅ CI/CD integration | CI/CD integratsiyasi
- ✅ Active community | Faol jamoa

### Migration Timeline | Migratsiya Vaqt Jadvali

We plan to migrate in a future version:

Biz kelajakdagi versiyada migratsiya qilishni rejalashtiramiz:

- **v0.0.6-0.0.8:** Continue using standard-version (current) | standard-version dan foydalanishda davom etish (joriy)
- **v0.0.9+:** Evaluate and test release-please | release-please ni baholash va sinab ko'rish
- **v0.1.0+:** Complete migration to release-please | release-please ga to'liq migratsiya

### Temporary Workaround | Vaqtinchalik Yechim

To suppress the warning temporarily, you can:

Ogohlantirishni vaqtincha bosish uchun quyidagilarni qilishingiz mumkin:

#### Option 1: Use --no-warnings flag

```json
// package.json
{
  "scripts": {
    "release": "node --no-warnings ./node_modules/.bin/standard-version"
  }
}
```

#### Option 2: Use --no-deprecation flag

```json
// package.json
{
  "scripts": {
    "release": "node --no-deprecation ./node_modules/.bin/standard-version"
  }
}
```

#### Option 3: Set environment variable

```bash
# Windows PowerShell
$env:NODE_NO_WARNINGS=1; npm run release

# Windows CMD
set NODE_NO_WARNINGS=1 && npm run release

# Linux/Mac
NODE_NO_WARNINGS=1 npm run release
```

### Current Decision | Joriy Qaror

**We will keep standard-version for now** because:

**Biz hozircha standard-version ni saqlaymiz** chunki:

1. ✅ It still works perfectly | U hali ham mukammal ishlaydi
2. ✅ All our release automation is configured | Barcha release avtomatizatsiyamiz sozlangan
3. ✅ The warning is harmless | Ogohlantirish zararsiz
4. ✅ Migration requires testing and validation | Migratsiya test va tekshiruvni talab qiladi
5. ✅ Our workflow is stable and proven | Bizning ish jarayonimiz barqaror va isbotlangan

### For Contributors | Hissa Qo'shuvchilar Uchun

If you want to help migrate to release-please:

Agar release-please ga o'tishga yordam bermoqchi bo'lsangiz:

1. Research release-please configuration | release-please konfiguratsiyasini tadqiq qiling
2. Test it in a fork | Uni fork da sinab ko'ring
3. Create a pull request with migration plan | Migratsiya rejasi bilan pull request yarating
4. Update documentation | Hujjatlarni yangilang

### References | Ma'lumotnomalar

- **standard-version:** https://github.com/conventional-changelog/standard-version
- **release-please:** https://github.com/googleapis/release-please
- **semantic-release:** https://github.com/semantic-release/semantic-release
- **Node.js DEP0176:** https://nodejs.org/api/deprecations.html#DEP0176

---

**Last Updated | Oxirgi Yangilanish:** October 3, 2025 | 3-Oktabr, 2025  
**Status | Holat:** Known Issue - Low Priority | Ma'lum Muammo - Past Ustuvorlik
