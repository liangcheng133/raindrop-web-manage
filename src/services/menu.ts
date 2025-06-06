import { ResponseType, SysMenuVOType } from '@/types/api'
import { request } from '@umijs/max'

/** 获取所有菜单 */
export function querySysMenuListAllAPI(data: any): Promise<ResponseType<SysMenuVOType[]>> {
  return request('/sys/menu/listAll', {
    method: 'post',
    data
  })
}
