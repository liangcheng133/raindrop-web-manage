import { request } from '@umijs/max'

/** 新建、编辑用户信息 */
export function saveUserInfoApi(data: any) {
  return request('/sys/user/save', {
    method: 'post',
    data
  })
}

/** 删除用户信息 */
export function deleteUserApi(data: any) {
  return request('/sys/user/delete', {
    method: 'post',
    data
  })
}
