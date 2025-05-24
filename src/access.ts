import { InitialStateType } from './types/Type'
import { getObjectValue } from './utils'

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

  return {
    checkPermission,
    canSeeSysUser: checkPermission('sys.user.index'),
    canSeeSysRole: checkPermission('sys.role.index')
  }
}
