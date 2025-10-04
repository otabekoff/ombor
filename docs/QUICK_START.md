# 🚀 Quick Start Guide

## Running the Project

### Documentation Server (VitePress)
```bash
npm run docs:dev
```
Opens at development server (check console for exact port)

### Library Dev Server (Vite)
```bash
npm run dev
```
Opens at development server (for library development)

## Common Commands

### Development
```bash
# Documentation development
npm run docs:dev          # Start docs dev server
npm run docs:build        # Build docs for production
npm run docs:preview      # Preview built docs

# Library development
npm run dev              # Start library dev server
npm run build            # Build library
npm run preview          # Preview built library
```

### Testing & Quality
```bash
npm test                 # Run tests
npm run lint             # Check code style
npm run lint:fix         # Fix code style
npm run type-check       # Check TypeScript types
```

### Release & Publish
```bash
npm run release          # Create patch release (0.0.3 → 0.0.4)
npm run release:minor    # Create minor release (0.0.3 → 0.1.0)
npm run release:major    # Create major release (0.0.3 → 1.0.0)

# After release
git push --follow-tags origin main  # Push + trigger auto-publish
```

## 🐛 Troubleshooting

### "Can't find development server"
**Problem:** Running `npm run dev` instead of `npm run docs:dev`

**Solution:**
```bash
# ❌ Wrong (library dev server)
npm run dev

# ✅ Correct (documentation server)
npm run docs:dev
```

### "404 on localhost"
**Problem:** Wrong base path in local development

**Solution:** The config now auto-detects:
- **Local:** `base: '/'` → served on development server
- **GitHub Pages:** `base: '/ombor/'` → https://otabekoff.github.io/ombor/

### "Styles not loading on GitHub Pages"
**Problem:** Missing base path configuration

**Solution:** Already configured in `docs/.vitepress/config.ts`:
```typescript
const base = process.env.NODE_ENV === 'production' ? '/ombor/' : '/'
```

## 📁 Project Structure

```
ombor/
├── src/                    # Library source code
│   ├── ombor.ts           # Main class
│   ├── api/               # API methods
│   └── __tests__/         # Tests
├── docs/                  # Documentation (VitePress)
│   ├── .vitepress/        # VitePress config
│   ├── guide/             # User guides
│   ├── api/               # API documentation
│   └── public/            # Static assets
├── dist/                  # Built library
└── docs/.vitepress/dist/  # Built documentation
```

## 🎯 Development Workflow

### Working on Documentation
```bash
# 1. Start docs server
npm run docs:dev

# 2. Edit files in docs/
# 3. Changes reload automatically

# 4. Build to test production
npm run docs:build
npm run docs:preview

# 5. Commit and push
git add docs/
git commit -m "docs: update documentation"
git push
```

### Working on Library
```bash
# 1. Start dev server
npm run dev

# 2. Edit files in src/
# 3. Changes reload automatically

# 4. Run tests
npm test

# 5. Build and check
npm run build
npm run lint
npm run type-check

# 6. Commit and push
git add src/
git commit -m "feat: add new feature"
git push
```

## 🌐 URLs

### Local Development
- **Documentation:** Development server (check console output for URL)
- **Library Preview:** Development server (check console output for URL)

### Production
- **Documentation:** https://otabekoff.github.io/ombor/
- **npm Package:** https://www.npmjs.com/package/ombor
- **Repository:** https://github.com/otabekoff/ombor

## ⚡ Quick Tips

1. **Always use `npm run docs:dev` for documentation work**
2. **Use `npm run dev` only when developing the library itself**
3. **The base path auto-adjusts for local vs production**
4. **Run `npm run lint:fix` before committing**
5. **Use conventional commits:** `feat:`, `fix:`, `docs:`

## 📝 Important Notes

- VitePress runs on port 5173 (or next available)
- Vite (library) runs on port 5173 (or next available)
- Both servers support hot module reload (HMR)
- Documentation builds to `docs/.vitepress/dist`
- Library builds to `dist/`
