import { Response, SysRoleVO } from '@/types/api'
import { request } from '@umijs/max'

/** 获取所有角色列表 */
export function querySysRoleListAllAPI(): Promise<Response<SysRoleVO[]>> {
  return request('/sys/role/listAll', {
    method: 'post'
  })
}

/** 新建、编辑角色信息 */
export function saveSysRoleAPI(data: any): Promise<Response<null>> {
  return request('/sys/role/save', {
    method: 'post',
    data
  })
}

/** 修改角色数据排序 */
export function saveSysRoleOrderAPI(data: any): Promise<Response<null>> {
  return request('/sys/role/sort', {
    method: 'post',
    data
  })
}

/** 删除角色信息 */
export function deleteSysRoleAPI(data: any): Promise<Response<null>> {
  return request('/sys/role/delete', {
    method: 'post',
    data
  })
}
