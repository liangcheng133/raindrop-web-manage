import { ResponseType, SysOrgVOType } from '@/types/API'
import { request } from '@umijs/max'

/** 获取所有组织列表 */
export function querySysOrgListAllAPI(): Promise<ResponseType<SysOrgVOType[]>> {
  return request('/sys/org/listAll', {
    method: 'post'
  })
}

/** 新建组织 */
export function addSysOrgAPI(data: any): Promise<ResponseType<null>> {
  return request('/sys/org/add', {
    method: 'post',
    data
  })
}

/** 编辑组织 */
export function updateSysOrgAPI(data: any): Promise<ResponseType<null>> {
  return request('/sys/org/update', {
    method: 'post',
    data
  })
}

/** 新建/编辑 组织 */
export function saveSysOrgAPI(data: any): Promise<ResponseType<null>> {
  return request('/sys/org/save', {
    method: 'post',
    data
  })
}

/** 修改组织数据排序 */
export function sortSysOrgOrderAPI(data: any): Promise<ResponseType<null>> {
  return request('/sys/org/sort', {
    method: 'post',
    data
  })
}

/** 删除组织 */
export function deleteSysOrgAPI(id: string): Promise<ResponseType<null>> {
  return request(`/sys/org/delete/${id}`, {
    method: 'post'
  })
}
