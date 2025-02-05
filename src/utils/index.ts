import { isObject } from 'es-toolkit/compat'

/**
 * 将对象拼接到URL的查询字符串中
 * @param {String} url 基础URL
 * @param {Object} params 查询参数对象，属性值为空时不拼接
 * @returns 拼接后的完整URL
 */
export function appendQueryParams(url: string, params?: { [key: string]: string | number }) {
  if (!params || !isObject(params)) {
    return url
  }

  const queryString = Object.keys(params)
    .map((key) => {
      const value = params[key]
      if (value === null || value === undefined) {
        return ''
      }
      return `${key}=${value}`
    })
    .filter(Boolean)
    .join('&')

  if (queryString) {
    return `${url}${url.includes('?') ? '&' : '?'}${queryString}`
  }

  return url
}

/** 列表转树形 */
export function listToTree<T extends { [key: string]: any }>(
  list: T[],
  idField?: string,
  parentIdField?: string,
  topId?: string,
  parentIds: string[] = []
): T[] {
  const data: T[] = []
  const pIdField = idField || 'id'
  const pParentIdField = parentIdField || 'parent_id'
  const topIdValue = topId || '0'

  list.forEach((item) => {
    const idArr = [...parentIds, item[pIdField]]
    console.log(item[pParentIdField], topIdValue)
    if (item[pParentIdField] === topIdValue) {
      data.push({
        ...item,
        key: idArr.join('-'),
        children: listToTree(list, pIdField, pParentIdField, item[pIdField], idArr)
      })
    }
  })
  return data
}
