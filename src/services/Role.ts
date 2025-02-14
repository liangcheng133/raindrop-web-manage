import { request } from '@umijs/max'

/** 获取所有角色列表 */
export function querySysRoleListAllApi(): Promise<API.BasicResponse<API.SystemRole[]>> {
  return request('/sys/role/listAll', {
    method: 'post'
  })
}

/** 新建、编辑角色信息 */
export function saveSysRoleApi(data: any) {
  return request('/sys/role/save', {
    method: 'post',
    data
  })
}

/** 修改角色数据排序 */
export function saveSysRoleOrderApi(data: any): Promise<API.SuccessResponse> {
  return request('/sys/role/sort', {
    method: 'post',
    data
  })
}

/** 删除角色信息 */
export function deleteSysRoleApi(data: any) {
  return request('/sys/role/delete', {
    method: 'post',
    data
  })
}
