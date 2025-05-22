import { LoginVOType, ResponseType, SysUserVOType } from '@/types/API'
import { request } from '@umijs/max'

/** 查询用户列表 */
export function querySysUserListAPI(data: Record<string, any>): Promise<ResponseType<null>> {
  return request<ResponseType<null>>('/sys/user/list', {
    method: 'post',
    data
  })
}

/** 新建、编辑用户信息 */
export function saveSysUserAPI(data: Record<string, any>): Promise<ResponseType<null>> {
  return request<ResponseType<null>>('/sys/user/save', {
    method: 'post',
    data
  })
}

/** 根据id查询用户信息 */
export function sysUserQueryByIdAPI(id: string): Promise<ResponseType<SysUserVOType>> {
  return request(`/sys/user/queryById/${id}`, {
    method: 'post'
  })
}

/** 删除用户信息 */
export function deleteSysUserAPI(data: Record<string, any>): Promise<ResponseType<null>> {
  return request<ResponseType<null>>('/sys/user/delete', {
    method: 'post',
    data
  })
}

/** 修改用户状态 */
export function updateSysUserStatusAPI(data: Record<string, any>): Promise<ResponseType<null>> {
  return request<ResponseType<null>>('/sys/user/updateStatus', {
    method: 'post',
    data
  })
}

/** 用户账号登录 */
export function sysUserAccountLoginAPI(data: Record<string, any>): Promise<ResponseType<LoginVOType>> {
  return request('/public/accountLogin', {
    method: 'post',
    data
  })
}

/** 获取RSA公钥 */
export function getRsaPublicKeyAPI(): Promise<ResponseType<string>> {
  return request('/public/getRSAPublicKey', {
    method: 'post'
  })
}
