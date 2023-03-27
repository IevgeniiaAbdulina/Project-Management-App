// load any value from local storage by key
export function loadFromLocalStorage(key: string): any| null {
  const data = localStorage.getItem(key)
  if(data != null) {
    return JSON.parse(data)
  }
    return null
}
// store value to local storage by key
export function storeToLocalStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}
