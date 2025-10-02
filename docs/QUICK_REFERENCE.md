# 🚀 Ombor - Quick Reference Card

## Installation
```bash
npm install ombor
```

## Basic Usage
```typescript
import Ombor from 'ombor'

const db = new Ombor('mydb')

// Add document
db.collection('users').add({
  name: 'Otabek',
  age: 19
})

// Get all documents
db.collection('users').get()

// Get specific document
db.collection('users').doc('id123').get()

// Update document
db.collection('users').doc('id123').update({
  age: 20
})

// Delete document
db.collection('users').doc('id123').delete()

// Order and limit
db.collection('users')
  .orderBy('age', 'desc')
  .limit(10)
  .get()
```

## NPM Scripts
```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build

# Testing
npm test             # Run tests
npm run test:ui      # Test UI
npm run test:coverage # Coverage report

# Code Quality
npm run lint         # Check code
npm run lint:fix     # Fix issues
npm run format       # Format code

# Versioning
npm run release              # Patch (0.0.x)
npm run release:minor        # Minor (0.x.0)
npm run release:major        # Major (x.0.0)

# Deploy
npm run deploy       # Build & publish
```

## Conventional Commits
```bash
feat: new feature
fix: bug fix
docs: documentation
refactor: code refactor
test: add tests
chore: maintenance
perf: performance
```

## Project Stats
- ✅ 0 vulnerabilities
- ✅ 0 ESLint errors/warnings
- ✅ TypeScript 100%
- ⚡ 1s build time
- 📦 16KB minified
- 🌍 Uzbek localized

## Key Features
- 🔄 Firebase-style API
- 💾 IndexedDB storage
- 📴 Offline-first
- 🔍 Ordering & limiting
- 💪 Full TypeScript
- ⚡ Lightning fast

## Support
📖 Docs: `README.md`  
🐛 Issues: GitHub  
💬 Discussions: GitHub  
📧 Email: [your-email]

**Happy coding with Ombor!** 🎉
