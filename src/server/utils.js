function removeTrailingSlash (site) {
  return site.replace(/\/$/, '')
}

export { removeTrailingSlash }
