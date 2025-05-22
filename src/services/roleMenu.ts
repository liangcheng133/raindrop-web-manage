import { ResponseType, SysRoleMenuSaveDTOType } from '@/types/API'
import { request } from '@umijs/max'

/** 保存角色权限 */
export function saveRoleMenuAPI(data: SysRoleMenuSaveDTOType): Promise<ResponseType<Boolean>> {
  return request('/sys/roleMenu/save', {
    method: 'post',
    data
  })
}
