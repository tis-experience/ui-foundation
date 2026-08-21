function publicUrl(path: string) {
  const baseUrl = new URL(import.meta.env.BASE_URL, window.location.href)
  return new URL(path.replace(/^\/+/, ""), baseUrl).toString()
}

function registryUrl(name: string) {
  return publicUrl(`r/${name}.json`)
}

export { publicUrl, registryUrl }
