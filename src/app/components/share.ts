export function jsonArrayToString(array) {
  console.log(array)
  let str = ""
  for (let json of array) {
    for (let key in json) {
      str += `${key}: ${json[key]}\n`
    }
  }
  return str
}
