# 🚀 Ombor v0.0.5 Release Notes

**Release Date:** October 3, 2025  
**NPM:** https://www.npmjs.com/package/ombor/v/0.0.5  
**GitHub:** https://github.com/otabekoff/ombor/releases/tag/v0.0.5

---

## 📋 Release Summary

This release focuses on **modernizing dependencies** by migrating from the outdated `ordered-uuid` package to the modern, actively-maintained `uuid@13.0.0` package. This eliminates deprecation warnings and provides better performance with a smaller bundle size.

---

## ✨ What's New

### 🔄 **Dependency Migration: ordered-uuid → uuid@13.0.0**

#### **The Problem**
- `ordered-uuid` was released **9 years ago** (last update in 2016)
- Caused deprecation warnings when installed in projects
- No TypeScript declarations
- Not actively maintained
- Larger bundle size

#### **The Solution**
Migrated to **uuid@13.0.0** - the modern, RFC9562-compliant UUID library:

- ✅ **Actively maintained** - Released 25 days ago
- ✅ **TypeScript built-in** - Native type declarations included
- ✅ **RFC9562 compliant** - Full support for all UUID versions
- ✅ **Modern crypto API** - Secure random value generation
- ✅ **Zero dependencies** - Tree-shakable, lightweight
- ✅ **Cross-platform** - Works in Node.js, browsers, React Native
- ✅ **Smaller bundle** - Reduced package size

#### **Technical Details**

**UUID Version Used**: **v7 (RFC9562)**
- Timestamp-ordered UUIDs for chronological sorting
- Unix Epoch time-based generation
- Better performance than v1/v6
- Monotonic ordering guarantee

**Before (ordered-uuid):**
```javascript
import UUID from 'ordered-uuid'
key = UUID.generate()  // Legacy API
```

**After (uuid v7):**
```javascript
import { v7 as uuidv7 } from 'uuid'
key = uuidv7()  // Modern, RFC-compliant API
```

---

## 📊 Performance Improvements

### **Bundle Size Reduction**

| Format | v0.0.4 (old) | v0.0.5 (new) | Reduction |
|--------|--------------|--------------|-----------|
| **ES Module** | 23.21 kB | 21.38 kB | **-1.83 kB (-7.9%)** |
| **UMD** | 16.74 kB | 15.66 kB | **-1.08 kB (-6.5%)** |
| **Gzipped ES** | 5.60 kB | 5.00 kB | **-0.60 kB (-10.7%)** |
| **Gzipped UMD** | 4.92 kB | 4.46 kB | **-0.46 kB (-9.3%)** |
| **Unpacked** | 70.8 kB | 67.8 kB | **-3.0 kB (-4.2%)** |

### **Key Benefits**

1. **Smaller Downloads** - Faster installation and load times
2. **Modern API** - Cleaner, more maintainable code
3. **No Warnings** - Clean installation without deprecation notices
4. **TypeScript Support** - Built-in type declarations
5. **Better Security** - Modern crypto.getRandomValues() API
6. **Future-Proof** - Actively maintained with ongoing updates

---

## 🔧 Technical Implementation

### **UUID v7 Features**

1. **Timestamp Ordering**
   - UUIDs are naturally sorted chronologically
   - First 48 bits contain Unix timestamp in milliseconds
   - Perfect for database indexes

2. **Uniqueness Guarantee**
   - 74 bits of randomness per UUID
   - Collision probability: ~1 in 2^74 per millisecond
   - Safe for concurrent generation

3. **Format Example**
   ```
   01895553-c90c-745a-b76f-770d7b3dcb6d
   └─timestamp─┘ │ │ └──random────────┘
                 │ └─ version (7)
                 └─── variant
   ```

### **Migration Impact**

- ✅ **100% Backward Compatible** - All existing data remains valid
- ✅ **All 183 Tests Passing** - Full test coverage maintained
- ✅ **No API Changes** - Drop-in replacement for users
- ✅ **Same Functionality** - Identical behavior with better implementation

---

## 📦 Installation

### **Upgrade Existing Projects**

```bash
npm install ombor@0.0.5
# or
npm update ombor
```

### **New Installations**

```bash
npm install ombor
```

### **CDN (Script Tag)**

```html
<!-- ES Module -->
<script type="module">
  import Ombor from 'https://unpkg.com/ombor@0.0.5/dist/ombor.es.js'
  const db = new Ombor('myDatabase')
</script>

<!-- UMD (Global) -->
<script src="https://unpkg.com/ombor@0.0.5/dist/ombor.umd.js"></script>
<script>
  const db = new Ombor('myDatabase')
</script>
```

---

## 📖 Usage (No Changes Required!)

All existing code continues to work exactly as before:

```javascript
import Ombor from 'ombor'

const db = new Ombor('myDatabase')

// Add data - UUID generation is automatic and improved
await db.collection('users').add({
  name: 'Otabek',
  age: 25
})

// All operations work identically
const users = await db.collection('users')
  .orderBy('age', 'desc')
  .limit(10)
  .get()
```

---

## 🔄 Migration from v0.0.4

### **Automatic - Zero Code Changes**

This release is **100% backward compatible**. Simply update your package:

```bash
npm install ombor@0.0.5
```

### **Benefits You Get Immediately**

1. ✅ **No More Warnings** - Clean npm install output
2. ✅ **Smaller Bundle** - Automatic performance improvement
3. ✅ **Better TypeScript** - Improved type inference
4. ✅ **Modern Dependencies** - Up-to-date package ecosystem
5. ✅ **Future-Ready** - RFC9562 compliance

### **What Doesn't Change**

- ❌ No API changes
- ❌ No configuration changes
- ❌ No data migration needed
- ❌ No code refactoring required
- ❌ No breaking changes

---

## ✅ Testing & Quality Assurance

### **Test Results**

```
✅ Test Files: 8 passed (8)
✅ Tests: 183 passed (183)
✅ Pass Rate: 100%
✅ Duration: ~7 seconds
✅ Zero failures
✅ Zero warnings
✅ Zero vulnerabilities
```

### **Test Coverage**

All UUID generation scenarios tested:

- ✅ Basic document creation
- ✅ Batch insertions (500+ records)
- ✅ Concurrent operations (50+ simultaneous)
- ✅ Custom key scenarios
- ✅ Edge cases and error handling
- ✅ Performance benchmarks
- ✅ Multiple collections
- ✅ Large datasets (1000+ records)

---

## 🆚 Comparison: ordered-uuid vs uuid

| Feature | ordered-uuid | uuid@13.0.0 | Winner |
|---------|-------------|-------------|--------|
| **Last Updated** | 9 years ago (2016) | 25 days ago (2025) | ✅ uuid |
| **TypeScript** | ❌ No declarations | ✅ Built-in types | ✅ uuid |
| **Dependencies** | 0 | 0 | 🤝 Tie |
| **Bundle Size (ES)** | Larger | Smaller (-7.9%) | ✅ uuid |
| **RFC Compliance** | Custom | RFC9562 | ✅ uuid |
| **Active Maintenance** | ❌ Abandoned | ✅ Active | ✅ uuid |
| **Security** | Old crypto | Modern crypto API | ✅ uuid |
| **Browser Support** | Limited | All modern | ✅ uuid |
| **React Native** | ❌ No | ✅ Yes | ✅ uuid |
| **Deprecation Warnings** | ❌ Yes | ✅ No | ✅ uuid |
| **Tree Shaking** | ❌ No | ✅ Yes | ✅ uuid |

---

## 🌟 What Users Will Notice

### **Installation**

**Before (v0.0.4):**
```bash
npm install ombor
# npm WARN deprecated ordered-uuid@1.1.0: Don't use...
```

**After (v0.0.5):**
```bash
npm install ombor
# ✅ Clean installation, no warnings!
```

### **Bundle Size**

**Before:**
- Production build: 70.8 kB unpacked
- Gzipped: 5.60 kB (ES)

**After:**
- Production build: 67.8 kB unpacked (-4.2%)
- Gzipped: 5.00 kB (ES) (-10.7%)

### **TypeScript Experience**

**Before:**
```typescript
import Ombor from 'ombor'  // ⚠️ Some internal types missing
```

**After:**
```typescript
import Ombor from 'ombor'  // ✅ Full type safety, no warnings
```

---

## 📚 Additional Resources

### **UUID v7 Documentation**
- Official RFC: https://www.rfc-editor.org/rfc/rfc9562.html
- UUID Package: https://www.npmjs.com/package/uuid
- Migration Guide: This document

### **Ombor Resources**
- **NPM Package**: https://www.npmjs.com/package/ombor
- **GitHub Repo**: https://github.com/otabekoff/ombor
- **Playground**: https://otabekoff.github.io/ombor/playground
- **Documentation**: https://github.com/otabekoff/ombor#readme

---

## 🎯 What's Next (v0.0.6+)

### **Planned Improvements**
- [ ] Advanced query operators (OR, IN, NOT IN)
- [ ] Transaction support
- [ ] Batch operations optimization
- [ ] Real-time change detection
- [ ] Performance monitoring dashboard
- [ ] Enhanced documentation with more examples

---

## 💬 Questions & Feedback

### **Support Channels**
- **Issues**: https://github.com/otabekoff/ombor/issues
- **Discussions**: https://github.com/otabekoff/ombor/discussions
- **Email**: mohirlab@gmail.com

### **Contributing**
We welcome contributions! Please see our contributing guidelines.

---

## 📄 Full Changelog

For a complete list of all changes, see [CHANGELOG.md](./CHANGELOG.md)

---

## 🎉 Summary

**Ombor v0.0.5** represents a significant modernization of the library's dependencies while maintaining 100% backward compatibility. Users benefit from:

- ✅ **Smaller bundle size** (-7.9% ES, -6.5% UMD)
- ✅ **No deprecation warnings** (clean installations)
- ✅ **Better TypeScript support** (built-in types)
- ✅ **Modern, maintained dependencies** (uuid@13.0.0)
- ✅ **RFC9562 compliance** (future-proof)
- ✅ **Same great API** (zero breaking changes)

**Update today and enjoy a cleaner, faster, more modern Ombor!** 🚀

---

> _"From ordered-uuid (2016) to uuid v7 (2025) - A decade of progress in a single release!"_ 🌟

**Happy Coding with Ombor v0.0.5!** 🎊
