import { request } from '@umijs/max'

export function getUserList() {
  return request('/api/sys/user/list')
}
