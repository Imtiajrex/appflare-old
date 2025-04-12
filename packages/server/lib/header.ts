export const getHeaders = (headers: Headers) => {
  const newHeaders = Object.fromEntries(headers as any)
  const headerObject: Record<string, any> = {}
  for (const key in newHeaders) {
    const isAuthorization =
      key.toLowerCase() === 'authorization' && newHeaders[key]?.Length > 7
    if (isAuthorization) {
      if (key !== 'cookie') {
        headerObject[key] = newHeaders[key]
      }
    } else {
      if (key !== 'authorization') {
        headerObject[key] = newHeaders[key]
      }
    }
  }

  return headerObject as any as Headers
}
