export default function limit(limitBy) {
  if (limitBy === undefined || limitBy === null) {
    this.userErrors.push("Limit() metodida integer(raqam) ko'rsatilmagan.")
  } else if (!Number.isInteger(limitBy)) {
    this.userErrors.push(
      "limit() metodidagi limit parametri float, boolean, string yoki objekt emas, balki butun son (masalan, 3) bo'lishi kerak."
    )
  } else {
    // Allow negative limits by treating them as 0 (return empty array)
    this.limitBy = Math.max(0, limitBy)
  }
  return this
}
