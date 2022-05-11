export function asyncAction(promise) {
  return Promise.resolve(promise)
    .then((data) => [null, data])
    .catch((error) => [error])
}

export const getParamsFromObject = (object) =>
  Object.keys(object).reduce((urlSearchParams, key) => {
    urlSearchParams.append(key, object[key])
    return urlSearchParams
  }, new URLSearchParams())
