import { request } from '@umijs/max'

/** 获取所有组织列表 */
export function querySysOrgListAll() {
  return request('/sys/org/listAll', {
    method: 'post'
  })
}

/** 新建、编辑组织 */
export function saveSysOrg(data: any) {
  return request('/sys/org/save', {
    method: 'post',
    data
  })
}
