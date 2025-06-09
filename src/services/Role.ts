import { ResponseVO, SysRoleVO } from '@/types/api'
import { request } from '@umijs/max'

/** 获取所有角色列表 */
export function querySysRoleListAllAPI() {
  return request<ResponseVO<SysRoleVO[]>>('/sys/role/listAll', {
    method: 'post'
  })
}

/** 新建、编辑角色信息 */
export function saveSysRoleAPI(data: any) {
  return request<ResponseVO<null>>('/sys/role/save', {
    method: 'post',
    data
  })
}

/** 修改角色数据排序 */
export function saveSysRoleOrderAPI(data: any) {
  return request<ResponseVO<null>>('/sys/role/sort', {
    method: 'post',
    data
  })
}

/** 删除角色信息 */
export function deleteSysRoleAPI(id: string) {
  return request<ResponseVO<null>>(`/sys/role/delete/${id}`, {
    method: 'post'
  })
}
