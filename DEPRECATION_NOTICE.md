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

#### Option 1: release-please (⭐ Recommended by standard-version maintainers)

**release-please** is actively maintained by Google and is the **official recommendation** from standard-version maintainers.

**release-please** Google tomonidan faol saqlanadi va standard-version maintainerlari tomonidan **rasmiy tavsiya**.

> 🎯 **Official Statement from standard-version:**
> "standard-version is deprecated. If you're a GitHub user, I recommend release-please as an alternative."

**How release-please Works | release-please Qanday Ishlaydi:**

Instead of manually running release commands, release-please:
1. 🔍 **Parses your git history** - Looks for Conventional Commit messages
2. 📝 **Creates a Release PR** - Opens a pull request with version bump and changelog
3. 🔄 **Updates Release PR automatically** - As you merge more commits
4. 🚀 **Publishes on merge** - When you merge the Release PR:
   - Updates CHANGELOG.md, package.json
   - Creates a git tag
   - Creates a GitHub Release

Manual komandalar o'rniga, release-please:
1. 🔍 **Git tarixini tahlil qiladi** - Conventional Commit xabarlarini qidiradi
2. 📝 **Release PR yaratadi** - Versiya o'zgarishi va changelog bilan pull request ochadi
3. 🔄 **Release PR ni avtomatik yangilaydi** - Siz ko'proq commitlar mergeganda
4. 🚀 **Merge qilganda publish qiladi** - Release PR ni merge qilganda:
   - CHANGELOG.md, package.json ni yangilaydi
   - Git tag yaratadi
   - GitHub Release yaratadi

**Key Differences | Asosiy Farqlar:**

| Feature | standard-version | release-please |
|---------|------------------|----------------|
| **Trigger** | Manual command | Automatic PR |
| **Review** | After release | Before release (PR review) |
| **Changelog** | Commit time | Merge time |
| **Rollback** | Git revert needed | Don't merge PR |
| **Team Visibility** | Low | High (PR comments) |
| **Maintenance** | ❌ Deprecated (2022) | ✅ Active (Google) |

**Benefits | Afzalliklar:**
- ✅ **No deprecation warnings** | Eskirish ogohlantirishlari yo'q
- ✅ **GitHub Actions integration** | GitHub Actions integratsiyasi
- ✅ **Actively maintained by Google** | Google tomonidan faol saqlanadi
- ✅ **Supports Node.js projects** | Node.js proyektlarini qo'llab-quvvatlaydi
- ✅ **Automated PR creation** | Avtomatlashtirilgan PR yaratish
- ✅ **Release preview before merge** | Merge qilishdan oldin release ko'rish
- ✅ **Team can review releases** | Jamoa releaselarni ko'rib chiqishi mumkin
- ✅ **Automatic changelog updates** | Avtomatik changelog yangilanishlari
- ✅ **Supports monorepos** | Monoreposlarni qo'llab-quvvatlaydi

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

---

## 📘 Detailed Migration Guide | Batafsil Migratsiya Qo'llanmasi

### Step-by-Step: Migrating to release-please | Qadam-baqadam: release-please ga o'tish

#### Prerequisites | Oldindan Talab Qilinadigan

- ✅ GitHub repository | GitHub repository
- ✅ Using Conventional Commits | Conventional Commitlardan foydalanish
- ✅ Node.js project (package.json exists) | Node.js proyekti (package.json mavjud)

#### Step 1: Create GitHub Action Workflow | GitHub Action Workflow Yaratish

Create `.github/workflows/release-please.yml`:

`.github/workflows/release-please.yml` yarating:

```yaml
name: Release Please

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          # Release type for Node.js projects
          release-type: node
          # Optional: Customize package name
          package-name: ombor
```

#### Step 2: Remove standard-version | standard-version ni O'chirish

```bash
# Remove standard-version
npm uninstall standard-version
```

Update `package.json`:

```json
{
  "scripts": {
    // Remove these lines:
    // "release": "standard-version",
    // "release:minor": "standard-version --release-as minor",
    // "release:major": "standard-version --release-as major",
    // "changelog": "standard-version --dry-run --release-as patch"
  }
}
```

#### Step 3: Configure release-please (Optional) | release-please ni Sozlash (Ixtiyoriy)

Create `.release-please-manifest.json`:

```json
{
  ".": "0.0.5"
}
```

Create `release-please-config.json`:

```json
{
  "packages": {
    ".": {
      "release-type": "node",
      "package-name": "ombor",
      "changelog-path": "CHANGELOG.md",
      "bump-minor-pre-major": true,
      "bump-patch-for-minor-pre-major": false,
      "versioning": "default",
      "extra-files": [
        "README.md"
      ]
    }
  }
}
```

#### Step 4: Push to GitHub | GitHub ga Yuklash

```bash
git add .github/workflows/release-please.yml
git add .release-please-manifest.json
git add release-please-config.json
git commit -m "chore: setup release-please automation"
git push origin main
```

#### Step 5: Wait for Release PR | Release PR ni Kutish

After pushing, release-please will:
1. Analyze your commit history since last release (v0.0.5)
2. Create a pull request titled **"chore(main): release 0.0.6"** (or appropriate version)
3. Include changelog updates and version bumps

Push qilgandan so'ng, release-please:
1. Oxirgi releasdan (v0.0.5) beri commit tarixingizni tahlil qiladi
2. **"chore(main): release 0.0.6"** (yoki tegishli versiya) nomli pull request yaratadi
3. Changelog yangilanishlari va versiya o'zgarishlarini kiritadi

#### Step 6: Review and Merge | Ko'rib Chiqish va Merge Qilish

1. 📝 **Review the Release PR** - Check changelog, version bump
2. ✅ **Merge the PR** - When ready to release
3. 🎉 **Automatic Release** - GitHub Release created automatically

#### Step 7: Publish to npm (if needed) | npm ga Publish Qilish (kerak bo'lsa)

Add npm publish to workflow (optional):

```yaml
name: Release Please

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        id: release
        with:
          release-type: node
          package-name: ombor
      
      # Publish to npm when release is created
      - uses: actions/checkout@v4
        if: ${{ steps.release.outputs.release_created }}
      
      - uses: actions/setup-node@v4
        if: ${{ steps.release.outputs.release_created }}
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
        if: ${{ steps.release.outputs.release_created }}
      
      - run: npm publish
        if: ${{ steps.release.outputs.release_created }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Note:** You need to add `NPM_TOKEN` to GitHub Secrets:
1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Create new token (Automation type)
3. Add to GitHub repo: Settings → Secrets → Actions → New repository secret
4. Name: `NPM_TOKEN`, Value: your token

---

### Understanding Conventional Commits | Conventional Commitlarni Tushunish

release-please works by analyzing your commit messages. You must follow **Conventional Commits** format:

release-please commit xabarlaringizni tahlil qilish orqali ishlaydi. Siz **Conventional Commits** formatiga amal qilishingiz kerak:

#### Format | Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types and Version Bumps | Turlar va Versiya O'zgarishlari

| Commit Type | SemVer Bump | Example |
|-------------|-------------|---------|
| `fix:` | PATCH (0.0.5 → 0.0.6) | `fix: repair database connection` |
| `feat:` | MINOR (0.0.5 → 0.1.0) | `feat: add user authentication` |
| `feat!:` or `fix!:` | MAJOR (0.0.5 → 1.0.0) | `feat!: change API structure` |
| `BREAKING CHANGE:` in footer | MAJOR (0.0.5 → 1.0.0) | See below |
| `docs:`, `chore:`, `style:` | No release | Documentation changes |

#### Examples | Misollar

**Patch Release (0.0.5 → 0.0.6):**
```bash
git commit -m "fix: prevent memory leak in document deletion"
```

**Minor Release (0.0.5 → 0.1.0):**
```bash
git commit -m "feat: add batch update functionality"
```

**Major Release (0.0.5 → 1.0.0):**
```bash
git commit -m "feat!: redesign collection API

BREAKING CHANGE: collection() now returns Promise instead of sync value"
```

**Multiple changes in one commit:**
```bash
git commit -m "feat: add UUID v7 support

This adds support for modern UUID v7 timestamps.

fix(utils): handle null values in isSubset
  Fixes issue where null values caused crashes

feat(api): add limit(0) support
  Allow retrieving all records with limit(0)"
```

#### Ombor's Current Commit Style | Omborning Joriy Commit Uslubi

Good news! Ombor already uses Conventional Commits:

Yaxshi xabar! Ombor allaqachon Conventional Commitlardan foydalanadi:

✅ **Recent commits:**
- `feat: migrate from ordered-uuid to modern uuid@13.0.0`
- `docs: add comprehensive release notes for v0.0.5`
- `fix: handle negative limit values gracefully`
- `feat(playground): add interactive playground`
- `chore: setup automated publishing`

This means **migration will be smooth** - no commit history rewriting needed!

Bu **migratsiya silliq bo'lishini** anglatadi - commit tarixini qayta yozish kerak emas!

---

### Comparison: Workflows | Taqqoslash: Ish Oqimlari

#### Current Workflow with standard-version | Joriy Ish Oqimi standard-version bilan

```bash
# 1. Make changes and commit
git add .
git commit -m "feat: new feature"
git push origin main

# 2. Run release command (manual)
npm run release
# - Bumps version in package.json
# - Updates CHANGELOG.md
# - Creates git commit
# - Creates git tag

# 3. Push release (manual)
git push --follow-tags origin main

# 4. Publish to npm (manual)
npm publish
```

#### Future Workflow with release-please | Kelajakdagi Ish Oqimi release-please bilan

```bash
# 1. Make changes and commit
git add .
git commit -m "feat: new feature"
git push origin main

# 2. Automatically happens:
# - GitHub Action runs
# - Release PR created/updated
# - Changelog preview available

# 3. Review Release PR
# - Check version bump
# - Review changelog
# - Add release notes

# 4. Merge Release PR (manual)
# - Merge button on GitHub
# - Release automatically created
# - (Optional) npm publish automatic
```

**Key Improvement | Asosiy Yaxshilanish:**
- ✅ Release preview before publishing | Publish qilishdan oldin release ko'rish
- ✅ Team can review and approve | Jamoa ko'rib chiqishi va tasdiqlashi mumkin
- ✅ No local release commands | Mahalliy release komandalar yo'q
- ✅ Everything tracked in PR | Hamma narsa PR da kuzatiladi

---

### Testing release-please Before Migration | Migratsiyadan Oldin release-please ni Sinash

Want to test first? Here's how:

Avval sinab ko'rmoqchimisiz? Quyidagicha:

#### Option 1: Fork and Test | Fork va Sinov

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/ombor-fork.git
cd ombor-fork

# 3. Add release-please workflow
mkdir -p .github/workflows
# Create release-please.yml (see Step 1 above)

# 4. Push and observe
git add .github/workflows/release-please.yml
git commit -m "test: add release-please"
git push origin main

# 5. Check GitHub Actions tab for results
```

#### Option 2: Separate Branch | Alohida Branch

```bash
# 1. Create test branch
git checkout -b test-release-please

# 2. Add release-please workflow
mkdir -p .github/workflows
# Create release-please.yml (see Step 1 above)

# 3. Update workflow to use test branch
# In release-please.yml, change:
#   branches:
#     - test-release-please

# 4. Push and test
git add .github/workflows/release-please.yml
git commit -m "test: add release-please to test branch"
git push origin test-release-please

# 5. Observe PR creation on test branch
```

---

### Troubleshooting release-please | release-please Muammolarini Hal Qilish

#### Problem: No Release PR Created | Muammo: Release PR Yaratilmadi

**Cause | Sabab:** No "releasable units" since last release

**Solution | Yechim:**
- Ensure commits use `feat:`, `fix:`, or `deps:` prefixes
- Check that commits are on main branch
- Verify last release tag exists (v0.0.5)

```bash
# Check last tag
git tag --sort=-v:refname | head -1

# Check commits since last tag
git log v0.0.5..HEAD --oneline

# Manually trigger (add label to merged PR)
# Add label: release-please:force-run
```

#### Problem: Wrong Version Bump | Muammo: Noto'g'ri Versiya O'zgarishi

**Cause | Sabab:** Incorrect commit message format

**Solution | Yechim:**
- Review commit messages for correct prefixes
- Use `fix:` for patches, `feat:` for minor
- Use `!` or `BREAKING CHANGE:` for major

#### Problem: Old Label Still Present | Muammo: Eski Label Hali Ham Mavjud

**Cause | Sabab:** Previous release PR has `autorelease: pending` label

**Solution | Yechim:**
- Remove the label from old PR manually
- Re-run GitHub Action

### References | Ma'lumotnomalar

#### Official Documentation | Rasmiy Hujjatlar

- **standard-version (Deprecated):** https://github.com/conventional-changelog/standard-version
- **release-please (Recommended):** https://github.com/googleapis/release-please
  - GitHub Action: https://github.com/googleapis/release-please-action
  - Configuration: https://github.com/googleapis/release-please/blob/main/docs/customizing.md
  - Node.js Strategy: https://github.com/googleapis/release-please/blob/main/docs/customizing.md#nodejs
- **semantic-release (Alternative):** https://github.com/semantic-release/semantic-release
- **Conventional Commits:** https://www.conventionalcommits.org/
  - Specification v1.0.0: https://www.conventionalcommits.org/en/v1.0.0/
  - Why Use It: https://www.conventionalcommits.org/en/v1.0.0/#why-use-conventional-commits

#### Technical References | Texnik Ma'lumotnomalar

- **Node.js DEP0176 Deprecation:** https://nodejs.org/api/deprecations.html#DEP0176
- **Semantic Versioning (SemVer):** https://semver.org/
- **GitHub Actions Documentation:** https://docs.github.com/en/actions
- **npm Publishing:** https://docs.npmjs.com/cli/v10/commands/npm-publish

#### Community Resources | Jamiyat Resurslari

- **release-please Examples:**
  - Simple Node.js: https://github.com/googleapis/release-please/tree/main/samples/node
  - Monorepo: https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md
- **Conventional Commits Examples:**
  - Angular Convention: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit
  - Commitlint Config: https://github.com/conventional-changelog/commitlint

#### Ombor-Specific | Ombor Uchun Maxsus

- **Current Changelog:** [CHANGELOG.md](./CHANGELOG.md)
- **Package.json:** [package.json](./package.json)
- **Contributing Guide:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- **v0.0.5 Release Notes:** [RELEASE-0.0.5.md](./RELEASE-0.0.5.md)

---

## 📊 Migration Checklist | Migratsiya Tekshirish Ro'yxati

Use this checklist when ready to migrate:

Migratsiya qilishga tayyor bo'lganda ushbu ro'yxatdan foydalaning:

### Pre-Migration | Migratsiyadan Oldin

- [ ] **Understand Conventional Commits** - Review spec at conventionalcommits.org
- [ ] **Review current commits** - Ensure they follow Conventional Commits format
- [ ] **Backup current setup** - Create git branch with current configuration
- [ ] **Test in fork** - Try release-please in a forked repository first
- [ ] **Team agreement** - Ensure team understands new workflow

### Migration Steps | Migratsiya Qadamlari

- [ ] **Create GitHub Action workflow** - Add `.github/workflows/release-please.yml`
- [ ] **Add manifest config** - Create `.release-please-manifest.json`
- [ ] **Add release config** - Create `release-please-config.json`
- [ ] **Remove standard-version** - Run `npm uninstall standard-version`
- [ ] **Update package.json scripts** - Remove release-related scripts
- [ ] **Update CONTRIBUTING.md** - Document new release process
- [ ] **Commit changes** - Use `chore: migrate to release-please`
- [ ] **Push to GitHub** - Wait for first Release PR

### Post-Migration | Migratsiyadan Keyin

- [ ] **Verify Release PR created** - Check GitHub Pull Requests
- [ ] **Review changelog** - Ensure it looks correct
- [ ] **Test release process** - Merge PR and verify GitHub Release
- [ ] **Update team documentation** - Notify team of new process
- [ ] **Configure npm auto-publish** (Optional) - Add NPM_TOKEN to secrets
- [ ] **Archive this notice** - Move to `docs/archive/` after successful migration

---

## 💡 Tips for Smooth Migration | Silliq Migratsiya Uchun Maslahatlar

### 1. Start with a Clean State | Toza Holatdan Boshlang

Before migrating, ensure:
- All pending changes are committed
- Working directory is clean (`git status` shows nothing)
- Latest code is pushed to GitHub
- No open Release PRs with standard-version

### 2. Use Feature Branches | Feature Branchlardan Foydalaning

Test release-please on a feature branch before applying to main:
```bash
git checkout -b feat/migrate-to-release-please
# Make changes
# Test workflow
# Create PR for review
```

### 3. Document for Your Team | Jamoangiz Uchun Hujjatlang

Update CONTRIBUTING.md with:
- New release process explanation
- Conventional Commits examples specific to your project
- When to use `feat:`, `fix:`, `chore:`, etc.
- How to trigger releases (merge Release PR)

### 4. Keep CHANGELOG.md History | CHANGELOG.md Tarixini Saqlang

release-please will respect existing CHANGELOG.md content. Your v0.0.5 and earlier entries will remain.

### 5. Plan for the Transition | O'tish Uchun Rejalashtiring

During transition period:
- Keep this DEPRECATION_NOTICE.md for reference
- Monitor first few releases closely
- Be ready to rollback if issues occur (revert to standard-version temporarily)

### 6. Leverage PR Reviews | PR Ko'rib Chiqishlardan Foydalaning

The biggest advantage of release-please is the Release PR:
- Team can review before release
- Add manual release notes if needed
- Catch errors before they become releases
- Discuss version bumps if automatic detection is wrong

---

## 🎯 Expected Timeline | Kutilayotgan Vaqt Jadvali

Based on project priorities:

Proyekt ustuvorliklariga asoslanib:

| Phase | Timeframe | Status | Actions |
|-------|-----------|--------|---------|
| **Current (v0.0.5)** | October 2025 | ✅ Complete | Using standard-version, documented warning |
| **Evaluation (v0.0.6-0.0.8)** | Nov-Dec 2025 | 🔄 Planning | Continue with standard-version, test release-please in fork |
| **Testing (v0.0.9)** | Jan 2026 | ⏳ Pending | Create feature branch, test release-please, team review |
| **Migration (v0.1.0)** | Feb 2026 | 📅 Scheduled | Full migration, remove standard-version, update docs |
| **Stabilization (v0.1.x)** | Mar 2026+ | 🎉 Future | Fine-tune, document lessons learned, help community |

**Note:** Timeline is flexible based on:
- Project stability
- Team bandwidth
- Community feedback
- release-please updates

---

## 🤝 How to Contribute to Migration | Migratsiyaga Qanday Hissa Qo'shish

Want to help? Here are ways to contribute:

Yordam bermoqchimisiz? Mana hissa qo'shish yo'llari:

### 1. Test in a Fork | Forkda Sinab Ko'rish

- Fork Ombor repository
- Set up release-please
- Document your experience
- Share findings in GitHub Discussions

### 2. Create Migration PR | Migratsiya PR Yaratish

- Create feature branch: `feat/migrate-to-release-please`
- Add all necessary configuration files
- Test thoroughly
- Submit PR with detailed description

### 3. Improve Documentation | Hujjatlarni Yaxshilash

- Add more examples to this guide
- Create video tutorial
- Translate to other languages
- Write blog post about migration

### 4. Report Issues | Muammolarni Xabar Qilish

If you find issues with:
- This deprecation notice
- Migration instructions
- release-please configuration
- Conventional Commits compliance

Open an issue: https://github.com/otabekoff/ombor/issues

### 5. Share Knowledge | Bilimlarni Ulashing

- Answer questions in Discussions
- Help other contributors understand release-please
- Review migration PRs
- Share best practices

---

**Last Updated | Oxirgi Yangilanish:** October 3, 2025 | 3-Oktabr, 2025  
**Status | Holat:** Known Issue - Low Priority | Ma'lum Muammo - Past Ustuvorlik
