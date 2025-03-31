import { request } from '@umijs/max'

/** 新建、编辑用户信息 */
export function saveSysUserApi(data: any) {
  return request('/sys/user/save', {
    method: 'post',
    data
  })
}

/** 删除用户信息 */
export function deleteSysUserApi(data: any) {
  return request('/sys/user/delete', {
    method: 'post',
    data
  })
}

/** 用户账号登录 */
export function sysUserAccountLoginApi(data: any) {
  return request('/sys/user/accountLogin', {
    method: 'post',
    data
  })
}

/** 获取RSA公钥 */
export function getRsaPublicKey() {
  return request('/sys/rsa/getRSAPublicKey', {
    method: 'post'
  })
}
