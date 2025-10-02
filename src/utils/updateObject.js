export default function updateObject(obj /*, …*/) {
  for (let i = 1; i < arguments.length; i++) {
    for (const prop in arguments[i]) {
      const val = arguments[i][prop]
      // if (typeof val == "object") // this also applies to arrays or null!
      //   updateObject(obj[prop], val);
      // else
      //    obj[prop] = val;
      obj[prop] = val
    }
  }
  return obj
}
