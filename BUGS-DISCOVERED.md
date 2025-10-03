# 🐛 Bugs Discovered by Test Suite

## Critical Priority (Crashes / Data Loss)

### ✅ 1. **isSubset Crashes on Null Values** - FIXED! 
- **Location**: `src/utils/isSubset.js:2`
- **Error**: `TypeError: Cannot convert undefined or null to object`
- **Issue**: Calling `Object.keys(subObj)` when `subObj` is `null` throws error
- **Impact**: App crashes when querying documents with null values
- **Status**: ✅ FIXED - Added null/undefined checks before Object.keys()
  
### ✅ 2. **Sorting Crashes on Null Values** - FIXED!
- **Location**: `src/api/actions/get.js:48`
- **Error**: `Cannot read properties of null (reading 'toString')`
- **Issue**: `.toString()` called on null values during sorting
- **Impact**: App crashes when sorting collections with null values
- **Status**: ✅ FIXED - Added null handling (null values go to end)

---

## High Priority (Wrong Results)

### ✅ 3. **Sorting Compares Numbers as Strings** - FIXED!
- **Location**: `src/api/actions/get.js:48`
- **Issue**: All values converted to strings before sorting
- **Impact**: Numeric sorting incorrect (1200 < 25 alphabetically)
- **Status**: ✅ FIXED - Added type-aware comparison for numbers

### 4. **Data Persistence Issues** - ⚠️ NEEDS FIX
- **Location**: `src/api/selectors/doc.js` or `src/api/actions/get.js`
- **Issue**: Using `doc({ criteria }).get()` returns `undefined`
- **Impact**: Cannot query single documents by criteria
- **Error Message**: "document(lar) topilmadi" (documents not found)
- **Failing Tests**: 10+ tests across multiple files
  - `method-chaining.test.ts:27` - "Cannot read properties of undefined (reading 'age')"
  - All `doc({ name: 'Alice' }).get()` calls fail

**Example**:
```javascript
// This should work but returns undefined:
const user = await db.collection('users').doc({ name: 'Alice' }).get()
expect(user.age).toBe(25) // ❌ undefined
```

### 5. **Data Persistence Issues**
- **Issue**: Bulk inserts lose 1 record consistently
- **Impact**: Data integrity problems
- **Examples**:
  - Insert 5 records → only 4 returned
  - Insert 500 records → only 499 returned
  - Insert 1000 records → only 999 returned
- **Failing Tests**: 
  - `filtering-sorting.test.ts:37` - Expected 5, got 4
  - `performance.test.ts:51` - Expected 500, got 499
  - `performance.test.ts:120` - Expected 1000, got 999

**Possible Causes**:
- Race condition in `add()` method
- ID collision (last record overwrites first?)
- Async timing issue with IndexedDB

---

## Medium Priority (Edge Cases)

### 6. **limit(0) Returns null Instead of []**
- **Location**: `src/api/filters/limit.js` or `src/api/actions/get.js`
- **Issue**: `limit(0).get()` returns `null` instead of empty array `[]`
- **Impact**: Inconsistent return types, breaks array methods
- **Failing Tests**:
  - `edge-cases.test.ts:236`
  - `filtering-sorting.test.ts:101`

**Expected**: `[]`  
**Actual**: `null`

### 7. **Database Deletion Doesn't Clear All Data**
- **Location**: `src/api/actions/delete.js` or database delete method
- **Issue**: After `db.delete()`, data persists
- **Impact**: Tests fail due to leftover data, memory leaks
- **Failing Tests**:
  - `performance.test.ts:355` - Expected [], got 100 records

**Example**:
```javascript
// Insert 100 records
await db.collection('temp').add({ data: 'x'.repeat(100) })

// Delete database
await db.delete()

// Still returns 100 records! ❌
const records = await db.collection('temp').get()
expect(records).toEqual([]) // FAIL
```

### 8. **Inconsistent Return Types**
- **Issue**: Some operations return single object instead of array
- **Impact**: `.filter()` fails on non-array results
- **Failing Tests**:
  - `multiple-collections.test.ts:122` - ".filter is not a function"

**Example**:
```javascript
const orders = await db.collection('orders').get()
// Should be array, but sometimes returns object
orders.filter(o => o.userId === 1) // ❌ TypeError
```

### 9. **Query with Non-Existent Field Throws Error**
- **Issue**: Querying by non-existent field throws error instead of returning []
- **Impact**: Should return empty array, not error
- **Failing Tests**:
  - `edge-cases.test.ts` - "should handle querying with non-existent field"

---

## Test Statistics

- **Total Tests**: 183
- **Passing**: 135 (73.8%)
- **Failing**: 48 (26.2%)
- **Unhandled Errors**: 2

## Impact Assessment

### Production-Blocking Issues:
1. ✋ **isSubset null crash** - App crashes on null queries
2. ✋ **Sorting null crash** - App crashes on null values in sorted data
3. ✋ **Data loss** - Records disappear during bulk inserts

### User-Facing Issues:
4. ⚠️ **Wrong sort order** - Numbers sorted incorrectly
5. ⚠️ **doc().get() broken** - Cannot find documents by criteria
6. ⚠️ **Database not cleaning up** - Memory leaks

### Edge Case Issues:
7. ⚡ **limit(0)** returns wrong type
8. ⚡ **Inconsistent types** - Sometimes object, sometimes array

---

## Recommended Fix Order

1. **URGENT** - Fix `isSubset` null handling (blocking 2 tests + crashes)
2. **URGENT** - Fix sorting null handling (blocking sorting tests + crashes)
3. **HIGH** - Fix numeric sorting (blocking 15+ tests)
4. **HIGH** - Fix `doc().get()` (blocking 10+ tests)
5. **HIGH** - Fix data persistence (blocking bulk operations)
6. **MEDIUM** - Fix `limit(0)` edge case
7. **MEDIUM** - Fix database cleanup
8. **MEDIUM** - Ensure consistent return types

---

## Next Steps

1. **Run specific test file** to debug:
   ```bash
   npm test tests/edge-cases.test.ts
   ```

2. **Fix isSubset first** (most critical):
   - Edit `src/utils/isSubset.js`
   - Add null checks
   - Re-run tests

3. **Fix sorting** (second most critical):
   - Edit `src/api/actions/get.js`
   - Add null handling
   - Add type-aware comparison
   - Re-run tests

4. **Investigate data loss**:
   - Add logging to `add()` method
   - Check for ID collisions
   - Look for race conditions

---

## Test Quality ✅

The test suite successfully identified **9 major bugs** that would affect production users:
- 2 crash bugs (null handling)
- 3 data integrity bugs (sorting, doc(), persistence)
- 4 edge case bugs (limit, cleanup, types, queries)

**All bugs are now documented and reproducible!** 🎯
