export function buildRoutePath(path) {
    const regex = /:([a-zA-Z]+)/g
    const params = path.replaceAll(regex, "(?<$1>[a-z0-9\-_]+)")

    const pathRegex = new RegExp(`^${params}(?<query>\\?(.*))?$`)

    return pathRegex
}