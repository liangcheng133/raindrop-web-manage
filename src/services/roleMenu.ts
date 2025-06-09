import { ResponseVO, SysRoleMenuSaveDTO } from '@/types/api'
import { request } from '@umijs/max'

/** 保存角色权限 */
export function saveRoleMenuAPI(data: SysRoleMenuSaveDTO) {
  return request<ResponseVO<null>>('/sys/roleMenu/save', {
    method: 'post',
    data
  })
}
