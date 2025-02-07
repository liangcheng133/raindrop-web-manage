import { request } from '@umijs/max'

/** 获取所有组织列表 */
export function querySysOrgListAllApi(): Promise<API.BasicResponse<API.SystemOrg[]>> {
  return request('/sys/org/listAll', {
    method: 'post'
  })
}

/** 新建、编辑组织 */
export function saveSysOrgApi(data: any): Promise<API.SuccessResponse> {
  return request('/sys/org/save', {
    method: 'post',
    data
  })
}

/** 修改组织数据排序 */
export function saveSysOrgOrderApi(data: any): Promise<API.SuccessResponse> {
  return request('/sys/org/sort', {
    method: 'post',
    data
  })
}
