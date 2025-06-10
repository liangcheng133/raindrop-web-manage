import { InitialStateType } from './types/type'
import { getObjectValue } from './utils'

type AuthMap = Record<string, any>

// 在这里按照初始化数据定义项目中的权限，统一管理
// 参考文档 https://umijs.org/docs/max/access

export default (initialState: InitialStateType) => {
  const auths = initialState.auths || {}

  /**
   * 权限校验
   * @param auth 权限key，key的每个定义分别是  模块.功能.操作（例子：sys.user.index）
   * @returns true 表示有权限，false 表示无权限
   */
  const checkPermission = (auth: string) => {
    if (!auths) return false
    return getObjectValue(auths, auth)
  }

  // 扁平化权限key
  const flatAuth = flattenAuthToDotNotation(auths)

  return {
    checkPermission,
    ...flatAuth
  }
}

/**
 * 将嵌套权限对象递归转换为扁平化的 dot-notation 键值对对象
 * @param auths 嵌套权限对象
 * @returns 扁平化后的权限对象，如 { 'sys.user.index': true }
 */
function flattenAuthToDotNotation(auths: AuthMap): Record<string, boolean> {
  const result: Record<string, boolean> = {}

  function traverse(current: AuthMap, path: string[] = []) {
    Object.keys(current).forEach((key) => {
      const value = current[key]
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, [...path, key])
      } else {
        result[[...path, key].join('.')] = true
      }
    })
  }

  traverse(auths)
  return result
}
