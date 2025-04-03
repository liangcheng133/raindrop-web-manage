import { request } from '@umijs/max'

/** 新建、编辑用户信息 */
export function saveSysUserApi(data: Record<string, any>) {
  return request<API.Response<null>>('/sys/user/save', {
    method: 'post',
    data
  })
}

/** 删除用户信息 */
export function deleteSysUserApi(data: Record<string, any>) {
  return request<API.Response<null>>('/sys/user/delete', {
    method: 'post',
    data
  })
}

/** 用户账号登录 */
export function sysUserAccountLoginApi(data: Record<string, any>) {
  return request<API.Response<API.LoginResponse>>('/public/accountLogin', {
    method: 'post',
    data
  })
}

/** 获取RSA公钥 */
export function getRsaPublicKey() {
  return request<API.Response<string>>('/public/getRSAPublicKey', {
    method: 'post'
  })
}
