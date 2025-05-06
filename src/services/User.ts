import { request } from '@umijs/max'

/** 查询用户列表 */
export function getSysUserListAPI(data: Record<string, any>) {
  return request<API.Response<null>>('/sys/user/list', {
    method: 'post',
    data
  })
}

/** 新建、编辑用户信息 */
export function saveSysUserAPI(data: Record<string, any>) {
  return request<API.Response<null>>('/sys/user/save', {
    method: 'post',
    data
  })
}

/** 删除用户信息 */
export function deleteSysUserAPI(data: Record<string, any>) {
  return request<API.Response<null>>('/sys/user/delete', {
    method: 'post',
    data
  })
}

/** 用户账号登录 */
export function sysUserAccountLoginAPI(data: Record<string, any>) {
  return request<API.Response<API.LoginVO>>('/public/accountLogin', {
    method: 'post',
    data
  })
}

/** 获取RSA公钥 */
export function getRsaPublicKeyAPI() {
  return request<API.Response<string>>('/public/getRSAPublicKey', {
    method: 'post'
  })
}
