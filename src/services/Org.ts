import { request } from '@umijs/max'

/** 获取所有组织列表 */
export function querySysOrgListAll() {
  return request('/sys/org/listAll', {
    method: 'post'
  })
}
