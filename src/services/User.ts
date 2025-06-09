import { AccountLoginDTO, AccountLoginVO, ResponseVO, SysLoginUserVO, SysUserVO } from '@/types/api'
import { request } from '@umijs/max'

/** 查询用户列表 */
export function querySysUserListAPI(data: Record<string, any>) {
  return request<ResponseVO<SysUserVO>>('/sys/user/list', {
    method: 'post',
    data
  })
}

/** 新建、编辑用户信息 */
export function saveSysUserAPI(data: Record<string, any>) {
  return request<ResponseVO<null>>('/sys/user/save', {
    method: 'post',
    data
  })
}

/** 删除用户信息 */
export function deleteSysUserAPI(data: Record<string, any>) {
  return request<ResponseVO<null>>('/sys/user/delete', {
    method: 'post',
    data
  })
}

/** 修改用户状态 */
export function updateSysUserStatusAPI(data: Record<string, any>) {
  return request<ResponseVO<null>>('/sys/user/updateStatus', {
    method: 'post',
    data
  })
}

/** 用户账号登录 */
export function sysUserAccountLoginAPI(data: AccountLoginDTO) {
  return request<ResponseVO<AccountLoginVO>>('/public/accountLogin', {
    method: 'post',
    data
  })
}

/** 获取当前登录用户信息、权限信息 */
export function getLoginUserAPI() {
  return request<ResponseVO<SysLoginUserVO>>(`/sys/user/getLoginUser`, {
    method: 'post'
  })
}

/** 获取RSA公钥 */
export function getRsaPublicKeyAPI() {
  return request<ResponseVO<string>>('/public/getRSAPublicKey', {
    method: 'post'
  })
}
