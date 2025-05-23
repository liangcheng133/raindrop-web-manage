import { useModel } from '@umijs/max'
import { isNil } from 'es-toolkit'

// 在这里按照初始化数据定义项目中的权限，统一管理
// 参考文档 https://umijs.org/docs/max/access

export default (initialState: any) => {
  console.log('[ initialState ] >', initialState)
  const auths = null;

  /**
   * 权限校验
   * @param auth 权限key，key的每个定义分别是  模块.功能.操作（例子：sys.user.index）
   * @returns true 表示有权限，false 表示无权限
   */
  const checkPermission = (auth: string) => {
    if (!auths) return true;
    const authKeys = auth.split('.')
    console.log(
      '权限校验',
      authKeys.every((key) => !isNil(auths[key]))
    )
    return authKeys.every((key) => !isNil(auths[key]))
  }

  return {
    checkPermission,
    canSeeSysUser: checkPermission('sys.user.index'),
    canSeeSysRole: checkPermission('sys.role.index'),
  }
}
