import { request } from '@umijs/max'

/** 获取所有组织列表 */
export function querySysOrgListAllAPI(): Promise<API.Response<API.SysOrgVO[]>> {
  return request('/sys/org/listAll', {
    method: 'post'
  })
}

/** 新建组织 */
export function addSysOrgAPI(data: any): Promise<boolean> {
  return request('/sys/org/add', {
    method: 'post',
    data
  })
}

/** 编辑组织 */
export function updateSysOrgAPI(data: any): Promise<boolean> {
  return request('/sys/org/update', {
    method: 'post',
    data
  })
}

/** 新建/编辑 组织 */
export function saveSysOrgAPI(data: any): Promise<boolean> {
  return request('/sys/org/save', {
    method: 'post',
    data
  })
}

/** 修改组织数据排序 */
export function sortSysOrgOrderAPI(data: any): Promise<boolean> {
  return request('/sys/org/sort', {
    method: 'post',
    data
  })
}

/** 删除组织 */
export function deleteSysOrgAPI(id: string): Promise<boolean> {
  return request(`/sys/org/delete/${id}`, {
    method: 'post'
  })
}
