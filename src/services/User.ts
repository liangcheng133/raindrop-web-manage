import { request } from '@umijs/max'

export function getUserList() {
  return request('/api/sys/user/list')
}

/** 新建、编辑用户信息 */
export function saveUserInfoApi(data: any) {
  return request('/sys/user/save', {
    method: 'post',
    data
  })
}
