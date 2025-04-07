import { request } from '@umijs/max'

/** 获取所有组织列表 */
export function querySysOrgListAllApi(): Promise<API.Response<API.SysOrgVO[]>> {
  return request('/sys/org/listAll', {
    method: 'post'
  })
}

/** 新建、编辑组织 */
export function saveSysOrgApi(data: any): Promise<boolean> {
  return request('/sys/org/save', {
    method: 'post',
    data
  })
}

/** 修改组织数据排序 */
export function saveSysOrgOrderApi(data: any): Promise<boolean> {
  return request('/sys/org/sort', {
    method: 'post',
    data
  })
}

/** 删除组织 */
export function deleteSysOrgApi(data: any): Promise<boolean> {
  return request('/sys/org/remove', {
    method: 'post',
    data
  })
}