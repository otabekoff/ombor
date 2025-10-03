export default function isSubset(superObj, subObj) {
  // Handle null/undefined cases
  if (subObj === null || subObj === undefined) {
    return superObj === subObj
  }
  if (superObj === null || superObj === undefined) {
    return false
  }

  return Object.keys(subObj).every(ele => {
    if (typeof subObj[ele] == 'object' && subObj[ele] !== null) {
      return isSubset(superObj[ele], subObj[ele])
    }
    return subObj[ele] === superObj[ele]
  })
}
