export function removeUndefinedFromObject(obj: any) {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key]
    }
    if (obj[key] !== null && typeof obj[key] === 'object') {
      removeUndefinedFromObject(obj[key])
    }
  })
}
