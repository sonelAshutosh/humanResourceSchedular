import { Directus } from '@directus/sdk'
const url = 'https://api.mbm.ac.in'

// ask for v13 error TypeError: _directus_sdk__WEBPACK_IMPORTED_MODULE_0__.Directus is not a constructor
export default function getDirectus(optionalHeaders = null) {
  let retObj = { auth: { mode: 'json', autoRefresh: false } }
  if (!!optionalHeaders) {
    retObj['transport'] = {
      params: optionalHeaders,
    }
  }
  //console.log(retObj);
  return new Directus(url, retObj)
}

export function getAssetURL(assetId) {
  if (!assetId) return null
  return `${url}/assets/${assetId}`
}

export function getAuthURL() {
  return `${url}/auth/`
}

export function getFilesURL() {
  return `${url}/files/`
}
