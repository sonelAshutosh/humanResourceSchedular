import getDirectus, { getAssetURL, getFilesURL } from './api.config.js'
import useAPIAuth from './useAPIAuth'

export default function useAPIData() {
  const { getAuthHeader, getAuthURLParam } = useAPIAuth()

  //Always an authorized request to get current logged in user details
  async function getUserDetails() {
    const authHeader = getAuthHeader()
    if (!!authHeader) {
      const directus = getDirectus(authHeader)
      return await directus.users.me.read()
    }
  }

  const getFileUploadURL = () => {
    return getFilesURL() + '?' + getAuthURLParam()
  }

  const getFileUploadParams = (
    title,
    filename_disk,
    filename_download,
    folder
  ) => {
    return {
      title: title,
      filename_disk: filename_disk,
      filename_download: filename_download,
      folder: folder,
    }
  }

  const getFileURL = (fileID) => {
    return getAssetURL(fileID)
  }

  //Create and update queries are authorized by default unless opted otherwise
  async function createItem(
    collectionName,
    payload,
    authorized = true,
    staticAccessToken = null
  ) {
    const authHeader = getAuthHeader(staticAccessToken)
    //console.log("Auth",authHeader);
    if (!!authorized && !!authHeader) {
      const directus = getDirectus(authHeader)
      const collection = directus.items(collectionName)
      return await collection.createOne(payload)
    } else {
      const directus = getDirectus()
      const collection = directus.items(collectionName)
      return await collection.createOne(payload)
    }
  }

  async function updateItem(
    collectionName,
    id,
    payload,
    authorized = true,
    staticAccessToken = null
  ) {
    const authHeader = getAuthHeader(staticAccessToken)
    if (!!authorized && !!authHeader) {
      const directus = getDirectus(authHeader)
      const collection = directus.items(collectionName)
      return await collection.updateOne(id, payload)
    } else {
      const directus = getDirectus()
      const collection = directus.items(collectionName)
      return await collection.updateOne(id, payload)
    }
  }

  //fieldParam should be an array containing strings of field names to be retrived.
  //limitParam should be an integer denoting number of rows to fetch. Default = 100.
  //filterParam should be an object declared using DirectUs operators. Check https://docs.directus.io/reference/filter-rules.html for all operators and dynamic variables available.
  //Refer https://docs.directus.io/reference/query.html for exact parameter structure.
  async function getItems(
    collectionName,
    fieldParam,
    limitParam,
    pageParam,
    filterParam,
    sortParam,
    searchParam,
    authorized = false
  ) {
    const queryObj = {
      ...(filterParam !== undefined ? { filter: filterParam } : {}),
      ...(limitParam !== undefined ? { limit: limitParam } : {}),
      ...(pageParam !== undefined ? { page: pageParam } : {}),
      ...(sortParam !== undefined ? { sort: sortParam } : {}),
      ...(fieldParam !== undefined ? { fields: fieldParam } : {}),
      ...(searchParam !== undefined ? { search: searchParam } : {}),
    }

    const authHeader = getAuthHeader()
    // console.log(queryObj, authHeader)
    // console.log(authHeader)
    if (!!authorized && !!authHeader) {
      const directus = getDirectus(authHeader)
      const collection = directus.items(collectionName)
      return await collection.readByQuery(queryObj)
    } else {
      const directus = getDirectus()
      const collection = directus.items(collectionName)
      return await collection.readByQuery(queryObj)
    }
  }

  //itemID can be a valid integer id or an array of IDs
  async function getItem(
    collectionName,
    itemID,
    fieldParam,
    authorized = false
  ) {
    const queryObj = {
      ...(fieldParam !== undefined ? { fields: fieldParam } : {}),
    }
    const authHeader = getAuthHeader()
    let directus
    if (!!authorized && !!authHeader) directus = getDirectus(authHeader)
    else directus = getDirectus()
    if (directus) {
      const collection = directus.items(collectionName)
      if (Array.isArray(itemID)) {
        let pArray = []
        itemID.forEach((item) => {
          pArray.push(collection.readOne(item, queryObj))
        })
        return await Promise.all(pArray)
      } else return await collection.readOne(itemID, queryObj)
    }
  }
  async function deleteItem(
    collectionName,
    itemID,
    fieldParam,
    authorized = false
  ) {
    const queryObj = {
      ...(fieldParam !== undefined ? { fields: fieldParam } : {}),
    }
    const authHeader = getAuthHeader()
    let directus
    if (!!authorized && !!authHeader) directus = getDirectus(authHeader)
    else directus = getDirectus()
    if (directus) {
      const collection = directus.items(collectionName)
      if (Array.isArray(itemID)) {
        let pArray = []
        itemID.forEach((item) => {
          pArray.push(collection.readOne(item, queryObj))
        })
        return await Promise.all(pArray)
      } else return await collection.deleteOne(itemID, queryObj)
    }
  }

  return {
    createItem: createItem,
    getItems: getItems,
    getItem: getItem,
    deleteItem: deleteItem,
    updateItem: updateItem,
    getFileUploadURL: getFileUploadURL,
    getFileUploadParams: getFileUploadParams,
    getFileURL: getFileURL,
  }
}
