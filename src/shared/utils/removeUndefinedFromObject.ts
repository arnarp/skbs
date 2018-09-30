export function removeUndefinedFromObject(obj: {}) {
  Object.keys(obj).forEach(
    key => (obj[key] === undefined ? delete obj[key] : ''),
  )
}
